import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    notifications: true,
    fontSize: 'medium',
  });

  // Load preferences from localStorage when the component mounts
  useEffect(() => {
    const storedPrefs = localStorage.getItem('appPreferences');
    if (storedPrefs) {
      setPreferences(JSON.parse(storedPrefs));
    }
  }, []);

  // Handle changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Save preferences to localStorage
  const savePreferences = () => {
    localStorage.setItem('appPreferences', JSON.stringify(preferences));
    alert('Preferences saved locally!');
  };

  // Reset preferences
  const resetPreferences = () => {
    localStorage.removeItem('appPreferences');
    setPreferences({
      theme: 'light',
      language: 'en',
      notifications: true,
      fontSize: 'medium',
    });
    alert('Preferences reset to default.');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Theme */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Theme</label>
        <select
          name="theme"
          value={preferences.theme}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>

      {/* Language */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Language</label>
        <select
          name="language"
          value={preferences.language}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="en">English</option>
          <option value="si">සිංහල</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="notifications"
            checked={preferences.notifications}
            onChange={handleChange}
          />
          Enable Notifications
        </label>
      </div>

      {/* Font Size */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Font Size</label>
        <select
          name="fontSize"
          value={preferences.fontSize}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="small">Small</option>
          <option value="medium">Medium (Default)</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={savePreferences}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Preferences
        </button>
        <button
          onClick={resetPreferences}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Settings;
