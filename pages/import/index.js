import React, { useState, useRef, useEffect, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { _ServerInstance as Axios } from "/services/axios";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});

import ReactExport from "react-data-export";

import Swal from "sweetalert2";

import * as XLSX from "xlsx";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import { NumericFormat } from "react-number-format";

import {
  Edit as IconEdit,
  Grid6 as IconExcel,
  Trash as IconDelete,
  SearchNormal1 as IconSearch,
  Add as IconAdd,
  LocationTick,
  User,
  Add,
  ArrowCircleDown,
  FilterRemove,
  ArrowRight,
  RefreshCircle,
  ColorsSquare,
  Colorfilter,
} from "iconsax-react";
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import Pagination from "/components/UI/pagination";
import dynamic from "next/dynamic";
import moment from "moment/moment";
import Select, { components } from "react-select";
import Popup from "reactjs-popup";
import { data } from "autoprefixer";
import TabFilter from "components/UI/TabFilter";

import { TiTick } from "react-icons/ti";

import { getData } from "components/UI/dataExcel";
import { Joan } from "@next/font/google";

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
  const tabPage = router.query?.tab;
  const hiRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const handleMenuOpen = () => {
    const menuPortalTarget = scrollAreaRef.current;
    return { menuPortalTarget };
  };
  const dataExcel = getData();

  const _HandleSelectTab = (e) => {
    router.push({
      pathname: router.route,
      query: { tab: e },
    });
  };

  useEffect(() => {
    router.push({
      pathname: router.route,
      query: { tab: router.query?.tab ? router.query?.tab : 1 },
    });
  }, []);

  const [valueCheck, sValueCheck] = useState("add");
  const [condition_column, sCondition_column] = useState(null);

  const [errValueCheck, sErrValueCheck] = useState(false);

  const [dataImport, sDataImport] = useState([]);

  const [onFetching, sOnFetching] = useState(false);
  const [onSending, sOnSending] = useState(false);
  const [onLoading, sOnLoading] = useState(false);
  const [onLoadingListData, sOnLoadingListData] = useState(false);
  const [onLoadingDataBack, sOnLoadingDataBack] = useState(false);

  const [errFiles, sErrFiles] = useState(false);
  const [errColumn, sErrColumn] = useState(false);
  const [errRowStart, sErrRowStart] = useState(false);
  const [errEndRow, sErrEndRow] = useState(false);

  const [errFileImport, sErrFileImport] = useState(false);

  const [row_tarts, sRow_starts] = useState(null);
  const [end_row, sEnd_row] = useState(null);

  const [dataClient, sDataClient] = useState([]);
  const [dataColumn, sDataColumn] = useState([]);
  const [dataConditionColumn, sDataConditionColumn] = useState([]);
  const [dataSampleImport, sDataSampleImport] = useState([]);
  const [save_template, sSave_template] = useState(null);
  const [sampleImport, sSampleImport] = useState(null);

  const [dataFail, sDataFail] = useState([]);
  const [totalFalse, sTotalFalse] = useState(null);

  const [dataSuccess, sDataSuccess] = useState(0);

  const [listData, sListData] = useState([]);
  const [listDataContact, sListDataContat] = useState([]);

  const [multipleProgress, sMultipleProgress] = useState(0);
  const [fileImport, sFileImport] = useState(null);

  const [stepper, sStepper] = useState({
    main: false,
    extra: false,
  });

  const _ServerFetching = () => {
    sOnLoading(true);

    const apiDataFields = {
      1: "/api_web/Api_import_data/get_field_client?csrf_protection=true",
      2: "/api_web/Api_import_data/get_field_suppliers?csrf_protection=true",
      3: "/api_web/Api_import_data/get_field_materials?csrf_protection=true",
      4: "",
      5: "",
    };

    const apiUrls = apiDataFields[tabPage] || "";
    Axios("GET", `${apiUrls}`, {}, (err, response) => {
      if (!err) {
        var db = response.data;
        sDataClient(
          db?.map((e) => ({ label: dataLang[e?.label], value: e?.value }))
        );
      }
      sOnLoading(false);
    });

    const apiDataComlumn = {
      1: "/api_web/Api_import_data/get_colums_excel?csrf_protection=true",
      2: "/api_web/Api_import_data/get_colums_excel?csrf_protection=true",
      3: "/api_web/Api_import_data/get_colums_excel?csrf_protection=true",
      4: "",
      5: "",
    };

    const apiUrlComLumn = apiDataComlumn[tabPage] || "";
    Axios("GET", `${apiUrlComLumn}`, {}, (err, response) => {
      if (!err) {
        var db = response.data;
        sDataColumn(db?.map((e) => ({ label: e, value: e })));
      }
      sOnLoading(false);
    });

    const apiDataConditionColumn = {
      1: "/api_web/Api_import_data/get_field_isset?csrf_protection=true",
      2: "/api_web/Api_import_data/get_field_isset_suppliers?csrf_protection=true",
      3: "/api_web/Api_import_data/get_field_isset_materials?csrf_protection=true",
      4: "",
      5: "",
    };

    const apiUrlConditionColumn = apiDataConditionColumn[tabPage] || "";
    Axios("GET", `${apiUrlConditionColumn}`, {}, (err, response) => {
      if (!err) {
        var db = response.data;
        sDataConditionColumn(
          db?.map((e) => ({
            label: dataLang[e?.label] || e?.label,
            value: e?.value,
          }))
        );
      }
      sOnLoading(false);
    });

    const apiDataSampleImport = {
      1: "/api_web/Api_import_data/get_template_import?csrf_protection=true",
      2: "/api_web/Api_import_data/get_template_import?csrf_protection=true",
      3: "/api_web/Api_import_data/get_template_import?csrf_protection=true",
      4: "",
      5: "",
    };

    const apiUrlSampleImport = apiDataSampleImport[tabPage] || "";

    Axios(
      "GET",
      `${apiUrlSampleImport}`,
      {
        params: {
          tab: tabPage,
        },
      },
      (err, response) => {
        if (!err) {
          var db = response.data;
          sDataSampleImport(
            db?.map((e) => ({
              label: e?.code,
              value: e?.id,
              date: moment(e?.date_create).format("DD/MM/YYYY"),
              setup_colums: e?.setup_colums,
            }))
          );
        }
        sOnLoading(false);
      }
    );
    sOnFetching(false);
  };

  useEffect(() => {
    onFetching && _ServerFetching();
  }, [onFetching]);

  useEffect(() => {
    router.query.tab && sOnFetching(true);
    router.query.tab && sListData([]);
    router.query.tab && sSampleImport(null);
    router.query.tab && sOnLoading(true);
    router.query.tab && sValueCheck("add");
    router.query.tab && sCondition_column(null);
    router.query.tab && sOnLoadingDataBack(false);
    if (router.query.tab) {
      const inputElement = document.getElementById("importFile");
      inputElement.value = "";
    }
    router.query.tab && sFileImport(null);
  }, [router.query?.page, router.query?.tab]);

  //   const _HandleChangeFileImport = (e) => {
  //     const file = e.target.files[0];
  //     const reader = new FileReader();
  //     reader.readAsBinaryString(file)
  //     // reader.onload = (e) =>{
  //     //   const data = e.target.result;
  //     //   const workbook = XLSX.read(data, {type: "binary"})
  //     //   const SheetNames = workbook.SheetNames[0]
  //     //   const Sheet = workbook.Sheets[SheetNames]
  //     //   const partData = XLSX.utils.sheet_to_json(Sheet)
  //     //   sDataImport(partData)
  //     // }
  //     reader.onload = (e) => {
  //       const data = e.target.result;
  //       const workbook = XLSX.read(data, {type: "binary"});
  //       const sheetName = workbook.SheetNames[0];
  //       const sheet = workbook.Sheets[sheetName];
  //       const jsonData = [];
  //       for (let cell in sheet) {
  //         if (cell[0] === '!') continue;
  //         const col = cell.replace(/[0-9]/g, ''); // Lấy tên cột từ tên ô (ví dụ: 'A1' -> 'A')
  //         const rowIndex = parseInt(cell.replace(/\D/g, '')) - 1;
  //         const cellValue = sheet[cell].v;

  //         if (!jsonData[rowIndex]) {
  //           jsonData[rowIndex] = { [col]: cellValue };
  //         } else {
  //           jsonData[rowIndex][col] = cellValue;
  //         }
  //       }
  //       // Xử lý dữ liệu trong jsonData
  //       sDataImport(jsonData)
  //     };
  // };

  useEffect(() => {
    setTimeout(() => {
      listData && sOnLoadingListData(false);
    }, 1000);
  }, [listData]);

  const _HandleChange = (type, value) => {
    if (type == "valueAdd") {
      sValueCheck("add");
    } else if (type == "valueUpdate") {
      sValueCheck("edit");
    } else if (type == "condition_column") {
      sCondition_column(value);
    } else if (type == "save_template") {
      sSave_template(value?.target.checked);
    } else if (type == "sampleImport") {
      sSampleImport(value);
      sOnLoadingListData(true);
      const dataBackup = value
        ? JSON?.parse(value?.setup_colums)?.map((e) => JSON?.parse(e))
        : [];
      sListData(dataBackup);
    } else if (type == "row_tarts") {
      sRow_starts(Number(value?.value));
      var fname = document.getElementById("importFile").files[0];
      _HandleChangeFileImportNew(fname, Number(value?.value), end_row);
    } else if (type == "end_row") {
      sEnd_row(Number(value?.value));
      var fname = document.getElementById("importFile").files[0];
      _HandleChangeFileImportNew(fname, row_tarts, Number(value?.value));
    } else if (type == "importFile") {
      sFileImport(value?.target.files[0]);
      var fname = document.getElementById("importFile").files[0];
      _HandleChangeFileImportNew(fname, row_tarts, end_row);
    }
  };

  const _HandleDeleteFile = () => {
    const inputElement = document.getElementById("importFile");
    inputElement.value = "";
    sFileImport(null);
  };

  const showDeleteButton = fileImport && fileImport != null;

  const _HandleChangeFileImportNew = (file, startRowIndex2, endRow) => {
    // const file = e.target.files[0];

    //đọc file exl
    if (!file) return;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, {
        type: "binary",
        cellDates: true,
        cellText: false,
      });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const startRows = parseInt(startRowIndex2) || 1; // Hàng bắt đầu, mặc định là 1
      const endRows =
        parseInt(endRow) ||
        XLSX.utils.sheet_to_json(sheet, { header: 1 }).length; // Hàng kết thúc, mặc định là số hàng cuối cùng trong sheet
      const jsonData = [];

      const sheetData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        raw: false,
        dateNF: "yyyy-mm-dd",
      });

      const startRowIndex = parseInt(startRows) - 1;
      const endRowIndex = parseInt(endRows) - 1;
      const maxRowIndex = sheetData.length - 1;

      //đổ dữ liệu theo start end
      const rowIndexStart = Math.max(0, startRowIndex);
      const rowIndexEnd = Math.min(maxRowIndex, endRowIndex);

      for (let rowIndex = rowIndexStart; rowIndex <= rowIndexEnd; rowIndex++) {
        const row = sheetData[rowIndex];

        const rowData = {};
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const col = String.fromCharCode(65 + colIndex);
          rowData[col] = row[colIndex];
          rowData["rowIndex"] = rowIndex;
        }
        jsonData.push(rowData);
      }

      setTimeout(() => {
        sDataImport(jsonData);
      }, 0);
    };
  };

  //change trường dữ liệu, cột dữ liệu
  // const _HandleChangeChild = (childId, type, value) => {
  //   const newData = listData.map((e) => {
  //     if (e?.id == childId) {
  //       if (type == "data_fields") {
  //         const checkData = listData?.some(
  //           (e) => e?.dataFields?.value === value?.value
  //         );
  //         if (!checkData) {
  //           return { ...e, dataFields: value };
  //         } else {
  //           Toast.fire({
  //             title: `${
  //               dataLang?.import_ERR_selected || "import_ERR_selected"
  //             }`,
  //             icon: "error",
  //           });
  //         }
  //         return { ...e };
  //       } else if (type == "column") {
  //         const checkData = listData?.some(
  //           (e) => e?.column?.value === value?.value
  //         );
  //         if (!checkData) {
  //           return { ...e, column: value };
  //         } else {
  //           Toast.fire({
  //             title: `${
  //               dataLang?.import_ERR_selectedColumn ||
  //               "import_ERR_selectedColumn"
  //             }`,
  //             icon: "error",
  //           });
  //         }
  //         return { ...e };
  //       }
  //     } else {
  //       return e;
  //     }
  //   });
  //   sListData([...newData]);
  // };
  const checkMain = listData?.some((e) => e?.dataFields?.value == "variation");

  const _HandleChangeChild = (childId, type, value) => {
    const newData = listData.map((e) => {
      const checkMain2 = e?.dataFields?.value == "variation";
      if (e?.id == childId) {
        if (type == "data_fields") {
          const isDuplicate =
            value &&
            listData.some(
              (data) =>
                data?.dataFields?.value === value?.value && data.id !== childId
            );
          //Lỗi trùng nhau
          if (isDuplicate && e?.dataFields?.value !== value?.value) {
            Toast.fire({
              title: `${
                dataLang?.import_ERR_selected || "import_ERR_selected"
              }`,
              icon: "error",
            });

            return { ...e, dataFields: null };
          } else if (
            //Lỗi trùng nhau phải có biến thể chính mới cho chọn phụ
            tabPage == 3 &&
            value?.value == "variation_option" &&
            !checkMain
          ) {
            Toast.fire({
              title: `${"Chọn biến thể chính trước !"}`,
              icon: "error",
            });
            return e;
          } else if (tabPage == 3 && checkMain2) {
            //Khi không có biến thể chính thì trường biến thể phụ thành null
            const checkEx = listData?.findIndex(
              (e) => e?.dataFields?.value == "variation_option"
            );
            if (checkEx >= 0) {
              listData[checkEx].dataFields = null;
            }
            return { ...e, dataFields: null };
          } else {
            return { ...e, dataFields: value };
          }
        } else if (type == "column") {
          //Trùng cột
          const isDuplicate =
            value &&
            listData.some(
              (data) =>
                data?.column?.value === value?.value && data.id !== childId
            );

          if (isDuplicate && e?.column?.value !== value?.value) {
            Toast.fire({
              title: `${
                dataLang?.import_ERR_selectedColumn ||
                "import_ERR_selectedColumn"
              }`,
              icon: "error",
            });
            return e; // Giữ nguyên phần tử cũ nếu trùng lặp
          } else {
            return { ...e, column: value };
          }
        }
      } else {
        return e;
      }
    });
    sListData([...newData]);
  };

  useEffect(() => {
    const arrayCheck = ["variation", "variation_option"];
    const ObError = [...listData].reduce((a, b) => {
      let name = b?.dataFields?.value;
      a[name] = arrayCheck.includes(b?.dataFields?.value);
      return a;
    }, {});
    setTimeout(() => {
      sStepper({
        main: ObError?.variation,
        extra: ObError?.variation_option,
      });
    }, 300);
  }, [listData]);
  //Thêm cột
  const _HandleAddParent = (value) => {
    const newData = {
      id: Date.now(),
      dataFields: null,
      column: null,
    };
    sListData([...listData, newData]);
  };

  //them liên hệ
  const _HandleAddContact = (value) => {
    const newData = {
      id: Date.now(),
      // dataFields: value,
      // column: value,
    };
    sListDataContat([newData, ...listDataContact]);
  };

  //xóa cột
  // const chechData =
  const _HandleDelete = (id) => {
    const newData = listData.filter((x) => x.id !== id); // loại bỏ phần tử cần xóa
    const newDatas = listData.filter((item) => {
      const value = item?.dataFields?.value;
      return (
        item.id !== id && value !== "variation" && value !== "variation_option"
      );
    });

    sListData(newDatas); // cập nhật lại mảng
  };

  const _HandleDeleteParent = () => {
    const newData = []; // Tạo một mảng rỗng
    sListData(newData); // Cập nhật lại mảng
    if (sampleImport != null) {
      sSampleImport(null);
    }
  };

  //xóa cột kliên hệ
  const _HandleDeleteContact = (id) => {
    const newData = listDataContact.filter((x) => x.id !== id); // loại bỏ phần tử cần xóa
    sListDataContat(newData); // cập nhật lại mảng
  };

  //load lại dữ liệu.
  const _HandleLoadDataBackup = (e) => {
    hiRef.current.classList.add("animate-spin");
    sOnFetching(true);
    setTimeout(() => {
      hiRef.current.classList.remove("animate-spin");
      Toast.fire({
        icon: "success",
        title: `Load dữ liệu thành công`,
      });
    }, 2000);
    setTimeout(() => {
      sOnLoadingDataBack(false);
    }, 3000);
  };

  //navbar
  const dataTab = [
    {
      id: 1,
      name: "Khách hàng",
    },
    {
      id: 2,
      name: "Nhà cung cấp",
    },
    {
      id: 3,
      name: "Nguyên vật liệu",
    },
    {
      id: 4,
      name: "Thành phẩm",
    },
    {
      id: 5,
      name: "Công đoạn",
    },
  ];
  /// tên model
  const dataName = {
    1: dataLang?.import_client || "import_client",
    2: dataLang?.import_suppliers || "import_suppliers",
    3: dataLang?.import_materials || "import_materials",
    4: dataLang?.import_finished_product || "import_finished_product",
    5: dataLang?.import_user || "import_user",
  };

  // validate dữ liệu rồi post
  const _HandleSubmit = (e) => {
    e.preventDefault();

    const array = ["name", "branch_id", "code"];

    const ObError = listData.reduce((a, b) => {
      let name = b?.dataFields?.value;
      a[name] = array.includes(b?.dataFields?.value);
      return a;
    }, {});

    const errEnd = end_row < row_tarts;
    //Hàng kết thúc bé hơn hàng bắt đầu thì lỗi
    const errStart = row_tarts > end_row;
    //Hàng bắt đầu lớn hơn hàng kết thúc thì lỗi
    const hasNullDataFiles = listData.some((e) => e?.dataFields === null);

    const hasNullColumn = listData.some((e) => e?.column === null);

    const hasNullDataImport = dataImport?.length == 0;

    const requiredColumn = listData?.length == 0;

    if (
      hasNullDataFiles ||
      fileImport == null ||
      hasNullColumn ||
      (valueCheck == "edit" && condition_column == null) ||
      (valueCheck == "edit" && !ObError?.code) ||
      hasNullDataImport ||
      requiredColumn ||
      !ObError?.name ||
      (valueCheck == "add" && !ObError?.branch_id) ||
      end_row == null ||
      end_row == "" ||
      row_tarts == null ||
      row_tarts == "" ||
      errEnd ||
      errStart ||
      row_tarts == 0 ||
      end_row == 0
    ) {
      hasNullDataFiles && sErrFiles(true);
      hasNullColumn && sErrColumn(true);

      valueCheck == "edit" && condition_column == null && sErrValueCheck(true);

      fileImport == null && sErrFileImport(true);

      // hasNullDataImport && sErrFileImport(true)

      row_tarts == null && sErrRowStart(true);
      row_tarts == "" && sErrRowStart(true);

      end_row == null && sErrEndRow(true);
      end_row == "" && sErrEndRow(true);
      //bắt buộc phải thêm cột
      if (requiredColumn) {
        Toast.fire({
          icon: "error",
          title: `${
            dataLang?.import_ERR_add_column || "import_ERR_add_column"
          }`,
        });
      }
      //KH - bắt buộc phải có cột tên khách hàng, NCC PHẢI CÓ TÊN NCC, nvl PHẢI CÓ TÊN nvl
      else if (!ObError?.name) {
        Toast.fire({
          icon: "error",
          title: `${
            (tabPage == 1 &&
              !ObError?.name &&
              dataLang?.import_ERR_add_nameData) ||
            (tabPage == 2 &&
              !ObError?.name &&
              dataLang?.import_ERR_add_nameDataSuplier) ||
            (tabPage == 3 &&
              !ObError?.name &&
              dataLang?.import_ERR_add_nameMterial)
          }`,
        });
      }
      //bắt buộc phải có cột chi nhánh
      else if (valueCheck == "add" && !ObError?.branch_id) {
        Toast.fire({
          icon: "error",
          title: `${
            dataLang?.import_ERR_add_branchData || "import_ERR_add_branchData"
          }`,
        });
      }
      //nếu cập nhật thì phải có cột mã kh
      else if (valueCheck == "edit" && tabPage == 1 && !ObError?.code) {
        Toast.fire({
          icon: "error",
          title: `${
            dataLang?.import_ERR_add_CodeData || "import_ERR_add_CodeData"
          }`,
        });
      }
      //Hàng bắt đầu hàng kết thúc
      else if (
        row_tarts == 0 ||
        row_tarts == null ||
        end_row == 0 ||
        end_row == null
      ) {
        Toast.fire({
          icon: "error",
          title: `${"Hàng phải lớn hơn 0"}`,
        });
      } else if (errEnd) {
        Toast.fire({
          icon: "error",
          title: `${
            dataLang?.import_ERR_greater_end || "import_ERR_greater_end"
          }`,
        });
      } else if (errStart) {
        Toast.fire({
          icon: "error",
          title: `${
            dataLang?.import_ERR_greater_end || "import_ERR_greater_end"
          }`,
        });
      } else {
        Toast.fire({
          icon: "error",
          title: `${dataLang?.required_field_null}`,
        });
      }
    } else {
      sErrFileImport(false);
      sOnSending(true);
    }
  };

  useEffect(() => {
    sErrValueCheck(false);
  }, [condition_column != null]);

  useEffect(() => {
    sErrEndRow(false);
  }, [end_row != null]);

  useEffect(() => {
    sErrRowStart(false);
  }, [row_tarts != null]);

  useEffect(() => {
    sErrFileImport(false);
  }, [fileImport != null]);
  // const _ServerSending = async () => {

  //   const data = dataImport.map((item) => {
  //     const result = {};
  //     for (const listDataItem of listData) {
  //       const columnValue = listDataItem.column?.value;
  //       const dataFieldsValue = listDataItem.dataFields?.value;

  //       if (columnValue && item[columnValue]) {
  //         result[dataFieldsValue] = item[columnValue];
  //       }
  //       if (listDataItem.dataFields && listDataItem.dataFields.label && listDataItem.dataFields.value && item[listDataItem.dataFields.label]) {
  //         const fieldKey = listDataItem.dataFields.value;
  //         const fieldValue = item[listDataItem.dataFields.label];
  //         result[fieldKey] = fieldValue;
  //       }
  //     }
  //     return result;
  //   });
  // await Promise.all(
  //   data.map((item) => {
  //         return Axios("POST",`/api_web/Api_import_data/action_add_client?csrf_protection=true`, {
  //                   data: item,
  //                   headers: {'Content-Type': 'multipart/form-data'},
  //                   onUploadProgress: (progressEvent) => {
  //                     const {loaded, total} = progressEvent;
  //                     const percentage = Math.floor(((loaded / 1000) * 100) / (total / 1000));
  //                     sMultipleProgress(percentage);
  //                   }
  //               }, (err, response) => {
  //                   if(!err){
  //                       var {isSuccess, message} = response.data
  //                       console.log(response.data);
  //                       if(isSuccess){
  //                           Toast.fire({
  //                               icon: 'success',
  //                               title: `${dataLang[message]}`
  //                           })
  //                         sMultipleProgress(0)
  //                           //new
  //                           sListData([])
  //                           // router.push('/purchase_order/returns?tab=all')
  //                       }else {
  //                           Toast.fire({
  //                             icon: 'error',
  //                             title: `${dataLang[message]}`
  //                           })
  //                       }
  //                   }
  //           sOnSending(false)
  //       })
  //   })).then(res =>{
  //     sMultipleProgress(0)
  //   })
  // }

  //post data
  const _ServerSending = async () => {
    // lọc ra cột dữ liệu và cột excel
    const data = dataImport
      //   ?.filter((item) => item.rowIndex != null && item.rowIndex != "")
      ?.filter((item) => item)
      .map((item) => {
        const result = {};

        for (const listDataItem of listData) {
          const columnValue = listDataItem.column?.value;
          const dataFieldsValue = listDataItem.dataFields?.value;
          if (columnValue && item[columnValue]) {
            result[dataFieldsValue] = item[columnValue];
          }
          if (
            listDataItem?.dataFields &&
            listDataItem?.dataFields.label &&
            listDataItem?.dataFields?.value &&
            item[listDataItem?.dataFields?.label]
          ) {
            const fieldKey = listDataItem?.dataFields?.value;
            const fieldValue = item[listDataItem?.dataFields?.label];
            result[fieldKey] = fieldValue;
          }
        }
        if (Object.keys(result).length > 0) {
          result["rowIndex"] = item.rowIndex
            ? Number(item.rowIndex) + 1
            : item.rowIndex == 0
            ? 1
            : null;
          return result;
        }

        return null;
      })
      .filter((item) => item !== null);
    const chunkSize = 50; // Kích thước mỗi mảng con
    const dataChunks = [];
    // Chia nhỏ mảng data thành các mảng con có kích thước chunkSize
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      dataChunks.push(chunk);
    }

    const apiPaths = {
      1: "/api_web/Api_import_data/action_add_client?csrf_protection=true",
      2: "/api_web/Api_import_data/action_add_suppliers?csrf_protection=true",
      3: "/api_web/Api_import_data/action_add_materials?csrf_protection=true",
      4: "",
      5: "",
    };
    //ánh xạ apiPaths
    const apiUrl = apiPaths[tabPage] || "";
    for (const data of dataChunks) {
      Axios(
        "POST",
        `${apiUrl}`,
        {
          data: {
            data,
            event: valueCheck,
            field_where_update: condition_column?.value,
          },
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentage = Math.floor(
              ((loaded / 1000) * 100) / (total / 1000)
            );
            sMultipleProgress(percentage);
          },
        },
        (err, response) => {
          if (!err) {
            var { lang_message, data_fail, fail, success } = response.data;

            sDataFail(data_fail);
            sTotalFalse(fail);
            sDataSuccess(success);
            if (success) {
              if (success == 0) {
                Toast.fire({
                  icon: "success",
                  title: `${dataLang[lang_message?.success]}`,
                });
              } else {
                Toast.fire({
                  icon: "success",
                  title: `${dataLang[lang_message?.success]}`,
                });
              }
            }
            if (fail > 0) {
              Toast.fire({
                icon: "error",
                title: `${dataLang[lang_message?.fail]}`,
              });
            }
          }
          sOnSending(false);
          setTimeout(() => {
            sMultipleProgress(0);
          }, 2000);
        }
      );
    }
  };

  //Lưu mẫu import

  const _ServerSendingImporTemplate = () => {
    var formData = new FormData();
    listData.forEach((e, index) => {
      formData.append(`setup_colums[${index}]`, JSON.stringify(e));
    });
    formData.append(`tab`, tabPage);
    Axios(
      "POST",
      `${"/api_web/Api_import_data/add_tempate_import?csrf_protection=true"}`,
      {
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      },
      (err, response) => {
        if (!err) {
          var { isSuccess, message, alert_type } = response.data;
          //   if (isSuccess) {
          Toast.fire({
            icon: `${alert_type}`,
            title: `${dataLang[message]}`,
          });
          //   } else {
          //     Toast.fire({
          //       icon: "error",
          //       title: `${dataLang[message]}`,
          //     });
          //   }
        }
        sOnLoadingDataBack(true);
        sOnSending(false);
      }
    );
  };

  useEffect(() => {
    onSending && save_template && _ServerSendingImporTemplate();
  }, [onSending]);

  useEffect(() => {
    onSending && _ServerSending();
  }, [onSending]);

  const formatNumber = (number) => {
    if (!number && number !== 0) return 0;
    const integerPart = Math.floor(number);
    const decimalPart = number - integerPart;
    const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
    const roundedNumber = integerPart + roundedDecimalPart;
    return roundedNumber.toLocaleString("en");
  };
  return (
    <React.Fragment>
      <Head>
        <title>{dataLang?.import_data || "import_data"}</title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 ">
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">
            {dataLang?.import_data || "import_data"}
          </h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{dataLang?.import_category || "import_category"}</h6>
        </div>
        <Popup_status
          dataLang={dataLang}
          className=""
          router={router.query?.tab}
          data={dataFail}
          totalFalse={totalFalse}
          listData={listData}
        />
        <div className="">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
              <h2 className="text-2xl text-[#52575E] capitalize">
                {dataLang?.import_catalog || "import_catalog"}
              </h2>

              <div className="grid grid-cols-12 items-center justify-center mx-auto space-x-3">
                <div className="col-span-2"></div>
                <div className="col-span-8 grid-cols-5 grid  items-center overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  {dataTab &&
                    dataTab.map((e) => {
                      return (
                        <div>
                          <TabClient
                            key={e.id}
                            onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                            active={e.id}
                            className="text-[#0F4F9E] col-span-1 bg-[#e2f0fe] hover:bg-blue-400 hover:text-white transition-all ease-linear"
                          >
                            {e.name}
                          </TabClient>
                        </div>
                      );
                    })}
                </div>
                <div className="col-span-2"></div>

                <div className="col-span-2"></div>
                <div className="col-span-8 border-b">
                  <h2 className="py-2">{dataName[tabPage] || ""}</h2>
                </div>
                <div className="col-span-2"></div>

                <div className="col-span-2"></div>
                <div className="col-span-4 mb-2 mt-2">
                  <h5 className="mb-1 block text-sm font-medium text-gray-700">
                    {dataLang?.import_form || "import_form"}
                  </h5>
                  <Select
                    closeMenuOnSelect={true}
                    placeholder={dataLang?.import_form || "import_form"}
                    options={dataSampleImport}
                    isLoading={sampleImport != null ? false : onLoading}
                    formatOptionLabel={(option) => (
                      <div className="flex justify-start items-center gap-1 ">
                        <h2 className="font-medium">
                          {option?.label}{" "}
                          <span className="italic text-sm">{`(${option?.date})`}</span>
                        </h2>
                      </div>
                    )}
                    isSearchable={true}
                    onChange={_HandleChange.bind(this, "sampleImport")}
                    value={sampleImport}
                    LoadingIndicator
                    noOptionsMessage={() =>
                      dataLang?.import_no_data || "import_no_data"
                    }
                    maxMenuHeight="200px"
                    isClearable={true}
                    menuPortalTarget={document.body}
                    onMenuOpen={handleMenuOpen}
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
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                        position: "absolute",
                      }),
                    }}
                    className="border-transparent text-sm placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border "
                  />
                </div>
                <div className="col-span-4 mb-2 mt-2">
                  <h5 className="mb-1 block text-sm font-medium text-gray-700">
                    {dataLang?.import_operation || "import_operation"}
                  </h5>
                  <div>
                    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <li className="w-full border-b  cursor-pointer  hover:bg-pink-600 group overflow-hidden transform  transition duration-300 ease-in-out border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                        <div className="flex cursor-pointer items-center pl-3">
                          <input
                            id="horizontal-list-radio-license"
                            type="radio"
                            value={valueCheck}
                            checked={valueCheck == "add"}
                            onChange={_HandleChange.bind(this, "valueAdd")}
                            name="list-radio"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor="horizontal-list-radio-license"
                            className="w-full py-2 cursor-pointer ml-2 text-sm font-medium text-gray-900 group-hover:text-white transition-all ease-in-out dark:text-gray-300"
                          >
                            {dataLang?.import_more || "import_more"}
                          </label>
                        </div>
                      </li>
                      <li className="w-full border-b  cursor-pointer hover:bg-pink-600 group overflow-hidden transform  transition duration-300 ease-in-out border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                        <div className="flex cursor-pointer items-center pl-3">
                          <input
                            id="horizontal-list-radio-id"
                            type="radio"
                            value={valueCheck}
                            checked={valueCheck == "edit"}
                            onChange={_HandleChange.bind(this, "valueUpdate")}
                            name="list-radio"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor="horizontal-list-radio-id"
                            className="w-full py-2 cursor-pointer ml-2 text-sm font-medium text-gray-900 group-hover:text-white transition-all ease-in-out dark:text-gray-300"
                          >
                            {dataLang?.import_update || "import_update"}
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-span-2"></div>

                <div className="col-span-2"></div>
                <div className="col-span-4">
                  {valueCheck === "edit" ? (
                    <>
                      <h5 className="mb-1 block text-sm font-medium text-gray-700">
                        {dataLang?.import_condition_column ||
                          "import_condition_column"}
                        <span className="text-red-500">*</span>
                      </h5>
                      <Select
                        closeMenuOnSelect={true}
                        placeholder={
                          dataLang?.import_condition_column ||
                          "import_condition_column"
                        }
                        isLoading={onLoading}
                        options={dataConditionColumn}
                        isSearchable={true}
                        onChange={_HandleChange.bind(this, "condition_column")}
                        value={condition_column}
                        LoadingIndicator
                        noOptionsMessage={() =>
                          dataLang?.import_no_data || "import_no_data"
                        }
                        maxMenuHeight="200px"
                        isClearable={true}
                        menuPortalTarget={document.body}
                        onMenuOpen={handleMenuOpen}
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
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                            position: "absolute",
                          }),
                        }}
                        className={`${
                          errValueCheck
                            ? "border-red-500"
                            : "border-transparent"
                        } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `}
                      />
                      {errValueCheck && (
                        <label className="text-sm text-red-500">
                          {dataLang?.import_ERR_condition_column ||
                            "import_ERR_condition_column"}
                        </label>
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-span-4"></div>
                <div className="col-span-2"></div>

                <div className="col-span-2"></div>
                <div className="col-span-4 grid-cols-12 grid items-center gap-1">
                  <div
                    className={`${
                      !showDeleteButton ? "col-span-12" : "col-span-11"
                    }`}
                  >
                    <label
                      for="importFile"
                      className="block text-sm font-medium mb-2 dark:text-white"
                    >
                      {dataLang?.import_file || "import_file"}
                    </label>
                    <label
                      for="importFile"
                      className={`${
                        (errFileImport && dataImport.length == 0) ||
                        (errFileImport && fileImport == null)
                          ? "border-red-500"
                          : "border-gray-200"
                      } " border-gray-200 flex w-full cursor-pointer p-2 appearance-none items-center justify-center rounded-md border-2 border-dashed  transition-all hover:border-blue-300"`}
                    >
                      <input
                        accept=".xlsx, .xls"
                        id="importFile"
                        onChange={_HandleChange.bind(this, "importFile")}
                        type="file"
                        className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:py-0.5 file:px-5 file:text-[13px] file:font-semibold file:text-white hover:file:bg-primary-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60"
                      />
                    </label>
                    {(errFileImport && dataImport.length == 0) ||
                      (errFileImport && fileImport == null && (
                        <label className="text-sm text-red-500">
                          {dataLang?.import_ERR_file || "import_ERR_file"}
                        </label>
                      ))}
                  </div>
                  <div className="col-span-1  mx-auto">
                    {showDeleteButton && (
                      <button
                        type="button"
                        onClick={_HandleDeleteFile.bind(this)}
                        className="mt-8 hover:bg-red-200 group animate-bounce  bg-red-50  rounded p-2 gap-1 i cursor-pointer hover:scale-[1.02]  overflow-hidden transform  transition duration-300 ease-out"
                      >
                        <IconDelete size={20} color="red" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-span-4 grid grid-cols-4 gap-2.5">
                  <div className="mx-auto w-full col-span-2">
                    <label
                      htmlFor="input-label"
                      className="block text-sm font-medium mb-2 dark:text-white"
                    >
                      {dataLang?.import_line_starts || "import_line_starts"}
                    </label>
                    <NumericFormat
                      className={`${
                        errRowStart && (row_tarts == null || row_tarts == "")
                          ? "border-red-500"
                          : "border-gray-200"
                      } border py-2.5 outline-none px-4  block w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400`}
                      onValueChange={_HandleChange.bind(this, "row_tarts")}
                      value={row_tarts}
                      allowNegative={false}
                      decimalScale={0}
                      isNumericString={true}
                      thousandSeparator=","
                      placeholder={
                        dataLang?.import_line_starts || "import_line_starts"
                      }
                      // isAllowed={(values) => { const {floatValue} = values; return floatValue  }}

                      // isAllowed={(values) => { const {floatValue} = values;
                      //   if(floatValue < 1){
                      //     Toast.fire({
                      //       icon: 'error',
                      //       title: `${dataLang?.import_ERR_greater_than || "import_ERR_greater_than"} !`
                      //     })
                      //     // return floatValue > 0
                      //     return floatValue
                      //   }
                      //   if(end_row != null && floatValue > Number(end_row)){
                      //     Toast.fire({
                      //       icon: 'error',
                      //       title: `${dataLang?.import_ERR_greater_start || "import_ERR_greater_start"} !`
                      //     })
                      //     return floatValue == Number(end_row)
                      //   }
                      //   return floatValue
                      //   // return floatValue > 0
                      //   }}
                    />
                    {errRowStart && row_tarts == null && (
                      <label className="text-sm text-red-500">
                        {dataLang?.import_ERR_line || "import_ERR_line"}
                      </label>
                    )}
                  </div>
                  <div className="mx-auto w-full col-span-2">
                    <label
                      for="input-labels"
                      className="block text-sm font-medium mb-2 dark:text-white"
                    >
                      {dataLang?.import_finished_row || "import_finished_row"}
                    </label>
                    <NumericFormat
                      className={`${
                        errEndRow && (end_row == null || end_row == "")
                          ? "border-red-500"
                          : "border-gray-200"
                      } border py-2.5 outline-none px-4 border block w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400`}
                      onValueChange={_HandleChange.bind(this, "end_row")}
                      value={end_row}
                      disabled={row_tarts == null}
                      allowNegative={false}
                      decimalScale={0}
                      isNumericString={true}
                      thousandSeparator=","
                      placeholder={
                        row_tarts == null
                          ? dataLang?.import_startrow || "import_startrow"
                          : dataLang?.import_finished_row ||
                            "import_finished_row"
                      }
                      // isAllowed={(values) => {
                      //   const { floatValue } = values;
                      //   if (floatValue < Number(row_tarts)) {
                      //     Toast.fire({
                      //       icon: 'error',
                      //       title: `${dataLang?.import_ERR_greater_end || "import_ERR_greater_end"} !`
                      //     });
                      //     return floatValue >= Number(row_tarts);
                      //   }
                      //   // return floatValue > 0;
                      //   return floatValue ;
                      // }}

                      // isAllowed={(values) => { const {floatValue} = values; return floatValue || ''}}
                    />
                    {errEndRow && end_row == null && (
                      <label className="text-sm text-red-500">
                        {dataLang?.import_ERR_linefinish ||
                          "import_ERR_linefinish"}
                      </label>
                    )}
                  </div>
                </div>
                <div className="col-span-2"></div>

                <div className="col-span-2"></div>
                <div className="col-span-4 -mt-2">
                  <div
                    className={`${
                      listData?.length > 1 && !onLoadingListData
                        ? "grid-cols-14"
                        : "grid-cols-12"
                    } grid  gap-2 items-center`}
                  >
                    {listData?.length > 1 && !onLoadingListData && (
                      <div className="col-span-3 pt-5">
                        <button
                          type="button"
                          onClick={_HandleDeleteParent.bind(this)}
                          className="flex w-full  items-center  justify-center bg-rose-600 rounded p-2 gap-1 i cursor-pointer hover:scale-[1.02]  overflow-hidden transform  transition duration-300 ease-out"
                        >
                          <IconDelete
                            size={19}
                            color="white"
                            className="transition-all ease-out animate-bounce-custom"
                          />{" "}
                          <h6 className="text-white font-normal text-xs">
                            {listData?.length}{" "}
                            {dataLang?.import_column || "import_column"}
                          </h6>
                        </button>
                      </div>
                    )}
                    <div
                      className={`${
                        listData?.length > 1 && !onLoadingListData
                          ? "col-span-11"
                          : "col-span-12"
                      } `}
                    >
                      <div className="b  flex items-center justify-center w-full  pt-5">
                        <button
                          onClick={_HandleAddParent.bind(this)}
                          className="i flex justify-center gap-2 group bg-pink-600 w-full text-center py-2 text-white items-center rounded cursor-pointer hover:scale-[1.02]  overflow-hidden transform  transition duration-300 ease-out"
                        >
                          <Add
                            size="20"
                            color="red"
                            className="bg-gray-50 rounded-full group-hover:animate-spin ease-linear transition-all"
                          />
                          <p className="text-sm">
                            {dataLang?.import_more_collum ||
                              "import_more_collum"}
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-4 -mt-2 relative">
                  {save_template && onLoadingDataBack && (
                    <div
                      className={`b  flex items-center justify-center w-full  pt-5`}
                    >
                      <button
                        onClick={_HandleLoadDataBackup.bind(this)}
                        className="i flex justify-center gap-2 bg-green-600 w-full text-center py-2 text-white items-center rounded cursor-pointer hover:scale-[1.02]  overflow-hidden transform  transition duration-300 ease-out"
                      >
                        <RefreshCircle
                          size="20"
                          color="green"
                          ref={hiRef}
                          className="bg-gray-50 rounded-full hi "
                        />
                        <p className="text-sm">
                          {dataLang?.import_updateImport ||
                            "import_updateImport"}
                        </p>
                      </button>
                    </div>
                  )}
                  {tabPage == 3 && listData.length > 0 && (
                    <div
                      className={`flex items-center justify-center  gap-2 pt-5 ${
                        save_template && onLoadingDataBack
                          ? "absolute w-[100%] top-[66%]"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-1 group">
                        <ColorsSquare
                          size="22"
                          className={`${
                            stepper.main ? "text-blue-600" : "text-gray-500"
                          } group-hover:scale-105 transition-all ease-linear animate-pulse duration-700`}
                        />
                        <h3
                          className={`${
                            stepper.main ? "text-blue-600" : "text-gray-600"
                          } font-semibold duration-700 3xl:text-sm 2xl:text-sm xl:text-xs text-xs`}
                        >
                          {dataLang?.import_variation || "import_variation"}
                        </h3>
                      </div>
                      <div
                        className={`3xl:w-[50%] 2xl:w-[40%] w-[35%]  h-2 bg-gray-200  rounded-xl relative before:animate-pulse  before:transition-all before:absolute before:duration-500  before:ease-in-out duration-500 transition before:h-full before:bg-blue-500 before:rounded-xl before:${
                          stepper.main && !stepper.extra
                            ? "w-[50%]"
                            : stepper.main && stepper.extra
                            ? "w-[100%]"
                            : "w-[0%]"
                        }`}
                      ></div>
                      <div className="flex items-center gap-1 group">
                        <Colorfilter
                          size="22"
                          className={`${
                            stepper?.main && stepper?.extra
                              ? "text-blue-600"
                              : "text-gray-500"
                          } group-hover:scale-105 duration-700 transition-all ease-linear animate-pulse`}
                        />
                        <h3
                          className={`${
                            stepper?.main && stepper?.extra
                              ? "text-blue-600"
                              : "text-gray-600"
                          } font-semibold 3xl:text-sm 2xl:text-sm xl:text-xs text-xs duration-700`}
                        >
                          {dataLang?.import_subvariant || "import_subvariant"}
                        </h3>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-span-2"></div>

                <div className="col-span-2"></div>
                <div
                  className={`${listData?.length > 2 ? "mt-3" : ""} ${
                    onLoadingListData ? "col-span-8" : "col-span-6"
                  }`}
                >
                  {onLoadingListData ? (
                    <Loading className="h-2" color="#0f4f9e" />
                  ) : (
                    listData?.map((e, index) => (
                      <div
                        className="grid grid-cols-6 gap-2.5 mb-2"
                        key={e?.id}
                      >
                        <div className="col-span-4">
                          <div className="grid-cols-13 grid items-end justify-center gap-2.5">
                            <div className="col-span-1 mx-auto">
                              <button
                                onClick={_HandleDelete.bind(this, e?.id)}
                                className="xl:text-base text-xs hover:scale-105 transition-all ease-in-out bg-red-50 p-2 rounded-sm hover:bg-red-100"
                              >
                                <IconDelete color="red" />
                              </button>
                            </div>
                            <div className="col-span-6">
                              {index == 0 && (
                                <h5 className="mb-1 block text-sm font-medium text-gray-700">
                                  {dataLang?.import_data_fields ||
                                    "import_data_fields"}{" "}
                                  <span className="text-red-500">*</span>
                                </h5>
                              )}
                              <Select
                                closeMenuOnSelect={true}
                                placeholder={
                                  dataLang?.import_data_fields ||
                                  "import_data_fields"
                                }
                                options={dataClient}
                                isSearchable={true}
                                onChange={_HandleChangeChild.bind(
                                  this,
                                  e?.id,
                                  "data_fields"
                                )}
                                value={e?.dataFields}
                                LoadingIndicator
                                noOptionsMessage={() =>
                                  dataLang?.import_no_data || "import_no_data"
                                }
                                maxMenuHeight="200px"
                                isClearable={true}
                                menuPortalTarget={document.body}
                                onMenuOpen={handleMenuOpen}
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
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                    position: "absolute",
                                  }),
                                }}
                                className={`${
                                  errFiles && e.dataFields == null
                                    ? "border-red-500"
                                    : "border-transparent"
                                } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `}
                              />
                            </div>
                            <div className="col-span-6">
                              {index == 0 && (
                                <h5 className="mb-1 block text-sm font-medium text-gray-700">
                                  {dataLang?.import_data_column ||
                                    "import_data_column"}
                                  <span className="text-red-500">*</span>
                                </h5>
                              )}
                              <Select
                                closeMenuOnSelect={true}
                                placeholder={
                                  dataLang?.import_data_column ||
                                  "import_data_column"
                                }
                                options={dataColumn}
                                isSearchable={true}
                                // onChange={_HandleChange.bind(this, "column")}
                                onChange={_HandleChangeChild.bind(
                                  this,
                                  e?.id,
                                  "column"
                                )}
                                value={e?.column}
                                LoadingIndicator
                                noOptionsMessage={() =>
                                  dataLang?.import_no_data || "import_no_data"
                                }
                                maxMenuHeight="200px"
                                isClearable={true}
                                menuPortalTarget={document.body}
                                onMenuOpen={handleMenuOpen}
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
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                    position: "absolute",
                                  }),
                                }}
                                className={`${
                                  errColumn && e?.column == null
                                    ? "border-red-500"
                                    : "border-transparent"
                                } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 ">
                          {index == 0 && (
                            <h5 className="mb-1 block text-sm font-medium text-gray-700 opacity-0">
                              {dataLang?.import_operation || "import_operation"}
                            </h5>
                          )}
                          {e?.dataFields?.value == "group_id" ||
                          (tabPage == 3 &&
                            e?.dataFields?.value == "category_id") ||
                          (tabPage == 3 && e?.dataFields?.value == "unit_id") ||
                          (tabPage == 3 &&
                            e?.dataFields?.value == "unit_convert_id") ? (
                            <div className="flex items-center space-x-2 rounded p-2 ">
                              <TiTick color="green" />
                              <label
                                for="example11"
                                className="flex w-full space-x-2 text-sm"
                              >
                                {dataLang?.import_add || "import_add"}
                              </label>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {!onLoadingListData && (
                  <div className="col-span-2 flex items-center justify-center mt-5">
                    {listData.length > 0 && (
                      <div className={`${listData.length < 2 ? "mt-4" : ""}`}>
                        <CircularProgressbar
                          className="text-center"
                          value={multipleProgress}
                          strokeWidth={10}
                          text={`${multipleProgress}%`}
                          // classes={`text: center`}
                          styles={buildStyles({
                            rotation: 0.25,
                            strokeLinecap: "butt",
                            textSize: "16px",
                            pathTransitionDuration: 0.5,
                            pathColor: `rgba(236, 64, 122, ${
                              multipleProgress / 100
                            })`,
                            pathColor: `green`,
                            textColor: "green",
                            textAnchor: "middle",
                            trailColor: "#d6d6d6",
                            backgroundColor: "#3e98c7",
                          })}
                        />
                        <div className=" grid grid-cols-12 group items-center justify-center mt-4">
                          <div
                            className={`${
                              multipleProgress
                                ? "animate-spin"
                                : "animate-pulse"
                            } w-4 h-4 bg-green-500  transition-all mx-auto col-span-3 group-hover:animate-spin ease-linear`}
                          ></div>
                          <h6 className="text-green-600 font-semibold text-[13.5px] col-span-9">{`${formatNumber(
                            dataSuccess
                          )} ${
                            dataLang?.import_susces || "import_susces"
                          }`}</h6>
                        </div>
                        <div className=" grid grid-cols-12 group items-center justify-center mt-4">
                          <div
                            className={`${
                              multipleProgress
                                ? "animate-spin"
                                : "animate-pulse"
                            } w-4 h-4 bg-orange-500  transition-all mx-auto col-span-3 group-hover:animate-spin ease-linear`}
                          ></div>
                          <h6 className="text-orange-600 font-semibold text-[13.5px] col-span-9">{`${formatNumber(
                            totalFalse
                          )} ${dataLang?.import_fail || "import_fail"}`}</h6>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="col-span-2"></div>

                <div className="col-span-2"></div>
                <div className="col-span-8 border-b"></div>
                <div className="col-span-2"></div>

                {/* <div className='col-span-2'></div>
                  <div className='col-span-8 border-b'>
                    <h2 className='py-2'>Liên hệ</h2>
                  </div>
                  <div className='col-span-2'></div> */}

                {/* <div className='col-span-2'></div>
                  <div className='col-span-4 '>
                    <div className='grid grid-cols-13 gap-2.5 items-center'>
                         <div className='col-span-1'></div>
                        <div className='col-span-12 '>
                          <div className="b  flex items-center justify-center w-full  pt-5 ">
                                    <button onClick={_HandleAddContact.bind(this)} className="i  mt-2 flex justify-center gap-2 bg-lime-600 w-full text-center py-2 text-white items-center rounded-lg shadow-xl cursor-pointer hover:scale-[1.02]  overflow-hidden transform  transition duration-300 ease-out">
                                    <Add
                                      size="20"
                                      color="green"
                                      className='bg-gray-50 rounded-full '
                                      />
                                      <p className='text-sm'>Thêm cột</p>
                                    </button>
                              </div>
                        </div>
                    </div>          
                  </div>
                  <div className='col-span-4'>
                          <div className='grid-cols-12 grid items-end justify-center gap-2.5'>
                              <div className='col-span-6'>
                                  <h5  className="mb-1 block text-sm font-medium text-gray-700">Hàng bắt đầu</h5>
                                        <Select   
                                        closeMenuOnSelect={true}
                                        placeholder={"Hàng bắt đầu"}
                                        // options={dataList_Object}
                                        isSearchable={true}
                                        // onChange={_HandleChangeInput.bind(this, "listObject")}
                                        // value={listObject}
                                        LoadingIndicator
                                        noOptionsMessage={() => dataLang?.import_no_data || "import_no_data"}
                                        maxMenuHeight="200px"
                                        isClearable={true} 
                                        menuPortalTarget={document.body}
                                        onMenuOpen={handleMenuOpen}
                                        theme={(theme) => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            primary25: '#EBF5FF',
                                            primary50: '#92BFF7',
                                            primary: '#0F4F9E',
                                        },
                                    })}
                                        styles={{
                                          placeholder: (base) => ({
                                          ...base,
                                          color: "#cbd5e1",
                                        
                                          }),
                                          menuPortal: (base) => ({
                                              ...base,
                                              zIndex: 9999,
                                              position: "absolute", 
                                            
                                          }), 
                                      }}
                                      // className={`${errListObject ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `} 
                                      className="border-transparent  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  text-sm font-normal outline-none border " 
                                      />
                              </div>
                              <div className='col-span-6'>
                                <h5  className="mb-1 block text-sm font-medium text-gray-700">Hàng kết thúc</h5>
                                        <Select   
                                        closeMenuOnSelect={true}
                                        placeholder={"Hàng kết thúc"}
                                        // options={dataList_Object}
                                        isSearchable={true}
                                        // onChange={_HandleChangeInput.bind(this, "listObject")}
                                        // value={listObject}
                                        LoadingIndicator
                                        noOptionsMessage={() => dataLang?.import_no_data || "import_no_data"}
                                        maxMenuHeight="200px"
                                        isClearable={true} 
                                        menuPortalTarget={document.body}
                                        onMenuOpen={handleMenuOpen}
                                        theme={(theme) => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            primary25: '#EBF5FF',
                                            primary50: '#92BFF7',
                                            primary: '#0F4F9E',
                                        },
                                    })}
                                        styles={{
                                          placeholder: (base) => ({
                                          ...base,
                                          color: "#cbd5e1",
                                        
                                          }),
                                          menuPortal: (base) => ({
                                              ...base,
                                              zIndex: 9999,
                                              position: "absolute", 
                                            
                                          }), 
                                      }}
                                      // className={`${errListObject ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `} 
                                      className="border-transparent  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  text-sm font-normal outline-none border " 
                                      />
                              </div>
                          </div>
                  </div>            
                  <div className='col-span-2'></div> */}

                <div className="col-span-2"></div>
                <div className="col-span-8 grid-cols-4 grid gap-2.5 mt-4">
                  {listDataContact?.map((e) => (
                    <div className="relative">
                      <Select
                        closeMenuOnSelect={true}
                        placeholder={"Thêm các trường tự động"}
                        // options={dataList_Object}
                        isSearchable={true}
                        // onChange={_HandleChangeInput.bind(this, "listObject")}
                        // value={listObject}
                        LoadingIndicator
                        noOptionsMessage={() =>
                          dataLang?.import_no_data || "import_no_data"
                        }
                        maxMenuHeight="200px"
                        isClearable={true}
                        menuPortalTarget={document.body}
                        onMenuOpen={handleMenuOpen}
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
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                            position: "absolute",
                          }),
                        }}
                        className="border-transparent   placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  text-sm font-normal outline-none border "
                      />
                      <button
                        onClick={_HandleDeleteContact.bind(this, e?.id)}
                        className="-top-[25%] bg-slate-200 rounded-xl p-0.5 -right-[3%] absolute xl:text-base text-xs hover:scale-105 transition-all ease-in-out "
                      >
                        <IconDelete size={20} color="red" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="col-span-2"></div>

                <div className="col-span-4"></div>
                <div className="col-span-4 mt-2 grid-cols-2 grid gap-2.5">
                  <div className="flex items-center  space-x-2 rounded p-2 hover:bg-gray-200 bg-gray-100 cursor-pointer btn-animation hover:scale-[1.02]">
                    <input
                      type="checkbox"
                      onChange={_HandleChange.bind(this, "save_template")}
                      checked={save_template}
                      value={save_template}
                      id="example12"
                      name="checkGroup1"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
                    />
                    <label
                      htmlFor="example12"
                      className=" space-x-2 text-sm cursor-pointer"
                    >
                      {dataLang?.import_save_template || "import_save_template"}
                    </label>
                  </div>
                  <button
                    onClick={_HandleSubmit.bind(this)}
                    type="submit"
                    className="xl:text-sm text-xs w-full p-2.5 i bg-gradient-to-l hover:bg-blue-300 from-blue-500 via-blue-500  to-blue-500 text-white rounded btn-animation hover:scale-[1.02] flex items-center gap-1 justify-center"
                  >
                    <div
                      className={`${
                        multipleProgress
                          ? "w-4 h-4 border-2 rounded-full border-pink-200 border-t-rose-500 animate-spin"
                          : ""
                      }`}
                    ></div>
                    <span>{"Import"}</span>
                  </button>
                </div>
                <div className="col-span-4 "></div>

                {/* <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div className="bg-blue-600 text-xs transition-all ease-in-out font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width:`${multipleProgress}%`}}> {multipleProgress}%</div>
                  </div>      */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const Popup_status = (props) => {
  const dataLang = props?.dataLang;
  const [open, sOpen] = useState(false);
  const [sroll, sSroll] = useState(false);
  const [repositionOnResiz, sRepositionOnResiz] = useState(false);
  const [data_ex, sData_ex] = useState([]);

  useEffect(() => {
    sData_ex(props.data);
    props?.totalFalse > 0 && sOpen(true);
    props?.totalFalse > 0 && sSroll(true);
    props?.totalFalse > 0 && sRepositionOnResiz(true);
  }, [props.data, props.totalFalse]);

  const { values, columns } = useMemo(() => {
    const arrayFormater = props.data?.map((e) => {
      if (e?.date_incorporation) {
        return {
          ...e,
          date_incorporation: e?.date_incorporation
            ? moment(e?.date_incorporation).format("DD/MM/YYYY")
            : "",
        };
      }
      return { ...e };
    });

    const newArr = (arrayFormater || []).filter(Boolean).map((e) => {
      const { rowIndex, error, ...newObject } = e;
      return newObject;
    });

    const mappedData = newArr.map((item) => {
      const rowData = {};
      props?.listData.forEach((column) => {
        const value = item[column?.dataFields?.value];
        rowData[column?.dataFields?.value] = value || "";
      });
      return rowData;
    });

    const columns = props?.listData?.map((header) => ({
      title: `${header?.dataFields?.label}`,
      width: { wpx: 150 },
      style: { fill: { fgColor: { rgb: "C7DFFB" } }, font: { bold: true } },
    }));

    const values = mappedData.map((i) =>
      Object.values(i)?.map((e) => ({
        value: e,
        style:
          e == ""
            ? { fill: { patternType: "solid", fgColor: { rgb: "FFCCEEFF" } } }
            : "",
      }))
    );

    return { values, columns };
  }, [props.data, props?.listData]);

  const multiDataSet = [{ columns: columns, data: values }];

  return (
    <PopupEdit
      title={
        <>
          <span className="text-red-500 capitalize">
            {`${dataLang?.import_total_detection || "import_total_detection"} ${
              props?.totalFalse
            } ${dataLang?.import_error || "import_error"} `}{" "}
          </span>{" "}
        </>
      }
      open={open}
      onClose={() => sOpen(false)}
      classNameBtn={props.className}
      lockScroll={sroll}
      repositionOnResiz={repositionOnResiz}
    >
      <div className="mt-4 space-x-5 w-[590px] h-auto">
        <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <div className="flex items-center justify-between p-1 bg-gray-50">
            <div className="flex items-center gap-2">
              <h2 className="text-lg text-[#52575E] font-semibold">
                {dataLang?.import_detailed_error || "import_detailed_error"}
              </h2>
              <FilterRemove
                size="20"
                color="red"
                className="transition-all animate-pulse"
              />
            </div>
            {/* <ExcelFile filename={dataLang?.import_error_data || "import_error_data" `${props?.router == 1 && "danh mục khách hàng"}`} title="DLL" element={ */}
            <ExcelFile
              filename={`${
                dataLang?.import_error_data || "import_error_data"
              } ${
                (props?.router == 1 && "danh mục khách hàng") ||
                (props?.router == 2 && "danh mục nhà cung cấp") ||
                (props?.router == 3 && "danh mục nguyên vật liệu")
              }`}
              title="DLL"
              element={
                <button className="xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition">
                  <IconExcel size={18} />
                  <span>{props.dataLang?.client_list_exportexcel}</span>
                </button>
              }
            >
              <ExcelSheet
                dataSet={multiDataSet}
                data={multiDataSet}
                name="Organization"
              />
            </ExcelFile>
          </div>
          <div className="pr-2 w-[100%] lx:w-[110%] ">
            <div
              className={`grid-cols-12  grid sticky top-0 bg-white shadow-lg  z-10`}
            ></div>
            {data_ex?.length > 0 ? (
              <>
                <ScrollArea
                  className="min-h-[90px] max-h-[400px] overflow-hidden"
                  speed={1}
                  smoothScrolling={true}
                >
                  <div className=" divide-slate-200 min:h-[170px]  max:h-[170px]">
                    {data_ex?.map((e) => (
                      <div
                        className="grid grid-cols-12 hover:bg-slate-50 items-center border-b"
                        key={e.id?.toString()}
                      >
                        <h6 className="text-[13px] col-span-12    py-2.5 text-left flex items-center gap-1">
                          <ArrowRight
                            size="18"
                            color="red"
                            className="transition-all animate-pulse animate-bounce-custom"
                          />
                          <h6 className="text-blue-500 font-semibold">
                            Dòng {e?.rowIndex}
                          </h6>
                          <h6>-</h6>
                          {e?.error?.map((e, index, array) => (
                            <div key={e} className="flex gap-1 items-center ">
                              <h6
                                className={`${
                                  e.includes("*")
                                    ? "text-blue-500 font-bold"
                                    : "text-black-500 font-semibold"
                                } text-[13px] col-span-12     py-2.5 text-left "`}
                              >
                                {" "}
                                {dataLang[e] || e?.replace("*", "") || e}
                                {index === array.length - 1 && "."}
                              </h6>
                            </div>
                          ))}
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
                    {props.dataLang?.purchase_order_table_item_not_found ||
                      "purchase_order_table_item_not_found"}
                  </h1>
                  <div className="flex items-center justify-around mt-6 "></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PopupEdit>
  );
};

const TabClient = React.memo((props) => {
  const router = useRouter();
  return (
    <button
      style={props.style}
      onClick={props.onClick}
      className={`${props.className} ${
        router.query?.tab === `${props.active}` ? "bg-blue-400 text-white" : ""
      } justify-center 3xl:w-[230px] 2xl:w-[180px] xl:w-[160px] lg:w-[140px] 3xl:h-10 2xl:h-8 xl:h-8 lg:h-7 3xl:text-[16px] 2xl:text-[14px] xl:text-[14px] lg:text-[12px] flex gap-2 items-center rounded-md px-2 py-2 outline-none`}
    >
      {router.query?.tab === `${props.active}` && (
        <TiTick size="20" color="white" />
      )}
      {props.children}
    </button>
  );
});

const MoreSelectedBadge = ({ items }) => {
  const style = {
    marginLeft: "auto",
    background: "#d4eefa",
    borderRadius: "4px",
    fontSize: "14px",
    padding: "1px 3px",
    order: 99,
  };

  const title = items.join(", ");
  const length = items.length;
  const label = `+ ${length}`;

  return (
    <div style={style} title={title}>
      {label}
    </div>
  );
};

const MultiValue = ({ index, getValue, ...props }) => {
  const maxToShow = 3;
  const overflow = getValue()
    .slice(maxToShow)
    .map((x) => x.label);

  return index < maxToShow ? (
    <components.MultiValue {...props} />
  ) : index === maxToShow ? (
    <MoreSelectedBadge items={overflow} />
  ) : null;
};
export default Index;
