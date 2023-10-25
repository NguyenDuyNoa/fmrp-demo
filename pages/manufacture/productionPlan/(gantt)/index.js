import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import Loading from "components/UI/loading";
import Popup from "reactjs-popup";
import { Tooltip } from "react-tippy";
const BodyGantt = (props) => {
    const header = [
        { id: uuid(), name: "Đơn hàng" },
        { id: uuid(), name: "Trạng thái" },
        { id: uuid(), name: "Số lượng" },
        { id: uuid(), name: "Action" },
    ];
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

    const arrMonth = [...Array(12)].map((_, index) => ({ id: index + 1, active: false }));
    const listOrder = [
        {
            id: uuid(),
            nameOrder: "PO-223428",
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
            nameOrder: "PO-223428",
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
            nameOrder: "PO-223428",
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
            nameOrder: "PO-223428",
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
            nameOrder: "PO-223428",
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
            nameOrder: "PO-223428",
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

    const updatedListOrder = listOrder.map((order) => {
        const updatedListProducts = order.listProducts.map((product) => {
            const newArr = [...Array(12)].map((_, index) => {
                const crrItem = product.processArr.find((p) => p.month === index + 1);
                if (crrItem) {
                    return crrItem;
                }
                return { month: index + 1 };
            });

            const newArr2 = newArr.map((i) => {
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
                processArr: newArr2,
            };
        });

        const processDefault = [...Array(12)].map((_, index) => {
            const crrItem = order.processDefault.find((p) => p.month === index + 1);
            if (crrItem) {
                return crrItem;
            }

            return { month: index + 1 };
        });

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
    const [isLoading, sIsLoading] = useState(false);
    const handleShowSub = (index) => {
        const updatedData = [...data];
        updatedData.forEach((order, i) => {
            if (i === index) {
                order.show = !order.show;
            }
        });
        sData(updatedData);
        sIsLoading(true);
        setTimeout(() => {
            sIsLoading(false);
        }, 1000);
    };

    const container1Ref = useRef();
    const container2Ref = useRef();

    const handleScroll = (e) => {
        const container1Element = container1Ref.current;
        const container2Element = container2Ref.current;

        container2Element.scrollLeft = container1Element.scrollLeft;
    };

    return (
        <div className="flex flex-col ">
            <div className="flex items-end  border-t overflow-hidden" ref={container2Ref}>
                <div className={`${isLoading && "border-b"} min-w-[35%]   w-[35%]`}>
                    <div className="flex items-center  gap-2  px-1 ">
                        <div className="flex-col flex gap-1 cursor-pointer w-[2%]">
                            <Image
                                alt=""
                                width={7}
                                height={4}
                                src={"/productionPlan/Shapedrop.png"}
                                className="object-cover hover:scale-110 transition-all ease-linear"
                            />
                            <Image
                                alt=""
                                width={7}
                                height={4}
                                src={"/productionPlan/Shapedow.png"}
                                className="object-cover hover:scale-110 transition-all ease-linear"
                            />
                        </div>
                        <div className="grid grid-cols-12 w-full">
                            {header.map((e) => (
                                <div
                                    key={e.id}
                                    className="text-[#52575E] font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-3"
                                >
                                    {e.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={`${isLoading && "border-b"} flex  gap-4 divide-x border-l `}>
                    {timeLine.map((e) => (
                        <div key={e.id} className="">
                            <div className="text-[#202236] font-semibold text-sm px-1">{e.title}</div>
                            <div className="flex items-end gap-2 divide-x">
                                {e.days.map((i, iIndex) => {
                                    const parts = i.day.split(" ");
                                    return (
                                        <div key={i.id} className="flex items-center gap-2 w-[70.5px]">
                                            <h1 className="text-[#667085] font-light 3xl:text-base text-sm py-0.5 3xl:px-1.5 px-3">
                                                {parts[0]}
                                            </h1>
                                            {iIndex == e.days.length - 1 ? (
                                                <h1
                                                    className={`bg-[#5599EC] my-0.5  px-1 py-0.5 rounded-full text-white font-semibold 3xl:text-base text-sm`}
                                                >
                                                    {parts[1]}
                                                </h1>
                                            ) : (
                                                <h1
                                                    className={`text-[#202236] rounded-full py-0.5 font-semibold 3xl:text-base text-sm `}
                                                >
                                                    {parts[1]}
                                                </h1>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isLoading ? (
                <Loading className="h-80" color="#0f4f9e" />
            ) : (
                <div
                    ref={container1Ref}
                    onScroll={handleScroll}
                    className="flex-col overflow-auto border-t scrollbar-thin  scrollbar-thumb-slate-300 scrollbar-track-slate-100 
                     3xl:h-[66.3vh] xxl:h-[52.5vh] 2xl:h-[58.3vh] xl:h-[54vh] lg:h-[51.3vh] h-[55vh]"
                >
                    {data.map((e, eIndex) => (
                        <React.Fragment>
                            <div className={`flex items-center divide-x  w-full  `}>
                                <div className="min-w-[35%] w-[35%] border-b ">
                                    <div className="pr-1">
                                        <div
                                            onClick={() => handleShowSub(eIndex)}
                                            type="button"
                                            key={e.id}
                                            className="flex w-full  cursor-pointer items-center gap-2  bg-[#F3F4F6] rounded py-2 px-1 my-2"
                                        >
                                            <Image
                                                alt=""
                                                width={7}
                                                height={4}
                                                src={"/productionPlan/Shapedow.png"}
                                                className={`${
                                                    e.show ? "rotate-0 t" : "-rotate-90 "
                                                } object-cover duration-500  transition-all ease-in-out`}
                                            />
                                            <div className="grid grid-cols-12 w-full items-center gap-4">
                                                <h2 className="text-[#52575E] 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] font-semibold col-span-3">
                                                    {e.nameOrder}
                                                </h2>
                                                <div className="flex items-center gap-1 col-span-3">
                                                    <h2
                                                        className={`${
                                                            (e.status == "outDate" && "text-[#EE1E1E]") ||
                                                            (e.status == "processing" && "text-[#3276FA]") ||
                                                            (e.status == "sussces" && "text-[#0BAA2E]")
                                                        }  3xl:text-[13px] whitespace-nowrap  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] font-medium`}
                                                    >
                                                        {(e.status == "outDate" && "Đã quá hạn") ||
                                                            (e.status == "processing" && "Đang thực hiện") ||
                                                            (e.status == "sussces" && "Hoàn thành")}
                                                    </h2>
                                                    <h3
                                                        className={`${
                                                            (e.status == "outDate" &&
                                                                "text-[#EE1E1E] border-[#EE1E1E] bg-[#FFEEF0]") ||
                                                            (e.status == "processing" &&
                                                                "text-[#3276FA] border-[#3276FA] bg-[#EBF5FF]") ||
                                                            (e.status == "sussces" &&
                                                                "text-[#0BAA2E] border-[#0BAA2E] bg-[#EBFEF2]")
                                                        } 3xl:text-xs  xxl:text-[9px] 2xl:text-[10px] xl:text-[10px] lg:text-[9px] text-[13px] font-normal  py-0.5 px-2 rounded-lg border`}
                                                    >
                                                        {e.process}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b ">
                                    <div className="py-[15px]">
                                        <div className="flex items-center">
                                            {e.processDefault.map((ce, ceIndex) => {
                                                return ce.days.map((ci, ciIndex) => {
                                                    return (
                                                        <div key={ci.id} className={`w-[80px] flex items-center`}>
                                                            <div
                                                                className={`${
                                                                    ci.active ? "bg-[#D0D5DD]" : ""
                                                                } py-1 w-[80px] `}
                                                            ></div>
                                                        </div>
                                                    );
                                                });
                                            })}
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <p className="text-[#11315B]  3xl:text-xs  xxl:text-[9px] 2xl:text-[10px] xl:text-[10px] lg:text-[9px] text-[13px] font-normal">
                                                {e.nameOrder}
                                            </p>
                                            {e.status == "sussces" && (
                                                <div className="w-[18px] h-[18px]">
                                                    <Image
                                                        src={"/productionPlan/tick-circle.png"}
                                                        width={36}
                                                        height={36}
                                                        alt=""
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {e.show &&
                                e.listProducts.map((i, iIndex) => (
                                    <div className={`flex items-center w-full divide-x`}>
                                        <div className="cursor-pointer  px-0.5 w-[35%] py-2 border-b hover:bg-[#BCD0EF]/30 transition-all duration-150 ease-linear">
                                            <div className="grid grid-cols-12 items-center">
                                                <div className="flex items-center 3xl:gap-2 gap-1 col-span-3">
                                                    <input type="radio" className="" />
                                                    <Image
                                                        src={i.images}
                                                        width={36}
                                                        height={36}
                                                        alt=""
                                                        className="object-cover rounded-md"
                                                    />
                                                    <div className="flex flex-col">
                                                        <h1 className="text-[#000000] font-semibold 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px]">
                                                            {i.name}
                                                        </h1>
                                                        <h1 className="text-[#9295A4] font-normal 3xl:text-[10px] xxl:text-[8px] 2xl:text-[9px] xl:text-[8px] lg:text-[7px]">
                                                            {i.desription}
                                                        </h1>
                                                    </div>
                                                </div>
                                                <h3
                                                    className={`${
                                                        (i.status == "outDate" && "text-[#EE1E1E]") ||
                                                        (i.status == "sussces" && "text-[#0BAA2E]") ||
                                                        (i.status == "unfulfilled" && "text-[#FF8F0D]")
                                                    } font-medium 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-3  px-4`}
                                                >
                                                    {i.status == "outDate" && "Đã quá hạn"}
                                                    {i.status == "sussces" && "Hoàn thành"}
                                                    {i.status == "unfulfilled" && "Chưa thực hiện"}
                                                </h3>
                                                <h3 className="text-[#52575E] font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-3">
                                                    {i.quantity}
                                                </h3>
                                                <h3 className="text-[#667085] border-b w-fit font-medium 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-3 ">
                                                    {i.actions}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="flex  w-[65%] ">
                                            {i.processArr.map((ce, ceIndex) => {
                                                return ce.days.map((ci, ciIndex) => {
                                                    return (
                                                        <div
                                                            key={ci.id}
                                                            className={`w-[80px] flex items-center border-b `}
                                                        >
                                                            <Popup
                                                                className="popover-productionPlan"
                                                                arrow={true}
                                                                arrowStyle={{
                                                                    color:
                                                                        (ci.active && !ci.outDate && "#fecaca") ||
                                                                        (ci.active && ci.outDate && "#bae6fd"),
                                                                }}
                                                                trigger={
                                                                    <div
                                                                        className={`${
                                                                            ci.active && ci.outDate
                                                                                ? "bg-[#5599EC] hover:bg-sky-200"
                                                                                : ""
                                                                        } py-2.5 px-1.5  w-[80px] relative my-4 transition-all duration-200 ease-in-out `}
                                                                    >
                                                                        <div
                                                                            className={`${
                                                                                ci.active && !ci.outDate
                                                                                    ? "bg-[#EE1E1E] hover:bg-red-200"
                                                                                    : ""
                                                                            } 
                                                                            py-2.5 px-1.5  w-[80px] absolute top-0 left-0 transition-all duration-200 ease-in-out  `}
                                                                        ></div>
                                                                    </div>
                                                                }
                                                                position="top center"
                                                                on={["hover", "focus"]}
                                                            >
                                                                <div
                                                                    className={`flex flex-col ${
                                                                        (ci.active && !ci.outDate && "bg-red-200") ||
                                                                        (ci.active && ci.outDate && "bg-sky-200")
                                                                    } px-2.5 py-0.5 font-medium text-sm rounded-sm capitalize`}
                                                                >
                                                                    {ci.type}
                                                                </div>
                                                            </Popup>
                                                        </div>
                                                    );
                                                });
                                            })}
                                        </div>
                                    </div>
                                ))}
                        </React.Fragment>
                    ))}
                </div>
            )}
            <div className="w-full border-b flex flex-col">
                <div className="border-b">
                    <button type="button" className="flex items-center gap-2 my-2">
                        <Image src={"/productionPlan/Vector.png"} width={10} height={10} className="object-cover" />
                        <h1 className="text-[#52575E] font-normal text-sm"> Thêm sản phẩm</h1>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default BodyGantt;
