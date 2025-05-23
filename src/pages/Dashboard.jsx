// File: src/pages/Dashboard.jsx
import Navbar from '../components/Navbar';
import TemplateList from './template/TemplateList'; // путь поправь если другой

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Сюда вставляем TemplateList */}
            <div className="px-4 py-8 sm:px-0">
              <TemplateList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
