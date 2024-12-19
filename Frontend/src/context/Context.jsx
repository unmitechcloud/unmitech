import React, { createContext, useState ,useEffect} from "react"; // Added React import

export const Cont = createContext(null);

export const ContextProvider = (props) => {
  const [count, setCount] = useState(0);
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const fetchEvents = async () => {
    const accessToken = getCookie("accessToken");

    try {
      const response = await fetch(
        "https://mt1t0rr532.execute-api.ap-south-1.amazonaws.com/folex-backend/getEvents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessToken }),
        }
      );

      const data = await response.json();
      setEventsData(data.events || []); // Fallback to an empty array if no events
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEventsData([]);
      setLoading(false);
    }
  };

  if(loading){
    fetchEvents();
    setLoading(false);
  }

  return (
    <Cont.Provider value={{ count, setCount, eventsData, loading, setLoading ,fetchEvents}}>
      {props.children}
    </Cont.Provider>
  );
};