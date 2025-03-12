import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Determine user type based on JWT decoded data
    const getUserType = () => {
        if (!user) return "unregistered";
        return user.role === "admin" ? "admin" : "registered";
    };

    const userType = getUserType();

    return (
        <div className="navbar bg-base-100 shadow-lg">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </label>
                    {isMenuOpen && (
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {userType === "unregistered" && (
                                <>
                                    <li><Link to="/login">Login</Link></li>
                                    <li><Link to="/signup">Sign Up</Link></li>
                                </>
                            )}

                            {userType === "registered" && (
                                <>
                                    <li><Link to="/dashboard">Dashboard</Link></li>
                                    <li><Link to={`/user/${user?.id}`}>Profile</Link></li>
                                    <li><Link to="/form">Forums</Link></li>
                                    <li><Link to="/resources">Resources</Link></li>
                                    <li><Link to="/appointment">Appointments</Link></li>
                                    <li><button onClick={logout}>Logout</button></li>
                                </>
                            )}

                            {userType === "admin" && (
                                <>
                                    <li><Link to="/users">Users</Link></li>
                                    <li><Link to="/analytics">Analytics</Link></li>
                                    <li><Link to="/form">Forums</Link></li>
                                    <li><Link to="/appointments">Appointments</Link></li>
                                    <li><button onClick={logout}>Logout</button></li>
                                </>
                            )}
                        </ul>
                    )}
                </div>
                <Link to="/" className="btn btn-ghost normal-case text-xl">
                    <span className="text-primary font-bold">My</span>App
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {userType === "unregistered" && (
                        <>
                            <li><Link to="/login" className="btn btn-ghost">Login</Link></li>
                            <li><Link to="/signup" className="btn btn-primary">Sign Up</Link></li>
                        </>
                    )}

                    {userType === "registered" && (
                        <>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to={`/user/${user?.id}`}>Profile</Link></li>
                            <li><Link to="/form">Forums</Link></li>
                            <li><Link to="/resources">Resources</Link></li>
                            <li><Link to="/appointment">Appointments</Link></li>
                        </>
                    )}
                    {userType === "admin" && (
                        <>
                            <li><Link to="/users">Users</Link></li>
                            <li><Link to="/analytics">Analytics</Link></li>
                            <li><Link to="/form">Forums</Link></li>
                            <li><Link to="/appointments">Appointments</Link></li>
                        </>
                    )}
                </ul>
            </div>

            <div className="navbar-end">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-primary-content font-bold">
                                    {(user.name || user.email || "User").charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <Link to={`/user/${user?.id}`} className="justify-between">
                                    Profile
                                    <span className="badge">{userType === "admin" ? "Admin" : "User"}</span>
                                </Link>
                            </li>
                            <li><button onClick={logout}>Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary">Get Started</Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;