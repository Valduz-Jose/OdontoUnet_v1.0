import { Link } from "react-router-dom";
import { useAuth } from "../context/Auth.Context";
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, Users } from "lucide-react";

const AppLogo = () => (
  <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
    {/* Asegúrate de que tu logo esté en la carpeta /public/logo.jpg */}
    <img
      src="/logounet1.png"
      alt="Logo OdontoUNET"
      className="h-8 w-auto" // Ajusta la altura aquí (h-8 = 32px)
    />
    <Link
      to="/"
      className="text-2xl font-bold tracking-wide text-pastel-primary hover:text-blue-600 transition-colors"
      title="Ir al inicio"
    >
      Sistema Odontológico
    </Link>
  </Link>
);

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Cargar tema del localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.setAttribute(
      "data-theme",
      shouldBeDark ? "dark" : "light"
    );
  }, []);

  // Cambiar tema
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const themeValue = newTheme ? "dark" : "light";
    localStorage.setItem("theme", themeValue);
    document.documentElement.setAttribute("data-theme", themeValue);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="card-pastel border-b-2 border-pastel-mint-dark shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Título - SIEMPRE va a home */}

        <AppLogo />

        {/* Botón menú móvil */}
        <button
          className="md:hidden text-pastel-primary hover:text-blue-600 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú en escritorio */}
        <ul className="hidden md:flex gap-x-3 items-center">
          {isAuthenticated ? (
            <>
              <li className="text-sm text-pastel-secondary">
                👋 Hola, {user.username}
              </li>

              {/* Botón Pacientes - TODOS los usuarios autenticados */}
              <li>
                <Link
                  to="/patients"
                  className="btn-pastel-success px-4 py-2 rounded-md font-medium transition-pastel flex items-center gap-2"
                  title="Ver lista de pacientes"
                >
                  <Users size={16} />
                  Pacientes
                </Link>
              </li>

              {/* Opciones para Admin */}
              {user.role === "admin" && (
                <>
                  <li>
                    <Link
                      to="/insumos"
                      className="btn-pastel-warning px-4 py-2 rounded-md font-medium transition-pastel"
                      title="Gestionar inventario de insumos médicos"
                    >
                      Insumos
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/estadisticas"
                      className="btn-pastel-primary px-4 py-2 rounded-md font-medium transition-pastel"
                      title="Ver estadísticas y reportes del sistema"
                    >
                      Estadísticas
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/carousel-admin"
                      className="btn-pastel-info px-4 py-2 rounded-md font-medium transition-pastel"
                      title="Gestionar imágenes del carrusel de inicio"
                    >
                      Carrusel
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/doctores"
                      className="btn-pastel-secondary px-4 py-2 rounded-md font-medium transition-pastel"
                      title="Ver perfiles de doctores registrados"
                    >
                      Doctores
                    </Link>
                  </li>
                </>
              )}

              {/* Opciones para Odontólogo */}
              {user.role === "odontologo" && (
                <>
                  <li>
                    <Link
                      to="/patients/new"
                      className="btn-pastel-primary px-4 py-2 rounded-md font-medium transition-pastel"
                      title="Registrar un nuevo paciente"
                    >
                      Nuevo Paciente
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/citas"
                      className="btn-pastel-secondary px-4 py-2 rounded-md font-medium transition-pastel"
                      title="Crear una nueva cita médica"
                    >
                      Nueva Cita
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="btn-pastel-info px-4 py-2 rounded-md font-medium transition-pastel"
                      title="Ver y editar mi perfil"
                    >
                      Perfil
                    </Link>
                  </li>
                </>
              )}

              {/* Perfil - Para todos los usuarios autenticados
              <li>
                <Link
                  to="/profile"
                  className="btn-pastel-info px-4 py-2 rounded-md font-medium transition-pastel"
                  title="Ver y editar mi perfil"
                >
                  Perfil
                </Link>
              </li> */}

              {/* Cambiar tema */}
              <li>
                <button
                  onClick={toggleTheme}
                  className="btn-pastel-secondary px-3 py-2 rounded-md transition-pastel"
                  title={
                    isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
                  }
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </li>

              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  className="btn-pastel-danger px-4 py-2 rounded-md font-medium transition-pastel"
                  title="Cerrar sesión"
                >
                  Salir
                </button>
              </li>
            </>
          ) : (
            <>
              {/* Cambiar tema para usuarios no autenticados */}
              <li>
                <button
                  onClick={toggleTheme}
                  className="btn-pastel-secondary px-3 py-2 rounded-md transition-pastel"
                  title={
                    isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
                  }
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </li>
              <li>
                <Link
                  to="/login"
                  className="btn-pastel-secondary px-4 py-2 rounded-md font-medium transition-pastel"
                  title="Iniciar sesión"
                >
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="btn-pastel-primary px-4 py-2 rounded-md font-medium transition-pastel"
                  title="Crear cuenta nueva"
                >
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Menú en móvil */}
      {isOpen && (
        <ul className="md:hidden bg-pastel-blue px-4 py-4 space-y-3 border-t border-pastel-mint-dark">
          {isAuthenticated ? (
            <>
              <li className="text-sm text-pastel-secondary">
                👋 Hola, {user.username}
              </li>

              {/* Pacientes - para todos */}
              <li>
                <Link
                  to="/patients"
                  onClick={() => setIsOpen(false)}
                  className="btn-pastel-success px-4 py-2 rounded-md font-medium transition-pastel block text-center"
                >
                  Pacientes
                </Link>
              </li>

              {user.role === "admin" && (
                <>
                  <li>
                    <Link
                      to="/insumos"
                      onClick={() => setIsOpen(false)}
                      className="btn-pastel-warning px-4 py-2 rounded-md font-medium transition-pastel block text-center"
                    >
                      Insumos
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/estadisticas"
                      onClick={() => setIsOpen(false)}
                      className="btn-pastel-primary px-4 py-2 rounded-md font-medium transition-pastel block text-center"
                    >
                      Estadísticas
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/carousel-admin"
                      onClick={() => setIsOpen(false)}
                      className="btn-pastel-info px-4 py-2 rounded-md font-medium transition-pastel block text-center"
                    >
                      Carrusel
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/doctores"
                      onClick={() => setIsOpen(false)}
                      className="btn-pastel-secondary px-4 py-2 rounded-md font-medium transition-pastel block text-center"
                    >
                      Doctores
                    </Link>
                  </li>
                </>
              )}

              {user.role === "odontologo" && (
                <>
                  <li>
                    <Link
                      to="/patients/new"
                      onClick={() => setIsOpen(false)}
                      className="btn-pastel-primary px-4 py-2 rounded-md font-medium transition-pastel block text-center"
                    >
                      Nuevo Paciente
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/citas"
                      onClick={() => setIsOpen(false)}
                      className="btn-pastel-secondary px-4 py-2 rounded-md font-medium transition-pastel block text-center"
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
                  className="btn-pastel-info px-4 py-2 rounded-md font-medium transition-pastel block text-center"
                >
                  Perfil
                </Link>
              </li>

              <li>
                <button
                  onClick={toggleTheme}
                  className="btn-pastel-secondary px-4 py-2 rounded-md transition-pastel w-full text-center"
                >
                  {isDark ? "🌞 Tema Claro" : "🌙 Tema Oscuro"}
                </button>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="btn-pastel-danger px-4 py-2 rounded-md font-medium transition-pastel w-full text-center"
                >
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  onClick={toggleTheme}
                  className="btn-pastel-secondary px-4 py-2 rounded-md transition-pastel w-full text-center"
                >
                  {isDark ? "🌞 Tema Claro" : "🌙 Tema Oscuro"}
                </button>
              </li>
              <li>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-pastel-secondary px-4 py-2 rounded-md font-medium transition-pastel block text-center"
                >
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="btn-pastel-primary px-4 py-2 rounded-md font-medium transition-pastel block text-center"
                >
                  Registrarse
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
