// const AWS = require('aws-sdk');
// const fs = require('fs'); // For file operations
// const ses = new AWS.SES({ region: 'ap-south-1' });

// // Function to load and replace placeholders in the template
// function loadTemplate(filePath, replacements) {
//   let template = fs.readFileSync(filePath, 'utf-8');
//   for (const key in replacements) {
//     const regex = new RegExp(`{{${key}}}`, 'g'); // Placeholder regex
//     template = template.replace(regex, replacements[key]); // Replace placeholders
//   }
//   return template;
// }

// module.exports = async (toAddress, templateData, id, daysLeft) => {
//   try {
//     const unsubscribeLink = `https://dn9ynng7833dp.cloudfront.net/unsubscribe?token=${id}`;

//     const {
//       userName,
//       category,
//       subCategory,
//       eventDate,
//       eventName,
//       message,
//       eventId,
//       eventDescription,
//       token,
//       event // Make sure event has the property id
//     } = templateData;

//     console.log(token);
//     const link=`https://d23zwmeaq03op.cloudfront.net/${eventId}`;
//     console.log("link: ",link)

//     // Create replacements object with dynamic content
//     const replacements = {
//       category,
//       userName,
//       message,
//       subCategory,
//       eventDate,
//       eventName: eventDescription,
//       unsubscribeLink,
//       token,
//       daysLeftMessage: `${daysLeft} days left for ${eventName}!`, // Reminder message
//       link , // Adding the link attribute
//     };

//     let htmlContent;

//     console.log(category, " ", subCategory, " ", eventDate);

//     // Load appropriate template based on category and subcategory
//     if (category === "Celebration") {
//       htmlContent =
//         subCategory === "Birthday"
//           ? loadTemplate('./templates/birthday/template1.html', replacements)
//           : loadTemplate('./templates/aniversary/template1.html', replacements);
//     } else if (category === "Notification") {
//       htmlContent =
//         subCategory === "Bill Payment"
//           ? loadTemplate('./templates/billPayment/template2.html', replacements)
//           : loadTemplate('./templates/deadline/template1.html', replacements);
//     } else {
//       htmlContent = loadTemplate('./templates/festival/template1.html', replacements);
//     }

//     const subject = `Reminder: ${category} - ${subCategory}`;

//     // Define plain text message
//     const plainTextMessage = `${daysLeft} days left for ${eventName}!`;

//     const params = {
//       Source: 'bhushan.chavan21@vit.edu', // Verified sender email
//       Destination: {
//         ToAddresses: [toAddress], // Recipient email
//       },
//       Message: {
//         Subject: { Data: subject },
//         Body: {
//           Text: { Data: plainTextMessage }, // Plain text part
//           Html: { Data: htmlContent }, // HTML part
//         },
//       },
//     };

//     // Send the email using AWS SES
//     await ses.sendEmail(params).promise();
//     console.log('Reminder email sent successfully');
//   } catch (error) {
//     console.error('Error sending reminder email:', error);
//     throw error;
//   }
// };



const fs = require('fs'); // For file operations
const { EmailClient } = require("@azure/communication-email");

// Ensure the environment variable is defined and valid
const connectionString = "endpoint=https://unmitechcloudemail.unitedstates.communication.azure.com/;accesskey=4Zx8zCaXmsd4sYCdG4yVQh42rx37EuwSLZuK7vacS5gP3SRJmlgGJQQJ99ALACULyCpU0DABAAAAAZCSv2sR"

if (!connectionString) {
  throw new Error("AZURE_EMAIL_CONNECTION_STRING is not defined or invalid.");
}

const emailClient = new EmailClient(connectionString);

// Function to load and replace placeholders in the template
function loadTemplate(filePath, replacements) {
  let template = fs.readFileSync(filePath, 'utf-8');
  for (const key in replacements) {
    const regex = new RegExp(`{{${key}}}`, 'g'); // Placeholder regex
    template = template.replace(regex, replacements[key]); // Replace placeholders
  }
  return template;
}

module.exports = async (toAddress, templateData, id, daysLeft) => {
  try {
    const unsubscribeLink = `https://dn9ynng7833dp.cloudfront.net/unsubscribe?token=${id}`;

    const {
      userName,
      category,
      subCategory,
      eventDate,
      eventName,
      message,
      eventId,
      eventDescription,
      token,
    } = templateData;

    console.log("Token:", token);
    const link = `https://d23zwmeaq03op.cloudfront.net/${eventId}`;
    console.log("Link: ", link);

    // Create replacements object with dynamic content
    const replacements = {
      category,
      userName,
      message,
      subCategory,
      eventDate,
      eventName: eventDescription,
      unsubscribeLink,
      token,
      daysLeftMessage: `${daysLeft} days left for ${eventName}!`,
      link,
    };

    let htmlContent;

    console.log(category, subCategory, eventDate);

    // Load appropriate template based on category and subcategory
    if (category === "Celebration") {
      htmlContent =
        subCategory === "Birthday"
          ? loadTemplate('./templates/birthday/template1.html', replacements)
          : loadTemplate('./templates/aniversary/template1.html', replacements);
    } else if (category === "Notification") {
      htmlContent =
        subCategory === "Bill Payment"
          ? loadTemplate('./templates/billPayment/template2.html', replacements)
          : loadTemplate('./templates/deadline/template1.html', replacements);
    } else {
      htmlContent = loadTemplate('./templates/festival/template1.html', replacements);
    }

    const subject = `Reminder: ${category} - ${subCategory}`;

    // Define the email message
    const msg = {
      senderAddress: "DoNotReply@unmitech.com",
      content: {
        subject,
        html: htmlContent,
        plainText: `${daysLeft} days left for ${eventName}!`, // Fallback plain text
      },
      recipients: {
        to: [
          {
            address: toAddress,
            displayName: "Customer Name",
          },
        ],
      },
    };

    // Send the email using Azure Communication Services EmailClient
    const poller = await emailClient.beginSend(msg);
    const response = await poller.pollUntilDone();
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending reminder email:", error);
    throw error;
  }
};
