import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { _ServerInstance as Axios } from "/services/axios";
import { v4 as uuidv4 } from "uuid";
import Loading from "components/UI/loading";

import { MdClear } from "react-icons/md";
import { BsCalendarEvent } from "react-icons/bs";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";

import Select, { components } from "react-select";

import {
    Add,
    Trash as IconDelete,
    Image as IconImage,
    Minus,
} from "iconsax-react";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { NumericFormat } from "react-number-format";
import Link from "next/link";
import moment from "moment/moment";
import { useSelector } from "react-redux";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const Index = (props) => {
    const router = useRouter();
    const id = router.query?.id;

    const dataLang = props?.dataLang;

    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingDetail, sOnFetchingDetail] = useState(false);
    const [onFetchingCondition, sOnFetchingCondition] = useState(false);
    const [onFetchingItemsAll, sOnFetchingItemsAll] = useState(false);
    const [onFetchingWarehouser, sOnFetchingWarehouse] = useState(false);
    const [onFetchingLocation, sOnFetchingLocation] = useState(false);

    const [onLoading, sOnLoading] = useState(false);
    const [onLoadingChild, sOnLoadingChild] = useState(false);

    const [onSending, sOnSending] = useState(false);
    const [code, sCode] = useState("");
    const [startDate, sStartDate] = useState(new Date());
    const [effectiveDate, sEffectiveDate] = useState(null);

    const [note, sNote] = useState("");
    const [date, sDate] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));

    const [dataBranch, sDataBranch] = useState([]);
    const [dataItems, sDataItems] = useState([]);
    const [dataLocation, sDataLocation] = useState([]);

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
    const [dataProductExpiry, sDataProductExpiry] = useState({});
    const [dataProductSerial, sDataProductSerial] = useState({});
    //new

    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);

    const [listData, sListData] = useState([]);
    const [warehouse, sDataWarehouse] = useState([]);

    const [idBranch, sIdBranch] = useState(null);
    const [idRecalltWarehouse, sIdRecalltWarehouse] = useState(null);

    const [errDate, sErrDate] = useState(false);
    const [errBranch, sErrBranch] = useState(false);
    const [errWarehouse, sErrWarehouse] = useState(false);
    const [errQty, sErrQty] = useState(false);
    const [errLot, sErrLot] = useState(false);
    const [errDateList, sErrDateList] = useState(false);
    const [errRecallWarehouse, sErrRecallWarehouse] = useState(false);
    useEffect(() => {
        router.query && sErrDate(false);
        router.query && sErrBranch(false);
        router.query && sErrRecallWarehouse(false);
        router.query && sStartDate(new Date());
        router.query && sNote("");
    }, [router.query]);

    const _ServerFetching = async () => {
        sOnLoading(true);
        await Axios(
            "GET",
            "/api_web/Api_Branch/branchCombobox/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var { result } = response.data;
                    sDataBranch(
                        result?.map((e) => ({ label: e.name, value: e.id }))
                    );
                    sOnLoading(false);
                }
            }
        );
        sOnFetching(false);
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    const _ServerFetchingCondition = () => {
        Axios(
            "GET",
            "/api_web/api_setting/feature/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var data = response.data;
                    sDataMaterialExpiry(
                        data.find((x) => x.code == "material_expiry")
                    );
                    sDataProductExpiry(
                        data.find((x) => x.code == "product_expiry")
                    );
                    sDataProductSerial(
                        data.find((x) => x.code == "product_serial")
                    );
                }
                sOnFetchingCondition(false);
            }
        );
    };

    useEffect(() => {
        onFetchingCondition && _ServerFetchingCondition();
    }, [onFetchingCondition]);

    useEffect(() => {
        id && sOnFetchingCondition(true);
    }, []);

    useEffect(() => {
        JSON.stringify(dataMaterialExpiry) === "{}" &&
            JSON.stringify(dataProductExpiry) === "{}" &&
            JSON.stringify(dataProductSerial) === "{}" &&
            sOnFetchingCondition(true);
    }, [
        JSON.stringify(dataMaterialExpiry) === "{}",
        JSON.stringify(dataProductExpiry) === "{}",
        JSON.stringify(dataProductSerial) === "{}",
    ]);

    const options = dataItems?.map((e) => ({
        label: `${e.name}
     <span style={{display: none}}>${e.code}</span>
     <span style={{display: none}}>${e.product_variation} </span>
     <span style={{display: none}}>${e.serial} </span>
     <span style={{display: none}}>${e.lot} </span>
     <span style={{display: none}}>${e.expiration_date} </span>
     <span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
        value: e.id,
        e,
    }));

    const _ServerFetchingDetailPage = () => {
        Axios(
            "GET",
            `/api_web/Api_material_recall/getMaterialRecallDetail/${id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var rResult = response.data;
                    sIdBranch({
                        label: rResult?.branch_name,
                        value: rResult?.branch_id,
                    });
                    sIdRecalltWarehouse({
                        label: rResult?.warehouse_name,
                        value: rResult?.warehouse_id,
                    });
                    sListData(
                        rResult?.items.map((e) => ({
                            id: e?.item?.id,
                            idParenBackend: e?.item?.id,
                            matHang: {
                                e: e?.item,
                                label: `${
                                    e.item?.name
                                } <span style={{display: none}}>${
                                    e.item?.code +
                                    e.item?.product_variation +
                                    e.item?.text_type +
                                    e.item?.unit_name
                                }</span>`,
                                value: e.item?.id,
                            },
                            child: e?.child.map((ce) => ({
                                idChildBackEnd: Number(ce?.id),
                                id: Number(ce?.id),
                                disabledDate:
                                    (e.item?.text_type == "material" &&
                                        dataMaterialExpiry?.is_enable == "1" &&
                                        false) ||
                                    (e.item?.text_type == "material" &&
                                        dataMaterialExpiry?.is_enable == "0" &&
                                        true),
                                location: {
                                    label: ce?.warehouse?.location_name,
                                    value: ce?.warehouse?.id,
                                    warehouse_name:
                                        ce?.warehouse?.warehouse_name,
                                },
                                price: ce?.price,
                                serial: ce?.serial == null ? "" : ce?.serial,
                                lot: ce?.lot == null ? "" : ce?.lot,
                                date:
                                    ce?.expiration_date != null
                                        ? moment(ce?.expiration_date).toDate()
                                        : null,
                                unit: e.item?.unit,
                                recallQuantity: +ce?.quantity,
                                note: ce?.note,
                            })),
                        }))
                    );
                    sCode(rResult?.code);
                    sStartDate(moment(rResult?.date).toDate());
                    sNote(rResult?.note);
                }
                sOnFetchingDetail(false);
            }
        );
    };

    useEffect(() => {
        //new
        onFetchingDetail && _ServerFetchingDetailPage();
    }, [onFetchingDetail]);

    useEffect(() => {
        id &&
            JSON.stringify(dataMaterialExpiry) !== "{}" &&
            JSON.stringify(dataProductExpiry) !== "{}" &&
            JSON.stringify(dataProductSerial) !== "{}" &&
            sOnFetchingDetail(true);
    }, [
        JSON.stringify(dataMaterialExpiry) !== "{}" &&
            JSON.stringify(dataProductExpiry) !== "{}" &&
            JSON.stringify(dataProductSerial) !== "{}",
    ]);

    const _ServerFetching_ItemsAll = () => {
        Axios(
            "GET",
            "/api_web/Api_material_recall/itemCombobox/?csrf_protection=true",
            {
                params: {
                    "filter[branch_id]": idBranch ? idBranch?.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var { result } = response.data.data;
                    sDataItems(result);
                }
            }
        );
        sOnFetchingItemsAll(false);
    };

    const _ServerFetching_Warehouse = () => {
        Axios(
            "GET",
            `/api_web/Api_warehouse/warehouseCombobox/?csrf_protection=true`,
            {
                params: {
                    "filter[branch_id]": idBranch?.value,
                },
            },
            (err, response) => {
                if (!err) {
                    var result = response.data;
                    sDataWarehouse(
                        result?.map((e) => ({
                            label: e?.warehouse_name,
                            value: e?.id,
                            // warehouse_name: e?.warehouse_name,
                        }))
                    );
                }
            }
        );
        sOnFetchingWarehouse(false);
    };

    // const _HandleSeachApi = (inputValue) => {
    //     idBranch != null &&
    //         inputValue != "" &&
    //         Axios(
    //             "POST",
    //             `/api_web/Api_material_recall/itemCombobox/?csrf_protection=true`,
    //             {
    //                 params: {
    //                     "filter[branch_id]": idBranch ? idBranch?.value : null,
    //                 },

    //                 data: {
    //                     term: inputValue,
    //                 },
    //             },
    //             (err, response) => {
    //                 if (!err) {
    //                     var { result } = response.data.data;
    //                     sDataItems(result);
    //                 }
    //             }
    //         );
    // };
    // Khai báo biến để theo dõi timeout
    let searchTimeout;

    const _HandleSeachApi = (inputValue) => {
        if (idBranch == null || inputValue == "") {
            return;
        } else {
            // Hủy timeout cũ nếu có
            clearTimeout(searchTimeout);

            // Đặt timeout mới để thực hiện tìm kiếm sau 500ms
            searchTimeout = setTimeout(() => {
                Axios(
                    "POST",
                    `/api_web/Api_material_recall/itemCombobox/?csrf_protection=true`,
                    {
                        params: {
                            "filter[branch_id]": idBranch
                                ? idBranch?.value
                                : null,
                        },

                        data: {
                            term: inputValue,
                        },
                    },
                    (err, response) => {
                        if (!err) {
                            var { result } = response.data.data;
                            sDataItems(result);
                        }
                    }
                );
            }, 500); // Đợi 500ms trước khi thực hiện tìm kiếm
        }
    };

    const _ServerFetching_Location = async () => {
        await Axios(
            "GET",
            "/api_web/Api_warehouse/warehouseLocationCombobox/?csrf_protection=true",
            {
                params: {
                    "filter[branch_id]": idBranch ? idBranch?.value : null,
                    "filter[warehouse_id]": idRecalltWarehouse
                        ? idRecalltWarehouse?.value
                        : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var data = response.data;
                    // console.log("result", data);
                    sDataLocation(
                        data?.map((e) => ({
                            label: e?.location_name,
                            value: e?.id,
                        }))
                    );
                }
            }
        );
        sOnFetchingLocation(false);
    };

    const _HandleChangeInput = (type, value) => {
        if (type == "code") {
            sCode(value.target.value);
        } else if (type === "date") {
            sDate(moment(value.target.value).format("YYYY-MM-DD HH:mm:ss"));
        } else if (type === "note") {
            sNote(value.target.value);
        } else if (type == "branch" && idBranch != value) {
            if (listData?.length > 0) {
                if (type === "branch" && idBranch != value) {
                    Swal.fire({
                        title: `${
                            dataLang?.returns_err_DeleteItem ||
                            "returns_err_DeleteItem"
                        }`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#296dc1",
                        cancelButtonColor: "#d33",
                        confirmButtonText: `${dataLang?.aler_yes}`,
                        cancelButtonText: `${dataLang?.aler_cancel}`,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            sDataItems([]);
                            sListData([]);
                            sIdBranch(value);
                            sIdRecalltWarehouse(null);
                            sDataWarehouse([]);
                        } else {
                            sIdBranch({ ...idBranch });
                        }
                    });
                }
            } else {
                sIdRecalltWarehouse(null);
                sDataItems([]);
                sIdBranch(value);
            }
        } else if (
            type == "idRecalltWarehouse" &&
            idRecalltWarehouse != value
        ) {
            if (listData?.length > 0) {
                Swal.fire({
                    title: `${
                        dataLang?.returns_err_DeleteItem ||
                        "returns_err_DeleteItem"
                    }`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#296dc1",
                    cancelButtonColor: "#d33",
                    confirmButtonText: `${dataLang?.aler_yes}`,
                    cancelButtonText: `${dataLang?.aler_cancel}`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        sDataItems([]);
                        sListData([]);
                        sIdRecalltWarehouse(value);
                    } else {
                        sIdRecalltWarehouse({ ...idRecalltWarehouse });
                    }
                });
            } else {
                sDataItems([]);
                sIdRecalltWarehouse(value);
            }
        }
    };

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

    const _HandleSubmit = (e) => {
        e.preventDefault();
        const hasNullOrCondition = (data, conditionFn) =>
            data.some((item) =>
                item.child?.some((childItem) => conditionFn(item, childItem))
            );

        const hasNullKho = hasNullOrCondition(
            listData,
            (item, childItem) => childItem.location === null
        );

        const hasNullSerial = hasNullOrCondition(
            listData,
            (item, childItem) =>
                item?.matHang.e?.text_type === "products" &&
                (childItem.serial === "" || childItem.serial == null)
        );

        const hasNullLot = hasNullOrCondition(
            listData,
            (item, childItem) =>
                !childItem.disabledDate &&
                (childItem.lot === "" || childItem.lot == null)
        );

        const hasNullDate = hasNullOrCondition(
            listData,
            (item, childItem) =>
                !childItem.disabledDate && childItem.date === null
        );

        const hasNullQty = hasNullOrCondition(
            listData,
            (item, childItem) =>
                childItem.recallQuantity === null ||
                childItem.recallQuantity === "" ||
                childItem.recallQuantity == 0
            // ||
            // childItem.price === null ||
            // childItem.price === "" ||
            // childItem.price == 0
        );

        const isEmpty = listData?.length === 0;

        if (
            idBranch == null ||
            hasNullKho ||
            hasNullQty ||
            isEmpty ||
            idRecalltWarehouse == null ||
            (dataMaterialExpiry?.is_enable == "1" && hasNullLot) ||
            (dataMaterialExpiry?.is_enable == "1" && hasNullDate)
        ) {
            idBranch == null && sErrBranch(true);
            hasNullKho && sErrWarehouse(true);
            idRecalltWarehouse == null && sErrRecallWarehouse(true);
            hasNullQty && sErrQty(true);
            hasNullKho && sErrWarehouse(true);
            hasNullLot && sErrLot(true);
            hasNullDate && sErrDateList(true);
            if (isEmpty) {
                handleCheckError("Chưa nhập thông tin mặt hàng");
            } else {
                handleCheckError(dataLang?.required_field_null);
            }
        } else {
            sErrWarehouse(false);

            sErrQty(false);
            sErrLot(false);
            sErrDateList(false);
            sOnSending(true);
        }
    };
    useEffect(() => {
        sErrDate(false);
    }, [date != null]);

    useEffect(() => {
        sErrBranch(false);
    }, [idBranch != null]);
    useEffect(() => {
        sErrRecallWarehouse(false);
    }, [idRecalltWarehouse != null]);

    useEffect(() => {
        router.query && sOnFetching(true);
    }, [router.query]);

    useEffect(() => {
        onFetchingWarehouser && _ServerFetching_Warehouse();
    }, [onFetchingWarehouser]);

    useEffect(() => {
        onFetchingItemsAll && _ServerFetching_ItemsAll();
    }, [onFetchingItemsAll]);

    useEffect(() => {
        onFetchingLocation && _ServerFetching_Location();
    }, [onFetchingLocation]);

    useEffect(() => {
        (idBranch != null &&
            idRecalltWarehouse != null &&
            sOnFetchingItemsAll(true)) ||
            (idBranch != null && sOnFetchingWarehouse(true)) ||
            (idRecalltWarehouse && sOnFetchingLocation(true));
        idBranch == null &&
            idRecalltWarehouse == null &&
            sOnFetchingItemsAll(false);
    }, [idBranch, idRecalltWarehouse]);

    const formatNumber = (number) => {
        // const integerPart = Math.floor(number);
        return number.toLocaleString("en");
    };
    const _ServerSending = () => {
        var formData = new FormData();
        formData.append("code", code);
        formData.append(
            "date",
            moment(startDate).format("YYYY-MM-DD HH:mm:ss")
        );
        formData.append("branch_id", idBranch?.value);
        formData.append("warehouse_id", idRecalltWarehouse?.value);
        formData.append("note", note);
        listData.forEach((item, index) => {
            formData.append(
                `items[${index}][id]`,
                id ? item?.idParenBackend : ""
            );
            formData.append(`items[${index}][item]`, item?.matHang?.value);
            item?.child?.forEach((childItem, childIndex) => {
                formData.append(
                    `items[${index}][child][${childIndex}][row_id]`,
                    id ? childItem?.idChildBackEnd : ""
                );
                // formData.append(
                //     `items[${index}][child][${childIndex}][price]`,
                //     childItem?.price ? childItem?.price : ""
                // );
                formData.append(
                    `items[${index}][child][${childIndex}][lot]`,
                    childItem?.lot === null ? "" : childItem?.lot
                );
                formData.append(
                    `items[${index}][child][${childIndex}][expiration_date]`,
                    childItem?.date === null
                        ? ""
                        : moment(childItem?.date).format("YYYY-MM-DD")
                );
                formData.append(
                    `items[${index}][child][${childIndex}][location_warehouses_id]`,
                    childItem?.location?.value
                );
                formData.append(
                    `items[${index}][child][${childIndex}][note]`,
                    childItem?.note ? childItem?.note : ""
                );
                formData.append(
                    `items[${index}][child][${childIndex}][quantity]`,
                    childItem?.recallQuantity
                );
            });
        });
        Axios(
            "POST",
            `${
                id
                    ? `/api_web/Api_material_recall/materialRecall/${id}?csrf_protection=true`
                    : `/api_web/Api_material_recall/materialRecall/?csrf_protection=true`
            }`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        Toast.fire({
                            icon: "success",
                            title: `${dataLang[message]}`,
                        });
                        sCode("");
                        sStartDate(new Date());
                        sIdBranch(null);
                        sNote("");
                        sErrBranch(false);
                        sErrDate(false);
                        //new
                        sListData([]);
                        router.push("/manufacture/recall?tab=all");
                    } else {
                        handleCheckError(dataLang[message]);
                    }
                }
                sOnSending(false);
            }
        );
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    //new
    const _HandleAddChild = (parentId, value) => {
        sOnLoadingChild(true);
        const newData = listData?.map((e) => {
            if (e?.id === parentId) {
                const newChild = {
                    id: uuidv4(),
                    disabledDate:
                        (value?.e?.text_type === "material" &&
                            dataMaterialExpiry?.is_enable === "1" &&
                            false) ||
                        (value?.e?.text_type === "material" &&
                            dataMaterialExpiry?.is_enable === "0" &&
                            true),
                    location: null,
                    unit: value?.e?.unit_name || value?.e?.unit,
                    serial: "",
                    lot: "",
                    date: null,
                    recallQuantity: null,
                    price: null,
                    note: "",
                    idChildBackEnd: null,
                };
                return { ...e, child: [...e.child, newChild] };
            } else {
                return e;
            }
        });
        setTimeout(() => {
            sOnLoadingChild(false);
        }, 500);
        sListData(newData);
    };

    const _HandleAddParent = useCallback(
        (value) => {
            sOnLoadingChild(true);

            const checkData = listData?.some(
                (e) => e?.matHang?.value === value?.value
            );
            if (!checkData) {
                const newData = {
                    id: Date.now(),
                    idParenBackend: null,
                    matHang: value,
                    child: [
                        {
                            idChildBackEnd: null,
                            id: uuidv4(),
                            disabledDate:
                                (value?.e?.text_type === "material" &&
                                    dataMaterialExpiry?.is_enable === "1" &&
                                    false) ||
                                (value?.e?.text_type === "material" &&
                                    dataMaterialExpiry?.is_enable === "0" &&
                                    true),
                            location: null,
                            serial: "",
                            lot: "",
                            date: null,
                            unit: value?.e?.unit_name,
                            price: null,
                            recallQuantity: null,
                            note: "",
                        },
                    ],
                };
                setTimeout(() => {
                    sOnLoadingChild(false);
                }, 500);
                sListData([newData, ...listData]);
            } else {
                handleCheckError(
                    dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect"
                );
            }
        },
        [listData]
    );
    const _HandleDeleteChild = useCallback(
        (parentId, childId) => {
            const newData = listData
                .map((e) => {
                    if (e.id === parentId) {
                        const newChild = e.child?.filter(
                            (ce) => ce?.id !== childId
                        );
                        return { ...e, child: newChild };
                    }
                    return e;
                })
                .filter((e) => e.child?.length > 0);
            sListData([...newData]);
        },
        [listData]
    );

    const _HandleDeleteAllChild = useCallback(
        (parentId) => {
            const newData = listData
                .map((e) => {
                    if (e.id === parentId) {
                        const newChild = e.child?.filter(
                            (ce) => ce?.location !== null
                        );
                        return { ...e, child: newChild };
                    }
                    return e;
                })
                .filter((e) => e.child?.length > 0);
            sListData([...newData]);
        },
        [listData]
    );

    const _HandleChangeChild = useCallback(
        (parentId, childId, type, value) => {
            const newData = [...listData];
            const parentIndex = newData.findIndex((e) => e.id === parentId);
            if (parentIndex !== -1) {
                const childIndex = newData[parentIndex].child.findIndex(
                    (ce) => ce.id === childId
                );
                if (childIndex !== -1) {
                    // Thực hiện cập nhật dữ liệu tại vị trí tìm thấy
                    const updatedChild = {
                        ...newData[parentIndex].child[childIndex],
                    };
                    if (type === "recallQuantity") {
                        const newQtyImport = Number(value?.value);
                        updatedChild.recallQuantity = newQtyImport;
                    } else if (type === "location") {
                        const checkKho = newData[parentIndex].child
                            .map((house) => house)
                            .some((i) => i?.location?.value === value?.value);
                        if (checkKho) {
                            handleCheckError("Vị trí thu hồi đã được chọn");
                        } else {
                            updatedChild.location = value;
                        }
                    } else if (type === "serial") {
                        const newTypeValue = value?.target.value;
                        // Kiểm tra xem giá trị mới đã tồn tại trong cả phần tử cha và các phần tử con
                        const existsInParent = newData[parentIndex].child.some(
                            (ce) => ce[type] === newTypeValue
                        );
                        const existsInOtherParents = newData.some(
                            (e) =>
                                e.id !== parentId &&
                                e.child.some((ce) => ce[type] === newTypeValue)
                        );
                        if (existsInParent || existsInOtherParents) {
                            handleQuantityError(`Giá trị ${type} đã tồn tại`);
                            return; // Dừng việc cập nhật nếu có lỗi
                        }

                        updatedChild[type] = newTypeValue;
                    } else if (type === "lot") {
                        updatedChild.lot = value?.target.value;
                    } else if (type === "date") {
                        updatedChild.date = value;
                    } else if (type === "increase") {
                        updatedChild.recallQuantity =
                            Number(updatedChild.recallQuantity) + 1;
                    } else if (type === "decrease") {
                        if (updatedChild.recallQuantity >= 2) {
                            updatedChild.recallQuantity =
                                Number(updatedChild.recallQuantity) - 1;
                        }
                    } else if (type === "price") {
                        const newPrice = Number(value?.value);
                        updatedChild.price = newPrice;
                    } else if (type === "note") {
                        updatedChild.note = value?.target.value;
                    }
                    newData[parentIndex].child[childIndex] = updatedChild;
                }
            }
            sListData(newData);
        },
        [listData]
    );

    const handleQuantityError = (e) => {
        Toast.fire({
            title: e,
            icon: "error",
            confirmButtonColor: "#296dc1",
            cancelButtonColor: "#d33",
            confirmButtonText: dataLang?.aler_yes,
            timer: 3000,
        });
    };
    const _HandleChangeValue = useCallback(
        (parentId, value) => {
            // sOnLoadingChild(true);
            const checkData = listData?.some(
                (e) => e?.matHang?.value === value?.value
            );
            if (!checkData) {
                const newData = listData?.map((e) => {
                    if (e?.id === parentId) {
                        return {
                            ...e,
                            matHang: value,
                            child: [
                                {
                                    idChildBackEnd: null,
                                    id: uuidv4(),
                                    location: null,
                                    disabledDate:
                                        (value?.e?.text_type === "material" &&
                                            dataMaterialExpiry?.is_enable ===
                                                "1" &&
                                            false) ||
                                        (value?.e?.text_type === "material" &&
                                            dataMaterialExpiry?.is_enable ===
                                                "0" &&
                                            true),
                                    unit: value?.e?.unit_name,
                                    price: null,
                                    recallQuantity: null,
                                    note: "",
                                },
                            ],
                        };
                    } else {
                        return e;
                    }
                });
                sListData([...newData]);
            } else {
                handleCheckError(
                    dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect"
                );
            }
        },
        [listData]
    );

    const handleCheckError = (e) => {
        Toast.fire({
            title: `${e}`,
            icon: "error",
        });
    };
    return (
        <React.Fragment>
            <Head>
                <title>
                    {id
                        ? dataLang?.recall_title_edit || "recall_title_edit"
                        : dataLang?.recall_title_add || "recall_title_add"}
                </title>
            </Head>
            <div className="xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 flex flex-col justify-between">
                <div className="h-[97%] space-y-3 overflow-hidden">
                    {trangthaiExprired ? (
                        <div className="p-2"></div>
                    ) : (
                        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                            <h6 className="text-[#141522]/40">
                                {dataLang?.recall_title || "recall_title"}
                            </h6>
                            <span className="text-[#141522]/40">/</span>
                            <h6>
                                {id
                                    ? dataLang?.recall_title_edit ||
                                      "recall_title_edit"
                                    : dataLang?.recall_title_add ||
                                      "recall_title_add"}
                            </h6>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <h2 className="xl:text-2xl text-xl ">
                            {id
                                ? dataLang?.recall_title_edit ||
                                  "recall_title_edit"
                                : dataLang?.recall_title_add ||
                                  "recall_title_add"}
                        </h2>
                        <div className="flex justify-end items-center">
                            <button
                                onClick={() =>
                                    router.push(
                                        "/manufacture/productsWarehouse?tab=all"
                                    )
                                }
                                className="xl:text-sm text-xs xl:px-5 px-3 hover:bg-blue-500 hover:text-white transition-all ease-in-out xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105"
                            >
                                {dataLang?.import_comeback || "import_comeback"}
                            </button>
                        </div>
                    </div>

                    <div className=" w-full rounded">
                        <div className="">
                            <h2 className="font-normal bg-[#ECF0F4] p-2 ">
                                {dataLang?.purchase_order_detail_general_informatione ||
                                    "purchase_order_detail_general_informatione"}
                            </h2>
                            <div className="grid grid-cols-10  gap-3 items-center mt-2 	">
                                <div className="col-span-2">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_code_vouchers ||
                                            "import_code_vouchers"}{" "}
                                    </label>
                                    <input
                                        value={code}
                                        onChange={_HandleChangeInput.bind(
                                            this,
                                            "code"
                                        )}
                                        name="fname"
                                        type="text"
                                        placeholder={
                                            dataLang?.purchase_order_system_default ||
                                            "purchase_order_system_default"
                                        }
                                        className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal   p-2 border outline-none`}
                                    />
                                </div>
                                <div className="col-span-2 relative">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_day_vouchers ||
                                            "import_day_vouchers"}
                                    </label>
                                    <div className="custom-date-picker flex flex-row">
                                        <DatePicker
                                            blur
                                            fixedHeight
                                            showTimeSelect
                                            selected={startDate}
                                            onSelect={(date) =>
                                                sStartDate(date)
                                            }
                                            onChange={(e) =>
                                                handleTimeChange(e)
                                            }
                                            placeholderText="DD/MM/YYYY HH:mm:ss"
                                            dateFormat="dd/MM/yyyy h:mm:ss aa"
                                            timeInputLabel={"Time: "}
                                            placeholder={
                                                dataLang?.price_quote_system_default ||
                                                "price_quote_system_default"
                                            }
                                            className={`border ${
                                                errDate
                                                    ? "border-red-500"
                                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                            } placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                                        />
                                        {startDate && (
                                            <>
                                                <MdClear
                                                    className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                    onClick={() =>
                                                        handleClearDate(
                                                            "startDate"
                                                        )
                                                    }
                                                />
                                            </>
                                        )}
                                        <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.import_branch ||
                                            "import_branch"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        options={dataBranch}
                                        onChange={_HandleChangeInput.bind(
                                            this,
                                            "branch"
                                        )}
                                        value={idBranch}
                                        isLoading={
                                            idBranch != null ? false : onLoading
                                        }
                                        isClearable={true}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={
                                            dataLang?.import_branch ||
                                            "import_branch"
                                        }
                                        noOptionsMessage={() =>
                                            dataLang?.returns_nodata ||
                                            "returns_nodata"
                                        }
                                        className={`${
                                            errBranch
                                                ? "border-red-500"
                                                : "border-transparent"
                                        } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
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
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 9999, // Giá trị z-index tùy chỉnh
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
                                            {dataLang?.purchase_order_errBranch ||
                                                "purchase_order_errBranch"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-2 ">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.productsWarehouse_warehouseImport ||
                                            "productsWarehouse_warehouseImport"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        options={warehouse}
                                        onChange={_HandleChangeInput.bind(
                                            this,
                                            "idRecalltWarehouse"
                                        )}
                                        isLoading={
                                            idBranch != null ? false : onLoading
                                        }
                                        value={idRecalltWarehouse}
                                        isClearable={true}
                                        noOptionsMessage={() =>
                                            dataLang?.returns_nodata ||
                                            "returns_nodata"
                                        }
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={
                                            dataLang?.productsWarehouse_warehouseImport ||
                                            "productsWarehouse_warehouseImport"
                                        }
                                        className={`${
                                            errRecallWarehouse
                                                ? "border-red-500"
                                                : "border-transparent"
                                        } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
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
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 9999, // Giá trị z-index tùy chỉnh
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
                                    {errRecallWarehouse && (
                                        <label className="text-sm text-red-500">
                                            {"Vui lòng chọn kho"}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-2 ">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {dataLang?.production_warehouse_LSX ||
                                            "production_warehouse_LSX"}
                                    </label>
                                    <Select
                                        options={[]}
                                        onChange={_HandleChangeInput.bind(
                                            this,
                                            ""
                                        )}
                                        isLoading={
                                            idBranch != null ? false : onLoading
                                        }
                                        value={""}
                                        isClearable={true}
                                        noOptionsMessage={() =>
                                            dataLang?.returns_nodata ||
                                            "returns_nodata"
                                        }
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={
                                            dataLang?.production_warehouse_LSX ||
                                            "production_warehouse_LSX"
                                        }
                                        className={`${"border-transparent"} placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
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
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 9999, // Giá trị z-index tùy chỉnh
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
                    </div>
                    <div className=" bg-[#ECF0F4] p-2 grid  grid-cols-12">
                        <div className="font-normal col-span-12">
                            {dataLang?.import_item_information ||
                                "import_item_information"}
                        </div>
                    </div>

                    <div className="grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10">
                        <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-3 text-center truncate font-[400]">
                            {dataLang?.import_from_items || "import_from_items"}
                        </h4>
                        <div className="col-span-9">
                            <div
                                className={`${
                                    dataMaterialExpiry.is_enable == "1"
                                        ? "grid-cols-7"
                                        : "grid-cols-5"
                                } grid `}
                            >
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1   text-center  truncate font-[400]">
                                    {dataLang?.productsWarehouse_warehouseLocaImport ||
                                        "productsWarehouse_warehouseLocaImport"}
                                </h4>

                                {dataMaterialExpiry.is_enable === "1" ? (
                                    <>
                                        <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  col-span-1  text-[#667085] uppercase  font-[400] text-center">
                                            {"Lot"}
                                        </h4>
                                        <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  col-span-1  text-[#667085] uppercase  font-[400] text-center">
                                            {props.dataLang
                                                ?.warehouses_detail_date ||
                                                "warehouses_detail_date"}
                                        </h4>
                                    </>
                                ) : (
                                    ""
                                )}
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {"ĐVT"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.recall_amountRecall ||
                                        "recall_amountRecall"}
                                </h4>
                                {/* <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.recall_price || "recall_price"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                    {dataLang?.recall_money || "recall_money"}
                                </h4> */}
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                                    {dataLang?.import_from_note ||
                                        "import_from_note"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                                    {dataLang?.import_from_operation ||
                                        "import_from_operation"}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 items-center gap-1 py-2">
                        <div className="col-span-3">
                            <Select
                                options={options}
                                value={null}
                                onInputChange={_HandleSeachApi.bind(this)}
                                onChange={_HandleAddParent.bind(this)}
                                className="col-span-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                                placeholder={
                                    dataLang?.returns_items || "returns_items"
                                }
                                noOptionsMessage={() =>
                                    dataLang?.returns_nodata || "returns_nodata"
                                }
                                menuPortalTarget={document.body}
                                formatOptionLabel={(option) => (
                                    <div className="flex items-center  justify-between py-2 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <div className="w-[40px] h-h-[60px]">
                                                {option.e?.images != null ? (
                                                    <img
                                                        src={option.e?.images}
                                                        alt="Product Image"
                                                        className="max-w-[30px] h-[40px] text-[8px] object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className=" w-[30px] h-[40px] object-cover  flex items-center justify-center rounded">
                                                        <img
                                                            src="/no_img.png"
                                                            alt="Product Image"
                                                            className="w-[30px] h-[30px] object-cover rounded"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                    {option.e?.name}
                                                </h3>
                                                <div className="flex gap-2">
                                                    <h5 className="text-gray-400 font-normal 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                        {option.e?.code}
                                                    </h5>
                                                    <h5 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                        {
                                                            option.e
                                                                ?.product_variation
                                                        }
                                                    </h5>
                                                </div>
                                                <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                    {
                                                        dataLang[
                                                            option.e?.text_type
                                                        ]
                                                    }
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                        zIndex: 9999,
                                    }),
                                    control: (base, state) => ({
                                        ...base,
                                        ...(state.isFocused && {
                                            border: "0 0 0 1px #92BFF7",
                                            boxShadow: "none",
                                        }),
                                    }),
                                    menu: (provided, state) => ({
                                        ...provided,
                                        // width: "130%",
                                    }),
                                }}
                            />
                        </div>

                        <div className="col-span-9">
                            <div
                                className={`${
                                    dataMaterialExpiry.is_enable == "1"
                                        ? "grid-cols-7"
                                        : "grid-cols-5"
                                } grid  divide-x border-t border-b border-r border-l`}
                            >
                                <div className="col-span-1">
                                    {" "}
                                    <Select
                                        classNamePrefix="customDropdowDefault"
                                        placeholder={
                                            dataLang?.productsWarehouse_warehouseLocaImport ||
                                            "productsWarehouse_warehouseLocaImport"
                                        }
                                        className="3xl:text-[12px] border-none outline-none 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                                        isDisabled={true}
                                    />
                                </div>
                                {dataMaterialExpiry.is_enable === "1" ? (
                                    <>
                                        <div className=" col-span-1 flex items-center">
                                            <NumericFormat
                                                className="appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 2xl:px-2 xl:px-1 p-0 font-normal w-[100%]  focus:outline-none border-b-2 border-gray-200"
                                                allowNegative={false}
                                                decimalScale={0}
                                                isNumericString={true}
                                                thousandSeparator=","
                                                disabled
                                            />
                                        </div>
                                        <div className=" col-span-1 flex items-center ">
                                            <DatePicker
                                                // selected={effectiveDate}
                                                // blur
                                                placeholderText="dd/mm/yyyy"
                                                // dateFormat="dd/MM/yyyy"
                                                // onSelect={(date) => sEffectiveDate(date)}
                                                // placeholder={dataLang?.price_quote_system_default || "price_quote_system_default"}
                                                disabled
                                                className={`3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] border-b placeholder:text-slate-300 w-full bg-gray-50 rounded text-[#52575E] font-light px-2 py-1.5 text-center outline-none cursor-pointer  `}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    ""
                                )}
                                <div></div>
                                <div className="col-span-1 flex items-center justify-center">
                                    <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                                        <Minus
                                            className="2xl:scale-100 xl:scale-100 scale-50"
                                            size="16"
                                        />
                                    </button>
                                    <div className="mb-0.5 text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal  focus:outline-none border-b-2 w-full border-gray-200">
                                        1
                                    </div>
                                    <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                                        <Add
                                            className="2xl:scale-100 xl:scale-100 scale-50"
                                            size="16"
                                        />
                                    </button>
                                </div>
                                {/* <div className="col-span-1 mb-0.5 text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal  focus:outline-none border-b-2 w-full border-gray-200">
                                    1
                                </div>
                                <div className="col-span-1 mb-0.5 text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal  focus:outline-none border-b-2 w-full border-gray-200">
                                    1
                                </div> */}
                                <input
                                    placeholder={
                                        dataLang?.recall_noteChild ||
                                        "recall_noteChild"
                                    }
                                    disabled
                                    className=" disabled:bg-gray-50 col-span-1 placeholder:text-slate-300 w-full bg-[#ffffff] 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  p-1.5 "
                                />
                                <button
                                    title="Xóa"
                                    disabled
                                    className="col-span-1  disabled:opacity-50 transition w-full h-full bg-slate-100  rounded-[5.5px] text-red-500 flex flex-col justify-center items-center"
                                >
                                    <IconDelete />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 ">
                        <div className="min:h-[400px] h-[100%] max:h-[800px] w-full">
                            {onFetchingDetail ? (
                                <Loading
                                    className="h-10 w-full"
                                    color="#0f4f9e"
                                />
                            ) : (
                                <>
                                    {listData?.map((e) => (
                                        <div
                                            key={e?.id?.toString()}
                                            className="grid grid-cols-12 items-start"
                                        >
                                            <div className="col-span-3 border border-r p-0.5 pb-1 h-full">
                                                <div className="relative mr-5 mt-5">
                                                    <Select
                                                        onInputChange={_HandleSeachApi.bind(
                                                            this
                                                        )}
                                                        options={options}
                                                        value={e?.matHang}
                                                        className=""
                                                        onChange={_HandleChangeValue.bind(
                                                            this,
                                                            e?.id
                                                        )}
                                                        menuPortalTarget={
                                                            document.body
                                                        }
                                                        formatOptionLabel={(
                                                            option
                                                        ) => (
                                                            <div className="flex items-center  justify-between py-2 cursor-pointer">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-[40px] h-h-[60px]">
                                                                        {option
                                                                            .e
                                                                            ?.images !=
                                                                        null ? (
                                                                            <img
                                                                                src={
                                                                                    option
                                                                                        .e
                                                                                        ?.images
                                                                                }
                                                                                alt="Product Image"
                                                                                className="object-cover rounded"
                                                                            />
                                                                        ) : (
                                                                            <div className=" object-cover  flex items-center justify-center rounded w-[40px] h-h-[60px]">
                                                                                <img
                                                                                    src="/no_img.png"
                                                                                    alt="Product Image"
                                                                                    className="object-cover rounded "
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                            {
                                                                                option
                                                                                    .e
                                                                                    ?.name
                                                                            }
                                                                        </h3>
                                                                        <h5 className="text-gray-400 font-normal 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                            {
                                                                                option
                                                                                    .e
                                                                                    ?.code
                                                                            }
                                                                        </h5>
                                                                        <h5 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                            {
                                                                                option
                                                                                    .e
                                                                                    ?.product_variation
                                                                            }
                                                                        </h5>
                                                                        <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                            {
                                                                                dataLang[
                                                                                    option
                                                                                        .e
                                                                                        ?.text_type
                                                                                ]
                                                                            }
                                                                        </h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        classNamePrefix="customDropdow"
                                                        style={{
                                                            border: "none",
                                                            boxShadow: "none",
                                                            outline: "none",
                                                        }}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25:
                                                                    "#EBF5FF",
                                                                primary50:
                                                                    "#92BFF7",
                                                                primary:
                                                                    "#0F4F9E",
                                                            },
                                                        })}
                                                        styles={{
                                                            placeholder: (
                                                                base
                                                            ) => ({
                                                                ...base,
                                                                color: "#cbd5e1",
                                                            }),
                                                            menuPortal: (
                                                                base
                                                            ) => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                            }),
                                                            control: (
                                                                base,
                                                                state
                                                            ) => ({
                                                                ...base,
                                                                ...(state.isFocused && {
                                                                    border: "0 0 0 1px #92BFF7",
                                                                    boxShadow:
                                                                        "none",
                                                                }),
                                                            }),
                                                            menu: (
                                                                provided,
                                                                state
                                                            ) => ({
                                                                ...provided,
                                                                // width: "130%",
                                                            }),
                                                        }}
                                                    />
                                                    <button
                                                        onClick={_HandleAddChild.bind(
                                                            this,
                                                            e?.id,
                                                            e?.matHang
                                                        )}
                                                        className="w-8 h-8 rounded bg-slate-100 flex flex-col justify-center items-center absolute -top-4 right-2 hover:rotate-45 hover:bg-slate-200 transition hover:scale-105 hover:text-red-500 ease-in-out"
                                                    >
                                                        <Add />
                                                    </button>
                                                    {e?.child?.filter(
                                                        (e) =>
                                                            e?.location == null
                                                    ).length >= 2 && (
                                                        <button
                                                            onClick={_HandleDeleteAllChild.bind(
                                                                this,
                                                                e?.id,
                                                                e?.matHang
                                                            )}
                                                            className="w-full rounded mt-1.5 px-5 py-1 overflow-hidden group bg-rose-500 relative hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-rose-400 transition-all ease-out duration-300"
                                                        >
                                                            <span className="absolute right-0 w-full h-full -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                                                            <span className="relative text-xs">
                                                                Xóa{" "}
                                                                {
                                                                    e?.child?.filter(
                                                                        (e) =>
                                                                            e?.location ==
                                                                            null
                                                                    ).length
                                                                }{" "}
                                                                hàng chưa chọn
                                                                vị trí
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-span-9  items-center">
                                                <div
                                                    className={`${
                                                        dataMaterialExpiry.is_enable ==
                                                        "1"
                                                            ? "grid-cols-7"
                                                            : "grid-cols-5"
                                                    }  3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] border-b divide-x divide-y border-r grid `}
                                                >
                                                    {e?.child?.map((ce) => (
                                                        <React.Fragment
                                                            key={ce?.id?.toString()}
                                                        >
                                                            <div className="flex justify-center border-t border-l  h-full p-0.5 flex-col items-center ">
                                                                <Select
                                                                    options={
                                                                        dataLocation
                                                                    }
                                                                    value={
                                                                        ce?.location
                                                                    }
                                                                    isLoading={
                                                                        ce?.location !=
                                                                        null
                                                                            ? false
                                                                            : onLoadingChild
                                                                    }
                                                                    onChange={_HandleChangeChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id,
                                                                        "location"
                                                                    )}
                                                                    className={`${
                                                                        errWarehouse &&
                                                                        ce?.location ==
                                                                            null
                                                                            ? "border-red-500"
                                                                            : ""
                                                                    } border my-1 3xl:text-[12px] 2xl:text-[10px] cursor-pointer xl:text-[9.5px] text-[9px] placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal `}
                                                                    placeholder={
                                                                        onLoadingChild
                                                                            ? ""
                                                                            : dataLang?.productsWarehouse_warehouseLocaImport ||
                                                                              "productsWarehouse_warehouseLocaImport"
                                                                    }
                                                                    noOptionsMessage={() =>
                                                                        dataLang?.returns_nodata ||
                                                                        "returns_nodata"
                                                                    }
                                                                    menuPortalTarget={
                                                                        document.body
                                                                    }
                                                                    formatOptionLabel={(
                                                                        option
                                                                    ) => (
                                                                        <div className="cursor-pointer">
                                                                            {/* <div className="flex gap-1">
                                                                                <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                                                                    {dataLang?.recall_wareChild ||
                                                                                        "recall_wareChild"}

                                                                                    :
                                                                                </h2>
                                                                                <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-semibold">
                                                                                    {
                                                                                        option?.warehouse_name
                                                                                    }
                                                                                </h2>
                                                                            </div> */}
                                                                            <div className="flex gap-1">
                                                                                {/* <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                                                                    {dataLang?.productsWarehouse_warehouseLocaImport ||
                                                                                        "productsWarehouse_warehouseLocaImport"}

                                                                                    :
                                                                                </h2> */}
                                                                                <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-semibold">
                                                                                    {
                                                                                        option?.label
                                                                                    }
                                                                                </h2>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    style={{
                                                                        border: "none",
                                                                        boxShadow:
                                                                            "none",
                                                                        outline:
                                                                            "none",
                                                                    }}
                                                                    theme={(
                                                                        theme
                                                                    ) => ({
                                                                        ...theme,
                                                                        colors: {
                                                                            ...theme.colors,
                                                                            primary25:
                                                                                "#EBF5FF",
                                                                            primary50:
                                                                                "#92BFF7",
                                                                            primary:
                                                                                "#0F4F9E",
                                                                        },
                                                                    })}
                                                                    styles={{
                                                                        menu: (
                                                                            provided,
                                                                            state
                                                                        ) => ({
                                                                            ...provided,
                                                                            // width: "150%",
                                                                        }),
                                                                    }}
                                                                    classNamePrefix="customDropdow"
                                                                />
                                                            </div>

                                                            {dataMaterialExpiry.is_enable ==
                                                            "1" ? (
                                                                <>
                                                                    <div className=" col-span-1  ">
                                                                        <div className="flex justify-center  h-full p-0.5 flex-col items-center ">
                                                                            <input
                                                                                value={
                                                                                    ce?.lot
                                                                                }
                                                                                disabled={
                                                                                    ce?.disabledDate
                                                                                }
                                                                                className={`border ${
                                                                                    ce?.disabledDate
                                                                                        ? "bg-gray-50"
                                                                                        : errLot &&
                                                                                          (ce?.lot ==
                                                                                              "" ||
                                                                                              ce?.lot ==
                                                                                                  null)
                                                                                        ? "border-red-500"
                                                                                        : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                                                                } placeholder:text-slate-300 w-full  bg-[#ffffff]  rounded text-[#52575E] font-normal p-4 outline-none cursor-pointer`}
                                                                                onChange={_HandleChangeChild.bind(
                                                                                    this,
                                                                                    e?.id,
                                                                                    ce?.id,
                                                                                    "lot"
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className=" col-span-1  ">
                                                                        <div className="custom-date-picker flex justify-center h-full p-0.5 flex-col items-center w-full">
                                                                            <div className="col-span-4 relative">
                                                                                <div className="custom-date-picker flex flex-row">
                                                                                    <DatePicker
                                                                                        selected={
                                                                                            ce?.date
                                                                                        }
                                                                                        blur
                                                                                        disabled={
                                                                                            ce?.disabledDate
                                                                                        }
                                                                                        placeholderText="DD/MM/YYYY"
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        onSelect={(
                                                                                            date
                                                                                        ) =>
                                                                                            _HandleChangeChild(
                                                                                                e?.id,
                                                                                                ce?.id,
                                                                                                "date",
                                                                                                date
                                                                                            )
                                                                                        }
                                                                                        placeholder={
                                                                                            dataLang?.price_quote_system_default ||
                                                                                            "price_quote_system_default"
                                                                                        }
                                                                                        className={`border ${
                                                                                            ce?.disabledDate
                                                                                                ? "bg-gray-50"
                                                                                                : errDateList &&
                                                                                                  ce?.date ==
                                                                                                      null
                                                                                                ? "border-red-500"
                                                                                                : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                                                        } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-4 outline-none cursor-pointer`}
                                                                                    />
                                                                                    {effectiveDate && (
                                                                                        <>
                                                                                            <MdClear
                                                                                                className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                                                                onClick={() =>
                                                                                                    handleClearDate(
                                                                                                        "effectiveDate"
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        </>
                                                                                    )}
                                                                                    <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[150%] text-[#CCCCCC] scale-110 cursor-pointer" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                ""
                                                            )}
                                                            <div className="flex items-center justify-center">
                                                                {ce?.unit}
                                                            </div>
                                                            <div className="flex items-center justify-center  h-full p-0.5">
                                                                <button
                                                                    className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                                                    onClick={_HandleChangeChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id,
                                                                        "decrease"
                                                                    )}
                                                                >
                                                                    <Minus
                                                                        className="2xl:scale-100 xl:scale-100 scale-50"
                                                                        size="16"
                                                                    />
                                                                </button>

                                                                <NumericFormat
                                                                    className={`${
                                                                        errQty &&
                                                                        (ce?.recallQuantity ==
                                                                            null ||
                                                                            ce?.recallQuantity ==
                                                                                "" ||
                                                                            ce?.recallQuantity ==
                                                                                0)
                                                                            ? "border-red-500 border-b"
                                                                            : ""
                                                                    } placeholder:3xl:text-[11px] placeholder:xxl:text-[9px] placeholder:2xl:text-[8.5px] placeholder:xl:text-[7px] placeholder:lg:text-[6.3px] placeholder:text-[10px] appearance-none text-center  3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal w-full focus:outline-none border-b-2 border-gray-200 `}
                                                                    onValueChange={_HandleChangeChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id,
                                                                        "recallQuantity"
                                                                    )}
                                                                    value={
                                                                        ce?.recallQuantity
                                                                    }
                                                                    allowNegative={
                                                                        false
                                                                    }
                                                                    isNumericString={
                                                                        true
                                                                    }
                                                                    thousandSeparator=","
                                                                />

                                                                <button
                                                                    className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                                                    onClick={_HandleChangeChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id,
                                                                        "increase"
                                                                    )}
                                                                >
                                                                    <Add
                                                                        className="2xl:scale-100 xl:scale-100 scale-50"
                                                                        size="16"
                                                                    />
                                                                </button>
                                                            </div>
                                                            {/* <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                                                <NumericFormat
                                                                    className={`${
                                                                        errQty &&
                                                                        (ce?.price ==
                                                                            null ||
                                                                            ce?.price ==
                                                                                "" ||
                                                                            ce?.price ==
                                                                                0)
                                                                            ? "border-red-500 border-b"
                                                                            : ""
                                                                    } placeholder:3xl:text-[11px] placeholder:xxl:text-[9px] placeholder:2xl:text-[8.5px] placeholder:xl:text-[7px] placeholder:lg:text-[6.3px] placeholder:text-[10px] appearance-none text-center  3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal w-full focus:outline-none border-b-2 border-gray-200 `}
                                                                    onValueChange={_HandleChangeChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id,
                                                                        "price"
                                                                    )}
                                                                    value={
                                                                        ce?.price
                                                                    }
                                                                    allowNegative={
                                                                        false
                                                                    }
                                                                    isNumericString={
                                                                        true
                                                                    }
                                                                    thousandSeparator=","
                                                                />
                                                            </div>
                                                            <div className="flex items-center justify-center">
                                                                {formatNumber(
                                                                    ce?.recallQuantity *
                                                                        ce?.price
                                                                )}
                                                            </div> */}
                                                            <div className="col-span-1  flex items-center justify-center  h-full p-0.5">
                                                                <input
                                                                    value={
                                                                        ce?.note
                                                                    }
                                                                    onChange={_HandleChangeChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id,
                                                                        "note"
                                                                    )}
                                                                    placeholder={
                                                                        dataLang?.recall_noteChild ||
                                                                        "recall_noteChild"
                                                                    }
                                                                    type="text"
                                                                    className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 outline-none mb-2"
                                                                />
                                                            </div>
                                                            <div className=" h-full p-0.5 flex flex-col items-center justify-center ">
                                                                <button
                                                                    title="Xóa"
                                                                    onClick={_HandleDeleteChild.bind(
                                                                        this,
                                                                        e?.id,
                                                                        ce?.id
                                                                    )}
                                                                    className="transition-all duration-200 ease-linear hover:scale-105 text-red-500 flex flex-col justify-center items-center"
                                                                >
                                                                    <IconDelete />
                                                                </button>
                                                            </div>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                    <h2 className="font-normal bg-[white]  p-2 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]">
                        {dataLang?.purchase_total || "purchase_total"}
                    </h2>
                </div>
                <div className="grid grid-cols-12">
                    <div className="col-span-9">
                        <div className="text-[#344054] font-normal text-sm mb-1 ">
                            {dataLang?.returns_reason || "returns_reason"}
                        </div>
                        <textarea
                            value={note}
                            placeholder={
                                dataLang?.returns_reason || "returns_reason"
                            }
                            onChange={_HandleChangeInput.bind(this, "note")}
                            name="fname"
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-[40%] min-h-[220px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 max-h-[220px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                        />
                    </div>
                    <div className="text-right mt-5 space-y-4 col-span-3 flex-col justify-between ">
                        <div className="flex justify-between "></div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>
                                    {dataLang?.production_warehouse_totalItem ||
                                        "production_warehouse_totalItem"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {formatNumber(listData?.length)}
                                </h3>
                            </div>
                        </div>
                        <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>
                                    {dataLang?.recall_totalQty ||
                                        "recall_totalQty"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {formatNumber(
                                        listData?.reduce((total, item) => {
                                            item?.child?.forEach(
                                                (childItem) => {
                                                    if (
                                                        childItem.recallQuantity !==
                                                            undefined &&
                                                        childItem.recallQuantity !==
                                                            null
                                                    ) {
                                                        total +=
                                                            childItem.recallQuantity;
                                                    }
                                                }
                                            );
                                            return total;
                                        }, 0)
                                    )}
                                </h3>
                            </div>
                        </div>
                        {/* <div className="flex justify-between ">
                            <div className="font-normal">
                                <h3>
                                    {dataLang?.recall_totalAmount ||
                                        "recall_totalAmount"}
                                </h3>
                            </div>
                            <div className="font-normal">
                                <h3 className="text-blue-600">
                                    {formatNumber(
                                        listData?.reduce((total, item) => {
                                            item?.child?.forEach(
                                                (childItem) => {
                                                    if (
                                                        childItem.recallQuantity !==
                                                            undefined &&
                                                        childItem.recallQuantity !==
                                                            null
                                                    ) {
                                                        total +=
                                                            childItem.recallQuantity *
                                                            childItem.price;
                                                    }
                                                }
                                            );
                                            return total;
                                        }, 0)
                                    )}
                                </h3>
                            </div>
                        </div> */}
                        <div className="space-x-2">
                            <button
                                onClick={() =>
                                    router.push("/manufacture/recall?tab=all")
                                }
                                className="button text-[#344054] font-normal text-base hover:bg-blue-500 hover:text-white hover:scale-105 ease-in-out transition-all btn-amination py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                            >
                                {dataLang?.purchase_order_purchase_back ||
                                    "purchase_order_purchase_back"}
                            </button>
                            <button
                                onClick={_HandleSubmit.bind(this)}
                                type="submit"
                                className="button text-[#FFFFFF] hover:bg-blue-500 font-normal text-base hover:scale-105 ease-in-out transition-all btn-amination py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                            >
                                {dataLang?.purchase_order_purchase_save ||
                                    "purchase_order_purchase_save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const MoreSelectedBadge = ({ items }) => {
    const style = {
        marginLeft: "auto",
        background: "#d4eefa",
        borderRadius: "4px",
        fontSize: "14px",
        padding: "1px 3px",
        order: 99,
    };

    const title = items.join(", ");
    const length = items.length;
    // const label = `+ ${length}`;
    const label = ``;

    return <div title={title}>{label}</div>;
};

const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = 0;
    const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

    return index < maxToShow ? (
        <components.MultiValue {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};

export default Index;
