function StatCard({
  title,
  value,
}) {
  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">

      <h3 className="text-slate-400">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>

    </div>
  );
}

export default StatCard;