import React from 'react';

const EditEventForm = ({
  editForm,
  handleFormChange,
  handleSave,
  handleCloseForm
}) => {
  return (
    <div className="mt-5 p-4 border  bg-sky-900 text-white border-gray-400 rounded relative m-4 ">
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 text-xl font-bold text-red-500 hover:text-red-700"
        onClick={handleCloseForm}  // Calls the function to close the form
      >
        &times;
      </button>
      <h3 className="text-xl font-semibold mb-3">Edit Event</h3>
      <label className="block mb-2 ">
        Event Name:
        <input
          type="text"
          name="eventName"
          value={editForm.eventName}
          onChange={handleFormChange}
          className="ml-3 p-2 border border-gray-300 rounded w-full text-black"
        />
      </label>
      <label className="block mb-2">
        Subcategory:
        <input
          type="text"
          name="subCategory"
          value={editForm.subCategory}
          onChange={handleFormChange}
          className="ml-3 p-2 border border-gray-300 rounded w-full text-black"
        />
      </label>
      <label className="block mb-2">
        Category:
        <input
          type="text"
          name="category"
          value={editForm.category}
          onChange={handleFormChange}
          className="ml-3 p-2 border border-gray-300 rounded w-full text-black"
        />
      </label>
      <label className="block mb-2">
        Event Date:
        <input
          type="datetime-local"
          name="eventDate"
          value={editForm.eventDate.split('.')[0]}
          onChange={handleFormChange}
          className="ml-3 p-2 border border-gray-300 rounded w-full text-black"
        />
      </label>
      <label className="block mb-2">
        Message:
        <input
          type="text"
          name="message"
          value={editForm.message}
          onChange={handleFormChange}
          className="ml-3 p-2 border border-gray-300 rounded w-full text-black"
        />
      </label>
      <button
        className="px-3 py-2 bg-blue-500 text-white rounded mt-3 "
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default EditEventForm;
