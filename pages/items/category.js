import React, {useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

import {_ServerInstance as Axios} from '/services/axios';
import PopupEdit from "/components/UI/popup";
import Pagination from '/components/UI/pagination';
import Loading from "components/UI/loading";

import { Editor } from '@tinymce/tinymce-react';
import Popup from 'reactjs-popup';
import { 
    Minus as IconMinus, SearchNormal1 as IconSearch, ArrowDown2 as IconDown, Trash as IconDelete, Edit as IconEdit,
    Grid6 as IconExcel
 } from "iconsax-react";
import Swal from "sweetalert2";
import Select from 'react-select';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

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
        <span className="2xl:max-w-[250px] max-w-[150px] w-fit truncate">{label}</span>
    </div>
)

const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    const dispatch = useDispatch();
    const option_NhomNVL = useSelector(state => state.option_NhomNVL);

    const [dataOption, sDataOption] = useState([]);
    const [idCategory, sIdCategory] = useState(null);
    const _HandleFilterOpt = (e) => sIdCategory(e)
    console.log(idCategory)

    const [onFetching, sOnFetching] = useState(false);
    const [data, sData] = useState([]);

    const [totalItems, sTotalItems] = useState({});
    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);

    const [checkFetching, sCheckFetching] = useState(false);

    const _ServerFetching = () => {
        Axios("GET", "/api_web/api_material/category?csrf_protection=true", {
            params: {
                search: keySearch,
                limit: limit,
                page: router.query?.page || 1,
                "filter[id]": idCategory?.value ? idCategory?.value : null
            }
        }, (err, response) => {
            if(!err){
                var {output, rResult} = response.data;
                sData(rResult);
                sTotalItems(output);
            }
        })
        Axios("GET", "/api_web/api_material/category?csrf_protection=true", {
            params: {
                isOption: "1"
            }
        }, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                dispatch({type: "option_NhomNVL/update", payload: rResult ? rResult : null})
            }
            sCheckFetching(true)
        })
        sOnFetching(false)
    }

    useEffect(() => {
        sDataOption(option_NhomNVL != null && [...option_NhomNVL?.map(x => ({label: `${x.name + " " + "(" + x.code + ")"}`, value: x.id, level: x.level, code: x.code, parent_id: x.parent_id}))])
        sCheckFetching(false)
    }, [checkFetching]);

    useEffect(() => {
        onFetching && _ServerFetching() 
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true) || (keySearch && sOnFetching(true)) || (idCategory && sOnFetching(true))
    }, [limit,router.query?.page, idCategory]);

    const paginate = pageNumber => {
        router.push({
            pathname: '/items/category',
            query: { page: pageNumber }
        })
    }

    const _HandleOnChangeKeySearch = ({target: {value}}) => {
        sKeySearch(value)
        router.replace("/items/category")
        setTimeout(() => {
            if(!value){
              sOnFetching(true)
            }
            sOnFetching(true)
        }, 1500);
    };

    const multiDataSet = [
        {
            columns: [
                {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: "Mã danh mục", width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: "Tên danh mục", width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: "Ghi chú", width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            ],
            data: data.map((e) => 
                [
                    {value: `${e.id}`, style: {numFmt: "0"}},
                    {value: `${e.code}`},
                    {value: `${e.name}`},
                    {value: `${e.note}`},
                ]
            ),
        }
    ];

    return (
        <React.Fragment>
            <Head>
                <title>Nhóm nguyên vật liệu</title>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between'>
                <div className='h-[97%] space-y-3 overflow-hidden'>
                    <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                        <h6 className='text-[#141522]/40'>{dataLang?.list_btn_seting_category}</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 className='text-[#141522]/40'>NVL, thành phẩm, vật tư</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6>Nhóm nguyên vật liệu</h6>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h2 className='xl:text-3xl text-xl font-medium '>Nhóm Nguyên Vật Liệu</h2>
                        <div className='flex space-x-3 items-center'>
                            <Popup_NVL onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} data={data} className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105' />
                            <BtnTacVu className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#e2e8f0] via-[#e2e8f0] via-[#cbd5e1] to-[#e2e8f0] rounded btn-animation hover:scale-105 " />
                        </div>
                    </div>
                    <div className='grid grid-cols-4 gap-8'>
                        <div className=''>
                            <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>Tên danh mục</h6>
                            <Select 
                                options={dataOption}
                                formatOptionLabel={CustomSelectOption}
                                onChange={_HandleFilterOpt.bind(this)}
                                value={idCategory}
                                isClearable={true}
                                placeholder="Chọn mã chứng từ" 
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
                            />
                        </div>
                    </div>
                    <div className='bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2'>
                        <form className="flex items-center relative">
                            <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                            <input
                                className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md w-[400px]"
                                type="text"  
                                onChange={_HandleOnChangeKeySearch.bind(this)} 
                                placeholder={dataLang?.branch_search}
                            />
                        </form>
                        {data.length != 0 &&
                            <div className='flex space-x-6'>
                                <ExcelFile filename="nhóm nvl" title="Hiii" element={
                                    <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition'>
                                        <IconExcel size={18} />
                                        <span>Xuất Excel</span>
                                    </button>
                                }>
                                    <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name="Organization" />
                                </ExcelFile>

                                <div className="flex space-x-2 items-center">
                                    <label className="font-[300] text-slate-400">{dataLang?.display} :</label>
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
                        }
                    </div>
                    <div className='min:h-[500px] h-[81%] max:h-[800px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
                        <div className='xl:w-[100%] w-[110%] pr-2'>
                            <div className='flex items-center sticky top-0 bg-white p-2 z-10 shadow-[-20px_-9px_20px_0px_#0000003d]'>
                                <div className='w-[2%] flex justify-center'>
                                    <input type='checkbox' className='scale-125' />
                                </div>
                                <h4 className='w-[8%]'/>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300]'>mã danh mục</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[30%] font-[300]'>tên danh mục</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[30%] font-[300]'>ghi chú</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center'>tác vụ</h4>
                            </div>
                            <div className='divide-y divide-slate-200'>
                                {data.map((e) => <Items onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} key={e.id} data={e}/>)}
                                {(!onFetching && data?.length == 0) && 
                                    <div className=" max-w-[352px] mt-24 mx-auto" >
                                        <div className="text-center">
                                            <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                                            <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
                                            <div className="flex items-center justify-around mt-6 ">
                                                <Popup_NVL onRefresh={_ServerFetching.bind(this)} dataLang={dataLang}className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />    
                                            </div>
                                        </div>
                                    </div>
                                }
                                {onFetching && <Loading/>}
                            </div>
                        </div>
                    </div>
                </div>
                {data?.length != 0 &&
                    <div className='flex space-x-5 items-center'>
                        <h6>Hiển thị {totalItems?.iTotalDisplayRecords} trong số {totalItems?.iTotalRecords} biến thể</h6>
                        <Pagination 
                        postsPerPage={limit}
                        totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                        paginate={paginate}
                        currentPage={router.query?.page || 1}
                        />
                    </div> 
                }
            </div>
        </React.Fragment>
    );
}

