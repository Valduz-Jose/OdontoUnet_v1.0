import axios  from "./axios";

export const createPatientRequest = (patient) =>axios.post('/patients',patient);

export const getPatientsRequest = () =>axios.get('/patients');

export const getPatientRequest = (id) =>axios.get(`/patients/${id}`);

export const updatePatientRequest = (id,patient) =>
    axios.put(`/patients/${id}`,patient);

export const deletePatientRequest = (id) =>axios.delete(`/patients/${id}`);

