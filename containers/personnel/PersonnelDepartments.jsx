import { BtnAction } from "@/components/UI/BtnAction";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import {
  Container,
  ContainerBody,
  ContainerTable,
  LayOutTableDynamic,
} from "@/components/UI/common/layout";
import {
  ColumnTable,
  HeaderTable,
  RowItemTable,
  RowTable,
} from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
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
import Popup_phongban from "./components/departments/popup";
import { useDepartmentList } from "./hooks/departments/useDepartmentList";
import Breadcrumb from "@/components/UI/breadcrumb/BreadcrumbCustom";

const initalState = {
  keySearch: "",
  onFetchingBrand: false,
  valueBr: [],
};
const PersonnelDepartments = (props) => {
  const dataLang = props.dataLang;

  const router = useRouter();

  const isShow = useToast();

  const { paginate } = usePagination();

  const statusExprired = useStatusExprired();

  const [isState, sIsState] = useState(initalState);

  const { limit, updateLimit: sLimit } = useLimitAndTotalItems();

  const { is_admin: role, permissions_current: auth } = useSelector(
    (state) => state.auth
  );

  const { checkAdd, checkEdit, checkExport } = useActionRole(
    auth,
    "department"
  );

  const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

  const params = {
    search: isState.keySearch,
    limit: limit,
    page: router.query?.page || 1,
    "filter[branch_id]":
      isState.valueBr?.length > 0 ? isState.valueBr.map((e) => e.value) : null,
  };

  const { data, isFetching, refetch } = useDepartmentList(params);

  const { data: listBranch = [] } = useBranchList();

  const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
    queryState({ keySearch: value });
    router.replace("/personnels/departments");
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
          title: `${dataLang?.personnels_deparrtments_name}`,
          width: { wpx: 100 },
          style: {
            fill: { fgColor: { rgb: "C7DFFB" } },
            font: { bold: true },
          },
        },
        {
          title: `${dataLang?.personnels_deparrtments_email}`,
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
        { value: `${e.email ? e.email : ""}` },
        { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
      ]),
    },
  ];

  const breadcrumbItems = [
    {
      label: `${
        dataLang?.header_category_personnel || "header_category_personnel"
      }`,
      // href: "/",
    },
    {
      label: `${
        dataLang?.personnels_deparrtments_title ||
        "personnels_deparrtments_title"
      }`,
    },
  ];

  return (
    <React.Fragment>
      <LayOutTableDynamic
        head={
          <Head>
            <title>{dataLang?.personnels_deparrtments_title}</title>
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
              {dataLang?.personnels_deparrtments_title}
            </h2>
            <div className="flex items-center justify-end gap-2">
              {role == true || checkAdd ? (
                <Popup_phongban
                  isState={isState}
                  onRefresh={refetch.bind(this)}
                  dataLang={dataLang}
                  listBranch={listBranch}
                  nameModel={"client_contact"}
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
          <div className="h-full flex flex-col">
            <div className="grid items-center justify-between w-full grid-cols-6 p-2 rounded bg-slate-100 xl:p-3">
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
                        label:
                          dataLang?.price_quote_branch || "price_quote_branch",
                        isDisabled: true,
                      },
                      ...listBranch,
                    ]}
                    onChange={(e) => queryState({ valueBr: e })}
                    value={isState.valueBr}
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
                    sOnFetching={(e) => {}}
                  />
                  {role == true || checkExport ? (
                    <div className={``}>
                      {data?.rResult?.length > 0 && (
                        <ExcelFileComponent
                          multiDataSet={multiDataSet}
                          filename="Phòng ban"
                          title="Pb"
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
                <HeaderTable gridCols={12} display={"grid"}>
                  <ColumnTable colSpan={3} textAlign={"center"}>
                    {dataLang?.personnels_deparrtments_name ||
                      "personnels_deparrtments_name"}
                  </ColumnTable>
                  <ColumnTable colSpan={3} textAlign={"center"}>
                    {dataLang?.personnels_deparrtments_email ||
                      "personnels_deparrtments_email"}
                  </ColumnTable>
                  <ColumnTable colSpan={4} textAlign={"center"}>
                    {dataLang?.client_list_brand || "client_list_brand"}
                  </ColumnTable>
                  <ColumnTable colSpan={2} textAlign={"center"}>
                    {dataLang?.branch_popup_properties ||
                      "branch_popup_properties"}
                  </ColumnTable>
                </HeaderTable>
                {isFetching ? (
                  <Loading className="h-80" color="#0f4f9e" />
                ) : data?.rResult?.length > 0 ? (
                  <>
                    <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px] ">
                      {data?.rResult?.map((e) => (
                        <RowTable gridCols={12} key={e.id.toString()}>
                          <RowItemTable colSpan={3} textAlign={"left"}>
                            {e.name}
                          </RowItemTable>
                          <RowItemTable colSpan={3} textAlign={"left"}>
                            {e.email}
                          </RowItemTable>
                          <RowItemTable colSpan={4}>
                            <span className="flex flex-wrap space-x-2">
                              {e.branch?.map((i) => (
                                <TagBranch key={i}>{i.name}</TagBranch>
                              ))}
                            </span>
                          </RowItemTable>
                          <RowItemTable
                            colSpan={2}
                            className="flex items-center justify-center space-x-2 text-center"
                          >
                            {role == true || checkEdit ? (
                              <Popup_phongban
                                onRefresh={refetch.bind(this)}
                                className="text-xs xl:text-base "
                                isState={isState}
                                listBranch={listBranch}
                                sValueBr={e.branch}
                                dataLang={dataLang}
                                name={e.name}
                                email={e.email}
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
                              onRefreshGroup={() => {}}
                              dataLang={dataLang}
                              id={e?.id}
                              type="department"
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
    </React.Fragment>
  );
};

export default PersonnelDepartments;
