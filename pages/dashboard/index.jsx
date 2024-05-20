import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";

import Expirred from "components/UI/expired";
import useStatusExprired from "@/hooks/useStatusExprired";
import ListTask from "./components/ListTask";
import PieChart from "./components/PieChart";
import TableChart from "./components/TableChart";
import LineChart from "./components/LineChart";
import ColumnChart from "./components/ColumnChart";
import ProductionProgressTracker from "./components/ProductionProgressTracker";
import ManufacturingStatusMonitor from "./components/ManufacturingStatusMonitor";
import AreaChart from "./components/AreaChart";
import BarChart from "./components/BarChart";
import PopupAppTrial from "@/components/UI/popup/PopupAppTrial";

const Dashboard = () => {
    const dispatch = useDispatch();
    const dataPstWH = useSelector((state) => state.trangthai);
    const statusExprired = useStatusExprired();

    const _HandleExample = () => {
        dispatch({
            type: "trangthai",
            payload: !dataPstWH,
        });
    };

    return (
        <React.Fragment>
            <Head>
                <title>Tổng quan</title>
            </Head>

            <div className="px-10 py-8 space-y-5 pt-24 overflow-x-auto text ">
                {dataPstWH && (
                    <div
                        style={{
                            position: "fixed",
                            top: "7.65%",
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)", // Đặt màu nền mờ ở đây
                            zIndex: 9999, // Đảm bảo lớp phủ nằm trên các phần tử khác trên trang
                        }}
                    />
                )}
                <div className={`${statusExprired ? "mt-7" : ""} flex   space-x-5 justify-between`}>
                    <h3 className="text-[#11315B] text-lg font-medium not-italic	leading-6">Lệnh sản xuất</h3>
                    <button
                        style={{
                            zIndex: dataPstWH && 99999,
                        }}
                        onClick={() => _HandleExample()}
                        type="button"
                        className="rounded-md px-3.5 py-1 m-1 hover:scale-105 transition-all duration-500 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-600 text-indigo-600 text-white"
                    >
                        <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                        <span className="relative text-indigo-600 transition duration-300 group-hover:text-white ease">
                            {!dataPstWH ? "Hướng dẫn" : "Tắt hướng dẫn"}
                        </span>
                    </button>
                </div>
                <ListTask />
                <div className="grid grid-cols-2 gap-5">
                    <PieChart />
                    <TableChart />
                    <LineChart />
                    <ColumnChart />
                    <ProductionProgressTracker />
                    <ManufacturingStatusMonitor />
                    <AreaChart />
                    <BarChart />
                </div>
            </div>
        </React.Fragment>
    );
};

export default Dashboard;
