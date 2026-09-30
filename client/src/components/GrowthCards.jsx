function GrowthCards({ growth }) {

  return (
    <div className="grid md:grid-cols-2 gap-5">

      <div className="bg-slate-900 p-5 rounded-xl">

        <h3 className="text-slate-400">
          Milk Growth
        </h3>

        <p className="text-4xl font-bold text-green-400">
          {growth?.milkGrowthPercent}%
        </p>

      </div>

      <div className="bg-slate-900 p-5 rounded-xl">

        <h3 className="text-slate-400">
          Revenue Growth
        </h3>

        <p className="text-4xl font-bold text-green-400">
          {growth?.amountGrowthPercent}%
        </p>

      </div>

    </div>
  );
}

export default GrowthCards;