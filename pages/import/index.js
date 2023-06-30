import React, {useState, useRef, useEffect} from 'react';
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


import { Edit as IconEdit,  Grid6 as IconExcel, Trash as IconDelete, SearchNormal1 as IconSearch,Add as IconAdd, LocationTick, User, Add, ArrowCircleDown  } from "iconsax-react";
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


    const [thumb, sThumb] = useState(null);
    const [dataImport, sDataImport] = useState([]);

    const [stemp, sStemp] = useState()

    const [onFetching, sOnFetching] = useState(false);
    const [onSending, sOnSending] = useState(false);

    const [errFiles, sErrFiles] = useState(false);
    const [errColumn, sErrColumn] = useState(false);

    const [errFileImport, sErrFileImport] = useState(false);

    const [row_tarts, sRow_starts] = useState(null)
    const [end_row, sEnd_row] = useState(null)

    const [dataClient, sDataClient] = useState([]) 
    const [dataColumn, sDataColumn] = useState([]) 

    const [listData, sListData] = useState([])
    const [listDataContact, sListDataContat] = useState([])

    const [multipleProgress, sMultipleProgress] = useState(0);


    const _ServerFetching =  () => {
        // Axios("GET", `/api_web/${(tabPage === "0" || tabPage === "-1") ? "api_client/client?csrf_protection=true" : "api_client/client/?csrf_protection=true"}`, {
        Axios("GET", `/api_web/${(tabPage === "1" ? "/Api_import_data/get_field_client?csrf_protection=true" : '')}`, {
        }, (err, response) => {
            if(!err){
                var db =  response.data
                sDataClient(db?.map(e => ({label: dataLang[e?.label], value: e?.value})))
            }
        })
        Axios("GET", `/api_web/${(tabPage === "1" ? "/Api_import_data/get_colums_excel?csrf_protection=true" : '')}`, {
        }, (err, response) => {
            if(!err){
                var db =  response.data
                sDataColumn(db?.map(e => ({label: e, value: e})))
            }
        })
        sOnFetching(false)
    }


    useEffect(() => {
      onFetching && _ServerFetching() 
    }, [onFetching]);
  useEffect(() => {
      router.query.tab && sOnFetching(true) 
   }, [router.query?.page, router.query?.tab]);

 
  
  
   const [test,sTest] = useState(false)


  
  console.log(dataImport);






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



    const _HandleChange =  (type, value) =>{
      if(type == "valueAdd"){
        sValueCheck('add')
      }else if(type == "valueUpdate"){
        sValueCheck('edit')
      }else if(type == "condition_column"){
        sCondition_column(value)
      }else if(type == "row_tarts"){
        sRow_starts(Number(value?.target.value))
        var fname = document.getElementById('importFile').files[0]
         _HandleChangeFileImportNew(fname, Number(value?.target.value), end_row)
      }else if(type == "end_row"){
        sEnd_row(Number(value?.target.value))
          var fname = document.getElementById('importFile').files[0]
            _HandleChangeFileImportNew(fname,row_tarts, Number(value?.target.value))
      }else if(type == "importFile"){
          var fname = document.getElementById('importFile').files[0]
          _HandleChangeFileImportNew(fname,row_tarts, end_row)
      }
    }
  
    const _HandleChangeFileImportNew =   (file, startRowIndex2, endRow) => {
  
      // const file = e.target.files[0];
        if(!file) return
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const startRows = parseInt(startRowIndex2) || 1; // Hàng bắt đầu, mặc định là 1
          const endRows = parseInt(endRow) || XLSX.utils.sheet_to_json(sheet,{header: 1}).length; // Hàng kết thúc, mặc định là số hàng cuối cùng trong sheet
          const jsonData = [];
      //   // for (let cell in sheet) {
      //   //   if (cell[0] === '!') continue;
      //   //   const col = cell.replace(/[0-9]/g, ''); // Lấy tên cột từ tên ô (ví dụ: 'A1' -> 'A')
      //   //   const rowIndex = parseInt(cell.replace(/\D/g, '')) - 1;
      //   //   const cellValue = sheet[cell].v;
      //   //   console.log("row_tarts",rowIndex);
      //   //   if (rowIndex < startRow - 1 || rowIndex > endRow - 1) continue; // Bỏ qua các hàng không nằm trong khoảng bắt đầu và kết thúc
    
      //   //   if (!jsonData[rowIndex]) {
      //   //     jsonData[rowIndex] = { [col]: cellValue };
      //   //   } else {
      //   //     jsonData[rowIndex][col] = cellValue;
      //   //   }
      //   // }
  
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const startRowIndex = parseInt(startRows) - 1;
        const endRowIndex = parseInt(endRows) - 1;
        const maxRowIndex = sheetData.length - 1;
  
        const rowIndexStart = Math.max(0, startRowIndex);
        const rowIndexEnd = Math.min(maxRowIndex, endRowIndex);
  
        for (let rowIndex = rowIndexStart; rowIndex <= rowIndexEnd; rowIndex++) {
          const row = sheetData[rowIndex];
          const rowData = {};
          for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const col = String.fromCharCode(65 + colIndex);
            rowData[col] = row[colIndex];
          }
          jsonData.push(rowData);
        }

         setTimeout(() =>{
          sDataImport(jsonData);
         },0)
        // Xử lý dữ liệu trong jsonData
      };

      sTest(false)
    };

    const _HandleChangeChild = (childId, type, value) => {
      const newData = listData.map(e => {
       if(e?.id == childId){
          if(type == "data_fields"){
              const checkData = listData?.some(e => e?.dataFields?.value === value?.value)
              if(!checkData){
                return {...e, dataFields: value}
              }else{
                Toast.fire({
                  title: `${"Trường dữ liệu đã được chọn"}`,
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
                  title: `${"Cột dữ liệu đã được chọn"}`,
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
 

    const _HandleAddParent = (value) => {
        const newData = { 
          id: Date.now(), 
          dataFields: null, 
          column: null,
        }
        sListData([newData,...listData]);
    }
    const _HandleAddContact = (value) => {
        const newData = { 
          id: Date.now(), 
          // dataFields: value, 
          // column: value, 
          // find_exactly: true, //tìm chinh xac
          // find_similar: true, //tìm gần giống
          // add_new: true, //Thêm mới
          // skip_line: true, //bỏ qua dòng
        }
        sListDataContat([newData,...listDataContact]);
    }

    const _HandleDelete =  (id) => {
        const newData = listData.filter(x => x.id !== id); // loại bỏ phần tử cần xóa
        sListData(newData); // cập nhật lại mảng
      }

    const _HandleDeleteContact =  (id) => {
        const newData = listDataContact.filter(x => x.id !== id); // loại bỏ phần tử cần xóa
        sListDataContat(newData); // cập nhật lại mảng
      }
       
   
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


      const _HandleSubmit = (e) => {

        e.preventDefault();

        const hasNullDataFiles = listData.some(e => e?.dataFields === null);

        const hasNullColumn = listData.some(e => e?.column === null);

        const hasNullDataImport = dataImport?.length == 0

        if(hasNullDataFiles || hasNullColumn || (valueCheck == 'edit' && condition_column == null) || hasNullDataImport){
          hasNullDataFiles  && sErrFiles(true)
          hasNullColumn  && sErrColumn(true)
          condition_column == null && sErrValueCheck(true)
          hasNullDataImport && sErrFileImport(true)
                Toast.fire({
                    icon: 'error',
                    title: `${dataLang?.required_field_null}`
                })
          }
          else {
              sTest(true)
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



        const _ServerSending = async () => {
          const data = dataImport.map((item) => {
            const result = {};
            for (const listDataItem of listData) {
              const columnValue = listDataItem.column?.value;
              const dataFieldsValue = listDataItem.dataFields?.value;
        
              if (columnValue && item[columnValue]) {
                result[dataFieldsValue] = item[columnValue];
              }
              if (listDataItem.dataFields && listDataItem.dataFields.label && listDataItem.dataFields.value && item[listDataItem.dataFields.label]) {
                const fieldKey = listDataItem.dataFields.value;
                const fieldValue = item[listDataItem.dataFields.label];
                result[fieldKey] = fieldValue;
              }
            }
            return result;
          });
        
          const chunkSize = 50; // Kích thước mỗi mảng con
          const dataChunks = [];
          // Chia nhỏ mảng data thành các mảng con có kích thước chunkSize
          for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            dataChunks.push(chunk);
          }
          for (const data of dataChunks) {
            // dataForm.append('data', dataChunk);
            Axios("POST",`/api_web/Api_import_data/action_add_client?csrf_protection=true`, {
              data:{
                data,
                "event": valueCheck,
                "event_field": "add"
              },
              // data: fom,
              headers: {"Content-Type": "multipart/form-data"} ,
              onUploadProgress: (progressEvent) => {
               const {loaded, total} = progressEvent;
               const percentage = Math.floor(((loaded / 1000) * 100) / (total / 1000));
               sMultipleProgress(percentage);
             }
            }, (err, response) => {
              if(!err){
                    var {isSuccess, message} = response.data;   
                    if(isSuccess){
                        Toast.fire({
                            icon: 'success',
                            title: `${props?.dataLang[message]}`
                        })
                    }else{
                      Toast.fire({
                        icon: 'error',
                        title: `${props.dataLang[message] +" "+branch_name} `
                      })
                    }
                }
                sOnSending(false)
                sMultipleProgress(0)
            })
          }
        };
        
        
        
        
        

        useEffect(() =>{
          onSending && _ServerSending()
        },[onSending])

    return (
        <React.Fragment>
      <Head>
        <title>{"Import dữ liệu"}</title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 ">
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">{"Import dữ liệu"}</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>Danh mục</h6>
        </div>

        <div className="">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
              <h2 className="text-2xl text-[#52575E] capitalize">{"Import dữ liệu danh mục"}</h2>
            


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
                      <h2 className='py-2'>{router.query?.tab == 1  && "Khách hàng" ||
                        router.query?.tab == 2  && "Nhà cung cấp" ||
                        router.query?.tab == 3  && "Nguyên vật liệu"||
                        router.query?.tab == 4  && "Thành phẩm"||
                        router.query?.tab == 5  && "Người dùng"
                        }
                      </h2>
                  </div>
                  <div className='col-span-2'></div>


                  <div className='col-span-2'></div>
                  <div className='col-span-4 mb-2 mt-2'>
                     <h5  className="mb-1 block text-sm font-medium text-gray-700">Mẫu import</h5>
                      <Select   
                          closeMenuOnSelect={true}
                          placeholder={"Mẫu import"}
                          // options={dataList_Object}
                          isSearchable={true}
                          // onChange={_HandleChangeInput.bind(this, "listObject")}
                          // value={listObject}
                          LoadingIndicator
                          noOptionsMessage={() => "Không có dữ liệu"}
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
                        <h5  className="mb-1 block text-sm font-medium text-gray-700">Thao tác</h5>
                          <div>
                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <li className="w-full border-b  cursor-pointer hover:bg-pink-600 group overflow-hidden transform  transition duration-300 ease-in-out border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                    <div className="flex cursor-pointer items-center pl-3">
                                        <input id="horizontal-list-radio-license" type="radio"  value={valueCheck} checked={valueCheck == 'add'} onChange={_HandleChange.bind(this, "valueAdd")} name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                        <label htmlFor="horizontal-list-radio-license" className="w-full py-2 cursor-pointer ml-2 text-sm font-medium text-gray-900 group-hover:text-white transition-all ease-in-out dark:text-gray-300">Thêm</label>
                                    </div>
                                </li>
                                <li className="w-full border-b  cursor-pointer hover:bg-pink-600 group overflow-hidden transform  transition duration-300 ease-in-out border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                    <div className="flex cursor-pointer items-center pl-3">
                                        <input id="horizontal-list-radio-id" type="radio" value={valueCheck} checked={valueCheck == "edit"} onChange={_HandleChange.bind(this, "valueUpdate")} name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                        <label htmlFor="horizontal-list-radio-id" className="w-full py-2 cursor-pointer ml-2 text-sm font-medium text-gray-900 group-hover:text-white transition-all ease-in-out dark:text-gray-300">Cập nhật</label>
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
                              <h5  className="mb-1 block text-sm font-medium text-gray-700">Cột điều kiện <span className='text-red-500'>*</span></h5>
                              <Select   
                              closeMenuOnSelect={true}
                              placeholder={"Cột điều kiện"}
                              // options={dataList_Object}
                              isSearchable={true}
                              onChange={_HandleChange.bind(this, "condition_column")}
                              // value={listObject}
                              LoadingIndicator
                              noOptionsMessage={() => "Không có dữ liệu"}
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
                            {errValueCheck && <label className="text-sm text-red-500">{"Vui lòng chọn cột điều kiện"}</label>}
                            </>):""
                          }

                  </div>
                  <div className='col-span-4'></div>
                  <div className='col-span-2'></div>


                  <div className='col-span-2'></div>
                  <div className='col-span-4'>
                      <label for="importFile" className="block text-sm font-medium mb-2 dark:text-white">Tải lên file cần import</label>
                      <label for="importFile"  className={`${errFileImport && dataImport.length == 0 ? "border-red-500" : "border-gray-200"} " border-gray-200 flex w-full cursor-pointer p-2 appearance-none items-center justify-center rounded-md border-2 border-dashed  transition-all hover:border-blue-300"`}>
                        <input accept='.xlsx, .xls'   id="importFile" onChange={_HandleChange.bind(this, 'importFile')} type="file" className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:py-0.5 file:px-5 file:text-[13px] file:font-semibold file:text-white hover:file:bg-primary-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60" />
                      </label>
                        {errFileImport && dataImport.length == 0 && <label className="text-sm text-red-500">{"Vui lòng chọn file cần import"}</label>}
                  </div>
                  <div className='col-span-4 grid grid-cols-4 space-x-2.5'>
                      <div className='mx-auto w-full col-span-2'>
                          <label for="input-label" className="block text-sm font-medium mb-2 dark:text-white">Hàng bắt đầu</label>
                          <input  value={row_tarts} 
                          onChange={_HandleChange.bind(this, 'row_tarts')}
                           type="text" id="input-label" className="py-2.5 outline-none px-4 border block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder={"Hàng bắt đầu"}/>    
                      </div>
                      <div className='mx-auto w-full col-span-2'>
                          <label for="input-labels" className="block text-sm font-medium mb-2 dark:text-white">Hàng kết thúc</label>
                          <input  value={end_row} onChange={_HandleChange.bind(this, 'end_row')} type="text" id="input-labels" className="py-2.5 outline-none px-4 border block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder={"Hàng kết thúc"}/>    
                      </div>
                  </div>
                  <div className='col-span-2'></div>


                  {/* <div className='col-span-2'></div>
                  <div className='col-span-8 grid grid-cols-8 gap-2.5'>
                      <div className='col-span-4'>
                          <div className='grid-cols-13 grid items-end justify-center gap-2.5'>
                              <div className='col-span-1 mx-auto'>
                                <button   className="xl:text-base text-xs "><IconDelete color="red"/></button>
                              </div>
                              <div className='col-span-6'>
                                      <h5  className="mb-1 block text-sm font-medium text-gray-700">Trường dữ liệu</h5>
                                        <Select   
                                        closeMenuOnSelect={true}
                                        placeholder={"Trường dữ liệu"}
                                        // options={dataList_Object}
                                        isSearchable={true}
                                        // onChange={_HandleChangeInput.bind(this, "listObject")}
                                        // value={listObject}
                                        LoadingIndicator
                                        noOptionsMessage={() => "Không có dữ liệu"}
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
                                      <h5  className="mb-1 block text-sm font-medium text-gray-700">Cột dữ liệu</h5>
                                        <Select   
                                        closeMenuOnSelect={true}
                                        placeholder={"Cột dữ liệu"}
                                        // options={dataList_Object}
                                        isSearchable={true}
                                        // onChange={_HandleChangeInput.bind(this, "listObject")}
                                        // value={listObject}
                                        LoadingIndicator
                                        noOptionsMessage={() => "Không có dữ liệu"}
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
                        <div className='col-span-4 '>
                            <h5  className="mb-1 block text-sm font-medium text-gray-700">Thao tác</h5>
                            <div class="grid grid-cols-4">
                                <div className="flex items-center space-x-2 rounded p-2 hover:bg-gray-100">
                                  <input type="checkbox" id="example9" name="checkGroup1" className="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400" />
                                  <label for="example9" className="flex w-full space-x-2 text-sm"> Tìm chính xác </label>
                                </div>
                                <div className="flex items-center space-x-2 rounded p-2 hover:bg-gray-100">
                                  <input type="checkbox" id="example10" name="checkGroup1" className="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400" />
                                  <label for="example10" className="flex w-full space-x-2 text-sm"> Tìm gần giống </label>
                                </div>
                                <div className="flex items-center space-x-2 rounded p-2 hover:bg-gray-100">
                                  <input type="checkbox" id="example11" name="checkGroup1" className="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400" />
                                  <label for="example11" className="flex w-full space-x-2 text-sm"> Thêm mới </label>
                                </div>
                                <div className="flex items-center space-x-2 rounded p-2 hover:bg-gray-100">
                                  <input type="checkbox" id="example12" name="checkGroup1" class="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400" />
                                  <label for="example12" class="flex w-full space-x-2 text-sm"> Bỏ qua dòng </label>
                                </div>
                          </div>
                        </div>
                  </div> 
                  <div className='  col-span-2'></div> */}
                  {
                    listData?.length < 5
                  }
                  <div className='col-span-2'></div>
                  <div className='col-span-4 -mt-2'>
                    <div className='grid grid-cols-13 gap-2.5'>
                         <div className='col-span-1'></div>
                        <div className='col-span-12 '>
                            <div className="b  flex items-center justify-center w-full  pt-5">
                                  <button onClick={_HandleAddParent.bind(this)} className="i flex justify-center gap-2 bg-pink-600 w-full text-center py-2 text-white items-center rounded shadow-xl cursor-pointer hover:scale-[1.02]  overflow-hidden transform  transition duration-300 ease-out">
                                  <Add
                                    size="20"
                                    color="red"
                                    className='bg-gray-50 rounded-full '
                                    />
                                    <p className='text-sm'>Thêm cột</p>
                                  </button>
                             </div>
                        </div>
                    </div>          
                  </div>

                  <div className='col-span-4'></div>
                  <div className='col-span-2'></div>


                  <div className='col-span-2'></div>
                  <div className={`${listData?.length > 2 ? "mt-3" : ""} col-span-6`}>
                  {
                    listData?.map((e,index) =>
                        
                      <div className='grid grid-cols-6 gap-2.5 mb-2'>
                      <div className='col-span-4'>
                          <div className='grid-cols-13 grid items-end justify-center gap-2.5'>
                              <div className='col-span-1 mx-auto'>
                              <button onClick={_HandleDelete.bind(this, e?.id)}  className="xl:text-base text-xs hover:scale-105 transition-all ease-in-out "><IconDelete color="red"/></button>
                              </div>
                              <div className='col-span-6'>
                                      {index ==0 &&<h5  className="mb-1 block text-sm font-medium text-gray-700">Trường dữ liệu <span className='text-red-500'>*</span></h5>}
                                        <Select   
                                        closeMenuOnSelect={true}
                                        placeholder={"Trường dữ liệu"}
                                        options={dataClient}
                                        isSearchable={true}
                                        onChange={_HandleChangeChild.bind(this, e?.id, "data_fields")}
                                        value={e.dataFields}
                                        LoadingIndicator
                                        noOptionsMessage={() => "Không có dữ liệu"}
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
                              {index ==0 &&<h5  className="mb-1 block text-sm font-medium text-gray-700">Cột dữ liệu <span className='text-red-500'>*</span></h5>}
                                        <Select   
                                        closeMenuOnSelect={true}
                                        placeholder={"Cột dữ liệu"}
                                        options={dataColumn}
                                        isSearchable={true}
                                        // onChange={_HandleChange.bind(this, "column")}
                                        onChange={_HandleChangeChild.bind(this, e?.id, "column")}
                                        value={e?.column}
                                        LoadingIndicator
                                        noOptionsMessage={() => "Không có dữ liệu"}
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
                              {index ==0 &&<h5  className="mb-1 block text-sm font-medium text-gray-700 opacity-0">Thao tác</h5>}
                                    <div className="flex items-center space-x-2 rounded p-2 ">
                                      <TiTick color='green'/>
                                      <label for="example11" className="flex w-full space-x-2 text-sm"> Thêm mới </label>
                                    </div>
                          </div>
                        </div>
                    )
                  }
                  </div>
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
                                        noOptionsMessage={() => "Không có dữ liệu"}
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
                                        noOptionsMessage={() => "Không có dữ liệu"}
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
                                  noOptionsMessage={() => "Không có dữ liệu"}
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
                  <div className="flex items-center space-x-2 rounded p-2 hover:bg-gray-200 bg-gray-100 cursor-pointer btn-animation hover:scale-[1.02]">
                                  <input type="checkbox" id="example11" name="checkGroup1" className="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400" />
                                  <label for="example11" className="flex w-full space-x-2 text-sm cursor-pointer"> Lưu mẫu import </label>
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