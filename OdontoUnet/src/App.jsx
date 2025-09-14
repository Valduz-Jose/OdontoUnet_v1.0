import { BrowserRouter,Routes,Route } from "react-router-dom";
import { AuthProvider } from "./context/Auth.Context";
import {PatientProvider} from './context/PatientContext';
import NuevaCitaPage from "./pages/NuevaCitaPage";
import NavBar from "./components/NavBar";

//Pagimport { BrowserRouter,Routes,Route } from "react-router-dom";


//Paginas de Autenticacion
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from "./pages/ProfilePage";

//Paginas de pacientes
import PatientPage from "./pages/PatientPage";
import PatientFromPage from "./pages/PatientFormPage";
import PatientCitasPage from "./pages/PatientCitasPage";

// Páginas de administración
import InsumosPage from "./pages/InsumosPage";
import StatisticsPage from "./pages/StatisticsPage";
import CarouselAdminPage from "./pages/CarouselAdminPage";

import HomePage from "./pages/HomePage";

import ProtectedRoute from './ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <PatientProvider>
        <BrowserRouter>
          <NavBar/>
        <Routes>
          {/*Auth */}
          <Route path="/" element={<HomePage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>

          <Route element={<ProtectedRoute/>}>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/patients" element={<PatientPage/>}/>
            <Route path="/patients/new" element={<PatientFromPage/>}/>
            <Route path="/patients/:id" element={<PatientFromPage/>}/>
            <Route path="/citas" element={<NuevaCitaPage/>}/>
            <Route path="/paciente/:id/citas" element={<PatientCitasPage/>}/>
            
            {/* Rutas solo para Admin */}
            <Route path="/insumos" element={<InsumosPage/>}/>
            <Route path="/estadisticas" element={<StatisticsPage/>}/>
            <Route path="/carousel-admin" element={<CarouselAdminPage/>}/>
            
          </Route>
        </Routes>
      </BrowserRouter>
      </PatientProvider>
    </AuthProvider>
  )
}

export default App