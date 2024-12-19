import AWS from 'aws-sdk';
import fetch from 'node-fetch';

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'ap-south-1' });
const userInfoUrl = 'https://ap-south-16fmyuvsz0.auth.ap-south-1.amazoncognito.com/oauth2/userInfo';

export const handler = async (event) => {
  const { accessToken, eventIndex, eventName, eventDate, category, subCategory } = JSON.parse(event.body);

  // Define common headers
  const commonHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Input validation
  if (!accessToken) {
    return {
      statusCode: 400,
      headers: commonHeaders,
      body: JSON.stringify({ message: "Access token is required" }),
    };
  } else if (eventIndex === undefined) {
    return {
      statusCode: 400,
      headers: commonHeaders,
      body: JSON.stringify({ message: "Event index is required" }),
    };
  } else if (!eventName) {
    return {
      statusCode: 400,
      headers: commonHeaders,
      body: JSON.stringify({ message: "Event Name is required" }),
    };
  } else if (!eventDate) {
    return {
      statusCode: 400,
      headers: commonHeaders,
      body: JSON.stringify({ message: "Event Date is required" }),
    };
  } else if (!category) {
    return {
      statusCode: 400,
      headers: commonHeaders,
      body: JSON.stringify({ message: "Category is required" }),
    };
  } else if (!subCategory) {
    return {
      statusCode: 400,
      headers: commonHeaders,
      body: JSON.stringify({ message: "Subcategory is required" }),
    };
  }

  // Verify and extract email from access token
  let email;
  try {
    const response = await fetch(userInfoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
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
        body: JSON.stringify({ message: "Failed to fetch user info" }),
      };
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return {
      statusCode: 500,
      headers: commonHeaders,
      body: JSON.stringify({ message: "Error fetching user info" }),
    };
  }

  // Update the existing event in the DynamoDB table
  try {
    // Fetch the current user's events to ensure the index is valid
    const getParams = {
      TableName: 'Users', // Replace with your DynamoDB table name
      Key: { email },
    };

    const userData = await dynamoDB.get(getParams).promise();
    const events = userData.Item?.events || [];

    // Check if the event index is valid
    if (eventIndex < 0 || eventIndex >= events.length) {
      return {
        statusCode: 400,
        headers: commonHeaders,
        body: JSON.stringify({ message: "Invalid event index" }),
      };
    }

    // Update the specific event at the given index
    events[eventIndex] = { eventName, eventDate, category, subCategory };

    // Define the update parameters for DynamoDB
    const updateParams = {
      TableName: 'Users',
      Key: { email },
      UpdateExpression: "SET events = :events",
      ExpressionAttributeValues: {
        ":events": events,
      },
      ReturnValues: "ALL_NEW",
    };

    // Update the user in DynamoDB
    const result = await dynamoDB.update(updateParams).promise();

    return {
      statusCode: 200,
      headers: commonHeaders,
      body: JSON.stringify({
        message: 'Event updated successfully',
        user: result.Attributes,
      }),
    };
  } catch (error) {
    console.error('Error updating event:', error);
    return {
      statusCode: 500,
      headers: commonHeaders,
      body: JSON.stringify({
        message: 'Error updating event',
        error: error.message,
      }),
    };
  }
};
