import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Appointment = () => {
    const { user } = useAuth();
    const isAuthenticated = !!user;
    const [formData, setFormData] = useState({
        description: "",
        appointmentTime: "",
        appointmentType: "CONSULTATION",
        appointmentWith: "",
    });
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    // Debugging: Log user details
    useEffect(() => {
        console.log("User:", user);
        console.log("Is Authenticated:", isAuthenticated);
    }, [user, isAuthenticated]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Format datetime to ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
    const formatDateTime = (dateTimeString) => {
        return new Date(dateTimeString).toISOString();
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (!isAuthenticated || user?.role !== "user") {
            setMessage({ type: "error", text: "You must be logged in as a user to create an appointment." });
            return;
        }

        // Validate input fields
        if (!formData.description || !formData.appointmentTime || !formData.appointmentWith) {
            setMessage({ type: "error", text: "All fields are required." });
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const requestData = {
                userId: user.id,
                description: formData.description,
                appointmentType: formData.appointmentType,
                appointmentWith: formData.appointmentWith,
                appointmentTime: formatDateTime(formData.appointmentTime),
            };

            const response = await axios.post("api/appointments/appointment", requestData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 201) {
                setMessage({ type: "success", text: "Appointment created successfully!" });
                setFormData({ description: "", appointmentTime: "", appointmentType: "CONSULTATION", appointmentWith: "" });

                setTimeout(() => {
                    setMessage({ type: "", text: "" });
                }, 3000);
            } else {
                throw new Error("Failed to create appointment.");
            }
        } catch (err) {
            setMessage({ type: "error", text: "Failed to create the appointment. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated || user?.role !== "user") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-lg shadow-md border border-gray-100 max-w-md w-full p-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-red-100 p-3 rounded-full">
                                <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
                        <p className="text-gray-600 mb-6">You must be logged in as a user to create an appointment.</p>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-indigo-600 p-6">
                    <h2 className="text-2xl font-bold text-white text-center">Create Appointment</h2>
                </div>

                <div className="p-6">
                    {message.text && (
                        <div className={`rounded-md p-4 mb-6 ${
                            message.type === "success"
                                ? "bg-green-50 border border-green-200"
                                : "bg-red-50 border border-red-200"
                        }`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {message.type === "success" ? (
                                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className={`text-sm ${message.type === "success" ? "text-green-800" : "text-red-800"}`}>
                                        {message.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Brief description of your appointment"
                            />
                        </div>

                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Appointment Time
                            </label>
                            <input
                                type="datetime-local"
                                name="appointmentTime"
                                value={formData.appointmentTime}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Appointment Type
                            </label>
                            <select
                                name="appointmentType"
                                value={formData.appointmentType}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="CONSULTATION">Consultation</option>
                                <option value="THERAPY">Therapy</option>
                                <option value="MEETING">Meeting</option>
                                <option value="CHECKUP">Checkup</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Appointment With
                            </label>
                            <input
                                type="text"
                                name="appointmentWith"
                                value={formData.appointmentWith}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Name of person or department"
                            />
                        </div>

                        <div className="w-full mt-8">
                            <button
                                type="submit"
                                className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium ${
                                    loading ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </div>
                                ) : (
                                    "Create Appointment"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Appointment;