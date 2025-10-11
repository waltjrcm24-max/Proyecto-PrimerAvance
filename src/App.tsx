import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, FileText } from 'lucide-react';
import Login from './components/Login';
import Layout from './components/Layout';
import WasteForm from './components/WasteForm';
import TabletWasteForm from './components/TabletWasteForm';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import { initializeStorage, getAuthState, getWasteRecords } from './utils/storage';
import { WasteRecord } from './types';

type ActiveTab = 'capture' | 'dashboard' | 'reports';

function App() {
  const [authState, setAuthState] = useState(getAuthState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('capture');
  const [records, setRecords] = useState<WasteRecord[]>([]);

  useEffect(() => {
    initializeStorage();
    setRecords(getWasteRecords());
  }, []);

  const handleLogin = (user: any) => {
    setAuthState({ isAuthenticated: true, user });
  };

  const handleLogout = () => {
    setAuthState({ isAuthenticated: false, user: null });
    setActiveTab('capture');
  };

  const handleRecordAdded = (record: WasteRecord) => {
    setRecords(prev => [...prev, record]);
  };

  const handleRecordDeleted = () => {
    setRecords(getWasteRecords());
  };

  if (!authState.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Define tabs based on user role
  const tabs = authState.user?.role === 'operator' ? [
    {
      id: 'capture' as const,
      name: 'Captura de Residuos',
      icon: Plus,
      color: 'text-green-600 bg-green-100'
    }
  ] : [
    {
      id: 'capture' as const,
      name: 'Captura de Información',
      icon: Plus,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'dashboard' as const,
      name: 'Dashboard',
      icon: BarChart3,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'reports' as const,
      name: 'Reportes',
      icon: FileText,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <Layout user={authState.user} onLogout={handleLogout}>
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg mr-3 ${
                    isActive ? tab.color : 'text-gray-400 bg-gray-100'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'capture' && (
          authState.user?.role === 'operator' ? (
            <TabletWasteForm user={authState.user} onRecordAdded={handleRecordAdded} />
          ) : (
            <WasteForm user={authState.user} onRecordAdded={handleRecordAdded} />
          )
        )}
        {activeTab === 'dashboard' && (
          <Dashboard records={records} />
        )}
        {activeTab === 'reports' && (
          <Reports records={records} onRecordDeleted={handleRecordDeleted} />
        )}
      </div>
    </Layout>
  );
}

export default App;