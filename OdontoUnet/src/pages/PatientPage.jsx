import { useEffect } from "react"
import { usePatients } from "../context/PatientContext"
import  PatientCard  from "../components/PatientCard";

function PatientPage() {
    const {getPatients,patients}= usePatients()
    useEffect(()=>{
      getPatients()
    },[])

    if (patients.length===0) return (<h1>No hay pacientes registrados</h1>);

    const sortedPatients = [...patients].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
        {sortedPatients.map((patient) => (
          <PatientCard patient={patient} key={patient._id}/>
        ))}
      
    </div>
  );
}

export default PatientPage;

