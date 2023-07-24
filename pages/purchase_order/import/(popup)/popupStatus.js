import React, { useRef, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import ModalImage from "react-modal-image";
import "react-datepicker/dist/react-datepicker.css";

import {
  Grid6 as IconExcel,
  Filter as IconFilter,
  Calendar as IconCalendar,
  SearchNormal1 as IconSearch,
  ArrowDown2 as IconDown,
} from "iconsax-react";

import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
import DatePicker, { registerLocale } from "react-datepicker";
import Popup from "reactjs-popup";
import moment from "moment/moment";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);

const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";

import Swal from "sweetalert2";

import { useEffect } from "react";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

const Popup_status = (props) => {
  const dataLang = props?.dataLang;
  const [onFetching, sOnFetching] = useState(false);
  const [open, sOpen] = useState(false);
  const [data, sData] = useState([]);

  const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
  const [dataProductExpiry, sDataProductExpiry] = useState({});
  const [dataProductSerial, sDataProductSerial] = useState({});

  const formatNumber = (number) => {
    if (!number && number !== 0) return 0;
    const integerPart = Math.floor(number);
    const decimalPart = number - integerPart;
    const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
    const roundedNumber = integerPart + roundedDecimalPart;
    return roundedNumber.toLocaleString("en");
  };

  const _ServerFetching = () => {
    Axios(
      "GET",
      "/api_web/api_setting/feature/?csrf_protection=true",
      {},
      (err, response) => {
        if (!err) {
          var data = response.data;
          sDataMaterialExpiry(data.find((x) => x.code == "material_expiry"));
          sDataProductExpiry(data.find((x) => x.code == "product_expiry"));
          sDataProductSerial(data.find((x) => x.code == "product_serial"));
        }
        sOnFetching(false);
      }
    );
  };
  useEffect(() => {
    onFetching && _ServerFetching();
  }, [onFetching]);

  useEffect(() => {
    open && sOnFetching(true);
  }, [open]);

  useEffect(() => {
    sOnFetching(true);
    sData([]);
    sOpen(false);
    if (props?.data_export?.length > 0) {
      sOnFetching(false);
      sOpen(true);
      sData(props?.data_export);
    }
  }, [props?.data_export]);

  return (
    <PopupEdit
      title={props.dataLang?.inventory_votes || "inventory_votes"}
      open={open}
      onClose={() => sOpen(false)}
      classNameBtn={props.className}
    >
      <div className="mt-4 space-x-5 w-[1100px] h-auto">
        <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <div className="pr-2 ">
            <div
              className={`${
                dataProductSerial.is_enable == "1"
                  ? dataMaterialExpiry.is_enable != dataProductExpiry.is_enable
                    ? "grid-cols-12"
                    : dataMaterialExpiry.is_enable == "1"
                    ? "grid-cols-12"
                    : "grid-cols-10"
                  : dataMaterialExpiry.is_enable != dataProductExpiry.is_enable
                  ? "grid-cols-11"
                  : dataMaterialExpiry.is_enable == "1"
                  ? "grid-cols-11"
                  : "grid-cols-9"
              }  grid sticky top-0 bg-white shadow  z-10`}
            >
              <h4 className="text-[13px]  px-2 py-1.5 text-[#667085] uppercase col-span-2 font-[300] text-center">
                {props.dataLang?.inventory_dayvouchers ||
                  "inventory_dayvouchers"}
              </h4>
              <h4 className="text-[13px]  px-2 py-1.5 text-[#667085] uppercase col-span-1 font-[300] text-center ">
                {props.dataLang?.inventory_vouchercode ||
                  "inventory_vouchercode"}
              </h4>
              <h4 className="text-[13px]  px-2 py-1.5 text-[#667085] uppercase col-span-1 font-[300] text-center whitespace-nowrap">
                {props.dataLang?.import_ballot || "import_ballot"}
              </h4>
              {dataProductSerial.is_enable === "1" && (
                <h4 className="text-[13px]  px-2 py-1.5  col-span-1  text-[#667085] uppercase  font-[400] text-center">
                  {"Serial"}
                </h4>
              )}
              {dataMaterialExpiry.is_enable === "1" ||
              dataProductExpiry.is_enable === "1" ? (
                <>
                  <h4 className="text-[13px]  px-2 py-1.5  col-span-1  text-[#667085] uppercase  font-[400] text-center">
                    {"Lot"}
                  </h4>
                  <h4 className="text-[13px]  px-2 py-1.5  col-span-1  text-[#667085] uppercase  font-[400] text-center">
                    {props.dataLang?.warehouses_detail_date ||
                      "warehouses_detail_date"}
                  </h4>
                </>
              ) : (
                ""
              )}
              <h4 className="text-[13px]  px-2 py-1.5 text-[#667085] uppercase col-span-2 font-[300] text-center">
                {props.dataLang?.purchase_order_purchase_from_item ||
                  "purchase_order_purchase_from_item"}
              </h4>
              <h4 className="text-[13px]  px-2 py-1.5 text-[#667085] uppercase col-span-2 font-[300] text-center">
                {props.dataLang?.PDF_house || "PDF_house"}
              </h4>
              <h4 className="text-[13px]  px-2 py-1.5 text-[#667085] uppercase col-span-1 font-[300] text-center">
                {props.dataLang?.purchase_quantity || "purchase_quantity"}
              </h4>
            </div>
            {onFetching ? (
              <Loading className="h-50" color="#0f4f9e" />
            ) : data?.length > 0 ? (
              <>
                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[500px] mt-2 ">
                  {data?.map((e) => (
                    <div
                      className={`${
                        dataProductSerial.is_enable == "1"
                          ? dataMaterialExpiry.is_enable !=
                            dataProductExpiry.is_enable
                            ? "grid-cols-12"
                            : dataMaterialExpiry.is_enable == "1"
                            ? "grid-cols-12"
                            : "grid-cols-10"
                          : dataMaterialExpiry.is_enable !=
                            dataProductExpiry.is_enable
                          ? "grid-cols-11"
                          : dataMaterialExpiry.is_enable == "1"
                          ? "grid-cols-11"
                          : "grid-cols-9"
                      }  grid hover:bg-slate-50 items-center`}
                    >
                      <h6 className="text-[13px] px-2 py-1.5 col-span-2 text-center">
                        {e?.date_coupon != null
                          ? moment(e?.date_coupon).format("DD/MM/YYYY")
                          : ""}
                      </h6>
                      <h6 className="text-[13px] px-2 py-1.5 col-span-1 text-center hover:font-normal cursor-pointer">
                        {e?.code_coupon}
                      </h6>
                      <h6 className="text-[13px] px-2 py-1.5 col-span-1 text-center hover:font-normal cursor-pointer">
                        {dataLang[e?.type_text]}
                      </h6>

                      {dataProductSerial.is_enable === "1" ? (
                        <div className=" col-span-1 ">
                          <h6 className="text-[13px] px-2 py-1.5  w-[full] text-center">
                            {e.serial == null || e.serial == ""
                              ? "-"
                              : e.serial}
                          </h6>
                        </div>
                      ) : (
                        ""
                      )}
                      {dataMaterialExpiry.is_enable === "1" ||
                      dataProductExpiry.is_enable === "1" ? (
                        <>
                          <div className=" col-span-1  ">
                            <h6 className="text-[13px] px-2 py-1.5 w-[full] text-center">
                              {e.lot == null || e.lot == "" ? "-" : e.lot}
                            </h6>
                          </div>
                          <div className=" col-span-1  ">
                            <h6 className="text-[13px] px-2 py-1.5 w-[full] text-center">
                              {e.expiration_date
                                ? moment(e.expiration_date).format("DD-MM-YYYY")
                                : "-"}
                            </h6>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      <h6 className="text-[13px] px-2 py-1.5 col-span-2   hover:font-normal cursor-pointer">
                        <div className="">
                          <h4 className="text-[13px] px-2 py-1.5  w-[full] ">
                            {e?.name}
                          </h4>
                          <h4 className="text-[13px] px-2 py-1.5  w-[full] ">
                            {e?.product_variation}
                          </h4>
                        </div>
                      </h6>
                      <h6 className="text-[13px] px-2 py-1.5 col-span-2 text-center hover:font-normal cursor-pointer">
                        <div className="flex flex-col">
                          <span className="">{e?.warehouse_name}</span>
                          <span className="">{e?.local_name}</span>
                        </div>
                      </h6>
                      <h6 className="text-[13px] px-2 py-1.5 col-span-1 text-center hover:font-normal cursor-pointer">
                        {formatNumber(e?.quantity)}
                      </h6>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className=" max-w-[352px] mt-24 mx-auto">
                <div className="text-center">
                  <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                    <IconSearch />
                  </div>
                  <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                    {dataLang?.purchase_order_table_item_not_found ||
                      "purchase_order_table_item_not_found"}
                  </h1>
                  <div className="flex items-center justify-around mt-6 ">
                    {/* <Popup_dsncc onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PopupEdit>
  );
};
export default Popup_status;
