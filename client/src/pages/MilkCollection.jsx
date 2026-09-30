import {
  useEffect,
  useState,
  useRef,
} from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { FaSearch } from "react-icons/fa";

function MilkCollection() {

  const [collections, setCollections] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editData, setEditData] =
    useState(null);

  const [farmerNumber, setFarmerNumber] =
    useState("");

  const [farmerName, setFarmerName] =
    useState("");

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const currentHour =
    new Date().getHours();

  const [selectedDate, setSelectedDate] =
    useState(today);

  const [selectedShift, setSelectedShift] =
    useState(
      currentHour < 12
        ? "Morning"
        : "Evening"
    );

  const [filterType, setFilterType] =
    useState("daily");

  const [formData, setFormData] =
    useState({
      farmerId: "",
      shift: "Morning",
      quantity: "",
      fat: "",
      snf: "",
    });

  const farmerRef = useRef(null);
  const shiftRef = useRef(null);
  const qtyRef = useRef(null);
  const fatRef = useRef(null);
  const snfRef = useRef(null);
  const saveRef = useRef(null);

  const fetchCollections =
    async () => {

      try {

        const response =
          await api.get("/milk");

        setCollections(
          response.data
        );

      } catch (error) {

        console.log(error);

      }
    };

  const fetchFarmerDetails =
    async (number) => {

      try {

        const response =
          await api.get(
            `/milk/number/${number}`
          );

        setFarmerName(
          response.data.name
        );

        setFormData((prev) => ({
          ...prev,
          farmerId:
            response.data.farmerId,
        }));

      } catch {

        setFarmerName("");

      }
    };

  useEffect(() => {

    fetchCollections();

    setTimeout(() => {
      farmerRef.current?.focus();
    }, 300);

  }, []);

  const handleAddCollection =
    async (e) => {

      e.preventDefault();

      try {

        await api.post(
          "/milk",
          formData
        );

        alert(
          "Collection Added Successfully"
        );

        setShowModal(false);

        setFormData({
          farmerId: "",
          shift: "Morning",
          quantity: "",
          fat: "",
          snf: "",
        });

        fetchCollections();

        setFarmerNumber("");
        setFarmerName("");

        setTimeout(() => {
          farmerRef.current?.focus();
        }, 100);

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Failed To Add Collection"
        );
      }
    };

  const handleDeleteCollection =
    async (collectionId) => {

      const confirmDelete =
        window.confirm(
          "Delete this collection?"
        );

      if (!confirmDelete) {
        return;
      }

      try {

        await api.delete(
          `/milk/${collectionId}`
        );

        alert(
          "Collection Deleted Successfully"
        );

        fetchCollections();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Delete Failed"
        );

      }
    };

  const openEditModal = (item) => {

    setEditData({
      collectionId:
        item.collectionId,

      quantity:
        item.quantity,

      fat:
        item.fat,

      snf:
        item.snf,

      shift:
        item.shift,
    });

    setShowEditModal(true);
  };

  const handleUpdateCollection =
    async (e) => {

      e.preventDefault();

      try {

        await api.put(
          `/milk/${editData.collectionId}`,
          {
            quantity:
              editData.quantity,

            fat:
              editData.fat,

            snf:
              editData.snf,

            shift:
              editData.shift,
          }
        );

        alert(
          "Collection Updated"
        );

        setShowEditModal(false);

        fetchCollections();

      } catch (error) {


        alert(
          error.response?.data?.message
        );

      }
    };

  const filteredByDateShift =
    collections.filter((item) => {

      const itemDateObj =
        new Date(item.date);

      const selectedDateObj =
        new Date(selectedDate);

      let dateMatch = false;

      if (filterType === "daily") {
        dateMatch =
          itemDateObj
            .toISOString()
            .split("T")[0] ===
          selectedDate;
      }

      if (filterType === "monthly") {
        dateMatch =
          itemDateObj.getMonth() ===
          selectedDateObj.getMonth() &&

          itemDateObj.getFullYear() ===
          selectedDateObj.getFullYear();
      }

      if (filterType === "cycle1") {
        dateMatch =
          itemDateObj.getDate() >= 1 &&
          itemDateObj.getDate() <= 10;
      }

      if (filterType === "cycle2") {
        dateMatch =
          itemDateObj.getDate() >= 11 &&
          itemDateObj.getDate() <= 20;
      }

      if (filterType === "cycle3") {
        dateMatch =
          itemDateObj.getDate() >= 21;
      }

      const shiftMatch =
        selectedShift === "All"
          ? true
          : item.shift === selectedShift;

      return (
        dateMatch &&
        shiftMatch
      );
    });

  const totalMilk =
    filteredByDateShift.reduce(
      (sum, item) =>
        sum + Number(item.quantity),
      0

    );

  const totalAmount =
    filteredByDateShift.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  const summary = {
    totalCollections:
      filteredByDateShift.length,

    totalMilk,

    totalAmount,
  };[filteredByDateShift];

  const filteredCollections =
    filteredByDateShift.filter((item) => {

      const text =
        search.toLowerCase();

      const matchesSearch =

        item.collectionId
          ?.toLowerCase()
          .includes(text) ||

        item.farmerId
          ?.toLowerCase()
          .includes(text) ||

        item.farmerName
          ?.toLowerCase()
          .includes(text);

      return matchesSearch;

    });

  return (
    <div className="flex min-h-screen bg-slate-950">

      <Sidebar />

      <div className="flex-1 bg-slate-950 text-white p-8">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            Milk Collection
          </h1>

        </div>

        <div
          className="
  grid
  grid-cols-4
  gap-4
  mb-6
"
        >

          <div
            className="
    bg-slate-900
    p-5
    rounded-xl
  "
          >
            <h3>Total Collections</h3>

            <p className="text-2xl font-bold">
              {summary.totalCollections}
            </p>
          </div>

          <div
            className="
    bg-slate-900
    p-5
    rounded-xl
  "
          >
            <h3>Total Milk</h3>

            <p className="text-2xl font-bold">
              {summary.totalMilk} L
            </p>
          </div>

          <div
            className="
    bg-slate-900
    p-5
    rounded-xl
  "
          >
            <h3>Total Amount</h3>

            <p className="text-2xl font-bold">
              ₹{summary.totalAmount.toLocaleString("en-IN")}
            </p>
          </div>

        </div>

        <div className="
  flex
  gap-4
  mb-6
">

          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(
                e.target.value
              )
            }
            className="
    bg-slate-900
    border
    border-slate-700
    rounded-xl
    px-4
    py-3
    text-white
  "
          >
            <option value="daily">
              Daily
            </option>

            <option value="cycle1">
              1-10
            </option>

            <option value="cycle2">
              11-20
            </option>

            <option value="cycle3">
              21-End
            </option>

            <option value="monthly">
              Monthly
            </option>
          </select>

          <div
            className="
    bg-slate-900
    p-5
    rounded-xl
  "
          >
            <h3>Filter</h3>

            <p className="text-2xl font-bold">
              {filterType}
            </p>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
            className="
      bg-slate-900
      border
      border-slate-700
      rounded-xl
      px-4
      py-3
      text-white
    "
          />

          <select
            value={selectedShift}
            onChange={(e) =>
              setSelectedShift(
                e.target.value
              )
            }
            className="
      bg-slate-900
      border
      border-slate-700
      rounded-xl
      px-4
      py-3
      text-white
    "
          >
            <option value="All">
              All Shift
            </option>

            <option value="Morning">
              Morning
            </option>

            <option value="Evening">
              Evening
            </option>

          </select>

        </div>

        <div className="
  bg-slate-900
  p-6
  rounded-xl
  mb-6
