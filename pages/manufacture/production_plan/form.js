import Head from "next/head";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState, useEffect, useMemo } from "react";

import useToast from "@/hooks/useToast";
import { useChangeValue } from "@/hooks/useChangeValue";
import useStatusExprired from "@/hooks/useStatusExprired";

const Table = dynamic(() => import("./(form)/table"), { ssr: false });
const InFo = dynamic(() => import("./(form)/info"), { ssr: false });
const Header = dynamic(() => import("./(form)/header"), { ssr: false });

const FormAdd = (props) => {
    const router = useRouter();

    const dataLang = props.dataLang;

    const showToat = useToast();

    const [data, sData] = useState([]);

    const [isLoading, sIsLoading] = useState(false);

    const [isCheckRemove, sIsCheckRemove] = useState(false);

    const trangthaiExprired = useStatusExprired();

    const getLocalStorage = () => (localStorage.getItem("arrData") ? JSON.parse(localStorage.getItem("arrData")) : []);

    let dataLocals = getLocalStorage();

    const initialValue = {
        idBrach: null,
        date: new Date(),
        internalPlan: false,
        order: false,
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
        Swal.fire({
            title: `Xóa đơn hàng`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#296dc1",
            cancelButtonColor: "#d33",
            confirmButtonText: `${dataLang?.aler_yes}`,
            cancelButtonText: `${dataLang?.aler_cancel}`,
        }).then((result) => {
            if (result.isConfirmed) {
                getFreshData(data.filter((e) => e.id != id));
            }
        });
    };

    ///Xóa từng item ở table
    const handleRemoveItem = useMemo(() => {
        return (idParen, id) => {
            Swal.fire({
                title: `Xóa đơn hàng`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#296dc1",
                cancelButtonColor: "#d33",
                confirmButtonText: `${dataLang?.aler_yes}`,
                cancelButtonText: `${dataLang?.aler_cancel}`,
            }).then((result) => {
                if (result.isConfirmed) {
                    const newData = data
                        .map((e) => {
                            if (e.id == idParen) {
                                return { ...e, listProducts: e.listProducts.filter((i) => i.id != id) };
                            }
                            return e;
                        })
                        .flat()
                        .filter((i) => i.listProducts?.length > 0);
                    getFreshData(newData);
                }
            });
        };
    }, [data]);

    const backPage = () => {
        showToat("error", "Không có đơn hàng. Vui lòng thêm đơn hàng !", 3000);
        setTimeout(() => {
            router.push("/manufacture/production_plan");
        }, 3100);
    };

    const getFreshData = (data) => {
        localStorage.setItem("arrData", JSON.stringify(data));
        sData(data);
        sIsCheckRemove(true);
        showToat("success", "Xóa đơn hàng thành công");
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

    const shareProps = { data, isLoading, handleRemoveBtn, handleRemoveItem, isValue, onChangeValue };
    console.log(isValue);
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
        </>
    );
};
export default React.memo(FormAdd);
