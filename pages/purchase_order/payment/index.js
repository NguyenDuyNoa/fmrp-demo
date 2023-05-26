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
import {NumericFormat} from "react-number-format";
import { v4 as uuidv4 } from 'uuid';



import { Edit as IconEdit,  Grid6 as IconExcel, Trash as IconDelete, SearchNormal1 as IconSearch,Add as IconAdd, LocationTick, User, ArrowCircleDown, Add  } from "iconsax-react";
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import Pagination from '/components/UI/pagination';
import dynamic from 'next/dynamic';
import moment from 'moment/moment';
import Select,{components } from 'react-select';
import Popup from 'reactjs-popup';
import { data } from 'autoprefixer';
import { useDispatch } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { NULL } from 'sass';

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
    const dispatch = useDispatch()

    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);
    const [totalItem, sTotalItems] = useState([]);

    const [onFetching, sOnFetching] = useState(false);
    const [data, sData] = useState({});
    const [data_ex, sData_ex] = useState([]);
    const [listDs, sListDs] = useState()

    const [listSelectCt, sListSelectCt] = useState()

    const _HandleSelectTab = (e) => {
      router.push({
          pathname: router.route,    
          query: { tab: e }
      })
    }
    useEffect(() => {
      router.push({
          pathname: router.route,    
          query: { tab: router.query?.tab ? router.query?.tab : 0  }
      })
    }, []);
     const _ServerFetching = () =>{}
 
    return (
        <React.Fragment>
      <Head>
        <title>{"Phiếu chi"}</title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">{"Phiếu chi"}</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{"Phiếu chi"}</h6>
        </div>

        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
                <div className='flex justify-between'>
                    <h2 className="text-2xl text-[#52575E] capitalize">{"Phiếu chi"}</h2>
                    <div className="flex justify-end items-center">
                    <Popup_dsncc   onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                  </div>
                </div>
                
                
              {/* <div  className="flex space-x-3 items-center  h-[8vh] justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                     {listDs &&   listDs.map((e)=>{
                          return (
                            <div>
                            <TabClient 
                              style={{
                                backgroundColor: "#e2f0fe"
                              }} dataLang={dataLang}
                              key={e.id} 
                              onClick={_HandleSelectTab.bind(this, `${e.id}`)} 
                              total={e.count} 
                              active={e.id} 
                              className={"text-[#0F4F9E] "}
                            >{dataLang[e?.name]}</TabClient> 
                          </div>
                          )
                      })
                     }
                </div> */}
           
              {/* <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">    
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
                        <div className='ml-1 w-[23vw]'>
                            <Select 
                                //  options={listBr_filter}
                                 options={[{ value: '', label: 'Chọn chi nhánh', isDisabled: true }, ...listBr_filter]}
                                 onChange={onchang_filterBr.bind(this, "branch")}
                                 value={idBranch}
                                 placeholder={dataLang?.client_list_filterbrand} 
                                hideSelectedOptions={false}
                                isMulti
                                isClearable={true}
                               
                                className="rounded-md bg-white  xl:text-base text-[14.5px] z-20" 
                                isSearchable={true}
                                noOptionsMessage={() => "Không có dữ liệu"}
                                components={{ MultiValue }}
                                closeMenuOnSelect={false}
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
                                    border: 'none',
                                    outline: 'none',
                                    boxShadow: 'none',
                                   ...(state.isFocused && {
                                    boxShadow: '0 0 0 1.5px #0F4F9E',
                                  }),
                                 })
                              }}
                              />
                        </div>
                        </div>
                        
                        <div className="flex space-x-2 items-center">
                     {
                      data_ex?.length > 0 &&(
                        <ExcelFile filename="Danh sách nhà cung cấp" title="Dsncc" element={
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
                <div className="min:h-[200px] h-[65%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2 w-[100%] lx:w-[110%] ">
                    <div className="flex items-center sticky top-0 bg-white p-2 z-10">
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[13%] font-[300] text-left">{dataLang?.suppliers_supplier_code}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-left">{dataLang?.suppliers_supplier_name}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-left">{dataLang?.suppliers_supplier_taxcode}</h4> 
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center">{dataLang?.suppliers_supplier_phone}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-left">{dataLang?.suppliers_supplier_adress}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-left">{dataLang?.suppliers_supplier_group}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-left">{dataLang?.client_list_brand}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center">{dataLang?.branch_popup_properties}</h4>
                    </div>
                    {onFetching ?
                      <Loading className="h-80"color="#0f4f9e" /> 
                      : 
                      data?.length > 0 ? 
                      (<>
                          <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">                       
                          {(data?.map((e) => 
                            <div className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 " key={e.id.toString()}>
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[13%]  rounded-md text-left">{e.code}</h6>
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left text-[#0F4F9E] hover:font-normal"><Popup_chitiet dataLang={dataLang} className="text-left" name={e.name} id={e?.id}/></h6>           
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[10%]  rounded-md text-left">{e.tax_code}</h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[10%]  rounded-md text-center">{e.phone_number}</h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left">{e.address}</h6>                
               
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left flex justify-start flex-wrap ">
                               
                                  {e.supplier_group?.map(h=>{
                                    return ( 
                                      <span key={h.id} style={{ backgroundColor: "#e2f0fe"}} className={`text-[#0F4F9E]  mr-2 mb-1 w-fit xl:text-base text-xs px-2 rounded-md font-[300] py-0.5`}>{h.name}</span>
                                      )})}
                              
                              </h6> 
                               <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%] rounded-md text-left flex justify-start flex-wrap ">{e.branch?.map(i => (<span key={i.id} className="mr-2 mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-[5.5px]">{i.name}</span>))}</h6>                  
                              <div className="space-x-2 w-[10%] text-center">
                                <Popup_dsncc listBr={listBr} listSelectCt={listSelectCt}   onRefresh={_ServerFetching.bind(this)} className="xl:text-base text-xs " listDs={listDs} dataLang={dataLang} name={e.name} representative={e.representative} code={e.code} tax_code={e.tax_code} phone_number={e.phone_number} 
                                address={e.address} date_incorporation={e.date_incorporation} note={e.note} email={e.email} website={e.website} debt_limit={e.debt_limit}  city={e.city} district={e.district} ward={e.ward}   id={e?.id}  />
                                <button onClick={()=>handleDelete(e.id)} className="xl:text-base text-xs "><IconDelete color="red"/></button>
                              </div>
                            </div>
                          ))}              
                        </div>                     
                        </>
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
              </div>      */}
            </div>
            {/* {data?.length != 0 &&
              <div className='flex space-x-5 items-center'>
                <h6>{dataLang?.display} {totalItem?.iTotalDisplayRecords} {dataLang?.among} {totalItem?.iTotalRecords} {dataLang?.ingredient}</h6>
                <Pagination 
                  postsPerPage={limit}
                  totalPosts={Number(totalItem?.iTotalDisplayRecords)}
                  paginate={paginate}
                  currentPage={router.query?.page || 1}
                />
              </div>                   
            }  */}
          </div>
        </div>
      </div>
    </React.Fragment>
    );
}
const TabClient = React.memo((props) => {
    const router = useRouter();
    return(
      <button  style={props.style} onClick={props.onClick} className={`${props.className} justify-center min-w-[220px] flex gap-2 items-center rounded-[5.5px] px-4 py-2 outline-none relative `}>
        {router.query?.tab === `${props.active}` && <ArrowCircleDown   size="20" color="#0F4F9E" />}
        {props.children}
        <span className={`${props?.total > 0 && "absolute min-w-[29px] top-0 right-0 bg-[#ff6f00] text-xs translate-x-2.5 -translate-y-2 text-white rounded-[100%] px-2 text-center items-center flex justify-center py-1.5"} `}>{props?.total > 0 && props?.total}</span>
      </button>


    )
  })

