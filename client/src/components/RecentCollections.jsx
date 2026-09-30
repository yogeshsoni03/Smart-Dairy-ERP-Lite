function RecentCollections({
  collections,
}) {

  return (
    <div className="bg-slate-900 p-5 rounded-xl">

      <h2 className="text-xl font-bold mb-4">
        Recent Collections
      </h2>

      <table className="w-full">

        <thead>
          <tr>
            <th>ID</th>
            <th>Farmer</th>
            <th>Milk</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>

          {collections?.map(
            (item) => (
              <tr
                key={
                  item.collectionId
                }
              >
                <td>
                  {
                    item.collectionId
                  }
                </td>

                <td>
                  {
                    item.farmerName
                  }
                </td>

                <td>
                  {
                    item.quantity
                  }
                </td>

                <td>
                  ₹{item.amount}
                </td>
              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}

export default RecentCollections;