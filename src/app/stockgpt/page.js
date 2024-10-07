'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import User_queries from '../../../components/gpt-queries';

export default function Home() {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState('');
  const [shouldFetch, setShouldFetch] = useState(false); // New state to trigger re-fetch

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://devsalman.tech/stockgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setResponse(data.message);
        return;
      }

      const formattedResponse = data.result.replace(/(\d+\.\s)/g, '\n$1');
      setResponse(formattedResponse);
      setShouldFetch(prev => !prev); // Toggle the state to trigger re-fetch in User_queries
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-red-500">Access Denied</h2>
          <p className="mt-4 text-black">
            You need to sign up or log in to access this part of the website.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter your command"
            className="w-full text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
        {response && (
          <div className="mt-6 whitespace-pre-line">
            <h3 className="text-lg text-black font-semibold">Query:</h3>
            <p className="mt-2 text-black p-3 bg-gray-100 rounded-md overflow-x-auto">{command}</p>
            <h3 className="text-lg text-black font-semibold">Response:</h3>
            <p className="mt-2 text-black p-3 bg-gray-100 rounded-md overflow-x-auto">
              {response}
            </p>
          </div>
        )}
      </div>
      <User_queries shouldFetch={shouldFetch} /> {/* Pass the state to User_queries */}
    </div>
  );
}
