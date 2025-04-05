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
      title: 'Distribución TRL',
      data: parseChartData(graficos?.distribucion_trl),
    },
    {
      title: 'Proporción Aprobados + Puntaje TRL 1-3',
      data: parseChartData(graficos?.proporcion_y_puntaje),
    },
    {
      title: 'Aprobación por TRL',
      data: parseChartData(graficos?.aprobacion_por_trl),
    },
    {
      title: 'Distribución por Industria',
      data: parseChartData(graficos?.distribucion_industria),
    },
    {
      title: 'Nivel de Inglés + Ubicación',
      data: parseChartData(graficos?.ingles_y_ubicacion),
    },
  ];

  const slidesPerView = 2;
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
              className="w-full flex-shrink-0 flex flex-col gap-6"
            >
              {chartData
                .slice(slideIndex * slidesPerView, (slideIndex + 1) * slidesPerView)
                .map((chart, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                    style={{ minHeight: 500 }}
                  >
                    <h4 className="font-medium text-gray-800 mb-4 text-lg">
                      {chart.title}
                    </h4>
                    <div className="h-[450px]">
                      {chart.data ? (
                        <Plot
                          data={chart.data.data}
                          layout={{
                            ...chart.data.layout,
                            width: null,
                            height: 450,
                            margin: chart.data.layout?.margin || {
                              t: 60,
                              b: 60,
                              l: 50,
                              r: 40,
                            },
                          }}
                          config={{
                            responsive: true,
                            displayModeBar: false,
                          }}
                          style={{ width: '100%', height: '100%' }}
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
