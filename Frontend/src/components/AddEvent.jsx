import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Subscribe from './Subscribe'; // Import Subscribe component
import { useNavigate } from 'react-router-dom';
import { Cont2 } from "../context/Context2";
import { Cont } from '../context/Context';

// Function to get a specific cookie value by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

function AddEvent() {
  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    eventName: '',
    message: '', 
    attachment: null, 
    eventDate: '',
    recurrenceType: 'One Time',
    recurrenceDetail: '',
    recurrenceMonthlyDay: '',
    recurrenceYearlyMonth: '',
    recurrenceYearlyDay: '',
    recurrenceWeeklyDays: [], // For weekly recurrence
  });

  const [statusMessage, setStatusMessage] = useState('');
  // const [loading, setLoading] = useState(true);  // Loading state
  // const [subscribeStatus, setSubscribeStatus] = useState(null); // New state for subscription status
  // const [id,setId]=useState(null);

  const categories = {
    Celebration: ['Birthday', 'Anniversary'],
    Notification: ['Bill Payment', 'Deadline'],
  };

  const navigate = useNavigate();

  const {  subscribeStatus,checkSubscriptionStatus,id, loading,setLoading,check,setCheck} = useContext(Cont2);
  const { fetchEvents } = useContext(Cont);
  

 useEffect(()=>{
  if(check){
    
    checkSubscriptionStatus();
    setLoading(false);
    setCheck(!check)
  

}

 },[])

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value, // Handle file input
    }));

    if (name === 'category') {
      setFormData((prevData) => ({
        ...prevData,
        subCategory: '',
      }));
    }

    if (name === 'recurrenceType') {
      setFormData((prevData) => ({
        ...prevData,
        recurrenceDetail: '',
      }));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true); // Start the loading spinner
  //   const accessToken = getCookie('accessToken');

  //   // Handle recurrence detail logic based on the selected date
  //   if (formData.recurrenceType === 'Repeating') {
  //     const selectedDate = new Date(formData.eventDate);
  //     const day = selectedDate.getDate();
  //     const month = selectedDate.getMonth() + 1; // months are zero-indexed

  //     if (formData.recurrenceDetail === 'Weekly') {
  //       formData.recurrenceWeeklyDays = [selectedDate.toLocaleDateString('en-US', { weekday: 'long' })];
  //     } else if (formData.recurrenceDetail === 'Monthly') {
  //       formData.recurrenceMonthlyDay = day;
  //     } else if (formData.recurrenceDetail === 'Yearly') {
  //       formData.recurrenceYearlyDay = day;
  //       formData.recurrenceYearlyMonth = month;
  //     }
  //   }

  //   const requestBody = {
  //     ...formData,
  //     accessToken,
  //   };

  //   try {
  //     const response = await fetch(
  //       'https://9bkcvd275k.execute-api.ap-south-1.amazonaws.com/Stage/addEvent',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(requestBody),
  //       }
  //     );

  //     if (response.ok) {
  //       const result = await response.json();
  //       alert('Event added successfully!');
  //       console.log('Response from server:', result);

  //       // Reset form data to initial state
  //       setFormData({
  //         eventName: '',
  //         message: '',
  //         attachment: null,
  //         eventDate: '',
  //         recurrenceType: '',
  //         recurrenceDetail: '',
  //         recurrenceWeeklyDays: [],
  //         recurrenceMonthlyDay: '',
  //         recurrenceYearlyDay: '',
  //         recurrenceYearlyMonth: '',
  //       });

  //       setLoading(false); // Stop the loading spinner
  //     } else {
  //       console.error('Error:', response.statusText);
  //       alert('Failed to add event. Please try again.');
  //       setLoading(false); // Stop the loading spinner
  //     }
  //   } catch (error) {
  //     setStatusMessage('Error occurred while adding event.');
  //     console.error('Error:', error);
  //     setLoading(false); // Stop the loading spinner
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner
    const accessToken = getCookie('accessToken');
  
    // Handle recurrence detail logic based on the selected date
    if (formData.recurrenceType === 'Repeating') {
      const selectedDate = new Date(formData.eventDate);
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1; // months are zero-indexed
  
      if (formData.recurrenceDetail === 'Weekly') {
        formData.recurrenceWeeklyDays = [
          selectedDate.toLocaleDateString('en-US', { weekday: 'long' }),
        ];
      } else if (formData.recurrenceDetail === 'Monthly') {
        formData.recurrenceMonthlyDay = day;
      } else if (formData.recurrenceDetail === 'Yearly') {
        formData.recurrenceYearlyDay = day;
        formData.recurrenceYearlyMonth = month;
      }
    }
  
    const requestBody = { ...formData, accessToken };
  
    try {
      // First request to add the event and get the ID
      const response = await fetch(
        'https://mt1t0rr532.execute-api.ap-south-1.amazonaws.com/Stage/addEvent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to add event.');
      }
     
  
      const result = await response.json();
      console.log(result);
      fetchEvents();
      const eventId = result.id; // Extract event ID from response
      console.log('Event ID:', eventId);
  
      if (formData.attachment) {
        // Get file type from the attachment
        const filetype = formData.attachment.type;
  
        // Second request to get the pre-signed URL
        const urlResponse = await fetch(
          'https://mt1t0rr532.execute-api.ap-south-1.amazonaws.com/Stage/getUrl',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filetype, filename: eventId }),
          }
        );
  
        if (!urlResponse.ok) {
          throw new Error('Failed to get pre-signed URL.');
        }
  
        const { uploadURL } = await urlResponse.json();
        
  
        // Upload the file to the pre-signed URL
        const uploadResponse = await fetch(uploadURL, {
          method: 'PUT',
          headers: { 'Content-Type': filetype },
          body: formData.attachment,
        });
  
        if (!uploadResponse.ok) {
          throw new Error('File upload failed.');
        }
  
        console.log('File uploaded successfully.');
      }
  
      navigate('/home')
      setFormData({
        category: '',
        subCategory: '',
        eventName: '',
        message: '',
        attachment: null,
        eventDate: '',
        recurrenceType: 'One Time',
        recurrenceDetail: '',
        recurrenceMonthlyDay: '',
        recurrenceYearlyMonth: '',
        recurrenceYearlyDay: '',
        recurrenceWeeklyDays: [],
      });
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };
  

  // useEffect(() => {
  //   const checkSubscriptionStatus = async () => {
  //     const accessToken = getCookie('accessToken');
  //     if (!accessToken) {
  //       navigate('/');
  //       return;
  //     }

  //     try {
  //       const response = await fetch(
  //         'https://mt1t0rr532.execute-api.ap-south-1.amazonaws.com/Stage/checkStatus',
  //         {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ accessToken }),
  //         }
  //       );

  //       const result = await response.json();
  //       setSubscribeStatus(result.subscribeStatus); // Set subscription status
  //       setId(result.id);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error checking subscription status:', error);
  //     }
  //   };

  //   checkSubscriptionStatus();
  // }, [navigate]);




  

  // If the subscription status is not yet loaded, show a loading indicator
  // if (subscribeStatus === null) {
  //   return (
  //     <div className="flex justify-center items-center h-screen bg-sky-950">
  //       <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
  //     </div>
  //   );
  // }

  // If subscription is inactive, show Subscribe component
  if (subscribeStatus === false) {
    return <Subscribe id={id} />;
  }

  // If subscription is active, show the AddEvent form
  return (
    <div className='min-h-screen bg-sky-950 pb-8'>
      <Navbar title1="Home" title2="" title3="SignOut" link1="/home" link2="/manageEvents" link3="/logout" />
      {subscribeStatus==null && 
       <div className="flex justify-center items-center h-screen bg-sky-950">
       <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
     </div>}
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Add New Event:</h1>

        {loading && (
          <div className="flex justify-center items-center mb-4 bg-sky-950 ">
            <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}

        {/* Form display only when not loading */}
        {!loading && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Category:
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Category</option>
                <option value="Celebration">Celebration</option>
                <option value="Notification">Notification</option>
                <option value="Festivel">Festivel</option>
              </select>
            </div>

            {formData.category && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Subcategory:
                </label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Subcategory</option>
                  {categories[formData.category]?.map((subCat) => (
                    <option key={subCat} value={subCat}>
                      {subCat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Event Name:
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Message:
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Attachment:
              </label>
              <input
                type="file"
                name="attachment"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

          

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Event Date:
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Recurrence Type:
              </label>
              <select
                name="recurrenceType"
                value={formData.recurrenceType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="One Time">One Time</option>
                <option value="Repeating">Repeating</option>
              </select>
            </div>

            {formData.recurrenceType === 'Repeating' && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Recurrence Detail:
                </label>
                <select
                  name="recurrenceDetail"
                  value={formData.recurrenceDetail}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Recurrence</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
              >
                Add Event
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddEvent;
