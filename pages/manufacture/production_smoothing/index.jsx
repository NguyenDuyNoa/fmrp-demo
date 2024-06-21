import Head from "next/head";
import { useSelector } from "react-redux";
import Header from "./components/header/header";
import FilterHeader from "./components/header/filterHeader";
import MainTable from "./components/table/mainTable";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import useStatusExprired from "@/hooks/useStatusExprired";
import { Container } from "@/components/UI/common/layout";
import { EmptyExprired } from "@/components/UI/common/emptyExprired";
const Index = (props) => {
    const dataLang = props.dataLang;
    const statusExprired = useStatusExprired();
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
                                    { id: uuid(), name: "Khanh VN f" },
                                    { id: uuid(), name: "Khanh VN f1" },
                                ],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Quynh VN g" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Quynh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Hanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Hanh VN b" }] },
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
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [{ id: uuid(), name: "Thanh VN f" }],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN c" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Khanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Tung VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Manh VN b" }] },
                            { id: uuid(), type: "d", db: [{ id: uuid(), name: "Thanh VN d" }] },
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
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [{ id: uuid(), name: "Thanh VN f" }],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN c" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Thanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Thanh VN b" }] },
                            { id: uuid(), type: "d", db: [{ id: uuid(), name: "Thanh VN d" }] },
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
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [{ id: uuid(), name: "Thanh VN f" }],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN c" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Thanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Thanh VN b" }] },
                            { id: uuid(), type: "d", db: [{ id: uuid(), name: "Thanh VN d" }] },
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
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912732",
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
                customer: "Công ty may",
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
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [
                                    { id: uuid(), name: "Thanh VN f" },
                                    { id: uuid(), name: "Thanh VN f" },
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
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [
                                    { id: uuid(), name: "Thanh VN f" },
                                    { id: uuid(), name: "Thanh VN f" },
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
                            rank: "T4",
                            days: "28",
                        },
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [
                                    { id: uuid(), name: "Thanh VN f" },
                                    { id: uuid(), name: "Thanh VN f" },
                                ],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Thanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Thanh VN b" }] },
                            { id: uuid(), type: "i", db: [{ id: uuid(), name: "Huy VN i" }] },
                        ],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T5",
                            days: "27",
                        },
                        dataChild: [
                            {
                                id: uuid(),
                                type: "a",
                                db: [
                                    { id: uuid(), name: "Thanh VN a" },
                                    { id: uuid(), name: "Thanh VN a" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "b",
                                db: [
                                    { id: uuid(), name: "Thanh VN b" },
                                    { id: uuid(), name: "Thanh VN b" },
                                ],
                            },
                            { id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN c" }] },
                            { id: uuid(), type: "d", db: [{ id: uuid(), name: "Thanh VN d" }] },
                            { id: uuid(), type: "e", db: [{ id: uuid(), name: "Thanh VN e" }] },
                            { id: uuid(), type: "f", db: [{ id: uuid(), name: "Thanh VN f" }] },
                            { id: uuid(), type: "i", db: [{ id: uuid(), name: "Huy VN i" }] },
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
                                    { id: uuid(), name: "Khanh VN f" },
                                    { id: uuid(), name: "Khanh VN f1" },
                                ],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Quynh VN g" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Quynh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Hanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Hanh VN b" }] },
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
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [{ id: uuid(), name: "Thanh VN f" }],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN c" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Khanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Tung VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Manh VN b" }] },
                            { id: uuid(), type: "d", db: [{ id: uuid(), name: "Thanh VN d" }] },
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
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [{ id: uuid(), name: "Thanh VN f" }],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN c" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Thanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Thanh VN b" }] },
                            { id: uuid(), type: "d", db: [{ id: uuid(), name: "Thanh VN d" }] },
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
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [{ id: uuid(), name: "Thanh VN f" }],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN c" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Thanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Thanh VN b" }] },
                            { id: uuid(), type: "d", db: [{ id: uuid(), name: "Thanh VN d" }] },
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
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912732",
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
                customer: "Công ty may",
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
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [
                                    { id: uuid(), name: "Thanh VN f" },
                                    { id: uuid(), name: "Thanh VN f" },
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
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [
                                    { id: uuid(), name: "Thanh VN f" },
                                    { id: uuid(), name: "Thanh VN f" },
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
                            rank: "T4",
                            days: "28",
                        },
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [
                                    { id: uuid(), name: "Thanh VN f" },
                                    { id: uuid(), name: "Thanh VN f" },
                                ],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Thanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Thanh VN b" }] },
                            { id: uuid(), type: "i", db: [{ id: uuid(), name: "Huy VN i" }] },
                        ],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T5",
                            days: "27",
                        },
                        dataChild: [
                            {
                                id: uuid(),
                                type: "a",
                                db: [
                                    { id: uuid(), name: "Thanh VN a" },
                                    { id: uuid(), name: "Thanh VN a" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "b",
                                db: [
                                    { id: uuid(), name: "Thanh VN b" },
                                    { id: uuid(), name: "Thanh VN b" },
                                ],
                            },
                            { id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN c" }] },
                            { id: uuid(), type: "d", db: [{ id: uuid(), name: "Thanh VN d" }] },
                            { id: uuid(), type: "e", db: [{ id: uuid(), name: "Thanh VN e" }] },
                            { id: uuid(), type: "f", db: [{ id: uuid(), name: "Thanh VN f" }] },
                            { id: uuid(), type: "i", db: [{ id: uuid(), name: "Huy VN i" }] },
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
                                    { id: uuid(), name: "Khanh VN f" },
                                    { id: uuid(), name: "Khanh VN f1" },
                                ],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Quynh VN g" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Quynh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Hanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Hanh VN b" }] },
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
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [{ id: uuid(), name: "Thanh VN f" }],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN c" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Khanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Tung VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Manh VN b" }] },
                            { id: uuid(), type: "d", db: [{ id: uuid(), name: "Thanh VN d" }] },
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
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [{ id: uuid(), name: "Thanh VN f" }],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN c" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Thanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Thanh VN b" }] },
                            { id: uuid(), type: "d", db: [{ id: uuid(), name: "Thanh VN d" }] },
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
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [{ id: uuid(), name: "Thanh VN f" }],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN c" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Thanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Thanh VN b" }] },
                            { id: uuid(), type: "d", db: [{ id: uuid(), name: "Thanh VN d" }] },
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
                ],
            },
            {
                id: uuid(),
                name: "LSXCT-112912732",
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
                customer: "Công ty may",
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
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [
                                    { id: uuid(), name: "Thanh VN f" },
                                    { id: uuid(), name: "Thanh VN f" },
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
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [
                                    { id: uuid(), name: "Thanh VN f" },
                                    { id: uuid(), name: "Thanh VN f" },
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
                            rank: "T4",
                            days: "28",
                        },
                        dataChild: [
                            {
                                id: uuid(),
                                type: "e",
                                db: [
                                    { id: uuid(), name: "Thanh VN e" },
                                    { id: uuid(), name: "Thanh VN e" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "f",
                                db: [
                                    { id: uuid(), name: "Thanh VN f" },
                                    { id: uuid(), name: "Thanh VN f" },
                                ],
                            },
                            { id: uuid(), type: "g", db: [{ id: uuid(), name: "Thanh VN g" }] },
                            { id: uuid(), type: "h", db: [{ id: uuid(), name: "Thanh VN h" }] },
                            { id: uuid(), type: "a", db: [{ id: uuid(), name: "Thanh VN a" }] },
                            { id: uuid(), type: "b", db: [{ id: uuid(), name: "Thanh VN b" }] },
                            { id: uuid(), type: "i", db: [{ id: uuid(), name: "Huy VN i" }] },
                        ],
                    },
                    {
                        date: {
                            month: "Tháng 10",
                            rank: "T5",
                            days: "27",
                        },
                        dataChild: [
                            {
                                id: uuid(),
                                type: "a",
                                db: [
                                    { id: uuid(), name: "Thanh VN a" },
                                    { id: uuid(), name: "Thanh VN a" },
                                ],
                            },
                            {
                                id: uuid(),
                                type: "b",
                                db: [
                                    { id: uuid(), name: "Thanh VN b" },
                                    { id: uuid(), name: "Thanh VN b" },
                                ],
                            },
                            { id: uuid(), type: "c", db: [{ id: uuid(), name: "Thanh VN c" }] },
                            { id: uuid(), type: "d", db: [{ id: uuid(), name: "Thanh VN d" }] },
                            { id: uuid(), type: "e", db: [{ id: uuid(), name: "Thanh VN e" }] },
                            { id: uuid(), type: "f", db: [{ id: uuid(), name: "Thanh VN f" }] },
                            { id: uuid(), type: "i", db: [{ id: uuid(), name: "Huy VN i" }] },
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

    const getRandomColors = () => {
        const colors = [
            ["#38bdf8", "#0ea5e9"],
            ["#38bdf8", "#3b82f6"],
            ["#fb923c", "#ea580c"],
            ["#d8b4fe", "#a855f7"],
            ["#c084fc", "#ec4899"],
            ["#4ade80", "#22c55e"],
            ["#fb7185", "#f43f5e"],
            ["#34d399", "#10b981"],
            ["#facc15", "#eab308"],
            ["#94a3b8", "#64748b"],
            ["#e879f9", "#d946ef"],
        ];

        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };
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
                const newFlattenedDataChild = flattenedDataChild.map((e) => {
                    const newDb = e.db?.map((i) => {
                        const randomColors = getRandomColors();
                        return {
                            ...i,
                            drak: randomColors[1],
                            bland: randomColors[0],
                        };
                    });
                    return { ...e, db: newDb };
                });
                return {
                    ...childItem,
                    dataChild: newFlattenedDataChild,
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

    useEffect(() => {
        // sIdParent(data.data[0].id ? data.data[0].id : null);
        // sIsOpen(data.data[0].id ? true : false);
        sIdParent(idParent ? idParent : data.data[0].id ? data.data[0].id : null);
        sIsOpen(idParent ? true : data.data[0].id ? true : false);
    }, [idParent, isOpen]);
    // }, [data]);

    const handleShowProgress = (id) => {
        if (id != idParent) {
            sIsOpen(!isOpen);
            sIdParent(id);
            sIsLoading(true);
            setTimeout(() => {
                sIsLoading(false);
            }, 1000);
        }
    };

    const initialListStaff = [
        { label: "Huy Trần", value: "1" },
        { label: "Nhân viên 2", value: "2" },
        { label: "Nhân viên 3", value: "3" },
        { label: "Nhân viên 4", value: "4" },
        { label: "Nhân viên 5", value: "5" },
        { label: "Nhân viên 6", value: "6" },
        { label: "Nhân viên 7", value: "7" },
    ];
    const listStaff = initialListStaff.map((e) => {
        const randomColors = getRandomColors();
        return {
            ...e,
            drak: randomColors[1],
            bland: randomColors[0],
        };
    });

    return (
        <>
            <Head>
                <title>{"Điều độ sản xuất"}</title>
            </Head>
            <Container>
                {statusExprired ? <EmptyExprired /> : <Header data={data} listStaff={listStaff}></Header>}
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
            </Container>
        </>
    );
};
export default Index;
