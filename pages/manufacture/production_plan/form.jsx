import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useChangeValue } from "@/hooks/useChangeValue";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";

import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container, ContainerBody } from "@/components/UI/common/layout";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";

import { FnlocalStorage } from "@/utils/helpers/localStorage";

import { routerPproductionPlan } from "@/routers/manufacture";

import apiComons from "@/Api/apiComon/apiComon";
import apiProductionPlan from "@/Api/apiManufacture/manufacture/productionPlan/apiProductionPlan";
import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";
import { formatMoment } from "@/utils/helpers/formatMoment";

const InFo = dynamic(() => import("./components/form/info"), { ssr: false });
const Table = dynamic(() => import("./components/form/table"), { ssr: false });
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

    const statusExprired = useStatusExprired();

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

    const fetcDataBranch = async () => {
        try {
            const { isSuccess, result } = await apiComons.apiBranchCombobox();
            if (isSuccess) {
                queryData({ dataBrand: result?.map((e) => ({ value: e?.id, label: e?.name })) });
            }
        } catch (error) {}
    };

    const handleSendItem = async () => {
        let form = new FormData();
        dataLocals.forEach((e) => {
            form.append(tab == "plan" ? "dataBusinessitemId[]" : "dataOrderItemId[]", e?.id);
        });
        try {
            const { data, isSuccess } = await apiProductionPlan.apiHandlingManufacture(form);
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
        } catch (error) {}
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

    useEffect(() => {
        const newData = data.dataProduction.map((e) => {
            return {
                ...e,
                date: isValue.dateRange,
            };
        });
        queryData({ dataProduction: newData });
    }, [isValue.dateRange]);

    const handSavePlan = async () => {
        const { hasMissingBom, hasMissingStage, hasMissingQuantityDate } = data.dataProduction.reduce(
            (acc, item) => {
                if (!item.bom == "1") {
                    acc.hasMissingBom = true;
                }
                if (!item.stage == "1") {
                    acc.hasMissingStage = true;
                }
                if (
                    !item.quantityRemaining ||
                    item.quantityRemaining == 0 ||
                    (!item.date.startDate && !item.date.endDate)
                ) {
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
        formData.append("reference_no", "");
        formData.append("date", isValue.date ? isMoment(isValue.date, "DD/MM/YYYY") : "");
        formData.append("branch_id", isValue.idBrach?.value ? isValue.idBrach?.value : "");
        formData.append("option_id", tab == "plan" ? 2 : 1);
        formData.append(
            "timeline",
            `${isMoment(isValue?.dateRange?.startDate, "DD/MM/YYYY")}-${isMoment(
                isValue?.dateRange?.endDate,
                "DD/MM/YYYY"
            )}`
        );
        data.dataProduction.forEach((e, index) => {
            formData.append(`items[${index}][quantity]`, e?.quantityRemaining ? e?.quantityRemaining : "");

            formData.append(
                `items[${index}][timeline]`,
                e?.date ? `${isMoment(e?.date.startDate, "DD/MM/YYYY")}-${isMoment(e?.date.endDate, "DD/MM/YYYY")}` : ""
            );

            formData.append(`items[${index}][delivery_date]`, e?.deliveryDate ? e?.deliveryDate : "");

            formData.append(`items[${index}][item_variation_id]`, e?.item_variation_id ? e?.item_variation_id : "");

            formData.append(`items[${index}][item_id]`, e?.item_id ? e?.item_id : "");

            formData.append(`items[${index}][object_type]`, e?.object_type ? e?.object_type : "");

            formData.append(`items[${index}][object_id]`, e?.objec_id ? e?.objec_id : "");

            formData.append(`items[${index}][object_item_id]`, e?.object_item_id ? e?.object_item_id : "");
        });
        try {
            const { isSuccess, message } = await apiProductionPlan.apiHandlingProductionPlans(formData);
            if (isSuccess == 1) {
                showToat("success", message);
                router.push(routerPproductionPlan.home);
            } else {
                showToat("error", message);
            }
        } catch (error) {}
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
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{"Kế hoạch nguyên vật liệu"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{"Thêm kế hoạch NVL"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="flex justify-between items-center mr-2 mt-1">
                        <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                            Thêm kế hoạch nguyên vật liệu
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.push("/manufacture/production_plan?tab=order")}
                                className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105"
                            >
                                {dataLang?.import_comeback || "import_comeback"}
                            </button>
                            <button
                                onClick={() => handSavePlan()}
                                className="bg-[#0F4F9E] text-white  rounded-md hover:scale-105 transition-all duration-200 ease-linear 3xl:py-2 xxl:py-2 2xl:py-2 xl:py-1 lg:py-1 py-3  px-4 "
                            >
                                Lưu lại
                            </button>
                        </div>
                    </div>
                    <InFo {...shareProps} />
                    <Table {...shareProps} />
                </ContainerBody>
            </Container>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE}
                subtitle={CONFIRM_DELETION}
                isOpen={isOpen}
                save={handleConfim}
                nameModel={"change_item"}
                cancel={() => handleQueryId({ status: false })}
            />
        </>
    );
};
export default React.memo(FormAdd);