const Items = React.memo((props) => {
    const [hasChild, sHasChild] = useState(false);
    const _ToggleHasChild = () => sHasChild(!hasChild);

    const _HandleDelete = (id) => {
        Swal.fire({
          title: `${props.dataLang?.aler_ask}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#296dc1',
          cancelButtonColor: '#d33',
          confirmButtonText: `${props.dataLang?.aler_yes}`,
          cancelButtonText:`${props.dataLang?.aler_cancel}`
        }).then((result) => {
          if (result.isConfirmed) {
            Axios("DELETE", `/api_web/api_material/category/${id}?csrf_protection=true`, {
            }, (err, response) => {
              if(!err){
                var {isSuccess, message} = response.data;
                if(isSuccess){
                  Toast.fire({
                    icon: 'success',
                    title: props.dataLang[message]
                  })     
                }else{
                    Toast.fire({
                        icon: 'error',
                        title: props.dataLang[message]
                    }) 
                }
              }
              props.onRefresh && props.onRefresh()
            })     
        }
        })
    }

    useEffect(() => {
        sHasChild(false)
    }, [props.data?.children?.length == null]);

    return(
        <div key={props.data?.id}>
            <div className='flex py-2 px-2 bg-white hover:bg-slate-50 relative'>
                <div className='w-[2%] flex justify-center'>
                    <input type='checkbox' className='scale-125' />
                </div>
                <div className='w-[8%] flex justify-center'>
                    <button disabled={props.data?.children?.length > 0 ? false : true} onClick={_ToggleHasChild.bind(this)} className={`${hasChild ? "bg-red-600" : "bg-green-600 disabled:bg-slate-300"} hover:opacity-80 hover:disabled:opacity-100 transition relative flex flex-col justify-center items-center h-5 w-5 rounded-full text-white outline-none`}>
                        <IconMinus size={16} />
                        <IconMinus size={16} className={`${hasChild ? "" : "rotate-90"} transition absolute`} />
                    </button>
                </div>
                <h6 className='xl:text-base text-xs px-2 w-[20%]'>{props.data?.code}</h6>
                <h6 className='xl:text-base text-xs px-2 w-[30%]'>{props.data?.name}</h6>
                <h6 dangerouslySetInnerHTML={{__html: props.data?.note}} className='px-2 w-[30%] truncate'/>
                <div className='w-[10%] flex justify-center space-x-2'>
                    <Popup_NVL onRefresh={props.onRefresh} dataLang={props.dataLang} data={props.data} dataOption={props.dataOption} />
                    <button onClick={_HandleDelete.bind(this, props.data?.id)} className="xl:text-base text-xs outline-none"><IconDelete color="red"/></button>
                </div>
            </div>
            {hasChild &&
                <div className='bg-slate-50/50'>
                    {props.data?.children?.map((e) => 
                        <ItemsChild onClick={_HandleDelete.bind(this, e.id)} onRefresh={props.onRefresh} dataLang={props.dataLang} key={e.id} data={e} grandchild="0"
                            children={e?.children?.map((e => 
                                <ItemsChild onClick={_HandleDelete.bind(this, e.id)} onRefresh={props.onRefresh} dataLang={props.dataLang} key={e.id} data={e} grandchild="1" 
                                    children={e?.children?.map((e => 
                                        <ItemsChild onClick={_HandleDelete.bind(this, e.id)} onRefresh={props.onRefresh} dataLang={props.dataLang} key={e.id} data={e} grandchild="2" />
                                    ))}
                                />
                            ))} 
                        />
                    )}
                </div>
            }
        </div>
    )
})

const ItemsChild = React.memo((props) => {
    return(
        <React.Fragment key={props.data?.id}>
            <div className={`flex items-center py-2.5 px-2 hover:bg-slate-100/40 `}>
                {props.grandchild == "2" && 
                    <div className='w-[10%] h-full flex justify-center items-center pl-24'>
                        <IconDown className='rotate-45' />
                    </div>
                }
                {props.grandchild == "1" && 
                    <div className='w-[10%] h-full flex justify-center items-center pl-12'>
                        <IconDown className='rotate-45' />
                        <IconMinus className='mt-1.5' />
                        <IconMinus className='mt-1.5' />
                    </div>
                }
                {props.grandchild == "0" && 
                    <div className='w-[10%] h-full flex justify-center items-center '>
                        <IconDown className='rotate-45' />
                        <IconMinus className='mt-1.5' />
                        <IconMinus className='mt-1.5' />
                        <IconMinus className='mt-1.5' />
                        <IconMinus className='mt-1.5' />
                    </div>
                }
                <h6 className='xl:text-base text-xs px-2 w-[20%]'>{props.data?.code}</h6>
                <h6 className='xl:text-base text-xs px-2 w-[30%] truncate'>{props.data?.name}</h6>
                <h6 dangerouslySetInnerHTML={{__html: props.data?.note}} className='px-2 w-[30%]' />
                <div className='w-[10%] flex justify-center space-x-2'>
                    <Popup_NVL onRefresh={props.onRefresh} dataLang={props.dataLang} data={props.data} />
                    <button onClick={props.onClick} className="xl:text-base text-xs"><IconDelete color="red"/></button>
                </div>
            </div>
            {props.children}
        </React.Fragment>
    )
})

const BtnTacVu = React.memo((props) => {
    return(
        <div>
            <Popup
                trigger={
                    <button className={`flex space-x-1 items-center ` + props.className } >
                        <span>Tác vụ</span>
                        <IconDown size={15} />
                    </button>
                }
                closeOnDocumentClick
                arrow={false}
                position="bottom right"
                className={`dropdown-edit `}
            >
                <div className="w-auto">
                    <div className="bg-white p-0.5 rounded-t w-52">
                        <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Export Excel</button>
                        <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Import Excel</button>
                        <button className='text-sm hover:bg-slate-100 text-left w-full px-5 rounded py-2.5'>Xóa</button>
                    </div>
                </div>
            </Popup>
        </div>
    )
})

const Popup_NVL = React.memo((props) => {
    const option_NhomNVL = useSelector(state => state.option_NhomNVL);

    const [dataOption, sDataOption] = useState([]);
    const [dataOptCheck, sDataOptCheck] = useState([]);

    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const [onSending, sOnSending] = useState(false);
    const [code, sCode] = useState("");
    const [name, sName] = useState("");
    const [editorValue, sEditorValue] = useState("");

    const [errCode, sErrCode] = useState(false);
    const [errName, sErrName] = useState(false);
    const [loadingEditor, sLoadingEditor] = useState(false);
    const [checkData, sCheckData] = useState(false);

    useEffect(() => {
        sCode(props.data?.code ? props.data?.code : "" )
        sName(props.data?.name ? props.data?.name : "" )
        sEditorValue(props.data?.note ? props.data?.note : "" )
        sIdCategory(props.data?.parent_id ? props.data?.parent_id : null )
        open && sErrCode(false);
        open && sErrName(false);
        open && sLoadingEditor(true)
        open && sDataOption(option_NhomNVL != null && [...option_NhomNVL?.map(x => ({label: `${x.name + " " + "(" + x.code + ")"}`, value: x.id, level: x.level, code: x.code, parent_id: x.parent_id}))])
        setTimeout(() => {
            sLoadingEditor(false)
        }, 1000);
        sCheckData(true)
        // dataOption != null && sDataOption(dataOption.filter(x => x.value !== props.data?.id))
    }, [open]);

    useEffect(() => {
        checkData && sDataOption(dataOption.filter(x =>  x.parent_id !== props.data?.id && x.value !== props.data?.id))
        sCheckData(false)
    }, [checkData]);
    // console.log("data", props.data)

    // console.log("dataOption", dataOption)
    // console.log("check", dataOptCheck)

    const _HandleChangeInput = (type, value) => {
        if(type == "name"){
            sName(value.target?.value)
        }else if(type == "code"){
            sCode(value.target?.value)
        }else if(type == "editor"){
            sEditorValue(value)
        }
    }

    const _ServerSending = () => {
        var formData = new FormData()

        formData.append("code", code)
        formData.append("name", name)
        formData.append("note", editorValue)
        formData.append("parent_id", idCategory ? idCategory : null)

        Axios("POST", `${props.data?.id ? `/api_web/api_material/category/${props.data?.id}?csrf_protection=true` : "/api_web/api_material/category?csrf_protection=true"}`, {
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'}
        }, (err, response) => {
            if(!err){
                var {isSuccess, message} = response.data;
                if(isSuccess){
                    Toast.fire({
                        icon: 'success',
                        title: `${props.dataLang[message]}`
                    })
                    sName("")
                    sCode("")
                    sEditorValue("")
                    sIdCategory([])
                    props.onRefresh && props.onRefresh()
                    sOpen(false)
                }else{
                    Toast.fire({
                        icon: 'error',
                        title: `${props.dataLang[message]}`
                    })
                }
                sOnSending(false)
            }
        })
    }

    useEffect(() => {
        onSending && _ServerSending()
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        if(name?.length == 0 || code?.length == 0){
            name?.length == 0 && sErrName(true)
            code?.length == 0 && sErrCode(true)
            Toast.fire({
                icon: 'error',
                title: `${props.dataLang?.required_field_null}`
            })
        }else {
            sOnSending(true)
        }
    }

    useEffect(() => {
        sErrName(false)
    }, [name?.length > 0]);

    useEffect(() => {
        sErrCode(false)
    }, [code?.length > 0]);

    const [idCategory, sIdCategory] = useState(null);
    const valueIdCategory = (e) => sIdCategory(e?.value)

    return(
        <PopupEdit  
            title={props.data?.id ? `Chỉnh sửa` : `Tạo mới`} 
            button={props.data?.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
            onClickOpen={_ToggleModal.bind(this, true)} 
            open={open} 
            onClose={_ToggleModal.bind(this,false)}
            classNameBtn={props.className}
        >
            <div className='py-4 w-[600px] space-y-5'>
                <div className='space-y-1'>
                    <label className="text-[#344054] font-normal text-base">Mã danh mục <span className='text-red-500'>*</span></label>
                    <input value={code} onChange={_HandleChangeInput.bind(this, "code")} type="text" placeholder='Nhập mã danh mục' className={`${errCode ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                    {errCode && <label className="text-sm text-red-500">Vui lòng nhập mã danh mục</label>}
                </div>
                <div className='space-y-1'>
                    <label className="text-[#344054] font-normal text-base">Tên danh mục <span className='text-red-500'>*</span></label>
                    <input value={name} onChange={_HandleChangeInput.bind(this, "name")} type="text" placeholder='Nhập tên danh mục' className={`${errName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                    {errName && <label className="text-sm text-red-500">Vui lòng nhập tên danh mục</label>}
                </div>
                <div className='space-y-1'>
                    <label className="text-[#344054] font-normal text-base">Nhóm cha</label>
                    {/* <Select 
                        options={dataMaChungTu} 
                        value={idCategory}
                        onChange={valueIdCategory.bind(this)}
                        placeholder="Nhóm cha" 
                        className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none z-10" 
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
                    /> */}
                    <Select 
                        options={dataOption}
                        formatOptionLabel={CustomSelectOption}
                        defaultValue={(idCategory == "0" || !idCategory) ? {label: "Nhóm cha", code: "nhóm cha"} : {label: dataOption.find(x => x?.parent_id == idCategory)?.label, code:dataOption.find(x => x?.parent_id == idCategory)?.code, value: idCategory}}
                        value={(idCategory == "0" || !idCategory) ? {label: "Nhóm cha", code: "nhóm cha"} : {label: dataOption.find(x => x?.value == idCategory)?.label, code:dataOption.find(x => x?.value == idCategory)?.code, value: idCategory}}
                        onChange={valueIdCategory.bind(this)}
                        isClearable={true}
                        placeholder="Nhóm cha" 
                        className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none z-10" 
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
                <div className='space-y-1'>
                    <label className="text-[#344054] font-normal text-base">Ghi chú</label>
                    {loadingEditor ? 
                        <div className='h-[250px] bg-slate-50 rounded w-full animate-pulse' />
                        : 
                        <Editor
                            apiKey='0l9ca7pyz0qyliy0v9mmkfl2cz69uodvc8l6md8o4cnf6rnc'
                            // onInit={(evt, editor) => editorRef.current = editor}
                            value={editorValue}
                            onEditorChange={_HandleChangeInput.bind(this, "editor")}
                            init={{
                                height: 250,
                                menubar: false,
                                // plugins: [
                                //     'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                //     'searchreplace', 'visualblocks', 'code',
                                //     'media', 'table', 'code'
                                // ],
                                toolbar: 'undo redo | ' +
                                    'bold italic underline |' +
                                    'removeformat | help',
                                // inline_styles: true,
                                // verify_html: false,
                                // fix_list_elements: true,
                                // extended_valid_elements: '*[*]',
                                // forced_root_block: false
                            }}
                        />
                    }
                </div>
                <div className='flex justify-end space-x-2'>
                    <button onClick={_ToggleModal.bind(this,false)} className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition">{props.dataLang?.branch_popup_exit}</button>
                    <button onClick={_HandleSubmit.bind(this)} className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#0F4F9E] hover:opacity-90 hover:scale-105 transition">{props.dataLang?.branch_popup_save}</button>
                </div>
            </div>
        </PopupEdit>
    )
})

// const Popup_NVL = React.memo((props) => {
//     console.log("render")
//     return(
//         <div></div>
//     )
// })

const EditorForm = React.memo(() => {
    const editorRef = useRef(null);
    
    const log = () => {
        if (editorRef.current) {
        console.log(editorRef.current.getContent());
        }
    };
    return(
        <>
            <Editor
                apiKey='0l9ca7pyz0qyliy0v9mmkfl2cz69uodvc8l6md8o4cnf6rnc'
                // apiKey='nssrs338lqa6e6i3l75tb9xs4d8aqerp74if4rqgvopo74pe'
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue="<p>This is the initial content of the editor.</p>"
                init={{
                    height: 500,
                    menubar: true,
                    // plugins: [
                    //     'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    //     'searchreplace', 'visualblocks', 'code',
                    //     'media', 'table', 'code'
                    // ],
                    toolbar: 'undo redo | ' +
                        'fontfamily fontsize bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    // content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
            <button onClick={log}>Log editor content</button>
            <p dangerouslySetInnerHTML={{__html: editorRef.current.getContent()}} className="w-full" />
        </>
    )
})

export default Index;