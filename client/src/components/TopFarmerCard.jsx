function TopFarmerCard({ farmer }) {

  if (!farmer) return null;

  return (
    <div className="bg-slate-900 p-5 rounded-xl">

      <h2 className="text-xl font-bold mb-4">
        Top Farmer
      </h2>

      <h3 className="text-2xl font-bold">
        {farmer.farmerName}
      </h3>

      <p className="mt-2">
        Milk : {farmer.totalMilk} L
      </p>

      <p>
        Amount : ₹{farmer.totalAmount}
      </p>

    </div>
  );
}

export default TopFarmerCard;