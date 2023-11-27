import Head from "next/head";
import { v4 as uuid } from "uuid";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useMemo, useEffect, useState } from "react";

import Pagination from "@/components/UI/pagination";

import { _ServerInstance as Axios } from "/services/axios";

import { formatMoment } from "@/utils/helpers/formatMoment";

import useTab from "@/hooks/useTab";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import { useSetData } from "@/hooks/useSetData";
import usePagination from "@/hooks/usePagination";
import { useChangeValue } from "@/hooks/useChangeValue";
import useStatusExprired from "@/hooks/useStatusExprired";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";

const BodyGantt = dynamic(() => import("./(gantt)"), { ssr: false });

const Header = dynamic(() => import("./(header)/header"), { ssr: false });

const FilterHeader = dynamic(() => import("./(filterHeader)/filterHeader"), { ssr: false });

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const trangthaiExprired = useStatusExprired();

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

    const showToast = useToast();

    const { isMoment } = formatMoment();

    const { paginate } = usePagination();

    const { handleTab } = useTab("order");

    const { isOpen, handleToggle } = useToggle(false);

    const [isFetching, sIsFetching] = useState(false);

    const [isAscending, sIsAscending] = useState(true); // Trạng thái sắp xếp

    const { isData, updateData } = useSetData(initialData);

    const { isValue, onChangeValue } = useChangeValue(initialValues);

    const [data, sData] = useState([]);

    const { limit, totalItems, updateTotalItems } = useLimitAndTotalItems(15, {});

    const _ServerFetching = () => {
        Axios(
            "GET",
            `/api_web/api_manufactures/getProductionPlan?csrf_protection=true`,
            {
                params: {
                    page: router.query?.page || 1,
                    limit: limit,
                    date_start: isValue.startDate ? isMoment(isValue.startDate, "DD/MM/YYYY") : "",
                    date_end: isValue.endDate ? isMoment(isValue.endDate, "DD/MM/YYYY") : "",
                    customer_id: isValue.idClient?.value ? isValue.idClient?.value : "",
                    category_id: isValue.idProductGroup?.value ? isValue.idProductGroup?.value : "",
                    product_id: isValue.idProduct?.length > 0 ? isValue.idProduct.map((e) => e?.value) : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { data } = response?.data;

                    updateData({
                        listOrder: data?.rResult?.map((i) => ({
                            id: i.id,
                            nameOrder: i.nameOrder,
                            status: i.status,
                            process: i.process,
                            processDefault: i.processDefault,
                            listProducts: i.listProducts.map((s) => ({
                                id: s.id,
                                name: s.name,
                                images: s.images,
                                desription: s.desription,
                                status: s.status,
                                quantity: s.quantity,
                                actions: s.actions,
                                processArr: s.processArr,
                                unitName: s.unit_name,
                            })),
                        })),
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
        return order.listProducts.map((product) => {
            const newArrMonth = product.processArr?.length > 0 ? sortArrayByMonth(product.processArr) : [];

            const newArrDays = sortArrayByDay(newArrMonth);

            return {
                ...product,
                checked: false,
                processArr: newArrDays,
            };
        });
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

    const handleCheked = useMemo(() => {
        return (idParent, idChild) => {
            const updatedData = data.map((e) => {
                if (e.id === idParent) {
                    const newListProducts = e.listProducts.map((i) => {
                        if (i.id === idChild) {
                            console.log(!i.checked);
                            return { ...i, checked: !i.checked };
                        }

                        return i;
                    });

                    return { ...e, listProducts: newListProducts };
                }

                return e;
            });

            localStorage.setItem("arrData", JSON.stringify(updatedData));
            localStorage.setItem("tab", router.query?.tab);

            sData([...updatedData]);
        };
    }, [data]);

    const handleSort = useMemo(() => {
        return () => {
            const updatedData = [...data];

            updatedData.sort((a, b) => {
                if (isAscending) {
                    return a.nameOrder.localeCompare(b.nameOrder); // Sắp xếp từ nhỏ đến lớn
                } else {
                    return b.nameOrder.localeCompare(a.nameOrder); // Sắp xếp từ lớn đến nhỏ
                }
            });

            showToast("success", "Sắp xếp đơn hàng thành công");

            sData(updatedData);

            sIsAscending(!isAscending); // Đảo ngược trạng thái sắp xếp
        };
    }, [data]);

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
    }, [router.query.page, router.query?.tab, isValue]);

    useEffect(() => {
        localStorage.removeItem("arrData");
    }, []);

    const shareProps = {
        dataLang,
        isData,
        isValue,
        isFetching,
        options,
        _HandleSeachApi,
        handleTab,
        router: router.query?.tab,
    };

    return (
        <>
            <Head>
                <title>{"Kế hoạch sản xuất"}</title>
            </Head>
            <div className="relative  3xl:pt-[88px] xxl:pt-[80px] 2xl:pt-[78px] xl:pt-[75px] lg:pt-[70px] pt-70 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? <div className="p-4"></div> : <Header {...shareProps} />}
                <FilterHeader {...shareProps} onChangeValue={onChangeValue} />
                <BodyGantt
                    handleToggle={handleToggle}
                    {...shareProps}
                    handleShowSub={handleShowSub}
                    handleSort={handleSort}
                    data={data}
                    timeLine={isData.timeLine}
                    isAscending={isAscending}
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
        </>
    );
};
export default Index;
