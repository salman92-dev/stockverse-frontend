'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('authToken');
        if (token) {
            router.push('/dashboard'); // Redirect to dashboard if already logged in
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://devsalman.tech/signin', {
                email,
                password,
            }, {
                withCredentials: true, // Include cookies in the request
            });

            // Check if the response status is 200 (OK)
            if (response.status === 200) {
                const user = response.data.user;
                const token = response.data.token;

                // Store user data and token in cookies if they exist
                Cookies.set('userdata', JSON.stringify(user));
                if (token) {
                    Cookies.set('authToken', token, { expires: 5 / (24 * 60) });
                }

                // Redirect to dashboard after successful login
                router.push('/dashboard');
            } else {
                setError(response.data.message || 'Failed to sign in');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Sign In
                    </button>
                    <div className="mt-4 space-y-2">
                        <a
                            href="https://devsalman.tech/auth/google"
                            className="block w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors text-center"
                        >
                            Login with Google
                        </a>
                        <a
                            href="https://devsalman.tech/auth/facebook"
                            className="block w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition-colors text-center"
                        >
                            Login with Facebook
                        </a>
                    </div>
                </form>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
}
