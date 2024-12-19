import AWS from 'aws-sdk';

const s3 = new AWS.S3();
const BUCKET_NAME = 'folex.attachent.com';
const REGION = 'ap-south-1';

const commonHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler = async (event) => {
  try {
    const { filename, filetype } = JSON.parse(event.body);
    console.log(filename,filetype);

    if (!filename || !filetype) {
      return {
        statusCode: 400,
        headers: commonHeaders,
        body: JSON.stringify({ message: 'Filename and filetype are required.' }),
      };
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Expires: 300, // 5 minutes
      ContentType: filetype,
      // ACL: 'public-read', // Optional: Change to 'private' if needed
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);

    return {
      statusCode: 200,
      headers: commonHeaders,
      body: JSON.stringify({ uploadURL }),
    };
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);

    return {
      statusCode: 500,
      headers: commonHeaders,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
