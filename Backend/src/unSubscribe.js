import AWS from 'aws-sdk';

// AWS Configuration for DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'ap-south-1' });
const commonHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Lambda handler
export const handler = async (event) => {
  console.log("Received event:", event);

  // Get the userId from the URL parameters
  const userId = event.pathParameters.token; // Assuming token is the user ID

  if (!userId) {
    return {
      statusCode: 400,
      headers: commonHeaders,
      body: JSON.stringify({ message: "User ID is required" }),
    };
  }

  try {
    // Step 1: Scan the table to find the user by id
    const scanParams = {
      TableName: 'Users', // Replace with your DynamoDB table name
      FilterExpression: 'id = :userId', // Filter to find the user by id
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };

    const scanResult = await dynamoDB.scan(scanParams).promise();

    if (scanResult.Items.length === 0) {
      return {
        statusCode: 404,
        headers: commonHeaders,
        body: JSON.stringify({ message: 'User not found with the given id' }),
      };
    }

    const user = scanResult.Items[0]; // Get the first match
    const userEmail = user.email; // Get the user's email
    const currentSubscribeStatus = user.subscribeStatus; // Get current subscribe status

    // Step 2: Toggle the subscribeStatus
    const newSubscribeStatus = !currentSubscribeStatus; // Toggle status

    const updateParams = {
      TableName: 'Users', // Replace with your DynamoDB table name
      Key: {
        email: userEmail, // Primary key (partition key)
      },
      UpdateExpression: 'SET subscribeStatus = :newStatus', // Update expression
      ExpressionAttributeValues: {
        ':newStatus': newSubscribeStatus, // Set new subscribeStatus
      },
      ReturnValues: 'ALL_NEW', // Return the updated user details
    };

    // Update the user in DynamoDB
    const updateResult = await dynamoDB.update(updateParams).promise();

    return {
      statusCode: 200,
      headers: commonHeaders,
      body: JSON.stringify({
        message: 'Subscription status updated successfully',
        subscribeStatus: updateResult.Attributes.subscribeStatus,
        user: updateResult.Attributes,
      }),
    };
  } catch (error) {
    console.error('Error updating user subscription status:', error);
    return {
      statusCode: 500,
      headers: commonHeaders,
      body: JSON.stringify({
        message: 'Error updating user subscription status',
        error: error.message,
      }),
    };
  }
};
