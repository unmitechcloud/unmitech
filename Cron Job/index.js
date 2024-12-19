// const AWS = require('aws-sdk');
// const sendEmail = require('./sendEmail.js');
// const sendEmail2 = require('./sendEmail2.js');
// const sendSimpleEmail = require('./sendSimpleEmail.js'); // Import the new email function

// // Configure AWS SDK for DynamoDB
// AWS.config.update({
//   accessKeyId: process.env.ACCESS_KEY,
//   secretAccessKey: process.env.SECRET_ACCESS_KEY,
//   region: 'ap-south-1',
// });

// const dynamoDB = new AWS.DynamoDB.DocumentClient();
// const tableName = 'Users';

// module.exports.handler = async (event) => {
//   const today = new Date();
//   const todayMonth = today.getMonth() + 1; // JS getMonth() is zero-indexed
//   const todayDate = today.getDate();
//   const todayDay = today.toLocaleString('en-US', { weekday: 'long' }); // Get today's day name (e.g., 'Monday')

//   const params = {
//     TableName: tableName,
//   };

//   try {
//     const data = await dynamoDB.scan(params).promise();
//     const users = data.Items;
//     const events = [];

//     for (const user of users) {
//       if (user.subscribeStatus === false) continue;

//       const userDOB = new Date(user.birthDate);
//       const userAnniversary = new Date(user.joiningDate);

//       // Check for birthday event
//       // if (userDOB.getMonth() + 1 === todayMonth && userDOB.getDate() === todayDate) {
//       //   events.push({
//       //     name: `${user.firstName} ${user.lastName}`,
//       //     event: 'Birthday',
//       //   });

//       //   if (!user.photoLink) {
//       //     user.photoLink = user.gender === 'female'
//       //       ? 'https://s3.ap-south-1.amazonaws.com/bucket.folex.in/female-avatar.png'
//       //       : 'https://s3.ap-south-1.amazonaws.com/bucket.folex.in/male-avatar.png';
//       //   }

//       //   const templateData = {
//       //     name: user.firstName,
//       //     companyName: 'Folex',
//       //     userImageUrl: user.photoLink,
//       //   };

//       //   await sendEmail2(user.email, templateData, user.id);
//       // }

//       // // Check for work anniversary event
//       // if (userAnniversary.getMonth() + 1 === todayMonth && userAnniversary.getDate() === todayDate) {
//       //   events.push({
//       //     name: `${user.firstName} ${user.lastName}`,
//       //     event: 'Work Anniversary',
//       //   });

//       //   if (!user.photoLink) {
//       //     user.photoLink = user.gender === 'female'
//       //       ? 'https://s3.ap-south-1.amazonaws.com/bucket.folex.in/female-avatar.png'
//       //       : 'https://s3.ap-south-1.amazonaws.com/bucket.folex.in/male-avatar.png';
//       //   }

//       //   const templateData2 = {
//       //     recipientName: user.firstName,
//       //     userImageUrl: user.photoLink,
//       //   };

//       //   await sendEmail(user.email, templateData2);
//       // }

//       // Check for additional events from the events column
//       const userEvents = user.events; // Assuming 'events' is an array of event objects
//       if (!userEvents || userEvents.length === 0) continue;

//       for (const event of userEvents) {
//         const eventDate = new Date(event.eventDate);
//         const eventDay = eventDate.getDate();
//         const eventMonth = eventDate.getMonth() + 1; // Adjust for zero-indexed month
//         console.log(event);

//         if (event.recurrenceType !== 'Repeating') {
//           // One-time event logic
//           if (eventMonth === todayMonth && eventDay === todayDate) {
//             events.push({
//               name: `${user.firstName} ${user.lastName}`,
//               event: event.eventName,
//             });

//             const simpleEmailData = {
//               userName: user.firstName,
//               category: event.category,
//               subCategory: event.subCategory,
//               eventDate: event.eventDate,
//               eventDescription: event.eventName || 'No description provided',
//             };