">
          <h2 className="
    text-xl
    font-bold
    mb-4
  ">
            Quick Milk Entry
          </h2>

          <form
            onSubmit={handleAddCollection}
            className="
    grid
    grid-cols-7
    gap-3
    items-center
  "
          >

            <input
              ref={farmerRef}
              type="number"
              placeholder="Farmer No"
              value={farmerNumber}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  shiftRef.current.focus();
                }
              }}
              onChange={(e) => {

                setFarmerNumber(
                  e.target.value
                );

                fetchFarmerDetails(
                  e.target.value
                );

              }}
              className="
    p-3
    rounded
    bg-slate-800
    w-full
  "
            />
            <input
              value={farmerName}
              readOnly
              placeholder="Farmer Name"
              className="
        p-3
        rounded
        bg-slate-700
      "
            />

            <select
              ref={shiftRef}
              value={formData.shift}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  qtyRef.current.focus();
                }
              }}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shift: e.target.value,
                })
              }
              className="
    p-3
    rounded
    bg-slate-800
    w-full
  "
            >
              <option>Morning</option>
              <option>Evening</option>
            </select>

            <input
              ref={qtyRef}
              type="number"
              placeholder="Qty"
              value={formData.quantity}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  fatRef.current.focus();
                }
              }}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: e.target.value,
                })
              }
              className="
    p-3
    rounded
    bg-slate-800
    w-full
  "
            />

            <input
              ref={fatRef}
              type="number"
              step="0.1"
              placeholder="Fat"
              value={formData.fat}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  snfRef.current.focus();
                }
              }}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fat: e.target.value,
                })
              }
              className="
    p-3
    rounded
    bg-slate-800
    w-full
  "
            />
            <div className="
  flex
  gap-2
  col-span-2