const Popup_dsncc = (props) => {
      const dataLang = props.dataLang
      const scrollAreaRef = useRef(null);
      const handleMenuOpen = () => {
      const menuPortalTarget = scrollAreaRef.current;
          return { menuPortalTarget };
      };
      
      const [open, sOpen] = useState(false);
      const _ToggleModal = (e) => sOpen(e);

      const [onSending, sOnSending] = useState(false);
      const [onFetching, sOnFetching] = useState(false);
      const [onFetching_LisObject, sOnFetching_LisObject] = useState(false);
      const [onFetching_TypeOfDocument, sOnFetching_TypeOfDocument] = useState(false);
      const [onFetching_ListTypeOfDocument, sOnFetching_ListTypeOfDocument] = useState(false);
      const [onFetching_ListCost, sOnFetching_ListCost] = useState(false)

      const [dataBranch, sDataBranch] = useState([])
      const [dataObject, sDataObject] = useState([])
      const [dataList_Object, sData_ListObject] = useState([])
      const [dataMethod, sDataMethod] = useState([])
      const [dataTypeofDoc, sDataTypeofDoc] = useState([])
      const [dataListTypeofDoc, sDataListTypeofDoc] = useState([])
      const [dataListCost, sDataListCost] = useState([])
    
      
      const [date , sDate] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
      const [code ,sCode] = useState(null)
      const [branch, sBranch] = useState(null)
      const [object, sObject] = useState(null)
      const [listObject, sListObject] = useState(null)
      const [typeOfDocument, sTypeOfDocument] = useState(null)
      const [listTypeOfDocument, sListTypeOfDocument] = useState([])
      const [price, sPrice] = useState('')
      const [method, sMethod] = useState(null)
      const [note, sNote] = useState("")

      const [option, sOption] = useState([
        {
         id: Date.now(),
         chiphi: "",
         sotien: '',
        }
        ]);
      const slicedArr = option.slice(1);
      const sortedArr = slicedArr.sort((a, b) => b.id - a.id);
      sortedArr.unshift(option[0]);
      
      const [errBranch, sErrBranch] = useState(false)
      const [errObject, sErrObject] = useState(false)
      const [errListObject, sErrListObject] = useState(false)
      const [errPrice, sErrPrice] = useState(false)
      const [errMethod, sErrMethod] = useState(false)

      const [errService, sErrService] = useState(false)
      const [errCosts, sErrCosts] = useState(false)
      const [errSotien, sErrSotien] =useState(false)

      useEffect(() =>{
        open && sDate(moment().format('YYYY-MM-DD HH:mm:ss'));
        open && sCode(null)
        open && sBranch(null)
        open && sObject(null)
        open && sListObject(null)
        open && sTypeOfDocument(null)
        open && sListTypeOfDocument([])
        open && sPrice('')
        open && sMethod(null)
        open && sNote('')
        open && sNote('')
        open && sErrBranch(false)
        open && sErrObject(false)
        open && sErrListObject(false)
        open && sErrPrice(false)
        open && sErrMethod(false)
        open && sErrService(false)
        open && sErrCosts(false)
        open && sErrSotien(false)
        open &&  sOption([{ id: Date.now(),chiphi: "",sotien: '',}]);
        open && sOnFetching(true)
      },[open])



    // Chi nhánh, PTTT, Đối tượng
  const _ServerFetching =  () => {
    Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true",{}, (err, response) => {
        if(!err){
            var {isSuccess, result} =  response.data
            sDataBranch(result?.map(e =>({label: e.name, value:e.id})))       
        }
    })
    Axios("GET", "/api_web/Api_expense_voucher/object/?csrf_protection=true",{}, (err, response) => {
        if(!err){
            var data =  response.data
            sDataObject(data?.map(e => ({label: dataLang[e?.name], value: e?.id})))
        }
    })
    Axios("GET", "/api_web/Api_payment_method/payment_method/?csrf_protection=true",{}, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            sDataMethod(rResult?.map(e => ({label: e?.name, value: e?.id})))
        }
    })
    sOnFetching(false)  
  }

  useEffect(() =>{
    onFetching && _ServerFetching()
  },[onFetching])

  useEffect(() =>{
    open && sOnFetching(true)
  },[open])

  //Danh sách đối tượng
