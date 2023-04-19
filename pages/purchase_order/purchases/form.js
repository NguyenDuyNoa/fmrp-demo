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



const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
})
const Index = (props) => {
    const router = useRouter();
    // console.log(router)
    const id = router.query?.id
    const dataLang = props.dataLang
    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };
    const [onFetching, sOnFetching] = useState(false);
    const [data, sData] = useState([]);
    const [listBr, sListBr]= useState()
    const [idBranch, sIdBranch] = useState(null);
    const [code, sCode] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
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
       sErrDate(false)
       sErrName(false)
       sErrCode(false)
       sErrBranch(false)
       sCode("")
       sNamePromis('Yêu cầu mua hàng (PR)')
       setSelectedDate(new Date().toISOString().slice(0, 10))
       sNote("")
  }, []);


    const _ServerFetching =  () => {
        Axios("GET", "/api_web/api_product/searchItemsVariant?csrf_protection=true", { 
        }, (err, response) => {
            if(!err){
                var {result} =  response.data.data
                sData(result)
            }
            sOnFetching(false)
        })
        Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {
          params:{
           limit: 0,
          }
       }, (err, response) => {
         if(!err){
             var {rResult, output} =  response.data
             sListBr(rResult)
         }
         sOnFetching(false)
       })
    }


    const options = data?.map(e => ({label: e.name, value:e.id,code:e.code,e}))
    const [option, sOption] = useState([{id: Date.now(), mathang: null, donvitinh:"", soluong:0, ghichu:""}]);
    const listBr_filter = listBr?.map(e =>({label: e.name, value: e.id}))


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
          setSelectedDate(value.target.value)
        }else if(type == "code"){
          sCode(value.target.value)
        }else if(type == "namePromis"){
          sNamePromis(value.target.value)
        }else if(type == "note"){
          sNote(value.target.value)
        }
      }
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
          option[index].soluong = Number(value?.target.value);
          sOption([...option]);
          const newTotal = option.reduce((total, item) => total + item.soluong, 0);
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
      const branch_id = idBranch?.value
      const _HandleSubmit = (e) => {
        e.preventDefault();
        if(namePromis?.length == 0 || selectedDate?.length == 0 || code?.length == 0 || branch_id == null){
          namePromis?.length == 0 && sErrName(true);
          selectedDate?.length == 0 && sErrDate(true)
          code?.length == 0 && sErrCode(true)
          branch_id == null && sErrBranch(true)
           
            Toast.fire({
                icon: 'error',
                title: `${props.dataLang?.required_field_null}`
            })
        }else {
            sOnSending(true)
        }
      }
      // console.log(option.map(e));
      const dataOption = option?.map(e => {
        return {data: e?.mathang?.value, soluong: e.soluong, ghichu:e.ghichu}
      })
   
      const newDataOption = dataOption?.filter(e => e?.data !== undefined);

      const _ServerSending = () => {
        var formData = new FormData();
        formData.append("code", code)
        formData.append("name", namePromis)
        formData.append("date", selectedDate)
        formData.append("branch_id", branch_id)
        formData.append("note", note)
        newDataOption.forEach((item, index) => {
          formData.append(`items[${index}][item]`, item?.data);
          formData.append(`items[${index}][quantity]`, item?.soluong);
          formData.append(`items[${index}][note]`, item?.ghichu);
      });
        Axios("POST", `/api_web/Api_purchases/purchases/?csrf_protection=true`, {
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
                    setSelectedDate(new Date().toISOString().slice(0, 10))
                    sNote("")
                    sIdBranch(null)
                    sErrDate(false)
                    sErrName(false)
                    sErrCode(false)
                    sErrBranch(false)
                    sOption([{id: Date.now(), mathang: null, donvitinh:"", soluong:0, ghichu:""}])
                    setTotalSoluong(0); // cập nhật lại tổng số lượng
                     setTotalQty(0)
                    
                }else{
                    Toast.fire({
                        icon: 'error',
                        title: `${props.dataLang[message]}`
                    })
                }
            }
            sOnSending(false)
        })
    }

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
      const readOnlyFirst = true;

  return (
    <React.Fragment>
    <Head>
        <title>{"Tạo phiếu yêu cầu mua hàng"}</title>
    </Head>
    {/* <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between'> */}
    <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 flex flex-col justify-between'>
        <div className='h-[97%] space-y-3 overflow-hidden'>
            <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                <h6 className='text-[#141522]/40'>{"Mua hàng"}</h6>
                <span className='text-[#141522]/40'>/</span>
                <h6>{"Tạo phiếu yêu cầu mua hàng"}</h6>
            </div>
            <div className='flex justify-between items-center'>
                <h2 className='xl:text-2xl text-xl '>{"Tạo phiếu yêu cầu mua hàng"}</h2>
            </div>    
            <div className=' w-full rounded'>
              <div className=''>  
                  <h2 className='font-normal bg-[#ECF0F4] p-2'>Thông tin chung</h2>       
                  <div className="flex flex-wrap justify-between items-center mt-2"> 
                    <div className='w-[24.5%]'>
                        <label className="text-[#344054] font-normal text-sm mb-1 ">{"Mã chứng từ"} <span className="text-red-500">*</span></label>
                        <input
                          value={code}                
                          onChange={_HandleChangeInput.bind(this, "code")}
                          name="fname"                      
                          type="text"
                          placeholder={"Mặc định theo hệ thống"}
                          className={`${errCode ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}/>
                         {errCode && <label className="text-sm text-red-500">{"Vui lòng nhập mã chứng từ" || ""}</label>}
                    </div>
                    <div className='w-[24.5%]'>
                            <label className="text-[#344054] font-normal text-sm mb-1 ">{"Ngày chứng từ"} <span className="text-red-500">*</span></label>
                            <input
                              value={selectedDate}              
                              onChange={_HandleChangeInput.bind(this, "date")}
                              name="fname"                      
                              type="date"
                              placeholder={"Mặc định theo hệ thống"}
                              className={`${errDate ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}/>
                              {errDate && <label className="text-sm text-red-500">{"Vui lòng nhập ngày chứng từ" || ""}</label>}
                          
                        </div>
                    <div className='w-[24.5%]'>
                        <label className="text-[#344054] font-normal text-sm mb-1 ">{"Tên phiếu yêu cầu"}</label>
                          <input
                          value={namePromis}                
                          onChange={_HandleChangeInput.bind(this, "namePromis")}
                          name="fname"                      
                          type="text"
                          placeholder={"Tên phiếu yêu cầu"}
                          className={`${errName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}/>
                          {errName && <label className="text-sm text-red-500">{"Vui lòng nhập tên phiếu" || ""}</label>}
                      
                      {/* <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_list_name}<span className="text-red-500">*</span></label> */}
                      </div>
                      <div className='w-[24.5%]'>
                      <label className="text-[#344054] font-normal text-sm mb-1 ">{"Chi nhánh"} <span className="text-red-500">*</span></label>
                        <Select 
                            options={listBr_filter}
                            onChange={_HandleChangeInput.bind(this, "branch")}
                            value={idBranch}
                            placeholder={dataLang?.client_list_filterbrand} 
                            hideSelectedOptions={false}
                            isClearable={true}
                            className={`${errBranch ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                zIndex: 9999
                              }), 
                              control: (base,state) => ({
                                ...base,
                                // border: 'none',
                                // outline: 'none',
                                boxShadow: 'none',
                              ...(state.isFocused && {
                                border: '0 0 0 1px #92BFF7',
                              }),
                            })
                          }}
                          />
                          
                          {errBranch && <label className="text-sm text-red-500">{"Vui lòng chọn chi nhánh" || ""}</label>}
                        </div>
                     
                      
                </div>
              </div>
            </div>
            <h2 className='font-normal bg-[#ECF0F4] p-2  '>Thông tin mặt hàng</h2>  
              <div className='pr-2'>
              <div className='grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10'>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase col-span-1      text-center  font-[400]'>{"Stt"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase col-span-4   truncate font-[400]'>{"Mặt hàng"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase col-span-1     text-center  truncate font-[400]'>{"Đơn vị tính"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center   truncate font-[400]'>{"Số lượng"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-4     truncate font-[400]'>{"Ghi chú"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1 text-center     truncate font-[400]'>{"Thao tác"}</h4>
              </div>     
              </div>     
            <div className='h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
            {/* <div className='h-[400px] '> */}
            {/* <div className=''> */}
                <div className='pr-2'>
                  <React.Fragment>
                      <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]"> 
                      {/* <ScrollArea className=" h-[400px] overflow-hidden" speed={1}  smoothScrolling={true}> */}
                          {option.map((e,index) => 
                           <div className='grid grid-cols-12 gap-1 py-1 ' key={e.id}>
                           <div className='col-span-1 '>
                             <h3 className="text-[#344054] font-normal text-center text-sm mb-1 ml-2">{index + 1}</h3>
                           </div>
                           <div className='col-span-4  z-[100]'>
                           <Select 
                           options={options}
                           onChange={_HandleChangeInputOption.bind(this, e?.id, "mathang",index)}
                           value={e?.mathang}
                           formatOptionLabel={(option) => (
                            <div className='flex items-center  justify-between py-2'>
                              <div className='flex items-center gap-2'>
                                <div>
                                  {option.e.images != null ? (<img src={option.e.images} alt="Product Image" style={{ width: "50px", height: "60px" }} className='object-cover rounded' />):
                                    <div className='w-[50px] h-[60px] object-cover bg-gray-200 flex items-center justify-center rounded'>
                                      <IconImage/>
                                    </div>
                                  }
                                </div>
                                <div>
                                  <h3 className='font-medium'>{option.e.name}</h3>
                                  <div className='flex gap-2'>
                                    <h5 className='text-gray-400 font-normal'>{option.e.code}</h5>
                                    <h5 className='text-[#0F4F9E] font-medium'>{option.e.product_variation}</h5>
                                  </div>
                                  <h5 className='text-gray-400 font-medium text-xs'>{option.e.text_type === "product" ? dataLang?.product : option.e.text_type === "material" ? dataLang?.material : ""}</h5>
                                </div>
                              </div>
                              <div className=''>
                                 <div className='text-right opacity-0'>{"0"}</div>
                                 <div className='flex gap-2'>
                                   <div className='flex items-center gap-2'>
                                     <h5 className='text-gray-400 font-normal'>Tồn:</h5><h5 className='text-[#0F4F9E] font-medium'>{option.e.qty_warehouse ?? 0}</h5>
                                   </div>
                                  
                                  </div>
                              </div>
                            </div>
                          )}
                           placeholder={"Mặt hàng"} 
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
                         <div className='col-span-1 text-center'>
                           <h3 className=''>{e.donvitinh}</h3>
                        </div>
                         <div className='col-span-1 '>
                           <div className="flex items-center justify-center">
                               <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center w-[25px] h-[25px]  bg-slate-200 rounded-full"
                              onClick={() => handleDecrease(e.id)}  disabled={index === 0} ><Minus size="16"/></button>
                              <NumericFormat
                                className="appearance-none text-center py-2 px-4 font-medium w-20 focus:outline-none border-b-2 border-gray-200"
                                onChange={_HandleChangeInputOption.bind(this, e.id, "soluong",e)}
                                value={e?.soluong || 1}
                                thousandSeparator={false}
                                // allowNegative={false}
                                readOnly={index === 0 ? readOnlyFirst : false}
                                decimalScale={0}
                                // isNumericString={true}   
                                isAllowed={(values) => { const {floatValue} = values; return floatValue > 0 }}       
                                />
                                <button  className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center w-[25px] h-[25px]  bg-slate-200 rounded-full"
                                onClick={() => handleIncrease(e.id)} disabled={index === 0}><Add size="16"/></button>
                              </div>
                            </div>
                         <div className='col-span-4'>
                             <input
                                 value={e.ghichu}                
                                 onChange={_HandleChangeInputOption.bind(this, e.id, "ghichu",index)}
                                 name="optionEmail"     
                                 placeholder='Ghi chú'                 
                                 type="text"
                                 className= "focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                               /> 
                         </div>
                         <div className='col-span-1'>
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
            <h2 className='font-normal bg-[white] shadow-xl p-2 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]'>Tổng cộng </h2>  

        </div>
        <div className='grid grid-cols-12'>
            <div className='col-span-10'>
                        <div className="text-[#344054] font-normal text-sm mb-1 ">{"Ghi chú"}</div>
                          <textarea
                            value={note}       
                            placeholder={props.dataLang?.client_popup_note}         
                            onChange={_HandleChangeInput.bind(this, "note")}
                            name="fname"                      
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-[40%] min-h-[120px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                          />
            </div>
            <div className="text-right mt-5 space-y-4 col-span-2 flex-col justify-between ">
                <div className='flex justify-between '>
                  <div className='font-normal'><h3>Tổng số lượng</h3></div>
                  <div className='font-normal'><h3 className='text-blue-600'>{totalSoluong}</h3></div>
                </div>
                <div className='flex justify-between '>
                  <div className='font-normal'><h3>Tổng số mặt hàng</h3></div>
                  <div className='font-normal'><h3 className='text-blue-600'>{totalQty}</h3></div>
                </div>
                <div className='space-x-2'>
                <button type='button'
                    // onClick={_ToggleModal.bind(this,false)}
                   className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]">{"Quay lại"}</button>
                  <button onClick={_HandleSubmit.bind(this)}  type="submit"className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]">{"Lưu"}</button>
                </div>
            </div>
        </div>
    </div>
</React.Fragment>
  )
}
export default Index