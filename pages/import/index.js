import React, {useState, useRef, useEffect, useMemo} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {_ServerInstance as Axios} from '/services/axios';
const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});

import ReactExport from "react-data-export";



import Swal from 'sweetalert2'

import * as XLSX from 'xlsx';

import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';

import {NumericFormat} from "react-number-format";


import { Edit as IconEdit,  Grid6 as IconExcel, Trash as IconDelete, SearchNormal1 as IconSearch,Add as IconAdd, LocationTick, User, Add, ArrowCircleDown, FilterRemove, ArrowRight  } from "iconsax-react";
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import Pagination from '/components/UI/pagination';
import dynamic from 'next/dynamic';
import moment from 'moment/moment';
import Select,{components } from 'react-select';
import Popup from 'reactjs-popup';
import { data } from 'autoprefixer';
import TabFilter from 'components/UI/TabFilter';

import {TiTick} from 'react-icons/ti'

import { getData } from 'components/UI/dataExcel';
import { Joan } from '@next/font/google';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
})



const Index = (props) => {

    const dataLang = props.dataLang
    const router = useRouter();
    const tabPage = router.query?.tab;

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
    const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };
    const dataExcel = getData()

    const _HandleSelectTab = (e) => {
      router.push({
          pathname: router.route,    
          query: { tab: e }
      })
    }

    useEffect(() => {
      router.push({
          pathname: router.route,    
          query: { tab: router.query?.tab ? router.query?.tab : 1  }
      })
    }, []);

    const [valueCheck, sValueCheck] = useState('add')
    const [condition_column, sCondition_column] = useState(null)

    const [errValueCheck, sErrValueCheck] = useState(false)

    const [dataImport, sDataImport] = useState([]);


    const [onFetching, sOnFetching] = useState(false);
    const [onSending, sOnSending] = useState(false);
    const [onLoading, sOnLoading] = useState(false);
    const [onLoadingListData, sOnLoadingListData] = useState(false);

    const [errFiles, sErrFiles] = useState(false);
    const [errColumn, sErrColumn] = useState(false);

    const [errFileImport, sErrFileImport] = useState(false);

    const [row_tarts, sRow_starts] = useState(null)
    const [end_row, sEnd_row] = useState(null)

    const [dataClient, sDataClient] = useState([]) 
    const [dataColumn, sDataColumn] = useState([]) 
    const [dataConditionColumn, sDataConditionColumn] = useState([]) 
    const [dataSampleImport, sDataSampleImport] = useState([]) 
    const [save_template, sSave_template] = useState(null) 
    const [sampleImport, sSampleImport] = useState(null) 

    const [dataFail, sDataFail] = useState([])
    const [totalFalse, sTotalFalse] = useState(null)


    const [listData, sListData] = useState([])
    const [listDataContact, sListDataContat] = useState([])

    const [multipleProgress, sMultipleProgress] = useState(0);
    const [fileImport, sFileImport] = useState(null)

    const _ServerFetching = async () => {

      sOnLoading(true)
      await  Axios("GET", `/api_web/${(tabPage === "1" ? "/Api_import_data/get_field_client?csrf_protection=true" : '')}`, {
        }, (err, response) => {
            if(!err){
                var db =  response.data
                sDataClient(db?.map(e => ({label: dataLang[e?.label], value: e?.value})))
            }
            sOnLoading(false)
        })

      await Axios("GET", `/api_web/${(tabPage === "1" ? "/Api_import_data/get_colums_excel?csrf_protection=true" : '')}`, {
        }, (err, response) => {
            if(!err){
                var db =  response.data
                sDataColumn(db?.map(e => ({label: e, value: e})))
            }
            sOnLoading(false)

        })

      await  Axios("GET", `/api_web/${(tabPage === "1" ? "/Api_import_data/get_field_isset?csrf_protection=true" : '')}`, {
        }, (err, response) => {
            if(!err){
                var db =  response.data
                sDataConditionColumn(db?.map(e => ({label: dataLang[e?.label] || e?.label,  value: e?.value})))
            }
            sOnLoading(false)

        })

      await Axios("GET", `/api_web/${(tabPage === "1" ? "/Api_import_data/get_template_import?csrf_protection=true" : '')}`, {
        }, (err, response) => {
            if(!err){
                var db =  response.data
                sDataSampleImport(db?.map(e => ({label: e?.code, value: e?.id, date: moment(e?.date_create).format('DD/MM/YYYY'), setup_colums: e?.setup_colums})))
            }
            sOnLoading(false)
        })
        sOnFetching(false)
    }


    useEffect(() => {
      onFetching && _ServerFetching() 
    }, [onFetching]);
    useEffect(() => {
        router.query.tab && sOnFetching(true) 
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
      setTimeout(()=>{
        listData && sOnLoadingListData(false)
      },1000)
    },[listData])


    const _HandleChange =  (type, value) =>{
      if(type == "valueAdd"){
        sValueCheck('add')
      }else if(type == "valueUpdate"){
        sValueCheck('edit')
      }else if(type == "condition_column"){
        sCondition_column(value)
      }else if(type == "save_template"){
        sSave_template(value?.target.checked)
      }else if(type == "sampleImport"){
        sSampleImport(value)
        sOnLoadingListData(true)
        const dataBackup = value ? JSON?.parse(value?.setup_colums)?.map(e => JSON?.parse(e)) : []
        sListData(dataBackup)
      }else if(type == "row_tarts"){
        sRow_starts(Number(value?.value))
        var fname = document.getElementById('importFile').files[0]
         _HandleChangeFileImportNew(fname, Number(value?.value), end_row)
      }else if(type == "end_row"){
        sEnd_row(Number(value?.value))
          var fname = document.getElementById('importFile').files[0]
          _HandleChangeFileImportNew(fname,row_tarts, Number(value?.value))
      }else if(type == "importFile"){
          sFileImport(value?.target.files[0])
          var fname = document.getElementById('importFile').files[0]
          _HandleChangeFileImportNew(fname,row_tarts, end_row)
      }
    }
  
    const _HandleChangeFileImportNew =   (file, startRowIndex2, endRow) => {
      // const file = e.target.files[0];

      //đọc file exl
        if(!file) return
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary",cellDates: true, cellText: false});
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          const startRows = parseInt(startRowIndex2) || 1; // Hàng bắt đầu, mặc định là 1
          const endRows = parseInt(endRow) || XLSX.utils.sheet_to_json(sheet,{header: 1,}).length; // Hàng kết thúc, mặc định là số hàng cuối cùng trong sheet
          const jsonData = [];
        // for (let cell in sheet) {
        //   if (cell[0] === '!') continue;
        //   const col = cell.replace(/[0-9]/g, ''); // Lấy tên cột từ tên ô (ví dụ: 'A1' -> 'A')
        //   const rowIndex = parseInt(cell.replace(/\D/g, '')) - 1;
        //   const cellValue = sheet[cell].v;
        //   console.log("row_tarts",rowIndex);
        //   if (rowIndex < startRow - 1 || rowIndex > endRow - 1) continue; // Bỏ qua các hàng không nằm trong khoảng bắt đầu và kết thúc
    
        //   if (!jsonData[rowIndex]) {
        //     jsonData[rowIndex] = { [col]: cellValue };
        //   } else {
        //     jsonData[rowIndex][col] = cellValue;
        //   }
        // }
  
          const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1,  raw: false, dateNF: 'yyyy-mm-dd'});

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
              rowData['rowIndex'] = rowIndex;
            }
            jsonData.push(rowData);
          }

         setTimeout(() =>{
          sDataImport(jsonData);
         },0)

      };
    };



    //change trường dữ liệu, cột dữ liệu
    const _HandleChangeChild = (childId, type, value) => {
      const newData = listData.map(e => {
       if(e?.id == childId){
          if(type == "data_fields"){
              const checkData = listData?.some(e => e?.dataFields?.value === value?.value)
              if(!checkData){
                return {...e, dataFields: value}
              }else{
                Toast.fire({
                  title: `${dataLang?.import_ERR_selected || "import_ERR_selected"}`,
                  icon: 'error',
                })
              }
              return {...e}
          }else if(type == "column"){
            const checkData = listData?.some(e => e?.column?.value === value?.value)
              if(!checkData){
                return {...e, column: value}
              }else{
                Toast.fire({
                  title: `${dataLang?.import_ERR_selectedColumn || "import_ERR_selectedColumn"}`,
                  icon: 'error',
                })
              }
               return {...e}
          }
       }else{
        return e;
      }
      })
      sListData([...newData])
    }
 
    //Thêm cột phần khách hàng
    const _HandleAddParent = (value) => {
        const newData = { 
          id: Date.now(), 
          dataFields: null, 
          column: null,
        }
        sListData([newData,...listData]);
    }

    //them liên hệ
    const _HandleAddContact = (value) => {
        const newData = { 
          id: Date.now(), 
          // dataFields: value, 
          // column: value, 
        }
        sListDataContat([newData,...listDataContact]);
    }

    //xóa cột khách hàng
    const _HandleDelete =  (id) => {
        const newData = listData.filter(x => x.id !== id); // loại bỏ phần tử cần xóa
        sListData(newData); // cập nhật lại mảng
      }

    //xóa cột kliên hệ
    const _HandleDeleteContact =  (id) => {
        const newData = listDataContact.filter(x => x.id !== id); // loại bỏ phần tử cần xóa
        sListDataContat(newData); // cập nhật lại mảng
      }
       
   //navbar
      const dataTab = [
        {
          id: 1,
          name: "Khách hàng"
        },
        {
          id: 2,
          name: "Nhà cung cấp"
        },
        {
          id: 3,
          name: "Nguyên vật liệu"
        },
        {
          id: 4,
          name: "Thành phẩm"
        },
        {
          id: 5,
          name: "Người dùng"
        }
      ]

      // validate dữ liệu rồi post
      const _HandleSubmit = (e) => {

        e.preventDefault();

        const hasNullDataFiles = listData.some(e => e?.dataFields === null);

        const hasNullColumn = listData.some(e => e?.column === null);

        const hasNoNameField = !listData.some((item) => item?.dataFields?.value === "name");

        const hasNoBranchField = !listData.some((item) => item?.dataFields?.value === "branch_id");
        
        const hasNullDataImport = dataImport?.length == 0

        const requiredColumn = listData?.length == 0

        if(hasNullDataFiles || hasNullColumn || (valueCheck == 'edit' && condition_column == null) || hasNullDataImport || requiredColumn || hasNoNameField || hasNoBranchField){
          hasNullDataFiles  && sErrFiles(true)
          hasNullColumn  && sErrColumn(true)
          condition_column == null && sErrValueCheck(true)
          hasNullDataImport && sErrFileImport(true)

          //bắt buộc phải thêm cột
          if(requiredColumn){
            Toast.fire({
              icon: 'error',
              title: `${dataLang?.import_ERR_add_column || "import_ERR_add_column"}`
          })
          }
          //bắt buộc phải có cột tên khách hàng
           else if(hasNoNameField){
              Toast.fire({
                icon: 'error',
                title: `${dataLang?.import_ERR_add_nameData || "import_ERR_add_nameData"}`
            })
            }
            //bắt buộc phải có cột chi nhánh
            else if(hasNoBranchField){
              Toast.fire({
                icon: 'error',
                title: `${dataLang?.import_ERR_add_branchData || "import_ERR_add_branchData"}`
            })
            }
            else{
              Toast.fire({
                icon: 'error',
                title: `${dataLang?.required_field_null}`
            })
            }
          }
          else {
              sErrFileImport(false)
              sOnSending(true)
          }
        }

        
        useEffect(() =>{
            sErrValueCheck(false)
        },[condition_column != null])
      


          
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
          const data = dataImport?.filter(item => item.rowIndex != null && item.rowIndex != '').map((item) => {

            const result = {};
  
            for (const listDataItem of listData) {
  
              const columnValue = listDataItem.column?.value;
              const dataFieldsValue = listDataItem.dataFields?.value;
              if (columnValue && item[columnValue]) {
                result[dataFieldsValue] = item[columnValue];
              }
              if (listDataItem?.dataFields && listDataItem?.dataFields.label && listDataItem?.dataFields?.value && item[listDataItem?.dataFields?.label]) {
                const fieldKey = listDataItem?.dataFields?.value;
                const fieldValue = item[listDataItem?.dataFields?.label];
                result[fieldKey] = fieldValue;
              }
            }
            // if(JSON.stringify(result) != "{}"){
            //   result['rowIndex'] = item.rowIndex ? Number(item.rowIndex) + 1 : item.rowIndex == 0 ? 1 : null;
            // }
            // return result;
            if (Object.keys(result).length > 0) {
              result['rowIndex'] = item.rowIndex ? Number(item.rowIndex) + 1 : item.rowIndex == 0 ? 1 : null;
              return result;
            }
        
            return null; 
          }).filter(item => item !== null);


          const chunkSize = 50; // Kích thước mỗi mảng con
          const dataChunks = [];
          // Chia nhỏ mảng data thành các mảng con có kích thước chunkSize
          for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            dataChunks.push(chunk);
          }
          for (const data  of dataChunks) {
            Axios("POST",`/api_web/Api_import_data/action_add_client?csrf_protection=true`, {
              data:{
                data ,
                "event": valueCheck,
                "field_where_update": condition_column?.value,
              },
              headers: {"Content-Type": "multipart/form-data"} ,
              onUploadProgress: (progressEvent) => {
               const {loaded, total} = progressEvent;
               const percentage = Math.floor(((loaded / 1000) * 100) / (total / 1000));
               sMultipleProgress(percentage);
             }
            }, (err, response) => {
              if(!err){
                    var {lang_message, data_fail, fail, success} = response.data;
                    sDataFail(data_fail)
                    sTotalFalse(fail)
                    if(success){
                        if(success == 0){
                          Toast.fire({
                            icon: 'success',
                            title: `${dataLang[lang_message?.success]}`
                        })
                      }
                    } 
                   if(fail > 0){
                      Toast.fire({
                        icon: 'error',
                        title: `${dataLang[lang_message?.fail]}`
                      })
                    }
                   
                }
                sOnSending(false)
                sMultipleProgress(0)
            })
          }
        };

        //Lưu mẫu import
        const _ServerSendingImporTemplate = () => {
          var formData = new FormData();
          listData.forEach((e,index) => {
            formData.append(`setup_colums[${index}]`, JSON.stringify(e))
          })
          
          Axios("POST", `${"/api_web/Api_import_data/add_tempate_import?csrf_protection=true"}`, {
              data: formData,
              headers: {'Content-Type': 'multipart/form-data'}
          }, (err, response) => {
              if(!err){
                  var {isSuccess, message} = response.data
                  if(isSuccess){
                    Toast.fire({
                      icon: 'success',
                      title: `${dataLang[message]}`
                    })
                    
                  }else {    
                      Toast.fire({
                        icon: 'error',
                        title: `${message}`
                      })
                    
                  }
              }
              sOnSending(false)
          })
      }
        
        
      useEffect(() =>{
        onSending && save_template  && _ServerSendingImporTemplate()
      },[onSending])

      useEffect(() =>{
        onSending && _ServerSending()
      },[onSending])



    return (
        <React.Fragment>
      <Head>
        <title>{dataLang?.import_data || "import_data"}</title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 ">
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">{dataLang?.import_data || "import_data"}</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{dataLang?.import_category || "import_category"}</h6>
        </div>
        <Popup_status dataLang={dataLang} className=""  data={dataFail} totalFalse={totalFalse} listData={listData}/>
        <div className="">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
              <h2 className="text-2xl text-[#52575E] capitalize">{dataLang?.import_catalog || "import_catalog"}</h2>
            


             <div className='grid grid-cols-12 items-center justify-center mx-auto space-x-3'>
                  <div className='col-span-2'></div>
                  <div  className="col-span-8 grid-cols-5 grid items-center overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                     {dataTab && dataTab.map((e)=>{
                          return (
                           <div>
                              <TabClient
                                key={e.id} 
                                onClick={_HandleSelectTab.bind(this, `${e.id}`)} 
                                active={e.id} 
                                className='text-[#0F4F9E] col-span-1 bg-[#e2f0fe] hover:bg-blue-400 hover:text-white transition ease-in-out '
                              >{e.name}</TabClient> 
                            </div>
                          )
                      })
                     }
              </div>
                  <div className='col-span-2'></div>



                  <div className='col-span-2'></div>
                  <div className='col-span-8 border-b'>
                      <h2 className='py-2'>{router.query?.tab == 1  && (dataLang?.import_client || "import_client") ||
                        router.query?.tab == 2  && (dataLang?.import_suppliers || "import_suppliers") ||
                        router.query?.tab == 3  && (dataLang?.import_materials || "import_materials") ||
                        router.query?.tab == 4  && (dataLang?.import_finished_product || "import_finished_product") ||
                        router.query?.tab == 5  && (dataLang?.import_user || "import_user")
                        }
                      </h2>
                  </div>
                  <div className='col-span-2'></div>


                  <div className='col-span-2'></div>
                  <div className='col-span-4 mb-2 mt-2'>
                     <h5  className="mb-1 block text-sm font-medium text-gray-700">{dataLang?.import_form || "import_form"}</h5>
                      <Select   
                          closeMenuOnSelect={true}
                          placeholder={dataLang?.import_form || "import_form"}
                          options={dataSampleImport}
                          isLoading={sampleImport != null ? false : onLoading}
                          formatOptionLabel={(option) => (
                            <div className='flex justify-start items-center gap-1 '>
                                <h2 className='font-medium'>{option?.label} <span className='italic text-sm'>{`(${option?.date})`}</span></h2>
                            </div>
                            )}
                          isSearchable={true}
                          onChange={_HandleChange.bind(this, "sampleImport")}
                          value={sampleImport}
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
                        className="border-transparent text-sm placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border " 
                        />
                      
                      {/* {errListObject && <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{props.dataLang?.payment_errListOb || "payment_errListOb"}</label>} */}
                  </div>
                  <div className='col-span-4 mb-2 mt-2'>
                        <h5  className="mb-1 block text-sm font-medium text-gray-700">{dataLang?.import_operation || "import_operation"}</h5>
                          <div>
                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <li className="w-full border-b  cursor-pointer hover:bg-pink-600 group overflow-hidden transform  transition duration-300 ease-in-out border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                    <div className="flex cursor-pointer items-center pl-3">
                                        <input id="horizontal-list-radio-license" type="radio"  value={valueCheck} checked={valueCheck == 'add'} onChange={_HandleChange.bind(this, "valueAdd")} name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                        <label htmlFor="horizontal-list-radio-license" className="w-full py-2 cursor-pointer ml-2 text-sm font-medium text-gray-900 group-hover:text-white transition-all ease-in-out dark:text-gray-300">{dataLang?.import_more || "import_more"}</label>
                                    </div>
                                </li>
                                <li className="w-full border-b  cursor-pointer hover:bg-pink-600 group overflow-hidden transform  transition duration-300 ease-in-out border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                    <div className="flex cursor-pointer items-center pl-3">
                                        <input id="horizontal-list-radio-id" type="radio" value={valueCheck} checked={valueCheck == "edit"} onChange={_HandleChange.bind(this, "valueUpdate")} name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                        <label htmlFor="horizontal-list-radio-id" className="w-full py-2 cursor-pointer ml-2 text-sm font-medium text-gray-900 group-hover:text-white transition-all ease-in-out dark:text-gray-300">{dataLang?.import_update || "import_update"}</label>
                                    </div>
                                </li>
                              
                            </ul>
                          </div>

                  </div> 
                  <div className='col-span-2'></div>
                  
                  <div className='col-span-2'></div>
                  <div className='col-span-4'>
                          {
                            (valueCheck === 'edit') ? (<>
                              <h5  className="mb-1 block text-sm font-medium text-gray-700">{dataLang?.import_condition_column || "import_condition_column"}<span className='text-red-500'>*</span></h5>
                              <Select   
                              closeMenuOnSelect={true}
                              placeholder={dataLang?.import_condition_column || "import_condition_column"}
                              isLoading={onLoading}
                              options={dataConditionColumn}
                              isSearchable={true}
                              onChange={_HandleChange.bind(this, "condition_column")}
                              value={condition_column}
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
                            className={`${errValueCheck ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `} 
                            // className="border-transparent text-sm placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border " 
                            />
                            {errValueCheck && <label className="text-sm text-red-500">{dataLang?.import_ERR_condition_column || "import_ERR_condition_column"}</label>}
                            </>):""
                          }

                  </div>
                  <div className='col-span-4'></div>
                  <div className='col-span-2'></div>


                  <div className='col-span-2'></div>
                  <div className='col-span-4'>
                      <label for="importFile" className="block text-sm font-medium mb-2 dark:text-white">{dataLang?.import_file || "import_file"}</label>
                      <label for="importFile"  className={`${errFileImport && dataImport.length == 0 ? "border-red-500" : "border-gray-200"} " border-gray-200 flex w-full cursor-pointer p-2 appearance-none items-center justify-center rounded-md border-2 border-dashed  transition-all hover:border-blue-300"`}>
                        <input accept='.xlsx, .xls'   id="importFile" onChange={_HandleChange.bind(this, 'importFile')} type="file" className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:py-0.5 file:px-5 file:text-[13px] file:font-semibold file:text-white hover:file:bg-primary-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60" />
                      </label>
                        {errFileImport && dataImport.length == 0 && <label className="text-sm text-red-500">{dataLang?.import_ERR_file || "import_ERR_file"}</label>}
                  </div>
                  <div className='col-span-4 grid grid-cols-4 space-x-2.5'>
                      <div className='mx-auto w-full col-span-2'>
                          <label htmlFor="input-label" className="block text-sm font-medium mb-2 dark:text-white">{dataLang?.import_line_starts || "import_line_starts"}</label>
                          {/* <input  value={row_tarts} 
                          onChange={_HandleChange.bind(this, 'row_tarts')}
                           type="text" id="input-label" className="py-2.5 outline-none px-4 border block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder={"Hàng bắt đầu"}/>     */}
                            <NumericFormat
                              className="py-2.5 outline-none px-4 border block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                              onValueChange={_HandleChange.bind(this, "row_tarts")}
                              value={row_tarts} 
                              allowNegative={false}
                              decimalScale={0}
                              isNumericString={true}  
                              thousandSeparator=","
                              placeholder={dataLang?.import_line_starts || "import_line_starts"}
                              // isAllowed={(values) => { const {floatValue} = values; return floatValue > 0 }}       
                              />
                      </div>
                      <div className='mx-auto w-full col-span-2'>
                          <label for="input-labels" className="block text-sm font-medium mb-2 dark:text-white">{dataLang?.import_finished_row || "import_finished_row"}</label>
                          {/* <input  value={end_row} onChange={_HandleChange.bind(this, 'end_row')} type="text" id="input-labels" className="py-2.5 outline-none px-4 border block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder={"Hàng kết thúc"}/>     */}
                          <NumericFormat
                            className="py-2.5 outline-none px-4 border block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                            onValueChange={_HandleChange.bind(this, "end_row")}
                            value={end_row} 
                            allowNegative={false}
                            decimalScale={0}
                            isNumericString={true}  
                            thousandSeparator=","
                            placeholder={dataLang?.import_finished_row || "import_finished_row"}
                            // isAllowed={(values) => { const {floatValue} = values; return floatValue > 0 }}       
                            />
                      </div>
                  </div>
                  <div className='col-span-2'></div>


              
                  <div className='col-span-2'></div>
                  <div className='col-span-4 -mt-2'>
                    <div className='grid grid-cols-12 gap-2.5'>
                         {/* <div className='col-span-1'></div> */}
                        <div className='col-span-12'>
                            <div className="b  flex items-center justify-center w-full  pt-5">
                                  <button onClick={_HandleAddParent.bind(this)} className="i flex justify-center gap-2 bg-pink-600 w-full text-center py-2 text-white items-center rounded shadow-xl cursor-pointer hover:scale-[1.02]  overflow-hidden transform  transition duration-300 ease-out">
                                  <Add
                                    size="20"
                                    color="red"
                                    className='bg-gray-50 rounded-full '
                                    />
                                    <p className='text-sm'>{dataLang?.import_more_collum || "import_more_collum"}</p>
                                  </button>
                             </div>
                        </div>
                    </div>          
                  </div>

                  <div className='col-span-4'></div>
                  <div className='col-span-2'></div>


                  <div className='col-span-2'></div>
                  <div className={`${listData?.length > 2 ? "mt-3" : ""} ${onLoadingListData ? "col-span-8": "col-span-6"}`}>
               
                  {onLoadingListData ? <Loading className="h-2"color="#0f4f9e"/> :
                    listData?.map((e,index) =>
                      <div className='grid grid-cols-6 gap-2.5 mb-2'>
                      <div className='col-span-4'>
                          <div className='grid-cols-13 grid items-end justify-center gap-2.5'>
                              <div className='col-span-1 mx-auto'>
                              <button onClick={_HandleDelete.bind(this, e?.id)}  className="xl:text-base text-xs hover:scale-105 transition-all ease-in-out "><IconDelete color="red"/></button>
                              </div>
                              <div className='col-span-6'>
                                      {index ==0 &&<h5  className="mb-1 block text-sm font-medium text-gray-700">{dataLang?.import_data_fields || "import_data_fields"} <span className='text-red-500'>*</span></h5>}
                                        <Select   
                                        closeMenuOnSelect={true}
                                        placeholder={dataLang?.import_data_fields || "import_data_fields"}
                                        options={dataClient}
                                        isSearchable={true}
                                        onChange={_HandleChangeChild.bind(this, e?.id, "data_fields")}
                                        value={e.dataFields}
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
                                      className={`${errFiles && e.dataFields == null ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `} 
                                      // className="border-transparent  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  text-sm font-normal outline-none border " 
                                      />
                              </div>
                              <div className='col-span-6'>
                              {index ==0 &&<h5  className="mb-1 block text-sm font-medium text-gray-700">{dataLang?.import_data_column || "import_data_column"}<span className='text-red-500'>*</span></h5>}
                                        <Select   
                                        closeMenuOnSelect={true}
                                        placeholder={dataLang?.import_data_column ||"import_data_column"}
                                        options={dataColumn}
                                        isSearchable={true}
                                        // onChange={_HandleChange.bind(this, "column")}
                                        onChange={_HandleChangeChild.bind(this, e?.id, "column")}
                                        value={e?.column}
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
                                      className={`${errColumn && e?.column == null ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `} 
                                      // className="border-transparent  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  text-sm font-normal outline-none border " 
                                      />
                              </div>
                          </div>
                      </div>
                          <div className='col-span-2 '>
                              {index ==0 &&<h5  className="mb-1 block text-sm font-medium text-gray-700 opacity-0">{dataLang?.import_operation || "import_operation"}</h5>}
                                    {e?.dataFields?.value=="group_id"?
                                    <div className="flex items-center space-x-2 rounded p-2 ">
                                      <TiTick color='green'/>
                                      <label for="example11" className="flex w-full space-x-2 text-sm">{dataLang?.import_add || "import_add"}</label>
                                    </div>:""
                               }
                          </div>
                        </div>
                    )
                  }
                  </div>
                  {
                    !onLoadingListData &&
                    <div className='col-span-2 flex items-center justify-center mt-5'>
                    {listData.length > 0 && 
                      <div className={`${listData.length < 2 ? "mt-4":""}`}>
                      <CircularProgressbar
                      className='text-center'
                              value={multipleProgress}
                              strokeWidth={10}
                              text={`${multipleProgress}%`}
                              // classes={`text: center`}
                              styles={buildStyles({
                              rotation: 0.25,
                              strokeLinecap: 'butt',
                              textSize: '16px',
                              pathTransitionDuration: 0.5,
                              pathColor: `rgba(236, 64, 122, ${multipleProgress / 100})`,
                              // pathColor: `red`,
                              textColor: '#ef4444',
                              textAnchor: 'middle',
                              trailColor: '#d6d6d6',
                              backgroundColor: '#3e98c7',
                              
                          })}
                        />
                      </div>
                    }
                  </div>
                  }
                  <div className='col-span-2'></div>


               

                  <div className='col-span-2'></div>
                  <div className='col-span-8 border-b'></div>
                  <div className='col-span-2'></div>



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


                  <div className='col-span-2'></div>
                  <div className='col-span-8 grid-cols-4 grid gap-2.5 mt-4'>
                        {
                          listDataContact?.map(e =>
                              <div className='relative'>
                              <Select   
                                  closeMenuOnSelect={true}
                                  placeholder={"Thêm các trường tự động"}
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
                                className="border-transparent   placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  text-sm font-normal outline-none border " 
                                />
                                <button onClick={_HandleDeleteContact.bind(this, e?.id)}  className="-top-[25%] bg-slate-200 rounded-xl p-0.5 -right-[3%] absolute xl:text-base text-xs hover:scale-105 transition-all ease-in-out "><IconDelete size={20} color="red"/></button>
                              </div>
                            )
                        }
                  </div>
                  <div className='col-span-2'></div>

                  <div className='col-span-4'></div>
                  <div className='col-span-4 mt-2 grid-cols-2 grid gap-2.5'>
                  <div className="flex items-center  space-x-2 rounded p-2 hover:bg-gray-200 bg-gray-100 cursor-pointer btn-animation hover:scale-[1.02]">
                                  <input type="checkbox" onChange={_HandleChange.bind(this, 'save_template')} checked={save_template} value={save_template} id="example11" name="checkGroup1" className="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400" />
                                  <label  htmlFor="example11" className=" space-x-2 text-sm cursor-pointer">{dataLang?.import_save_template || "import_save_template"}</label>
                                </div>
                    <button 
                    onClick={_HandleSubmit.bind(this)} 
                   type="submit" className="xl:text-sm text-xs w-full p-2.5 bg-gradient-to-l hover:bg-blue-300 from-blue-500 via-blue-500  to-blue-500 text-white rounded btn-animation hover:scale-[1.02]">{"Import"}</button>
                  </div>
                  <div className='col-span-4 '></div>

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
}

