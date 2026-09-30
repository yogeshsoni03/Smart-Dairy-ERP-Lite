import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Settings() {

    const [settings, setSettings] =
        useState({
            dairyName: "",
            ownerName: "",
            mobile: "",
            address: "",
            fatRate: "",
            snfRate: "",
            receiptTitle: "",
            footerText: "",
        });

    const getSettings =
        async () => {

            try {

                const response =
                    await api.get("/settings");

                setSettings(
                    response.data
                );

            } catch (error) {

                console.log(error);

            }
        };

    useEffect(() => {

        getSettings();

    }, []);

    const handleChange =
        (e) => {

            setSettings({
                ...settings,
                [e.target.name]:
                    e.target.value,
            });

        };

    const saveSettings =
        async () => {

            try {

                await api.put(
                    "/settings",
                    settings
                );

                alert(
                    "Settings Saved Successfully"
                );

            } catch (error) {

                alert(
                    error.response?.data?.message ||
                    "Failed"
                );

            }
        };

    return (

        <div className="flex bg-slate-950 min-h-screen">

            <Sidebar />

            <div className="flex-1 p-8 text-white">

                <h1 className="text-4xl font-bold mb-6">
                    Settings
                </h1>

                <div className="bg-slate-900 p-6 rounded-xl">

                    <h2 className="text-xl font-bold mb-4">
                        Dairy Information
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            id="dairyName"
                            name="dairyName"
                            placeholder="Enter Dairy Name"
                            value={settings.dairyName}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    document.getElementById("ownerName")?.focus();
                                }
                            }}
                            className="bg-slate-800 p-3 rounded"
                        />

                        <input
                            id="ownerName"
                            name="ownerName"
                            placeholder="Enter Owner Name"
                            value={settings.ownerName}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    document.getElementById("mobile")?.focus();
                                }
                            }}
                            className="bg-slate-800 p-3 rounded"
                        />

                        <input
                            id="mobile"
                            name="mobile"
                            placeholder="Enter Mobile Number"
                            value={settings.mobile}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    document.getElementById("address")?.focus();
                                }
                            }}
                            className="bg-slate-800 p-3 rounded"
                        />

                        <input
                            id="address"
                            name="address"
                            placeholder="Enter Address"
                            value={settings.address}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    document.getElementById("fatRate")?.focus();
                                }
                            }}
                            className="bg-slate-800 p-3 rounded"
                        />

                    </div>

                    <h2 className="text-xl font-bold mt-8 mb-4">
                        Milk Rates
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            id="fatRate"
                            name="fatRate"
                            placeholder="Enter FAT Rate"
                            value={settings.fatRate}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    document.getElementById("snfRate")?.focus();
                                }
                            }}
                            className="bg-slate-800 p-3 rounded"
                        />

                        <input
                            id="snfRate"
                            name="snfRate"
                            placeholder="Enter SNF Rate"
                            value={settings.snfRate}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    document.getElementById("receiptTitle")?.focus();
                                }
                            }}
                            className="bg-slate-800 p-3 rounded"
                        />

                    </div>

                    <h2 className="text-xl font-bold mt-8 mb-4">
                        Receipt Settings
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            id="receiptTitle"
                            name="receiptTitle"
                            placeholder="Enter Receipt Title"
                            value={settings.receiptTitle}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    document.getElementById("footerText")?.focus();
                                }
                            }}
                            className="bg-slate-800 p-3 rounded"
                        />

                        <input
                            id="footerText"
                            name="footerText"
                            placeholder="Enter Footer Text"
                            value={settings.footerText}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    saveSettings();
                                }
                            }}
                            className="bg-slate-800 p-3 rounded"
                        />

                    </div>

                    <button
                        onClick={saveSettings}
                        className="
              mt-8
              bg-green-600
              hover:bg-green-700
              px-6
              py-3
              rounded
            "
                    >
                        Save Settings
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Settings;