const _ServerFetching_LisObject =  () => {
    Axios("GET", "/api_web/Api_expense_voucher/objectList/?csrf_protection=true",{
      params:{
        type: object?.value,
        "filter[branch_id]": branch?.value
      }
    }, (err, response) => {
        if(!err){
            var {isSuccess, rResult} =  response.data
            sData_ListObject(rResult?.map(e =>({label: e.name, value:e.id})))       
        }
    })
    sOnFetching_LisObject(false)  
  }

  useEffect(() =>{
    onFetching_LisObject && _ServerFetching_LisObject()
  },[onFetching_LisObject])

  useEffect(() =>{
    object != null && sOnFetching_LisObject(true)
  },[object])

// Loại chứng từ
  const _ServerFetching_TypeOfDocument =  () => {
    Axios("GET", "/api_web/Api_expense_voucher/voucher_type/?csrf_protection=true",{
      params:{
        type: object?.value,
      }
    }, (err, response) => {
        if(!err){
            var db =  response.data
            sDataTypeofDoc(db?.map(e => ({label: dataLang[e?.name], value: e?.id})))  
        }
    })
    sOnFetching_TypeOfDocument(false)  
  }

  useEffect(() =>{
    onFetching_TypeOfDocument && _ServerFetching_TypeOfDocument()
  },[onFetching_TypeOfDocument])

  useEffect(() =>{
    object != null && sOnFetching_TypeOfDocument(true)
  },[object])



  //Danh sách chứng từ
  const _ServerFetching_ListTypeOfDocument =  () => {
    Axios("GET", "/api_web/Api_expense_voucher/voucher_list/?csrf_protection=true",{
      params:{
        type: object?.value,
        voucher_type: typeOfDocument?.value,
        object_id: listObject?.value,
        "filter[branch_id]": branch?.value
      }
    }, (err, response) => {
        if(!err){
            var db =  response.data
            sDataListTypeofDoc(db?.map(e => ({label: e?.code, value: e?.id, money: e?.money})))  
        }
    })
    sOnFetching_TypeOfDocument(false)  
  }

  useEffect(() =>{
    onFetching_ListTypeOfDocument && _ServerFetching_ListTypeOfDocument()
  },[onFetching_ListTypeOfDocument])

  useEffect(() =>{
    branch != null && object != null && listObject != null && typeOfDocument != null && sOnFetching_ListTypeOfDocument(true)
  },[branch,object, listObject, typeOfDocument])

  const _HandleSeachApi = (inputValue) => {
      Axios("POST", `/api_web/Api_expense_voucher/voucher_list/?csrf_protection=true`,{
        data: {
          term: inputValue,
        },
        params:{
          type: object?.value,
          voucher_type: typeOfDocument?.value,
          object_id: listObject?.value,
          "filter[branch_id]": branch?.value
        }
      }, (err, response) => {
            if(!err){
              var db =  response.data
              sDataListTypeofDoc(db?.map(e => ({label: e?.code, value: e?.id,money: e?.money})))  
          }
      })
  }


   //Loại chi phí
   const _ServerFetching_ListCost=  () => {
    Axios("GET", "/api_web/Api_cost/costCombobox/?csrf_protection=true", {
      params:{
        "filter[branch_id]": branch?.value
      }
    }, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            sDataListCost(rResult?.map(e => ({label: e?.name, value: e?.id})))  
        }
    })
    sOnFetching_ListCost(false)  
  }

  useEffect(() =>{
    onFetching_ListCost && _ServerFetching_ListCost()
  },[onFetching_ListCost])

  useEffect(() =>{
    branch != null  && sOnFetching_ListCost(true)
  },[branch])


      const _HandleChangeInput = (type, value) =>{
        if(type == "date"){
            sDate(moment(value?.target.value).format('YYYY-MM-DD HH:mm:ss'))
        }else if(type == "code"){
            sCode(value?.target?.value)
        }else if(type == "branch"){
            sBranch(value)
        }else if(type == "object" && object != value){
            sObject(value)
            sListObject(null)
        }else if(type == "listObject"){
            sListObject(value)
        }else if(type == "typeOfDocument"){
            sTypeOfDocument(value)
        }else if(type == "listTypeOfDocument"){
            sListTypeOfDocument(value)
            if(value?.length == 0){
              sPrice('')
            }else if(value?.length > 0){
              const totalMoney = value.reduce((total, item) => total + parseFloat(item.money), 0);
              sPrice(formatNumber(totalMoney))
            }
        }else if(type == "price"){
            sPrice(value?.value)
        }else if(type == "method"){
            sMethod(value)
        }else if(type == "note"){
            sNote(value?.target.value)
        }
      }

      const _HandleSubmit = (e) =>{
        e.preventDefault();
        const hasNullLabel = option.some(item => item.chiphi === '');
        const hasNullSotien = option.some(item => item.sotien === '');
        if(branch == null || object == null || listObject == null || price == "" || method == null || hasNullLabel || hasNullSotien ){
            branch == null && sErrBranch(true) 
            object == null && sErrObject(true) 
            listObject == null && sErrListObject(true) 
            price == '' && sErrPrice(true) 
            method == null && sErrMethod(true)
            hasNullLabel && sErrCosts(true) 
            hasNullSotien && sErrSotien(true) 
            Toast.fire({
              icon: 'error',
              title: `${props.dataLang?.required_field_null}`
          })
          }else{
            sOnSending(true)
          }
      }
      
      useEffect(() => {
        sErrBranch(false)
      }, [branch != null]);
    
      useEffect(() => {
        sErrObject(false)
      }, [object != null]);

      useEffect(() => {
        sErrListObject(false)
      }, [listObject != null]);

      useEffect(() => {
        sErrPrice(false)
      }, [price != ""]);

      useEffect(() => {
        sErrMethod(false)
      }, [method != null]);
    

      useEffect(() => {
        if (price == null) return;
        sOption(prevOption => {
          const newOption = [...prevOption];
          newOption.forEach((item, index) => {
            if(index == 0){
              item.sotien = price;
            }else{
              item.sotien = '';
            }
          });
          return newOption;
        });
      }, [price]);

      const _HandleChangeInputOption = (id, type, index3, value) => {
        var index = option.findIndex(x => x.id === id);
        if (type === "chiphi") {
          const hasSelectedOption = option.some((o) => o.chiphi === value);
          if (hasSelectedOption) {
            Toast.fire({
              title: 'Loại chi phí này đã được chọn',
              icon: 'error',
              confirmButtonColor: '#296dc1',
              cancelButtonColor: '#d33',
              confirmButtonText: dataLang?.aler_yes,
            });
            return; // Dừng xử lý tiếp theo nếu đã hiển thị thông báo lỗi
          } else {
            option[index].chiphi = value;
            // if (index === option.length - 1) {
            //   option.push({ id: uuidv4(), chiphi: '', sotien: null });
            //   sOption([...option]);
            // }
          }
        }
        else if (type === "sotien") {
          const sotienValue = Number(value?.value) || "";
          const priceValue = Number(price) || "";
          let totalSotien = sotienValue;
        
          option.forEach((opt, optIndex) => {
            if (optIndex !== index) {
              totalSotien += Number(opt.sotien) || "";
            }
          });
        
          if (totalSotien > priceValue) {
            option.forEach((opt, optIndex) => {
              option[optIndex].sotien = "";
            });
        
            Toast.fire({
              title: 'Tổng giá trị số tiền vượt quá giá trị số tiền ban đầu',
              icon: 'error',
              confirmButtonColor: '#296dc1',
              cancelButtonColor: '#d33',
              confirmButtonText: dataLang?.aler_yes,
            });
          } else {
            option[index].sotien = sotienValue;
          }
        
          sOption([...option]);
        }
        sOption([...option])
      }

      const _HandleAddNew =  () => {
        sOption([...option, {id: uuidv4(), chiphi: '', sotien: ""}])
      }

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

      const formatNumber = (num) => {
        if (!num && num !== 0) return 0;
        const roundedNum = parseFloat(num.toFixed(2));
        return roundedNum.toLocaleString("en", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          useGrouping: true
        });
      };

        const allItems = [...dataListTypeofDoc]
        const handleSelectAll = () => {
           sListTypeOfDocument(allItems)
           const totalMoney = allItems.reduce((total, item) => total + parseFloat(item.money), 0);
          sPrice(formatNumber(totalMoney))
        };
    
        const handleDeselectAll = () => {
          sListTypeOfDocument([])
          sPrice('')
        };
    
        const MenuList = (props) => {
          return (
            <components.MenuList {...props}>
              {dataListTypeofDoc?.length > 0 &&
              <div className='grid grid-cols-2 items-center  cursor-pointer'>
                <div className='hover:bg-slate-200 p-2 col-span-1 text-center text-xs ' onClick={handleSelectAll}>Chọn tất cả</div>
                <div className='hover:bg-slate-200 p-2 col-span-1 text-center text-xs ' onClick={handleDeselectAll}>Bỏ chọn tất cả</div>
              </div>
              }
              {props.children}
            </components.MenuList>
          );
        };
    


  return(
      <>
      <PopupEdit   
        title={props.id ? `${"Sửa phiếu chi"}` : `${"Tạo phiếu chi"}`} 
        button={props.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
        onClickOpen={_ToggleModal.bind(this, true)} 
        open={open} onClose={_ToggleModal.bind(this,false)}
        classNameBtn={props.className} 
      >
      <div className='flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
      </div>
      <h2 className='font-normal bg-[#ECF0F4] p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  '>{"Thông tin chung"}</h2>  
              <div className="w-[40vw]">
                  <form onSubmit={_HandleSubmit.bind(this)} className="">
                      <div className=''> 
                        <div className="grid grid-cols-12 gap-2 items-center"> 
                            <div className='col-span-6 max-h-[45px] min-h-[45px] mb-0.5 '>
                                <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">{dataLang?.serviceVoucher_day_vouchers} </label>
                                <input
                                value={date}    
                                onChange={_HandleChangeInput.bind(this, "date")}
                                name="fname"                      
                                type="datetime-local"
                                className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] 2xl:text-[12px] xl:text-[13px] text-[12px] rounded-[5.5px] text-[#52575E] font-normal p-2.5 border outline-none mb-2"
                                />
                                
                            </div>
                            <div className='col-span-6 max-h-[45px] min-h-[45px] mb-0.5 '>
                            <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">{dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"}<span className="text-red-500">*</span></label>
                                <input
                                    value={code}                
                                    onChange={_HandleChangeInput.bind(this, "code")}
                                    placeholder={"Mặc định theo hệ thống"}                     
                                    type="text"
                                    className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2.5 border outline-none mb-2"
                                    />
                            </div>
                            <div className='col-span-6 max-h-[65px] min-h-[65px] mt-1 mb-1'>
                            <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{"Chi nhánh"} <span className="text-red-500">*</span></label>
                              <Select   
                                  closeMenuOnSelect={true}
                                  placeholder={"Chi nhánh"}
                                  options={dataBranch}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "branch")}
                                  value={branch}
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
                                className={`${errBranch ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border `} 
                              />
                                {errBranch && <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{"Vui lòng chọn chi nhánh"}</label>}
                            </div>
                            <div className='col-span-6 max-h-[65px] min-h-[65px] mt-1 mb-1'>
                            <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{"Phương thức thanh toán"} <span className="text-red-500">*</span></label>
                              <Select   
                                  closeMenuOnSelect={true}
                                  placeholder={"Phương thức thanh toán"}
                                  options={dataMethod}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "method")}
                                  value={method}
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
                                className={`${errMethod ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border `} 
                              />
                                {errMethod && <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{"Vui lòng chọn phương thức thanh toán"}</label>}
                            </div>
                            <div className='col-span-6 max-h-[65px] min-h-[65px] mt-1 mb-1'>
                            <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{"Đối tượng"} <span className="text-red-500">*</span></label>
                              <Select   
                                  closeMenuOnSelect={true}
                                  placeholder={"Đối tượng"}
                                  options={dataObject}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "object")}
                                  value={object}
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
                                className={`${errObject ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  font-normal outline-none border `} 
                              />
                                {errObject && <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{"Vui lòng nhập đối tượng"}</label>}
                            </div>
                            <div className='col-span-6 max-h-[65px] min-h-[65px] mt-1 mb-1'>
                            <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{"Danh sách đối tượng"} <span className="text-red-500">*</span></label>
                            {object?.value == "other" ?
                              <CreatableSelect  
                                options={dataList_Object}
                                placeholder={"Danh sách đối tượng"}
                                onChange={_HandleChangeInput.bind(this, "listObject")}
                                isClearable={true}
                                classNamePrefix="Select"
                                className={`${errListObject ? "border-red-500" : "border-transparent" } Select__custom removeDivide  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `} 
                                // className={`Select__custom removeDivide border-transparent placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`} 
                                isSearchable={true}
                                noOptionsMessage={() => `Chưa có gợi ý`}
                                formatCreateLabel={(value) => `Tạo "${value}"`}
                                menuPortalTarget={document.body}
                                onMenuOpen={handleMenuOpen}
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
                                        zIndex: 9999,
                                        position: "absolute",
                                    }),
                                    control: (base,state) => ({
                                        ...base,
                                        boxShadow: 'none',
                                        ...(state.isFocused && {
                                            border: '0 0 0 1px #92BFF7',
                                        }),
                                    }),
                                    dropdownIndicator: base => ({
                                        ...base,
                                        display: 'none'
                                    })                                                                                
                                }}
                               />
                              :
                              <Select   
                              closeMenuOnSelect={true}
                              placeholder={"Danh sách đối tượng"}
                              options={dataList_Object}
                              isSearchable={true}
                              onChange={_HandleChangeInput.bind(this, "listObject")}
                              value={listObject}
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
                              className={`${errObject ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `} 
                              />
                            }
                              {errListObject && <label className="mb-2  2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{"Vui lòng chọn danh sách đối tượng"}</label>}
                            </div>
                            <div className='col-span-6 max-h-[45px] min-h-[45px] '>
                            <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{"Loại chứng từ"}</label>
                              <Select   
                                  closeMenuOnSelect={true}
                                  placeholder={"Loại chứng từ"}
                                  options={dataTypeofDoc}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "typeOfDocument")}
                                  value={typeOfDocument}
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
                                className={`border-transparent 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `} 
                              />
                            </div>
                            <div className='col-span-6 max-h-[45px] min-h-[45px] '>
                            <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{"Danh sách chứng từ"}</label>
                              <Select   
                                  closeMenuOnSelect={true}
                                  placeholder={"Danh sách chứng từ"}
                                   onInputChange={_HandleSeachApi.bind(this)}
                                  options={dataListTypeofDoc}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "listTypeOfDocument")}
                                  value={listTypeOfDocument}
                                  components={{MenuList,MultiValue}}
                                  isMulti
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
                                className={`border-transparent 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E]  font-normal outline-none border `} 
                              />
                            </div>
                            <div className='col-span-6 max-h-[75px] min-h-[75px] mt-1'>
                               <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] ">{"Số tiền"} <span className="text-red-500">*</span></label>
                                <NumericFormat
                                    value={price}
                                    onValueChange={_HandleChangeInput.bind(this, "price")}
                                    allowNegative={false}
                                    placeholder='Số tiền'
                                    decimalScale={0}
                                    isNumericString={true}   
                                    className={`${errPrice ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px]  font-normal outline-none border p-[9.5px]`} 
                                    thousandSeparator=","
                                />
                                {errPrice && <label className="2xl:text-[12px] xl:text-[13px] text-[12px] text-red-500">{"Vui lòng nhập số tiền"}</label>}
                            </div>
                            <div className='col-span-6 max-h-[75px] min-h-[75px] mt-1'>
                              <label className="text-[#344054] font-normal 2xl:text-[12px] xl:text-[13px] text-[12px] mb-1 ">{"Ghi chú"}</label>
                                <input
                                    value={note}                
                                    onChange={_HandleChangeInput.bind(this, "note")}
                                    placeholder={"Mặc định theo hệ thống"}                     
                                    type="text"
                                    className="focus:border-[#92BFF7] border-[#d0d5dd] 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2.5 border outline-none mb-2"
                                    />
                            </div>
                            <h2 className='font-normal bg-[#ECF0F4] p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  w-full col-span-12'>{"Thông tin chi phí"}</h2>  
                            <div className='col-span-12 max-h-[140px] min-h-[140px] overflow-hidden '>
                                <div className='grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10 min-h-50px max-h-[50px]'>
                                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-6    text-center  truncate font-[400] flex items-center gap-1'>
                                    <button  type='button' onClick={_HandleAddNew.bind(this)} title='Thêm' className='transition hover:bg-red-100 hover:animate-pulse	 rounded-full bg-slate-200 flex flex-col justify-center items-center'><Add color='red' size={20} className=''/></button>         
                                    {"Loại chi phí"}
                                  </h4>
                                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-4    text-center  truncate font-[400]'>{"Số tiền"}</h4>
                                  <h4 className='2xl:text-[12px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-2   text-center  truncate font-[400]'>{"Thao tác"}</h4>
                              </div> 
                              <ScrollArea   ref={scrollAreaRef} className="min-h-[100px] max-h-[100px]  overflow-hidden"   speed={1}    smoothScrolling={true}>
                                {sortedArr.map((e,index) => 
                                                <div className='grid grid-cols-12 items-center gap-1 py-1 ' key={e?.id}>
                                                <div className='col-span-6  my-auto '>
                                                      <Select   
                                                          closeMenuOnSelect={true}
                                                          placeholder={"Chi phí"}
                                                          options={dataListCost}
                                                          isSearchable={true}
                                                          onChange={_HandleChangeInputOption.bind(this, e?.id, "chiphi",index)}
                                                          value={e?.chiphi}
                                                          menuPlacement='top'
                                                          LoadingIndicator
                                                          noOptionsMessage={() => "Không có dữ liệu"}
                                                          maxMenuHeight="145px"
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
                                                        className={`${errCosts && e?.chiphi === '' ? "border-red-500" : "border-transparent" } 2xl:text-[12px] xl:text-[13px] text-[12px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] mb-2 font-normal outline-none border `} 
                                                      />
                                                </div>
                                            <div className='col-span-4 text-center flex items-center justify-center'>
                                              <NumericFormat
                                                    value={e?.sotien}
                                                    disabled={price == ''}
                                                    placeholder={price == '' && "Vui lòng nhập số tiền ở trên"}
                                                    onValueChange={_HandleChangeInputOption.bind(this, e?.id, "sotien",index)}
                                                    allowNegative={false}
                                                    decimalScale={0}
                                                    isNumericString={true}   
                                                    className={`${errSotien && e?.sotien === '' ? "border-b-red-500" : " border-gray-200"} border-b-2 appearance-none 2xl:text-[12px] xl:text-[13px] text-[12px] text-center py-1 px-1 font-normal w-[90%] focus:outline-none `}
                                                    thousandSeparator=","
                                                />
                                            </div>
                                            <div className='col-span-2 flex items-center justify-center'>
                                              <button
                                                onClick={_HandleDelete.bind(this, e?.id)}
                                                type='button' title='Xóa' className='transition  w-full bg-slate-100 h-10 rounded-[5.5px] text-red-500 flex flex-col justify-center items-center mb-2'><IconDelete /></button>
                                            </div>
                                              </div>
                                 )} 
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                   
                  <div className="text-right mt-1 space-x-2">
                    <button type='button' onClick={_ToggleModal.bind(this,false)} className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                    >{props.dataLang?.branch_popup_exit}</button>
                    <button 
                      type="submit"
                      className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                    >{props.dataLang?.branch_popup_save}</button>
                  </div>
                  </form>

            </div>    
      </PopupEdit>
      </>
    )
}
// const Popup_chitiet =(props)=>{
//       const scrollAreaRef = useRef(null);
//       const [open, sOpen] = useState(false);
//       const _ToggleModal = (e) => sOpen(e);
//       const [tab, sTab] = useState(0)
//       const _HandleSelectTab = (e) => sTab(e)
//       const [data,sData] =useState()
//       const [onFetching, sOnFetching] = useState(false);
//       useEffect(() => {
//         props?.id && sOnFetching(true) 
//       }, [open]);
//       const _ServerFetching_detailUser = () =>{
//         Axios("GET", `/api_web/api_supplier/supplier/${props?.id}?csrf_protection=true`, {}, (err, response) => {
//         if(!err){
//             var db =  response.data
//             sData(db)
//         }
//         sOnFetching(false)
//       })
//       }
//       useEffect(() => {
//         onFetching && _ServerFetching_detailUser()
//       }, [open]);

