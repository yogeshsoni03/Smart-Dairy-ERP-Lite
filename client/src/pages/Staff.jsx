import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Staff() {

    const [staff, setStaff] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [formData, setFormData] =
        useState({
            name: "",
            mobile: "",
            role: "Collector",
            salary: "",
        });

    const [editId, setEditId] =
        useState(null);

    const getStaff =
        async () => {

            try {

                const response =
                    await api.get("/staff");

                setStaff(
                    response.data
                );

            } catch (error) {

                console.log(error);

            }
        };

    useEffect(() => {

        getStaff();

    }, []);

    const handleChange =
        (e) => {

            setFormData({
                ...formData,
                [e.target.name]:
                    e.target.value,
            });

        };

    const saveStaff =
        async () => {

            try {

                if (editId) {

                    await api.put(
                        `/staff/${editId}`,
                        formData
                    );

                } else {

                    await api.post(
                        "/staff",
                        formData
                    );

                }

                setShowModal(false);

                setEditId(null);

                setFormData({
                    name: "",
                    mobile: "",
                    role: "Collector",
                    salary: "",
                });

                getStaff();

            } catch (error) {

                alert(
                    error.response?.data?.message
                );

            }
        };

    const deleteStaff =
        async (id) => {

            if (
                !window.confirm(
                    "Delete Staff?"
                )
            ) return;

            try {

                await api.delete(
                    `/staff/${id}`
                );

                getStaff();

            } catch (error) {

                console.log(error);

            }
        };

    const filteredStaff =
        staff.filter(
            (item) =>
                item.staffId
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||
                item.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||
                item.mobile.includes(
                    search
                )
        );

    return (

        <div className="flex bg-slate-950 min-h-screen">

            <Sidebar />

            <div className="flex-1 p-8 text-white">

                <div className="flex justify-between mb-6">

                    <h1 className="text-4xl font-bold">
                        Staff Management
                    </h1>

                    <button
                        onClick={() =>
                            setShowModal(true)
                        }
                        className="
            bg-green-600
            hover:bg-green-700
            px-4
            py-2
            rounded
          "
                    >
                        Add Staff
                    </button>

                </div>

                <input
                    type="text"
                    placeholder="Search Staff..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    className="
          bg-slate-800
          p-2
          rounded
          mb-5
          w-full
        "
                />

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="border-b border-slate-700">

                                <th className="p-3 text-left">
                                    Staff ID
                                </th>

                                <th className="p-3 text-left">
                                    Name
                                </th>

                                <th className="p-3 text-left">
                                    Mobile
                                </th>

                                <th className="p-3 text-left">
                                    Role
                                </th>

                                <th className="p-3 text-left">
                                    Salary
                                </th>

                                <th className="p-3 text-left">
                                    Status
                                </th>

                                <th className="p-3 text-left">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredStaff.map(
                                (item) => (

                                    <tr
                                        key={item._id}
                                        className="
                    border-b
                    border-slate-800
                  "
                                    >

                                        <td className="p-3">
                                            {item.staffId}
                                        </td>

                                        <td className="p-3">
                                            {item.name}
                                        </td>

                                        <td className="p-3">
                                            {item.mobile}
                                        </td>

                                        <td className="p-3">
                                            {item.role}
                                        </td>

                                        <td className="p-3">
                                            ₹{item.salary}
                                        </td>

                                        <td className="p-3">
                                            {item.status}
                                        </td>

                                        <td className="p-3">

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() => {

                                                        setEditId(item._id);

                                                        setFormData({
                                                            name: item.name,
                                                            mobile: item.mobile,
                                                            role: item.role,
                                                            salary: item.salary,
                                                        });

                                                        setShowModal(true);

                                                    }}
                                                    className="
      bg-yellow-600
      px-3
      py-1
      rounded
    "
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteStaff(item._id)
                                                    }
                                                    className="
      bg-red-600
      px-3
      py-1
      rounded
    "
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {showModal && (

                <div
                    className="
          fixed
          inset-0
          bg-black/60
          flex
          items-center
          justify-center
        "
                >

                    <div
                        className="
    bg-slate-800
    text-white
    p-6
    rounded-xl
    w-112.5
  "
                    >

                        <h2 className="text-2xl font-bold mb-4">
                            {editId ? "Edit Staff" : "Add Staff"}
                        </h2>

                        <input
                            id="staffName"
                            name="name"
                            placeholder="Enter Staff Name"
                            value={formData.name}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    document.getElementById("staffMobile")?.focus();
                                }
                            }}
                            className="
    w-full
    bg-slate-700
    text-white
    border
    border-slate-600
    p-3
    rounded-lg
    mb-3
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
  "
                        />

                        <input
                            id="staffMobile"
                            name="mobile"
                            placeholder="Enter Mobile Number"
                            value={formData.mobile}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    document.getElementById("staffRole")?.focus();
                                }
                            }}
                            className="
    w-full
    bg-slate-700
    text-white
    border
    border-slate-600
    p-3
    rounded-lg
    mb-3
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
  "
                        />

                        <select
                            id="staffRole"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    document.getElementById("staffSalary")?.focus();
                                }
                            }}
                            className="
    w-full
    bg-slate-700
    text-white
    border
    border-slate-600
    p-3
    rounded-lg
    mb-3
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
  "
                        >
                            <option value="Collector">Collector</option>
                            <option value="Accountant">Accountant</option>
                            <option value="Manager">Manager</option>
                        </select>

                        <input
                            id="staffSalary"
                            name="salary"
                            type="number"
                            placeholder="Enter Salary"
                            value={formData.salary}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    saveStaff();
                                }
                            }}
                            className="
    w-full
    bg-slate-700
    text-white
    border
    border-slate-600
    p-3
    rounded-lg
    mb-4
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
  "
                        />

                        <div className="flex gap-2">

                            <div className="flex gap-3">

                                <button
                                    onClick={saveStaff}
                                    className="
      bg-green-600
      hover:bg-green-700
      px-4
      py-2
      rounded-lg
      font-semibold
    "
                                >
                                    {editId ? "Update Staff" : "Save Staff"}
                                </button>

                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditId(null);
                                    }}
                                    className="
      bg-red-600
      hover:bg-red-700
      px-4
      py-2
      rounded-lg
      font-semibold
    "
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Staff;