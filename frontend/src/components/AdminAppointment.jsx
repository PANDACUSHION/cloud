import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook
import axios from "axios";

const AdminAppointment = () => {
    const { user } = useAuth(); // Access user from AuthContext
    const userId = user?.id; // Ensure userId is available
    const isAdmin = user?.role === "admin"; // Check if the user is an admin

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusOptions] = useState([
        "PENDING",
        "CONFIRMED",
        "CANCELED",
        "COMPLETED",
    ]);
    const [errorMessage, setErrorMessage] = useState(""); // For handling errors

    useEffect(() => {
        if (isAdmin) {
            fetchAppointments();
        }
    }, [isAdmin]);

    // Fetch all appointments from the server
    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token"); // Retrieve token from localStorage
            if (!token) {
                throw new Error("No token found");
            }

            const response = await axios.get("api/appointments/appointment", {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the request header
                },
            });

            if (response.status === 204) {
                // Handle 204 No Content response
                setAppointments([]); // Set appointments to an empty array
                setErrorMessage(""); // Clear any previous error messages
            } else {
                setAppointments(response.data); // Set appointments if data is found
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
            setErrorMessage("Failed to load appointments. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Handle status update for an appointment
    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            const token = localStorage.getItem("token"); // Retrieve token from localStorage
            if (!token) {
                throw new Error("No token found");
            }

            await axios.put(
                `api/appointments/appointment/${appointmentId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the request header
                    },
                }
            );

            // Update the appointment status in the local state
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

    // Handle deleting an appointment
    const deleteAppointment = async (appointmentId) => {
        try {
            const token = localStorage.getItem("token"); // Retrieve token from localStorage
            if (!token) {
                throw new Error("No token found");
            }

            await axios.delete(`api/appointments/appointment`, {
                data: { appointmentId },
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the request header
                },
            });

            // Remove the deleted appointment from the local state
            setAppointments((prevAppointments) =>
                prevAppointments.filter((appointment) => appointment.id !== appointmentId)
            );
        } catch (error) {
            console.error("Failed to delete appointment:", error);
            setErrorMessage("Failed to delete the appointment. Please try again.");
        }
    };

    // Render the loading state
    if (loading) {
        return <div>Loading appointments...</div>;
    }

    // Render error message if there is one
    if (errorMessage) {
        return <div className="error-message">{errorMessage}</div>;
    }

    return (
        <div className="container mx-auto p-5">
            <div className="bg-white p-5 rounded-lg shadow-md mb-5">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    Manage Appointments
                </h2>

                <div className="space-y-4">
                    {appointments.length === 0 ? (
                        // Display a friendly message when no appointments are found
                        <div className="text-center text-gray-500">
                            <p>No appointments yet.</p>
                            <p>Check back later or create a new appointment.</p>
                        </div>
                    ) : (
                        // Render the list of appointments
                        appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="card shadow-lg bg-base-100 mb-4"
                            >
                                <div className="card-body">
                                    <h3 className="card-title text-xl font-bold">
                                        Appointment with {appointment.appointment_with}
                                    </h3>
                                    <p>{appointment.description}</p>
                                    <p>
                                        <strong>Scheduled for:</strong>{" "}
                                        {new Date(appointment.appointment_time).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Type:</strong> {appointment.appointment_type}
                                    </p>

                                    {/* Appointment Status */}
                                    <div className="mt-4">
                                        <select
                                            value={appointment.appointment_status}
                                            onChange={(e) =>
                                                updateAppointmentStatus(
                                                    appointment.id,
                                                    e.target.value
                                                )
                                            }
                                            className="select select-bordered w-full"
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => deleteAppointment(appointment.id)}
                                        className="btn btn-danger mt-4"
                                    >
                                        Delete Appointment
                                    </button>
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