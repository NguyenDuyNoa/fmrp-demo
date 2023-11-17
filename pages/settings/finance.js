import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import { ListBtn_Setting } from "./information";
import { _ServerInstance as Axios } from "/services/axios";
import { NumericFormat } from "react-number-format";

//daupdate
import { Edit as IconEdit, Trash as IconDelete, SearchNormal1 as IconSearch } from "iconsax-react";

import Loading from "@/components/UI/loading";
import PopupEdit from "@/components/UI/popup";
import Pagination from "@/components/UI/pagination";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const trangthaiExprired = useStatusExprired();

    const { isOpen, isId, handleQueryId } = useToggle();

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: "/settings/finance",
            query: { tab: e },
        });
    };

    useEffect(() => {
        router.push({
            pathname: "/settings/finance",
            query: { tab: router.query?.tab ? router.query?.tab : "taxes" },
        });
    }, []);

    const [data, sData] = useState([]);

    const [onFetching, sOnFetching] = useState(true);

    const [totalItems, sTotalItems] = useState([]);

    const [keySearch, sKeySearch] = useState("");

    const [limit, sLimit] = useState(15);

    const _ServerFetching = () => {
        Axios(
            "GET",
            `/api_web/${
                (router.query?.tab === "taxes" && "Api_tax/tax?csrf_protection=true") ||
                (router.query?.tab === "currencies" && "Api_currency/currency?csrf_protection=true") ||
                (router.query?.tab === "paymentmodes" && "Api_payment_method/payment_method?csrf_protection=true")
            }`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, output } = response.data;
                    sData(rResult);
                    sTotalItems(output);
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        (router.query.tab && sOnFetching(true)) || (keySearch && sOnFetching(true));
    }, [limit, router.query?.page, router.query?.tab]);

    const handleDelete = async () => {
        Axios(
            "DELETE",
            `${
                (router.query.tab === "taxes" && `/api_web/Api_tax/tax/${id}?csrf_protection=true`) ||
                (router.query.tab === "currencies" && `/api_web/Api_currency/currency/${id}?csrf_protection=true`) ||
                (router.query.tab === "paymentmodes" &&
                    `/api_web/Api_payment_method/payment_method/${id}?csrf_protection=true`)
            } `,
            {},
            (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", dataLang?.aler_success_delete);
                    } else {
                        isShow("error", dataLang[message] || message);
                    }
                }
                _ServerFetching();
            }
        );

        handleQueryId({ status: false });
    };

    const paginate = (pageNumber) => {
        router.push({
            pathname: "/settings/finance",
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };
    const _HandleOnChangeKeySearch = ({ target: { value } }) => {
        sKeySearch(value);
        router.replace({
            pathname: "/settings/finance",
            query: {
                tab: router.query?.tab,
            },
        });
        setTimeout(() => {
            if (!value) {
                sOnFetching(true);
            }
            sOnFetching(true);
        }, 500);
    };

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.btn_seting_finance}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">{dataLang?.branch_seting}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.list_btn_seting_finance}</h6>
                    </div>
                )}
                <div className="grid grid-cols-9 gap-5 h-[99%]">
                    <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <h2 className="text-2xl text-[#52575E]">{dataLang?.btn_seting_finance}</h2>
                            <div className="flex space-x-3 items-center justify-start">
                                <button
                                    onClick={_HandleSelectTab.bind(this, "taxes")}
                                    className={`${
                                        router.query?.tab === "taxes"
                                            ? "text-[#0F4F9E] bg-[#e2f0fe]"
                                            : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"
                                    } rounded-lg px-4 py-2 outline-none`}
                                >
                                    {dataLang?.branch_popup_finance_exchange_rate}
                                </button>
                                <button
                                    onClick={_HandleSelectTab.bind(this, "currencies")}
                                    className={`${
                                        router.query?.tab === "currencies"
                                            ? "text-[#0F4F9E] bg-[#e2f0fe]"
                                            : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"
                                    } rounded-lg px-4 py-2 outline-none`}
                                >
                                    {dataLang?.branch_popup_finance_unittitle}
                                </button>
                                <button
                                    onClick={_HandleSelectTab.bind(this, "paymentmodes")}
                                    className={`${
                                        router.query?.tab === "paymentmodes"
                                            ? "text-[#0F4F9E] bg-[#e2f0fe]"
                                            : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"
                                    } rounded-lg px-4 py-2 outline-none`}
                                >
                                    {dataLang?.branch_popup_finance_payment}
                                </button>
                            </div>
                            <div className="3xl:h-[65%] 2xl:h-[60%] xl:h-[55%] h-[57%] space-y-2">
                                <div className="flex justify-end">
                                    <Popup_TaiChinh
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    />
                                </div>
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                                        <form className="flex items-center relative">
                                            <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                                            <input
                                                className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md w-[400px]"
                                                type="text"
                                                onChange={_HandleOnChangeKeySearch.bind(this)}
                                                placeholder={dataLang?.branch_search}
                                            />
                                        </form>
                                        <div className="flex space-x-2">
                                            <label className="font-[300] text-slate-400">Hiển thị :</label>
                                            <select
                                                className="outline-none"
                                                onChange={(e) => sLimit(e.target.value)}
                                                value={limit}
                                            >
                                                <option disabled className="hidden">
                                                    {limit == -1 ? "Tất cả" : limit}
                                                </option>
                                                <option value={15}>15</option>
                                                <option value={20}>20</option>
                                                <option value={40}>40</option>
                                                <option value={60}>60</option>
                                                <option value={-1}>Tất cả</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="min:h-[200px] h-[100%] max:h-[500px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div
                                        className={`${
                                            router.query?.tab === "taxes" || router.query?.tab === "currencies"
                                                ? "w-[100%]"
                                                : "w-[110%]"
                                        } 2xl:w-[100%] pr-2`}
                                    >
                                        <div
                                            className={`${
                                                router.query?.tab === "taxes" || router.query?.tab === "currencies"
                                                    ? "grid-cols-6"
                                                    : "grid-cols-9"
                                            } grid gap-5 sticky top-0 bg-white p-2 z-10`}
                                        >
                                            {(router.query?.tab === "taxes" || router.query?.tab === "currencies") && (
                                                <React.Fragment>
                                                    <h4 className="xl:text-[14px] px-2 text-[12px] col-span-3 text-[#667085] uppercase font-[300] text-left">
                                                        {router.query?.tab === "taxes" &&
                                                            dataLang?.branch_popup_finance_name}
                                                        {router.query?.tab === "currencies" &&
                                                            dataLang?.branch_popup_currency_name}
                                                    </h4>
                                                    <h4 className="xl:text-[14px] px-2 text-center text-[12px] col-span-2 text-[#667085] uppercase font-[300] ">
                                                        {router.query?.tab === "taxes" &&
                                                            dataLang?.branch_popup_finance_rate}
                                                        {router.query?.tab === "currencies" &&
                                                            dataLang?.branch_popup_curency_symbol}
                                                    </h4>
                                                </React.Fragment>
                                            )}
                                            {router.query?.tab === "paymentmodes" && (
                                                <React.Fragment>
                                                    <h4 className="xl:text-[14px] px-2 text-[12px] col-span-3 text-[#667085] uppercase font-[300] text-left">
                                                        {dataLang?.branch_popup_payment_name}
                                                    </h4>
                                                    <h4 className="xl:text-[14px] px-2 text-[12px] col-span-1 text-[#667085] uppercase font-[300] text-left">
                                                        {dataLang?.branch_popup_payment_type}
                                                    </h4>
                                                    <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-center">
                                                        {dataLang?.branch_popup_payment_balance}
                                                    </h4>
                                                    <h4 className="xl:text-[14px] px-2 text-[12px] col-span-2 text-[#667085] uppercase font-[300] text-left">
                                                        {dataLang?.branch_popup_payment_bank}
                                                    </h4>
                                                </React.Fragment>
                                            )}
                                            <h4 className="xl:text-[14px] px-2 text-[12px] col-span-1 text-[#667085] uppercase font-[300] text-center">
                                                {dataLang?.branch_popup_properties}
                                            </h4>
                                        </div>
                                        {onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : (
                                            <React.Fragment>
                                                {data.length == 0 && (
                                                    <div className=" max-w-[352px] mt-24 mx-auto">
                                                        <div className="text-center">
                                                            <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                                                <IconSearch />
                                                            </div>
                                                            <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                                                                Không tìm thấy các mục
                                                            </h1>
                                                            <div className="flex items-center justify-around mt-6 ">
                                                                <Popup_TaiChinh
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    dataLang={dataLang}
                                                                    className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">
                                                    {data.map((e) => (
                                                        <div
                                                            key={e.id.toString()}
                                                            className={`${
                                                                router.query?.tab === "taxes" ||
                                                                router.query?.tab === "currencies"
                                                                    ? "grid-cols-6"
                                                                    : "grid-cols-9"
                                                            } grid gap-5 py-2.5 px-2 hover:bg-slate-100/40 `}
                                                        >
                                                            {(router.query?.tab === "taxes" ||
                                                                router.query?.tab === "currencies") && (
                                                                <React.Fragment>
                                                                    <h6 className="xl:text-base text-xs px-2 col-span-3">
                                                                        {router.query?.tab === "taxes" && e?.name}
                                                                        {router.query?.tab === "currencies" && e?.code}
                                                                    </h6>
                                                                    <h6 className="xl:text-base text-xs px-2 col-span-2 text-center ">
                                                                        {router.query?.tab === "taxes" && e?.tax_rate}
                                                                        {router.query?.tab === "currencies" &&
                                                                            e?.symbol}
                                                                    </h6>
                                                                </React.Fragment>
                                                            )}
                                                            {router.query?.tab === "paymentmodes" && (
                                                                <React.Fragment>
                                                                    <h6 className="xl:text-base text-xs px-2 col-span-3">
                                                                        {router.query?.tab === "paymentmodes" &&
                                                                            e?.name}
                                                                    </h6>
                                                                    <h6 className="xl:text-base text-xs px-2 col-span-1">
                                                                        {router.query?.tab === "paymentmodes" &&
                                                                        e?.cash_bank == "1"
                                                                            ? dataLang?.paymethod_cash
                                                                            : dataLang?.paymethod_bank}
                                                                    </h6>
                                                                    <h6 className="xl:text-base text-xs px-2 col-span-2 text-center">
                                                                        {router.query?.tab === "paymentmodes" &&
                                                                            e?.opening_balance
                                                                                ?.toString()
                                                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                                    </h6>
                                                                    <h6 className="xl:text-base text-xs px-2 col-span-2">
                                                                        {router.query?.tab === "paymentmodes" &&
                                                                            e?.description}
                                                                    </h6>
                                                                </React.Fragment>
                                                            )}
                                                            <div className="flex space-x-2 justify-center ">
                                                                <Popup_TaiChinh
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    className="xl:text-base text-xs "
                                                                    dataLang={dataLang}
                                                                    data={e}
                                                                />
                                                                <button className="xl:text-base text-xs  ">
                                                                    <IconDelete
                                                                        onClick={() =>
                                                                            handleQueryId({ id: e.id, status: true })
                                                                        }
                                                                        color="red"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>{" "}
                                                <PopupConfim
                                                    dataLang={dataLang}
                                                    type="warning"
                                                    title={TITLE_DELETE}
                                                    subtitle={CONFIRM_DELETION}
                                                    isOpen={isOpen}
                                                    save={handleDelete}
                                                    cancel={() => handleQueryId({ status: false })}
                                                />
                                            </React.Fragment>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data?.length != 0 && (
                            <div className="flex space-x-5 items-center">
                                <h6>
                                    Hiển thị {totalItems?.iTotalDisplayRecords} trong số {totalItems?.iTotalRecords}{" "}
                                    thành phần
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
                </div>
            </div>
        </React.Fragment>
    );
};

const Popup_TaiChinh = (props) => {
    const router = useRouter();

    const isShow = useToast();

    const tabPage = router.query?.tab;

    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const [onSending, sOnSending] = useState(false);

    const [nameTax, sNameTax] = useState("");

    const [rateTax, sRateTax] = useState(null);

    const [codeCu, sCodeCu] = useState("");

    const [symbolCu, sSymbolCu] = useState("");

    const [nameMe, sNameMe] = useState("");

    const [methodMe, sMethodMe] = useState("0");

    const [balanceMe, sBalanceMe] = useState(null);

    const [descriptionMe, sDescriptionMe] = useState("");

    const [errInput, sErrInput] = useState(false);

    const [errInputCu, sErrInputCu] = useState(false);

    const [errInputCusynm, sErrInputCusynm] = useState(false);

    const [errInputMe, sErrInputMe] = useState(false);

    useEffect(() => {
        sErrInput(false);
        sErrInputMe(false);
        sErrInputCu(false);
        sErrInputCusynm(false);
        sNameTax(props.data?.name ? props.data?.name : "");
        sRateTax(props.data?.tax_rate ? props.data?.tax_rate : null);
        sCodeCu(props.data?.code ? props.data?.code : "");
        sSymbolCu(props.data?.symbol ? props.data?.symbol : "");
        sNameMe(props.data?.name ? props.data?.name : "");
        sMethodMe(props.data?.cash_bank ? props.data?.cash_bank : "0");
        sBalanceMe(props.data?.opening_balance ? props.data?.opening_balance : null);
        sDescriptionMe(props.data?.description ? props.data?.description : "");
    }, [open]);

    const _HandleChangeInput = (type, value) => {
        if (type == "nameTax") {
            sNameTax(value.target?.value);
        } else if (type == "rateTax") {
            sRateTax(value.target?.value);
        } else if (type == "codeCu") {
            sCodeCu(value.target?.value);
        } else if (type == "symbolCu") {
            sSymbolCu(value.target?.value);
        } else if (type == "nameMe") {
            sNameMe(value.target?.value);
        } else if (type == "methodMe") {
            sMethodMe(value.target?.value);
        } else if (type == "balanceMe") {
            // console.log(value.target.value);
            sBalanceMe(Number(value.value));
        } else if (type == "descriptionMe") {
            sDescriptionMe(value.target?.value);
        }
    };

    const _ServerSending = () => {
        const id = props.data?.id;
        var data = new FormData();
        data.append("name", (tabPage === "taxes" && nameTax) || (tabPage === "paymentmodes" && nameMe));
        data.append("tax_rate", rateTax);
        data.append("code", codeCu);
        data.append("symbol", symbolCu);
        data.append("cash_bank", methodMe);
        data.append("opening_balance", balanceMe);
        data.append("description", descriptionMe);

        Axios(
            "POST",
            id
                ? `${
                      (tabPage === "taxes" && `/api_web/Api_tax/tax/${id}?csrf_protection=true`) ||
                      (tabPage === "currencies" && `/api_web/Api_currency/currency/${id}?csrf_protection=true`) ||
                      (tabPage === "paymentmodes" &&
                          `/api_web/Api_payment_method/payment_method/${id}?csrf_protection=true`)
                  } `
                : `${
                      (tabPage === "taxes" && `/api_web/Api_tax/tax?csrf_protection=true`) ||
                      (tabPage === "currencies" && `/api_web/Api_currency/currency?csrf_protection=true`) ||
                      (tabPage === "paymentmodes" && `/api_web/Api_payment_method/payment_method?csrf_protection=true`)
                  } `,
            {
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", props.dataLang[message]);
                        sErrInputCu(false);
                        sErrInputCusynm(false);
                        sErrInput(false);
                        sErrInputMe(false);

                        sNameTax("");
                        sRateTax(null);
                        sCodeCu("");
                        sSymbolCu("");
                        sNameMe("");
                        sMethodMe("0");
                        sBalanceMe(null);
                        sDescriptionMe("");
                        sOpen(false);
                        props.onRefresh && props.onRefresh();
                    } else {
                        isShow("error", props.dataLang[message] || message);
                    }
                }
                sOnSending(false);
            }
        );
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        // || nameMe.length == 0  || balanceMe == 0
        if (nameTax.length == 0) {
            sErrInput(true);
        } else {
            sErrInput(false);
        }
        if (codeCu.length == 0) {
            sErrInputCu(true);
        } else {
            sErrInputCu(false);
        }
        if (symbolCu.length == 0) {
            sErrInputCusynm(true);
        } else {
            sErrInputCusynm(false);
        }
        if (nameMe.length == 0) {
            sErrInputMe(true);
        } else {
            sErrInputMe(false);
        }
        sOnSending(true);
    };

    useEffect(() => {
        sErrInput(false);
        sErrInputCu(false);
        sErrInputMe(false);
        sErrInputCusynm(false);
    }, [nameTax.length > 0, symbolCu.length > 0, codeCu.length > 0, nameMe.length > 0]);

    return (
        <PopupEdit
            title={
                props.data?.id
                    ? `${
                          (tabPage === "taxes" && props.dataLang?.branch_popup_finance_edit) ||
                          (tabPage === "currencies" && props.dataLang?.branch_popup_finance_editunit) ||
                          (tabPage === "paymentmodes" && props.dataLang?.branch_popup_payment_edit)
                      }`
                    : `${
                          (tabPage === "taxes" && props.dataLang?.branch_popup_finance_addnew) ||
                          (tabPage === "currencies" && props.dataLang?.branch_popup_finance_unit) ||
                          (tabPage === "paymentmodes" && props.dataLang?.branch_popup_payment_addnew)
                      }`
            }
            button={props.data?.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`}
            onClickOpen={_ToggleModal.bind(this, true)}
            open={open}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className={`w-96 mt-4`}>
                <form onSubmit={_HandleSubmit.bind(this)}>
                    <div>
                        {tabPage === "taxes" && (
                            <React.Fragment>
                                <div className="flex flex-wrap justify-between">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {props.dataLang?.branch_popup_finance_name}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={nameTax}
                                        onChange={_HandleChangeInput.bind(this, "nameTax")}
                                        name="fname"
                                        type="text"
                                        className={`${
                                            errInput ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                        } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-1`}
                                    />
                                    {errInput && (
                                        <label className="mb-2 text-[14px] text-red-500">
                                            Vui lòng nhập tên loại thuế
                                        </label>
                                    )}

                                    {/* {nameTax ==="" ?  <label className="mb-6 mt-2 text-[14px] text-red-500">Vui lòng nhập tên loại thuế</label> :"" } */}
                                </div>
                                <div className="flex flex-wrap justify-between">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {props.dataLang?.branch_popup_finance_rate}{" "}
                                    </label>
                                    <input
                                        value={rateTax}
                                        onChange={_HandleChangeInput.bind(this, "rateTax")}
                                        name="tax_rate"
                                        type="number"
                                        min={0}
                                        max={100}
                                        step="0.01"
                                        className="placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
                                    />
                                </div>
                            </React.Fragment>
                        )}
                        {tabPage === "currencies" && (
                            <React.Fragment>
                                <div className="flex flex-wrap justify-between">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {props.dataLang?.branch_popup_currency_name}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        // required
                                        value={codeCu}
                                        onChange={_HandleChangeInput.bind(this, "codeCu")}
                                        name="fname"
                                        type="text"
                                        className={`${
                                            errInputCu ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                        } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-1`}
                                    />
                                    {errInputCu && (
                                        <label className="mb-2 text-[14px] text-red-500">
                                            Vui lòng nhập mã tiền tệ
                                        </label>
                                    )}
                                </div>
                                <div className="flex flex-wrap justify-between">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {props.dataLang?.branch_popup_curency_symbol}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        // required
                                        value={symbolCu}
                                        onChange={_HandleChangeInput.bind(this, "symbolCu")}
                                        name="symbol"
                                        type="text"
                                        className={`${
                                            errInputCusynm
                                                ? "border-red-500"
                                                : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                        } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none`}
                                    />
                                    {errInputCusynm && (
                                        <label className=" mt-2 text-[14px] text-red-500">Vui lòng nhập kí hiệu</label>
                                    )}
                                </div>
                            </React.Fragment>
                        )}
                        {tabPage === "paymentmodes" && (
                            <React.Fragment>
                                <div className="flex flex-wrap justify-between">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {props.dataLang?.branch_popup_payment_name}{" "}
                                        <span className="text-red-500">*</span>{" "}
                                    </label>
                                    <input
                                        // required
                                        value={nameMe}
                                        onChange={_HandleChangeInput.bind(this, "nameMe")}
                                        name="fname"
                                        type="text"
                                        className={`${
                                            errInputMe ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                        } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-1`}
                                    />
                                    {errInputMe && (
                                        <label className="mb-2 text-[14px] text-red-500">
                                            Vui lòng nhập phương thức thanh toán
                                        </label>
                                    )}
                                </div>
                                <div className="flex flex-wrap justify-between">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {props.dataLang?.branch_popup_payment_balance}{" "}
                                    </label>
                                    {/* <input
                      // required
                      pattern="[0-9]*"
                      value={balanceMe}
                      onChange={_HandleChangeInput.bind(this, "balanceMe")}
                      id="#key"
                      name="opening_balance"                       
                      type="text"
                      className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-6"
                      /> */}

                                    <NumericFormat
                                        thousandSeparator=","
                                        name="opening_balance"
                                        value={balanceMe}
                                        //  onValueChange={_HandleChangeInput.bind(this, "balanceMe")}
                                        onValueChange={_HandleChangeInput.bind(this, "balanceMe")}
                                        className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none`}
                                    />
                                </div>
                                <div className="flex flex-wrap ">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {props.dataLang?.branch_popup_payment_bank}{" "}
                                    </label>
                                    <textarea
                                        value={descriptionMe}
                                        onChange={_HandleChangeInput.bind(this, "descriptionMe")}
                                        name="description"
                                        className="border border-gray-300 w-full min-h-[100px] outline-none p-2"
                                    />
                                </div>
                                <div className=" mt-2">
                                    <div className="flex justify-between p-2">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="nganhang"
                                                value={"0"}
                                                onChange={_HandleChangeInput.bind(this, "methodMe")}
                                                checked={methodMe === "0" ? true : false}
                                                className="scale-150 outline-none"
                                            />
                                            <label
                                                htmlFor="nganhang"
                                                className="relative flex cursor-pointer items-center rounded-full p-3"
                                                data-ripple-dark="true"
                                            >
                                                {props.dataLang?.branch_popup_payment_banking}
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="tienmat"
                                                value={"1"}
                                                onChange={_HandleChangeInput.bind(this, "methodMe")}
                                                checked={methodMe === "1" ? true : false}
                                                className="scale-150 outline-none"
                                            />
                                            <label
                                                htmlFor="tienmat"
                                                className="relative flex cursor-pointer items-center rounded-full p-3"
                                                data-ripple-dark="true"
                                            >
                                                {props.dataLang?.branch_popup_payment_cash}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}

                        <div className="text-right mt-5 space-x-2">
                            <button
                                type="button"
                                onClick={_ToggleModal.bind(this, false)}
                                className="button text-[#344054] font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD]"
                            >
                                {props.dataLang?.branch_popup_exit}
                            </button>
                            <button
                                type="submit"
                                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-lg bg-[#0F4F9E]"
                            >
                                {props.dataLang?.branch_popup_save}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </PopupEdit>
    );
};

export default Index;
