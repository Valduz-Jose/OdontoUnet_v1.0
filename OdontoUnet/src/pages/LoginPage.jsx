import { useForm } from "react-hook-form";
import { useAuth } from "../context/Auth.Context";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
function LoginPage() {
  const {register, handleSubmit, formState:{errors}} = useForm();
  const {signin, errors: signinErrors, isAuthenticated} = useAuth();
  const navigate = useNavigate()
  const onsubmit = handleSubmit((data)=>{
    // console.log(data);
    signin(data);
  });

  useEffect(()=>{
    if (isAuthenticated) navigate("/patients");
  },[isAuthenticated])

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        {
        signinErrors.map((error,i)=>(
          <div className="bg-red-500 p-2 text-white text-center m-2" key={i}>
            {error}
          </div>
        ))
      }
        <h1 className="text-3xl font-bold my-2">Login</h1>
        <form onSubmit={onsubmit}>
            
            <input type="email" {...register("email",{required:true})} className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" placeholder="Email"/>
            {
              errors.email && <p className="text-red-500">Email is Required</p>
            }
            <input type="password" {...register("password",{required:true})} className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" placeholder="Password"/>
            {
              errors.password && <p className="text-red-500">Password is Required</p>
            }
            <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded-md my-2">
                Iniciar Sesion
            </button>
        </form>
        <p className="flex gap-x-2 justify-between">
          No tienes una cuenta? <Link to="/register" className="text-sky-500"> Resgistrarse</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage