import Head from "next/head";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import { ListBtn_Setting } from "./information";

import { _ServerInstance as Axios } from "/services/axios";

import { Edit as IconEdit, Trash as IconDelete, SearchNormal1 as IconSearch, Add as IconAdd } from "iconsax-react";

import useToast from "@/hooks/useToast";
import useStatusExprired from "@/hooks/useStatusExprired";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";

import PopupEdit from "@/components/UI/popup";
import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
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

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()


    const _ServerFetching = () => {
        Axios(
            "GET",
            "/api_web/Api_variation/variation?csrf_protection=true",
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
        sOnFetching(true) || (keySearch && sOnFetching(true));
    }, [limit, router.query?.page]);

    const paginate = (pageNumber) => {
        router.push({
            pathname: "/settings/variant",
            query: { page: pageNumber },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace("/settings/variant");
        sOnFetching(true);
    }, 500)
    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.list_btn_seting_variant}</title>
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
                        <h6>{dataLang?.list_btn_seting_variant || "list_btn_seting_variant"}</h6>
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
                                    {dataLang?.variant_title ? dataLang?.variant_title : "variant_title"}
                                </h2>
                                <div className="flex justify-end items-center gap-2">
                                    <Popup_ChiNhanh
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                                </div>
                            </div>
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
                            <Customscrollbar className="min:h-[200px] h-[72%] max:h-[500px]">
                                <div className="w-full">
                                    <HeaderTable gridCols={10}>
                                        <ColumnTable colSpan={3} textAlign={'left'}>
                                            {dataLang?.variant_name}
                                        </ColumnTable>
                                        <ColumnTable colSpan={5} textAlign={'left'}>
                                            {dataLang?.branch_popup_variant_option}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={'center'}>
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
                                                        gridCols={10}
                                                    >
                                                        <RowItemTable colSpan={3}>
                                                            {e?.name}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={5} className="gap-1 flex flex-wrap">
                                                            {e?.option?.map((e) => (
                                                                <TagBranch
                                                                    key={e.id.toString()}
                                                                    className="w-fit"
                                                                // className="mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-lg"
                                                                >
                                                                    {e.name}
                                                                </TagBranch>
                                                            ))}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} className="space-x-2 flex justify-center items-start">
                                                            <Popup_ChiNhanh
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                name={e.name}
                                                                option={e.option}
                                                                id={e.id}
                                                                className="xl:text-base text-xs"
                                                                dataLang={dataLang}
                                                            />
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                onRefreshGroup={() => { }}
                                                                dataLang={dataLang}
                                                                id={e?.id}
                                                                type={"settings_variant"}
                                                            />
                                                        </RowItemTable>
                                                    </RowTable>
                                                ))}
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                            </Customscrollbar>
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

