import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SubscribePage = (props) => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token'); // Get the token from the URL

  const handleUnsubscribe = async () => {
    setLoading(true);

    try {
      console.log(props.id);
      // Make GET request to the unsubscribe API using fetch
      const response = await fetch(`https://mt1t0rr532.execute-api.ap-south-1.amazonaws.com/folex-backend/unsubscribe/${props.id}`);

      if (response.ok) {
        // Show success alert
        alert('Subscribed successfully.');
        
        // Redirect to the desired URL
        window.location.href = "/addEvent"; // Replace with the actual URL
      } else {
        throw new Error('Internal Server Error');
      }
    } catch (err) {
      // Show error alert
      alert('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-950 flex flex-col items-center justify-center ">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="loader border-4 border-t-4 border-gray-200 rounded-full w-16 h-16 animate-spin"></div>
          <p className="mt-4 text-gray-600">Subscribing...</p>
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center'>
            <div className='text-white text-2xl mb-4'>Your subscribe status is turned off...</div>
            <button
          onClick={handleUnsubscribe}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out shadow-lg"
        >
          Click here to turn you status on
        </button>
        </div>
      )}
    </div>
  );
};

export default SubscribePage;
