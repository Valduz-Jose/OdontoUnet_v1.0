import { Link } from "react-router-dom"
import { useAuth } from "../context/Auth.Context"
import { useState } from "react";
import {Menu, X} from "lucide-react";

function NavBar() {

    const {isAuthenticated,logout,user} = useAuth();
    const [isOpen, setIsOpen]=useState(false);

    const handleLogout = () =>{
        logout();
        setIsOpen(false);
    }

 return (
    <nav className="bg-zinc-900 shadow-md text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Título */}
        <Link
          to={isAuthenticated ? "/patients" : "/"}
          className="text-2xl font-bold tracking-wide"
        >
          Sistema Odontológico
        </Link>

        {/* Botón menú móvil */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú en escritorio */}
        <ul className="hidden md:flex gap-x-4 items-center">
          {isAuthenticated ? (
            <>
              <li className="text-sm">👋 Bienvenid@ {user.username}</li>

              {/* Opciones para Admin */}
              {user.role === "admin" && (
                <>
                  <li>
                    <Link
                      to="/insumos"
                      className="hover:text-sky-400 transition-colors"
                    >
                      Insumos
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/estadisticas"
                      className="hover:text-sky-400 transition-colors"
                    >
                      Estadísticas
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/finanzas"
                      className="hover:text-sky-400 transition-colors"
                    >
                      Finanzas
                    </Link>
                  </li>
                </>
              )}

              {/* Opciones para Odontólogo */}
              {user.role === "odontologo" && (
                <>
                  <li>
                    <Link
                      to="/patients"
                      className="hover:text-sky-400 transition-colors"
                    >
                      Pacientes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/patients/new"
                      className="bg-sky-500 px-3 py-1 rounded-md hover:bg-sky-600 transition"
                    >
                      Añadir Paciente
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/citas/new"
                      className="bg-indigo-500 px-3 py-1 rounded-md hover:bg-indigo-600 transition"
                    >
                      Nueva Cita
                    </Link>
                  </li>
                </>
              )}

              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="bg-indigo-500 px-4 py-1 rounded-md hover:bg-indigo-600 transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="bg-sky-500 px-4 py-1 rounded-md hover:bg-sky-600 transition"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Menú en móvil */}
      {isOpen && (
        <ul className="md:hidden bg-zinc-800 px-4 py-4 space-y-3">
          {isAuthenticated ? (
            <>
              <li className="text-sm">👋 Bienvenid@ {user.username}</li>

              {user.role === "admin" && (
                <>
                  <li>
                    <Link to="/insumos" onClick={() => setIsOpen(false)}>
                      Insumos
                    </Link>
                  </li>
                  <li>
                    <Link to="/estadisticas" onClick={() => setIsOpen(false)}>
                      Estadísticas
                    </Link>
                  </li>
                  <li>
                    <Link to="/finanzas" onClick={() => setIsOpen(false)}>
                      Finanzas
                    </Link>
                  </li>
                </>
              )}

              {user.role === "odontologo" && (
                <>
                  <li>
                    <Link to="/patients" onClick={() => setIsOpen(false)}>
                      Pacientes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/patients/new"
                      onClick={() => setIsOpen(false)}
                      className="block bg-sky-500 px-3 py-1 rounded-md hover:bg-sky-600 transition"
                    >
                      Añadir Paciente
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/citas/new"
                      onClick={() => setIsOpen(false)}
                      className="block bg-indigo-500 px-3 py-1 rounded-md hover:bg-indigo-600 transition"
                    >
                      Nueva Cita
                    </Link>
                  </li>
                </>
              )}

              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block bg-indigo-500 px-4 py-1 rounded-md hover:bg-indigo-600 transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block bg-sky-500 px-4 py-1 rounded-md hover:bg-sky-600 transition"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}

export default NavBar