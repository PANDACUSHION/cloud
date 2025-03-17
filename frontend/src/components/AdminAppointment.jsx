import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const AdminAppointment = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusOptions] = useState(["PENDING", "CONFIRMED", "CANCELED", "COMPLETED"]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (isAdmin) {
            fetchAppointments();
        }
    }, [isAdmin]);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            const response = await axios.get("api/appointments/appointment", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 204) {
                setAppointments([]);
                setErrorMessage("");
            } else {
                setAppointments(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
            setErrorMessage("Failed to load appointments. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            await axios.put(
                `api/appointments/appointment/${appointmentId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAppointments((prevAppointments) =>
                prevAppointments.map((appointment) =>
                    appointment.id === appointmentId
                        ? { ...appointment, appointment_status: newStatus }
                        : appointment
                )
            );
        } catch (error) {
            console.error("Failed to update appointment status:", error);
            setErrorMessage("Failed to update appointment status. Please try again.");
        }
    };

    const deleteAppointment = async (appointmentId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            await axios.delete(`api/appointments/appointment`, {
                data: { appointmentId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAppointments((prevAppointments) =>
                prevAppointments.filter((appointment) => appointment.id !== appointmentId)
            );
        } catch (error) {
            console.error("Failed to delete appointment:", error);
            setErrorMessage("Failed to delete the appointment. Please try again.");
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-amber-100 text-amber-800";
            case "CONFIRMED":
                return "bg-green-100 text-green-800";
            case "CANCELED":
                return "bg-red-100 text-red-800";
            case "COMPLETED":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-5 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-xl shadow-md mb-5 border border-gray-100">
                <h2 className="text-2xl font-semibold text-center mb-6 text-indigo-700">
                    Manage Appointments
                </h2>

                <div className="space-y-6">
                    {appointments.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="mt-2 text-lg font-medium text-gray-600">No appointments yet</p>
                            <p className="mt-1 text-gray-500">Check back later or create a new appointment</p>
                        </div>
                    ) : (
                        appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden transition-all hover:shadow-lg"
                            >
                                <div className="p-5">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-gray-800">
                                            Appointment with {appointment.appointment_with}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.appointment_status)}`}>
                                            {appointment.appointment_status}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-gray-600">{appointment.description}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex items-center">
                                            <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            <span className="ml-2 text-gray-700">
                                                {new Date(appointment.appointment_time).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                            </svg>
                                            <span className="ml-2 text-gray-700">
                                                {appointment.appointment_type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col sm:flex-row gap-4">
                                        <select
                                            value={appointment.appointment_status}
                                            onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                                            className="select bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-grow"
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            onClick={() => deleteAppointment(appointment.id)}
                                            className="btn bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 py-2 px-4 rounded-md transition-colors duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAppointment;