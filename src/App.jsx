import { useState, useEffect } from "react";

function App(){

  const [user, setUser ] = useState(null);
  const [ username, setUsername] = useState("octocat");
  const [loading , setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputSearch, setInputSearch] = useState('');
  const [repo, setRepo] = useState([]);

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

      {user && (
        <div>
          <img
            src={user.avatar_url}
            alt="User Avatar"
            width="100"
            style={{ borderRadius: "50%" }}
          />
          <h2>{user.name || user.login}</h2>
          <p>{user.bio || "no bio"}</p>
          

          
        </div>
        
      )}
       {repo.length > 0 ? (
  <ul>
    {repo.map((re) => (
      <li key={re.id} style={{ marginBottom: "10px" }}>
        <a href={re.html_url} target="_blank" rel="noreferrer">
          <strong>{re.name}</strong>
        </a>
        <p style={{ margin: "2px 0", fontSize: "14px", color: "#555" }}>
          {re.description || "No description provided"}
        </p>
      </li>
    ))}
  </ul>
) : (
  <p>No repositories found</p>
)}
    </div>
    
    
  )
}
export default App;