import { Container } from "@/components/UI/common/layout";
import useStatusExprired from "@/hooks/useStatusExprired";
import Head from "next/head";
import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import Header from "./components/header/header";
import ModalDetail from "./components/modal/modalDetail";
import Main from "./components/table/main";


const getRandomColors = () => {
    const colors = [
        ["#f0f9ff", "#e0f2fe", "#0ea5e9"],
        ["#f0f9ff", "#e0f2fe", "#3b82f6"],
        ["#fff7ed", "#ffedd5", "#ea580c"],
        ["#faf5ff", "#f3e8ff", "#a855f7"],
        ["#fdf2f8", "#fce7f3", "#ec4899"],
        ["#f0fdf4", "#dcfce7", "#22c55e"],
        ["#fff1f2", "#ffe4e6", "#f43f5e"],
        ["#ecfdf5", "#d1fae5", "#10b981"],
        ["#fefce8", "#fef9c3", "#eab308"],
        ["#f8fafc", "#f1f5f9", "#64748b"],
        ["#fdf4ff", "#fae8ff", "#d946ef"],
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const initData = {
    dataMain: [
        {
            id: uuid(),
            title: "Cắt",
            color: "#5770F7",
            icon: "/manufacture/presention-chart0.png",
            child: [
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
            ],
        },
        {
            id: uuid(),
            title: "Cắt",
            color: "#5770F7",
            icon: "/manufacture/presention-chart0.png",
            child: [
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
            ],
        },
        {
            id: uuid(),
            title: "Cắt",
            color: "#5770F7",
            icon: "/manufacture/presention-chart0.png",
            child: [
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
                {
                    id: uuid(),
                    bg: "#eff6ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#dbeafe",
                },
            ],
        },
        {
            id: uuid(),
            title: "Thêu",
            color: "#FF641C",
            icon: "/manufacture/presention-chart.png",
            child: [
                {
                    id: uuid(),
                    bg: "#fff7ed",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },

                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#ffedd5",
                },
                {
                    id: uuid(),
                    bg: "#fff7ed",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/no.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "",
                    numberLeft: "",
                    numberTitleRight: "",
                    numberRight: "",
                    manufacture: true,
                    no: "Chưa sản xuất",
                    colorNo: "#FF8F0D",
                    color: "#ffedd5",
                },
                {
                    id: uuid(),
                    bg: "#fff7ed",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },

                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#ffedd5",
                },
            ],
        },
        {
            id: uuid(),
            title: "May",
            color: "#F757CA",
            icon: "/manufacture/presention-chart3.png",
            child: [
                {
                    id: uuid(),
                    bg: "#fdf2f8",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#fce7f3",
                },
                {
                    id: uuid(),
                    bg: "#fdf2f8",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#fce7f3",
                },
                {
                    id: uuid(),
                    bg: "#fdf2f8",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#fce7f3",
                },
            ],
        },
        {
            id: uuid(),
            title: "Bán thành phẩm",
            color: "#14B0FE",
            icon: "/manufacture/presention-chart4.png",
            child: [
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
            ],
        },
        {
            id: uuid(),
            title: "Bán thành phẩm",
            color: "#14B0FE",
            icon: "/manufacture/presention-chart4.png",
            child: [
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
            ],
        },
        {
            id: uuid(),
            title: "Bán thành phẩm",
            color: "#14B0FE",
            icon: "/manufacture/presention-chart4.png",
            child: [
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
            ],
        },
        {
            id: uuid(),
            title: "Bán thành phẩm",
            color: "#14B0FE",
            icon: "/manufacture/presention-chart4.png",
            child: [
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
            ],
        },
        {
            id: uuid(),
            title: "Bán thành phẩm",
            color: "#14B0FE",
            icon: "/manufacture/presention-chart4.png",
            child: [
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
            ],
        },
        {
            id: uuid(),
            title: "Bán thành phẩm",
            color: "#14B0FE",
            icon: "/manufacture/presention-chart4.png",
            child: [
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
                {
                    id: uuid(),
                    bg: "#f0f9ff",
                    order: "Đơn hàng SO-22072301",
                    titeLeft: {
                        top: "Số lệnh SX chi tiết",
                        bottom: "LSXCT-22072301",
                    },
                    titleRight: {
                        top: "Số lượng cần sản xuất",
                        bottom: "12.098",
                    },
                    image: "/manufacture/Image.png",
                    name: "Cổ áo",
                    desription: "COAOTHUN",
                    numberTitleLeft: "Số lượng đạt",
                    numberLeft: "12.000",
                    numberTitleRight: "Số lượng phế",
                    numberRight: "120",
                    manufacture: false,
                    color: "#e0f2fe",
                },
            ],
        },
    ],
    dataHistory: [
        {
            id: uuid(),
            title: "Cổ áo (Cài)",
            icon: "/manufacture/presention-chart0.png",
            desriptions: "COAOTHUN",
            number: "1.200",
        },
        {
            id: uuid(),
            title: "Cổ áo (Cài)",
            icon: "/manufacture/presention-chart0.png",
            desriptions: "COAOTHUN",
            number: "1.200",
        },
        {
            id: uuid(),
            title: "Cổ áo (Cài)",
            icon: "/manufacture/presention-chart0.png",
            desriptions: "COAOTHUN",
            number: "1.200",
        },
        {
            id: uuid(),
            title: "Cổ áo (Cài)",
            icon: "/manufacture/presention-chart0.png",
            desriptions: "COAOTHUN",
            number: "1.200",
        },
        {
            id: uuid(),
            title: "Cổ áo (Cài)",
            icon: "/manufacture/presention-chart0.png",
            desriptions: "COAOTHUN",
            number: "1.200",
        },
        {
            id: uuid(),
            title: "Cổ áo (Cài)",
            icon: "/manufacture/presention-chart0.png",
            desriptions: "COAOTHUN",
            number: "1.200",
        },
    ],
    dataStep: [
        {
            id: uuid(),
            time: "12:15",
            date: new Date(),
            quantitySusce: "12.000",
            quantityFalse: "10",
            name: "Amelia Balley",
            image: "/manufacture/Avatar.png",
            position: "Nhân viên cắt may",
            last: false,
        },
        {
            id: uuid(),
            time: "12:15",
            date: new Date(),
            quantitySusce: "12.000",
            quantityFalse: "10",
            name: "Amelia Balley",
            image: "/manufacture/Avatar.png",
            position: "Nhân viên cắt may",
            last: false,
        },
        {
            id: uuid(),
            time: "12:15",
            date: new Date(),
            quantitySusce: "12.000",
            quantityFalse: "10",
            name: "Amelia Balley",
            image: "/manufacture/Avatar.png",
            position: "Nhân viên cắt may",
            last: false,
        },
        {
            id: uuid(),
            time: "12:15",
            date: new Date(),
            quantitySusce: "12.000",
            quantityFalse: "10",
            name: "Amelia Balley",
            image: "/manufacture/Avatar.png",
            position: "Nhân viên cắt may",
            last: false,
        },
        {
            id: uuid(),
            time: "12:15",
            date: new Date(),
            quantitySusce: "12.000",
            quantityFalse: "10",
            name: "Amelia Balley",
            image: "/manufacture/Avatar.png",
            position: "Nhân viên cắt may",
            last: true,
        },
    ],
}

