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
import Zoom from "@/components/UI/zoomElement/zoomElement";
import moment from "moment/moment";

const InFo = dynamic(() => import("./(form)/info"), { ssr: false });
const Table = dynamic(() => import("./(form)/table"), { ssr: false });
import { _ServerInstance as Axios } from "/services/axios";
import { formatMoment } from "@/utils/helpers/formatMoment";
const FormAdd = (props) => {
    const router = useRouter();

    const dataLang = props.dataLang;

    const showToat = useToast();

    const { isMoment } = formatMoment();

    const initialData = {
        dataProduction: [],
        dataBrand: [],
    };

    const [data, sData] = useState(initialData);

    const queryData = (key) => sData((prve) => ({ ...prve, ...key }));

    const trangthaiExprired = useStatusExprired();

    const { getItem, setItem } = FnlocalStorage();

    const [isLoading, sIsLoading] = useState(false);

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
        tab: tab,
        idOrder: null,
        dateRange: {
            startDate: null,
            endDate: null,
        },
        // auto: false,
    };

    const { isValue, onChangeValue } = useChangeValue(initialValue);

    useEffect(() => {
        checkLoading();
        fetcDataBranch();
        if (dataLocals?.length < 1) {
            backPage();
            return;
        }
        handleSendItem();
    }, []);



    const fetcDataBranch = () => {
        Axios("GET", `/api_web/Api_Branch/branchCombobox/?csrf_protection=true `, {}, (err, response) => {
            if (!err) {
                const { isSuccess, result } = response?.data;
                if (isSuccess) {
                    queryData({ dataBrand: result?.map((e) => ({ value: e?.id, label: e?.name })) });
                }
            }
        });
    };

    const handleSendItem = () => {
        let form = new FormData();
        dataLocals.forEach((e) => {
            form.append(tab == "plan" ? "dataBusinessitemId[]" : "dataOrderItemId[]", e?.id);
        });

        Axios(
            "POST",
            `/api_web/api_manufactures/getDataHandlingManufacture?csrf_protection=true`,
            {
                data: form,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    const { data, isSuccess } = response.data;
                    data.items?.length < 1 && backPage();
                    queryData({
                        dataProduction: data?.items.map((e) => {
                            return {
                                ...e,
                                bom: e?.is_bom,
                                stage: e?.is_stage,
                                idParent: e?.order_id,
                                unitName: e?.unit_name,
                                nameOrder: e?.reference_no,
                                quantityRemaining: +e?.quantity_rest,
                                quantityWarehouse: +e?.quantity_warehouse,
                                productVariation: e?.product_variation,
                                date: { startDate: null, endDate: null },
                                deliveryDate: isMoment(e?.delivery_date, "DD/MM/YYYY"),
                            };
                        }),
                    });
                }
            }
        );
    };

    ///Xóa từng button dấu X
    const handleRemoveBtn = (idParent) => {
        const initialKey = idParent !== "deleteAll" ? { idParent } : { all: true };
        handleQueryId({ status: true, initialKey });
    };

    ///Xóa từng item ở table
    const handleRemoveItem = (id) => {
        handleQueryId({ status: true, initialKey: { id } });
    };

    const handleConfim = () => {
        const { id, idParent, all } = isKeyState || {};
        if (all) {
            getFreshData([]);
        }
        if (id) {
            getFreshData(data.dataProduction.filter((e) => e.id != id));
        }
        if (idParent) {
            getFreshData(data.dataProduction.filter((e) => e.idParent != idParent));
        }

        handleQueryId({ status: false });
    };

    const backPage = () => {
        showToat(
            "error",
            tab == "plan" ? "Không có KHNB. Vui lòng thêm KHNB !" : "Không có đơn hàng. Vui lòng thêm đơn hàng !",
            3000
        );

        setTimeout(() => {
            router.push(routerPproductionPlan.home);
        }, 3100);
    };

    const getFreshData = (data) => {
        setItem("arrData", JSON.stringify(data));

        queryData({ dataProduction: data });

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

    }, [data.dataProduction]);

    const handChangeTable = (idParent, id, value, type) => {
        const newData = data.dataProduction.map((e) => {
            if (e.idParent == idParent && e.id == id) {
                return { ...e, [type]: value };
            }
            return e;
        });

        queryData({ dataProduction: newData });

        setItem("arrData", JSON.stringify(newData));
    };

    const handSavePlan = async () => {
        const { hasMissingBom, hasMissingStage, hasMissingQuantityDate } = data.dataProduction.reduce(
            (acc, item) => {
                if (!item.bom == "1") {
                    acc.hasMissingBom = true;
                }
                if (!item.stage == "1") {
                    acc.hasMissingStage = true;
                }
                if (!item.quantityRemaining || (!item.date.startDate && !item.date.endDate)) {
                    acc.hasMissingQuantityDate = true;
                }
                return acc;
            },
            { hasMissingBom: false, hasMissingStage: false, hasMissingQuantityDate: false }
        );



        if (
            hasMissingQuantityDate ||
            !isValue.idBrach ||
            !isValue.date ||
            (!isValue.dateRange.startDate && !isValue.dateRange.endDate)
        ) {
            showToat("error", "Vui lòng kiểm tra dữ liệu");
            return;
        }

        if (hasMissingBom) {
            showToat("error", `Vui lòng thêm định mức BOM`);
            return;
        }
        if (hasMissingStage) {
            showToat("error", `Vui lòng thêm công đoạn`);
            return;
        }

        let formData = new FormData();
        formData.append("reference_no", "")
        formData.append("date", isValue.date ? isMoment(isValue.date, "DD/MM/YYYY") : "")
        formData.append("branch_id", isValue.idBrach?.value ? isValue.idBrach?.value : "")
        formData.append("option_id", tab == "plan" ? 2 : 1)
        formData.append("timeline", `${isMoment(isValue?.dateRange?.startDate, "DD/MM/YYYY")}-${isMoment(isValue?.dateRange?.endDate, "DD/MM/YYYY")}`)
        data.dataProduction.forEach((e, index) => {
            formData.append(`items[${index}][quantity]`, e?.quantityRemaining ? e?.quantityRemaining : "")

            formData.append(`items[${index}][timeline]`, e?.date ? `${isMoment(e?.date.startDate, "DD/MM/YYYY")}-${isMoment(e?.date.endDate, "DD/MM/YYYY")}` : "")

            formData.append(`items[${index}][delivery_date]`, e?.deliveryDate ? e?.deliveryDate : "")

            formData.append(`items[${index}][item_variation_id]`, e?.item_variation_id ? e?.item_variation_id : "")

            formData.append(`items[${index}][item_id]`, e?.item_id ? e?.item_id : "")

            formData.append(`items[${index}][object_type]`, e?.object_type ? e?.object_type : "")

            formData.append(`items[${index}][object_id]`, e?.objec_id ? e?.objec_id : "")

            formData.append(`items[${index}][object_item_id]`, e?.object_item_id ? e?.object_item_id : "")
        })
        await Axios(
            "POST",
            `/api_web/api_manufactures/handlingProductionPlans?csrf_protection=true`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;
                    if (isSuccess == 1) {
                        showToat("success", message);
                        router.push(routerPproductionPlan.home)
                    } else {
                        showToat("error", message);
                    }

                }
            }
        );

        // showToat("success", "Thêm kế hoạch NVL thành công");
    };

    const shareProps = {
        data,
        isLoading,
        handleRemoveBtn,
        handleRemoveItem,
        isValue,
        onChangeValue,
        tab,
        handChangeTable,
    };

    return (
        <>
            <Head>
                <title>{"Thêm kế hoạch nguyên vật liệu"}</title>
            </Head>
            <div className="relative  3xl:pt-[88px] xxl:pt-[80px] 2xl:pt-[78px] xl:pt-[75px] lg:pt-[70px] pt-70 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-4"></div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <div className={` flex space-x-3  xl:text-[14.5px] text-[12px]`}>
                                <h6 className="text-[#141522]/40">{"Sản xuất"}</h6>
                                <span className="text-[#141522]/40">/</span>
                                <h6 className="text-[#141522]/40">{"Kế hoạch nguyên vật liệu"}</h6>
                                <span className="text-[#141522]/40">/</span>
                                <h6>{"Thêm kế hoạch NVL"}</h6>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-medium text-[#11315B] capitalize">
                                Thêm kế hoạch nguyên vật liệu
                            </h1>
                            <div className="flex items-center gap-4">
                                <div>
                                    <Zoom>
                                        <button
                                            type="button"
                                            className="bg-white border-[#D0D5DD] border rounded-md hover:scale-105 transition-all duration-200 ease-linear 3xl:py-2 xxl:py-2 2xl:py-2 xl:py-1 lg:py-1 py-3  px-4 "
                                        >
                                            Lưu nháp
                                        </button>
                                    </Zoom>
                                </div>
                                <div>
                                    <Zoom>
                                        <button
                                            onClick={() => handSavePlan()}
                                            type="button"
                                            className="bg-[#0F4F9E] text-white  rounded-md hover:scale-105 transition-all duration-200 ease-linear 3xl:py-2 xxl:py-2 2xl:py-2 xl:py-1 lg:py-1 py-3  px-4 "
                                        >
                                            Lưu lại
                                        </button>
                                    </Zoom>
                                </div>
                            </div>
                        </div>
                    </>
                )}
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
