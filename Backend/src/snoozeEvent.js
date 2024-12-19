import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken'; // Install using: npm install jsonwebtoken

// AWS Configuration for DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'ap-south-1' });

// Define reusable headers for the response
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Lambda Handler for Snoozing Event
export const handler = async (event) => {
  console.log("Received event:", event);

  // Extract the token from query parameters
  const token = event.queryStringParameters?.token;

  if (!token) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "JWT token is required as a query parameter" }),
    };
  }

  // Decode the JWT to extract email and event ID
  let email, eventId;
  try {
    const decoded = jwt.decode(token);
    email = decoded.email;   // Extract email from JWT
    eventId = decoded.id;     // Extract event ID from JWT


    console.log(email , " ", eventId);

    if (!email || !eventId) {
      throw new Error("JWT missing required fields");
    }
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Invalid JWT token" }),
    };
  }

  try {
    // Fetch the user's data from DynamoDB
    const getUserParams = {
      TableName: 'Users', // Ensure this matches your DynamoDB table name
      Key: { email },
    };

    const user = await dynamoDB.get(getUserParams).promise();

    // Check if events exist
    const events = user.Item?.events || [];


    console.log(events);
    
    // Find the event with the given ID
    const eventIndex = events.findIndex(event => event.id == eventId);
    
    if (eventIndex === -1) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Event ID not found" }),
      };
    }

    // Remove the event at the found index
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
        message: 'Event snoozed (deleted) successfully',
        user: result.Attributes,
      }),
    };
  } catch (error) {
    console.error('Error snoozing event:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error snoozing event',
        error: error.message,
      }),
    };
  }
};
