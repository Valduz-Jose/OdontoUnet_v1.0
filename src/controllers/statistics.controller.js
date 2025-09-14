import Cita from "../models/cita.model.js";
import Patient from "../models/patient.model.js";
import Insumo from "../models/insumo.model.js";
import User from "../models/user.model.js";

export const getStatistics = async (req, res) => {
  try {
    const { startDate, endDate, period } = req.query;
    
    // Validar fechas
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Se requieren fecha de inicio y fin" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Incluir todo el día final

    // Filtro base para las citas en el período
    const dateFilter = {
      fecha: {
        $gte: start,
        $lte: end
      }
    };

    // 1. Pacientes atendidos (únicos en el período)
    const citasEnPeriodo = await Cita.find(dateFilter).distinct('paciente');
    const pacientesAtendidos = citasEnPeriodo.length;

    // 2. Citas realizadas
    const citasRealizadas = await Cita.countDocuments(dateFilter);

    // 3. Insumos más utilizados
    const insumosUsados = await Cita.aggregate([
      { $match: dateFilter },
      { $unwind: "$insumosUsados" },
      {
        $group: {
          _id: "$insumosUsados.insumo",
          totalUsado: { $sum: "$insumosUsados.cantidad" }
        }
      },
      {
        $lookup: {
          from: "insumos",
          localField: "_id",
          foreignField: "_id",
          as: "insumoInfo"
        }
      },
      { $unwind: "$insumoInfo" },
      {
        $project: {
          _id: 1,
          nombre: "$insumoInfo.nombre",
          totalUsado: 1
        }
      },
      { $sort: { totalUsado: -1 } },
      { $limit: 15 }
    ]);

    // 4. Días más concurridos (día de la semana)
    const diasMasConcurridos = await Cita.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $dayOfWeek: "$fecha" }, // 1=Domingo, 2=Lunes, etc.
          totalCitas: { $sum: 1 }
        }
      },
      { $sort: { totalCitas: -1 } }
    ]);

    // Ajustar para que 1=Lunes, 2=Martes, etc.
    const diasAjustados = diasMasConcurridos.map(dia => ({
      _id: dia._id === 1 ? 7 : dia._id - 1, // Convertir domingo(1) a 7, resto -1
      totalCitas: dia.totalCitas
    })).filter(dia => dia._id <= 5) // Solo días laborables (1-5)
      .sort((a, b) => b.totalCitas - a.totalCitas);

    // 5. Ingresos totales
    const ingresosTotales = await Cita.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          total: { $sum: "$monto" }
        }
      }
    ]);

    const totalIngresos = ingresosTotales.length > 0 ? ingresosTotales[0].total : 0;

    // 6. Promedio de ingresos diario
    const diasEnPeriodo = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const promedioIngresoDiario = diasEnPeriodo > 0 ? Math.round(totalIngresos / diasEnPeriodo) : 0;

    // 7. Insumos agotados
    const insumosAgotados = await Insumo.countDocuments({ cantidadDisponible: 0 });

    // 8. Odontólogos activos en el período
    const odontologosActivos = await Cita.find(dateFilter).distinct('odontologo');

    // 9. Pacientes por mes (si el período es largo)
    const pacientesPorMes = await Cita.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            año: { $year: "$fecha" },
            mes: { $month: "$fecha" }
          },
          pacientesUnicos: { $addToSet: "$paciente" },
          totalCitas: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 1,
          totalPacientes: { $size: "$pacientesUnicos" },
          totalCitas: 1
        }
      },
      { $sort: { "_id.año": 1, "_id.mes": 1 } }
    ]);

    // Respuesta
    res.json({
      periodo: {
        inicio: startDate,
        fin: endDate,
        dias: diasEnPeriodo
      },
      pacientesAtendidos,
      citasRealizadas,
      insumosUsados,
      diasMasConcurridos: diasAjustados,
      ingresosTotales: totalIngresos,
      promedioIngresoDiario,
      pacientesPorMes,
      insumosAgotados,
      odontologosActivos: odontologosActivos.length,
      // Estadísticas adicionales
      promedioCitasPorPaciente: pacientesAtendidos > 0 ? Math.round(citasRealizadas / pacientesAtendidos * 10) / 10 : 0,
      montoPromedioPorCita: citasRealizadas > 0 ? Math.round(totalIngresos / citasRealizadas * 100) / 100 : 0
    });

  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ message: "Error al obtener las estadísticas" });
  }
};

// Estadísticas de insumos específicas
export const getInsumoStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Se requieren fecha de inicio y fin" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const dateFilter = {
      fecha: {
        $gte: start,
        $lte: end
      }
    };

    // Insumos más utilizados con detalles
    const insumosDetallados = await Cita.aggregate([
      { $match: dateFilter },
      { $unwind: "$insumosUsados" },
      {
        $group: {
          _id: "$insumosUsados.insumo",
          totalUsado: { $sum: "$insumosUsados.cantidad" },
          vecesUsado: { $sum: 1 },
          citasConEsteInsumo: { $addToSet: "$_id" }
        }
      },
      {
        $lookup: {
          from: "insumos",
          localField: "_id",
          foreignField: "_id",
          as: "insumoInfo"
        }
      },
      { $unwind: "$insumoInfo" },
      {
        $project: {
          _id: 1,
          nombre: "$insumoInfo.nombre",
          unidadMedida: "$insumoInfo.unidadMedida",
          cantidadDisponible: "$insumoInfo.cantidadDisponible",
          totalUsado: 1,
          vecesUsado: 1,
          totalCitas: { $size: "$citasConEsteInsumo" }
        }
      },
      { $sort: { totalUsado: -1 } }
    ]);

    res.json(insumosDetallados);

  } catch (error) {
    console.error("Error al obtener estadísticas de insumos:", error);
    res.status(500).json({ message: "Error al obtener las estadísticas de insumos" });
  }
};