//             await sendSimpleEmail(user.email, simpleEmailData, user.id);
//           }
//         } else if (event.recurrenceType === 'Repeating') {
//           // Recurring event logic
//           if (event.recurrenceDetail === 'Weekly') {
//             // Weekly recurrence
//             if (event.recurrenceWeeklyDay === todayDay) {
//               events.push({
//                 name: `${user.firstName} ${user.lastName}`,
//                 event: event.eventName,
//                 type: "Weekly",
//               });

//               const simpleEmailData = {
//                 userName: user.firstName,
//                 category: event.category,
//                 subCategory: event.subCategory,
//                 eventDate: event.eventDate,
//                 eventDescription: event.eventName || 'No description provided',
//               };

//               await sendSimpleEmail(user.email, simpleEmailData, user.id);
//             }
//           } else if (event.recurrenceDetail === 'Monthly') {
//             // Monthly recurrence
//             if (event.recurrenceMonthlyDay === todayDate) {
//               events.push({
//                 name: `${user.firstName} ${user.lastName}`,
//                 event: event.eventName,
//                 type: "Monthly",
//               });

//               const simpleEmailData = {
//                 userName: user.firstName,
//                 category: event.category,
//                 subCategory: event.subCategory,
//                 eventDate: event.eventDate,
//                 eventDescription: event.eventName || 'No description provided',
//               };

//               await sendSimpleEmail(user.email, simpleEmailData, user.id);
//             }
//           } else if (event.recurrenceDetail === 'Yearly') {
//             // Yearly recurrence
//             if (event.recurrenceYearlyMonth === todayMonth && event.recurrenceYearlyDay === todayDate) {
//               events.push({
//                 name: `${user.firstName} ${user.lastName}`,
//                 event: event.eventName,
//                 type: "Yearly",
//               });

//               const simpleEmailData = {
//                 userName: user.firstName,
//                 category: event.category,
//                 subCategory: event.subCategory,
//                 eventDate: event.eventDate,
//                 eventDescription: event.eventName || 'No description provided',
//               };

//               await sendSimpleEmail(user.email, simpleEmailData, user.id);
//             }
//           }
//         }
//       }
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify(events),
//     };
//   } catch (error) {
//     console.error('Error fetching users or events from DynamoDB:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Internal Server Error' }),
//     };
//   }
// };


const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken'); // Import JWT package
const sendSimpleEmail = require('./sendSimpleEmail.js');
const sendReminder = require('./sendReminder.js');

// Configure AWS SDK for DynamoDB
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'ap-south-1',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'Users';
const JWT_SECRET = "secret"; // Secret for signing JWT

