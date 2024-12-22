import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import EventTable from "./EventTable";
import EditEventForm from "./EditEventForm";
import { useNavigate } from "react-router-dom";
import { Cont } from "../context/Context";

export const Events = () => {
 
  const { fetchEvents, eventsData, loading , setLoading } = useContext(Cont);
  
  const [editingEvent, setEditingEvent] = useState(null);
  const [reload, setReload] = useState(true);
  const [load,useLoad]=useState(true);

  const [editForm, setEditForm] = useState({
    eventName: "",
    subCategory: "",
    category: "",
    eventDate: "",
    message: "",
  });
  const navigate = useNavigate();


  // const loadData=()=>{
  //   if(reload){
  //     fetchEvents();
  //     setReload(false);
  //   }
  // }

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const handleDelete = async (eventIndex) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      setLoading(true);
      const accessToken = getCookie("accessToken");

      try {
        const response = await fetch(
          "https://mt1t0rr532.execute-api.ap-south-1.amazonaws.com/folex-backend/deleteEvent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken, eventIndex }),
          }
        );

        setLoading(false);

        if (response.ok) {
          alert("Event deleted successfully!");
          fetchEvents();
        } else {
          alert("Failed to delete the event. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Error deleting the event.");
      }
    }
  };

  const handleEdit = (event, eventIndex) => {
    setEditingEvent({ ...event, eventIndex });
    setEditForm({
      eventName: event.eventName,
      subCategory: event.subCategory,
      category: event.category,
      eventDate: event.eventDate,
      message: event.message,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    console.log(editForm);
    setEditForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSave = async () => {
    const confirmSave = window.confirm("Are you sure you want to save the changes?");
    if (confirmSave && editingEvent) {
      const { eventIndex } = editingEvent;
      const accessToken = getCookie("accessToken");

      try {
        console.log(editForm);
        const response = await fetch(
          "https://mt1t0rr532.execute-api.ap-south-1.amazonaws.com/folex-backend/editEvent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accessToken,
              eventIndex,
              ...editForm,
            }),
          }
        );

        if (response.ok) {
          alert("Event updated successfully!");
          setEditingEvent(null);
          fetchEvents();
        } else {
          alert("Failed to update the event. Please try again.");
        }
      } catch (error) {
        console.error("Error updating event:", error);
        alert("Error updating the event.");
      }
    }
  };



  useEffect(() => {
    if (!getCookie("accessToken")) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(()=>{
    
      fetchEvents();
      
    }
  ,[]);

  return (
    <div className="min-h-screen bg-sky-950 pb-4">
      <Navbar title1="Home" title2="Add Events" title3="SignOut" link1="/home" link2="/addEvent" />
      <h1 className="text-3xl font-bold text-white text-center mb-8 pt-4">Your Events</h1>
      {loading ? (
        <div className="flex justify-center items-center mb-4 h-screen max-h-screen">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : (
        <EventTable
          eventsData={eventsData}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}

      {editingEvent && (
        <EditEventForm
          editForm={editForm}
          handleFormChange={handleFormChange}
          handleSave={handleSave}
          handleCloseForm={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
};

export default Events;
