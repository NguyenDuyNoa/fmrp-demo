import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import { useChangeValue } from "@/hooks/useChangeValue";
import useStatusExprired from "@/hooks/useStatusExprired";

import PopupConfim from "@/components/UI/popupConfim/popupConfim";

import { FnlocalStorage } from "@/utils/helpers/localStorage";

import { routerPproductionPlan } from "@/routers/manufacture";

import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";

const InFo = dynamic(() => import("./(form)/info"), { ssr: false });
const Table = dynamic(() => import("./(form)/table"), { ssr: false });
const Header = dynamic(() => import("./(form)/header"), { ssr: false });

const FormAdd = (props) => {
    const router = useRouter();

    const dataLang = props.dataLang;

    const showToat = useToast();

    const [data, sData] = useState([]);

    const trangthaiExprired = useStatusExprired();

    const { getItem, setItem } = FnlocalStorage();

    const [isLoading, sIsLoading] = useState(false);

    const [isCheckRemove, sIsCheckRemove] = useState(false);

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const getLocalStorageTab = () => getItem("tab");

    const getLocalStorage = () => (getItem("arrData") ? JSON.parse(getItem("arrData")) : []);

    const tab = getLocalStorageTab();

    let dataLocals = getLocalStorage();
    const initialValue = {
        idBrach: null,
        date: new Date(),
        internalPlan: tab == "plan",
        order: tab == "order",
        idOrder: null,
        startDate: null,
        endDate: null,
        auto: false,
    };

    const { isValue, onChangeValue } = useChangeValue(initialValue);

    /// Check điều kiện và lọc listProducts có check == true
    useEffect(() => {
        checkLoading();
        if (dataLocals?.length < 1) {
            backPage();
        } else {
            const filteredItems = dataLocals
                ?.map((item) => {
                    return {
                        ...item,
                        listProducts: item.listProducts.filter((product) => product.checked === true),
                    };
                })
                .filter((item) => item.listProducts?.length > 0);
            sData(filteredItems);
        }
    }, []);

    ///Xóa từng button dấu X
    const handleRemoveBtn = (id) => {
        handleQueryId({ status: true, initialKey: { id } });
    };

    ///Xóa từng item ở table
    const handleRemoveItem = (idParen, id) => {
        handleQueryId({ status: true, initialKey: { idParen, id } });
    };

    const handleConfim = () => {
        if (isKeyState?.idParen && isKeyState?.id) {
            const newData = data
                .map((e) => {
                    if (e.id == isKeyState?.idParen) {
                        return { ...e, listProducts: e.listProducts.filter((i) => i.id != isKeyState?.id) };
                    }
                    return e;
                })
                .flat()
                .filter((i) => i.listProducts?.length > 0);
            getFreshData(newData);
        } else {
            getFreshData(data.filter((e) => e.id != isKeyState?.id));
        }

        handleQueryId({ status: false });
    };

    const backPage = () => {
        showToat(
            "error",
            tab == "plan" ? "Không có KHNB. Vui lòng thêm đơn hàng !" : "Không có đơn hàng. Vui lòng thêm đơn hàng !",
            3000
        );

        setTimeout(() => {
            router.push(routerPproductionPlan.home);
        }, 3100);
    };

    const getFreshData = (data) => {
        setItem("arrData", JSON.stringify(data));

        sData(data);

        sIsCheckRemove(true);

        showToat("success", tab == "plan" ? "Xóa KHNB thành công" : "Xóa đơn hàng thành công");
    };

    const checkLoading = () => {
        sIsLoading(true);

        setTimeout(() => {
            sIsLoading(false);
        }, 1000);
    };

    ///Khi data thay đổi nếu < 1 thì trở về trang trước
    useEffect(() => {
        dataLocals?.length < 1 && backPage();
    }, [data]);

    ///Khi xóa xong thì cget lại local
    useEffect(() => {
        isCheckRemove && sData(getLocalStorage());
    }, [isCheckRemove]);

    const handleChange = () => {};

    const shareProps = { data, isLoading, handleRemoveBtn, handleRemoveItem, isValue, onChangeValue, tab };

    return (
        <>
            <Head>
                <title>{"Thêm kế hoạch nguyên vật liệu"}</title>
            </Head>
            <div className="relative  3xl:pt-[88px] xxl:pt-[80px] 2xl:pt-[78px] xl:pt-[75px] lg:pt-[70px] pt-70 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? <div className="p-4"></div> : <Header />}
                <InFo {...shareProps} />
                <Table {...shareProps} />
            </div>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE}
                subtitle={CONFIRM_DELETION}
                isOpen={isOpen}
                save={handleConfim}
                cancel={() => handleQueryId({ status: false })}
            />
        </>
    );
};
export default React.memo(FormAdd);
