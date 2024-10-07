import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function User() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = Cookies.get('authToken');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await axios.get('https://devsalman.tech/get-user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true, // This ensures cookies/credentials are sent
                });

                if (response.status === 200) {
                    setUser(response.data.user);
                } else {
                    console.log('Failed to fetch user');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);  // Empty dependency array ensures this runs once after the initial render

    if (loading) {
        return <div className="text-center text-gray-600">Loading user data...</div>;
    }

    if (!user) {
        return <div className="text-center text-red-600">No user data found</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">User Information</h1>
            <p className="text-gray-600"><strong>Full Name:</strong>{user[0].fullname}</p>
            <p className="text-gray-600"><strong>Email:</strong><a href={`mailto:${user[0].email}`}>{user[0].email}</a></p>
            <p className="text-gray-600"><strong>Verified:</strong> {user[0].is_verified ? 'Yes' : 'No'}</p>
        </div>
    );
}
