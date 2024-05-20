import Head from "next/head";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import Select, { components } from "react-select";
import { ListBtn_Setting } from "./information";
import { _ServerInstance as Axios } from "/services/axios";

import {
    Edit as IconEdit,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    CloseCircle,
    TickCircle,
    Minus as IconMinus,
    ArrowDown2 as IconDown,
} from "iconsax-react";

import PopupEdit from "@/components/UI/popup";
import Loading from "@/components/UI/loading";
import Pagination from "@/components/UI/pagination";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";

import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container, ContainerBody } from "@/components/UI/common/layout";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
const CustomSelectOption = ({ value, label, level, code }) => (
    <div className="flex space-x-2 truncate">
        {level == 1 && <span>--</span>}
        {level == 2 && <span>----</span>}
        {level == 3 && <span>------</span>}
        {level == 4 && <span>--------</span>}
        <span className="2xl:max-w-[300px] max-w-[150px] w-fit truncate">{label}</span>
    </div>
);
import MultiValue from "@/components/UI/mutiValue/multiValue";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import NoData from "@/components/UI/noData/nodata";
import BtnAction from "@/components/UI/BtnAction";
import TagBranch from "@/components/UI/common/Tag/TagBranch";

const Index = (props) => {
    const dataLang = props.dataLang;

    const isShow = useToast();

    const statusExprired = useStatusExprired();

    const { isOpen, isId, handleQueryId } = useToggle();

    const router = useRouter();

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: "/settings/category",
            query: { tab: e },
        });
    };

    useEffect(() => {
        router.push({
            pathname: "/settings/category",
            query: { tab: router.query?.tab ? router.query?.tab : "units" },
        });
    }, []);

    const [data, sData] = useState([]);

    const [onFetching, sOnFetching] = useState(false);

    const [onFetchingOpt, sOnFetchingOpt] = useState(false);

    const [keySearch, sKeySearch] = useState("");

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()


    const _ServerFetching = () => {
        Axios(
            "GET",
            `${(router.query?.tab === "units" && `/api_web/Api_unit/unit/?csrf_protection=true`) ||
            (router.query?.tab === "stages" && "/api_web/api_product/stage/?csrf_protection=true") ||
            (router.query?.tab === "costs" && "/api_web/Api_cost/cost/?csrf_protection=true")
            } `,
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
            `${(router.query.tab === "units" && `/api_web/Api_unit/unit/${isId}?csrf_protection=true`) ||
            (router.query.tab === "stages" && `/api_web/api_product/stage/${isId}?csrf_protection=true`) ||
            (router.query.tab === "costs" && `/api_web/Api_cost/cost/${isId}?csrf_protection=true`)
            } `,
            {},
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", dataLang[message]);
                    } else {
                        isShow("error", dataLang[message]);
                    }
                }
                _ServerFetching();
            }
        );

        handleQueryId({ status: false });
    };

    const paginate = (pageNumber) => {
        router.push({
            pathname: "/settings/category",
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace({
            pathname: "/settings/category",
            query: {
                tab: router.query?.tab,
            },
        });
        sOnFetching(true);
    }, 500)

    const _ServerFetchingOtp = () => {
        Axios("GET", "/api_web/Api_Branch/branch/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
                sDataBranchOption(rResult.map((e) => ({ label: e.name, value: e.id })));
                dispatch({
                    type: "branch/update",
                    payload: rResult.map((e) => ({
                        label: e.name,
                        value: e.id,
                    })),
                });
            }
        });
        sOnFetchingOpt(false);
    };

    useEffect(() => {
        onFetchingOpt && _ServerFetchingOtp();
    }, [onFetchingOpt]);

    useEffect(() => {
        sOnFetchingOpt(true);
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>
                    {(router.query.tab === "units" && dataLang?.category_unit) ||
                        (router.query.tab === "stages" && dataLang?.settings_category_stages_title) ||
                        (router.query.tab === "costs" && dataLang?.expense_costs) || "expense_costs"}
                </title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.branch_seting || "branch_seting"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>
                            {(router.query.tab === "units" && dataLang?.category_unit) ||
                                (router.query.tab === "stages" && dataLang?.settings_category_stages_title) ||
                                (router.query.tab === "costs" && dataLang?.expense_costs) || "expense_costs"}
                        </h6>
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
                                    {dataLang?.category_titel || 'category_titel'}
                                </h2>
                                <div className="flex justify-end items-center gap-2">
                                    <Popup_danhmuc
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                                </div>
                            </div>
                            <div className="flex space-x-3 items-center justify-start">
                                <button
                                    onClick={_HandleSelectTab.bind(this, "units")}
                                    className={`${router.query?.tab === "units"
                                        ? "text-[#0F4F9E] bg-[#e2f0fe]"
                                        : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"
                                        } rounded-lg px-4 py-2 outline-none`}
                                >
                                    {dataLang?.category_unit}
                                </button>
                                <button
                                    onClick={_HandleSelectTab.bind(this, "stages")}
                                    className={`${router.query?.tab === "stages"
                                        ? "text-[#0F4F9E] bg-[#e2f0fe]"
                                        : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"
                                        } rounded-lg px-4 py-2 outline-none`}
                                >
                                    {dataLang?.settings_category_stages_title}
                                </button>
                                <button
                                    onClick={_HandleSelectTab.bind(this, "costs")}
                                    className={`${router.query?.tab === "costs"
                                        ? "text-[#0F4F9E] bg-[#e2f0fe]"
                                        : "hover:text-[#0F4F9E] hover:bg-[#e2f0fe]/30"
                                        } rounded-lg px-4 py-2 outline-none`}
                                >
                                    {dataLang?.expense_costs || "expense_costs"}
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
                                <Customscrollbar className="min:h-[200px] h-[72%] max:h-[500px]">
                                    <div
                                        className={`w-full`}
                                    >
                                        <HeaderTable
                                            gridCols={router.query?.tab === "units" ? 6 : router.query?.tab === "stages" ? 9 : 11}
                                        >
                                            {router.query?.tab === "units" && (
                                                <React.Fragment>
                                                    <ColumnTable colSpan={5} textAlign={'left'}>
                                                        {router.query?.tab === "units" && dataLang?.category_unit_name}
                                                    </ColumnTable>
                                                </React.Fragment>
                                            )}
                                            {router.query?.tab === "stages" && (
                                                <React.Fragment>
                                                    <ColumnTable colSpan={2} textAlign={'left'}>
                                                        {dataLang?.settings_category_stages_code}
                                                    </ColumnTable>
                                                    <ColumnTable colSpan={2} textAlign={'left'}>
                                                        {dataLang?.settings_category_stages_name}
                                                    </ColumnTable>
                                                    <ColumnTable colSpan={2} textAlign={'center'}>
                                                        {dataLang?.settings_category_stages_status}
                                                    </ColumnTable>
                                                    <ColumnTable colSpan={2} textAlign={'left'}>
                                                        {dataLang?.settings_category_stages_note}
                                                    </ColumnTable>
                                                </React.Fragment>
                                            )}
                                            {router.query?.tab === "costs" && (
                                                <React.Fragment>
                                                    <ColumnTable colSpan={1} textAlign={'center'}>
                                                        {"#"}
                                                    </ColumnTable>
                                                    <ColumnTable colSpan={3} textAlign={'left'}>
                                                        {dataLang?.expense_code || "expense_code"}
                                                    </ColumnTable>
                                                    <ColumnTable colSpan={2} textAlign={'left'}>
                                                        {dataLang?.expense_name || "expense_name"}
                                                    </ColumnTable>
                                                    <ColumnTable colSpan={2} textAlign={'center'}>
                                                        {dataLang?.expense_grant || "expense_grant"}
                                                    </ColumnTable>
                                                    <ColumnTable colSpan={2} textAlign={'center'}>
                                                        {dataLang?.expense_branch || "expense_branch"}
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
                                                            className={router.query?.tab === "units" && '' || router.query?.tab === "stages" && '' || router.query?.tab === "costs" && '!px-0'}
                                                            gridCols={router.query?.tab === "units" ? 6 : router.query?.tab === "stages" ? 9 : 11}
                                                        >
                                                            {(router.query?.tab === "units" ||
                                                                router.query?.tab === "currencies") && (
                                                                    <React.Fragment>
                                                                        <RowItemTable colSpan={5}>
                                                                            {router.query?.tab === "units" && e?.unit}
                                                                        </RowItemTable>
                                                                    </React.Fragment>
                                                                )}
                                                            {router.query?.tab === "stages" && (
                                                                <React.Fragment>
                                                                    <RowItemTable colSpan={2}>
                                                                        {router.query?.tab === "stages" && e?.code}
                                                                    </RowItemTable>
                                                                    <RowItemTable colSpan={2}>
                                                                        {router.query?.tab === "stages" && e?.name}
                                                                    </RowItemTable>
                                                                    <RowItemTable colSpan={2} className="mx-auto">
                                                                        {router.query?.tab === "stages" && e?.status_qc === "1" ? (
                                                                            <TickCircle size={32} color="#0BAA2E" />
                                                                        ) : (
                                                                            <CloseCircle size={32} color="#EE1E1E" />
                                                                        )}
                                                                    </RowItemTable>
                                                                    <RowItemTable colSpan={2}>
                                                                        {router.query?.tab === "stages" && e?.note}
                                                                    </RowItemTable>
                                                                </React.Fragment>
                                                            )}
                                                            {router.query?.tab === "costs" && (
                                                                <React.Fragment>
                                                                    <RowItemTable colSpan={11} className={'!p-0'}>
                                                                        <Items
                                                                            onRefresh={_ServerFetching.bind(this)}
                                                                            onRefreshOpt={_ServerFetchingOtp.bind(this)}
                                                                            dataLang={dataLang}
                                                                            key={e.id}
                                                                            data={e}
                                                                            className="col-span-11 "
                                                                        />
                                                                    </RowItemTable>
                                                                </React.Fragment>
                                                            )}
                                                            {router.query?.tab === "units" && (
                                                                <RowItemTable colSpan={1} className="flex space-x-2 items-center justify-center ">
                                                                    <Popup_danhmuc
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
                                                            )}
                                                            {router.query?.tab === "stages" && (
                                                                <RowItemTable colSpan={1} className="flex space-x-2 justify-center items-center">
                                                                    <Popup_danhmuc
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
                                                            )}
                                                        </RowTable>
                                                    ))}
                                                </div>
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

const Items = React.memo((props) => {
    const [hasChild, sHasChild] = useState(false);

    const _ToggleHasChild = () => sHasChild(!hasChild);

    useEffect(() => {
        sHasChild(false);
    }, [props.data?.children?.length == null]);

    return (
        <div key={props.data?.id}>
            <RowTable gridCols={11}>
                <RowItemTable colSpan={1} className="flex justify-center">
                    <button
                        disabled={props.data?.children?.length > 0 ? false : true}
                        onClick={_ToggleHasChild.bind(this)}
                        className={`${hasChild ? "bg-red-600" : "bg-green-600 disabled:bg-slate-300"
                            } hover:opacity-80 hover:disabled:opacity-100 transition relative flex flex-col justify-center items-center h-5 w-5 rounded-full text-white outline-none`}
                    >
                        <IconMinus size={16} />
                        <IconMinus size={16} className={`${hasChild ? "" : "rotate-90"} transition absolute`} />
                    </button>
                </RowItemTable>
                <RowItemTable colSpan={3}>{props.data?.code}</RowItemTable>
                <RowItemTable colSpan={2}>{props.data?.name}</RowItemTable>
                <RowItemTable colSpan={2} textAlign={'center'}>{props.data?.level}</RowItemTable>
                <RowItemTable colSpan={2} className="flex flex-wrap gap-1">
                    {props.data?.branch?.map((e) => (
                        <TagBranch
                            key={e?.id.toString()}
                            className='w-fit h-fit'
                        >
                            {e?.name}
                        </TagBranch>
                    ))}
                </RowItemTable>
                <RowItemTable colSpan={1} className="flex justify-center items-center gap-1 mx-auto">
                    <Popup_danhmuc
                        onRefresh={props.onRefresh}
                        onRefreshOpt={props.onRefreshOpt}
                        dataLang={props.dataLang}
                        data={props.data}
                        dataOption={props.dataOption}
                    />
                    <BtnAction
                        onRefresh={props.onRefresh}
                        onRefreshGroup={props.onRefreshOpt}
                        dataLang={props.dataLang}
                        id={props.data?.id}
                        type={'costs'}
                    />
                </RowItemTable>
            </RowTable>
            {hasChild && (
                <div className="bg-slate-50/50">
                    {props.data?.children?.map((e) => (
                        <ItemsChild
                            onRefresh={props.onRefresh}
                            onRefreshOpt={props.onRefreshOpt}
                            dataLang={props.dataLang}
                            key={e.id}
                            data={e}
                            grandchild="0"
                            children={e?.children?.map((e) => (
                                <ItemsChild
                                    onRefresh={props.onRefresh}
                                    onRefreshOpt={props.onRefreshOpt}
                                    dataLang={props.dataLang}
                                    key={e.id}
                                    data={e}
                                    grandchild="1"
                                    children={e?.children?.map((e) => (
                                        <ItemsChild
                                            onRefresh={props.onRefresh}
                                            onRefreshOpt={props.onRefreshOpt}
                                            dataLang={props.dataLang}
                                            key={e.id}
                                            data={e}
                                            grandchild="2"
                                        />
                                    ))}
                                />
                            ))}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

const ItemsChild = React.memo((props) => {
    return (
        <React.Fragment key={props.data?.id}>
            <RowTable gridCols={11}>
                {props.data?.level == "3" && (
                    <RowItemTable colSpan={1} className="h-full flex justify-center items-center pl-24">
                        <IconDown className="rotate-45" />
                    </RowItemTable>
                )}
                {props.data?.level == "2" && (
                    <RowItemTable colSpan={1} className=" h-full flex justify-center items-center pl-12">
                        <IconDown className="rotate-45" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                    </RowItemTable>
                )}
                {props.data?.level == "1" && (
                    <RowItemTable colSpan={1} className="h-full flex justify-center items-center ">
                        <IconDown className="rotate-45" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                        <IconMinus className="mt-1.5" />
                    </RowItemTable>
                )}
                <RowItemTable colSpan={3}>{props.data?.code}</RowItemTable>
                <RowItemTable colSpan={2} className={'truncate'} textAlign={'left'}>{props.data?.name}</RowItemTable>
                <RowItemTable colSpan={2} className={'truncate'} textAlign={'center'}>{props.data?.level}</RowItemTable>
                <RowItemTable colSpan={2} className="flex flex-wrap gap-1">
                    {props.data?.branch.map((e) => (
                        <TagBranch
                            key={e?.id.toString()}
                            className='w-fit h-fit'
                        >
                            {e?.name}
                        </TagBranch>
                    ))}
                </RowItemTable>
                <RowItemTable colSpan={1} className="flex justify-center gap-1 items-center mx-auto">
                    <Popup_danhmuc onRefresh={props.onRefresh} dataLang={props.dataLang} data={props.data} />
                    <BtnAction
                        onRefresh={props.onRefresh}
                        onRefreshGroup={props.onRefreshOpt}
                        dataLang={props.dataLang}
                        id={props.data?.id}
                        type={'costs'}
                    />
                </RowItemTable>
            </RowTable>
            {props.children}
        </React.Fragment>
    );
});

const Popup_danhmuc = (props) => {
    const router = useRouter();

    const isShow = useToast();

    const tabPage = router.query?.tab;

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const [onSending, sOnSending] = useState(false);

    const [dataOption, sDataOption] = useState([]);

    const [dataBranch, sDataBranch] = useState([]);

    const [onFetching, sOnFetching] = useState(false);

    const [unit, sUnit] = useState("");

    const [stages_code, sTagesCode] = useState("");

    const [stages_name, sTagesName] = useState("");

    const [stages_status, sTagesStatus] = useState("0");

    const [stages_note, sTagesNote] = useState("");

    const [costs_code, sCosts_Code] = useState(null);

    const [costs_name, sCosts_Name] = useState(null);

    const [costs_branch, sCosts_Branch] = useState([]);

    const [errInput, sErrInput] = useState(false);

    const [errInputcode, sErrInputcode] = useState(false);

    const [errInputName, sErrInputName] = useState(false);

    const [errCode, sErrcode] = useState(false);

    const [errName, sErrName] = useState(false);

    const [errBranch, sErrBranch] = useState(false);

    const [idCategory, sIdCategory] = useState(null);

    useEffect(() => {
        sErrInput(false);
        open && sCosts_Code(props.data?.code ? props.data?.code : "");
        open && sCosts_Name(props.data?.name ? props.data?.name : "");
        open &&
            sCosts_Branch(
                props.data?.branch?.length > 0
                    ? props.data?.branch?.map((e) => ({
                        label: e.name,
                        value: e.id,
                    }))
                    : []
            );
        open && sIdCategory(props.data?.parent_id ? props.data?.parent_id : null);
        sErrcode(false);
        sErrName(false);
        sErrBranch(false);
        sErrInputcode(false);
        sErrInputName(false);
        sTagesName(props.data?.name ? props.data?.name : "");
        sTagesCode(props.data?.code ? props.data?.code : "");
        sTagesStatus(props.data?.status_qc ? props.data?.status_qc : "");
        sTagesNote(props.data?.note ? props.data?.note : "");
        sUnit(props.data?.unit ? props.data?.unit : "");
        open && sOnFetching(true);
    }, [open]);

    const _ServerSending = () => {
        const id = props.data?.id;
        var data = new FormData();
        if (tabPage === "units") {
            data.append("unit", unit);
        }
        if (tabPage === "stages") {
            data.append("code", stages_code);
            data.append("name", stages_name);
            data.append("status_qc", stages_status);
            data.append("note", stages_note);
        }
        if (tabPage === "costs") {
            data.append("code", costs_code);
            data.append("name", costs_name);
            data.append("parent_id", idCategory);
            costs_branch?.map((e, index) => {
                data.append(`branch_id[${index}]`, e?.value);
            });
        }
        Axios(
            "POST",
            id
                ? `${(tabPage === "units" && `/api_web/Api_unit/unit/${id}?csrf_protection=true `) ||
                (tabPage === "stages" && `/api_web/api_product/stage/${id}?csrf_protection=true`) ||
                (tabPage === "costs" && `/api_web/Api_cost/cost/${id}?csrf_protection=true`)
                } `
                : `${(tabPage === "units" && `/api_web/Api_unit/unit/?csrf_protection=true`) ||
                (tabPage === "stages" && `/api_web/api_product/stage/?csrf_protection=true`) ||
                (tabPage === "costs" && `/api_web/Api_cost/cost/?csrf_protection=true`)
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
                        sUnit("");
                        sTagesCode("");
                        sTagesName("");
                        sTagesNote("");
                        sTagesStatus("");
                        sErrInput(false);
                        sErrcode(false);
                        sErrName(false);
                        sCosts_Code("");
                        sCosts_Name("");
                        sIdCategory(null);
                        sErrInputcode(false);
                        sErrInputName(false);
                        sCosts_Branch([]);
                        sErrBranch(false);
                        sOpen(false);
                        props.onRefresh && props.onRefresh();
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

    const _HandleChangeInput = (type, value) => {
        if (type == "unit") {
            sUnit(value.target?.value);
        } else if (type == "code") {
            sTagesCode(value.target?.value);
        } else if (type == "name") {
            sTagesName(value.target?.value);
        } else if (type === "status") {
            if (value.target?.checked === false) {
                sTagesStatus("0");
            } else if (value.target?.checked === true) {
                sTagesStatus("1");
            }
        } else if (type == "note") {
            sTagesNote(value.target?.value);
        } else if (type == "costs_code") {
            sCosts_Code(value.target?.value);
        } else if (type == "costs_name") {
            sCosts_Name(value.target?.value);
        } else if (type == "costs_branch") {
            sCosts_Branch(value);
        }
    };

    const valueIdCategory = (e) => sIdCategory(e?.value);

    const _ServerFetching = () => {
        Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { isSuccess, result } = response.data;
                sDataBranch(result?.map((e) => ({ label: e.name, value: e.id })));
            }
        });
        Axios(
            "GET",
            `${props.data?.id
                ? `/api_web/Api_cost/costCombobox/${props.data?.id}?csrf_protection=true`
                : "/api_web/Api_cost/costCombobox/?csrf_protection=true"
            }`,
            {},
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sDataOption(
                        rResult.map((e) => ({
                            label: e.name + " " + "(" + e.code + ")",
                            value: e.id,
                            level: e.level,
                        }))
                    );
                }
            }
        );
        sOnFetching(false);
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (tabPage === "units") {
            if (unit == "") {
                unit == "" && sErrInput(true);
                isShow("error", props.dataLang?.required_field_null);
            } else {
                sOnSending(true);
            }
        } else if (tabPage === "stages") {
            if (stages_name == "") {
                stages_name == "" && sErrInputName(true);
                stages_code == "" && sErrInputcode(true);
                isShow("error", props.dataLang?.required_field_null);
            } else {
                sOnSending(true);
            }
        } else if (tabPage === "costs") {
            if (costs_code == "" || costs_name == "" || costs_branch?.length == 0) {
                costs_code == "" && sErrcode(true);
                costs_name == "" && sErrName(true);
                costs_branch?.length == 0 && sErrBranch(true);
                isShow("error", props.dataLang?.required_field_null);
            } else {
                sOnSending(true);
            }
        }
    };
    useEffect(() => {
        sErrInput(false);
    }, [unit.length > 0]);

    useEffect(() => {
        sErrInputName(false);
        sErrInputcode(false);
    }, [stages_code.length > 0, stages_name?.length > 0]);

    useEffect(() => {
        sErrcode(false);
    }, [costs_code != ""]);

    useEffect(() => {
        sErrName(false);
    }, [costs_name != ""]);

    useEffect(() => {
        sErrBranch(false);
    }, [costs_branch?.length > 0]);

    const hiddenOptionsClient = costs_branch?.length > 3 ? costs_branch?.slice(0, 3) : [];
    const optionsClient = dataBranch ? dataBranch?.filter((x) => !hiddenOptionsClient.includes(x.value)) : [];

    return (
        <PopupEdit
            title={
                props.data?.id
                    ? `${(tabPage === "units" && props.dataLang?.category_unit_edit) ||
                    (tabPage === "stages" && props.dataLang?.settings_category_stages_edit) ||
                    (tabPage === "costs" && props.dataLang?.expense_edit) ||
                    "expense_edit"
                    }`
                    : `${(tabPage === "units" && props.dataLang?.category_unit_add) ||
                    (tabPage === "stages" && props.dataLang?.settings_category_stages_add) ||
                    (tabPage === "costs" && props.dataLang?.expense_add) ||
                    "expense_add"
                    }`
            }
            button={props.data?.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`}
            onClickOpen={_ToggleModal.bind(this, true)}
            open={open}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className={`w-[33vw] mt-4`}>
                <form onSubmit={_HandleSubmit.bind(this)}>
                    <div>
                        {tabPage === "units" && (
                            <React.Fragment>
                                <div className="flex flex-wrap justify-between">
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {props.dataLang?.category_unit_name} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={unit}
                                        onChange={_HandleChangeInput.bind(this, "unit")}
                                        name="fname"
                                        type="text"
                                        className={`${errInput ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                                    />
                                    {errInput && (
                                        <label className="mb-4  text-[14px] text-red-500">
                                            {"Vui lòng nhập tên đơn vị"}
                                        </label>
                                    )}
                                </div>
                            </React.Fragment>
                        )}
                        {tabPage === "stages" && (
                            <React.Fragment>
                                <div className="flex flex-wrap justify-between">
                                    {/* <div className="w-full">
                                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                                            {props.dataLang?.settings_category_stages_codeAdd ||
                                                "settings_category_stages_codeAdd"}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div>
                                            <input
                                                // value={stages_code}
                                                // onChange={_HandleChangeInput.bind(this, "code")}
                                                placeholder={
                                                    props.dataLang?.settings_category_stages_codeAdd ||
                                                    "settings_category_stages_codeAdd"
                                                }
                                                name="fname"
                                                type="text"
                                                className={`"focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                                            />
                                        </div>
                                    </div> */}
                                    <div className="w-full">
                                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                                            {/* {props.dataLang?.settings_category_stages_codenName ||
                                                "settings_category_stages_codenName"} */}
                                            {props.dataLang?.settings_category_stages_codeAdd ||
                                                "settings_category_stages_codeAdd"}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div>
                                            <input
                                                value={stages_code}
                                                onChange={_HandleChangeInput.bind(this, "code")}
                                                placeholder={
                                                    // props.dataLang?.settings_category_stages_codenName ||
                                                    // "settings_category_stages_codenName"
                                                    props.dataLang?.settings_category_stages_codeAdd ||
                                                    "settings_category_stages_codeAdd"
                                                }
                                                name="fname"
                                                type="text"
                                                className={`${errInputcode
                                                    ? "border-red-500 border"
                                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                                            />
                                            {errInputcode && (
                                                <label className="mb-4  text-[14px] text-red-500">
                                                    {props.dataLang?.settings_category_stages_errCode}
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                                            {props.dataLang?.settings_category_stages_name}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div>
                                            <input
                                                value={stages_name}
                                                onChange={_HandleChangeInput.bind(this, "name")}
                                                placeholder={props.dataLang?.settings_category_stages_name}
                                                name="fname"
                                                type="text"
                                                className={`${errInputName
                                                    ? "border-red-500"
                                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                                            />
                                            {errInputName && (
                                                <label className="mb-4  text-[14px] text-red-500">
                                                    {props.dataLang?.settings_category_stages_errName}
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full flex justify-between flex-wrap">
                                        <div className="inline-flex items-center w-[50%] gap-3.5">
                                            <label
                                                className="relative flex cursor-pointer items-center rounded-full p-1"
                                                htmlFor="1"
                                                data-ripple-dark="true"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 "
                                                    id="1"
                                                    value={stages_status}
                                                    checked={
                                                        stages_status === "0" ? false : stages_status === "1" && true
                                                    }
                                                    onChange={_HandleChangeInput.bind(this, "status")}
                                                />
                                                <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-3.5 w-3.5"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        stroke="currentColor"
                                                        stroke-width="1"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clip-rule="evenodd"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </label>
                                            <label
                                                htmlFor="1"
                                                className="text-[#344054] font-medium text-base  cursor-pointer "
                                            >
                                                {props.dataLang?.settings_category_stages_status}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="w-full flex justify-between flex-wrap">
                                        <div className="w-full ">
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.settings_category_stages_note}
                                            </label>
                                            <textarea
                                                value={stages_note}
                                                placeholder={props.dataLang?.settings_category_stages_note}
                                                onChange={_HandleChangeInput.bind(this, "note")}
                                                name="fname"
                                                type="text"
                                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[140px] h-[40px] max-h-[240px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                        {tabPage === "costs" && (
                            <React.Fragment>
                                <div className="py-4 space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-[#344054] font-normal text-base">
                                            {props.dataLang?.expense_code || "expense_code"}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={costs_code}
                                            onChange={_HandleChangeInput.bind(this, "costs_code")}
                                            type="text"
                                            placeholder={props.dataLang?.expense_code || "expense_code"}
                                            className={`${errCode ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                                        />
                                        {errCode && (
                                            <label className="text-sm text-red-500">
                                                {props.dataLang?.expense_errCode || "expense_errCode"}
                                            </label>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[#344054] font-normal text-base">
                                            {props.dataLang?.expense_name || "expense_name"}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={costs_name}
                                            onChange={_HandleChangeInput.bind(this, "costs_name")}
                                            type="text"
                                            placeholder={props.dataLang?.expense_name || "expense_name"}
                                            className={`${errName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                                        />
                                        {errName && (
                                            <label className="text-sm text-red-500">
                                                {props.dataLang?.expense_errName || "expense_errName"}
                                            </label>
                                        )}
                                    </div>
                                    <div className="col-span-6 max-h-[65px] min-h-[65px]">
                                        <label className="text-[#344054] font-normal text-base mb-1 ">
                                            {props.dataLang?.expense_branch || "expense_branch"}{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            closeMenuOnSelect={true}
                                            placeholder={props.dataLang?.expense_branch || "expense_branch"}
                                            options={dataBranch}
                                            isSearchable={true}
                                            onChange={_HandleChangeInput.bind(this, "costs_branch")}
                                            value={costs_branch}
                                            isMulti
                                            components={{ MultiValue }}
                                            LoadingIndicator
                                            noOptionsMessage={() => "Không có dữ liệu"}
                                            maxMenuHeight="200px"
                                            isClearable={true}
                                            menuPortalTarget={document.body}
                                            onMenuOpen={handleMenuOpen}
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
                                                } text-sm placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] mb-2 font-normal outline-none border `}
                                        />
                                        {errBranch && (
                                            <label className="mb-2 text-sm text-red-500">
                                                {props.dataLang?.expense_errBranch || "expense_errBranch"}
                                            </label>
                                        )}
                                    </div>
                                    <div className="space-y-1 mt-2">
                                        <label className="text-[#344054] font-normal text-base">
                                            {props.dataLang?.expense_group || "expense_group"}
                                        </label>
                                        <Select
                                            options={dataOption}
                                            formatOptionLabel={CustomSelectOption}
                                            defaultValue={
                                                idCategory == "0" || !idCategory
                                                    ? { label: `${"Nhóm cha"}` }
                                                    : {
                                                        label: dataOption.find((x) => x?.parent_id == idCategory)
                                                            ?.label,
                                                        code: dataOption.find((x) => x?.parent_id == idCategory)
                                                            ?.code,
                                                        value: idCategory,
                                                    }
                                            }
                                            value={
                                                idCategory == "0" || !idCategory
                                                    ? {
                                                        label: "Nhóm cha",
                                                        code: "nhóm cha",
                                                    }
                                                    : {
                                                        label: dataOption.find((x) => x?.value == idCategory)?.label,
                                                        code: dataOption.find((x) => x?.value == idCategory)?.code,
                                                        value: idCategory,
                                                    }
                                            }
                                            onChange={valueIdCategory.bind(this)}
                                            isClearable={true}
                                            placeholder={"Nhóm cha"}
                                            className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none"
                                            isSearchable={true}
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: "#EBF5FF",
                                                    primary50: "#92BFF7",
                                                    primary: "#0F4F9E",
                                                },
                                            })}
                                        />
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
