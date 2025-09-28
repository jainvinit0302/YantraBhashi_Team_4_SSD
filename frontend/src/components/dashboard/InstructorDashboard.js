import React, { useState } from 'react';
import Header from '../common/Header';
import mockAPI from '../../services/mockAPI';
import '../../styles/components.css';

const InstructorDashboard = ({ user, onLogout }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [userId, setUserId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');

  // Fetch user by username and then submissions
  const handleSearch = async () => {
    setError('');
    setSubmissions([]);

    if (!usernameInput.trim()) {
      setError('Please enter a username');
      return;
    }

    try {
      const userResponse = await mockAPI.getUserByUsername(usernameInput.trim());
      if (!userResponse || !userResponse._id) {
        setError('User not found');
        return;
      }

      setUserId(userResponse._id);

      const submissionsResponse = await mockAPI.getSubmissionsByUserId(userResponse._id);
      setSubmissions(submissionsResponse);

      if (submissionsResponse.length === 0) {
        setError('No submissions found for this user');
      }
    } catch (e) {
      setError('Error fetching data, please try again');
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        title="Instructor Dashboard"
        user={user}
        onLogout={onLogout}
      />

      <div className="p-6">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="usernameInput">
            Enter Student Username:
          </label>
          <input
            type="text"
            id="usernameInput"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 w-full max-w-xs"
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <button
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSearch}
          >
            Search
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>

        {submissions.length > 0 ? (
          <pre style={{
            whiteSpace: 'pre-wrap',
            backgroundColor: '#f3f4f6',
            padding: '1rem',
            borderRadius: '8px',
            maxHeight: '70vh',
            overflowY: 'auto',
            fontSize: '0.875rem',
            fontFamily: 'monospace'
          }}>
            {JSON.stringify(submissions, null, 2)}
          </pre>
        ) : (
          <p>No submissions found.</p>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
