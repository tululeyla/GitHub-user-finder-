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

      {user && <UserCard user = {user}/>}
       <RepoList repo = {repo}/>
    </div>
    
    
  )
}
export default App;