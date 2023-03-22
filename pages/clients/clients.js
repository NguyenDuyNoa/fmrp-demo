import React, {useState, useRef, useEffect} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import Pagination from '/components/UI/pagination';
import {_ServerInstance as Axios} from '/services/axios';

const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});
import Swal from 'sweetalert2'
import ReactExport from "react-data-export";
import { Edit as IconEdit,  Grid6 as IconExcel, Trash as IconDelete, SearchNormal1 as IconSearch,Add as IconAdd, LocationTick, User  } from "iconsax-react";
import moment from 'moment';
import Select from 'react-select';

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
    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);
    const [totalItem, sTotalItems] = useState([]);
    const [onFetching, sOnFetching] = useState(false);
    const [data, sData] = useState({});
    const [data_ex, sData_ex] = useState([]);
 
    const [listDs, sListDs] = useState()
    const _HandleSelectTab = (e) => {
      router.push({
          pathname: '/clients/clients',    
          query: { tab: e }
      })
  }
    useEffect(() => {
      router.push({
          pathname: '/clients/clients',    
          query: { tab: router.query?.tab ? router.query?.tab : "all"  }
      })
    }, []);
    const _ServerFetching = () => {
        Axios("GET", `/api_web/${(router.query?.tab === "all" && "api_client/client?csrf_protection=true") ||
         (router.query?.tab === "nogroup" && "api_client/client?csrf_protection=true") }`, {
            params: {
                search: keySearch,
                limit: limit,
                page: router.query?.page || 1
            }
        }, (err, response) => {
            if(!err){
                var {rResult, output} = response.data
                sData(rResult)
                sTotalItems(output)
                sData_ex(rResult)
            }
            sOnFetching(false)
        })
    }
   
    const _ServerFetching_group =  () =>{
          Axios("GET", `/api_web/Api_client/group?csrf_protection=true`, {
        }, (err, response) => {
          if(!err){
              var {rResult, output} =  response.data
              sListDs(rResult)
          }
          sOnFetching(false)
        })
    }
    const paginate = pageNumber => {
        router.push({
          pathname: '/clients/clients',
          query: { 
            tab: router.query?.tab,
            page: pageNumber 
          }
        })
      }
    const _HandleOnChangeKeySearch = ({target: {value}}) => {
        sKeySearch(value)
        router.replace({
          pathname: '/clients/clients',
          query: { 
            tab: router.query?.tab,
          }
        });
        setTimeout(() => {
          if(!value){
            sOnFetching(true)
          }
          sOnFetching(true)
        }, 500);
      };
    
    useEffect(() => {
        onFetching && _ServerFetching() || onFetching && _ServerFetching_group()
        
    }, [onFetching]);
    useEffect(() => {
        router.query.tab && sOnFetching(true) || (keySearch && sOnFetching(true))
     }, [limit,router.query?.page, router.query?.tab]);
    const handleDelete = (event) => {
      Swal.fire({
        title: `${dataLang?.aler_ask}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#296dc1',
        cancelButtonColor: '#d33',
        confirmButtonText: `${dataLang?.aler_yes}`,
        cancelButtonText:`${dataLang?.aler_cancel}`
      }).then((result) => {
        if (result.isConfirmed) {
          const id = event; 
          Axios("DELETE",  `${(router.query.tab === "taxes" && `/api_web/api_client/client/${id}?csrf_protection=true`) || (router.query.tab === "currencies" && `/api_web/Api_currency/currency/${id}?csrf_protection=true`) || (router.query.tab === "paymentmodes" && `/api_web/Api_payment_method/payment_method/${id}?csrf_protection=true`)} `, {
          }, (err, response) => {
            if(!err){
              var isSuccess = response.data?.isSuccess;
              if(isSuccess){
                Toast.fire({
                  icon: 'success',
                  title: dataLang?.aler_success_delete
                })     
              }
            }
            _ServerFetching()
          })     
        }
      })
     
    }
    const multiDataSet = [
      {
          columns: [
              {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: "Mã khách hàng", width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: "Tên khách hàng", width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: "Người đại diện", width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: "Mã số thuế", width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: "Điện thoại", width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: "Địa chỉ", width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: "Phụ trách khách hàng", width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: "Nhóm", width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: "Ngày tạo", width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
          ],
          data: data_ex.map((e) =>
      
              [
                  {value: `${e.id}`, style: {numFmt: "0"}},
                  {value: `${e.code}`},
                  {value: `${e.name}`},
                  {value: `${e.representative}`},
                  {value: `${e.tax_code}`},
                  {value: `${e.phone_number}`},
                  {value: `${e.address}`},
                  {value: `${"null"}`},
                  {value: `${"null"}`}, 
                  {value: `${e.date_create}`},
              ]
              
          ),
      }
    ];
    return (
        <React.Fragment>
      <Head>
        <title>Danh sách khách hàng</title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">Danh sách khách hàng</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>Danh sách khách hàng</h6>
        </div>

        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
                <div className='flex justify-between'>
                    <h2 className="text-2xl text-[#52575E]">Danh Sách Khách Hàng</h2>
                    <div className="flex justify-end items-center">
                  <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                </div>
                </div>
              <div className="flex space-x-3 items-center justify-start">
                    <TabClient onClick={_HandleSelectTab.bind(this, "all")} active="all" total={totalItem.iTotalRecords}>Tất cả</TabClient>
                    <TabClient onClick={_HandleSelectTab.bind(this, "nogroup")} active="nogroup"  total={totalItem.iTotalRecords}>Không có nhóm</TabClient>
                     {listDs &&   listDs.map((e)=>{
                          return (
                            <TabClient 
                                style={{
                                  backgroundColor: e.color,
                               }}
                              key={e.id} onClick={_HandleSelectTab.bind(this, `${e.name}`)} active={e.name} >{e.name}</TabClient> 
                          )
                      })
                     }
            </div>
              <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">    
                <div className="xl:space-y-3 space-y-2">
                    <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                        <form className="flex items-center relative">
                          <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                          <input
                              className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md w-[400px]"
                              type="text" 
                              onChange={_HandleOnChangeKeySearch.bind(this)} 
                              placeholder={dataLang?.branch_search}
                          />
                        </form>
                        
                        <div className="flex space-x-2 items-center">
                     {
                      data_ex.length > 0 &&(
                        <ExcelFile filename="nhóm nvl" title="Hiii" element={
                          <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition'>
                            <IconExcel size={18} /><span>Xuất Excel</span></button>}>
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
                <div className="min:h-[200px] h-[72%] max:h-[500px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className=" w-[110%] pr-2 xl:w-[100vw]">
                    <div className="flex items-center sticky top-0 bg-white p-2 z-10">
                    <div className='w-[2%]'>
                        <input type='checkbox' className='scale-125' />
                    </div>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[12%] font-[300] text-left">Mã khách hàng</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[13%] font-[300] text-left">Tên khách hàng</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[12%] font-[300] text-left">Người đại diện</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center">Mã số thuế</h4> 
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[9%] font-[300] text-center">Điện thoại</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-left">Địa chỉ</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[18%] font-[300] text-left">Phụ trách khách hàng</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-left">Nhóm</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[18%] font-[300] text-center">Ngày tạo</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center">Thuộc tính</h4>
                    </div>
                    {onFetching ?
                      <Loading className="h-80"color="#0f4f9e" /> 
                      : 
                      data.length > 0 ? 
                      (
                        <>
                          <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">                       
                          {(data.map((e) => 
                            <div className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 " key={e.id.toString()}>
                                 <div className='w-[2%]'>
                                <input type='checkbox' className='scale-125' />
                            </div>
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[12%] text-left">{e.code}</h6>
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[12%]  rounded-md text-left">{e.name}</h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[12%]  rounded-md text-lefts">{e.representative}</h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[10%]  rounded-md text-center">{e.tax_code}</h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[9%]  rounded-md text-center">{e.phone_number}</h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[14%]  rounded-md text-left">{e.address}</h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[18%]  rounded-md text-left flex space-x-2 object-cover flex-wrap"><User size={20} color="gray"></User><User size={20} color="gray"></User><User size={20} color="gray"></User><User size={20} color="gray"></User><User size={20} color="gray"></User></h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[10%]  rounded-md text-left">{e.name}</h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[18%]  rounded-md text-center">{moment(e.date_create).format('DD/MM/YYYY, h:mm:ss')}</h6>                
                              <div className="space-x-2 w-[10%] text-center">
                                <Popup_dskh onRefresh={_ServerFetching.bind(this)} className="xl:text-base text-xs " listDs={listDs} dataLang={dataLang} name={e.name} representative={e.representative} code={e.code} tax_code={e.tax_code} phone_number={e.phone_number} 
                                address={e.address} date_incorporation={e.date_incorporation} note={e.note} email={e.email} website={e.website} debt_limit={e.debt_limit} debt_limit_day={e.debt_limit_day} debt_begin={e.debt_begin} city={e.city} district={e.district} ward={e.ward}   id={e.id}  />
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
                                {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
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
}
const TabClient = React.memo((props) => {
    const router = useRouter();
    return(
      <button style={props.style} onClick={props.onClick} className={`${router.query?.tab === `${props.active}` ? "text-[white] bg-[#0F4F9E]" : "bg-[#0F4F9E] text-white "} flex gap-2 items-center rounded-lg px-4 py-2 outline-none relative `}>
        {router.query?.tab === `${props.active}` && <LocationTick   size="20" color="white" />}
        {props.children}
        <span className={`${props?.total > 0 && "absolute top-0 right-0 bg-[#ff6f00] text-xs translate-x-2.5 -translate-y-2 text-white rounded-[100%] px-2 text-center items-center flex justify-center py-1.5"} `}>{props?.total}</span>
      </button>

    )
  })

const Popup_dskh = (props) => {
      const [open, sOpen] = useState(false);
      const _ToggleModal = (e) => sOpen(e);
      const [onSending, sOnSending] = useState(false);
      const [errInput, sErrInput] = useState(false);
      const [option, sOption] = useState([]);  
      const [optionName, sOptionName] = useState("");

      const [name, sName] = useState("")
      const [code, sCode] = useState(null)
      const [tax_code, sTaxcode] = useState(null)
      const [representative, sRepresentative] = useState(null)
      const [phone_number, sPhone] = useState(null)
      const [address, sAdress] = useState("")
      const [date_incorporation, sDate_incorporation] = useState("")
      const [email, sEmail] = useState("")
      const [note, sNote] = useState("")
      const [website, sWebsite] = useState("")
      const [debt_limit, sDebt_limit] = useState("")
      const [debt_limit_day, sDebt_limit_day] = useState("")
      const [debt_begin, sDebt_begin] = useState("")
      const [group, sGroup] = useState("")
      const [nation, sNation] = useState("")
      const [city, sCity] = useState("")
      const [district, sDistrict] = useState("")
      const [ward, sWard] = useState("")

      const [tab, sTab] = useState(0)
      const _HandleSelectTab = (e) => sTab(e)
      const [hidden, sHidden] = useState(false)
      useEffect(() => {
        sErrInput(false)
        sName(props?.name ? props?.name : "")
        sCode(props?.code ? props?.code : null)
        sTaxcode(props?.tax_code ? props?.tax_code : null)
        sRepresentative(props?.representative ? props?.representative : null)
        sDate_incorporation("")
        sPhone(props?.phone_number ? props?.phone_number : null)
        sEmail(props?.email ? props?.email : "")
        sAdress(props?.address ? props?.address : "")
        sNote(props?.note ? props?.note : "")
        sWebsite(props?.website ? props?.website : "")
        sDebt_limit(props?.debt_limit ? props?.debt_limit : "")
        sDebt_limit_day(props?.debt_limit_day ? props?.debt_limit_day : "")
        sDebt_begin(props?.debt_begin ? props?.debt_begin : "")
        sCity(props?.city ? props?.city : "")
        sDistrict(props?.district ? props?.district : "")
        sWard(props?.ward ? props?.ward : "")
        // sWebsite(props.data?.website ? props.data?.website : "")
        // sDebt(props.data?.debt ? props.data?.debt : "")
        // sDebtat(props.data?.debtat ? props.data?.debtat : "")
        // sGroup(props.data?.group ? props.data?.group : "")
        // sNation(props.data?.nation ? props.data?.nation : "")
        // sCity(props.data?.city ? props.data?.city : "")
        // sDistrict(props.data?.district ? props.data?.district : "")
        // sWard(props.data?.ward ? props.data?.ward : "")
        // sFacebook(props.data?.facebook ? props.data?.facebook : "") mã kh, tên kh, người dd, mst,dienthoai,diachi
        // sOption(props.option ? props.option : []) 
        sGroupOpt(props.listDs && [...props.listDs?.map(e => ({label: e.name, value: Number(e.id)}))])
      }, [open]);
      const _HandleChangeInput = (type, value) => {
        if(type == "name"){
            sName(value.target?.value)
        }
         else if(type == "code"){
            sCode(value.target?.value)
        }
         else if(type == "tax_code"){
            sTaxcode(value.target?.value)
        }
        else if(type == "representative"){
          sRepresentative(value.target?.value)
        }
        else if(type == "phone_number"){
          sPhone(value.target?.value)
        }
        else if(type == "address"){
          sAdress(value.target?.value)
        }
        else if(type == "date_incorporation"){
          sDate_incorporation(value.target?.value)
        }
        else if(type == "email"){
          sEmail(value.target?.value)
        }
        else if(type == "note"){
          sNote(value.target?.value)
        }
        else if(type == "website"){
          sWebsite(value.target?.value)
        }
        else if(type == "debt_limit"){
          sDebt_limit(value.target?.value)
        }
        else if(type == "debt_limit_day"){
          sDebt_limit_day(value.target?.value)
        }
        else if(type == "debt_begin"){
          sDebt_begin(value.target?.value)
        }
        else if(type == "city"){
          sCity(value.target?.value)
        }
        else if(type == "district"){
          sDistrict(value.target?.value)
        }
        else if(type == "ward"){
          sWard(value.target?.value)
        }


       
      }
      useEffect(() => {
          sErrInput(false)  
        }, [name.length > 0])  
    const _ServerSending = () => {
      const id =props.id;
      var data = new FormData();
      data.append('name', name);
      data.append('code', code);
      data.append('tax_code', tax_code);
      data.append('representative', representative);
      data.append('phone_number', phone_number);
      data.append('address', address);
      data.append('date_incorporation', date_incorporation);
      data.append('note', note);
      data.append('email', email);
      data.append('website', website);
      data.append('debt_limit', debt_limit);
      data.append('debt_limit_day', debt_limit_day);
      data.append('debt_begin', debt_begin);
      data.append('city', city);
      data.append('district', district);
      data.append('district', district);
      data.append('ward', ward);
      Axios("POST", `${props.id ? `/api_web/api_client/client/${id}?csrf_protection=true` : "/api_web/api_client/client?csrf_protection=true"}`, {
        data:{
          name: name,
          code:code,
          tax_code:tax_code,
          representative:representative,
          phone_number:phone_number,
          address:address,
          date_incorporation:date_incorporation,
          note: note,
          email:email,
          website:website,
          debt_limit:debt_limit,
          debt_limit_day:debt_limit_day,
          debt_begin:debt_begin,
          city:city,
          district:district,
          ward:ward,
          option: option,
        },
        headers: {"Content-Type": "multipart/form-data"} 
      }, (err, response) => {
        if(!err){
              var {isSuccess, message} = response.data;
              if(isSuccess){
                  Toast.fire({
                      icon: 'success',
                      title: `${props.dataLang[message]}`
                  })
                  sErrInput(false)
                  sName("")   
                  sCode(null)
                  sTaxcode(null)
                  sRepresentative(null)
                  sDate_incorporation("")
                  sPhone("")
                  sAdress("")
                  sNote("")
                  sEmail("")
                  sWebsite("")
                  sDebt_limit("")
                  sDebt_limit_day("")
                  sDebt_begin("")
                  sCity("")
                  sDistrict("")
                  sWard("")
                  sOption([])
                  props.onRefresh && props.onRefresh()
                  sOpen(false)
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
    const [groupOpt, sGroupOpt] = useState([])
    console.log(groupOpt)
    const [valueGr, sValueGr] = useState(null)
    const handleChangeGr = (e) => sValueGr(e)
    // console.log("nhóm",datagr);
    const data = [
          {
            value: 1,
            label: "cerulean"
          },
          {
            value: 2,
            label: "fuchsia rose"
          },
          {
            value: 3,
            label: "true red"
          },
          {
            value: 4,
            label: "aqua sky"
          },
          {
            value: 5,
            label: "tigerlily"
          },
          {
            value: 6,
            label: "blue turquoise"
          }
        ];
    const [selectedValue, setSelectedValue] = useState([]);
    const handleChange = (e) => {
      setSelectedValue(Array.isArray(e) ? e.map(x => x.value) : []);
      }
    const _OnChangeOption = (id, value) => {
      var index = option.findIndex(x=> x.id === id);
      option[index].name = value.target?.value;
      sOption([...option])
    }
    const _HandleAddNew =  () => {
      sOption([...option, {id: Date.now(), name: optionName}])
      sOptionName("")
    }
    const _HandleDelete = async (id) => {
     await sOption([...option.filter(x=> x.id !== id)])
    }
    useEffect(()=>{
      option.length == 0 && sHidden(false)
      option.length != 0 && sHidden(true)
    },[option.length])
    useEffect(() => {
      onSending && _ServerSending()
  }, [onSending]);
  
  
  const _HandleSubmit = (e) => {
    e.preventDefault()
    if(name.length ==0){
        sErrInput(true)
        Toast.fire({
          icon: 'error',
          title: `${props.dataLang?.required_field_null}`
      })
    }else{
      sOnSending(true)
    }
   
}
// console.log(data);
  
    return(
      <>
      <PopupEdit   
        // title={props.id ? `${props.dataLang?.client_group_dskhedit}` : `${props.dataLang?.client_group_dskhadd}`} 
        title={props.id ? `${"Sửa khách hàng"}` : `${"Thêm khách hàng"}`} 
      // title={"Thêm khách hàng"}
      //   title={btn} 
        button={props.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
        onClickOpen={_ToggleModal.bind(this, true)} 
        open={open} onClose={_ToggleModal.bind(this,false)}
        classNameBtn={props.className} 
      >
      <div className='flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
          <button onClick={_HandleSelectTab.bind(this, 0)} className={`${tab === 0 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>Thông tin chung</button>
          <button onClick={_HandleSelectTab.bind(this, 1)} className={`${tab === 1 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>Thông tin liên hệ</button>
      </div>
      {
          tab === 0 && (
              <div className="mt-4">
              <form onSubmit={_HandleSubmit.bind(this)}>
              <ScrollArea    
               className="h-[555px] overflow-hidden" 
                speed={1} 
                smoothScrolling={true}>
              <div className='w-[50vw] p-2  '>         
                  <div className="flex flex-wrap justify-between "> 
                  <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Tên khách hàng <span className="text-red-500">*</span></label>
                          <input
                            value={name}                
                            onChange={_HandleChangeInput.bind(this, "name")}
                            name="fname"                      
                            type="text"
                            className={`${errInput ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2`}
                          />
                          {errInput && <label className="mb-2  text-[14px] text-red-500">{"props.dataLang?.client_group_please_name"}</label>}
                      </div>
                      <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Mã khách hàng </label>
                          <input
                            value={code}                
                            onChange={_HandleChangeInput.bind(this, "code")}
                            name="fname"                      
                            type="text"
                            className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div>
                  </div>
                  <div className="flex flex-wrap justify-between "> 
                  <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Người đại diện </label>
                          <input
                            value={representative}                
                            onChange={_HandleChangeInput.bind(this, "representative")}
                            name="fname"                      
                            type="text"
                            className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div>          
                      <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Mã số thuế</label>
                          <input
                            value={tax_code}                
                            onChange={_HandleChangeInput.bind(this, "tax_code")}
                            name="fname"                      
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div>
                      
                      
                  </div>
                  <div className="flex flex-wrap justify-between ">
                      <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Ngày thành lập công ty</label>
                          <input
                            value={date_incorporation}                
                            onChange={_HandleChangeInput.bind(this, "date_incorporation")}
                            name="fname"                      
                            type="date"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div>
                      <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Điện thoại </label>
                          <input
                            value={phone_number}                
                            onChange={_HandleChangeInput.bind(this, "phone_number")}
                            name="fname"                      
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div>
                      
                  </div>
                  <div className="flex flex-wrap justify-between ">
                  
                      <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Email</label>
                          <input
                             value={email}                
                             onChange={_HandleChangeInput.bind(this, "email")}
                            name="fname"                      
                            type="email"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div>
                      <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Địa chỉ</label>
                          <textarea
                            value={address}                
                            onChange={_HandleChangeInput.bind(this, "address")}
                            name="fname"                      
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[40px] max-h-[200px] bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div>  
                  </div>
                  <div className='flex justify-between'>
                  <div className='w-[48%]'>
                    
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Website</label>
                          <input
                            value={website}                
                            onChange={_HandleChangeInput.bind(this, "website")}
                            name="fname"                      
                            type="text"
                            className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                  </div>
                  <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Hạn mức công nợ theo giá trị</label>
                          <input
                             value={debt_limit}                
                             onChange={_HandleChangeInput.bind(this, "debt_limit")}
                            name="fname"                      
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div>
                  </div>
                  <div className="flex flex-wrap justify-between "> 
                      <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Nhóm</label>
                          <Select
                              className=""
                              placeholder="Nhóm"
                              options={groupOpt} 
                              value={valueGr}
                              onChange={handleChangeGr} 
                              // value={props.listDs.filter(obj => selectedValue.includes(obj.value))}
                              // isMulti={true}
                              // isClearable
                            //  closeMenuOnSelect={false}
                      //  defaultMenuIsOpen
                            //  isSearchable         
                          />
                      </div>
                      <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Hạn mức công nợ theo ngày</label>
                          <input
                        value={debt_limit_day}                
                        onChange={_HandleChangeInput.bind(this, "debt_limit_day")}
                            name="fname"                      
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div>
                                  
                  </div>
                 
                  <div className="flex flex-wrap justify-between ">
                  <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Công nợ đầu kì</label>
                          <input
                             value={debt_begin}                
                             onChange={_HandleChangeInput.bind(this, "debt_begin")}
                            name="fname"                      
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div>      
                      <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Tỉnh /Thành phố</label>
                          <input
                             value={city}                
                             onChange={_HandleChangeInput.bind(this, "city")}
                            name="fname"                      
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div>
                     
                   
                  </div> 
                  <div className="flex flex-wrap justify-between ">  
                      <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Phường /Xã</label>
                          <input
                            value={ward}                
                            onChange={_HandleChangeInput.bind(this, "ward")}
                            name="fname"                      
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div>          
                  <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Quận /Huyện</label>
                          <input
                             value={district}                
                             onChange={_HandleChangeInput.bind(this, "district")}
                            name="fname"                      
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div>
                  </div>
                  <div className='w-[48%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">Ghi chú</label>
                          <textarea
                             value={note}                
                             onChange={_HandleChangeInput.bind(this, "note")}
                            name="fname"                      
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[40px] max-h-[200px] bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                      </div> 
  
                </div>
              </ScrollArea>
                
                  <div className="text-right mt-5 space-x-2">
                    <button onClick={_ToggleModal.bind(this,false)} className="button text-[#344054] font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD]"
                    >{props.dataLang?.branch_popup_exit}</button>
                    <button 
                      type="submit"
                      className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-lg bg-[#0F4F9E]"
                    >{props.dataLang?.branch_popup_save}</button>
                  </div>
              </form>
            </div>
          )
          }
          { tab === 1 && (
            
                  <div className=" mt-4">
                    <form onSubmit={_HandleSubmit.bind(this)} >   
                        <ScrollArea     
                          className="min-h-[0px] max-h-[550px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                            <div className='w-[65vw] flex justify-between space-x-1  flex-wrap p-2'>     
                            {option.map((e) => 
                            <div className='w-[48%]'>
                              <div className="">
                                        <label className="text-[#344054] font-normal text-sm mb-1 ">Họ và tên</label>
                                        <input
                                          value={name}                
                                          onChange={_HandleChangeInput.bind(this, "name")}
                                          name="fname"                      
                                          type="text"
                                          className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                                        />
                                                            
                                        <label className="text-[#344054] font-normal text-sm mb-1 ">Email</label>
                                        <input
                                          value={name}                
                                          onChange={_HandleChangeInput.bind(this, "name")}
                                          name="fname"                      
                                          type="text"
                                          className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                                        />
                                                            
                                        <label className="text-[#344054] font-normal text-sm mb-1 ">Chức vụ</label>
                                        <input
                                          value={name}                
                                          onChange={_HandleChangeInput.bind(this, "name")}
                                          name="fname"                      
                                          type="text"
                                          className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                                        />
                                                            
                                        <label className="text-[#344054] font-normal text-sm mb-1 ">Sinh nhật</label>
                                        <input
                                          value={name}                
                                          onChange={_HandleChangeInput.bind(this, "name")}
                                          name="fname"                      
                                          type="date"
                                          className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                                        />
                                                            
                                        <label className="text-[#344054] font-normal text-sm mb-1 ">Địa chỉ</label>
                                        <textarea
                                          value={name}                
                                          onChange={_HandleChangeInput.bind(this, "name")}
                                          name="fname"                      
                                          type="text"
                                          className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[90px] max-h-[200px] bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                                        />
                                  
                                  
                                        <label className="text-[#344054] font-normal text-sm mb-1 ">Số điện thoại</label>
                                        <input
                                          value={name}                
                                          onChange={_HandleChangeInput.bind(this, "name")}
                                          name="fname"                      
                                          type="number"
                                          className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                                        />
                                  <button onClick={_HandleDelete.bind(this, e.id)} type='button' title='Xóa' className='transition  w-full bg-slate-100 h-10 rounded-lg text-red-500 flex flex-col justify-center items-center'><IconDelete /></button>
                                
                                </div>         
                              </div>
                                )} 
                          <button  type='button' onClick={_HandleAddNew.bind(this)} title='Thêm' className='transition w-[48%] mt-5   min-h-[160px] h-40 rounded-lg bg-slate-100 flex flex-col justify-center items-center'><IconAdd />Thêm liên hệ</button>         
                          </div>  
                        </ScrollArea>            
                   {
                    hidden && (
                      <div className="text-right mt-5 space-x-2">
                      <button onClick={_ToggleModal.bind(this,false)} className="button text-[#344054] font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD]"
                      >{props.dataLang?.branch_popup_exit}</button>
                      <button 
                        type="submit"
                        className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-lg bg-[#0F4F9E]"
                      >{props.dataLang?.branch_popup_save}</button>
                    </div>
                    )
                   }
                  </form>
                  
                </div>
              )
          
          }
      </PopupEdit>
      </>
    )
}
export default Index;