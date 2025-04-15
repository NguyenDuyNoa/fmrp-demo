import useStatusExprired from "@/hooks/useStatusExprired";
import Head from "next/head";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AreaChart from "./components/AreaChart";
import BarChart from "./components/BarChart";
import ColumnChart from "./components/ColumnChart";
import LineChart from "./components/LineChart";
import ListTask from "./components/ListTask";
import ManufacturingStatusMonitor from "./components/ManufacturingStatusMonitor";
import PieChart from "./components/PieChart";
import ProductionProgressTracker from "./components/ProductionProgressTracker";
import TableChart from "./components/TableChart";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import TopProducts from "./components/newCharts/TopProducts";
import BarChartVertical from "./components/newCharts/BarChartVertical";
import BarChartHorizontal from "./components/newCharts/BarChartHorizontal";
import PieChartNew from "./components/newCharts/PieChartNew";
import ListProgress from "./components/newCharts/ListProgress";
import ListMaterial from "./components/newCharts/ListMaterial";

const Dashboard = (props) => {
  const dispatch = useDispatch();
  const dataPstWH = useSelector((state) => state.statusUser);
  const statusExprired = useStatusExprired();

  const _HandleExample = () => {
    dispatch({
      type: "status/user",
      payload: !dataPstWH,
    });
  };

  return (
    <React.Fragment>
      <Head>
        <title>Tổng quan</title>
      </Head>


      <div className="py-6 flex flex-col gap-6 bg-[#FDFDFE] min-h-screen">
        <TopProducts />
        <div className="flex flex-col md:flex-row gap-6 px-4 md:px-12">
          <BarChartVertical />
          <BarChartHorizontal />
        </div>
        <div className="grid grid-cols-1 std:grid-cols-3 gap-6 px-4 md:px-12">
          <div className="col-span-1 std:col-span-1">
            <PieChartNew />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 std:col-span-2">
            <ListProgress />
            <ListMaterial />
          </div>
        </div>
      </div>

      {/* <Customscrollbar className="px-10 py-8 pt-24 space-y-5 overflow-x-auto overflow-y-auto text">
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
        )} */}

      {/* <div className={`${statusExprired ? "mt-7" : ""} flex   space-x-5 justify-between`}>
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
                </div> */}
      {/* <div className="flex flex-col gap-3">
                    <ListTask {...props} />
                    <div className="grid grid-cols-2 gap-5">
                        <PieChart {...props} />
                        <ProductionProgressTracker {...props} />
                        <LineChart {...props} />
                        <ColumnChart {...props} />
                        <TableChart {...props} />
                        <ManufacturingStatusMonitor {...props} />
                        <AreaChart {...props} />
                        <BarChart {...props} />
                    </div>
                </div> */}
      {/* </Customscrollbar> */}

      {/* new Dashboard */}

    </React.Fragment>
  );
};

export default Dashboard;
