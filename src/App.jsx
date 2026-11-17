import { useState, useEffect } from "react";
import UserCard from "./components/UserCard";
import RepoList from "./components/RepoList";
import useDebounce from "./hooks/useDebounce";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [repo, setRepo] = useState([]);
  const [repoSearch, setRepoSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("a-z");
  const debouncedSearchTerm = useDebounce(inputSearch, 500);

  useEffect(() => {
    // If the input is cleared, reset everything and exit early
    if (!debouncedSearchTerm) {
      setUser(null);
      setRepo([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    setLoading(true);
    setError(null);
    // Clear previous user data immediately while loading a new search
    setUser(null); 
    setRepo([]);

    fetch(`https://api.github.com/users/${debouncedSearchTerm}`, { signal })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("User not found. Please check the username and try again.");
          }
          throw new Error(`Error fetching user, status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setLoading(false);
        setError(err.message);
        setUser(null); // Ensure user card is cleared on error
      });

    fetch(`https://api.github.com/users/${debouncedSearchTerm}/repos`, { signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Error fetching repos`);
        return response.json();
      })
      .then((data) => setRepo(data))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setRepo([]);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedSearchTerm]);

  const filteredRepo = [...repo]
    .filter((re) => re.name.toLowerCase().includes(repoSearch.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "a-z") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "z-a") {
        return b.name.localeCompare(a.name);
      } else if (sortOrder === "stars") {
        return b.stargazers_count - a.stargazers_count;
      }
      return 0;
    });

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif", padding: "20px" }}>
      <h2>GitHub User Finder</h2>
      
      <input
        type="text"
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
        placeholder="Search GitHub username..."
        style={{ width: "100%", padding: "10px", fontSize: "16px", marginBottom: "15px" }}
      />

      {loading && <p style={{ color: "#666" }}>Searching GitHub...</p>}
      
      {error && (
        <div style={{ padding: "12px", backgroundColor: "#ffe6e6", color: "#d9534f", borderRadius: "4px", marginBottom: "15px" }}>
          {error}
        </div>
      )}

      {user && <UserCard user={user} />}

      {user && (
        <div style={{ marginTop: "25px" }}>
          <h3>Repositories ({filteredRepo.length})</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <input
              value={repoSearch}
              type="text"
              placeholder="Filter repo by name..."
              onChange={(e) => setRepoSearch(e.target.value)}
              style={{ flex: 1, padding: "8px" }}
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ padding: "8px" }}
            >
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
              <option value="stars">Stars</option>
            </select>
          </div>

          {filteredRepo.length === 0 ? (
            <p style={{ color: "#777" }}>No repositories match your filter.</p>
          ) : (
            <RepoList repo={filteredRepo} />
          )}
        </div>
      )}
    </div>
  );
}