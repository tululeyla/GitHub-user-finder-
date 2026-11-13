import { useState, useEffect } from "react";
import UserCard from "./components/UserCard";
import RepoList from "./components/RepoList";
function App(){

  const [user, setUser ] = useState(null);
  const [ username, setUsername] = useState("octocat");
  const [loading , setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputSearch, setInputSearch] = useState('');
  const [repo, setRepo] = useState([]);
  const [repoSearch, setRepoSearch] =useState('');
  const [sortOrder, setSortOrder] = useState('a-z');

  useEffect(() => {
    setLoading(true);
    setError(null);
  fetch(`https://api.github.com/users/${username}`)
    .then(response =>{
      if(!response.ok){
      throw new Error(`Error fetching ${response.status}`)
      }
      return response.json()
    })
    .then(data =>{
      setUser(data)
      setLoading(false)
    })
    .catch((err) => {
       setError(err.message)
       setUser(null)
       setLoading(false)
    }
      
    )
    fetch(`https://api.github.com/users/${username}/repos`)
    .then(response => {
      if(!response.ok){
        throw new Error(`Error fetching repo ${response.status}`)
      }
      return response.json();
    })
    .then(data => {
      setRepo(data)
      console.log(data)})
    .catch((err) => {
      setError(err.message)
      setRepo([])
      setLoading(false)
    })
     
    
  },[username])
const filteredRepos = [...repo].filter(re=>re.name.toLowerCase().includes(repoSearch.toLowerCase()))
.sort((a,b) => {
 if (sortOrder === "a-z") {
  return a.name.localeCompare(b.name);
} else if (sortOrder === "z-a") {
  return b.name.localeCompare(a.name);
} else if (sortOrder === "stars") {
  return b.stargazers_count - a.stargazers_count;
}
})
  return (
    <div>
      <form action="#" onSubmit={
        (e)=>{
          e.preventDefault();
          setUsername(inputSearch)
        }}>
        <input 
      type="text"
      placeholder="Enter username"
      value={inputSearch}
      onChange={
        (e) => {
          setInputSearch(e.target.value)
        }
      }
      />

         <button type="submit">Search</button>
      </form>
       {loading && <p>Loading...</p> }
       {error && <p style={ { color: "red"}}>{error}</p>}

      {user && <UserCard user = {user}/>}
      <input 
      value={repoSearch}
      type="text"
      placeholder="filter repo by name..."
      onChange={(e) => setRepoSearch(e.target.value) }
      />
      <button type="button"
      onClick={() => setRepoSearch('')}
      >Clear</button>
      <select
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}>
        <option value="a-z">A to Z</option>
        <option value="z-a">Z to A</option>
        <option value="stars">Most Stars</option>
      </select>
      {/* Show how many repos match the current filter */}
      <p style={{ fontSize: "14px", color: "#666" }}>
        Showing {filteredRepos.length} repositories
      </p>

       <RepoList repo = {filteredRepos}/>
    </div>
    
    
  )
}
export default App;