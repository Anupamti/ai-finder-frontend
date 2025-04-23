"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState<"search" | "all">("all");

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setResults(data.matches || []);
    setLoading(false);
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Looking for a poet who loves sci-fi, mythology, and spoken word performances.
  // I'm searching for a developer who's into history, classical music, and literature.
  const Card = ({ person, showScore = false }: any) => {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">
          {person?.name ?? person?.metadata?.name}
        </h2>
        <p className="text-sm text-gray-600">
          {person?.bio ?? person?.metadata?.bio}
        </p>
        <div className="mt-2 text-xs text-gray-500 italic">
          Profession: {person?.profession ?? person?.metadata?.profession}
        </div>
        <div className="mt-1 text-sm text-gray-700">
          Interests:{" "}
          {person?.interests
            ? person?.interests?.join(", ")
            : person?.metadata?.interests
            ? person?.metadata?.interests?.join(", ")
            : ""}
        </div>
        {showScore && (
          <div className="mt-2 text-sm text-green-700">
            🔗 Match Score: {Math.round(person.score * 100)}%
          </div>
        )}
        {person?.explanation && (
          <details className="text-sm mt-2 text-gray-500 cursor-pointer">
            <summary className="hover:underline">Why this match?</summary>
            <p>{person?.explanation}</p>
          </details>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-blue-900">🤖 AI-Findr</h1>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "search"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border"
          }`}
          onClick={() => setActiveTab("search")}
        >
          🔍 Search
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border"
          }`}
          onClick={() => setActiveTab("all")}
        >
          🧑‍🤝‍🧑 All Users
        </button>
      </div>

      {activeTab === "search" && (
        <>
          <div className="w-full max-w-xl flex gap-2 mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find people who love jazz and think like Naval..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
            {results.length === 0 && !loading && (
              <p className="text-gray-500 italic">
                No matches found. Try a different prompt!
              </p>
            )}
            {results.map((person, i) => (
              <Card key={i} person={person} showScore />
            ))}
          </div>
        </>
      )}

      {activeTab === "all" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          {users.map((user, i) => (
            <Card key={i} person={user} />
          ))}
        </div>
      )}
    </main>
  );
}
