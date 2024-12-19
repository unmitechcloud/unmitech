// const AWS = require('aws-sdk');
// const fs = require('fs'); // Make sure fs is imported for file operations
// const ses = new AWS.SES({ region: 'ap-south-1' });

// // Function to dynamically replace placeholders in the template
// function loadTemplate(filePath, replacements) {
//   let template = fs.readFileSync(filePath, 'utf-8'); // Read HTML content
//   for (const key in replacements) {
//     const regex = new RegExp(`{{${key}}}`, 'g'); // Placeholder regex
//     template = template.replace(regex, replacements[key]); // Replace with values
//   }
//   return template;
// }

// module.exports = async (toAddress, templateData, id) => {
//   try {
//     const unsubscribeLink = `https://dn9ynng7833dp.cloudfront.net/unsubscribe?token=${id}`;
//     console.log(templateData);

//     const { userName, category, subCategory, eventDate, message,eventId, eventName, eventDescription, event } = templateData;
//     const link=`https://d23zwmeaq03op.cloudfront.net//${eventId}`;
//     console.log("link: ",link);

//     // Create the replacements object with dynamic content
//     const replacements = {
//       category,
//       userName,
//       subCategory,
//       eventDate,
//       eventName: eventDescription,
//       message,
//       unsubscribeLink, // Optional: Include unsubscribe link
//       link, // Adding the link attribute
//     };

//     let htmlContent;

//     console.log(category, " ", subCategory, " ", eventDate , " ",message);

//     // Load the appropriate template based on category and subcategory
//     if (category == "Celebration") {
//       htmlContent = subCategory == "Birthday"
//         ? loadTemplate('./templates/birthday/template1.html', replacements)
//         : loadTemplate('./templates/aniversary/template1.html', replacements);
//     } else if (category == "Notification") {
//       htmlContent = subCategory == "Bill Payment"
//         ? loadTemplate('./templates/billPayment/template2.html', replacements)
//         : loadTemplate('./templates/deadline/template1.html', replacements);
//     } else {
//       htmlContent = loadTemplate('./templates/festival/template1.html', replacements);
//     }

//     const subject = `${category}: ${subCategory}`; // Customize the subject dynamically

//     const params = {
//       Source: 'bhushan.chavan21@vit.edu', // Replace with verified sender email
//       Destination: {
//         ToAddresses: [toAddress], // Recipient's email
//       },
//       Message: {
//         Subject: { Data: subject },
//         Body: { Html: { Data: htmlContent } },
//       },
//     };

//     // Send the email using AWS SES
//     await ses.sendEmail(params).promise();
//     console.log('Email sent successfully');
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };


const fs = require('fs'); // For file operations
const { EmailClient } = require("@azure/communication-email");

// Ensure that the environment variable is set
const connectionString = "endpoint=https://unmitechcloudemail.unitedstates.communication.azure.com/;accesskey=4Zx8zCaXmsd4sYCdG4yVQh42rx37EuwSLZuK7vacS5gP3SRJmlgGJQQJ99ALACULyCpU0DABAAAAAZCSv2sR";

if (!connectionString) {
  console.error("Error: AZURE_EMAIL_CONNECTION_STRING environment variable is not set.");
  process.exit(1); // Exit the process if connection string is not set
}

const emailClient = new EmailClient(connectionString);

// Function to dynamically replace placeholders in the template
function loadTemplate(filePath, replacements) {
  let template = fs.readFileSync(filePath, 'utf-8'); // Read HTML content
  for (const key in replacements) {
    const regex = new RegExp(`{{${key}}}`, 'g'); // Placeholder regex
    template = template.replace(regex, replacements[key]); // Replace with values
  }
  return template;
}

module.exports = async (toAddress, templateData, id) => {
  try {
    const unsubscribeLink = `https://dn9ynng7833dp.cloudfront.net/unsubscribe?token=${id}`;
    console.log(templateData);

    const { userName, category, subCategory, eventDate, message, eventId, eventName, eventDescription } = templateData;
    const link = `https://d23zwmeaq03op.cloudfront.net/${eventId}`;
    console.log("Link: ", link);

    // Create the replacements object with dynamic content
    const replacements = {
      category,
      userName,
      subCategory,
      eventDate,
      eventName: eventDescription,
      message,
      unsubscribeLink, // Optional: Include unsubscribe link
      link, // Adding the link attribute
    };

    let htmlContent;

    console.log(category, " ", subCategory, " ", eventDate, " ", message);

    // Load the appropriate template based on category and subcategory
    if (category === "Celebration") {
      htmlContent = subCategory === "Birthday"
        ? loadTemplate('./templates/birthday/template1.html', replacements)
        : loadTemplate('./templates/aniversary/template1.html', replacements);
    } else if (category === "Notification") {
      htmlContent = subCategory === "Bill Payment"
        ? loadTemplate('./templates/billPayment/template2.html', replacements)
        : loadTemplate('./templates/deadline/template1.html', replacements);
    } else {
      htmlContent = loadTemplate('./templates/festival/template1.html', replacements);
    }

    const subject = `${category}: ${subCategory}`; // Customize the subject dynamically

    // Define the email message
    const msg = {
      senderAddress: "DoNotReply@unmitech.com", // Update with your Azure Communication Services verified sender
      content: {
        subject: subject,
        html: htmlContent, // HTML email body
        plainText: `Reminder for ${subCategory}: ${eventName} on ${eventDate}`, // Optional plain text fallback
      },
      recipients: {
        to: [
          {
            address: toAddress,
            displayName: userName, // Optional recipient display name
          },
        ],
      },
    };

    // Send the email using Azure Communication Services EmailClient
    const poller = await emailClient.beginSend(msg);
    const response = await poller.pollUntilDone();
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

