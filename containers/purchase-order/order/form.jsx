import apiOrder from "@/Api/apiPurchaseOrder/apiOrder";
import ButtonBack from "@/components/UI/button/buttonBack";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container } from "@/components/UI/common/layout";
import InPutMoneyFormat from "@/components/UI/inputNumericFormat/inputMoneyFormat";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { optionsQuery } from "@/configs/optionsQuery";
import {
    CONFIRMATION_OF_CHANGES,
    TITLE_DELETE_ITEMS,
} from "@/constants/delete/deleteItems";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { useSupplierList } from "@/containers/suppliers/supplier/hooks/useSupplierList";
import { useBranchList } from "@/hooks/common/useBranch";
import { useStaffOptions } from "@/hooks/common/useStaffs";
import { useTaxList } from "@/hooks/common/useTaxs";
import useSetingServer from "@/hooks/useConfigNumber";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import { routerOrder } from "@/routers/buyImportGoods";
import { isAllowedDiscount, isAllowedNumber } from "@/utils/helpers/common";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { SelectCore } from "@/utils/lib/Select";
import { useQuery } from "@tanstack/react-query";
import { Add, Trash as IconDelete, Minus } from "iconsax-react";
import { debounce } from "lodash";
import moment from "moment/moment";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { BsCalendarEvent } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import Select from "react-select";
import { useOrderByPurchase } from "./hooks/useOrderByPurchase";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import SelectItemComponent, {
    MenuListClickAll,
} from "@/components/UI/filterComponents/selectItemComponent";
import Breadcrumb from "@/components/UI/breadcrumb/BreadcrumbCustom";
const OrderForm = (props) => {
    const router = useRouter();

    const id = router.query?.id;

    const dataLang = props?.dataLang;

    const isShow = useToast();

    const statusExprired = useStatusExprired();

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const [onFetchingItemsAll, sOnFetchingItemsAll] = useState(false);

    const [onSending, sOnSending] = useState(false);

    const dataSeting = useSetingServer();

    const [option, sOption] = useState([
        {
            id: Date.now(),
            items: null,
            unit: 1,
            quantity: 1,
            price: 1,
            discount: 0,
            affterDiscount: 1,
            tax: 0,
            priceAffterTax: 1,
            total: 1,
            note: "",
            purchases_order_item_id: "",
        },
    ]);

    // const slicedArr = option.slice(1);

    // const sortedArr = slicedArr.sort((a, b) => b.id - a.id);

    // sortedArr.unshift(option[0]);
    const [sortedArr, setSortedArr] = useState([]);

    const [hidden, sHidden] = useState(false);

    const [optionType, sOptionType] = useState("0");

    const [dataItems, sDataItems] = useState([]);

    const [startDate, sStartDate] = useState(new Date());

    const [delivery_dateNew, sDelivery_dateNew] = useState(new Date());

    const [code, sCode] = useState("");

    const [note, sNote] = useState("");

    const [tax, sTax] = useState();

    const [discount, sDiscount] = useState(0);

    const [idSupplier, sIdSupplier] = useState(null);

    const [idStaff, sIdStaff] = useState(null);

    const [idPurchases, sIdPurchases] = useState([]);

    const [idBranch, sIdBranch] = useState(null);

    const [errDate, sErrDate] = useState(false);

    const [errSupplier, sErrSupplier] = useState(false);

    const [errStaff, sErrStaff] = useState(false);

    const [errPurchase, sErrPurchase] = useState(false);

    const [errBranch, sErrBranch] = useState(false);

    const [itemAll, sItemAll] = useState([]);

    useEffect(() => {
        if (option.length > 0) {
            const slicedArr = option.slice(1); // Bỏ phần tử đầu tiên
            const arr = slicedArr.sort((a, b) => b.id - a.id); // Sắp xếp giảm dần theo id
            // arr.unshift(option[0]); // Đưa phần tử đầu tiên vào đầu danh sách
            setSortedArr([
                // {
                // id: Date.now(),
                // items: null,
                // unit: 1,
                // quantity: 1,
                // price: 1,
                // discount: 0,
                // affterDiscount: 1,
                // tax: 0,
                // priceAffterTax: 1,
                // total: 1,
                // note: "",
                // purchases_order_item_id: "",
                // },
            ]); // Cập nhật state
        }
    }, []); // Chạy lại khi options thay đổi

    const readOnlyFirst = true;

    const { data: dataTasxes = [] } = useTaxList();

    const { data: dataBranch = [] } = useBranchList();

    const { data: listSuppiler } = useSupplierList({
        "filter[branch_id]": idBranch != null ? idBranch.value : null,
    });

    const dataSupplier = idBranch
        ? listSuppiler?.rResult?.map((e) => ({ label: e.name, value: e.id }))
        : [];

    const { data: listDataStaff = [] } = useStaffOptions({
        idSupplier: idSupplier,
        "filter[branch_id]": idBranch != null ? idBranch.value : null,
    });

    const dataStaff = idBranch && idSupplier ? listDataStaff : [];

    const { data: dataPurchases = [] } = useOrderByPurchase(
        {
            "filter[branch_id]": idBranch != null ? idBranch?.value : -1,
            purchase_order_id: id ? id : "",
        },
        optionType
    );

    useEffect(() => {
        router.query && sErrDate(false);
        router.query && sErrSupplier(false);
        router.query && sErrStaff(false);
        router.query && sErrPurchase(false);
        router.query && sErrBranch(false);
        router.query && sNote("");
        router.query && sStartDate(new Date());
        router.query && sDelivery_dateNew(new Date());
    }, [router.query]);

    useQuery({
        queryKey: ["detail_order", id],
        queryFn: () => _ServerFetchingDetail(),
        enabled: !!id,
    });

    const _ServerFetchingDetail = async () => {
        try {
            const rResult = await apiOrder.apiDetailOrder(id);

            const itemlast = [{ items: null }];

            const itemsConver = rResult?.item?.map((e) => {
                return {
                    purchases_order_item_id: e?.purchases_order_item_id,
                    id: e.purchases_order_item_id,
                    items: {
                        e: e?.item,
                        label: `${e.item?.name} <span style={{display: none}}>${e.item?.code +
                            e.item?.product_variation +
                            e.item?.text_type +
                            e.item?.unit_name
                            }</span>`,
                        value: e.item?.id,
                    },
                    quantity: Number(e?.quantity),
                    price: Number(e?.price),
                    id_plan: e?.id_plan,
                    discount: Number(e?.discount_percent),
                    tax: { tax_rate: e?.tax_rate, value: e?.tax_id },
                    unit: e.item?.unit_name,
                    affterDiscount: Number(e?.price_after_discount),
                    note: e?.note,
                    total:
                        Number(e?.price_after_discount) *
                        (1 + Number(e?.tax_rate) / 100) *
                        Number(e?.quantity),
                };
            });
            const item = itemlast?.concat(itemsConver);

            sOption(item);
            setSortedArr(itemsConver);

            sCode(rResult?.code);

            sIdStaff({
                label: rResult?.staff_name,
                value: rResult.staff_id,
            });

            sIdBranch({
                label: rResult?.branch_name,
                value: rResult?.branch_id,
            });

            sIdSupplier({
                label: rResult?.supplier_name,
                value: rResult?.supplier_id,
            });

            sStartDate(
                rResult?.date || !rResult?.date == "0000-00-00"
                    ? moment(rResult?.date).toDate()
                    : null
            );

            sDelivery_dateNew(
                rResult?.delivery_date || !rResult?.delivery_date == "0000-00-00"
                    ? moment(rResult?.delivery_date).toDate()
                    : null
            );

            sOptionType(rResult?.order_type);

            sIdPurchases(
                rResult?.purchases?.map((e) => ({
                    label: e.code,
                    value: e.id,
                }))
            );

            // sHidden(rResult?.order_type === "1" ? true : false);

            sOnFetchingItemsAll(rResult?.order_type === "0" ? true : false);

            if (rResult?.order_type === "1") {
                refetchItems();
            }

            sNote(rResult?.note);
        } catch (error) { }
    };

    const resetValue = () => {
        if (isKeyState?.type === "optionType") {
            sOptionType(isKeyState?.value.target.value);

            // sHidden(isKeyState?.value.target.value === "1");

            sIdPurchases(isKeyState?.value.target.value === "0" ? [] : idPurchases);

            sOnFetchingItemsAll(isKeyState?.value.target.value === "0" && true);

            if (isKeyState?.value.target.value === "1") {
                refetchItems();
            }

            sTax("");

            sDiscount("");
            setSortedArr([]);
            sOption([
                {
                    id: Date.now(),
                    items: null,
                    unit: 1,
                    quantity: 1,
                    price: 1,
                    discount: 0,
                    affterDiscount: 1,
                    tax: 0,
                    priceAffterTax: 1,
                    total: 1,
                    note: "",
                },
            ]);
        }
        if (isKeyState?.type === "purchases") {
            sIdPurchases(isKeyState?.value);
            setSortedArr([]);
            sOption([
                {
                    id: Date.now(),
                    items: null,
                    unit: 1,
                    quantity: 1,
                    price: 1,
                    discount: 0,
                    affterDiscount: 1,
                    tax: 0,
                    priceAffterTax: 1,
                    total: 1,
                    note: "",
                },
            ]);
        }
        if (isKeyState?.type === "branch") {
            sIdBranch(isKeyState?.value);

            sIdPurchases([]);
            setSortedArr([]);
            sOption([
                {
                    id: Date.now(),
                    items: null,
                    unit: 1,
                    quantity: 1,
                    price: 1,
                    discount: 0,
                    affterDiscount: 1,
                    tax: 0,
                    priceAffterTax: 1,
                    total: 1,
                    note: "",
                },
            ]);
        }
        handleQueryId({ status: false });
    };

    const _HandleChangeInput = (type, value) => {
        if (type === "optionType") {
            handleQueryId({ status: true, initialKey: { type, value } });
        } else if (type == "code") {
            sCode(value.target.value);
        } else if (type === "date") {
            sSelectedDate(
                formatMoment(value.target.value, FORMAT_MOMENT.DATE_TIME_LONG)
            );
        } else if (type === "supplier") {
            sIdSupplier(value);
            sOnFetchingItemsAll(true);
        } else if (type === "staff") {
            sIdStaff(value);
        } else if (type === "delivery_dateNew") {
            sDelivery_dateNew(value);
        } else if (type === "purchases" && idPurchases != value) {
            if (sortedArr?.length > 0) {
                handleQueryId({ status: true, initialKey: { type, value } });
            } else {
                sIdPurchases(value);
            }
        } else if (type === "note") {
            sNote(value.target.value);
        } else if (type == "branch" && idBranch != value) {
            if (sortedArr?.length > 0) {
                handleQueryId({ status: true, initialKey: { type, value } });
            } else {
                sIdBranch(value);

                sIdPurchases([]);

                sIdSupplier(null);

                sIdStaff(null);
                setSortedArr([]);
                sOption([
                    {
                        id: Date.now(),
                        items: null,
                        unit: 1,
                        quantity: 1,
                        price: 1,
                        discount: 0,
                        affterDiscount: 1,
                        tax: 0,
                        priceAffterTax: 1,
                        total: 1,
                        note: "",
                    },
                ]);
            }
        } else if (type == "tax") {
            sTax(value);
        } else if (type == "discount") {
            sDiscount(value?.value);
        } else if (type == "itemAll") {
            sItemAll(value);
            if (value?.length == 0) {
                setSortedArr([]);
            } else {
                setSortedArr([
                    ...sortedArr,
                    ...value.map((item) => {
                        // const money = Number(item?.e.affterDiscount) * (1 + Number(item?.e?.tax?.e?.tax_rate) / 100) * Number(item?.e?.quantity);
                        let money = 0;
                        if (item.e?.tax?.tax_rate == undefined) {
                            money =
                                Number(1) *
                                (1 + Number(0) / 100) *
                                Number(item?.e?.quantity_left);
                        } else {
                            money =
                                Number(item?.e?.affterDiscount) *
                                (1 + Number(item?.e?.tax?.tax_rate) / 100) *
                                Number(item?.e?.quantity);
                        }

                        return {
                            id: Date.now(),
                            items: item,
                            unit: item?.e?.unit_name,
                            quantity: idPurchases?.length
                                ? Number(item?.e?.quantity_left)
                                : 1,
                            price: item?.price,
                            discount: discount ? discount : 0,
                            affterDiscount: 1,
                            tax: tax ? tax : 0,
                            priceAffterTax: 1,
                            total: Number(money.toFixed(2)),
                            note: "",
                        };
                    }),
                ]);
            }
        }
    };

    const handleClearDate = (type) => {
        if (type === "effectiveDate") {
        }
        if (type === "startDate") {
            sStartDate(new Date());
        }
    };
    const handleTimeChange = (date) => {
        sStartDate(date);
    };

    const handleClearDateNew = (type) => {
        if (type === "effectiveDateNew") {
        }
        if (type === "delivery_dateNew") {
            sDelivery_dateNew(new Date());
        }
    };

    useEffect(() => {
        if (tax == null) return;
        setSortedArr((prevOption) => {
            const newOption = [...prevOption];

            const taxValue = tax?.tax_rate || 0;

            const chietKhauValue = discount || 0;

            newOption.forEach((item, index) => {
                if (!item.id) return;

                const dongiasauchietkhau = item?.price * (1 - chietKhauValue / 100);

                const total = dongiasauchietkhau * (1 + taxValue / 100) * item.quantity;

                item.tax = tax;

                item.total = isNaN(total) ? 0 : total;
            });
            return newOption;
        });
    }, [tax]);

    useEffect(() => {
        if (discount == null) return;
        setSortedArr((prevOption) => {
            const newOption = [...prevOption];

            const taxValue = tax?.tax_rate != undefined ? tax?.tax_rate : 0;

            const chietKhauValue = discount ? discount : 0;

            newOption.forEach((item, index) => {
                if (!item.id) return;

                const dongiasauchietkhau = item?.price * (1 - chietKhauValue / 100);

                const total = dongiasauchietkhau * (1 + taxValue / 100) * item.quantity;

                item.tax = tax;

                item.discount = Number(discount);

                item.affterDiscount = isNaN(dongiasauchietkhau)
                    ? 0
                    : dongiasauchietkhau;

                item.total = isNaN(total) ? 0 : total;
            });
            return newOption;
        });
    }, [discount]);

    const { refetch: refetchItems } = useQuery({
        queryKey: ["api_data_items_variant", idPurchases],
        queryFn: async () => {
            const { data } = await apiOrder.apiSearchItems({
                params: {
                    branch_id: idBranch != null ? +idBranch?.value : "",
                    "filter[purchases_id]":
                        idPurchases?.length > 0 ? idPurchases.map((e) => e.value) : -1,
                    purchase_order_id: id ? id : "",
                    id_suppliers: idSupplier?.value ?? "",
                },
            });
            sDataItems(data.result);

            return data;
        },
        ...optionsQuery,
        enabled: idPurchases?.length > 0,
    });

    useQuery({
        queryKey: ["api_dataItems_variantAll", onFetchingItemsAll, idSupplier],
        queryFn: async () => {
            _ServerFetching_ItemsAll();
        },
        ...optionsQuery,
        enabled: !!onFetchingItemsAll,
    });

    const _ServerFetching_ItemsAll = async () => {
        if (optionType == "0") {
            let form = new FormData();
            form.append(`branch_id[]`, +idBranch?.value ? +idBranch?.value : "");
            form.append(`id_suppliers`, idSupplier?.value ?? "");
            try {
                const { data } = await apiOrder.apiSearchProductItems(form);

                sDataItems(data?.result);
            } catch (error) { }
        } else {
            try {
                const { data } = await apiOrder.apiSearchItems({
                    params: {
                        branch_id: idBranch != null ? +idBranch?.value : "",
                        purchase_order_id: id,
                        id_suppliers: idSupplier?.value ?? "",
                    },
                });
                sDataItems(data?.result);
            } catch (error) { }
        }
        sOnFetchingItemsAll(false);
    };

    const options = dataItems?.map((e) => ({
        label: `${e.name} <span style={{display: none}}>${e.code}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
        value: e.id,
        e,
    }));

    useEffect(() => {
        const check = () => {
            sOnFetchingItemsAll(true);
        };

        if (!idBranch) {
            sIdSupplier(null);
            sIdStaff(null);
            sIdPurchases([]);
        }

        if (optionType == "1") {
            idBranch != null && check();
            idPurchases?.length == 0 && sDataItems([]);
            idBranch != null && refetchItems();
        } else {
            idBranch == null && sDataItems([]);
            idBranch != null && check();
        }
    }, [idBranch]);

    useEffect(() => {
        idPurchases?.length == 0 && sDataItems([]);
    }, [idPurchases]);

    const dataOption = sortedArr?.map((e) => {
        return {
            item: e?.items?.value,
            quantity: Number(e?.quantity),
            price: e?.price,
            discount_percent: e?.discount,
            tax_id: e?.tax?.value,
            purchases_item_id: e?.items?.e?.purchases_item_id,
            note: e?.note,
            id: e?.id,
            id_plan: e?.id_plan,
            purchases_order_item_id: e?.purchases_order_item_id,
        };
    });

    const newDataOption = dataOption?.filter((e) => e?.item !== undefined);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        const check = newDataOption.some(
            (e) =>
                e?.price == 0 || e?.price == "" || e?.quantity == 0 || e?.quantity == ""
        );
        if (optionType == "0") {
            if (idSupplier == null || idStaff == null || idBranch == null || check) {
                idSupplier == null && sErrSupplier(true);
                idStaff == null && sErrStaff(true);
                idBranch == null && sErrBranch(true);
                isShow("error", `${dataLang?.required_field_null}`);
            } else {
                sOnSending(true);
            }
        } else {
            if (idSupplier == null || idStaff == null || idBranch == null || check) {
                idSupplier == null && sErrSupplier(true);
                idStaff == null && sErrStaff(true);
                idBranch == null && sErrBranch(true);
                // idPurchases?.length == 0 && sErrPurchase(true);
                isShow("error", `${dataLang?.required_field_null}`);
            } else {
                sOnSending(true);
            }
        }
    };

    useEffect(() => {
        sErrSupplier(false);
    }, [idSupplier != null]);

    useEffect(() => {
        sErrStaff(false);
    }, [idStaff != null]);

    useEffect(() => {
        sErrBranch(false);
    }, [idBranch != null]);

    useEffect(() => {
        sErrPurchase(false);
    }, [idPurchases?.length > 0]);

    const _HandleSeachApi = debounce(async (inputValue) => {
        if (optionType === "0" && idBranch != null) {
            let form = new FormData();
            form.append(`branch_id[]`, +idBranch?.value ? +idBranch?.value : "");
            form.append(`term`, inputValue);
            form.append(`id_suppliers`, idSupplier?.value ?? "");
            const { data } = await apiOrder.apiSearchProductItems(form);
            sDataItems(data?.result);
        } else {
            return;
        }
    }, 500);

    const hiddenOptions = idPurchases?.length > 3 ? idPurchases?.slice(0, 3) : [];

    const fakeDataPurchases =
        idBranch != null
            ? dataPurchases.filter((x) => !hiddenOptions.includes(x.value))
            : [];

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    };

    const _HandleChangeInputOption = (id, type, index3, value) => {
        const index = sortedArr.findIndex((x) => x.id === id);
        if (type == "items") {
            if (sortedArr[index].items) {
                sortedArr[index].items = value;
                sortedArr[index].unit = value?.e?.unit_name;
                sortedArr[index].quantity = idPurchases?.length
                    ? Number(value?.e?.quantity_left)
                    : 1;
                sortedArr[index].total =
                    Number(sortedArr[index].affterDiscount) *
                    (1 + Number(0) / 100) *
                    Number(sortedArr[index].quantity);
            } else {
                let moneyClient = 0;
                if (value.e?.tax?.tax_rate == undefined) {
                    moneyClient =
                        Number(1) * (1 + Number(0) / 100) * Number(value?.e?.quantity_left);
                } else {
                    moneyClient =
                        Number(value?.e?.affterDiscount) *
                        (1 + Number(value?.e?.tax?.tax_rate) / 100) *
                        Number(value?.e?.quantity);
                }
                const newData = {
                    id: Date.now(),
                    items: value,
                    unit: value?.e?.unit_name,
                    quantity: idPurchases?.length ? Number(value?.e?.quantity_left) : 1,
                    price: value?.e?.price,
                    discount: discount ? discount : 0,
                    affterDiscount: 1,
                    tax: tax ? tax : 0,
                    priceAffterTax: 1,
                    total: moneyClient.toFixed(2),
                    note: "",
                };
                if (newData.discount) {
                    newData.affterDiscount *= 1 - Number(newData.discount) / 100;
                }
                if (newData.tax?.e?.tax_rate == undefined) {
                    const money =
                        Number(newData.affterDiscount) *
                        (1 + Number(0) / 100) *
                        Number(newData.quantity);
                    newData.total = Number(money.toFixed(2));
                } else {
                    const money =
                        Number(newData.affterDiscount) *
                        (1 + Number(newData.tax?.e?.tax_rate) / 100) *
                        Number(newData.quantity);
                    newData.total = Number(money.toFixed(2));
                }
                sortedArr.push(newData);
            }
        } else if (type == "unit") {
            sortedArr[index].unit = value.target?.value;
        } else if (type === "quantity") {
            sortedArr[index].quantity = Number(value?.value);
            if (sortedArr[index].tax?.tax_rate == undefined) {
                const money =
                    Number(sortedArr[index].affterDiscount) *
                    (1 + Number(0) / 100) *
                    Number(sortedArr[index].quantity);
                sortedArr[index].total = Number(money.toFixed(2));
            } else {
                const money =
                    Number(sortedArr[index].affterDiscount) *
                    (1 + Number(sortedArr[index].tax?.tax_rate) / 100) *
                    Number(sortedArr[index].quantity);
                sortedArr[index].total = Number(money.toFixed(2));
            }
            setSortedArr([...sortedArr]);
        } else if (type == "price") {
            sortedArr[index].price = Number(value.value);
            sortedArr[index].affterDiscount =
                +sortedArr[index].price * (1 - sortedArr[index].discount / 100);
            sortedArr[index].affterDiscount = +(
                Math.round(sortedArr[index].affterDiscount + "e+2") + "e-2"
            );
            if (sortedArr[index].tax?.tax_rate == undefined) {
                const money =
                    Number(sortedArr[index].affterDiscount) *
                    (1 + Number(0) / 100) *
                    Number(sortedArr[index].quantity);
                sortedArr[index].total = Number(money.toFixed(2));
            } else {
                const money =
                    Number(sortedArr[index].affterDiscount) *
                    (1 + Number(sortedArr[index].tax?.tax_rate) / 100) *
                    Number(sortedArr[index].quantity);
                sortedArr[index].total = Number(money.toFixed(2));
            }
        } else if (type == "discount") {
            sortedArr[index].discount = Number(value.value);
            sortedArr[index].affterDiscount =
                +sortedArr[index].price * (1 - sortedArr[index].discount / 100);
            sortedArr[index].affterDiscount = +(
                Math.round(sortedArr[index].affterDiscount + "e+2") + "e-2"
            );
            if (sortedArr[index].tax?.tax_rate == undefined) {
                const money =
                    Number(sortedArr[index].affterDiscount) *
                    (1 + Number(0) / 100) *
                    Number(sortedArr[index].quantity);
                sortedArr[index].total = Number(money.toFixed(2));
            } else {
                const money =
                    Number(sortedArr[index].affterDiscount) *
                    (1 + Number(sortedArr[index].tax?.tax_rate) / 100) *
                    Number(sortedArr[index].quantity);
                sortedArr[index].total = Number(money.toFixed(2));
            }
        } else if (type == "tax") {
            sortedArr[index].tax = value;
            if (sortedArr[index].tax?.tax_rate == undefined) {
                const money =
                    Number(sortedArr[index].affterDiscount) *
                    (1 + Number(0) / 100) *
                    Number(sortedArr[index].quantity);
                sortedArr[index].total = Number(money.toFixed(2));
            } else {
                const money =
                    Number(sortedArr[index].affterDiscount) *
                    (1 + Number(sortedArr[index].tax?.tax_rate) / 100) *
                    Number(sortedArr[index].quantity);
                sortedArr[index].total = Number(money.toFixed(2));
            }
        } else if (type == "note") {
            sortedArr[index].note = value?.target?.value;
        }
        setSortedArr([...sortedArr]);
    };
    const handleIncrease = (id) => {
        const index = sortedArr.findIndex((x) => x.id === id);
        const newQuantity = sortedArr[index].quantity + 1;
        sortedArr[index].quantity = newQuantity;
        if (sortedArr[index].tax?.tax_rate == undefined) {
            const money =
                Number(sortedArr[index].affterDiscount) *
                (1 + Number(0) / 100) *
                Number(sortedArr[index].quantity);
            sortedArr[index].total = Number(money.toFixed(2));
        } else {
            const money =
                Number(sortedArr[index].affterDiscount) *
                (1 + Number(sortedArr[index].tax?.tax_rate) / 100) *
                Number(sortedArr[index].quantity);
            sortedArr[index].total = Number(money.toFixed(2));
        }
        setSortedArr([...sortedArr]);
    };

    const handleDecrease = (id) => {
        const index = sortedArr.findIndex((x) => x.id === id);
        const newQuantity = Number(sortedArr[index].quantity) - 1;
        if (newQuantity >= 1) {
            // chỉ giảm số lượng khi nó lớn hơn hoặc bằng 1
            sortedArr[index].quantity = Number(newQuantity);
            if (sortedArr[index].tax?.tax_rate == undefined) {
                const money =
                    Number(sortedArr[index].affterDiscount) *
                    (1 + Number(0) / 100) *
                    Number(sortedArr[index].quantity);
                sortedArr[index].total = Number(money.toFixed(2));
            } else {
                const money =
                    Number(sortedArr[index].affterDiscount) *
                    (1 + Number(sortedArr[index].tax?.tax_rate) / 100) *
                    Number(sortedArr[index].quantity);
                sortedArr[index].total = Number(money.toFixed(2));
            }
            setSortedArr([...sortedArr]);
        } else {
            return isShow("error", `${"Số lượng tối thiểu"}`);
        }
    };
    const _HandleDelete = (id) => {
        const newOption = sortedArr.filter((x) => x.id !== id);
        setSortedArr(newOption);
    };

    const taxOptions = [
        { label: "Miễn thuế", value: "0", tax_rate: "0" },
        ...dataTasxes,
    ];

    const caculateMoney = (option) => {
        const total = sortedArr.reduce(
            (accumulator, currentValue) =>
                accumulator + currentValue?.price * currentValue?.quantity,
            0
        );

        const totalDiscount = sortedArr.reduce((acc, item) => {
            const caculate = item?.price * (item?.discount / 100) * item?.quantity;

            return acc + caculate;
        }, 0);

        const totalAfftertDiscount = sortedArr.reduce((acc, item) => {
            const caculate = item?.quantity * item?.affterDiscount;

            return acc + caculate;
        }, 0);

        const totalTax = sortedArr.reduce((acc, item) => {
            const caculate =
                item?.affterDiscount *
                (isNaN(item?.tax?.tax_rate) ? 0 : item?.tax?.tax_rate / 100) *
                item?.quantity;
            return acc + caculate;
        }, 0);

        const totalMoney = sortedArr.reduce((acc, item) => acc + item?.total, 0);

        return {
            total: total || 0,
            totalDiscount: totalDiscount || 0,
            totalAfftertDiscount: totalAfftertDiscount || 0,
            totalTax: totalTax || 0,
            totalMoney: totalMoney || 0,
        };
    };

    const [totalMoney, setTotalMoney] = useState({
        total: 0,
        totalDiscount: 0,
        totalAfftertDiscount: 0,
        totalTax: 0,
        totalMoney: 0,
    });

    useEffect(() => {
        const totalMoney = caculateMoney(option);
        setTotalMoney(totalMoney);
    }, [sortedArr]);

    const _ServerSending = async () => {
        let formData = new FormData();
        formData.append("code", code);
        formData.append(
            "date",
            formatMoment(startDate, FORMAT_MOMENT.DATE_TIME_LONG)
        );
        formData.append(
            "delivery_date",
            formatMoment(delivery_dateNew, FORMAT_MOMENT.DATE_LONG)
        );
        formData.append("suppliers_id", idSupplier.value);
        formData.append("order_type ", optionType);
        formData.append("branch_id", idBranch.value);
        formData.append("staff_id", idStaff.value);
        formData.append("note", note);
        if (optionType === "1") {
            idPurchases?.map((e, index) => {
                return formData.append(`purchase[${index}][id]`, e?.value);
            });
        }
        newDataOption.forEach((item, index) => {
            formData.append(
                `items[${index}][purchases_item_id]`,
                item?.purchases_item_id != undefined ? item?.purchases_item_id : ""
            );
            formData.append(
                `items[${index}][purchases_order_item_id]`,
                item?.purchases_order_item_id != undefined
                    ? item?.purchases_order_item_id
                    : ""
            );
            formData.append(
                `items[${index}][id_plan]`,
                item?.id_plan ? item?.id_plan : "0"
            );
            formData.append(`items[${index}][item]`, item?.item);
            formData.append(`items[${index}][id]`, router.query?.id ? item?.id : "");
            formData.append(`items[${index}][quantity]`, item?.quantity.toString());
            formData.append(`items[${index}][price]`, item?.price);
            formData.append(
                `items[${index}][discount_percent]`,
                item?.discount_percent
            );
            formData.append(
                `items[${index}][tax_id]`,
                item?.tax_id != undefined ? item?.tax_id : ""
            );
            formData.append(
                `items[${index}][note]`,
                item?.note != undefined ? item?.note : ""
            );
        });
        try {
            const { isSuccess, message } = await apiOrder.apiHandingOrder(
                id,
                formData
            );
            if (isSuccess) {
                isShow("success", dataLang[message] || message);
                sCode("");
                sStartDate(new Date());
                sDelivery_dateNew(new Date());
                sIdStaff(null);
                sIdSupplier(null);
                sIdBranch(null);
                sOptionType("0");
                sIdPurchases([]);
                sNote("");
                sErrBranch(false);
                sErrDate(false);
                sErrPurchase(false);
                sErrSupplier(false);
                sOption([
                    {
                        id: Date.now(),
                        items: null,
                        unit: "",
                        quantity: 0,
                        note: "",
                    },
                ]);
                setSortedArr([]);
                router.push(routerOrder.home);
            } else {
                if (totalMoney.total == 0) {
                    isShow("error", `Chưa nhập thông tin mặt hàng`);
                } else {
                    isShow("error", dataLang[message] || message);
                }
            }
        } catch (error) { }
        sOnSending(false);
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleSelectAll = () => {
        const newData = dataItems.map((item, index) => {
            let money = 0;
            if (item.tax?.tax_rate == undefined) {
                money = Number(1) * (1 + Number(0) / 100) * Number(item?.quantity_left);
            } else {
                money =
                    Number(item?.affterDiscount) *
                    (1 + Number(item.tax?.tax_rate) / 100) *
                    Number(item.quantity);
            }

            return {
                id: Date.now() + index,
                items: {
                    label: `${item?.name} <span style={{display: none}}>${item?.code}</span><span style={{display: none}}>${item?.product_variation} </span><span style={{display: none}}>${item?.text_type} ${item?.unit_name} </span>`,
                    value: item?.id,
                    e: item,
                },
                unit: item?.unit_name,
                quantity: idPurchases?.length ? Number(item?.quantity_left) : 1,
                price: 1,
                discount: discount ? discount : 0,
                affterDiscount: 1,
                tax: tax ? tax : 0,
                priceAffterTax: 1,
                total: Number(money.toFixed(2)),
                note: "",
            };
        });
        sItemAll(newData);
        setSortedArr(newData);
    };

    const changeItem = (e) => {
        // const price = Number(e?.e?.price);
        // sortedArr[index].affterDiscount = +price * (1 - (discount ? discount : 0) / 100);
        // sortedArr[index].affterDiscount = +(Math.round(sortedArr[index].affterDiscount + "e+2") + "e-2");
        // if (sortedArr[index].tax?.tax_rate == undefined) {
        //     const money = Number(sortedArr[index].affterDiscount) * (1 + Number(0) / 100) * Number(sortedArr[index].quantity);
        //     sortedArr[index].total = Number(money.toFixed(2));
        // } else {
        //     const money =
        //         Number(sortedArr[index].affterDiscount) *
        //         (1 + Number(sortedArr[index].tax?.tax_rate) / 100) *
        //         Number(sortedArr[index].quantity);
        //     sortedArr[index].total = Number(money.toFixed(2));
        // }
        // const money = Number(e?.e?.affterDiscount) * (1 + Number(0) / 100) * Number(e?.e?.quantity_left);
        // // Number(money.toFixed(2))
        // console.log("money", money);
        let moneyClient = 0;
        if (e.e?.tax?.tax_rate == undefined) {
            moneyClient =
                Number(1) * (1 + Number(0) / 100) * Number(e?.e?.quantity_left);
        } else {
            moneyClient =
                Number(e?.e?.affterDiscount) *
                (1 + Number(e?.e?.tax?.tax_rate) / 100) *
                Number(e?.e?.quantity);
        }

        setSortedArr([
            ...sortedArr,
            {
                ...e?.e,
                id: Date.now(),
                items: e,
                unit: e?.e?.unit_name,
                quantity: idPurchases?.length ? Number(e?.e?.quantity_left) : 1,
                price: e?.e?.price,
                discount: discount ? discount : 0,
                affterDiscount: 1,
                tax: tax ? tax : 0,
                priceAffterTax: 1,
                total: Number(moneyClient.toFixed(2)),
                note: "",
            },
        ]);
    };

    const breadcrumbItems = [
        {
            label: `${dataLang?.purchase_purchase || "purchase_purchase"}`,
            // href: "/",
        },
        {
            label: `${"Đơn hàng mua (PO)"}`,
        },
        {
            label: `${"Thông tin đơn hàng mua (PO)"}`,
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>
                    {id
                        ? dataLang?.purchase_order_edit_order || "purchase_order_edit_order"
                        : dataLang?.purchase_order_add_order || "purchase_order_add_order"}
                </title>
            </Head>
            <Container className="!h-auto">
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <React.Fragment>
                        <Breadcrumb
                            items={breadcrumbItems}
                            className="3xl:text-sm 2xl:text-xs xl:text-[10px] lg:text-[10px]"
                        />
                    </React.Fragment>
                )}
                <div className="h-[97%] space-y-3 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <h2 className="text-title-section text-[#52575E] capitalize font-medium">
                            Thông tin đơn hàng mua (PO)
                        </h2>
                        <div className="flex items-center justify-end mr-2">
                            <ButtonBack
                                onClick={() => router.push(routerOrder.home)}
                                dataLang={dataLang}
                            />
                        </div>
                    </div>

                    <div className="w-full rounded ">
                        <div className="">
                            <h2 className="font-normal bg-[#ECF0F4] p-2">
                                {dataLang?.purchase_order_detail_general_informatione ||
                                    "purchase_order_detail_general_informatione"}
                            </h2>
                            <div className="grid items-center grid-cols-12 gap-3 mt-2">
                                <div className="col-span-3">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.purchase_order_table_code ||
                                            "purchase_order_table_code"}{" "}
                                    </label>
                                    <input
                                        value={code}
                                        onChange={_HandleChangeInput.bind(this, "code")}
                                        name="fname"
                                        type="text"
                                        placeholder={
                                            dataLang?.purchase_order_system_default ||
                                            "purchase_order_system_default"
                                        }
                                        className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                                    />
                                </div>

                                <div className="col-span-3">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.purchase_order_table_branch ||
                                            "purchase_order_table_branch"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <SelectComponent
                                        type="form"
                                        options={dataBranch}
                                        onChange={_HandleChangeInput.bind(this, "branch")}
                                        value={idBranch}
                                        isClearable={true}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={
                                            dataLang?.purchase_order_branch || "purchase_order_branch"
                                        }
                                        className={`${errBranch ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
                                        components={{ MultiValue }}
                                    />
                                    {errBranch && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.purchase_order_errBranch ||
                                                "purchase_order_errBranch"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-3">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.purchase_order_table_supplier}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <SelectComponent
                                        type="form"
                                        options={dataSupplier}
                                        onChange={_HandleChangeInput.bind(this, "supplier")}
                                        value={idSupplier}
                                        placeholder={
                                            dataLang?.purchase_order_supplier ||
                                            "purchase_order_supplier"
                                        }
                                        hideSelectedOptions={false}
                                        isClearable={true}
                                        className={`${errSupplier ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                        // components={{ MultiValue }}
                                        menuPortalTarget={document.body}
                                        closeMenuOnSelect={true}
                                    />
                                    {errSupplier && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.purchase_order_errSupplier ||
                                                "purchase_order_errSupplier"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-3">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.purchase_order_staff || "purchase_order_staff"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <SelectComponent
                                        type="form"
                                        options={dataStaff}
                                        onChange={_HandleChangeInput.bind(this, "staff")}
                                        value={idStaff}
                                        placeholder={
                                            dataLang?.purchase_order_staff || "purchase_order_staff"
                                        }
                                        hideSelectedOptions={false}
                                        isClearable={true}
                                        className={`${errStaff ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                        menuPortalTarget={document.body}
                                        closeMenuOnSelect={true}
                                    />
                                    {errStaff && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.purchase_order_errStaff ||
                                                "purchase_order_errStaff"}
                                        </label>
                                    )}
                                </div>
                                <div className="relative col-span-3">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.purchase_order_detail_day_vouchers ||
                                            "purchase_order_detail_day_vouchers"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex flex-row custom-date-picker">
                                        <DatePicker
                                            blur
                                            fixedHeight
                                            showTimeSelect
                                            selected={startDate}
                                            onSelect={(date) => sStartDate(date)}
                                            onChange={(e) => handleTimeChange(e)}
                                            placeholderText="DD/MM/YYYY HH:mm:ss"
                                            dateFormat="dd/MM/yyyy h:mm:ss aa"
                                            timeInputLabel={"Time: "}
                                            placeholder={
                                                dataLang?.price_quote_system_default ||
                                                "price_quote_system_default"
                                            }
                                            className={`border ${errDate
                                                ? "border-red-500"
                                                : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                } placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                                        />
                                        {startDate && (
                                            <>
                                                <MdClear
                                                    className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                    onClick={() => handleClearDate("startDate")}
                                                />
                                            </>
                                        )}
                                        <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                                    </div>
                                </div>
                                <div className="relative col-span-3">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.purchase_order_detail_delivery_date ||
                                            "purchase_order_detail_delivery_date"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex flex-row custom-date-picker">
                                        <DatePicker
                                            selected={delivery_dateNew}
                                            blur
                                            placeholderText="DD/MM/YYYY"
                                            dateFormat="dd/MM/yyyy"
                                            onSelect={(date) =>
                                                _HandleChangeInput("delivery_dateNew", date)
                                            }
                                            placeholder={
                                                dataLang?.price_quote_system_default ||
                                                "price_quote_system_default"
                                            }
                                            className={`${"focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                                        />
                                        {delivery_dateNew && (
                                            <>
                                                <MdClear
                                                    className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                    onClick={() => handleClearDateNew("delivery_dateNew")}
                                                />
                                            </>
                                        )}
                                        <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                                    </div>
                                </div>
                                {/* <div className="col-span-3">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"}{" "}
                                    </label>
                                    <div className="flex items-center gap-5">
                                        <div className="flex items-center ">
                                            <input
                                                onChange={_HandleChangeInput.bind(this, "optionType")}
                                                id="default-radio-1"
                                                type="radio"
                                                value="0"
                                                checked={optionType === "0" ? true : false}
                                                name="default-radio"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label
                                                for="default-radio-1"
                                                className="ml-2 text-sm font-normal text-gray-900 cursor-pointer dark:text-gray-300"
                                            >
                                                {dataLang?.purchase_order_new_booking || "purchase_order_new_booking"}
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                onChange={_HandleChangeInput.bind(this, "optionType")}
                                                checked={optionType === "1" ? true : false}
                                                id="default-radio-2"
                                                type="radio"
                                                value="1"
                                                name="default-radio"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label
                                                for="default-radio-2"
                                                className="ml-2 text-sm font-normal text-gray-900 cursor-pointer dark:text-gray-300"
                                            >
                                                {dataLang?.purchase_order_according_to_YCMH || "purchase_order_according_to_YCMH"}
                                            </label>
                                        </div>
                                    </div>
                                </div> */}
                                {/* {hidden && (
                                    <div className="col-span-3">
                                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                                            {dataLang?.purchase_order_purchase_requisition_form || "purchase_order_purchase_requisition_form"}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <SelectComponent
                                            type="form"
                                            options={fakeDataPurchases}
                                            components={{ MultiValue }}
                                            onChange={_HandleChangeInput.bind(this, "purchases")}
                                            value={idPurchases}
                                            placeholder={dataLang?.purchase_order_purchase_requisition_form || "purchase_order_purchase_requisition_form"}
                                            hideSelectedOptions={false}
                                            isClearable={true}
                                            className={`${errPurchase ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                            isSearchable={true}
                                            noOptionsMessage={() => "Không có dữ liệu"}
                                            menuPortalTarget={document.body}
                                            isMulti
                                        />
                                        {errPurchase && (
                                            <label className="text-sm text-red-500">
                                                {dataLang?.purchase_order_errYCMH || "purchase_order_errYCMH"}
                                            </label>
                                        )}
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>
                    <h2 className="font-normal bg-[#ECF0F4] p-2  ">
                        {dataLang?.purchase_order_purchase_item_information ||
                            "purchase_order_purchase_item_information"}
                    </h2>
                    <div className="pr-2">
                        <div className="grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10">
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px]  text-[#667085]   col-span-3    text-center    truncate font-[400]">
                                {dataLang?.purchase_order_purchase_from_item ||
                                    "purchase_order_purchase_from_item"}
                                {idPurchases?.length > 0 && (
                                    <SelectItemComponent
                                        options={[...options]}
                                        closeMenuOnSelect={false}
                                        dataLang={dataLang}
                                        onChange={_HandleChangeInput.bind(this, "itemAll")}
                                        value={null}
                                        isMulti
                                        maxShowMuti={0}
                                        components={{
                                            MenuList: (props) => (
                                                <MenuListClickAll
                                                    {...props}
                                                    onClickSelectAll={_HandleSelectAll.bind(this)}
                                                    onClickDeleteSelectAll={() => {
                                                        setSortedArr([]);
                                                        sItemAll([]);
                                                    }}
                                                />
                                            ),
                                            MultiValue,
                                        }}
                                        placeholder={
                                            dataLang?.import_click_items || "import_click_items"
                                        }
                                        className="rounded-md bg-white  2xl:text-[12px] xl:text-[13px] text-[12.5px] z-20"
                                        isSearchable={true}
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menu: {
                                                width: "100%",
                                            },
                                        }}
                                    />
                                )}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {dataLang?.purchase_order_purchase_from_unit ||
                                    "purchase_order_purchase_from_unit"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {dataLang?.purchase_quantity || "purchase_quantity"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {dataLang?.purchase_order_detail_unit_price ||
                                    "purchase_order_detail_unit_price"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {dataLang?.purchase_order_detail_discount ||
                                    "purchase_order_detail_discount"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-left    font-[400]">
                                {dataLang?.purchase_order_detail_after_discount ||
                                    "purchase_order_detail_after_discount"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {dataLang?.purchase_order_detail_tax ||
                                    "purchase_order_detail_tax"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-left    truncate font-[400]">
                                {dataLang?.purchase_order_detail_into_money ||
                                    "purchase_order_detail_into_money"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-left    truncate font-[400]">
                                {dataLang?.purchase_order_note || "purchase_order_note"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {dataLang?.purchase_order_table_operations ||
                                    "purchase_order_table_operations"}
                            </h4>
                        </div>
                    </div>
                    <Customscrollbar className="max-h-[400px] h-[400px]  overflow-auto pb-2">
                        <div className="w-full h-full">
                            <React.Fragment>
                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                    <div className="grid grid-cols-12 gap-1 py-1 ">
                                        <div className="col-span-3 my-auto">
                                            <SelectItemComponent
                                                onInputChange={(event) => {
                                                    _HandleSeachApi(event);
                                                }}
                                                options={options}
                                                onChange={(e) => {
                                                    changeItem(e);
                                                }}
                                                // isMulti
                                                // maxShowMuti={0}
                                                value={null}
                                                formatOptionLabel={(option) => (
                                                    <div className="flex items-center justify-between py-2">
                                                        <div className="flex items-center gap-2">
                                                            <div>
                                                                {option.e?.images != null ? (
                                                                    <img
                                                                        src={option.e?.images}
                                                                        alt="Product Image"
                                                                        style={{
                                                                            width: "40px",
                                                                            height: "50px",
                                                                        }}
                                                                        className="object-cover rounded"
                                                                    />
                                                                ) : (
                                                                    <div className="w-[50px] h-[60px] object-cover  flex items-center justify-center rounded">
                                                                        <img
                                                                            src="/icon/noimagelogo.png"
                                                                            alt="Product Image"
                                                                            style={{
                                                                                width: "40px",
                                                                                height: "40px",
                                                                            }}
                                                                            className="object-cover rounded"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                    {option.e?.name}
                                                                </h3>
                                                                <div className="flex gap-2">
                                                                    <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                        {option.e?.code}
                                                                    </h5>
                                                                    <h5 className="font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                        {option.e?.product_variation}
                                                                    </h5>
                                                                </div>
                                                                <h5
                                                                    className={`${optionType == "1"
                                                                        ? ""
                                                                        : "flex items-center gap-1"
                                                                        } text-gray-400 font-normal text-xs 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}
                                                                >
                                                                    {dataLang[option.e?.text_type]}{" "}
                                                                    {optionType == "1" ? "-" : ""}{" "}
                                                                    {optionType == "1"
                                                                        ? option.e?.purchases_code
                                                                        : ""}{" "}
                                                                    {optionType != "1" && (
                                                                        <>
                                                                            <h5>-</h5>
                                                                            <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                                {dataLang?.purchase_survive ||
                                                                                    "purchase_survive"}
                                                                                :
                                                                            </h5>
                                                                            <h5 className="text-black font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                                {option.e?.qty_warehouse
                                                                                    ? option.e?.qty_warehouse
                                                                                    : "0"}
                                                                            </h5>
                                                                        </>
                                                                    )}
                                                                </h5>
                                                                {optionType == "1" && (
                                                                    <div className="flex items-center gap-2 text-gray-400">
                                                                        <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                            Số lượng:
                                                                        </h5>
                                                                        <h5 className="text-black font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                            {formatNumber(option.e?.quantity_left)}
                                                                        </h5>
                                                                        {"-"}
                                                                        <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                            {dataLang?.purchase_survive ||
                                                                                "purchase_survive"}
                                                                            :
                                                                        </h5>
                                                                        <h5 className="text-black font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                            {option.e?.qty_warehouse
                                                                                ? formatNumber(option.e?.qty_warehouse)
                                                                                : "0"}
                                                                        </h5>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                placeholder={
                                                    dataLang?.purchase_items || "purchase_items"
                                                }
                                                hideSelectedOptions={false}
                                                className="rounded-md bg-white  xl:text-base text-[14.5px] z-20 mb-2"
                                                isSearchable={true}
                                                noOptionsMessage={() => "Không có dữ liệu"}
                                                styles={{
                                                    menu: {
                                                        width: "100%",
                                                    },
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-center col-span-1 text-center">
                                            <h3 className="2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                Cái
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-center col-span-1">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                                                    onClick={() => { }}
                                                    disabled
                                                >
                                                    <Minus size="16" />
                                                </button>
                                                <InPutNumericFormat
                                                    disabled
                                                    value={1}
                                                    isAllowed={isAllowedNumber}
                                                    className={`  appearance-none text-center 2xl:text-[12px] xl:text-[13px] text-[12.5px] py-2 px-0.5 font-normal 2xl:w-24 xl:w-[90px] w-[63px]  focus:outline-none border-b-2 border-gray-200`}
                                                />
                                                <button
                                                    className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                                                    onClick={() => { }}
                                                    disabled
                                                >
                                                    <Add size="16" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center col-span-1 text-center">
                                            <InPutMoneyFormat
                                                value={1}
                                                disabled
                                                className={` appearance-none 2xl:text-[12px] xl:text-[13px] text-[12.5px] text-center py-1 px-2 font-normal w-[80%] focus:outline-none border-b-2 border-gray-200`}
                                            />
                                        </div>
                                        <div className="flex items-center justify-center col-span-1 text-center">
                                            <InPutNumericFormat
                                                value={1}
                                                disabled
                                                className="appearance-none text-center py-1 px-2 font-normal w-[80%]  focus:outline-none border-b-2 2xl:text-[12px] xl:text-[13px] text-[12.5px] border-gray-200"
                                                isAllowed={isAllowedDiscount}
                                            />
                                        </div>
                                        <div className="flex items-center justify-end col-span-1 text-right">
                                            <h3 className="px-2 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                1
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-center col-span-1">
                                            <SelectItemComponent
                                                options={[]}
                                                disabled
                                                placeholder={"% Thuế"}
                                                hideSelectedOptions={false}
                                                className={` "border-transparent placeholder:text-slate-300 w-full 2xl:text-[12px] xl:text-[13px] text-[12.5px] z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                                                isSearchable={true}
                                                noOptionsMessage={() => "Không có dữ liệu"}
                                            />
                                        </div>
                                        <div className="flex items-center justify-end col-span-1 text-right">
                                            <h3 className="px-2 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                1
                                            </h3>
                                            {/* <h3 className='px-2'>{formatNumber(e?.affterDiscount * (1 + Number(e?.tax?.tax_rate || 0) / 100) * e?.quantity)}</h3> */}
                                        </div>
                                        <div className="flex items-center justify-center col-span-1">
                                            <input
                                                disabled
                                                name="optionEmail"
                                                placeholder="Ghi chú"
                                                type="text"
                                                className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12.5px]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                            />
                                        </div>
                                        <div className="flex items-center justify-center col-span-1">
                                            <button
                                                type="button"
                                                title="Xóa"
                                                onClick={() => {
                                                    isShow("error", `${"Mặc định hệ thống, không xóa"}`);
                                                }}
                                                className="transition  w-full bg-slate-100 h-10 rounded-[5.5px] text-red-500 flex flex-col justify-center items-center mb-2"
                                            >
                                                <IconDelete />
                                            </button>
                                        </div>
                                    </div>
                                    {sortedArr.map((e, index) => (
                                        <div className="grid grid-cols-12 gap-1 py-1 " key={e?.id}>
                                            <div className="col-span-3 my-auto">
                                                <SelectItemComponent
                                                    onInputChange={(event) => {
                                                        _HandleSeachApi(event);
                                                    }}
                                                    options={options}
                                                    onChange={_HandleChangeInputOption.bind(
                                                        this,
                                                        e?.id,
                                                        "items",
                                                        index
                                                    )}
                                                    value={e?.items}
                                                    formatOptionLabel={(option) => (
                                                        <div className="flex items-center justify-between py-2">
                                                            <div className="flex items-center gap-2">
                                                                <div>
                                                                    {option.e?.images != null ? (
                                                                        <img
                                                                            src={option.e?.images}
                                                                            alt="Product Image"
                                                                            style={{
                                                                                width: "40px",
                                                                                height: "50px",
                                                                            }}
                                                                            className="object-cover rounded"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-[50px] h-[60px] object-cover  flex items-center justify-center rounded">
                                                                            <img
                                                                                src="/icon/noimagelogo.png"
                                                                                alt="Product Image"
                                                                                style={{
                                                                                    width: "40px",
                                                                                    height: "40px",
                                                                                }}
                                                                                className="object-cover rounded"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                        {option.e?.name}
                                                                    </h3>
                                                                    <div className="flex gap-2">
                                                                        <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                            {option.e?.code}
                                                                        </h5>
                                                                        <h5 className="font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                            {option.e?.product_variation}
                                                                        </h5>
                                                                    </div>
                                                                    <h5
                                                                        className={`${optionType == "1"
                                                                            ? ""
                                                                            : "flex items-center gap-1"
                                                                            } text-gray-400 font-normal text-xs 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}
                                                                    >
                                                                        {dataLang[option.e?.text_type]}{" "}
                                                                        {optionType == "1" ? "-" : ""}{" "}
                                                                        {optionType == "1"
                                                                            ? option.e?.purchases_code
                                                                            : ""}{" "}
                                                                        {optionType != "1" && (
                                                                            <>
                                                                                <h5>-</h5>
                                                                                <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                                    {dataLang?.purchase_survive ||
                                                                                        "purchase_survive"}
                                                                                    :
                                                                                </h5>
                                                                                <h5 className="text-black font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                                    {option.e?.qty_warehouse
                                                                                        ? option.e?.qty_warehouse
                                                                                        : "0"}
                                                                                </h5>
                                                                            </>
                                                                        )}
                                                                    </h5>
                                                                    {optionType == "1" && (
                                                                        <div className="flex items-center gap-2 text-gray-400">
                                                                            <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                                Số lượng:
                                                                            </h5>
                                                                            <h5 className="text-black font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                                {formatNumber(option.e?.quantity_left)}
                                                                            </h5>
                                                                            {"-"}
                                                                            <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                                {dataLang?.purchase_survive ||
                                                                                    "purchase_survive"}
                                                                                :
                                                                            </h5>
                                                                            <h5 className="text-black font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                                {option.e?.qty_warehouse
                                                                                    ? formatNumber(
                                                                                        option.e?.qty_warehouse
                                                                                    )
                                                                                    : "0"}
                                                                            </h5>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    placeholder={
                                                        dataLang?.purchase_items || "purchase_items"
                                                    }
                                                    hideSelectedOptions={false}
                                                    className="rounded-md bg-white  xl:text-base text-[14.5px] z-20 mb-2"
                                                    isSearchable={true}
                                                    noOptionsMessage={() => "Không có dữ liệu"}
                                                    styles={{
                                                        menu: {
                                                            width: "100%",
                                                        },
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-center col-span-1 text-center">
                                                <h3 className="2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                    {e?.unit}
                                                </h3>
                                            </div>
                                            <div className="flex items-center justify-center col-span-1">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                                                        onClick={() => handleDecrease(e?.id)}
                                                    >
                                                        <Minus size="16" />
                                                    </button>
                                                    <InPutNumericFormat
                                                        onValueChange={_HandleChangeInputOption.bind(
                                                            this,
                                                            e?.id,
                                                            "quantity",
                                                            e
                                                        )}
                                                        value={e?.quantity}
                                                        readOnly={false}
                                                        isAllowed={isAllowedNumber}
                                                        className={`
                                                        ${(e?.quantity == 0 &&
                                                                "border-red-500") ||
                                                            (e?.quantity == "" &&
                                                                "border-red-500")
                                                            } 
                                                        appearance-none text-center 2xl:text-[12px] xl:text-[13px] text-[12.5px] py-2 px-0.5 font-normal 2xl:w-24 xl:w-[90px] w-[63px]  focus:outline-none border-b-2 border-gray-200`}
                                                    />
                                                    <button
                                                        className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                                                        onClick={() => handleIncrease(e.id)}
                                                    >
                                                        <Add size="16" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center col-span-1 text-center">
                                                <InPutMoneyFormat
                                                    value={e?.price}
                                                    onValueChange={_HandleChangeInputOption.bind(
                                                        this,
                                                        e?.id,
                                                        "price",
                                                        index
                                                    )}
                                                    readOnly={false}
                                                    className={`${(e?.price == 0 && "border-red-500") ||
                                                        (e?.price == "" && "border-red-500")
                                                        } 
                                                appearance-none 2xl:text-[12px] xl:text-[13px] text-[12.5px] text-center py-1 px-2 font-normal w-[80%] focus:outline-none border-b-2 border-gray-200`}
                                                />
                                            </div>
                                            <div className="flex items-center justify-center col-span-1 text-center">
                                                <InPutNumericFormat
                                                    value={e?.discount}
                                                    onValueChange={_HandleChangeInputOption.bind(
                                                        this,
                                                        e?.id,
                                                        "discount",
                                                        index
                                                    )}
                                                    className="appearance-none text-center py-1 px-2 font-normal w-[80%]  focus:outline-none border-b-2 2xl:text-[12px] xl:text-[13px] text-[12.5px] border-gray-200"
                                                    isAllowed={isAllowedDiscount}
                                                />
                                            </div>
                                            <div className="flex items-center justify-end col-span-1 text-right">
                                                <h3 className="px-2 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                    {formatNumber(e?.affterDiscount || 1)}
                                                </h3>
                                            </div>
                                            <div className="flex items-center justify-center col-span-1">
                                                <SelectItemComponent
                                                    options={taxOptions}
                                                    onChange={_HandleChangeInputOption.bind(
                                                        this,
                                                        e?.id,
                                                        "tax",
                                                        index
                                                    )}
                                                    value={
                                                        e?.tax
                                                            ? {
                                                                label: taxOptions.find(
                                                                    (item) => item.value === e?.tax?.value
                                                                )?.label,
                                                                value: e?.tax?.value,
                                                                tax_rate: e?.tax?.tax_rate,
                                                            }
                                                            : null
                                                    }
                                                    placeholder={"% Thuế"}
                                                    hideSelectedOptions={false}
                                                    formatOptionLabel={(option) => (
                                                        <div className="flex items-center justify-start gap-1 ">
                                                            <h2 className="2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                {option?.label}
                                                            </h2>
                                                            <h2 className="2xl:text-[12px] xl:text-[13px] text-[12.5px]">{`(${option?.tax_rate})`}</h2>
                                                        </div>
                                                    )}
                                                    className={` "border-transparent placeholder:text-slate-300 w-full 2xl:text-[12px] xl:text-[13px] text-[12.5px] z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                                                    isSearchable={true}
                                                    noOptionsMessage={() => "Không có dữ liệu"}
                                                />
                                            </div>
                                            <div className="flex items-center justify-end col-span-1 text-right">
                                                <h3 className="px-2 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                    {formatNumber(e?.total)}
                                                </h3>
                                                {/* <h3 className='px-2'>{formatNumber(e?.affterDiscount * (1 + Number(e?.tax?.tax_rate || 0) / 100) * e?.quantity)}</h3> */}
                                            </div>
                                            <div className="flex items-center justify-center col-span-1">
                                                <input
                                                    value={e?.note}
                                                    onChange={_HandleChangeInputOption.bind(
                                                        this,
                                                        e?.id,
                                                        "note",
                                                        index
                                                    )}
                                                    name="optionEmail"
                                                    placeholder="Ghi chú"
                                                    type="text"
                                                    className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12.5px]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                                />
                                            </div>
                                            <div className="flex items-center justify-center col-span-1">
                                                <button
                                                    onClick={_HandleDelete.bind(this, e?.id)}
                                                    type="button"
                                                    title="Xóa"
                                                    className="transition  w-full bg-slate-100 h-10 rounded-[5.5px] text-red-500 flex flex-col justify-center items-center mb-2"
                                                >
                                                    <IconDelete />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </React.Fragment>
                        </div>
                    </Customscrollbar>
                    <div className="grid grid-cols-12 mb-3 font-normal bg-[#ecf0f475] p-2 items-center">
                        <div className="flex items-center col-span-2 gap-2">
                            <h2>
                                {dataLang?.purchase_order_detail_discount ||
                                    "purchase_order_detail_discount"}
                            </h2>
                            <div className="flex items-center justify-center col-span-1 text-center">
                                <InPutNumericFormat
                                    value={discount}
                                    isAllowed={isAllowedDiscount}
                                    onValueChange={_HandleChangeInput.bind(this, "discount")}
                                    className="w-20 px-2 py-1 font-normal text-center bg-transparent border-b-2 border-gray-300 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-center col-span-5 gap-2">
                            <h2 className="col-span-1">
                                {dataLang?.purchase_order_detail_tax ||
                                    "purchase_order_detail_tax"}
                            </h2>
                            <div className="col-span-4">
                                <SelectComponent
                                    type="form"
                                    options={taxOptions}
                                    onChange={_HandleChangeInput.bind(this, "tax")}
                                    value={tax}
                                    formatOptionLabel={(option) => (
                                        <div className="flex items-center justify-start gap-1 ">
                                            <h2>{option?.label}</h2>
                                            <h2>{`(${option?.tax_rate})`}</h2>
                                        </div>
                                    )}
                                    placeholder={
                                        dataLang?.purchase_order_detail_tax ||
                                        "purchase_order_detail_tax"
                                    }
                                    hideSelectedOptions={false}
                                    className={` "border-transparent placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                                    isSearchable={true}
                                    noOptionsMessage={() => "Không có dữ liệu"}
                                    dangerouslySetInnerHTML={{
                                        __html: option.label,
                                    }}
                                    menuPortalTarget={document.body}
                                    closeMenuOnSelect={true}
                                    style={{
                                        border: "none",
                                        boxShadow: "none",
                                        outline: "none",
                                    }}
                                    theme={(theme) => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            primary25: "#EBF5FF",
                                            primary50: "#92BFF7",
                                            primary: "#0F4F9E",
                                        },
                                    })}
                                    styles={{
                                        placeholder: (base) => ({
                                            ...base,
                                            color: "#cbd5e1",
                                        }),
                                        menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 20,
                                        }),
                                        control: (base, state) => ({
                                            ...base,
                                            boxShadow: "none",
                                            padding: "2.7px",
                                            ...(state.isFocused && {
                                                border: "0 0 0 1px #92BFF7",
                                            }),
                                        }),
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <h2 className="font-normal bg-[white]  p-2 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]">
                        {dataLang?.purchase_order_table_total_outside ||
                            "purchase_order_table_total_outside"}{" "}
                    </h2>
                </div>
                <div className="grid grid-cols-12">
                    <div className="col-span-9">
                        <div className="text-[#344054] font-normal text-sm mb-1 ">
                            {dataLang?.purchase_order_note || "purchase_order_note"}
                        </div>
                        <textarea
                            value={note}
                            placeholder={
                                dataLang?.purchase_order_note || "purchase_order_note"
                            }
                            onChange={_HandleChangeInput.bind(this, "note")}
                            name="fname"
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-[40%] min-h-[220px] max-h-[220px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                        />
                    </div>
                    <div className="flex-col justify-between col-span-3 mt-5 space-y-4 text-right ">
                        <div className="flex justify-between "></div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>
                                    {dataLang?.purchase_order_table_total ||
                                        "purchase_order_table_total"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {formatMoney(totalMoney.total)}
                                </h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>
                                    {dataLang?.purchase_order_detail_discounty ||
                                        "purchase_order_detail_discounty"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {formatMoney(totalMoney.totalDiscount)}
                                </h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>
                                    {dataLang?.purchase_order_detail_money_after_discount ||
                                        "purchase_order_detail_money_after_discount"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {formatMoney(totalMoney.totalAfftertDiscount)}
                                </h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>
                                    {dataLang?.purchase_order_detail_tax_money ||
                                        "purchase_order_detail_tax_money"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {formatMoney(totalMoney.totalTax)}
                                </h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>
                                    {dataLang?.purchase_order_detail_into_money ||
                                        "purchase_order_detail_into_money"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {formatMoney(totalMoney.totalMoney)}
                                </h3>
                            </div>
                        </div>
                        <div className="space-x-2">
                            <ButtonBack
                                onClick={() => router.push(routerOrder.home)}
                                dataLang={dataLang}
                            />
                            <ButtonSubmit
                                onClick={_HandleSubmit.bind(this)}
                                dataLang={dataLang}
                                loading={onSending}
                            />
                        </div>
                    </div>
                </div>
            </Container>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE_ITEMS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={resetValue}
                nameModel={"change_item"}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};

export default OrderForm;
