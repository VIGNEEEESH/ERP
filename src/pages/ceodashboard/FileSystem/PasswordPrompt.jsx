import React, { useState } from 'react';

const PasswordPrompt = ({ onPasswordSubmit }) => {
  const [password, setPassword] = useState('');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onPasswordSubmit(password);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-gray-200 p-8 rounded shadow-lg">
        <label className="block mb-4">
          Password:
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="border rounded px-3 py-1 ml-2"
            required
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default PasswordPrompt;
