import React from 'react';
import  { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';




const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

function Details() {
    const [authCode, setAuthCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    joiningDate: "",
    gender: "",
    image: null, // New field for image
  });


  const clientId = "3c3sbptjuqrmcu0nsekef6h1hr"; // Replace with your Cognito app client ID
  const redirectUri = "http://localhost:3000/"; // Your redirect URI
  const clientSecret = ""; // Your Cognito app client secret (if not set, leave it empty)
  const tokenUrl = "https://ap-south-16fmyuvsz0.auth.ap-south-1.amazoncognito.com/oauth2/token";
  const userInfoUrl = "https://ap-south-16fmyuvsz0.auth.ap-south-1.amazoncognito.com/oauth2/userInfo";
  const apiUrl = "https://mt1t0rr532.execute-api.ap-south-1.amazonaws.com/Stage";

  async function exchangeCodeForTokens(code) {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("redirect_uri", redirectUri);
    params.append("code", code);

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access_token);

        // Save the access token in cookies
        Cookies.set("accessToken", data.access_token, { expires: 1 }); // 1 day expiration

        console.log("Token response:", data);
        fetchUserInfo(data.access_token);
      } else {
        const errorData = await response.json();
        console.error("Failed to exchange code for tokens:", errorData);
      }
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
    }
  }

  async function fetchUserInfo(token) {
    try {
      const response = await fetch(userInfoUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        console.log("User Info:", data);
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch user info:", errorData);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  // async function handleSubmit(e) {
  //   e.preventDefault();

  //   if (!accessToken ) {
  //     console.error("Access token is missing");
  //     return;
  //   }

  //   // Helper function to format date
  //   function formatDate(dateString) {
  //     const date = new Date(dateString);
  //     const year = date.getFullYear();
  //     const month = String(date.getMonth() + 1).padStart(2, "0");
  //     const day = String(date.getDate()).padStart(2, "0");

  //     // Constructing the date in the desired format
  //     return `${year}-${month}-${day}T00:00:00.000+00:00`;
  //   }

  //   // Function to convert image file to Base64
  //   const convertImageToBase64 = (file) => {
  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = () => resolve(reader.result);
  //       reader.onerror = (error) => reject(error);
  //     });
  //   };

  //   let base64Image = null;

  //   if (formData.image) {
  //     try {
  //       base64Image = await convertImageToBase64(formData.image);
  //     } catch (error) {
  //       console.error("Error converting image to Base64:", error);
  //       alert("Failed to process the image.");
  //       return;
  //     }
  //   }

  //   // Construct the JSON payload
  //   const payload = {
  //     firstName: formData.firstName,
  //     lastName: formData.lastName,
  //     DOB: formatDate(formData.birthDate),
  //     dateOfJoiningCurrentCompany: formatDate(formData.joiningDate),
  //     gender: formData.gender,
  //     accessToken: accessToken,
  //   };

  //   if (base64Image) {
  //     payload.photo = base64Image; // Include the Base64 image
  //   }

  //   // Log the payload for debugging
  //   console.log("Payload:", payload);

  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json", // Set Content-Type to JSON
  //       },
  //       body: JSON.stringify(payload), // Send JSON payload
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("Backend response:", data);
  //       alert(`Success: ${JSON.stringify(data)}`); // Show alert on success
  //     } else {
  //       const errorData = await response.json();
  //       console.error("Failed to send data to backend:", errorData);
  //       alert(`Error: ${JSON.stringify(errorData)}`); // Show alert on failure
  //     }
  //   } catch (error) {
  //     console.error("Error sending data to backend:", error);
  //     alert(`Error: ${error.message}`); // Show alert on error
  //   }
  // }

  // Helper function to get the value of a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

async function handleSubmit(e) {
  e.preventDefault();

  // Get the accessToken from the cookies
  setLoading(true);
  const Token = getCookie("accessToken");

  if (!Token) {
    console.error("Access token is missing");
    return;
  }

  // Helper function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Constructing the date in the desired format
    return `${year}-${month}-${day}T00:00:00.000+00:00`;
  }

  // Function to convert image file to Base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  let base64Image = null;

  if (formData.image) {
    try {
      base64Image = await convertImageToBase64(formData.image);
    } catch (error) {
      console.error("Error converting image to Base64:", error);
      alert("Failed to process the image.");
      return;
    }
  }

  // Construct the JSON payload
  const payload = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    birthDate: formatDate(formData.birthDate),
    joiningDate: formatDate(formData.joiningDate),
    gender: formData.gender,
    accessToken: Token, // Use the access token from the cookie
  };

  if (base64Image) {
    payload.photo = base64Image; // Include the Base64 image
  }

  // Log the payload for debugging
  console.log("Payload:", payload);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set Content-Type to JSON
      },
      body: JSON.stringify(payload), // Send JSON payload
    });

    if (response.ok) {
      
      const data = await response.json();
      console.log("Backend response:", data);
      alert(`Success: ${JSON.stringify(data)}`); 
      navigate('/loading');
      
    } else {
      const errorData = await response.json();
      console.error("Failed to send data to backend:", errorData);
      alert(`Error: ${JSON.stringify(errorData)}`); // Show alert on failure
    }
  } catch (error) {
    console.error("Error sending data to backend:", error);
    alert(`Error: ${error.message}`); // Show alert on error
  }
  setLoading(false);
}


  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
      console.log("Authorization code:", code);
      setAuthCode(code);
      exchangeCodeForTokens(code);
    }
  }, []);
  useEffect(()=>{
    if(getCookie('accessToken')==""|| getCookie('accessToken')==null){
      navigate('/');
    }
  },[]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Check if the input is of type file
    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0], // Set the selected file to state
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // useEffect(()=>{


  // },[])

  return (
   <div className='min-h-screen bg-sky-950 pb-4 pt-10'>
     <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 ">
    {loading ? (
      <div className="flex justify-center items-center mb-4">
        <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    ) : (
      <>
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to Folex!</h1>
  
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Please complete the registration
          </h2>
  
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Birth Date:
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Gender:
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
  
          {/* <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Photo:
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
  
          <button
            type="submit"
            className="w-full py-2 bg-sky-900 text-white font-bold rounded hover:bg-sky-950 transition duration-300"
          >
            Submit
          </button>
        </form>
      </>
    )}
  </div>
   </div>
  

  );
  
}

export default Details