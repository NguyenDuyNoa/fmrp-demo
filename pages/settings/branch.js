import Head from "next/head";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { ListBtn_Setting } from "./information";
import { _ServerInstance as Axios } from "/services/axios";

import PhoneInput from "react-phone-input-2";
import { Edit as IconEdit, Trash as IconDelete, SearchNormal1 as IconSearch } from "iconsax-react";
import "react-phone-input-2/lib/style.css";


import useToast from "@/hooks/useToast";
import useStatusExprired from "@/hooks/useStatusExprired";

import PopupEdit from "@/components/UI/popup";
import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import { Container, ContainerBody } from "@/components/UI/common/layout";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";

const Index = (props) => {
    const router = useRouter();

    const dataLang = props.dataLang;

    const trangthaiExprired = useStatusExprired();

    const [data, sData] = useState([]);

    const [onFetching, sOnFetching] = useState(false);

    const [keySearch, sKeySearch] = useState("");

    const { limit, updateLimit: sLimit, totalItems: totalItem, updateTotalItems: sTotalItem } = useLimitAndTotalItems()


    const _ServerFetching = () => {
        Axios("GET", `/api_web/Api_Branch/branch?csrf_protection=true`,
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
                    sTotalItem(output);
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true) || (keySearch && sOnFetching(true));
    }, [limit, router.query?.page]);

    const paginate = (pageNumber) => {
        router.push({
            pathname: "/settings/branch",
            query: { page: pageNumber },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace("/settings/branch");
        sOnFetching(true);
    }, 500)
    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.branch_title}</title>
            </Head>
            <Container className="">
                {trangthaiExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.branch_seting || "branch_seting"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.branch_title || "branch_title"}</h6>
                    </div>
                )}
                <div className="grid grid-cols-9 gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <ContainerBody>
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex justify-between  mt-1 mr-2">
                                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                    {dataLang?.branch_title}
                                </h2>
                                <div className="flex justify-end items-center gap-2">
                                    <Popup_ChiNhanh
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                                </div>
                            </div>
                            <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                                        <SearchComponent
                                            dataLang={dataLang}
                                            onChange={_HandleOnChangeKeySearch.bind(this)}
                                        />
                                        <div>
                                            <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                        </div>
                                    </div>
                                </div>
                                <Customscrollbar className="min:h-[200px] h-[83%] max:h-[500px] overflow-auto pb-2">
                                    <div className="w-full">
                                        <HeaderTable gridCols={12}>
                                            <ColumnTable colSpan={4} textAlign={'left'}>
                                                {dataLang?.branch_popup_name}
                                            </ColumnTable>
                                            <ColumnTable colSpan={3} textAlign={'left'}>
                                                {dataLang?.branch_popup_address}
                                            </ColumnTable>
                                            <ColumnTable colSpan={3} textAlign={'left'}>
                                                {dataLang?.branch_popup_phone}
                                            </ColumnTable>
                                            <ColumnTable colSpan={2} textAlign={'center'}>
                                                {dataLang?.branch_popup_properties}
                                            </ColumnTable>
                                        </HeaderTable>
                                        {onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : data.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[500px]">
                                                    {data.map((e) => (
                                                        <RowTable gridCols={12} key={e.id.toString()} >
                                                            <RowItemTable colSpan={4} textAlign={'left'}>
                                                                {e.name}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={3} textAlign={'left'}>
                                                                {e.address}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={3} textAlign={'left'}>
                                                                {e.number_phone}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={2} className="flex justify-center items-center gap-2">
                                                                <Popup_ChiNhanh
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    className="xl:text-base text-xs"
                                                                    dataLang={dataLang}
                                                                    name={e.name}
                                                                    phone={e.number_phone}
                                                                    address={e.address}
                                                                    id={e.id}
                                                                />
                                                                <BtnAction
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    onRefreshGroup={() => { }}
                                                                    dataLang={dataLang}
                                                                    id={e?.id}
                                                                    type="settings_branch"
                                                                />
                                                            </RowItemTable>
                                                        </RowTable>
                                                    ))}
                                                </div>
                                            </>
                                        ) : <NoData />}
                                    </div>
                                </Customscrollbar>
                            </div>
                        </div>
                        {data?.length != 0 && (
                            <ContainerPagination>
                                <TitlePagination
                                    dataLang={dataLang}
                                    totalItems={totalItem?.iTotalDisplayRecords}
                                />
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(totalItem?.iTotalDisplayRecords)}
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

const Popup_ChiNhanh = (props) => {
    const [open, sOpen] = useState(false);

    const isShow = useToast();

    const _ToggleModal = (e) => sOpen(e);

    const [onSending, sOnSending] = useState(false);

    const [name, sName] = useState("");

    const [address, sAddress] = useState("");

    const [phone, sPhone] = useState("");

    const [required, sRequired] = useState(false);

    useEffect(() => {
        sName(props.name ? props.name : "");
        sAddress(props.address ? props.address : "");
        sPhone(props.phone ? props.phone : "");
        sRequired(false);
    }, [open]);

    const id = props.id;

    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value.target?.value);
        } else if (type == "address") {
            sAddress(value.target?.value);
        } else if (type == "phone") {
            sPhone(value.target?.value);
        }
    };

    const _ServerSending = () => {
        var data = new FormData();
        data.append("name", name);
        data.append("number_phone", phone);
        data.append("address", address);

        Axios(
            "POST",
            `${props.id
                ? `/api_web/Api_Branch/branch/${id}?csrf_protection=true`
                : "/api_web/Api_Branch/branch?csrf_protection=true"
            }`,
            {
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", props.dataLang[message]);
                        sName("");
                        sAddress("");
                        sPhone("");
                        props.onRefresh && props.onRefresh();
                        sOpen(false);
                    } else {
                        isShow("error", props.dataLang[message]);
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
        if (name.length == 0) {
            sRequired(true);
        } else {
            sRequired(false);
        }
        sOnSending(true);
    };

    useEffect(() => {
        sRequired(false);
    }, [name.length > 0]);

    return (
        <PopupEdit
            title={
                props.id ? `${props.dataLang?.branch_popup_edit}` : `${props.dataLang?.branch_popup_create_new_branch}`
            }
            button={props.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`}
            onClickOpen={_ToggleModal.bind(this, true)}
            open={open}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className="pt-5 w-96">
                <form onSubmit={_HandleSubmit.bind(this)} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[#344054] font-normal text-base">
                            {props.dataLang?.branch_popup_name}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={name}
                            onChange={_HandleChangeInput.bind(this, "name")}
                            name="fname"
                            type="text"
                            className={`${required ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                } placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal  p-2 border outline-none`}
                        />
                        {required && <label className="text-sm text-red-500">Vui lòng nhập tên chi nhánh</label>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[#344054] font-normal">{props.dataLang?.branch_popup_address} </label>
                        <input
                            value={address}
                            onChange={_HandleChangeInput.bind(this, "address")}
                            name="adress"
                            type="text"
                            className="placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[#344054] font-normal">{props.dataLang?.branch_popup_phone}</label>
                        <PhoneInput
                            country={"vn"}
                            value={phone}
                            onChange={(phone) => sPhone(phone)}
                            inputProps={{
                                required: true,
                                autoFocus: true,
                            }}
                            inputStyle={{
                                width: "100%",
                                border: "1px solid #d0d5dd",
                                borderRadius: "8px",
                                paddingTop: "8px",
                                paddingBottom: "8px",
                                height: "auto",
                            }}
                        />
                    </div>
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
                </form>
            </div>
        </PopupEdit>
    );
};

export default Index;
