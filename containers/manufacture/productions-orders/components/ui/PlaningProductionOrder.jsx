import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import {
  ColumnTable,
  HeaderTable,
  RowItemTable,
  RowTable,
} from "@/components/UI/common/Table";
import Loading from "@/components/UI/loading/loading";
import Image from "next/image";
import React, { memo, useContext, useState } from "react";
import { twMerge } from "tailwind-merge";
import { StateContext } from "@/context/_state/productions-orders/StateContext";
import { useListBomProductPlan } from "@/managers/api/productions-order/useListBomProductPlan";
import NoData from "@/components/UI/noData/nodata";
import ProgressBar from "@/components/common/progress/ProgressBar";

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
      <div className="rounded bg-background-gray-1 xlg:px-2 xlg:py-[6px] xl:px-1 xl:py-[3px] shrink-0">
        <Image
          alt="default"
          src={imageURL || "/productionPlan/default-product.svg"}
          width={22}
          height={17}
          quality={100}
        />
      </div>
      <div className="flex flex-col items-start justify-start gap-y-1 w-full">
        <h3 className="font-semibold text-[10px] xl:text-[12px] text-typo-black-1 xlg:text-sm">
          {name}
        </h3>
        <p className="xlg:text-[10px] xl:text-[8px] text-[6px] font-normal text-typo-gray-2">
          {variation || "(none)"}
        </p>
        <p className="xlg:text-[10px] text-[8px] font-normal text-typo-blue-2">
          {code}
        </p>
        {typeTable === "products" && (
          <div
            className={twMerge(
              "rounded xl:px-1 px-[2px] w-fit",
              typeProduct === "semi_products"
                ? "bg-background-green-1/20 text-typo-green-1 "
                : "bg-background-blue-1/20 text-typo-blue-3 "
            )}
          >
            <p className="xl:text-[8px] font-medium leading-4 text-[6px]">
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

const TablePlaning = ({ Title, typeTable, dataLang, data }) => {

  const formatNumber = (value) => {
    const number = Number(value);
    return isNaN(number) ? "-" : number.toLocaleString("vi-VN");
  };
  const dataFormat = data.map((item) => ({
    ...item,
    total_quota: formatNumber(item.total_quota),
    quota_primary: formatNumber(item.quota_primary),
    quantity_keep: formatNumber(item.quantity_keep),
    quantity_rest: formatNumber(item.quantity_rest),
  }));

  const [limit, setLimit] = useState(5);

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
                {typeTable === "products"
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
            {dataFormat && dataFormat?.length > 0 ? (
              <>
                {dataFormat?.slice(0, limit).map((item, index) => (
                  <div
                    className="divide-y divide-slate-200 h-[100%] "
                    key={item.item_id}
                  >
                    {
                      <RowTable gridCols={12}>
                        {/* stt */}
                        <RowItemTable
                          colSpan={1}
                          textAlign={"center"}
                          // textSize={`"!text-sm"`}
                          className="font-semibold xlg:text-sm leading-6 text-typo-black-1 "
                        >
                          {index + 1}
                        </RowItemTable>
                        <RowItemTable
                          colSpan={3}
                          textAlign={"start"}
                        // textSize={`"!text-xs"`}
                        >
                          {/* card */}
                          <CardProductionOrder
                            name={item.item_name}
                            code={item.item_code}
                            typeProduct={item.type_products}
                            imageURL={item.images}
                            variation={item.item_variation}
                            typeTable={typeTable}
                            dataLang={dataLang}
                          />
                        </RowItemTable>
                        {typeTable === "products" && (
                          <RowItemTable
                            colSpan={2}
                            textAlign={"center"}
                            // textSize={`"!text-sm"`}
                            className="font-semibold xlg:text-sm leading-6 text-typo-black-1 xl:text-xs"
                          >
                            {/* Đơn vị tính */}
                            {item.unit_name}
                          </RowItemTable>
                        )}

                        <RowItemTable
                          colSpan={1}
                          textAlign={"center"}
                          // textSize={`"!text-sm"`}
                          className="font-semibold xlg:text-sm leading-6 text-typo-black-1"
                        >
                          {/* sử dụng  */}
                          {typeTable === "materials" ? (
                            <p>
                              {item.total_quota === "0" ? (
                                " - "
                              ) : (
                                <span>
                                  {item.total_quota}/ <br />{" "}
                                  <span className="font-normal xlg:text-xs xl:text-[10px] text-typo-black-1">
                                    {" "}
                                    {item.unit_name}
                                  </span>
                                </span>
                              )}
                            </p>
                          ) : (
                            <p>
                              {item.total_quota === "0"
                                ? " - "
                                : item.total_quota}
                            </p>
                          )}
                        </RowItemTable>
                        {typeTable === "materials" && (
                          <RowItemTable
                            colSpan={2}
                            textAlign={"center"}
                            // textSize={`"!text-sm"`}
                            className="font-semibold xlg:text-sm leading-6 text-typo-black-1"
                          >
                            {/* quy đổi  */}
                            {item.quota_primary === "0" ? (
                              " - "
                            ) : (
                              <span>
                                {item.quota_primary}/ <br />{" "}
                                <span className="font-normal xlg:text-xs xl:text-[10px] text-typo-black-1">
                                  {" "}
                                  {item.unit_name_primary}
                                </span>
                              </span>
                            )}
                          </RowItemTable>
                        )}
                        <RowItemTable
                          colSpan={1}
                          textAlign={"center"}
                          textSize={`"!text-sm"`}
                          className="font-semibold xlg:text-sm leading-6 text-typo-black-1"
                        >
                          {/* Đã giữ */}

                          {typeTable === "materials" ? (
                            <p>
                              {item.quantity_keep === "0" ? (
                                " - "
                              ) : (
                                <span>
                                  {item.quantity_keep}/ <br />{" "}
                                  <span className="font-normal xlg:text-xs xl:text-[10px] text-typo-black-1">
                                    {" "}
                                    {item.unit_name_primary}
                                  </span>
                                </span>
                              )}
                            </p>
                          ) : (
                            <p>
                              {item.quantity_keep === "0"
                                ? " - "
                                : item.quantity_keep}
                            </p>
                          )}
                        </RowItemTable>
                        <RowItemTable
                          colSpan={1}
                          textAlign={"center"}
                          // textSize={`"!text-sm"`}
                          className="font-semibold xlg:text-sm  leading-6 text-typo-black-1"
                        >
                          {/* Thiếu */}
                          {typeTable === "materials" ? (
                            <p>
                              {item.quantity_rest === "0" ? (
                                " - "
                              ) : (
                                <span>
                                  {item.quantity_rest}/ <br />{" "}
                                  <span className="font-normal xlg:text-xs xl:text-[10px] text-typo-black-1">
                                    {" "}
                                    {item.unit_name_primary}
                                  </span>
                                </span>
                              )}
                            </p>
                          ) : (
                            <p>
                              {item.quantity_rest === "0"
                                ? " - "
                                : item.quantity_rest}
                            </p>
                          )}
                        </RowItemTable>
                        <RowItemTable
                          colSpan={3}
                          textAlign={"start"}
                          // textSize={`"!text-sm"`}
                          className={"font-semibold xlg:text-sm"}
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
              </>
            ) : (
              <>
                <NoData className="mt-0 col-span-16" type="table" />
              </>
            )}
          </div>
          <div className="w-full">
            {dataFormat?.length > 0 && (
              <div className="flex items-center w-full justify-center h-fit">
                <div />
                {limit < dataFormat.length && (
                  <div className=" flex justify-center py-2">
                    <button
                      onClick={() => setLimit(dataFormat.length)}
                      className="text-[#667085] 3xl:text-base xl:text-sm text-xs hover:underline font-semibold"
                    >
                      Xem thêm ({dataFormat.length - limit}){" "}
                      {typeTable === "products"
                        ? `${dataLang?.materials_planning_semi}`
                        : `${dataLang?.import_materials}`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Customscrollbar>
      </div>
    </div>
  );
};

const PlaningProductionOrder = memo(({ dataLang }) => {
  const { isStateProvider, queryStateProvider } = useContext(StateContext);
  //truyền id của kế hoạch sản xuất
  const { data: dataListBom, isLoading: isLoadingDataListBom } =
    useListBomProductPlan({
      id: isStateProvider?.productionsOrders?.dataProductionOrderDetail?.pp_id,
    });

  // console.log("🚀 ~ PlaningProductionOrder ~ dataListBom:", dataListBom)

  return (
    <div className="flex flex-row w-full h-full items-start justify-between">
      {/* bảng nguyên liêu */}
      <div className=" w-[50%] h-full pl-4">
        {isLoadingDataListBom ? (
          <Loading className="h-80" color="#0f4f9e" />
        ) : (
          <TablePlaning
            Title="kế hoạch nguyên vật liệu"
            dataLang={dataLang}
            data={dataListBom?.data?.materialsBom}
            typeTable="materials"
          />
        )}
      </div>

      {/* bảng bán thành phẩm  */}
      <div className="w-[50%] border-r border-border-gray-1 h-full pr-4">
        {isLoadingDataListBom ? (
          <Loading className="h-80" color="#0f4f9e" />
        ) : (
          <TablePlaning
            Title="kế hoạch bán thành phẩm"
            dataLang={dataLang}
            data={dataListBom?.data?.productsBom}
            typeTable="products"
          />
        )}
      </div>
    </div>
  );
});

export default PlaningProductionOrder;