const ProductionOverview = (props) => {
    const dataLang = props.dataLang;
    const statusExprired = useStatusExprired();
    const [isShow, sIsshow] = useState({
        showHidden: false,
        showHistory: 1,
        showFillter: false,
    });

    const [fetch, sFetch] = useState({ fetchHistory: false, });

    const [data, sData] = useState(initData);

    const [checkId, sCheckId] = useState({ idParent: null, idChild: null, });

    const handleIsShow = (e) => {
        sIsshow((a) => ({ ...a, showHistory: e }));
        isShow.showHistory != e && sFetch((e) => ({ ...e, fetchHistory: true }));
        setTimeout(() => {
            sFetch((e) => ({ ...e, fetchHistory: false }));
        }, 1000);
    };

    const handleIsShowModel = (idParent, idChild) => {
        sIsshow((a) => ({ ...a, showHidden: !isShow.showHidden, showFillter: !isShow.showHidden }));
        sCheckId((e) => {
            return {
                ...e,
                idParent: !isShow.showHidden ? idParent : null,
                idChild: !isShow.showHidden ? idChild : null,
            };
        });
    };

    const handleIsShowFilter = (e) => {
        sIsshow((ce) => ({ ...ce, showFillter: e }));
    };

    const updatedData = data.dataMain.map((item) => {
        const randomColors = useMemo(() => getRandomColors(), []);
        item.color = randomColors[2]; // Màu đậm
        item.bg = randomColors[0]; // Màu nhạt
        item.child.forEach((childItem) => {
            childItem.color = randomColors[1]; // Màu đậm
            childItem.bg = randomColors[0]; // Màu nhạt
        });

        return item;
    });

    const propsDetail = {
        data,
        isShow,
        fetch,
        handleIsShow,
        handleIsShowModel,
        handleIsShowFilter,
        updatedData,
    };

    return (
        <>
            <Head>
                <title>{"Tổng quan sản xuất"}</title>
            </Head>
            <Container className="relative  3xl:pt-[88px] xxl:pt-[80px] 2xl:pt-[78px] xl:pt-[75px] lg:pt-[70px] pt-70 lg:pb-10 overflow-hidden h-screen">
                {statusExprired ? <div className="p-4"></div> : <Header {...propsDetail} />}
                <Main {...propsDetail} />
                <ModalDetail {...propsDetail} />
            </Container>
        </>
    );
};

export default ProductionOverview;
