import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MindSpark
            </h1>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Повышайте продуктивность через формирование привычек и отслеживание эмоций
          </h2>
          
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Инструмент для офисных работников, который помогает находить баланс между работой и эмоциональным благополучием
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
            <Link
              href="/login"
              className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-xl font-medium min-w-[220px]"
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

      {/* Features Preview Section */}
      <div className="container mx-auto px-4 py-12 mb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Как это работает</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">Формируйте привычки</h3>
              <p className="text-xl text-gray-600">
                Создавайте полезные привычки и отслеживайте прогресс с помощью системы вознаграждений
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">Отслеживайте настроение</h3>
              <p className="text-xl text-gray-600">
                Оценивайте своё эмоциональное состояние каждый день с помощью интуитивного интерфейса
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">Анализируйте данные</h3>
              <p className="text-xl text-gray-600">
                Получайте инсайты о себе и находите закономерности
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12 mb-20">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-6xl font-bold mb-4">10K+</div>
              <div className="text-xl text-indigo-100">Пользователей</div>
            </div>
            <div>
              <div className="text-6xl font-bold mb-4">95%</div>
              <div className="text-xl text-indigo-100">Улучшили настроение</div>
            </div>
            <div>
              <div className="text-6xl font-bold mb-4">87%</div>
              <div className="text-xl text-indigo-100">Повысили продуктивность</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 mb-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Готовы начать путь к лучшей версии себя?</h2>
          <p className="text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам людей, которые уже улучшили свою жизнь
          </p>
          <Link
            href="/register"
            className="px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-2xl font-medium inline-block"
          >
            Начать бесплатно
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-12 mt-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-12 mb-8">
            <Link href="/disclaimer" className="text-lg text-gray-500 hover:text-gray-700">
              Отказ от ответственности
            </Link>
            <Link href="/privacy" className="text-lg text-gray-500 hover:text-gray-700">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="text-lg text-gray-500 hover:text-gray-700">
              Условия использования
            </Link>
          </div>
          <p className="text-lg text-gray-500">
            © {new Date().getFullYear()} MindSpark. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
}