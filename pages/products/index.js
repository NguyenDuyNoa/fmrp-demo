import React, {useState, useEffect, useRef} from 'react';
import Head from 'next/head';
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';

import {_ServerInstance as Axios} from '/services/axios';
import PopupEdit from "/components/UI/popup";
import Pagination from '/components/UI/pagination';
import Loading from "components/UI/loading";

import { 
    SearchNormal1 as IconSearch, Trash as IconDelete, Edit as IconEdit, UserEdit as IconUserEdit,
    Grid6 as IconExcel, Image as IconImage, GalleryEdit as IconEditImg
} from "iconsax-react";
import { NumericFormat } from 'react-number-format';
import Select, { components } from 'react-select';
import Swal from "sweetalert2";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});
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

const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        router.push({
            pathname: `${router.pathname}`,    
            query: { tab: router.query?.tab ? router.query?.tab : "all"  }
        })
    }, []);

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: `${router.pathname}`,    
            query: { tab: e }
        })
    }

    const [data, sData] = useState([]);
    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingAnother, sOnFetchingAnother] = useState(false);
    //Bộ lọc Chi nhánh
    const [dataBranchOption, sDataBranchOption] = useState([]);
    const [idBranch, sIdBranch] = useState(null);

    const _ServerFetchingAnother = () => {
        Axios("GET", "/api_web/Api_Branch/branch/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                sDataBranchOption(rResult.map(e => ({label: e.name, value: e.id})))
                dispatch({type: "branch/update", payload: rResult.map(e => ({label: e.name, value: e.id}))})
            }
        })
    }

    useEffect(() => {
        onFetchingAnother && _ServerFetchingAnother()
    }, [onFetchingAnother]);
    
    useEffect(() => {
        sOnFetchingAnother(true)
    }, []);

    const _HandleFilterOpt = (type, value) => {
        if(type == "category"){
            sIdCategory(value)
        }else if(type == "branch"){
            sIdBranch(value)
        }
    }

    //Set data cho bộ lọc chi nhánh
    const hiddenOptions = idBranch?.length > 2 ? idBranch?.slice(0, 2) : [];
    const options = dataBranchOption.filter((x) => !hiddenOptions.includes(x.value));

    return (
        <React.Fragment>
            <Head>
                <title>Danh sách thành phẩm</title>
            </Head>
            <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between'>
                <div className='h-[97%] space-y-3 overflow-hidden'>
                    <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                        <h6 className='text-[#141522]/40'>{dataLang?.list_btn_seting_category}</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 className='text-[#141522]/40'>{dataLang?.header_category_material}</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6>Danh sách thành phẩm</h6>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h2 className='xl:text-3xl text-xl font-medium '>Danh Sách Thành Phẩm</h2>
                        <div className='flex space-x-3 items-center'>
                            <Popup_ThanhPham dataLang={dataLang} className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105 outline-none' />
                        </div>
                    </div>
                    <div className='grid grid-cols-4 gap-8 px-0.5'>
                        <div className=''>
                            <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.category_material_group_name || "category_material_group_name"}</h6>
                            {/* <Select 
                                options={dataPositionOption}
                                formatOptionLabel={CustomSelectOption}
                                onChange={_HandleFilterOpt.bind(this, "position")}
                                value={idPosition}
                                noOptionsMessage={() => `${dataLang?.no_data_found}`}
                                isClearable={true}
                                placeholder={dataLang?.category_material_group_name || "category_material_group_name"}
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
                            /> */}
                        </div>
                        <div>
                            <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>Thành phẩm</h6>
                            {/* <Select 
                                options={options}
                                onChange={_HandleFilterOpt.bind(this, "branch")}
                                value={idBranch}
                                noOptionsMessage={() => `${dataLang?.no_data_found}`}
                                isClearable={true}
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                placeholder={dataLang?.client_list_brand || "client_list_brand"}
                                className="rounded-md py-0.5 bg-white border-none xl:text-base text-[14.5px] z-20" 
                                isSearchable={true}
                                components={{ MultiValue }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: '#EBF5FF',
                                        primary50: '#92BFF7',
                                        primary: '#92BFF7',
                                    },
                                })}
                                styles={{
                                    placeholder: (base) => ({
                                    ...base,
                                    color: "#cbd5e1",
                                    }),
                                }}
                            /> */}
                        </div>
                        <div className=''>
                            <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.client_list_brand || "client_list_brand"}</h6>
                            <Select 
                                options={options}
                                onChange={_HandleFilterOpt.bind(this, "branch")}
                                value={idBranch}
                                isClearable={true}
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                placeholder={dataLang?.client_list_brand || "client_list_brand"}
                                className="rounded-md py-0.5 bg-white border-none xl:text-base text-[14.5px] z-20" 
                                isSearchable={true}
                                components={{ MultiValue }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: '#EBF5FF',
                                        primary50: '#92BFF7',
                                        primary: '#92BFF7',
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
                    <div className='flex items-center space-x-4 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
                        <button onClick={_HandleSelectTab.bind(this, "all")} className={`${router.query?.tab === "all" ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "} 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}>Tất cả</button>
                        <button onClick={_HandleSelectTab.bind(this, "finishedProduct")} className={`${router.query?.tab === "finishedProduct" ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "} 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}>Thành phẩm</button>
                        <button onClick={_HandleSelectTab.bind(this, "semiFinishedProductSX")} className={`${router.query?.tab === "semiFinishedProductSX" ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "} 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}>Bán thành phẩm (SX)</button>
                        <button onClick={_HandleSelectTab.bind(this, "semiFinishedProductMN")} className={`${router.query?.tab === "semiFinishedProductMN" ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "} 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}>Bán thành phẩm (MN)</button>
                    </div>
                    <div className='bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2'>
                        <form className="flex items-center relative">
                            <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                            <input
                                className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md w-[400px]"
                                type="text"  
                                // onChange={_HandleOnChangeKeySearch.bind(this)} 
                                placeholder={dataLang?.branch_search}
                            />
                        </form>
                        {data.length != 0 &&
                            <div className='flex space-x-6'>
                                {/* <ExcelFile filename={dataLang?.header_category_finishedProduct_group || "header_category_finishedProduct_group"} element={
                                    <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition'>
                                        <IconExcel size={18} />
                                        <span>{dataLang?.client_list_exportexcel}</span>
                                    </button>
                                }>
                                    <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name={dataLang?.header_category_finishedProduct_group || "header_category_finishedProduct_group"} />
                                </ExcelFile> */}

                                <div className="flex space-x-2 items-center">
                                    <label className="font-[300] text-slate-400">{dataLang?.display} :</label>
                                    {/* <select className="outline-none" onChange={(e) => sLimit(e.target.value)} value={limit}>
                                        <option disabled className="hidden">{limit == -1 ? "Tất cả": limit}</option>
                                        <option value={15}>15</option>
                                        <option value={20}>20</option>
                                        <option value={40}>40</option>
                                        <option value={60}>60</option>
                                        <option value={-1}>Tất cả</option>
                                    </select> */}
                                </div>
                            </div>
                        }
                    </div>
                    <div className='min:h-[500px] h-[81%] max:h-[800px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
                        <div className='pr-2'>
                            <div className='flex items-center sticky top-0 bg-white p-2 z-10 shadow-[-20px_-9px_20px_0px_#0000003d]'>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[5%] font-[300] text-center'>{dataLang?.image || "image"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[7%] font-[300]'>Danh mục</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300]'>Mã thành phẩm</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300]'>Tên thành phẩm</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300]'>Loại thành phẩm</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[5%] font-[300]'>{dataLang?.unit || "unit"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[6%] font-[300] text-center'>{dataLang?.category_material_list_variant || "category_material_list_variant"}</h4>
                                <h4 className='2xl:text-[13px] xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[6%] font-[300] text-center'>{dataLang?.stock || "stock"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[9%] font-[300]'>Định mức BOM</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300]'>Phiên bản - Công đoạn</h4>
                                <h4 className='2xl:text-[13px] xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[7%] font-[300]'>{dataLang?.note || "note"}</h4>
                                <h4 className='2xl:text-[13px] xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[8%] font-[300]'>{dataLang?.client_list_brand || "client_list_brand"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[7%] font-[300] text-center'>{dataLang?.branch_popup_properties || "branch_popup_properties"}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const Popup_ThanhPham = React.memo((props) => {
    const dataOptBranch = useSelector(state => state.branch);

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const [tab, sTab] = useState(0)
    const _HandleSelectTab = (e) => sTab(e)

    const [onFetching, sOnFetching] = useState(false);

    const [name, sName] = useState("");
    const [code, sCode] = useState("");
    const [price, sPrice] = useState();
    const [minimumAmount, sMinimumAmount] = useState();
    const [note, sNote] = useState("");

    const [thumb, sThumb] = useState(null);
    const [thumbFile, sThumbFile] = useState(null);
    const [isDeleteThumb, sIsDeleteThumb] = useState(false);

    const [branch, sBranch] = useState([]);
    const branch_id = branch.map(e => e.value)

    const [errGroup, sErrGroup] = useState(false);
    const [errName, sErrName] = useState(false);
    const [errCode, sErrCode] = useState(false);
    const [errUnit, sErrUnit] = useState(false);
    const [errBranch, sErrBranch] = useState(false);
    const [errType, sErrType] = useState(false);

    useEffect(() => {
        open && sName("")
        open && sCode("")
        open && sNote("")
        open && sPrice()
        open && sMinimumAmount()
        open && sThumb(null)
        open && sThumbFile(null)
        open && sBranch([])
    }, [open]);

    const _HandleChangeInput = (type, value) => {
        if(type === "code"){
            sCode(value?.target.value)
        }else if(type === "name"){
            sName(value?.target.value)
        }else if(type == "price") {
            sPrice(Number(value.value))
        }else if(type == "minimumAmount") {
            sMinimumAmount(Number(value.value))
        }else if(type == "note") {
            sNote(value.target?.value)
        }else if(type == "branch") {
            sBranch(value)
        }
    }

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

    return(
        <PopupEdit  
            title={props?.id ? `Sửa thành phẩm` : `Tạo mới thành phẩm`} 
            button={props?.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
            onClickOpen={_ToggleModal.bind(this, true)} 
            open={open} 
            onClose={_ToggleModal.bind(this,false)}
            classNameBtn={props.className}
        >
            <div className='py-4 w-[800px] 2xl:space-y-5 space-y-4'>
                <div className='flex items-center space-x-4 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
                    <button onClick={_HandleSelectTab.bind(this, 0)} className={`${tab === 0 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "} 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}>{props.dataLang?.information || "information"}</button>
                    {/* <button onClick={_HandleSelectTab.bind(this, 1)} className={`${tab === 1 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "} 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}>{props.dataLang?.category_material_list_variant || "category_material_list_variant"}</button> */}
                </div>
                <ScrollArea className="max-h-[600px]" speed={1} smoothScrolling={true} ref={scrollAreaRef}>
                    {onFetching ? 
                        <Loading className="h-80"color="#0f4f9e" />
                        :
                        <React.Fragment>
                            {tab === 0 &&
                                <div className='grid grid-cols-2 gap-5'>
                                    <div className='2xl:space-y-3 space-y-2'>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">{props.dataLang?.client_list_brand || "client_list_brand"} <span className='text-red-500'>*</span></label>
                                            <Select 
                                                options={dataOptBranch}
                                                value={branch}
                                                onChange={_HandleChangeInput.bind(this, "branch")}
                                                isClearable={true}
                                                placeholder={props.dataLang?.client_list_brand || "client_list_brand"}
                                                isMulti
                                                noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                closeMenuOnSelect={false}
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                className={`${errBranch ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                            />
                                            {errBranch && <label className="text-sm text-red-500">{props.dataLang?.client_list_bran || "client_list_bran"}</label>}
                                        </div>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">Danh mục <span className='text-red-500'>*</span></label>
                                            {/* <Select 
                                                options={dataOptGr}
                                                formatOptionLabel={CustomSelectOption_GroupNVL}
                                                value={groupId ? {label: dataOptGr?.find(x => x?.value == groupId)?.label, value: groupId} : null}
                                                onChange={_HandleChangeInput.bind(this, "group")}
                                                isClearable={true}
                                                noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                placeholder={props.dataLang?.header_category_material_group}
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                className={`${errGroup ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                            /> */}
                                            {errGroup && <label className="text-sm text-red-500">Vui lòng chọn danh mục</label>}
                                        </div>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">Loại thành phẩm <span className='text-red-500'>*</span></label>
                                            {errType && <label className="text-sm text-red-500">Vui lòng chọn loại thành phẩm</label>}
                                        </div>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">Mã thành phẩm <span className='text-red-500'>*</span></label>
                                            <input value={code} onChange={_HandleChangeInput.bind(this, "code")} type="text" placeholder="Mã thành phẩm" className={`${errCode ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                                            {errCode && <label className="text-sm text-red-500">Vui lòng nhập mã thành phẩm</label>}
                                        </div>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">Tên thành phẩm <span className='text-red-500'>*</span></label>
                                            <input value={name} onChange={_HandleChangeInput.bind(this, "name")} type="text" placeholder="Tên thành phẩm" className={`${errName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                                            {errName && <label className="text-sm text-red-500">Vui lòng nhập tên thành phẩm</label>}
                                        </div>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">Giá bán <span className='text-red-500'>*</span></label>
                                            <NumericFormat thousandSeparator="," value={price} onValueChange={_HandleChangeInput.bind(this, "price")} placeholder="Giá bán" className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} />
                                        </div>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">{props.dataLang?.minimum_amount || "minimum_amount"}</label>
                                            <NumericFormat thousandSeparator="," value={minimumAmount} onValueChange={_HandleChangeInput.bind(this, "minimumAmount")} placeholder={props.dataLang?.minimum_amount || "minimum_amount"} className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} />
                                        </div>
                                    </div>
                                    <div className='2xl:space-y-3 space-y-2'>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">Đơn vị <span className='text-red-500'>*</span></label>
                                            {/* <Select 
                                                options={dataOptGr}
                                                formatOptionLabel={CustomSelectOption_GroupNVL}
                                                value={groupId ? {label: dataOptGr?.find(x => x?.value == groupId)?.label, value: groupId} : null}
                                                onChange={_HandleChangeInput.bind(this, "group")}
                                                isClearable={true}
                                                noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                placeholder={props.dataLang?.header_category_material_group}
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                className={`${errGroup ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                            /> */}
                                            {errUnit && <label className="text-sm text-red-500">Vui lòng chọn đơn vị</label>}
                                        </div>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">{props.dataLang?.avatar || "avatar"}</label>
                                            <div className='flex justify-center'>
                                                <div className='relative h-36 w-36 rounded bg-slate-200'>
                                                    {thumb && <Image width={120} height={120} quality={100} src={typeof(thumb)==="string" ? thumb : URL.createObjectURL(thumb)} alt="thumb type" className="w-36 h-36 rounded object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/>}
                                                    {!thumb && <div className='h-full w-full flex flex-col justify-center items-center'><IconImage /></div>}
                                                    <div className='absolute bottom-0 -right-12 flex flex-col space-y-2'>
                                                        <input onChange={_HandleChangeFileThumb.bind(this)} type="file" id={`upload`} accept="image/png, image/jpeg" hidden />
                                                        <label htmlFor={`upload`} title='Sửa hình' className='cursor-pointer w-8 h-8 rounded-full bg-slate-100 flex flex-col justify-center items-center'><IconEditImg size="17" /></label>
                                                        <button disabled={!thumb ? true : false} onClick={_DeleteThumb.bind(this)} title='Xóa hình' className='w-8 h-8 rounded-full bg-red-500 disabled:opacity-30 flex flex-col justify-center items-center text-white'><IconDelete size="17" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">Ghi chú</label>
                                            <textarea 
                                                value={note}
                                                type="text"
                                                placeholder={props.dataLang?.note || "note"}
                                                rows={5}
                                                onChange={_HandleChangeInput.bind(this, "note")}
                                                className='focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none resize-none'
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                        </React.Fragment>
                    }
                </ScrollArea>
                <div className='flex justify-end space-x-2'>
                    <button onClick={_ToggleModal.bind(this,false)} className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition">{props.dataLang?.branch_popup_exit}</button>
                    <button className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#0F4F9E] hover:opacity-90 hover:scale-105 transition">{props.dataLang?.branch_popup_save}</button>
                </div>
            </div>
        </PopupEdit>
    )
})

export default Index;