">

              <input
                ref={snfRef}
                type="number"
                step="0.1"
                placeholder="SNF"
                value={formData.snf}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    saveRef.current.focus();
                  }
                }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    snf: e.target.value,
                  })
                }
                className="
    flex-1
    p-3
    rounded
    bg-slate-800
  "
              />

              <button
                ref={saveRef}
                type="submit"
                className="
          bg-green-600
          hover:bg-green-700
          px-5
          rounded
        "
              >
                Save
              </button>

            </div>

          </form>
        </div>

        {/* Search */}

        <div className="relative mb-6">

          <FaSearch
            className="
              absolute
              left-4
              top-4
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Search Collection..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              pl-12
              py-3
            "
          />

        </div>


        {/* Table */}

        <div className="
          bg-slate-900
          rounded-xl
          overflow-hidden
        ">

          <table className="w-full">

            <thead className="bg-slate-800">

              <tr>

                <th className="p-3">
                  Collection ID
                </th>

                <th className="p-3">
                  Farmer ID
                </th>

                <th className="p-3">
                  Name
                </th>

                <th className="p-3">
                  Shift
                </th>

                <th className="p-3">
                  Qty
                </th>

                <th className="p-3">
                  FAT
                </th>

                <th className="p-3">
                  SNF
                </th>

                <th className="p-3">
                  Amount
                </th>

                <th className="p-3">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredCollections.map(
                (item) => (

                  <tr
                    key={item._id}
                    className="
                      border-t
                      border-slate-800
                    "
                  >

                    <td className="p-3">
                      {item.collectionId}
                    </td>

                    <td className="p-3">
                      {item.farmerId}
                    </td>

                    <td className="p-3">
                      {item.farmerName}
                    </td>

                    <td className="p-3">
                      {item.shift}
                    </td>

                    <td className="p-3">
                      {item.quantity}
                    </td>

                    <td className="p-3">
                      {item.fat}
                    </td>

                    <td className="p-3">
                      {item.snf}
                    </td>

                    <td className="p-3">
                      ₹{item.amount}
                    </td>

                    <td className="p-3">

                      <button
                        onClick={() =>
                          openEditModal(item)
                        }
                        className="
                                 bg-yellow-600
                                 hover:bg-yellow-700
                                 px-3
                                 py-1
                                 rounded
                                 mr-2
                               "
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteCollection(
                            item.collectionId
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
                        Delete
                      </button>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* Modal */}

        {showEditModal && (

          <div
            className="
    fixed
    inset-0
    bg-black/70
    flex
    items-center
    justify-center
    z-50
  "
          >

            <div
              className="
      bg-slate-900
      p-6
      rounded-xl
      w-full
      max-w-lg
    "
            >

              <h2
                className="
        text-2xl
        font-bold
        mb-4
      "
              >
                Edit Collection
              </h2>

              <form
                onSubmit={
                  handleUpdateCollection
                }
                className="space-y-3"
              >

                <div>
                  <label className="block mb-1 text-sm text-slate-300">
                    Quantity (Liter)
                  </label>

                  <input
                    type="number"
                    value={editData?.quantity || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        quantity: e.target.value,
                      })
                    }
                    className="
                            w-full
                            p-3
                            rounded
                            bg-slate-800
                          "
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm text-slate-300">
                    FAT %
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    value={editData?.fat || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        fat: e.target.value,
                      })
                    }
                    className="
                             w-full
                             p-3
                             rounded
                             bg-slate-800
                           "
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm text-slate-300">
                    SNF %
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    value={editData?.snf || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        snf: e.target.value,
                      })
                    }
                    className="
                               w-full
                               p-3
                               rounded
                               bg-slate-800
                             "
                  />
                </div>

                <select
                  value={
                    editData?.shift
                  }
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      shift:
                        e.target.value,
                    })
                  }
                  className="
            w-full
            p-3
            rounded
            bg-slate-800
          "
                >
                  <option>
                    Morning
                  </option>

                  <option>
                    Evening
                  </option>

                </select>

                <div
                  className="
          flex
          justify-end
          gap-3
        "
                >

                  <button
                    type="button"
                    onClick={() =>
                      setShowEditModal(
                        false
                      )
                    }
                    className="
              bg-slate-700
              px-4
              py-2
              rounded
            "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
              bg-green-600
              px-4
              py-2
              rounded
            "
                  >
                    Update
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}
      </div>
    </div>
  );
}

export default MilkCollection;