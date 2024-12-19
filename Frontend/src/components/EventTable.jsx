import React, { useState } from 'react';

const EventTable = ({ eventsData = [], handleEdit, handleDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  // Safely calculate total events
  const totalEvents = eventsData?.reduce((acc, event) => acc + (event.events?.length || 0), 0) || 0;

  // Flatten the eventsData to get a single array of events
  const allEvents = eventsData?.flatMap(event => event.events || []) || [];
  
  // Calculate the current events to display
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = allEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate pagination numbers
  const totalPages = Math.ceil(totalEvents / eventsPerPage);
  const pageNumbers = [];
  
  // Calculate the range of pages to show
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pl-3 pr-4">
      {totalEvents === 0 ? (
        <p className="text-center text-gray-500 text-lg font-medium">No events are present.</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border text-white border-gray-300 px-4 py-2">Event Name</th>
                <th className="border text-white border-gray-300 px-4 py-2">Subcategory</th>
                <th className="border text-white border-gray-300 px-4 py-2">Category</th>
                <th className="border text-white border-gray-300 px-4 py-2">Event Date</th>
                <th className="border text-white border-gray-300 px-4 py-2">Message</th>
                <th className="border text-white border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.map((ev, idx) => (
                <tr key={idx}>
                  <td className="border text-white border-gray-300 px-4 py-2 text-center">{ev.eventName}</td>
                  <td className="border text-white border-gray-300 px-4 py-2 text-center">{ev.subCategory}</td>
                  <td className="border text-white border-gray-300 px-4 py-2 text-center">{ev.category}</td>
                  <td className="border text-white border-gray-300 px-4 py-2 text-center">{new Date(ev.eventDate).toLocaleDateString()}</td>
                  <td className="border text-white border-gray-300 px-4 py-2 text-center">{ev.message}</td>
                  <td className="border text-white border-gray-300 px-4 py-2 text-center">
                    <button
                      className="mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleEdit(ev, idx)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(idx)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <ul className="flex list-none items-center">
              <li className="mx-1">
                <button
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {pageNumbers.map(number => (
                <li key={number} className="mx-1">
                  <button
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                  >
                    {number}
                  </button>
                </li>
              ))}
              <li className="mx-1">
                <button
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default EventTable;
