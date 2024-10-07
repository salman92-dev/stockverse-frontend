'use client';
import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import Cookies from 'js-cookie'; 

const AccountPage = () => {
    const router = useRouter(); // Initialize router for navigation

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        
        if (!confirmDelete) return; // Exit if the user cancels

        const response = await fetch(`https://devsalman.tech/delete-account`, { // Include userId in URL
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Use 'include' for cookie-based auth
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            Cookies.remove('your_cookie_name'); 
            router.push('/'); // Adjust the redirect path as needed
        } else {
            alert(data.message || 'Error deleting account. Please try again.');
        }
    };

    return (
        <div>
            <h1>Account Page</h1>
            <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    );
};

export default AccountPage;
