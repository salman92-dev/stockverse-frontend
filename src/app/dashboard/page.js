'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import LogoutButton from '../../../components/logout';
import User from '../../../components/user';

export default function Dashboard() {
  const [top7, setTop7] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const token = Cookies.get('authToken'); 

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      fetchData();
    }
  }, [token, router]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https:devsalman.tech/top7', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        method: 'GET',
        credentials: 'include',
      });
      setTop7(response.data);
    } catch (error) {
      console.error('Error fetching protected data:', error);
      if (error.response && error.response.status === 401) {
        router.push('/login');
      }
    }
  };

  const handleWatchLater = async (symbol) => {
    try {
      const response = await fetch('https://devsalman.tech/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol }),
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
          setMessage(data.message); // Set the success message
      } else {
          setMessage(data.error); // Set the error message
      }
    } catch (error) {
      console.error('Error adding stock to watchlist:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <LogoutButton />
      <User />
      {message && <p>{message}</p>}
      <h1>This is stockverse <b>Dashboard</b></h1>
      {top7.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">Logo</th>
              <th className="py-2 px-4">Stock Symbol</th>
              <th className="py-2 px-4">Open</th>
              <th className="py-2 px-4">High</th>
              <th className="py-2 px-4">Low</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Change</th>
              <th className="py-2 px-4">Volume</th>
              <th className="py-2 px-4">Market Cap</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {top7.map((item) => (
              <tr key={item.symbol} className="bg-gray-100 border-b text-black">
                <td className="py-2 px-4 text-center">
                  <img src={item.overview.OfficialSite + '/favicon.ico'} alt={item.symbol} className="w-10 h-10 rounded-full" />
                </td>
                <td className="py-2 px-4 text-center">{item.globalQuote['01. symbol']}</td>
                <td className="py-2 px-4 text-center">{item.globalQuote['02. open']}</td>
                <td className="py-2 px-4 text-center">{item.globalQuote['03. high']}</td>
                <td className="py-2 px-4 text-center">{item.globalQuote['04. low']}</td>
                <td className="py-2 px-4 text-center">{item.globalQuote['05. price']}</td>
                <td className={`py-2 px-4 text-center ${parseFloat(item.globalQuote['09. change']) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.globalQuote['09. change']} ({item.globalQuote['10. change percent']})
                </td>
                <td className="py-2 px-4 text-center">{item.globalQuote['06. volume']}</td>
                <td className="py-2 px-4 text-center">${item.overview.MarketCapitalization}</td>
                <td className="py-2 px-4 text-center">
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleWatchLater(item.globalQuote['01. symbol'])}
                  >
                    add to watchlist
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