//   return (
//     <>
//      <PopupEdit   
//         title={props.dataLang?.suppliers_supplier_detail} 
//         button={props?.name} 
//         onClickOpen={_ToggleModal.bind(this, true)} 
//         open={open} onClose={_ToggleModal.bind(this,false)}
//         classNameBtn={props?.className} 
//       >
//       <div className='flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
//       </div>  
//               <div className="mt-4 space-x-5 w-[930px] h-auto  ">        
//                     <ScrollArea ref={scrollAreaRef}
//                     className="h-[auto] overflow-hidden " 
//                     speed={1} 
//                     smoothScrolling={true}>
//                       {onFetching ?
//                       <Loading className="h-80"color="#0f4f9e" /> 
//                       : data !="" &&(
//                       <div className="flex gap-5 rounded-md ">
//                         <div className='w-[50%] bg-slate-100/40 rounded-md'>
//                           <div className='mb-4 h-[50px] flex justify-between items-center p-2'><span className='text-slate-400 text-sm w-[25%]'>{props.dataLang?.suppliers_supplier_code}:</span> <span className='font-normal capitalize'>{data?.code}</span></div>
//                           <div className='mb-4 flex justify-between flex-wrap p-2'><span className='text-slate-400 text-sm      w-[30%]'>{props.dataLang?.suppliers_supplier_name}:</span> <span className='font-normal capitalize'>{data?.name}</span></div>
//                           <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.suppliers_supplier_reper}:</span> <span className='font-normal capitalize'>{data?.representative}</span></div>
//                           <div className='mb-4 flex justify-between  items-center p-2'><span className='text-slate-400 text-sm  w-[25%]'>{props.dataLang?.suppliers_supplier_email}:</span> <span className='font-normal capitalize'>{data?.email}</span></div>
//                           <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.suppliers_supplier_phone}:</span> <span className='font-normal capitalize'>{data?.phone_number}</span></div>
//                           <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.suppliers_supplier_taxcode}:</span> <span className='font-normal capitalize'>{data?.tax_code}</span></div>
//                           <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.suppliers_supplier_adress}:</span> <span className='font-normal capitalize'>{data?.address}</span></div> 
//                           <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.suppliers_supplier_note}: </span> <span className='font-medium capitalize'>{data?.note}</span></div>
                         
