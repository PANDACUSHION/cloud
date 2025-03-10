import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    // Random funny messages about being lost
    const funnyMessages = [
        "Looks like you took a wrong turn at Albuquerque!",
        "Houston, we have a problem. This page doesn't exist!",
        "This page is playing hide and seek... and it's winning.",
        "404: Page not found. It probably went to get coffee.",
        "Oops! Either you can't type, or we can't code. Let's blame the developers!",
        "This page is like my car keys... nowhere to be found when I need them.",
        "Congrats! You've reached the edge of our website. Here be dragons!",
        "Plot twist: The page was never here to begin with!",
        "Our server looked everywhere and couldn't find this page. It's probably at the beach."
    ];

    // Pick a random message
    const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full text-center">
                <div className="text-9xl font-extrabold text-blue-500 mb-8">404</div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Page Not Found
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                    {randomMessage}
                </p>

                {/* Funny illustration */}
                <div className="mb-8 text-8xl">
                    ¯\_(ツ)_/¯
                </div>

                <div className="space-y-4">
                    <p className="text-gray-600">
                        While we figure out where this page went, you might want to:
                    </p>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
                        <Link
                            to="/"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Go Home
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;