import Head from "next/head";
import moment from "moment";
import DatePicker from "react-datepicker";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MdClear } from "react-icons/md";
import { BsCalendarEvent } from "react-icons/bs";
import { NumericFormat } from "react-number-format";
import { _ServerInstance as Axios } from "/services/axios";
import { Trash as IconDelete, Add, Minus } from "iconsax-react";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";

import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from "@/constants/delete/deleteItems";
import { routerPriceQuote } from "@/routers/sellingGoods";
import { debounce } from "lodash";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import useSetingServer from "@/hooks/useConfigNumber";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import MultiValue from "@/components/UI/mutiValue/multiValue";

const Index = (props) => {
    const router = useRouter();

    const id = router.query?.id;

    const isShow = useToast();

    const dataSeting = useSetingServer()

    const { isOpen, handleQueryId } = useToggle();

    const dataLang = props?.dataLang;

    const [onFetching, sOnFetching] = useState(false);

    const [onFetchingItems, sOnFetchingItems] = useState(false);

    const [onFetchingDetail, sOnFetchingDetail] = useState(false);

    const [onFetchingCustomer, sOnFetchingCustomer] = useState(false);

    const [onFetchingContactPerson, sOnFetchingContactPerson] = useState(false);

    const [onSending, sOnSending] = useState(false);

    const [option, sOption] = useState([
        {
            id: Date.now(),
            item: null,
            unit: 1,
            quantity: 1,
            price: 1,
            discount: 0,
            priceAffter: 1,
            taxStages: 0,
            dgsautaxStages: 1,
            totalPrice: 1,
            note: "",
            price_quote_order_item_id: "",
        },
    ]);
    const slicedArr = option.slice(1);

    const sortedArr = id ? slicedArr.sort((a, b) => a.id - b.id) : slicedArr.sort((a, b) => b.id - a.id);

    sortedArr.unshift(option[0]);

    const [dataCustomer, sDataCustomer] = useState([]);

    const [dataPersonContact, sDataContactPerson] = useState([]);

    const [dataEditItems, sDataEditItems] = useState([]);

    const [dataTasxes, sDataTasxes] = useState([]);

    const [dataBranch, sDataBranch] = useState([]);

    const [code, sCode] = useState("");

    const [note, sNote] = useState("");

    const [taxTotal, sTaxTotal] = useState();

    const [discounttong, sDiscounttong] = useState(0);

    const [startDate, sStartDate] = useState(new Date());

    const [effectiveDate, sEffectiveDate] = useState(null);

    const [idCustomer, sIdCustomer] = useState(null);

    const [idContactPerson, sIdContactPerson] = useState(null);

    const [idBranch, sIdBranch] = useState(null);

    const [errDate, sErrDate] = useState(false);

    const [errCustomer, sErrCustomer] = useState(false);

    const [errEffectiveDate, sErrEffectiveDate] = useState(false);

    const [errBranch, sErrBranch] = useState(false);

    const trangthaiExprired = useStatusExprired();

    const [tongTienState, setTongTienState] = useState({
        tongTien: 0,
        tienChietKhau: 0,
        tongTienSauCK: 0,
        tienThue: 0,
        tongThanhTien: 0,
    });

    const readOnlyFirst = true;

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    }

    useEffect(() => {
        router.query && sErrDate(false);
        router.query && sErrCustomer(false);
        router.query && sErrEffectiveDate(false);
        router.query && sErrBranch(false);
        router.query && sStartDate(new Date());
        router.query && sEffectiveDate(null);
        router.query && sNote("");
    }, [id, router.query]);

    // Fetch edit
    const _ServerFetchingDetail = () => {
        Axios("GET", `/api_web/Api_quotation/quotation/${id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const rResult = response.data;
                const itemlast = [{ item: null }];
                const items = itemlast?.concat(
                    rResult?.items?.map((e) => ({
                        price_quote_order_item_id: e?.id,
                        id: e.id,
                        item: {
                            e: e?.item,
                            label: `${e.item?.item_name} <span style={{display: none}}>${e.item?.code + e.item?.product_constiation + e.item?.text_type + e.item?.unit_name
                                }</span>`,
                            value: e.item?.id,
                        },
                        quantity: Number(e?.quantity),
                        price: Number(e?.price),
                        discount: Number(e?.discount_percent),
                        taxStages: { tax_rate: e?.tax_rate, value: e?.tax_id },
                        unit: e.item?.unit_name,
                        priceAffter: Number(e?.price_after_discount),
                        note: e?.note,
                        totalPrice: Number(e?.price_after_discount) * (1 + Number(e?.tax_rate) / 100) * Number(e?.quantity),
                    }))
                );

                sOption(items);
                sCode(rResult?.reference_no);
                sIdContactPerson(
                    rResult?.contact_id == 0 ? null :
                        {
                            label: rResult?.contact_name,
                            value: rResult?.contact_id,
                        });
                sIdBranch({
                    label: rResult?.branch_name,
                    value: rResult?.branch_id,
                });
                sIdCustomer({
                    label: rResult?.client_name,
                    value: rResult?.client_id,
                });
                sStartDate(moment(rResult?.date).toDate());
                sEffectiveDate(moment(rResult?.validity).toDate());
                sNote(rResult?.note);
            }
            sOnFetchingDetail(false);
        });
    };

    // onChange

    const resetValue = () => {
        sIdBranch();
        sOption([
            {
                id: Date.now(),
                item: null,
                unit: 1,
                quantity: 1,
                price: 1,
                discount: 0,
                priceAffter: 1,
                taxStages: 0,
                dgsautaxStages: 1,
                totalPrice: 1,
                note: "",
            },
        ]);
        handleQueryId({ status: false });
    };

    const _HandleChangeInput = (type, value) => {
        if (type === "code") {
            sCode(value.target.value);
        } else if (type === "customer" && value !== idCustomer) {
            sIdCustomer(value);
            sDataContactPerson([]);
            sIdContactPerson(null);
        } else if (type === "contactPerson") {
            sIdContactPerson(value);
        } else if (type === "note") {
            sNote(value.target.value);
        } else if (type === "branch") {
            if (sortedArr?.slice(1)?.length > 0) {
                handleQueryId({ status: true });

            } else if (value !== idBranch) {
                sIdBranch(value);
                sIdCustomer(null);
                sDataCustomer([]);
                sDataContactPerson([]);
                sIdContactPerson(null);
                sOption([
                    {
                        id: Date.now(),
                        item: null,
                        unit: 1,
                        quantity: 1,
                        price: 1,
                        discount: 0,
                        priceAffter: 1,
                        taxStages: 0,
                        dgsautaxStages: 1,
                        totalPrice: 1,
                        note: "",
                    },
                ]);
            }

        } else if (type === "taxTotal") {
            sTaxTotal(value);
        } else if (type === "discounttong") {
            sDiscounttong(value?.value);
        }
    };
    // fetch chi nhanh
    const convertArray = (arr) => {
        return arr?.map((e) => ({ label: e?.name, value: e?.id })) || [];
    }
    const _ServerFetching = () => {
        Axios("GET", "/api_web/Api_Branch/branch/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data;
                sDataBranch(convertArray(rResult));
            }
        });

        Axios("GET", "/api_web/Api_tax/tax?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data;
                sDataTasxes(
                    rResult?.map((e) => ({
                        label: e.name,
                        value: e.id,
                        tax_rate: e.tax_rate,
                    }))
                );
            }
        });

        sOnFetching(false);
    };

    // Customer
    const _ServerFetching_Customer = () => {
        Axios(
            "GET",
            `/api_web/api_client/client_option/?csrf_protection=true`,
            {
                params: {
                    "filter[branch_id]": idBranch != null ? idBranch?.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult } = response.data;
                    sDataCustomer(convertArray(rResult));
                }
            }
        );
        sOnFetchingCustomer(false);
    };
    // Contact person
    const _ServerFetching_Contact_Person = () => {
        Axios(
            "GET",
            `/api_web/api_client/contactCombobox/?csrf_protection=true`,
            {
                params: {
                    "filter[client_id]": idCustomer != null ? idCustomer.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult } = response.data;
                    sDataContactPerson(
                        rResult?.map((e) => ({
                            label: e.full_name,
                            value: e.id,
                        }))
                    );
                }
            }
        );
        sOnFetchingContactPerson(false);
    };

    // fetch items
    const _ServerFetching_Items = () => {
        let form = new FormData()
        if (idBranch != null) {
            [+idBranch?.value].forEach((e, index) => form.append(`branch_id[${index}]`, e))
        }
        Axios("POST", "/api_web/Api_product/searchItemsVariant/?csrf_protection=true", {
            data: form,
            headers: { "Content-Type": "multipart/form-data" },
        }, (err, response) => {
            if (!err) {
                const { result } = response.data.data;
                sDataEditItems(result);
            }
        });
        sOnFetchingItems(false);
    };

    // submit
    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (startDate == null || idCustomer == null || effectiveDate == null || idBranch == null) {
            startDate == null && sErrDate(true);
            idCustomer?.value == null && sErrCustomer(true);
            idBranch?.value == null && sErrBranch(true);
            effectiveDate == null && sErrEffectiveDate(true);
            isShow("error", `${dataLang?.required_field_null}`);
        } else {
            sOnSending(true);
        }
    };
    useEffect(() => {
        onFetchingDetail && _ServerFetchingDetail();
    }, [onFetchingDetail]);

    useEffect(() => {
        id && sOnFetchingDetail(true);
    }, []);

    useEffect(() => {
        if (taxTotal == null) return;
        sOption((prevOption) => {
            const newOption = [...prevOption];
            const taxValue = taxTotal?.tax_rate || 0;
            const discountValue = discounttong || 0;
            newOption.forEach((item, index) => {
                if (index === 0 || !item.id) return;
                const pricesaudiscount = item?.price * (1 - discountValue / 100);
                const totalAmount = pricesaudiscount * (1 + taxValue / 100) * item.quantity;
                item.taxStages = taxTotal;
                item.totalPrice = isNaN(totalAmount) ? 0 : totalAmount;
            });
            return newOption;
        });
    }, [taxTotal]);

    useEffect(() => {
        if (discounttong == null) return;
        sOption((prevOption) => {
            const newOption = [...prevOption];
            const taxValue = taxTotal?.tax_rate != undefined ? taxTotal?.tax_rate : 0;
            const discountValue = discounttong ? discounttong : 0;

            newOption.forEach((item, index) => {
                if (index === 0 || !item?.id) return;
                const pricesaudiscount = item?.price * (1 - discountValue / 100);
                const totalAmount = pricesaudiscount * (1 + taxValue / 100) * item.quantity;
                item.taxStages = taxTotal;
                item.discount = Number(discounttong);
                item.priceAffter = isNaN(pricesaudiscount) ? 0 : pricesaudiscount;
                item.totalPrice = isNaN(totalAmount) ? 0 : totalAmount;
            });
            return newOption;
        });
    }, [discounttong]);

    useEffect(() => {
        (idBranch === null && sDataCustomer([])) ||
            sIdCustomer(null) ||
            (idBranch === null && sDataContactPerson([])) ||
            sIdContactPerson(null);
    }, []);

    useEffect(() => {
        onFetchingCustomer && _ServerFetching_Customer();
    }, [onFetchingCustomer]);

    useEffect(() => {
        onFetchingContactPerson && _ServerFetching_Contact_Person();
    }, [onFetchingContactPerson]);

    useEffect(() => {
        idBranch != null && sOnFetchingCustomer(true);
        idBranch != null && sOnFetchingItems(true);
        if (idBranch == null) {
            sIdCustomer(null);
            sDataCustomer([]);
            sDataContactPerson([]);
            sIdContactPerson(null);
        }
    }, [idBranch]);

    useEffect(() => {
        idCustomer != null && sOnFetchingContactPerson(true);
    }, [idCustomer]);

    useEffect(() => {
        onFetchingItems && _ServerFetching_Items();
    }, [onFetchingItems]);

    const options = dataEditItems?.map((e) => ({
        label: `${e.name} <span style={{display: none}}>${e.code}</span><span style={{display: none}}>${e.product_constiation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
        value: e.id,
        e,
    }));

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        router.query && sOnFetching(true);
    }, [router.query]);

    useEffect(() => {
        sErrDate(false);
    }, [startDate != null]);
    useEffect(() => {
        sErrCustomer(false);
    }, [idCustomer != null]);

    useEffect(() => {
        sErrEffectiveDate(false);
    }, [effectiveDate != null]);
    useEffect(() => {
        sErrBranch(false);
    }, [idBranch != null]);

    // search
    const _HandleSeachApi = debounce((inputValue) => {
        if (idBranch == null) return
        let form = new FormData()
        if (idBranch != null) {
            [+idBranch?.value].forEach((e, index) => form.append(`branch_id[${index}]`, e))
        }
        form.append("term", inputValue)
        Axios(
            "POST",
            `/api_web/Api_product/searchItemsVariant/?csrf_protection=true`,
            {
                data: form,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { result } = response?.data.data;
                    setDataItems(result);
                }
            }
        );
    }, 500)


    // change items
    const _HandleChangeInputOption = (id, type, index3, value) => {
        const index = option.findIndex((x) => x.id === id);
        if (type == "item") {
            if (option[index].item) {
                option[index].item = value;
                option[index].unit = value?.e?.unit_name;
                option[index].quantity = 1;
                option[index].totalPrice =
                    Number(option[index].priceAffter) * (1 + Number(0) / 100) * Number(option[index].quantity);
            } else {
                const newData = {
                    id: Date.now(),
                    item: value,
                    unit: value?.e?.unit_name,
                    quantity: 1,
                    price: 1,
                    discount: discounttong ? discounttong : 0,
                    priceAffter: 1,
                    taxStages: taxTotal ? taxTotal : 0,
                    dgsautaxStages: 1,
                    totalPrice: 1,
                    note: "",
                };
                if (newData.discount) {
                    newData.priceAffter *= 1 - Number(newData.discount) / 100;
                }
                if (newData.taxStages?.e?.tax_rate == undefined) {
                    const tien = Number(newData.priceAffter) * (1 + Number(0) / 100) * Number(newData.quantity);
                    newData.totalPrice = Number(tien.toFixed(2));
                } else {
                    const tien =
                        Number(newData.priceAffter) *
                        (1 + Number(newData.taxStages?.e?.tax_rate) / 100) *
                        Number(newData.quantity);
                    newData.totalPrice = Number(tien.toFixed(2));
                }
                option.push(newData);
            }
        } else if (type == "unit") {
            option[index].unit = value.target?.value;
        } else if (type === "quantity") {
            option[index].quantity = Number(value?.value);
            if (option[index].taxStages?.tax_rate == undefined) {
                const tien = Number(option[index].priceAffter) * (1 + Number(0) / 100) * Number(option[index].quantity);
                option[index].totalPrice = Number(tien.toFixed(2));
            } else {
                const tien =
                    Number(option[index].priceAffter) *
                    (1 + Number(option[index].taxStages?.tax_rate) / 100) *
                    Number(option[index].quantity);
                option[index].totalPrice = Number(tien.toFixed(2));
            }
            sOption([...option]);
        } else if (type == "price") {
            option[index].price = Number(value.value);
            option[index].priceAffter = +option[index].price * (1 - option[index].discount / 100);
            option[index].priceAffter = +(Math.round(option[index].priceAffter + "e+2") + "e-2");
            if (option[index].taxStages?.tax_rate == undefined) {
                const tien = Number(option[index].priceAffter) * (1 + Number(0) / 100) * Number(option[index].quantity);
                option[index].totalPrice = Number(tien.toFixed(2));
            } else {
                const tien =
                    Number(option[index].priceAffter) *
                    (1 + Number(option[index].taxStages?.tax_rate) / 100) *
                    Number(option[index].quantity);
                option[index].totalPrice = Number(tien.toFixed(2));
            }
        } else if (type == "discount") {
            option[index].discount = Number(value.value);
            option[index].priceAffter = +option[index].price * (1 - option[index].discount / 100);
            option[index].priceAffter = +(Math.round(option[index].priceAffter + "e+2") + "e-2");
            if (option[index].taxStages?.tax_rate == undefined) {
                const tien = Number(option[index].priceAffter) * (1 + Number(0) / 100) * Number(option[index].quantity);
                option[index].totalPrice = Number(tien.toFixed(2));
            } else {
                const tien =
                    Number(option[index].priceAffter) *
                    (1 + Number(option[index].taxStages?.tax_rate) / 100) *
                    Number(option[index].quantity);
                option[index].totalPrice = Number(tien.toFixed(2));
            }
        } else if (type == "taxStages") {
            option[index].taxStages = value;
            if (option[index].taxStages?.tax_rate == undefined) {
                const tien = Number(option[index].priceAffter) * (1 + Number(0) / 100) * Number(option[index].quantity);
                option[index].totalPrice = Number(tien.toFixed(2));
            } else {
                const tien =
                    Number(option[index].priceAffter) *
                    (1 + Number(option[index].taxStages?.tax_rate) / 100) *
                    Number(option[index].quantity);
                option[index].totalPrice = Number(tien.toFixed(2));
            }
        } else if (type == "note") {
            option[index].note = value?.target?.value;
        }
        sOption([...option]);
    };
    const handleIncrease = (id) => {
        const index = option.findIndex((x) => x.id === id);
        const newQuantity = option[index].quantity + 1;
        option[index].quantity = newQuantity;
        if (option[index].taxStages?.tax_rate == undefined) {
            const tien = Number(option[index].priceAffter) * (1 + Number(0) / 100) * Number(option[index].quantity);
            option[index].totalPrice = Number(tien.toFixed(2));
        } else {
            const tien =
                Number(option[index].priceAffter) *
                (1 + Number(option[index].taxStages?.tax_rate) / 100) *
                Number(option[index].quantity);
            option[index].totalPrice = Number(tien.toFixed(2));
        }
        sOption([...option]);
    };

    const handleDecrease = (id) => {
        const index = option.findIndex((x) => x.id === id);
        const newQuantity = Number(option[index].quantity) - 1;
        // chỉ giảm số lượng khi nó lớn hơn hoặc bằng 1
        if (newQuantity >= 1) {
            option[index].quantity = Number(newQuantity);
            if (option[index].taxStages?.tax_rate == undefined) {
                const tien = Number(option[index].priceAffter) * (1 + Number(0) / 100) * Number(option[index].quantity);
                option[index].totalPrice = Number(tien.toFixed(2));
            } else {
                const tien =
                    Number(option[index].priceAffter) *
                    (1 + Number(option[index].taxStages?.tax_rate) / 100) *
                    Number(option[index].quantity);
                option[index].totalPrice = Number(tien.toFixed(2));
            }
            sOption([...option]);
        } else {
            return isShow("error", `${"Số lượng tối thiểu là 1 không thể giảm !"}`);
        }
    };
    const _HandleDelete = (id) => {
        if (id === option[0].id) {
            return isShow("error", `${"Mặc định hệ thống, không thể xóa !"}`);
        }
        const newOption = option.filter((x) => x.id !== id); // loại bỏ phần tử cần xóa
        sOption(newOption); // cập nhật lại mảng
    };

    const taxOptions = [{ label: "Miễn thuế", value: "0", tax_rate: "0" }, ...dataTasxes];

    const tinhTongTien = (option) => {
        const tongTien = option.slice(1).reduce((acc, item) => {
            const tongTien = item?.price * item?.quantity;
            return acc + tongTien;
        }, 0);

        const tienChietKhau = option.slice(1).reduce((acc, item) => {
            const tienChietKhau = item?.price * (item?.discount / 100) * item?.quantity;
            return acc + tienChietKhau;
        }, 0);

        const tongTienSauCK = option.slice(1).reduce((acc, item) => {
            const tienSauCK = item?.quantity * item?.priceAffter;
            return acc + tienSauCK;
        }, 0);

        const tienThue = option.slice(1).reduce((acc, item) => {
            const tienThueItem =
                item?.priceAffter * (isNaN(item?.taxStages?.tax_rate) ? 0 : item?.taxStages?.tax_rate / 100) * item?.quantity;
            return acc + tienThueItem;
        }, 0);

        const tongThanhTien = option.slice(1).reduce((acc, item) => {
            const tongThanhTien = item?.totalPrice;
            return acc + tongThanhTien;
        }, 0);
        return {
            tongTien: tongTien || 0,
            tienChietKhau: tienChietKhau || 0,
            tongTienSauCK: tongTienSauCK || 0,
            tienThue: tienThue || 0,
            tongThanhTien: tongThanhTien || 0,
        };
    };

    useEffect(() => {
        const tongTien = tinhTongTien(option);
        setTongTienState(tongTien);
    }, [option]);

    const dataOption = sortedArr?.map((e) => {
        return {
            item: e?.item?.value,
            quantity: Number(e?.quantity),
            price: e?.price,
            discount_percent: e?.discount,
            tax_id: e?.taxStages?.value,
            price_quote_item_id: e?.item?.e?.price_quote_item_id,
            note: e?.note,
            id: e?.id,
            price_quote_order_item_id: e?.price_quote_order_item_id,
        };
    });

    let newDataOption = dataOption?.filter((e) => e?.item !== undefined);
    // handle submit
    const _ServerSending = () => {
        const formData = new FormData();
        formData.append("reference_no", code ? code : "");
        formData.append("date", moment(startDate).format("YYYY-MM-DD HH:mm:ss"));
        formData.append("validity", moment(effectiveDate).format("YYYY-MM-DD"));
        formData.append("client_id", idCustomer?.value ? idCustomer?.value : "");
        formData.append("branch_id", idBranch?.value ? idBranch?.value : "");
        formData.append("person_contact_id", idContactPerson?.value ? idContactPerson?.value : "");
        formData.append("note", note ? note : "");
        newDataOption.forEach((item, index) => {
            formData.append(`items[${index}][item]`, item?.item != undefined ? item?.item : "");
            formData.append(`items[${index}][quantity]`, item?.quantity.toString());
            formData.append(`items[${index}][price]`, item?.price);
            formData.append(`items[${index}][id]`, item?.price_quote_order_item_id != undefined ? item?.price_quote_order_item_id : "");
            formData.append(`items[${index}][discount_percent]`, item?.discount_percent);
            formData.append(`items[${index}][tax_id]`, item?.tax_id != undefined ? item?.tax_id : "");
            formData.append(`items[${index}][note]`, item?.note != undefined ? item?.note : "");
        });

        if (
            tongTienState?.tongTien > 0 &&
            tongTienState?.tienChietKhau >= 0 &&
            tongTienState?.tongTienSauCK > 0 &&
            tongTienState?.tienThue >= 0 &&
            tongTienState?.tongThanhTien > 0
        ) {
            Axios(
                "POST",
                `${id
                    ? `/api_web/Api_quotation/quotation/${id}?csrf_protection=true`
                    : "/api_web/Api_quotation/quotation/?csrf_protection=true"
                }`,
                {
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data" },
                },
                (err, response) => {
                    const { isSuccess, message } = response.data;

                    if (response && response.data && isSuccess === true && router.isReady) {
                        isShow("success", `${dataLang[message]}`);
                        sCode("");
                        sStartDate(new Date());
                        sEffectiveDate(new Date());
                        sIdContactPerson(null);
                        sIdCustomer(null);
                        sIdBranch(null);
                        sNote("");
                        sErrBranch(false);
                        sErrDate(false);
                        sErrEffectiveDate(false);
                        sErrCustomer(false);
                        sOption([
                            {
                                id: Date.now(),
                                item: null,
                                unit: "",
                                quantity: 0,
                                note: "",
                            },
                        ]);
                        router.push(routerPriceQuote.home);
                    }
                    if (response && response.data && isSuccess === false) {
                        isShow("error", `${dataLang[message]}`);
                    }
                    sOnSending(false);
                }
            );
        } else {
            isShow(
                "error",
                newDataOption?.length === 0
                    ? `Chưa chọn thông tin mặt hàng!`
                    : "Vui lòng kiểm tra dữ liệu"
            );

            sOnSending(false);
        }
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const handleClearDate = (type) => {
        if (type === "effectiveDate") {
            sEffectiveDate(null);
        }
        if (type === "startDate") {
            sStartDate(new Date());
        }
    };

    const handleTimeChange = (date) => {
        sStartDate(date);
    };

    return (
        <React.Fragment>
            <Head>
                <title>
                    {id
                        ? dataLang?.price_quote_edit_order || "price_quote_edit_order"
                        : dataLang?.price_quote_add_order || "price_quote_add_order"}
                </title>
            </Head>
            <div className="xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 flex flex-col justify-between">
                <div className="h-[97%] space-y-3 overflow-hidden">
                    {trangthaiExprired ? (
                        <div className="p-2"></div>
                    ) : (
                        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                            <h6 className="text-[#141522]/40">{dataLang?.price_quote || "price_quote"}</h6>
                            <span className="text-[#141522]/40">/</span>
                            <h6>
                                {id
                                    ? dataLang?.price_quote_edit_order || "price_quote_edit_order"
                                    : dataLang?.price_quote_add_order || "price_quote_add_order"}
                            </h6>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <h2 className="xl:text-2xl text-xl ">
                            {id
                                ? dataLang?.price_quote_edit_order || "price_quote_edit_order"
                                : dataLang?.price_quote_add_order || "price_quote_add_order"}
                        </h2>
                        <div className="flex justify-end items-center">
                            <button
                                onClick={() => router.push(routerPriceQuote.home)}
                                className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105"
                            >
                                {dataLang?.btn_back || "btn_back"}
                            </button>
                        </div>
                    </div>

                    <div className=" w-full rounded">
                        <div>
                            <h2 className="font-normal bg-[#ECF0F4] p-2">
                                {dataLang?.detail_general_information || "detail_general_information"}
                            </h2>
                            <div className="grid grid-cols-12 gap-3 items-center mt-2">
                                <div className="col-span-4">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.price_quote_code || "price_quote_code"}
                                    </label>
                                    <input
                                        value={code}
                                        onChange={_HandleChangeInput.bind(this, "code")}
                                        name="fname"
                                        type="text"
                                        placeholder={dataLang?.system_default || "system_default"}
                                        className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                                    />
                                </div>

                                <div className="col-span-4">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.branch || "branch"} <span className="text-red-500">*</span>
                                    </label>
                                    <SelectComponent
                                        options={dataBranch}
                                        onChange={_HandleChangeInput.bind(this, "branch")}
                                        value={idBranch}
                                        isClearable={true}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={dataLang?.select_branch || "select_branch"}
                                        className={`${errBranch ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
                                        components={{ MultiValue }}
                                        styles={{
                                            placeholder: (base) => ({
                                                ...base,
                                                color: "#cbd5e1",
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
                                    {errBranch && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.price_quote_errSelect_table_branch ||
                                                "price_quote_errSelect_table_branch"}
                                        </label>
                                    )}
                                </div>

                                <div className="col-span-4">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.customer || "customer"} <span className="text-red-500">*</span>
                                    </label>
                                    <SelectComponent
                                        options={dataCustomer}
                                        onChange={_HandleChangeInput.bind(this, "customer")}
                                        value={idCustomer}
                                        placeholder={dataLang?.select_customer || "select_customer"}
                                        hideSelectedOptions={false}
                                        isClearable={true}
                                        className={`${errCustomer ? "border-red-500" : "border-transparent"
                                            } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                        menuPortalTarget={document.body}
                                        closeMenuOnSelect={true}
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
                                    {errCustomer && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.price_quote_errSelect_customer ||
                                                "price_quote_errSelect_customer"}
                                        </label>
                                    )}
                                </div>

                                <div className="col-span-4">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.contact_person || "contact_person"}
                                    </label>
                                    <SelectComponent
                                        options={dataPersonContact}
                                        onChange={_HandleChangeInput.bind(this, "contactPerson")}
                                        value={idContactPerson}
                                        placeholder={dataLang?.select_contact_person || "select_contact_person"}
                                        hideSelectedOptions={false}
                                        isClearable={true}
                                        className={` placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border`}
                                        isSearchable={true}
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                        menuPortalTarget={document.body}
                                        closeMenuOnSelect={true}
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

                                <div className="col-span-4 relative">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.price_quote_date || "price_quote_date"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="custom-date-picker flex flex-row">
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
                                            className={`border ${errDate ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
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
                                    {errDate && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.price_quote_errDate || "price_quote_errDate"}
                                        </label>
                                    )}
                                </div>

                                <div className="col-span-4 relative">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.price_quote_effective_date || "price_quote_effective_date"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="custom-date-picker flex flex-row">
                                        <DatePicker
                                            selected={effectiveDate}
                                            blur
                                            placeholderText="DD/MM/YYYY"
                                            dateFormat="dd/MM/yyyy"
                                            onSelect={(date) => sEffectiveDate(date)}
                                            className={`border ${errEffectiveDate
                                                ? "border-red-500"
                                                : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer  `}
                                        />
                                        {effectiveDate && (
                                            <>
                                                <MdClear
                                                    className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                    onClick={() => handleClearDate("effectiveDate")}
                                                />
                                            </>
                                        )}
                                        <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                                    </div>
                                    {errEffectiveDate && (
                                        <label className="text-sm text-red-500">
                                            {dataLang?.price_quote_effective_errDate || "price_quote_effective_errDate"}
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="font-normal bg-[#ECF0F4] p-2  ">
                        {dataLang?.price_quote_item_information || "price_quote_item_information"}
                    </h2>

                    <div className="pr-2">
                        <div className="grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 ">
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-3    text-left    truncate font-[400]">
                                {dataLang?.price_quote_item || "price_quote_item"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {dataLang?.price_quote_from_unit || "price_quote_from_unit"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {dataLang?.price_quote_quantity || "price_quote_quantity"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {dataLang?.price_quote_unit_price || "price_quote_unit_price"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {dataLang?.price_quote_rate_discount || "price_quote_rate_discount"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center    font-[400]">
                                {dataLang?.price_quote_after_discount || "price_quote_after_discount"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {dataLang?.price_quote_tax || "price_quote_tax"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                                {dataLang?.price_quote_into_money || "price_quote_into_money"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                                {dataLang?.price_quote_note || "price_quote_note"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {dataLang?.price_quote_operations || "price_quote_operations"}
                            </h4>
                        </div>
                    </div>

                    <div className="h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                        <div className="pr-2">
                            <React.Fragment>
                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                    {sortedArr.map((e, index) => (
                                        <div className="grid grid-cols-12 gap-1 py-1 " key={e?.id}>
                                            <div className="col-span-3 z-10 my-auto ">
                                                <SelectComponent
                                                    onInputChange={_HandleSeachApi.bind(this)}
                                                    dangerouslySetInnerHTML={{
                                                        __html: option.label,
                                                    }}
                                                    options={options}
                                                    onChange={_HandleChangeInputOption.bind(
                                                        this,
                                                        e?.id,
                                                        "item",
                                                        index
                                                    )}
                                                    value={e?.item}
                                                    formatOptionLabel={(option) => (
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center ">
                                                                <div>
                                                                    {option.e?.images !== null ? (
                                                                        <img
                                                                            src={option.e?.images}
                                                                            alt="Product Image"
                                                                            className="3xl:max-w-[35px] 3xl:h-[35px] 2xl:max-w-[35px] 2xl:h-[25px] xl:max-w-[35px] xl:h-[25px] max-w-[25px] h-[25px] text-[8px] object-cover rounded mr-1"
                                                                        />
                                                                    ) : (
                                                                        <div className="3xl:max-w-[35px] 3xl:h-[35px] 2xl:max-w-[35px] 2xl:h-[25px] xl:max-w-[35px] xl:h-[25px] max-w-[25px] h-[25px] object-cover flex items-center justify-center rounded xl:mr-1 mx-0.5">
                                                                            <img
                                                                                src="/no_img.png"
                                                                                alt="Product Image"
                                                                                className="3xl:max-w-[35px] 3xl:h-[35px] 2xl:max-w-[35px] 2xl:h-[25px] xl:max-w-[35px] xl:h-[25px] max-w-[25px] h-[25px] object-cover rounded mr-1"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold 3xl:text-[14px] 2xl:text-[11px] xl:text-[10px] text-[10px] whitespace-pre-wrap">
                                                                        {option.e?.name}
                                                                    </h3>

                                                                    <div className="flex 3xl:gap-2 2xl:gap-1 xl:gap-1 gap-1">
                                                                        <h5 className="3xl:text-[14px] 2xl:text-[11px] xl:text-[8px] text-[7px]">
                                                                            {option.e?.product_variation}
                                                                        </h5>
                                                                    </div>

                                                                    <div className="flex 3xl:gap-4 2xl:gap-3 xl:gap-3 gap-1">
                                                                        <h5 className="text-gray-400 3xl:min-w-[90px] 2xl:min-w-[85px] xl:min-w-[55px] min-w-[45px] 3xl:text-[14px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                                                                            {dataLang[option.e?.text_type]}
                                                                        </h5>

                                                                        <div className="flex items-center">
                                                                            <h5 className="text-gray-400 font-normal 3xl:text-[12px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                                                                                {dataLang?.purchase_survive || "purchase_survive"} :
                                                                            </h5>

                                                                            <h5 className=" font-normal 3xl:text-[12px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                                                                                {option.e?.qty_warehouse ? option.e?.qty_warehouse : "0"}
                                                                            </h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    placeholder={dataLang?.price_quote_item || "price_quote_item"}
                                                    hideSelectedOptions={false}
                                                    className={`cursor-pointer rounded-md bg-white  xl:text-base text-[14.5px] z-20 mb-2`}
                                                    isSearchable={true}
                                                    noOptionsMessage={() => "Không có dữ liệu"}
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                        placeholder: (base) => ({
                                                            ...base,
                                                            color: "#cbd5e1",
                                                        }),
                                                        menuPortal: (base) => ({
                                                            ...base,
                                                            zIndex: 9999,
                                                        }),
                                                        control: (base, state) => ({
                                                            ...base,
                                                            ...(state.isFocused && {
                                                                border: "0 0 0 1px #92BFF7",
                                                                boxShadow: "none",
                                                            }),
                                                        }),
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-1 text-center flex items-center justify-center">
                                                <h3
                                                    className={`${index === 0 ? "cursor-default" : "cursor-text"
                                                        } 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}
                                                >
                                                    {e?.unit}
                                                </h3>
                                            </div>
                                            <div className="col-span-1 flex items-center justify-center">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        disabled={index === 0}
                                                        onClick={() => handleDecrease(e?.id)}
                                                        className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                                                    >
                                                        <Minus size="16" />
                                                    </button>
                                                    <InPutNumericFormat
                                                        value={index == 0 ? 1 : e?.quantity}
                                                        onValueChange={_HandleChangeInputOption.bind(
                                                            this,
                                                            e?.id,
                                                            "quantity",
                                                            e
                                                        )}
                                                        isAllowed={({ floatValue }) => {
                                                            if (floatValue == 0) {
                                                                return true;
                                                            } else {
                                                                return true;
                                                            }
                                                        }}
                                                        allowNegative={false}
                                                        className={`
                                                        ${index === 0 ? "cursor-default" : "cursor-text"} 
                                                        ${e?.quantity == 0 && 'border-red-500' || e?.quantity == "" && 'border-red-500'} 
                                                        appearance-none text-center 2xl:text-[12px] xl:text-[13px] text-[12.5px] py-2 px-0.5 font-normal 2xl:w-24 xl:w-[90px] w-[63px]  focus:outline-none border-b-2 border-gray-200`} />
                                                    <button
                                                        disabled={index === 0}
                                                        onClick={() => handleIncrease(e.id)}
                                                        className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                                                    >
                                                        <Add size="16" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-span-1 text-center flex items-center justify-center">
                                                <NumericFormat
                                                    value={index === 0 ? 1 : e?.price}
                                                    onValueChange={_HandleChangeInputOption.bind(
                                                        this,
                                                        e?.id,
                                                        "price",
                                                        index
                                                    )}
                                                    allowNegative={false}
                                                    readOnly={index === 0 ? readOnlyFirst : false}
                                                    decimalScale={0}
                                                    isNumericString={true}
                                                    className={`
                                                    ${index === 0 ? "cursor-default" : "cursor-text"} 
                                                    ${e?.price == 0 && 'border-red-500' || e?.price == "" && 'border-red-500'} 
                                                    appearance-none 2xl:text-[12px] xl:text-[13px] text-[12.5px] text-center py-1 px-2 font-normal w-[80%] focus:outline-none border-b-2 border-gray-200`}
                                                    thousandSeparator=","
                                                />
                                            </div>
                                            <div className="col-span-1 text-center flex items-center justify-center">
                                                <NumericFormat
                                                    value={index === 0 ? 0 : e?.discount}
                                                    onValueChange={_HandleChangeInputOption.bind(
                                                        this,
                                                        e?.id,
                                                        "discount",
                                                        index
                                                    )}
                                                    className={`${index === 0 ? "cursor-default" : "cursor-text"
                                                        } appearance-none text-center py-1 px-2 font-normal w-[80%]  focus:outline-none border-b-2 2xl:text-[12px] xl:text-[13px] text-[12.5px] border-gray-200`}
                                                    readOnly={index === 0 ? readOnlyFirst : false}
                                                    isAllowed={({ floatValue }) => {
                                                        if (floatValue == 0) {
                                                            return true;
                                                        }
                                                        if (floatValue > 101) {
                                                            isShow("error", "Vui lòng nhập số % chiết khấu nhỏ hơn 101");
                                                        }
                                                        else {
                                                            return true;
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <div className="col-span-1 text-right flex items-center justify-end">
                                                <h3
                                                    className={`${index === 0 ? "cursor-default" : "cursor-text"
                                                        } px-2 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}
                                                >
                                                    {formatMoney(e?.priceAffter)}
                                                </h3>
                                            </div>
                                            <div className="col-span-1 flex justify-center items-center">
                                                <SelectComponent
                                                    options={taxOptions}
                                                    onChange={_HandleChangeInputOption.bind(this, e?.id, "taxStages", index)}
                                                    value={
                                                        e?.taxStages
                                                            ? {
                                                                label: taxOptions.find(
                                                                    (item) => item.value === e?.taxStages?.value
                                                                )?.label,
                                                                value: e?.taxStages?.value,
                                                                tax_rate: e?.taxStages?.tax_rate,
                                                            }
                                                            : null
                                                    }
                                                    placeholder={"% Thuế"}
                                                    isDisabled={index === 0 ? true : false}
                                                    hideSelectedOptions={false}
                                                    formatOptionLabel={(option) => (
                                                        <div className="flex justify-start items-center gap-1 ">
                                                            <h2 className="2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                                                {option?.label}
                                                            </h2>
                                                            <h2 className="2xl:text-[12px] xl:text-[13px] text-[12.5px]">{`(${option?.tax_rate})`}</h2>
                                                        </div>
                                                    )}
                                                    className={`border-transparent placeholder:text-slate-300 w-full 2xl:text-[12px] xl:text-[13px] text-[12.5px] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                                                    isSearchable={true}
                                                    noOptionsMessage={() => "Không có dữ liệu"}
                                                    menuPortalTarget={document.body}
                                                    closeMenuOnSelect={true}
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
                                            <div className="col-span-1 text-right flex items-center justify-end">
                                                <h3
                                                    className={`${index === 0 ? "cursor-default" : "cursor-text"
                                                        } px-2 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}
                                                >
                                                    {formatMoney(e?.totalPrice)}
                                                </h3>
                                            </div>
                                            <div className="col-span-1 flex items-center justify-center">
                                                <input
                                                    value={e?.note}
                                                    onChange={_HandleChangeInputOption.bind(this, e?.id, "note", index)}
                                                    name="optionEmail"
                                                    placeholder="Ghi chú"
                                                    disabled={index === 0 ? true : false}
                                                    type="text"
                                                    className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12.5px]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                                />
                                            </div>
                                            <div className="col-span-1 flex items-center justify-center">
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
                    </div>

                    <div className="grid grid-cols-12 mb-3 font-normal bg-[#ecf0f475] p-2 items-center">
                        <div className="col-span-2  flex items-center gap-2">
                            <h2>{dataLang?.price_quote_total_discount || "price_quote_total_discount"}</h2>
                            <div className="col-span-1 text-center flex items-center justify-center">
                                <NumericFormat
                                    value={discounttong}
                                    onValueChange={_HandleChangeInput.bind(this, "discounttong")}
                                    className=" text-center py-1 px-2 bg-transparent font-normal w-20 focus:outline-none border-b-2 border-gray-300"
                                    isAllowed={({ floatValue }) => {
                                        if (floatValue == 0) {
                                            return true;
                                        }
                                        if (floatValue > 101) {
                                            isShow("error", "Vui lòng nhập số % chiết khấu nhỏ hơn 101");
                                        }
                                        else {
                                            return true;
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-span-5 flex items-center gap-2">
                            <h2 className="">{dataLang?.price_quote_tax || "price_quote_tax"}</h2>
                            <div className="w-[50%]">
                                <SelectComponent
                                    colSpan={4}
                                    options={taxOptions}
                                    onChange={_HandleChangeInput.bind(this, "taxTotal")}
                                    value={taxTotal}
                                    formatOptionLabel={(option) => (
                                        <div className="flex justify-start items-center gap-1 ">
                                            <h2>{option?.label}</h2>
                                            <h2>{`(${option?.tax_rate})`}</h2>
                                        </div>
                                    )}
                                    placeholder={dataLang?.price_quote_tax || "price_quote_tax"}
                                    hideSelectedOptions={false}
                                    className={` "border-transparent placeholder:text-slate-300 w-[70%] z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                                    isSearchable={true}
                                    noOptionsMessage={() => "Không có dữ liệu"}
                                    dangerouslySetInnerHTML={{
                                        __html: option.label,
                                    }}
                                    menuPortalTarget={document.body}
                                    closeMenuOnSelect={true}
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
                                /></div>
                        </div>
                    </div>

                    <h2 className="font-normal bg-[white]  p-2 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]">
                        {dataLang?.price_quote_total_outside || "price_quote_total_outside"}{" "}
                    </h2>
                </div>

                <div className="grid grid-cols-12">
                    <div className="col-span-9">
                        <div className="text-[#344054] font-normal text-sm mb-1 ">
                            {dataLang?.price_quote_note || "price_quote_note"}
                        </div>
                        <textarea
                            value={note}
                            placeholder={dataLang?.price_quote_note || "price_quote_note"}
                            onChange={_HandleChangeInput.bind(this, "note")}
                            name="fname"
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-[40%] min-h-[220px] max-h-[220px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                        />
                    </div>
                    <div className="text-right mt-5 space-y-4 col-span-3 flex-col justify-between ">
                        <div className="flex justify-between "></div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>{dataLang?.price_quote_total || "price_quote_total"}</h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">{formatMoney(tongTienState.tongTien)}</h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>{dataLang?.price_quote_total_discount || "price_quote_total_discount"}</h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">{formatMoney(tongTienState.tienChietKhau)}</h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>
                                    {dataLang?.price_quote_total_money_after_discount ||
                                        "price_quote_total_money_after_discount"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">{formatMoney(tongTienState.tongTienSauCK)}</h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>{dataLang?.price_quote_tax_money || "price_quote_tax_money"}</h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">{formatMoney(tongTienState.tienThue)}</h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>{dataLang?.price_quote_into_money || "price_quote_into_money"}</h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">{formatMoney(tongTienState.tongThanhTien)}</h3>
                            </div>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => router.push(routerPriceQuote.home)}
                                className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                            >
                                {dataLang?.btn_back || "btn_back"}
                            </button>
                            <button
                                onClick={_HandleSubmit.bind(this)}
                                type="submit"
                                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                            >
                                {dataLang?.btn_save || "btn_save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE_ITEMS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={resetValue}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};

export default Index;
