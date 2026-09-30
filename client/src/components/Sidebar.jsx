import {
    FaHome,
    FaUsers,
    FaTint,
    FaMoneyBill,
    FaChartBar,
    FaUserTie,
    FaCog,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <div className="
            w-64
            h-screen
            bg-slate-900
            border-r
            border-slate-800
            text-white
            p-5
            sticky
            top-0
        ">

            <h2 className="
                text-2xl
                font-bold
                mb-10
                text-center
            ">
                Smart Dairy
            </h2>

            <div className="space-y-2">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition
                        ${isActive
                            ? "bg-blue-600"
                            : "hover:bg-slate-800"
                        }`
                    }
                >
                    <FaHome />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/farmers"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition
                        ${isActive
                            ? "bg-blue-600"
                            : "hover:bg-slate-800"
                        }`
                    }
                >
                    <FaUsers />
                    Farmers
                </NavLink>

                <NavLink
                    to="/milk"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition
                        ${isActive
                            ? "bg-blue-600"
                            : "hover:bg-slate-800"
                        }`
                    }
                >
                    <FaTint />
                    Collection
                </NavLink>

                <NavLink
                    to="/payments"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition
                        ${isActive
                            ? "bg-blue-600"
                            : "hover:bg-slate-800"
                        }`
                    }
                >
                    <FaMoneyBill />
                    Payments
                </NavLink>

                <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition
                        ${isActive
                            ? "bg-blue-600"
                            : "hover:bg-slate-800"
                        }`
                    }
                >
                    <FaChartBar />
                    Reports
                </NavLink>

                <NavLink
                    to="/staff"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition
        ${isActive
                            ? "bg-blue-600"
                            : "hover:bg-slate-800"
                        }`
                    }
                >
                    <FaUserTie />
                    Staff
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition
    ${isActive
                            ? "bg-blue-600"
                            : "hover:bg-slate-800"
                        }`
                    }
                >
                    <FaCog />
                    Settings
                </NavLink>

            </div>
        </div>
    );
}

export default Sidebar;