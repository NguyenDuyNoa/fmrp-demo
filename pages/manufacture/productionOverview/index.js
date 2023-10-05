import Head from "next/head";
import Header from "./(header)/header";
import { useSelector } from "react-redux";
import Main from "./(main)/main";
import { useState } from "react";
import Image from "next/image";
import Zoom from "components/UI/zoomElement/zoomElement";
import { v4 as uuid } from "uuid";
import Loading from "components/UI/loading";
import Step from "./(modalDetail)/steps";
import ModalDetail from "./(modalDetail)/modalDetail";
const Index = (props) => {
    const dataLang = props.dataLang;
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);
    const [isShow, sIsshow] = useState({
        showHidden: false,
        showHistory: 1,
    });
    const [fetch, sFetch] = useState({
        fetchHistory: false,
    });
    const [data, sData] = useState({
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
    });
    const [checkId, sCheckId] = useState({
        idParent: null,
        idChild: null,
    });

    const handleIsShow = (e) => {
        sIsshow((a) => ({ ...a, showHistory: e }));
        isShow.showHistory != e && sFetch((e) => ({ ...e, fetchHistory: true }));
        setTimeout(() => {
            sFetch((e) => ({ ...e, fetchHistory: false }));
        }, 1000);
    };

    const handleIsShowModel = (idParent, idChild) => {
        sIsshow((a) => ({ ...a, showHidden: !isShow.showHidden }));
        sCheckId((e) => {
            return {
                ...e,
                idParent: idParent,
                idChild: idChild,
            };
        });
    };
    console.log(checkId);

    const propsDetail = {
        data,
        isShow,
        fetch,
        handleIsShow,
        handleIsShowModel,
    };

    return (
        <>
            <Head>
                <title>{dataLang?.productsWarehouse_title || "productsWarehouse_title"}</title>
            </Head>
            <div className="relative 3xl:pt-[88px] xxl:pt-[80px] 2xl:pt-[78px] xl:pt-[75px] lg:pt-[70px] pt-70 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? <div className="p-4"></div> : <Header />}
                <Main {...propsDetail} />
                <ModalDetail {...propsDetail} />
            </div>
        </>
    );
};

export default Index;
