import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-sky-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <span className="text-blue-600 text-xl font-bold">BrighterDays</span>
                        </div>
                        <div className="hidden md:flex space-x-6">
                            <a href="#" className="text-blue-600 font-medium">Home</a>
                            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">About</a>
                            <a href="#resources" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">Resources</a>
                            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium">Contact</a>
                        </div>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-300"
                        >
                            Join Us
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-16 pb-24 px-4 bg-gradient-to-b from-sky-50 to-blue-100">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">You're Not Alone on This Journey</h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                        Finding light during dark times starts with a single step.
                        Our community is here to walk alongside you with support,
                        understanding, and practical tools for brighter days ahead.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-lg shadow-md transition-colors duration-300"
                        >
                            Join Our Community
                        </button>
                        <a
                            href="#resources"
                            className="bg-white hover:bg-gray-50 text-blue-600 px-6 py-3 rounded-lg text-lg shadow-sm border border-blue-100 transition-colors duration-300"
                        >
                            Explore Resources
                        </a>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">About Our Mission</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-center text-gray-800 mb-3">Community Support</h3>
                            <p className="text-gray-600 text-center">
                                Connect with others who understand what you're going through in a safe,
                                judgment-free environment where shared experiences lead to healing.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-center text-gray-800 mb-3">Evidence-Based Tools</h3>
                            <p className="text-gray-600 text-center">
                                Access practical techniques and exercises developed by mental health professionals
                                to help manage symptoms and build resilience day by day.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-center text-gray-800 mb-3">Educational Resources</h3>
                            <p className="text-gray-600 text-center">
                                Understand depression better through expert-curated content that empowers you
                                with knowledge and strategies for long-term wellness.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 px-4 bg-sky-100">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Stories of Hope</h2>
                    <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                        <p className="text-gray-600 italic mb-6">
                            "Finding this community changed everything for me. For the first time, I didn't feel like I had to face depression alone.
                            The daily practices and support from others who truly understand gave me hope when I needed it most."
                        </p>
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-blue-600 font-bold">MB</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Maria B.</p>
                                <p className="text-sm text-gray-500">Member since 2023</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resources Preview */}
            <section id="resources" className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Helpful Resources</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Daily Wellness Practices</h3>
                            <p className="text-gray-600 mb-6">
                                Simple but effective exercises you can incorporate into your routine to build resilience and improve mood.
                            </p>
                            <a href="#" className="text-blue-600 font-medium hover:underline">Learn more →</a>
                        </div>

                        <div className="bg-orange-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-orange-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Crisis Support</h3>
                            <p className="text-gray-600 mb-6">
                                Immediate resources and helplines available 24/7 when you need someone to talk to right away.
                            </p>
                            <a href="#" className="text-orange-600 font-medium hover:underline">View resources →</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-red-400 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Begin Your Journey Toward Brighter Days</h2>
                    <p className="text-xl mb-10 opacity-90">
                        Join our supportive community today and take the first step toward healing.
                    </p>
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg text-lg font-medium shadow-md transition-colors duration-300"
                    >
                        Join Us Today
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-700 text-white py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">BrighterDays</h3>
                            <p className="text-gray-300">
                                Supporting your mental health journey with community, resources, and hope.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Home</a></li>
                                <li><a href="#about" className="text-gray-300 hover:text-white transition-colors duration-300">About</a></li>
                                <li><a href="#resources" className="text-gray-300 hover:text-white transition-colors duration-300">Resources</a></li>
                                <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-4">Crisis Support</h4>
                            <p className="text-gray-300 mb-2">If you need immediate help:</p>
                            <p className="font-bold text-lg text-white mb-1">988</p>
                            <p className="text-gray-300 text-sm">Suicide & Crisis Lifeline</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400 text-sm">
                        <p>© 2025 BrighterDays. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;