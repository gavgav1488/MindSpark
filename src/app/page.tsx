import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MindSpark
            </h1>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-90 mb-8 leading-tight">
            Повышайте продуктивность через формирование привычек и отслеживание эмоций
          </h2>
          
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Инструмент для офисных работников, который помогает находить баланс между работой и эмоциональным благополучием
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
            <Link
              href="/login"
              className="px-10 py-5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-xl font-medium min-w-[220px]"
            >
              Войти
            </Link>
            <Link
              href="/register"
              className="px-10 py-5 bg-white text-indigo-600 border-2 border-indigo-300 rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-xl font-medium min-w-[220px]"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12 mb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-100">
            <div className="text-5xl font-bold text-indigo-600 mb-3">100+</div>
            <div className="text-xl text-gray-600">Активных пользователей</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-100">
            <div className="text-5xl font-bold text-green-60 mb-3">87%</div>
            <div className="text-xl text-gray-60">Улучшили продуктивность</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-10">
            <div className="text-5xl font-bold text-purple-60 mb-3">92%</div>
            <div className="text-xl text-gray-600">Отмечают улучшение настроения</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Как MindSpark помогает вам</h2>
            <p className="text-2xl text-gray-60 max-w-3xl mx-auto">
              Комплексный подход к повышению продуктивности и улучшению эмоционального состояния
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-10 hover:shadow-2xl transition-all duration-300">
              <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-8 mx-auto">
                <svg className="w-10 h-10 text-indigo-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Трекер привычек</h3>
              <p className="text-xl text-gray-600 text-center mb-8">
                Формируйте полезные привычки и отслеживайте прогресс с помощью системы вознаграждений
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl text-gray-600">Гибкие настройки частоты</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-green-50 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl text-gray-60">Уведомления и напоминания</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl text-gray-600">Статистика и аналитика</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-10 hover:shadow-2xl transition-all duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-8 mx-auto">
                <svg className="w-10 h-10 text-green-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Трекер настроения</h3>
              <p className="text-xl text-gray-600 text-center mb-8">
                Отслеживайте свое эмоциональное состояние каждый день с помощью интуитивного интерфейса
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-green-50 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl text-gray-600">Шкала оценки от 1 до 10</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl text-gray-600">Календарь настроения</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xl text-gray-600">Корреляция с привычками</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 mb-16">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-16 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Готовы начать путь к лучшей версии себя?</h2>
          <p className="text-2xl mb-10 text-indigo-100 max-w-3xl mx-auto">
            Присоединяйтесь к тысячам пользователей, которые уже улучшили свою продуктивность и эмоциональное состояние
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/register"
              className="px-10 py-5 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-xl font-medium min-w-[220px]"
            >
              Начать бесплатно
            </Link>
            <Link
              href="/login"
              className="px-10 py-5 bg-transparent text-white border-2 border-white rounded-xl hover:bg-white/10 transition-all duration-300 text-xl font-medium min-w-[220px]"
            >
              Войти в аккаунт
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-12 mt-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12 mb-8">
            <Link 
              href="/disclaimer" 
              className="text-base text-gray-50 hover:text-gray-700"
            >
              Отказ от ответственности
            </Link>
            <Link 
              href="/privacy" 
              className="text-base text-gray-500 hover:text-gray-700"
            >
              Политика конфиденциальности
            </Link>
            <Link 
              href="/terms" 
              className="text-base text-gray-500 hover:text-gray-700"
            >
              Условия использования
            </Link>
          </div>
          <p className="text-base text-gray-500">
            © {new Date().getFullYear()} MindSpark. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
}