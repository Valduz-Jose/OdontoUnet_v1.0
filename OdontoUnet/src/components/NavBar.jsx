import { Link } from "react-router-dom"
import { useAuth } from "../context/Auth.Context"

function NavBar() {

    const {isAuthenticated,logout,user} = useAuth()

  return (
    <nav className="bz-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg">
        <Link to={
            isAuthenticated ? "/tasks" : "/"
        }>
            <h1 className=" text-2xl font-bold">Tasks Manager</h1>
        </Link>
        <ul className="flex gap-x-2">
            {isAuthenticated ? (
                <>
                    <li>
                    Bienvenid@ {user.username}
                    </li>
                    <li>
                        <Link to='/add-task'
                        className="bg-indigo-500 px-4 py-1 rounded-sm">Add Task</Link>
                    </li>
                    <li>
                        <Link 
                        to="/" 
                        onClick={()=>{
                            logout();
                        }}>Logout</Link>
                    </li>
                </>
            ) : (
            <>
                <li>
                <Link to='/login'
                className="bg-indigo-500 px-4 py-1 rounded-sm">Login</Link>
                </li>
                <li>
                    <Link to='/register'
                    className="bg-indigo-500 px-4 py-1 rounded-sm">Register</Link>
                </li>
            </>
            )}
        </ul>
    </nav>
  )
}

export default NavBar