export default function RepoList({repo}){
    return (
        <div>
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