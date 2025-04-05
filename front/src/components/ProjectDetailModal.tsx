import React, { useState } from 'react';
import { 
  FiX, 
  FiPrinter, 
  FiCheckCircle, 
  FiXCircle, 
  FiUser, 
  FiBarChart2,
  FiAward,
  FiInfo,
  FiFileText
} from 'react-icons/fi';

interface ProjectDetailModalProps {
  project: any;
  onClose: () => void;
  password: string;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose, password }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const apiUrl = 'http://127.0.0.1:8000';

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const projectName = encodeURIComponent(project["Nombre del Proyecto"]);
      const url = `${apiUrl}/reporte-proyecto/${projectName}`;
      const auth = `Basic ${btoa(`admin:${password}`)}`;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Preparando reporte...</title></head>
            <body style="display: flex; justify-content: center; align-items: center; height: 100vh;">
              <div style="text-align: center;">
                <p>Generando reporte, por favor espere...</p>
              </div>
            </body>
          </html>
        `);
        
        const response = await fetch(url, {
          headers: { 'Authorization': auth }
        });
        const html = await response.text();
        
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } catch (error) {
      console.error('Error al imprimir:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FiFileText className="text-purple-600" />
                Detalle del Proyecto
              </h3>
              <p className="text-sm text-gray-500 mt-1">Información completa del proyecto seleccionado</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <FiX size={24} />
            </button>
          </div>
          
          {/* Contenido */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda - Información General */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FiInfo className="text-blue-500" />
                Información General
              </h4>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiFileText size={14} /> Nombre del Proyecto
                  </p>
                  <p className="mt-1 text-gray-900 pl-6">{project["Nombre del Proyecto"]}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiAward size={14} /> Estado de Aprobación
                  </p>
                  <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${project.Aprobado === "Sí" ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} pl-6`}>
                    {project.Aprobado === "Sí" ? (
                      <FiCheckCircle className="mr-1.5" />
                    ) : (
                      <FiXCircle className="mr-1.5" />
                    )}
                    {project.Aprobado}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiBarChart2 size={14} /> Nivel TRL
                  </p>
                  <p className="mt-1 text-gray-900 pl-6">{project["Nivel TRL"]}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiUser size={14} /> Docente Acompañante
                  </p>
                  <p className="mt-1 text-gray-900 pl-6">{project["Docente Acompañante"] ? 'Sí' : 'No'}</p>
                </div>
              </div>
            </div>
            
            {/* Columna derecha - Puntajes TRL */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FiBarChart2 className="text-purple-500" />
                Puntajes TRL
              </h4>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-700">TRL 1-3 (Básico)</p>
                    <span className="text-sm font-medium text-gray-900">{project["Puntaje TRL 1-3"]}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, project["Puntaje TRL 1-3"])}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-700">TRL 4-7 (Intermedio)</p>
                    <span className="text-sm font-medium text-gray-900">{project["Puntaje TRL 4-7"]}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, project["Puntaje TRL 4-7"])}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-700">TRL 8-9 (Avanzado)</p>
                    <span className="text-sm font-medium text-gray-900">{project["Puntaje TRL 8-9"]}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, project["Puntaje TRL 8-9"])}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <FiInfo className="text-blue-500 mt-0.5 flex-shrink-0" />
                    Los puntajes TRL representan el nivel de madurez tecnológica del proyecto en cada segmento.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer con botones */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <FiX size={16} />
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-70 transition-colors flex items-center justify-center gap-2"
            >
              {isPrinting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando...
                </>
              ) : (
                <>
                  <FiPrinter size={16} />
                  Imprimir Reporte
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;