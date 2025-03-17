import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Color palette for chart
const chartColors = {
  primary: 'rgba(59, 130, 246, 1)', // Blue
  secondary: 'rgba(147, 51, 234, 1)', // Purple
  success: 'rgba(16, 185, 129, 1)', // Green
  danger: 'rgba(239, 68, 68, 1)', // Red
  warning: 'rgba(245, 158, 11, 1)', // Amber
  info: 'rgba(6, 182, 212, 1)', // Cyan
};

const MoodAnalytics = () => {
  const { user } = useAuth();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchMoodData();
    } else {
      navigate('/login');
    }
  }, [user, timeRange]);

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found');
      }

      // You could add query parameters to filter by date range
      const response = await axios.get(`/api/moods/user/moods?range=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMoods(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch mood data', err);
      setError('Failed to load mood data. Please try again later.');

      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    // Sort moods by date
    const sortedMoods = [...moods].sort((a, b) => new Date(a.moodDate) - new Date(b.moodDate));

    // Extract dates and mood scores
    const dates = sortedMoods.map(mood => new Date(mood.moodDate).toLocaleDateString());
    const scores = sortedMoods.map(mood => mood.moodScore);

    // Calculate 7-day moving average if enough data points
    let movingAverage = [];
    if (scores.length >= 7) {
      for (let i = 0; i < scores.length; i++) {
        if (i < 6) {
          movingAverage.push(null); // Not enough data for first 6 days
        } else {
          const sum = scores.slice(i-6, i+1).reduce((acc, val) => acc + val, 0);
          movingAverage.push(parseFloat((sum / 7).toFixed(2)));
        }
      }
    }

    return {
      labels: dates,
      datasets: [
        {
          label: 'Daily Mood',
          data: scores,
          borderColor: chartColors.primary,
          backgroundColor: `${chartColors.primary}20`,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        ...(movingAverage.length > 0 ? [{
          label: '7-Day Average',
          data: movingAverage,
          borderColor: chartColors.secondary,
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        }] : [])
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Your Mood Trends Over Time',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function(tooltipItems) {
            return new Date(tooltipItems[0].label).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          },
          label: function(tooltipItem) {
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
          font: {
            weight: 'bold',
          },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Mood Score",
          font: {
            weight: 'bold',
          },
        },
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  // Helper to get stats from mood data
  const getMoodStats = () => {
    if (!moods.length) return { avg: 0, high: 0, low: 0 };

    const scores = moods.map(mood => mood.moodScore);
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const high = Math.max(...scores);
    const low = Math.min(...scores);

    return { avg: avg.toFixed(1), high, low };
  };

  const renderLoading = () => (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-500">Loading your mood data...</p>
        </div>
      </div>
  );

  const renderError = () => (
      <div className="flex justify-center items-center h-64">
        <div className="alert alert-error shadow-lg max-w-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
          <button className="btn btn-sm btn-outline" onClick={fetchMoodData}>
            Try Again
          </button>
        </div>
      </div>
  );

  const renderEmptyState = () => (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No mood data yet</h3>
          <p className="text-gray-500 mb-4">Start tracking your mood to see your trends over time.</p>
          <button className="btn btn-primary" onClick={() => navigate('/track-mood')}>
            Track Your Mood
          </button>
        </div>
      </div>
  );

  const renderTimeRangeSelector = () => (
      <div className="flex gap-2 mb-4">
        <button
            className={`btn btn-sm ${timeRange === 'week' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTimeRange('week')}
        >
          Week
        </button>
        <button
            className={`btn btn-sm ${timeRange === 'month' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTimeRange('month')}
        >
          Month
        </button>
        <button
            className={`btn btn-sm ${timeRange === 'year' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTimeRange('year')}
        >
          Year
        </button>
      </div>
  );

  const renderStats = () => {
    const { avg, high, low } = getMoodStats();
    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-600 font-medium">Average Mood</p>
            <p className="text-2xl font-bold text-blue-700">{avg}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-green-600 font-medium">Highest Mood</p>
            <p className="text-2xl font-bold text-green-700">{high}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-600 font-medium">Lowest Mood</p>
            <p className="text-2xl font-bold text-purple-700">{low}</p>
          </div>
        </div>
    );
  };

  return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Mood Analytics</h2>
          {!loading && !error && moods.length > 0 && renderTimeRangeSelector()}
        </div>

        {loading && renderLoading()}
        {error && renderError()}
        {!loading && !error && moods.length === 0 && renderEmptyState()}

        {!loading && !error && moods.length > 0 && (
            <>
              {renderStats()}
              <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <div className="h-96">
                  <Line data={prepareChartData()} options={chartOptions} />
                </div>
              </div>
            </>
        )}
      </div>
  );
};

export default MoodAnalytics;