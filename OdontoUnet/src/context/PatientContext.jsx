import {createContext, useContext, useState} from 'react'
import {
    createPatientRequest,
    getPatientsRequest,
    deletePatientRequest,
    getPatientRequest,
    updatePatientRequest,
} from '../api/patient';

const PatientContext = createContext();

export const usePatients = () => {
    const context = useContext(PatientContext);

    if (!context) {
        throw new Error("usePatients must be used within a PatientProvider");
    }
    return context;
}

export function PatientProvider({children}) {
    const [patients,setpatients] = useState([]);

    const getPatients = async () =>{
        try {
            const res = await getPatientsRequest();
            setpatients(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const createPatient = async (patient) =>{
        try {
            const res = await createPatientRequest(patient);
            setpatients([...patients, res.data]);
        } catch (error) {
            console.error(error);
        }
    }

    const deletePatient = async (id) =>{
        try {
            const res = await deletePatientRequest(id);
            if (res.status===204) setpatients(patients.filter(patient => patient._id !== id))
        } catch (error) {
            console.log(error)
        }
    }

    const getPatient = async (id)=>{
        try {
            const res = await getPatientRequest(id);
            return res.data
        } catch (error) {
            console.error(error)
        }
    }

    const updatePatient = async (id,patient) =>{
        try {
            const res = await updatePatientRequest(id, patient);
            setpatients(
                patients.map((p) => (p._id === id ? res.data : p))
            );
        } catch (error) {
            console.error(error)
        }
    }
    return(
        <PatientContext.Provider value={{
            patients,
            getPatients,
            createPatient,
            deletePatient,
            getPatient,
            updatePatient,
        }}>
            {children}
        </PatientContext.Provider>
    )
}

