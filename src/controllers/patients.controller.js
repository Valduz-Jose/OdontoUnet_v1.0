import Patient from '../models/patient.model.js'
import {calculateAge} from '../utils/calculateAge.js'
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);

//obtener todos los pacientes del usuario autenticado
export const getPatients = async (req,res)=>{
    try {
        const patients = await Patient.find({
        // con esta linea se limita la solicitus a solo los datos de ese usuario
        // user:req.user.id
        }).populate('user',"username email role")//trae los datos completos del usuario
        res.json(patients)
    } catch (error) {
         return res.status(500).json({message: "Algo salio mal al obtener los pacientes"});
    }
};
//Crear nuevo paciente
export const createPatient = async (req,res)=>{
  try {
    // Normalizamos fecha a UTC sin hora
    const fechaNacimiento = dayjs(req.body.fechaNacimiento)
      .utc()
      .startOf("day")
      .format("YYYY-MM-DD");

    const hoy = dayjs().utc().startOf("day");
    if (dayjs(fechaNacimiento).isAfter(hoy)) {
    return res.status(400).json({ message: "La fecha de nacimiento no puede ser futura" });
    }

    // Verificamos cedula duplicada
    const pacienteExistente = await Patient.findOne({ cedula: req.body.cedula });
    if (pacienteExistente) {
      return res.status(400).json({ message: "La cédula ya está registrada" });
    }

    // calcula edad y crea paciente
    const edadCalculada = calculateAge(fechaNacimiento);
    const patientData = { 
      ...req.body, 
      fechaNacimiento,  // usamos la fecha normalizada
      edad: edadCalculada, 
      user: req.user.id 
    };

    const newPatient = new Patient(patientData);
    const savedPatient = await newPatient.save();
    await savedPatient.populate("user","username email role");

    res.json(savedPatient);
  } catch (error) {
    console.error("Error al crear paciente:", error); 
    return res.status(500).json({message: "Algo salio mal al crear el paciente"});
  }
};
//obtener un paciente especifico
export const getPatient = async (req,res)=>{
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("user","username email role");
    if (!patient) return res.status(404).json({ message:'Paciente no Encontrado' });

    // Normalizamos salida de fecha como string YYYY-MM-DD
    const patientObj = patient.toObject();
    if (patientObj.fechaNacimiento) {
      patientObj.fechaNacimiento = dayjs(patientObj.fechaNacimiento)
        .utc()
        .format("YYYY-MM-DD");
    }

    res.json(patientObj);
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
    const updates = { ...req.body };
    
    
    if (req.body.fechaNacimiento) {
        const fechaNormalizada = dayjs(req.body.fechaNacimiento).utc().format("YYYY-MM-DD");
      // Normalizamos fecha a UTC sin hora

    const hoy = dayjs().utc().startOf("day");
    if (dayjs(fechaNormalizada).isAfter(hoy)) {
    return res.status(400).json({ message: "La fecha de nacimiento no puede ser futura" });
    }

      updates.fechaNacimiento = fechaNormalizada;
      updates.edad = calculateAge(fechaNormalizada);
    }

    const patient = await Patient.findByIdAndUpdate(req.params.id, updates, {
      new:true,
    }).populate("user","username email role");

    if (!patient) return res.status(404).json({ message:'Paciente no encontrado' });

    // Normalizamos salida de fecha
    const patientObj = patient.toObject();
    if (patientObj.fechaNacimiento) {
      patientObj.fechaNacimiento = dayjs(patientObj.fechaNacimiento)
        .utc()
        .format("YYYY-MM-DD");
    }

    res.json(patientObj);
  } catch (error) {
    return res.status(404).json({message: "Paciente no encontrado"});
  }
};


