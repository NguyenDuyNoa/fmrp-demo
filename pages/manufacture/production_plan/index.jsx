import { debounce } from "lodash";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

import { useChangeValue } from "@/hooks/useChangeValue";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import { useSetData } from "@/hooks/useSetData";
import useStatusExprired from "@/hooks/useStatusExprired";
import useTab from "@/hooks/useTab";
import { useToggle } from "@/hooks/useToggle";

import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from "@/constants/delete/deleteItems";
import { formatMoment } from "@/utils/helpers/formatMoment";
import { FnlocalStorage } from "@/utils/helpers/localStorage";

import ContainerPagination from "@/components/UI/common/ContainerPagination/containerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/titlePagination";
import { EmptyExprired } from "@/components/UI/common/emptyExprired";
import { Container } from "@/components/UI/common/layout";
import Pagination from "@/components/UI/pagination";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import useActionRole from "@/hooks/useRole";
import { useSelector } from "react-redux";

const BodyGantt = dynamic(() => import("./components/gantt"), { ssr: false });

// const Header = dynamic(() => import("./components/header"), { ssr: false });
import Header from "./components/header";

// const FilterHeader = dynamic(() => import("./components/fillter/filterHeader"), { ssr: false });
import apiComons from "@/Api/apiComon/apiComon";
import apiProductionPlan from "@/Api/apiManufacture/manufacture/productionPlan/apiProductionPlan";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import FilterHeader from "./components/fillter/filterHeader";

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const statusExprired = useStatusExprired();

    const initialData = {
        timeLine: [],
        listOrder: [],
        client: [],
        productGroup: [],
        product: [],
        listBr: [],
        planStatus: [
            { id: uuid(), value: "outDate", label: "Đã quá hạn" },
            { id: uuid(), value: "processing", label: "Đang thực hiện" },
            { id: uuid(), value: "sussces", label: "Hoàn thành" },
            { id: uuid(), value: "unfulfilled", label: "Chưa thực hiện" },
        ],
    };

    const initialValues = {
        startDate: null,
        endDate: null,
        idClient: null,
        idProductGroup: null,
        idProduct: null,
        valueBr: null,
        planStatus: null,
    };

    const { paginate } = usePagination();

    const { handleTab } = useTab("order");

    const [isSort, sIsSort] = useState("");

    const { setItem, removeItem } = FnlocalStorage();

    const [isFetching, sIsFetching] = useState(false);

    const [arrIdChecked, sArrIdChecked] = useState([]);

    const { isData, updateData } = useSetData(initialData);

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const { isValue, onChangeValue } = useChangeValue(initialValues);

    const { limit, totalItems, updateTotalItems } = useLimitAndTotalItems();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, "production_plans_fmrp");

    const [data, sData] = useState([]);
    const _ServerFetching = async () => {
        const url =
            router.query?.tab == "plan"
                ? "/api_web/api_manufactures/getByInternalPlan?csrf_protection=true"
                : "/api_web/api_manufactures/getProductionPlan?csrf_protection=true";
        const params = {
            page: router.query?.page || 1,
            limit: limit,
            sort: isSort,
            date_start: isValue.startDate ? formatMoment(isValue.startDate, FORMAT_MOMENT.DATE_SLASH_LONG) : "",
            date_end: isValue.endDate ? formatMoment(isValue.endDate, FORMAT_MOMENT.DATE_SLASH_LONG) : "",
            customer_id: isValue.idClient?.value ? isValue.idClient?.value : "",
            category_id: isValue.idProductGroup?.value ? isValue.idProductGroup?.value : "",
            branch_id: isValue.valueBr?.value ? isValue.valueBr?.value : "",
            product_id: isValue.idProduct?.length > 0 ? isValue.idProduct.map((e) => e?.value) : null,
        };
        try {
            const { data } = await apiProductionPlan.apiListOrderPlan(url, { params: params });
            updateData({
                listOrder: data?.rResult?.map((i) => {
                    return {
                        id: i.id,
                        nameOrder: i.nameOrder,
                        status: i.status,
                        process: i.process,
                        processDefault: i.processDefault,
                        listProducts: i.listProducts.map((s) => {
                            const check = arrIdChecked.includes(s.id);
                            return {
                                id: s.id,
                                name: s.name,
                                images: s.images,
                                desription: s.desription,
                                status: s.status,
                                quantity: +s.quantity,
                                quantityRemaining: +s.quantity_rest,
                                quantityPlan: +s.quantity_plan,
                                actions: s.actions,
                                processArr: s?.processArr?.items.map((j) => {
                                    return {
                                        id: uuid(),
                                        date: formatMoment(j?.date, FORMAT_MOMENT.DATE_SLASH_LONG),
                                        active: j?.active,
                                        outDate: j?.outDate,
                                    };
                                }),
                                unitName: s.unit_name,
                                checked: check,
                                productVariation: s.product_variation,
                            };
                        }),
                    };
                }),
                timeLine: data?.listDate?.map((e) => {
                    return {
                        id: uuid(),
                        title: e?.title,
                        month: formatMoment(e?.month_year, FORMAT_MOMENT.MONTH),
                        days: e?.days?.map((i) => {
                            return {
                                id: uuid(),
                                day: `${i?.day_name} ${formatMoment(i?.date, FORMAT_MOMENT.MONTH)}`,
                                date: formatMoment(i?.date, FORMAT_MOMENT.DATE_SLASH_LONG),
                            };
                        }),
                    };
                }),
            });
            updateTotalItems({
                iTotalDisplayRecords: data?.output?.iTotalDisplayRecords,
                iTotalRecords: data?.output?.iTotalRecords,
            });
        } catch (error) { }
        sIsFetching(false);
    };
    const _ServerFetching_filter = async () => {
        try {
            const { rResult: client } = await apiProductionPlan.apiClientOption();
            const { rResult: productGroup } = await apiProductionPlan.apiCategoryOption();
            const { result: listBr } = await apiComons.apiBranchCombobox();
            const { data } = await apiProductionPlan.apiSearchProductsVariant({
                params: { "filter[branch_id]": 0 },
            });
            updateData({
                client: client?.map(({ name, id }) => ({ label: name, value: id })),
                productGroup: productGroup.map((e) => ({
                    label: `${e.name + " " + "(" + e.code + ")"}`,
                    value: e.id,
                    level: e.level,
                    code: e.code,
                    parent_id: e.parent_id,
                })),
                listBr: listBr?.map((e) => ({ label: e?.name, value: e?.id })) || [],
                product: data?.result,
            });
        } catch (error) { }
    };

    const _HandleSeachApi = debounce(async (inputValue) => {
        try {
            const { data } = await apiProductionPlan.apiSearchProductsVariant({
                params: {
                    "filter[branch_id]": 0,
                },
                data: {
                    term: inputValue,
                },
            });
            updateData({ product: data?.result });
        } catch (error) { }
    }, 500);

    const options = isData?.product?.map((e) => ({
        label: `${e.name}
                <span style={{display: none}}>${e.code}</span>
                <span style={{display: none}}>${e.text_type} ${e.unit_name} ${e.product_variation} </span>`,
        value: e.id,
        e,
    }));

    const sortArrayByDay = (arr, timeLine) => {
        return timeLine.flatMap((month) => {
            return month.days.map((timelineDay) => {
                const matchingDay = arr.find((day) => day.date === timelineDay.date);
                return matchingDay ? matchingDay : { ...timelineDay, active: false, outDate: false };
            });
        });
    };

    const updateListProducts = (order, timeLine) => {
        const newDb = order.listProducts.map((product) => {
            const newArrDays = sortArrayByDay(product.processArr, timeLine);
            const check = arrIdChecked.includes(product.id);
            return {
                ...product,
                checked: check || product.checked,
                processArr: newArrDays,
            };
        });
        return newDb;
    };

    const updateProcessDefault = (order, timeLine) => {
        const processDefaultUpdate = sortArrayByDay(order.processDefault, timeLine);

        return processDefaultUpdate;
    };

    const updateListOrder = useMemo(() => {
        return (listOrder, timeLine) => {
            return listOrder?.map((order) => {
                const updatedListProducts = updateListProducts(order, timeLine);
                const processDefaultUpdate = updateProcessDefault(order, timeLine);

                return {
                    ...order,
                    show: updatedListProducts?.length > 0,
                    processDefault: processDefaultUpdate || [],
                    listProducts: updatedListProducts,
                };
            });
        };
    }, []);

    const handleShowSub = useMemo(() => {
        return (id) => {
            const updatedData = [...data];

            updatedData.forEach((order) => {
                if (order.id === id) {
                    order.show = !order.show;
                }
            });

            sData(updatedData);
        };
    }, [data]);

    const handleCheked = (idParent, idChild) => {
        const updatedData = data.map((e) => {
            if (e.id === idParent) {
                const newListProducts = e.listProducts.map((i) => {
                    if (i.id === idChild) {
                        const checkedState = !i.checked;

                        const updatedArrId = checkedState
                            ? [...arrIdChecked, idChild]
                            : arrIdChecked.filter((s) => s != idChild);

                        sArrIdChecked(updatedArrId);

                        return { ...i, checked: checkedState };
                    }

                    return i;
                });

                return { ...e, listProducts: newListProducts };
            }

            return e;
        });

        sData([...updatedData]);
    };

    const handleChekedAll = () => {
        const updatedData = [...data];

        let updatedArrId = [...arrIdChecked];

        updatedData.forEach((e) => {
            e.listProducts.forEach((i) => {
                if (i?.quantityRemaining > 0) {
                    const checkedState = !i.checked;
                    if (checkedState) {
                        updatedArrId = [...updatedArrId, i.id];
                    } else {
                        updatedArrId = updatedArrId.filter((s) => s != i.id);
                    }
                    i.checked = checkedState;
                }
            });
        });

        sArrIdChecked(updatedArrId);

        sData(updatedData);
    };

    const handleSort = () => sIsSort(isSort == "reference_no" ? "-reference_no" : "reference_no");

    useEffect(() => {
        const istOrders = updateListOrder(isData.listOrder, isData.timeLine);
        sData(istOrders);
    }, [isData.listOrder, isData.timeLine]);

    useEffect(() => {
        isFetching && _ServerFetching();
    }, [isFetching, isValue]);

    useEffect(() => {
        sIsFetching(true);
        _ServerFetching_filter();
    }, [router.query.page, isSort, router.query?.tab, isValue]);

    useEffect(() => {
        removeItem("arrData");
    }, []);

    useEffect(() => {
        const check = data?.some((e) => e.listProducts.some((i) => i.checked == true));
        if (check) {
            const converData = data.flatMap((e) => {
                return e.listProducts
                    .filter((i) => i.checked)
                    .map((i) => ({ ...i, idParent: e.id, nameOrder: e.nameOrder }));
            });

            setItem("arrData", JSON.stringify(converData));

            setItem("tab", router.query?.tab);
        }
    }, [data]);

    const handleConfimTab = () => {
        arrIdChecked?.length > 0 && sArrIdChecked([]);
        removeItem("arrData");

        handleTab(isKeyState);

        handleQueryId({ status: false });
    };

    const shareProps = {
        dataLang,
        isData,
        data,
        isValue,
        isFetching,
        options,
        _HandleSeachApi,
        handleQueryId,
        handleTab,
        arrIdChecked,
        handleChekedAll,
        router: router.query?.tab,
    };

    return (
        <>
            <Head>
                <title>{"Kế hoạch sản xuất"}</title>
            </Head>
            <Container>
                {statusExprired ? <EmptyExprired /> : <Header {...shareProps} />}
                <FilterHeader {...shareProps} onChangeValue={onChangeValue} />

                <BodyGantt
                    {...shareProps}
                    handleShowSub={handleShowSub}
                    handleSort={handleSort}
                    data={data}
                    timeLine={isData.timeLine}
                    isSort={isSort == "reference_no" ? false : true}
                    handleCheked={handleCheked}
                />

                {data?.length > 0 && (
                    <ContainerPagination className="flex space-x-5 items-center">
                        <TitlePagination dataLang={dataLang} totalItems={totalItems?.iTotalDisplayRecords} />
                        <Pagination
                            postsPerPage={limit}
                            totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                            paginate={paginate}
                            currentPage={router.query?.page || 1}
                        />
                    </ContainerPagination>
                )}
            </Container>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE_ITEMS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={handleConfimTab}
                cancel={() => handleQueryId({ status: false })}
            />
        </>
    );
};
export default Index;
