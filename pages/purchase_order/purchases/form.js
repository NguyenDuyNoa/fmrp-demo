import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head';
import {_ServerInstance as Axios} from '/services/axios';


const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});
import dynamic from 'next/dynamic';
import Select,{components } from 'react-select';
import { Edit as IconEdit,  Grid6 as IconExcel, Trash as IconDelete, SearchNormal1 as IconSearch,Add as IconAdd, LocationTick, User,Image as IconImage, Add, Minus  } from "iconsax-react";
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import {NumericFormat} from "react-number-format";
import Link from 'next/link';
import moment from 'moment/moment';
import ModalImage from "react-modal-image";



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

    const dataLang = props.dataLang
    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };
    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingDetail, sOnFetchingDetail] = useState(false);

    const [data, sData] = useState([]);
    const [listBr, sListBr]= useState()
    const [idBranch, sIdBranch] = useState(null);
    const [code, sCode] = useState('')
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
    const [namePromis, sNamePromis] = useState('Yêu cầu mua hàng (PR)')
    const [note, sNote] = useState()

    const [totalSoluong, setTotalSoluong] = useState(0)
    const [totalQty, setTotalQty] = useState(0)

    const [errName, sErrName] = useState(false);
    const [errCode, sErrCode] = useState(false);
    const [errDate, sErrDate] = useState(false);
    const [errBranch, sErrBranch] = useState(false);
    const [onSending, sOnSending] = useState(false);
    useEffect(() => {
      router.query && sErrDate(false)
      router.query && sErrName(false)
      router.query && sErrCode(false)
      router.query && sErrBranch(false)
      router.query && sCode( "")
      router.query && sNamePromis('Yêu cầu mua hàng (PR)')
      router.query && setSelectedDate(moment().format('YYYY-MM-DD HH:mm:ss'))
      router.query && sNote("")
  }, [router.query]);
  const [option, sOption] = useState([{id: Date.now(), mathang: null, donvitinh:"", soluong:0, ghichu:""}]);
    const slicedArr = option.slice(1);
    const sortedArr = slicedArr.sort((a, b) => b.id - a.id);
    sortedArr.unshift(option[0]);
    const _ServerFetching =  () => {
        Axios("GET", "/api_web/api_product/searchItemsVariant?csrf_protection=true", { 
        }, (err, response) => {
            if(!err){
                var {result} =  response.data.data
                sData(result?.map(e => ({label: `${e.name} <span style={{display: none}}>${e.code}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,value:e.id,e})))
                // const options = data?.map(e => ({label: `${e.name} <span style={{display: none}}>${e.code}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,value:e.id,e}))
            }
        })
        Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {
          params:{
           limit: 0,
          }
       }, (err, response) => {
         if(!err){
             var {rResult} =  response.data
             sListBr(rResult)
         }
        })
        sOnFetching(false)
    }
    const _ServerFetchingDetail =  () => {
      Axios("GET", `/api_web/Api_purchases/purchases/${id}?csrf_protection=true`, {
    }, (err, response) => {
        if(!err){
            var rResult = response.data;
          sCode(rResult?.code )
          sNamePromis(rResult?.name)
          setSelectedDate(moment(rResult?.date).format('YYYY-MM-DD HH:mm:ss'))
          sNote(rResult?.note)
          sIdBranch(({label: rResult?.branch_name, value:rResult?.branch_id}))
          const itemlast =  [{mathang: null}]
          const item = itemlast?.concat(rResult?.items?.map(e => ({id: e.item.id, data: e.item.id, ghichu: e.note, donvitinh: e.item.unit_name, soluong: Number(e.quantity), mathang: {e: e.item,label: `${e.item.name} <span style={{display: none}}>${e.item.code}</span><span style={{display: none}}>${e.item.product_variation} </span><span style={{display: none}}>${e.item.text_type} ${e.item.unit_name} </span>`,value:e.item.id}})))
          sOption(item) 
          let listQty = rResult?.items
          let totalQuantity = 0;
          for (let i = 0; i < listQty.length; i++) {
            totalQuantity += parseInt(listQty[i].quantity);
          }
          setTotalSoluong(totalQuantity)
          setTotalQty(rResult?.items?.length);
        
        }
        sOnFetchingDetail(false)
    })
  }
    
      const listBr_filter = listBr?.map(e =>({label: e.name, value: e.id}))
      const branch_id = idBranch?.value
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
        const newTotal = newOption.slice(1).reduce((total, item) => total + item.soluong, 0); // tính toán lại tổng số lượng bắt đầu từ phần tử thứ 2
        sOption(newOption); // cập nhật lại mảng
        setTotalSoluong(newTotal); // cập nhật lại tổng số lượng
        setTotalQty(newOption.slice(1).length); // cập nhật lại độ dài của mảng từ phần tử thứ 2 trở đi
      }
      const _HandleChangeInput = (type, value) => {
        if(type == "branch"){
          sIdBranch(value)
        }else if(type == "date"){
          setSelectedDate(moment(value.target.value).format('YYYY-MM-DD HH:mm:ss'))
        }else if(type == "code"){
          sCode(value.target.value)
        }else if(type == "namePromis"){
          sNamePromis(value.target.value)
        }else if(type == "note"){
          sNote(value.target.value)
        }
      }
      // console.log(sortedArr);
      const _HandleChangeInputOption = (id, type,index3, value) => {
        var index = option.findIndex(x => x.id === id );
        if(type == "mathang"){
          const hasSelectedOption = option.some((o) => o.mathang?.value === value.value);
            if (hasSelectedOption) {
              return Toast.fire({
              title: `${"Mặt hàng này đã được chọn "}`,
              icon: 'error',
              confirmButtonColor: '#296dc1',
              cancelButtonColor: '#d33',
              confirmButtonText: `${dataLang?.aler_yes}`,
              })
            }else {
              if(option[index].mathang){
                option[index].mathang = value
                // console.log(value)
                option[index].donvitinh =  value?.e?.unit_name
                // option[index].ghichu = value.ghichu
              }else{
                const newData = {id: Date.now(), mathang: value, donvitinh: value?.e?.unit_name, soluong: 1, ghichu:""}
                option.push(newData)
                const newOption = option.slice(1); // Tạo một mảng mới bắt đầu từ phần tử thứ hai của option
                setTotalQty(newOption.length)
                const newTotal = newOption.reduce((total, item) => total + item.soluong, 0); // Tính tổng số lượng trong mảng mới
                setTotalSoluong(newTotal);
              }
            }
        }else if(type == "donvitinh"){
          option[index].donvitinh = value.target?.value;
        }else if (type === "soluong") {
          option[index].soluong = Number(value?.value);
          const newTotal = option.reduce((total, item) => {
            if (!isNaN(item.soluong)) {
              return total + parseInt(item.soluong);
            } else {
              // console.log(`Value of item.soluong is not a number: ${item.soluong}`);
              return total;
            }
          }, 0);
          sOption([...option]);
          setTotalSoluong(newTotal);
        }else if(type == "ghichu"){
          option[index].ghichu = value?.target?.value;
        }
        sOption([...option])
      }
      const handleIncrease = (id) => {
        const index = option.findIndex((x) => x.id === id);
        const newQuantity = option[index].soluong + 1;
        option[index].soluong = newQuantity;
        setTotalSoluong(totalSoluong + 1);
        sOption([...option]);
      };
      const handleDecrease = (id) => {
        const index = option.findIndex((x) => x.id === id);
        const newQuantity = option[index].soluong - 1;
        if (newQuantity >= 1) { // chỉ giảm số lượng khi nó lớn hơn hoặc bằng 1
          option[index].soluong = newQuantity;
          setTotalSoluong(totalSoluong - 1);
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
      const _HandleSubmit = (e) => {
        e.preventDefault();
          if(namePromis?.length == 0 || selectedDate?.length == 0 || branch_id == null){
            namePromis?.length == 0 && sErrName(true);
            selectedDate?.length == 0 && sErrDate(true)
            branch_id == null && sErrBranch(true)
              Toast.fire({
                  icon: 'error',
                  title: `${props.dataLang?.required_field_null}`
              })
          }else {
              sOnSending(true)
          }
      }
      const dataOption = sortedArr?.map(e => { return {data: e?.mathang?.value, soluong: e.soluong, ghichu:e.ghichu}})
      const newDataOption = dataOption?.filter(e => e?.data !== undefined);
      const readOnlyFirst = true;

      const _ServerSending = () => {
        var formData = new FormData();
        formData.append("code", code)
        formData.append("name", namePromis)
        formData.append("date", (moment(selectedDate).format("YYYY-MM-DD HH:mm:ss")))
        formData.append("branch_id", branch_id)
        formData.append("note", note)
        newDataOption.forEach((item, index) => {
          formData.append(`items[${index}][item]`, item?.data);
          formData.append(`items[${index}][quantity]`,  item?.soluong.toString());
          formData.append(`items[${index}][note]`, item?.ghichu);
      });  
        Axios("POST", `${id ? `/api_web/Api_purchases/purchases/${id}?csrf_protection=true` : `/api_web/Api_purchases/purchases/?csrf_protection=true`}`, {
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'}
        }, (err, response) => {
            if(!err){
                var {isSuccess, message} = response.data
                if(isSuccess){
                    Toast.fire({
                        icon: 'success',
                        title: `${props.dataLang[message]}`
                    })
                    sCode("")
                    sNamePromis('Yêu cầu mua hàng (PR)')
                    // setSelectedDate(new Date().toISOString().slice(0, 10))
                    setSelectedDate(moment().format('YYYY-MM-DD HH:mm:ss'))
                    sNote("")
                    sIdBranch(null)
                    sErrDate(false)
                    sErrName(false)
                    sErrCode(false)
                    sErrBranch(false)
                    sOption([{id: Date.now(), mathang: null, donvitinh:"", soluong:0, ghichu:""}])
                    setTotalSoluong(0); // cập nhật lại tổng số lượng
                    setTotalQty(0)
                    router.back()
                }else {
                  if(totalQty == 0){
                    Toast.fire({
                      icon: 'error',
                      title: `Chưa nhập thông tin mặt hàng`
                  })
                  }
                  else{
                    Toast.fire({
                      icon: 'error',
                      title: `${props.dataLang[message]}`
                    })
                  }
                   
                }
            }
            sOnSending(false)
        })
    }
    const _HandleSeachApi = (inputValue) => {
     Axios("POST",`/api_web/api_product/searchItemsVariant?csrf_protection=true`, {
          data: {
            term: inputValue,
          },
        }, (err, response) => {
              if(!err){
                var {result} = response?.data.data
                sData(result?.map(e => ({label: `${e.name} <span style={{display: none}}>${e.code}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,value:e.id,e})))
            }
          }
      )};
    

      useEffect(() => {
          onSending && _ServerSending()
      }, [onSending]);

      useEffect(() => {
        sErrName(false)
      }, [namePromis?.length > 0]);

      useEffect(() => {
      
        sErrCode(false)
      }, [code?.length > 0]);

      useEffect(() => {
        sErrDate(false)
      }, [selectedDate?.length > 0]);

      useEffect(() => {
        sErrBranch(false)
      }, [branch_id != null]);


      useEffect(() => {
        onFetching && _ServerFetching() 
      }, [onFetching]);

      useEffect(() => {
          router.query && sOnFetching(true) 
      }, [router.query]);

      useEffect(() => {
        onFetchingDetail && _ServerFetchingDetail()
      }, [onFetchingDetail]);
      useEffect(() => {
        id && sOnFetchingDetail(true) 
      }, []);

      // useEffect(() => {
       
      //   sFetchingSuccess(false)
      // }, [fetchingSuccess]);

      const formatNumber = (num) => {
        if (!num && num !== 0) return 0;
        const roundedNum = parseFloat(num.toFixed(2));
        return roundedNum.toLocaleString("en", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          useGrouping: true
        });
      };


  return (
    <React.Fragment>
    <Head>
        <title>{id ? dataLang?.purchase_edit || "purchase_edit" : dataLang?.purchase_add || "purchase_add"}</title>
    </Head>
    {/* <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between'> */}
    <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 flex flex-col justify-between'>
        <div className='h-[97%] space-y-3 overflow-hidden'>
            <div className='flex space-x-3 '>
                <h6 className='text-[#141522]/40 '>{dataLang?.purchase_purchase || "purchase_purchase"}</h6>
                <span className='text-[#141522]/40 '>/</span>
                <h6 className=''>{id ? dataLang?.purchase_edit || "purchase_edit" : dataLang?.purchase_add || "purchase_add"}</h6>
            </div>
            <div className='flex justify-between items-center'>
                <h2 className=' '>{id ? dataLang?.purchase_edit || "purchase_edit" : dataLang?.purchase_add || "purchase_add"}</h2>
                <div className="flex justify-end items-center">
                    <button   onClick={() => router.back()} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105">{dataLang?.warehouses_detail_back}</button>
                  </div>
            </div>    
            <div className=' w-full rounded'>
              <div className=''>  
                  <h2 className='font-normal bg-[#ECF0F4] p-2 '>{dataLang?.purchase_general || "purchase_general"}</h2>       
                  
                    <div className="flex flex-wrap justify-between items-center mt-2"> 
                      <div className='w-[24.5%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1  2xl:text-[12px] xl:text-[13px] text-[13px]">{dataLang?.purchase_code || "purchase_code"} </label>
                          <input
                            value={code}                
                            onChange={_HandleChangeInput.bind(this, "code")}
                            name="fname"                      
                            type="text"
                            placeholder={dataLang?.purchase_err_Name_sytem || "purchase_err_Name_sytem"}
                            className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}/>
                      </div>
                      <div className='w-[24.5%]'>
                              <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[13px] mb-1 ">{dataLang?.purchase_day || "purchase_day"} <span className="text-red-500">*</span></label>
                              <input
                                value={selectedDate}              
                                onChange={_HandleChangeInput.bind(this, "date")}
                                name="fname"                      
                                type="datetime-local"
                                placeholder={dataLang?.purchase_err_Name_sytem || "purchase_err_Name_sytem"}
                                className={`${errDate ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}/>
                                {errDate && <label className="text-sm text-red-500">{dataLang?.purchase_err_Date || "purchase_err_Date"}</label>}
                            
                          </div>
                      <div className='w-[24.5%]'>
                          <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[13px] mb-1 ">{dataLang?.purchase_name || "purchase_name"}</label>
                            <input
                            value={namePromis}                
                            onChange={_HandleChangeInput.bind(this, "namePromis")}
                            name="fname"                      
                            type="text"
                            placeholder={dataLang?.purchase_name || "purchase_name"}
                            className={`${errName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}/>
                            {errName && <label className="text-sm text-red-500">{dataLang?.purchase_err_Name || "purchase_err_Name"}</label>}
                        
                        {/* <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_list_name}<span className="text-red-500">*</span></label> */}
                        </div>
                        <div className='w-[24.5%]'>
                        <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[13px] mb-1 ">{dataLang?.purchase_branch || "purchase_branch"} <span className="text-red-500">*</span></label>
                          <Select 
                              options={listBr_filter}
                              onChange={_HandleChangeInput.bind(this, "branch")}
                              value={idBranch}
                              placeholder={dataLang?.client_list_filterbrand} 
                              hideSelectedOptions={false}
                              isClearable={true}
                              className={`${errBranch ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                  // border: 'none',
                                  // outline: 'none',
                                  boxShadow: 'none',
                                  padding:"2.7px",
                                ...(state.isFocused && {
                                  border: '0 0 0 1px #92BFF7',
                                }),
                              })
                            }}
                            />
                            
                            {errBranch && <label className="text-sm text-red-500">{dataLang?.purchase_err_branch || "purchase_err_branch"}</label>}
                          </div>
                      
                        
                    </div>
                 
              </div>
            </div>
            <h2 className='font-normal bg-[#ECF0F4] p-2  2xl:text-[12px] xl:text-[13px] text-[13px] '>{dataLang?.purchase_iteminfo || "purchase_iteminfo"}</h2>  
              <div className='pr-2'>
              <div className='grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10'>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[13px] px-2  text-[#667085] uppercase col-span-1      text-center  font-[400]'>{"Stt"}</h4>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[13px] px-2  text-[#667085] uppercase col-span-4   truncate font-[400]'>{dataLang?.purchase_items || "purchase_items"}</h4>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[13px] px-2  text-[#667085] uppercase col-span-1     text-center  truncate font-[400]'>{dataLang?.purchase_unit || "purchase_unit"}</h4>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[13px] px-2  text-[#667085] uppercase  col-span-2    text-center   truncate font-[400]'>{dataLang?.purchase_quantity || "purchase_quantity"}</h4>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[13px] px-2  text-[#667085] uppercase  col-span-3     truncate font-[400]'>{dataLang?.purchase_note || "purchase_note"}</h4>
                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[13px] px-2  text-[#667085] uppercase  col-span-1 text-center     truncate font-[400]'>{dataLang?.purchase_operation || "purchase_operation"}</h4>
              </div>     
              </div>     
            <div className='h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
            {/* <div className='h-[400px] '> */}
            {/* <div className=''> */}
                <div className='pr-2'>
                  <React.Fragment>
                      <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]"> 
                      {/* <ScrollArea className=" h-[400px] overflow-hidden" speed={1}  smoothScrolling={true}> */}
                          {sortedArr.map((e,index) => 
                           <div className='grid grid-cols-12 gap-1 py-1 ' key={e.id}>
                           <div className='col-span-1 flex items-center justify-center'>
                             <h3 className="text-[#344054] font-normal text-center text-sm mb-1 ml-2 ">{index + 1}</h3>
                           </div>
                           <div className='col-span-4  z-[100] my-auto'>
                           <Select 
                          onInputChange={_HandleSeachApi.bind(this)}
                          dangerouslySetInnerHTML={{__html: option.label}}
                           options={data}
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
                                  <h3 className='font-normal'>{option.e?.name}</h3>
                                  <div className='flex gap-2'>
                                    <h5 className='text-gray-400 font-normal'>{option.e?.code}</h5>
                                    <h5 className='font-normal'>{option?.e?.product_variation}</h5>
                                  </div>
                                  <h5 className='text-gray-400 font-normal text-xs'>{dataLang[option.e?.text_type]}</h5>
                                </div>
                              </div>
                              <div className=''>
                                 <div className='text-right opacity-0'>{"0"}</div>
                                 <div className='flex gap-2'>
                                   <div className='flex items-center gap-2'>
                                     <h5 className='text-gray-400 font-normal'>{dataLang?.purchase_survive || "purchase_survive"}:</h5><h5 className='text-[#0F4F9E] font-normal'>{option.e?.qty_warehouse ?? 0}</h5>
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
                         <div className='col-span-1 text-center flex items-center justify-center'>
                           <h3 className='2xl:text-[12px] xl:text-[13px] text-[13px]'>{e.donvitinh}</h3>
                        </div>
                         <div className='col-span-2 flex items-center justify-center'>
                           <div className="flex items-center justify-center">
                               <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                              onClick={() => handleDecrease(e.id)}  disabled={index === 0} ><Minus size="14"/></button>
                              <NumericFormat
                                  className="appearance-none text-center 2xl:text-[12px] xl:text-[13px] text-[13px] py-2 px-2 font-normal w-24 focus:outline-none border-b-2 border-gray-200"
                                onValueChange={_HandleChangeInputOption.bind(this, e.id, "soluong",e)}
                                value={e?.soluong || 1}
                                allowNegative={false}
                                // readOnly={index === 0 ? readOnlyFirst : false}
                                decimalScale={0}
                                isNumericString={true}  
                                thousandSeparator=","
                                isAllowed={(values) => { const {floatValue} = values; return floatValue > 0 }}      
                                />
                                <button  className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                                onClick={() => handleIncrease(e.id)} disabled={index === 0}><Add size="14"/></button>
                              </div>
                            </div>
                         <div className='col-span-3 flex items-center justify-center'>
                             <input
                                 value={e.ghichu}                
                                 onChange={_HandleChangeInputOption.bind(this, e.id, "ghichu",index)}
                                 name="optionEmail"     
                                 placeholder='Ghi chú'                 
                                 type="text"
                                 className= "focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                               /> 
                         </div>
                         <div className='col-span-1 flex items-center justify-center'>
                           <button onClick={_HandleDelete.bind(this, e.id)}
                             type='button' title='Xóa' className='transition  w-full bg-slate-100 h-10 rounded-[5.5px] text-red-500 flex flex-col justify-center items-center mb-2'><IconDelete /></button>
                         </div>
                           </div>
                          )} 
                          </div>
                      {/* </ScrollArea> */}
                  </React.Fragment>
                </div>
            </div>
            <h2 className='font-normal bg-[white] shadow-xl p-2 border-b border-b-[#a9b5c5] 2xl:text-[12px] xl:text-[13px] text-[13px]  border-t border-t-[#a9b5c5]'>{dataLang?.purchase_total || "purchase_total"} </h2>  

        </div>
        <div className='grid grid-cols-12'>
            <div className='col-span-9'>
                        <div className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[13px] mb-1 ">{dataLang?.purchase_note || ""}</div>
                          <textarea
                            value={note}       
                            placeholder={props.dataLang?.client_popup_note}         
                            onChange={_HandleChangeInput.bind(this, "note")}
                            name="fname"                      
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-[40%] min-h-[120px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                          />
            </div>
            <div className="text-right mt-5 space-y-4 col-span-3 flex-col justify-between ">
                <div className='flex justify-between '>
                  <div className='font-normal 2xl:text-[12px] xl:text-[13px] text-[13px]'><h3>{dataLang?.purchase_totalCount || "purchase_totalCount"}</h3></div>
                  <div className='font-normal 2xl:text-[12px] xl:text-[13px] text-[13px]'><h3 className='text-blue-600'>{formatNumber(totalSoluong)}</h3></div>
                </div>
                <div className='flex justify-between '>
                  <div className='font-normal 2xl:text-[12px] xl:text-[13px] text-[13px]'><h3>{dataLang?.purchase_totalItem || "purchase_totalItem"}</h3></div>
                  <div className='font-normal 2xl:text-[12px] xl:text-[13px] text-[13px]'><h3 className='text-blue-600'>{formatNumber(totalQty)}</h3></div>
                </div>
                <div className='space-x-2'>
                <button onClick={() => router.back()} className="button text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[13px] py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]">{dataLang?.purchase_back || "purchase_back"}</button>
                  <button onClick={_HandleSubmit.bind(this)}  type="submit"className="button text-[#FFFFFF]  font-normal 2xl:text-[12px] xl:text-[13px] text-[13px] py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]">{dataLang?.purchase_save || "purchase_save"}</button>
                </div>
            </div>
        </div>
    </div>
</React.Fragment>
  )
}
export default Index