const Popup_status = (props) => {

  const dataLang = props?.dataLang
  const [open, sOpen] = useState(false);
  const [sroll, sSroll] = useState(false);
  const [repositionOnResiz, sRepositionOnResiz] = useState(false);
  const [data_ex, sData_ex] = useState([])


  useEffect(() => {
    sData_ex(props.data)
    props?.totalFalse > 0 && sOpen(true)
    props?.totalFalse > 0 && sSroll(true)
    props?.totalFalse > 0 && sRepositionOnResiz(true)
  },[props.data, props.totalFalse])
   
  const {values, columns} = useMemo(()=>{

    const arrayFormater = props.data?.map(e => 
      {
        if(e?.date_incorporation){
          return {...e, date_incorporation: e?.date_incorporation ? moment(e?.date_incorporation).format('DD/MM/YYYY')  : ''}
        }
        return {...e}
      }
    )

    const newArr = (arrayFormater || []).filter(Boolean).map(e => {
      const { rowIndex, error, ...newObject } = e;
      return newObject;
    });

    const mappedData = newArr.map(item => {
      const rowData = {};
      props?.listData.forEach(column => {
        const value = item[column.dataFields.value];
        rowData[column.dataFields.value] = value || '';
      });
      return rowData;
    });

    
    const columns =  props?.listData?.map((header) => ({
      
      title: `${header?.dataFields?.label}`, width: {wpx: 150}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}
      
    })).reverse();
    
    const values = mappedData.map(i =>  Object.values(i)?.map(e => ({value: e , style: e == '' ? {fill: {patternType: "solid", fgColor: {rgb: "FFCCEEFF"}}}:''})).reverse());

    return { values, columns }

  },[props.data, props?.listData])


  const multiDataSet = [ { columns: columns, data: values} ];



