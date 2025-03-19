import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

import Home from './components/Home';
import NotFound from "./components/NotFound.jsx";
import UserProfile from "./components/UserProfile.jsx";
import Form from "./components/Form.jsx";
import Appointment from "./components/Appointment.jsx";
import Resource from "./components/Resource.jsx";
import AdminUsers from "./components/AdminUsers.jsx";
import MoodAnalytics from "./components/MoodAnalytics.jsx";
import AdminAppointment from "./components/AdminAppointment.jsx";
import { jwtDecode } from 'jwt-decode';

// Protected route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { user } = useAuth();
    const isAuthenticated = !!user || !!localStorage.getItem('token');

    // Check for both user state and token in localStorage
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If there's a token but no user state, we should refresh the user state
    // This handles cases where the app might have reloaded but token exists
    if (!user && localStorage.getItem('token')) {
        try {
            const token = localStorage.getItem('token');
            const decodedUser = jwtDecode(token);
            // You might need to wrap this in a useEffect if using directly in a component
            // For now, redirect to dashboard since they are authenticated
            return <Navigate to="/dashboard" replace />;
        } catch (error) {
            // Invalid token
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }
    }

    // Role required but user doesn't have it
    if (requiredRole && user && user.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Protected routes for registered users */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/user/:id"
                            element={
                                <ProtectedRoute>
                                    <UserProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/resources"
                            element={
                                <ProtectedRoute>
                                    <Resource />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/appointment"
                            element={
                                <ProtectedRoute>
                                    <Appointment />
                                </ProtectedRoute>
                            }
                        />

                        {/* Form route with role-based access */}
                        <Route
                            path="/form"
                            element={
                                <ProtectedRoute requiredRole={null}>
                                    <Form />
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected routes for admin users */}
                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminUsers />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/analytics"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <MoodAnalytics />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/appointments"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminAppointment />
                                </ProtectedRoute>
                            }
                        />

                        {/*/!* 404 route *!/*/}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
};

export default App;