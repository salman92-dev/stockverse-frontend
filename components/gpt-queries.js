'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const User_queries = ({ shouldFetch }) => {
  const [commands, setCommands] = useState([]);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommands = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = Cookies.get('authToken');

        if (!token) {
          setError('Authorization token not found. Please log in.');
          return;
        }

        const response = await fetch('https://devsalman.tech/user-queries', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (Array.isArray(data.user)) {
          setCommands(data.user);
        } else {
          setCommands([]);
        }
      } catch (error) {
        setError('Failed to fetch commands. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommands(); // Call the fetch function whenever shouldFetch changes
  }, [shouldFetch]);

  const handleCommandClick = (command, response) => {
    setSelectedCommand(command);
    setSelectedResponse(response);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-gray-200 shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-black">Commands</h2>
        {loading ? (
          <p className="text-gray-600 text-black">Loading commands...</p>
        ) : error ? (
          <p className="text-red-600 text-black">{error}</p>
        ) : (
          <ul className="space-y-2">
            {commands.map(({ id, command, response }) => (
              <li
                key={id}
                className="cursor-pointer p-2 hover:bg-gray-300 transition-colors duration-200 rounded text-black overflow-hidden whitespace-nowrap overflow-ellipsis"
                onClick={() => handleCommandClick(command, response)}
              >
                {command}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main Section */}
      <div className="w-3/4 p-4">
        {selectedCommand ? (
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg text-black font-bold mb-2">Selected Command:</h2>
            <p className="text-gray-700 mb-4 text-black">{selectedCommand}</p>
            <h2 className="text-lg font-bold mb-2 text-black">Response:</h2>
            <p className="text-gray-800 text-black">{selectedResponse}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600 text-black">Select a command to see the response.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default User_queries;