return(
  <PopupEdit  
    title={<span className='text-red-500 capitalize'>{`${dataLang?.import_total_detection || "import_total_detection"} ${props?.totalFalse} ${dataLang?.import_error || "import_error"}`} </span>} 
    open={open} 
    onClose={() => sOpen(false)}
    classNameBtn={props.className}
    lockScroll={sroll}
    repositionOnResiz={repositionOnResiz}
  >
    <div className="mt-4 space-x-5 w-[590px] h-auto">        
      <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <div className='flex items-center justify-between p-1 bg-gray-50'>
            <div className='flex items-center gap-2'>
              <h2 className="text-lg text-[#52575E] font-semibold">{dataLang?.import_detailed_error || "import_detailed_error"}</h2>  
              <FilterRemove
                  size="20"
                  color="red"
                  className='transition-all animate-pulse'
                /> 
            </div> 
            <ExcelFile filename={dataLang?.import_error_data || "import_error_data"} title="DLL" element={
                  <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition'>
                    <IconExcel size={18} /><span>{props.dataLang?.client_list_exportexcel}</span></button>}>
                    <ExcelSheet 
                    dataSet={multiDataSet} data={multiDataSet}
                    name="Organization" />
            </ExcelFile>
        </div>
        <div className="pr-2 w-[100%] lx:w-[110%] ">
                <div className={`grid-cols-12  grid sticky top-0 bg-white shadow-lg  z-10`}>
                </div>
                {
                  data_ex.length > 0 ? 
                  (<>
                       <ScrollArea className="min-h-[90px] max-h-[400px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                        <div className=" divide-slate-200 min:h-[170px]  max:h-[170px]">                       
                          {(data_ex.map((e) => 
                            <div className="grid grid-cols-12 hover:bg-slate-50 items-center border-b" key={e.id?.toString()}>
                                  <h6 className="text-[13px] col-span-12    py-2.5 text-left flex items-center gap-1">
                                  <ArrowRight
                                    size="18"
                                    color="red"
                                    className='transition-all animate-pulse'
                                    />
                                    <h6 className='text-blue-500 font-semibold'>Dòng {e?.rowIndex}</h6>
                                    <h6>-</h6>
                                    {
                                      e?.error?.map((e,index,array) => 
                                        <div key={e} className='flex gap-1 items-center '>
                                          <h6 className={`${e.includes('*') ? 'text-blue-500 font-bold' : 'text-black-500 font-semibold'} text-[13px] col-span-12     py-2.5 text-left "`}> {dataLang[e] || e?.replace('*', '') || e}{index === array.length - 1 && '.'}</h6>
                                        </div>                
                                      )
                                    }              
                                  </h6>  
                            </div>
                          ))}              
                        </div>   
                      </ScrollArea>                       
                    </>
                  )  : 
                  (
                    <div className=" max-w-[352px] mt-24 mx-auto" >
                      <div className="text-center">
                        <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                        <h1 className="textx-[#141522] text-base opacity-90 font-medium">{props.dataLang?.purchase_order_table_item_not_found || "purchase_order_table_item_not_found"}</h1>
                        <div className="flex items-center justify-around mt-6 ">
                        </div>
                      </div>
                    </div>
                  )}    
              </div>
      </div>
    </div>
  </PopupEdit>
)
}


const TabClient = React.memo((props) => {
    const router = useRouter();
    return(
      <button  style={props.style} onClick={props.onClick} className={`${props.className} ${router.query?.tab === `${props.active}` ? "bg-blue-400 text-white":""} justify-center 3xl:w-[200px] 2xl:w-[180px] xl:w-[160px] lg:w-[140px] 3xl:h-10 2xl:h-8 xl:h-8 lg:h-7 3xl:text-[16px] 2xl:text-[14px] xl:text-[14px] lg:text-[12px] flex gap-2 items-center rounded-md px-2 py-2 outline-none`}>
        { router.query?.tab === `${props.active}` && <TiTick   size="20" color="white" />}
        {props.children}
      </button>

    )
  })


const MoreSelectedBadge = ({ items }) => {
  const style = {
      marginLeft: "auto",
      background: "#d4eefa",
      borderRadius: "4px",
      fontSize: "14px",
      padding: "1px 3px",
      order: 99
  };

  const title = items.join(", ");
  const length = items.length;
  const label = `+ ${length}`;

  return (
    <div style={style} title={title}>{label}</div>
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