import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head';
import {_ServerInstance as Axios} from '/services/axios';
import { v4 as uuidv4 } from 'uuid';


const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});
import dynamic from 'next/dynamic';
import Select,{components } from 'react-select';
const { Option, SelectAllOption, DeselectAllOption } = components;

import { Edit as IconEdit,  Grid6 as IconExcel, Trash as IconDelete, SearchNormal1 as IconSearch,Add as IconAdd, LocationTick, User,Image as IconImage, Add, Minus, Check, TickCircle  } from "iconsax-react";
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import {NumericFormat} from "react-number-format";
import Link from 'next/link';
import moment from 'moment/moment';
import { name } from 'dayjs/locale/vi';



const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
})
const Index = (props) => {
    const router = useRouter();
    const id = router.query?.id
    const dataLang = props?.dataLang
    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };
    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingItemsAll, sOnFetchingItemsAll] = useState(false);
    const [onFetchingTheOrder, sOnFetchingTheOrder] = useState(false);
    const [onFetchingSupplier, sOnFetchingSupplier] = useState(false);

    const [onSending, sOnSending] = useState(false);

 
    const [code, sCode] = useState('')
    const [note, sNote] = useState('')
    const [date, sDate] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
    const [dataSupplier, sDataSupplier] = useState([])
    const [dataThe_order, sDataThe_order] = useState([])
    const [dataBranch, sDataBranch]= useState([])
    const [dataItems, sDataItems] = useState([])
    const [dataTasxes, sDataTasxes] = useState([])

    const [option, sOption] = useState([{id: Date.now(), mathang: null, khohang: null, donvitinh: "", soluong: 1, gianhap: 1, thue: 0, thanhtien: 1, ghichu: ""}]);
    const slicedArr = option.slice(1);
    const sortedArr = slicedArr.sort((a, b) => b.id - a.id);
    sortedArr.unshift(option[0]);

    const [idSupplier, sIdSupplier] = useState(null)
    const [idTheOrder, sIdTheOrder] = useState(null)
    const [idBranch, sIdBranch] = useState(null);
    
    const [errSupplier, sErrSupplier] = useState(false)
    const [errDate, sErrDate] = useState(false)
    const [errTheOrder, sErrTheOrder] = useState(false)
    const [errBranch, sErrBranch] = useState(false)

    const [mathangAll, sMathangAll] = useState([])

    useEffect(() => {
      router.query && sErrDate(false)
      router.query && sErrSupplier(false)
      router.query && sErrTheOrder(false)
      router.query && sErrBranch(false)
      router.query && sDate(moment().format('YYYY-MM-DD HH:mm:ss'))
      router.query && sNote("")
  }, [router.query]);

    const _ServerFetching =  () => {
      Axios("GET", "/api_web/Api_Branch/branch/?csrf_protection=true", {}, (err, response) => {
          if(!err){
              var {rResult} =  response.data
              sDataBranch(rResult?.map(e =>({label: e.name, value:e.id})))       
          }
      })
      Axios("GET", "/api_web/Api_tax/tax?csrf_protection=true", {}, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            sDataTasxes(rResult?.map(e =>({label: e.name, value: e.id, tax_rate:e.tax_rate})))       
        }
    })
      sOnFetching(false)  
  }

    useEffect(() => {
      onFetching && _ServerFetching() 
    }, [onFetching]);

    const _ServerFetching_TheOrder =  () => {
      Axios("GET", "/api_web/Api_purchases/purchasesOptionNotComplete?csrf_protection=true", {
        params:{
          "filter[supplier_id]": idSupplier ? idSupplier?.value : null,
         }
      }, (err, response) => {
          if(!err){
              var db =  response.data
              sDataThe_order(db?.map(e => ({label: e?.code, value: e?.id})))
          }
      })
      sOnFetchingTheOrder(false)  
  }

  useEffect(()=>{
     idSupplier === null && sDataThe_order([]) || sIdTheOrder(null)
  },[idSupplier])

    const _ServerFetching_Supplier =  () => {
      Axios("GET", "/api_web/api_supplier/supplier/?csrf_protection=true", {
        params:{
          "filter[branch_id]": idBranch != null ? idBranch.value : null ,
         }
      }, (err, response) => {
          if(!err){
              var {rResult} =  response.data
              sDataSupplier(rResult?.map(e => ({label: e.name, value:e.id })))
          }
      })
      sOnFetchingSupplier(false)  
  }

    useEffect(()=>{
      idBranch === null && sDataSupplier([]) || sIdSupplier(null)
    },[idBranch])

 const [mantItem, sMangitem] = useState([])
    const _HandleChangeInput = (type, value) => {
      if(type == "code"){
          sCode(value.target.value)
      }else if(type === "date"){
          sDate(moment(value.target.value).format('YYYY-MM-DD HH:mm:ss'))
      }else if(type === "supplier"){
          sIdSupplier(value)
      }else if(type === "theorder"){
          sIdTheOrder(value)
      }else if(type === "note"){
          sNote(value.target.value)
      }else if(type == "branch"){
          sIdBranch(value)
      }else if(type == "mathangAll"){
        if(value.value === "0"){

          sMathangAll(value)
          const fakeData = [{id: Date.now(), mathang: null}]
          const data = fakeData?.concat(allItems?.slice(2)?.map(e => ({id: uuidv4(), mathang: e, khohang: e?.qty_warehouse, donvitinh: e?.e?.unit_name, soluong: 1, gianhap: 1, thue: 0, thanhtien: 1, ghichu: ""})))
          sOption(data);

        }else if(value.value === null){

          sMathangAll(value)
          sMangitem([])
          sOption([{id: Date.now(), mathang: null}])

        }else if(value.value != "0" || value.value != null){

          sMathangAll(value)
          const dataItem = [allItems.find(item => item.value === value.value)]
          const fakeData = [{id: Date.now(), mathang: null}]
          sOption(fakeData?.concat(dataItem?.map(e => ({id: uuidv4(), mathang: e, khohang: e?.qty_warehouse, donvitinh: e?.e?.unit_name, soluong: 1, gianhap: 1, thue: 0, thanhtien: 1, ghichu: ""}))))
        
        }
        else{
          sMathangAll(value)
        }
      }
  }

    const _HandleSubmit = (e) => {
      e.preventDefault();
        if(date == null || idSupplier == null  || idBranch == null || idTheOrder == null ){
          date == null && sErrDate(true)
          idSupplier == null && sErrSupplier(true)
          idBranch == null && sErrBranch(true)
          idTheOrder == null && sErrTheOrder(true)
            Toast.fire({
                icon: 'error',
                title: `${dataLang?.required_field_null}`
            })
        }
        else {
            sOnSending(true)
        }
    }

    useEffect(() => {
      sErrDate(false)
    }, [date != null]);
    useEffect(() => {
      sErrSupplier(false)
    }, [idSupplier != null]);
    useEffect(() => {
      sErrBranch(false)
    }, [idBranch != null]);
    useEffect(() => {
        sErrTheOrder(false)
    }, [idTheOrder != null]);


    const _HandleSeachApi = (inputValue) => {
      
        Axios("POST", `/api_web/Api_product/searchItemsVariant?csrf_protection=true`, {
          data: {
            term: inputValue,
          }
        }, (err, response) => {
              if(!err){
                var {result} = response?.data.data
                sDataItems(result)
            }
        })
    };
    const options =  dataItems?.map(e => ({label: `${e.name} <span style={{display: none}}>${e.code}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,value:e.id,e})) 

    const _ServerFetching_ItemsAll =  () => {
      Axios("GET", "/api_web/Api_product/searchItemsVariant?csrf_protection=true", {
      }, (err, response) => {
          if(!err){
              var {result} =  response.data.data
              sDataItems(result)
          } 
      })
      sOnFetchingItemsAll(false)  
  }
  useEffect(() => {
    onFetchingItemsAll && _ServerFetching_ItemsAll() 
  }, [onFetchingItemsAll]);

  useEffect(() => {
    router.query && sOnFetching(true) 
    router.query && sOnFetchingItemsAll(true) 
  }, [router.query]);

  useEffect(()=>{
    onFetchingTheOrder && _ServerFetching_TheOrder() 
  },[onFetchingTheOrder])
  
  useEffect(()=>{
    onFetchingSupplier && _ServerFetching_Supplier() 
  },[onFetchingSupplier])

  useEffect(() => {
    idBranch == null && sIdTheOrder(null) ||  idBranch == null && sDataThe_order([])
  }, [idBranch]);

  useEffect(() => {
    idBranch != null && sOnFetchingSupplier(true)
  }, [idBranch]);

  useEffect(() => {
    idTheOrder == null && sIdSupplier(null)
  }, [idTheOrder]);

  useEffect(() => {
    idSupplier != null && sOnFetchingTheOrder(true)
  }, [idSupplier]);
  
  const _HandleChangeInputOption = (id, type,index3, value) => {
    var index = option.findIndex(x => x.id === id);

    if(type == "mathang"){
      //  const hasSelectedOption = option.some((o) => o.mathang?.value === value.value && o.mathang?.e?.purchases_code === value.mathang?.e?.purchases_code);
      //     if (hasSelectedOption) {
      //       Toast.fire({
      //         title: `${"Mặt hàng đã được chọn"}`,
      //         icon: 'error',
      //         confirmButtonColor: '#296dc1',
      //         cancelButtonColor: '#d33',
      //         confirmButtonText: `${dataLang?.aler_yes}`,
      //         })
      //       return  
      //     }
         if(option[index]?.mathang){
            option[index].mathang = value
            option[index].donvitinh =  value?.e?.unit_name
            sMathangAll(null)
            // option[index].soluong =  idPurchases?.length ? Number(value?.e?.quantity_left) : 1
            // option[index].thanhtien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
          }else{
            const newData= {id: Date.now(), mathang: value, khohang: null, donvitinh: value?.e?.unit_name, soluong: 1, gianhap: 1, thue: 0, thanhtien: 1, ghichu: ""}
            if (newData.chietkhau) {
              newData.dongiasauck *= (1 - Number(newData.chietkhau) / 100);
            }
            if(newData.thue?.e?.tax_rate == undefined){
              const tien = Number(newData.dongiasauck) * (1 + Number(0)/100) * Number(newData.soluong);
              newData.thanhtien = Number(tien.toFixed(2));
            } else { 
              const tien = Number(newData.dongiasauck) * (1 + Number(newData.thue?.e?.tax_rate)/100) * Number(newData.soluong);
              newData.thanhtien = Number(tien.toFixed(2));
            }
            sMathangAll(null)
            option.push(newData);
          }
    }else if(type == "donvitinh"){
      option[index].donvitinh = value.target?.value;
    }else if (type === "soluong") {
      option[index].soluong = Number(value?.value);
      if(option[index].thue?.tax_rate == undefined){
        const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      }else{
        const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      }
      sOption([...option]);
    }else if(type == "dongia"){
        option[index].dongia = Number(value.value)
        option[index].dongiasauck = +option[index].dongia * (1 - option[index].chietkhau/100);
        option[index].dongiasauck = +(Math.round(option[index].dongiasauck + 'e+2') + 'e-2');
        if(option[index].thue?.tax_rate == undefined){
          const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
          option[index].thanhtien = Number(tien.toFixed(2));
        }else{
          const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
          option[index].thanhtien = Number(tien.toFixed(2));
        }

    }else if(type == "chietkhau"){
        option[index].chietkhau = Number(value.value) 
        option[index].dongiasauck = +option[index].dongia * (1 - option[index].chietkhau/100);
        option[index].dongiasauck = +(Math.round(option[index].dongiasauck + 'e+2') + 'e-2');
        if(option[index].thue?.tax_rate == undefined){
          const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
          option[index].thanhtien = Number(tien.toFixed(2));
        }else{
          const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
          option[index].thanhtien = Number(tien.toFixed(2));
        }
    }else if(type == "thue"){
        option[index].thue = value
        if(option[index].thue?.tax_rate == undefined){
          const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
          option[index].thanhtien = Number(tien.toFixed(2));
        }else{
          const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
          option[index].thanhtien = Number(tien.toFixed(2));
        }
    }
    else if(type == "ghichu"){
        option[index].ghichu = value?.target?.value;
    }
    sOption([...option])
  }
  const handleIncrease = (id) => {
    const index = option.findIndex((x) => x.id === id);
    const newQuantity = option[index].soluong + 1;
    option[index].soluong = newQuantity;
    if(option[index].thue?.tax_rate == undefined){
      const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
      option[index].thanhtien = Number(tien.toFixed(2));
    }else{
      const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
      option[index].thanhtien = Number(tien.toFixed(2));
    }
    sOption([...option]);
  };

  const handleDecrease = (id) => {
    const index = option.findIndex((x) => x.id === id);
    const newQuantity = option[index].soluong - 1;
    if (newQuantity >= 1) { // chỉ giảm số lượng khi nó lớn hơn hoặc bằng 1
      option[index].soluong = newQuantity;
      if(option[index].thue?.tax_rate == undefined){
        const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      }else{
        const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      }
      sOption([...option]);
    }else{
      return  Toast.fire({
        title: `${"Số lượng tối thiểu"}`,
        icon: 'error',
        confirmButtonColor: '#296dc1',
        cancelButtonColor: '#d33',
        confirmButtonText: `${dataLang?.aler_yes}`,
        })
    }
  };
    const _HandleDelete =  (id) => {
    if (id === option[0].id) {
      return Toast.fire({
        title: `${"Mặc định hệ thống, không xóa"}`,
        icon: 'error',
        confirmButtonColor: '#296dc1',
        cancelButtonColor: '#d33',
        confirmButtonText: `${dataLang?.aler_yes}`,
      })
    }
      const newOption = option.filter(x => x.id !== id); // loại bỏ phần tử cần xóa
      sOption(newOption); // cập nhật lại mảng
    }
    const taxOptions = [{ label: "Miễn thuế", value: "0",   tax_rate: "0"}, ...dataTasxes]
    
    
    const allItems = [{ value: "0", label: "Chọn tất cả"}, {value: null, label: "Bỏ chọn tất cả"}, ...options]



    const CustomOption = ({ data, ...props }) => {
      const { label, value, e } = data;
      const isSelectAll = value === "0";
      const isDeselectAll = value === null;
      return (
        <components.Option {...props}>
           <div className='grid grid-cols-12 items-center'>
              {isSelectAll && <span className='col-span-12'>Chọn tất cả</span>}
              {isDeselectAll && <span className='col-span-12'>Bỏ chọn tất cả</span>}
        {!isSelectAll && !isDeselectAll && (
          <>
            <div className='col-span-10'>
              <div className='grid grid-cols-12'>
                <div className='col-span-1'>
                {e?.images != null ? (
                  <img src={e?.images} alt="Product Image" style={{ width: "40px", height: "50px" }} className='object-cover rounded' />
                ) : (
                  <div className='w-[50px] h-[60px] object-cover flex items-center justify-center rounded'>
                    <img src="/no_img.png" alt="Product Image" style={{ width: "40px", height: "40px" }} className='object-cover rounded' />
                  </div>
                )}
                </div>
                <div className='col-span-11'>
                <h3 className='font-medium'>{e?.name}</h3>
                <div className='flex gap-2'>
                  <h5 className='text-gray-400 font-normal'>{e?.code}</h5>
                  <h5 className='font-medium'>{e?.product_variation}</h5>
                </div>
                <h5 className='text-gray-400 font-medium text-xs'>{dataLang[e?.text_type]}</h5>
                </div>
              </div>
            </div>
            <div className='col-span-2'>
              {value === mathangAll?.value && (
                <span className=""><TickCircle
                size="18"
                color="#FF8A65"
                /></span>
              )}
              {mathangAll?.value === "0" && (
                <span className=""><TickCircle
                size="18"
                color="#FF8A65"
                /></span>
              )}
            </div>
          </>
        )}
      </div>
        </components.Option>
      );
    };

    
  return (
    <React.Fragment>
    <Head>
        <title>{"Thêm nhập hàng"}</title>
    </Head>
    <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 flex flex-col justify-between'>
        <div className='h-[97%] space-y-3 overflow-hidden'>
            <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                <h6 className='text-[#141522]/40'>{"Nhập hàng && Trả hàng"}</h6>
                <span className='text-[#141522]/40'>/</span>
                <h6>{"Nhập hàng"}</h6>
            </div>
            <div className='flex justify-between items-center'>
                <h2 className='xl:text-2xl text-xl '>{"Nhập hàng"}</h2>
                <div className="flex justify-end items-center">
                    <button   
                    onClick={() => router.back()} 
                    className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105">{"Quay lại"}</button>
                </div>
            </div>
                
            <div className=' w-full rounded'>
              <div className=''>  
                  <h2 className='font-normal bg-[#ECF0F4] p-2'>{dataLang?.purchase_order_detail_general_informatione || "purchase_order_detail_general_informatione"}</h2>       
                    <div className="grid grid-cols-5  gap-3 items-center mt-2"> 
                        <div className='col-span-1'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_table_code || "purchase_order_table_code"} </label>
                          <input
                              value={code}                
                              onChange={_HandleChangeInput.bind(this, "code")}
                              name="fname"                      
                              type="text"
                              placeholder={dataLang?.purchase_order_system_default || "purchase_order_system_default"} 
                              className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}/>
                        </div>
                        <div className='col-span-1'>
                            <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_detail_day_vouchers || "purchase_order_detail_day_vouchers"} <span className="text-red-500">*</span></label>
                            <input
                              value={date}    
                              onChange={_HandleChangeInput.bind(this, "date")}
                              name="fname"                      
                              type="datetime-local"
                              className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}/>
                        </div>
                        <div className='col-span-1'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_table_branch || "purchase_order_table_branch"} <span className="text-red-500">*</span></label>
                          <Select 
                              options={dataBranch}
                              onChange={_HandleChangeInput.bind(this, "branch")}
                              value={idBranch}
                              isClearable={true}
                              closeMenuOnSelect={true}
                              hideSelectedOptions={false}
                              placeholder={dataLang?.purchase_order_branch || "purchase_order_branch"} 
                              className={`${errBranch ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
                              isSearchable={true}
                              components={{ MultiValue }}
                              style={{ border: "none", boxShadow: "none", outline: "none" }}
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
                              control: (base,state) => ({
                                  ...base,
                                  boxShadow: 'none',
                                  padding:"2.7px",
                                ...(state.isFocused && {
                                  border: '0 0 0 1px #92BFF7',
                                }),
                              })
                          }}
                          />
                          {errBranch && <label className="text-sm text-red-500">{dataLang?.purchase_order_errBranch || "purchase_order_errBranch"}</label>}
                        </div>
                        <div className='col-span-1'>
                      <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_table_supplier} <span className="text-red-500">*</span></label>
                        <Select 
                            options={dataSupplier}
                            onChange={_HandleChangeInput.bind(this, "supplier")}
                            value={idSupplier}
                            placeholder={dataLang?.purchase_order_supplier || "purchase_order_supplier"} 
                            hideSelectedOptions={false}
                            isClearable={true}
                            className={`${errSupplier ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full z-[100] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
                            isSearchable={true}
                            noOptionsMessage={() => "Không có dữ liệu"}
                            // components={{ MultiValue }}
                            menuPortalTarget={document.body}
                            closeMenuOnSelect={true}
                            style={{ border: "none", boxShadow: "none", outline: "none" }}
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
                                zIndex: 20
                              }), 
                              control: (base,state) => ({
                                ...base,
                                boxShadow: 'none',
                                padding:"2.7px",
                              ...(state.isFocused && {
                                border: '0 0 0 1px #92BFF7',
                              }),
                            })
                          }}
                          />
                          {errSupplier && <label className="text-sm text-red-500">{dataLang?.purchase_order_errSupplier || "purchase_order_errSupplier"}</label>}
                        </div>
                        <div className='col-span-1'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">{"Đơn đặt hàng (P0)"} <span className="text-red-500">*</span></label>
                          <Select 
                              options={dataThe_order}
                              onChange={_HandleChangeInput.bind(this, "theorder")}
                              value={idTheOrder}
                              isClearable={true}
                              noOptionsMessage={() => "Không có dữ liệu"}
                              closeMenuOnSelect={true}
                              hideSelectedOptions={false}
                              placeholder={"Đơn đặt hàng (P0)"} 
                              className={`${errTheOrder ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
                              isSearchable={true}
                              components={{ MultiValue }}
                              style={{ border: "none", boxShadow: "none", outline: "none" }}
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
                              control: (base,state) => ({
                                  ...base,
                                  boxShadow: 'none',
                                  padding:"2.7px",
                                ...(state.isFocused && {
                                  border: '0 0 0 1px #92BFF7',
                                }),
                              })
                          }}
                          />
                          {errTheOrder && <label className="text-sm text-red-500">{"Vui lòng chọn đơn đặt hàng (PO)"}</label>}
                        </div>
                        
                        <div className='col-span-2  z-[100] my-auto'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">{"Chọn nhanh mặt hàng"} </label>
                           <Select 
                            onInputChange={_HandleSeachApi.bind(this)}
                            dangerouslySetInnerHTML={{__html: option.label}}
                            options={allItems}
                            onChange={_HandleChangeInput.bind(this,  "mathangAll",)}
                            value={mathangAll}
                            components={{ Option: CustomOption }}
                            formatOptionLabel={(option) => {
                              if(option.value === "0"){
                                return (
                                  <div className='text-gray-400 font-medium'>{option.label}</div>
                                )
                              }
                              else if (option.value === null) {
                                return (
                                  <div className='text-gray-400 font-medium'>{option.label}</div>
                                )
                              }
                               else {
                                return (
                                  <div className='flex items-center justify-between py-2'>
                                    <div className='flex items-center gap-2'>
                                      <div>
                                        {option.e?.images != null ? (
                                          <img src={option.e?.images} alt="Product Image" style={{ width: "40px", height: "50px" }} className='object-cover rounded' />
                                        ) : (
                                          <div className='w-[50px] h-[60px] object-cover flex items-center justify-center rounded'>
                                            <img src="/no_img.png" alt="Product Image" style={{ width: "40px", height: "40px" }} className='object-cover rounded' />
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <h3 className='font-medium'>{option.e?.name}</h3>
                                        <div className='flex gap-2'>
                                          <h5 className='text-gray-400 font-normal'>{option.e?.code}</h5>
                                          <h5 className='font-medium'>{option.e?.product_variation}</h5>
                                        </div>
                                        <h5 className='text-gray-400 font-medium text-xs'>{dataLang[option.e?.text_type]}</h5>
                                      </div>
                                    </div>
                                    <div className=''>
                                      <div className='text-right opacity-0'>{"0"}</div>
                                      <div className='flex gap-2'>
                                        <div className='flex items-center gap-2'>
                                          <h5 className='text-gray-400 font-normal'>{dataLang?.purchase_survive || "purchase_survive"}:</h5>
                                          <h5 className='text-[#0F4F9E] font-medium'>{option.e?.qty_warehouse ?? 0}</h5>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                            }}
                            // components={{ DropdownIndicator }}
                           placeholder={dataLang?.purchase_items || "purchase_items"} 
                           hideSelectedOptions={false}
                           className="rounded-md bg-white  xl:text-base text-[14.5px] z-20 mb-2" 
                           isSearchable={true}
                           noOptionsMessage={() => "Không có dữ liệu"}
                           menuPortalTarget={document.body}
                           style={{ border: "none", boxShadow: "none", outline: "none" }}
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
                              zIndex: 9999
                            }), 
                            control: (base, state) => ({
                              ...base,
                              ...(state.isFocused && {
                                border: '0 0 0 1px #92BFF7',
                                boxShadow: 'none'
                              }),
                            }),
                         }}
                         />
                            </div>
                    </div> 
              </div>
            </div>
            <h2 className='font-normal bg-[#ECF0F4] p-2  '>{dataLang?.purchase_order_purchase_item_information || "purchase_order_purchase_item_information"}</h2>  
              <div className='pr-2'>
              <div className='grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10'>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-3    text-center    truncate font-[400]'>{"Mặt hàng"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-2   text-center  truncate font-[400]'>{"Kho hàng"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{"Đơn vị tính"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{"Số lượng"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{"Giá nhập"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{"% thuế"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]'>{"Thành tiền"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]'>{"Ghi chú"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]'>{"Thao tác"}</h4>
              </div>     
              </div>     
            <div className='h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
                <div className='pr-2'>
                  <React.Fragment>
                      <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]"> 
                          {sortedArr.map((e,index) => 
                            <div className='grid grid-cols-12 gap-1 py-1 ' key={e?.id}>
                            <div className='col-span-3  z-[100] my-auto'>
                           <Select 
                            onInputChange={_HandleSeachApi.bind(this)}
                            dangerouslySetInnerHTML={{__html: option.label}}
                           options={options}
                           onChange={_HandleChangeInputOption.bind(this, e?.id, "mathang",index)}
                           value={e?.mathang}
                           formatOptionLabel={(option) => (
                          <div className='flex items-center  justify-between py-2'>
                            <div className='flex items-center gap-2'>
                              <div>
                              {option.e?.images != null ? (<img src={option.e?.images} alt="Product Image" style={{ width: "40px", height: "50px" }} className='object-cover rounded' />):
                                    <div className='w-[50px] h-[60px] object-cover  flex items-center justify-center rounded'>
                                      <img src="/no_img.png" alt="Product Image" style={{ width: "40px", height: "40px" }} className='object-cover rounded' />
                                  </div>
                                  }
                              </div>
                              <div>
                                <h3 className='font-medium'>{option.e?.name}</h3>
                                <div className='flex gap-2'>
                                  <h5 className='text-gray-400 font-normal'>{option.e?.code}</h5>
                                  <h5 className='font-medium'>{option.e?.product_variation}</h5>
                                </div>
                                <h5 className='text-gray-400 font-medium text-xs'>{dataLang[option.e?.text_type]}</h5>
                              </div>
                            </div>
                            <div className=''>
                               <div className='text-right opacity-0'>{"0"}</div>
                               <div className='flex gap-2'>
                                 <div className='flex items-center gap-2'>
                                   <h5 className='text-gray-400 font-normal'>{dataLang?.purchase_survive || "purchase_survive"}:</h5><h5 className='text-[#0F4F9E] font-medium'>{option.e?.qty_warehouse ?? 0}</h5>
                                 </div>
                                
                                </div>
                            </div>
                          </div>
                        )}
                           placeholder={dataLang?.purchase_items || "purchase_items"} 
                           hideSelectedOptions={false}
                           className="rounded-md bg-white  xl:text-base text-[14.5px] z-20 mb-2" 
                           isSearchable={true}
                           noOptionsMessage={() => "Không có dữ liệu"}
                           menuPortalTarget={document.body}
                           style={{ border: "none", boxShadow: "none", outline: "none" }}
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
                              zIndex: 9999
                            }), 
                            control: (base, state) => ({
                              ...base,
                              ...(state.isFocused && {
                                border: '0 0 0 1px #92BFF7',
                                boxShadow: 'none'
                              }),
                            }),
                         }}
                         />
                            </div>
                            <div className='col-span-2  z-[19] my-auto'>
                           <Select 
                          //   onInputChange={_HandleSeachApi.bind(this)}
                          //   dangerouslySetInnerHTML={{__html: option.label}}
                          //  options={options}
                          //  onChange={_HandleChangeInputOption.bind(this, e?.id, "mathang",index)}
                          //  value={e?.mathang}
                           formatOptionLabel={(option) => (
                          <div className='flex items-center  justify-between py-2'>
                            {/* <div className='flex items-center gap-2'>
                              <div>
                              {option.e?.images != null ? (<img src={option.e?.images} alt="Product Image" style={{ width: "40px", height: "50px" }} className='object-cover rounded' />):
                                    <div className='w-[50px] h-[60px] object-cover  flex items-center justify-center rounded'>
                                      <img src="/no_img.png" alt="Product Image" style={{ width: "40px", height: "40px" }} className='object-cover rounded' />
                                  </div>
                                  }
                              </div>
                              <div>
                                <h3 className='font-medium'>{option.e?.name}</h3>
                                <div className='flex gap-2'>
                                  <h5 className='text-gray-400 font-normal'>{option.e?.code}</h5>
                                  <h5 className='text-[#0F4F9E] font-medium'>{option.e?.product_variation}</h5>
                                </div>
                                <h5 className='text-gray-400 font-medium text-xs'>{dataLang[option.e?.text_type]} {loai == "1" ? "-":""} {loai == "1" ? option.e?.purchases_code : ""} {loai == "1" ? "- Số lượng:":""} {loai == "1" ? option.e?.quantity_left  : ""}</h5>
                              </div>
                            </div>
                            <div className=''>
                               <div className='text-right opacity-0'>{"0"}</div>
                               <div className='flex gap-2'>
                                 <div className='flex items-center gap-2'>
                                   <h5 className='text-gray-400 font-normal'>{dataLang?.purchase_survive || "purchase_survive"}:</h5><h5 className='text-[#0F4F9E] font-medium'>{option.e?.qty_warehouse ?? 0}</h5>
                                 </div>
                                
                                </div>
                            </div> */}
                          </div>
                        )}
                           placeholder={"Kho hàng"} 
                           hideSelectedOptions={false}
                           className="rounded-md bg-white  xl:text-base text-[14.5px] z-19 mb-2" 
                           isSearchable={true}
                           noOptionsMessage={() => "Không có dữ liệu"}
                           menuPortalTarget={document.body}
                           style={{ border: "none", boxShadow: "none", outline: "none" }}
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
                              zIndex: 9999
                            }), 
                            control: (base, state) => ({
                              ...base,
                              ...(state.isFocused && {
                                border: '0 0 0 1px #92BFF7',
                                boxShadow: 'none'
                              }),
                            }),
                         }}
                         />
                            </div>
                         <div className='col-span-1 text-center flex items-center justify-center'>
                           <h3 className=''>{e?.donvitinh}</h3>
                        </div>
                        <div className='col-span-1 flex items-center justify-center'>
                           <div className="flex items-center justify-center">
                               <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                              onClick={() => handleDecrease(e?.id)}  disabled={index === 0} 
                              ><Minus size="16"/></button>
                              <NumericFormat
                                className="appearance-none text-center py-2 px-4 font-medium w-20 focus:outline-none border-b-2 border-gray-200"
                                onValueChange={_HandleChangeInputOption.bind(this, e?.id, "soluong",e)}
                                value={e?.soluong || 1}
                                thousandSeparator={false}
                                allowNegative={false}
                                // readOnly={index === 0 ? readOnlyFirst : false}
                                decimalScale={0}
                                isNumericString={true}  
                                isAllowed={(values) => { const {floatValue} = values; return floatValue > 0 }}       
                                />
                                <button  className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                                onClick={() => handleIncrease(e.id)} disabled={index === 0}
                                >
                                    <Add size="16"/>
                                </button>
                              </div>
                        </div>
                        <div className='col-span-1 text-center flex items-center justify-center'>
                          <NumericFormat
                                value={e?.gianhap}
                                onValueChange={_HandleChangeInputOption.bind(this, e?.id, "gianhap",index)}
                                allowNegative={false}
                                // readOnly={index === 0 ? readOnlyFirst : false}
                                decimalScale={0}
                                isNumericString={true}   
                                className="appearance-none text-center py-1 px-2 font-medium w-20 focus:outline-none border-b-2 border-gray-200"
                                thousandSeparator=","
                            />
                        </div>
                        <div className='col-span-1 flex justify-center items-center'>
                        <Select 
                            options={taxOptions}
                            onChange={_HandleChangeInputOption.bind(this, e?.id, "thue", index)}
                            value={e?.thue ? {label: taxOptions.find(item => item.value === e?.thue?.value)?.label, value: e?.thue?.value, tax_rate: e?.thue?.tax_rate} : null}
                            placeholder={"% Thuế"} 
                            hideSelectedOptions={false}
                            formatOptionLabel={(option) => (
                              <div className='flex justify-start items-center gap-1 '>
                                  <h2>{option?.label}</h2>
                                  <h2>{`(${option?.tax_rate})`}</h2>
                              </div>
                            )}
                            className={` "border-transparent placeholder:text-slate-300 w-full z-19 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `} 
                            isSearchable={true}
                            noOptionsMessage={() => "Không có dữ liệu"}
                            // dangerouslySetInnerHTML={{__html: option.label}}
                            menuPortalTarget={document.body}
                            closeMenuOnSelect={true}
                            style={{ border: "none", boxShadow: "none", outline: "none" }}
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
                                zIndex: 20
                              }), 
                              control: (base,state) => ({
                                ...base,
                                boxShadow: 'none',
                                padding:"2.7px",
                              ...(state.isFocused && {
                                border: '0 0 0 1px #92BFF7',
                              }),
                            })
                          }}
                          />
                        </div>
                        <div className='col-span-1 text-right flex items-center justify-end'>
                           {/* <h3 className='px-2'>{formatNumber(e.thanhtien)}</h3> */}
                           <h3 className='px-2'>{e?.thanhtien}</h3>
                        </div>
                         <div className='col-span-1 flex items-center justify-center'>
                             <input
                                 value={e?.ghichu}                
                                 onChange={_HandleChangeInputOption.bind(this, e?.id, "ghichu",index)}
                                 name="optionEmail"     
                                 placeholder='Ghi chú'                 
                                 type="text"
                                 className= "focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                               /> 
                         </div>
                         <div className='col-span-1 flex items-center justify-center'>
                           <button
                            onClick={_HandleDelete.bind(this, e?.id)}
                             type='button' title='Xóa' className='transition  w-full bg-slate-100 h-10 rounded-[5.5px] text-red-500 flex flex-col justify-center items-center mb-2'><IconDelete /></button>
                         </div>
                           </div>
                          )} 
                          </div>
                  </React.Fragment>
                </div>
            </div>
        <h2 className='font-normal bg-[white]  p-2 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]'>{dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"} </h2>  
        </div>
        <div className='grid grid-cols-12'>
            <div className='col-span-10'>
                <div className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_note || "purchase_order_note"}</div>
                  <textarea
                    value={note}       
                    placeholder={dataLang?.purchase_order_note || "purchase_order_note"}         
                    onChange={_HandleChangeInput.bind(this, "note")}
                    name="fname"                      
                    type="text"
                    className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-[40%] min-h-[220px] max-h-[220px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                  />
            </div>
            <div className="text-right mt-5 space-y-4 col-span-2 flex-col justify-between ">
                <div className='flex justify-between '>
                </div>
                <div className='flex justify-between '>
                     <div className='font-normal'><h3>{"Tổng số lượng"}</h3></div>
                    {/* <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.tongTien)}</h3></div> */}
                </div>
                <div className='flex justify-between '>
                     <div className='font-normal'><h3>{"Tổng số lượng duyệt"}</h3></div>
                    {/* <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.tienChietKhau)}</h3></div> */}
                </div>
                <div className='flex justify-between '>
                     <div className='font-normal'><h3>{"Tổng giá trị"}</h3></div>
                    {/* <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.tongTienSauCK)}</h3></div> */}
                </div>
                <div className='space-x-2'>
                <button
                 onClick={() => router.back()} 
                 className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]">{dataLang?.purchase_order_purchase_back || "purchase_order_purchase_back"}</button>
                  <button 
                  onClick={_HandleSubmit.bind(this)} 
                   type="submit"className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]">{dataLang?.purchase_order_purchase_save || "purchase_order_purchase_save"}</button>
                </div>
            </div>
        </div>
      
    </div>
</React.Fragment>
  )
}
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
    const maxToShow = 2;
    const overflow = getValue()
      .slice(maxToShow)
      .map((x) => x.label);
  
    return index < maxToShow ? (
      <components.MultiValue {...props} />
    ) : index === maxToShow ? (
      <MoreSelectedBadge items={overflow} />
    ) : null;
};

export default Index