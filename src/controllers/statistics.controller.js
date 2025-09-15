import Cita from "../models/cita.model.js";
import Patient from "../models/patient.model.js";
import Insumo from "../models/insumo.model.js";
import User from "../models/user.model.js";

export const getStatistics = async (req, res) => {
  try {
    const { startDate, endDate, period } = req.query;

    // Validar fechas
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Se requieren fecha de inicio y fin" });
    }

    console.log("Parámetros recibidos:", { startDate, endDate, period });

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Asegurar que la fecha final incluya todo el día
    end.setHours(23, 59, 59, 999);

    console.log("Fechas procesadas:", { start, end });

    // Filtro base para las citas en el período
    const dateFilter = {
      fecha: {
        $gte: start,
        $lte: end,
      },
    };

    console.log("Filtro de fecha:", dateFilter);

    // VERIFICAR SI HAY CITAS EN GENERAL
    const totalCitasEnSistema = await Cita.countDocuments();
    console.log("Total de citas en el sistema:", totalCitasEnSistema);

    // VERIFICAR CITAS EN EL PERÍODO
    const citasEnPeriodo = await Cita.find(dateFilter);
    console.log("Citas encontradas en el período:", citasEnPeriodo.length);

    // 1. Pacientes atendidos (únicos en el período)
    const pacientesUnicos = await Cita.find(dateFilter).distinct("paciente");
    const pacientesAtendidos = pacientesUnicos.length;
    console.log("Pacientes únicos:", pacientesAtendidos);

    // 2. Citas realizadas
    const citasRealizadas = citasEnPeriodo.length;
    console.log("Citas realizadas:", citasRealizadas);

    // 3. Insumos más utilizados - mejorado
    let insumosUsados = [];
    try {
      insumosUsados = await Cita.aggregate([
        { $match: dateFilter },
        {
          $unwind: {
            path: "$insumosUsados",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            _id: "$insumosUsados.insumo",
            totalUsado: { $sum: "$insumosUsados.cantidad" },
          },
        },
        {
          $lookup: {
            from: "insumos",
            localField: "_id",
            foreignField: "_id",
            as: "insumoInfo",
          },
        },
        { $unwind: { path: "$insumoInfo", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            nombre: { $ifNull: ["$insumoInfo.nombre", "Insumo no encontrado"] },
            totalUsado: 1,
          },
        },
        { $sort: { totalUsado: -1 } },
        { $limit: 15 },
      ]);
    } catch (error) {
      console.error("Error en agregación de insumos:", error);
    }
    console.log("Insumos utilizados:", insumosUsados);

    // 4. Días más concurridos (día de la semana)
    let diasMasConcurridos = [];
    try {
      diasMasConcurridos = await Cita.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $dayOfWeek: "$fecha" }, // 1=Domingo, 2=Lunes, etc.
            totalCitas: { $sum: 1 },
          },
        },
        { $sort: { totalCitas: -1 } },
      ]);

      // Ajustar para que 1=Lunes, 2=Martes, etc.
      diasMasConcurridos = diasMasConcurridos
        .map((dia) => ({
          _id: dia._id === 1 ? 7 : dia._id - 1, // Domingo=7, Lunes=1, etc.
          totalCitas: dia.totalCitas,
        }))
        .filter((dia) => dia._id >= 1 && dia._id <= 5); // Solo días laborables
    } catch (error) {
      console.error("Error en días más concurridos:", error);
    }
    console.log("Días más concurridos:", diasMasConcurridos);

    // 5. Ingresos totales
    let ingresosTotales = 0;
    try {
      const resultadoIngresos = await Cita.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            total: { $sum: { $toDouble: { $ifNull: ["$monto", 0] } } },
          },
        },
      ]);
      ingresosTotales =
        resultadoIngresos.length > 0 ? resultadoIngresos[0].total : 0;
    } catch (error) {
      console.error("Error calculando ingresos:", error);
    }
    console.log("Ingresos totales:", ingresosTotales);

    // 6. Promedio de ingresos diarios
    const diasEnPeriodo = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    const promedioIngresoDiario = Math.round(ingresosTotales / diasEnPeriodo);

    // 7. Odontólogos activos en el período
    let odontologosActivos = 0;
    try {
      const odontologosUnicos = await Cita.find(dateFilter).distinct(
        "odontologo"
      );
      odontologosActivos = odontologosUnicos.length;
    } catch (error) {
      console.error("Error contando odontólogos:", error);
    }

    // 8. Insumos agotados (stock menor a 10)
    let insumosAgotados = 0;
    try {
      insumosAgotados = await Insumo.countDocuments({
        cantidad: { $lt: 10 },
      });
    } catch (error) {
      console.error("Error contando insumos agotados:", error);
    }

    // 9. Estadísticas adicionales
    const promedioCitasPorPaciente =
      pacientesAtendidos > 0
        ? Math.round((citasRealizadas / pacientesAtendidos) * 10) / 10
        : 0;

    const montoPromedioPorCita =
      citasRealizadas > 0 ? Math.round(ingresosTotales / citasRealizadas) : 0;

    // Respuesta final
    const statistics = {
      pacientesAtendidos,
      citasRealizadas,
      insumosUsados,
      diasMasConcurridos,
      ingresosTotales: Math.round(ingresosTotales),
      promedioIngresoDiario,
      odontologosActivos,
      insumosAgotados,
      promedioCitasPorPaciente,
      montoPromedioPorCita,
      // Información adicional de debug
      debug: {
        totalCitasEnSistema,
        diasEnPeriodo,
        fechaInicio: start,
        fechaFin: end,
      },
    };

    console.log("Estadísticas finales:", statistics);
    res.json(statistics);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({
      message: "Error interno del servidor al obtener estadísticas",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Función auxiliar para obtener estadísticas rápidas (dashboard)
export const getQuickStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Estadísticas del mes actual
    const citasEsteMes = await Cita.countDocuments({
      fecha: { $gte: startOfMonth, $lte: today },
    });

    const pacientesEsteMes = await Cita.find({
      fecha: { $gte: startOfMonth, $lte: today },
    }).distinct("paciente");

    const ingresosEsteMes = await Cita.aggregate([
      { $match: { fecha: { $gte: startOfMonth, $lte: today } } },
      { $group: { _id: null, total: { $sum: { $toDouble: "$monto" } } } },
    ]);

    // Citas de hoy
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const citasHoy = await Cita.countDocuments({
      fecha: { $gte: startOfDay, $lte: endOfDay },
    });

    // Total de pacientes registrados
    const totalPacientes = await Patient.countDocuments();

    // Total de odontólogos
    const totalOdontologos = await User.countDocuments({ role: "odontologo" });

    // Insumos con stock bajo
    const insumosStockBajo = await Insumo.countDocuments({
      cantidad: { $lt: 10 },
    });

    res.json({
      citasHoy,
      citasEsteMes,
      pacientesEsteMes: pacientesEsteMes.length,
      ingresosEsteMes:
        ingresosEsteMes.length > 0 ? Math.round(ingresosEsteMes[0].total) : 0,
      totalPacientes,
      totalOdontologos,
      insumosStockBajo,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas rápidas:", error);
    res.status(500).json({
      message: "Error al obtener estadísticas rápidas",
      error: error.message,
    });
  }
};

// Función para obtener estadísticas por período personalizado
export const getCustomPeriodStats = async (req, res) => {
  try {
    const { year, month, quarter } = req.query;

    let startDate, endDate;

    if (year && month) {
      // Estadísticas por mes específico
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59, 999);
    } else if (year && quarter) {
      // Estadísticas por trimestre
      const quarterStart = [(0, 0), (3, 0), (6, 0), (9, 0)][quarter - 1];
      startDate = new Date(year, quarterStart[0], 1);
      endDate = new Date(year, quarterStart[0] + 3, 0, 23, 59, 59, 999);
    } else if (year) {
      // Estadísticas anuales
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    } else {
      return res
        .status(400)
        .json({ message: "Parámetros de período inválidos" });
    }

    // Usar la misma lógica que getStatistics pero con fechas calculadas
    req.query.startDate = startDate.toISOString().split("T")[0];
    req.query.endDate = endDate.toISOString().split("T")[0];

    return getStatistics(req, res);
  } catch (error) {
    console.error("Error en estadísticas de período personalizado:", error);
    res.status(500).json({
      message: "Error al obtener estadísticas del período",
      error: error.message,
    });
  }
};
