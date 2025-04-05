import React from "react";

interface NavbarProps {
  activeTab: 'metrics' | 'charts' | 'search' | 'projects-table' | 'insigths';
  setActiveTab: (tab: NavbarProps['activeTab']) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'metrics', label: 'Métricas', icon: 'fa-chart-bar' },
    { id: 'charts', label: 'Gráficos', icon: 'fa-chart-pie' },
    { id: 'search', label: 'Buscar', icon: 'fa-search' },
    { id: 'projects-table', label: 'Proyectos', icon: 'fa-list' },
    { id: 'insigths', label: 'Insights', icon: 'fa-lightbulb' }
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2">
        {/* LOGO A LA IZQUIERDA */}
        <div className="flex items-center">
          <img
            src="/conti-negro.png"
            alt="Logo UContinental"
            className="h-24 w-auto"
          />
        </div>

        {/* NAVEGACIÓN */}
        <ul className="flex space-x-6">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id as NavbarProps["activeTab"])}
                className={`pb-1 text-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-700 hover:text-purple-600 hover:border-b-2 hover:border-purple-200'
                }`}
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
