import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { ContainerFilterTab } from "@/components/UI/common/layout";
import useSetingServer from "@/hooks/useConfigNumber";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { FaUpRightAndDownLeftFromCenter } from "react-icons/fa6";
import { RxDragHandleDots1 } from "react-icons/rx";
import TabExportSituation from "./tabExportSituation";
import TabInFormation from "./tabInFormation";
import TabExportHistory from "./tabExportHistory";
import TabWarehouseHistory from "./tabWarehouseHistory";
import TabRecallMaterials from "./tabRecallMaterials";
import TabProcessingCost from "./tabProcessingCost";

const dataTotal = [
    {
        title: "Chi phí vật tư",
        number: 20,
        bgColor: "#EBFEF2",
        bgSmall: "#0BAA2E",
        percent: 23,
    },
    {
        title: "Chi phí khác",
        number: 20,
        bgColor: "#FEF8EC",
        bgSmall: "#FF8F0D",
        percent: -23,
    },
    {
        title: "Tổng chi phí",
        number: 20,
        bgColor: "#FFEEF0",
        bgSmall: "#EE1E1E",
        percent: 23,
    },
];
const listTab = [
    {
        id: 1,
        name: "Thông tin",
        count: 0,
    },
    {
        id: 2,
        name: "Tình hình xuất NVL",
        count: 0,
    },
    {
        id: 3,
        name: "Lịch sử xuất NVL/BTP",
        count: 1,
    },
    {
        id: 4,
        name: "Lịch sử nhập kho TP",
        count: 1,
    },
    {
        id: 5,
        name: "Thu hồi NVL",
        count: 2,
    },
    // {
    //     id: 6,
    //     name: 'Phiếu công việc',
    //     count: 3
    // },
    {
        id: 6,
        name: "Chi phí NVL - Gia công",
        count: 0,
    },
];

