import Navbar from '../components/Navbar';
import TemplateList from './template/TemplateList';
import Footer from '../components/Footer';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-fuchsia-100 relative overflow-x-hidden">
      <Navbar />

      {/* Декоративные градиентные круги */}
      <div className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-blue-300 via-emerald-200 to-fuchsia-400 opacity-20 blur-3xl -top-32 -left-32 pointer-events-none z-0" />
      <div className="absolute w-[500px] h-[400px] rounded-full bg-gradient-to-tr from-emerald-200 via-blue-200 to-fuchsia-200 opacity-15 blur-2xl -bottom-24 -right-44 pointer-events-none z-0" />

      <div className="relative z-10">
        <div className="py-14">
          <header className="mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-blue-900 mb-1 flex items-center gap-2">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="10" width="20" height="12" rx="6" />
                  <path d="M11 17h10M13 13h6" />
                </svg>
                Dashboard
              </h1>
              <p className="text-lg text-gray-500 font-medium max-w-2xl">
                Добро пожаловать в систему целей! <span className="text-emerald-600">Здесь — ваша мотивация, ваши шаблоны, ваши победы.</span>
              </p>
            </div>
          </header>

          <main>
            <section className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-10 sm:px-0 rounded-3xl shadow-2xl bg-white/95 border border-blue-100">
                {/* Современный заголовок секции шаблонов */}
                <div className="mb-8 text-center flex flex-col items-center">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-800 tracking-tight mb-2">
                    Публичные шаблоны
                  </h2>
                  <span className="block text-base sm:text-lg text-blue-400 font-medium">
                    Открытые шаблоны для всех пользователей
                  </span>
                </div>
                <TemplateList />
              </div>
            </section>
          </main>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Dashboard;
