import fetch from 'node-fetch';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid'; // Import UUID

// AWS Configuration for DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'ap-south-1' });
const userInfoUrl = 'https://ap-south-16fmyuvsz0.auth.ap-south-1.amazoncognito.com/oauth2/userInfo';

// Common headers
const commonHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler = async (event) => {
  console.log("Received event:", event);

  let body;
  try {
    // Parse the event body
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch (parseError) {
    console.error("Error parsing event body:", parseError);
    return {
      statusCode: 400,
      headers: commonHeaders,
      body: JSON.stringify({ message: "Invalid JSON" }),
    };
  }

  const { 
    accessToken, 
    eventName, 
    message,
    eventDate, 
    category, 
    subCategory, 
    recurrenceType, 
    recurrenceDetail, 
    recurrenceMonthlyDay, 
    recurrenceYearlyMonth, 
    recurrenceYearlyDay, 
    recurrenceWeeklyDays 
  } = body;

  if (!accessToken) {
    return {
      statusCode: 400,
      headers: commonHeaders,
      body: JSON.stringify({ message: "Access token is required" })
    };
  } else if (!eventName) {
    return {
      statusCode: 400,
      headers: commonHeaders,
      body: JSON.stringify({ message: "Event Name is required" })
    };
  } else if (!category) {
    return {
      statusCode: 400,
      headers: commonHeaders,
      body: JSON.stringify({ message: "Category is required" })
    };
  }

  // Verify and extract email from access token
  let email;
  try {
    const response = await fetch(userInfoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      email = data.email;
    } else {
      const errorData = await response.json();
      console.error("Failed to fetch user info:", errorData);
      return {
        statusCode: 401,
        headers: commonHeaders,
        body: JSON.stringify({ message: "Failed to fetch user info" })
      };
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return {
      statusCode: 500,
      headers: commonHeaders,
      body: JSON.stringify({ message: "Error fetching user info" })
    };
  }

  try {
    // Generate unique ID for the event
    const eventId = uuidv4();

    // Prepare the event object
    let recurrenceWeeklyDay = recurrenceWeeklyDays.toString();
    const newEvent = {
      id: eventId,  // Unique ID for the event
      eventName, 
      message,
      eventDate, 
      category, 
      subCategory, 
      recurrenceType, 
      recurrenceDetail, 
      recurrenceMonthlyDay, 
      recurrenceYearlyMonth, 
      recurrenceYearlyDay, 
      recurrenceWeeklyDay
    };

    // Define the update parameters for DynamoDB
    const params = {
      TableName: 'Users', // Replace with your DynamoDB table name
      Key: { email },
      UpdateExpression: "SET events = list_append(if_not_exists(events, :empty_list), :event)",
      ExpressionAttributeValues: {
        ":event": [newEvent],
        ":empty_list": [],
      },
      ReturnValues: "ALL_NEW",
    };

    // Update the user in DynamoDB
    const result = await dynamoDB.update(params).promise();

    return {
      statusCode: 200,
      headers: commonHeaders,
      body: JSON.stringify({
        message: 'User updated successfully',
        // user: result.Attributes,
        id:eventId,
      })
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      statusCode: 500,
      headers: commonHeaders,
      body: JSON.stringify({
        message: 'Error updating user',
        error: error.message,
      })
    };
  }
};
