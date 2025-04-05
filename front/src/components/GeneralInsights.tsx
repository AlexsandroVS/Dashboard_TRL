// src/pages/dashboard/components/GeneralInsights.tsx
import React from "react";
import {
  FiTrendingUp,
  FiAward,
  FiBarChart,
  FiInfo,
  FiZap,
  FiStar,
} from "react-icons/fi";
import { motion } from "framer-motion";

type TopProyecto = {
  "Nombre del Proyecto": string;
  "Puntaje Total": number;
};

interface InsightsGenerales {
  metricas: {
    total_proyectos: number;
    aprobados: number;
    porcentaje_aprobados: number;
    distribucion_trl: Record<string, number>;
    promedios: {
      "TRL 1-3": number;
      "TRL 4-7": number;
      "TRL 8-9": number;
      Total: number;
    };
  };
  top_proyectos: TopProyecto[];
  insights: string[];
}

interface Props {
  data: InsightsGenerales;
}

const GeneralInsights: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-8">

      {/* Sección de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-purple-800 text-lg font-semibold flex items-center gap-2 mb-2">
            <FiTrendingUp />
            Estado de Aprobación
          </h4>
          <p className="text-purple-900 text-md">
            <strong>{data.metricas.aprobados}</strong> de{" "}
            <strong>{data.metricas.total_proyectos}</strong> proyectos aprobados
          </p>
          <p className="text-sm text-purple-700 mt-1">
            ({data.metricas.porcentaje_aprobados.toFixed(1)}%)
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-yellow-800 text-lg font-semibold flex items-center gap-2 mb-2">
            <FiAward />
            Proyectos Destacados
          </h4>
          <ul className="text-yellow-900 space-y-1 text-sm">
            {data.top_proyectos.map((p, index) => (
              <li key={index} className="flex gap-2 items-center">
                <FiStar className="text-yellow-600" />
                {p["Nombre del Proyecto"]} – <strong>{p["Puntaje Total"]} pts</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-blue-800 text-lg font-semibold flex items-center gap-2 mb-2">
            <FiBarChart />
            Puntajes Promedio
          </h4>
          <ul className="text-blue-900 space-y-1 text-sm">
            {Object.entries(data.metricas.promedios).map(([key, val]) => (
              <li key={key}>
                {key}: <strong>{val.toFixed(1)}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Distribución por TRL */}
      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
        <h4 className="text-gray-800 text-lg font-semibold mb-4 flex items-center gap-2">
          <FiInfo />
          Distribución por Segmento TRL
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
          <div className="bg-gray-50 rounded-md p-4 text-center border">
            <span className="block text-xl font-bold text-indigo-600">
              {data.metricas.distribucion_trl["TRL 1-3"] || 0}
            </span>
            Etapa Inicial (TRL 1-3)
          </div>
          <div className="bg-gray-50 rounded-md p-4 text-center border">
            <span className="block text-xl font-bold text-indigo-600">
              {data.metricas.distribucion_trl["TRL 4-7"] || 0}
            </span>
            En Desarrollo (TRL 4-7)
          </div>
          <div className="bg-gray-50 rounded-md p-4 text-center border">
            <span className="block text-xl font-bold text-indigo-600">
              {data.metricas.distribucion_trl["TRL 8-9"] || 0}
            </span>
            Cerca de Implementación (TRL 8-9)
          </div>
        </div>
      </div>

      {/* Lista de insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm"
      >
        <h4 className="text-gray-800 text-lg font-semibold mb-4 flex items-center gap-2">
          <FiZap />
          Insights Generales
        </h4>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
          {data.insights.map((linea, idx) => (
            <li key={idx}>{linea}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default GeneralInsights;
