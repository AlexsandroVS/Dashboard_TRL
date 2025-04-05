/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import GeneralInsights from "../components/GeneralInsights";
import {
  FiBarChart2,
  FiPieChart,
  FiSearch,
  FiList,
  FiLock,
  FiRefreshCw,
  FiChevronUp,
  FiChevronDown,
  FiCheckCircle,
  FiUser,
} from "react-icons/fi";
import { FaRocket } from "react-icons/fa";
import Navbar from "../components/Navbar";
import MetricCard from "../components/MetricaCard";
import ProjectSearch from "../components/ProjectSearch";
import ChartSection from "../components/ChartSection";
import DataStatus from "../components/DataStatus";
import ProjectsTable from "../components/ProjectsTable";
import {
  obtenerProyectos,
  getMetricasPrincipales,
  getGraficosData,
  getInsightsGenerales,
} from "../services/api";

const DashboardPage: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [isControlExpanded, setIsControlExpanded] = useState(true);
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });
  const [metricas, setMetricas] = useState<any>(null);
  const [graficos, setGraficos] = useState<any>(null);
  const [insigths, setInsigths] = useState<any>(null);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "metrics" | "charts" | "search" | "projects-table" | "insigths"
  >("metrics");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleActualizarDatos = async () => {
    if (!password) {
      setStatus({ type: "error", message: "Por favor ingrese la contraseña" });
      return;
    }

    setStatus({ type: "loading", message: "Actualizando datos..." });

    try {
      const [proyectosRes, metricasRes, graficosRes, insigthsRes] =
        await Promise.all([
          obtenerProyectos(password),
          getMetricasPrincipales(password),
          getGraficosData(password),
          getInsightsGenerales(password),
        ]);

      setProyectos(Array.isArray(proyectosRes) ? proyectosRes : []);
      setMetricas(metricasRes);
      setInsigths(insigthsRes);
      console.log(insigthsRes);
      setGraficos(graficosRes.graficos);
      setStatus({
        type: "success",
        message: "Datos actualizados correctamente",
      });
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: "Error al actualizar datos. Verifique la contraseña.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Sección colapsable de control */}
      <motion.section
        className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 mx-4 mt-20 border border-gray-200"
        initial={false}
        animate={{
          height: isControlExpanded ? "auto" : "64px",
          overflow: "hidden",
        }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="p-6 border-b border-gray-100 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FiLock className="text-purple-600" />
              Control de Datos
            </h2>
            <button
              onClick={() => setIsControlExpanded(!isControlExpanded)}
              className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              {isControlExpanded ? (
                <>
                  <FiChevronUp /> Ocultar
                </>
              ) : (
                <>
                  <FiChevronDown /> Mostrar
                </>
              )}
            </button>
          </div>

          {isControlExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mt-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-grow">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Contraseña de Acceso
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-0 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        placeholder="Ingrese su contraseña"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleActualizarDatos}
                    disabled={status.type === "loading"}
                    className={`px-6 py-2.5 rounded-md font-medium text-white transition-colors flex items-center gap-2 ${
                      status.type === "loading"
                        ? "bg-purple-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {status.type === "loading" ? (
                      <>
                        <FiRefreshCw className="animate-spin h-4 w-4" />
                        Cargando...
                      </>
                    ) : (
                      <>
                        <FiRefreshCw />
                        Actualizar Datos
                      </>
                    )}
                  </button>
                </div>
                <DataStatus status={status} />
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Panel principal */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Navegación */}
          <nav className="border-b border-gray-200 bg-white">
            <div className="flex -mb-px">
              <button
                onClick={() => setActiveTab("metrics")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "metrics"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FiBarChart2 />
                Métricas
              </button>
              <button
                onClick={() => setActiveTab("charts")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "charts"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FiPieChart />
                Gráficos
              </button>
              <button
                onClick={() => setActiveTab("search")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "search"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FiSearch />
                Buscar Proyecto
              </button>
              <button
                onClick={() => setActiveTab("projects-table")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "projects-table"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FiList />
                Todos los Proyectos
              </button>
              <button
                onClick={() => setActiveTab("insigths")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "projects-table"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FiList />
                Insigths
              </button>
            </div>
          </nav>

          {/* Contenido */}
          <div className="p-6">
            {activeTab === "metrics" && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FiBarChart2 className="text-purple-600" />
                  Métricas Clave
                </h3>
                {metricas ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                    <MetricCard
                      title="Total Proyectos"
                      value={metricas.formularios}
                      icon={<FiList className="text-blue-500" />}
                      trend="neutral"
                    />
                    <MetricCard
                      title="TRL Máximo"
                      value={metricas.trl_max}
                      icon={<FaRocket className="text-purple-500" />}
                      trend="neutral"
                    />
                    <MetricCard
                      title="Aprobados"
                      value={metricas.aprobados}
                      icon={<FiCheckCircle className="text-green-500" />}
                      trend="up"
                    />
                    <MetricCard
                      title="Con Docente"
                      value={metricas.docente_si}
                      icon={<FiUser className="text-amber-500" />}
                      trend="up"
                    />
                    <MetricCard
                      title="Sin Docente"
                      value={metricas.docente_no}
                      icon={<FiUser className="text-amber-500" />}
                      trend="up"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                    {status.type === "idle"
                      ? "Actualice los datos para ver las métricas"
                      : "No hay datos disponibles"}
                  </div>
                )}
              </motion.section>
            )}

            {activeTab === "charts" && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ChartSection graficos={graficos} />
              </motion.section>
            )}

            {activeTab === "search" && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectSearch password={password} />
              </motion.section>
            )}

            {activeTab === "projects-table" && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {proyectos.length > 0 ? (
                  <ProjectsTable
                    proyectos={proyectos}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    setCurrentPage={setCurrentPage}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                    {status.type === "idle"
                      ? "Actualice los datos para ver los proyectos"
                      : "No hay datos disponibles"}
                  </div>
                )}
              </motion.section>
            )}
            {activeTab === "insigths" && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {insigths ? (
                  <GeneralInsights data={insigths} />
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                    {status.type === "idle"
                      ? "Actualice los datos para ver los insights"
                      : "No hay insights disponibles"}
                  </div>
                )}
              </motion.section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
