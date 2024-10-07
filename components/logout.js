'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';

const LogoutButton = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogout = async () => {
        setLoading(true);
        setError('');

        try {
            await axios.post('https://devsalman.tech/logout', {}, { withCredentials: true });
            // Redirect to the login page or home page after successful logout
            Cookies.remove('authToken');
            router.push('/login');
        } catch (err) {
            console.error('Error logging out:', err);
            setError('Failed to log out. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleLogout}
                className={`bg-red-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading} // Disable button while loading
            >
                {loading ? 'Logging out...' : 'Logout'}
            </button>
            {error && <p className="mt-2 text-red-600">{error}</p>} {/* Display error if any */}
        </div>
    );
};

export default LogoutButton;
