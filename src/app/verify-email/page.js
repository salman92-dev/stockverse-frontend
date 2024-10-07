'use client';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode'; // Ensure you import jwtDecode correctly

const VerifyEmail = () => {
    const router = useRouter();

    // Retrieve and decode the token from cookies
    const token = Cookies.get('authToken');
    let decodedToken;

    try {
        if (token) {
            decodedToken = jwtDecode(token);
            console.log(decodedToken.id); // Log the decoded token for debugging
        } else {
            console.error('Token not found');
        }
    } catch (error) {
        console.error('Invalid token or decoding failed', error);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-semibold mb-4 text-center text-gray-900">Verify Your Email</h1>
                <p className="text-gray-700 text-center mb-4">
                    We have sent a verification email to your registered email address. Please check your inbox and click the link in the email to verify your account.
                </p>
                <p className="text-gray-700 text-center mb-4">
                    If you don't see the email, it might be in your spam folder. 
                    <a 
                        href="https://mail.google.com/mail/u/0/#inbox" 
                        className="text-blue-500 hover:underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        Click here to check your Gmail inbox.
                    </a>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
