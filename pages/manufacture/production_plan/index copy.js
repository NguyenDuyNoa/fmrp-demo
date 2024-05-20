import Head from "next/head";
import { v4 as uuid } from "uuid";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useMemo, useEffect, useState } from "react";

import { _ServerInstance as Axios } from "/services/axios";

import useTab from "@/hooks/useTab";
import { useToggle } from "@/hooks/useToggle";
import { useSetData } from "@/hooks/useSetData";
import usePagination from "@/hooks/usePagination";
import { useChangeValue } from "@/hooks/useChangeValue";
import useStatusExprired from "@/hooks/useStatusExprired";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";

import Pagination from "@/components/UI/pagination";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";

import { formatMoment } from "@/utils/helpers/formatMoment";
import { FnlocalStorage } from "@/utils/helpers/localStorage";
import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from "@/constants/delete/deleteItems";

const BodyGantt = dynamic(() => import("./components/gantt"), { ssr: false });

const Header = dynamic(() => import("./components/header"), { ssr: false });

const FilterHeader = dynamic(() => import("./components/fillter/filterHeader"), { ssr: false });

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const statusExprired = useStatusExprired();

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

    const initialData = {
        timeLine: timeLine,
        listOrder: [],
        client: [],
        productGroup: [],
        product: [],
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
        planStatus: null,
    };

    const { isMoment } = formatMoment();

    const { paginate } = usePagination();

    const { handleTab } = useTab("order");

    const [isSort, sIsSort] = useState("");

    const { setItem, removeItem } = FnlocalStorage();

    const [isFetching, sIsFetching] = useState(false);

    const [arrIdChecked, sArrIdChecked] = useState([]);

    const { isData, updateData } = useSetData(initialData);

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const { isValue, onChangeValue } = useChangeValue(initialValues);

    const { limit, totalItems, updateTotalItems } = useLimitAndTotalItems(15, {});

    const [data, sData] = useState([]);
    const _ServerFetching = () => {
        Axios(
            "GET",
            `${router.query?.tab == "plan"
                ? "/api_web/api_manufactures/getByInternalPlan?csrf_protection=true"
                : "/api_web/api_manufactures/getProductionPlan?csrf_protection=true"
            }`,
            {
                params: {
                    page: router.query?.page || 1,
                    limit: limit,
                    sort: isSort,
                    date_start: isValue.startDate ? isMoment(isValue.startDate, "DD/MM/YYYY") : "",
                    date_end: isValue.endDate ? isMoment(isValue.endDate, "DD/MM/YYYY") : "",
                    customer_id: isValue.idClient?.value ? isValue.idClient?.value : "",
                    category_id: isValue.idProductGroup?.value ? isValue.idProductGroup?.value : "",
                    product_id: isValue.idProduct?.length > 0 ? isValue.idProduct.map((e) => e?.value) : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { data, message } = response?.data;
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
                                        quantity: s.quantity,
                                        quantityRemaining: s.quantity_rest,
                                        quantityPlan: s.quantity_plan,
                                        actions: s.actions,
                                        processArr: s.processArr,
                                        unitName: s.unit_name,
                                        checked: check,
                                        productVariation: s.product_variation,
                                    };
                                }),
                            };
                        }),
                    });

                    updateTotalItems({
                        iTotalDisplayRecords: data?.output?.iTotalDisplayRecords,
                        iTotalRecords: data?.output?.iTotalRecords,
                    });
                }
                sIsFetching(false);
            }
        );
    };
    const _ServerFetching_filter = () => {
        Axios("GET", "/api_web/api_client/client_option/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { rResult } = response?.data;

                updateData({ client: rResult?.map(({ name, id }) => ({ label: name, value: id })) });
            }
        });

        Axios("GET", "api_web/api_product/categoryOption/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { rResult } = response?.data;

                updateData({
                    productGroup: rResult.map((e) => ({
                        label: `${e.name + " " + "(" + e.code + ")"}`,
                        value: e.id,
                        level: e.level,
                        code: e.code,
                        parent_id: e.parent_id,
                    })),
                });
            }
        });

        Axios(
            "POST",
            "/api_web/api_internal_plan/searchProductsVariant?csrf_protection=true&term",
            {
                params: {
                    "filter[branch_id]": 0,
                },
            },
            (err, response) => {
                if (!err) {
                    let { result } = response.data.data;
                    updateData({ product: result });
                }
            }
        );
    };

    let searchTimeout;

    const _HandleSeachApi = (inputValue) => {
        if (inputValue == "") return;
        else {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                Axios(
                    "POST",
                    `/api_web/api_internal_plan/searchProductsVariant?csrf_protection=true`,
                    {
                        params: {
                            "filter[branch_id]": 0,
                        },
                        data: {
                            term: inputValue,
                        },
                    },
                    (err, response) => {
                        if (!err) {
                            let { result } = response.data.data;

                            updateData({ product: result });
                        }
                    }
                );
            }, 500);
        }
    };

    const options = isData?.product?.map((e) => ({
        label: `${e.name}
                <span style={{display: none}}>${e.code}</span>
                <span style={{display: none}}>${e.text_type} ${e.unit_name} ${e.product_variation} </span>`,
        value: e.id,
        e,
    }));

    const sortArrayByMonth = (arr) => {
        return [...Array(12)].map((_, index) => {
            const crrItem = arr.find((p) => p.month === index + 1);

            if (crrItem) {
                return crrItem;
            }

            return { month: index + 1 };
        });
    };

    const sortArrayByDay = (arr) => {
        return arr.map((i) => {
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
    };

    const updateListProducts = (order) => {
        const newDb = order.listProducts.map((product) => {
            const newArrMonth = product.processArr?.length > 0 ? sortArrayByMonth(product.processArr) : [];

            const newArrDays = sortArrayByDay(newArrMonth);
            const check = arrIdChecked.includes(product.id);
            return {
                ...product,
                checked: check || product.checked,
                processArr: newArrDays,
            };
        });
        return newDb;
    };

    const updateProcessDefault = (order) => {
        const processDefault = sortArrayByMonth(order.processDefault);

        const processDefaultUpdate = sortArrayByDay(processDefault);

        return processDefaultUpdate;
    };

    const updateListOrder = useMemo(() => {
        return (listOrder) => {
            return listOrder?.map((order) => {
                const updatedListProducts = updateListProducts(order);
                const processDefaultUpdate = updateProcessDefault(order);

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
        const istOrders = updateListOrder(isData.listOrder);
        sData(istOrders);
    }, [isData.listOrder]);

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
            <div className="relative  3xl:pt-[88px] xxl:pt-[80px] 2xl:pt-[78px] xl:pt-[75px] lg:pt-[70px] pt-70 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {statusExprired ? <div className="p-4"></div> : <Header {...shareProps} />}
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
                    <div className="flex space-x-5 items-center">
                        <h6 className="">
                            {dataLang?.display} {totalItems?.iTotalDisplayRecords} {dataLang?.among}{" "}
                            {totalItems?.iTotalRecords} {dataLang?.ingredient}
                        </h6>
                        <Pagination
                            postsPerPage={limit}
                            totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                            paginate={paginate}
                            currentPage={router.query?.page || 1}
                        />
                    </div>
                )}
            </div>
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
