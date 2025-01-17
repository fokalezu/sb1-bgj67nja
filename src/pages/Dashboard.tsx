import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Settings, CheckCircle, Crown, BarChart3 } from 'lucide-react';

const DashboardCard = ({ icon: Icon, title, description, to }: {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
}) => (
  <Link
    to={to}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
  >
    <div className="flex items-center space-x-4">
      <div className="bg-purple-100 p-3 rounded-full">
        <Icon className="h-6 w-6 text-purple-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  </Link>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Panoul de Control</h1>
          <p className="mt-2 text-gray-600">Gestionează-ți profilul și setările contului tău</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <DashboardCard
            icon={UserCircle}
            title="Profil"
            description="Completează sau actualizează informațiile profilului tău"
            to="/profile"
          />

          <DashboardCard
            icon={Settings}
            title="Setări Cont"
            description="Gestionează emailul și parola contului tău"
            to="/account-settings"
          />

          <DashboardCard
            icon={CheckCircle}
            title="Verificare Profil"
            description="Verifică-ți profilul pentru mai multă credibilitate"
            to="/verify-profile"
          />

          <DashboardCard
            icon={Crown}
            title="Premium"
            description="Upgrade la contul premium pentru beneficii exclusive"
            to="/premium"
          />

          <DashboardCard
            icon={BarChart3}
            title="Statistici"
            description="Vezi statisticile profilului tău și interacțiunile vizitatorilor"
            to="/statistics"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;