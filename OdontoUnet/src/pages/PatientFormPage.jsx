import {useForm} from 'react-hook-form'
import { usePatients } from '../context/PatientContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

function PatientFormPage() {

  const {register, handleSubmit, setValue} = useForm();
  const {createPatient,getPatient,updatePatient} = usePatients()
  const navigate = useNavigate();
  const params = useParams();

  useEffect(()=>{
    async function loadPatient(){
      if(params.id){
      const patient = await getPatient(params.id);
      // console.log(patient);
      if (patient) {
          Object.keys(patient).forEach((key) => {
        if (patient[key]) {
          if(key === "fechaNacimiento"){
            setValue("fechaNacimiento", dayjs(patient[key]).format("YYYY-MM-DD"));
          }else{
            setValue(key,patient[key]);
          }
        }
      });
      }
    }
  }
    loadPatient();
  },[params.id, setValue,getPatient]);

  const onSubmit = handleSubmit((data)=>{
    // console.log("datos q se van a enviar",data)
    if(params.id){
      updatePatient(params.id, data);
    }else{
      createPatient(data);
    }
    navigate('/patients')
  })

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
    <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
      <h1 className="text-2xl font-bold mb-4">
          {params.id ? "Editar Paciente" : "Registrar Paciente"}
      </h1>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
        
        <input 
          type="text"  
          placeholder="Nombre Completo"
          {...register("nombre", {required: true})}
          className='col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md'
          autoFocus
          />
          
          <input
            type="text"
            placeholder="Apellido"
            {...register("apellido", { required: true })}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          />

          <input
            type="text"
            placeholder="Cédula"
            {...register("cedula", { required: true })}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          />

          <label htmlFor="date">Fecha de Nacimiento </label>
          <input type="date" {...register("fechaNacimiento")} className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'/>

          <input
            type="number"
            placeholder="Edad"
            {...register("edad")}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          />
          <select
            {...register("sexo")}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          >
            <option value="">Seleccione sexo</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>

          <input
            type="text"
            placeholder="Teléfono de contacto"
            {...register("telefonoContacto")}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Teléfono de emergencia"
            {...register("telefonoEmergencia")}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          />

          <input
            type="text"
            placeholder="Dirección"
            {...register("direccion")}
            className="col-span-2 bg-zinc-700 text-white px-4 py-2 rounded-md"
          />

          <input
            type="text"
            placeholder="Carrera"
            {...register("carrera")}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Grupo sanguíneo"
            {...register("grupoSanguineo")}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          />

          <textarea
            placeholder="Motivo de la consulta"
            {...register("motivoConsulta")}
            className="col-span-2 bg-zinc-700 text-white px-4 py-2 rounded-md"
          ></textarea>

          <textarea
            placeholder="Alergias"
            {...register("alergias")}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          ></textarea>
          <textarea
            placeholder="Enfermedades crónicas"
            {...register("enfermedadesCronicas")}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          ></textarea>

          <textarea
            placeholder="Medicamentos"
            {...register("medicamentos")}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          ></textarea>
          <textarea
            placeholder="Condición especial"
            {...register("condicionEspecial")}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          ></textarea>

          <textarea
            placeholder="Cirugías"
            {...register("cirugias")}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          ></textarea>
          <textarea
            placeholder="Antecedentes familiares"
            {...register("antecedentesFamiliares")}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          ></textarea>
        <div className="col-span-2 flex justify-end gap-4 mt-6">
          <button 
            type="button" 
            onClick={() => navigate('/patients')}
            className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors'
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className='bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors'
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
    </div>
  )
}

export default PatientFormPage;