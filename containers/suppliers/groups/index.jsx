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
import Loading from "@/components/UI/loading/loading";
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
import { Grid6, Edit as IconEdit } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import Popup_groupKh from "./components/popup";
import { useSupplierGroupList } from "./hooks/useSupplierGroupList";
import Breadcrumb from "@/components/UI/breadcrumb/BreadcrumbCustom";

const initialData = {
  onFetching: false,
  keySearch: "",
  idBranch: [],
};
const SuppliersGroups = (props) => {
  const router = useRouter();

  const isShow = useToast();

  const dataLang = props.dataLang;

  const { paginate } = usePagination();

  const statusExprired = useStatusExprired();

  const [isState, sIsState] = useState(initialData);

  const { limit, updateLimit: sLimit } = useLimitAndTotalItems();

  const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

  const { is_admin: role, permissions_current: auth } = useSelector(
    (state) => state.auth
  );

  const { checkAdd, checkEdit, checkExport } = useActionRole(
    auth,
    "suppliers_groups"
  );

  const params = {
    limit: limit,
    search: isState.keySearch,
    page: router.query?.page || 1,
    "filter[branch_id]":
      isState.idBranch?.length > 0
        ? isState.idBranch.map((e) => e.value)
        : null,
  };

  const { data, isLoading, isFetching, refetch } = useSupplierGroupList(params);

  const { data: listBr = [] } = useBranchList({});

  const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
    queryState({ keySearch: value });
    router.replace("/suppliers/groups");
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
          title: `${dataLang?.suppliers_groups_name}`,
          width: { wpx: 100 },
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
        { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
      ]),
    },
  ];

  const breadcrumbItems = [
    {
      label: `${dataLang?.supplier || "suppliers_groups_title"}`,
      // href: "/",
    },
    {
      label: `${dataLang?.suppliers_groups_title || "suppliers_groups_title"}`,
    },
  ];

  return (
    <LayOutTableDynamic
      head={
        <Head>
          <title>{dataLang?.suppliers_groups_title}</title>
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
            {dataLang?.suppliers_groups_title || "suppliers_groups_title"}
          </h2>
          <div className="flex items-center justify-end gap-2">
            {role == true || checkAdd ? (
              <Popup_groupKh
                listBr={listBr}
                isState={isState}
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
              <div className="grid items-center grid-cols-9 gap-2">
                <SearchComponent
                  dataLang={dataLang}
                  onChange={_HandleOnChangeKeySearch.bind(this)}
                  colSpan={2}
                />
                <SelectComponent
                  options={[
                    {
                      value: "",
                      label:
                        dataLang?.price_quote_branch || "price_quote_branch",
                      isDisabled: true,
                    },
                    ...listBr,
                  ]}
                  onChange={(e) => queryState({ idBranch: e })}
                  value={isState.idBranch}
                  placeholder={
                    dataLang?.price_quote_branch || "price_quote_branch"
                  }
                  colSpan={3}
                  components={{ MultiValue }}
                  isMulti={true}
                  closeMenuOnSelect={false}
                />
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-end space-x-2">
                <OnResetData
                  onClick={refetch.bind(this)}
                  sOnFetching={(e) => { }}
                />
                {role == true || checkExport ? (
                  <div className={``}>
                    {data?.rResult?.length > 0 && (
                      <ExcelFileComponent
                        multiDataSet={multiDataSet}
                        filename="Nhóm nhà cung cấp"
                        title="Nncc"
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
          <Customscrollbar className="h-full overflow-y-auto">
            <div className="w-full">
              <HeaderTable gridCols={12}>
                <ColumnTable colSpan={6} textAlign={"center"}>
                  {dataLang?.suppliers_groups_name}
                </ColumnTable>
                <ColumnTable colSpan={4} textAlign={"center"}>
                  {dataLang?.client_list_brand}
                </ColumnTable>
                <ColumnTable colSpan={2} textAlign={"center"}>
                  {dataLang?.branch_popup_properties}
                </ColumnTable>
              </HeaderTable>
              {isLoading || isFetching ? (
                <Loading className="h-80" color="#0f4f9e" />
              ) : data?.rResult?.length > 0 ? (
                <div className="h-full divide-y divide-slate-200">
                  {data?.rResult?.map((e) => (
                    <RowTable gridCols={12} key={e.id.toString()}>
                      <RowItemTable colSpan={6} textAlign={"left"}>
                        {e.name}
                      </RowItemTable>
                      <RowItemTable
                        colSpan={4}
                        className="flex flex-wrap items-center gap-1"
                      >
                        {e.branch?.map((i) => (
                          <TagBranch key={i}>{i.name}</TagBranch>
                        ))}
                      </RowItemTable>
                      <RowItemTable
                        colSpan={2}
                        className="flex items-center justify-center my-auto space-x-2 text-center"
                      >
                        {role == true || checkEdit ? (
                          <Popup_groupKh
                            onRefresh={refetch.bind(this)}
                            className="text-xs xl:text-base "
                            isState={isState}
                            sValueBr={e.branch}
                            dataLang={dataLang}
                            name={e.name}
                            color={e.color}
                            id={e.id}
                            listBr={listBr}
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
                          type="suppliers_groups"
                        />
                      </RowItemTable>
                    </RowTable>
                  ))}
                </div>
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

export default SuppliersGroups;
