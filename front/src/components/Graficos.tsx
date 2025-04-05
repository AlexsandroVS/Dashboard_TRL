import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { getGraficosData } from '../services/api';

const Graficos: React.FC = () => {
  const [graficos, setGraficos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraficos = async () => {
      try {
        const data = await getGraficosData();
        if (data && data.graficos) {
          setGraficos(data.graficos);
        } else {
          setError("No se pudieron cargar los datos de los gráficos.");
        }
      } catch (error) {
        setError("Hubo un error al obtener los datos de los gráficos.");
      } finally {
        setLoading(false);
      }
    };
    fetchGraficos();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Verificar si los datos son válidos antes de intentar parsearlos
  const distribucionTrlData = graficos?.distribucion_trl ? JSON.parse(graficos.distribucion_trl) : null;
  const aprobacionPorTrlData = graficos?.aprobacion_por_trl ? JSON.parse(graficos.aprobacion_por_trl) : null;
  const proporcionAprobadosData = graficos?.proporcion_aprobados ? JSON.parse(graficos.proporcion_aprobados) : null;
  const puntajeTrlData = graficos?.puntaje_trl ? JSON.parse(graficos.puntaje_trl) : null;
  const distribucionIndustriaData = graficos?.distribucion_industria ? JSON.parse(graficos.distribucion_industria) : null;
  const nivelInglesData = graficos?.nivel_ingles ? JSON.parse(graficos.nivel_ingles) : null;
  const ubicacionGeograficaData = graficos?.ubicacion_geografica ? JSON.parse(graficos.ubicacion_geografica) : null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">Gráficos de Datos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Gráfico Distribución TRL */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Distribución TRL</h3>
          {distribucionTrlData ? (
            <Plot data={distribucionTrlData.data} layout={{ title: 'Distribución TRL' }} />
          ) : (
            <p>No hay datos disponibles para este gráfico.</p>
          )}
        </div>

        {/* Gráfico Aprobación por TRL */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Aprobación por TRL</h3>
          {aprobacionPorTrlData ? (
            <Plot data={aprobacionPorTrlData.data} layout={{ title: 'Aprobación por TRL' }} />
          ) : (
            <p>No hay datos disponibles para este gráfico.</p>
          )}
        </div>

        {/* Gráfico Proporción de Proyectos Aprobados */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Proporción de Proyectos Aprobados</h3>
          {proporcionAprobadosData ? (
            <Plot data={proporcionAprobadosData.data} layout={{ title: 'Proporción de Proyectos Aprobados' }} />
          ) : (
            <p>No hay datos disponibles para este gráfico.</p>
          )}
        </div>

        {/* Gráfico Puntaje TRL */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Puntaje TRL</h3>
          {puntajeTrlData ? (
            <Plot data={puntajeTrlData.data} layout={{ title: 'Puntaje TRL' }} />
          ) : (
            <p>No hay datos disponibles para este gráfico.</p>
          )}
        </div>

        {/* Gráfico Distribución por Industria */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Distribución por Industria</h3>
          {distribucionIndustriaData ? (
            <Plot data={distribucionIndustriaData.data} layout={{ title: 'Distribución por Industria' }} />
          ) : (
            <p>No hay datos disponibles para este gráfico.</p>
          )}
        </div>

        {/* Gráfico Nivel de Inglés */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Nivel de Inglés de los Proyectos</h3>
          {nivelInglesData ? (
            <Plot data={nivelInglesData.data} layout={{ title: 'Nivel de Inglés de los Proyectos' }} />
          ) : (
            <p>No hay datos disponibles para este gráfico.</p>
          )}
        </div>

        {/* Gráfico Ubicación Geográfica */}
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Ubicación Geográfica de los Proyectos</h3>
          {ubicacionGeograficaData ? (
            <Plot data={ubicacionGeograficaData.data} layout={{ title: 'Ubicación Geográfica de los Proyectos' }} />
          ) : (
            <p>No hay datos disponibles para este gráfico.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Graficos;
