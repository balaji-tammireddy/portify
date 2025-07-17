export default function UserDashboard({params}:any){
    return (
        <div>
            <h1>
            Dashboard
            </h1>
            <p>{params.id}</p>
        </div>
    )
}