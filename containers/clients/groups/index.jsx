import { BtnAction } from "@/components/UI/BtnAction";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import {
  ColumnTable,
  HeaderTable,
  RowItemTable,
  RowTable,
} from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import {
  Container,
  ContainerBody,
  ContainerTable,
  LayOutTableDynamic,
} from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { useBranchList } from "@/hooks/common/useBranch";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import Loading from "@/components/UI/loading/loading";
import { Grid6, Edit as IconEdit } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import Popup_groupKh from "./components/popup";
import { useGroupClientList } from "./hooks/useGroupClientList";
import Breadcrumb from "@/components/UI/breadcrumb/BreadcrumbCustom";
import SelectComponentNew from "@/components/common/select/SelectComponentNew";

const initilaState = {
  keySearch: "",
  onFetchingBranch: false,
  idBranch: [],
};
const GroupClient = (props) => {
  const isShow = useToast();

  const router = useRouter();

  const dataLang = props.dataLang;

  const { paginate } = usePagination();

  const statusExprired = useStatusExprired();

  const [isState, sIsState] = useState(initilaState);

  const { limit, updateLimit: sLimit } = useLimitAndTotalItems();

  const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

  const { is_admin: role, permissions_current: auth } = useSelector(
    (state) => state.auth
  );

  const { checkExport, checkEdit, checkAdd } = useActionRole(
    auth,
    "client_group"
  );

  const params = {
    search: isState.keySearch,
    limit: limit,
    page: router.query?.page || 1,
    "filter[branch_id]":
      isState.idBranch?.length > 0
        ? isState.idBranch.map((e) => e.value)
        : null,
  };

  const {
    data,
    isLoading: loadingGroup,
    isFetching,
    refetch,
  } = useGroupClientList(params);

  const { data: listBr = [] } = useBranchList({});

  const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
    queryState({ keySearch: value });
    router.replace("/clients/groups");
  }, 500);

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
          title: `${dataLang?.client_group_name}`,
          width: { wpx: 100 },
          style: {
            fill: { fgColor: { rgb: "C7DFFB" } },
            font: { bold: true },
          },
        },
        {
          title: `${dataLang?.client_group_colorcode}`,
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
      data: data?.rResult?.map((e) => [
        { value: `${e.id}`, style: { numFmt: "0" } },
        { value: `${e.name ? e.name : ""}` },
        { value: `${e.color ? e.color : ""}` },
        { value: `${e.branch ? e.branch?.map((i) => i.name).join(", ") : ""}` },
      ]),
    },
  ];

  const breadcrumbItems = [
    {
      label: `${dataLang?.client_group_client || "client_group_client"}`,
      // href: "/",
    },
    {
      label: `${dataLang?.client_groupuser_title || "client_groupuser_title"}`,
    },
  ];

  return (
    <LayOutTableDynamic
      head={
        <Head>
          <title>{dataLang?.client_groupuser_title}</title>
        </Head>
      }
      breadcrumb={
        <>
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
        </>
      }
      titleButton={
        <>
          <h2 className="text-title-section text-[#52575E] capitalize font-medium">
            {dataLang?.client_groupuser || "client_groupuser"}
          </h2>
          <div className="flex items-center justify-end">
            {role == true || checkAdd ? (
              <Popup_groupKh
                listBr={listBr}
                onRefresh={refetch.bind(this)}
                dataLang={dataLang}
                className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-[#003DA0] text-white rounded btn-animation hover:scale-105"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  isShow("warning", WARNING_STATUS_ROLE);
                }}
                className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-[#003DA0] text-white rounded btn-animation hover:scale-105"
              >
                {dataLang?.branch_popup_create_new}
              </button>
            )}
          </div>
        </>
      }
      table={
        <div className="flex flex-col h-full">
          <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-6 2xl:xl:p-2 xl:p-1.5 p-1.5">
            <div className="col-span-4">
              <div className="grid items-center grid-cols-5 gap-2">
                <SearchComponent
                  dataLang={dataLang}
                  onChange={_HandleOnChangeKeySearch.bind(this)}
                  colSpan={1}
                />
                <SelectComponentNew
                  isClearable={true}
                  value={isState.idBranch}
                  onChange={(e) => queryState({ idBranch: e })}
                  options={[
                    {
                      value: "",
                      label:
                        dataLang?.price_quote_branch || "price_quote_branch",
                      isDisabled: true,
                    },
                    ...listBr,
                  ]}
                  colSpan={2}
                  classParent="ml-0 !font-semibold focus:ring-none focus:outline-none text-sm focus-visible:ring-none focus-visible:outline-none placeholder:text-sm placeholder:text-[#52575E]"
                  classNamePrefix={"productionSmoothing"}
                  placeholder={
                    dataLang?.price_quote_branch || "price_quote_branch"
                  }
                />
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-end space-x-2">
                <OnResetData
                  onClick={() => refetch()}
                  sOnFetching={(e) => { }}
                />
                {role == true || checkExport ? (
                  <div className={``}>
                    {data?.rResult?.length > 0 && (
                      <ExcelFileComponent
                        multiDataSet={multiDataSet}
                        filename="Nhóm khách hàng"
                        title="Nkh"
                        dataLang={dataLang}
                      />
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => isShow("warning", WARNING_STATUS_ROLE)}
                    className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}
                  >
                    <Grid6
                      className="scale-75 2xl:scale-100 xl:scale-100"
                      size={18}
                    />
                    <span>{dataLang?.client_list_exportexcel}</span>
                  </button>
                )}
                <div>
                  <DropdowLimit
                    sLimit={sLimit}
                    limit={limit}
                    dataLang={dataLang}
                  />
                </div>
              </div>
            </div>
          </div>

          <Customscrollbar className="h-full overflow-auto">
            <div className="w-full">
              <HeaderTable gridCols={12}>
                <ColumnTable colSpan={4} textAlign={"center"}>
                  {dataLang?.client_group_name}
                </ColumnTable>
                <ColumnTable colSpan={2} textAlign={"center"}>
                  {dataLang?.client_group_colorcode}
                </ColumnTable>
                <ColumnTable colSpan={2} textAlign={"center"}>
                  {dataLang?.client_group_color}
                </ColumnTable>
                <ColumnTable colSpan={2} textAlign={"center"}>
                  {dataLang?.client_list_brand}
                </ColumnTable>
                <ColumnTable colSpan={2} textAlign={"center"}>
                  {dataLang?.branch_popup_properties}
                </ColumnTable>
              </HeaderTable>

              {loadingGroup || isFetching ? (
                <Loading className="h-80" color="#0f4f9e" />
              ) : data?.rResult?.length > 0 ? (
                <>
                  <div className="divide-y divide-slate-200 h-[100%] ">
                    {data?.rResult?.map((e) => (
                      <RowTable gridCols={12} key={e.id.toString()}>
                        <RowItemTable colSpan={4} textAlign={"left"}>
                          {e.name}
                        </RowItemTable>
                        <RowItemTable colSpan={2} textAlign={"center"}>
                          {e.color}
                        </RowItemTable>
                        <RowItemTable
                          backgroundColor={e.color}
                          colSpan={2}
                          textAlign={"center"}
                          className={"py-1 rounded-md"}
                        >
                          {" "}
                          {e.color}
                        </RowItemTable>
                        <RowItemTable colSpan={2}>
                          <span className="flex flex-wrap items-center justify-start gap-2">
                            {e?.branch?.map((e) => (
                              <TagBranch key={e.id}>{e.name}</TagBranch>
                            ))}
                          </span>
                        </RowItemTable>
                        <RowItemTable
                          colSpan={2}
                          className="flex items-center justify-center space-x-2 text-center"
                        >
                          {role == true || checkEdit ? (
                            <Popup_groupKh
                              onRefresh={refetch.bind(this)}
                              className="text-xs xl:text-base "
                              listBr={listBr}
                              sValueBr={e.branch}
                              dataLang={dataLang}
                              name={e.name}
                              color={e.color}
                              id={e.id}
                            />
                          ) : (
                            <IconEdit
                              className="cursor-pointer"
                              onClick={() =>
                                isShow("warning", WARNING_STATUS_ROLE)
                              }
                            />
                          )}
                          <BtnAction
                            onRefresh={refetch.bind(this)}
                            onRefreshGroup={() => { }}
                            dataLang={dataLang}
                            id={e?.id}
                            type="client_group"
                          />
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
        </div>
      }
      pagination={
        <>
          {data?.rResult?.length != 0 && (
            <ContainerPagination>
              <TitlePagination
                dataLang={dataLang}
                totalItems={data?.output?.iTotalDisplayRecords}
              />
              <Pagination
                postsPerPage={limit}
                totalPosts={Number(data?.output?.iTotalDisplayRecords)}
                paginate={paginate}
                currentPage={router.query?.page || 1}
              />
            </ContainerPagination>
          )}
        </>
      }
    />
  );
};

export default GroupClient;
