import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = (props) => {
  const navigate = useNavigate();

  // Construct the logout URL for AWS Cognito
  const logoutUrl =  `https://ap-south-16fmyuvsz0.auth.ap-south-1.amazoncognito.com/logout?client_id=av59njgd1tg642br5121i5i52&logout_uri=https%3A%2F%2Fdn9ynng7833dp.cloudfront.net`;


const clearCookies = () => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const name = cookie.split("=")[0];
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

  // Function to handle logout
  const handleLogout = () => {
    // Redirect to the logout URL
    window.location.href = logoutUrl;
    clearCookies();
    
  };

  return (
    <nav className='bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'>
      <div className='container mx-auto px-6 py-4 flex justify-between items-center'>
        {/* Left side - Divs with onClick event */}
        <div className='flex gap-8'>
          {props.title1 && props.link1 && (
            <div
              className='text-white font-semibold hover:bg-blue-600 transition-all duration-300 ease-in-out px-4 py-2 rounded-md cursor-pointer'
              onClick={() => { navigate(props.link1); }}
            >
              {props.title1}
            </div>
          )}
          {props.title2 && props.link2 && (
            <div
              className='text-white font-semibold hover:bg-blue-600 transition-all duration-300 ease-in-out px-4 py-2 rounded-md cursor-pointer'
              onClick={() => { navigate(props.link2); }}
            >
              {props.title2}
            </div>
          )}
        </div>

        {/* Right side - Signout as div with onClick */}
        <div
          className='bg-red-400 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-300 ease-in-out cursor-pointer'
          onClick={handleLogout}
        >
          {props.title3}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
