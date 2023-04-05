import React, {useState, useRef, useEffect} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {_ServerInstance as Axios} from '/services/axios';
const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});
import Image from 'next/image';

import ReactExport from "react-data-export";

import Swal from 'sweetalert2'


import { Edit as IconEdit,  Grid6 as IconExcel, Trash as IconDelete, SearchNormal1 as IconSearch,Add as IconAdd,  Eye as IconEye, EyeSlash as IconEyeSlash, LocationTick, User,Image as IconImage,GalleryEdit as IconEditImg  } from "iconsax-react";
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import Pagination from '/components/UI/pagination';
import dynamic from 'next/dynamic';
import moment from 'moment/moment';
import Select,{components } from 'react-select';
import Popup from 'reactjs-popup';
import { el } from 'date-fns/locale';


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
})


const CustomSelectOption = ({value, label, level, code}) => (
    <div className='flex space-x-2 truncate'>
        {level == 1 && <span>--</span>}
        {level == 2 && <span>----</span>}
        {level == 3 && <span>------</span>}
        {level == 4 && <span>--------</span>}
        <span className="2xl:max-w-[300px] max-w-[150px] w-fit truncate">{label}</span>
    </div>
)
const Index = (props) => {
    const dataLang = props.dataLang
    const router = useRouter();

    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);
    const [totalItem, sTotalItems] = useState([]);

    const [onFetching, sOnFetching] = useState(false);
    const [data, sData] = useState({});
    const [data_ex, sData_ex] = useState([]);
    const [listDs, sListDs] = useState()

    const [dataOption, sDataOption] = useState([]);
    const [idCategory, sIdCategory] = useState(null);
    const [onFetchingOpt, sOnFetchingOpt] = useState(false);
    const _ServerFetchingOtp = () => {
        Axios("GET", "/api_web/api_staff/positionOption", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                sDataOption(rResult.map(x => ({label: `${x.name }`, value: x.id, level: x.level, code: x.code, parent_id: x.parent_id})))
            }
        })
        sOnFetchingOpt(false)
    }
    const _HandleFilterOpt = (type, value) => {
        if(type == "category"){
            sIdCategory(value)
        }
    }
    useEffect(() => {
        onFetchingOpt && _ServerFetchingOtp()
    }, [onFetchingOpt]);

    useEffect(() => {
        sOnFetchingOpt(true)
    }, []);

    const [room, sRoom]= useState([])
        const _ServerFetching_room =  () =>{
            Axios("GET", `/api_web/api_staff/department/?csrf_protection=true`, {}, (err, response) => {
            if(!err){
                var {rResult} =  response.data
                sRoom(rResult)   
            }
            sOnFetching(false)
          })
    }
    const _ServerFetching =  () => {
    
        Axios("GET", `/api_web/api_staff/staff/?csrf_protection=true" }`, {
            params: {
                search: keySearch,
                limit: limit,
                page: router.query?.page || 1,
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
    const options = listBr_filter?.filter((x) => !hiddenOptions.includes(x.value));
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
        onFetching && _ServerFetching() || onFetching && _ServerFetching_brand()   || onFetching && _ServerFetching_room()
      }, [onFetching]);
    useEffect(() => {
        sOnFetching(true) || (keySearch && sOnFetching(true)) || (idBranch?.length > 0 && sOnFetching(true))  || (idCategory && sOnFetching(true))
     }, [limit,router.query?.page, ,idBranch,idCategory]);

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
    const [status, sStatus] = useState(false)
    const _HandleChangeInput = (type, value) => {
        if(type == "status"){
            sStatus(value.target?.checked)
          }
    }
    //excel
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
              {title: "Chi nhánh", width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
              {title: "Ngày tạo", width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
          ],
          data: data_ex?.map((e) =>
              [
                  {value: `${e.id}`, style: {numFmt: "0"}},
                  {value: `${e.code}`},
                  {value: `${e.name}`},
                  {value: `${e.representative}`},
                  {value: `${e.tax_code}`},
                  {value: `${e.phone_number}`},
                  {value: `${e.address}`},
                  {value: `${e.staff_charge?.map(i => i.full_name)}`},
                  {value: `${e.client_group?.map(i => i.name)}`},
                  {value: `${e.branch?.map(i => i.name)}`},
                  {value: `${e.date_create}`},
              ]    
          ),
      }
    ];
    
    return (
        <React.Fragment>
      <Head>
        <title>{dataLang?.personnels_staff_title}</title>
      </Head>
      <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
        <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
          <h6 className="text-[#141522]/40">{dataLang?.personnels_staff_title}</h6>
          <span className="text-[#141522]/40">/</span>
          <h6>{dataLang?.personnels_staff_title}</h6>
        </div>

        <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
          <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 h-[96%] overflow-hidden">
                <div className='flex justify-between'>
                    <h2 className="text-2xl text-[#52575E] capitalize">{dataLang?.personnels_staff_title}</h2>
                    <div className="flex justify-end items-center">
                    <Popup_dsnd room={room}  listBr={listBr} dataOption={dataOption}  onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} data={data} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />
                  </div>
                  
                </div>
                
                <div className='flex space-x-1 items-center'>
                <div className='ml-1 w-[20%]'>
                <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.client_list_brand}</h6>
                    <Select 
                        options={options}
                    onChange={onchang_filterBr.bind(this, "branch")}
                    value={idBranch}
                    hideSelectedOptions={false}
                    isMulti
                    isClearable={true}
                    placeholder={dataLang?.client_list_filterbrand} 
                    className="rounded-md py-0.5 bg-white border-none xl:text-base text-[14.5px] z-20" 
                    isSearchable={true}
                    noOptionsMessage={() => "Không có dữ liệu"}
                    components={{ MultiValue }}
                    closeMenuOnSelect={false}
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
                  }}
                   />
                </div>
                  <div className='w-[20%]'>
                  <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.personnels_staff_position}</h6>
                  <Select 
                    options={dataOption}
                    formatOptionLabel={CustomSelectOption}
                    onChange={_HandleFilterOpt.bind(this, "category")}
                    value={idCategory}
                    isClearable={true}
                    placeholder={dataLang?.personnels_staff_position_click} 
                    className="rounded-md py-0.5 bg-white border-none xl:text-base text-[14.5px] z-20" 
                    isSearchable={true}
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
                    }}
                />
                  </div>
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
                      data_ex?.length > 0 &&(
                        <ExcelFile filename="Danh sách người dùng" title="Dsnd" element={
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
                <div className="min:h-[200px] h-[72%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2 w-[100%] lx:w-[115%] ">
                    <div className="flex items-center sticky top-0 bg-white p-2 z-10">
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-left">{dataLang?.personnels_staff_table_avtar}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-left">{dataLang?.personnels_staff_table_fullname}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-left">{dataLang?.personnels_staff_table_code}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-left">{dataLang?.personnels_staff_table_email}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-left">{dataLang?.personnels_staff_table_depart}</h4> 
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300] text-center">{dataLang?.personnels_staff_position}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[22%] font-[300] text-left">{dataLang?.personnels_staff_table_logged}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-left">{dataLang?.personnels_staff_table_active}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300] text-left">{dataLang?.client_list_brand}</h4>
                      <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center">{dataLang?.branch_popup_properties}</h4>
                    </div>
                    {onFetching ?
                      <Loading className="h-80"color="#0f4f9e" /> 
                      : 
                      data?.length > 0 ? 
                      (<>
                          <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">                       
                          {(data?.map((e) => 
                            <div className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 " key={e.id.toString()}>
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left"><div className='w-[60px] h-[60px]'>
                                {e?.profile_image == null ?
                                                        <img src="/no_image.png" className='w-full h-12 rounded object-contain' />
                                                    :
                                                        <Image width={64} height={64} quality={100} src={e?.profile_image} alt="thumb type" className="w-12 h-12 rounded object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/>
                                                    }
                                     </div>
                                </h6>           
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left text-[#0F4F9E] hover:font-normal">
                                {/* <Popup_chitiet dataLang={dataLang} className="text-left" name={e.name} id={e?.id}/> */}
                                {e.full_name}
                                </h6>           
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{e.code}</h6>
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{e.email}</h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left"><div className='flex flex-wrap gap-2'>{e.department?.map(e =>{
                                return (
                                 <span>{e.name}</span>
                                )
                              })}</div></h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-center">{e.position_name}</h6>                
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[22%]  rounded-md text-left">{e.last_login}</h6>                              
                              <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox"  className="sr-only peer" value={status}  id={e.id}     
                                    onChange={_HandleChangeInput.bind(this, "status")}/>
                                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </h6>                              
                            <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%] rounded-md text-left flex justify-start flex-wrap ">{e.branch?.map(i => (<span key={i} className="mr-2 mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-[5.5px]">{i.name}</span>))}</h6>                  
                              <div className="space-x-2 w-[10%] text-center">
                                <Popup_dsnd room={room}  listBr={listBr} dataOption={dataOption}  onRefresh={_ServerFetching.bind(this)} className="xl:text-base text-xs " listDs={listDs} dataLang={dataLang} name={e.name}code={e.code} phone_number={e.phone_number} 
                                  email={e.email}   id={e?.id} department={e.department} position_name={e.position_name} last_login={e.last_login}/>
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

const Popup_dsnd = (props) => {


      const dataLang = props.dataLang
      const scrollAreaRef = useRef(null);
      const handleMenuOpen = () => {
      const menuPortalTarget = scrollAreaRef.current;
          return { menuPortalTarget };
      };
      
      const [open, sOpen] = useState(false);
      const _ToggleModal = (e) => sOpen(e);
      const [onFetching, sOnFetching] = useState(false);
      const [onSending, sOnSending] = useState(false);
      const [onFetching_Manage, sOnFetching_Manage] = useState(false);

      const [errInput, sErrInput] = useState(false);
      const [errInputBr, sErrInputBr] = useState(false);

      
      const [name, sName] = useState("")
      const [code, sCode] = useState(null)
      const [password, sPassword] = useState("");
      const [phone_number, sPhone] = useState(null)
      const [email, sEmail] = useState("")
      const [admin, sAdmin] = useState("0")
      console.log(admin);
      const [valueBr, sValueBr] = useState([])
      const [dataDepar,sDataDepar]=useState([])
      const depar_id = dataDepar?.map(e =>{
        return e?.id
      })
      const [room, sRoom]= useState()
      // const [valuePosi, sValuePosi] = useState()
      
      const [tab, sTab] = useState(0)
      const _HandleSelectTab = (e) => sTab(e)
   
      const [thumb, sThumb] = useState(null);
      const [thumbFile, sThumbFile] = useState(null);
      const [isDeleteThumb, sIsDeleteThumb] = useState(false);
      const [dataOption, sDataOption] = useState();
      const [typePassword, sTypePassword] = useState(false);
      const _TogglePassword = () => sTypePassword(!typePassword)
        const _HandleChangeFileThumb = ({target: {files}}) => {
          var [file] = files;
          if(file){
              sThumbFile(file)
              sThumb(URL.createObjectURL(file))
          }
          sIsDeleteThumb(false)
      }
      const _DeleteThumb = (e) => {
          e.preventDefault()
          sThumbFile(null)
          sThumb(null)
          document.getElementById("upload").value = null;
          sIsDeleteThumb(true)
      }

    useEffect(() => {
        sThumb(thumb)
     },[thumb])

      useEffect(() => {
        sErrInputBr(false)
        sErrInput(false)
        sName("")
        sPhone()
        sEmail("")
        sAdmin(false)
        sThumb(null)
        sThumbFile(null)
        sPassword()
        props?.id && sOnFetching(true)  
        sValueBr([])
        sDataDepar([])
        // sValuePosi() 
        sListBrand(props.listBr ? props.listBr && [...props.listBr?.map(e => ({label: e.name, value: Number(e.id)}))] : [])
        sRoom(props?.room ? props.room : [])
        sDataOption(props?.dataOption ? props?.dataOption : [])
        sIdPos()
        sValueManage([])
        sCode()
        // sManage([])
      }, [open]);

      const _ServerFetching_detailUser =  () =>{
          Axios("GET", `/api_web/api_staff/staff/${props?.id}?csrf_protection=true`, {}, (err, response) => {
          if(!err){
              var db =  response.data
              console.log(db);
              sName(db?.full_name)
              sCode(db?.code)
              sPhone(db?.phonenumber)
              sEmail(db?.email)
              sValueBr(db?.branch?.map(e=> ({label: e.name, value: Number(e.id)})))
              sValueManage(db?.manage?.map(x => ({label: x.full_name, value: Number(x.id)})))
              sAdmin(db?.admin)
              sDataDepar(db?.department)
              sThumb(db?.profile_image)
              sIdPos(db?.position_id)
          }
          sOnSending(false)
         })
        
        }
        useEffect(() => {
            open && _ServerFetching_detailUser()  
          }, [open]);

        
      const _HandleChangeInput = (type, value) => {
        if(type == "name"){
          sName(value.target?.value)
        }else if(type == "code"){
          sCode(value.target?.value)
        }else if(type == "phone_number"){
          sPhone(value.target?.value)
        }else if(type == "email"){
          sEmail(value.target?.value)
        
        }else if(type === "password"){
            sPassword(value.target?.value)
        }
        else if(type === "admin"){
          if(value.target?.checked === false){
            sAdmin("0")
          } else if(value.target?.checked === true)
          {
            sAdmin("1")
          }
        }
        else if(type === "depar"){
            const name = value?.target.name;
            const id = value?.target.id;
            if (value?.target.checked) {
                // Thêm giá trị và id vào mảng khi input được chọn
                const updatedOptions = [...dataDepar, { name, id }];
                sDataDepar(updatedOptions);
            } else {
                // Xóa giá trị và id khỏi mảng khi input được bỏ chọn
                const updatedOptions = dataDepar.filter(option => option.id !== id);
                sDataDepar(updatedOptions);
            }
        }
        else if(type == "valueBr"){
          sValueBr(value)
        }

       
      }
      // branh
      const [brandpOpt, sListBrand] = useState([])
      const branch_id = valueBr?.map(e =>{
        return e?.value
      })
        //post db
        const _ServerSending = () => {
        let id = props?.id
        var data = new FormData();
        data.append('name', name);
        data.append('code', code);    
        data.append('password', password);    
        // data.append('position_id', valuePosi);    
        data.append('department_id', depar_id);    
        data.append('admin', admin);    
        data.append('phone_number', phone_number);
        data.append('email', email);
        data.append('branch_id', branch_id);
        data.append("profile_image", thumbFile)
        data.append("position_id", idPos)
        data.append("is_delete_image ", isDeleteThumb)
        data.append("manage ", manageV)
        Axios("POST",`${id ? `/api_web/api_staff/staff/${id}?csrf_protection=true` : "/api_web/api_staff/staff/?csrf_protection=true"}`, {
            data:{
            full_name: name,
            code:code,
            password:password,
            phone_number:phone_number,
            email:email,
            // position_id: valuePosi,
            department_id: depar_id,
            admin:admin,
            branch_id: branch_id,
            position_id: idPos,
            profile_image:thumbFile,
            manage:manageV,
            is_delete_image:isDeleteThumb
            },
            // data:data,
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
                    sPhone()
                    sEmail("")
                    sAdmin(false)
                    sThumb(null)
                    sThumbFile(null)          
                    sValueBr([])
                    sDataDepar([])  
                    sIdPos()
                    sValueManage([])
                      
                        
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

    useEffect(() => {
      onSending && _ServerSending()  
    }, [onSending]);



    const [manage, sManage]= useState([])
    const _ServerFetching__Manage =  () =>{
      Axios("GET",`/api_web/api_staff/staffManage/${idPos ? idPos : -1}?csrf_protection=true`, {
    }, (err, response) => {
      if(!err){
          var data =  response.data
          sManage(props?.id  ? ([...data.map(e=> ({label: e.full_name, value: Number(e.id)}))?.filter(e => valueManage.some(x => e.value !== x.value))]): data?.map(e=> ({label: e.full_name, value: Number(e.id)}))) 
      }
      sOnFetching_Manage(false)
    })
    }
    const [valueManage, sValueManage] = useState([])
    const manageV =  valueManage?.map(e=> e.value)  
    const handleChangeMana =  (e) => {
      sValueManage(e) 
    }
  
    const [idPos, sIdPos] = useState(null);
    const valueIdPos = (e) => sIdPos(e?.value)

    // useEffect(() => {
    //     onFetchingMana && _ServerFetching__Manage()
    // }, [onFetchingMana]);
    useEffect(() => {
        open && _ServerFetching__Manage()
    }, [idPos]);


    // save form
    const _HandleSubmit = (e) => {
      e.preventDefault()
      if(name?.length == 0 || branch_id?.length == 0){
        name?.length == 0 && sErrInput(true) 
        branch_id?.length == 0 && sErrInputBr(true) 
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
      open && sOnFetching_Manage(true)
    },[idPos])
    
    useEffect(()=>{
      onFetching_Manage && _ServerFetching__Manage()
    },[onFetching_Manage])

  return(
      <>
      <PopupEdit   
        title={props.id ? `${props.dataLang?.personnels_staff_popup_edit}` : `${props.dataLang?.personnels_staff_popup_add}`} 
        button={props.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
        onClickOpen={_ToggleModal.bind(this, true)} 
        open={open} onClose={_ToggleModal.bind(this,false)}
        classNameBtn={props.className} 
      >
      <div className='flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
          <button onClick={_HandleSelectTab.bind(this, 0)} className={`${tab === 0 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>{props.dataLang?.personnels_staff_popup_info}</button>
          <button onClick={_HandleSelectTab.bind(this, 1)} className={`${tab === 1 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>{props.dataLang?.personnels_staff_popup_power}</button>
      </div>
              <div className="mt-4">
                  <form onSubmit={_HandleSubmit.bind(this)} className="">
                  {
                    tab === 0 &&(
                      <ScrollArea   ref={scrollAreaRef} className="h-[500px] overflow-hidden"   speed={1}    smoothScrolling={true}>
                  <div className='w-[45vw]    '>         
                      <div className="flex justify-between gap-5"> 
                        <div className='w-1/2'>
                       
                                <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.personnels_staff_popup_code} </label>
                                <input
                                  value={code}                
                                  onChange={_HandleChangeInput.bind(this, "code")}
                                  name="fname"                      
                                  type="text"
                                  placeholder={props.dataLang?.client_popup_sytem}
                                  className= "focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                />
                                
                              <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.personnels_staff_popup_name}<span className="text-red-500">*</span></label>
                             <div>
                             <input
                                value={name}                
                                onChange={_HandleChangeInput.bind(this, "name")}
                                placeholder={props.dataLang?.personnels_staff_popup_name}                     
                                type="text"
                                className={`${errInput ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                              />
                              
                              {errInput && <label className="mb-4  text-[14px] text-red-500">{props.dataLang?.client_list_nameuser}</label>}
                             </div>
                             <div>
                           <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.client_list_brand} <span className="text-red-500">*</span></label>
                              <Select   
                                 closeMenuOnSelect={false}
                                  placeholder={props.dataLang?.client_list_brand}
                                  options={brandpOpt}
                                  isSearchable={true}
                                  onChange={_HandleChangeInput.bind(this, "valueBr")}
                                  LoadingIndicator
                                  isMulti
                                  noOptionsMessage={() => "Không có dữ liệu"}
                                  value={valueBr}
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
                                className={`${errInputBr ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
                              />
                              {errInputBr && <label className="mb-2  text-[14px] text-red-500">{props.dataLang?.client_list_bran}</label>}
                           </div>
                               <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.personnels_staff_popup_email}</label>
                              <input
                                value={email}                
                                onChange={_HandleChangeInput.bind(this, "email")}
                                placeholder={props.dataLang?.personnels_staff_popup_email}
                                name="fname"                      
                                type="email"
                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                              />
                               
                               <div className=''>
                                <label className="text-[#344054] font-normal text-sm mb-1 ">{props.dataLang?.personnels_staff_popup_phone}</label>
                              <input
                                value={phone_number}           
                                placeholder={props.dataLang?.personnels_staff_popup_phone}     
                                onChange={_HandleChangeInput.bind(this, "phone_number")}
                                name="fname"                      
                                type="number"
                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                              />
                              </div>
                              <div className='flex items-center '>
                                     <label
                                        className="relative flex cursor-pointer items-center rounded-full p-3"
                                        for="checkbox-6"
                                        data-ripple-dark="true"
                                        > 
                                        <input
                                            type="checkbox"
                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                                            id="checkbox-6"
                                            // defaultChecked={admin == "1" && true}
                                        value={admin}
                                       checked={admin === "0" ? false : admin === "1" && true}
                                        onChange={_HandleChangeInput.bind(this, "admin")}
                                        />
                                        <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                            <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3.5 w-3.5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            stroke="currentColor"
                                            stroke-width="1"
                                            >
                                            <path
                                                fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"
                                            ></path>
                                            </svg>
                                        </div>
                                        
                                    </label>
                                    <span className='text-[#344054] font-normal text-sm '>{props.dataLang?.personnels_staff_popup_manager}</span>

                              </div>
                             <div className='relative flex flex-col mt-3'>
                              <label className="text-[#344054] font-normal text-sm ">{props.dataLang?.personnels_staff_popup_pas}<span className="text-red-500">*</span></label>
                                <input
                                type={typePassword ? "text" : "password"}
                                placeholder={props.dataLang?.personnels_staff_popup_pas}
                                value={password}
                                id="userpwd"
                                onChange={_HandleChangeInput.bind(this, "password")}
                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal py-2 pl-3 pr-12 border outline-none "

                                />
                                <button type='button' onClick={_TogglePassword.bind(this)} className='absolute right-3 top-[50%]'>{typePassword ? <IconEyeSlash /> : <IconEye />}</button>
                            </div>
                         </div>
                         <div className='w-1/2'>
                            <div className='space-y-1 '>
                                <label className="text-[#344054] font-normal text-sm">{props.dataLang?.personnels_staff_table_avtar}</label>
                                <div className='flex justify-center'>
                                    <div className='relative h-[180px] w-[180px] rounded bg-slate-200'>
                                        {thumb && <Image width={180} height={180} quality={100} src={typeof(thumb)==="string" ? thumb : URL.createObjectURL(thumb)} alt="thumb type" className="w-[180px] h-[180px] rounded object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/>}
                                        {!thumb && <div className='h-full w-full flex flex-col justify-center items-center'><IconImage /></div>}
                                        <div className='absolute bottom-0 -right-12 flex flex-col space-y-2'>
                                            <input onChange={_HandleChangeFileThumb.bind(this)} type="file" id={`upload`} accept="image/png, image/jpeg" hidden />
                                            <label htmlFor={`upload`} title='Sửa hình' className='cursor-pointer w-8 h-8 rounded-full bg-slate-100 flex flex-col justify-center items-center'><IconEditImg size="17" /></label>
                                            <button disabled={!thumb ? true : false} onClick={_DeleteThumb.bind(this)} title='Xóa hình' className='w-8 h-8 rounded-full bg-red-500 disabled:opacity-30 flex flex-col justify-center items-center text-white'><IconDelete size="17" /></button>
                                        </div>
                                   </div>
                                </div>
                            </div>                         
                         </div>
                      </div>
                    </div>
                  </ScrollArea>
                    )
                  }   
                  { tab === 1 && (
                  <div>
                    <ScrollArea     
                    className="min-h-[0px] max-h-[550px] overflow-hidden"  speed={1}  smoothScrolling={true}>
                      <div className='w-[45vw] flex  items-center justify-between gap-5  flex-wrap '>     
                     <div className='flex items-center w-full gap-5 mb-3'>
                        <div className='w-1/2'>
                        <div className=''>
                        <label className="text-[#344054] font-normal text-base">{props.dataLang?.personnels_staff_position}</label>
                        <Select 
                            options={dataOption}
                            formatOptionLabel={CustomSelectOption}
                            defaultValue={(idPos == "0" || !idPos) ? {label: `${props.dataLang?.personnels_staff_position}`} : {label: dataOption.find(x => x?.parent_id == idPos)?.label, code:dataOption.find(x => x?.parent_id == idPos)?.code, value: idPos}}
                            value={(idPos == "0" || !idPos) ? {label: props.dataLang?.personnels_staff_position, code: props.dataLang?.personnels_staff_position} : {label: dataOption.find(x => x?.value == idPos)?.label, code:dataOption.find(x => x?.value == idPos)?.code, value: idPos}}
                            onChange={valueIdPos.bind(this)}
                            isClearable={true}
                            placeholder={props.dataLang?.personnels_staff_position}
                            className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none" 
                            isSearchable={true}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary25: '#EBF5FF',
                                    primary50: '#92BFF7',
                                    primary: '#0F4F9E',
                                },
                            })}
                        />
                        </div>
                        </div>
                        <div className='w-1/2'>
                            <label className="text-[#344054] font-normal text-sm  ">{props.dataLang?.personnels_staff_popup_mana} </label>
                                <Select   
                                    closeMenuOnSelect={false}
                                    placeholder={props.dataLang?.personnels_staff_popup_mana}
                                    options={manage}
                                    // value={valueManage ? {label: listWar?.find(x => x.value == valueManage)?.label, value: valueManage} : null}
                                    isSearchable={true}
                                    onChange={handleChangeMana}
                                    LoadingIndicator
                                    //hihihi
                                    isMulti
                                    noOptionsMessage={() => "Không có dữ liệu"}
                                    value={valueManage}
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
                                        control: (provided) => ({
                                        ...provided,
                                        border: '1px solid #d0d5dd', 
                                        "&:focus":{
                                            outline:"none",
                                            border:"none"
                                        }
                                        })
                                    }}
                                    className={`${errInputBr ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300  text-[#52575E] font-normal border outline-none rounded-[5.5px] bg-white border-none xl:text-base text-[14.5px]`}
                                />
                        </div>
                        
                     </div>
                     <div className='h-[400px] w-full'>
                        <label className="text-[#344054] font-normal text-base mb-3">{props?.dataLang?.personnels_staff_table_depart}</label>
                          <div className=''>
                            <div className=' flex  flex-wrap justify-between'>
                                {room?.map(e => {
                                        return (     
                                            <div className='w-[50%]  mt-2' key={e.id}>                                                
                                              <div className="flex w-max 
                                              items-center">
                                                  <div className="inline-flex items-center">   
                                                      <label
                                                      className="relative flex cursor-pointer items-center rounded-full p-3"
                                                    htmlFor={e.id}
                                                      data-ripple-dark="true"
                                                      > 
                                                      <input
                                                          type="checkbox"
                                                          className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                                                          id={e.id}
                                                          defaultChecked
                                                          value={e.name}
                                                          checked={dataDepar?.some((selectedOpt) => selectedOpt.id === e.id)}
                                                          onChange={_HandleChangeInput.bind(this, "depar")}

                                                      />
                                                      <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                          <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          className="h-3.5 w-3.5"
                                                          viewBox="0 0 20 20"
                                                          fill="currentColor"
                                                          stroke="currentColor"
                                                          stroke-width="1"
                                                          >
                                                          <path
                                                              fill-rule="evenodd"
                                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                              clip-rule="evenodd"
                                                          ></path>
                                                          </svg>
                                                      </div>
                                                      </label>
                                                  </div>
                                                  <span className='text-[#344054] font-medium text-base '>{e.name}</span>

                                              </div>
                                          </div>
                                        )})}      
                            </div>  
                          </div>
                     </div>
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
                      <div className='mb-4 flex justify-between  items-center p-2'><span className='text-slate-400 text-sm  w-[25%]'>{props.dataLang?.client_popup_mail}:</span> <span className='font-normal capitalize'>{data?.email}</span></div>
                      <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_popup_phone}:</span> <span className='font-normal capitalize'>{data?.phone_number}</span></div>
                      <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_list_taxtcode}:</span> <span className='font-normal capitalize'>{data?.tax_code}</span></div>
                      <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_popup_adress}:</span> <span className='font-normal capitalize'>{data?.address}</span></div> 
                      <div className='mb-4 flex justify-between items-center p-2'><span className='text-slate-400 text-sm   w-[25%]'>{props.dataLang?.client_popup_note}: </span> <span className='font-medium capitalize'>{data?.note}</span></div>
                     
                    </div>
                    <div className='w-[50%] bg-slate-100/40'>
                      
                      <div className='mb-4 min-h-[50px] max-h-[auto] flex  p-2 justify-between  items-center flex-wrap'><span className='text-slate-400 text-sm'>{props.dataLang?.client_popup_char}:</span> 
                      <span className='flex'>{data?.staff_charge?.map(e=>{ return (
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
                      <div className='mb-4 justify-between items-center p-2 flex space-x-2'><span className='text-slate-400 text-sm'>{props.dataLang?.client_list_group}:</span> {data?.client_group?.map(e=>{ return (<span className='font-normal capitalize ml-1'>{e.name}</span>)})}</div>
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
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left">{e.email}</h6>                
                          <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[10%]  rounded-md text-left">{e.position}</h6>                
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