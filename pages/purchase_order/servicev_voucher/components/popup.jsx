import {
    Add,
    Trash as IconDelete,
    Minus
} from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendarEvent } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import Select from "react-select";

import vi from "date-fns/locale/vi";
import moment from "moment/moment";
registerLocale("vi", vi);

import PopupEdit from "@/components/UI/Popup";
import { _ServerInstance as Axios } from "/services/axios";

import { v4 as uuidv4 } from "uuid";

import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import InPutMoneyFormat from "@/components/UI/inputNumericFormat/inputMoneyFormat";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useSetingServer from "@/hooks/useConfigNumber";
import useActionRole from "@/hooks/useRole";
import useToast from "@/hooks/useToast";
import { isAllowedDiscount, isAllowedNumber } from "@/utils/helpers/common";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { useSelector } from "react-redux";
const Popup_servie = (props) => {
    let id = props?.id;

    const dataLang = props.dataLang;

    const scrollAreaRef = useRef(null);

    const [open, sOpen] = useState(false);

    const isShow = useToast();

    const dataSeting = useSetingServer();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, "servicev_voucher");

    const _HandleOpenModal = (e) => {
        if (id) {
            if (role || checkEdit) {
                if (props?.status_pay != "not_spent") {
                    sOpen(false);
                    isShow("error", `${"Phiếu dịch vụ đã chi. Không thể sửa"}`);
                } else {
                    sOpen(true);
                }
            } else {
                isShow("warning", WARNING_STATUS_ROLE);
            }
        } else {
            sOpen(true);
        }
    };

    const _HandleCloseModal = () => sOpen(false);

    const [onFetching, sOnFetching] = useState(false);

    const [onFetchingDetail, sOnFetchingDetail] = useState(false);

    const [onFetchingSupplier, sOnFetchingSupplier] = useState(false);

    const [onSending, sOnSending] = useState(false);

    const [option, sOption] = useState([
        {
            id: Date.now(),
            idData: "",
            dichvu: "",
            soluong: 1,
            dongia: 0,
            chietkhau: 0,
            dongiasauck: 0,
            thue: 0,
            thanhtien: 0,
            ghichu: "",
        },
    ]);
    const slicedArr = option.slice(1);

    const sortedArr = slicedArr.sort((a, b) => b.id - a.id);

    sortedArr.unshift(option[0]);

    const [code, sCode] = useState(null);

    const [date, sDate] = useState(new Date());

    const [valueBr, sValueBr] = useState(null);

    const [valueSupplier, sValueSupplier] = useState(null);

    const [note, sNote] = useState("");

    const [chietkhautong, sChietkhautong] = useState(0);

    const [thuetong, sThuetong] = useState(0);

    const [tab, sTab] = useState(0);

    const _HandleSelectTab = (e) => sTab(e);

    const [dataTasxes, sDataTasxes] = useState([]);

    const [dataSupplier, sDataSupplier] = useState([]);

    const [dataBranch, sDataBranch] = useState([]);

    const [errDate, sErrDate] = useState(false);

    const [errBranch, sErrBranch] = useState(false);

    const [errSupplier, sErrSupplier] = useState(false);

    const [errService, sErrService] = useState(false);

    useEffect(() => {
        open && sDate(new Date());
        open && sCode("");
        open && sValueBr(null);
        open && sValueSupplier(null);
        open &&
            sOption([
                {
                    id: Date.now(),
                    idData: " ",
                    dichvu: "",
                    soluong: 1,
                    dongia: 0,
                    chietkhau: 0,
                    dongiasauck: 0,
                    thue: 0,
                    thanhtien: 0,
                    ghichu: "",
                },
            ]);
        open && sThuetong(0);
        open && sChietkhautong(0);
        open && sNote("");
        open && sErrBranch(false);
        open && sErrSupplier(false);
        open && sErrService(false);
        props?.id && sOnFetchingDetail(true);
    }, [open]);

    const _ServerFetching_detailUser = () => {
        Axios("GET", `/api_web/Api_service/service/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var db = response.data;
                sDate(moment(db?.date).toDate());
                sCode(db?.code);
                sValueBr({ label: db?.branch_name, value: db?.branch_id });
                sNote(db?.note);
                sValueSupplier({
                    label: db?.supplier_name,
                    value: db?.suppliers_id,
                });
                sOption(
                    db?.item?.map((e) => ({
                        id: e?.id,
                        idData: e?.id,
                        dichvu: e?.name,
                        soluong: Number(e?.quantity),
                        dongia: Number(e?.price),
                        chietkhau: Number(e?.discount_percent),
                        dongiasauck: Number(e?.price) * (1 - Number(e?.discount_percent) / 100),
                        thue: {
                            label: e?.tax_name ? e?.tax_name : "Miễn thuế",
                            value: e?.tax_id,
                            tax_rate: Number(e?.tax_rate),
                        },
                        thanhtien: Number(e?.amount),
                        ghichu: e?.note,
                    }))
                );
            }
            sOnFetchingDetail(false);
        });
    };

    useEffect(() => {
        onFetchingDetail && props?.id && _ServerFetching_detailUser();
    }, [open]);

    const _ServerFetching = () => {
        Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { isSuccess, result } = response.data;
                sDataBranch(result?.map((e) => ({ label: e.name, value: e.id })));
            }
        });
        Axios("GET", "/api_web/Api_tax/tax?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
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

    const taxOptions = [{ label: "Miễn thuế", value: "0", tax_rate: "0" }, ...dataTasxes];

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        open && sOnFetching(true);
    }, [open]);

    const _ServerFetching_Supplier = () => {
        Axios(
            "GET",
            "/api_web/api_supplier/supplier/?csrf_protection=true",
            {
                params: {
                    "filter[branch_id]": valueBr != null ? valueBr.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sDataSupplier(rResult?.map((e) => ({ label: e.name, value: e.id })));
                }
            }
        );
        sOnFetchingSupplier(false);
    };

    useEffect(() => {
        onFetchingSupplier && _ServerFetching_Supplier();
    }, [onFetchingSupplier]);

    useEffect(() => {
        valueBr != null && sOnFetchingSupplier(true);
    }, [valueBr]);

    // add option form
    const _HandleAddNew = () => {
        sOption([
            ...option,
            {
                id: Date.now(),
                idData: "",
                dichvu: "",
                soluong: 1,
                dongia: 0,
                chietkhau: 0,
                dongiasauck: 0,
                thue: 0,
                thanhtien: 0,
                ghichu: "",
            },
        ]);
    };

    const _HandleChangeInput = (type, value) => {
        if (type === "date") {
            sDate(value);
        } else if (type === "clear") {
            sDate(new Date());
        } else if (type === "code") {
            sCode(value?.target.value);
        } else if (type === "valueBr" && valueBr != value) {
            sValueBr(value);
            sValueSupplier(null);
        } else if (type === "valueSupplier") {
            sValueSupplier(value);
        } else if (type === "note") {
            sNote(value?.target.value);
        } else if (type == "thuetong") {
            sThuetong(value);
        } else if (type == "chietkhautong") {
            sChietkhautong(value?.value);
        }
    };

    useEffect(() => {
        if (thuetong == null) return;
        sOption((prevOption) => {
            const newOption = [...prevOption];
            const thueValue = thuetong?.tax_rate || 0;
            const chietKhauValue = chietkhautong || 0;
            newOption.forEach((item, index) => {
                const dongiasauchietkhau = item?.dongia * (1 - chietKhauValue / 100);
                const thanhTien = dongiasauchietkhau * (1 + thueValue / 100) * item.soluong;
                item.thue = thuetong;
                item.thanhtien = isNaN(thanhTien) ? 0 : thanhTien;
            });
            return newOption;
        });
    }, [thuetong]);

    useEffect(() => {
        if (chietkhautong == null) return;
        sOption((prevOption) => {
            const newOption = [...prevOption];
            const thueValue = thuetong?.tax_rate != undefined ? thuetong?.tax_rate : 0;
            const chietKhauValue = chietkhautong ? chietkhautong : 0;
            newOption.forEach((item, index) => {
                const dongiasauchietkhau = item?.dongia * (1 - chietKhauValue / 100);
                const thanhTien = dongiasauchietkhau * (1 + thueValue / 100) * item.soluong;
                item.thue = thuetong;
                item.chietkhau = Number(chietkhautong);
                item.dongiasauck = isNaN(dongiasauchietkhau) ? 0 : dongiasauchietkhau;
                item.thanhtien = isNaN(thanhTien) ? 0 : thanhTien;
            });
            return newOption;
        });
    }, [chietkhautong]);
    const _HandleSubmit = (e) => {
        e.preventDefault();

        const hasNullLabel = option.some((item) => item.dichvu === "");
        const check = option.some(
            (item) => item.soluong == 0 || item.soluong == "" || item.dongia == 0 || item.dongia == ""
        );
        if (date == null || valueSupplier == null || valueBr == null || hasNullLabel || check) {
            date == null && sErrDate(true);
            valueBr == null && sErrBranch(true);
            valueSupplier == null && sErrSupplier(true);
            hasNullLabel && sErrService(true);
            isShow("error", `${dataLang?.required_field_null}`);
        } else {
            sOnSending(true);
        }
    };

    useEffect(() => {
        option?.filter((e) => e.dichvu === "") && sErrService(false);
    }, [option]);

    useEffect(() => {
        sErrDate(false);
    }, [date != null]);

    useEffect(() => {
        sErrSupplier(false);
    }, [valueSupplier != null]);

    useEffect(() => {
        sErrBranch(false);
    }, [valueBr != null]);

    const _HandleChangeInputOption = (id, type, index3, value) => {
        var index = option.findIndex((x) => x.id === id);
        if (type === "dichvu") {
            option[index].dichvu = value.target.value;
            if (value.target.value.length > 0 && index === option.length - 1) {
                option.push({
                    id: uuidv4(),
                    idData: "",
                    dichvu: "",
                    soluong: 1,
                    dongia: 0,
                    chietkhau: chietkhautong ? chietkhautong : 0,
                    dongiasauck: 0,
                    thue: thuetong ? thuetong : 0,
                    thanhtien: 0,
                });
                sOption([...option]);
            }
        } else if (type == "donvitinh") {
            option[index].donvitinh = value.target?.value;
        } else if (type === "soluong") {
            option[index].soluong = Number(value?.value);
            if (option[index].thue?.tax_rate == undefined) {
                const tien = Number(option[index].dongiasauck) * (1 + Number(0) / 100) * Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
            } else {
                const tien =
                    Number(option[index].dongiasauck) *
                    (1 + Number(option[index].thue?.tax_rate) / 100) *
                    Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
            }
            sOption([...option]);
        } else if (type == "dongia") {
            option[index].dongia = Number(value.value);
            option[index].dongiasauck = +option[index].dongia * (1 - option[index].chietkhau / 100);
            option[index].dongiasauck = +(Math.round(option[index].dongiasauck + "e+2") + "e-2");
            if (option[index].thue?.tax_rate == undefined) {
                const tien = Number(option[index].dongiasauck) * (1 + Number(0) / 100) * Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
            } else {
                const tien =
                    Number(option[index].dongiasauck) *
                    (1 + Number(option[index].thue?.tax_rate) / 100) *
                    Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
            }
        } else if (type == "chietkhau") {
            option[index].chietkhau = Number(value.value);
            option[index].dongiasauck = +option[index].dongia * (1 - option[index].chietkhau / 100);
            option[index].dongiasauck = +(Math.round(option[index].dongiasauck + "e+2") + "e-2");
            if (option[index].thue?.tax_rate == undefined) {
                const tien = Number(option[index].dongiasauck) * (1 + Number(0) / 100) * Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
            } else {
                const tien =
                    Number(option[index].dongiasauck) *
                    (1 + Number(option[index].thue?.tax_rate) / 100) *
                    Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
            }
        } else if (type == "thue") {
            option[index].thue = value;
            if (option[index].thue?.tax_rate == undefined) {
                const tien = Number(option[index].dongiasauck) * (1 + Number(0) / 100) * Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
            } else {
                const tien =
                    Number(option[index].dongiasauck) *
                    (1 + Number(option[index].thue?.tax_rate) / 100) *
                    Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
            }
        } else if (type == "ghichu") {
            option[index].ghichu = value?.target?.value;
        }
        sOption([...option]);
    };

    const handleIncrease = (id) => {
        const index = option.findIndex((x) => x.id === id);
        const newQuantity = option[index].soluong + 1;
        option[index].soluong = newQuantity;
        if (option[index].thue?.tax_rate == undefined) {
            const tien = Number(option[index].dongiasauck) * (1 + Number(0) / 100) * Number(option[index].soluong);
            option[index].thanhtien = Number(tien.toFixed(2));
        } else {
            const tien =
                Number(option[index].dongiasauck) *
                (1 + Number(option[index].thue?.tax_rate) / 100) *
                Number(option[index].soluong);
            option[index].thanhtien = Number(tien.toFixed(2));
        }
        sOption([...option]);
    };

    const handleDecrease = (id) => {
        const index = option.findIndex((x) => x.id === id);
        const newQuantity = Number(option[index].soluong) - 1;
        if (newQuantity >= 1) {
            // chỉ giảm số lượng khi nó lớn hơn hoặc bằng 1
            option[index].soluong = Number(newQuantity);
            if (option[index].thue?.tax_rate == undefined) {
                const tien = Number(option[index].dongiasauck) * (1 + Number(0) / 100) * Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
            } else {
                const tien =
                    Number(option[index].dongiasauck) *
                    (1 + Number(option[index].thue?.tax_rate) / 100) *
                    Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
            }
            sOption([...option]);
        } else {
            return isShow("error", `${"Số lượng tối thiểu"}`);
        }
    };

    const _HandleDelete = (id) => {
        if (id === option[0].id) {
            return isShow("error", `${"Mặc định hệ thống, không xóa"}`);
        }
        const newOption = option.filter((x) => x.id !== id); // loại bỏ phần tử cần xóa
        sOption(newOption); // cập nhật lại mảng
    };

    // const formatNumber = (num) => {
    //   if (!num && num !== 0) return 0;
    //   const roundedNum = parseFloat(num.toFixed(2));
    //   return roundedNum.toLocaleString("en", {
    //     minimumFractionDigits: 2,
    //     maximumFractionDigits: 2,
    //     useGrouping: true
    //   });
    // };

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    };

    const tinhTongTien = (option) => {
        const tongTien = option?.reduce(
            (accumulator, currentValue) => accumulator + currentValue?.dongia * currentValue?.soluong,
            0
        );

        const tienChietKhau = option?.reduce((acc, item) => {
            const chiTiet = item?.dongia * (item?.chietkhau / 100) * item?.soluong;
            return acc + chiTiet;
        }, 0);

        const tongTienSauCK = option?.reduce((acc, item) => {
            const tienSauCK = item?.soluong * item?.dongiasauck;
            return acc + tienSauCK;
        }, 0);

        const tienThue = option?.reduce((acc, item) => {
            const tienThueItem =
                item?.dongiasauck * (isNaN(item?.thue?.tax_rate) ? 0 : item?.thue?.tax_rate / 100) * item?.soluong;
            return acc + tienThueItem;
        }, 0);

        const tongThanhTien = option?.reduce((acc, item) => acc + item?.thanhtien, 0);
        return {
            tongTien: tongTien || 0,
            tienChietKhau: tienChietKhau || 0,
            tongTienSauCK: tongTienSauCK || 0,
            tienThue: tienThue || 0,
            tongThanhTien: tongThanhTien || 0,
        };
    };

    const [tongTienState, setTongTienState] = useState({
        tongTien: 0,
        tienChietKhau: 0,
        tongTienSauCK: 0,
        tienThue: 0,
        tongThanhTien: 0,
    });

    useEffect(() => {
        const tongTien = tinhTongTien(option);
        setTongTienState(tongTien);
    }, [option]);

    const _ServerSending = () => {
        var formData = new FormData();
        formData.append("code", code);
        formData.append("date", formatMoment(date, FORMAT_MOMENT.DATE_TIME_LONG));
        formData.append("branch_id", valueBr.value);
        formData.append("suppliers_id", valueSupplier.value);
        formData.append("note", note);
        sortedArr.forEach((item, index) => {
            formData.append(`items[${index}][id]`, props?.id ? item?.idData : "");
            formData.append(`items[${index}][name]`, item?.dichvu ? item?.dichvu : "");
            formData.append(`items[${index}][price]`, item?.dongia ? item?.dongia : "");
            formData.append(`items[${index}][quantity]`, item?.soluong ? item?.soluong : "");
            formData.append(`items[${index}][discount_percent]`, item?.chietkhau ? item?.chietkhau : "");
            formData.append(`items[${index}][tax_id]`, item?.thue?.value != undefined ? item?.thue?.value : "");
            formData.append(`items[${index}][note]`, item?.ghichu ? item?.ghichu : "");
        });
        Axios(
            "POST",
            `${id
                ? `/api_web/Api_service/service/${id}?csrf_protection=true`
                : "/api_web/Api_service/service/?csrf_protection=true"
            }`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", dataLang[message] || message);
                        sDate(new Date());
                        sCode("");
                        sValueBr(null);
                        sValueSupplier(null);
                        sNote("");
                        sErrBranch(false);
                        sErrService(false);
                        sErrSupplier(false);
                        sOption([
                            {
                                id: Date.now(),
                                idData: "",
                                dichvu: "",
                                soluong: 1,
                                dongia: 0,
                                chietkhau: 0,
                                dongiasauck: 0,
                                thue: 0,
                                thanhtien: 0,
                            },
                        ]);
                        props.onRefresh && props.onRefresh();
                        props.onRefreshGr && props.onRefreshGr();
                        sOpen(false);
                    } else {
                        isShow("error", dataLang[message] || message);
                    }
                }
                sOnSending(false);
            }
        );
    };
    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    return (
        <>
            <PopupEdit
                title={
                    props.id
                        ? `${props.dataLang?.serviceVoucher_edit || "serviceVoucher_edit"}`
                        : `${props.dataLang?.serviceVoucher_add || "serviceVoucher_add"}`
                }
                button={
                    props.id
                        ? props.dataLang?.serviceVoucher_edit_votes || "serviceVoucher_edit_votes"
                        : `${props.dataLang?.branch_popup_create_new}`
                }
                onClickOpen={_HandleOpenModal.bind(this)}
                open={open}
                onClose={_HandleCloseModal.bind(this)}
                classNameBtn={props.className}
            >
                <div className="mt-4  max-w-[75vw] 2xl:max-w-[65vw] xl:max-w-[75vw]">
                    <h2 className="font-normal bg-[#ECF0F4] 2xl:text-[12px] xl:text-[13px] text-[12px] p-1">
                        {dataLang?.serviceVoucher_general_information || "serviceVoucher_general_information"}
                    </h2>
                    <form onSubmit={_HandleSubmit.bind(this)} className="">
                        <div className="max-w-[75vw] 2xl:max-w-[65vw] xl:max-w-[75vw] ">
                            <div className="grid grid-cols-5 gap-5 items-center">
                                <div className="col-span-2 max-h-[70px] min-h-[70px] relative">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">
                                        {dataLang?.serviceVoucher_day_vouchers}{" "}
                                    </label>
                                    <div className="custom-date-picker flex flex-row ">
                                        <DatePicker
                                            blur
                                            fixedHeight
                                            showTimeSelect
                                            selected={date}
                                            onSelect={(date) => _HandleChangeInput("date", date)}
                                            onChange={(e) => _HandleChangeInput("date", e)}
                                            placeholderText="DD/MM/YYYY HH:mm:ss"
                                            dateFormat="dd/MM/yyyy h:mm:ss aa"
                                            timeInputLabel={"Time: "}
                                            placeholder={
                                                dataLang?.price_quote_system_default || "price_quote_system_default"
                                            }
                                            className={`border focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                                        />
                                        {date && (
                                            <>
                                                <MdClear
                                                    className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                    onClick={() => _HandleChangeInput("clear")}
                                                />
                                            </>
                                        )}
                                        <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                                    </div>
                                </div>
                                <div className="col-span-1 max-h-[70px] min-h-[70px]">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">
                                        {dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={code}
                                        onChange={_HandleChangeInput.bind(this, "code")}
                                        placeholder={"Mặc định theo hệ thống"}
                                        type="text"
                                        className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2.5 border outline-none mb-2"
                                    />
                                </div>
                                <div className="col-span-1 max-h-[70px] min-h-[70px]">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">
                                        {props.dataLang?.serviceVoucher_branch} <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        closeMenuOnSelect={true}
                                        placeholder={props.dataLang?.serviceVoucher_branch}
                                        options={dataBranch}
                                        isSearchable={true}
                                        onChange={_HandleChangeInput.bind(this, "valueBr")}
                                        LoadingIndicator
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                        value={valueBr}
                                        maxMenuHeight="200px"
                                        isClearable={true}
                                        menuPortalTarget={document.body}
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
                                                position: "absolute",
                                            }),
                                        }}
                                        className={`${errBranch ? "border-red-500" : "border-transparent"
                                            } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] mb-2 font-normal outline-none border `}
                                    />
                                    {errBranch && (
                                        <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                            {props.dataLang?.client_list_bran}
                                        </label>
                                    )}
                                </div>
                                <div className="col-span-1  max-h-[70px] min-h-[70px]">
                                    <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">
                                        {dataLang?.serviceVoucher_supplier || "serviceVoucher_supplier"}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        closeMenuOnSelect={true}
                                        placeholder={dataLang?.serviceVoucher_supplier || "serviceVoucher_supplier"}
                                        options={dataSupplier}
                                        isSearchable={true}
                                        onChange={_HandleChangeInput.bind(this, "valueSupplier")}
                                        LoadingIndicator
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                        value={valueSupplier}
                                        maxMenuHeight="200px"
                                        isClearable={true}
                                        menuPortalTarget={document.body}
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
                                                position: "absolute",
                                            }),
                                        }}
                                        className={`${errSupplier ? "border-red-500" : "border-transparent"
                                            } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] mb-2 rounded text-[#52575E] font-normal outline-none border `}
                                    />
                                    {errSupplier && (
                                        <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">
                                            {props.dataLang?.purchase_order_errSupplier}
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                        <h2 className="font-normal bg-[#ECF0F4] p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  mb-1 ">
                            {dataLang?.serviceVoucher_information_services || "serviceVoucher_information_services"}
                        </h2>
                        <div className="grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10">
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-2    text-center    truncate font-[400] flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={_HandleAddNew.bind(this)}
                                    title="Thêm"
                                    className="transition hover:bg-red-100 hover:animate-pulse	 rounded-full bg-slate-200 flex flex-col justify-center items-center"
                                >
                                    <Add color="red" size={20} className="" />
                                </button>
                                {dataLang?.serviceVoucher_services_arising || "serviceVoucher_services_arising"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-2    text-center  truncate font-[400]">
                                {dataLang?.serviceVoucher_quantity || "serviceVoucher_quantity"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {dataLang?.serviceVoucher_unit_price || "serviceVoucher_unit_price"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {"% CK"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                                {"ĐGSCK"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-2    text-center  truncate font-[400]">
                                {dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                                {dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                                {dataLang?.serviceVoucher_note || "serviceVoucher_note"}
                            </h4>
                            <h4 className="2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                                {dataLang?.serviceVoucher_operation || "serviceVoucher_operation"}
                            </h4>
                        </div>
                        <Customscrollbar className="min-h-[140px] xl:min-h-[140px] 2xl:min-h-[180px] max-h-[140px] xl:max-h-[140px] 2xl:max-h-[180px]">
                            {sortedArr.map((e, index) => (
                                <div className="grid grid-cols-12 gap-1 py-1 " key={e?.id}>
                                    <div className="col-span-2  my-auto ">
                                        <textarea
                                            value={e?.dichvu}
                                            onChange={_HandleChangeInputOption.bind(this, e?.id, "dichvu", index)}
                                            name="optionEmail"
                                            placeholder="Dịch vụ"
                                            type="text"
                                            className={`${errService && e?.dichvu == "" ? "border-red-500" : "border-gray-300"
                                                } placeholder:text-slate-300 bg-[#ffffff] rounded text-[#52575E] min-h-[40px] h-[40px] max-h-[80px] 2xl:text-[12px] xl:text-[13px] text-[12px] w-full font-normal outline-none border  p-1.5 `}
                                        />
                                    </div>
                                    <div className="col-span-2 flex items-center justify-center">
                                        <div className="flex items-center justify-center">
                                            <button
                                                type="button"
                                                className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-[1px]  bg-slate-200 rounded-full"
                                                onClick={() => handleDecrease(e?.id)}
                                            >
                                                <Minus className="scale-70" size="16" />
                                            </button>
                                            <InPutNumericFormat
                                                className={`${(e?.soluong == 0 && "border-red-500") ||
                                                    (e?.soluong == "" && "border-red-500")
                                                    } appearance-none text-center 2xl:text-[12px] xl:text-[13px] text-[12px] py-2 px-0.5 font-normal 2xl:w-20 xl:w-[55px] w-[63px]  focus:outline-none border-b-2 border-gray-200`}
                                                onValueChange={_HandleChangeInputOption.bind(this, e?.id, "soluong", e)}
                                                value={e?.soluong}
                                                isAllowed={isAllowedNumber}
                                            />
                                            <button
                                                type="button"
                                                className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-[1px]  bg-slate-200 rounded-full"
                                                onClick={() => handleIncrease(e.id)}
                                            >
                                                <Add className="scale-70" size="16" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-1 text-center flex items-center justify-center">
                                        <InPutMoneyFormat
                                            value={e?.dongia}
                                            onValueChange={_HandleChangeInputOption.bind(this, e?.id, "dongia", index)}
                                            className={`
                                            ${(e?.dongia == 0 && "border-red-500") ||
                                                (e?.dongia == "" && "border-red-500")
                                                }
                                            appearance-none 2xl:text-[12px] xl:text-[13px] text-[12px] text-center py-1 px-1 font-normal w-[90%] focus:outline-none border-b-2 border-gray-200`}
                                        />
                                    </div>
                                    <div className="col-span-1 text-center flex items-center justify-center">
                                        <InPutNumericFormat
                                            value={e?.chietkhau}
                                            onValueChange={_HandleChangeInputOption.bind(
                                                this,
                                                e?.id,
                                                "chietkhau",
                                                index
                                            )}
                                            className="appearance-none text-center py-1 px-1 font-normal w-[90%]  focus:outline-none border-b-2 2xl:text-[12px] xl:text-[13px] text-[12px] border-gray-200"
                                            isAllowed={isAllowedDiscount}
                                        />
                                    </div>
                                    <div className="col-span-1 text-right flex items-center justify-end">
                                        <h3 className="px-2 2xl:text-[12px] xl:text-[13px] text-[12px]">
                                            {formatNumber(e?.dongiasauck)}
                                        </h3>
                                    </div>
                                    <div className="col-span-2 flex justify-center items-center">
                                        <Select
                                            closeMenuOnSelect={true}
                                            placeholder={props.dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}
                                            options={taxOptions}
                                            isSearchable={true}
                                            onChange={_HandleChangeInputOption.bind(this, e?.id, "thue", index)}
                                            LoadingIndicator
                                            noOptionsMessage={() => "Không có dữ liệu"}
                                            value={e?.thue}
                                            maxMenuHeight="200px"
                                            isClearable={true}
                                            menuPortalTarget={document.body}
                                            formatOptionLabel={(option) => (
                                                <div className="flex justify-start items-center gap-1 ">
                                                    <h2 className="2xl:text-[12px] xl:text-[13px] text-[12px]">
                                                        {option?.label}
                                                    </h2>
                                                    <h2 className="2xl:text-[12px] xl:text-[13px] text-[12px]">{`(${option?.tax_rate})`}</h2>
                                                </div>
                                            )}
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
                                                    position: "absolute",
                                                }),
                                            }}
                                            className="border-transparent placeholder:text-slate-300 w-full 2xl:text-[12px] xl:text-[13px] text-[12px] bg-[#ffffff] rounded text-[#52575E] mb-2 font-normal outline-none border"
                                        />
                                    </div>
                                    <div className="col-span-1 text-right flex items-center justify-end">
                                        <h3 className="px-2 2xl:text-[12px] xl:text-[13px] text-[12px]">
                                            {formatMoney(e?.thanhtien)}
                                        </h3>
                                    </div>
                                    <div className="col-span-1 flex items-center justify-center">
                                        <textarea
                                            value={e?.ghichu}
                                            onChange={_HandleChangeInputOption.bind(this, e?.id, "ghichu", index)}
                                            name="optionEmail"
                                            placeholder="Ghi chú"
                                            type="text"
                                            className="focus:border-[#92BFF7] border-[#d0d5dd] min-h-[40px] h-[40px] max-h-[80px] 2xl:text-[12px] xl:text-[13px] text-[12px]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
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
                        </Customscrollbar>
                        <div className="grid grid-cols-11 mb-1 font-normal bg-[#ecf0f475] p-1.5 items-center">
                            <div className="col-span-3  flex items-center gap-2">
                                <h2 className="2xl:text-[12px] xl:text-[13px] text-[12px]">
                                    {dataLang?.purchase_order_detail_discount || "purchase_order_detail_discount"}
                                </h2>
                                <div className="col-span-1 text-center flex items-center justify-center">
                                    <InPutNumericFormat
                                        isAllowed={isAllowedDiscount}
                                        value={chietkhautong}
                                        onValueChange={_HandleChangeInput.bind(this, "chietkhautong")}
                                        className=" text-center 2xl:text-[12px] xl:text-[13px] text-[12px] py-1 px-2 bg-transparent font-normal w-20 focus:outline-none border-b-2 border-gray-300"
                                    />
                                </div>
                            </div>
                            <div className="col-span-3 flex items-center">
                                <h2 className="w-[30%] 2xl:text-[12px] xl:text-[13px] text-[12px]">
                                    {dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}
                                </h2>
                                <Select
                                    closeMenuOnSelect={true}
                                    placeholder={dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}
                                    options={taxOptions}
                                    isSearchable={true}
                                    onChange={_HandleChangeInput.bind(this, "thuetong")}
                                    LoadingIndicator
                                    noOptionsMessage={() => "Không có dữ liệu"}
                                    value={thuetong}
                                    maxMenuHeight="200px"
                                    isClearable={true}
                                    menuPortalTarget={document.body}
                                    formatOptionLabel={(option) => (
                                        <div className="flex justify-start items-center gap-1 ">
                                            <h2 className="2xl:text-[12px] xl:text-[13px] text-[12px]">
                                                {option?.label}
                                            </h2>
                                            <h2 className="2xl:text-[12px] xl:text-[13px] text-[12px]">{`(${option?.tax_rate})`}</h2>
                                        </div>
                                    )}
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
                                            position: "absolute",
                                        }),
                                        control: (provided, state) => ({
                                            ...provided,
                                            minHeight: 30,
                                            maxHeight: 30,
                                        }),
                                    }}
                                    className=" text-[12px] border-transparent placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border"
                                />
                            </div>
                        </div>
                        <h2 className="font-normal bg-[white] 2xl:text-[12px] xl:text-[13px] text-[12px]  p-1 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]">
                            {dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"}{" "}
                        </h2>
                        <div className="grid grid-cols-5">
                            <div className="col-span-3">
                                <div className="text-[#344054] font-normal text-sm mb-1 ">
                                    {dataLang?.purchase_order_note || "purchase_order_note"}
                                </div>
                                <textarea
                                    value={note}
                                    placeholder={dataLang?.purchase_order_note || "purchase_order_note"}
                                    onChange={_HandleChangeInput.bind(this, "note")}
                                    name="fname"
                                    type="text"
                                    className="focus:border-[#92BFF7] 2xl:text-[12px] xl:text-[13px] text-[12px] border-[#d0d5dd] placeholder:text-slate-300 w-[60%] min-h-[120px] max-h-[150px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                                />
                            </div>
                            <div className="text-right mt-2 space-y-1 col-span-2 flex-col justify-between ">
                                <div className="flex justify-between "></div>
                                <div className="flex justify-between ">
                                    <div className="font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px] ">
                                        <h3>{dataLang?.purchase_order_table_total || "purchase_order_table_total"}</h3>
                                    </div>
                                    <div className="font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]">
                                        <h3 className="text-blue-600">{formatMoney(tongTienState.tongTien)}</h3>
                                    </div>
                                </div>
                                <div className="flex justify-between ">
                                    <div className="font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]">
                                        <h3>
                                            {dataLang?.purchase_order_detail_discounty ||
                                                "purchase_order_detail_discounty"}
                                        </h3>
                                    </div>
                                    <div className="font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]">
                                        <h3 className="text-blue-600">{formatMoney(tongTienState.tienChietKhau)}</h3>
                                    </div>
                                </div>
                                <div className="flex justify-between ">
                                    <div className="font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]">
                                        <h3>
                                            {dataLang?.purchase_order_detail_money_after_discount ||
                                                "purchase_order_detail_money_after_discount"}
                                        </h3>
                                    </div>
                                    <div className="font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]">
                                        <h3 className="text-blue-600">{formatMoney(tongTienState.tongTienSauCK)}</h3>
                                    </div>
                                </div>
                                <div className="flex justify-between ">
                                    <div className="font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]">
                                        <h3>
                                            {dataLang?.purchase_order_detail_tax_money ||
                                                "purchase_order_detail_tax_money"}
                                        </h3>
                                    </div>
                                    <div className="font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]">
                                        <h3 className="text-blue-600">{formatMoney(tongTienState.tienThue)}</h3>
                                    </div>
                                </div>
                                <div className="flex justify-between ">
                                    <div className="font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]">
                                        <h3>
                                            {dataLang?.purchase_order_detail_into_money ||
                                                "purchase_order_detail_into_money"}
                                        </h3>
                                    </div>
                                    <div className="font-normal 2xl:text-[14px] xl:text-[13px] text-[12.5px]">
                                        <h3 className="text-blue-600">{formatMoney(tongTienState.tongThanhTien)}</h3>
                                    </div>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        type="button"
                                        onClick={_HandleCloseModal.bind(this)}
                                        className="button text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                                    >
                                        {dataLang?.purchase_order_purchase_back || "purchase_order_purchase_back"}
                                    </button>
                                    <button
                                        onClick={_HandleSubmit.bind(this)}
                                        type="submit"
                                        className="button text-[#FFFFFF]  font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                                    >
                                        {dataLang?.purchase_order_purchase_save || "purchase_order_purchase_save"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </PopupEdit>
        </>
    );
};
export default Popup_servie;
