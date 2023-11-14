import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";

import { ArrowUp as IconArrowUp, ArrowDown as IconArrowDown, ArrowRight2 as IconArrowRight2 } from "iconsax-react";
import Expirred from "components/UI/expired";
import useStatusExprired from "@/hooks/useStatusExprired";
const Pie = dynamic(() => import("@ant-design/plots").then(({ Pie }) => Pie), {
    ssr: false,
});
const DualAxes = dynamic(() => import("@ant-design/plots").then(({ DualAxes }) => DualAxes), { ssr: false });
const Column = dynamic(() => import("@ant-design/plots").then(({ Column }) => Column), { ssr: false });
const Area = dynamic(() => import("@ant-design/plots").then(({ Area }) => Area), { ssr: false });
const Bar = dynamic(() => import("@ant-design/plots").then(({ Bar }) => Bar), {
    ssr: false,
});
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

const Index = () => {
    const dispatch = useDispatch();
    const dataPstWH = useSelector((state) => state.trangthai);
    const trangthaiExprired = useStatusExprired();

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
                <div className={`${trangthaiExprired ? "mt-7" : ""} flex   space-x-5 justify-between`}>
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
                    <PieChart_TopSP />
                    <Table_NVL />
                    <LineChart_TiLeHangLoi />
                    <ColumnChart_KeHoachSX />
                    <TienDoSX />
                    <TienDoSX_1 />
                    <AreaChart_BiendongCP />
                    <BarChart_TopKhachhang />
                </div>
            </div>
        </React.Fragment>
    );
};

