import Zoom from "@/components/UI/zoomElement/zoomElement";
import { SearchNormal1 } from "iconsax-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { useState } from "react";
import { v4 as uddid } from "uuid";
const MainTable = () => {
    const arrButton = [
        {
            id: uddid(),
            name: "Giữ kho",
            icon: "/materials_planning/add.png",
        },
        {
            id: uddid(),
            name: "Thêm KH  mua hàng",
            icon: "/materials_planning/add.png",
        },
        {
            id: uddid(),
            name: "Xóa",
            icon: "/materials_planning/delete.png",
        },
    ];

    const initstialData = [
        {
            id: uddid(),
            title: "KHNVL-20132222",
            time: "13/10/2023 09:23:00",
            name: "PhuongPTM",
            productionOrder: [
                {
                    id: uddid(),
                    nameProduction: "LSX-514684654",
                },
                {
                    id: uddid(),
                    nameProduction: "LSX-514684654",
                },
            ],
            followUp: [
                {
                    id: uddid(),
                    nameFollow: "SO-121203122",
                    typeFollow: "Đơn hàng",
                },
            ],
            arrDataTab: [
                {
                    id: uddid(),
                    type: "item",
                    listData: [
                        {
                            id: uddid(),
                            title: "PO-223428",
                            arrListData: [
                                {
                                    id: uddid(),
                                    image: "/materials_planning/products.png",
                                    name: "Cổ cáo",
                                    subName: "COAOTHUN",
                                    quantity: "8.000",
                                    quantityPreventive: "8.000",
                                    quantityTotal: "16.000",
                                },
                                {
                                    id: uddid(),
                                    image: "/materials_planning/products.png",
                                    name: "Cổ cáo",
                                    subName: "COAOTHUN",
                                    quantity: "8.000",
                                    quantityPreventive: "8.000",
                                    quantityTotal: "16.000",
                                },
                            ],
                        },
                        {
                            id: uddid(),
                            title: "PO-223428",
                            arrListData: [
                                {
                                    id: uddid(),
                                    image: "/materials_planning/products.png",
                                    name: "Cổ cáo",
                                    subName: "COAOTHUN",
                                    quantity: "8.000",
                                    quantityPreventive: "8.000",
                                    quantityTotal: "16.000",
                                },
                                {
                                    id: uddid(),
                                    image: "/materials_planning/products.png",
                                    name: "Cổ cáo",
                                    subName: "COAOTHUN",
                                    quantity: "8.000",
                                    quantityPreventive: "8.000",
                                    quantityTotal: "16.000",
                                },
                            ],
                        },
                    ],
                },
            ],
            note: "",
        },
        {
            id: uddid(),
            title: "KHNVL-20132223",
            time: "13/10/2023 09:23:00",
            name: "PhuongPTM",
            productionOrder: [
                {
                    id: uddid(),
                    nameProduction: "LSX-514684654",
                },
                {
                    id: uddid(),
                    nameProduction: "LSX-514684654",
                },
            ],
            followUp: [
                {
                    id: uddid(),
                    nameFollow: "SO-121203122",
                    typeFollow: "Đơn hàng",
                },
            ],
            arrDataTab: [
                {
                    id: uddid(),
                    type: "item",
                    listData: [
                        {
                            id: uddid(),
                            title: "PO-223428",
                            arrListData: [
                                {
                                    id: uddid(),
                                    image: "/materials_planning/products.png",
                                    name: "Cổ cáo",
                                    subName: "COAOTHUN",
                                    quantity: "8.000",
                                    quantityPreventive: "8.000",
                                    quantityTotal: "16.000",
                                },
                                {
                                    id: uddid(),
                                    image: "/materials_planning/products.png",
                                    name: "Cổ cáo",
                                    subName: "COAOTHUN",
                                    quantity: "8.000",
                                    quantityPreventive: "8.000",
                                    quantityTotal: "16.000",
                                },
                            ],
                        },
                    ],
                },
            ],
            note: "",
        },
    ];

    const listTab = [
        {
            id: uddid(),
            name: "Mặt hàng",
            type: "item",
        },
        {
            id: uddid(),
            name: "Kế hoạch Bán thành phẩm & Nguyên vật liệu",
            type: "plan",
        },
        {
            id: uddid(),
            name: "Giữ kho & Yêu cầu mua hàng",
            type: "keepStock",
        },
    ];

    const newData = initstialData.map((e) => {
        const newArrDataTab = e.arrDataTab.map((i) => {
            const newListData = i.listData.map((o) => {
                return {
                    ...o,
                    showLits: true,
                    showChild: true,
                };
            });
            return {
                ...i,
                listData: newListData,
            };
        });
        return {
            ...e,
            showParent: false,
            arrDataTab: newArrDataTab,
        };
    });

    const [dataTable, sDataTable] = useState(newData);
    const [findDataTable, sFindDataTable] = useState({});
    const [filterItem, sFilterItem] = useState({});
    const [isTab, sIsTab] = useState("item");

    const handleFindDataTable = (id) => {
        const data = [...dataTable];
        const newArrDataTab = data.map((e) => {
            const newArrDataTab = e.arrDataTab.map((i) => {
                const newListData = i.listData.map((o) => {
                    return {
                        ...o,
                        showLits: e.id === id ? !e.showParent : false,
                        showChild: true,
                    };
                });
                return {
                    ...i,
                    listData: newListData,
                };
            });
            return {
                ...e,
                showParent: e.id === id ? !e.showParent : false,
                arrDataTab: newArrDataTab,
            };
        });
        sDataTable(newArrDataTab);
        sFindDataTable(data.find((e) => e.id == id));
    };

    useEffect(() => {
        const data = [...dataTable];
        handleFindDataTable(data[0].id);
    }, []);

    const handleActiveTab = (e) => sIsTab(e);

    useEffect(() => {
        const newrData = findDataTable?.arrDataTab?.find((e) => e.type == isTab);
        sFilterItem(newrData);
    }, [findDataTable]);

    console.log(filterItem);

    // Show mặt hàng table
    const handShowItem = (id) => {
        const newListData = filterItem.listData.map((e) => {
            return {
                ...e,
                showChild: e.id == id ? !e.showChild : e.showChild,
            };
        });
        sFilterItem((e) => ({
            ...e,
            listData: newListData,
        }));
    };
    return (
        <React.Fragment>
            <div className="!mt-[14px]">
                <h1 className="text-[#141522] font-medium text-sm my-2">Tổng số kế hoạch NVL: {dataTable.length}</h1>
                <div className="flex ">
                    <div className="w-[25%] border-r-0 border-[#d8dae5] border">
                        <div className="border-b py-2 px-1 flex items-center justify-center bg-[#D0D5DD]/20 ">
                            <form className="flex items-center relative  w-full">
                                <SearchNormal1
                                    size={20}
                                    className="absolute 2xl:left-3 z-10 text-[#cccccc] xl:left-[4%] left-[1%]"
                                />
                                <input
                                    className="relative border border-[#d8dae5] bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] 2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5 py-2.5 rounded-md 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-full w-[100%]"
                                    type="text"
                                    placeholder="Tìm kế hoạch NVL"
                                />
                            </form>
                        </div>
                        <div>
                            {dataTable.map((e, eIndex) => (
                                <div
                                    key={e.id}
                                    onClick={() => handleFindDataTable(e.id)}
                                    className={`p-2 ${
                                        e.showParent && "bg-[#F0F7FF]"
                                    } hover:bg-[#F0F7FF] cursor-pointer transition-all ease-linear ${
                                        dataTable.length - 1 == eIndex ? "border-b-none" : "border-b"
                                    } `}
                                >
                                    <div className="flex justify-between">
                                        <h1 className="text-base font-medium text-[#0F4F9E]">{e.title}</h1>
                                        <div className="flex flex-col items-end my-1">
                                            <h3 className="text-[#667085] font-normal text-xs">
                                                Tạo vào{" "}
                                                <span className="text-[#141522] font-medium text-xs">{e.time}</span>
                                            </h3>
                                            <h3 className="text-[#667085] font-normal text-xs">
                                                bởi <span className="text-[#141522] font-medium text-xs">{e.name}</span>
                                            </h3>
                                        </div>
                                    </div>
                                    {e.showParent && (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex">
                                                <h3 className="w-[30%] text-[#52575E] font-normal text-sm">
                                                    Số lệnh sản xuất
                                                </h3>
                                                <div className="flex flex-col w-[70%]">
                                                    {e.productionOrder.map((i) => (
                                                        <h2 className="text-[#191D23] font-medium text-sm">
                                                            {i.nameProduction}
                                                        </h2>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <h3 className="w-[30%] text-[#52575E] font-normal text-sm">Lập theo</h3>
                                                <div className="flex flex-col w-[70%]">
                                                    {e.followUp.map((i) => (
                                                        <React.Fragment>
                                                            <h2 className="text-[#191D23] font-medium text-sm">
                                                                {i.nameFollow}
                                                            </h2>
                                                            <h2 className="text-[#9295A4] font-normal text-sm">
                                                                {i.typeFollow}
                                                            </h2>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <h3 className="w-[30%] text-[#52575E] font-normal text-sm">Ghi chú</h3>
                                                <div className="flex flex-col w-[70%]">
                                                    <h2 className="text-[#191D23] font-medium text-sm">
                                                        {e.note ? e.note : "Không có ghi chú"}
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-[75%] border border-[#d8dae5] ">
                        <div className="flex items-center justify-between py-1 px-4 border-b">
                            <div>
                                <h1 className="text-[#52575E] font-normal text-xs uppercase">Kế hoạch NVL</h1>
                                <h1 className="text-[#3276FA] font-medium text-[20px] uppercase">
                                    {findDataTable?.title}
                                </h1>
                            </div>
                            <div className="flex gap-4">
                                {arrButton.map((e) => (
                                    <Zoom whileHover={{ scale: 1.05 }} whileTap={{ scale: 1.08 }} className="w-fit">
                                        <button
                                            className=" bg-[#F3F4F6] rounded-lg  outline-none focus:outline-none"
                                            key={e.id}
                                        >
                                            <div className="flex items-center gap-2 py-2 px-3 ">
                                                <Image height={16} width={16} src={e.icon} className="object-cover" />
                                                <h3 className="text-[#141522] font-medium text-base">{e.name}</h3>
                                            </div>
                                        </button>
                                    </Zoom>
                                ))}
                            </div>
                        </div>
                        <div className="mx-4">
                            <div className="border-b my-6 ">
                                <div className="flex items-center gap-4 ">
                                    {listTab.map((e) => (
                                        <button
                                            key={e.id}
                                            onClick={() => handleActiveTab(e.type)}
                                            className={`hover:bg-[#F7FBFF] ${
                                                isTab == e.type && "border-[#0F4F9E] border-b bg-[#F7FBFF]"
                                            } hover:border-[#0F4F9E] hover:border-b group transition-all duration-200 ease-linear outline-none focus:outline-none`}
                                        >
                                            <h3
                                                className={`py-[10px] px-2  font-normal ${
                                                    isTab == e.type ? "text-[#0F4F9E]" : "text-[#667085]"
                                                } text-base group-hover:text-[#0F4F9E] transition-all duration-200 ease-linear`}
                                            >
                                                {e.name}
                                            </h3>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                {isTab == "item" && (
                                    <React.Fragment>
                                        <h1 className="text-[#11315B] font-normal text-lg">
                                            Danh sách sản phẩm (theo đơn hàng)
                                        </h1>

                                        <div className="my-4">
                                            <div className="grid grid-cols-10 my-4">
                                                <h4 className="col-span-4 px-4 text-[#344054] font-normal text-xs uppercase">
                                                    Đơn hàng
                                                </h4>
                                                <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                                                    Số lượng
                                                </h4>
                                                <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                                                    Số lượng dự phòng
                                                </h4>
                                                <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                                                    Tổng số lượng
                                                </h4>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}
                                {["item"].includes(isTab) &&
                                    filterItem?.listData?.map((e, index) => (
                                        <>
                                            {
                                                <div className="grid grid-cols-10 items-center ">
                                                    <div
                                                        onClick={() => handShowItem(e.id)}
                                                        className="col-span-10 bg-[#EEF4FD] flex items-center gap-0.5 my-1 rounded"
                                                    >
                                                        <Image
                                                            src={"/materials_planning/dow.png"}
                                                            width={14}
                                                            height={17}
                                                            className={`object-cover ${
                                                                e.showChild ? "" : "-rotate-90"
                                                            } transition-all duration-150 ease-linear`}
                                                        />
                                                        <h1 className="text-[#52575E] font-semibold text-sm py-2">
                                                            {e.title}
                                                        </h1>
                                                    </div>
                                                    {e.showChild &&
                                                        e.arrListData.map((i) => (
                                                            <div className="grid grid-cols-10 items-center col-span-10">
                                                                <h4 className="col-span-4 text-[#344054] font-normal text-xs flex items-center py-2 px-4 gap-2">
                                                                    <Image
                                                                        src={i.image}
                                                                        width={36}
                                                                        height={36}
                                                                        className="object-cover rounded"
                                                                    />
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <h1 className="text-[#000000] font-semibold text-sm">
                                                                            {i.name}
                                                                        </h1>
                                                                        <h1 className="text-[#9295A4] font-normal text-[10px]">
                                                                            {i.subName}
                                                                        </h1>
                                                                    </div>
                                                                </h4>
                                                                <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                                                                    {i.quantity}
                                                                </h4>
                                                                <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                                                                    {i.quantityPreventive}
                                                                </h4>
                                                                <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                                                                    {i.quantityTotal}
                                                                </h4>
                                                            </div>
                                                        ))}
                                                </div>
                                            }
                                        </>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default MainTable;
