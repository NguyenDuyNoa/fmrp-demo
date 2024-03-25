import Head from "next/head";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { ListBtn_Setting } from "./information";
import { _ServerInstance as Axios } from "/services/axios";

//daupdate
import { Edit as IconEdit, Trash as IconDelete, SearchNormal1 as IconSearch } from "iconsax-react";


import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";

import Loading from "@/components/UI/loading";
import PopupEdit from "@/components/UI/popup";
import BtnAction from "@/components/UI/BtnAction";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import useSetingServer from "@/hooks/useConfigNumber";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import { Container, ContainerBody } from "@/components/UI/common/layout";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import InPutMoneyFormat from "@/components/UI/inputNumericFormat/inputMoneyFormat";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import { isAllowedNumber } from "@/utils/helpers/common";
import formatNumberConfig from "@/utils/helpers/formatnumber";

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const datasSeting = useSetingServer()

    const trangthaiExprired = useStatusExprired();

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

    const [keySearch, sKeySearch] = useState("");

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const formatnumber = (number) => {
        return formatNumberConfig(+number, datasSeting)
    }

    const _ServerFetching = () => {
        Axios("GET",
            `/api_web/${(router.query?.tab === "taxes" && "Api_tax/tax?csrf_protection=true") ||
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
    const paginate = (pageNumber) => {
        router.push({
            pathname: "/settings/finance",
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };
    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace({
            pathname: "/settings/finance",
            query: {
                tab: router.query?.tab,
            },
        });
        sOnFetching(true);
    }, 500)

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.btn_seting_finance}</title>
            </Head>
            <Container>
                {trangthaiExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.branch_seting || "branch_seting"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.list_btn_seting_finance || "list_btn_seting_finance"}</h6>
                    </div>
                )}
                <div className="grid grid-cols-9 gap-5 h-[99%]">
                    <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <ContainerBody>
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex items-center justify-between  mt-1 mr-2">
                                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                    {dataLang?.btn_seting_finance || 'btn_seting_finance'}
                                </h2>
                                <div className="flex justify-end items-center gap-2">
                                    <Popup_TaiChinh
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                                </div>
                            </div>
                            <div className="flex space-x-3 items-center justify-start">
                                <button
                                    onClick={_HandleSelectTab.bind(this, "taxes")}
                                    className={`${router.query?.tab === "taxes"
                                        ? "text-[#0F4F9E] bg-[#e2f0fe]"
                                        : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"
                                        } rounded-lg px-4 py-2 outline-none`}
                                >
                                    {dataLang?.branch_popup_finance_exchange_rate}
                                </button>
                                <button
                                    onClick={_HandleSelectTab.bind(this, "currencies")}
                                    className={`${router.query?.tab === "currencies"
                                        ? "text-[#0F4F9E] bg-[#e2f0fe]"
                                        : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"
                                        } rounded-lg px-4 py-2 outline-none`}
                                >
                                    {dataLang?.branch_popup_finance_unittitle}
                                </button>
                                <button
                                    onClick={_HandleSelectTab.bind(this, "paymentmodes")}
                                    className={`${router.query?.tab === "paymentmodes"
                                        ? "text-[#0F4F9E] bg-[#e2f0fe]"
                                        : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"
                                        } rounded-lg px-4 py-2 outline-none`}
                                >
                                    {dataLang?.branch_popup_finance_payment}
                                </button>
                            </div>
                            <div className="h-[93%] space-y-2">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                                        <SearchComponent
                                            dataLang={dataLang}
                                            onChange={_HandleOnChangeKeySearch.bind(this)}
                                        />
                                        <div className="">
                                            <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                        </div>
                                    </div>
                                </div>
                                <Customscrollbar className="min:h-[200px] h-[100%] max:h-[500px]">
                                    <div
                                        className={`w-full`}
                                    >
                                        <HeaderTable
                                            gridCols={router.query?.tab === "taxes" || router.query?.tab === "currencies"
                                                ? 6
                                                : 9}
                                        >
                                            {(router.query?.tab === "taxes" || router.query?.tab === "currencies") && (
                                                <React.Fragment>
                                                    <ColumnTable colSpan={3} textAlign={'left'}>
                                                        {router.query?.tab === "taxes" && dataLang?.branch_popup_finance_name}
                                                        {router.query?.tab === "currencies" && dataLang?.branch_popup_currency_name}
                                                    </ColumnTable>
                                                    <ColumnTable colSpan={2} textAlign={'center'}>
                                                        {router.query?.tab === "taxes" && dataLang?.branch_popup_finance_rate}
                                                        {router.query?.tab === "currencies" && dataLang?.branch_popup_curency_symbol}
                                                    </ColumnTable>
                                                </React.Fragment>
                                            )}
                                            {router.query?.tab === "paymentmodes" && (
                                                <React.Fragment>
                                                    <ColumnTable colSpan={3} textAlign={'left'}>
                                                        {dataLang?.branch_popup_payment_name}
                                                    </ColumnTable>
                                                    <ColumnTable colSpan={1} textAlign={'left'}>
                                                        {dataLang?.branch_popup_payment_type}
                                                    </ColumnTable>
                                                    <ColumnTable colSpan={2} textAlign={'center'}>
                                                        {dataLang?.branch_popup_payment_balance}
                                                    </ColumnTable>
                                                    <ColumnTable colSpan={2} textAlign={'left'}>
                                                        {dataLang?.branch_popup_payment_bank}
                                                    </ColumnTable>
                                                </React.Fragment>
                                            )}
                                            <ColumnTable colSpan={1} textAlign={'center'}>
                                                {dataLang?.branch_popup_properties}
                                            </ColumnTable>
                                        </HeaderTable>
                                        {onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : (
                                            <React.Fragment>
                                                {data.length == 0 && (
                                                    <NoData />
                                                )}
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">
                                                    {data.map((e) => (
                                                        <RowTable
                                                            key={e.id.toString()}
                                                            gridCols={router.query?.tab === "taxes" || router.query?.tab === "currencies" ? 6 : 9}
                                                        >
                                                            {(router.query?.tab === "taxes" ||
                                                                router.query?.tab === "currencies") && (
                                                                    <React.Fragment>
                                                                        <RowItemTable colSpan={3} >
                                                                            {router.query?.tab === "taxes" && e?.name}
                                                                            {router.query?.tab === "currencies" && e?.code}
                                                                        </RowItemTable>
                                                                        <RowItemTable colSpan={2} textAlign={'center'}>
                                                                            {router.query?.tab === "taxes" && formatnumber(e?.tax_rate)}
                                                                            {router.query?.tab === "currencies" &&
                                                                                e?.symbol}
                                                                        </RowItemTable>
                                                                    </React.Fragment>
                                                                )}
                                                            {router.query?.tab === "paymentmodes" && (
                                                                <React.Fragment>
                                                                    <RowItemTable colSpan={3} >
                                                                        {router.query?.tab === "paymentmodes" && e?.name}
                                                                    </RowItemTable>
                                                                    <RowItemTable colSpan={2}>
                                                                        {router.query?.tab === "paymentmodes" && e?.cash_bank == "1"
                                                                            ? dataLang?.paymethod_cash
                                                                            : dataLang?.paymethod_bank}
                                                                    </RowItemTable>
                                                                    <RowItemTable colSpan={1} textAlign={'right'}>
                                                                        {router.query?.tab === "paymentmodes" && formatnumber(e?.opening_balance)}
                                                                    </RowItemTable>
                                                                    <RowItemTable colSpan={2}>
                                                                        {router.query?.tab === "paymentmodes" && e?.description}
                                                                    </RowItemTable>
                                                                </React.Fragment>
                                                            )}
                                                            <RowItemTable colSpan={1} className="flex space-x-2 items-center justify-center ">
                                                                <Popup_TaiChinh
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    className="xl:text-base text-xs "
                                                                    dataLang={dataLang}
                                                                    data={e}
                                                                />
                                                                <BtnAction
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    onRefreshGroup={() => { }}
                                                                    dataLang={dataLang}
                                                                    id={e?.id}
                                                                    type={router.query?.tab}
                                                                />
                                                            </RowItemTable>
                                                        </RowTable>
                                                    ))}
                                                </div>{" "}
                                            </React.Fragment>
                                        )}
                                    </div>
                                </Customscrollbar>
                            </div>
                        </div>
                        {data?.length != 0 && (
                            <ContainerPagination>
                                <TitlePagination
                                    dataLang={dataLang}
                                    totalItems={totalItems?.iTotalDisplayRecords}
                                />
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                                    paginate={paginate}
                                    currentPage={router.query?.page || 1}
                                />
                            </ContainerPagination>
                        )}
                    </ContainerBody>
                </div>
            </Container>
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
                ? `${(tabPage === "taxes" && `/api_web/Api_tax/tax/${id}?csrf_protection=true`) ||
                (tabPage === "currencies" && `/api_web/Api_currency/currency/${id}?csrf_protection=true`) ||
                (tabPage === "paymentmodes" &&
                    `/api_web/Api_payment_method/payment_method/${id}?csrf_protection=true`)
                } `
                : `${(tabPage === "taxes" && `/api_web/Api_tax/tax?csrf_protection=true`) ||
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
                    ? `${(tabPage === "taxes" && props.dataLang?.branch_popup_finance_edit) ||
                    (tabPage === "currencies" && props.dataLang?.branch_popup_finance_editunit) ||
                    (tabPage === "paymentmodes" && props.dataLang?.branch_popup_payment_edit)
                    }`
                    : `${(tabPage === "taxes" && props.dataLang?.branch_popup_finance_addnew) ||
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
                                        className={`${errInput ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
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
                                    <InPutNumericFormat
                                        value={rateTax}
                                        isAllowed={isAllowedNumber}
                                        onChange={_HandleChangeInput.bind(this, "rateTax")}
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
                                        className={`${errInputCu ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
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
                                        className={`${errInputCusynm
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
                                        className={`${errInputMe ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
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

                                    <InPutMoneyFormat
                                        value={balanceMe}
                                        isAllowed={isAllowedNumber}
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
