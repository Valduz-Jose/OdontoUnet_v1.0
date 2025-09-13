// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function HomePage() {
  // Carrusel
  const images = [
    "/images/consultorio1.jpg",
    "/images/consultorio2.jpg",
    "/images/consultorio3.jpg",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // Noticias
  const [noticias, setNoticias] = useState([]);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/top-headlines?category=health&country=us&pageSize=3&apiKey=${
            import.meta.env.VITE_NEWS_API_KEY
          }`
        );
        const data = await res.json();
        setNoticias(data.articles || []);
      } catch (error) {
        console.error("Error cargando noticias:", error);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="bg-[#202020] text-gray-100 min-h-screen">
      {/* Hero con carrusel */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt="Consultorio"
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Doctores */}
      <section className="container mx-auto px-6 py-12">
        <motion.h2
          className="text-3xl font-bold mb-6 text-blue-400"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Nuestro Equipo
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              nombre: "Dra. María Pérez",
              especialidad: "Ortodoncia",
              foto: "/images/doctor1.jpg",
            },
            {
              nombre: "Dr. José Gómez",
              especialidad: "Endodoncia",
              foto: "/images/doctor2.jpg",
            },
            {
              nombre: "Dra. Laura Ruiz",
              especialidad: "Odontopediatría",
              foto: "/images/doctor3.jpg",
            },
          ].map((doc, i) => (
            <motion.div
              key={i}
              className="bg-zinc-900 p-4 rounded-lg shadow hover:shadow-xl transition"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
            >
              <img
                src={doc.foto}
                alt={doc.nombre}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold">{doc.nombre}</h3>
              <p className="text-gray-400">{doc.especialidad}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bienestar Estudiantil */}
      <motion.section
        className="bg-blue-600 py-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            Bienestar Estudiantil
          </h2>
          <p className="mt-2 text-blue-100 max-w-2xl mx-auto">
            Promovemos la salud bucal de nuestra comunidad universitaria a
            través de atención odontológica integral y campañas preventivas.
          </p>
        </div>
      </motion.section>

      

      {/* Footer */}
      <footer className="bg-zinc-900 py-6 text-center text-gray-400">
        <p>
          © {new Date().getFullYear()} Clínica Odontológica UNET - Todos los
          derechos reservados
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
