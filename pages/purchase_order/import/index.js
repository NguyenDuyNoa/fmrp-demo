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
  TickCircle,
  ArrowCircleDown,
} from "iconsax-react";

import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { VscFilePdf } from "react-icons/vsc";

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
import Pagination from "/components/UI/pagination";

import Swal from "sweetalert2";

import ReactExport from "react-data-export";
import { useEffect } from "react";
import Popup_chitietThere from "../detailThere";
import FilePDF from "../FilePDF";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

const Index = (props) => {
  const dataLang = props.dataLang;
  const router = useRouter();

  const [data, sData] = useState([]);
  const [dataExcel, sDataExcel] = useState([]);

  const [onFetching, sOnFetching] = useState(false);
  const [onFetching_filter, sOnFetching_filter] = useState(false);

  const [onSending, sOnSending] = useState(false);

  const [totalItems, sTotalItems] = useState([]);
  const [keySearch, sKeySearch] = useState("");
  const [limit, sLimit] = useState(15);
  const [total, sTotal] = useState({});

  const [listBr, sListBr] = useState([]);
  const [lisCode, sListCode] = useState([]);
  const [listSupplier, sListSupplier] = useState([]);

  const [listDs, sListDs] = useState();

  const [idCode, sIdCode] = useState(null);
  const [idSupplier, sIdSupplier] = useState(null);
  const [idBranch, sIdBranch] = useState(null);
  const [valueDate, sValueDate] = useState({
    startDate: null,
    endDate: null,
  });

  const _HandleSelectTab = (e) => {
    router.push({
      pathname: router.route,
      query: { tab: e },
    });
  };
  useEffect(() => {
    router.push({
      pathname: router.route,
      query: { tab: router.query?.tab ? router.query?.tab : "all" },
    });
  }, []);

  const _ServerFetching = () => {
    const tabPage = router.query?.tab;
    Axios(
      "GET",
      `/api_web/Api_import/import/?csrf_protection=true`,
      {
        params: {
          search: keySearch,
          limit: limit,
          page: router.query?.page || 1,
          "filter[status_bar]": tabPage ?? null,
          "filter[id]": idCode != null ? idCode?.value : null,
          "filter[branch_id]": idBranch != null ? idBranch.value : null,
          "filter[supplier_id]": idSupplier ? idSupplier.value : null,
          "filter[start_date]":
            valueDate?.startDate != null ? valueDate?.startDate : null,
          "filter[end_date]":
            valueDate?.endDate != null ? valueDate?.endDate : null,
        },
      },
      (err, response) => {
        if (!err) {
          var { rResult, output, rTotal } = response.data;
          sData(rResult);
          sTotalItems(output);
          sDataExcel(rResult);
          sTotal(rTotal);
        }
        sOnFetching(false);
      }
    );
  };

  const _ServerFetching_group = () => {
    Axios(
      "GET",
      `/api_web/Api_import/filterBar/?csrf_protection=true`,
      {
        params: {
          limit: 0,
          search: keySearch,
          "filter[id]": idCode != null ? idCode?.value : null,
          "filter[branch_id]": idBranch != null ? idBranch.value : null,
          "filter[supplier_id]": idSupplier ? idSupplier.value : null,
          "filter[start_date]":
            valueDate?.startDate != null ? valueDate?.startDate : null,
          "filter[end_date]":
            valueDate?.endDate != null ? valueDate?.endDate : null,
        },
      },
      (err, response) => {
        if (!err) {
          var data = response.data;
          sListDs(data);
        }
        sOnFetching(false);
      }
    );
  };

  const _ServerFetching_filter = () => {
    Axios(
      "GET",
      `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`,
      {},
      (err, response) => {
        if (!err) {
          var { isSuccess, result } = response.data;
          sListBr(result);
        }
      }
    );
    Axios(
      "GET",
      "/api_web/api_supplier/supplier/?csrf_protection=true",
      {},
      (err, response) => {
        if (!err) {
          var db = response.data.rResult;
          sListSupplier(db?.map((e) => ({ label: e.name, value: e.id })));
        }
      }
    );
    Axios(
      "GET",
      "/api_web/Api_import/importCombobox/?csrf_protection=true",
      {},
      (err, response) => {
        if (!err) {
          var { isSuccess, result } = response?.data;
          sListCode(result);
        }
      }
    );
    sOnFetching_filter(false);
  };

  const _HandleSeachApi = (inputValue) => {
    Axios(
      "POST",
      `/api_web/Api_import/importCombobox/?csrf_protection=true`,
      {
        data: {
          term: inputValue,
        },
      },
      (err, response) => {
        if (!err) {
          var { isSuccess, result } = response?.data;
          sListCode(result);
        }
      }
    );
  };

  useEffect(() => {
    onFetching_filter && _ServerFetching_filter();
  }, [onFetching_filter]);

  useEffect(() => {
    (onFetching && _ServerFetching()) ||
      (onFetching && _ServerFetching_group());
  }, [onFetching]);

  useEffect(() => {
    (router.query.tab && sOnFetching(true)) ||
      (keySearch && sOnFetching(true)) ||
      (router.query?.tab && sOnFetching_filter(true)) ||
      (idBranch != null && sOnFetching(true)) ||
      (valueDate.startDate != null &&
        valueDate.endDate != null &&
        sOnFetching(true)) ||
      (idSupplier != null && sOnFetching(true)) ||
      (idCode != null && sOnFetching(true));
  }, [
    limit,
    router.query?.page,
    router.query?.tab,
    idBranch,
    valueDate.endDate,
    valueDate.startDate,
    idSupplier,
    idCode,
  ]);

  const formatNumber = (number) => {
    if (!number && number !== 0) return 0;
    const integerPart = Math.floor(number);
    const decimalPart = number - integerPart;
    const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
    const roundedNumber = integerPart + roundedDecimalPart;
    return roundedNumber.toLocaleString("en");
  };

  const _HandleOnChangeKeySearch = ({ target: { value } }) => {
    sKeySearch(value);
    router.replace({
      pathname: router.route,
      query: {
        tab: router.query?.tab,
      },
    });
    setTimeout(() => {
      if (!value) {
        sOnFetching(true);
      }
      sOnFetching(true);
    }, 500);
  };

  const paginate = (pageNumber) => {
    router.push({
      pathname: router.route,
      query: {
        tab: router.query?.tab,
        page: pageNumber,
      },
    });
  };

  const listBr_filter = listBr
    ? listBr?.map((e) => ({ label: e.name, value: e.id }))
    : [];
  const listCode_filter = lisCode
    ? lisCode?.map((e) => ({ label: `${e.code}`, value: e.id }))
    : [];

  const onchang_filter = (type, value) => {
    if (type == "branch") {
      sIdBranch(value);
    } else if (type == "date") {
      sValueDate(value);
    } else if (type == "supplier") {
      sIdSupplier(value);
    } else if (type == "code") {
      sIdCode(value);
    }
  };

  const multiDataSet = [
    {
      columns: [
        {
          title: "ID",
          width: { wch: 4 },
          style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } },
        },
        {
          title: `${dataLang?.import_day_vouchers || "import_day_vouchers"}`,
          width: { wpx: 100 },
          style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } },
        },
        {
          title: `${dataLang?.import_code_vouchers || "import_code_vouchers"}`,
          width: { wch: 40 },
          style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } },
        },
        {
          title: `${dataLang?.import_supplier || "import_supplier"}`,
          width: { wch: 40 },
          style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } },
        },
        {
          title: `${dataLang?.import_the_order || "import_the_order"}`,
          width: { wch: 40 },
          style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } },
        },
        {
          title: `${dataLang?.import_total_amount || "import_total_amount"}`,
          width: { wch: 40 },
          style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } },
        },
        {
          title: `${dataLang?.import_tax_money || "import_tax_money"}`,
          width: { wch: 40 },
          style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } },
        },
        {
          title: `${dataLang?.import_into_money || "import_into_money"}`,
          width: { wch: 40 },
          style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } },
        },
        {
          title: `${
            dataLang?.import_payment_status || "import_payment_status"
          }`,
          width: { wch: 40 },
          style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } },
        },
        {
          title: `${
            dataLang?.import_brow_storekeepers || "import_brow_storekeepers"
          }`,
          width: { wch: 40 },
          style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } },
        },
        {
          title: `${dataLang?.import_branch || "import_branch"}`,
          width: { wch: 40 },
          style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } },
        },
        {
          title: `${dataLang?.import_from_note || "import_from_note"}`,
          width: { wch: 40 },
          style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } },
        },
      ],
      data: dataExcel?.map((e) => [
        { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
        { value: `${e?.date ? e?.date : ""}` },
        { value: `${e?.code ? e?.code : ""}` },
        { value: `${e?.supplier_name ? e?.supplier_name : ""}` },
        { value: `${e?.purchase_order_code ? e?.purchase_order_code : ""}` },
        { value: `${e?.total_price ? formatNumber(e?.total_price) : ""}` },
        {
          value: `${
            e?.total_tax_price ? formatNumber(e?.total_tax_price) : ""
          }`,
        },
        { value: `${e?.total_amount ? formatNumber(e?.total_amount) : ""}` },
        {
          value: `${
            e?.status === "0"
              ? "Chưa thanh toán"
              : "" || e?.status === "1"
              ? "Thanh toán 1 phần"
              : "" || e?.status === "2"
              ? "Thanh toán đủ"
              : ""
          }`,
        },
        {
          value: `${
            e?.warehouseman_id === "0" ? "Chưa duyệt kho" : "Đã duyệt kho"
          }`,
        },
        { value: `${e?.branch_name ? e?.branch_name : ""}` },
        { value: `${e?.note ? e?.note : ""}` },
      ]),
    },
  ];

  const handleDelete = (event) => {
    Swal.fire({
      title: `${dataLang?.aler_ask}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#296dc1",
      cancelButtonColor: "#d33",
      confirmButtonText: `${dataLang?.aler_yes}`,
      cancelButtonText: `${dataLang?.aler_cancel}`,
    }).then((result) => {
      if (result.isConfirmed) {
        const id = event;
        Axios(
          "DELETE",
          `/api_web/api_inventory/inventory/${id}`,
          {},
          (err, response) => {
            if (!err) {
              var { isSuccess, message, data_export } = response.data;
              if (isSuccess) {
                Toast.fire({
                  icon: "success",
                  title: dataLang[message],
                });
              } else {
                Toast.fire({
                  icon: "error",
                  title: dataLang[message],
                });
                if (data_export?.length > 0) {
                  sData_export(data_export);
                }
              }
            }
            _ServerFetching();
          }
        );
      }
    });
  };
  const [data_export, sData_export] = useState([]);
  const [checkedWare, sCheckedWare] = useState({});
  const _HandleChangeInput = (id, checkedUn, type, value) => {
    if (type === "browser") {
      Swal.fire({
        title: `${"Thay đổi trạng thái"}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#296dc1",
        cancelButtonColor: "#d33",
        confirmButtonText: `${dataLang?.aler_yes}`,
        cancelButtonText: `${dataLang?.aler_cancel}`,
      }).then((result) => {
        if (result.isConfirmed) {
          const checked = value.target.checked;
          const warehousemanId = value.target.value;
          const dataChecked = {
            checked: checked,
            warehousemanId: warehousemanId,
            id: id,
            checkedpost: checkedUn,
          };
          sCheckedWare(dataChecked);
        }
        sData([...data]);
      });
    }
  };
  const _ServerSending = async () => {
    var data = new FormData();
    data.append(
      "warehouseman_id",
      checkedWare?.checkedpost != "0" ? checkedWare?.checkedpost : ""
    );
    data.append("id", checkedWare?.id);
    await Axios(
      "POST",
      `/api_web/api_import/ConfirmWarehous?csrf_protection=true`,
      {
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      },
      (err, response) => {
        if (!err) {
          var { isSuccess, message, data_export } = response.data;
          if (isSuccess) {
            Toast.fire({
              icon: "success",
              title: `${dataLang[message]}`,
            });
            setTimeout(() => {
              sOnFetching(true);
            }, 300);
          } else {
            Toast.fire({
              icon: "error",
              title: `${dataLang[message]}`,
            });
          }
          if (data_export?.length > 0) {
            sData_export(data_export);
          }
        }
        sOnSending(false);
      }
    );
  };
  useEffect(() => {
    onSending && _ServerSending();
  }, [onSending]);

  useEffect(() => {
    checkedWare.id != null && sOnSending(true);
  }, [checkedWare]);
  useEffect(() => {
    checkedWare.id != null && sOnSending(true);
  }, [checkedWare.id != null]);

  return (
    <React.Fragment>
      <Head>
        <title>{dataLang?.import_title || "import_title"} </title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
        {data_export.length > 0 && (
          <Popup_status
            className="hidden"
            data_export={data_export}
            dataLang={dataLang}
          />
        )}
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">
            {dataLang?.import_title || "import_title"}
          </h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{dataLang?.import_list || "import_list"}</h6>
        </div>

        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
              <div className="flex justify-between">
                <h2 className="text-2xl text-[#52575E] capitalize">
                  {dataLang?.import_list || "import_list"}
                </h2>
                <div className="flex justify-end items-center">
                  <Link
                    href="/purchase_order/import/form"
                    className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                  >
                    {dataLang?.purchase_order_new || "purchase_order_new"}
                  </Link>
                </div>
              </div>

              <div className="flex space-x-3 items-center  h-[8vh] justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                {listDs &&
                  listDs.map((e) => {
                    return (
                      <div>
                        <TabStatus
                          style={{
                            backgroundColor: "#e2f0fe",
                          }}
                          dataLang={dataLang}
                          key={e.id}
                          onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                          total={e.count}
                          active={e.id}
                          className={"text-[#0F4F9E] "}
                        >
                          {dataLang[e?.name] || e?.name}
                        </TabStatus>
                      </div>
                    );
                  })}
              </div>
              <div className="space-y-2 2xl:h-[91%] h-[92%] overflow-hidden">
                <div className="xl:space-y-3 space-y-2">
                  <div className="bg-slate-100 w-full rounded grid grid-cols-6 justify-between xl:p-3 p-2">
                    <div className="col-span-5">
                      <div className="grid grid-cols-5">
                        <div className="col-span-1">
                          <form className="flex items-center relative">
                            <IconSearch
                              size={20}
                              className="absolute 2xl:left-3 z-10  text-[#cccccc] xl:left-[4%] left-[1%]"
                            />
                            <input
                              className=" relative bg-white  outline-[#D0D5DD] focus:outline-[#0F4F9E]  2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5  py-2.5 rounded 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-full w-[100%]"
                              type="text"
                              onChange={_HandleOnChangeKeySearch.bind(this)}
                              placeholder={dataLang?.branch_search}
                            />
                          </form>
                        </div>
                        <div className="ml-1 col-span-1">
                          <Select
                            options={[
                              {
                                value: "",
                                label:
                                  dataLang?.purchase_order_branch ||
                                  "purchase_order_branch",
                                isDisabled: true,
                              },
                              ...listBr_filter,
                            ]}
                            onChange={onchang_filter.bind(this, "branch")}
                            value={idBranch}
                            placeholder={
                              dataLang?.purchase_order_table_branch ||
                              "purchase_order_table_branch"
                            }
                            hideSelectedOptions={false}
                            isClearable={true}
                            className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
                            isSearchable={true}
                            noOptionsMessage={() => "Không có dữ liệu"}
                            // components={{ MultiValue }}
                            closeMenuOnSelect={true}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              outline: "none",
                            }}
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
                              control: (base, state) => ({
                                ...base,
                                border: "none",
                                outline: "none",
                                boxShadow: "none",
                                ...(state.isFocused && {
                                  boxShadow: "0 0 0 1.5px #0F4F9E",
                                }),
                              }),
                            }}
                          />
                        </div>
                        <div className="ml-1 col-span-1">
                          <Select
                            onInputChange={_HandleSeachApi.bind(this)}
                            options={[
                              {
                                value: "",
                                label:
                                  dataLang?.purchase_order_vouchercode ||
                                  "purchase_order_vouchercode",
                                isDisabled: true,
                              },
                              ...listCode_filter,
                            ]}
                            onChange={onchang_filter.bind(this, "code")}
                            value={idCode}
                            placeholder={
                              dataLang?.purchase_order_table_code ||
                              "purchase_order_table_code"
                            }
                            hideSelectedOptions={false}
                            isClearable={true}
                            className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
                            isSearchable={true}
                            noOptionsMessage={() => "Không có dữ liệu"}
                            // components={{ MultiValue }}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              outline: "none",
                            }}
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
                              control: (base, state) => ({
                                ...base,
                                border: "none",
                                outline: "none",
                                boxShadow: "none",
                                ...(state.isFocused && {
                                  boxShadow: "0 0 0 1.5px #0F4F9E",
                                }),
                              }),
                            }}
                          />
                        </div>
                        <div className="ml-1 col-span-1">
                          <Select
                            //  options={listBr_filter}
                            options={[
                              {
                                value: "",
                                label:
                                  dataLang?.purchase_order_supplier ||
                                  "purchase_order_supplier",
                                isDisabled: true,
                              },
                              ...listSupplier,
                            ]}
                            onChange={onchang_filter.bind(this, "supplier")}
                            value={idSupplier}
                            placeholder={
                              dataLang?.purchase_order_table_supplier ||
                              "purchase_order_table_supplier"
                            }
                            hideSelectedOptions={false}
                            isClearable={true}
                            className="rounded-md bg-white   2xl:text-base xl:text-xs text-[10px]  z-20"
                            isSearchable={true}
                            noOptionsMessage={() => "Không có dữ liệu"}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              outline: "none",
                            }}
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
                              control: (base, state) => ({
                                ...base,
                                border: "none",
                                outline: "none",
                                boxShadow: "none",
                                ...(state.isFocused && {
                                  boxShadow: "0 0 0 1.5px #0F4F9E",
                                }),
                              }),
                            }}
                          />
                        </div>
                        <div className="z-20 ml-1 col-span-1">
                          <Datepicker
                            value={valueDate}
                            i18n={"vi"}
                            primaryColor={"blue"}
                            onChange={onchang_filter.bind(this, "date")}
                            showShortcuts={true}
                            displayFormat={"DD/MM/YYYY"}
                            configs={{
                              shortcuts: {
                                today: "Hôm nay",
                                yesterday: "Hôm qua",
                                past: (period) => `${period}  ngày qua`,
                                currentMonth: "Tháng này",
                                pastMonth: "Tháng trước",
                              },
                              footer: {
                                cancel: "Từ bỏ",
                                apply: "Áp dụng",
                              },
                            }}
                            className="react-datepicker__input-container 2xl:placeholder:text-xs xl:placeholder:text-xs placeholder:text-[8px]"
                            inputClassName="rounded-md w-full 2xl:p-2 xl:p-[11px] p-3 bg-white focus:outline-[#0F4F9E]  2xl:placeholder:text-xs xl:placeholder:text-xs placeholder:text-[8px] border-none  2xl:text-base xl:text-xs text-[10px]  focus:outline-none focus:ring-0 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="flex justify-end items-center gap-2">
                        <div>
                          {dataExcel?.length > 0 && (
                            <ExcelFile
                              filename="Danh sách nhập hàng"
                              title="SDNH"
                              element={
                                <button className="xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition">
                                  <IconExcel
                                    className="2xl:scale-100 xl:scale-100 scale-75"
                                    size={18}
                                  />
                                  <span>
                                    {dataLang?.client_list_exportexcel}
                                  </span>
                                </button>
                              }
                            >
                              <ExcelSheet
                                dataSet={multiDataSet}
                                data={multiDataSet}
                                name="Organization"
                              />
                            </ExcelFile>
                          )}
                        </div>
                        <div className="">
                          <div className="font-[300] text-slate-400 2xl:text-xs xl:text-sm text-[8px]">
                            {dataLang?.display}
                          </div>
                          <select
                            className="outline-none  text-[10px] xl:text-xs 2xl:text-sm"
                            onChange={(e) => sLimit(e.target.value)}
                            value={limit}
                          >
                            <option
                              className="text-[10px] xl:text-xs 2xl:text-sm hidden"
                              disabled
                            >
                              {limit == -1 ? "Tất cả" : limit}
                            </option>
                            <option
                              className="text-[10px] xl:text-xs 2xl:text-sm"
                              value={15}
                            >
                              15
                            </option>
                            <option
                              className="text-[10px] xl:text-xs 2xl:text-sm"
                              value={20}
                            >
                              20
                            </option>
                            <option
                              className="text-[10px] xl:text-xs 2xl:text-sm"
                              value={40}
                            >
                              40
                            </option>
                            <option
                              className="text-[10px] xl:text-xs 2xl:text-sm"
                              value={60}
                            >
                              60
                            </option>
                            {/* <option value={-1}>Tất cả</option> */}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2 w-[100%] lx:w-[120%] ">
                    <div className="grid grid-cols-12 items-center sticky top-0 bg-white p-2 z-10 shadow divide-x">
                      <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                        {dataLang?.import_day_vouchers || "import_day_vouchers"}
                      </h4>
                      <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                        {dataLang?.import_code_vouchers ||
                          "import_code_vouchers"}
                      </h4>
                      <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                        {dataLang?.import_supplier || "import_supplier"}
                      </h4>
                      <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                        {dataLang?.import_the_order || "import_the_order"}
                      </h4>
                      <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                        {dataLang?.import_total_amount || "import_total_amount"}
                      </h4>
                      <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                        {dataLang?.import_tax_money || "import_tax_money"}
                      </h4>
                      <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                        {dataLang?.import_into_money || "import_into_money"}
                      </h4>
                      <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                        {dataLang?.import_payment_status ||
                          "import_payment_status"}
                      </h4>
                      <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                        {dataLang?.import_brow_storekeepers ||
                          "import_brow_storekeepers"}
                      </h4>
                      <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                        {dataLang?.import_branch || "import_branch"}
                      </h4>
                      <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                        {dataLang?.import_action || "import_action"}
                      </h4>
                    </div>
                    {onFetching ? (
                      <Loading className="h-80" color="#0f4f9e" />
                    ) : data?.length > 0 ? (
                      <>
                        <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                          {data?.map((e) => (
                            // <div className='grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40 ' key={e.id.toString()}>
                            <div
                              className="grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40 "
                              key={e.id.toString()}
                            >
                              <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 col-span-1      font-medium  text-zinc-600  text-center">
                                {e?.date != null
                                  ? moment(e?.date).format("DD/MM/YYYY")
                                  : ""}
                              </h6>
                              <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2  font-medium text-center text-[#0F4F9E] hover:text-blue-600 transition-all ease-linear cursor-pointer ">
                                <Popup_chitiet
                                  dataLang={dataLang}
                                  className="text-left"
                                  name={e?.code}
                                  id={e?.id}
                                />
                              </h6>
                              <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2      font-medium  text-zinc-600  text-left">
                                {e.supplier_name}
                              </h6>
                              <h6 className="3xl:items-center 3xl-text-[18px] 2xl:text-[16px] xl:text-xs text-[8px]  col-span-1 flex items-center w-fit mx-auto">
                                <div className="mx-auto">
                                  <Popup_chitietThere
                                    // className='font-normal text-lime-500  rounded-xl py-1 px-2  bg-lime-200 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px] text-center i h-16 w-64 bg-gradient-to-br '
                                    className="i py-1 px-2 bg-gradient-to-br font-normal text-lime-500 bg-lime-200 items-center rounded-full shadow-2xl cursor-pointer 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]  overflow-hidden transform hover:scale-110 transition duration-300 ease-out hover:bg-lime-500 hover:text-white"
                                    // className='b animate-pulse i py-1 px-2  text-lime-500 bg-lime-200 items-center rounded-2xl shadow-2xl cursor-pointer overflow-hidden xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px] transform hover:scale-x-110 hover:scale-y-105 transition duration-300 ease-out'
                                    name={e?.purchase_order_code}
                                    dataLang={dataLang}
                                    id={e?.purchase_order_id}
                                    type={"typePo"}
                                  ></Popup_chitietThere>
                                  {/* <span className='flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  bg-lime-200 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px] text-center'>{e?.purchase_order_code}</span> */}
                                </div>
                              </h6>
                              <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2      font-medium  text-zinc-600 col-span-1 text-right">
                                {formatNumber(e.total_price)}
                              </h6>
                              <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2      font-medium  text-zinc-600 col-span-1 text-right">
                                {formatNumber(e.total_tax_price)}
                              </h6>
                              <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2      font-medium  text-zinc-600 col-span-1 text-right">
                                {formatNumber(e.total_amount)}
                              </h6>
                              <h6 className="3xl:items-center 3xl-text-[18px] 2xl:text-[16px]      font-medium  text-zinc-600 xl:text-xs text-[8px]  col-span-2 flex items-center  mx-auto">
                                <div className="mx-auto">
                                  {(e?.status_pay === "not_spent" && (
                                    <span className=" font-normal text-sky-500  rounded-xl py-1 px-[19px]  bg-sky-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                      {"Chưa chi"}
                                    </span>
                                  )) ||
                                    (e?.status_pay === "spent_part" && (
                                      <span className=" font-normal text-orange-500 rounded-xl py-1 px-2   bg-orange-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                        {"Chi 1 phần"}{" "}
                                        {`(${formatNumber(e?.amount_paid)})`}
                                      </span>
                                    )) ||
                                    (e?.status_pay === "spent" && (
                                      <span className="flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2   bg-lime-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]  justify-center">
                                        <TickCircle
                                          className="bg-lime-500 rounded-full"
                                          color="white"
                                          size={15}
                                        />
                                        {"Đã chi đủ"}
                                      </span>
                                    ))}
                                </div>
                              </h6>
                              <h6 className=" 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] col-span-1 cursor-pointer">
                                <div
                                  className={`${
                                    e?.warehouseman_id == "0"
                                      ? "bg-[#eff6ff]  transition-all bg-gradient-to-l from-[#eff6ff]  via-[#c7d2fe] to-[#dbeafe] btn-animation "
                                      : "bg-lime-100  transition-all bg-gradient-to-l from-lime-100  via-[#f7fee7] to-[#d9f99d] btn-animation "
                                  } rounded-md cursor-pointer hover:scale-105 ease-in-out transition-all`}
                                >
                                  <div className="flex items-center justify-center">
                                    <label
                                      className="relative flex cursor-pointer items-center rounded-full p-2"
                                      htmlFor={e.id}
                                      data-ripple-dark="true"
                                    >
                                      <input
                                        type="checkbox"
                                        className={`${
                                          e?.warehouseman_id == "0"
                                            ? "checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500"
                                            : "checked:border-lime-500 checked:bg-lime-500 border-lime-500 checked:before:bg-limborder-lime-500"
                                        }before:content[''] peer relative 2xl:h-5 2xl:w-5 h-4 w-4 cursor-pointer appearance-none 2xl:rounded-md rounded border-gray-400 border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity  hover:before:opacity-10`}
                                        id={e.id}
                                        value={e.warehouseman_id}
                                        checked={
                                          e.warehouseman_id != "0"
                                            ? true
                                            : false
                                        }
                                        onChange={_HandleChangeInput.bind(
                                          this,
                                          e?.id,
                                          e?.warehouseman_id,
                                          "browser"
                                        )}
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
                                      htmlFor={e.id}
                                      className={`${
                                        e?.warehouseman_id == "0"
                                          ? "text-[#6366f1]"
                                          : "text-lime-500"
                                      }  3xl:text-[14px] 2xl:text-[10px] xl:text-[10px] text-[8px] font-medium cursor-pointer`}
                                    >
                                      {e?.warehouseman_id == "0"
                                        ? "Chưa duyệt kho"
                                        : "Đã duyệt kho"}
                                    </label>
                                  </div>
                                </div>
                              </h6>
                              <h6 className="col-span-1 w-fit ">
                                <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase ml-2">
                                  {e?.branch_name}
                                </div>
                              </h6>
                              <div className="col-span-1 flex justify-center">
                                <BtnTacVu
                                  type="import"
                                  onRefresh={_ServerFetching.bind(this)}
                                  onRefreshGroup={_ServerFetching_group.bind(
                                    this
                                  )}
                                  dataLang={dataLang}
                                  warehouseman_id={e?.warehouseman_id}
                                  status_pay={e?.status_pay}
                                  id={e?.id}
                                  className="bg-slate-100  hover:scale-105 transition-all ease-linear hover:bg-gray-200 xl:px-4 px-3 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[8px]"
                                />
                              </div>
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
                          <div className="flex items-center justify-around mt-6 "></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 bg-gray-100 items-center">
              <div className="col-span-4 p-2 text-center">
                <h3 className="uppercase      font-medium  text-zinc-600 3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-[9px]">
                  {dataLang?.import_total || "import_total"}
                </h3>
              </div>
              <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                <h3 className="     font-medium  text-zinc-600 3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-[9px] ">
                  {formatNumber(total?.total_price)}
                </h3>
              </div>
              <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap ">
                <h3 className="     font-medium  text-zinc-600 3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-[9px]">
                  {formatNumber(total?.total_tax_price)}
                </h3>
              </div>
              <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                <h3 className="     font-medium  text-zinc-600 3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-[9px]">
                  {formatNumber(total?.total_amount)}
                </h3>
              </div>
            </div>
            {data?.length != 0 && (
              <div className="flex space-x-5 items-center">
                <h6 className="">
                  {dataLang?.display} {totalItems?.iTotalDisplayRecords}{" "}
                  {dataLang?.among} {totalItems?.iTotalRecords}{" "}
                  {dataLang?.ingredient}
                </h6>
                <Pagination
                  postsPerPage={limit}
                  totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                  paginate={paginate}
                  currentPage={router.query?.page || 1}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const TabStatus = React.memo((props) => {
  const router = useRouter();
  return (
    <button
      style={props.style}
      onClick={props.onClick}
      className={`${props.className} justify-center min-w-[180px] flex gap-2 2xl:text-sm xl:text-sm text-xs items-center rounded-[5.5px] px-2 py-2 outline-none relative `}
    >
      {router.query?.tab === `${props.active}` && (
        <ArrowCircleDown size="20" color="#0F4F9E" />
      )}
      {props.children}
      <span
        className={`${
          props?.total > 0 &&
          "absolute min-w-[29px] top-0 right-0 bg-[#ff6f00] text-xs translate-x-2.5 -translate-y-2 text-white rounded-[100%] px-2 text-center items-center flex justify-center py-1.5"
        } `}
      >
        {props?.total > 0 && props?.total}
      </span>
    </button>
  );
});

const BtnTacVu = React.memo((props) => {
  const [openTacvu, sOpenTacvu] = useState(false);
  const _ToggleModal = (e) => sOpenTacvu(e);

  const [openDetail, sOpenDetail] = useState(false);
  const router = useRouter();

  const _HandleDelete = (id) => {
    Swal.fire({
      title: `${props.dataLang?.aler_ask}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#296dc1",
      cancelButtonColor: "#d33",
      confirmButtonText: `${props.dataLang?.aler_yes}`,
      cancelButtonText: `${props.dataLang?.aler_cancel}`,
    }).then((result) => {
      if (result.isConfirmed) {
        Axios(
          "DELETE",
          `/api_web/Api_import/import/${id}?csrf_protection=true`,
          {},
          (err, response) => {
            if (!err) {
              console.log(response.data);
              var { isSuccess, message } = response.data;
              if (isSuccess) {
                Toast.fire({
                  icon: "success",
                  title: props.dataLang[message],
                });
                props.onRefresh && props.onRefresh();
                props.onRefreshGroup && props.onRefreshGroup();
              } else {
                Toast.fire({
                  icon: "error",
                  title: props.dataLang[message],
                });
              }
            }
          }
        );
      }
    });
  };

  const handleClick = () => {
    if (props?.warehouseman_id != "0" || props?.status_pay != "not_spent") {
      Toast.fire({
        icon: "error",
        title: `${
          (props?.warehouseman_id != "0" &&
            props.dataLang?.warehouse_confirmed_cant_edit) ||
          (props?.status_pay != "not_spent" &&
            (props.dataLang?.paid_cant_edit || "paid_cant_edit"))
        }`,
      });
    } else {
      router.push(`/purchase_order/import/form?id=${props.id}`);
    }
  };

  return (
    <div>
      <Popup
        trigger={
          <button className={`flex space-x-1 items-center ` + props.className}>
            <span>{props.dataLang?.purchase_action || "purchase_action"}</span>
            <IconDown size={12} />
          </button>
        }
        arrow={false}
        position="bottom right"
        className={`dropdown-edit `}
        keepTooltipInside={props.keepTooltipInside}
        closeOnDocumentClick
        nested
        onOpen={_ToggleModal.bind(this, true)}
        onClose={_ToggleModal.bind(this, false)}
      >
        <div className="w-auto rounded">
          <div className="bg-white rounded-t flex flex-col overflow-hidden">
            {/* <div className='group transition-all ease-in-out flex items-center justify-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded  w-full'>
                          <BiEdit size={20} className='group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md '/>
                          <button
                          onClick={handleClick}
                          className=" hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full 2xl:text-sm xl:text-sm text-[8px]">{props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}</button>
                        </div> */}
            <button
              onClick={handleClick}
              className="group transition-all ease-in-out flex items-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
            >
              <BiEdit
                size={20}
                className="group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md "
              />
              <p className="group-hover:text-sky-500">
                {props.dataLang?.purchase_order_table_edit ||
                  "purchase_order_table_edit"}
              </p>
            </button>
            <div className=" transition-all ease-in-out flex items-center gap-2 group  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5  rounded py-2.5 w-full">
              <VscFilePdf
                size={20}
                className="group-hover:text-[#65a30d] group-hover:scale-110 group-hover:shadow-md "
              />
              <Popup_Pdf
                type={props.type}
                props={props}
                id={props.id}
                dataLang={props.dataLang}
                className="group-hover:text-[#65a30d] "
              />
            </div>
            <button
              onClick={_HandleDelete.bind(this, props.id)}
              className="group transition-all ease-in-out flex items-center justify-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
            >
              <RiDeleteBin6Line
                size={20}
                className="group-hover:text-[#f87171] group-hover:scale-110 group-hover:shadow-md "
              />
              <p className="group-hover:text-[#f87171]">
                {props.dataLang?.purchase_order_table_delete ||
                  "purchase_order_table_delete"}
              </p>
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
});

const Popup_Pdf = (props) => {
  const scrollAreaRef = useRef(null);
  const [open, sOpen] = useState(false);
  const _ToggleModal = (e) => sOpen(e);
  const [data, sData] = useState();
  const [onFetching, sOnFetching] = useState(false);

  useEffect(() => {
    props?.id && sOnFetching(true);
    props?.id && _ServerFetching();
  }, [open]);

  const [dataPDF, setData] = useState();
  const [dataCompany, setDataCompany] = useState();

  const fetchDataSettingsCompany = async () => {
    if (props?.id) {
      await Axios(
        "GET",
        `/api_web/Api_setting/CompanyInfo?csrf_protection=true`,
        {},
        (err, response) => {
          if (!err) {
            var { data } = response.data;
            setDataCompany(data);
          }
        }
      );
    }
    if (props?.id) {
      await Axios(
        "GET",
        `/api_web/Api_import/import/${props?.id}?csrf_protection=true`,
        {},
        (err, response) => {
          if (!err) {
            var db = response.data;
            setData(db);
          }
        }
      );
    }
  };
  useEffect(() => {
    open && fetchDataSettingsCompany();
  }, [open]);

  const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
  const [dataProductExpiry, sDataProductExpiry] = useState({});
  const [dataProductSerial, sDataProductSerial] = useState({});

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

  return (
    <>
      <PopupEdit
        title={props.dataLang?.option_prin || "option_prin"}
        button={props.dataLang?.btn_table_print || "btn_table_print"}
        onClickOpen={_ToggleModal.bind(this, true)}
        open={open}
        onClose={_ToggleModal.bind(this, false)}
        classNameBtn={props?.className}
      >
        <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
        <div className="space-x-5 w-[400px] h-auto">
          <div>
            <div className="w-[400px]">
              <FilePDF
                props={props}
                openAction={open}
                setOpenAction={sOpen}
                dataCompany={dataCompany}
                data={dataPDF}
                dataMaterialExpiry={dataMaterialExpiry}
                dataProductExpiry={dataProductExpiry}
                dataProductSerial={dataProductSerial}
              />
            </div>
          </div>
        </div>
      </PopupEdit>
    </>
  );
};

const Popup_chitiet = (props) => {
  const scrollAreaRef = useRef(null);
  const [open, sOpen] = useState(false);
  const _ToggleModal = (e) => sOpen(e);
  const [data, sData] = useState();
  const [onFetching, sOnFetching] = useState(false);

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

  const _ServerFetching_detailOrder = () => {
    Axios(
      "GET",
      `/api_web/Api_import/import/${props?.id}?csrf_protection=true`,
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
    (onFetching && _ServerFetching_detailOrder()) ||
      (onFetching && _ServerFetching());
  }, [open]);

  // const scrollableDiv = document.querySelector('.customsroll');
  // scrollableDiv?.addEventListener('wheel', (event) => {
  //   const deltaY = event.deltaY;
  //   const top = scrollableDiv.scrollTop;
  //   const height = scrollableDiv.scrollHeight;
  //   const offset = scrollableDiv.offsetHeight;
  //   const isScrolledToTop = top === 0;
  //   const isScrolledToBottom = top === height - offset;

  //   if ((deltaY < 0 && isScrolledToTop) || (deltaY > 0 && isScrolledToBottom)) {
  //     event.preventDefault();
  //   }
  // });

  const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
  const [dataProductExpiry, sDataProductExpiry] = useState({});
  const [dataProductSerial, sDataProductSerial] = useState({});

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

  return (
    <>
      <PopupEdit
        title={props.dataLang?.import_detail_title || "import_detail_title"}
        button={props?.name}
        onClickOpen={_ToggleModal.bind(this, true)}
        open={open}
        onClose={_ToggleModal.bind(this, false)}
        classNameBtn={props?.className}
      >
        <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
        {/* <div className="mt-4 space-x-5 w-[999px] 2xl:h-[550px] xl:h-[750px] h-[700px] customsroll overflow-hidden  3xl:h-auto 2xl:scrollbar-thin 2xl:scrollbar-thumb-slate-300 2xl:scrollbar-track-slate-100">         */}
        {/* <div className="mt-4 space-x-5 w-[999px]">         */}
        {/* <div className="mt-4 space-x-5 w-[999px] 2xl:h-[750px] xl:h-[750px] h-[700px] 2xl:max-h-[750px] max-h-[600px] 2xl:overflow-visible xl:overflow-y-auto overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">         */}
        <div className=" space-x-5 3xl:w-[1250px] 2xl:w-[1100px] w-[1050px] 3xl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">
          <div>
            <div className="3xl:w-[1250px] 2xl:w-[1100px] w-[1050px]">
              <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                <h2 className="font-normal bg-[#ECF0F4] p-2 text-[13px]">
                  {props.dataLang?.import_detail_info || "import_detail_info"}
                </h2>
                <div className="grid grid-cols-9  min-h-[130px] px-2">
                  <div className="col-span-3">
                    <div className="my-4 font-semibold grid grid-cols-2">
                      <h3 className=" text-[13px] ">
                        {props.dataLang?.import_day_vouchers ||
                          "import_day_vouchers"}
                      </h3>
                      <h3 className=" text-[13px]  font-medium">
                        {data?.date != null
                          ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss")
                          : ""}
                      </h3>
                    </div>
                    <div className="my-4 font-semibold grid grid-cols-2">
                      <h3 className=" text-[13px] ">
                        {props.dataLang?.import_code_vouchers ||
                          "import_code_vouchers"}
                      </h3>
                      <h3 className=" text-[13px]  font-medium text-blue-600">
                        {data?.code}
                      </h3>
                    </div>
                    <div className="my-4 font-semibold grid grid-cols-2">
                      <h3 className=" text-[13px] ">
                        {props.dataLang?.import_the_order || "import_the_order"}
                      </h3>
                      <h3 className=" text-[13px]  text-center font-medium text-lime-500  rounded-xl py-1 px-3 max-w-[100px] min-w-[70px]  bg-lime-200 ">
                        {data?.purchase_order_code}
                      </h3>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <div className="my-4 font-medium grid grid-cols-2">
                      <h3 className=" text-[13px] ">
                        {props.dataLang?.import_payment_status ||
                          "import_payment_status"}
                      </h3>
                      <div className="flex flex-wrap  gap-2 items-center justify-center">
                        {(data?.status_pay === "not_spent" && (
                          <span className=" font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px]  bg-sky-200 text-center text-[13px]">
                            {"Chưa chi"}
                          </span>
                        )) ||
                          (data?.status_pay === "spent_part" && (
                            <span className=" font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px]  bg-orange-200 text-center text-[13px]">
                              {"Chi 1 phần"}{" "}
                              {`(${formatNumber(data?.amount_paid)})`}
                            </span>
                          )) ||
                          (data?.status_pay === "spent" && (
                            <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200 text-center text-[13px]">
                              <TickCircle
                                className="bg-lime-500 rounded-full"
                                color="white"
                                size={15}
                              />
                              {"Đã chi đủ"}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div className="my-4 font-medium grid grid-cols-2">
                      <h3 className=" text-[13px] ">
                        {props.dataLang?.import_from_browse ||
                          "import_from_browse"}
                      </h3>
                      <div className="flex flex-wrap  gap-2 items-center justify-center">
                        {(data?.warehouseman_id === "0" && (
                          <span className=" font-normal text-[#3b82f6]  rounded-xl py-1 px-2 min-w-[135px]  bg-[#bfdbfe] text-center text-[13px]">
                            {"Chưa duyệt kho"}
                          </span>
                        )) ||
                          (data?.warehouseman_id != "0" && (
                            <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200 text-center text-[13px]">
                              <TickCircle
                                className="bg-lime-500 rounded-full"
                                color="white"
                                size={15}
                              />
                              {"Đã duyệt kho"}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 ">
                    <div className="my-4 font-medium grid grid-cols-2">
                      <h3 className="text-[13px]">
                        {props.dataLang?.import_supplier || "import_supplier"}
                      </h3>
                      <h3 className="text-[13px] font-normal">
                        {data?.supplier_name}
                      </h3>
                    </div>
                    <div className="my-4 font-medium grid grid-cols-2">
                      <h3 className="text-[13px]">
                        {props.dataLang?.import_branch || "import_branch"}
                      </h3>
                      <h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">
                        {data?.branch_name}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="pr-2 w-[100%] lx:w-[110%] ">
                  {/* <div className={`${dataProductSerial.is_enable == "1" ? 
                    (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-12" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-12" :"grid-cols-10" ) :
                     (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-11" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-11" :"grid-cols-9") ) }  grid sticky top-0 bg-white shadow-lg  z-10`}> */}
                  <div
                    className={`grid-cols-13  grid sticky top-0 bg-white shadow-lg  z-10`}
                  >
                    <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                      {props.dataLang?.import_detail_image ||
                        "import_detail_image"}
                    </h4>
                    <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-2 text-center whitespace-nowrap">
                      {props.dataLang?.import_detail_items ||
                        "import_detail_items"}
                    </h4>
                    <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                      {props.dataLang?.import_detail_variant ||
                        "import_detail_variant"}
                    </h4>
                    <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                      {"Kho - VTK"}
                    </h4>
                    <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                      {"ĐVT"}
                    </h4>
                    <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                      {props.dataLang?.import_from_quantity ||
                        "import_from_quantity"}
                    </h4>
                    <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                      {props.dataLang?.import_from_unit_price ||
                        "import_from_unit_price"}
                    </h4>
                    <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                      {"% CK"}
                    </h4>
                    <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                      {props.dataLang?.import_from_price_affter ||
                        "import_from_price_affter"}
                    </h4>
                    <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                      {props.dataLang?.import_from_tax || "import_from_tax"}
                    </h4>
                    <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                      {props.dataLang?.import_into_money || "import_into_money"}
                    </h4>
                    <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                      {props.dataLang?.import_from_note || "import_from_note"}
                    </h4>
                  </div>
                  {onFetching ? (
                    <Loading className="max-h-28" color="#0f4f9e" />
                  ) : data?.items?.length > 0 ? (
                    <>
                      <ScrollArea
                        className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"
                        speed={1}
                        smoothScrolling={true}
                      >
                        <div className="divide-y divide-slate-200 min:h-[170px]  max:h-[170px]">
                          {data?.items?.map((e) => (
                            // <div className={`${dataProductSerial.is_enable == "1" ?
                            // (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-12" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-12" :"grid-cols-10" ) :
                            // (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-11" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-11" :"grid-cols-9") ) }  grid hover:bg-slate-50 `} key={e.id?.toString()}>
                            <div
                              className="grid grid-cols-13 hover:bg-slate-50 items-center border-b"
                              key={e.id?.toString()}
                            >
                              <h6 className="text-[13px]   py-0.5 col-span-1 text-center">
                                {e?.item?.images != null ? (
                                  <ModalImage
                                    small={e?.item?.images}
                                    large={e?.item?.images}
                                    alt="Product Image"
                                    className="custom-modal-image object-cover rounded w-[50px] h-[60px] mx-auto"
                                  />
                                ) : (
                                  <div className="w-[50px] h-[60px] object-cover  mx-auto">
                                    <ModalImage
                                      small="/no_img.png"
                                      large="/no_img.png"
                                      className="w-full h-full rounded object-contain p-1"
                                    >
                                      {" "}
                                    </ModalImage>
                                  </div>
                                )}
                              </h6>
                              <h6 className="text-[13px]  px-2 py-0.5 col-span-2 text-left">
                                <h6 className="font-medium">{e?.item?.name}</h6>
                                <div className="flex-col items-center font-oblique flex-wrap">
                                  {dataProductSerial.is_enable === "1" ? (
                                    <div className="flex gap-0.5">
                                      <h6 className="text-[12px]">Serial:</h6>
                                      <h6 className="text-[12px]  px-2   w-[full] text-left ">
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
                                      <div className="flex gap-0.5">
                                        <h6 className="text-[12px]">Lot:</h6>{" "}
                                        <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                          {e.lot == null || e.lot == ""
                                            ? "-"
                                            : e.lot}
                                        </h6>
                                      </div>
                                      <div className="flex gap-0.5">
                                        <h6 className="text-[12px]">
                                          Hạn sử dụng:
                                        </h6>{" "}
                                        <h6 className="text-[12px]  px-2   w-[full] text-center ">
                                          {e.expiration_date
                                            ? moment(e.expiration_date).format(
                                                "DD/MM/YYYY"
                                              )
                                            : "-"}
                                        </h6>
                                      </div>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </h6>
                              <h6 className="text-[13px] font-medium   px-2 py-0.5 col-span-1 text-center break-words">
                                {e?.item?.product_variation}
                              </h6>
                              <h6 className="text-[13px] font-medium   px-2 py-0.5 col-span-1 text-left break-words">{`${e?.warehouse_name}-${e.location_name}`}</h6>
                              <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center break-words">
                                {e?.item?.unit_name}
                              </h6>
                              <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center mr-1">
                                {formatNumber(e?.quantity)}
                              </h6>
                              <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                {formatNumber(e?.price)}
                              </h6>
                              <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                {e?.discount_percent + "%"}
                              </h6>
                              <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                {formatNumber(e?.price_after_discount)}
                              </h6>
                              <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                {formatNumber(e?.tax_rate) + "%"}
                              </h6>
                              <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-right ">
                                {formatNumber(e?.amount)}
                              </h6>
                              <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-left ml-3.5">
                                {e?.note != undefined ? e?.note : ""}
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
                <h2 className="font-medium p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
                  {props.dataLang?.purchase_total || "purchase_total"}
                </h2>
                <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                  <div className="col-span-7">
                    <h3 className="text-[13px] p-1 font-semibold">
                      {props.dataLang?.import_from_note || "import_from_note"}
                    </h3>
                    <textarea
                      className="resize-none text-[13px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[90px] max-h-[90px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-medium p-1 outline-none "
                      disabled
                      value={data?.note}
                    />
                  </div>
                  <div className="col-span-2 space-y-1 text-right">
                    <div className="font-semibold text-left text-[13px]">
                      <h3>
                        {props.dataLang?.import_detail_total_amount ||
                          "import_detail_total_amount"}
                      </h3>
                    </div>
                    <div className="font-semibold text-left text-[13px]">
                      <h3>
                        {props.dataLang?.import_detail_discount ||
                          "import_detail_discount"}
                      </h3>
                    </div>
                    <div className="font-semibold text-left text-[13px]">
                      <h3>
                        {props.dataLang?.import_detail_affter_discount ||
                          "import_detail_affter_discount"}
                      </h3>
                    </div>
                    <div className="font-semibold text-left text-[13px]">
                      <h3>
                        {props.dataLang?.import_detail_tax_money ||
                          "import_detail_tax_money"}
                      </h3>
                    </div>
                    <div className="font-semibold text-left text-[13px]">
                      <h3>
                        {props.dataLang?.import_detail_into_money ||
                          "import_detail_into_money"}
                      </h3>
                    </div>
                  </div>
                  <div className="col-span-3 space-y-1 text-right">
                    <div className="font-medium mr-2.5">
                      <h3 className="text-right text-blue-600 text-[13px]">
                        {formatNumber(data?.total_price)}
                      </h3>
                    </div>
                    <div className="font-medium mr-2.5">
                      <h3 className="text-right text-blue-600 text-[13px]">
                        {formatNumber(data?.total_discount)}
                      </h3>
                    </div>
                    <div className="font-medium mr-2.5">
                      <h3 className="text-right text-blue-600 text-[13px]">
                        {formatNumber(data?.total_price_after_discount)}
                      </h3>
                    </div>
                    <div className="font-medium mr-2.5">
                      <h3 className="text-right text-blue-600 text-[13px]">
                        {formatNumber(data?.total_tax)}
                      </h3>
                    </div>
                    <div className="font-medium mr-2.5">
                      <h3 className="text-right text-blue-600 text-[13px]">
                        {formatNumber(data?.total_amount)}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopupEdit>
    </>
  );
};

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

export default Index;
