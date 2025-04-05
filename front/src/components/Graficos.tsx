import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { getGraficosData } from '../services/api';

const Graficos: React.FC = () => {
  const [graficos, setGraficos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

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

  if (loading) return <div className="flex justify-center items-center h-64">Cargando gráficos...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  // Parsear los datos de los gráficos manteniendo sus layouts originales
  const parseGraphData = (graphData: string | null) => {
    if (!graphData) return null;
    try {
      const parsed = JSON.parse(graphData);
      return {
        data: parsed.data,
        layout: parsed.layout || { title: 'Gráfico' },
        config: { responsive: true }
      };
    } catch (e) {
      console.error("Error parsing graph data:", e);
      return null;
    }
  };

  const graficosData = [
    {
      title: "📊 Distribución por Nivel TRL",
      data: parseGraphData(graficos?.distribucion_trl),
      description: "Distribución de proyectos por segmento de madurez tecnológica (TRL)"
    },
    {
      title: "✅ Proyectos Aprobados",
      data: parseGraphData(graficos?.proporcion_aprobados),
      description: "Proporción de proyectos aprobados vs no aprobados"
    },
    {
      title: "📈 Aprobación por Segmento TRL",
      data: parseGraphData(graficos?.aprobacion_por_trl),
      description: "Relación entre aprobación y nivel de madurez tecnológica"
    },
    {
      title: "🔍 Distribución de Puntajes TRL 1-3",
      data: parseGraphData(graficos?.puntaje_trl),
      description: "Distribución de puntajes para proyectos con TRL 1-3"
    },
    {
      title: "🏭 Proyectos por Industria",
      data: parseGraphData(graficos?.distribucion_industria),
      description: "Distribución de proyectos por sector industrial"
    },
    {
      title: "🌍 Nivel de Inglés",
      data: parseGraphData(graficos?.nivel_ingles),
      description: "Distribución del nivel de inglés reportado en los proyectos"
    },
    {
      title: "📍 Ubicación Geográfica",
      data: parseGraphData(graficos?.ubicacion_geografica),
      description: "Distribución geográfica de los proyectos"
    }
  ].filter(item => item.data !== null);

  // Configuración común para todos los gráficos
  const commonConfig = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    scrollZoom: false
  };

  // Estilo para los contenedores de gráficos
  const graphContainerStyle = "bg-white p-4 rounded-lg shadow-md mb-8 h-full";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Visualización de Datos</h2>
      
      {/* Versión para móviles - Carrusel */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden rounded-xl shadow-lg bg-white p-4 mb-4 h-96">
          {graficosData[activeSlide] && (
            <>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{graficosData[activeSlide].title}</h3>
              <p className="text-sm text-gray-600 mb-3">{graficosData[activeSlide].description}</p>
              <div className="h-64">
                <Plot 
                  data={graficosData[activeSlide].data.data} 
                  layout={{...graficosData[activeSlide].data.layout, height: 300}} 
                  config={commonConfig}
                  useResizeHandler
                  style={{width: '100%', height: '100%'}}
                />
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-center space-x-2 mb-8">
          {graficosData.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full ${activeSlide === index ? 'bg-blue-600' : 'bg-gray-300'}`}
              aria-label={`Ir a gráfico ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Versión para desktop - Grid */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-6">
        {graficosData.map((graph, index) => (
          <div key={index} className={graphContainerStyle}>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{graph.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{graph.description}</p>
            <div className="h-96">
              <Plot 
                data={graph.data.data} 
                layout={{...graph.data.layout, height: 400}} 
                config={commonConfig}
                useResizeHandler
                style={{width: '100%', height: '100%'}}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Graficos;  