import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  Award,
  MapPin,
  Clock,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-scroll";

function HomePage() {
  // Carrusel
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Doctores
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar imágenes del carrusel
    const fetchCarouselImages = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/carousel/public"
        );
        const data = await response.json();
        setCarouselImages(data);
      } catch (error) {
        console.error("Error cargando imágenes del carrusel:", error);
        // Imágenes por defecto si no hay en el servidor
        setCarouselImages([
          { filename: "default1.jpg", originalName: "Consultorio 1" },
          { filename: "default2.jpg", originalName: "Consultorio 2" },
          { filename: "default3.jpg", originalName: "Consultorio 3" },
        ]);
      }
    };

    // Cargar doctores
    const fetchDoctores = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/doctors");
        const data = await response.json();
        console.log("Doctores cargados:", data);
        setDoctores(data);
      } catch (error) {
        console.error("Error cargando doctores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselImages();
    fetchDoctores();
  }, []);

  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  const nextSlide = () =>
    setCurrentIndex((prev) =>
      prev === carouselImages.length - 1 ? 0 : prev + 1
    );

  // Auto-avanzar carrusel cada 5 segundos
  useEffect(() => {
    if (carouselImages.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselImages.length]);

  const formatSchedule = (diasTrabajo, horarioInicio, horarioFin) => {
    if (!diasTrabajo || diasTrabajo.length === 0) {
      return "Horario por consultar";
    }

    const diasCortos = {
      Lunes: "Lun",
      Martes: "Mar",
      Miércoles: "Mié",
      Jueves: "Jue",
      Viernes: "Vie",
      Sábado: "Sáb",
      Domingo: "Dom",
    };

    const diasFormateados = diasTrabajo
      .map((dia) => diasCortos[dia] || dia)
      .join(", ");
    const horario = `${horarioInicio || "8:00 AM"} - ${
      horarioFin || "5:00 PM"
    }`;

    return `${diasFormateados}: ${horario}`;
  };

  return (
    <div className="bg-pastel-mint min-h-screen">
      {/* Hero con carrusel */}
      <div className="relative w-full h-[500px] overflow-hidden">
        {carouselImages.length > 0 && (
          <>
            <motion.img
              key={currentIndex}
              src={
                carouselImages[currentIndex].filename.startsWith("default")
                  ? `/images/${carouselImages[currentIndex].filename}`
                  : `http://localhost:3000/uploads/carousel/${carouselImages[currentIndex].filename}`
              }
              alt={carouselImages[currentIndex].originalName}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />

            {/* Overlay con información */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
              <div className="container mx-auto px-6">
                <motion.div
                  className="max-w-2xl text-white"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    Unidad Odontológica UNET
                  </h1>
                  <p className="text-xl md:text-2xl mb-6">
                    Cuidamos tu sonrisa con excelencia y tecnología de
                    vanguardia
                  </p>
                  <div className="flex gap-4">
                    <button
                      className="px-8 py-3 rounded-lg font-semibold text-lg bg-white/70 text-pastel-primary hover:bg-white/90 transition"
                      onClick={() =>
                        document
                          .getElementById("servicios")
                          .scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Conoce Nuestros Servicios
                    </button>
                    <button
                      className="px-8 py-3 rounded-lg font-semibold text-lg bg-white/70 text-pastel-primary hover:bg-white/90 transition"
                      onClick={() =>
                        document
                          .getElementById("contacto")
                          .scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Contacto
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Controles del carrusel */}
            {carouselImages.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-pastel"
                  title="Imagen anterior"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-pastel"
                  title="Siguiente imagen"
                >
                  <ChevronRight size={28} />
                </button>

                {/* Indicadores */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-pastel ${
                        index === currentIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Sección de servicios */}
      <section id="servicios" className="container mx-auto px-6 py-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center text-pastel-primary"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Nuestros Servicios
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              titulo: "Odontología General",
              descripcion:
                "Cuidado integral de tu salud bucal con tratamientos preventivos y correctivos",
              icono: "🦷",
              color: "bg-pastel-blue",
            },
            {
              titulo: "Ortodoncia (proximamente)",
              descripcion:
                "Corrección de la posición de dientes y mandíbula para una sonrisa perfecta",
              icono: "😊",
              color: "bg-pastel-green",
            },
            {
              titulo: "Endodoncia",
              descripcion:
                "Tratamiento de conductos radiculares para salvar dientes dañados",
              icono: "🔧",
              color: "bg-pastel-purple",
            },
          ].map((servicio, i) => (
            <motion.div
              key={i}
              className={`card-pastel p-8 text-center hover:shadow-lg transition-pastel ${servicio.color}`}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
            >
              <div className="text-4xl mb-4">{servicio.icono}</div>
              <h3 className="text-xl font-bold mb-4 text-pastel-primary">
                {servicio.titulo}
              </h3>
              <p className="text-pastel-secondary">{servicio.descripcion}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Nuestro Equipo Médico */}
      <section className="bg-pastel-blue py-16">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-center text-pastel-primary"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Nuestro Equipo Médico
          </motion.h2>
          <p className="text-center text-pastel-secondary mb-12 max-w-2xl mx-auto">
            Profesionales altamente calificados comprometidos con tu salud bucal
          </p>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 text-pastel-primary">
                <Stethoscope className="animate-pulse" size={32} />
                <span>Cargando información de nuestros doctores...</span>
              </div>
            </div>
          ) : doctores.length === 0 ? (
            <div className="text-center py-12">
              <User size={64} className="mx-auto text-pastel-muted mb-4" />
              <h3 className="text-xl font-semibold text-pastel-primary mb-2">
                Próximamente
              </h3>
              <p className="text-pastel-secondary">
                Nuestros doctores están actualizando sus perfiles. Pronto podrás
                conocer más sobre ellos.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctores.map((doctor, i) => (
                <motion.div
                  key={doctor._id}
                  className="card-pastel p-6 text-center hover:shadow-lg transition-pastel"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.2 }}
                >
                  {/* Foto del doctor */}
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-pastel-mint-dark border-4 border-pastel-mint-dark">
                    {doctor.foto ? (
                      <img
                        src={`http://localhost:3000/uploads/profiles/${doctor.foto}`}
                        alt={`Dr. ${doctor.user?.username}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-pastel-purple">
                        <User size={48} className="text-pastel-muted" />
                      </div>
                    )}
                  </div>

                  {/* Información del doctor */}
                  <h3 className="text-xl font-bold mb-2 text-pastel-primary">
                    {doctor.user?.username || "Nombre no disponible"}
                  </h3>

                  {doctor.especialidad && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1 bg-pastel-green px-3 py-1 rounded-full text-sm font-medium text-green-700">
                        <Award size={14} />
                        {doctor.especialidad}
                      </span>
                    </div>
                  )}

                  {/* Biografía */}
                  {doctor.biografia ? (
                    <p className="text-pastel-secondary text-sm mb-4 italic">
                      "
                      {doctor.biografia.length > 120
                        ? doctor.biografia.substring(0, 120) + "..."
                        : doctor.biografia}
                      "
                    </p>
                  ) : (
                    <p className="text-pastel-muted text-sm mb-4">
                      Información de perfil en actualización
                    </p>
                  )}

                  {/* Información de contacto */}
                  <div className="space-y-2 text-sm mb-4">
                    {doctor.user?.email && (
                      <div className="flex items-center justify-center gap-2 text-pastel-secondary">
                        <Mail size={14} />
                        <span>{doctor.user.email}</span>
                      </div>
                    )}

                    {doctor.telefono && (
                      <div className="flex items-center justify-center gap-2 text-pastel-secondary">
                        <Phone size={14} />
                        <span>{doctor.telefono}</span>
                      </div>
                    )}
                  </div>

                  {/* Horarios de atención */}
                  <div className="pt-4 border-t border-pastel-mint-dark">
                    <div className="flex items-center justify-center gap-2 text-pastel-secondary text-sm mb-2">
                      <Clock size={14} />
                      <span className="font-medium">Horario de Atención</span>
                    </div>
                    <div className="text-xs text-pastel-muted bg-pastel-mint p-2 rounded">
                      {formatSchedule(
                        doctor.diasTrabajo,
                        doctor.horarioInicio,
                        doctor.horarioFin
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bienestar Estudiantil */}
      <motion.section
        className="bg-pastel-green py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-pastel-primary mb-4">
            Bienestar Estudiantil UNET
          </h2>
          <p className="text-pastel-secondary max-w-3xl mx-auto text-lg">
            Promovemos la salud bucal de nuestra comunidad universitaria a
            través de atención odontológica integral, campañas preventivas y
            programas de educación en salud oral para estudiantes, docentes y
            personal administrativo.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                titulo: "Atención de Calidad a Bajo Costo",
                descripcion:
                  "Consultas y tratamientos al alcance de toda la comunidad UNET",
                icono: "💚",
              },
              {
                titulo: "Prevención",
                descripcion: "Programas educativos y campañas de salud oral",
                icono: "🛡️",
              },
              {
                titulo: "Tecnología",
                descripcion: "Equipos modernos y técnicas actualizadas",
                icono: "⚕️",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <div className="text-4xl mb-4">{item.icono}</div>
                <h3 className="text-xl font-bold mb-2 text-pastel-primary">
                  {item.titulo}
                </h3>
                <p className="text-pastel-secondary">{item.descripcion}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer id="contacto" className="bg-pastel-purple py-8 text-center">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 text-pastel-primary">Contacto</h4>
              <div className="space-y-2 text-pastel-secondary text-sm">
                <p>📞 (0276) 353-0100</p>
                <p>📧 clinica@unet.edu.ve</p>
                <p>📍 UNET, San Cristóbal, Táchira</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-pastel-primary">
                Horarios Generales
              </h4>
              <div className="space-y-2 text-pastel-secondary text-sm">
                <p>Lunes - Viernes</p>
                <p>8:00 AM - 12:00 PM</p>
                <p className="text-xs text-pastel-muted">
                  * Cada doctor tiene horarios específicos
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-pastel-primary">Servicios</h4>
              <div className="space-y-2 text-pastel-secondary text-sm">
                <p>Odontología General</p>
                <p>Endodoncia</p>
                <br />
                <p>Proximamente</p>
                <p>Ortodoncia</p>
                <p>Periodoncia</p>
              </div>
            </div>
          </div>

          <div className="border-t border-pastel-mint-dark pt-8">
            <p className="text-pastel-muted">
              © {new Date().getFullYear()} Clínica Odontológica UNET - Todos los
              derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
