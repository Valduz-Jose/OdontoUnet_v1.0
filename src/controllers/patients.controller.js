import Patient from '../models/patient.model.js'
//obtener todos los pacientes del usuario autenticado
export const getPatients = async (req,res)=>{
    try {
        const patients = await Patient.find({
        // con esta linea se limita la solicitus a solo los datos de ese usuario
        user:req.user.id
        }).populate('user')//trae los datos completos del usuario
        res.json(patients)
    } catch (error) {
         return res.status(500).json({message: "Algo salio mal al obtener los pacientes"});
    }
};
//Crear nuevo paciente
export const createPatient = async (req,res)=>{
    try {
        const patientData = { ...req.body,user: req.user.id};
        const newPatient = new Patient(patientData);
        const savedPatient = await newPatient.save();
        res.json(savedPatient);
    } catch (error) {
         return res.status(500).json({message: "Algo salio mal al crear el paciente"});
    }
};
//obtener un paciente especifico
export const getPatient = async (req,res)=>{
    try {
        const patient = await Patient.findById(req.params.id) //.populate(user) trae el dato solo de ese usuario
        if(!patient) return res.status(404).json({message:'Paciente no Encontrado'})
        res.json(patient)
    } catch (error) {
        return res.status(404).json({message: "Paciente no Encontrado"});
    }
};
//eliminar un paciente
export const deletePatient = async (req,res)=>{
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id)
        if(!patient) return res.status(404).json({message:'Paciente no Encontrado'})
        return res.sendStatus(204);
    } catch (error) {
        return res.status(404).json({message: "Paciente no Encontrado"});
    }
};
//actualizar un paciente
export const updatePatient = async (req,res)=>{
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        });
        if(!patient) return res.status(404).json({message:'Patient not Found'})
        res.json(patient)
    } catch (error) {
        return res.status(404).json({message: "Patient not Found"});
    }
};


