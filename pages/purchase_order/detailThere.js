import { useRouter } from "next/dist/client/router";
import React, { useEffect,useRef, useState } from "react";
import Popup from 'reactjs-popup';
import { ArrowDown2 } from "iconsax-react";
import { _ServerInstance as Axios } from '/services/axios';
import moment from 'moment/moment';
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import { Edit as IconEdit,  Grid6 as IconExcel,  ArrowDown2 as IconDown,TickCircle, Trash as IconDelete, SearchNormal1 as IconSearch,Add as IconAdd, LocationTick, User, ArrowCircleDown, Add  } from "iconsax-react";
import dynamic from 'next/dynamic';
const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});
import ModalImage from "react-modal-image";



const Popup_chitietThere = (props) => {
    const scrollAreaRef = useRef(null);
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [data,sData] =useState()
    const [onFetching, sOnFetching] = useState(false);
  
    useEffect(() => {
      props?.id && sOnFetching(true) 
    }, [open]);
  
    const formatNumber = (number) => {
      if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        const decimalPart = number - integerPart;
        const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
        const roundedNumber = integerPart + roundedDecimalPart;
        return roundedNumber.toLocaleString("en");
    };
  
    const _ServerFetching_detailThere = async () =>{
      await Axios("GET", `${props?.type == "import" && `/api_web/Api_import/import/${props?.id}?csrf_protection=true` 
                         || props?.type == "service" && `/api_web/Api_service/service/${props?.id}?csrf_protection=true`
                         || props?.type =="deposit" && `/api_web/Api_purchase_order/purchase_order/${props?.id}?csrf_protection=true` 
                         || props?.type == "1" && `/api_web/Api_purchases/purchases/${props?.id}?csrf_protection=true`
                         || props?.type =="typePo" && `/api_web/Api_purchase_order/purchase_order/${props?.id}?csrf_protection=true`}`, {}, (err, response) => {
        if(!err){
            var db =  response.data
            sData(db)
        }
        sOnFetching(false)
      })
    }
    useEffect(() => {
      onFetching && _ServerFetching_detailThere() || onFetching && _ServerFetching()
    }, [open]);
  
    
    // const scrollableDiv = document.querySelector('.customsroll');
    //   scrollableDiv?.addEventListener('wheel', (event) => {
    //     const deltaY = event.deltaY;
    //     const top = scrollableDiv.scrollTop;
    //     const height = scrollableDiv.scrollHeight;
    //     const offset = scrollableDiv.offsetHeight;
    //     const isScrolledToTop = top === 0;
    //     const isScrolledToBottom = top === height - offset;
      
    //     if ((deltaY < 0 && isScrolledToTop) || (deltaY > 0 && isScrolledToBottom)) {
    //       event.preventDefault();
    //     }
    // });
   
    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
    const [dataProductExpiry, sDataProductExpiry] = useState({});
    const [dataProductSerial, sDataProductSerial] = useState({});
  
    const _ServerFetching =  () =>{
      Axios("GET","/api_web/api_setting/feature/?csrf_protection=true", {}, (err, response) => {
        if(!err){
            var data = response.data;
            sDataMaterialExpiry(data.find(x => x.code == "material_expiry"));
            sDataProductExpiry(data.find(x => x.code == "product_expiry"));
            sDataProductSerial(data.find(x => x.code == "product_serial"));
        }
        sOnFetching(false)
      })
    }
    let listQty = data?.items
    let totalQuantity = 0;
    for (let i = 0; i < listQty?.length; i++) {
    totalQuantity += parseInt(listQty[i].quantity);
    }

  return (
  <>
   <PopupEdit   
      title={props?.type == "import" && (props.dataLang?.import_detail_title || "import_detail_title") 
        ||  props?.type == "service" && (props.dataLang?.serviceVoucher_service_voucher_details || "serviceVoucher_service_voucher_details") 
        || props?.type =="deposit" && (props.dataLang?.purchase_order_detail_title || "purchase_order_detail_title") 
        || props?.type=="1" && (props.dataLang?.purchase_detail_title || "purchase_detail_title")
        || props?.type =="typePo" && (props.dataLang?.purchase_order_detail_title || "purchase_order_detail_title")
      } 
      button={props?.name} 
      onClickOpen={_ToggleModal.bind(this, true)} 
      open={open} onClose={_ToggleModal.bind(this,false)}
      classNameBtn={props?.className} 
    >
        <div className='flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]'> 
        </div>
        { props?.type == "import" && (
           <div className=" space-x-5 3xl:w-[1250px] 2xl:w-[1100px] w-[1050px] 3xl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">        
            <div>
             <div className='3xl:w-[1250px] 2xl:w-[1100px] w-[1050px]'>
               <div  className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
               <h2 className='font-normal bg-[#ECF0F4] p-2 text-[13px]'>{props.dataLang?.import_detail_info || "import_detail_info"}</h2>       
               {onFetching ?
                    <Loading className="h-20 2xl:h-[160px]"color="#0f4f9e" /> : data?.items  &&
                <div className='grid grid-cols-9  min-h-[130px] px-2'>
                    <div className='col-span-3'>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.import_day_vouchers || "import_day_vouchers"}</h3><h3 className=' text-[13px]  font-normal'>{data?.date != null ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss") : ""}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.import_code_vouchers || "import_code_vouchers"}</h3><h3 className=' text-[13px]  font-normal'>{data?.code}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.import_the_order || "import_the_order"}</h3><h3 className=' text-[13px]  text-center font-normal text-lime-500  rounded-xl py-1 px-3 max-w-[100px] min-w-[70px]  bg-lime-200 '>{data?.purchase_order_code}</h3></div>
                    </div>
  
                      <div className='col-span-3'>
                          <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.import_payment_status || "import_payment_status"}</h3>
                            <div className='flex flex-wrap  gap-2 items-center justify-center'>
                                {
                                data?.status_pay === "not_spent" && <span className='flex justify-center items-center font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px]  bg-sky-200 text-center text-[13px]'>{"Chưa chi"}</span>||
                                data?.status_pay === "spent_part" && <span className='flex justify-center items-center font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px]  bg-orange-200 text-center text-[13px]'>{"Chi 1 phần"} {`(${formatNumber(data?.amount_paid)})`}</span>||
                                data?.status_pay === "spent" && <span className='flex justify-center items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200 text-center text-[13px]'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{"Đã chi đủ"}</span>
                                }
                            </div>
                          </div>
                          <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.import_from_browse || "import_from_browse"}</h3>
                            <div className='flex flex-wrap  gap-2 items-center justify-center'>
                                {
                              data?.warehouseman_id === "0" && <span className='flex justify-center items-center font-normal text-[#3b82f6]  rounded-xl py-1 px-2 min-w-[135px]  bg-[#bfdbfe] text-center text-[13px]'>{"Chưa duyệt kho"}</span>||
                              data?.warehouseman_id != "0" && <span className='flex justify-center items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200 text-center text-[13px]'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{"Đã duyệt kho"}</span>
                                }
                            </div>
                          </div>
                      </div>
                    <div className='col-span-3 '>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='text-[13px]'>{props.dataLang?.import_supplier || "import_supplier"}</h3><h3 className='text-[13px] font-normal'>{data?.supplier_name}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='text-[13px]'>{props.dataLang?.import_branch || "import_branch"}</h3><h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">{data?.branch_name}</h3></div>
                    </div>
                    
                </div>
                }
                <div className="pr-2 w-[100%] lx:w-[110%] ">
                  {/* <div className={`${dataProductSerial.is_enable == "1" ? 
                      (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-12" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-12" :"grid-cols-10" ) :
                       (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-11" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-11" :"grid-cols-9") ) }  grid sticky top-0 bg-white shadow-lg  z-10`}> */}
                  <div className={`grid-cols-13  grid sticky top-0 bg-white shadow-lg  z-10`}>
                    <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center whitespace-nowrap">{props.dataLang?.import_detail_image || "import_detail_image"}</h4>
                    <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center whitespace-nowrap">{props.dataLang?.import_detail_items || "import_detail_items"}
                    </h4>
                    <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center whitespace-nowrap">{props.dataLang?.import_detail_variant || "import_detail_variant"}</h4> 
                    <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center whitespace-nowrap">{"Kho - VTK"}</h4> 
                    <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center whitespace-nowrap">{"ĐVT"}</h4>
                    <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center whitespace-nowrap">{props.dataLang?.import_from_quantity || "import_from_quantity"}</h4>
                    <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center whitespace-nowrap">{props.dataLang?.import_from_unit_price || "import_from_unit_price"}</h4>
                    <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center whitespace-nowrap">{"% CK"}</h4>
                    <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center whitespace-nowrap">{props.dataLang?.import_from_price_affter || "import_from_price_affter"}</h4>
                    <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center whitespace-nowrap">{props.dataLang?.import_from_tax || "import_from_tax"}</h4>
                    <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center whitespace-nowrap">{props.dataLang?.import_into_money || "import_into_money"}</h4>
                    <h4 className="text-[13px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center whitespace-nowrap">{props.dataLang?.import_from_note || "import_from_note"}</h4>
                  </div>
                  {onFetching ?
                    <Loading className="h-20 2xl:h-[160px]"color="#0f4f9e" /> 
                    : 
                    data?.items?.length > 0 ? 
                    (<>
                         <ScrollArea     
                           className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                      <div className="divide-y divide-slate-200 min:h-[170px]  max:h-[170px]">                       
                        {(data?.items?.map((e) => 
                          // <div className={`${dataProductSerial.is_enable == "1" ? 
                          // (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-12" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-12" :"grid-cols-10" ) :
                          // (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-11" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-11" :"grid-cols-9") ) }  grid hover:bg-slate-50 `} key={e.id?.toString()}>
                          <div className="grid grid-cols-13 hover:bg-slate-50 items-center border-b" key={e.id?.toString()}>
                            <h6 className="text-[13px]   py-0.5 col-span-1 text-center">
                            {e?.item?.images != null ? (<ModalImage   small={e?.item?.images} large={e?.item?.images} alt="Product Image"  className='custom-modal-image object-cover rounded w-[50px] h-[60px] mx-auto' />):
                              <div className='w-[50px] h-[60px] object-cover  mx-auto'>
                                <ModalImage small="/no_img.png" large="/no_img.png" className='w-full h-full rounded object-contain p-1' > </ModalImage>
                              </div>
                            }
                            </h6>                
                            <h6 className="text-[13px]  px-2 py-0.5 col-span-2 text-left">{e?.item?.name}
                              <div className='flex-col items-center font-oblique flex-wrap'>
                                {dataProductSerial.is_enable === "1" ? (
                                    <div className="flex gap-0.5">
                                      <h6 className="text-[12px]">Serial:</h6><h6 className="text-[12px]  px-2   w-[full] text-left ">{e.serial == null || e.serial == "" ? "-" : e.serial}</h6>                              
                                    </div>
                                  ):""}
                                {dataMaterialExpiry.is_enable === "1" ||  dataProductExpiry.is_enable === "1" ? (
                                  <>
                                    <div className="flex gap-0.5">
                                      <h6  className="text-[12px]">Lot:</h6>  <h6 className="text-[12px]  px-2   w-[full] text-left ">{e.lot == null || e.lot == ""  ? "-" : e.lot}</h6>                              
                                    </div>
                                    <div className="flex gap-0.5">
                                    <h6  className="text-[12px]">Hạn sử dụng:</h6> <h6 className="text-[12px]  px-2   w-[full] text-center ">{e.expiration_date ? moment(e.expiration_date).format("DD/MM/YYYY")   : "-"}</h6>                              
                                    </div>
                                  </>
                                  ):""}
                              </div>
                            </h6>                
                            <h6 className="text-[13px]   px-2 py-0.5 col-span-1 text-center break-words">{e?.item?.product_variation}</h6>                
                            <h6 className="text-[13px]   px-2 py-0.5 col-span-1 text-left break-words">{`${e?.warehouse_name}-${e.location_name}`}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1 text-center break-words">{e?.item?.unit_name}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1 text-center mr-1">{formatNumber(e?.quantity)}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1 text-center">{formatNumber(e?.price)}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1 text-center">{e?.discount_percent + "%"}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1 text-center">{formatNumber(e?.price_after_discount)}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1 text-center">{formatNumber(e?.tax_rate) + "%"}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1 text-right ">{formatNumber(e?.amount)}</h6>  
                            <h6 className="text-[13px]   py-0.5 col-span-1 text-left ml-3.5">{e?.note != undefined ? e?.note : ""}</h6>                
                                      
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
                              {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                          </div>
                        </div>
                      </div>
                    )}    
                </div>
            <h2 className='font-normal p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]'>{props.dataLang?.purchase_total || "purchase_total"}</h2>  
                <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                <div className='col-span-7'>
                    <h3 className='text-[13px] p-1'>{props.dataLang?.import_from_note || "import_from_note"}</h3>
                    <textarea 
                 className="resize-none scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[90px] max-h-[90px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                 disabled value={data?.note}/>
                </div>
               <div className='col-span-2 space-y-1 text-right'>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.import_detail_total_amount || "import_detail_total_amount"}</h3></div>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.import_detail_discount || "import_detail_discount"}</h3></div>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.import_detail_affter_discount || "import_detail_affter_discount"}</h3></div>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.import_detail_tax_money || "import_detail_tax_money"}</h3></div>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.import_detail_into_money || "import_detail_into_money"}</h3></div>
               </div>
               <div className='col-span-3 space-y-1 text-right'>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_price)}</h3></div>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_discount)}</h3></div>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_price_after_discount)}</h3></div>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_tax)}</h3></div>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_amount)}</h3></div>
               </div>
            </div>   
              </div>
            </div>
      
       </div>
          </div>
          )||
          props?.type == "service" && (
           <div className=" space-x-5 w-[999px]  h-auto ">        
           <div>
            <div className='w-[999px]'>
              <div  className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              <h2 className='font-normal bg-[#ECF0F4] p-2 text-[13px]'>{props?.dataLang?.purchase_order_detail_general_informatione || "purchase_order_detail_general_informatione"}</h2>       
              {onFetching ? 
                    <Loading className="h-20 2xl:h-[160px]"color="#0f4f9e" /> : data?.item  &&(
                    <div className='grid grid-cols-8  min-h-[100px] px-2'>
                        <div className='col-span-3'>
                            <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.serviceVoucher_day_vouchers || "serviceVoucher_day_vouchers"}</h3><h3 className=' text-[13px]  font-normal'>{data?.date != null ? moment(data?.date).format("DD/MM/YYYY") : ""}</h3></div>
                            <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"}</h3><h3 className=' text-[13px]  font-normal'>{data?.code}</h3></div>
                        </div>
                        <div className='col-span-2 mx-auto'>
                            <div className='my-4 font-medium text-[13px]'>{props.dataLang?.serviceVoucher_status_of_spending || "serviceVoucher_status_of_spending"}</div>
                            <div className='flex flex-wrap  gap-2 items-center justify-center'>
                              {
                            data?.status_pay === "not_spent" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px]  bg-sky-200 text-center text-[13px]'>{"Chưa chi"}</span>||
                            data?.status_pay === "spent_part" && <span className=' font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px]  bg-orange-200 text-center text-[13px]'>{"Chi 1 phần"} {`(${formatNumber(data?.amount_paid)})`}</span>||
                            data?.status_pay === "spent" && <span className='flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200 text-center text-[13px]'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{"Đã chi đủ"}</span>
                              }
                          </div>
                        </div>
                        <div className='col-span-3 '>
                            <div className='my-4 font-medium grid grid-cols-2'><h3 className='text-[13px]'>{props.dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}</h3><h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">{data?.branch_name}</h3></div>
                            <div className='my-4 font-medium grid grid-cols-2'><h3 className='text-[13px] '>{props.dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}</h3><h3 className='text-[13px] font-normal '>{data?.supplier_name}</h3></div>
                        </div>
                        
                    </div>)
               }
               <div className=" w-[100%] lx:w-[110%] ">
                 <div className="grid grid-cols-12 sticky top-0 bg-slate-100 p-2 z-10">
                   <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-left">{props.dataLang?.serviceVoucher_services_arising || "serviceVoucher_services_arising"}</h4>
                   <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.serviceVoucher_quantity || "serviceVoucher_quantity"}</h4>
                   <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.serviceVoucher_unit_price || "serviceVoucher_unit_price"}</h4> 
                   <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{"% CK"}</h4>
                   <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center">{props.dataLang?.import_from_price_affter || "import_from_price_affter"}</h4>
                   <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}</h4>
                   <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center">{props.dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}</h4>
                   <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center">{props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}</h4>
                 </div>
                 {onFetching ?
                   <Loading className="h-20 2xl:h-[160px]"color="#0f4f9e" /> 
                   : 
                   data?.item?.length > 0 ? 
                   (<>
                        <ScrollArea     
                          className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                     <div className="divide-y divide-slate-200 min:h-[300px] h-[100%] max:h-[400px]">                       
                       {(data?.item?.map((e) => 
                         <div className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 " key={e.id?.toString()}>
                           <h6 className="text-[13px]  px-2 py-0.5 col-span-2  rounded-md text-left">{e?.name}</h6>                
                           <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.quantity)}</h6>  
                           <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.price)}</h6>                
                           <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">{e?.discount_percent + "%"}</h6>                
                           <h6 className="text-[13px]  px-2 py-0.5 col-span-2  rounded-md text-center">{formatNumber(e?.price_after_discount)}</h6>                
                           <h6 className="text-[13px]  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.tax_rate) + "%"}</h6>                
                           <h6 className="text-[13px]  px-2 py-0.5 col-span-2  rounded-md text-right">{formatNumber(e?.amount)}</h6>                
                           <h6 className="text-[13px]  px-2 py-0.5 col-span-2  rounded-md text-left">{e?.note != undefined ? e?.note : ""}</h6>                
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
           <h2 className='font-normal p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]'>{props.dataLang?.purchase_total || "purchase_total"}</h2>  
               <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
               <div className='col-span-7'>
                   <div>
                     <div className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[13px] mb-1 ">{props.dataLang?.purchase_note || "purchase_note"}</div>
                     <textarea
                            value={data?.note}
                            disabled
                            name="fname"                      
                            type="text"
                            className=" placeholder:text-slate-300 w-[80%] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 min-h-[100px] max-h-[100px] resize-none bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 outline-none "
                          />
                   </div>
               </div>
              <div className='col-span-2 mt-2 space-y-2'>
                   <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}</h3></div>
                   <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"}</h3></div>
                   <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_money_after_discount || "purchase_order_detail_money_after_discount"}</h3></div>
                   <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"}</h3></div>
                   <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}</h3></div>
              </div>
              <div className='col-span-3 mt-2 space-y-2'>
                   <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_price)}</h3></div>
                   <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_discount)}</h3></div>
                   <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_price_after_discount)}</h3></div>
                   <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_tax_price)}</h3></div>
                   <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_amount)}</h3></div>
              </div>
           </div>   
             </div>
           </div>
     
          </div>
          </div>
          )||
          props?.type == "deposit" && (
           <div className=" space-x-5 w-[999px]  h-auto">        
            <div>
            <div className='w-[999px]'>
              <div  className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              <h2 className='font-normal bg-[#ECF0F4] p-2 text-[13px]'>{props?.dataLang?.purchase_order_detail_general_informatione || "purchase_order_detail_general_informatione"}</h2>       
                {onFetching ? 
                    <Loading className="h-20 2xl:h-[160px]"color="#0f4f9e" /> : data?.item  &&
                <div className='grid grid-cols-8  min-h-[170px] px-2'>
                    <div className='col-span-3'>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.purchase_order_detail_day_vouchers || "purchase_order_detail_day_vouchers"}</h3><h3 className=' text-[13px]  font-normal'>{data?.date != null ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss") : ""}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.purchase_order_detail_delivery_date || "purchase_order_detail_delivery_date"}</h3><h3 className=' text-[13px]  font-normal'>{data?.delivery_date != null ? moment(data?.delivery_date).format("DD/MM/YYYY") : ""}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.purchase_order_detail_voucher_code || "purchase_order_detail_voucher_code"}</h3><h3 className=' text-[13px]  font-normal'>{data?.code}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"}</h3><h3 className=' text-[13px] font-normal'>{data?.order_type  == "0" ? (<span className='font-normal text-red-500  rounded-xl py-1 px-3  bg-red-200'>Tạo mới</span>) : (<span className='font-normal text-lime-500  rounded-xl py-1 px-3  bg-lime-200'>YCMH</span>)}</h3></div>
                    </div>
  
                    <div className='col-span-2 mx-auto'>
                        <div className='my-4 font-medium text-[13px]'>{"Trạng thái nhập hàng"}</div>
                        <div className='flex flex-wrap  gap-2 items-center justify-start'>
                          {data?.import_status  === "not_stocked" && <span className='flex justify-center font-normal 2xl:text-xs xl:text-xs text-[8px] text-sky-500  rounded-xl py-1 px-2  min-w-[100px] bg-sky-200'>{props.dataLang[data?.import_status]}</span>||
                          data?.import_status  === "stocked_part" &&  <span className='flex justify-center font-normal 2xl:text-xs xl:text-xs text-[8px] text-orange-500 rounded-xl py-1 px-2  min-w-[100px] bg-orange-200'>{props.dataLang[data?.import_status]}</span> ||
                          data?.import_status  === "stocked" &&   <span className='flex justify-center 2xl:text-xs xl:text-xs text-[8px] items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  min-w-[100px] bg-lime-200'><TickCircle className='bg-lime-500 rounded-full ' color='white' size={15}/>{props.dataLang[data?.import_status]}</span>
                          }
                        </div>
                        <div className='my-4 font-medium text-[13px]'>{props.dataLang?.purchase_order_table_number || "purchase_order_table_number"}</div>
                        <div className='flex flex-wrap  gap-2 items-center justify-start text-[13px]'>
                            {data?.purchases?.reduce((acc, cur) => acc + (acc ? ', ' : '') + cur.code, '').split('').join('').replace(/^,/, '')}
                        </div>
                    </div>
                    <div className='col-span-3 '>
                        {/* <div className='flex flex-wrap  gap-2 items-center justify-start'>
                        {data?.status_pay === "0" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2  bg-sky-200'>{props.dataLang?.purchase_order_table_havent_spent_yet || "purchase_order_table_havent_spent_yet"}</span>||
                          data?.status_pay === "1" &&  <span className=' font-normal text-orange-500 rounded-xl py-1 px-2  bg-orange-200'>{props.dataLang?.purchase_order_table_spend_one_part || "purchase_order_table_spend_one_part"}</span> ||
                          data?.status_pay === "2" &&   <span className='flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{props.dataLang?.purchase_order_table_enough_spent || "purchase_order_table_enough_spent"}</span>
                        }
                        </div> */}
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='text-[13px]'>{props.dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}</h3><h3 className='text-[13px] font-normal'>{data?.supplier_name}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='text-[13px]'>{props.dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}</h3><h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">{data?.branch_name}</h3></div>
                    </div>
                    
                </div>
                }

                <div className="pr-2 w-[100%] lx:w-[110%] ">
                  <div className="grid grid-cols-12 sticky top-0 bg-slate-100 p-2 z-10">
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-left">{props.dataLang?.purchase_image || "purchase_image"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_items || "purchase_items"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_variant || "purchase_variant"}</h4> 
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_unit || "purchase_unit"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_quantity || "purchase_quantity"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_detail_unit_price || "purchase_order_detail_unit_price"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_detail_discount || "purchase_order_detail_discount"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center">{props.dataLang?.purchase_order_detail_after_discount || "purchase_order_detail_after_discount"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_note || "purchase_order_note"}</h4>
                  </div>
                  {onFetching ?
                    <Loading className="h-20 2xl:h-[160px]"color="#0f4f9e" /> 
                    : 
                    data?.item?.length > 0 ? 
                    (<>
                        <ScrollArea     
                          className="min-h-[90px] max-h-[100px] 2xl:max-h-[160px] 3xl:max-h-[250px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                      <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">                       
                        {(data?.item?.map((e) => 
                          <div className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 " key={e.id?.toString()}>
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-left">
                            {e?.item?.images != null ? (<ModalImage   small={e?.item?.images} large={e?.item?.images} alt="Product Image"  className='custom-modal-image object-cover rounded w-[50px] h-[60px]' />):
                                    <div className='w-[50px] h-[60px] object-cover  flex items-center justify-center rounded'>
                                      <ModalImage small="/no_img.png" large="/no_img.png" className='w-full h-full rounded object-contain p-1' > </ModalImage>
                                    </div>
                            }
                            </h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-left">{e?.item?.name}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center break-words">{e?.item?.product_variation}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center break-words">{e?.item?.unit_name}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center mr-1">{formatNumber(e?.quantity)}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.price)}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center">{e?.discount_percent + "%"}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-2  rounded-md text-center">{formatNumber(e?.price_after_discount)}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center ">{formatNumber(e?.tax_rate) + "%"}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-right mr-3.5">{formatNumber(e?.amount)}</h6>                
                                          
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-left ml-3.5">{e?.note != undefined ? e?.note : ""}</h6>                
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
                              {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                          </div>
                        </div>
                      </div>
                    )}    
                </div>
            <h2 className='font-normal p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]'>{props.dataLang?.purchase_total || "purchase_total"}</h2>  
                <div className="mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                <div className='col-span-7'>
                      <h3 className='text-[13px] p-1'>{props.dataLang?.purchase_order_note || "purchase_order_note"}</h3>
                      <textarea 
                    className="resize-none scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[90px] max-h-[90px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                    disabled value={data?.note}/>
                  </div>
              <div className='col-span-2 space-y-2'>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}</h3></div>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"}</h3></div>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_money_after_discount || "purchase_order_detail_money_after_discount"}</h3></div>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"}</h3></div>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}</h3></div>
              </div>
              <div className='col-span-3 space-y-2'>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_price)}</h3></div>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_discount)}</h3></div>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_price_after_discount)}</h3></div>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_tax)}</h3></div>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_amount)}</h3></div>
              </div>
            </div>   
              </div>
            </div>
  
            </div>
           </div>
          )||
          props?.type == "1" && (
            <div className="mt-4 space-x-5 w-[999px] h-auto ">        
            <div>
             <div className='w-[999px]'>
               <div className="min:h-[170px] h-[72%] max:h-[100px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
               <h2 className='font-normal bg-[#ECF0F4] p-2'>{props?.dataLang?.purchase_general || "purchase_general"}</h2>       
                <div className='grid grid-cols-8  min-h-[170px] p-2'>
                    <div className='col-span-3'>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_day || "purchase_day"}</h3><h3 className='col-span-1 font-normal'>{data?.date != null ? moment(data?.date).format("DD/MM/YYYY") : ""}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_code || "purchase_code"}</h3><h3 className='col-span-1 font-normal'>{data?.code}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_planNumber || "purchase_planNumber"}</h3><h3 className='col-span-1 font-normal'>{data?.reference_no}</h3></div>
                    </div>

                    <div className='col-span-2 mx-auto'>
                        <div className='my-4 font-medium '>{props.dataLang?.purchase_orderStatus || "purchase_orderStatus"}</div>
                        <div className='flex flex-wrap  gap-2 items-center justify-start'>
                            {
                          data?.order_status?.status === "purchase_ordered" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px]  bg-sky-200'>{props.dataLang[data?.order_status?.status]}</span>||
                          data?.order_status?.status === "purchase_portion" && <span className=' font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px]  bg-orange-200'>{props.dataLang[data?.order_status?.status]} {`(${data?.order_status?.count})`}</span>||
                          data?.order_status?.status === "purchase_enough" && <span className='flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{props.dataLang[data?.order_status?.status]} {`(${data?.order_status?.count})`}</span>
                            }
                        </div>
                        {/* <div className=' font-normal text-sky-500  rounded-xl py-1 px-2 max-w-[180px] my-2 text-center  bg-sky-200'>{props.dataLang?.purchase_ordered || "purchase_ordered"}</div>
                        <div className=' font-normal text-orange-500 rounded-xl py-1 px-2 max-w-[180px] my-2 text-center  bg-orange-200'>{props.dataLang?.purchase_portion || "purchase_portion"} (0)</div>
                        <div className='flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 max-w-[180px] my-2 text-center  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{props.dataLang?.purchase_enough || "purchase_enough"} (0)</div> */}
                    </div>
                    <div className='col-span-3 '>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_status || "purchase_status"}</h3><h3 className='col-span-1'>{data?.status == "1" ? (<div className='border border-lime-500 px-2 py-1 rounded text-lime-500 font-normal flex justify-center  items-center gap-1'>{props.dataLang?.purchase_approved || "purchase_approved"} <TickCircle className='bg-lime-500 rounded-full' color='white'  size={19} /></div>) : (<div className='border border-red-500 px-2 py-1 rounded text-red-500  font-normal flex justify-center items-center gap-1' >{props.dataLang?.purchase_notapproved || "purchase_notapproved"} <TickCircle size={22}/></div>)}</h3></div>  
                        {/* <div className='my-4 font-medium grid grid-cols-2'>Tổng số lượng</div> */}
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_propnent || "purchase_propnent"}</h3><h3 className='col-span-1 font-normal'>{data?.user_create_name}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1'>{props.dataLang?.purchase_branch || "purchase_branch"}</h3><h3 className="3xl:items-center 3xl-text-[16px] w-fit 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">{data?.branch_name}</h3></div>
                    </div>
                    
                </div>
                <div className="pr-2 w-[100%] lx:w-[110%] ">
                  <div className="grid grid-cols-8 sticky top-0 bg-slate-100 p-2 z-10">
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-left">{props.dataLang?.purchase_image || "purchase_image"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_items || "purchase_items"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_variant || "purchase_variant"}</h4> 
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_unit || "purchase_unit"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_quantity || "purchase_quantity"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_quantity_purchased || "purchase_quantity_purchased"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_reaining_amout || "purchase_reaining_amout"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_note || "purchase_note"}</h4>
                  </div>
                  {onFetching ?
                    <Loading className="h-20 2xl:h-[160px]"color="#0f4f9e" /> 
                    : 
                    data?.items?.length > 0 ? 
                    (<>
                         <ScrollArea     
                           className="min-h-[90px] max-h-[200px] 2xl:max-h-[166px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                      <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">                       
                        {(data?.items?.map((e) => 
                          <div className="grid items-center grid-cols-8 py-1.5 px-2 hover:bg-slate-100/40 " key={e.id.toString()}>
                            <h6 className="xl:text-base text-xs   py-0.5 col-span-1  rounded-md text-left">
                            {e?.item?.images != null ? (<ModalImage  small={e?.item?.images} large={e?.item?.images} alt="Product Image"  className='object-cover rounded w-[50px] h-[60px]' />):
                                    <div className='w-[50px] h-[60px] object-cover  flex items-center justify-center rounded'>
                                      {/* <IconImage/> */}
                                      <ModalImage small="/no_img.png" large="/no_img.png" className='w-full h-full rounded object-contain p-1' > </ModalImage>
                                    </div>
                                  }
                            </h6>   

                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-left">{e?.item?.name}</h6>                
                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center break-words">{e?.item?.product_variation}</h6>                
                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center break-words">{e?.item?.unit_name}</h6>                
                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.quantity)}</h6>                
                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.quantity_create)}</h6>                
                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-center">{Number(e?.quantity_left) < 0 ? "Đặt dư" +" "+ formatNumber(Number(Math.abs(e?.quantity_left)))  : formatNumber(e?.quantity_left)}</h6>                
                            <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1  rounded-md text-left">{e?.note}</h6>                
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
                          <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
                          <div className="flex items-center justify-around mt-6 ">
                              {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                          </div>
                        </div>
                      </div>
                    )}    
                </div>
            <h2 className='font-normal p-2  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]'>{props.dataLang?.purchase_total || "purchase_total"}</h2>  
              <div className=" mt-5  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10">
                  <div className='col-span-9'>
                    <h3 className='text-[13px] p-1'>{props.dataLang?.purchase_note || "import_from_note"}</h3>
                  <textarea 
                  className="resize-none scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[70px]  max-h-[70px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                  disabled value={data?.note}/>
                </div>
               <div className='col-span-3 space-y-2'>
                <div className='flex justify-between '>
                    <div className='font-normal'><h3>{props.dataLang?.purchase_totalCount || "purchase_totalCount"}</h3></div>
                    <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(totalQuantity)}</h3></div>
                  </div>
                  <div className='flex justify-between '>
                    <div className='font-normal'><h3>{props.dataLang?.purchase_totalItem || "purchase_totalItem"}</h3></div>
                    <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(data?.items?.length)}</h3></div>
                  </div>  
               </div>
            </div>   
              </div>
            </div>
      
       </div>
    
            </div> 
          )||
          props?.type == "typePo" && (
            <div className=" space-x-5 w-[999px]  h-auto">        
            <div>
             <div className='w-[999px]'>
               <div  className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
               <h2 className='font-normal bg-[#ECF0F4] p-2 text-[13px]'>{props?.dataLang?.purchase_order_detail_general_informatione || "purchase_order_detail_general_informatione"}</h2>       
                <div className='grid grid-cols-8  min-h-[170px] px-2'>
                    <div className='col-span-3'>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.purchase_order_detail_day_vouchers || "purchase_order_detail_day_vouchers"}</h3><h3 className=' text-[13px]  font-normal'>{data?.date != null ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss") : ""}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.purchase_order_detail_delivery_date || "purchase_order_detail_delivery_date"}</h3><h3 className=' text-[13px]  font-normal'>{data?.delivery_date != null ? moment(data?.delivery_date).format("DD/MM/YYYY") : ""}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.purchase_order_detail_voucher_code || "purchase_order_detail_voucher_code"}</h3><h3 className=' text-[13px]  font-normal'>{data?.code}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className=' text-[13px] '>{props.dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"}</h3><h3 className=' text-[13px] font-normal'>{data?.order_type  == "0" ? (<span className='font-normal text-red-500  rounded-xl py-1 px-3  bg-red-200'>Tạo mới</span>) : (<span className='font-normal text-lime-500  rounded-xl py-1 px-3  bg-lime-200'>YCMH</span>)}</h3></div>
                    </div>
  
                    <div className='col-span-2 mx-auto'>
                        <div className='my-4 font-medium text-[13px]'>{"Trạng thái nhập hàng"}</div>
                        <div className='flex flex-wrap  gap-2 items-center justify-start'>
                          {data?.import_status  === "not_stocked" && <span className='flex justify-center items-center font-normal 2xl:text-xs xl:text-xs text-[8px] text-sky-500  rounded-xl py-1 px-2  min-w-[100px] bg-sky-200'>{props.dataLang[data?.import_status]}</span>||
                          data?.import_status  === "stocked_part" &&  <span className='flex justify-center items-center font-normal 2xl:text-xs xl:text-xs text-[8px] text-orange-500 rounded-xl py-1 px-2  min-w-[100px] bg-orange-200'>{props.dataLang[data?.import_status]}</span> ||
                          data?.import_status  === "stocked" &&   <span className='flex justify-center 2xl:text-xs xl:text-xs text-[8px] items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  min-w-[100px] bg-lime-200'><TickCircle className='bg-lime-500 rounded-full ' color='white' size={15}/>{props.dataLang[data?.import_status]}</span>
                          }
                        </div>
                        <div className='my-4 font-medium text-[13px]'>{props.dataLang?.purchase_order_table_number || "purchase_order_table_number"}</div>
                        <div className='flex flex-wrap  gap-2 items-center justify-start text-[13px]'>
                            {data?.purchases?.reduce((acc, cur) => acc + (acc ? ', ' : '') + cur.code, '').split('').join('').replace(/^,/, '')}
                        </div>
                    </div>
                    <div className='col-span-3 '>
                        {/* <div className='flex flex-wrap  gap-2 items-center justify-start'>
                        {data?.status_pay === "0" && <span className=' font-normal text-sky-500  rounded-xl py-1 px-2  bg-sky-200'>{props.dataLang?.purchase_order_table_havent_spent_yet || "purchase_order_table_havent_spent_yet"}</span>||
                          data?.status_pay === "1" &&  <span className=' font-normal text-orange-500 rounded-xl py-1 px-2  bg-orange-200'>{props.dataLang?.purchase_order_table_spend_one_part || "purchase_order_table_spend_one_part"}</span> ||
                          data?.status_pay === "2" &&   <span className='flex items-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2  bg-lime-200'><TickCircle className='bg-lime-500 rounded-full' color='white' size={15}/>{props.dataLang?.purchase_order_table_enough_spent || "purchase_order_table_enough_spent"}</span>
                         }
                        </div> */}
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='text-[13px]'>{props.dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}</h3><h3 className='text-[13px] font-normal'>{data?.supplier_name}</h3></div>
                        <div className='my-4 font-medium grid grid-cols-2'><h3 className='text-[13px]'>{props.dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}</h3><h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">{data?.branch_name}</h3></div>
                    </div>
                    
                </div>
                <div className="pr-2 w-[100%] lx:w-[110%] ">
                  <div className="grid grid-cols-12 sticky top-0 bg-slate-100 p-2 z-10">
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-left">{props.dataLang?.purchase_image || "purchase_image"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_items || "purchase_items"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_variant || "purchase_variant"}</h4> 
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_unit || "purchase_unit"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_quantity || "purchase_quantity"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_detail_unit_price || "purchase_order_detail_unit_price"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_detail_discount || "purchase_order_detail_discount"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center">{props.dataLang?.purchase_order_detail_after_discount || "purchase_order_detail_after_discount"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}</h4>
                    <h4 className="text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">{props.dataLang?.purchase_order_note || "purchase_order_note"}</h4>
                  </div>
                  {onFetching ?
                    <Loading className="h-20 2xl:h-[160px]"color="#0f4f9e" /> 
                    : 
                    data?.item?.length > 0 ? 
                    (<>
                         <ScrollArea     
                           className="min-h-[90px] max-h-[100px] 2xl:max-h-[160px] 3xl:max-h-[250px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                      <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">                       
                        {(data?.item?.map((e) => 
                          <div className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 " key={e.id?.toString()}>
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-left">
                            {e?.item?.images != null ? (<ModalImage   small={e?.item?.images} large={e?.item?.images} alt="Product Image"  className='custom-modal-image object-cover rounded w-[50px] h-[60px]' />):
                                    <div className='w-[50px] h-[60px] object-cover  flex items-center justify-center rounded'>
                                      <ModalImage small="/no_img.png" large="/no_img.png" className='w-full h-full rounded object-contain p-1' > </ModalImage>
                                    </div>
                            }
                            </h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-left">{e?.item?.name}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center break-words">{e?.item?.product_variation}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center break-words">{e?.item?.unit_name}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center mr-1">{formatNumber(e?.quantity)}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center">{formatNumber(e?.price)}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center">{e?.discount_percent + "%"}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-2  rounded-md text-center">{formatNumber(e?.price_after_discount)}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center ">{formatNumber(e?.tax_rate) + "%"}</h6>                
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-right mr-3.5">{formatNumber(e?.amount)}</h6>                
                                           
                            <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-left ml-3.5 ">{e?.note != undefined ? e?.note : ""}</h6>                
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
                              {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                          </div>
                        </div>
                      </div>
                    )}    
                </div>
            <h2 className='font-normal p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]'>{props.dataLang?.purchase_total || "purchase_total"}</h2>  
                <div className="mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                <div className='col-span-7'>
                      <h3 className='text-[13px] p-1'>{props.dataLang?.purchase_order_note || "purchase_order_note"}</h3>
                      <textarea 
                      className="resize-none scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[90px] max-h-[90px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                      disabled value={data?.note}/>
                  </div>
               <div className='col-span-2 space-y-2'>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}</h3></div>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"}</h3></div>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_money_after_discount || "purchase_order_detail_money_after_discount"}</h3></div>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"}</h3></div>
                    <div className='font-normal text-left text-[13px]'><h3>{props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}</h3></div>
               </div>
               <div className='col-span-3 space-y-2'>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_price)}</h3></div>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_discount)}</h3></div>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_price_after_discount)}</h3></div>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_tax)}</h3></div>
                    <div className='font-normal mr-2.5'><h3 className='text-right text-blue-600 text-[13px]'>{formatNumber(data?.total_amount)}</h3></div>
               </div>
            </div>   
              </div>
            </div>
      
       </div>
    
            </div>    
          )
          
          
        }
    </PopupEdit>
  </>
  )
  }
  export default Popup_chitietThere