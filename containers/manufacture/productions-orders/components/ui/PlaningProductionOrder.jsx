import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import {
  ColumnTable,
  HeaderTable,
  RowItemTable,
  RowTable,
} from "@/components/UI/common/Table";
import Loading from "@/components/UI/loading/loading";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { memo, useCallback, useContext } from "react";
import { twMerge } from "tailwind-merge";
import Pagination from "@/components/UI/pagination";
import { StateContext } from "@/context/_state/productions-orders/StateContext";
import LimitListDropdown from "@/components/common/dropdown/LimitListDropdown";
import { useListBomProductPlan } from "@/managers/api/productions-order/useListBomProductPlan";
import NoData from "@/components/UI/noData/nodata";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import useSetingServer from "@/hooks/useConfigNumber";

const CardProductionOrder = ({
  imageURL,
  name,
  variation,
  code,
  typeProduct,
  typeTable,
  dataLang,
}) => {
  return (
    <div className=" w-full h-full flex flex-row items-start gap-x-2">
      <div className="rounded bg-background-gray-1 px-2 py-[6px]">
        <Image
          alt="default"
          src={imageURL || "/productionPlan/default-product.svg"}
          width={22}
          height={17}
          quality={100}
        />
      </div>
      <div className="flex flex-col items-start justify-start gap-y-1 w-full">
        <h3 className="font-semibold text-sm text-typo-black-1">{name}</h3>
        <p className="text-[10px] font-normal text-typo-gray-2">
          {variation || "(none)"}
        </p>
        <p className="text-[10px] font-normal text-typo-blue-2">{code}</p>
        {typeTable === "product" && (
          <div
            className={twMerge(
              "rounded px-1",
              typeProduct === "semi_products"
                ? "bg-background-green-1/20 text-typo-green-1 "
                : "bg-background-blue-1/20 text-typo-blue-3 "
            )}
          >
            <p className="text-[8px] font-medium leading-4 ">
              {typeProduct === "semi_products"
                ? dataLang?.semi_products
                : dataLang?.semi_products_outside}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProgressBar = ({ current, total, name }) => {
  const percent = Math.floor((current / total) * 100);
  const isFull = current === total;

  const formatNumber = (value) => {
    const number = Number(value);

    if (isNaN(number)) return "0"; // fallback nếu không phải số

    const fixed = number.toFixed(1); // giữ 1 số thập phân
    return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="relative h-2 bg-background-gray-1 rounded-full overflow-hidden">
        <div
          className={twMerge(
            `h-full rounded-full transition-all duration-500 min-w-0`,
            isFull ? "bg-linear-bg-progress-full" : "bg-background-blue-2"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-[8px] font-normal text-typo-gray-3">{`${formatNumber(
        current
      )}/${formatNumber(total)} ${name}`}</p>
    </div>
  );
};

const TablePlaning = ({ Title, typeTable, dataLang, data }) => {
  return (
    <div className="flex flex-col h-full">
      <h3 className="font-medium text-xl leading-5 text-typo-blue-1 capitalize mb-6">
        {" "}
        {Title}
      </h3>

      {/* table */}
      <div className="flex-1 min-h-0">
        <Customscrollbar
          className={`min-h-0 h-full w-full overflow-x-auto bg-white`}
        >
          <div>
            <HeaderTable gridCols={12} display={"grid"}>
              <ColumnTable
                colSpan={1}
                textAlign={"center"}
                className={`normal-case leading-5 text-typo-gray-1 !text-[14px] 
                                    }`}
              >
                STT
              </ColumnTable>
              <ColumnTable
                colSpan={3}
                textAlign={"left"}
                className={`border-none normal-case leading-5 text-typo-gray-1 px-3 !text-[14px] 
                                    }`}
              >
                {typeTable === "product"
                  ? dataLang?.materials_planning_semi
                  : dataLang?.import_materials}
              </ColumnTable>
              {typeTable === "products" && (
                <ColumnTable
                  colSpan={2}
                  textAlign={"center"}
                  className={`border-none  normal-case leading-5 text-typo-gray-1 !text-[14px] 
                                        }`}
                >
                  {dataLang?.category_unit || "Đơn vị tính"}
                </ColumnTable>
              )}
              <ColumnTable
                colSpan={1}
                textAlign={"center"}
                className={`px-0 border-none  normal-case leading-5 text-typo-gray-1 !text-[14px] 
                                    }`}
              >
                {dataLang?.materials_planning_use || "Sử dụng"}
              </ColumnTable>
              {typeTable === "materials" && (
                <ColumnTable
                  colSpan={2}
                  textAlign={"center"}
                  className={`border-none  normal-case leading-5 text-typo-gray-1 !text-[14px] 
                                        }`}
                >
                  {dataLang?.materials_planning_change || "Quy đổi"}
                </ColumnTable>
              )}
              <ColumnTable
                colSpan={1}
                textAlign={"center"}
                className={`border-none  normal-case leading-5 text-typo-gray-1  !text-[14px] 
                                    }`}
              >
                {dataLang?.materials_planning_held || " Đã giữ"}
              </ColumnTable>
              <ColumnTable
                colSpan={1}
                textAlign={"center"}
                className={`border-none normal-case leading-5 text-typo-gray-1 !text-[14px] 
                                    }`}
              >
                {dataLang?.materials_planning_lack || " Thiếu"}
              </ColumnTable>
              <ColumnTable
                colSpan={3}
                textAlign={"center"}
                className={`border-none normal-case leading-5 text-typo-gray-1  !text-[14px] 
                                    }`}
              >
                Tiến độ mua hàng
              </ColumnTable>
            </HeaderTable>
            {data.map((item, index) => (
              <div
                className="divide-y divide-slate-200 h-[100%] "
                key={item.item_id}
              >
                {
                  <RowTable gridCols={12}>
                    <RowItemTable
                      colSpan={1}
                      textAlign={"center"}
                      textSize={`"!text-sm"`}
                      className="font-semibold text-sm leading-6 text-typo-black-1"
                    >
                      {index + 1}
                    </RowItemTable>
                    <RowItemTable
                      colSpan={3}
                      textAlign={"start"}
                      textSize={`"!text-xs"`}
                    >
                      <CardProductionOrder
                        name={item.item_name}
                        code={item.item_code}
                        typeProduct={item.type_products}
                        imageURL={item.images}
                        variation={item.item_variation}
                      />
                    </RowItemTable>
                    {typeTable === "products" && (
                      <RowItemTable
                        colSpan={2}
                        textAlign={"center"}
                        textSize={`"!text-sm"`}
                        className="font-semibold text-sm leading-6 text-typo-black-1"
                      >
                        {item.unit_name}
                      </RowItemTable>
                    )}

                    <RowItemTable
                      colSpan={1}
                      textAlign={"center"}
                      textSize={`"!text-sm"`}
                      className="font-semibold text-sm leading-6 text-typo-black-1"
                    >
                      {typeTable === "materials" ? (
                        <p>
                          {item.total_quota === "0" ? (
                            " - "
                          ) : (
                            <span>
                              {item.total_quota}/ <br />{" "}
                              <span className="font-normal text-xs text-typo-black-1">
                                {" "}
                                {item.unit_name}
                              </span>
                            </span>
                          )}
                        </p>
                      ) : (
                        <p>
                          {item.total_quota === "0" ? " - " : item.total_quota}
                        </p>
                      )}
                    </RowItemTable>
                    {typeTable === "materials" && (
                      <RowItemTable
                        colSpan={2}
                        textAlign={"center"}
                        textSize={`"!text-sm"`}
                        className="font-semibold text-sm leading-6 text-typo-black-1"
                      >
                        {item.quota_primary === "0"
                          ? " - "
                          : item.quota_primary}
                      </RowItemTable>
                    )}
                    <RowItemTable
                      colSpan={1}
                      textAlign={"center"}
                      textSize={`"!text-sm"`}
                      className="font-semibold text-sm leading-6 text-typo-black-1"
                    >
                      {item.quantity_keep === "0" ? " - " : item.quantity_keep}
                    </RowItemTable>
                    <RowItemTable
                      colSpan={1}
                      textAlign={"center"}
                      textSize={`"!text-sm"`}
                      className="font-semibold text-sm leading-6 text-typo-black-1"
                    >
                      {item.quota_primary === "0" ? " - " : item.quota_primary}
                    </RowItemTable>
                    <RowItemTable
                      colSpan={3}
                      textAlign={"start"}
                      textSize={`"!text-sm"`}
                      className={"font-semibold"}
                    >
                      <ProgressBar
                        current={+item.quantity_import}
                        total={+item.quantity_rest}
                        name={item.unit_name_primary}
                      />
                    </RowItemTable>
                  </RowTable>
                }
              </div>
            ))}
          </div>
        </Customscrollbar>
      </div>
    </div>
  );
};

const PlaningProductionOrder = memo(({ dataLang, isLoading }) => {
  const { isStateProvider, queryStateProvider } = useContext(StateContext);
  //truyền id của kế hoạch sản xuất
  const { data: dataListBom, isLoading: isLoadingDataListBom } =
    useListBomProductPlan({
      id: isStateProvider?.productionsOrders?.dataProductionOrderDetail?.pp_id,
    });

  console.log("🚀 ~ dataListBom:", dataListBom?.data);

  return (
    <div className="flex flex-row w-full h-full items-start justify-between">
      {/* bảng bán thành phẩm  */}
      <div className="w-[50%] border-r border-border-gray-1 h-full pr-4">
        {isLoadingDataListBom ? (
          <Loading className="h-80" color="#0f4f9e" />
        ) : dataListBom?.data?.productsBom &&
          dataListBom?.data?.productsBom.length > 0 ? (
          <TablePlaning
            Title="kế hoạch bán thành phẩm"
            dataLang={dataLang}
            data={dataListBom?.data?.productsBom}
            typeTable="products"
          />
        ) : (
          <NoData className="mt-0 col-span-16" type="table" />
        )}
      </div>

      {/* bảng nguyên liêu */}
      <div className=" w-[50%] h-full pl-4">
        {isLoadingDataListBom ? (
          <Loading className="h-80" color="#0f4f9e" />
        ) : dataListBom?.data?.materialsBom &&
          dataListBom?.data?.materialsBom.length > 0 ? (
          <TablePlaning
            Title="kế hoạch nguyên vật liệu"
            dataLang={dataLang}
            data={dataListBom?.data?.materialsBom}
            typeTable="materials"
          />
        ) : (
          <NoData className="mt-0 col-span-16" type="table" />
        )}
      </div>
    </div>
  );
});

export default PlaningProductionOrder;
