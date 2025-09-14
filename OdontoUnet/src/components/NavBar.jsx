import { Link } from "react-router-dom";
import { useAuth } from "../context/Auth.Context";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Clase base para botones
  const baseBtn = "px-4 py-2 rounded-md font-medium transition-colors";

  // Estilos de colores
  const btnStyles = {
    primary: "bg-sky-500 hover:bg-sky-600",
    secondary: "bg-indigo-500 hover:bg-indigo-600",
    success: "bg-green-500 hover:bg-green-600",
    warning: "bg-purple-500 hover:bg-purple-600",
    danger: "bg-red-500 hover:bg-red-600",
    info: "bg-blue-500 hover:bg-blue-600",
  };

  return (
    <nav className="bg-zinc-900 shadow-md text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Título */}
        <Link
          to={isAuthenticated ? "/" : "/"}
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
                      className={`${baseBtn} ${btnStyles.warning}`}
                    >
                      Insumos
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/estadisticas"
                      className={`${baseBtn} ${btnStyles.primary}`}
                    >
                      Estadísticas
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/carousel-admin"
                      className={`${baseBtn} ${btnStyles.info}`}
                    >
                      Carrusel
                    </Link>
                    <li>
                    <Link
                      to="/patients"
                      className={`${baseBtn} ${btnStyles.success}`}
                    >
                      Pacientes
                    </Link>
                  </li>
                  </li>
                </>
              )}

              {/* Opciones para Odontólogo */}
              {user.role === "odontologo" && (
                <>
                  <li>
                    <Link
                      to="/patients"
                      className={`${baseBtn} ${btnStyles.success}`}
                    >
                      Pacientes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/patients/new"
                      className={`${baseBtn} ${btnStyles.primary}`}
                    >
                      Añadir Paciente
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/citas"
                      className={`${baseBtn} ${btnStyles.secondary}`}
                    >
                      Nueva Cita
                    </Link>
                  </li>
                </>
              )}

              {/* Perfil - Para todos los usuarios autenticados */}
              <li>
                <Link
                  to="/profile"
                  className={`${baseBtn} ${btnStyles.info}`}
                >
                  Perfil
                </Link>
              </li>

              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  className={`${baseBtn} ${btnStyles.danger}`}
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
                  className={`${baseBtn} ${btnStyles.secondary}`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={`${baseBtn} ${btnStyles.primary}`}
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
                    <Link
                      to="/insumos"
                      onClick={() => setIsOpen(false)}
                      className={`${baseBtn} ${btnStyles.warning} block`}
                    >
                      Insumos
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/estadisticas"
                      onClick={() => setIsOpen(false)}
                      className={`${baseBtn} ${btnStyles.primary} block`}
                    >
                      Estadísticas
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/carousel-admin"
                      onClick={() => setIsOpen(false)}
                      className={`${baseBtn} ${btnStyles.info} block`}
                    >
                      Carrusel
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/patients"
                      className={`${baseBtn} ${btnStyles.success} block`}
                    >
                      Pacientes
                    </Link>
                  </li>
                </>
              )}

              {user.role === "odontologo" && (
                <>
                  <li>
                    <Link
                      to="/patients"
                      onClick={() => setIsOpen(false)}
                      className={`${baseBtn} ${btnStyles.success} block`}
                    >
                      Pacientes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/patients/new"
                      onClick={() => setIsOpen(false)}
                      className={`${baseBtn} ${btnStyles.primary} block`}
                    >
                      Añadir Paciente
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/citas"
                      onClick={() => setIsOpen(false)}
                      className={`${baseBtn} ${btnStyles.secondary} block`}
                    >
                      Nueva Cita
                    </Link>
                  </li>
                </>
              )}

              <li>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={`${baseBtn} ${btnStyles.info} block`}
                >
                  Perfil
                </Link>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className={`${baseBtn} ${btnStyles.danger} w-full text-left`}
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
                  className={`${baseBtn} ${btnStyles.secondary} block`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className={`${baseBtn} ${btnStyles.primary} block`}
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

export default NavBar;