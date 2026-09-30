import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import DashboardCharts from "../components/DashboardCharts";
import TopFarmersChart from "../components/TopFarmersChart";
import TrendChart from "../components/TrendChart";
import GrowthCards from "../components/GrowthCards";
import TopFarmerCard from "../components/TopFarmerCard";
import RecentCollections from "../components/RecentCollections";
import ShiftPieChart from "../components/ShiftPieChart";

import api from "../services/api";

function Dashboard() {

    const [stats, setStats] = useState({
        totalFarmers: 0,
        totalCollections: 0,
        totalMilk: 0,
        totalAmount: 0,
        morningMilk: 0,
        eveningMilk: 0,
        topFarmer: null,
        recentCollections: [],
    });

    const [chartData, setChartData] =
        useState([]);

    const [topFarmers, setTopFarmers] =
        useState([]);

    const [trends, setTrends] =
        useState(null);

    useEffect(() => {

        const fetchDashboardStats =
            async () => {

                try {

                    const response =
                        await api.get(
                            "/dashboard"
                        );

                    setStats(
                        response.data
                    );

                } catch (error) {

                    console.log(error);

                }
            };

        const fetchCharts =
            async () => {

                try {

                    const chartRes =
                        await api.get(
                            "/dashboard/chart"
                        );

                    const formattedChart =
                        chartRes.data.labels.map(
                            (label, index) => ({
                                date: label,
                                milk:
                                    chartRes.data
                                        .milkData[index],
                                amount:
                                    chartRes.data
                                        .amountData[index],
                            })
                        );

                    setChartData(
                        formattedChart
                    );

                    const farmerRes =
                        await api.get(
                            "/dashboard/top-farmers"
                        );

                    const farmerChart =
                        farmerRes.data.labels.map(
                            (label, index) => ({
                                name: label,
                                milk:
                                    farmerRes.data
                                        .milkData[index],
                                amount:
                                    farmerRes.data
                                        .amountData[index],
                            })
                        );

                    setTopFarmers(
                        farmerChart
                    );

                } catch (error) {

                    console.log(error);

                }
            };

        const fetchTrends =
            async () => {

                try {

                    const response =
                        await api.get(
                            "/dashboard/trends"
                        );

                    setTrends(
                        response.data
                    );

                } catch (error) {

                    console.log(error);

                }
            };

        fetchDashboardStats();
        fetchCharts();
        fetchTrends();

    }, []);

    return (

        <div className="flex min-h-screen bg-slate-950">

            <Sidebar />

            <div className="flex-1 bg-slate-950 text-white p-8">

                <h1 className="text-4xl font-bold mb-8">
                    Dashboard
                </h1>

                {/* Stats Cards */}

                <div className="grid md:grid-cols-4 gap-5">

                    <StatCard
                        title="Farmers"
                        value={stats.totalFarmers}
                    />

                    <StatCard
                        title="Collections"
                        value={stats.totalCollections}
                    />

                    <StatCard
                        title="Milk (L)"
                        value={stats.totalMilk}
                    />

                    <StatCard
                        title="Amount"
                        value={`₹${stats.totalAmount}`}
                    />

                </div>

                {/* Charts */}

                <div className="grid lg:grid-cols-2 gap-6 mt-8">

                    <DashboardCharts
                        data={chartData}
                    />

                    <TopFarmersChart
                        data={topFarmers}
                    />

                </div>

                {/* Advanced Analytics */}

                {trends && (

                    <>

                        <div className="mt-8">

                            <GrowthCards
                                growth={
                                    trends.growth
                                }
                            />

                        </div>

                        <div className="grid lg:grid-cols-2 gap-6 mt-8">

                            <TrendChart
                                data={
                                    trends.last10Days.labels.map(
                                        (
                                            label,
                                            index
                                        ) => ({
                                            date:
                                                label,

                                            milk:
                                                trends
                                                    .last10Days
                                                    .milkData[
                                                    index
                                                ],
                                        })
                                    )
                                }
                            />

                            <ShiftPieChart
                                morningMilk={
                                    stats.morningMilk
                                }
                                eveningMilk={
                                    stats.eveningMilk
                                }
                            />

                        </div>

                        <div className="grid lg:grid-cols-2 gap-6 mt-8">

                            <TopFarmerCard
                                farmer={
                                    stats.topFarmer
                                }
                            />

                            <RecentCollections
                                collections={
                                    stats.recentCollections
                                }
                            />

                        </div>

                    </>

                )}

            </div>

        </div>

    );
}

export default Dashboard;