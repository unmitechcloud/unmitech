import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token'); // Get the token from the URL

  const handleUnsubscribe = async () => {
    setLoading(true);

    try {
      // Make GET request to the unsubscribe API using fetch
      const response = await fetch(`https://mt1t0rr532.execute-api.ap-south-1.amazonaws.com/folex-backend/unsubscribe/${token}`);

      if (response.ok) {
        // Show success alert
        alert('Unsubscribed successfully.');
        
        // Redirect to the desired URL
        window.location.href = 'https://dn9ynng7833dp.cloudfront.net'; // Replace with the actual URL
      } else {
        throw new Error('Internal Server Error');
      }
    } catch (err) {
      // Show error alert
      alert('Failed to unsubscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center min-h-screen bg-sky-950">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="loader border-4 border-t-4 border-gray-200 rounded-full w-16 h-16 animate-spin"></div>
          <p className="mt-4 text-gray-600">Unsubscribing...</p>
        </div>
      ) : (
        <button
          onClick={handleUnsubscribe}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out shadow-lg"
        >
          Change unsubscribe status
        </button>
      )}
    </div>
  );
};

export default UnsubscribePage;
