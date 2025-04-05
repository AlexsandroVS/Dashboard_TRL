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
  setCurrentPage,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  }>({
    key: 'Puntaje Total',
    direction: 'descending',
  });

  const sortedProjects = [...proyectos].sort((a, b) => {
    if (a.Aprobado !== b.Aprobado) {
      return a.Aprobado === 'Sí' ? -1 : 1;
    }
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = sortedProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const renderSortableHeader = (key: string, label: string) => {
    const isActive = sortConfig.key === key;
    const direction = sortConfig.direction;
    return (
      <th
        className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
        onClick={() => requestSort(key)}
      >
        <div className="flex items-center gap-1">
          {label}
          {isActive &&
            (direction === 'ascending' ? (
              <ChevronUpIcon className="h-5 w-5 text-purple-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-purple-500" />
            ))}
        </div>
      </th>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-base">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Proyecto</th>
              {renderSortableHeader('Aprobado', 'Aprobado')}
              {renderSortableHeader('Puntaje TRL 1-3', 'TRL 1-3')}
              {renderSortableHeader('Puntaje TRL 4-7', 'TRL 4-7')}
              {renderSortableHeader('Puntaje TRL 8-9', 'TRL 8-9')}
              {renderSortableHeader('Puntaje Total', 'Total')}
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Segmento</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProjects.map((proyecto, index) => {
              const puntajeTotal =
                proyecto["Puntaje Total"] ||
                (proyecto["Puntaje TRL 1-3"] +
                  proyecto["Puntaje TRL 4-7"] +
                  proyecto["Puntaje TRL 8-9"]);

              return (
                <tr
                  key={index}
                  className="hover:bg-purple-50 transition-all duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-lg text-gray-900">
                    {proyecto["Nombre del Proyecto"]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${
                        proyecto.Aprobado === 'Sí'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {proyecto.Aprobado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {proyecto["Puntaje TRL 1-3"]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {proyecto["Puntaje TRL 4-7"]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {proyecto["Puntaje TRL 8-9"]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                    {puntajeTotal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {proyecto["Segmento TRL"] || 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-base">
        <div className="text-gray-700">
          Mostrando <span className="font-semibold">{startIndex + 1}</span> a{' '}
          <span className="font-semibold">
            {Math.min(startIndex + itemsPerPage, sortedProjects.length)}
          </span>{' '}
          de <span className="font-semibold">{sortedProjects.length}</span> proyectos
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md font-medium text-purple-600 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <div className="flex items-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`mx-1 px-3 py-1 rounded-md font-medium ${
                  currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-600 hover:bg-purple-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md font-medium text-purple-600 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTable;
