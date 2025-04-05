// src/pages/ProjectsPage.tsx
import React, { useEffect, useState } from 'react';
import { getGraficosData, getMetricasPrincipales, buscarProyecto } from '../services/api';
import Chart from '../components/Chart';
import { displayMetrics } from '../utils/displayMetrics';

const ProjectsPage: React.FC = () => {
  const [graficoData, setGraficoData] = useState<any>(null);
  const [metricas, setMetricas] = useState<any>(null);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [nombreProyecto, setNombreProyecto] = useState('');

  useEffect(() => {
    async function fetchData() {
      const graficoResponse = await getGraficosData();
      const metricasResponse = await getMetricasPrincipales();
      setGraficoData(graficoResponse);
      setMetricas(metricasResponse);
    }
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (nombreProyecto) {
      const proyectoData = await buscarProyecto(nombreProyecto);
      setProyectos(proyectoData);
    }
  };

  return (
    <div className="projects-page">
      {/* Sección de métricas */}
      <section className="metrics">
        <h2>📊 Métricas Clave</h2>
        {metricas && displayMetrics(metricas)}
      </section>

      {/* Sección de gráficos */}
      <section className="visualizations">
        <h2>📈 Visualizaciones</h2>
        {graficoData && <Chart data={graficoData.graficos.distribucion_trl} />}
      </section>

      {/* Búsqueda de proyectos */}
      <section className="search-project">
        <h2>🔍 Búsqueda de Proyectos</h2>
        <input
          type="text"
          placeholder="Buscar por nombre del proyecto"
          value={nombreProyecto}
          onChange={(e) => setNombreProyecto(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>

        {proyectos.length > 0 && (
          <ul>
            {proyectos.map((proyecto, index) => (
              <li key={index}>{proyecto.nombre}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ProjectsPage;
