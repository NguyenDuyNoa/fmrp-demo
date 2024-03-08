import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { _ServerInstance as Axios } from "/services/axios";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});
import { NumericFormat } from "react-number-format";
import ReactExport from "react-data-export";

import Swal from "sweetalert2";

import {
  Edit as IconEdit,
  Grid6 as IconExcel,
  Trash as IconDelete,
  SearchNormal1 as IconSearch,
  Add as IconAdd,
  LocationTick,
  User,
  ArrowCircleDown,
  Refresh2,
} from "iconsax-react";
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import Pagination from "/components/UI/pagination";
import dynamic from "next/dynamic";
import moment from "moment/moment";
import Select, { components } from "react-select";
import Popup from "reactjs-popup";
import { data } from "autoprefixer";
import { useDispatch } from "react-redux";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

const Popup_chitiet = (props) => {
  const scrollAreaRef = useRef(null);
  const [open, sOpen] = useState(false);
  const _ToggleModal = (e) => sOpen(e);
  const [tab, sTab] = useState(0);
  const _HandleSelectTab = (e) => sTab(e);
  const [data, sData] = useState();
  const [onFetching, sOnFetching] = useState(false);
  const formatNumber = (number) => {
    if (!number && number !== 0) return 0;
    const integerPart = Math.floor(number);
    const decimalPart = number - integerPart;
    const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
    const roundedNumber = integerPart + roundedDecimalPart;
    return roundedNumber.toLocaleString("en");
  };

  useEffect(() => {
    props?.id && sOnFetching(true);
  }, [open]);
  const _ServerFetching_detailUser =  () => {
     Axios(
      "GET",
      `/api_web/api_supplier/supplier/${props?.id}?csrf_protection=true`,
      {},
      (err, response) => {
        if (!err) {
          var db = response.data;
          sData(db);
        }
        sOnFetching(false);
      }
    );
  };
  useEffect(() => {
    onFetching && _ServerFetching_detailUser();
  }, [open]);

  return (
    <>
      <PopupEdit
        title={props.dataLang?.suppliers_supplier_detail}
        button={props?.name}
        onClickOpen={_ToggleModal.bind(this, true)}
        open={open}
        onClose={_ToggleModal.bind(this, false)}
        classNameBtn={props?.className}
      >
        <div className="flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]">
          <button
            onClick={_HandleSelectTab.bind(this, 0)}
            className={`${
              tab === 0
                ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]"
                : "hover:text-[#0F4F9E] "
            }  px-4 py-2 outline-none font-semibold`}
          >
            {props.dataLang?.client_popup_general}
          </button>
          <button
            onClick={_HandleSelectTab.bind(this, 1)}
            className={`${
              tab === 1
                ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]"
                : "hover:text-[#0F4F9E] "
            }  px-4 py-2 outline-none font-semibold`}
          >
            {props.dataLang?.client_popup_detailContact}
          </button>
        </div>
        <div className="mt-4 space-x-5 w-[930px] 3xl:h-[500px] 2xl:h-[500px] xl:h-[500px]  lg:h-[400px] h-[500px] ">
          {tab === 0 && (
            <ScrollArea
              ref={scrollAreaRef}
              className="3xl:h-[500px] 2xl:h-[500px] xl:h-[500px]  lg:h-[400px] h-[500px] overflow-hidden "
              speed={1}
              smoothScrolling={true}
            >
              {onFetching ? (
                <Loading className="h-80" color="#0f4f9e" />
              ) : (
                data != "" && (
                  <div className="flex gap-5 rounded-md ">
                    <div className="w-[50%] bg-slate-100/40 rounded-md">
                      <div className="mb-4 h-[50px] flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm w-[25%]">
                          {props.dataLang?.suppliers_supplier_code}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.code}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between flex-wrap p-2">
                        <span className="text-slate-400 text-sm      w-[30%]">
                          {props.dataLang?.suppliers_supplier_name}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.name}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm   w-[25%]">
                          {props.dataLang?.suppliers_supplier_reper}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.representative}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between  items-center p-2">
                        <span className="text-slate-400 text-sm  w-[25%]">
                          {props.dataLang?.suppliers_supplier_email}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.email}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm   w-[25%]">
                          {props.dataLang?.suppliers_supplier_phone}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.phone_number}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm   w-[25%]">
                          {props.dataLang?.suppliers_supplier_taxcode}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.tax_code}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm   w-[25%]">
                          {props.dataLang?.suppliers_supplier_adress}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.address}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm   w-[25%]">
                          {props.dataLang?.suppliers_supplier_note}:{" "}
                        </span>{" "}
                        <span className="font-medium capitalize">
                          {data?.note}
                        </span>
                      </div>
                    </div>
                    <div className="w-[50%] bg-slate-100/40">
                      <div className="mb-4 flex justify-between  p-2 items-center flex-wrap">
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.client_list_brand}:
                        </span>{" "}
                        <span className="flex flex-wrap justify-between gap-1">
                          {data?.branch?.map((e) => {
                            return (
                              <span
                                key={e.id}
                                className="last:ml-0 font-normal capitalize mb-1  w-fit xl:text-base text-xs px-2 text-[#0F4F9E] border border-[#0F4F9E] rounded-[5.5px]"
                              >
                                {" "}
                                {e.name}
                              </span>
                            );
                          })}
                        </span>
                      </div>
                      <div className="mb-4 justify-between  p-2 flex flex-wrap  ">
                        <span className="text-slate-400 text-sm ">
                          {"Nhóm nhà cung cấp"}:
                        </span>{" "}
                        <span className=" flex flex-wrap  justify-start gap-1">
                          {data?.supplier_group?.map((h) => {
                            return (
                              <span
                                key={h.id}
                                style={{ backgroundColor: "#e2f0fe" }}
                                className={`text-[#0F4F9E] mb-1   w-fit xl:text-base text-xs px-2 rounded-md font-[300] py-0.5`}
                              >
                                {h.name}
                              </span>
                            );
                          })}
                        </span>
                      </div>

                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.suppliers_supplier_debt}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {formatNumber(data?.debt_begin)}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.client_popup_date}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.date_incorporation != null
                            ? data?.date_incorporation != "0000-00-00"
                              ? moment(data?.date_incorporation).format(
                                  "DD/MM/YYYY"
                                )
                              : ""
                            : ""}
                        </span>
                      </div>
                      {/* <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_date}:</span> <span className='font-normal capitalize'>{moment(data?.date_create).format("DD/MM/YYYY")}</span></div> */}
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.suppliers_supplier_city}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.city != ""
                            ? data?.city.type + " " + data?.city.name
                            : ""}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between p-2 items-center">
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.suppliers_supplier_district}:{" "}
                        </span>
                        <span className="font-normal capitalize">
                          {data?.district != ""
                            ? data?.district.type + " " + data?.district.name
                            : ""}
                        </span>
                        ,
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.suppliers_supplier_wards}:
                        </span>
                        <span className="font-normal capitalize">
                          {data?.ward != ""
                            ? data?.ward.type + " " + data?.ward.name
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </ScrollArea>
          )}
          {tab === 1 && (
            <div>
              <div className="w-[930px]">
                <div className="min:h-[200px] h-[72%] max:h-[400px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2 w-[100%] ">
                    <div className="grid grid-cols-12 items-center sticky top-0 bg-slate-100 p-2 z-10">
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-3 font-[400] text-center">
                        {props.dataLang?.suppliers_supplier_fullname}
                      </h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center">
                        {props.dataLang?.suppliers_supplier_phone}
                      </h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center">
                        {props.dataLang?.suppliers_supplier_email}
                      </h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-3 font-[400] text-center">
                        {props.dataLang?.suppliers_supplier_pos}
                      </h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center">
                        {props.dataLang?.suppliers_supplier_adress}
                      </h4>
                    </div>
                    {onFetching ? (
                      <Loading className="h-80" color="#0f4f9e" />
                    ) : data?.contact?.length > 0 ? (
                      <>
                        <ScrollArea
                          className="3xl:h-[500px] 2xl:h-[500px] xl:h-[500px]  lg:h-[400px] h-[500px] overflow-hidden"
                          speed={1}
                          smoothScrolling={true}
                        >
                          <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[500px]">
                            {data?.contact?.map((e) => (
                              <div
                                className="grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40 "
                                key={e.id.toString()}
                              >
                                <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-3  rounded-md text-left">
                                  {e.full_name}
                                </h6>
                                <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-2  rounded-md text-center">
                                  {e.phone_number}
                                </h6>
                                <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-2  rounded-md text-left">
                                  {e.email}
                                </h6>
                                <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-3 rounded-md text-left">
                                  {e.position}
                                </h6>
                                <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-2  rounded-md text-left">
                                  {e.address}
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
                            Không tìm thấy các mục
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
            </div>
          )}
        </div>
      </PopupEdit>
    </>
  );
};
export default Popup_chitiet;
