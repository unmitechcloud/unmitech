import fetch from 'node-fetch';
import AWS from 'aws-sdk';

// AWS Configuration for DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'ap-south-1' });
const userInfoUrl = 'https://ap-south-16fmyuvsz0.auth.ap-south-1.amazoncognito.com/oauth2/userInfo';

// Define reusable headers for the response
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler = async (event) => {
  console.log("Received event:", event);

  // Parse the event body
  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch (parseError) {
    console.error("Error parsing event body:", parseError);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Invalid JSON format" }),
    };
  }

  const { accessToken, eventIndex } = body;

  // Validate the access token and event index
  if (!accessToken) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Access token is required" }),
    };
  }

  if (eventIndex === undefined || eventIndex < 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "A valid event index is required" }),
    };
  }

  // Verify and extract the email from the access token
  let email;
  try {
    const response = await fetch(userInfoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch user info:", errorData);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: "Failed to fetch user info" }),
      };
    }

    const data = await response.json();
    email = data.email;

  } catch (error) {
    console.error("Error fetching user info:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error fetching user info" }),
    };
  }

  try {
    // Fetch the user's data from DynamoDB
    const getUserParams = {
      TableName: 'Users', // Ensure this matches your DynamoDB table name
      Key: { email },
    };

    const user = await dynamoDB.get(getUserParams).promise();

    // Check if events exist and the eventIndex is valid
    const events = user.Item?.events || [];
    if (eventIndex >= events.length) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Event index is out of range" }),
      };
    }

    // Remove the event at the specified index
    events.splice(eventIndex, 1);

    // Update the events in DynamoDB
    const updateParams = {
      TableName: 'Users', // Ensure this matches your DynamoDB table name
      Key: { email },
      UpdateExpression: "SET events = :events",
      ExpressionAttributeValues: {
        ":events": events,
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDB.update(updateParams).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Event deleted successfully',
        user: result.Attributes,
      }),
    };
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error deleting event',
        error: error.message,
      }),
    };
  }
};
