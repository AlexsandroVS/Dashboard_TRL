import React, { useState } from 'react';
import { buscarProyecto } from '../services/api';
import ProjectDetailModal from './ProjectDetailModal';
import { FiSearch } from 'react-icons/fi';

interface ProjectSearchProps {
  password: string;
}

interface ProjectData {
  [key: string]: any;
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({ password }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ProjectData[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
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

  const handleViewDetails = (project: ProjectData) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar proyecto por nombre..."
          className="flex-grow focus:ring-2 focus:outline-0 focus:ring-purple-500 focus:border-purple-500 px-4 py-2 text-lg border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-4 py-2 text-base bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
        >
          <FiSearch />
          {isSearching ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* Resultados */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-100 text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase">Proyecto</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase">Aprobado</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {searchResults.map((proyecto, index) => (
                <tr key={index} className="hover:bg-purple-50 transition-all">
                  <td className="px-6 py-4 whitespace-pre-wrap font-medium text-lg text-gray-900">
                    {proyecto["Nombre del Proyecto"]}
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      onClick={() => handleViewDetails(proyecto)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setIsModalOpen(false)}
          password={password}
        />
      )}
    </div>
  );
};

export default ProjectSearch;