const Popup_ChiNhanh = (props) => {
    const [open, sOpen] = useState(false);

    const isShow = useToast();

    const _ToggleModal = (e) => sOpen(e);

    const [onSending, sOnSending] = useState(false);

    const [name, sName] = useState("");

    const [option, sOption] = useState([]);

    const [required, sRequired] = useState(false);

    const [optionErr, sOptionErr] = useState(false);

    const [listOptErr, sListOptErr] = useState();

    useEffect(() => {
        sOption(props.option ? props.option : []);
        sName(props.name ? props.name : "");
        sRequired(false);
        sOptionErr(false);
    }, [open]);

    const [optionName, sOptionName] = useState("");

    const id = props.id;

    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value.target?.value);
        } else if (type == "optionName") {
            sOptionName(value.target?.value);
        }
    };

    const _OnChangeOption = (id, value) => {
        var index = option.findIndex((x) => x.id === id);
        option[index].name = value.target?.value;
        sOption([...option]);
    };

    const _ServerSending = () => {
        Axios(
            "POST",
            `${props.id
                ? `/api_web/Api_variation/variation/${id}?csrf_protection=true`
                : "/api_web/Api_variation/variation?csrf_protection=true"
            }`,
            {
                data: {
                    name: name,
                    option: option,
                },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message, same_option } = response.data;
                    if (isSuccess) {
                        isShow("success", props.dataLang[message]);
                        sName("");
                        sOption([]);
                        props.onRefresh && props.onRefresh();
                        sOpen(false);
                        sListOptErr();
                    } else {
                        isShow("error", props.dataLang[message]);
                        // const res = option.filter(i => same_option.some(item => i.name === item));
                        sListOptErr(same_option);
                    }
                    sOnSending(false);
                }
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
            isShow("error", props.dataLang?.required_field_null);
        } else {
            sOnSending(true);
        }
    };

    useEffect(() => {
        sRequired(false);
    }, [name.length > 0]);

    const _HandleAddNew = () => {
        sOption([...option, { id: Date.now(), name: optionName }]);
        sOptionName("");
    };
    const _HandleDelete = (id) => {
        sOption([...option.filter((x) => x.id !== id)]);
    };

    return (
        <PopupEdit
            title={
                props.id
                    ? `${props.dataLang?.variant_popup_edit}`
                    : `${props.dataLang?.branch_popup_create_new_variant}`
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
                            {props.dataLang?.variant_name} <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={name}
                            name="nameVariant"
                            onChange={_HandleChangeInput.bind(this, "name")}
                            placeholder={props.dataLang?.variant_name}
                            type="text"
                            className={`${required ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal  p-2 border outline-none`}
                        />
                        {required && <label className="text-sm text-red-500">Vui lòng nhập tên biến thể</label>}
                    </div>
                    <div className="space-y-1.5">
                        <h6 className="text-[#344054] font-normal text-sm">
                            {props.dataLang?.branch_popup_variant_option}
                        </h6>
                        <div className="pr-3 max-h-60 overflow-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                            {option.map((e) => (
                                <div className="flex space-x-3 items-center" key={e.id?.toString()}>
                                    <input
                                        value={e.name}
                                        onChange={_OnChangeOption.bind(this, e.id)}
                                        placeholder="Nhập tùy chọn"
                                        name="optionVariant"
                                        type="text"
                                        className={`${listOptErr?.some((i) => i === e.name)
                                            ? "border-red-500"
                                            : "border-[#d0d5dd] focus:border-[#92BFF7]"
                                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none`}
                                    />
                                    <button
                                        onClick={_HandleDelete.bind(this, e.id)}
                                        type="button"
                                        title="Xóa"
                                        className="transition hover:scale-105 min-w-[40px] h-10 rounded-lg text-red-500 flex flex-col justify-center items-center"
                                    >
                                        <IconDelete />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {/* <div className='flex space-x-3 items-center pr-3'>
                <input
                    value={optionName}
                    onChange={_HandleChangeInput.bind(this, "optionName")}
                    placeholder="Nhập tùy chọn"                      
                    type="text"
                    className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none"
                />     
                <button type='button' onClick={_HandleAddNew.bind(this)} title='Thêm' className='transition hover:scale-105 min-w-[40px] h-10 rounded-lg bg-slate-100 flex flex-col justify-center items-center'><IconAdd /></button>
              </div> */}
                        <div className="pr-3">
                            <button
                                type="button"
                                onClick={_HandleAddNew.bind(this)}
                                title="Thêm"
                                className="w-full h-10 rounded-lg flex flex-col justify-center items-center bg-slate-100 hover:opacity-70 transition"
                            >
                                <IconAdd />
                            </button>
                        </div>
                    </div>
                    <div className="text-right pt-5 space-x-2">
                        <button
                            type="button"
                            onClick={_ToggleModal.bind(this, false)}
                            className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition"
                        >
                            {props.dataLang?.branch_popup_exit}
                        </button>
                        <button
                            type="submit"
                            className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#0F4F9E] hover:opacity-90 hover:scale-105 transition"
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
