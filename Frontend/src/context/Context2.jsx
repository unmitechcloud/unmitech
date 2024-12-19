import React, { createContext, useState ,useEffect} from "react"; // Added React import
import { useNavigate } from "react-router-dom";

export const Cont2 = createContext(null);

export const ContextProvider2 = (props) => {

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }; 

 const [subscribeStatus, setSubscribeStatus] = useState(null);
  const [id,setId]=useState(null);
 const [loading, setLoading] = useState(true);
 const [check, setCheck] = useState(true);
 const navigate = useNavigate();

 const checkSubscriptionStatus = async () => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch(
        'https://mt1t0rr532.execute-api.ap-south-1.amazonaws.com/Stage/checkStatus',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken }),
        }
      );

      const result = await response.json();
      setSubscribeStatus(result.subscribeStatus); // Set subscription status
      setId(result.id);
      setLoading(false);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };
  

  

  return (
    <Cont2.Provider value={{ subscribeStatus,checkSubscriptionStatus,id, loading,setLoading,check,setCheck}}>
      {props.children}
    </Cont2.Provider>
  );
};