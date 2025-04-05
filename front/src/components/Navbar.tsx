import React from "react";

interface NavbarProps {
  activeTab: 'metrics' | 'charts' | 'search' | 'projects-table';
  setActiveTab: (tab: 'metrics' | 'charts' | 'search' | 'projects-table') => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'metrics', label: 'Métricas', icon: 'fa-chart-bar' },
    { id: 'charts', label: 'Gráficos', icon: 'fa-chart-pie' },
    { id: 'search', label: 'Buscar', icon: 'fa-search' },
    { id: 'projects-table', label: 'Proyectos', icon: 'fa-list' }
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold text-purple-700">Dashboard TRL</h1>
        <ul className="flex space-x-6">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-700 hover:text-purple-600'
                } transition pb-1`}
              >
                <i className={`fas ${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;