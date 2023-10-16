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
                        id: uuid(),
                        type: "a",
                        db: [
                            { id: uuid(), name: "Thanh VN b", time: "20/10/2023" },
                            { id: uuid(), name: "Thanh VN b1", time: "20/10/2023" },
                            { id: uuid(), name: "Thanh VN b3", time: "20/10/2023" },
                            { id: uuid(), name: "Thanh VN b3", time: "20/10/2023" },
                            { id: uuid(), name: "Thanh VN b3", time: "20/10/2023" },
                            { id: uuid(), name: "Thanh VN b3", time: "20/10/2023" },
                            { id: uuid(), name: "Thanh VN b3", time: "20/10/2023" },
                            { id: uuid(), name: "Thanh VN b3", time: "20/10/2023" },
                            { id: uuid(), name: "Thanh VN b3", time: "20/10/2023" },
                        ],
                    },
                    { id: uuid(), db: [{ id: uuid(), name: "Thanh VN c", time: "20/10/2023" }], type: "c" },
                    { id: uuid(), type: "d", db: [{ id: uuid(), name: "Thanh VN a", time: "20/10/2023" }] },
                ],
            },
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
                        type: "e",
                        id: uuid(),
                        db: [{ id: uuid(), name: "Thanh VN e", time: "20/10/2023" }],
                    },
                    { id: uuid(), db: [{ id: uuid(), name: "Thanh VN f", time: "20/10/2023" }], type: "f" },
                    { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g", time: "20/10/2023" }] },
                    { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h", time: "20/10/2023" }] },
                    { id: uuid(), type: "i", db: [{ id: uuid(), name: "Thanh VN i", time: "20/10/2023" }] },
                    { id: uuid(), type: "j", db: [{ id: uuid(), name: "Thanh VN j", time: "20/10/2023" }] },
                ],
            },
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
                        type: "e",
                        id: uuid(),
                        db: [{ id: uuid(), name: "Thanh VN e", time: "20/10/2023" }],
                    },
                    { id: uuid(), db: [{ id: uuid(), name: "Thanh VN f", time: "20/10/2023" }], type: "f" },
                    { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g", time: "20/10/2023" }] },
                    { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h", time: "20/10/2023" }] },
                    { id: uuid(), type: "i", db: [{ id: uuid(), name: "Thanh VN i", time: "20/10/2023" }] },
                    { id: uuid(), type: "j", db: [{ id: uuid(), name: "Thanh VN j", time: "20/10/2023" }] },
                ],
            },
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
                    { id: uuid(), type: "e", db: [{ id: uuid(), name: "Thanh VN e", time: "20/10/2023" }] },
                    { id: uuid(), type: "f", db: [{ id: uuid(), name: "Thanh VN f", time: "20/10/2023" }] },
                    { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g", time: "20/10/2023" }] },
                    { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h", time: "20/10/2023" }] },
                    { id: uuid(), type: "i", db: [{ id: uuid(), name: "Thanh VN i", time: "20/10/2023" }] },
                    { id: uuid(), type: "j", db: [{ id: uuid(), name: "Thanh VN j", time: "20/10/2023" }] },
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
                    subStages: "Tẩy",
                },
                active: false,
                type: "e",
            },
            {
                id: uuid(),
                name: {
                    nameStages: "Công đoạn 7",
                    subStages: "Giao",
                },
                active: false,
                type: "e",
            },
            {
                id: uuid(),
                name: {
                    nameStages: "Công đoạn 8",
                    subStages: "Giao",
                },
                active: false,
                type: "f",
            },
            {
                id: uuid(),
                name: {
                    nameStages: "Công đoạn 9",
                    subStages: "Giao đi",
                },
                active: false,
                type: "g",
            },
            {
                id: uuid(),
                name: {
                    nameStages: "Công đoạn 10",
                    subStages: "Giao hàng",
                },
                active: false,
                type: "h",
            },
        ],
    };
    const [data, sData] = useState(initialData);
    const [isOpen, sIsOpen] = useState(false);
    const [idParent, sIdParent] = useState(null);
    ///Tìm theo vị trí công đoạn
    const newDatabody = data.data.map((item) => {
        const sortedChild = data.stages
            .map((stage) => {
                const correspondingChild = item.child.find((child) => child.type === stage.type);
                return correspondingChild
                    ? { ...correspondingChild, stageName: stage.name }
                    : {
                          id: uuid(),
                          name: null,
                          time: new Date(),
                          type: null,
                      };
            })
            .filter((child) => child !== null);

        return {
            ...item,
            child: sortedChild,
        };
    });

    const handleShowProgress = (id) => {
        sIsOpen(!isOpen);
        sIdParent(id);
    };

    return (
        <>
            <Head>
                <title>{"Điều độ sản xuất"}</title>
            </Head>
            <div className="relative  3xl:pt-[88px] xxl:pt-[80px] 2xl:pt-[78px] xl:pt-[75px] lg:pt-[70px] pt-70 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? <div className="p-4"></div> : <Header></Header>}
                <FilterHeader />
                <MainTable
                    data={data}
                    handleShowProgress={handleShowProgress}
                    dataLang={dataLang}
                    newDatabody={newDatabody}
                    isOpen={isOpen}
                    idParent={idParent}
                />
            </div>
        </>
    );
};
export default Index;
