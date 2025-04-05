import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

interface ProjectsTableProps {
  proyectos: any[];
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ 
  proyectos, 
  currentPage,
  itemsPerPage,
  setCurrentPage 
}) => {
  // Estado para el ordenamiento
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({ 
    key: 'Puntaje Total', 
    direction: 'descending' 
  });

  // Función para ordenar los proyectos
  const sortedProjects = [...proyectos].sort((a, b) => {
    // Ordenar primero por aprobación (Sí primero)
    if (a.Aprobado !== b.Aprobado) {
      return a.Aprobado === 'Sí' ? -1 : 1;
    }

    // Luego por el criterio seleccionado
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Función para cambiar el ordenamiento
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  // Paginación
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = sortedProjects.slice(startIndex, startIndex + itemsPerPage);

  // Función para renderizar el header con ordenamiento
  const renderSortableHeader = (key: string, label: string) => {
    return (
      <th 
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
        onClick={() => requestSort(key)}
      >
        <div className="flex items-center">
          {label}
          {sortConfig.key === key && (
            sortConfig.direction === 'ascending' ? 
              <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
              <ChevronDownIcon className="ml-1 h-4 w-4" />
          )}
        </div>
      </th>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
              {renderSortableHeader('Aprobado', 'Aprobado')}
              {renderSortableHeader('Puntaje TRL 1-3', 'TRL 1-3')}
              {renderSortableHeader('Puntaje TRL 4-7', 'TRL 4-7')}
              {renderSortableHeader('Puntaje TRL 8-9', 'TRL 8-9')}
              {renderSortableHeader('Puntaje Total', 'Total')}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segmento</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProjects.map((proyecto, index) => {
              // Calcular puntaje total si no viene del backend
              const puntajeTotal = proyecto["Puntaje Total"] || 
                (proyecto["Puntaje TRL 1-3"] + proyecto["Puntaje TRL 4-7"] + proyecto["Puntaje TRL 8-9"]);
              
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {proyecto["Nombre del Proyecto"]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      proyecto.Aprobado === "Sí" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {proyecto.Aprobado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{proyecto["Puntaje TRL 1-3"]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{proyecto["Puntaje TRL 4-7"]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{proyecto["Puntaje TRL 8-9"]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {puntajeTotal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proyecto["Segmento TRL"] || 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Paginación mejorada */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
          <span className="font-medium">{Math.min(startIndex + itemsPerPage, sortedProjects.length)}</span> de{' '}
          <span className="font-medium">{sortedProjects.length}</span> proyectos
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md text-sm font-medium text-purple-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <div className="flex items-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`mx-1 px-3 py-1 rounded-md text-sm ${currentPage === page ? 'bg-purple-600 text-white' : 'text-purple-600 hover:bg-purple-50'}`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md text-sm font-medium text-purple-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTable;