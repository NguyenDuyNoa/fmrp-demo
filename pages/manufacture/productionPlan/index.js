import Head from "next/head";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import ToatstNotifi from "@/components/UI/alerNotification/alerNotification";
import { v4 as uuid } from "uuid";
import { useState } from "react";

const Header = dynamic(() => import("./(header)/header"), { ssr: false });

const FilterHeader = dynamic(() => import("./(filterHeader)/filterHeader"), { ssr: false });

const BodyGantt = dynamic(() => import("./(gantt)"), { ssr: false });

const Index = (props) => {
    const dataLang = props.dataLang;
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);
    const propss = {
        dataLang,
    };
    const timeLine = [
        {
            id: uuid(),
            title: "Tháng 1 2023",
            month: 1,
            days: [
                {
                    id: uuid(),
                    day: "T2 24",
                    type: "t2",
                },
                {
                    id: uuid(),
                    day: "T3 25",
                    type: "t3",
                },
                {
                    id: uuid(),
                    day: "T4 26",
                    type: "t4",
                },
                {
                    id: uuid(),
                    day: "T5 27",
                    type: "t5",
                },
                {
                    id: uuid(),
                    day: "T6 28",
                    type: "t6",
                },
                {
                    id: uuid(),
                    day: "T7 29",
                    type: "t7",
                },
                {
                    id: uuid(),
                    day: "CN 30",
                    type: "cn",
                },
            ],
        },
        {
            id: uuid(),
            title: "Tháng 2 2023",
            month: 2,
            days: [
                {
                    id: uuid(),
                    day: "T2 24",
                    type: "t2",
                },
                {
                    id: uuid(),
                    day: "T3 25",
                    type: "t3",
                },
                {
                    id: uuid(),
                    day: "T4 26",
                    type: "t4",
                },
                {
                    id: uuid(),
                    day: "T5 27",
                    type: "t5",
                },
                {
                    id: uuid(),
                    day: "T6 28",
                    type: "t6",
                },
                {
                    id: uuid(),
                    day: "T7 29",
                    type: "t7",
                },
                {
                    id: uuid(),
                    day: "CN 30",
                    type: "cn",
                },
            ],
        },
        {
            id: uuid(),
            title: "Tháng 3 2023",
            month: 3,
            days: [
                {
                    id: uuid(),
                    day: "T2 24",
                    type: "t2",
                },
                {
                    id: uuid(),
                    day: "T3 25",
                    type: "t3",
                },
                {
                    id: uuid(),
                    day: "T4 26",
                    type: "t4",
                },
                {
                    id: uuid(),
                    day: "T5 27",
                    type: "t5",
                },
                {
                    id: uuid(),
                    day: "T6 28",
                    type: "t6",
                },
                {
                    id: uuid(),
                    day: "T7 29",
                    type: "t7",
                },
                {
                    id: uuid(),
                    day: "CN 30",
                    type: "cn",
                },
            ],
        },
        {
            id: uuid(),
            title: "Tháng 4 2023",
            month: 4,
            days: [
                {
                    id: uuid(),
                    day: "T2 24",
                    type: "t2",
                },
                {
                    id: uuid(),
                    day: "T3 25",
                    type: "t3",
                },
                {
                    id: uuid(),
                    day: "T4 26",
                    type: "t4",
                },
                {
                    id: uuid(),
                    day: "T5 27",
                    type: "t5",
                },
                {
                    id: uuid(),
                    day: "T6 28",
                    type: "t6",
                },
                {
                    id: uuid(),
                    day: "T7 29",
                    type: "t7",
                },
                {
                    id: uuid(),
                    day: "CN 30",
                    type: "cn",
                },
            ],
        },
        {
            id: uuid(),
            title: "Tháng 5 2023",
            month: 5,
            days: [
                {
                    id: uuid(),
                    day: "T2 24",
                    type: "t2",
                },
                {
                    id: uuid(),
                    day: "T3 25",
                    type: "t3",
                },
                {
                    id: uuid(),
                    day: "T4 26",
                    type: "t4",
                },
                {
                    id: uuid(),
                    day: "T5 27",
                    type: "t5",
                },
                {
                    id: uuid(),
                    day: "T6 28",
                    type: "t6",
                },
                {
                    id: uuid(),
                    day: "T7 29",
                    type: "t7",
                },
                {
                    id: uuid(),
                    day: "CN 30",
                    type: "cn",
                },
            ],
        },
        {
            id: uuid(),
            title: "Tháng 6 2023",
            month: 6,
            days: [
                {
                    id: uuid(),
                    day: "T2 24",
                    type: "t2",
                },
                {
                    id: uuid(),
                    day: "T3 25",
                    type: "t3",
                },
                {
                    id: uuid(),
                    day: "T4 26",
                    type: "t4",
                },
                {
                    id: uuid(),
                    day: "T5 27",
                    type: "t5",
                },
                {
                    id: uuid(),
                    day: "T6 28",
                    type: "t6",
                },
                {
                    id: uuid(),
                    day: "T7 29",
                    type: "t7",
                },
                {
                    id: uuid(),
                    day: "CN 30",
                    type: "cn",
                },
            ],
        },
        {
            id: uuid(),
            title: "Tháng 7 2023",
            month: 7,
            days: [
                {
                    id: uuid(),
                    day: "T2 24",
                    type: "t2",
                },
                {
                    id: uuid(),
                    day: "T3 25",
                    type: "t3",
                },
                {
                    id: uuid(),
                    day: "T4 26",
                    type: "t4",
                },
                {
                    id: uuid(),
                    day: "T5 27",
                    type: "t5",
                },
                {
                    id: uuid(),
                    day: "T6 28",
                    type: "t6",
                },
                {
                    id: uuid(),
                    day: "T7 29",
                    type: "t7",
                },
                {
                    id: uuid(),
                    day: "CN 30",
                    type: "cn",
                },
            ],
        },
        {
            id: uuid(),
            title: "Tháng 8 2023",
            month: 8,
            days: [
                {
                    id: uuid(),
                    day: "T2 24",
                    type: "t2",
                },
                {
                    id: uuid(),
                    day: "T3 25",
                    type: "t3",
                },
                {
                    id: uuid(),
                    day: "T4 26",
                    type: "t4",
                },
                {
                    id: uuid(),
                    day: "T5 27",
                    type: "t5",
                },
                {
                    id: uuid(),
                    day: "T6 28",
                    type: "t6",
                },
                {
                    id: uuid(),
                    day: "T7 29",
                    type: "t7",
                },
                {
                    id: uuid(),
                    day: "CN 30",
                    type: "cn",
                },
            ],
        },
        {
            id: uuid(),
            title: "Tháng 9 2023",
            month: 9,
            days: [
                {
                    id: uuid(),
                    day: "T2 24",
                    type: "t2",
                },
                {
                    id: uuid(),
                    day: "T3 25",
                    type: "t3",
                },
                {
                    id: uuid(),
                    day: "T4 26",
                    type: "t4",
                },
                {
                    id: uuid(),
                    day: "T5 27",
                    type: "t5",
                },
                {
                    id: uuid(),
                    day: "T6 28",
                    type: "t6",
                },
                {
                    id: uuid(),
                    day: "T7 29",
                    type: "t7",
                },
                {
                    id: uuid(),
                    day: "CN 30",
                    type: "cn",
                },
            ],
        },
        {
            id: uuid(),
            title: "Tháng 10 2023",
            month: 10,
            days: [
                {
                    id: uuid(),
                    day: "T2 24",
                    type: "t2",
                },
                {
                    id: uuid(),
                    day: "T3 25",
                    type: "t3",
                },
                {
                    id: uuid(),
                    day: "T4 26",
                    type: "t4",
                },
                {
                    id: uuid(),
                    day: "T5 27",
                    type: "t5",
                },
                {
                    id: uuid(),
                    day: "T6 28",
                    type: "t6",
                },
                {
                    id: uuid(),
                    day: "T7 29",
                    type: "t7",
                },
                {
                    id: uuid(),
                    day: "CN 30",
                    type: "cn",
                },
            ],
        },
        {
            id: uuid(),
            title: "Tháng 11 2023",
            month: 11,
            days: [
                {
                    id: uuid(),
                    day: "T2 24",
                    type: "t2",
                },
                {
                    id: uuid(),
                    day: "T3 25",
                    type: "t3",
                },
                {
                    id: uuid(),
                    day: "T4 26",
                    type: "t4",
                },
                {
                    id: uuid(),
                    day: "T5 27",
                    type: "t5",
                },
                {
                    id: uuid(),
                    day: "T6 28",
                    type: "t6",
                },
                {
                    id: uuid(),
                    day: "T7 29",
                    type: "t7",
                },
                {
                    id: uuid(),
                    day: "CN 30",
                    type: "cn",
                },
            ],
        },
        {
            id: uuid(),
            title: "Tháng 12 2023",
            month: 12,
            days: [
                {
                    id: uuid(),
                    day: "T2 24",
                    type: "t2",
                },
                {
                    id: uuid(),
                    day: "T3 25",
                    type: "t3",
                },
                {
                    id: uuid(),
                    day: "T4 26",
                    type: "t4",
                },
                {
                    id: uuid(),
                    day: "T5 27",
                    type: "t5",
                },
                {
                    id: uuid(),
                    day: "T6 28",
                    type: "t6",
                },
                {
                    id: uuid(),
                    day: "T7 29",
                    type: "t7",
                },
                {
                    id: uuid(),
                    day: "CN 30",
                    type: "cn",
                },
            ],
        },
    ];
    const listOrder = [
        {
            id: uuid(),
            nameOrder: "PO-223429",
            status: "outDate",
            process: "84%",
            processDefault: [
                {
                    month: 1,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 2,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 3,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 4,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 5,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 6,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 7,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 8,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 9,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 10,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 11,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 12,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
            ],
            listProducts: [
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "outDate",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: false },
                                { id: 2, type: "t3", active: true, outDate: false },
                                { id: 3, type: "t4", active: true, outDate: false },
                                { id: 4, type: "t5", active: true, outDate: false },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 3,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 4,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 5,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                        {
                            month: 6,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                        {
                            month: 7,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                        {
                            month: 8,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                        {
                            month: 9,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                        {
                            month: 10,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                        {
                            month: 11,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                        {
                            month: 12,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "sussces",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 3,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 4,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "unfulfilled",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: uuid(),
            nameOrder: "PO-223428",
            status: "processing",
            process: "84%",
            processDefault: [
                {
                    month: 1,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
            ],
            listProducts: [
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "outDate",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "sussces",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 3,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: false },
                                { id: 2, type: "t3", active: true, outDate: false },
                                { id: 3, type: "t4", active: true, outDate: false },
                                { id: 4, type: "t5", active: true, outDate: false },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "unfulfilled",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: uuid(),
            nameOrder: "PO-223427",
            status: "sussces",
            process: "84%",
            processDefault: [
                {
                    month: 1,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 2,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 3,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
            ],
            listProducts: [
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "outDate",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "sussces",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t6", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 3,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "unfulfilled",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t6", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: uuid(),
            nameOrder: "PO-223426",
            status: "sussces",
            process: "84%",
            processDefault: [
                {
                    month: 1,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
            ],
            listProducts: [
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "outDate",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                                { id: 8, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "sussces",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 3,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "unfulfilled",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: uuid(),
            nameOrder: "PO-223425",
            status: "processing",
            process: "84%",
            processDefault: [
                {
                    month: 1,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
            ],
            listProducts: [
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "outDate",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                                { id: 8, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "sussces",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 3,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "unfulfilled",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: uuid(),
            nameOrder: "PO-223424",
            status: "outDate",
            process: "84%",
            processDefault: [
                {
                    month: 1,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t7", active: true },
                        { id: 6, type: "t7", active: true },
                    ],
                },
            ],
            listProducts: [
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "outDate",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                                { id: 8, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "sussces",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 3,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "unfulfilled",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: uuid(),
            nameOrder: "PO-223423",
            status: "sussces",
            process: "84%",
            processDefault: [
                {
                    month: 1,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 2,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
            ],
            listProducts: [
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "outDate",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                                { id: 8, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "sussces",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 3,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "unfulfilled",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: uuid(),
            nameOrder: "PO-223422",
            status: "processing",
            process: "84%",
            processDefault: [
                {
                    month: 1,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 2,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
            ],
            listProducts: [
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "outDate",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                                { id: 8, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "sussces",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 3,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "unfulfilled",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: uuid(),
            nameOrder: "PO-223421",
            status: "processing",
            process: "84%",
            processDefault: [
                {
                    month: 1,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 2,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
            ],
            listProducts: [
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "sussces",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                                { id: 8, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "sussces",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 3,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "unfulfilled",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: uuid(),
            nameOrder: "PO-223420",
            status: "sussces",
            process: "84%",
            processDefault: [
                {
                    month: 1,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
                {
                    month: 2,
                    days: [
                        { id: 1, type: "t2", active: true },
                        { id: 2, type: "t3", active: true },
                        { id: 3, type: "t4", active: true },
                        { id: 4, type: "t5", active: true },
                        { id: 5, type: "t6", active: true },
                        { id: 6, type: "t7", active: true },
                        { id: 7, type: "cn", active: true },
                    ],
                },
            ],
            listProducts: [
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "outDate",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                                { id: 8, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "sussces",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 1,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                        {
                            month: 3,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: false },
                                { id: 6, type: "t7", active: true, outDate: false },
                                { id: 7, type: "cn", active: true, outDate: false },
                            ],
                        },
                    ],
                },
                {
                    id: uuid(),
                    name: "Cổ áo",
                    images: "/productionPlan/coaothun.png",
                    desription: "COAOTHUN",
                    status: "unfulfilled",
                    quantity: "8.000",
                    actions: "Lập KH NVL",
                    processArr: [
                        {
                            month: 2,
                            days: [
                                { id: 1, type: "t2", active: true, outDate: true },
                                { id: 2, type: "t3", active: true, outDate: true },
                                { id: 3, type: "t4", active: true, outDate: true },
                                { id: 4, type: "t5", active: true, outDate: true },
                                { id: 5, type: "t7", active: true, outDate: true },
                                { id: 6, type: "t7", active: true, outDate: true },
                                { id: 7, type: "cn", active: true, outDate: true },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    const [isAscending, sIsAscending] = useState(true); // Trạng thái sắp xếp

    const updatedListOrder = listOrder.map((order) => {
        const updatedListProducts = order.listProducts.map((product) => {
            ///Sắp xếp theo tháng

            const newArrMonth = [...Array(12)].map((_, index) => {
                const crrItem = product.processArr.find((p) => p.month === index + 1);
                if (crrItem) {
                    return crrItem;
                }
                return { month: index + 1 };
            });
            ///Sắp xếp theo ngày
            const newArrDays = newArrMonth.map((i) => {
                const check = [...Array(7)].map((_, index) => {
                    const crrItem = i.days?.find((p) => p.id == index + 1);
                    if (crrItem) {
                        return crrItem;
                    }
                    return { id: index + 1, active: false };
                });
                return {
                    ...i,
                    days: check,
                };
            });
            return {
                ...product,
                processArr: newArrDays,
            };
        });
        ///Sắp xếp default theo tháng

        const processDefault = [...Array(12)].map((_, index) => {
            const crrItem = order.processDefault.find((p) => p.month === index + 1);
            if (crrItem) {
                return crrItem;
            }

            return { month: index + 1 };
        });
        ///Sắp xếp default theo ngày
        const processDefault2 = processDefault.map((i) => {
            const check = [...Array(7)].map((_, index) => {
                const crrItem = i.days?.find((p) => p.id == index + 1);
                if (crrItem) {
                    return crrItem;
                }
                return { id: index + 1, active: false };
            });
            return {
                ...i,
                days: check,
            };
        });

        return {
            ...order,
            show: true,
            processDefault: processDefault2,
            listProducts: updatedListProducts,
        };
    });

    const [data, sData] = useState(updatedListOrder);

    const handleShowSub = (index) => {
        const updatedData = [...data];
        updatedData.forEach((order, i) => {
            if (i === index) {
                order.show = !order.show;
            }
        });
        sData(updatedData);
    };

    const handleSort = (e) => {
        const updatedData = [...data];
        updatedData.sort((a, b) => {
            if (isAscending) {
                return a.nameOrder.localeCompare(b.nameOrder); // Sắp xếp từ nhỏ đến lớn
            } else {
                return b.nameOrder.localeCompare(a.nameOrder); // Sắp xếp từ lớn đến nhỏ
            }
        });
        ToatstNotifi("success", "Sắp xếp đơn hàng thành công");
        sData(updatedData);
        sIsAscending(!isAscending); // Đảo ngược trạng thái sắp xếp
    };

    return (
        <>
            <Head>
                <title>{"Kế hoạch sản xuất"}</title>
            </Head>
            <div className="relative  3xl:pt-[88px] xxl:pt-[80px] 2xl:pt-[78px] xl:pt-[75px] lg:pt-[70px] pt-70 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? <div className="p-4"></div> : <Header {...propss} />}
                <FilterHeader {...propss} />
                <BodyGantt
                    {...propss}
                    handleShowSub={handleShowSub}
                    handleSort={handleSort}
                    data={data}
                    timeLine={timeLine}
                    isAscending={isAscending}
                />
            </div>
        </>
    );
};
export default Index;