const ListTask = React.memo(() => {
    const data = [
        {
            title: "Đang thực hiện",
            number: 20,
            bgColor: "#EBF5FF",
            bgSmall: "#1760B9",
            percent: -23,
        },
        {
            title: "Chưa thực hiện",
            number: 20,
            bgColor: "#F3F4F6",
            bgSmall: "#9295A4",
            percent: -23,
        },
        {
            title: "Hoàn thành",
            number: 20,
            bgColor: "#EBFEF2",
            bgSmall: "#0BAA2E",
            percent: 23,
        },
        {
            title: "Tạm dừng",
            number: 20,
            bgColor: "#FEF8EC",
            bgSmall: "#FF8F0D",
            percent: -23,
        },
        {
            title: "Đang thực hiện",
            number: 20,
            bgColor: "#FFEEF0",
            bgSmall: "#EE1E1E",
            percent: 23,
        },
    ];
    return (
        <div className="grid grid-cols-5 gap-5">
            {data.map((e, i) => (
                <div className={`w-full p-4 rounded space-y-1.5`} style={{ backgroundColor: `${e.bgColor}` }} key={i}>
                    <h4 className="text-[#3A3E4C] font-normal text-sm">{e.title}</h4>
                    <div className="flex justify-between items-end">
                        <h6
                            className="text-lg font-medium text-white w-12 h-12 flex flex-col justify-center items-center rounded"
                            style={{ backgroundColor: `${e.bgSmall}` }}
                        >
                            {e.number}
                        </h6>
                        {e.percent > 0 ? (
                            <h6 className="font-[400] text-lg text-[#0BAA2E] flex space-x-0.5 items-center">
                                <span>{e.percent}%</span>
                                <IconArrowUp size={20} />
                            </h6>
                        ) : (
                            <h6 className="font-[400] text-lg text-[#EE1E1E] flex space-x-0.5 items-center">
                                <span>{e.percent}%</span>
                                <IconArrowDown size={20} />
                            </h6>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
});

const TienDoSX = React.memo(() => {
    const [tab, sTab] = useState(0);
    const _HandleTab = (e) => sTab(e);

    const data = [
        {
            name: "Nhóm sản xuất thân áo asd asd asd ",
            date: "22/02/2021",
            percent: 78,
        },
        {
            name: "Nhóm sản xuất thân áo",
            date: "22/02/2021",
            percent: 56,
        },
        {
            name: "Nhóm sản xuất thân áo",
            date: "22/02/2021",
            percent: 24,
        },
    ];
    return (
        <div className="bg-slate-50/60 p-3 space-y-4 border border-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
                <h2>Tiến độ SX theo nhóm</h2>
                <button className="text-[#667085] bg-[#F3F4F6] px-4 py-2 rounded flex space-x-2 items-center hover:scale-105 transition">
                    <span>Xem chi tiết</span>
                    <IconArrowRight2 size={18} />
                </button>
            </div>
            <div className="flex rounded-lg overflow-hidden border w-fit">
                <button
                    onClick={_HandleTab.bind(this, 0)}
                    className={`${
                        tab === 0 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black"
                    } px-3 py-2 border`}
                >
                    Tất cả
                </button>
                <button
                    onClick={_HandleTab.bind(this, 1)}
                    className={`${
                        tab === 1 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black"
                    } px-3 py-2 border`}
                >
                    Đang thực hiện
                </button>
                <button
                    onClick={_HandleTab.bind(this, 2)}
                    className={`${
                        tab === 2 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black"
                    } px-3 py-2 border`}
                >
                    Chưa thực hiện
                </button>
                <button
                    onClick={_HandleTab.bind(this, 3)}
                    className={`${
                        tab === 3 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black"
                    } px-3 py-2 border`}
                >
                    Tạm dừng
                </button>
            </div>
            <div className="py-3 divide-y divide-slate-200">
                {data.map((e) => (
                    <div className="flex items-center justify-between py-2 hover:bg-slate-100/30" key={e.name}>
                        <div className="flex space-x-2 items-center w-[45%]">
                            <div className="min-w-[48px] h-12 rounded-full bg-slate-300" />
                            <div className="w-fit">
                                <h6 className="line-clamp-1">{e.name}</h6>
                                <p className="text-[#9295A4] font-[300] text-[13px]">{e.date}</p>
                            </div>
                        </div>
                        <div
                            className={`${
                                e.percent >= 50 ? "bg-[#EBF5FF]" : "bg-[#f6e8cd6d]"
                            } w-[28%] relative h-2 rounded-full bg-[#EBF5FF]`}
                        >
                            <div
                                className={`${
                                    e.percent >= 50 ? "bg-[#5599EC]" : "bg-[#FF8F0D]"
                                } h-2 rounded-full absolute left-0`}
                                style={{ width: `${e.percent}%` }}
                            />
                        </div>
                        <h6
                            className={`${
                                e.percent >= 50
                                    ? "text-[#5599EC] bg-[#EBF5FF] border-[#d4e8fd]"
                                    : "text-[#FF8F0D] bg-[#FEF8EC] border-[#f6e8cd]"
                            } py-2 w-[10%] text-center rounded-md border`}
                        >
                            {e.percent}%
                        </h6>
                    </div>
                ))}
            </div>
        </div>
    );
});

const TienDoSX_1 = React.memo(() => {
    const [tab, sTab] = useState(0);
    const _HandleTab = (e) => sTab(e);

    const data = [
        {
            name: "SUK9101",
            group: "Nhóm sản xuất thân áo",
            status: 1,
        },
        {
            name: "SUK9101",
            group: "Nhóm sản xuất thân áo",
            status: 2,
        },
        {
            name: "SUK9101",
            group: "Nhóm sản xuất thân áo",
            status: 3,
        },
    ];
    return (
        <div className="bg-slate-50/60 p-3 space-y-4 border border-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
                <h2>Tiến độ SX theo nhóm</h2>
                <button className="text-[#667085] bg-[#F3F4F6] px-4 py-2 rounded flex space-x-2 items-center hover:scale-105 transition">
                    <span>Xem chi tiết</span>
                    <IconArrowRight2 size={18} />
                </button>
            </div>
            <div className="flex rounded-lg overflow-hidden border w-fit">
                <button
                    onClick={_HandleTab.bind(this, 0)}
                    className={`${
                        tab === 0 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black"
                    } px-3 py-2 border`}
                >
                    Tất cả
                </button>
                <button
                    onClick={_HandleTab.bind(this, 1)}
                    className={`${
                        tab === 1 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black"
                    } px-3 py-2 border`}
                >
                    Đang thực hiện
                </button>
                <button
                    onClick={_HandleTab.bind(this, 2)}
                    className={`${
                        tab === 2 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black"
                    } px-3 py-2 border`}
                >
                    Chưa thực hiện
                </button>
                <button
                    onClick={_HandleTab.bind(this, 3)}
                    className={`${
                        tab === 3 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black"
                    } px-3 py-2 border`}
                >
                    Tạm dừng
                </button>
            </div>
            <div className="py-3 divide-y divide-slate-200">
                {data.map((e) => (
                    <div className="flex items-center justify-between py-2 hover:bg-slate-100/30" key={e.name}>
                        <div className="flex space-x-2 items-center w-[50%] h-12">
                            <div className="w-fit">
                                <h6 className="line-clamp-1">{e.name}</h6>
                                <p className="text-[#9295A4] font-[300] text-[13px] line-clamp-1">{e.group}</p>
                            </div>
                        </div>
                        <h6
                            className={`${
                                (e.status === 1 && "text-[#0BAA2E] bg-[#EBFEF2]") ||
                                (e.status === 2 && "text-[#FF8F0D] bg-[#FEF8EC]") ||
                                (e.status === 3 && "text-[#EE1E1E] bg-[#FFEEF0]")
                            } py-2 px-3 text-center rounded-md`}
                        >
                            {e.status === 1 && "Đang thực hiện"}
                            {e.status === 2 && "Chưa thực hiện"}
                            {e.status === 3 && "Tạm dừng"}
                        </h6>
                    </div>
                ))}
            </div>
        </div>
    );
});

const Table_NVL = React.memo(() => {
    const data = [
        {
            stt: 1,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 2,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 3,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 4,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 5,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 6,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 7,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 8,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 9,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 10,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 11,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
    ];
    return (
        <div className="bg-slate-50/60 p-3 space-y-8 border border-slate-50 rounded-lg ">
            <h2>Nguyên vật liệu cần mua</h2>
            <div>
                <div className="grid grid-cols-8 gap-3 pl-3 pr-4 py-5 bg-slate-50">
                    <h5 className="text-[#667085] text-[13px]">STT</h5>
                    <h5 className="text-[#667085] text-[13px] col-span-2 text-center">Mã NVL</h5>
                    <h5 className="text-[#667085] text-[13px] col-span-3">Tên NVL</h5>
                    <h5 className="text-[#667085] text-[13px] col-span-2 text-right">Số lượng</h5>
                </div>
                <ScrollArea className=" h-[350px] overflow-hidden" speed={1} smoothScrolling={true}>
                    <div className="divide-y divide-slate-100">
                        {data.map((e) => (
                            <div
                                className="grid grid-cols-8 gap-3 pl-3 pr-4 py-4 hover:bg-white"
                                key={e.stt.toString()}
                            >
                                <h6>{e.stt}</h6>
                                <h6 className="col-span-2 text-center">{e.id}</h6>
                                <h6 className="col-span-3 line-clamp-1">{e.name}</h6>
                                <h6 className="col-span-2 text-right">{e.quantity?.toLocaleString()}</h6>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
});

const PieChart_TopSP = React.memo(() => {
    const data = [
        {
            type: "Áo hoa nhí  ",
            value: 56,
        },
        {
            type: "Áo bảo hộ lao động",
            value: 26,
        },
        {
            type: "Quần âu nam",
            value: 46,
        },
        {
            type: "Quần bảo hộ",
            value: 10,
        },
    ];
    const config = {
        appendPadding: 10,
        data,
        angleField: "value",
        colorField: "type",
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: "inner",
            offset: "-50%",
            style: {
                textAlign: "center",
            },
            autoRotate: false,
            content: "{value}",
        },
        interactions: [
            {
                type: "element-selected",
            },
            {
                type: "element-active",
            },
        ],
        color: ["#5599EC", "#1760B9", "#C7DFFB", "#92BFF7"],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: "pre-wrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: "1.2",
                },
                content: `Tổng\n ${132}`,
            },
        },
        legend: {
            position: "right",
            itemName: {
                style: {
                    fontSize: 16,
                    color: "#1A202C",
                    fontStyle: "normal",
                    fontWeight: 600,
                },
            },
        },
    };
    return (
        <div className="bg-slate-50/60 p-3 border border-slate-50 rounded-lg">
            <div className="mt-[12px] mb-[32px] mx-2 ">
                <h2>Top sản phẩm sản xuất nhiều nhất</h2>
                <div className="rounded-md bg-[#F9FAFB] w-full ">
                    <div className="mt-[28px]">
                        <Pie className="" {...config} />
                    </div>
                </div>
            </div>
        </div>
    );
});

const LineChart_TiLeHangLoi = React.memo(() => {
    const data = [
        {
            year: "",
            "Sản phẩm lỗi": 0,
            "Sản phẩm đạt": 100,
        },
        {
            year: "Áo hoa nhí",
            "Sản phẩm lỗi": 120,
            "Sản phẩm đạt": 200,
        },
        {
            year: "Áo bảo hộ",
            "Sản phẩm lỗi": 220,
            "Sản phẩm đạt": 400,
        },
        {
            year: "Quần âu nam",
            "Sản phẩm lỗi": 450,
            "Sản phẩm đạt": 200,
        },
        {
            year: "Quần bảo hộ",
            "Sản phẩm lỗi": 800,
            "Sản phẩm đạt": 800,
        },
    ];
    const config = {
        data: [data, data],
        xField: "year",
        yField: ["Sản phẩm lỗi", "Sản phẩm đạt"],

        geometryOptions: [
            {
                geometry: "line",
                color: "#EE1E1E",
            },
            {
                geometry: "line",
                color: "#5599EC",
            },
        ],
        legend: {
            position: "top",
        },
        yAxis: {
            label: {
                formatter: (v) => `${(v / 10e8).toFixed(1)} B`,
            },
        },
        animation: {
            appear: {
                animation: "path-in",
                duration: 5000,
            },
        },
    };
    return (
        <div className="bg-slate-50/60 p-3 border border-slate-50 rounded-lg">
            <div className="mt-[12px] mb-[32px] mx-2 ">
                <h2>Tỉ lệ sản phẩm lỗi hàng</h2>
                <div className="rounded-md bg-[#F9FAFB] w-full ">
                    <div className="mt-[28px]">
                        <DualAxes {...config} />
                    </div>
                </div>
            </div>
        </div>
    );
});

const ColumnChart_KeHoachSX = React.memo(() => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // asyncFetch();
        setData(db);
    }, []);
    const db = [
        {
            year: "1991",
            value: 339,
            type: "Kế hoạch",
        },
        {
            year: "1992",
            value: 402,
            type: "Kế hoạch",
        },
        {
            year: "1993",
            value: 400,
            type: "Kế hoạch",
        },
        {
            year: "1994",
            value: 200,
            type: "Kế hoạch",
        },
        {
            year: "1995",
            value: 290,
            type: "Kế hoạch",
        },
        {
            year: "1991",
            value: 200,
            type: "Thực hiện",
        },
        {
            year: "1992",
            value: 202,
            type: "Thực hiện",
        },
        {
            year: "1993",
            value: 100,
            type: "Thực hiện",
        },
        {
            year: "1994",
            value: 140,
            type: "Thực hiện",
        },
        {
            year: "1995",
            value: 350,
            type: "Thực hiện",
        },
    ];

    const config = {
        data,
        isStack: true,
        xField: "year",
        yField: "value",
        seriesField: "type",
        color: ["#C7DFFB", "#5599EC"],
        minColumnWidth: 16,
        maxColumnWidth: 16,
        barStyle: {
            radius: [2, 2, 0, 0],
        },
        legend: {
            position: "top",
        },
    };
    return (
        <div className="bg-slate-50/60 p-3 border border-slate-50 rounded-lg">
            <div className="mt-[12px] mb-[24px] mx-2 ">
                <div className="flex items-center justify-between">
                    <h2>Kế hoạch sản xuất</h2>
                    <button className="text-[#667085] bg-[#F3F4F6] px-4 py-2 rounded flex space-x-2 items-center hover:scale-105 transition">
                        <span>Xem chi tiết</span>
                        <IconArrowRight2 size={18} />
                    </button>
                </div>
                <div className="rounded-md bg-[#F9FAFB] w-full ">
                    <div className="mt-[28px]">
                        <Column {...config} />
                    </div>
                </div>
            </div>
        </div>
    );
});

const AreaChart_BiendongCP = React.memo(() => {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(db);
    }, []);
    const db = [
        {
            timePeriod: "T5 ",
            "Chi phí": 60,
        },
        {
            timePeriod: "T6",
            "Chi phí": 55,
        },
        {
            timePeriod: "T7",
            "Chi phí": 65,
        },
        {
            timePeriod: "T8",
            "Chi phí": 70,
        },
        {
            timePeriod: "T9",
            "Chi phí": 84,
        },
        {
            timePeriod: "T10",
            "Chi phí": 95,
        },
    ];
    const config = {
        data,
        xField: "timePeriod",
        yField: "Chi phí",
        xAxis: {
            range: [0, 1],
        },
        color: "#0BAA2E",

        // color: "#0BAA2E",
        appendPadding: [10],
        animation: {
            appear: {
                animation: "path-in",
                duration: 5000,
            },
        },
    };
    return (
        <div className="bg-slate-50/60 p-3 border border-slate-50 rounded-lg">
            <div className="mt-[12px] mb-[24px] mx-2 ">
                <div className="flex  items-center justify-between">
                    <h2>Biến động chi phí</h2>
                    <button className="text-[#667085] bg-[#F3F4F6] px-4 py-2 rounded flex space-x-2 items-center hover:scale-105 transition">
                        <span>Xem chi tiết</span>
                        <IconArrowRight2 size={18} />
                    </button>
                </div>
                <div className="rounded-md bg-[#F9FAFB] w-full ">
                    <div className="mt-[28px]">
                        <Area {...config} />
                    </div>
                </div>
            </div>
        </div>
    );
});

const BarChart_TopKhachhang = () => {
    const data = [
        {
            label: "ADINA",

            "Sản lượng": 4500,
        },
        {
            label: "SHAHOV",

            "Sản lượng": 4000,
        },
        {
            label: "POHUB",

            "Sản lượng": 3000,
        },
        {
            label: "RPAC",

            "Sản lượng": 2000,
        },
        {
            label: "PIA21029",

            "Sản lượng": 1000,
        },
    ];
    const config = {
        data,
        isGroup: true,
        xField: "Sản lượng",
        yField: "label",
        marginRatio: 0,
        label: {
            position: "right",
            offset: 4,
        },
        appendPadding: [10],
        barStyle: {
            radius: [2, 2, 0, 0],
        },
        animation: {
            appear: {
                animation: "path-in",
                duration: 5000,
            },
        },
        minBarWidth: 16,
        maxBarWidth: 16,
    };
    return (
        <div className="bg-slate-50/60 p-3 space-y-4 border border-slate-50 rounded-lg">
            <div className="mt-[12px] mb-[24px] mx-2 ">
                <div className="flex justify-between items-center">
                    <h2>Top 5 khách hàng có sản lượng nhiều nhất</h2>
                    <button className="text-[#667085] bg-[#F3F4F6] px-4 py-2 rounded flex space-x-2 items-center hover:scale-105 transition">
                        <span>Xem chi tiết</span>
                        <IconArrowRight2 size={18} />
                    </button>
                </div>
                <div className="rounded-md bg-[#F9FAFB] w-full ">
                    <div className="mt-[28px]">
                        <Bar {...config} />{" "}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;

// import React,{ useState, useEffect } from "react";

// import {_ServerInstance as Axios} from '/services/axios';

// const HorizontalInfiniteScroll = () => {
//   const [items, setItems] = useState([]);
//   const [limit, sLimit] = useState(5);
//   const [onFetching, sOnFetching] = useState(false);

//   useEffect(() => {
//     onFetching && _ServerFetching_group()
//   }, [onFetching]);

//   useEffect(() => {
//     sOnFetching(true)
//   }, [limit]);

//   const _ServerFetching_group =  () =>{
//     Axios("GET", `/api_web/api_client/group_count/?csrf_protection=true`, {
//       params:{
//         limit: limit
//       }
//     }, (err, response) => {
//       if(!err){
//         var {rResult} =  response.data;
//         setItems([...rResult])
//       }
//       sOnFetching(false)
//     })
//   }

//   //ngang
//   const handleScroll = e => {
//     const { scrollLeft, clientWidth, scrollWidth } = e.currentTarget;
//     if (scrollWidth - scrollLeft === clientWidth) {
//       sLimit(limit + 2);
//     }
//   };

//   //dọc
//   // const handleScroll = e => {
//   //   const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
//   //   if (scrollHeight - scrollTop === clientHeight) {
//   //     setPage(prevPage => prevPage + 1);
//   //   }
//   // };

//   return (
//     <div className="pt-40">
//       <h1>Hiii</h1>
//       <div onScroll={handleScroll} style={{overflowX: 'scroll'}} className="flex space-x-2 w-80">
//         {items.map(item => (
//           <div key={item.id} className="min-w-fit">
//             <h2>{item.name}</h2>
//             <p>{item.description}</p>
//           </div>
//         ))}
//         {onFetching && <p>Loading...</p>}
//       </div>
//     </div>
//   );
// };

// export default HorizontalInfiniteScroll;
