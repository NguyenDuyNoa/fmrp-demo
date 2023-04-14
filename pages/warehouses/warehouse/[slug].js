import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import {useRouter} from 'next/router';

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import {_ServerInstance as Axios} from '/services/axios';
import Pagination from '/components/UI/pagination';


import { Edit as IconEdit, Trash as IconDelete, Grid6 as IconExcel, SearchNormal1 as IconSearch, House2 } from "iconsax-react";
import Swal from "sweetalert2";

import 'react-phone-input-2/lib/style.css'
import ReactExport from "react-data-export";
import Select,{components} from "react-select"
import ModalImage from "react-modal-image";
import Link from "next/link";
import moment from "moment";
 
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
})

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet

const Index = (props) => {
  const router = useRouter();
  const dataLang = props.dataLang;
  const id  = router.query.slug;
  const [data, sData] = useState([])
  const [data_ex, sData_ex] = useState([]);
  const [onFetching, sOnFetching] = useState(true)

  const [keySearch, sKeySearch] = useState("")
  const [limit, sLimit] = useState(15);
  const [totalItem, sTotalItem] = useState([]);

  const [title,sTitle]= useState("")
  const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
  const [dataProductExpiry, sDataProductExpiry] = useState({});
  const [dataProductSerial, sDataProductSerial] = useState({});


  const _ServerFetching =  () =>{
    Axios("GET", `/api_web/api_warehouse/warehouse_detail/${id}?csrf_protection=true`, {
      params: {
        search: keySearch,
        limit: limit,
        page: router.query?.page || 1,
      }
    }, (err, response) => {
      if(!err){
          var {rResult, output} = response.data
          sData(rResult)
          sTotalItem(output)
          sData_ex(rResult)
      }
      sOnFetching(false)
    })
    Axios("GET", "/api_web/api_setting/feature/?csrf_protection=true", {}, (err, response) => {
      if(!err){
          var data = response.data;
          sDataMaterialExpiry(data.find(x => x.code == "material_expiry"));
          sDataProductExpiry(data.find(x => x.code == "product_expiry"));
          sDataProductSerial(data.find(x => x.code == "product_serial"));
      }
    })
    Axios("GET", `/api_web/api_warehouse/warehouse/${id}?csrf_protection=true`, {}, (err, response) => {
      if(!err){
          var {name} = response.data;
          sTitle(name)
      }
    })
  }
  useEffect(() => {
   id && onFetching && _ServerFetching() 
  }, [onFetching])
  
  useEffect(() => {
    sOnFetching(true) || (keySearch && sOnFetching(true))
  }, [limit,router.query?.page])

  const paginate = pageNumber => {
    router.push({
        query: {
          page: pageNumber,
          slug: router.query.slug
         }
    })
  }

  const _HandleOnChangeKeySearch = ({target: {value}}) => {
    sKeySearch(value)
    router.replace({
      query: {
        slug: router.query.slug
      }
    });
    setTimeout(() => {
      if(!value){
        sOnFetching(true)
      }
      sOnFetching(true)
    }, 500);
  };

const newResult = data_ex.map(item => {
  const detail = item.detail || [];
  return detail.map(detailItem => ({
    ...item,
    detail: detailItem
  }));
}).flat();
  const multiDataSet = [
    {
        columns: [
            {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title: `${dataLang?.warehouses_detail_type || "warehouses_detail_type"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title: `${dataLang?.warehouses_detail_plu || "warehouses_detail_plu"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title: `${dataLang?.warehouses_detail_productname || "warehouses_detail_productname"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title: `${dataLang?.warehouses_detail_wareLoca || "warehouses_detail_wareLoca"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title: `${dataLang?.warehouses_detail_mainVar || "warehouses_detail_mainVar"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title: `${dataLang?.warehouses_detail_subVar || "warehouses_detail_subVar"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title: `${"Serial"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title: `${"Lot"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title: `${dataLang?.warehouses_detail_date || "warehouses_detail_date"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title: `${dataLang?.warehouses_detail_quantity || "warehouses_detail_quantity"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            {title: `${dataLang?.warehouses_detail_value || "warehouses_detail_value"}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
        ],
        data: newResult?.map((e) =>
            
            [
                {value: `${e.item_id}`, style: {numFmt: "0"}},
                {value: `${e.item_type ? dataLang?.product : ""}`},
                {value: `${e.item_code ? e.item_code : ""}`},
                {value: `${e.item_name ? e.item_name : ""}`},
                {value: `${e?.detail.location_name ? e?.detail.location_name : ""}`},
                {value: `${e?.detail.option_name_1 ? e?.detail.option_name_1 : ""}`},
                {value: `${e?.detail.option_name_2 ? e?.detail.option_name_2 : ""}`},
                {value: `${e?.detail.serial != null ? e?.detail.serial : ""}`},
                {value: `${e?.detail.lot != null ? e?.detail.lot : ""}`},
                {value: `${e?.detail.expiration_date != null ? e?.detail.expiration_date : ""}`},
                {value: `${e?.detail.quantity != null ? e?.detail.quantity : ""}`},
                {value: `${e?.detail.amount != null ? e?.detail.amount : ""}`},
            ]
            
        ),
    }
  ];

  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">{dataLang?.warehouses_localtion_ware}</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{dataLang?.warehouses_detail_title}</h6>
        </div>
        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
                <div className="flex justify-between">
                <div className='flex items-center gap-2 '>
                    <House2 size="32" color="#0F4F9E"
                    />
                      <h2 className="text-2xl text-[#52575E]">{title}</h2>
                 </div>
                <div className="flex justify-end items-center">
                    <Link   href={"/warehouses/warehouse"} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105">{dataLang?.warehouses_detail_back}</Link>
                  </div>
                </div>
              <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                <div className="xl:space-y-3 space-y-2">
                    <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                    <div className='flex gap-2'>
                          <form className="flex items-center relative">
                            <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                            <input
                                className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-1.5 rounded-md w-[400px]"
                                type="text" 
                                onChange={_HandleOnChangeKeySearch.bind(this)} 
                                placeholder={dataLang?.branch_search}
                            />
                          </form>                      
                        </div>
                        <div className="flex space-x-2 items-center">
                            {
                          data_ex?.length > 0 &&(
                            <ExcelFile filename={title} title="Ctkh" element={
                              <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition'>
                                <IconExcel size={18} /><span>{dataLang?.client_list_exportexcel}</span></button>}>
                              <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name="Organization" />
                          </ExcelFile>
                          )
                        }
                          <label className="font-[300] text-slate-400">{dataLang?.display}</label>
                          <select className="outline-none" onChange={(e) => sLimit(e.target.value)} value={limit}>
                            <option disabled className="hidden">{limit == -1 ? "Tất cả": limit}</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={40}>40</option>
                            <option value={60}>60</option>
                            <option value={-1}>Tất cả</option>
                          </select>
                        </div>
                    </div>
                </div>
                <div className="min:h-[500px] 2xl:h-[90%] xl:h-[69%] h-[100%] max:h-[800px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">  
                <div className={`2xl:w-[100%] pr-2`}>
                    <div className={`${dataProductSerial.is_enable == "1" ? 
                    (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-12" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-12" :"grid-cols-10" ) :
                     (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-11" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-11" :"grid-cols-9") ) }  grid sticky top-0 bg-white shadow-lg  z-10`}>
                          <h4 className="xl:text-[14px] text-[12px] px-2 py-2  col-span-1  text-gray-400 uppercase  font-[500] text-center">{dataLang?.warehouses_detail_img || "warehouses_detail_img"}</h4>
                          <h4 className="xl:text-[14px] text-[12px] px-2 py-2  col-span-1  text-gray-400 uppercase  font-[500] text-center">{dataLang?.warehouses_detail_type || "warehouses_detail_type"}</h4>
                          <h4 className="xl:text-[14px] text-[12px] px-2 py-2  col-span-1  text-gray-400 uppercase  font-[500] text-center">{dataLang?.warehouses_detail_plu || "warehouses_detail_plu"}</h4>
                          <h4 className="xl:text-[14px] text-[12px] px-2 py-2  col-span-1  text-gray-400 uppercase  font-[500] text-center">{dataLang?.warehouses_detail_productname || "warehouses_detail_productname"}</h4>
                          <h4 className="xl:text-[14px] text-[12px] px-2 py-2  col-span-1  text-gray-400 uppercase  font-[500] text-center">{dataLang?.warehouses_detail_wareLoca || "warehouses_detail_wareLoca"}</h4>
                          <h4 className="xl:text-[14px] text-[12px] px-2 py-2  col-span-1  text-gray-400 uppercase  font-[500] text-center">{dataLang?.warehouses_detail_mainVar || "warehouses_detail_mainVar"}</h4>
                          <h4 className="xl:text-[14px] text-[12px] px-2 py-2  col-span-1  text-gray-400 uppercase  font-[500] text-center">{dataLang?.warehouses_detail_subVar || "warehouses_detail_subVar"}</h4>
                          {dataProductSerial.is_enable === "1" && (<h4 className="xl:text-[14px] text-[12px] px-2 py-2  col-span-1  text-gray-400 uppercase  font-[500] text-center">{"Serial"}</h4>)}
                          {dataMaterialExpiry.is_enable === "1" ||  dataProductExpiry.is_enable === "1" ? (
                            <>
                              <h4 className="xl:text-[14px] text-[12px] px-2 py-2  col-span-1  text-gray-400 uppercase  font-[500] text-center">{"Lot"}</h4>
                              <h4 className="xl:text-[14px] text-[12px] px-2 py-2  col-span-1  text-gray-400 uppercase  font-[500] text-center">{dataLang?.warehouses_detail_date || "warehouses_detail_date"}</h4>
                            </> ):""}
                          <h4 className="xl:text-[14px] text-[12px] px-2 py-2  col-span-1  text-gray-400 uppercase  font-[500] text-center">{dataLang?.warehouses_detail_quantity || "warehouses_detail_quantity"}</h4>
                          <h4 className="xl:text-[14px] text-[12px] px-2 py-2  col-span-1  text-gray-400 uppercase  font-[500] text-center">{dataLang?.warehouses_detail_value || "warehouses_detail_value"}</h4>
                             </div>
                    {onFetching ?
                      <Loading className="h-80"color="#0f4f9e" /> 
                      : 
                      data?.length > 0 ? 
                      (
                          <div className=" min:h-[400px] h-[100%] w-full max:h-[600px]  ">                       
                          {(data?.map((e) => 
                            <div className={`${dataProductSerial.is_enable == "1" ? 
                              (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-12" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-12" :"grid-cols-10" ) :
                              (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-11" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-11" :"grid-cols-9") ) }  grid hover:bg-slate-50`}
                            >
                                    <div className={`${"" }col-span-1 border-l  flex justify-center items-center border-r  border-b`}>
                                        <h6 className="xl:text-base text-xs w-[full]  ">{e?.image == null ?
                                                    <ModalImage small="/no_image.png" large="/no_image.png" className='w-[40px] h-[40px] rounded object-contain' /> 
                                                    : <>
                                                    <ModalImage small={e?.image} large={e?.image} className="w-[40px] h-[40px]  rounded-[100%] object-cover"/> 
                                                    </>
                                        }</h6>                              
                                    </div>
                                    <div className=" col-span-1 border-r  border-b flex  items-center">
                                        <h6 className="xl:text-base text-xs  px-2 py-3  w-[full] text-left "><span className={`${e.item_type == "product" ? "text-lime-500  border-lime-500 " : " text-orange-500 border-orange-500"} border rounded py-1 px-1.5`}>{e.item_type ? dataLang?.product : ""}</span></h6>                              
                                    </div>
                                    <div className=" col-span-1 border-r  border-b flex  items-center">
                                        <h6 className="xl:text-base text-xs  px-2 py-3  w-[full] text-left ">{e.item_code == null ? "-" : e.item_code}</h6>                              
                                    </div>
                                    <div className=" col-span-1   border-b flex  items-center">
                                        <h6 className="xl:text-base text-xs  px-2 py-3  w-[full] text-left ">{e.item_name == null ? "-" : e.item_name}</h6> 
                                    </div>
                                <div className={`border-l border-r grid ${dataProductSerial.is_enable == "1" ? 
                                  (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "col-span-8" : dataMaterialExpiry.is_enable == "1" ? "col-span-8" :"col-span-6" ) :
                                  (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "col-span-7" : (dataMaterialExpiry.is_enable == "1" ? "col-span-7" :"col-span-5") ) }`}
                                >
                                    {e?.detail.map(e => 
                                        <div className={`grid ${dataProductSerial.is_enable == "1" ? 
                                        (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-8" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-8" :"grid-cols-6" ) :
                                        (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-7" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-7" :" grid-cols-5") ) }`}>
                                            <div className=" col-span-1 border-r">
                                                <h6 className="xl:text-base text-xs  px-2 py-3  w-[full] text-left border-b"> {e.location_name == null ? "-" : e.location_name}</h6>                              
                                            </div>
                                            <div className=" col-span-1 border-r">
                                                <h6 className="xl:text-base text-xs  px-2 py-3  w-[full] text-center border-b">{e.option_name_1 == null ? "-" : e.option_name_1}</h6>                              
                                                                             
                                            </div>
                                            <div className=" col-span-1 border-r">
                                                <h6 className="xl:text-base text-xs  px-2 py-3  w-[full] text-center border-b">{e.option_name_2 == null ? "-" : e.option_name_2}</h6>                              
                                            </div>
                                            {dataProductSerial.is_enable === "1" ? (
                                                <div className=" col-span-1 border-r">
                                                  <h6 className="xl:text-base text-xs  px-2 py-3  w-[full] text-left border-b">{e.serial == null ? "-" : e.serial}</h6>                              
                                                </div>
                                              ):""}
                                           {dataMaterialExpiry.is_enable === "1" ||  dataProductExpiry.is_enable === "1" ? (
                                             <>
                                                <div className=" col-span-1 border-r ">
                                                    <h6 className="xl:text-base text-xs  px-2 py-3  w-[full] text-left border-b">{e.lot == null ? "-" : e.lot}</h6>                              
                                                </div>
                                                <div className=" col-span-1 border-r ">
                                                    <h6 className="xl:text-base text-xs  px-2 py-3  w-[full] text-center border-b">{e.expiration_date ? moment(e.expiration_date).format("DD-MM-YYYY")   : "-"}</h6>                              
                                                </div>
                                             </>
                                            ):""}
                                            <div className=" col-span-1 border-r ">
                                                <h6 className="xl:text-base text-sm  px-2 py-3  w-[full] text-red-500 font-medium text-center border-b">{e.quantity ? e.quantity : "-"}</h6>                              
                                            </div>
                                            <div className=" col-span-1 ">
                                                <h6 className="xl:text-base text-xs  px-2 py-3  w-[full] text-right border-b">{e.amount ? e.amount : "-"}</h6>                              
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                          ))}              
                        </div> 
                      )  : 
                      (
                        <div className=" max-w-[352px] mt-24 mx-auto" >
                          <div className="text-center">
                            <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                            <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
                            <div className="flex items-center justify-around mt-6 ">
                            </div>
                          </div>
                        </div>
                      )}    
                  </div>
                  </div>
              </div>     
            </div>
            {data?.length != 0 &&
              <div className='flex space-x-5 items-center'>
                <h6>{dataLang?.display} {totalItem?.iTotalDisplayRecords} {dataLang?.among} {totalItem?.iTotalRecords} {dataLang?.ingredient}</h6>
                <Pagination 
                  postsPerPage={limit}
                  totalPosts={Number(totalItem?.iTotalDisplayRecords)}
                  paginate={paginate}
                  currentPage={router.query?.page || 1}
                />
              </div>                   
            } 
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};


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