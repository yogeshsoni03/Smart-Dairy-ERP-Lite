import {
  useState,
  useRef
} from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Reports() {

  const [date, setDate] =
    useState("");

  const [report, setReport] =
    useState(null);

  const [farmerId, setFarmerId] =
    useState("");

  const [farmerReport, setFarmerReport] =
    useState(null);

  const [topFarmers, setTopFarmers] =
    useState([]);

  const [showTopFarmers,
    setShowTopFarmers] =
    useState(false);

  const [showDateReport,
    setShowDateReport] =
    useState(false);

  const [showFarmerReport,
    setShowFarmerReport] =
    useState(false);

  const [monthlyReport,
    setMonthlyReport] =
    useState(null);

  const [reportMonth,
    setReportMonth] =
    useState(
      new Date().getMonth() + 1
    );

  const [reportYear,
    setReportYear] =
    useState(
      new Date().getFullYear()
    );

  const [showMonthlyReport,
    setShowMonthlyReport] =
    useState(false);

  const yearInputRef =
    useRef(null);

  const generateBtnRef =
    useRef(null);

  const getDateReport =
    async () => {

      if (!date) {
        return alert(
          "Select Date"
        );
      }

      try {

        const response =
          await api.get(
            `/reports/date?date=${date}`
          );

        setReport(
          response.data
        );

        setShowDateReport(true);

      } catch (error) {

        alert(
          error.response?.data?.message
        );

      }
    };

  const downloadDatePDF =
    async () => {

      try {

        const response =
          await api.get(
            `/reports/date/pdf?date=${date}`,
            {
              responseType: "blob",
            }
          );

        const blob =
          new Blob(
            [response.data],
            {
              type:
                "application/pdf",
            }
          );

        const url =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement("a");

        link.href = url;

        const formattedDate =
          new Date(date)
            .toLocaleDateString("en-GB")
            .replaceAll("/", "-");

        link.download =
          `Date-Report-${formattedDate}.pdf`;

        link.click();

      } catch (error) {

        alert(
          "PDF Download Failed"
        );

      }
    };

  const getFarmerReport =
    async () => {

      if (!farmerId) {
        return alert(
          "Enter Farmer ID"
        );
      }

      const formattedId =
        farmerId.startsWith("FARM")
          ? farmerId
          : `FARM${String(
            farmerId
          ).padStart(3, "0")}`;

      try {

        const response =
          await api.get(
            `/reports/farmer/${formattedId}`
          );

        setFarmerReport(
          response.data
        );

        setShowFarmerReport(true);

      } catch (error) {

        alert(
          "Farmer Report Not Found"
        );

      }
    };

  const downloadFarmerPDF =
    async () => {

      if (!farmerReport) return;

      try {

        const response =
          await api.get(
            `/reports/farmer-pdf/${farmerReport.farmerId}`,
            {
              responseType: "blob",
            }
          );

        const pdfBlob =
          new Blob(
            [response.data],
            {
              type:
                "application/pdf",
            }
          );

        const pdfUrl =
          window.URL.createObjectURL(
            pdfBlob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = pdfUrl;

        link.download =
          `${farmerReport.farmerId}-Report.pdf`;

        link.click();

      } catch (error) {

        alert(
          "PDF Download Failed"
        );

      }
    };

  const getTopFarmers =
    async () => {

      if (showTopFarmers) {
        setShowTopFarmers(false);
        return;
      }

      try {

        const response =
          await api.get(
            "/reports/top-farmers"
          );

        setTopFarmers(
          response.data
        );

        setShowTopFarmers(true);

      } catch (error) {

        console.log(error);

      }
    };



  const getMonthlyReport =
    async () => {

      try {

        const response =
          await api.get(
            `/reports/monthly?month=${reportMonth}&year=${reportYear}`
          );

        setMonthlyReport(
          response.data
        );

        setShowMonthlyReport(true);

      } catch (error) {

        alert(
          "Monthly Report Failed"
        );

      }
    };

  const downloadMonthlyPDF =
    async () => {

      try {

        const response =
          await api.get(
            `/reports/monthly-pdf?month=${reportMonth}&year=${reportYear}`,
            {
              responseType: "blob",
            }
          );

        const pdfBlob =
          new Blob(
            [response.data],
            {
              type:
                "application/pdf",
            }
          );

        const pdfUrl =
          window.URL.createObjectURL(
            pdfBlob
          );

        const link =
          document.createElement("a");

        link.href = pdfUrl;

        link.download =
          `Monthly_Report_${reportMonth}_${reportYear}.pdf`;

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          pdfUrl
        );

      } catch (error) {

        alert(
          "PDF Download Failed"
        );

      }
    };

  return (

    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8 text-white">

        <h1 className="text-4xl font-bold mb-8">
          Reports
        </h1>

        {/* DATE REPORT */}

        <div className="bg-slate-900 p-5 rounded-xl mb-6">

          <h2 className="text-xl font-bold mb-4">
            Date Report
          </h2>

          <div className="flex gap-3">

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getDateReport();
                }
              }}
              className="
    bg-slate-800
    p-2
    rounded
  "
            />

            <button
              onClick={() => {

                if (showDateReport) {

                  setShowDateReport(false);

                } else {

                  getDateReport();

                }

              }}
              className={`
    px-4
    py-2
    rounded
    ${showDateReport
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
                }
  `}
            >
              {showDateReport
                ? "Hide"
                : "Generate"}
            </button>

            {
              showDateReport && (

                <button
                  onClick={downloadDatePDF}
                  className="
        bg-purple-600
        hover:bg-purple-700
        px-4
        py-2
        rounded
      "
                >
                  Download PDF
                </button>

              )
            }


          </div>



          {report && showDateReport && (

            <div className="mt-5 space-y-2">

              <p>
                Total Collections :
                {" "}
                {
                  report.totalCollections
                }
              </p>

              <p>
                Total Milk :
                {" "}
                {
                  report.totalMilk
                } L
              </p>

              <p>
                Total Amount :
                ₹
                {
                  report.totalAmount
                }
              </p>

              <hr className="border-slate-700 my-3" />

              <p>
                Morning Milk :
                {" "}
                {
                  report.morningMilk
                } L
              </p>

              <p>
                Morning Amount :
                ₹
                {
                  report.morningAmount
                }
              </p>

              <p>
                Evening Milk :
                {" "}
                {
                  report.eveningMilk
                } L
              </p>

              <p>
                Evening Amount :
                ₹
                {
                  report.eveningAmount
                }
              </p>

            </div>

          )}

        </div>

        {/* FARMER REPORT */}

        <div className="bg-slate-900 p-5 rounded-xl mb-6">

          <h2 className="text-xl font-bold mb-4">
            Farmer Report
          </h2>

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="1 or FARM001"
              value={farmerId}
              onChange={(e) =>
                setFarmerId(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getFarmerReport();
                }
              }}
              className="
    bg-slate-800
    p-2
    rounded
  "
            />

            <button
              onClick={() => {
                if (showFarmerReport) {
                  setShowFarmerReport(false);
                } else {
                  getFarmerReport();
                }
              }}
              className={`
    px-4
    py-2
    rounded
    ${showFarmerReport
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
                }
  `}
            >
              {showFarmerReport ? "Hide" : "Search"}
            </button>

            {showFarmerReport && (

              <button
                onClick={downloadFarmerPDF}
                className="
      bg-purple-600
      hover:bg-purple-700
      px-4
      py-2
      rounded
    "
              >
                Download PDF
              </button>

            )}
          </div>

          {farmerReport &&
            showFarmerReport && (

              <div className="mt-5">

                <p>
                  Farmer Name :
                  {" "}
                  {farmerReport.farmerName}
                </p>

                <p>
                  Village :
                  {" "}
                  {farmerReport.village}
                </p>

                <p>
                  Total Collections :
                  {" "}
                  {
                    farmerReport.totalCollections
                  }
                </p>

                <p>
                  Total Milk :
                  {" "}
                  {
                    farmerReport.totalMilk
                  } L
                </p>

                <p>
                  Total Amount :
                  ₹
                  {
                    farmerReport.totalAmount
                  }
                </p>

                <hr className="border-slate-700 my-4" />

                <h3 className="text-lg font-semibold mb-3">
                  Collection Details
                </h3>

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead>

                      <tr className="border-b border-slate-700">

                        <th className="p-2 text-left">
                          Date
                        </th>

                        <th className="p-2 text-left">
                          Shift
                        </th>

                        <th className="p-2 text-left">
                          Qty
                        </th>

                        <th className="p-2 text-left">
                          FAT
                        </th>

                        <th className="p-2 text-left">
                          SNF
                        </th>

                        <th className="p-2 text-left">
                          Amount
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {farmerReport?.collections?.map(
                        (item) => (

                          <tr
                            key={item._id}
                            className="
              border-b
              border-slate-800
            "
                          >

                            <td className="p-2">
                              {
                                new Date(
                                  item.createdAt
                                ).toLocaleDateString(
                                  "en-GB"
                                )
                              }
                            </td>

                            <td className="p-2">
                              {item.shift}
                            </td>

                            <td className="p-2">
                              {item.quantity}
                            </td>

                            <td className="p-2">
                              {item.fat}
                            </td>

                            <td className="p-2">
                              {item.snf}
                            </td>

                            <td className="p-2">
                              ₹
                              {
                                Number(
                                  item.amount
                                ).toFixed(2)
                              }
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            )}

        </div>

        {/* TOP FARMERS */}

        <div className="bg-slate-900 p-5 rounded-xl">

          <div className="flex justify-between mb-4">

            <h2 className="text-xl font-bold">
              Top Farmers
            </h2>

            <div className="flex gap-2">

              <button
                onClick={getTopFarmers}
                className={`
    px-4
    py-2
    rounded
    ${showTopFarmers
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-purple-600 hover:bg-purple-700"
                  }
  `}
              >
                {showTopFarmers ? "Hide" : "Load"}
              </button>

            </div>

          </div>

          {showTopFarmers && (

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-700">

                  <th className="p-3 text-left">
                    Farmer ID
                  </th>

                  <th className="p-3 text-left">
                    Name
                  </th>

                  <th className="p-3 text-left">
                    Village
                  </th>

                  <th className="p-3 text-left">
                    Milk
                  </th>

                  <th className="p-3 text-left">
                    Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                {topFarmers.map(
                  (farmer) => (

                    <tr
                      key={
                        farmer._id
                      }
                      className="
                      border-b
                      border-slate-800
                    "
                    >

                      <td className="p-3">
                        {farmer.farmerId}
                      </td>

                      <td className="p-3">
                        {farmer.farmerName}
                      </td>

                      <td className="p-3">
                        {farmer.village}
                      </td>

                      <td className="p-3">
                        {
                          Number(
                            farmer.totalMilk
                          ).toFixed(2)
                        } L
                      </td>

                      <td className="p-3">
                        ₹
                        {
                          Number(
                            farmer.totalAmount
                          ).toFixed(2)
                        }
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>
          )}


        </div>
        <div className="bg-slate-900 p-5 rounded-xl mt-6">

          <h2 className="text-xl font-bold mb-4">
            Monthly Report
          </h2>

          <div className="flex gap-3 mb-4">

            <input
              type="number"
              placeholder="Month"
              value={reportMonth}
              onChange={(e) =>
                setReportMonth(Number(e.target.value))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  yearInputRef.current?.focus();
                }
              }}
              className="bg-slate-800 p-2 rounded"
            />

            <input
              ref={yearInputRef}
              type="number"
              placeholder="Year"
              value={reportYear}
              onChange={(e) =>
                setReportYear(Number(e.target.value))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  generateBtnRef.current?.focus();
                }
              }}
              className="bg-slate-800 p-2 rounded"
            />

            <button
              ref={generateBtnRef}
              onClick={() => {
                if (showMonthlyReport) {
                  setShowMonthlyReport(false);
                } else {
                  getMonthlyReport();
                }
              }}
              className={`
    px-4
    py-2
    rounded
    ${showMonthlyReport
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
                }
  `}
            >
              {showMonthlyReport ? "Hide" : "Generate"}
            </button>

            {showMonthlyReport && (
              <button
                onClick={downloadMonthlyPDF}
                className="
      bg-purple-600
        hover:bg-purple-700
      px-4
      py-2
      rounded
    "
              >
                Download PDF
              </button>
            )}

          </div>

          {monthlyReport &&
            showMonthlyReport && (

              <div className="space-y-2">

                <p>
                  Total Collections :
                  {" "}
                  {
                    monthlyReport.totalCollections
                  }
                </p>

                <p>
                  Total Milk :
                  {" "}
                  {
                    monthlyReport.totalMilk
                  } L
                </p>

                <p>
                  Total Amount :
                  ₹
                  {
                    monthlyReport.totalAmount
                  }
                </p>

                <hr className="border-slate-700 my-3" />

                <p>
                  Best Farmer :
                  {" "}
                  {
                    monthlyReport
                      ?.bestFarmer
                      ?.farmerName
                  }
                </p>

                <p>
                  Farmer ID :
                  {" "}
                  {
                    monthlyReport
                      ?.bestFarmer
                      ?.farmerId
                  }
                </p>

                <p>
                  Revenue :
                  ₹
                  {
                    Number(
                      monthlyReport
                        ?.bestFarmer
                        ?.totalAmount || 0
                    ).toFixed(2)
                  }
                </p>

              </div>

            )}

        </div>

      </div>

    </div>
  );
}

export default Reports;