import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    // Determine user type based on JWT decoded data
    const getUserType = () => {
        if (!user) return "unregistered";

        // Check for admin role in user object
        // Adjust this logic based on how roles are stored in your JWT payload
        return user.role === "admin" ? "admin" : "registered";
    };

    const userType = getUserType();

    return (
        <nav className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="text-xl font-bold">MyApp</div>
                    </div>

                    <div className="flex items-center">
                        {/* Unregistered User Navigation Links */}
                        {userType === "unregistered" && (
                            <div className="flex space-x-4">
                                <a href="/login" className="px-3 py-2 rounded-md hover:bg-gray-700">Login</a>
                                <a href="/signup" className="px-3 py-2 rounded-md hover:bg-gray-700">Sign Up</a>
                            </div>
                        )}

                        {/* Registered User Navigation Links */}
                        {userType === "registered" && (
                            <div className="flex space-x-4">
                                <a href="/dashboard" className="px-3 py-2 rounded-md hover:bg-gray-700">Dashboard</a>
                                <a href={`/user/${user?.id}`} className="px-3 py-2 rounded-md hover:bg-gray-700">
                                    Profile
                                </a>
                                <a href="/form" className="px-3 py-2 rounded-md hover:bg-gray-700">Forums</a>
                                <a href="/resources" className="px-3 py-2 rounded-md hover:bg-gray-700">Resources</a>
                                <a href="/appointment" className="px-3 py-2 rounded-md hover:bg-gray-700">Appointments</a>
                                <button
                                    onClick={logout}
                                    className="px-3 py-2 rounded-md hover:bg-gray-700"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                        {/* Admin User Navigation Links */}
                        {userType === "admin" && (
                            <div className="flex space-x-4">
                                <a href="/users" className="px-3 py-2 rounded-md hover:bg-gray-700">Users</a>
                                <a href="/analytics" className="px-3 py-2 rounded-md hover:bg-gray-700">Analytics</a>
                                <a href="/form" className="px-3 py-2 rounded-md hover:bg-gray-700">Forums</a>
                                <a href="/appointments" className="px-3 py-2 rounded-md hover:bg-gray-700">Appointments</a>
                                <button
                                    onClick={logout}
                                    className="px-3 py-2 rounded-md hover:bg-gray-700"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Show user info when logged in */}
                    {user && (
                        <div className="flex items-center ml-4">
              <span className="text-sm text-gray-300">
                {user.name || user.email || "User"}
              </span>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;