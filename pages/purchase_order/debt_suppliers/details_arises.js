import React, { useState, useEffect } from "react";
import PopupEdit from "/components/UI/popup";
import { SearchNormal1 as IconSearch } from "iconsax-react";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});
import dynamic from "next/dynamic";
import moment from "moment";
const Popup_chitietPhatsinh = (props) => {
  const dataLang = props?.dataLang;
  const [open, sOpen] = useState(false);
  const _ToggleModal = (e) => sOpen(e);
  const [data, sData] = useState();
  const [onFetching, sOnFetching] = useState(false);
  const [total, sTotal] = useState(null);
  useEffect(() => {
    props?.id && sOnFetching(true);
  }, [open]);

  const formatNumber = (number) => {
    if (!number && number !== 0) return 0;
    const integerPart = Math.floor(number);
    const decimalPart = number - integerPart;
    const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
    const roundedNumber = integerPart + roundedDecimalPart;
    return roundedNumber.toLocaleString("en");
  };
  const _ServerFetching_detail = () => {
    Axios(
      "GET",
      `/api_web/Api_debt_supplier/debtDetail/${props?.id}/${props?.type}?csrf_protection=true`,
      {
        params: {
          "filter[start_date]": props?.date?.startDate
            ? moment(props?.date?.startDate).format("YYYY-MM-DD")
            : "",
          "filter[end_date]": props?.date?.endDate
            ? moment(props?.date?.endDate).format("YYYY-MM-DD")
            : "",
        },
      },
      (err, response) => {
        if (!err) {
          var { rResult, rTotal } = response.data;
          sData(rResult);
          sTotal(rTotal?.total_amount);
        }
        sOnFetching(false);
      }
    );
  };

  useEffect(() => {
    onFetching && _ServerFetching_detail();
  }, [open]);

  return (
    <>
      <PopupEdit
        title={
          (props?.type == "no_debt" && "Chi tiết phát sinh nợ") ||
          (props?.type == "chi_debt" && "Chi tiết phát sinh chi")
        }
        button={props?.name}
        onClickOpen={_ToggleModal.bind(this, true)}
        open={open}
        onClose={_ToggleModal.bind(this, false)}
        classNameBtn={props?.className}
      >
        <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
        <div className=" space-x-5 3xl:w-[1200px] 2xl:w-[1150px] xl:w-[w-[900px] lg:w-[900px] w-[1200px] 3xl:h-auto  2xl:h-auto xl:h-[350px] lg:h-[400px] h-[500px] ">
          <div>
            <div className="bg-slate-100">
              <div className=" flex gap-2 justify-between p-2">
                <h2 className="flex gap-2 font-semibold">
                  Nhà cung cấp:
                  <h2 className="font-semibold capitalize text-blue-700">
                    {props?.supplier_name}
                  </h2>
                </h2>
                <h2 className="font-medium flex gap-2">
                  <h2>Lọc từ ngày</h2>
                  <h2 className="text-red-600">
                    {moment(props?.date?.startDate).format("DD/MM/YYYY")}
                  </h2>
                  <h2> đến ngày</h2>
                  <h2 className="text-red-600">
                    {moment(props?.date?.endDate).format("DD/MM/YYYY")}
                  </h2>
                </h2>
              </div>
            </div>
            <div className="3xl:w-[1200px] 2xl:w-[1150px] xl:w-[w-[900px] lg:w-[900px] w-[1200px]">
              <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                <div className=" w-[100%]">
                  <div
                    className={`grid-cols-12  grid sticky top-0 rounded-xl shadow-md bg-white   z-10  divide-x`}
                  >
                    <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                      Ngày chứng từ
                    </h4>
                    <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                      Mã chứng từ
                    </h4>
                    <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                      Loại chứng từ
                    </h4>
                    <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                      Thành tiền
                    </h4>
                    <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                      Ghi chú
                    </h4>
                    <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                      Chi nhánh
                    </h4>
                  </div>
                  {onFetching ? (
                    <Loading className="max-h-28" color="#0f4f9e" />
                  ) : data?.length > 0 ? (
                    <>
                      <ScrollArea
                        className="min-h-[90px] max-h-[170px] 3xl:max-h-[439px] 2xl:max-h-[250px] xl:max-h-[280px] lg:max-h-[286px] overflow-hidden"
                        speed={1}
                        smoothScrolling={true}
                      >
                        <div className="divide-y divide-slate-100 min:h-[170px]  max:h-[170px]">
                          {data?.map((e) => (
                            <div
                              className="grid grid-cols-12 hover:bg-slate-50 items-center border-b"
                              key={e.id?.toString()}
                            >
                              <h6 className="text-[13px]   py-2.5 px-2 col-span-2 font-medium text-center ">
                                {moment(e?.date).format("DD/MM/YYYY")}
                              </h6>
                              <h6 className="text-[13px]   py-2.5 px-2 col-span-2 font-medium text-center ">
                                {e?.code}
                              </h6>
                              <h6 className="text-[13px] flex items-center w-fit mx-auto  py-2.5 px-2 col-span-2 font-medium ">
                                <div className="mx-auto">
                                  {(e?.type === "import_title" && (
                                    <span className="flex items-center justify-center font-normal text-purple-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-purple-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                      {dataLang[e?.type] || e?.type}
                                    </span>
                                  )) ||
                                    (e?.type === "service" && (
                                      <span className=" flex items-center justify-center font-normal text-cyan-500 rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-cyan-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                        {dataLang[e?.type] || e?.type}
                                      </span>
                                    )) ||
                                    (e?.type === "returns_title" && (
                                      <span className="flex items-center justify-center gap-1 font-normal text-red-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-rose-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                        {dataLang[e?.type] || e?.type}
                                      </span>
                                    )) ||
                                    (e?.type === "payment_title" && (
                                      <span className="flex items-center justify-center gap-1 font-normal text-orange-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-orange-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                        {dataLang[e?.type] || e?.type}
                                      </span>
                                    ))}
                                </div>
                              </h6>
                              <h6 className="text-[13px]   py-2.5 px-2 col-span-2 font-medium text-right ">
                                {formatNumber(e?.total_amount)}
                              </h6>
                              <h6 className="text-[13px]   py-2.5 px-2 col-span-2 font-medium text-left">
                                {e?.note}
                              </h6>
                              <h6 className="col-span-2 w-fit mx-auto">
                                <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                  {e?.branch_name}
                                </div>
                              </h6>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </>
                  ) : (
                    <div className=" max-w-[352px] mt-24 mx-auto">
                      <div className="text-center">
                        <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                          <IconSearch />
                        </div>
                        <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                          {props.dataLang
                            ?.purchase_order_table_item_not_found ||
                            "purchase_order_table_item_not_found"}
                        </h1>
                        <div className="flex items-center justify-around mt-6 ">
                          {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid-cols-12 grid items-center border-b-gray-200 border-b  border-t z-10 border-t-gray-200 bg-slate-100 rounded">
                  <h2 className="font-semibold p-2 text-[13px] col-span-6 text-center border-l border-r uppercase">
                    Tổng tiền
                  </h2>
                  <h2 className="font-medium p-2 text-[13px]   col-span-2 text-right border-r">
                    {formatNumber(total)}
                  </h2>
                  <h2 className="font-medium p-[17px] text-[13px]   col-span-2 text-right border-r"></h2>
                  <h2 className="font-medium p-[17px] text-[13px]   col-span-2 text-right border-r"></h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopupEdit>
    </>
  );
};
export default Popup_chitietPhatsinh;