//                         </div>
//                         <div className='w-[50%] bg-slate-100/40'>
//                           <div className='mb-4 flex justify-between  p-2 items-center flex-wrap'><span className='text-slate-400 text-sm'>{props.dataLang?.client_list_brand}:</span> <span className='flex flex-wrap justify-between gap-1'>{data?.branch?.map(e=>{ return (<span key={e.id}  className='last:ml-0 font-normal capitalize mb-1  w-fit xl:text-base text-xs px-2 text-[#0F4F9E] border border-[#0F4F9E] rounded-[5.5px]'> {e.name}</span>)})}</span></div>
//                           <div className='mb-4 justify-between  p-2 flex flex-wrap  '><span className='text-slate-400 text-sm '>{"Nhóm nhà cung cấp"}:</span> <span className=' flex flex-wrap  justify-start gap-1'>{data?.supplier_group?.map(h=>{ return (  <span key={h.id} style={{ backgroundColor: "#e2f0fe"}} className={`text-[#0F4F9E] mb-1   w-fit xl:text-base text-xs px-2 rounded-md font-[300] py-0.5`}>{h.name}</span>)})}</span></div>
                          
//                           <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm'>{props.dataLang?.suppliers_supplier_debt}:</span> <span className='font-normal capitalize'>{data?.debt_limit}</span></div>
//                           {/* <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_date}:</span> <span className='font-normal capitalize'>{moment(data?.date_create).format("DD/MM/YYYY")}</span></div> */}
//                           <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm'>{props.dataLang?.suppliers_supplier_city}:</span> <span className='font-normal capitalize'>{data?.city != "" ?(data?.city.type+" "+data?.city.name) :""}</span></div>                        
//                           <div className='mb-4 flex justify-between p-2 items-center'><span className='text-slate-400 text-sm'>{props.dataLang?.suppliers_supplier_district}: </span><span className='font-normal capitalize'>{data?.district != "" ?(data?.district.type+" "+data?.district.name):""}</span>,<span  className='text-slate-400 text-sm'>{props.dataLang?.suppliers_supplier_wards}:</span><span className='font-normal capitalize'>{data?.ward != "" ? (data?.ward.type+" "+data?.ward.name) :""}</span></div>
                         
//                         </div>
//                       </div>)
//                       }
//                     </ScrollArea>
//         </div>    
//       </PopupEdit>
//     </>
//   )
// }
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
  const maxToShow = 1;
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