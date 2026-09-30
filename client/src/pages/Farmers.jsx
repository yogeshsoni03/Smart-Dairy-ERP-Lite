import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { FaSearch, FaUserPlus } from "react-icons/fa";

function Farmers() {

    const [farmers, setFarmers] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [formData, setFormData] =
        useState({
            name: "",
            mobile: "",
            village: "",
            address: "",
            cattleCount: 0,
        });

    const [showEditModal, setShowEditModal] =
        useState(false);

    const [editData, setEditData] =
        useState(null);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [deleteFarmerId, setDeleteFarmerId] =
        useState("");

    const [deleteFarmerData, setDeleteFarmerData] =
        useState(null);

    const addNameRef = useRef(null);
    const addMobileRef = useRef(null);
    const addVillageRef = useRef(null);
    const addAddressRef = useRef(null);
    const addCattleRef = useRef(null);
    const addCancelRef = useRef(null);
    const addSaveRef = useRef(null);

    const editNameRef = useRef(null);
    const editMobileRef = useRef(null);
    const editVillageRef = useRef(null);
    const editAddressRef = useRef(null);
    const editCattleRef = useRef(null);
    const editCancelRef = useRef(null);
    const editUpdateRef = useRef(null);

    const fetchFarmers =
        async () => {

            try {

                const response =
                    await api.get(
                        "/farmers"
                    );

                setFarmers(
                    response.data
                );

            } catch (error) {

                console.log(error);

            }
        };

    useEffect(() => {
        fetchFarmers();
    }, []);

    const handleAddFarmer =
        async (e) => {

            e.preventDefault();

            try {

                await api.post(
                    "/farmers",
                    formData
                );

                alert(
                    "Farmer Added Successfully"
                );

                setShowModal(false);

                setFormData({
                    name: "",
                    mobile: "",
                    village: "",
                    address: "",
                    cattleCount: 0,
                });

                fetchFarmers();

            } catch (error) {

                alert(
                    error.response?.data?.message ||
                    "Failed To Add Farmer"
                );
            }
        };

    const openEditModal = (farmer) => {

        setEditData({
            _id: farmer._id,
            name: farmer.name,
            mobile: farmer.mobile,
            village: farmer.village,
            address: farmer.address,
            cattleCount: farmer.cattleCount,
        });

        setShowEditModal(true);
        setTimeout(() => {
            editNameRef.current?.focus();
        }, 100);
    };

    const handleUpdateFarmer =
        async (e) => {

            e.preventDefault();

            try {

                await api.put(
                    `/farmers/${editData._id}`,
                    editData
                );

                alert(
                    "Farmer Updated Successfully"
                );

                setShowEditModal(false);

                fetchFarmers();

            } catch (error) {

                alert(
                    error.response?.data?.message ||
                    "Update Failed"
                );
            }
        };

    const searchFarmerForDelete =
        async () => {

            try {

                const response =
                    await api.get(
                        `/farmers/profile/${deleteFarmerId}`
                    );

                setDeleteFarmerData(
                    response.data.farmer
                );

            } catch (error) {

                alert(
                    "Farmer Not Found"
                );

                setDeleteFarmerData(null);
            }
        };

    const handleDeleteFarmer =
        async (id) => {

            const confirmDelete =
                window.confirm(
                    "Delete this farmer?"
                );

            if (!confirmDelete) {
                return;
            }

            try {

                await api.delete(
                    `/farmers/${id}`
                );

                alert(
                    "Farmer Deleted Successfully"
                );

                fetchFarmers();

            } catch (error) {

                alert(
                    error.response?.data?.message
                );
            }
        };

    const filteredFarmers =
        farmers.filter((farmer) => {

            const searchText =
                search.toLowerCase();

            return (
                farmer.name
                    ?.toLowerCase()
                    .includes(searchText) ||

                farmer.farmerId
                    ?.toLowerCase()
                    .includes(searchText) ||

                farmer.mobile
                    ?.toLowerCase()
                    .includes(searchText) ||

                farmer.village
                    ?.toLowerCase()
                    .includes(searchText)
            );
        });

    return (
        <div className="flex min-h-screen bg-slate-950">

            <Sidebar />

            <div className="flex-1 bg-slate-950 text-white p-8">

                <div className="flex justify-between items-center mb-8">

                    <h1 className="text-4xl font-bold">
                        Farmers
                    </h1>

                    <button
                        onClick={() =>
                            setShowModal(true)
                        }
                        className="
              bg-blue-600
              hover:bg-blue-700
              px-4
              py-2
              rounded-lg
              flex
              items-center
              gap-2
            "
                    >
                        <FaUserPlus />
                        Add Farmer
                    </button>

                </div>

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
                        placeholder="Search Farmer..."
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
              text-white
            "
                    />

                </div>

                <div
                    className="
            bg-slate-900
            rounded-xl
            overflow-hidden
          "
                >

                    <table className="w-full">

                        <thead className="bg-slate-800">

                            <tr>

                                <th className="p-4 text-left">
                                    Farmer ID
                                </th>

                                <th className="p-4 text-left">
                                    Name
                                </th>

                                <th className="p-4 text-left">
                                    Mobile
                                </th>

                                <th className="p-4 text-left">
                                    Village
                                </th>

                                <th className="p-4 text-left">
                                    Cattle
                                </th>

                                <th className="p-4 text-left">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredFarmers.map(
                                (farmer) => (

                                    <tr
                                        key={farmer._id}
                                        className="
                      border-t
                      border-slate-800
                    "
                                    >

                                        <td className="p-4">
                                            {farmer.farmerId}
                                        </td>

                                        <td className="p-4">
                                            {farmer.name}
                                        </td>

                                        <td className="p-4">
                                            {farmer.mobile}
                                        </td>

                                        <td className="p-4">
                                            {farmer.village}
                                        </td>

                                        <td className="p-4">
                                            {farmer.cattleCount}
                                        </td>

                                        <td className="p-4">

                                            <button
                                                onClick={() =>
                                                    openEditModal(farmer)
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
                                                    handleDeleteFarmer(
                                                        farmer._id
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

                {showModal && (

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
                  mb-5
                "
                            >
                                Add Farmer
                            </h2>

                            <form
                                onSubmit={
                                    handleAddFarmer
                                }
                                className="space-y-3"
                            >

                                <input
                                    placeholder="Name"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addMobileRef.current.focus();
                                        }
                                    }}
                                    value={
                                        formData.name
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name:
                                                e.target.value,
                                        })
                                    }
                                    className="
                    w-full
                    p-3
                    rounded
                    bg-slate-800
                  "
                                />

                                <input
                                    ref={addMobileRef}
                                    placeholder="Mobile"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addVillageRef.current.focus();
                                        }
                                    }}
                                    value={
                                        formData.mobile
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            mobile:
                                                e.target.value,
                                        })
                                    }
                                    className="
                    w-full
                    p-3
                    rounded
                    bg-slate-800
                  "
                                />

                                <input
                                    ref={addVillageRef}
                                    placeholder="Village"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addAddressRef.current.focus();
                                        }
                                    }}
                                    value={
                                        formData.village
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            village:
                                                e.target.value,
                                        })
                                    }
                                    className="
                    w-full
                    p-3
                    rounded
                    bg-slate-800
                  "
                                />

                                <textarea
                                    ref={addAddressRef}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addCattleRef.current.focus();
                                        }
                                    }}
                                    value={
                                        formData.address
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            address:
                                                e.target.value,
                                        })
                                    }
                                    className="
                    w-full
                    p-3
                    rounded
                    bg-slate-800
                  "
                                />

                                <input
                                    ref={addCattleRef}
                                    type="number"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addSaveRef.current.focus();
                                        }
                                    }}
                                    placeholder="Cattle Count"
                                    value={
                                        formData.cattleCount
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            cattleCount:
                                                e.target.value,
                                        })
                                    }
                                    className="
                    w-full
                    p-3
                    rounded
                    bg-slate-800
                  "
                                />

                                <div className="flex justify-end gap-3">

                                    <button
                                        ref={addCancelRef}
                                        type="button"
                                        onKeyDown={(e) => {
                                            if (e.key === "ArrowRight") {
                                                addSaveRef.current.focus();
                                            }
                                        }}
                                        onClick={() =>
                                            setShowModal(false)
                                        }
                                        className="
                      px-4
                      py-2
                      bg-slate-700
                      rounded
                    "
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        ref={addSaveRef}
                                        type="submit"
                                        onKeyDown={(e) => {
                                            if (e.key === "ArrowLeft") {
                                                addCancelRef.current.focus();
                                            }
                                        }}
                                        className="
                      px-4
                      py-2
                      bg-blue-600
                      rounded
                    "
                                    >
                                        Save
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

                {showEditModal && (

                    <div className="
    fixed inset-0
    bg-black/70
    flex items-center
    justify-center
    z-50
  ">

                        <div className="
      bg-slate-900
      p-6
      rounded-xl
      w-full
      max-w-lg
    ">

                            <h2 className="
        text-2xl
        font-bold
        mb-4
      ">
                                Edit Farmer
                            </h2>

                            <form
                                onSubmit={
                                    handleUpdateFarmer
                                }
                                className="space-y-3"
                            >

                                <input
                                    ref={editNameRef}
                                    value={editData?.name || ""}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            editMobileRef.current.focus();
                                        }
                                    }}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="
            w-full
            p-3
            rounded
            bg-slate-800
          "
                                />

                                <input
                                    ref={editMobileRef}
                                    value={editData?.mobile || ""}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            editVillageRef.current.focus();
                                        }
                                    }}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            mobile: e.target.value,
                                        })
                                    }
                                    className="
            w-full
            p-3
            rounded
            bg-slate-800
          "
                                />

                                <input
                                    ref={editVillageRef}
                                    value={editData?.village || ""}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            editAddressRef.current.focus();
                                        }
                                    }}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            village: e.target.value,
                                        })
                                    }
                                    className="
            w-full
            p-3
            rounded
            bg-slate-800
          "
                                />

                                <textarea
                                    ref={editAddressRef}
                                    value={editData?.address || ""}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            editCattleRef.current.focus();
                                        }
                                    }}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            address: e.target.value,
                                        })
                                    }
                                    className="
            w-full
            p-3
            rounded
            bg-slate-800
          "
                                />

                                <input
                                    ref={editCattleRef}
                                    type="number"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            editUpdateRef.current.focus();
                                        }
                                    }}
                                    value={editData?.cattleCount || 0}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            cattleCount:
                                                e.target.value,
                                        })
                                    }
                                    className="
            w-full
            p-3
            rounded
            bg-slate-800
          "
                                />

                                <div className="
          flex justify-end
          gap-3
        ">

                                    <button
                                        ref={editCancelRef}
                                        type="button"
                                        onKeyDown={(e) => {
                                            if (e.key === "ArrowRight") {
                                                editUpdateRef.current.focus();
                                            }
                                        }}
                                        onClick={() =>
                                            setShowEditModal(false)
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
                                        ref={editUpdateRef}
                                        type="submit"
                                        onKeyDown={(e) => {
                                            if (e.key === "ArrowLeft") {
                                                editCancelRef.current.focus();
                                            }
                                        }}
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


export default Farmers;