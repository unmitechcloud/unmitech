import fetch from 'node-fetch';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid'; 

// Configure AWS SDK
AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const dynamoDBAdmin = new AWS.DynamoDB(); // For table management
const userInfoUrl = 'https://ap-south-16fmyuvsz0.auth.ap-south-1.amazoncognito.com/oauth2/userInfo' ;
const tableName = 'Users';

// Function to check if table exists and create if not
async function checkOrCreateTable() {
  try {
    const existingTables = await dynamoDBAdmin.listTables().promise();
    if (!existingTables.TableNames.includes(tableName)) {
      console.log(`Table ${tableName} does not exist. Creating...`);
      const tableParams = {
        TableName: tableName,
        KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      };
      await dynamoDBAdmin.createTable(tableParams).promise();
      console.log(`Table ${tableName} created successfully.`);
    } else {
      console.log(`Table ${tableName} already exists.`);
    }
  } catch (error) {
    console.error("Error checking or creating table:", error);
    throw new Error("Failed to ensure table exists.");
  }
}

export const handler = async (event) => {
  console.log("Received event:", event);

  // Check and create the table if necessary
  try {
    await checkOrCreateTable();
  } catch (error) {
    return generateResponse(500, "Error ensuring DynamoDB table exists.");
  }

  // Parse the event body
  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch (parseError) {
    console.error("Error parsing event body:", parseError);
    return generateResponse(400, "Invalid JSON");
  }

  const { accessToken, firstName, lastName, birthDate, joiningDate, gender, photo } = body;

  // Validate input fields
  if (!accessToken || !firstName || !lastName || !birthDate || !joiningDate || !gender) {
    return generateResponse(400, "All fields are required");
  }

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
      return generateResponse(401, "Failed to fetch user info");
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return generateResponse(500, "Error fetching user info");
  }

  // Check if user already exists in DynamoDB
  try {
    const existingUser = await dynamoDB.get({ TableName: tableName, Key: { email } }).promise();
    if (existingUser.Item) {
      return generateResponse(409, "Email already exists");
    }
  } catch (error) {
    console.error("Error checking existing user:", error);
    return generateResponse(500, "Error checking existing user");
  }

  // Upload the photo to S3 if provided
  let photoUrl = null;
  if (photo) {
    try {
      const buffer = Buffer.from(photo, 'base64'); // Convert base64 to buffer
      const s3Params = {
        Bucket: 'assets.folex.com',
        Key: `images/${email}.jpg`, // Unique key for the image
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      };

      const uploadResult = await s3.upload(s3Params).promise();
      photoUrl = uploadResult.Location; // Get the S3 URL
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      return generateResponse(500, "Error uploading image to S3");
    }
  }

  const userId = uuidv4();

  // Insert user data into DynamoDB, including subscribeStatus
  const userParams = {
    TableName: tableName,
    Item: {
      email,
      id: userId,
      firstName,
      lastName,
      birthDate,
      joiningDate,
      gender,
      photoUrl, // Save the S3 URL in the database
      subscribeStatus: true, // Adding subscribeStatus field
    },
  };

  try {
    await dynamoDB.put(userParams).promise();
    console.log("Data inserted:", email);
    return generateResponse(200, "Data saved successfully");
  } catch (error) {
    console.error("Error saving data to DynamoDB:", error);
    return generateResponse(500, "Error saving data to DynamoDB");
  }
};

// Utility function to generate consistent response
function generateResponse(statusCode, message) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body: JSON.stringify({ message }),
  };
}
