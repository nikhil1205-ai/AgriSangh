const SectionCard = ({ title, action, children }) => (
  <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm uppercase tracking-widest text-gray-500 font-semibold">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

export default SectionCard;
