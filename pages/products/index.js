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

import Popup from 'reactjs-popup';
import { 
    SearchNormal1 as IconSearch, Trash as IconDelete, UserEdit as IconUserEdit,
    Grid6 as IconExcel, Image as IconImage, GalleryEdit as IconEditImg, ArrowDown2 as IconDown,
    Add as IconAdd, Maximize4 as IconMax, CloseCircle as IconClose, TickCircle as IconTick
} from "iconsax-react";
import { NumericFormat } from 'react-number-format';
import Select, { components } from 'react-select';
import Swal from "sweetalert2";
import ModalImage from "react-modal-image";
import {SortableContainer, SortableElement, sortableHandle} from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';
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

const CustomSelectOption = ({value, label, level, code}) => (
    <div className='flex space-x-2 truncate'>
        {level == 1 && <span>--</span>}
        {level == 2 && <span>----</span>}
        {level == 3 && <span>------</span>}
        {level == 4 && <span>--------</span>}
        <span className="2xl:max-w-[300px] max-w-[150px] w-fit truncate">{label}</span>
    </div>
)

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

    const [openDetail, sOpenDetail] = useState(false);

    const [data, sData] = useState([]);
    const [dataExcel, sDataExcel] = useState([]);
    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingAnother, sOnFetchingAnother] = useState(false);
    //Bộ lọc Chi nhánh
    const [dataBranchOption, sDataBranchOption] = useState([]);
    const [idBranch, sIdBranch] = useState(null);
    //Bộ lọc Danh mục
    const [dataCategory, sDataCategory] = useState([]);
    const [valueCategory, sValueCategory] = useState(null);
    //Bộ lọc Thành phẩm
    const [dataFinishedPro, sDataFinishedPro] = useState([]);
    const [valueFinishedPro, sValueFinishedPro] = useState(null);

    const [dataProductExpiry, sDataProductExpiry] = useState({});

    const [totalItems, sTotalItems] = useState({});
    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);

    const _ServerFetching = () => {
        Axios("GET", "/api_web/api_product/product/?csrf_protection=true", {
            params: {
                search: keySearch,
                limit: limit,
                page: router.query?.page || 1,
                "filter[branch_id][]": idBranch?.length > 0 ? idBranch.map(e => e.value) : null,
                "filter[type_products]": router.query?.tab === "all" ? 0 : router.query?.tab
            }
        }, (err, response) => {
            if(!err){
                var {output, rResult} = response.data;
                sData(rResult)
                sTotalItems(output)
            }
            sOnFetching(false)
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true) || (keySearch && sOnFetching(true)) || (idBranch?.length > 0 && sOnFetching(true))
    }, [limit,router.query?.page, idBranch, router.query?.tab]);

    const paginate = pageNumber => {
        router.push({
            pathname: router.route,
            query: { page: pageNumber }
        })
    }

    const _HandleOnChangeKeySearch = ({target: {value}}) => {
        sKeySearch(value)
        router.replace(router.route)
        setTimeout(() => {
            if(!value){
              sOnFetching(true)
            }
            sOnFetching(true)
        }, 1500);
    };

    const _ServerFetchingAnother = () => {
        Axios("GET", "/api_web/Api_Branch/branch/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                sDataBranchOption(rResult.map(e => ({label: e.name, value: e.id})))
                dispatch({type: "branch/update", payload: rResult.map(e => ({label: e.name, value: e.id}))})
            }
        })
        Axios("GET", "/api_web/api_product/productType/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var data = response.data;
                dispatch({type: "type_finishedProduct/update", payload: data.map(e => ({label: dataLang[e.name], value: e.code}))})
            }
        })
        Axios("GET", "/api_web/Api_unit/unit/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                dispatch({type: "unit_finishedProduct/update", payload: rResult.map(e => ({label: e.unit, value: e.id}))})
            }
        })
        Axios("GET", "/api_web/Api_variation/variation?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                dispatch({type: "variant_NVL/update", payload: rResult.map(e => ({label: e.name, value: e.id, option: e.option}))})
            }
        })
        Axios("GET", "api_web/api_product/categoryOption/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                sDataCategory(rResult.map(e => ({label: `${e.name + " " + "(" + e.code + ")"}`, value: e.id, level: e.level, code: e.code, parent_id: e.parent_id})))
            }
        })
        Axios("GET", "/api_web/api_product/product/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                sDataFinishedPro(rResult.map(e => ({label: `${e.code} (${e.name})`, value: e.id})))
                sDataExcel(rResult)
            }
        })
        Axios("GET", `/api_web/api_product/stage/?csrf_protection=true`, {}, (err, response) => {
            if(!err){
                var {rResult} =  response.data
                dispatch({type: "congdoan_finishedProduct/update", payload: rResult?.map(e => ({label: e.name, value: e.id}))})
            }
        })
        Axios("GET", "/api_web/api_setting/feature/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var data = response.data;
                sDataProductExpiry(data.find(x => x.code == "product_expiry"));
            }
        })
        sOnFetchingAnother(false)
    }

    useEffect(() => {
        onFetchingAnother && _ServerFetchingAnother()
    }, [onFetchingAnother]);
    
    useEffect(() => {
        sOnFetchingAnother(true)
    }, []);

    const _HandleFilterOpt = (type, value) => {
        if(type == "category"){
            sValueCategory(value)
        }else if(type == "branch"){
            sIdBranch(value)
        }else if(type == "finishedPro"){
            sValueFinishedPro(value)
        }
    }

    //Set data cho bộ lọc chi nhánh
    const hiddenOptions = idBranch?.length > 2 ? idBranch?.slice(0, 2) : [];
    const options = dataBranchOption.filter((x) => !hiddenOptions.includes(x.value));

    //excel
    const multiDataSet = [
        {
            columns: [
                {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `Danh mục `, width: {wpx: 100}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `Mã thành phẩm`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `Tên thành phẩm`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `Loại thành phẩm`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `Đơn vị`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `Biến thể`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `Tồn kho`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `Ghi chú`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `Chi nhánh`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            ],
            data: dataExcel?.map((e) =>
                [
                    {value: `${e.id}`, style: {numFmt: "0"}},
                    {value: `${e.category_name ? e.category_name : ""}`},
                    {value: `${e.code ? e.code : ""}`},
                    {value: `${e.name ? e.name : ""}`},
                    {value: `${e?.type_products?.name ? e?.type_products?.name : ""}`},
                    {value: `${e.unit ? e.unit :""}`},
                    {value: `${e.variation ? e.variation?.length : 0}`},
                    {value: `${e.stock_quantity ? Number(e?.stock_quantity).toLocaleString() : ""}`},
                    {value: `${e.note ? e.note : ""}`},
                    {value: `${e.branch ? e.branch?.map(i => i.name)  : ""}`},
                ]    
            ),
        }
    ];

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
                            <Popup_ThanhPham onRefresh={_ServerFetching.bind(this)} dataProductExpiry={dataProductExpiry} dataLang={dataLang} setOpen={sOpenDetail} isOpen={openDetail} className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105 outline-none' />
                        </div>
                    </div>
                    <div className='flex items-center space-x-4 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
                        <button onClick={_HandleSelectTab.bind(this, "all")} className={`${router.query?.tab === "all" ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "} 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}>Tất cả</button>
                        <button onClick={_HandleSelectTab.bind(this, "products")} className={`${router.query?.tab === "products" ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "} 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}>Thành phẩm</button>
                        <button onClick={_HandleSelectTab.bind(this, "semi_products")} className={`${router.query?.tab === "semi_products" ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "} 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}>Bán thành phẩm (SX)</button>
                        <button onClick={_HandleSelectTab.bind(this, "semi_products_outside")} className={`${router.query?.tab === "semi_products_outside" ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "} 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}>Bán thành phẩm (MN)</button>
                    </div>
                    <div className='bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2'>
                        <div className='flex gap-2'>
                            <form className="flex items-center relative">
                                <IconSearch size={20} className="absolute left-3 z-10 text-[#cccccc]" />
                                <input
                                    className=" relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 py-2 rounded-md 2xl:w-[400px] w-[250px]"
                                    type="text"  
                                    onChange={_HandleOnChangeKeySearch.bind(this)} 
                                    placeholder={dataLang?.branch_search}
                                />
                            </form>
                            <div className='w-[17vw]'>
                                <Select 
                                    options={[{ value: '', label: 'Chọn chi nhánh', isDisabled: true }, ...options]}
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
                            <div className='w-[17vw]'>
                                <Select 
                                    options={[{ value: '', label: 'Chọn tên danh mục', isDisabled: true }, ...dataCategory]}
                                    formatOptionLabel={CustomSelectOption}
                                    onChange={_HandleFilterOpt.bind(this, "category")}
                                    value={valueCategory}
                                    noOptionsMessage={() => `${dataLang?.no_data_found}`}
                                    isClearable={true}
                                    placeholder={dataLang?.category_material_group_name || "category_material_group_name"}
                                    className="rounded-md py-0.5 bg-white border-none xl:text-base text-[14.5px] z-20" 
                                    isSearchable={true}
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
                            <div className='w-[17vw]'>
                                <Select 
                                    options={[{ value: '', label: 'Chọn thành phẩm', isDisabled: true }, ...dataFinishedPro]}
                                    onChange={_HandleFilterOpt.bind(this, "finishedPro")}
                                    value={valueFinishedPro}
                                    noOptionsMessage={() => `${dataLang?.no_data_found}`}
                                    isClearable={true}
                                    isMulti
                                    closeMenuOnSelect={false}
                                    hideSelectedOptions={false}
                                    placeholder={"Thành phẩm"}
                                    className="rounded-md py-0.5 bg-white border-none xl:text-base text-[14.5px] z-20" 
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
                        {data.length != 0 &&
                            <div className='flex space-x-6'>
                                <ExcelFile filename="Thành phẩm" element={
                                    <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition'>
                                        <IconExcel size={18} />
                                        <span>{dataLang?.client_list_exportexcel}</span>
                                    </button>
                                }>
                                    <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name="Thành phẩm" />
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
                    <div className='min:h-[500px] 2xl:h-[76%] h-[70%] max:h-[800px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 tooltipBoundary'>
                        <div className='pr-2'>
                            <div className='flex items-center sticky top-0 bg-white p-2 z-10 shadow-[-20px_-9px_20px_0px_#0000003d]'>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[5%] font-[300] text-center'>{dataLang?.image || "image"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[7%] font-[300]'>Danh mục</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300]'>Mã thành phẩm</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300]'>Tên thành phẩm</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300]'>Loại thành phẩm</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[5%] font-[300] text-center'>{dataLang?.unit || "unit"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[6%] font-[300] text-center'>{dataLang?.category_material_list_variant || "category_material_list_variant"}</h4>
                                <h4 className='2xl:text-[13px] xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[6%] font-[300] text-center'>{dataLang?.stock || "stock"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[9%] font-[300]'>Định mức BOM</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300]'>Phiên bản - Công đoạn</h4>
                                <h4 className='2xl:text-[13px] xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[7%] font-[300]'>{dataLang?.note || "note"}</h4>
                                <h4 className='2xl:text-[13px] xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[8%] font-[300]'>{dataLang?.client_list_brand || "client_list_brand"}</h4>
                                <h4 className='xl:text-[13px] text-[12px] px-2 text-[#667085] uppercase w-[7%] font-[300] text-center'>{dataLang?.branch_popup_properties || "branch_popup_properties"}</h4>
                            </div>
                            {onFetching ?
                                <Loading className="h-80"color="#0f4f9e" />
                                :
                                <React.Fragment>
                                    {data.length == 0 &&
                                        <div className=" max-w-[352px] mt-24 mx-auto" >
                                            <div className="text-center">
                                                <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                                                <h1 className="textx-[#141522] text-base opacity-90 font-medium">{dataLang?.no_data_found || "no_data_found"}</h1>
                                            </div>
                                        </div>
                                    }
                                    <div className="divide-y divide-slate-200"> 
                                        {data.map((e) => 
                                            <div key={e?.id.toString()} className='flex p-2 hover:bg-slate-50 relative'>
                                                <div className='w-[5%]  justify-center flex self-center'>
                                                    {e?.images == null ?
                                                        // <img src="/no_image.png" className='w-full h-12 rounded object-contain' />
                                                        <ModalImage small="/no_image.png" large="/no_image.png" className="w-full h-12 rounded object-cover"/> 
                                                    :
                                                        // <Image width={64} height={64} quality={100} src={e?.images} alt="thumb type" className="w-auto h-12 rounded object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/>
                                                        <ModalImage small={e?.images} large={e?.images} className="w-full h-12 rounded object-contain"/> 
                                                    }
                                                </div>
                                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs w-[7%]'>{e?.category_name}</h6>
                                                <div className='px-2 py-2.5 xl:text-[14px] text-xs w-[10%]'>
                                                    <Popup_ThongTin id={e?.id} dataProductExpiry={dataProductExpiry} dataLang={dataLang} >
                                                        <button className=' text-[#0F4F9E] hover:opacity-70 w-fit outline-none'>{e?.code}</button>
                                                    </Popup_ThongTin>
                                                </div>
                                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs w-[10%]'>{e?.name}</h6>
                                                <h6 className='px-2 py-2.5 xl:text-[13px] text-xs w-[10%]'>
                                                    <span className={`w-fit p-0.5 border rounded ${(e?.type_products?.id === 0 && "text-lime-500 border-lime-500") || (e?.type_products?.id === 1 && "text-orange-500 border-orange-500") || (e?.type_products?.id === 2 && "text-sky-500 border-sky-500")}`}>{dataLang[e?.type_products?.name] || ""}</span>
                                                </h6>
                                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs w-[5%] text-center'>{e?.unit}</h6>
                                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs w-[6%] text-center'>{e?.variation?.length}</h6>
                                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs w-[6%] text-center'>{Number(e?.stock_quantity).toLocaleString()}</h6>
                                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs w-[9%]'></h6>
                                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs w-[10%]'></h6>
                                                <h6 className='px-2 py-2.5 xl:text-[14px] text-xs w-[7%]'>{e?.note}</h6>
                                                <div className='px-2 py-2.5 w-[8%] flex flex-wrap'>
                                                    {e?.branch.map(e => 
                                                        <h6 key={e?.id.toString()} className='xl:text-[14px] text-xs mr-1 mb-1 xl:py-[1px] xl:px-1.5 px-0.5 text-[#0F4F9E] rounded border border-[#0F4F9E] h-fit font-[300] break-words'>{e?.name}</h6>
                                                    )}
                                                </div>
                                                <div className='pl-2 py-2.5 w-[7%] flex space-x-2 justify-center'>
                                                    <BtnTacVu dataProductExpiry={dataProductExpiry} dataLang={dataLang} id={e.id} name={e.name} code={e.code} onRefresh={_ServerFetching.bind(this)} keepTooltipInside=".tooltipBoundary" className="bg-slate-100 xl:px-2 px-1 xl:py-2 py-1.5 rounded xl:text-[13px] text-xs" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </React.Fragment>
                            }
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

const BtnTacVu = React.memo((props) => {
    const [openTacvu, sOpenTacvu] = useState(false);
    const _ToggleModal = (e) => sOpenTacvu(e);

    const [open, sOpen] = useState(false);
    const [openDetail, sOpenDetail] = useState(false);
    const [openBom, sOpenBom] = useState(false);

    ////
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
            Axios("DELETE", `/api_web/api_product/product/${id}?csrf_protection=true`, {
            }, (err, response) => {
              if(!err){
                var {isSuccess, message} = response.data;
                if(isSuccess){
                  Toast.fire({
                    icon: 'success',
                    title: props.dataLang[message]
                  })     
                  props.onRefresh && props.onRefresh()
                }else{
                    Toast.fire({
                        icon: 'error',
                        title: props.dataLang[message]
                    }) 
                }
              }
            })     
        }
        })
    }
    
    return(
        <div>
            <Popup
                trigger={<button className={`flex space-x-1 items-center ` + props.className } ><span>Tác vụ</span><IconDown size={12} /></button>}
                arrow={false}
                position="bottom right"
                className={`dropdown-edit `}
                keepTooltipInside={props.keepTooltipInside}
                closeOnDocumentClick
                nested
                onOpen={_ToggleModal.bind(this, true)}
                onClose={_ToggleModal.bind(this, false)}
                open={open || openDetail || openBom}
            >
                <div className="w-auto rounded">
                    <div className="bg-white rounded-t flex flex-col overflow-hidden">
                        <Popup_GiaiDoan setOpen={sOpen} isOpen={open} dataLang={props.dataLang} id={props.id} name={props.name} code={props.code} type="add" className='text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full' />
                        <Popup_Bom setOpen={sOpenBom} isOpen={openBom} dataLang={props.dataLang} id={props.id} name={props.name} code={props.code} className='text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full' />
                        <Popup_ThanhPham onRefresh={props.onRefresh} dataProductExpiry={props.dataProductExpiry} dataLang={props.dataLang} id={props?.id} setOpen={sOpenDetail} isOpen={openDetail} className="text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full" />
                        <button onClick={_HandleDelete.bind(this, props.id)} className='text-sm hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full'>Xoá</button>
                    </div>
                </div>
            </Popup>
        </div>
    )
})

const Popup_ThanhPham = React.memo((props) => {
    const dataOptBranch = useSelector(state => state.branch);
    const dataOptType = useSelector(state => state.type_finishedProduct);
    const dataOptUnit = useSelector(state => state.unit_finishedProduct);
    const dataOptVariant = useSelector(state => state.variant_NVL);

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const _ToggleModal = (e) => props.setOpen(e);

    const [tab, sTab] = useState(0)
    const _HandleSelectTab = (e) => sTab(e)

    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingCategory, sOnFetchingCategory] = useState(false);
    const [onSending, sOnSending] = useState(false);

    const [name, sName] = useState("");
    const [code, sCode] = useState("");
    const [price, sPrice] = useState(null);
    const [minimumAmount, sMinimumAmount] = useState(null);
    const [note, sNote] = useState("");
    const [branch, sBranch] = useState([]);
    const [type, sType] = useState(null);
    const [dataCategory, sDataCategory] = useState([]);
    const [category, sCategory] = useState(null);
    const [unit, sUnit] = useState(null);
    const [expiry, sExpiry] = useState();

    const [thumb, sThumb] = useState(null);
    const [thumbFile, sThumbFile] = useState(null);
    const [isDeleteThumb, sIsDeleteThumb] = useState(false);

    ///Biến thể
    const [variantMain, sVariantMain] = useState(null);
    const [prevVariantMain, sPrevVariantMain] = useState(null);
    const [variantSub, sVariantSub] = useState(null);
    const [prevVariantSub, sPrevVariantSub] = useState(null);
    const [optVariantMain, sOptVariantMain] = useState([]);
    const [optVariantSub, sOptVariantSub] = useState([]);
    const [optSelectedVariantMain, sOptSelectedVariantMain] = useState([]);
    const [optSelectedVariantSub, sOptSelectedVariantSub] = useState([]);

    const [dataTotalVariant, sDataTotalVariant] = useState([]);
    const [dataVariantSending, sDataVariantSending] = useState([]);

    useEffect(() => {
        sOptVariantMain(dataOptVariant?.find(e => e.value == variantMain)?.option)
        // variantMain && optSelectedVariantMain?.length === 0 && sOptSelectedVariantMain([])
        prevVariantMain === undefined && sOptSelectedVariantMain([])
        !variantMain && sOptSelectedVariantMain([])
        if(variantMain === variantSub && variantSub != null && variantMain != null){
            sVariantSub(null)
            Toast.fire({
                icon: 'error',
                title: `Biến thể bị trùng`
            })
        }
    }, [variantMain]);

    useEffect(() => {
        sOptVariantSub(dataOptVariant?.find(e => e.value == variantSub)?.option)
        // variantSub && optSelectedVariantSub?.length === 0 && sOptSelectedVariantSub([])
        prevVariantSub === undefined && sOptSelectedVariantSub([])
        !variantSub && sOptSelectedVariantSub([])
        if(variantSub === variantMain && variantSub != null && variantMain != null){
            sVariantSub(null)
            Toast.fire({
                icon: 'error',
                title: `Biến thể bị trùng`
            })
        }
    }, [variantSub]);

    const checkEqual = (prevValue, nextValue) => prevValue && nextValue && prevValue === nextValue;

    const _HandleSelectedVariant = (type, event) => {
        if(type == "main"){
            const name = event?.target.value;
            const id = event?.target.id;
            if (event?.target.checked) {
                // Thêm giá trị và id vào mảng khi input được chọn
                const updatedOptions = [...optSelectedVariantMain, { name, id }];
                sOptSelectedVariantMain(updatedOptions);
            } else {
                // Xóa giá trị và id khỏi mảng khi input được bỏ chọn
                const updatedOptions = optSelectedVariantMain.filter(option => option.id !== id);
                sOptSelectedVariantMain(updatedOptions);
            }
        }else if(type == "sub"){
            const name = event?.target.value;
            const id = event?.target.id;
            if (event?.target.checked) {
                const updatedOptions = [...optSelectedVariantSub, { name, id }];
                sOptSelectedVariantSub(updatedOptions);
            } else {
                const updatedOptions = optSelectedVariantSub.filter(option => option.id !== id);
                sOptSelectedVariantSub(updatedOptions);
            }
        }
    }

    const _HandleSelectedAllVariant = (type) => {
        if(type == "main"){
            const uncheckedOptions = optVariantMain.filter(
                (option) => !optSelectedVariantMain.some((selectedOpt) => selectedOpt.id === option.id)
            );
            // Thêm tất cả các option chưa được chọn vào mảng optSelectedVariantMain
            const updatedOptions = [...optSelectedVariantMain, ...uncheckedOptions];
            sOptSelectedVariantMain(updatedOptions);
            // Lấy tất cả các option chưa được chọn
        }else if(type == "sub"){
            const uncheckedOptions = optVariantSub.filter(
                (option) => !optSelectedVariantSub.some((selectedOpt) => selectedOpt.id === option.id)
            );
            const updatedOptions = [...optSelectedVariantSub, ...uncheckedOptions];
            sOptSelectedVariantSub(updatedOptions);
        }
    };

    const _HandleApplyVariant = () => {
        if(optSelectedVariantMain?.length > 0){
            sDataTotalVariant([
                ...optSelectedVariantMain?.length > 0 ? optSelectedVariantMain?.map((item1) => ({...item1, image: null, price: null, variation_option_2: optSelectedVariantSub?.map((item2) => ({...item2, price: null}))})) : optSelectedVariantSub?.map((item2) => ({...item2}))
            ])
            sDataVariantSending([{name: dataOptVariant.find(e => e.value == variantMain)?.label, option: optSelectedVariantMain.map(e => ({id: e.id}))}, {name: dataOptVariant.find(e => e.value == variantSub)?.label, option: optSelectedVariantSub.map(e => ({id: e.id}))}])
        }else {
            Toast.fire({
                icon: 'error',
                title: `Phải chọn tùy chọn của biến thể chính`
            })
        }
    }
    //////

    const [errGroup, sErrGroup] = useState(false);
    const [errName, sErrName] = useState(false);
    const [errCode, sErrCode] = useState(false);
    const [errUnit, sErrUnit] = useState(false);
    const [errBranch, sErrBranch] = useState(false);
    const [errType, sErrType] = useState(false);

    useEffect(() => {
        props.isOpen && sTab(0)
        props.isOpen && sName("")
        props.isOpen && sCode("")
        props.isOpen && sNote("")
        props.isOpen && sPrice(null)
        props.isOpen && sExpiry()
        props.isOpen && sMinimumAmount(null)
        props.isOpen && sThumb(null)
        props.isOpen && sThumbFile(null)
        props.isOpen && sType(null)
        props.isOpen && sCategory(null)
        props.isOpen && sBranch([])
        props.isOpen && sDataCategory([])
        props.isOpen && sUnit(null)
        props.isOpen && sOnFetchingCategory(false)
        props.isOpen && sErrGroup(false)
        props.isOpen && sErrName(false)
        props.isOpen && sErrCode(false)
        props.isOpen && sErrUnit(false)
        props.isOpen && sErrBranch(false)
        props.isOpen && sErrType(false)
        props.isOpen && sDataTotalVariant([])
        props.isOpen && sDataVariantSending([])
        props.isOpen && sVariantMain(null)
        props.isOpen && sVariantSub(null)
        props.isOpen && sPrevVariantMain(null)
        props.isOpen && sPrevVariantSub(null)
        props.isOpen && props?.id && sOnFetching(true)
    }, [props.isOpen]);

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
        }else if(type == "type") {
            sType(value)
        }else if(type == "unit") {
            sUnit(value)
        }else if(type == "category") {
            sCategory(value)
        }else if(type == "variantMain") {
            if (!checkEqual(variantMain, value)) {
                sPrevVariantMain(variantMain?.value);
                sVariantMain(value?.value);
            }
        }else if(type == "variantSub") {
            if (!checkEqual(variantSub, value)) {
                sPrevVariantSub(variantSub?.value);
                sVariantSub(value?.value);
            }
        }else if(type == "expiry") {
            sExpiry(Number(value.value))
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

    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_product/product/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if(!err){
                var list = response.data
                sUnit({label: list?.unit, value: list?.unit_id})
                sMinimumAmount(Number(list?.quantity_minimum))
                sExpiry(Number(list?.expiry))
                sThumb(list?.images)
                sBranch(list?.branch?.map(e => ({label: e.name, value: e.id})))
                sCategory({label: list?.category_name, value: list?.category_id})
                sType({label: props.dataLang[list?.type_products?.name], value: list?.type_products?.code})
                sCode(list?.code)
                sName(list?.name)
                sPrice(Number(list?.price_sell))
                sExpiry(Number(data?.expiry))
                sNote(list?.note)
                sDataVariantSending(list?.variation)
                sVariantMain(list?.variation[0]?.id)
                sVariantSub(list?.variation[1]?.id)
                sOptSelectedVariantMain(list?.variation[0]?.option)
                sOptSelectedVariantSub(list?.variation[1]?.option)
                sDataTotalVariant(list?.variation_option_value)
            }
            sOnFetching(false)
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    const _ServerFetchingCategory = () => {
        Axios("GET", "api_web/api_product/categoryOption/?csrf_protection=true", {
            params: {
                "filter[branch_id][]": branch?.length > 0 ? branch.map(e => e.value) : 0
            }
        }, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                sDataCategory(rResult.map(e => ({label: `${e.name + " " + "(" + e.code + ")"}`, value: e.id, level: e.level, code: e.code, parent_id: e.parent_id})))
            }
            sOnFetchingCategory(false)
        })
    }

    useEffect(() => {
        onFetchingCategory && _ServerFetchingCategory()
    }, [onFetchingCategory]);

    useEffect(() => {
        setTimeout(() => {
            props.isOpen && branch && sOnFetchingCategory(true)
        }, 500);
    }, [branch]);

    const _ServerSending = () => {
        var formData = new FormData()

        formData.append("name", name)
        formData.append("code", code)
        formData.append("price_sell", code)
        formData.append("type_products", type.value)
        formData.append("category_id", category.value)
        formData.append("unit_id", unit.value)
        formData.append("expiry", expiry)
        formData.append("note", note)
        branch.forEach(e => formData.append("branch_id[]", e.value))
        formData.append("images", thumbFile)

        for (let i = 0; i < dataTotalVariant.length; i++) {
            var item = dataTotalVariant[i];
      
            formData.set(`variation_option_value[${i}][variation_option_1_id]`, item.id);
            formData.set(`variation_option_value[${i}][image]`, item.image || '');
      
            if(item.variation_option_2?.length > 0){
                for (let j = 0; j < item.variation_option_2?.length; j++) {
                    var subItem = item.variation_option_2[j];
                    formData.set(`variation_option_value[${i}][variation_option_2][${j}][id]`, subItem.id);
                    formData.set(`variation_option_value[${i}][variation_option_2][${j}][price]`, subItem.price || "");
                }
            }else{
                formData.set(`variation_option_value[${i}][price]`, item.price || "");
            }
        }

        for (let i = 0; i < dataVariantSending.length; i++) {
            for (let j = 0; j < dataVariantSending[i].option.length; j++) {
                formData.append(`variation[${i}][option_id][${j}]`, dataVariantSending[i].option[j].id);
            }
        }

        Axios("POST", `${props?.id ? `/api_web/api_product/product/${props.id}?csrf_protection=true` : "/api_web/api_product/product/?csrf_protection=true"} `, {
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
                    props.setOpen(false)
                    props.onRefresh && props.onRefresh()
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
        if(branch?.length == 0 || category?.value == null || type?.value == null || props?.id && code == "" || unit?.value == null || name == ""){
            branch?.length == 0 && sErrBranch(true)
            category?.value == null && sErrGroup(true)
            type?.value == null && sErrType(true)
            props?.id && code == "" && sErrCode(true)
            unit?.value == null && sErrUnit(true)
            name == "" && sErrName(true)
            Toast.fire({
                icon: 'error',
                title: `${props.dataLang?.required_field_null}`
            })
        }else{
            sOnSending(true)
        }
    }

    const _HandleChangeVariant = (id, type, value) => {
        var index = dataTotalVariant?.findIndex(x => x.id === id);
        if(type === "image"){
            dataTotalVariant[index].image = value.target?.files[0];
            sDataTotalVariant([...dataTotalVariant])
        }else if(type === "price"){
            dataTotalVariant[index].price = Number(value.value);
            sDataTotalVariant([...dataTotalVariant])
        }
    }

    const _HandleChangePrice = (parentId, id, value) => {
        var parentIndex = dataTotalVariant?.findIndex(x => x.id === parentId);
        var index = dataTotalVariant[parentIndex].variation_option_2.findIndex(x => x.id === id)
        dataTotalVariant[parentIndex].variation_option_2[index].price = Number(value.value);
        sDataTotalVariant([...dataTotalVariant])
    }

    const _HandleDeleteVariant = (parentId, id) => {
        Swal.fire({
            title: `${props.dataLang?.aler_ask}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#296dc1',
            cancelButtonColor: '#d33',
            confirmButtonText: `${props.dataLang?.aler_yes}`,
            cancelButtonText:`${props.dataLang?.aler_cancel}`
        }).then((result) => {
            if (result.isConfirmed){
                const newData = dataTotalVariant.map(item => {
                    if (item.id === parentId) {
                        item.variation_option_2 = item.variation_option_2.filter(opt => opt.id !== id);
                    }
                    return item;
                }).filter(item => item.variation_option_2.length > 0); 
                sDataTotalVariant(newData);
                
                const foundParent = newData.some((item) => item.id === parentId)
                if(foundParent === false){
                    const newData2 = dataVariantSending.map((item) => {
                        return {
                          ...item,
                          option: item.option.filter((opt) => opt.id !== parentId),
                        };
                    })
                    if(newData2[0].option?.length === 0){
                        sDataVariantSending(newData2.map(item => ({name: item.name})))
                    }else{
                        sDataVariantSending(newData2);
                    }
                }else{
                    const found = dataTotalVariant.some((item) => {
                        return item.variation_option_2.some((opt) => opt.id === id);
                    });
                    if(found === false){
                        const newData2 = dataVariantSending.map((item) => {
                            return {
                              ...item,
                              option: item.option.filter((opt) => opt.id !== id),
                            };
                        })
                        sDataVariantSending(newData2);
                    }
                }
            }
        })
    }

    const _HandleDeleteVariantItems = (id) => {
        Swal.fire({
            title: `${props.dataLang?.aler_ask}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#296dc1',
            cancelButtonColor: '#d33',
            confirmButtonText: `${props.dataLang?.aler_yes}`,
            cancelButtonText:`${props.dataLang?.aler_cancel}`
        }).then((result) => {
            if (result.isConfirmed){
                sDataTotalVariant([...dataTotalVariant.filter(x => x.id !== id)])
                const filteredOption = dataVariantSending[0].option.filter(opt => opt.id !== id);
                const updatedData = [...dataVariantSending];
                updatedData[0] = { ...dataVariantSending[0], option: filteredOption };
                sDataVariantSending(updatedData);

            }
        })
    }

    return(
        <PopupEdit  
            title={props?.id ? `Sửa thành phẩm` : `Tạo mới thành phẩm`} 
            button={props?.id ? "Sửa" : `${props.dataLang?.branch_popup_create_new}`} 
            onClickOpen={_ToggleModal.bind(this, true)} 
            open={props.isOpen} 
            onClose={_ToggleModal.bind(this,false)}
            classNameBtn={props.className}
        >
            <div className='py-4 w-[800px] 2xl:space-y-5 space-y-4'>
                <div className='flex items-center space-x-4 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
                    <button onClick={_HandleSelectTab.bind(this, 0)} className={`${tab === 0 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "} 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}>{props.dataLang?.information || "information"}</button>
                    <button onClick={_HandleSelectTab.bind(this, 1)} className={`${tab === 1 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "} 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}>{props.dataLang?.category_material_list_variant || "category_material_list_variant"}</button>
                </div>
                <ScrollArea className="max-h-[580px]" speed={1} smoothScrolling={true} ref={scrollAreaRef}>
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
                                                className={`${errBranch && branch?.length == 0 ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                            {errBranch && branch?.length == 0 && <label className="text-sm text-red-500">{props.dataLang?.client_list_bran || "client_list_bran"}</label>}
                                        </div>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">Danh mục <span className='text-red-500'>*</span></label>
                                            <Select 
                                                options={dataCategory}
                                                formatOptionLabel={CustomSelectOption}
                                                value={category}
                                                onChange={_HandleChangeInput.bind(this, "category")}
                                                isClearable={true}
                                                noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                placeholder={"Danh mục"}
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                className={`${errGroup && category?.value == null ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                            {errGroup && category?.value == null && <label className="text-sm text-red-500">Vui lòng chọn danh mục</label>}
                                        </div>
                                        
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">Mã thành phẩm {props?.id && <span className='text-red-500'>*</span>}</label>
                                            <input value={code} onChange={_HandleChangeInput.bind(this, "code")} type="text" placeholder={props.dataLang?.client_popup_sytem} className={`${errCode && code == "" ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                                            {errCode && code == "" && <label className="text-sm text-red-500">Vui lòng nhập mã thành phẩm</label>}
                                        </div>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">Tên thành phẩm <span className='text-red-500'>*</span></label>
                                            <input value={name} onChange={_HandleChangeInput.bind(this, "name")} type="text" placeholder="Tên thành phẩm" className={`${errName && name == "" ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                                            {errName && name == "" && <label className="text-sm text-red-500">Vui lòng nhập tên thành phẩm</label>}
                                        </div>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">Giá bán</label>
                                            <NumericFormat thousandSeparator="," value={price} onValueChange={_HandleChangeInput.bind(this, "price")} placeholder="Giá bán" className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} />
                                        </div>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">{props.dataLang?.minimum_amount || "minimum_amount"}</label>
                                            <NumericFormat thousandSeparator="," value={minimumAmount} onValueChange={_HandleChangeInput.bind(this, "minimumAmount")} placeholder={props.dataLang?.minimum_amount || "minimum_amount"} className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} />
                                        </div>
                                        {props.dataProductExpiry?.is_enable === "1" &&
                                            <div className='2xl:space-y-1'>
                                                <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">{props.dataLang?.category_material_list_expiry_date || "category_material_list_expiry_date"}</label>
                                                <div className='relative flex flex-col justify-center items-center'>
                                                    <NumericFormat thousandSeparator="," value={expiry} onValueChange={_HandleChangeInput.bind(this, "expiry")} placeholder={props.dataLang?.category_material_list_expiry_date || "category_material_list_expiry_date"} className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 pr-14 border outline-none`} />
                                                    <span className='absolute right-2 text-slate-400 select-none'>{props.dataLang?.date || "date"}</span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className='2xl:space-y-3 space-y-2'>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">Loại thành phẩm <span className='text-red-500'>*</span></label>
                                            <Select 
                                                options={dataOptType}
                                                value={type}
                                                onChange={_HandleChangeInput.bind(this, "type")}
                                                isClearable={true}
                                                placeholder={"Loại thành phẩm"}
                                                noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                className={`${errType && type?.value == null ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                            {errType && type?.value == null && <label className="text-sm text-red-500">Vui lòng chọn loại thành phẩm</label>}
                                        </div>
                                        <div className='2xl:space-y-1'>
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">Đơn vị <span className='text-red-500'>*</span></label>
                                            <Select 
                                                options={dataOptUnit}
                                                value={unit}
                                                onChange={_HandleChangeInput.bind(this, "unit")}
                                                isClearable={true}
                                                noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                placeholder={"Đơn vị"}
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                className={`${errUnit && unit?.value == null ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                            {errUnit && unit?.value == null && <label className="text-sm text-red-500">Vui lòng chọn đơn vị</label>}
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
                            {tab === 1 &&
                                <div className=''>
                                    <div className='grid grid-cols-2 gap-5'>
                                        <div className='space-y-3'>
                                            <div className='space-y-1'>
                                                <label>{props.dataLang?.category_material_list_variant_main || "category_material_list_variant_main"}</label>
                                                <Select 
                                                    options={dataOptVariant}
                                                    value={variantMain ? {label: dataOptVariant.find(e => e.value == variantMain)?.label , value: variantMain} : null}
                                                    onChange={_HandleChangeInput.bind(this, "variantMain")}
                                                    isClearable={true}
                                                    placeholder={props.dataLang?.category_material_list_variant_main || "category_material_list_variant_main"}
                                                    noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                    menuPortalTarget={document.body}
                                                    onMenuOpen={handleMenuOpen}
                                                    className={` placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                            </div>
                                            <div className='flex justify-between items-center'>
                                                <h5 className='text-slate-400 text-sm'>{props.dataLang?.branch_popup_variant_option || "branch_popup_variant_option"}</h5>
                                                {optVariantMain && <button onClick={_HandleSelectedAllVariant.bind(this, "main")} className='text-sm font-medium'>Chọn tất cả</button>}
                                            </div>
                                            {!optVariantMain &&
                                                <div className='space-y-0.5'>
                                                    <div className='w-full h-9 bg-slate-100 animate-[pulse_1s_ease-in-out_infinite] rounded' />
                                                    <div className='w-full h-9 bg-slate-100 animate-[pulse_1.1s_ease-in-out_infinite] rounded' />
                                                    <div className='w-full h-9 bg-slate-100 animate-[pulse_1.2s_ease-in-out_infinite] rounded' />
                                                </div>
                                            }
                                            <ScrollArea className="max-h-[115px] w-full " speed={1} smoothScrolling={true}>
                                                <div className='flex flex-col'>
                                                    {optVariantMain?.map(e => 
                                                        <div key={e?.id.toString()} className='flex items-center '>
                                                            <label className="relative flex cursor-pointer items-center rounded-full p-2" htmlFor={e.id} data-ripple-dark="true" > 
                                                                <input
                                                                    type="checkbox"
                                                                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                                                                    id={e.id}
                                                                    value={e.name}
                                                                    checked={optSelectedVariantMain.some((selectedOpt) => selectedOpt.id === e.id)}
                                                                    onChange={_HandleSelectedVariant.bind(this, "main")}
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
                                                            <label htmlFor={e.id} className='text-[#344054] font-normal text-sm cursor-pointer'>{e.name}</label>
                                                        </div>
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                        <div className='space-y-3'>
                                            <div className='space-y-1'>
                                                <label>{props.dataLang?.category_material_list_variant_sub || "category_material_list_variant_sub"}</label>
                                                <Select 
                                                    options={dataOptVariant}
                                                    value={variantSub ? {label: dataOptVariant.find(e => e.value == variantSub)?.label , value: variantSub} : null}
                                                    onChange={_HandleChangeInput.bind(this, "variantSub")}
                                                    isClearable={true}
                                                    placeholder={props.dataLang?.category_material_list_variant_sub || "category_material_list_variant_sub"}
                                                    noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                                    menuPortalTarget={document.body}
                                                    onMenuOpen={handleMenuOpen}
                                                    className={` placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                                        })
                                                    }}
                                                />
                                            </div>
                                            <div className='flex justify-between items-center'>
                                                <h5 className='text-slate-400 text-sm'>{props.dataLang?.branch_popup_variant_option || "branch_popup_variant_option"}</h5>
                                                {optVariantSub && <button onClick={_HandleSelectedAllVariant.bind(this, "sub")} className='text-sm font-medium'>Chọn tất cả</button>}
                                            </div>
                                            {!optVariantSub &&
                                                <div className='space-y-0.5'>
                                                    <div className='w-full h-9 bg-slate-100 animate-[pulse_1s_ease-in-out_infinite] rounded' />
                                                    <div className='w-full h-9 bg-slate-100 animate-[pulse_1.1s_ease-in-out_infinite] rounded' />
                                                    <div className='w-full h-9 bg-slate-100 animate-[pulse_1.2s_ease-in-out_infinite] rounded' />
                                                </div>
                                            }
                                            <ScrollArea className="max-h-[115px] w-full " speed={1} smoothScrolling={true}>
                                                <div className='flex flex-col space-y-0.5'>
                                                    {optVariantSub?.map(e => 
                                                        <div key={e?.id.toString()} className='flex items-center '>
                                                            <label className="relative flex cursor-pointer items-center rounded-full p-2" htmlFor={e.id} data-ripple-dark="true" > 
                                                                <input
                                                                    type="checkbox"
                                                                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                                                                    id={e.id}
                                                                    value={e.name}
                                                                    checked={optSelectedVariantSub.some((selectedOpt) => selectedOpt.id === e.id)}
                                                                    onChange={_HandleSelectedVariant.bind(this, "sub")}
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
                                                            <label htmlFor={e.id} className='text-[#344054] font-normal text-sm '>{e.name}</label>
                                                        </div>
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                    <div className='flex justify-end py-2'>
                                        <button onClick={_HandleApplyVariant.bind(this)} disabled={(optSelectedVariantMain?.length == 0 && optSelectedVariantSub?.length == 0) ? true : false} className='disabled:grayscale outline-none px-4 py-2 rounded-lg bg-[#E2F0FE] text-sm font-medium hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition'>{props.dataLang?.apply || "apply"}</button>
                                    </div>
                                    {Object.keys(dataTotalVariant).length !== 0 &&
                                        <div className='space-y-1'>
                                            <h4 className='text-[#344054] font-medium'>{props.dataLang?.list_variant || "list_variant"}</h4>
                                            <div className={`${dataTotalVariant[0]?.variation_option_2?.length > 0 ? "grid-cols-9" : "grid-cols-7" } grid gap-5 p-1`}>
                                                <h4 className='text-[15px] text-center font-[300] text-slate-400 col-span-2'>{props.dataLang?.avatar || "avatar"}</h4>
                                                <h4 className='text-[15px] font-[300] text-slate-400 col-span-2'>{dataVariantSending[0]?.name}</h4>
                                                {dataTotalVariant[0]?.variation_option_2?.length > 0 && <h4 className='text-[15px] font-[300] text-slate-400 col-span-2'>{dataVariantSending[1]?.name}</h4>}
                                                <h4 className='text-[15px] text-center font-[300] text-slate-400 col-span-2'>{"Giá"}</h4>
                                                <h4 className='text-[15px] text-center font-[300] text-slate-400'>{props.dataLang?.branch_popup_properties || "branch_popup_properties"}</h4>
                                            </div>
                                            <ScrollArea className="max-h-[230px]" speed={1} smoothScrolling={true}>
                                                <div className='space-y-0.5'>
                                                    {dataTotalVariant?.map(e => 
                                                        <div className={`${e?.variation_option_2?.length > 0 ? "grid-cols-9" : "grid-cols-7"} grid gap-5 items-center bg-slate-50 hover:bg-slate-100 p-1`} key={e?.id.toString()}>
                                                            <div className='w-full h-full flex flex-col justify-center items-center col-span-2'>
                                                                <input onChange={_HandleChangeVariant.bind(this, e?.id, "image")} type="file" id={`uploadImg+${e?.id}`} accept="image/png, image/jpeg" hidden />
                                                                <label htmlFor={`uploadImg+${e?.id}`} className='h-14 w-14 flex flex-col justify-center items-center bg-slate-200/50 cursor-pointer rounded'>
                                                                    {e.image == null ?
                                                                        <React.Fragment>
                                                                            <div className='h-14 w-14 flex flex-col justify-center items-center bg-slate-200/50 cursor-pointer rounded'><IconImage /></div>
                                                                        </React.Fragment>
                                                                        : 
                                                                        <Image width={64} height={64} src={typeof(e.image)==="string" ? e.image : URL.createObjectURL(e.image)} className="h-14 w-14 object-contain" />
                                                                    }
                                                                </label>
                                                            </div>
                                                            <div className=' col-span-2 truncate'>{e.name}</div>
                                                            {e?.variation_option_2?.length > 0 ?
                                                                <div className='col-span-5 grid grid-cols-5 gap-1 items-center'>
                                                                    {e?.variation_option_2?.map(ce => 
                                                                        <React.Fragment key={ce.id?.toString()}>
                                                                            <div className='col-span-2 truncate'>{ce.name}</div>
                                                                            <NumericFormat thousandSeparator="," value={ce.price} onValueChange={_HandleChangePrice.bind(this, e.id, ce.id)} placeholder="Giá" className={`col-span-2 focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} />
                                                                            <div className='flex justify-center'>
                                                                                <button onClick={_HandleDeleteVariant.bind(this, e.id, ce.id)} className='p-1.5 text-red-500 hover:scale-110 transition hover:text-red-600'><IconDelete size="22" /></button>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    )}
                                                                </div>
                                                                :
                                                                <React.Fragment>
                                                                    <NumericFormat thousandSeparator="," value={e?.price} onValueChange={_HandleChangeVariant.bind(this, e.id, "price")} placeholder="Giá" className={`col-span-2 focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} />
                                                                    <div className='flex justify-center'>
                                                                        <button onClick={_HandleDeleteVariantItems.bind(this, e.id)} className='p-1.5 text-red-500 hover:scale-110 transition hover:text-red-600'><IconDelete size="22" /></button>
                                                                    </div>
                                                                </React.Fragment>
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    }
                                </div>
                            }
                        </React.Fragment>
                    }
                </ScrollArea>
                <div className='flex justify-end space-x-2'>
                    <button onClick={_ToggleModal.bind(this,false)} className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition">{props.dataLang?.branch_popup_exit}</button>
                    <button onClick={_HandleSubmit.bind(this)} className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#0F4F9E] hover:opacity-90 hover:scale-105 transition">{props.dataLang?.branch_popup_save}</button>
                </div>
            </div>
        </PopupEdit>
    )
})

const Popup_ThongTin = React.memo((props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const [openStage, sOpenStage] = useState(false);

    const [tab, sTab] = useState(0)
    const _HandleSelectTab = (e) => sTab(e)

    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingAnother, sOnFetchingAnother] = useState(false);
    const [list, sList] = useState({});
    const [dataStage, sDataStage] = useState(false);

    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_product/product/${props.id}?csrf_protection=true`, {}, (err, response) => {
            if(!err){
                sList({...response.data})
            }
            sOnFetching(false)
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    const _ServerFetchingAnother = () => {
        Axios("GET", `/api_web/api_product/getDesignStages/${props.id}?csrf_protection=true`, {}, (err, response) => {
            if(!err){
                var data = response.data;
                sDataStage(data)
            }
            sOnFetchingAnother(false)
        })
    }

    useEffect(() => {
        onFetchingAnother && _ServerFetchingAnother()
    }, [onFetchingAnother]);

    useEffect(() => {
        open && sTab(0)
        open && sOnFetching(true)
        open && sOnFetchingAnother(true)
    }, [open]);

    useEffect(() => {
        open && openStage == false && sOnFetchingAnother(true) && console.log("Here")
    }, [openStage == false]);

    return(
        <PopupEdit  
            title={"Chi tiết thành phẩm"} 
            button={props.children} 
            onClickOpen={_ToggleModal.bind(this, true)} 
            open={open} 
            onClose={_ToggleModal.bind(this,false)}
            nested
        >
            <div className='py-4 w-[800px] space-y-5'>
                <div className='flex items-center space-x-4 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
                    <button onClick={_HandleSelectTab.bind(this, 0)} className={`${tab === 0 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-medium`}>{props.dataLang?.information || "information"}</button>
                    <button onClick={_HandleSelectTab.bind(this, 1)} className={`${tab === 1 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-medium`}>{props.dataLang?.category_material_list_variant || "category_material_list_variant"}</button>
                    <button onClick={_HandleSelectTab.bind(this, 2)} className={`${tab === 2 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-medium`}>Định mức BOM</button>
                    <button onClick={_HandleSelectTab.bind(this, 3)} className={`${tab === 3 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-medium`}>Giai đoạn</button>
                </div>
                {onFetching ? 
                    <Loading className="h-96"color="#0f4f9e" />
                    :
                    <React.Fragment>
                        {tab === 0 &&
                            <div className='grid grid-cols-2 gap-5'>
                                <div className='space-y-5'>
                                    <div className='space-y-3 bg-slate-100/40 p-2 rounded-md'>
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[40%]'>{props.dataLang?.client_list_brand || "client_list_brand"}:</h5>
                                            <div className='w-[55%] flex flex-col items-end'>
                                                {list?.branch?.map(e => 
                                                    <h6 key={e.id.toString()} className='w-fit text-right'>{e.name}</h6>
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[40%]'>Danh mục:</h5>
                                            <h6 className='w-[55%] text-right'>{list?.category_name}</h6>
                                        </div>
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[40%]'>Mã thành phẩm:</h5>
                                            <h6 className='w-[55%] text-right'>{list?.code}</h6>
                                        </div>
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[40%]'>Tên thành phẩm:</h5>
                                            <h6 className='w-[55%] text-right'>{list?.name}</h6>
                                        </div>
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[40%]'>Loại thành phẩm:</h5>
                                            <h6 className='w-[55%] text-right'>{props.dataLang[list?.type_products?.name]}</h6>
                                        </div>
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[40%]'>Đơn vị:</h5>
                                            <h6 className='w-[55%] text-right'>{list?.unit}</h6>
                                        </div>
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[40%]'>Tồn kho:</h5>
                                            <h6 className='w-[55%] text-right'>{Number(list?.stock_quantity).toLocaleString()}</h6>
                                        </div>
                                        {props.dataProductExpiry?.is_enable === "1" &&
                                            <div className='flex justify-between'>
                                                <h5 className='text-slate-400 text-sm w-[40%]'>Thời hạn sử dụng:</h5>
                                                <h6 className='w-[55%] text-right'>{list?.expiry}</h6>
                                            </div>
                                        }
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[40%]'>Ghi chú:</h5>
                                            <h6 className='w-[55%] text-right'>{list?.note}</h6>
                                        </div>
                                    </div>
                                    <div className='space-y-3 bg-slate-100/40 p-2 rounded-md'>
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[40%]'>Giá bán:</h5>
                                            <h6 className='w-[55%] text-right'>{Number(list?.price_sell).toLocaleString()}</h6>
                                        </div>
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[40%]'>Số lượng tối thiểu:</h5>
                                            <h6 className='w-[55%] text-right'>{Number(list?.quantity_minimum).toLocaleString()}</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className='space-y-3 flex flex-col justify-between'>
                                    <div className='flex bg-slate-100/40 p-2 rounded-md'>
                                        <h5 className='text-slate-400 text-sm w-[40%]'>{props.dataLang?.avatar || "avatar"}:</h5>
                                        {list?.images == null ?
                                            <img src="/no_image.png" className='w-48 h-48 rounded object-contain select-none pointer-events-none' />
                                            :
                                            <Image width={200} height={200} quality={100} src={list?.images} alt="thumb type" className="w-48 h-48 rounded object-contain select-none pointer-events-none" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/>
                                        }
                                    </div>
                                    <div className='bg-slate-100/40 p-2 rounded-md space-y-3'>
                                        <h4 className='flex space-x-2'><IconUserEdit size={20} /><span className='text-[15px] font-medium'>Người lập phiếu</span></h4>
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[30%]'>{props.dataLang?.creator || "creator"}:</h5>
                                            <h6 className='w-[65%] text-right'>ABC</h6>
                                        </div>
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[30%]'>{props.dataLang?.date_created || "date_created"}:</h5>
                                            <h6 className='w-[65%] text-right'>dasd</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {tab === 1 &&
                            <React.Fragment>
                                {list?.variation?.length > 0 ?
                                    <div className='space-y-0.5 min-h-[384px]'>
                                        <div className={`${list?.variation[1] ? "grid-cols-4" : "grid-cols-3" } grid gap-2 px-2 py-1.5 bg-slate-100/40 rounded`}>
                                            <h5 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase font-[300] text-center'>Hình đại diện</h5>
                                            <h5 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase font-[300]'>{list?.variation[0]?.name}</h5>
                                            {list?.variation[1] && <h5 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase font-[300]'>{list?.variation[1]?.name}</h5>}
                                            <h5 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase font-[300] text-right'>Giá</h5>
                                        </div>
                                        <ScrollArea className="min-h-[400px] max-h-[450px]" speed={1} smoothScrolling={true}>
                                            <div className='divide-y divide-slate-200'>
                                                {list?.variation_option_value?.map(e => 
                                                    <div key={e?.id.toString()} className={`${e?.variation_option_2?.length > 0 ? "grid-cols-4" : "grid-cols-3" } grid gap-2 px-2 py-2.5 hover:bg-slate-50`}>
                                                        <div className='flex justify-center self-center'>
                                                            {e?.image == null ?
                                                                <img src="/no_image.png" className='w-auto h-20 rounded object-contain select-none pointer-events-none' />
                                                                :
                                                                <Image width={200} height={200} quality={100} src={e?.image} alt="thumb type" className="w-auto h-20 rounded object-contain select-none pointer-events-none" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/>
                                                            }
                                                        </div>
                                                        <h6 className='px-2 xl:text-base text-xs self-center'>{e?.name}</h6>
                                                        {e?.variation_option_2?.length > 0 ?
                                                            <div className='self-center space-y-0.5 col-span-2 grid grid-cols-2'>
                                                                {e?.variation_option_2?.map(ce => 
                                                                    <React.Fragment key={ce.id?.toString()}>
                                                                        <h6 className='px-2 xl:text-base text-xs'>{ce.name}</h6>
                                                                        <h6 className='px-2 xl:text-base text-xs text-right'>{Number(ce.price).toLocaleString()}</h6>
                                                                    </React.Fragment>
                                                                )}
                                                            </div>
                                                            :
                                                            <h6 className='px-2 xl:text-base text-xs self-center text-right'>{Number(e?.price).toLocaleString()}</h6>
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                    :
                                    <div className="w-full h-96 flex flex-col justify-center items-center" >
                                        <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                                        <h1 className="text-[#141522] text-base opacity-90 font-medium">{props.dataLang?.no_data_found}</h1>
                                    </div>
                                }
                            </React.Fragment>
                        }
                        {tab === 2 &&
                            <div>BOM</div>
                        }
                        {tab === 3 &&
                            <>
                                {onFetchingAnother ?
                                    <Loading className="h-96"color="#0f4f9e" />
                                    :
                                    <React.Fragment>
                                        {dataStage?.length > 0 ?
                                            <div className='space-y-0.5 min-h-[384px]'>
                                                <div className={`grid-cols-8 grid gap-2 px-2 py-1.5 bg-slate-100/40 rounded`}>
                                                    <h5 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase font-[300] text-center'>STT</h5>
                                                    <h5 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase font-[300] col-span-2'>Giai đoạn</h5>
                                                    <h5 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase font-[300] col-span-3'>Đánh dấu công đoạn bắt đầu TP chưa hoàn thiện</h5>
                                                    <h5 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase font-[300] text-center col-span-2'>Giai đoạn cuối</h5>
                                                </div>
                                                <ScrollArea className="min-h-[400px] max-h-[450px]" speed={1} smoothScrolling={true}>
                                                    <div className='divide-y divide-slate-200'>
                                                        {dataStage?.map((e, index) => 
                                                            <div key={e?.id.toString()} className={`grid-cols-8 grid gap-2 px-2 py-2.5 hover:bg-slate-50 items-center`}>
                                                                <h6 className='text-center px-2 xl:text-base text-xs'>{index + 1}</h6>
                                                                <h6 className='px-2 xl:text-base text-xs col-span-2'>{e?.stage_name}</h6>
                                                                <h6 className='px-2 xl:text-base text-xs col-span-3 flex justify-center text-green-600'>{e?.type !== "0" && <IconTick />}</h6>
                                                                <h6 className='px-2 xl:text-base text-xs col-span-2 flex justify-center text-green-600'>{e?.final_stage !== "0" && <IconTick />}</h6>
                                                            </div>
                                                        )}
                                                    </div>
                                                </ScrollArea>
                                                <div className="flex items-center space-x-3 justify-end">
                                                    <Popup_GiaiDoan setOpen={sOpenStage} isOpen={openStage} dataLang={props.dataLang} id={props.id} name={list?.name} code={list?.code} type="edit" className='text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition' />
                                                </div>
                                            </div>
                                            :
                                            <div className="w-full h-96 flex flex-col justify-center items-center" >
                                                <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                                                <h1 className="text-[#141522] text-base opacity-90 font-medium">{props.dataLang?.no_data_found}</h1>
                                            </div>
                                        }
                                    </React.Fragment>
                                }
                            </>
                        }
                    </React.Fragment>
                }
            </div>
        </PopupEdit>
    )
})

const Popup_GiaiDoan = React.memo((props) => {
    const listCd = useSelector(state => state.congdoan_finishedProduct);

    const _ToggleModal = (e) => props.setOpen(e);

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef != null ? scrollAreaRef.current : scrollAreaRef;
        return { menuPortalTarget };
    };

    const [onSending, sOnSending] = useState(false);
    const [onFetching, sOnFetching] = useState(false);

    const [statusBtnAdd, sStatusBtnAdd] = useState(false);
    const [errName, sErrName] = useState(false);
    
    const [listCdChosen, sListCdChosen] = useState([]);
    const [option, sOption] = useState([]);  
    const [listCdRest, sListCdRest] = useState([]);

    const [name, sName] = useState(null);
    const [radio1, sRadio1] = useState(0);
    const [radio2, sRadio2] = useState(0);

    
    useEffect(() => {
        props.isOpen && sOption([])
        props.isOpen && sListCdChosen([])
        props.isOpen && sStatusBtnAdd(false)
        props.isOpen && sErrName(false)
        props.isOpen && sOnFetching(true)
    }, [props.isOpen]);

    useEffect(() => {
        if(listCd?.length == option?.length){
            sStatusBtnAdd(true)
        }else{
            sStatusBtnAdd(false)
        }
    }, [option]);

    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_product/getDesignStages/${props.id}?csrf_protection=true`, {}, (err, response) => {
            if(!err){
                var data = response.data;
                sOption(data.map(e => ({id: Number(e.id), name: {label: e.stage_name, value: e.stage_id}, radio1: e.type !== "0" ? 1 : 0, radio2: e.final_stage !== "0" ? 1 : 0})))
                sListCdChosen(data.map(e => ({label: e.stage_name, value: e.stage_id})))
            }
            sOnFetching(false)
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    const _ServerSending = () => {
        var formData = new FormData();

        formData.append("product_id", props.id)
        option.forEach((item, index) => {
            formData.append(`data[${index}][stages]`, item?.name?.value);
            formData.append(`data[${index}][type]`, item.radio1);
            formData.append(`data[${index}][final_stage]`, item.radio2);
        });
        Axios("POST", "/api_web/api_product/designStages?csrf_protection=true", {
            data: formData,
            headers: {"Content-Type": "multipart/form-data"} 
        }, (err, response) => {
            if(!err){
                var {isSuccess, message} = response.data;
                if(isSuccess){
                    Toast.fire({
                        icon: 'success',
                        title: props.dataLang[message]
                    })
                    props.setOpen(false)
                }else {
                    Toast.fire({
                        icon: 'error',
                        title: props.dataLang[message]
                    })
                }
            }
            sOnSending(false)
        })
    }

    useEffect(() => {
        onSending && _ServerSending()
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        const hasNullLabel = option.some(item => item.name === null);
        if(hasNullLabel){
            sErrName(true)
            Toast.fire({
                icon: 'error',
                title: `${props.dataLang?.required_field_null}`
            })
        }else{
            sErrName(false)
            sOnSending(true)
        }
    }

    //Draggable

    const _HandleAddNew =  () => {
        sOption([...option, {id: Date.now(), name: name, radio1: radio1, radio2: radio2}])
        sName(null)
        sRadio1(0)
        sRadio2(0)
    }
    
    const onSortEnd = ({oldIndex, newIndex}) => {
        var newItems = arrayMoveImmutable([...option], oldIndex, newIndex);
        sOption(newItems)
    }

    useEffect(() => {
        props.isOpen && listCdChosen && sListCdRest(listCd?.filter(item1 => !listCdChosen.some(item2 => item1.label === item2?.label && item1.value === item2?.value)))
    }, [listCdChosen]);

    const handleDelete = (updatedData) => {
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
                sOption(updatedData);
            }
        })
    }

    const handleRatioChange = (id, type) => {
        const updatedData = option.map(item => {
          if (item.id === id) {
            if(type == "radio1"){
                return {...item, radio1: 1};
            }else if(type == "radio2"){
                return {...item, radio2: 1};
            }
          } else {
            if(type == "radio1"){
                return {...item, radio1: 0};
            }else if(type == "radio2"){
                return {...item, radio2: 0};
            }
          }
        });
        sOption(updatedData);
    };

    const handleSelectChange = (id, value) => {
        const index = option.findIndex(x => x.id === id);
        option[index].name = value;
        sOption([...option])
        sListCdChosen(option.map(e => e.name))
    }

    const ItemDragHandle = sortableHandle(() => {
        return(
            <button type='button' className='text-blue-500 relative flex flex-col justify-center items-center'>
                <IconMax size="18" className='-rotate-45' />
                <IconMax size="18" className='rotate-45 absolute' />
            </button>
        )
    })

    const SortableList = SortableContainer(({items, onClickDelete}) => {
        const handleDelete = (id) => {
            const updatedItems = items.filter(item => item.id !== id);
            onClickDelete(updatedItems);
        }
        return (
            <div className='divide-y divide-slate-100'>
                {items.map((e, index) => (
                    <SortableItem key={`item-${e.value}`} index={index} indexItem={index} value={e} onClickDelete={handleDelete} />
                ))}
            </div>
        );
    });

    const SortableItem = SortableElement(({value, indexItem, onClickDelete}) => {
        const handleDeleteClick = () => {
            onClickDelete(value.id);
        }
        
        return(
            <div className='flex items-center z-[999] py-1 hover:bg-slate-50 bg-white'>
                <h6 className='w-[5%] text-center px-2'>{indexItem + 1}</h6>
                <div className='w-[30%] px-2'>
                    <Select   
                        closeMenuOnSelect={true}
                        placeholder={"Tên công đoạn"}
                        options={listCdRest}
                        value={value.name}
                        onChange={handleSelectChange.bind(this, value.id)}
                        isSearchable={true}
                        noOptionsMessage={() => "Không có dữ liệu"}
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
                        }}
                        className={`${errName && value.name == null ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
                    />
                </div>
                <div className="w-[30%] flex items-center justify-center">
                    <input type="radio" id={`radio1 + ${value.id}`} onChange={handleRatioChange.bind(this, value.id, "radio1")} checked={value.radio1 === 0 ? false : true} name='radio1' className="scale-150 outline-none accent-blue-500"/>
                    <label htmlFor={`radio1 + ${value.id}`} className="relative flex cursor-pointer items-center rounded-full p-3" data-ripple-dark="true">{"Chọn"}</label>
                </div>
                <div className="w-[20%] flex items-center justify-center">
                    <input type="radio" id={`radio2 + ${value.id}`} onChange={handleRatioChange.bind(this, value.id, "radio2")} checked={value.radio2 === 0 ? false : true} name='radio2' className="scale-150 outline-none accent-blue-500"/>
                    <label htmlFor={`radio2 + ${value.id}`} className="relative flex cursor-pointer items-center rounded-full p-3" data-ripple-dark="true">{"Chọn"}</label>
                </div>
                <div className='w-[15%] flex items-center justify-center space-x-4'>
                    <ItemDragHandle />
                    <button onClick={handleDeleteClick.bind(this)} type='button' className='text-red-500'><IconDelete /></button>
                </div>
            </div>
        )
    });

    return(
        <PopupEdit  
            title={`Công đoạn (${props.code} - ${props.name})`} 
            button={props.type == "add" ? "Thiết kế công đoạn" : "Sửa"} 
            onClickOpen={_ToggleModal.bind(this, true)} 
            open={props.isOpen} 
            onClose={_ToggleModal.bind(this,false)}
            classNameBtn={props.className}
        >
            <div className="py-4 w-[800px]">
                <div className="flex w-full items-center py-2">
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[5%] font-[400] text-center">STT</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[30%] font-[400] text-left">{"Tên công đoạn"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[30%] font-[400] text-left">{"Đánh dấu công đoạn bắt đầu TP chưa hoàn thiện"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[400] text-center">{"Công đoạn cuối"}</h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[400] text-center">{"Thao tác"}</h4>
                </div> 
                {onFetching ? 
                    <Loading className="h-96"color="#0f4f9e" />
                    :
                    <>
                        <ScrollArea className="min-h-[0px] max-h-[500px] overflow-hidden" speed={1} smoothScrolling={true} ref={scrollAreaRef}>
                            <SortableList useDragHandle lockAxis={"y"} items={option} onSortEnd={onSortEnd.bind(this)} onClickDelete={handleDelete} />
                            <button type='button' onClick={_HandleAddNew.bind(this)} disabled={statusBtnAdd} title='Thêm' className={`${statusBtnAdd ? "opacity-50" : "opacity-100 hover:text-[#0F4F9E] hover:bg-[#e2f0fe]" } transition mt-5 w-full min-h-[100px] h-35 rounded-[5.5px] bg-slate-100 flex flex-col justify-center items-center`}><IconAdd />{"Thêm giai đoạn"}</button> 
                        </ScrollArea> 
                        <div className="text-right mt-5 space-x-2">
                        <button type='button' onClick={_ToggleModal.bind(this,false)} className={`text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]`}
                        >{props.dataLang?.branch_popup_exit}</button>
                        <button onClick={_HandleSubmit.bind(this)} className="text-[#FFFFFF] font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]" >{props.dataLang?.branch_popup_save}</button>
                        </div>
                    </>
                }
            </div> 
        </PopupEdit>
    )
})

const Popup_Bom = React.memo((props) => {
    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const dataOptType = useSelector(state => state.type_finishedProduct);

    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingCd, sOnFetchingCd] = useState(false);
    const [onFetchingName, sOnFetchingName] = useState(false);
    const _ToggleModal = (e) => props.setOpen(e);

    const [dataVariant, sDataVariant] = useState([]);
    const [valueVariant, sValueVariant] = useState(null);

    const [tab, sTab] = useState(null);
    const [selectedList, sSelectedList] = useState(null);

    const [dataTypeCd, sDataTypeCd] = useState([]);

    const _HandleSelectTab = (e) => sTab(e);

    const [dataSelectedVariant, sDataSelectedVariant] = useState([]);
    const dataRestVariant = dataVariant?.filter(item1 => !dataSelectedVariant.some(item2 => item1.label === item2?.label && item1.value === item2?.value));

    useEffect(() => {
        props.isOpen && sOnFetching(true)
        props.isOpen && props?.id && sOnFetching(true)
        props.isOpen && props?.id && sOnFetchingCd(true)
        props.isOpen && props?.id && sOnFetchingName(true)
        props.isOpen && sTab(null)
    }, [props.isOpen]);

    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_product/productVariationOption/${props.id}?csrf_protection=true`, {}, (err,response) => {
            if(!err){
                var {rResult} = response.data;
                sDataVariant(rResult.map(e => ({label: e.product_variation, value: e.id, child: []})))
            }
            sOnFetching(false)
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    const _ServerFetchingCd = () => {
        Axios("GET", "/api_web/api_product/getDataDesignBom?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {data} = response.data;
                sDataTypeCd(Object.entries(data.typeDesignBom).map(([key, value]) => ({ label: value, value: key })))
            }
            sOnFetchingCd(false)
        })
    }

    useEffect(() => {
        onFetchingCd && _ServerFetchingCd()
    }, [onFetchingCd]);

    const _ServerFetchingName = () => {
        Axios("POST", "/api_web/api_product/searchItems?csrf_protection=true", {
            data: {
                type: "material"
            }
        }, (err, response) => {
            if(!err){

            }
            sOnFetchingName(false)
        })
    }

    useEffect(() => {
        onFetchingName && _ServerFetchingName()
    }, [onFetchingName]);

    const hiddenOptions = valueVariant?.length > 2 ? valueVariant?.slice(0, 2) : [];
    const options = dataRestVariant.filter((x) => !hiddenOptions.includes(x.value));

    const _HandleChangeSelect = (value) => {
        sValueVariant(value)
    }

    const _HandleApplyVariant = () => {
        dataSelectedVariant.push(...valueVariant)
        sTab(dataSelectedVariant[0]?.value)
        sValueVariant([])
    }
    
    useEffect(() => {
        props.isOpen && sTab(dataSelectedVariant[0]?.value)
    }, [dataSelectedVariant.length > 0]);

    
    const _HandleAddNew =  (id) => {
        const index = dataSelectedVariant.findIndex(obj => obj.value === id);
        const newData = [...dataSelectedVariant]
        newData[index] = {...newData[index], child: [...newData[index].child, { id: Date.now(), type: null, name: null, dataName: [], unit: null, norm: 0, loss: 0, stage: null }]};
        sDataSelectedVariant(newData)
    }

    const _HandleDeleteItemBOM = (parentId, id) => {
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
                const index = dataSelectedVariant.findIndex(obj => obj.value === parentId);
                const newData = [...dataSelectedVariant]
                const newChild = newData[index].child.filter(item => item.id !== id);
                newData[index] = {...newData[index], child: newChild};
                sDataSelectedVariant(newData);
            }
        })
    }

    const _HandleChangeItemBOM = (parentId, childId, type, value) => {
        const newData = dataSelectedVariant.map((parent) => {
            if (parent.value === parentId) {
                const newChild = parent.child.map((child) => {
                    if (child.id === childId) {
                        if(type === "type"){
                            sOnFetchingName(true);
                            return {
                                ...child,
                                "type": value,
                                "dataName": []
                            };
                        }else{
                            return {
                                ...child,
                                [type]: (type === "norm" || type === "loss" ? Number(value.value) : value),
                            };
                        }
                    }
                    return child;
                });
                return {
                    ...parent,
                    child: newChild,
                };
            }
            return parent;
        });
        sDataSelectedVariant(newData);
    }

    const _HandleDeleteBOM = (id) => {
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
                const newData = [...dataSelectedVariant.filter(item => item.value !== id)];
                sDataSelectedVariant(newData);
                sTab(newData[0]?.value)
            }
        })
    }

    useEffect(() => {
        props.isOpen && (tab || dataSelectedVariant) && sSelectedList(dataSelectedVariant.find(item => item.value === tab))
    }, [tab, dataSelectedVariant]);

    return(
        <PopupEdit   
            title={`Thiết kế BOM (${props.code} - ${props.name})`} 
            button={"Thiết kế BOM"} 
            onClickOpen={_ToggleModal.bind(this, true)} 
            open={props.isOpen} 
            onClose={_ToggleModal.bind(this,false)}
            classNameBtn={props.className} 
        >
            <div className="py-4 w-[900px] space-y-2">
                <div className='flex justify-between items-end pb-2'>
                    <div className='w-2/3'>
                        <label className="text-[#344054] font-normal text-sm mb-1 ">{"Chọn biến thể"} <span className="text-red-500">*</span></label>
                        <Select   
                            closeMenuOnSelect={false}
                            placeholder={"Biến thể"}
                            options={options}
                            isSearchable={true}
                            onChange={_HandleChangeSelect.bind(this)}
                            noOptionsMessage={() => "Không có dữ liệu"}
                            value={valueVariant}
                            maxMenuHeight="200px"
                            isClearable={true} 
                            isMulti
                            menuPortalTarget={document.body}
                            onMenuOpen={handleMenuOpen}
                            components={{ MultiValue }}
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
                        />
                    </div>
                    <button onClick={_HandleApplyVariant.bind(this)} className='disabled:grayscale outline-none px-4 py-2 rounded-lg bg-[#E2F0FE] text-sm font-medium hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition'>{props.dataLang?.apply || "apply"}</button>
                </div>
                {dataSelectedVariant?.length > 0 &&
                    <div className='pb-2 flex space-x-3 items-center justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
                        {dataSelectedVariant.map(e => 
                            <button key={e.value} onClick={_HandleSelectTab.bind(this, e.value)} className={`${tab == e.value ? "text-[#0F4F9E] bg-[#0F4F9E10]" : "hover:text-[#0F4F9E] bg-slate-50/50" } outline-none min-w-fit pl-3 pr-10 py-1.5 rounded relative flex items-center`}>
                                <span>{e.label}</span>
                                <button type='button' onClick={_HandleDeleteBOM.bind(this, e.value)} className='text-red-500 absolute right-0 px-2'><IconDelete /></button>
                            </button>
                        )}
                    </div>
                }
                <div className='space-y-1 -pt-5'>
                    <div className="flex w-full items-center bg-slate-100 p-2 z-10">
                        <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase w-[5%] font-[400] text-center">{"Stt"}</h4>
                        <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase w-[37%] font-[400]">{"Tên thành phần BOM"}</h4>
                        <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase w-[11%] font-[400] text-center">{"Đơn vị"}</h4>
                        <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase w-[12%] font-[400] text-left">{"Định mức"}</h4>
                        <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase w-[12%] font-[400] text-left">{"% Hao hụt"}</h4>
                        <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase w-[23%] font-[400] text-left">{"Công đoạn sử dụng"}</h4>
                        <h4 className="xl:text-[13.5px] text-[12px] px-1 text-[#667085] uppercase w-[10%] font-[400] text-center">{"Thao tác"}</h4>
                    </div>
                    <ScrollArea className="min-h-[0px] max-h-[550px] overflow-hidden" speed={1} smoothScrolling={true}>
                        <div className='divide-y divide-slate-100'>
                            {selectedList?.child.map((e, index) =>
                                <div key={e.id} className='py-1 px-2 flex w-full hover:bg-slate-100 items-center'>
                                    <h6 className='w-[5%] px-1 text-center'>{index + 1}</h6>
                                    <div className='w-[37%] flex space-x-2 px-1'>
                                        <Select 
                                            options={dataTypeCd}
                                            value={e.type}
                                            onChange={_HandleChangeItemBOM.bind(this, selectedList?.value, e.id, "type")}
                                            isClearable={true}
                                            placeholder={"Loại"}
                                            noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                            menuPortalTarget={document.body}
                                            onMenuOpen={handleMenuOpen}
                                            classNamePrefix="Select"
                                            className={`Select__custom border-transparent placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px] `} 
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
                                        <Select 
                                            options={e.type && dataOptType}
                                            value={e.name}
                                            onChange={_HandleChangeItemBOM.bind(this, selectedList?.value, e.id, "name")}
                                            isClearable={true}
                                            placeholder={"Tên"}
                                            noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                            menuPortalTarget={document.body}
                                            onMenuOpen={handleMenuOpen}
                                            className={`border-transparent placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                    </div>
                                    <h6 className="w-[11%] px-1 text-center">Đơn vị</h6>
                                    <div className="w-[12%] px-1">
                                        <NumericFormat value={e?.norm} onValueChange={_HandleChangeItemBOM.bind(this, selectedList?.value, e.id, "norm")} thousandSeparator="," placeholder={"Định mức"} className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} />
                                    </div>
                                    <div className="w-[12%] px-1">
                                        <NumericFormat isAllowed={(values) => { const {floatValue} = values; return floatValue >= 0 &&  floatValue <= 100; }} value={e?.loss} onValueChange={_HandleChangeItemBOM.bind(this, selectedList?.value, e.id, "loss")} suffix="%" thousandSeparator="," placeholder={"% Hao hụt"} className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} />
                                    </div>
                                    <div className="w-[23%] px-1">
                                        <Select 
                                            // options={dataOptType}
                                            // value={type}
                                            // onChange={_HandleChangeInput.bind(this, "type")}
                                            isClearable={true}
                                            placeholder={"Công đoạn sử dụng"}
                                            noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                                            menuPortalTarget={document.body}
                                            onMenuOpen={handleMenuOpen}
                                            className={`border-transparent placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`} 
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
                                    </div>
                                    <div className="w-[10%] px-1 text-center">
                                        <button onClick={_HandleDeleteItemBOM.bind(this, selectedList?.value, e.id)} type='button' className='text-red-500'><IconDelete /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    {dataSelectedVariant?.length > 0 &&
                        <button onClick={_HandleAddNew.bind(this, selectedList?.value)} type='button' title='Thêm' className={`hover:text-[#0F4F9E] hover:bg-[#e2f0fe] transition mt-5 w-full min-h-[100px] h-35 rounded-[5.5px] bg-slate-100 flex flex-col justify-center items-center`}><IconAdd />{"Thêm thiết kế BOM"}</button> 
                    }
                </div>
                <div className="text-right mt-5 space-x-2">
                    <button type='button' onClick={_ToggleModal.bind(this,false)} className="button text-[#344054]  font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                    >{props.dataLang?.branch_popup_exit}</button>
                    <button type="submit" className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]">{props.dataLang?.branch_popup_save}</button>
                </div>
          </div>    
        </PopupEdit>
    )
})

export default Index;
