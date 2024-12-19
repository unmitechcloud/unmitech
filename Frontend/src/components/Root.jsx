import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [authCode, setAuthCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate(); // useNavigate hook for navigation

  const clientId = 'av59njgd1tg642br5121i5i52'; // Replace with your Cognito app client ID
  const redirectUri = 'https://dn9ynng7833dp.cloudfront.net/loading'; // Your redirect URI
  const clientSecret = ''; // Your Cognito app client secret (if not set, leave it empty)
  const tokenUrl = 'https://ap-south-16fmyuvsz0.auth.ap-south-1.amazoncognito.com/oauth2/token';

  // Function to exchange the authorization code for access and refresh tokens
  async function exchangeCodeForTokens(code) {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('redirect_uri', redirectUri);
    params.append('code', code);

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access_token);

        // Save the access token in cookies with an expiration of 1 day
        Cookies.set('accessToken', data.access_token, { expires: 1 });
        console.log('Token response:', data);

        // After obtaining the access token, check the user status
        await checkUserStatus(data.access_token);
      } else {
        const errorData = await response.json();
        console.error('Failed to exchange code for tokens:', errorData);
      }
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
    }
  }

  // Function to check user status after getting the access token
  async function checkUserStatus(token) {
    try {
      const response = await fetch(
        'https://mt1t0rr532.execute-api.ap-south-1.amazonaws.com/folex-backend/checkUser',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken: token }), // Send accessToken in the request body
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Check if the response contains "exists": true
        if (data.exists === true) {
          // Redirect to /addEvent if "exists" is true
          navigate('/home');
        } else {
          // Redirect to /addInfo if "exists" is false
          navigate('/userRegistration');
        }
      } else {
        console.error('Failed to check user status:', response.statusText);
        // Redirect to /addInfo on failure
        navigate('/userRegistration');
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      // Redirect to /addInfo on error
      navigate('/userRegistration');
    }
  }

  // Extract the authorization code from the URL upon component mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    if (code) {
      console.log('Authorization code:', code);
      setAuthCode(code);
      exchangeCodeForTokens(code);
    } else {
      // If no auth code is present, try to get the accessToken from cookies
      const tokenFromCookies = Cookies.get('accessToken');
      if (tokenFromCookies) {
        console.log('Access token from cookies:', tokenFromCookies);
        setAccessToken(tokenFromCookies);
        checkUserStatus(tokenFromCookies);
      }
    }
  }, []);

  return (
    <div >
      <div className='min-h-screen bg-sky-950 flex flex-col justify-center items-center'>
      <h1 className='text-5xl text-white font-bold'>Welcome to Folex !</h1>
      <dotlottie-player
        src="https://lottie.host/ac8a9050-596e-4058-a2d2-70be9aedc556/qONrvIBamP.json"
        background="transparent"
        speed="1"
        style={{ width: '300px', height: '300px' }}
        loop
        autoplay
      ></dotlottie-player>
      </div>
    </div>
  );
}

export default Home;
