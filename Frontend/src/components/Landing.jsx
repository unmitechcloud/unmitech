import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const navigate=useNavigate();

  useEffect(()=>{
    if(getCookie("accessToken")==null || getCookie("accessToken"==""))navigate('/');

  },[])

 
  return (
    <div className='' >
        <div className='flex pt-4 pb-4 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg h-20 justify-end'>
            <div className='flex pr-10 gap-6'>
            <a href='https://ap-south-16fmyuvsz0.auth.ap-south-1.amazoncognito.com/signup?client_id=av59njgd1tg642br5121i5i52&redirect_uri=https%3A%2F%2Fdn9ynng7833dp.cloudfront.net%2Floading&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile' className='bg-blue-400 flex justify-center items-center rounded-lg p-4 text-xl font-mono font-bold hover:bg-blue-600'>Signup</a>

            <a href='https://ap-south-16fmyuvsz0.auth.ap-south-1.amazoncognito.com/login/continue?client_id=av59njgd1tg642br5121i5i52&redirect_uri=https%3A%2F%2Fdn9ynng7833dp.cloudfront.net%2Floading&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile' className='bg-blue-400 flex justify-center items-center rounded-lg p-4 text-xl font-mono font-bold hover:bg-blue-600'>Signin</a>

            </div>
           
        </div>

        <div className='flex flex-col h-screen justify-center items-center p-10 min-h-screen bg-sky-950'>
            <h1 className='font-bold text-4xl text-white'>Welcome to Folex</h1>
          
            <p className='text-center text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, eveniet sed neque suscipit, quis porro repudiandae, expedita at quos tenetur provident ducimus! Enim consectetur repudiandae iste corrupti reprehenderit neque, voluptatibus praesentium accusantium id velit fugiat recusandae sit tempore consequuntur officia.</p>

        </div>
       

    </div>
  )
}
export default Home