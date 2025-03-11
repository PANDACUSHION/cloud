import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import { useNavigate } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Helper function to generate random colors
const getRandomColor = (index) => {
  const colors = [
    'rgba(75, 192, 192, 1)', // Teal
    'rgba(255, 99, 132, 1)', // Red
    'rgba(54, 162, 235, 1)', // Blue
    'rgba(255, 159, 64, 1)', // Orange
    'rgba(153, 102, 255, 1)', // Purple
    'rgba(255, 205, 86, 1)', // Yellow
  ];
  return colors[index % colors.length];
};

const MoodAnalytics = () => {
  const { user } = useAuth(); // Get the authenticated user from AuthContext
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchMoodData(); // Fetch mood data only if the user is authenticated
    }
  }, [user]);

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Retrieve token from localStorage

      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('/api/moods/user/moods', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request header
        },
      });

      setMoods(response.data); // Set mood data
      setError(null);
    } catch (err) {
      console.error('Failed to fetch mood data', err);
      setError('Failed to load mood data. Please try again later.');

      // Redirect to login if unauthorized
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Group moods by userId
  const groupMoodsByUser = (moods) => {
    return moods.reduce((acc, mood) => {
      if (!acc[mood.userId]) {
        acc[mood.userId] = [];
      }
      acc[mood.userId].push(mood);
      return acc;
    }, {});
  };

  // Prepare chart data
  const prepareChartData = (moods) => {
    const groupedMoods = groupMoodsByUser(moods);

    // Get all unique dates across all users
    const allDates = Array.from(
        new Set(moods.map((mood) => new Date(mood.moodDate).toLocaleDateString()))
    ).sort((a, b) => new Date(a) - new Date(b));

    const datasets = Object.keys(groupedMoods).map((userId, index) => {
      const userMoods = groupedMoods[userId];
      const moodScores = allDates.map((date) => {
        const moodOnDate = userMoods.find(
            (mood) => new Date(mood.moodDate).toLocaleDateString() === date
        );
        return moodOnDate ? moodOnDate.moodScore : null; // Use null for missing data
      });

      return {
        label: `User ${userId}`,
        data: moodScores,
        borderColor: getRandomColor(index),
        backgroundColor: `${getRandomColor(index)}20`,
        fill: true,
        tension: 0.4,
      };
    });

    return {
      labels: allDates,
      datasets,
    };
  };

  const chartData = prepareChartData(moods);

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'User Mood Trends Over Time',
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Mood Score: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Mood Score",
        },
        min: 0,
        max: 10,
      },
    },
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
    );
  }

  return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Mood Analytics</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
  );
};

export default MoodAnalytics;