function AboutPage(props) {
  return (
    <div className="page-enter min-h-screen text-white flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-2xl">
        <button
          onClick={props.onBack}
          className="mb-8 text-gray-400 hover:text-white"
        >
          رجوع
        </button>

        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-transparent">
          عن فورتكس
        </h1>

        <div className="glass-card border rounded-2xl p-6 mb-6">
          <p className="text-gray-300 leading-relaxed">
            فورتكس مجموعة ألعاب كلاسيكية بروح جديدة، صممت لتكون سريعة وممتعة وبدون تعقيد. سجّل حسابك، اختر لعبتك، وابدأ اللعب مباشرة من متصفحك على أي جهاز.
          </p>
        </div>

        <div className="glass-card border rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-3 text-purple-400">الألعاب المتاحة</h2>
          <p className="text-gray-400 leading-relaxed">
            اختبار السرعة، إكس أو، 2048، الذاكرة، تكسير الطوب، الثعبان، الطائر القافز، الديناصور، تتريس، بناء البرج، وغزاة الفضاء.
          </p>
        </div>

        <div className="glass-card border rounded-2xl p-6 text-center">
          <h2 className="text-lg font-bold mb-2 text-purple-400">تواصل معنا</h2>
          <p className="text-gray-400 mb-4">سجاد مهدي | Sajjad Mahdi</p>
          <a
            href="https://wa.me/9647857408440"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-500 rounded-full font-semibold transition-colors"
          >
            تواصل عبر واتساب
          </a>
        </div>
      </div>
    </div>
  )
}

export default AboutPage