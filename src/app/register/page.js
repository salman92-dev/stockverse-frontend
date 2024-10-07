'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null); 
    const router = useRouter();
   
    useEffect(() => {
        const token = Cookies.get('authToken');
        if (token) {
            router.push('/dashboard');
        }
    }, [router]); // Ensure router is in the dependency array//   6_Xy9##y+[sv

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://devsalman.tech/signup', {
                username,
                email,
                password,
            }, {
                withCredentials: true, // Include cookies in the request
            });

            // Check if the signup was successful
            const data = response.data; // Access the response data
            if (response.status === 201) {
                setMessage(data.message); // Set the success message
                router.push('/verify-email');
            } else {
                setMessage(data.message || 'Something went wrong');
            }
        } catch (error) {
            // Proper error handling
            if (error.response && error.response.data) {
                setMessage(error.response.data.message || 'Something went wrong');
            } else {
                setMessage('An error occurred. Please try again.');
            }
            console.error('Error during signup:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                        Sign Up
                    </button>
                </form>
                {message && <p className="mt-4 text-red-600 text-center">{message}</p>} {/* Display response message */}
            </div>
        </div>
    );
}
