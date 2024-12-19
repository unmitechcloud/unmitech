import fetch from 'node-fetch';
import AWS from 'aws-sdk';

// AWS Configuration for DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'ap-south-1' });
const userInfoUrl = 'https://ap-south-16fmyuvsz0.auth.ap-south-1.amazoncognito.com/oauth2/userInfo';

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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: "Invalid JSON" }),
    };
  }

  const { accessToken } = body;

  if (!accessToken) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: "Access token is required" })
    };
  }

  let email;
  try {
    // Fetch user info using the access token
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
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ message: "Failed to fetch user info" })
      };
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: "Error fetching user info" })
    };
  }

  try {
    // Define the query parameters for DynamoDB
    const params = {
      TableName: 'Users', // Replace with your DynamoDB table name
      Key: { email }
    };

    // Get the user from DynamoDB
    const result = await dynamoDB.get(params).promise();

    // Check if the user exists
    const user = result.Item;

    if (!user) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ message: "User not found" })
      };
    }

    // Extract necessary fields: subscribeStatus and id
    const { subscribeStatus, id } = user;

    // Check if subscribeStatus is false
    if (subscribeStatus === false) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ 
          message: "Subscription is inactive", 
          subscribeStatus: false, 
          id 
        })
      };
    }

    // If the user exists and subscribeStatus is not false, return subscription info and id
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        message: "Subscription is active", 
        subscribeStatus: true, 
        id 
      })
    };
  } catch (error) {
    console.error('Error querying DynamoDB:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Error querying DynamoDB', error: error.message })
    };
  }
};
