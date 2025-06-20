"use client";

import { useState } from "react";

export default function TestCSRFPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testWithoutCSRF = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          navn: "Test User",
          telefon: "12345678",
          tekst: "This is a test submission without CSRF token"
        })
      });

      const result = await response.json();
      setTestResults({
        type: "Without CSRF Token",
        status: response.status,
        response: result,
        expected: "Should be blocked with 403 status"
      });
    } catch (error) {
      setTestResults({
        type: "Without CSRF Token",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
    setLoading(false);
  };

  const testWithCSRF = async () => {
    setLoading(true);
    try {
      // First get a CSRF token
      const tokenResponse = await fetch('/api/csrf-token');
      const tokenData = await tokenResponse.json();

      // Then try to submit with the token
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          navn: "Test User",
          telefon: "12345678",
          tekst: "This is a test submission WITH CSRF token",
          _csrf: tokenData.csrfToken
        })
      });

      const result = await response.json();
      setTestResults({
        type: "With CSRF Token",
        status: response.status,
        response: result,
        expected: "Should succeed with 200 status"
      });
    } catch (error) {
      setTestResults({
        type: "With CSRF Token",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">CSRF Protection Test</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testWithoutCSRF}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold"
          >
            {loading ? "Testing..." : "Test WITHOUT CSRF Token (Should Fail)"}
          </button>
          
          <button
            onClick={testWithCSRF}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold ml-4"
          >
            {loading ? "Testing..." : "Test WITH CSRF Token (Should Succeed)"}
          </button>
        </div>

        {testResults && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Results: {testResults.type}</h2>
            
            <div className="space-y-2">
              <p><strong>Expected:</strong> {testResults.expected}</p>
              {testResults.status && (
                <p><strong>Status:</strong> 
                  <span className={testResults.status === 403 ? "text-red-400" : testResults.status === 200 ? "text-green-400" : "text-yellow-400"}>
                    {testResults.status}
                  </span>
                </p>
              )}
              {testResults.response && (
                <div>
                  <strong>Response:</strong>
                  <pre className="bg-gray-700 p-3 rounded mt-2 overflow-auto">
                    {JSON.stringify(testResults.response, null, 2)}
                  </pre>
                </div>
              )}
              {testResults.error && (
                <p><strong>Error:</strong> <span className="text-red-400">{testResults.error}</span></p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-900 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How to interpret results:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Without CSRF Token:</strong> Should return status 403 with "CSRF token missing" error</li>
            <li><strong>With CSRF Token:</strong> Should return status 200 with "Form submitted successfully" message</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
