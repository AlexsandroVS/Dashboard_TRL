/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { buscarProyecto } from '../services/api';
import ProjectDetailModal from './ProjectDetailModal';

interface ProjectSearchProps {
  password: string;
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({ password }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await buscarProyecto(searchTerm, password);
      setSearchResults(results || []);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewDetails = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar proyecto por nombre..."
          className="flex-grow focus:ring-2 focus:outline-0 focus:ring-purple-500 focus:border-purple-500 px-4 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {isSearching ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aprobado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchResults.map((proyecto, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                    <button
                      onClick={() => handleViewDetails(proyecto)}
                      className="mr-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                    >
                      Ver Detalle
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                    >
                      Imprimir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setIsModalOpen(false)}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
};

export default ProjectSearch;