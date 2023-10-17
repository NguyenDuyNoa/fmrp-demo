import Head from "next/head";
import { useSelector } from "react-redux";
import Header from "./(header)/header";
import FilterHeader from "./(filterHeader)/filterHeader";
import MainTable from "./(mainTable)/mainTable";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
const Index = (props) => {
    const dataLang = props.dataLang;
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);
    const initialData = {
        data: [
            {
                id: uuid(),
                name: "LSXCT-112912731",
                image: "/productionSmoothing/Image.png",
                desriptions: "Kính CL dán 11 ly trắng sữa",
                process: [
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                ],
                dateStart: "12/9/2023",
                dateEnd: "12/9/2023",
                customer: "Công ty thời trang YODY",
                child: [
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e1" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [
                                    { id: uuid(), name: "Thanh VN f" },
                                    { id: uuid(), name: "Thanh VN f1" },
                                ],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Thanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Thanh VN b" }] },
                        ],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Thanh VN b" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Thanh VN a" }] },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "i", db: [{ id: uuid(), name: "Thanh VN i" }] },
                        ],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [{ id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN g" }] }],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [{ id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN g" }] }],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [{ id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN g" }] }],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [{ id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN g" }] }],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [{ id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN g" }] }],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [{ id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN g" }] }],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [{ id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN g" }] }],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [{ id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN g" }] }],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [{ id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN g" }] }],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [{ id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN g" }] }],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [{ id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN g" }] }],
                    },
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912731",
                image: "/productionSmoothing/Image.png",
                desriptions: "Kính CL dán 11 ly trắng sữa 1",
                process: [
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                ],
                dateStart: "12/9/2023",
                dateEnd: "12/9/2023",
                customer: "Công ty thời trang YODY",
                child: [
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e1" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [
                                    { id: uuid(), name: "Thanh VN f" },
                                    { id: uuid(), name: "Thanh VN f1" },
                                ],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Thanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Thanh VN b" }] },
                        ],
                    },
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912731",
                image: "/productionSmoothing/Image.png",
                desriptions: "Kính CL dán 11 ly trắng sữa 2",
                process: [
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                ],
                dateStart: "12/9/2023",
                dateEnd: "12/9/2023",
                customer: "Công ty thời trang YODY",
                child: [
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e1" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [
                                    { id: uuid(), name: "Thanh VN f" },
                                    { id: uuid(), name: "Thanh VN f1" },
                                ],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Thanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Thanh VN b" }] },
                        ],
                    },
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912731",
                image: "/productionSmoothing/Image.png",
                desriptions: "Kính CL dán 11 ly trắng sữa 2",
                process: [
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                ],
                dateStart: "12/9/2023",
                dateEnd: "12/9/2023",
                customer: "Công ty thời trang YODY",
                child: [
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [],
                    },
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912731",
                image: "/productionSmoothing/Image.png",
                desriptions: "Kính CL dán 11 ly trắng sữa 2",
                process: [
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                ],
                dateStart: "12/9/2023",
                dateEnd: "12/9/2023",
                customer: "Công ty thời trang YODY",
                child: [
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [],
                    },
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912731",
                image: "/productionSmoothing/Image.png",
                desriptions: "Kính CL dán 11 ly trắng sữa 2",
                process: [
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                ],
                dateStart: "12/9/2023",
                dateEnd: "12/9/2023",
                customer: "Công ty thời trang YODY",
                child: [
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [],
                    },
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912731",
                image: "/productionSmoothing/Image.png",
                desriptions: "Kính CL dán 11 ly trắng sữa 2",
                process: [
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                ],
                dateStart: "12/9/2023",
                dateEnd: "12/9/2023",
                customer: "Công ty thời trang YODY",
                child: [
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [],
                    },
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912731",
                image: "/productionSmoothing/Image.png",
                desriptions: "Kính CL dán 11 ly trắng sữa 2",
                process: [
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                ],
                dateStart: "12/9/2023",
                dateEnd: "12/9/2023",
                customer: "Công ty thời trang YODY",
                child: [
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [],
                    },
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912731",
                image: "/productionSmoothing/Image.png",
                desriptions: "Kính CL dán 11 ly trắng sữa 2",
                process: [
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                ],
                dateStart: "12/9/2023",
                dateEnd: "12/9/2023",
                customer: "Công ty thời trang YODY",
                child: [
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [],
                    },
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912731",
                image: "/productionSmoothing/Image.png",
                desriptions: "Kính CL dán 11 ly trắng sữa 2",
                process: [
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                ],
                dateStart: "12/9/2023",
                dateEnd: "12/9/2023",
                customer: "Công ty thời trang YODY",
                child: [
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [],
                    },
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912731",
                image: "/productionSmoothing/Image.png",
                desriptions: "Kính CL dán 11 ly trắng sữa 2",
                process: [
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                ],
                dateStart: "12/9/2023",
                dateEnd: "12/9/2023",
                customer: "Công ty thời trang YODY",
                child: [
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [],
                    },
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912731",
                image: "/productionSmoothing/Image.png",
                desriptions: "Kính CL dán 11 ly trắng sữa 2",
                process: [
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                ],
                dateStart: "12/9/2023",
                dateEnd: "12/9/2023",
                customer: "Công ty thời trang YODY",
                child: [
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [],
                    },
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912731",
                image: "/productionSmoothing/Image.png",
                desriptions: "Kính CL dán 11 ly trắng sữa 2",
                process: [
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: true,
                    },
                    {
                        id: uuid(),
                        active: false,
                    },
                ],
                dateStart: "12/9/2023",
                dateEnd: "12/9/2023",
                customer: "Công ty thời trang YODY",
                child: [
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T2",
                            days: "30",
                        },
                        dataChild: [],
                    },
                ],
            },
        ],
        stages: [
            {
                id: uuid(),
                name: {
                    nameStages: "Công đoạn 1",
                    subStages: "May",
                },
                active: true,
                type: "a",
            },
            {
                id: uuid(),
                name: {
                    nameStages: "Công đoạn 2",
                    subStages: "Cắt",
                },
                active: true,
                type: "b",
            },
            {
                id: uuid(),
                name: {
                    nameStages: "Công đoạn 3",
                    subStages: "Thêu",
                },
                active: true,
                type: "c",
            },
            {
                id: uuid(),
                name: {
                    nameStages: "Công đoạn 4",
                    subStages: "Giặt",
                },
                active: true,
                type: "d",
            },
            {
                id: uuid(),
                name: {
                    nameStages: "Công đoạn 5",
                    subStages: "Màu",
                },
                active: false,
                type: "e",
            },

            {
                id: uuid(),
                name: {
                    nameStages: "Công đoạn 6",
                    subStages: "Giao",
                },
                active: false,
                type: "f",
            },
            {
                id: uuid(),
                name: {
                    nameStages: "Công đoạn 7",
                    subStages: "Giao đi",
                },
                active: false,
                type: "g",
            },
            {
                id: uuid(),
                name: {
                    nameStages: "Công đoạn 8",
                    subStages: "Giao hàng",
                },
                active: false,
                type: "h",
            },
            {
                id: uuid(),
                name: {
                    nameStages: "Công đoạn 9",
                    subStages: "Giao hàng i",
                },
                active: false,
                type: "i",
            },
        ],
    };
    const [data, sData] = useState(initialData);
    const [isOpen, sIsOpen] = useState(false);
    const [isLoading, sIsLoading] = useState(false);
    const [idParent, sIdParent] = useState(null);

    ///Tìm theo vị trí công đoạn
    const updateDataChild = (data, idParent) => {
        const dataFind = data.data.find((e) => e.id === idParent);

        if (dataFind) {
            const sortedChild = dataFind.child.map((childItem) => {
                const sortedDataChild = {};
                data.stages.map((stage) => {
                    const filteredData = childItem.dataChild.filter((data) => data.type === stage.type);
                    sortedDataChild[stage.type] = filteredData.length > 0 ? filteredData : [{ id: uuid() }];
                });
                const flattenedDataChild = Object.values(sortedDataChild).flat();
                return {
                    ...childItem,
                    dataChild: flattenedDataChild,
                };
            });

            const updatedData = {
                ...dataFind,
                child: sortedChild,
            };

            return updatedData;
        }

        return null;
    };
    const dataFind = updateDataChild(data, idParent);

    const handleShowProgress = (id) => {
        sIsOpen(!isOpen);
        sIdParent(id);
        sIsLoading(true);
        setTimeout(() => {
            sIsLoading(false);
        }, 1000);
    };

    return (
        <>
            <Head>
                <title>{"Điều độ sản xuất"}</title>
            </Head>
            <div className="relative  3xl:pt-[88px] xxl:pt-[80px] 2xl:pt-[78px] xl:pt-[75px] lg:pt-[70px] pt-70 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? <div className="p-4"></div> : <Header data={data}></Header>}
                <FilterHeader />
                <MainTable
                    data={data}
                    handleShowProgress={handleShowProgress}
                    dataLang={dataLang}
                    newDatabody={""}
                    isOpen={isOpen}
                    idParent={idParent}
                    dataFind={dataFind}
                    isLoading={isLoading}
                />
            </div>
        </>
    );
};
export default Index;
