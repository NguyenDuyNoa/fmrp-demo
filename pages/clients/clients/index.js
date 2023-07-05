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


import { Edit as IconEdit,  Grid6 as IconExcel, Trash as IconDelete, SearchNormal1 as IconSearch,Add as IconAdd, LocationTick, User, Refresh2  } from "iconsax-react";
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import Pagination from '/components/UI/pagination';
import dynamic from 'next/dynamic';
import moment from 'moment/moment';
import Select,{components } from 'react-select';
import Popup from 'reactjs-popup';
import { data } from 'autoprefixer';
import TabFilter from 'components/UI/TabFilter';

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
    const _ServerFetching =  () => {
      const id = Number(tabPage)
        Axios("GET", `/api_web/${(tabPage === "0" || tabPage === "-1") ? "api_client/client?csrf_protection=true" : "api_client/client/?csrf_protection=true"}`, {
            params: {
                search: keySearch,
                limit: limit,
                page: router.query?.page || 1,
                "filter[client_group_id]": tabPage !== "0" ? (tabPage !== "-1" ? id : -1) : null ,
                "filter[branch_id]": idBranch?.length > 0 ? idBranch.map(e => e.value) : null
            }
        }, (err, response) => {
            if(!err){
                var {rResult, output} =  response.data
                sData(rResult)
                sTotalItems(output)
                sData_ex(rResult)
            }
            sOnFetching(false)
        })
    }
    const [listBr, sListBr]= useState()
    const _ServerFetching_brand =  () =>{
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


    const listBr_filter = listBr?.map(e =>({label: e.name, value: e.id}))
    const [idBranch, sIdBranch] = useState(null);
    const onchang_filterBr = (type, value) => {
      if(type == "branch"){
        sIdBranch(value)
      }
    }
    const hiddenOptions = idBranch?.length > 3 ? idBranch?.slice(0, 3) : [];
    const options = listBr_filter ?  listBr_filter?.filter((x) => !hiddenOptions.includes(x.value)) : [];


    const _ServerFetching_group =  () =>{
      Axios("GET", `/api_web/api_client/group_count/?csrf_protection=true`, {
        params:{
          limit: 0,
          search: keySearch,
          "filter[branch_id]": idBranch?.length > 0 ? idBranch.map(e => e.value) : null
        }
    }, (err, response) => {
      if(!err){
          var {rResult, output} =  response.data
          sListDs(rResult)
      }
      sOnFetching(false)
    })
    }

    
    const _ServerFetching_selectct =  () =>{
      Axios("GET", `/api_web/Api_address/province?limit=0`, {
        limit: 0
    }, (err, response) => {
      if(!err){
          var {rResult, output} =  response.data
          sListSelectCt(rResult)
      }
      sOnFetching(false)
    })
    }

    const paginate = pageNumber => {
        router.push({
          pathname: router.route,
          query: { 
            tab: router.query?.tab,
            page: pageNumber 
          }
        })
      }

    const _HandleOnChangeKeySearch = ({target: {value}}) => {
        sKeySearch(value)
        router.replace({
          pathname: router.route,
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
        onFetching && _ServerFetching() || onFetching && _ServerFetching_group()    || onFetching && _ServerFetching_selectct() || onFetching && _ServerFetching_brand() 
      }, [onFetching]);
    useEffect(() => {
        router.query.tab && sOnFetching(true) || (keySearch && sOnFetching(true)) || (idBranch?.length > 0 && sOnFetching(true))
     }, [limit,router.query?.page, router.query?.tab,idBranch]);
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
          Axios("DELETE",`/api_web/api_client/client/${id}?csrf_protection=true`, {
          }, (err, response) => {
            if(!err){
              var isSuccess = response.data
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

    const _HandleFresh = () =>{
      sOnFetching(true)
    }

    //excel
    const multiDataSet = [
      {
          columns: [
              {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.client_list_namecode}`, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.client_list_name}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.client_list_repre}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.client_list_taxtcode}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              
              {title: `${dataLang?.client_list_phone}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.client_list_adress}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.client_list_charge}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.client_list_group}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.client_list_brand}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: `${dataLang?.client_list_datecre}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
          ],
          data: data_ex?.map((e) =>
              [
                  {value: `${e.id}`, style: {numFmt: "0"}},
                  {value: `${e.code ? e.code : ""}`},
                  {value: `${e.name ? e.name : ""}`},
                  {value: `${e.representative ? e.representative : ""}`},
                  {value: `${e.tax_code ? e.tax_code : ""}`},
                  {value: `${e.phone_number ? e.phone_number : ""}`},
                  {value: `${e.address ? e.address : ""}`},
                  {value: `${e.staff_charge ? e.staff_charge?.map(i => i.full_name) : ""}`},
                  {value: `${e.client_group ? e.client_group?.map(i => i.name) : ""}`},
                  {value: `${e.branch ? e.branch?.map(i => i.name) : ""}`},
                  {value: `${e.date_create ? e.date_create : ""}`},
              ]    
          ),
      }
    ];
 
    return (
        <React.Fragment>
      <Head>
        <title>{dataLang?.client_list_title}</title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">{dataLang?.client_list_title}</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{dataLang?.client_list_title}</h6>
        </div>

        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
                <div className='flex justify-between'>
                    <h2 className="text-2xl text-[#52575E] capitalize">{dataLang?.client_list_title}</h2>
                    <div className="flex justify-end items-center gap-2">
                    <Popup_dskh  listBr={listBr}  listSelectCt={listSelectCt}  onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                  </div>
                </div>
              <div  className="flex space-x-3 items-center  h-[8vh] justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                     {listDs && listDs.map((e)=>{
                          return (
                           <div>
                              <TabFilter
                                style={{
                                  backgroundColor: e.color
                                }}
                                key={e.id} 
                                onClick={_HandleSelectTab.bind(this, `${e.id}`)} 
                                total={e.count} 
                                active={e.id} 
                                className={`${e.color ? "text-white" : "text-[#0F4F9E] bg-[#e2f0fe] "}`}
                              >{e.name}</TabFilter> 
                            </div>
                          )
                      })
                     }
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
                            <div className='ml-1 w-[23vw]'>
                                <Select 
                                    // options={options}
                                    options={[{ value: '', label: 'Chọn chi nhánh', isDisabled: true }, ...options]}
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
                      <button onClick={_HandleFresh.bind(this)} type='button' className='bg-red-50 hover:bg-red-100 p-2 rounded-md transition-all ease-in-out'>
                          <Refresh2
                          size="22"
                          color="red"
                          />
                      </button>
                      {
                        data_ex?.length > 0 &&(
                          <ExcelFile filename="Danh sách khách hàng" title="Dskh" element={
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
                <div className="min:h-[500px] 2xl:h-[80%] xl:h-[69%] h-[72%] max:h-[800px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2">
                    <div className="flex items-center sticky top-0 bg-white p-2 z-10">
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[12%] font-[300] text-left">{dataLang?.client_list_namecode}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-left">{dataLang?.client_list_name}</h4>
                      {/* <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-left">{dataLang?.client_list_repre}</h4> */}
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-left">{dataLang?.client_list_taxtcode}</h4> 
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center">{dataLang?.client_list_phone}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-left">{dataLang?.client_list_adress}</h4>
                      {/* <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-left">{dataLang?.client_group_statusclient}</h4> */}
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[18%] font-[300] text-left">{dataLang?.client_list_charge}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-left">{dataLang?.client_list_group}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-left">{dataLang?.client_list_brand}</h4>
                      {/* <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[18%] font-[300] text-center">{dataLang?.client_list_datecre}</h4> */}
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
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[12%]  rounded-md text-left">{e.code}</h6>
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left text-[#0F4F9E] hover:font-normal"><Popup_chitiet dataLang={dataLang} className="text-left" name={e.name} id={e?.id}/></h6>           
                              {/* <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{e.representative}</h6>                 */}
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[10%]  rounded-md text-left">{e.tax_code}</h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[10%]  rounded-md text-center">{e.phone_number}</h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left">{e.address}</h6>                
                              {/* <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{"Vip"}</h6>                 */}
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[18%]   rounded-md text-left flex object-cover cursor-pointer justify-start items-center flex-wrap gap-2">{e.staff_charge?.map(d => { return (
                               <>
                                <Popup className='dropdown-avt ' key={d.id}
                                      trigger={open => (<img src={d.profile_image}  width={40} height={40} className="object-cover rounded-[100%] text-left"></img>)}
                                      position="top center" on={['hover']} arrow={false}>
                                    <span className='bg-[#0f4f9e] text-white rounded p-1.5 '>{d.full_name} </span>
                                </Popup>      
                               </> 
                               )})}
                              </h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left flex justify-start flex-wrap ">
                               
                                    {e.client_group?.map(h=>{
                                    return ( 
                                      <span key={h.id} style={{ backgroundColor: `${h.color == "" || h.color == null ? "#e2f0fe" : h.color}`, color: `${h.color == "" || h.color == null ? "#0F4F9E" : "white"}`}} className={`  mr-2 mb-1 w-fit 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] px-2 rounded-md font-[300] py-0.5`}>{h.name}</span>
                                      )})}
                              
                              </h6> 
                              <h6 className='w-[10%] flex  gap-1 flex-wrap'>
                                  {e.branch?.map(i => (<span key={i} className="cursor-default w-fit 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase ml-2">{i.name}</span>))}
                              </h6>
                               {/* <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[10%] rounded-md text-left flex justify-start flex-wrap ">{e.branch?.map(i => (<span key={i} className="mr-2 mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-[5.5px]">{i.name}</span>))}</h6>                   */}
                              {/* <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[18%]  rounded-md text-center">{moment(e.date_create).format('DD/MM/YYYY, h:mm:ss')}</h6>                 */}
                              <div className="space-x-2 w-[10%] text-center">
                                <Popup_dskh listBr={listBr} listSelectCt={listSelectCt}   onRefresh={_ServerFetching.bind(this)} className="xl:text-base text-xs " listDs={listDs} dataLang={dataLang} name={e.name} representative={e.representative} code={e.code} tax_code={e.tax_code} phone_number={e.phone_number} 
                                address={e.address} date_incorporation={e.date_incorporation} note={e.note} email={e.email} website={e.website} debt_limit={e.debt_limit} debt_limit_day={e.debt_limit_day} debt_begin={e.debt_begin} city={e.city} district={e.district} ward={e.ward}   id={e?.id}  />
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
// const TabClient = React.memo((props) => {
//     const router = useRouter();
//     return(
//       <button  style={props.style} onClick={props.onClick} className={`${props.className} justify-center min-w-[220px] flex gap-2 items-center rounded-[5.5px] px-4 py-2 outline-none relative `}>
//         {router.query?.tab === `${props.active}` && <LocationTick   size="20" color="white" />}
//         {props.children}
//         <span className={`${props?.total > 0 && "absolute min-w-[29px] top-0 right-0 bg-[#ff6f00] text-xs translate-x-2.5 -translate-y-2 text-white rounded-[100%] px-2 text-center items-center flex justify-center py-1.5"} `}>{props?.total > 0 && props?.total}</span>
//       </button>

//     )
//   })
const Popup_dskh = (props) => {
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
      const [onFetchingDis, sOnFetchingDis] = useState(false)
      const [onFetchingWar, sOnFetchingWar] = useState(false)
      const [onFetchingChar, sOnFetchingChar] = useState(false)
      const [onFetchingBr, sOnFetchingBr] = useState(false);
      const [onFetchingGr, sOnFetchingGr] = useState(false);

      const [errInput, sErrInput] = useState(false);
      const [errInputBr, sErrInputBr] = useState(false);

      const [option, sOption] = useState([]);  
      const [optionfull_name, sOptionFull_name] = useState("");
      const [optionEmail, sOptionEmail] = useState("");
      const [optionposition, sPosition] = useState("");
      const [optionbirthday, sOptionBirthday] = useState("");
      const [optionaddress, sOptionAddress] = useState("");
      const [optionphone_number, sOptionPhone_number] = useState("");
      const [name, sName] = useState("")
      const [code, sCode] = useState(null)
      const [tax_code, sTaxcode] = useState(null)
      const [representative, sRepresentative] = useState(null)
      const [phone_number, sPhone] = useState(null)
      const [address, sAdress] = useState("")
      const [date_incorporation, sDate_incorporation] = useState("")
      const [email, sEmail] = useState("")
      const [note, sNote] = useState("")
      const [debt_limit, sDebt_limit] = useState("")
      const [debt_limit_day, sDebt_limit_day] = useState("")
    
      const [tab, sTab] = useState(0)

      const [valueBr, sValueBr] = useState([])
      const branch = valueBr.map(e => e.value)

      const _HandleSelectTab = (e) => sTab(e)
      const [hidden, sHidden] = useState(false)
   
      useEffect(() => {
        sErrInputBr(false)
        sErrInput(false)
         sName("")
         sCode()
         sTaxcode()
         sRepresentative()
         sPhone()
         sAdress("")
         sDate_incorporation("")
         sEmail("")
         sNote("")
         sDebt_limit("")
         sDebt_limit_day("")
         props?.id && sOnFetching(true)
         sCityOpt(props.listSelectCt && [...props.listSelectCt?.map(e => ({label: e.name, value: Number(e.provinceid)}))])
         sListBrand(props.listBr ? props.listBr && [...props.listBr?.map(e => ({label: e.name, value: Number(e.id)}))] : [])
         sOption(props.option ? props.option : [])
         sValueBr([])
         sValueCt()
         sValueDis()
         sValueWa()
         sValueGr([])
         sValueChar([])
         sListChar([])
      }, [open]);

      const _ServerFetching_detailUser = async () =>{
        await  Axios("GET", `/api_web/api_client/client/${props?.id}?csrf_protection=true`, {}, (err, response) => {
          if(!err){
              var db =  response.data;
             
              sValueBr(db?.branch?.map(e=> ({label: e.name, value: Number(e.id)})))
              sValueChar(db?.staff_charge.map(e=> ({label: e.full_name, value: Number(e.staffid)})))
              sValueGr(db?.client_group.map(e=> ({label: e.name, value: Number(e.id)})))
              sName(db?.name)
              sCode(db?.code)
              sTaxcode(db?.tax_code)
              sRepresentative(db?.representative)
              sPhone(db?.phone_number)
              sAdress(db?.address)
              sEmail(db?.email)
              sDebt_limit(db?.debt_limit)
              sDebt_limit_day(db?.debt_limit_day)
              sDate_incorporation(db?.date_incorporation)
              sValueDis({label:db?.district.name, value:db?.district.districtid})
              sValueCt(db?.city.provinceid)
              sNote(db?.note)
              sValueWa({label: db?.ward.name, value: db?.ward.wardid})
              sOption(db?.contact ? db?.contact : [])
          }
          sOnFetching(false)
        })
        }
        useEffect(() => {
          onFetching && props?.id && _ServerFetching_detailUser()
        }, [open]);
       
      //onchang input
      const _HandleChangeInput = (type, value) => {
        if(type == "name"){
          sName(value.target?.value)
        }else if(type == "code"){
          sCode(value.target?.value)
        }else if(type == "tax_code"){
            sTaxcode(value.target?.value)
        }else if(type == "representative"){
          sRepresentative(value.target?.value)
        }else if(type == "phone_number"){
          sPhone(value.target?.value)
        }else if(type == "address"){
          sAdress(value.target?.value)
        }else if(type == "date_incorporation"){
          sDate_incorporation(value.target?.value)
        }else if(type == "email"){
          sEmail(value.target?.value)
        }else if(type == "note"){
          sNote(value.target?.value)
        }else if(type == "debt_limit"){
          sDebt_limit(value.target?.value)
        }else if(type == "debt_limit_day"){
          sDebt_limit_day(value.target?.value)
        }else if(type == "valueBr"){
          sValueBr(value)
        }else if(type == "optionName"){
          sOptionName(value.target?.value)
        }else if(type == "optionHapy"){
          sOptionHapy(value.target?.value)
        }else if(type == "optionNote"){
          sOptionNote(value.target?.value)
        }else if(type == "optionPhone"){
          sOptionPhone(value.target?.value)
        }
      }

      // char..
      const [valueChar, sValueChar] = useState([])

      const [listChar, sListChar]= useState([])
      const _ServerFetching_Char =  () =>{
        Axios("GET", `/api_web/api_staff/GetstaffInBrard?csrf_protection=true`, {
          params: {
            "brach_id[]": branch,
            staffid: branch ? branch : -1,
          }
      }, (err, response) => {
        if(!err){
            var db =  response.data
            if(valueChar?.length == 0){
              sListChar(db?.map(e=> ({label: e.name, value: Number(e.staffid)})))
            }else if(props?.id){
              sListChar(db?.map(e=> ({label: e.name, value: Number(e.staffid)}))?.filter(e => valueChar.some(x => e.value !== x.value)))
            }
        }
        // sOnFetching(false)
        sOnFetchingBr(false)
      })
      }
      // console.log(listChar)
      const char =  valueChar?.map(e=> e.value)
      const handleChangeChar =  (e) => {
        sValueChar(e) 
      }

      useEffect(() => {
          onFetchingBr && _ServerFetching_Char()
      }, [onFetchingBr]);

      useEffect(() => {
          open && _ServerFetching_Char()
        }, [valueBr]);

      // branh
      const [brandpOpt, sListBrand] = useState([])
      const branch_id = valueBr?.map(e =>{
        return e?.value
      })

      // group
      const [valueGr, sValueGr] = useState([])
      const [listGr, sListGr]= useState([])
      const _ServerFetching_Gr =  () =>{
        Axios("GET", `/api_web/Api_client/group?csrf_protection=true`, {
          params: {
            "filter[branch_id]": branch?.length > 0 ? branch : -1,
          }
      }, (err, response) => {
        if(!err){
            var {rResult} =  response.data
            if(valueGr?.length == 0){
              sListGr(rResult?.map(e=> ({label: e.name, value: Number(e.id)})))
            }else if(props?.id){
              sListGr(rResult?.map(x => ({label: x.name, value: Number(x.id)}))?.filter(e => valueGr.some(x => e.value !== x.value)))
            }
        }
        sOnFetchingGr(false)
      })
      }
      const group =  valueGr?.map(e=> e.value)
      const handleChangeGr =  (e) => {
        sValueGr(e) 
      }
      
    useEffect(() => {
        onFetchingBr && _ServerFetching_Gr()
    }, [onFetchingBr]);

    useEffect(() => {
        open && _ServerFetching_Gr()
    }, [valueBr]);

    // useEffect(() => {
    //   sOnFetchingBr(true)
    // }, [valueBr]);

      const client_group_id = valueGr?.map(e =>{
        return e.value
      })



      // on chang city
      const [cityOpt, sCityOpt] = useState()
      const [valueCt ,sValueCt]= useState()

      const handleChangeCt =  (e) => {
        sValueCt(e?.value)
      };

      // fecht distric
      const [ditrict, sDistricts] = useState()
      const _ServerFetching_distric =  () =>{
          Axios("GET", '/api_web/Api_address/district?limit=0', {
            params: {
              provinceid: valueCt ? valueCt : -1
            }
        }, (err, response) => {
          if(!err){
              var {rResult, output} =  response.data   
              sDistricts(rResult?.map(e=> ({     
                label: e.name,
                value:e.districtid
              })))
           // sDistricts(rResult)
          }
          sOnSending(false)
          sOnFetchingDis(false)
        })
      }

      //on chang ditrict 
      const [valueDis, sValueDis] = useState()
      const handleChangeDtric =  (e) => {   
        sValueDis(e) 
      }       

      //fecth ward
      const [ward_id, sWard] = useState()
      const _ServerFetching_war =  () =>{
      Axios("GET","/api_web/Api_address/ward?limit=0", {
            params: {
              districtid: valueDis ? valueDis?.value : -1
            }
        }, (err, response) => {
          if(!err){
              var {rResult, output} =  response.data
              sWard(rResult)
          }
          sOnSending(false)
          sOnFetchingWar(false)
        })
      }
      
      const listWar = ward_id && [...ward_id?.map(e => ({label: e.name, value: Number(e.wardid)}))]
      //onchang ward
      const [valueWa, sValueWa] = useState()

      // const ward =  valueWa?.value
      const handleChangeWar =  (e) => {
        sValueWa(e) 
      };

    //post db
    const _ServerSending = () => {
      let id = props?.id
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
      data.append('debt_limit', debt_limit);
      data.append('debt_limit_day', debt_limit_day);
      data.append('city', valueCt);
      data.append('district', valueDis?.value);
      data.append('ward', valueWa?.value);
      data.append('client_group_id', group);
      data.append('branch_id', branch_id);
      data.append('staff_charge', char);
      Axios("POST",`${id ? `/api_web/api_client/client/${id}?csrf_protection=true` : "/api_web/api_client/client?csrf_protection=true"}`, {
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
          debt_limit:debt_limit,
          debt_limit_day:debt_limit_day,
          city:valueCt,
          district:valueDis,
          ward:valueWa,
          branch_id: branch_id,
          staff_charge:char,
          client_group_id: group,
          contact: option,
        },
        headers: {"Content-Type": "multipart/form-data"} 
      }, (err, response) => {
        if(!err){
              var {isSuccess, message, branch_name} = response.data;   
              if(isSuccess){
                  Toast.fire({
                      icon: 'success',
                      title: `${props?.dataLang[message]}`
                  })
                  props.onRefresh && props.onRefresh()
                  sOpen(false)
                  sErrInput(false)
                  sErrInputBr(false)
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
                  sWard("")
                  sOption([])
                  sValueBr([])
                  sGroupOpt([]) 
                  sValueChar([])   
              }else{
                Toast.fire({
                  icon: 'error',
                  title: `${props.dataLang[message] +" "+branch_name} `
                })
              }
          }
          sOnSending(false)
      })
    }

    //onchang option form
    const _OnChangeOption = (id, type, value) => {
      var index = option.findIndex(x => x.id === id );
        if(type == 'full_name'){
          option[index].full_name = value.target?.value;
        }else if(type == "email"){
          option[index].email = value.target?.value;
        }else if(type== "position"){
          option[index].position = value.target?.value;
        }else if(type === "birthday"){
          option[index].birthday = value.target?.value;
        }else if(type === "address"){
          option[index].address = value.target?.value;
        }else if(type === "phone_number"){
          option[index].phone_number = value.target?.value;
        }
      sOption([...option])
    }

    // add option form
    const _HandleAddNew =  () => {
      sOption([...option, {id: Date.now(), full_name: optionfull_name, email:optionEmail, position:optionposition, birthday:optionbirthday, address:optionaddress, phone_number:optionphone_number}])
      sOptionFull_name("")
      sOptionEmail("")
      sPosition("")
      sOptionBirthday("")
      sOptionAddress("")
      sOptionPhone_number("")
    }

    // delete option form
    const _HandleDelete =  (id) => {
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
          sOption([...option.filter(x=> x.id !== id)])     
        }
      })
      
      }
    useEffect(()=>{
      option.length == 0 && sHidden(false)
      option.length != 0 && sHidden(true)
    },[option.length])
    useEffect(() => {
      onSending && _ServerSending()  
    }, [onSending]);

    // save form
    const _HandleSubmit = (e) => {
      e.preventDefault()
      if(name?.length == 0 || branch_id?.length == 0){
        name?.length ==0 && sErrInput(true) 
        branch_id?.length==0 && sErrInputBr(true) 
        Toast.fire({
          icon: 'error',
          title: `${props.dataLang?.required_field_null}`
      })
      }else{
        sOnSending(true)
      }
    }

    useEffect(() => {
      sErrInput(false)
    }, [name?.length > 0 ] )
    useEffect(() => {
      sErrInputBr(false)
    }, [branch_id?.length > 0]);


    useEffect(()=>{
      open && sOnFetchingDis(true)
    },[valueCt])
    useEffect(()=>{
      open && sOnFetchingWar(true)
    },[valueDis])
    
    useEffect(()=>{
      open && sOnFetchingChar(true) 
    },[valueBr])
    useEffect(()=>{
      open && sOnFetchingGr(true)
    },[valueBr])
    // },[valueChar])
    
    useEffect(()=>{
      onFetchingGr && _ServerFetching_Gr()
    },[onFetchingGr])

    useEffect(()=>{
      onFetchingDis && _ServerFetching_distric()
    },[onFetchingDis])
    useEffect(()=>{
      onFetchingWar && _ServerFetching_war()
    },[onFetchingWar])

    // useEffect(()=>{
    //   onFetchingChar && _ServerFetching_Char()
    // },[onFetchingChar])
  return(
      <>
      <PopupEdit   
        title={props.id ? `${props.dataLang?.client_popup_edit}` : `${props.dataLang?.client_popup_add}`} 
        button={props.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
        onClickOpen={_ToggleModal.bind(this, true)} 
        open={open} onClose={_ToggleModal.bind(this,false)}
        classNameBtn={props.className} 
      >
      <div className='flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
          <button onClick={_HandleSelectTab.bind(this, 0)} className={`${tab === 0 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>{props.dataLang?.client_popup_general}</button>
          <button onClick={_HandleSelectTab.bind(this, 1)} className={`${tab === 1 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>{props.dataLang?.client_popup_contact}</button>
      </div>
              <div className="mt-4">
                  <form onSubmit={_HandleSubmit.bind(this)} className="">
                  {
                    tab === 0 &&(
                      <ScrollArea ref={scrollAreaRef} className="3xl:h-full 2xl:h-[470px] h-[400px] overflow-hidden" speed={1} smoothScrolling={true}>
                  <div className='w-[50vw]  p-2  '>         
                      <div className="flex flex-wrap justify-between "> 
                        <div className='w-[48%]'>
                                <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_list_namecode} </label>
                                <input
                                  value={code}                
                                  onChange={_HandleChangeInput.bind(this, "code")}
                                  name="fname"                      
                                  type="text"
                                  placeholder={props.dataLang?.client_popup_sytem}
                                  className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                />
                               
                              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_list_name}<span className="text-red-500">*</span></label>
                             <div>
                             <input
                                value={name}                
                                onChange={_HandleChangeInput.bind(this, "name")}
                                placeholder={props.dataLang?.client_list_name}
                                name="fname"                      
                                type="text"
                                className={`${errInput ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                              />
                              {errInput && <label className="mb-4  text-[14px] text-red-500">{props.dataLang?.client_list_nameuser}</label>}
                             </div>
                              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_list_repre}</label>
                              <input
                                value={representative}    
                                placeholder={props.dataLang?.client_list_repre}            
                                onChange={_HandleChangeInput.bind(this, "representative")}
                                name="fname"                      
                                type="text"
                                className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                              />
                               <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_mail}</label>
                              <input
                                value={email}                
                                onChange={_HandleChangeInput.bind(this, "email")}
                                placeholder={props.dataLang?.client_popup_mail}
                                name="fname"                      
                                type="email"
                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                              />
                               <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_list_phone}</label>
                              <input
                                value={phone_number}           
                                placeholder={props.dataLang?.client_list_phone}     
                                onChange={_HandleChangeInput.bind(this, "phone_number")}
                                name="fname"                      
                                type="text"
                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                              />
                               <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_list_taxtcode}</label>
                              <input
                                value={tax_code}   
                                placeholder={props.dataLang?.client_list_taxtcode}             
                                onChange={_HandleChangeInput.bind(this, "tax_code")}
                                name="fname"                      
                                type="text"
                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                              />
                              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_date}</label>
                              <input
                                value={date_incorporation}    
                                onChange={_HandleChangeInput.bind(this, "date_incorporation")}
                                name="fname"                      
                                type="date"
                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                              />
                              
                               <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_adress}</label>
                              <textarea
                                value={address}  
                                placeholder={props.dataLang?.client_popup_adress}             
                                onChange={_HandleChangeInput.bind(this, "address")}
                                name="fname"                      
                                type="text"
                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[40px] h-[40px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                              />   
                         </div>
                        <div className='w-[48%]'>
                           <div>
                           <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_list_brand} <span className="text-red-500">*</span></label>
                              <Select   
                                 closeMenuOnSelect={false}
                                  placeholder={props.dataLang?.client_list_brand}
                                  options={brandpOpt}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "valueBr")}
                                  isMulti
                                  noOptionsMessage={() => "Không có dữ liệu"}
                                  value={valueBr}
                                  maxMenuHeight="200px"
                                  isClearable={true} 
                                 menuPortalTarget={document.body}
                                onMenuOpen={handleMenuOpen}
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
                                    // control: base => ({
                                    //   ...base,
                                    //   border: '1px solid #d0d5dd',
                                    //   boxShadow: 'none',
                                     
                                    // })  ,
                                    control: (provided) => ({
                                      ...provided,
                                      border: '1px solid #d0d5dd', 
                                      "&:focus":{
                                        outline:"none",
                                        border:"none"
                                      }
                                    })
                                }}
                                className={`${errInputBr ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
                              />
                              {errInputBr && <label className="mb-2  text-[14px] text-red-500">{props.dataLang?.client_list_bran}</label>}
                           </div>
                           <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_char}</label>
                          <Select    
                                  closeMenuOnSelect={false}
                                    placeholder={props.dataLang?.client_popup_char}
                                    options={listChar}
                                    isSearchable={true}
                                    onChange={handleChangeChar}
                                    isMulti
                                    value={valueChar}
                                    maxMenuHeight="200px"
                                    isClearable={true}
                                    theme={(theme) => ({
                                      ...theme,
                                      colors: {
                                          ...theme.colors,
                                          primary25: '#EBF5FF',
                                          primary50: '#92BFF7',
                                          primary: '#0F4F9E',
                                      },
                                  })}
                                  noOptionsMessage={() => "Không có dữ liệu"}
                                  menuPortalTarget={document.body}
                                  onMenuOpen={handleMenuOpen}
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
                                  className={`${errInputBr ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full  text-[#52575E] font-normal border outline-none mb-2 rounded-[5.5px] bg-white border-none xl:text-base text-[14.5px]`}
                            />
                              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_list_group}</label>
                              <Select 
                                  placeholder={props.dataLang?.client_list_group}
                                  noOptionsMessage={() => "Không có dữ liệu"}
                                  options={listGr} 
                                  //hihi
                                  value={valueGr}
                                  onChange={handleChangeGr}
                                  isSearchable={true}
                                  isMulti={true}
                                  maxMenuHeight="200px"
                                  isClearable={true}
                                  theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: '#EBF5FF',
                                        primary50: '#92BFF7',
                                        primary: '#0F4F9E',
                                    },
                                })}
                                menuPortalTarget={document.body}
                                onMenuOpen={handleMenuOpen}
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
                                  className="rounded-[5.5px] py-0.5 mb-2 bg-white border-none xl:text-base text-[14.5px] " 
                              />
                              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_limit}</label>
                              <input
                                value={debt_limit}                
                                onChange={_HandleChangeInput.bind(this, "debt_limit")}
                                placeholder={props.dataLang?.client_popup_limit}
                                name="fname"                      
                                type="text"
                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                              />
                              <div>
                               <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_days}</label>
                              <input
                                value={debt_limit_day}                
                                onChange={_HandleChangeInput.bind(this, "debt_limit_day")}
                                name="fname"      
                                placeholder={props.dataLang?.client_popup_days}                
                                type="text"
                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                              />
                            </div>
                            <div>
                            <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_city}</label>
                                <Select 
                                    placeholder={props.dataLang?.client_popup_city}
                                    options={cityOpt} 
                                    value={valueCt ? {label: cityOpt?.find(x => x.value == valueCt)?.label, value: valueCt} : null}
                                    onChange={handleChangeCt} 
                                    isSearchable={true}
                                    maxMenuHeight="200px"
                                    isClearable={true}
                                    noOptionsMessage={() => "Không có dữ liệu"}
                                    theme={(theme) => ({
                                      ...theme,
                                      colors: {
                                          ...theme.colors,
                                          primary25: '#EBF5FF',
                                          primary50: '#92BFF7',
                                          primary: '#0F4F9E',
                                      },
                                  })}
                                  menuPortalTarget={document.body}
                                  onMenuOpen={handleMenuOpen}
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
                                    className="rounded-[5.5px] py-0.5 mb-1 bg-white border-none xl:text-base text-[14.5px] " 
                                />
                            </div>
                             <div className='mb-2'>
                             <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_district}</label>
                              <Select 
                                  placeholder={props.dataLang?.client_popup_district}
                                  options={ditrict} 
                                  // value={valueDis ? {label: ditrict?.find(x => x.value == valueDis)?.label, value: valueDis} : null}
                                  value={valueDis}
                                  onChange={handleChangeDtric} 
                                  isSearchable={true}
                                  maxMenuHeight="200px"
                                  isClearable={true}
                                  theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: '#EBF5FF',
                                        primary50: '#92BFF7',
                                        primary: '#0F4F9E',
                                    },
                                })}
                                noOptionsMessage={() => "Không có dữ liệu"}
                                menuPortalTarget={document.body}
                                onMenuOpen={handleMenuOpen}
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
                                  className="rounded-[5.5px] py-0.5 bg-white border-none xl:text-base text-[14.5px] " 
                              />
                             </div>
                            <div>
                            <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_wards}</label>
                              <Select 
                                  placeholder={props.dataLang?.client_popup_wards}
                                  options={listWar} 
                                  // value={valueWa ? {label: listWar?.find(x => x.value == valueWa)?.label, value: valueWa} : null}
                                  value={valueWa }
                                  onChange={handleChangeWar} 
                                  isSearchable={true}
                                  maxMenuHeight="200px"
                                  isClearable={true}
                                  theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: '#EBF5FF',
                                        primary50: '#92BFF7',
                                        primary: '#0F4F9E',
                                    },
                                })}
                                noOptionsMessage={() => "Không có dữ liệu"}
                                menuPortalTarget={document.body}
                                onMenuOpen={handleMenuOpen}
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
                                  className="rounded-[5.5px] py-0.5 bg-white border-none xl:text-base text-[14.5px] " 
                              />
                            </div>
                          </div>
                            <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_note}</label>
                            <textarea
                              value={note}       
                              placeholder={props.dataLang?.client_popup_note}         
                              onChange={_HandleChangeInput.bind(this, "note")}
                              name="fname"                      
                              type="text"
                              className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[40px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                            />
                      </div>
                    </div>
                  </ScrollArea>
                    )
                  }   
                  { tab === 1 && (
                  <div>
                    <ScrollArea     
                    className="min-h-[0px] max-h-[550px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                      <div className='w-[50vw] flex justify-between space-x-1  flex-wrap p-2'>     
                      {option.map((e) => 
                      <div className='w-[48%]'>
                        <div className="" key={e.id?.toString()}>
                                  <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_fiandlass}</label>
                                  <input
                                    value={e.full_name}                
                                    onChange={_OnChangeOption.bind(this, e.id,"full_name")}
                                    name="optionVariant"                      
                                    type="text"
                                    className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                  />
                                  <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_phone}</label>
                                  <input
                                    value={e.phone_number}                
                                    onChange={_OnChangeOption.bind(this, e.id, "phone_number")}
                                    name="fname"                      
                                    type="number"
                                    className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                  />                  
                                  <label className="text-[#344054] font-normal text-sm mb-1 ">Email</label>
                                  <input
                                    value={e.email}                
                                    onChange={_OnChangeOption.bind(this, e.id, "email")}
                                    name="optionEmail"                      
                                    type="text"
                                    className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                  />                 
                                  <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_position}</label>
                                  <input
                                    value={e.position}                
                                    onChange={_OnChangeOption.bind(this, e.id,"position")}
                                    name="fname"                      
                                    type="text"
                                    className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                  />                     
                                  <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_birthday}</label>
                                  <input
                                    value={e.birthday}                
                                    onChange={_OnChangeOption.bind(this, e.id, "birthday")}
                                    name="fname"                      
                                    type="date"
                                    className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                  />                   
                                  <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_popup_adress}</label>
                                  <textarea
                                    value={e.address}                
                                    onChange={_OnChangeOption.bind(this, e.id, "address")}
                                    name="fname"                      
                                    type="text"
                                    className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[90px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                                  />         
                                  
                            <button onClick={_HandleDelete.bind(this, e.id)}  type='button' title='Xóa' className='transition  w-full bg-slate-100 h-10 rounded-[5.5px] text-red-500 flex flex-col justify-center items-center'><IconDelete /></button>
                          </div>         
                        </div>
                          )} 
                    <button  type='button' onClick={_HandleAddNew.bind(this)} title='Thêm' className='transition w-[48%] mt-5   min-h-[160px] h-40 rounded-[5.5px] bg-slate-100 flex flex-col justify-center items-center'><IconAdd />{props.dataLang?.client_popup_addcontact}</button>         
                    </div>  
                    </ScrollArea>     
                    </div>
                  )}
                  <div className="text-right mt-5 space-x-2">
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
const Popup_chitiet =(props)=>{
  const scrollAreaRef = useRef(null);
  const [open, sOpen] = useState(false);
  const _ToggleModal = (e) => sOpen(e);
  const [tab, sTab] = useState(0)
  const _HandleSelectTab = (e) => sTab(e)
  const [data,sData] =useState()
  const [onFetching, sOnFetching] = useState(false);
  useEffect(() => {
    props?.id && sOnFetching(true) 
  }, [open]);
  const _ServerFetching_detailUser = () =>{
    Axios("GET", `/api_web/api_client/client/${props?.id}?csrf_protection=true`, {}, (err, response) => {
    if(!err){
        var db =  response.data

        sData(db)
    }
    sOnFetching(false)
  })
  }
  useEffect(() => {
    onFetching && _ServerFetching_detailUser()
  }, [open]);
return (
<>
 <PopupEdit   
    title={props.dataLang?.client_popup_detailUser} 
    button={props?.name} 
    onClickOpen={_ToggleModal.bind(this, true)} 
    open={open} onClose={_ToggleModal.bind(this,false)}
    classNameBtn={props?.className} 
  >
  <div className='flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
      <button onClick={_HandleSelectTab.bind(this, 0)} className={`${tab === 0 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>{props.dataLang?.client_popup_general}</button>
      <button onClick={_HandleSelectTab.bind(this, 1)} className={`${tab === 1 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>{props.dataLang?.client_popup_detailContact}</button>
  </div>  
          <div className="mt-4 space-x-5 w-[930px] h-auto  ">        
              {
                tab === 0 &&(
                <ScrollArea ref={scrollAreaRef}
                className="h-[auto] overflow-hidden " 
                speed={1} 
                smoothScrolling={true}>
                  {onFetching ?
                  <Loading className="h-80"color="#0f4f9e" /> 
                  : data !="" &&(
                  <div className="flex gap-5 rounded-md ">
                    <div className='w-[50%] bg-slate-100/40 rounded-md'>
                      <div className='mb-4 h-[50px] flex justify-between items-center p-2'><span className='text-slate-400 text-sm w-[25%]'>{props.dataLang?.client_list_namecode}:</span> <span className='font-normal capitalize'>{data?.code}</span></div>
                      <div className='mb-4 flex justify-between flex-wrap p-2'><span className='text-slate-400 text-sm      w-[25%]'>{props.dataLang?.client_list_name}:</span> <span className='font-normal capitalize'>{data?.name}</span></div>
                      <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_list_repre}:</span> <span className='font-normal capitalize'>{data?.representative}</span></div>
                      <div className='mb-4 flex justify-between  items-center p-2'><span className='text-slate-400 text-sm  w-[25%]'>{props.dataLang?.client_popup_mail}:</span> <span className='font-normal'>{data?.email}</span></div>
                      <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_popup_phone}:</span> <span className='font-normal capitalize'>{data?.phone_number}</span></div>
                      <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_list_taxtcode}:</span> <span className='font-normal capitalize'>{data?.tax_code}</span></div>
                      <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_popup_adress}:</span> <span className='font-normal capitalize'>{data?.address}</span></div> 
                      <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_popup_note}: </span> <span className='font-medium capitalize'>{data?.note}</span></div>
                     
                    </div>
                    <div className='w-[50%] bg-slate-100/40'>
                      
                      <div className='mb-4 min-h-[50px] max-h-[auto] flex  p-2 justify-between  items-center flex-wrap'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_char}:</span> 
                      <span className='flex flex-wrap'>{data?.staff_charge?.map(e=>{ return (
                        <span className='font-normal capitalize   ml-1'>
                          <Popup className='dropdown-avt' key={e.id}
                                  trigger={open => (<img src={e.profile_image}  width={40} height={40} className="object-cover rounded-[100%]"></img>)}
                                  position="top center" on={['hover']} arrow={false}>
                            <span className='bg-[#0f4f9e] text-white rounded p-1.5'>{e.full_name} </span>
                          </Popup>  
                        </span>)})}
                      </span>
                      </div>
                      <div className='mb-4 flex justify-between  p-2 items-center flex-wrap'><span className='text-slate-400 text-sm'>{props.dataLang?.client_list_brand}:</span> <span className='flex justify-between space-x-1'>{data?.branch?.map(e=>{ return (<span  className='last:ml-0 font-normal capitalize  w-fit xl:text-base text-xs px-2 text-[#0F4F9E] border border-[#0F4F9E] rounded-[5.5px]'> {e.name}</span>)})}</span></div>
                      <div className='mb-4 justify-between  items-center p-2 flex space-x-2'><span className='text-slate-400 text-sm'>{props.dataLang?.client_list_group}:</span> <span className='flex justify-between space-x-1'>{data?.client_group?.map(e=>{ return (<span style={{ backgroundColor: `${e.color == "" || e.color == null ? "#e2f0fe" : e.color}`, color: `${e.color == "" ? "#0F4F9E" : "#0F4F9E"}`}} className="last:ml-0 font-normal capitalize  w-fit xl:text-base text-xs px-2   rounded-[5.5px]">{e.name} </span>)})}</span></div>
                      <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_limit}:</span> <span className='font-normal capitalize'>{data?.debt_limit}</span></div>
                      <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_days}:</span> <span className='font-normal capitalize'>{data?.debt_limit_day}</span></div>
                      {/* <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_date}:</span> <span className='font-normal capitalize'>{moment(data?.date_create).format("DD/MM/YYYY")}</span></div> */}
                      <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_city}:</span> <span className='font-normal capitalize'>{data?.city != "" ?(data?.city.type+" "+data?.city.name) :""}</span></div>                        
                      <div className='mb-4 flex justify-between p-2 items-center'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_district}: </span><span className='font-normal capitalize'>{data?.district != "" ?(data?.district.type+" "+data?.district.name):""}</span>,<span  className='text-slate-400 text-sm'>{props.dataLang?.client_popup_wards}:</span><span className='font-normal capitalize'>{data?.ward != "" ? (data?.ward.type+" "+data?.ward.name) :""}</span></div>
                     
                    </div>
                  </div>)
                  }
                </ScrollArea>
                )
              }   
       { tab === 1 && (
        <div>
           <div className='w-[930px]'>
             <div className="min:h-[200px] h-[72%] max:h-[400px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              <div className="pr-2 w-[100%] lx:w-[110%] ">
                <div className="flex items-center sticky top-0 bg-slate-100 p-2 z-10">
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[400] text-left">{props.dataLang?.client_popup_detailName}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[400] text-center">{props.dataLang?.client_popup_phone}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[400] text-left">{props.dataLang?.client_popup_mail}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[400] text-left">{props.dataLang?.client_popup_position}</h4> 
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[400] text-left">{props.dataLang?.client_popup_birthday}</h4>
                  <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[400] text-left">{props.dataLang?.client_popup_adress}</h4>
                </div>
                {onFetching ?
                  <Loading className="h-80"color="#0f4f9e" /> 
                  : 
                  data?.contact?.length > 0 ? 
                  (<>
                       <ScrollArea     
                         className="min-h-[455px] max-h-[455px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                    <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[500px]">                       
                      {(data?.contact?.map((e) => 
                        <div className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 " key={e.id.toString()}>
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{e.full_name}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-center">{e.phone_number}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left break-words">{e.email}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[10%]  rounded-md text-left break-words">{e.position}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left">{e.birthday != "0000-00-00" ? moment(e.birthday).format("DD-MM-YYYY") : ""}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{e.address}</h6>                
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
            </div>
          </div>
    
     </div>
    ) }
    </div>    
  </PopupEdit>
</>
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