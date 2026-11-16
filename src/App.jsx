import {useState,useEffect} from 'react';
import UserCard from './components/UserCard';
import RepoList from './components/RepoList';
export default function App(){
  const [username, setUsername] = useState('octocat');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputSearch, setInputSearch] = useState('');
  const [repo, setRepo] = useState([]);
  const [repoSearch, setRepoSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('a-z');

useEffect(
 
  ()=> {
     setLoading(true)
  setError(null)
fetch(`https://api.github.com/users/${username}`)
.then(response => {
  if(!response.ok){
    throw new Error(`Error fetching username, ${response.status}`)
  }
  return response.json();
}).then(data => {
  setUser(data)
  setLoading(false)  
})
.catch(err => {
  setLoading(false)
  setError(err.message)
} )
fetch(`https://api.github.com/users/${username}/repos`)
.then(response => {
  if(!response.ok) throw new Error(`Error fetching ${response.status}`)
    return response.json();
}) .then(data => setRepo(data))
.catch(err => {
  setRepo([]);
}) 
},[username])


const filteredRepo = [...repo].filter(re => re.name.toLowerCase().includes(repoSearch.toLowerCase()))
.sort((a,b) => {
  if (sortOrder === "a-z") {
  return a.name.localeCompare(b.name);
} else if (sortOrder === "z-a") {
  return b.name.localeCompare(a.name);
} else if (sortOrder === "stars") {
  return b.stargazers_count - a.stargazers_count;
}
return 0;
} )

  return (
    <div>
      <form action="#"
      onSubmit={(e) => {
        e.preventDefault();
        setUsername(inputSearch)
      }}>
        <input type="text"
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
        />
       <button>Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user && <UserCard user = {user}/>}
      <form action="#">
         <input
      value={repoSearch}
       type="text"
       placeholder='Filter repo by name...'
       onChange={(e) => {
        setRepoSearch(e.target.value);
       }}
       />
       <select name="order" id="order"
       value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="a-z">A-Z</option>
        <option value="z-a">Z-A</option>
        <option value="stars">Stars</option>
       </select>
       <button type='button' style={{margin:"10px"}}>Search</button>
      </form>
     
      {repo && <RepoList repo = {filteredRepo}/>}
    </div>
  )
} 