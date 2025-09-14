import {useForm, Controller} from 'react-hook-form'
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { usePatients } from '../context/PatientContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useState ,useEffect } from 'react';
import * as React from "react"
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/DatePicker"
import { toLocalDate } from "@/utils/date"

import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

function PatientFormPage() {
  const [startDate, setStartDate] = useState(null); // Estado para la fecha
  
  const {register, handleSubmit, setValue,watch,control,formState: { errors: formErrors }} = useForm({
    mode: "onChange",
  });
  const {createPatient,getPatient,updatePatient,errors} = usePatients()
  const navigate = useNavigate();
  const params = useParams();

  // Tipos de sangre
  const tiposSangre = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  // Carreras disponibles
  const carreras = [
    'Ingeniería en Informática',
    'Ingeniería Industrial', 
    'Ingeniería Electrónica',
    'Ingeniería Mecánica',
    'Ingeniería Producción Animal',
    'Ingeniería Agroindustrial',
    'Ingeniería Agronómica',
    'Ingeniería Ambiental',
    'Ingeniería Civil',
    'Arquitectura',
    'Licenciatura en Música',
    'Licenciatura en Psicología',
    'TSU Entrenamiento Deportivo',
    'Personal Docente',
    'Personal Obrero',
    'Personal Administrativo'
  ];

  useEffect(()=>{
    async function loadPatient(){
      if(params.id){
      const patient = await getPatient(params.id);
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

  const onSubmit = handleSubmit(async (data)=>{
   
    const fechaNacimiento = dayjs(data.fechaNacimiento).format("YYYY-MM-DD");
    const { edad, ...patientData } = {...data,fechaNacimiento};
    console.log("datos q se van a enviar",data)
    try {
      if(params.id){
        await updatePatient(params.id, patientData);
      }else{
        await createPatient(patientData);
      }
      navigate('/patients')
      
    } catch (error) {
      console.error(error);
    }
  })

  return (
    <div className="flex min-h-[calc(100vh-100px)] items-start justify-center py-10">
    <div className="bg-zinc-800 max-w-2xl w-full p-8 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-6">
        {params.id ? "Editar Paciente" : "Registrar Paciente"}
      </h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input 
          type="text"  
          placeholder="Nombre Completo"
          {...register("nombre",  { required: "El nombre es obligatorio" })}
          className='col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md'
          autoFocus
          />
          {formErrors.nombre && <span className="text-red-400 text-sm col-span-1">{formErrors.nombre.message}</span>} 

          <input
            type="text"
            placeholder="Apellido"
            {...register("apellido", { required: "El apellido es obligatorio" })}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
            />
          {formErrors.apellido && <span className="text-red-400 text-sm col-span-1">{formErrors.apellido.message}</span>} 

          <input
            type="text"
            placeholder="Cédula"
            {...register("cedula", { required: "La cédula es obligatoria" })}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
            />
            {formErrors.cedula && <span className="text-red-400 text-sm col-span-1">{formErrors.cedula.message}</span>} 

            {errors.some(e => e.toLowerCase().includes("cédula")) && (
              <span className="text-red-400 text-sm col-span-2">
                {errors.find(e => e.toLowerCase().includes("cédula"))}
              </span>
            )}

          <label htmlFor="date"></label>
<Controller
  name="fechaNacimiento"
  control={control}
  rules={{
    required: "La fecha de nacimiento es obligatoria",
    validate: (value) => {
      if (!value) return "Debe seleccionar una fecha de nacimiento"
      if (dayjs(value).isAfter(dayjs())) {
        return "La fecha de nacimiento no puede ser futura"
      }
      return true
    }
  }}
  render={({ field }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal bg-zinc-700 text-white hover:bg-zinc-600"
        >
          {field.value
            ? dayjs(field.value).format("DD/MM/YYYY")
            : "Selecciona una fecha"}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar
          mode="single"
          selected={field.value ? toLocalDate(field.value) : undefined}
          onSelect={(date) => {
            if (date) {
              field.onChange(dayjs(date).format("YYYY-MM-DD"))
            }
          }}
          captionLayout="dropdown"
          fromYear={1900}
          toYear={dayjs().year()}
          disabled={(date) => date > new Date()}
        />
      </PopoverContent>
    </Popover>
  )}
/>

          {formErrors.fechaNacimiento && (
            <span className="text-red-400 text-sm col-span-2">
              {formErrors.fechaNacimiento.message}
            </span>
          )}

          <select
            {...register("sexo",{ required: "Debe seleccionar un sexo" })}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          >
            <option value="">Seleccione sexo</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          {formErrors.sexo && <span className="text-red-400 text-sm col-span-1">{formErrors.sexo.message}</span>} 

          <input
            type="text"
            placeholder="Teléfono de contacto"
            {...register("telefonoContacto",{ required: "Teléfono de contacto obligatorio" })}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          />
          {formErrors.telefonoContacto && <span className="text-red-400 text-sm col-span-1">{formErrors.telefonoContacto.message}</span>} 

          <input
            type="text"
            placeholder="Teléfono de emergencia"
            {...register("telefonoEmergencia",{ required: "Teléfono de emergencia obligatorio" })}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          />
          {formErrors.telefonoEmergencia && <span className="text-red-400 text-sm col-span-1">{formErrors.telefonoEmergencia.message}</span>} 

          <input
            type="text"
            placeholder="Dirección"
            {...register("direccion",{ required: "Dirección obligatoria" })}
            className="col-span-2 bg-zinc-700 text-white px-4 py-2 rounded-md"
          />
          {formErrors.direccion && <span className="text-red-400 text-sm col-span-2">{formErrors.direccion.message}</span>} 

          {/* Select para Carrera */}
          <select
            {...register("carrera",{ required: "Carrera obligatoria" })}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          >
            <option value="">Seleccione carrera</option>
            {carreras.map((carrera, index) => (
              <option key={index} value={carrera}>
                {carrera}
              </option>
            ))}
          </select>
          {formErrors.carrera && <span className="text-red-400 text-sm col-span-1">{formErrors.carrera.message}</span>} 

          {/* Select para Grupo Sanguíneo */}
          <select
            {...register("grupoSanguineo",{ required: "Grupo sanguíneo obligatorio" })}
            className="col-span-1 bg-zinc-700 text-white px-4 py-2 rounded-md"
          >
            <option value="">Seleccione tipo de sangre</option>
            {tiposSangre.map((tipo, index) => (
              <option key={index} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {formErrors.grupoSanguineo && <span className="text-red-400 text-sm col-span-1">{formErrors.grupoSanguineo.message}</span>} 

          <textarea
            placeholder="Motivo de la consulta"
            {...register("motivoConsulta",{ required: "Motivo de consulta obligatorio" })}
            className="col-span-2 bg-zinc-700 text-white px-4 py-2 rounded-md"
          ></textarea>
            {formErrors.motivoConsulta && <span className="text-red-400 text-sm col-span-2">{formErrors.motivoConsulta.message}</span>} 
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
