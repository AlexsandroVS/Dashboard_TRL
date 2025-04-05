import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ChartSectionProps {
  graficos: any;
}

const ChartSection: React.FC<ChartSectionProps> = ({ graficos }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const parseChartData = (chartData: string) => {
    try {
      return chartData ? JSON.parse(chartData) : null;
    } catch (error) {
      console.error('Error parsing chart data:', error);
      return null;
    }
  };

  const chartData = [
    {
      title: "Distribución TRL",
      data: parseChartData(graficos?.distribucion_trl),
      cols: 2
    },
    {
      title: "Proporción Aprobados",
      data: parseChartData(graficos?.proporcion_aprobados),
      cols: 1
    },
    {
      title: "Aprobación por TRL",
      data: parseChartData(graficos?.aprobacion_por_trl),
      cols: 2
    },
    {
      title: "Puntaje TRL 1-3",
      data: parseChartData(graficos?.puntaje_trl13),
      cols: 1
    },
    {
      title: "Distribución por Industria",
      data: parseChartData(graficos?.distribucion_industria),
      cols: 1
    },
    {
      title: "Nivel de Inglés",
      data: parseChartData(graficos?.nivel_ingles),
      cols: 1
    },
    {
      title: "Ubicación Geográfica",
      data: parseChartData(graficos?.ubicacion_geografica),
      cols: 1
    }
  ];

  const slidesPerView = 2; // Mostrar 2 gráficos a la vez
  const totalSlides = Math.ceil(chartData.length / slidesPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  if (!graficos) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
        Actualice los datos para ver los gráficos
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Visualización de Datos</h3>
        <div className="flex space-x-2">
          <button 
            onClick={prevSlide}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={nextSlide}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div 
              key={slideIndex} 
              className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {chartData
                .slice(slideIndex * slidesPerView, (slideIndex + 1) * slidesPerView)
                .map((chart, index) => (
                  <div 
                    key={index} 
                    className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 ${
                      chart.cols === 2 ? 'md:col-span-2' : ''
                    }`}
                  >
                    <h4 className="font-medium text-gray-800 mb-4">{chart.title}</h4>
                    <div className="h-80">
                      {chart.data ? (
                        <Plot
                          data={chart.data.data}
                          layout={{
                            ...chart.data.layout,
                            width: null, // Hacer que sea responsivo
                            height: 300,
                            margin: { t: 30, b: 40, l: 50, r: 30 }
                          }}
                          config={{ 
                            responsive: true,
                            displayModeBar: false // Ocultar barra de herramientas para más espacio
                          }}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          Datos no disponibles
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-purple-600' : 'bg-gray-300'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ChartSection;