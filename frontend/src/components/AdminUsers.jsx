import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Fix the API URL by adding a leading slash

            const response = await axios.get('/api/users/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsers(response.data);
            setError(null);
        } catch (error) {
            console.error('Failed to fetch users', error);
            setError('Failed to load users. Please try again later.');

            // If unauthorized, redirect to login
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');

            // Fix the API URL by adding a leading slash
            await axios.delete(`/api/users/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchUsers(); // Refresh the list after deletion
        } catch (error) {
            console.error('Failed to delete user', error);
            alert('Failed to delete user. Please try again.');

            // If unauthorized, redirect to login
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    if (loading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {users && users.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default AdminUsers;