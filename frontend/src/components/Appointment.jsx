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
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="card w-96 bg-base-100 shadow-xl">
                    <div className="card-body items-center text-center">
                        <h2 className="card-title text-error">Access Denied</h2>
                        <p>You must be logged in as a user to create an appointment.</p>
                        <div className="card-actions mt-4">
                            <button className="btn btn-primary">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-base-100 rounded-lg shadow-xl overflow-hidden">
                <div className="bg-primary p-6">
                    <h2 className="text-2xl font-bold text-primary-content text-center">Create Appointment</h2>
                </div>

                <div className="p-6">
                    {message.text && (
                        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} mb-6`}>
                            <div>
                                <span>{message.text}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Description</span>
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                className="input input-bordered w-full focus:input-primary"
                                placeholder="Brief description of your appointment"
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Appointment Time</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="appointmentTime"
                                value={formData.appointmentTime}
                                onChange={handleInputChange}
                                required
                                className="input input-bordered w-full focus:input-primary"
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Appointment Type</span>
                            </label>
                            <select
                                name="appointmentType"
                                value={formData.appointmentType}
                                onChange={handleInputChange}
                                required
                                className="select select-bordered w-full focus:select-primary"
                            >
                                <option value="CONSULTATION">Consultation</option>
                                <option value="THERAPY">Therapy</option>
                                <option value="MEETING">Meeting</option>
                                <option value="CHECKUP">Checkup</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Appointment With</span>
                            </label>
                            <input
                                type="text"
                                name="appointmentWith"
                                value={formData.appointmentWith}
                                onChange={handleInputChange}
                                required
                                className="input input-bordered w-full focus:input-primary"
                                placeholder="Name of person or department"
                            />
                        </div>

                        <div className="form-control w-full mt-8">
                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Appointment"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Appointment;