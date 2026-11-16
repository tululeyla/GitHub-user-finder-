export default function UserCard({user}){
    return (
        <div>
          <img
            src={user.avatar_url}
            alt="User Avatar"
            width="100"
            style={{ borderRadius: "50%" }}
          />
          <h2>{user.name || user.login}</h2>
          <p>{user.bio || "no bio"}</p>
          <p>Public repos: {user.public_repos}</p>
          <p>Followers {user.followers}</p>
          <p>Following: {user.following}</p>
          <a href={user.html_url} target="_blank" rel="noreferrer">Go to Profile</a>
        </div>
    )
}