module.exports.handler = async (event) => {
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();
  const todayDay = today.toLocaleString('en-US', { weekday: 'long' });

  const params = { TableName: tableName };

  try {
    const data = await dynamoDB.scan(params).promise();
    const users = data.Items;
    const events = [];

    for (const user of users) {
      if (!user.subscribeStatus || !user.events || user.events.length === 0) continue;

      let eventIndex = 0; // Initialize event index for this user

      for (const event of user.events) {

        console.log(event);
        const eventDate = new Date(event.eventDate);
        const eventDay = eventDate.getDate();
        const eventMonth = eventDate.getMonth() + 1;

        const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24)); // Difference in days

        console.log(event.id);

        const jwtToken = generateJwt(user.email, event.id||0); // Generate JWT

        // === One-time Event Handling ===
        if (event.recurrenceType !== 'Repeating' && eventMonth === todayMonth && eventDay === todayDate) {
          events.push({
            name: `${user.firstName} ${user.lastName}`,
            event: event.eventName,
          });

          const simpleEmailData = {
            userName: user.firstName,
            category: event.category,
            subCategory: event.subCategory,
            eventDate: event.eventDate,
            eventDescription: event.eventName || 'No description provided',
             message:event.message,
            eventId:event.id,
            token: jwtToken, // Add JWT token
          };

          await sendSimpleEmail(user.email, simpleEmailData, user.id);
        }

        // === Send Reminder for One-time Events ===
        if (event.recurrenceType !== 'Repeating' && (diffDays === 7 || diffDays === 3)) {
          const reminderData = {
            userName: user.firstName,
            category: event.category,
            subCategory: event.subCategory,
            eventDate: event.eventDate,
            eventDescription: event.eventName || 'No description provided',
             message:event.message,
             eventId:event.id,
            token: jwtToken, // Add JWT token
          };

          await sendReminder(user.email, reminderData, user.id);
        }

        // === Recurring Event Handling ===
        if (event.recurrenceType === 'Repeating') {
          let isEventToday = false;

          if (event.recurrenceDetail === 'Weekly' && event.recurrenceWeeklyDay === todayDay) {
            isEventToday = true;
          } else if (event.recurrenceDetail === 'Monthly' && event.recurrenceMonthlyDay === todayDate) {
            isEventToday = true;
          } else if (
            event.recurrenceDetail === 'Yearly' &&
            event.recurrenceYearlyMonth === todayMonth &&
            event.recurrenceYearlyDay === todayDate
          ) {
            isEventToday = true;
          }

          if (isEventToday) {
            events.push({
              name: `${user.firstName} ${user.lastName}`,
              event: event.eventName,
              type: event.recurrenceDetail,
            });

            const simpleEmailData = {
              userName: user.firstName,
              category: event.category,
              subCategory: event.subCategory,
              eventDate: event.eventDate,
              eventDescription: event.eventName || 'No description provided',
               message:event.message,
               eventId:event.id,
              token: jwtToken, // Add JWT token
            };

            await sendSimpleEmail(user.email, simpleEmailData, user.id);
          }

          // === Send Reminder for Recurring Events ===
          const nextOccurrence = getNextOccurrence(event, today);
          const daysUntilNext = Math.ceil((nextOccurrence - today) / (1000 * 60 * 60 * 24));

          if (daysUntilNext === 7 || daysUntilNext === 3) {
            const reminderData = {
              userName: user.firstName,
              category: event.category,
              subCategory: event.subCategory,
              eventDate: event.eventDate,
              eventDescription: event.eventName || 'No description provided',
              eventDate: nextOccurrence.toISOString().split('T')[0],
               message:event.message,
               eventId:event.id,
              token: jwtToken, // Add JWT token
            };

            await sendReminder(user.email, reminderData, user.id);
          }
        }

        eventIndex++; // Increment event index
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(events),
    };
  } catch (error) {
    console.error('Error fetching users or events from DynamoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

// Function to generate JWT token
function generateJwt(email, id) {
  return jwt.sign({ email, id }, JWT_SECRET, { expiresIn: '1d' });
}

function getNextOccurrence(event, today) {
  const nextOccurrence = new Date(today);

  if (event.recurrenceDetail === 'Weekly') {
    const targetDay = new Date().toLocaleString('en-US', { weekday: 'long' }) === event.recurrenceWeeklyDay;
    nextOccurrence.setDate(today.getDate() + ((7 + targetDay - today.getDay()) % 7));
  } else if (event.recurrenceDetail === 'Monthly') {
    nextOccurrence.setDate(event.recurrenceMonthlyDay);
    if (nextOccurrence < today) nextOccurrence.setMonth(today.getMonth() + 1);
  } else if (event.recurrenceDetail === 'Yearly') {
    nextOccurrence.setMonth(event.recurrenceYearlyMonth - 1);
    nextOccurrence.setDate(event.recurrenceYearlyDay);
    if (nextOccurrence < today) nextOccurrence.setFullYear(today.getFullYear() + 1);
  }

  return nextOccurrence;
}
