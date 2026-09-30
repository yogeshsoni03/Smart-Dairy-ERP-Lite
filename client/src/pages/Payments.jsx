import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Payments() {

  const [payments, setPayments] =
    useState([]);

  const [month, setMonth] =
    useState(
      new Date().getMonth() + 1
    );

  const [year, setYear] =
    useState(
      new Date().getFullYear()
    );

  const [cycle, setCycle] =
    useState(1);

  const fetchPayments =
    async () => {

      try {

        const response =
          await api.get(
            `/payments?month=${month}&year=${year}&cycle=${cycle}`
          );

        setPayments(
          response.data.payments
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {

    fetchPayments();

  }, [month, year, cycle]);

  const markPaid =
    async (payment) => {

      try {

        await api.post(
          "/payments/pay",
          {
            farmerId:
              payment.farmerId,

            farmerName:
              payment.farmerName,

            month,

            year,

            cycle,

            amount:
              payment.totalAmount,
          }
        );

        alert(
          "Payment Marked Paid Successfully"
        );

        fetchPayments();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Payment Failed"
        );
      }
    };

  const markUnpaid = async (paymentId) => {

    const confirmUndo = window.confirm(
      "Change payment back to Pending?"
    );

    if (!confirmUndo) return;

    try {

      await api.delete(
        `/payments/unpay/${paymentId}`
      );

      alert(
        "Payment Changed To Pending"
      );

      fetchPayments();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed To Change Status"
      );

    }
  };

  const openReceipt = async (farmerId) => {

    try {

      const response =
        await api.get(
          `/payments/receipt/${farmerId}?month=${month}&year=${year}&cycle=${cycle}`,
          {
            responseType: "blob",
          }
        );

      const pdfBlob =
        new Blob(
          [response.data],
          {
            type: "application/pdf",
          }
        );

      const pdfUrl =
        window.URL.createObjectURL(
          pdfBlob
        );

      window.open(
        pdfUrl,
        "_blank"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed To Open Receipt"
      );
    }
  };

  return (

    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8 text-white">

        <h1 className="text-4xl font-bold mb-8">
          Payments
        </h1>

        <div
          className="
                    bg-slate-900
                    p-5
                    rounded-xl
                    mb-6
                    flex
                    gap-4
                    items-center
                "
        >

          <div>

            <label className="block mb-1">
              Month
            </label>

            <select
              value={month}
              onChange={(e) =>
                setMonth(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
                                bg-slate-800
                                p-2
                                rounded
                            "
            >

              {
                [...Array(12)].map(
                  (_, i) => (
                    <option
                      key={i + 1}
                      value={i + 1}
                    >
                      {i + 1}
                    </option>
                  )
                )
              }

            </select>

          </div>

          <div>

            <label className="block mb-1">
              Year
            </label>

            <input
              type="number"
              value={year}
              onChange={(e) =>
                setYear(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
                                bg-slate-800
                                p-2
                                rounded
                            "
            />

          </div>

          <div>

            <label className="block mb-1">
              Cycle
            </label>

            <select
              value={cycle}
              onChange={(e) =>
                setCycle(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
                                bg-slate-800
                                p-2
                                rounded
                            "
            >

              <option value="1">
                1 - 10
              </option>

              <option value="2">
                11 - 20
              </option>

              <option value="3">
                21 - End
              </option>

            </select>

          </div>

          <button
            onClick={fetchPayments}
            className="
                            bg-blue-600
                            hover:bg-blue-700
                            px-5
                            py-2
                            rounded
                            mt-6
                        "
          >
            Load Payments
          </button>

        </div>

        <div
          className="
                    bg-slate-900
                    rounded-xl
                    overflow-hidden
                "
        >

          <table className="w-full">

            <thead
              className="
                            bg-slate-800
                        "
            >

              <tr>

                <th className="p-4 text-left">
                  Farmer ID
                </th>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Village
                </th>

                <th className="p-4 text-left">
                  Collections
                </th>

                <th className="p-4 text-left">
                  Milk
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {
                payments.length === 0
                  ? (
                    <tr>

                      <td
                        colSpan="8"
                        className="
                                                text-center
                                                p-8
                                            "
                      >
                        No Payments Found
                      </td>

                    </tr>
                  )
                  : (
                    payments.map(
                      (
                        payment
                      ) => (

                        <tr
                          key={
                            payment.farmerId
                          }
                          className="
                                                    border-t
                                                    border-slate-800
                                                "
                        >

                          <td className="p-4">
                            {
                              payment.farmerId
                            }
                          </td>

                          <td className="p-4">
                            {
                              payment.farmerName
                            }
                          </td>

                          <td className="p-4">
                            {
                              payment.village
                            }
                          </td>

                          <td className="p-4">
                            {
                              payment.totalCollections
                            }
                          </td>

                          <td className="p-4">
                            {
                              payment.totalMilk
                            } L
                          </td>

                          <td className="p-4">
                            ₹
                            {
                              payment.totalAmount
                            }
                          </td>

                          <td className="p-4">

                            {
                              payment.status ===
                                "Paid"
                                ? (
                                  <span
                                    className="
                                                                        text-green-400
                                                                    "
                                  >
                                    Paid
                                  </span>
                                )
                                : (
                                  <span
                                    className="
                                                                        text-yellow-400
                                                                    "
                                  >
                                    Pending
                                  </span>
                                )
                            }

                          </td>

                          <td className="p-4 flex gap-2">


                            {
                              payment.status === "Paid" ? (

                                <button
                                  onClick={() =>
                                    markUnpaid(
                                      payment.paymentId
                                    )
                                  }
                                  className="
        bg-red-600
        hover:bg-red-700
        px-3
        py-1
        rounded
      "
                                >
                                  Undo
                                </button>

                              ) : (

                                <button
                                  onClick={() =>
                                    markPaid(payment)
                                  }
                                  className="
        bg-green-600
        hover:bg-green-700
        px-3
        py-1
        rounded
      "
                                >
                                  Pay
                                </button>

                              )
                            }

                            <button
                              onClick={() =>
                                openReceipt(
                                  payment.farmerId
                                )
                              }
                              className="
                                                            bg-blue-600
                                                            hover:bg-blue-700
                                                            px-3
                                                            py-1
                                                            rounded
                                                        "
                            >
                              Receipt
                            </button>

                          </td>

                        </tr>

                      )
                    )
                  )
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Payments;