const ModalDetail = memo(({ isState, queryState, dataLang }) => {
    const router = useRouter();
    const [width, setWidth] = useState(900);
    const [isResizing, setIsResizing] = useState(false);
    const [initialX, setInitialX] = useState(null);
    const [initialWidth, setInitialWidth] = useState(null);
    const minWidth = 900; // Đặt giá trị chiều rộng tối thiểu
    const maxWidth = window.innerWidth; // Đặt giá trị chiều rộng tối đa
    const initialState = {
        isTab: 1,
    };
    const [isStateModal, setIsStateModal] = useState(initialState);

    const queryStateModal = (key) => setIsStateModal((x) => ({ ...x, ...key }));

    const dataSeting = useSetingServer();

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    useEffect(() => {
        const handleResize = (event) => {
            if (isResizing) {
                const newWidth = initialWidth + (initialX - event.clientX);
                // Đảm bảo rằng chiều rộng không thể nhỏ hơn giá trị tối thiểu và lớn hơn giá trị tối đa
                setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
            }
        };

        const stopResize = () => {
            setIsResizing(false);
            document.body.classList.remove("no-select");
        };

        if (isResizing) {
            document.addEventListener("mousemove", handleResize);
            document.addEventListener("mouseup", stopResize);
        }

        return () => {
            document.removeEventListener("mousemove", handleResize);
            document.removeEventListener("mouseup", stopResize);
        };
    }, [isResizing, initialWidth, initialX, minWidth, maxWidth]);

    const startResize = (event) => {
        setIsResizing(true);
        setInitialX(event.clientX);
        setInitialWidth(width);
        document.body.classList.add("no-select");
    };

    const handleActiveTab = (e) => {
        router.push({
            pathname: router.route,
            query: { tab: e },
        });
        queryStateModal({ isTab: e });
    };

    useEffect(() => {
        queryStateModal({ ...initialState });
    }, [isState.openModal]);

    const shareProps = { queryStateModal, dataLang, isStateModal, width, listTab };

    const components = {
        1: <TabInFormation {...shareProps} />,
        2: <TabExportSituation {...shareProps} />,
        3: <TabExportHistory {...shareProps} />,
        4: <TabWarehouseHistory {...shareProps} />,
        5: <TabRecallMaterials {...shareProps} />,
        6: <TabProcessingCost {...shareProps} />,
    };

    return (
        <div
            style={{
                width: width,
                height: `calc(100vh - ${68}px)`,
                transform: isState.openModal ? "translateX(0%)" : "translateX(100%)",
                maxWidth: "100vw",
            }}
            className={`bg-[#FFFFFF] absolute top-[9.2%] right-0 shadow-md z-[999] transition-all duration-150 ease-linear`}
        >
            <div className="pr-4 pl-3">
                <div className="border-b border-gray-300 flex justify-between py-4">
                    <div className="flex items-center gap-2">
                        <FaAngleDoubleRight
                            className="text-gray-600 text-sm cursor-pointer"
                            onClick={() => {
                                if (width == 900) {
                                    queryState({ openModal: !isState.openModal, dataModal: {} });
                                } else {
                                    setWidth(900);
                                }
                            }}
                        />
                        <FaUpRightAndDownLeftFromCenter
                            className="text-gray-600 text-sm cursor-pointer rotate-90"
                            onClick={() => setWidth(window.innerWidth)}
                        />
                        <h1 className="text-[#0F4F9E] font-medium">
                            {dataLang?.productions_orders_details || "productions_orders_details"}
                        </h1>
                    </div>
                    <button
                        onClick={() => {
                            queryState({ openModal: !isState.openModal, dataModal: {} });
                            setWidth(900);
                        }}
                        type="button"
                        className="w-[20px] h-[20px] hover:animate-spin transition-all duration-300 ease-linear"
                    >
                        <Image
                            alt=""
                            src={"/manufacture/x.png"}
                            width={20}
                            height={20}
                            className="w-full h-full object-cover"
                        />
                    </button>
                </div>
                <div className={`grid grid-cols-12 w-auto items-center flex-wrap gap-4`}>
                    <div className={`grid grid-cols-2 ${width >= 1100 ? "col-span-5" : "col-span-12"} `}>
                        <div className="flex flex-col">
                            <div className="my-2 flex items-center gap-1">
                                <h3 className="text-[13px]">Số lệnh sản xuất:</h3>
                                <h3 className=" text-[13px] font-medium">LSX-28112303</h3>
                            </div>
                            <div className="my-2  col-span-3 flex items-center gap-1">
                                <h3 className="text-[13px] ">Kế hoạch NVL:</h3>
                                <h3 className=" text-[13px] font-medium">KHSX-28112302</h3>
                            </div>
                            <div className="my-2 flex items-center gap-1">
                                <h3 className="text-[13px]">Số LSX chi tiết:</h3>
                                <h3 className=" text-[13px] font-medium">Lsxct-28112302</h3>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="my-2 col-span-3 flex items-center gap-1">
                                <h3 className="text-[13px]">Đơn hàng bán:</h3>
                                <h3 className="text-[13px] font-medium">SO-27112304</h3>
                            </div>
                            <div className="my-2 col-span-3 flex items-center gap-1">
                                <h3 className="text-[13px]">Khách hàng:</h3>
                                <h3 className="text-[13px] font-medium">Anh Nghĩa</h3>
                            </div>
                            <div className="my-2 flex items-center gap-1">
                                <h3 className=" text-[13px]">Chi nhánh:</h3>
                                <TagBranch className="w-fit">HCM</TagBranch>
                            </div>
                        </div>
                    </div>
                    <div className={`grid grid-cols-3 ${width >= 1100 ? "col-span-7" : "col-span-12"}  gap-5`}>
                        {dataTotal.map((e, i) => (
                            <div
                                className={`w-full p-4 rounded-md space-y-1.5`}
                                style={{ backgroundColor: `${e.bgColor}` }}
                                key={i}
                            >
                                <h4 className={`text-[#3A3E4C] font-normal ${width >= 1100 ? "text-base" : "text-xs"}`}>
                                    {e.title}
                                </h4>
                                <div className="flex justify-between items-end">
                                    <h6
                                        className={`text-base font-medium text-white px-3 py-1 flex flex-col justify-center items-center rounded-md`}
                                        style={{ backgroundColor: `${e.bgSmall}` }}
                                    >
                                        {e.number}
                                    </h6>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-b mt-4">
                    <ContainerFilterTab>
                        {listTab.map((e) => (
                            <button
                                key={e.id}
                                onClick={() => handleActiveTab(e.id)}
                                className={`hover:bg-[#F7FBFF] ${
                                    isStateModal.isTab == e.id && "border-[#0F4F9E] border-b bg-[#F7FBFF]"
                                } hover:border-[#0F4F9E] hover:border-b group transition-all duration-200 ease-linear outline-none focus:outline-none min-w-fit`}
                            >
                                <h3
                                    className={`relative py-[10px] px-2  font-normal ${
                                        isStateModal.isTab == e.id ? "text-[#0F4F9E]" : "text-[#667085]"
                                    } ${
                                        width > 1100 ? "text-base" : "text-sm"
                                    } group-hover:text-[#0F4F9E] transition-all duration-200 ease-linear`}
                                >
                                    {e.name}
                                    <span
                                        className={`${
                                            e?.count > 0 &&
                                            "absolute top-0 right-0 3xl:translate-x-[65%] translate-x-1/2 3xl:w-[24px]  2xl:w-[20px] xl:w-[18px] lg:w-[18px] 3xl:h-[24px] 2xl:h-[20px] xl:h-[18px] lg:h-[18px] 3xl:py-1 3xl:px-2  2xl:py-1 2xl:px-2  xl:py-1 xl-px-2  lg:py-1 lg:px-2 3xl:text-[15px] 2xl:text-[13px] xl:text-sm lg:text-sm  bg-[#ff6f00]  text-white rounded-full text-center items-center flex justify-center"
                                        } `}
                                    >
                                        {e?.count > 0 && e?.count}
                                    </span>
                                </h3>
                            </button>
                        ))}
                    </ContainerFilterTab>
                </div>
                <div className="my-2 w-full">{components[isStateModal.isTab]}</div>
            </div>
            <div
                className="absolute bg-transparent top-0 left-0 -translate-x-1/4  h-full cursor-col-resize"
                onMouseDown={startResize}
            >
                <RxDragHandleDots1 size={21} className="my-auto h-full" />
            </div>
        </div>
    );
});

export default ModalDetail;
