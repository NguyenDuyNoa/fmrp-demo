import apiProductionPlan from "@/Api/apiManufacture/manufacture/productionPlan/apiProductionPlan";
import Breadcrumb from "@/components/UI/breadcrumb/BreadcrumbCustom";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container, ContainerBody } from "@/components/UI/common/layout";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import LayoutForm from "@/components/layout/LayoutForm";
import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { useBranchList } from "@/hooks/common/useBranch";
import { useChangeValue } from "@/hooks/useChangeValue";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import { routerPproductionPlan } from "@/routers/manufacture";
import { formatMoment } from "@/utils/helpers/formatMoment";
import { FnlocalStorage } from "@/utils/helpers/localStorage";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const InFo = dynamic(() => import("./components/form/info"), { ssr: false });
const Table = dynamic(() => import("./components/form/table"), { ssr: false });

const initialData = {
    dataProduction: [],
};

const ProductionPlanForm = (props) => {
    const { getItem, setItem } = FnlocalStorage();

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
    };

    const router = useRouter();

    const dataLang = props.dataLang;

    const showToat = useToast();

    const [data, sData] = useState(initialData);

    const queryData = (key) => sData((prve) => ({ ...prve, ...key }));

    const statusExprired = useStatusExprired();

    const [isLoading, sIsLoading] = useState(false);

    const { data: listBranch = [] } = useBranchList()

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const { isValue, onChangeValue } = useChangeValue(initialValue);

    useEffect(() => {
        checkLoading();
        if (dataLocals?.length < 1) {
            backPage();
            return;
        }
        handleSendItem();
    }, []);

    const handleSendItem = async () => {
        let form = new FormData();
        dataLocals.forEach((e) => {
            form.append(tab == "plan" ? "dataBusinessitemId[]" : "dataOrderItemId[]", e?.id);
        });
        try {
            const { data } = await apiProductionPlan.apiHandlingManufacture(form);
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
                        deliveryDate: formatMoment(e?.delivery_date, FORMAT_MOMENT.DATE_SLASH_LONG),
                    };
                }),
            });
        } catch (error) {
            throw new Error(error);
        }
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
        showToat("error", tab == "plan" ? "Không có KHNB. Vui lòng thêm KHNB !" : "Không có đơn hàng. Vui lòng thêm đơn hàng !", 3000);
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
        queryData((prevData) => {
            const newData = prevData.dataProduction.map((e) => {
                if (e.idParent == idParent && e.id == id) {
                    return { ...e, [type]: value };
                }
                return e;
            });
            setItem("arrData", JSON.stringify(newData));
            return { ...prevData, dataProduction: newData };
        });
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

    const mutatePlan = useMutation({
        mutationFn: (data) => {
            return apiProductionPlan.apiHandlingProductionPlans(data);
        },
        retry: 5,
        gcTimeout: 5000,
    })

    const handSavePlan = async () => {
        const { hasMissingBom, hasMissingStage, hasMissingQuantityDate } = data.dataProduction.reduce(
            (acc, item) => {
                if (!item.bom == "1") {
                    acc.hasMissingBom = true;
                }
                if (!item.stage == "1") {
                    acc.hasMissingStage = true;
                }
                if (!item.quantityRemaining || item.quantityRemaining == 0 || (!item.date.startDate || !item.date.endDate)) {
                    acc.hasMissingQuantityDate = true;
                }
                return acc;
            },
            { hasMissingBom: false, hasMissingStage: false, hasMissingQuantityDate: false }
        );

        if (hasMissingQuantityDate || !isValue.idBrach || (!isValue.date) || (!isValue.dateRange.startDate || !isValue.dateRange.endDate)) {
            if (!isValue.idBrach || (!isValue.date)) {
                showToat("error", "Vui lòng kiểm tra dữ liệu");
                return
            }
            if ((!isValue.dateRange.startDate || !isValue.dateRange.endDate || hasMissingQuantityDate)) {
                showToat("error", "Timeline sản xuất phải có ngày bắt đầu và ngày kết thúc");
                return;
            }
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
        formData.append("option_id", tab == "plan" ? 2 : 1);
        formData.append("branch_id", isValue.idBrach?.value ? isValue.idBrach?.value : "");
        formData.append("date", isValue.date ? formatMoment(isValue.date, FORMAT_MOMENT.DATE_SLASH_LONG) : "");
        formData.append("timeline", `${formatMoment(isValue?.dateRange?.startDate, FORMAT_MOMENT.DATE_SLASH_LONG)}-${formatMoment(isValue?.dateRange?.endDate, FORMAT_MOMENT.DATE_SLASH_LONG)}`);

        data.dataProduction.forEach((e, index) => {
            formData.append(`items[${index}][quantity]`, e?.quantityRemaining ? e?.quantityRemaining : "");
            formData.append(`items[${index}][timeline]`, e?.date ? `${formatMoment(e?.date.startDate, FORMAT_MOMENT.DATE_SLASH_LONG)}-${formatMoment(e?.date.endDate, FORMAT_MOMENT.DATE_SLASH_LONG)}` : "");
            formData.append(`items[${index}][delivery_date]`, e?.deliveryDate ? e?.deliveryDate : "");
            formData.append(`items[${index}][item_variation_id]`, e?.item_variation_id ? e?.item_variation_id : "");
            formData.append(`items[${index}][item_id]`, e?.item_id ? e?.item_id : "");
            formData.append(`items[${index}][object_type]`, e?.object_type ? e?.object_type : "");
            formData.append(`items[${index}][object_id]`, e?.objec_id ? e?.objec_id : "");
            formData.append(`items[${index}][object_item_id]`, e?.object_item_id ? e?.object_item_id : "");
        });

        mutatePlan.mutate(formData, {
            onSuccess: ({ isSuccess, message }) => {
                if (isSuccess == 1) {
                    showToat("success", message);
                    router.push(routerPproductionPlan.home);
                    return
                }
                showToat("error", message);
            },
            onError: (error) => {
                throw new Error(error);
            },
        })
    };

    const shareProps = {
        dataLang,
        data,
        isLoading: mutatePlan.isPending,
        handleRemoveItem,
        handChangeTable,
        handleRemoveBtn,
        isValue,
        onChangeValue,
        listBranch,
        tab: getLocalStorageTab,
        dateRange: isValue.dateRange
    };

    // breadcrumb
    const breadcrumbItems = [
        {
            label: `Sản xuất`,
            // href: "/",
        },
        {
            label: `Kế hoạch sản xuất`,
            href: "/manufacture/production-plan?tab=order",
        },
        {
            label: dataLang?.production_plan_form_add_content || 'production_plan_form_add_content'
        },
    ];

    const handleExit = () => {
        router.push("/manufacture/production-plan?tab=order");
    };

    return (
        <>
            <LayoutForm
                title={dataLang?.production_plan_form_add || 'production_plan_form_add'}
                heading={dataLang?.production_plan_form_add_content || 'production_plan_form_add_content'}
                breadcrumbItems={breadcrumbItems}
                statusExprired={statusExprired}
                dataLang={dataLang}
                leftContent={<Table {...shareProps} />}
                info={<InFo {...shareProps} />}
                onSave={handSavePlan}
                onExit={handleExit}
                loading={mutatePlan.isPending}
            />
            {/* <Head>
                <title>{dataLang?.production_plan_form_add || 'production_plan_form_add'}</title>
            </Head> */}
            {/* <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <Breadcrumb
                        items={breadcrumbItems}
                        className="3xl:text-sm 2xl:text-xs xl:text-[10px] lg:text-[10px]"
                    />
                )}
                <ContainerBody>
                    <div className="flex items-center justify-between mt-1 mr-2">
                        <h2 className="text-title-section text-[#52575E] capitalize font-medium">
                            {dataLang?.production_plan_form_add || 'production_plan_form_add'}
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.push("/manufacture/production-plan?tab=order")}
                                className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105"
                            >
                                {dataLang?.import_comeback || "import_comeback"}
                            </button>
                            <ButtonSubmit
                                loading={mutatePlan.isPending}
                                onClick={(e) => handSavePlan()}
                                dataLang={dataLang}
                            />
                        </div>
                    </div>
                    <InFo {...shareProps} />
                    <Table {...shareProps} />
                </ContainerBody>
            </Container> */}
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
export default React.memo(ProductionPlanForm);
