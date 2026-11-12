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
          

          
        </div>
    )
}