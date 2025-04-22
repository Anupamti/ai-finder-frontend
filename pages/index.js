'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setResults(data.matches);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 AIFindr</h1>

      <div className="w-full max-w-xl flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find people who love jazz and think like Naval..."
          className="flex-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="mt-8 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((person, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold">{person.name}</h2>
            <p className="text-sm text-gray-600">{person.bio}</p>
            <div className="mt-2 text-sm text-green-600">
              🔗 Match Score: {Math.round(person.score * 100)}%
            </div>
            <details className="text-sm mt-2 text-gray-500 cursor-pointer">
              <summary className="hover:underline">Why this match?</summary>
              <p>{person.reason || "Both enjoy jazz and share philosophical thinking."}</p>
            </details>
          </div>
        ))}
      </div>
    </main>
  );
}
