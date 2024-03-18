import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { _ServerInstance as Axios } from "/services/axios";
import ReactExport from "react-data-export";

import Swal from "sweetalert2";

import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
    Grid6,
} from "iconsax-react";
import Loading from "components/UI/loading";
import Pagination from "/components/UI/pagination";
import SearchComponent from "components/UI/filterComponents/searchComponent";
import SelectComponent from "components/UI/filterComponents/selectComponent";
import OnResetData from "components/UI/btnResetData/btnReset";
import ExcelFileComponent from "components/UI/filterComponents/excelFilecomponet";
import DropdowLimit from "components/UI/dropdowLimit/dropdowLimit";
import useStatusExprired from "@/hooks/useStatusExprired";
import { debounce } from "lodash";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import NoData from "@/components/UI/noData/nodata";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import { useSelector } from "react-redux";
import useActionRole from "@/hooks/useRole";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useToast from "@/hooks/useToast";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const trangthaiExprired = useStatusExprired();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, 'suppliers');
    // const { checkAdd, checkEdit, checkExport } = useActionRole(auth, 'contacts_suppliers');

    const { limit, updateLimit: sLimit, totalItems: totalItem, updateTotalItems } = useLimitAndTotalItems()

    const initalState = {
        keySearch: "",
        onFetching: false,
        data: [],
        data_ex: [],
        idBranch: [],
        dataBr: [],
        idSupplier: [],
        dataSupplier: [],
    }

    const isShow = useToast()

    const [isState, sIsState] = useState(initalState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));
    const _ServerFetching = () => {
        Axios(
            "GET",
            "/api_web/api_supplier/contact/?csrf_protection=true",
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": isState.idBranch?.length > 0 ? isState.idBranch.map((e) => e.value) : null,
                    "filter[supplier_id]": isState.idSupplier?.length > 0 ? isState.idSupplier?.map((e) => e.value) : "",
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult, output } = response.data;
                    updateTotalItems(output);
                    queryState({ data: rResult, data_ex: rResult });
                }
                queryState({ onFetching: false });
            }
        );
    };

    const _ServerFetching_brand = () => {
        Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult } = response.data;
                    queryState({ dataBr: rResult?.map((e) => ({ label: e.name, value: e.id })) || [] });
                }
            }
        );
    };

    const _ServerFetching_Supplier = () => {
        Axios("GET", `/api_web/api_supplier/supplier/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult } = response.data;
                    queryState({ dataSupplier: rResult?.map((e) => ({ label: e.code, value: e.id })) || [] });

                }
            }
        );
    };

    useEffect(() => {
        _ServerFetching_brand()
        _ServerFetching_Supplier()
    }, [])
    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                page: pageNumber,
            },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace({
            pathname: router.route,
        });
        queryState({ onFetching: true });
    }, 500)

    useEffect(() => {
        (isState.onFetching && _ServerFetching())
    }, [isState.onFetching]);
    useEffect(() => {
        queryState({ onFetching: true });
    }, [limit, router.query?.page, isState.idBranch, isState.idSupplier]);

    //excel
    const multiDataSet = [
        {
            columns: [
                {
                    title: "ID",
                    width: { wch: 4 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.suppliers_contacts_name}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.suppliers_contacts_fullname}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.suppliers_contacts_phone}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.suppliers_contacts_pos}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.suppliers_contacts_address}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_brand}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: isState.data_ex?.map((e) => [
                { value: `${e.supplier_contact_id}`, style: { numFmt: "0" } },
                { value: `${e.supplier_name ? e.supplier_name : ""}` },
                { value: `${e.contact_name ? e.contact_name : ""}` },
                { value: `${e.phone_number ? e.phone_number : ""}` },
                { value: `${e.position ? e.position : ""}` },
                { value: `${e.address ? e.address : ""}` },
                { value: `${e.branch ? e.branch.map((e) => e.name) : ""}` },
            ]),
        },
    ];


    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.suppliers_contacts_title}</title>
            </Head>
            <Container>
                {trangthaiExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.suppliers_contacts_title || "suppliers_contacts_title"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.suppliers_contacts_title || "suppliers_contacts_title"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.suppliers_contacts_title || "suppliers_contacts_title"}
                            </h2>
                        </div>
                        <ContainerTable>
                            <div className="xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-6 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-4">
                                        <div className="grid grid-cols-9 gap-2">
                                            <SearchComponent
                                                dataLang={dataLang}
                                                onChange={_HandleOnChangeKeySearch.bind(this)}
                                                colSpan={2}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.price_quote_branch || "price_quote_branch",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.dataBr,
                                                ]}
                                                onChange={(e) => queryState({ idBranch: e })}
                                                value={isState.idBranch}
                                                placeholder={dataLang?.price_quote_branch || "price_quote_branch"}
                                                colSpan={3}
                                                components={{ MultiValue }}
                                                isMulti={true}
                                                closeMenuOnSelect={false}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.suppliers_supplier_code || "suppliers_supplier_code",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.dataSupplier,
                                                ]}
                                                onChange={(e) => queryState({ idSupplier: e })}
                                                value={isState.idSupplier}
                                                placeholder={dataLang?.suppliers_supplier_code || "suppliers_supplier_code"}
                                                colSpan={4}
                                                components={{ MultiValue }}
                                                isMulti={true}
                                                closeMenuOnSelect={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex space-x-2 items-center justify-end">
                                            <OnResetData sOnFetching={(e) => queryState({ onFetching: e })} />
                                            {(role == true || checkExport) ?
                                                <div className={``}>
                                                    {isState.data_ex?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename="Danh liên hệ nhà cung cấp"
                                                            title="Dslhncc"
                                                            dataLang={dataLang}
                                                        />
                                                    )}
                                                </div>
                                                :
                                                <button onClick={() => isShow('warning', WARNING_STATUS_ROLE)} className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                                                    <Grid6 className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
                                                    <span>{dataLang?.client_list_exportexcel}</span>
                                                </button>
                                            }
                                            <div>
                                                <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <Customscrollbar>
                                <div className="w-full">
                                    <HeaderTable gridCols={10}>
                                        <ColumnTable colSpan={2} textAlign={'center'}>
                                            {dataLang?.suppliers_contacts_name || 'suppliers_contacts_name'}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={'center'}>
                                            {dataLang?.suppliers_contacts_fullname || 'suppliers_contacts_fullname'}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.suppliers_contacts_phone || 'suppliers_contacts_phone'}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.suppliers_contacts_email || 'suppliers_contacts_email'}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.suppliers_contacts_pos || 'suppliers_contacts_pos'}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'center'}>
                                            {dataLang?.suppliers_contacts_address || 'suppliers_contacts_address'}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={'center'}>
                                            {dataLang?.client_contact_table_brand || 'client_contact_table_brand'}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {isState.onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : isState.data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                                {isState.data?.map((e) => (
                                                    <RowTable gridCols={10} key={e.supplier_contact_id.toString()}
                                                    >
                                                        <RowItemTable colSpan={2} textAlign={'left'}>
                                                            {e.supplier_name}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} textAlign={'left'}>
                                                            {e.contact_name}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'left'}>
                                                            {e.phone_number}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'left'}>
                                                            {e.email}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'left'}>
                                                            {e.position}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={'left'}>
                                                            {e.address}
                                                        </RowItemTable>
                                                        <RowItemTable textAlign={'left'} className="flex items-center  gap-1 flex-wrap">
                                                            {e.branch?.map((i) => (
                                                                <TagBranch key={i} >
                                                                    {i.name}
                                                                </TagBranch>
                                                            ))}
                                                        </RowItemTable>
                                                    </RowTable>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <NoData />
                                    )}
                                </div>
                            </Customscrollbar>
                        </ContainerTable>
                    </div>
                    {isState.data?.length != 0 && (
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
            </Container>
        </React.Fragment>
    );
};
export default Index;
