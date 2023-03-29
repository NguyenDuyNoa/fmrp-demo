import React, {useState, useEffect, useRef} from 'react';
import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

import {_ServerInstance as Axios} from '/services/axios';
import Loading from "components/UI/loading";
import Pagination from '/components/UI/pagination';
import PopupEdit from "/components/UI/popup";

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

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
})

const CustomSelectOption_GroupNVL = ({value, label, level, code}) => (
    <div className='flex space-x-2 truncate'>
        {level == 1 && <span>--</span>}
        {level == 2 && <span>----</span>}
        {level == 3 && <span>------</span>}
        {level == 4 && <span>--------</span>}
        <span className="2xl:max-w-[300px] max-w-[200px] w-fit truncate">{label}</span>
    </div>
)

const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    const dispatch = useDispatch()

    const [data, sData] = useState([]);
    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingUnit, sOnFetchingUnit] = useState(false);

    //Bộ lọc Danh mục
    const [dataCateOption, sDataCateOption] = useState([]);
    const [idCategory, sIdCategory] = useState(null);
    //Bộ lọc Chi nhánh
    const [dataBranchOption, sDataBranchOption] = useState([]);
    const [idBranch, sIdBranch] = useState(null);

    const _HandleFilterOpt = (type, value) => {
        if(type == "category"){
            sIdCategory(value)
        }else if(type == "branch"){
            sIdBranch(value)
        }
    }

    const [totalItems, sTotalItems] = useState({});
    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);

    const _ServerFetching = () => {
        Axios("GET", "/api_web/api_material/material?csrf_protection=true", {
            params: {
                search: keySearch,
                limit: limit,
                page: router.query?.page || 1,
                "filter[category_id]": idCategory?.value ? idCategory?.value : null,
                "filter[branch_id][]": idBranch?.length > 0 ? idBranch.map(e => e.value) : null
            },
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
        sOnFetching(true) || (keySearch && sOnFetching(true)) || (idCategory && sOnFetching(true)) || (idBranch?.length > 0 && sOnFetching(true))
    }, [limit,router.query?.page, idCategory, idBranch]);

    const _ServerFetchingUnit = () => {
        Axios("GET", "/api_web/Api_unit/unit/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                dispatch({type: "unit_NVL/update", payload: rResult.map(e => ({label: e.unit, value: e.id}))})
            }
        })
        Axios("GET", "/api_web/Api_Branch/branch/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                sDataBranchOption(rResult.map(e => ({label: e.name, value: e.id})))
                dispatch({type: "branch/update", payload: rResult.map(e => ({label: e.name, value: e.id}))})
            }
        })
        Axios("GET", "/api_web/api_material/categoryOption?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                sDataCateOption(rResult.map(x => ({label: `${x.name + " " + "(" + x.code + ")"}`, value: x.id, level: x.level, code: x.code, parent_id: x.parent_id})))
            }
        })
        Axios("GET", "/api_web/Api_variation/variation?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                dispatch({type: "variant_NVL/update", payload: rResult.map(e => ({label: e.name, value: e.id, option: e.option}))})
            }
        })
        sOnFetchingUnit(false)
    }

    useEffect(() => {
        onFetchingUnit && _ServerFetchingUnit()
    }, [onFetchingUnit]);

    useEffect(() => {
        sOnFetchingUnit(true)
    }, []);

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
            Axios("DELETE", `/api_web/api_material/material/${id}?csrf_protection=true`, {
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
                _ServerFetching()
            })     
        }
        })
    }

    //Set data cho bộ lọc chi nhánh
    const hiddenOptions = idBranch?.length > 2 ? idBranch?.slice(0, 2) : [];
    const options = dataBranchOption.filter((x) => !hiddenOptions.includes(x.value));

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.header_category_material_list}</title>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between'>
                <div className='h-[97%] space-y-3 overflow-hidden'>
                    <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                        <h6 className='text-[#141522]/40'>{dataLang?.list_btn_seting_category}</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 className='text-[#141522]/40'>{dataLang?.header_category_material}</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6>{dataLang?.header_category_material_list}</h6>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h2 className='xl:text-3xl text-xl font-medium '>{dataLang?.category_material_list_title}</h2>
                        <div className='flex space-x-3 items-center'>
                            <Popup_NVL onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105 outline-none' />
                        </div>
                    </div>
                    <div className='grid grid-cols-4 gap-8'>
                        <div className=''>
                            <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.category_material_group_name}</h6>
                            <Select 
                                options={dataCateOption}
                                formatOptionLabel={CustomSelectOption_GroupNVL}
                                onChange={_HandleFilterOpt.bind(this, "category")}
                                value={idCategory}
                                isClearable={true}
                                placeholder="Chọn tên danh mục" 
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
                        <div className='col-span-1'>
                            <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>Chi nhánh</h6>
                            <Select 
                                options={options}
                                onChange={_HandleFilterOpt.bind(this, "branch")}
                                value={idBranch}
                                isClearable={true}
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                placeholder="Chọn chi nhánh" 
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
                                {/* <ExcelFile filename="nhóm nvl" title="Hiii" element={
                                    <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition'>
                                        <IconExcel size={18} />
                                        <span>{dataLang?.client_list_exportexcel}</span>
                                    </button>
                                }>
                                    <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name="Nhóm NVL" />
                                </ExcelFile> */}

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
                    <div className='min:h-[500px] h-[72%] max:h-[800px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
                        <div className='2xl:w-[110%] w-[120%] pr-2'>
                            <div className='flex items-center sticky top-0 bg-white p-2 z-10 shadow-[-20px_-9px_20px_0px_#0000003d]'>
                                <div className='w-[2%] flex justify-center'>
                                    <input type='checkbox' className='scale-125' />
                                </div>
                                <h4 className='w-[8%] xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase text-center font-[300]'>Hình</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[12%] font-[300]'>tên danh mục</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300]'>mã nguyên vật liệu</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300]'>Tên nguyên vật liệu</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[7%] font-[300] text-center'>Đơn vị</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[6%] font-[300] text-center'>Tồn kho</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center'>Số lượng tối thiểu</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[11%] font-[300]'>Ghi chú</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[6%] font-[300] text-center'>Biến thể</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300]'>Chi nhánh</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[8%] font-[300] text-center'>{dataLang?.branch_popup_properties}</h4>
                            </div>
                            {onFetching ?
                                <Loading className="h-80"color="#0f4f9e" />
                                :
                                <React.Fragment>
                                    {data.length == 0 &&
                                        <div className=" max-w-[352px] mt-24 mx-auto" >
                                            <div className="text-center">
                                                <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                                                <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
                                            </div>
                                        </div>
                                    }
                                    <div className="divide-y divide-slate-200"> 
                                        {data.map((e) => 
                                            <div key={e?.id.toString()} className='flex p-2 hover:bg-slate-50 relative'>
                                                <div className='w-[2%] flex justify-start flex-col items-center mt-3.5'>
                                                    <input type='checkbox' className='scale-125' />
                                                </div>
                                                <div className='w-[8%] pointer-events-none select-none justify-center flex'>
                                                    {e?.images == null ?
                                                        <img src="/no_image.png" className='w-full h-12 rounded object-contain' />
                                                    :
                                                        <Image width={64} height={64} quality={100} src={e?.images} alt="thumb type" className="w-12 h-12 rounded object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/>
                                                    }
                                                </div>
                                                <h6 className='px-2 py-2.5 xl:text-base text-xs w-[12%] '>{e?.category_name}</h6>
                                                <div className='px-2 py-2.5 xl:text-base text-xs w-[15%]'>
                                                    <Popup_ThongTin id={e?.id}>
                                                        <button className=' text-[#0F4F9E] hover:opacity-70 w-fit outline-none'>{e?.code}</button>
                                                    </Popup_ThongTin>
                                                </div>
                                                <h6 className='px-2 py-2.5 xl:text-base text-xs w-[15%]'>{e?.name}</h6>
                                                <h6 className='px-2 py-2.5 xl:text-base text-xs w-[7%] text-center'>{e?.unit}</h6>
                                                <h6 className='px-2 py-2.5 xl:text-base text-xs w-[6%] text-center'>{e?.stock_quantity}</h6>
                                                <h6 className='px-2 py-2.5 xl:text-base text-xs w-[10%] text-center'>{e?.minimum_quantity}</h6>
                                                <h6 className='px-2 py-2.5 xl:text-base text-xs w-[11%]'>{e?.note}</h6>
                                                <h6 className='px-2 py-2.5 xl:text-base text-xs w-[6%] text-center'>biển thể</h6>
                                                <div className='px-2 py-2.5 w-[10%] flex flex-wrap'>
                                                    {e?.branch.map(e => 
                                                        <h6 key={e?.id.toString()} className='text-[15px] mr-1 mb-1 py-[1px] px-1.5 text-[#0F4F9E] font-[500] rounded border border-[#0F4F9E] h-fit'>{e?.name}</h6>
                                                    )}
                                                </div>
                                                <div className='px-2 py-2.5 w-[8%] flex space-x-2 justify-center'>
                                                    <Popup_NVL onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} id={e?.id} className=" outline-none" />
                                                    <button onClick={_HandleDelete.bind(this, e?.id)} className="xl:text-base text-xs outline-none"><IconDelete color="red"/></button>
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

const Popup_NVL = React.memo((props) => {
    const dataOptUnit = useSelector(state => state.unit_NVL);
    const dataOptBranch = useSelector(state => state.branch);
    const dataOptVariant = useSelector(state => state.variant_NVL);

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const [tab, sTab] = useState(0)
    const _HandleSelectTab = (e) => sTab(e)

    const [onSending, sOnSending] = useState(false);
    ///Fetching Nhóm NVL dựa vào chi nhánh
    const [onFetchingGroup, sOnFetchingGroup] = useState(false);
    ///Fetching lấy dữ liệu khi truyền id vào
    const [onFetching, sOnFetching] = useState(false);

    const [branch, sBranch] = useState([]);
    const branch_id = branch.map(e => e.value)
    
    const [dataOptGr, sDataOptGr] = useState([]);
    const [groupId, sGroupId] = useState();
    const [code, sCode] = useState("");
    const [name, sName] = useState("");
    const [minimumAmount, sMinimumAmount] = useState();
    const [price, sPrice] = useState();
    const [expiry, sExpiry] = useState();

    const [unit, sUnit] = useState();
    const [unitChild, sUnitChild] = useState();
    const [unitAmount, sUnitAmount] = useState();
    const [note, sNote] = useState("");

    const [thumb, sThumb] = useState(null);
    const [thumbFile, sThumbFile] = useState(null);
    const [isDeleteThumb, sIsDeleteThumb] = useState(false);

    ///Biến thể
    const [variantMain, sVariantMain] = useState(null);
    const [variantSub, sVariantSub] = useState(null);
    const [optVariantMain, sOptVariantMain] = useState([]);
    const [optVariantSub, sOptVariantSub] = useState([]);
    const [optSelectedVariantMain, sOptSelectedVariantMain] = useState([]);
    const [optSelectedVariantSub, sOptSelectedVariantSub] = useState([]);

    const [dataTotalVariant, sDataTotalVariant] = useState([]);

    useEffect(() => {
        sOptVariantMain(dataOptVariant?.find(e => e.value == variantMain)?.option)
        variantMain && sOptSelectedVariantMain([])
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
        variantSub && sOptSelectedVariantSub([])
        !variantSub && sOptSelectedVariantSub([])
        if(variantSub === variantMain && variantSub != null && variantMain != null){
            sVariantSub(null)
            Toast.fire({
                icon: 'error',
                title: `Biến thể bị trùng`
            })
        }
    }, [variantSub]);

    const _HandleSelectedVariant = (type, event) => {
        if(type == "main"){
            const value = event?.target.value;
            const id = event?.target.id;
            if (event?.target.checked) {
                // Thêm giá trị và id vào mảng khi input được chọn
                const updatedOptions = [...optSelectedVariantMain, { value, id }];
                sOptSelectedVariantMain(updatedOptions);
            } else {
                // Xóa giá trị và id khỏi mảng khi input được bỏ chọn
                const updatedOptions = optSelectedVariantMain.filter(option => option.id !== id);
                sOptSelectedVariantMain(updatedOptions);
            }
        }else if(type == "sub"){
            const value = event?.target.value;
            const id = event?.target.id;
            if (event?.target.checked) {
                const updatedOptions = [...optSelectedVariantSub, { value, id }];
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
                ...optSelectedVariantMain?.length > 0 ? optSelectedVariantMain?.map((item1) => ({...item1, image: null, sku: null, option: optSelectedVariantSub?.map((item2) => ({...item2, sku: null}))})) : optSelectedVariantSub?.map((item2) => ({...item2}))
            ])
        }else {
            Toast.fire({
                icon: 'error',
                title: `Phải chọn tùy chọn của biến thể chính`
            })
        }
    }

    const [errGroup, sErrGroup] = useState(false);
    const [errName, sErrName] = useState(false);
    const [errCode, sErrCode] = useState(false);
    const [errUnit, sErrUnit] = useState(false);
    const [errBranch, sErrBranch] = useState(false);

    useEffect(() => {
        open && sTab(0)
        open && sGroupId()
        open && sCode("")
        open && sName("")
        open && sMinimumAmount()
        open && sPrice()
        open && sExpiry()
        open && sUnit()
        open && sUnitChild()
        open && sUnitAmount()
        open && sNote("")
        open && sThumb(null)
        open && sThumbFile(null)
        open && sBranch([])
        open && props?.id && sOnFetching(true)
        open && sDataTotalVariant([])
        open && sVariantMain(null)
        open && sVariantSub(null)
    }, [open]);

    const _HandleChangeInput = (type, value) => {
        if(type == "name") {
            sName(value.target?.value)
        }else if(type == "code") {
            sCode(value.target?.value)
        }else if(type == "price") {
            sPrice(Number(value.value))
        }else if(type == "minimumAmount") {
            sMinimumAmount(Number(value.value))
        }else if(type == "expiry") {
            sExpiry(Number(value.value))
        }else if(type == "unitAmount") {
            sUnitAmount(Number(value.value))
        }else if(type == "note") {
            sNote(value.target?.value)
        }else if(type == "group") {
            sGroupId(value?.value)
        }else if(type == "unit") {
            sUnit(value?.value)
        }else if(type == "unitChild") {
            sUnitChild(value?.value)
        }else if(type == "branch") {
            sBranch(value)
        }else if(type == "variantMain") {
            sVariantMain(value?.value)
        }else if(type == "variantSub") {
            sVariantSub(value?.value)
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

    const _ServerSending = () => {
        var formData = new FormData();

        formData.append("code", code)
        formData.append("name", name)
        formData.append("import_price", price)
        formData.append("minimum_quantity", minimumAmount)
        formData.append("expiry", expiry)
        formData.append("note", note)
        formData.append("category_id", groupId)
        formData.append("unit_id", unit)
        formData.append("unit_convert_id", unitChild)
        formData.append("coefficient", unitAmount)
        formData.append("images", thumbFile)
        formData.append("is_delete_image ", isDeleteThumb)
        branch_id.forEach(id => formData.append('branch_id[]', id));

        for (let i = 0; i < dataTotalVariant.length; i++) {
            const item = dataTotalVariant[i];
      
            formData.set(`variation_option_value[${i}][variation_option_1_id]`, item.id);
            formData.set(`variation_option_value[${i}][image]`, item.image || '');
      
            if(item.option?.length > 0){
                for (let j = 0; j < item.option?.length; j++) {
                    const subItem = item.option[j];
                    formData.set(`variation_option_value[${i}][variation_option_2][${j}][id]`, subItem.id);
                    formData.set(`variation_option_value[${i}][variation_option_2][${j}][sku]`, subItem.sku);
                }
            }else{
                formData.set(`variation_option_value[${i}][sku]`, item.sku);
            }
        }

        Axios("POST", `${props?.id ? `/api_web/api_material/material/${props.id}?csrf_protection=true` : "/api_web/api_material/material?csrf_protection=true"}`, {
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
                    sOpen(false)
                    props.onRefresh && props.onRefresh()
                    sGroupId()
                    sCode("")
                    sName("")
                    sMinimumAmount()
                    sPrice()
                    sExpiry()
                    sUnit()
                    sUnitChild()
                    sUnitAmount()
                    sNote("")
                    sThumb(null)
                    sThumbFile(null)
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

    const _HandleSubmit = (e) => {
        e.preventDefault();
        if(name?.length == 0 || code?.length == 0 || groupId == null || unit == null || branch.length == 0){
            name?.length == 0 && sErrName(true);
            code?.length == 0 && sErrCode(true);
            groupId == null && sErrGroup(true);
            unit == null && sErrUnit(true);
            branch.length == 0 && sErrBranch(true);
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

    useEffect(() => {
        sErrGroup(false)
    }, [groupId != null]);

    useEffect(() => {
        sErrUnit(false)
    }, [unit != null]);

    useEffect(() => {
        sErrBranch(false)
    }, [branch.length > 0]);

    const _ServerFetchingGroup = () => {
        Axios("GET", "/api_web/api_material/categoryOption?csrf_protection=true", {
            params: {
                "branch_id[]": branch_id.length > 0 ? branch_id : -1
            }
        }, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                sDataOptGr(rResult.map(e => ({label: e.name + " " + "(" + e.code + ")", value: e.id, level: e.level})));
            }
            sOnFetchingGroup(false)
        })
    }

    useEffect(() => {
        onFetchingGroup && _ServerFetchingGroup()
    }, [onFetchingGroup]);

    useEffect(() => {
        setTimeout(() => {
            open && sOnFetchingGroup(true)
        }, 500);
    }, [branch]);

    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_material/material/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if(!err){
                var data = response.data
                sName(data?.name)
                sCode(data?.code)
                sNote(data?.note)
                sPrice(Number(data?.import_price))
                sMinimumAmount(Number(data?.minimum_quantity))
                sGroupId(data?.category_id)
                sExpiry(Number(data?.expiry))
                sUnitAmount(Number(data?.coefficient))
                sThumb(data?.images)
                sUnit(data?.unit_id)
                sUnitChild(data?.unit_convert_id)
                sBranch(data?.branch.map(e => ({label: e.name, value: e.id})))
            }
            sOnFetching(false)
        })
    }
    
    useEffect(() => {
        setTimeout(() => {
            onFetching && _ServerFetching()
        }, 1500);
    }, [onFetching]);

    const _HandleChangeVariant = (id, type, value) => {
        var index = dataTotalVariant?.findIndex(x => x.id === id);
        if(type === "image"){
            dataTotalVariant[index].image = value.target?.files[0];
            sDataTotalVariant([...dataTotalVariant])
        }else if(type === "sku"){
            dataTotalVariant[index].sku = value.target?.value;
            sDataTotalVariant([...dataTotalVariant])
        }
    }

    const _HandleChangeSku = (parentId, id, value) => {
        var parentIndex = dataTotalVariant?.findIndex(x => x.id === parentId);
        var index = dataTotalVariant[parentIndex].option.findIndex(x => x.id === id)
        dataTotalVariant[parentIndex].option[index].sku = value.target?.value;
        sDataTotalVariant([...dataTotalVariant])
    }

    console.log(dataTotalVariant)

    return(
        <PopupEdit  
            title={props?.id ? `${props.dataLang?.category_material_list_edit}` : `${props.dataLang?.category_material_list_addnew}`} 
            button={props?.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
            onClickOpen={_ToggleModal.bind(this, true)} 
            open={open} 
            onClose={_ToggleModal.bind(this,false)}
            classNameBtn={props.className}
        >
            <div className='py-4 w-[800px] space-y-5'>
                <div className='flex items-center space-x-4 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
                    <button onClick={_HandleSelectTab.bind(this, 0)} className={`${tab === 0 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>Thông tin</button>
                    <button onClick={_HandleSelectTab.bind(this, 1)} className={`${tab === 1 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>Biến thể</button>
                </div>
                <ScrollArea className="max-h-[600px]" speed={1} smoothScrolling={true} ref={scrollAreaRef}>
                    {onFetching ? 
                        <Loading className="h-80"color="#0f4f9e" />
                        :
                        <React.Fragment>
                            {tab === 0 &&
                                <div className='grid grid-cols-2 gap-5'>
                                    <div className='space-y-3'>
                                        <div className='space-y-1'>
                                            <label className="text-[#344054] font-normal text-base">Chi nhánh <span className='text-red-500'>*</span></label>
                                            <Select 
                                                options={dataOptBranch}
                                                formatOptionLabel={CustomSelectOption_GroupNVL}
                                                value={branch}
                                                onChange={_HandleChangeInput.bind(this, "branch")}
                                                isClearable={true}
                                                placeholder={"Chi nhánh"}
                                                isMulti
                                                noOptionsMessage={() => "Không có dữ liệu"}
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
                                            {errBranch && <label className="text-sm text-red-500">Vui lòng chọn chi nhánh</label>}
                                        </div>
                                        <div className='space-y-1'>
                                            <label className="text-[#344054] font-normal text-base">{props.dataLang?.header_category_material_group} <span className='text-red-500'>*</span></label>
                                            <Select 
                                                options={dataOptGr}
                                                formatOptionLabel={CustomSelectOption_GroupNVL}
                                                value={groupId ? {label: dataOptGr?.find(x => x?.value == groupId)?.label, value: groupId} : null}
                                                onChange={_HandleChangeInput.bind(this, "group")}
                                                isClearable={true}
                                                noOptionsMessage={() => "Không có dữ liệu"}
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
                                            />
                                            {errGroup && <label className="text-sm text-red-500">{props.dataLang?.category_material_list_err_group}</label>}
                                        </div>
                                        <div className='space-y-1'>
                                            <label className="text-[#344054] font-normal text-base">{props.dataLang?.category_material_list_code} <span className='text-red-500'>*</span></label>
                                            <input value={code} onChange={_HandleChangeInput.bind(this, "code")} type="text" placeholder={props.dataLang?.category_material_list_code} className={`${errCode ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                                            {errCode && <label className="text-sm text-red-500">{props.dataLang?.category_material_list_err_code}</label>}
                                        </div>
                                        <div className='space-y-1'>
                                            <label className="text-[#344054] font-normal text-base">{props.dataLang?.category_material_list_name} <span className='text-red-500'>*</span></label>
                                            <input value={name} onChange={_HandleChangeInput.bind(this, "name")} type="text" placeholder={props.dataLang?.category_material_list_name} className={`${errName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                                            {errName && <label className="text-sm text-red-500">{props.dataLang?.category_material_list_err_name}</label>}
                                        </div>
                                        <div className='space-y-1'>
                                            <label className="text-[#344054] font-normal text-base">Giá nhập</label>
                                            <NumericFormat thousandSeparator="," value={price} onValueChange={_HandleChangeInput.bind(this, "price")} placeholder={"Giá nhập"} className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} />
                                        </div>
                                        <div className='space-y-1'>
                                            <label className="text-[#344054] font-normal text-base">Số lượng tối thiểu</label>
                                            <NumericFormat thousandSeparator="," value={minimumAmount} onValueChange={_HandleChangeInput.bind(this, "minimumAmount")} placeholder={"Số lượng tối thiểu"} className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} />
                                        </div>
                                        <div className='space-y-1'>
                                            <label className="text-[#344054] font-normal text-base">Thời hạn sử dụng</label>
                                            <div className='relative flex flex-col justify-center items-center'>
                                                <NumericFormat thousandSeparator="," value={expiry} onValueChange={_HandleChangeInput.bind(this, "expiry")} placeholder={"Thời hạn sử dụng"} className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 pr-14 border outline-none`} />
                                                <span className='absolute right-2 text-slate-400 select-none'>Ngày</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='space-y-4'>
                                        <div className='space-y-1'>
                                            <label className="text-[#344054] font-normal text-base">Đơn vị mua <span className='text-red-500'>*</span></label>
                                            <Select 
                                                options={dataOptUnit}
                                                value={unit ? {label: dataOptUnit?.find(x => x?.value == unit)?.label, value: unit} : null}
                                                onChange={_HandleChangeInput.bind(this, "unit")}
                                                isClearable={true}
                                                placeholder={"Đơn vị mua"}
                                                noOptionsMessage={() => "Không có dữ liệu"}
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                className={`${errUnit ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border`}
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
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                        position: "absolute",
                                                    }),
                                                }}
                                            />
                                            {errUnit && <label className="text-sm text-red-500">{props.dataLang?.category_material_list_err_unit}</label>}
                                        </div>
                                        <div className='space-y-0.5'>
                                            <h5 className="text-[#344054] font-medium text-base">Quy đổi đơn vị trong sản xuất</h5>
                                            <div className='grid grid-cols-2 gap-5'>
                                                <div className='space-y-1'>
                                                    <label className="text-[#344054] font-normal text-sm">Đơn vị</label>
                                                    <Select 
                                                        options={dataOptUnit}
                                                        value={unitChild ? {label: dataOptUnit?.find(x => x?.value == unitChild)?.label, value: unitChild} : null}
                                                        onChange={_HandleChangeInput.bind(this, "unitChild")}
                                                        isClearable={true}
                                                        placeholder={"Đơn vị"}
                                                        noOptionsMessage={() => "Không có dữ liệu"}
                                                        menuPortalTarget={document.body}
                                                        onMenuOpen={handleMenuOpen}
                                                        className="w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none" 
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
                                                            menuPortal: (base) => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                                position: "absolute",
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                                <div className='space-y-1'>
                                                    <label className="text-[#344054] font-normal text-sm">Số lượng quy đổi</label>
                                                    <NumericFormat thousandSeparator="," value={unitAmount} onValueChange={_HandleChangeInput.bind(this, "unitAmount")} placeholder={"Số lượng"} className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal px-2 py-1.5 border outline-none`} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='space-y-1'>
                                            <label className="text-[#344054] font-normal text-base">Hình ảnh đại diện</label>
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
                                        <div className='space-y-1'>
                                            <label className="text-[#344054] font-normal text-base">Ghi chú</label>
                                            <textarea 
                                                value={note}
                                                type="text"
                                                placeholder={props.dataLang?.client_popup_note}
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
                                                <label>Biến thể chính</label>
                                                <Select 
                                                    options={dataOptVariant}
                                                    value={variantMain ? {label: dataOptVariant.find(e => e.value == variantMain)?.label , value: variantMain} : null}
                                                    onChange={_HandleChangeInput.bind(this, "variantMain")}
                                                    isClearable={true}
                                                    placeholder={"Biến thể chính"}
                                                    noOptionsMessage={() => "Không có dữ liệu"}
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
                                                <h5 className='text-slate-400 text-sm'>Các tùy chọn</h5>
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
                                                <div className='flex flex-col space-y-0.5'>
                                                    {optVariantMain?.map(e => 
                                                        <label key={e?.id.toString()} htmlFor={e.id} className='w-full space-x-2 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 rounded cursor-pointer'>
                                                            <input type="checkbox" id={e.id} value={e.name} checked={optSelectedVariantMain.some((selectedOpt) => selectedOpt.id === e.id)} onChange={_HandleSelectedVariant.bind(this, "main")} className="accent-lime-500" />
                                                            <span>{e.name}</span>
                                                        </label>
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                        <div className='space-y-3'>
                                            <div className='space-y-1'>
                                                <label>Biến thể phụ</label>
                                                <Select 
                                                    options={dataOptVariant}
                                                    value={variantSub ? {label: dataOptVariant.find(e => e.value == variantSub)?.label , value: variantSub} : null}
                                                    onChange={_HandleChangeInput.bind(this, "variantSub")}
                                                    isClearable={true}
                                                    placeholder={"Biến thể phụ"}
                                                    noOptionsMessage={() => "Không có dữ liệu"}
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
                                                <h5 className='text-slate-400 text-sm'>Các tùy chọn</h5>
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
                                                        <label key={e?.id.toString()} htmlFor={e.id} className='w-full space-x-2 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 rounded cursor-pointer'>
                                                            <input type="checkbox" id={e.id} value={e.name} checked={optSelectedVariantSub.some((selectedOpt) => selectedOpt.id === e.id)} onChange={_HandleSelectedVariant.bind(this, "sub")} className="accent-lime-500" />
                                                            <span>{e.name}</span>
                                                        </label>
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                    <div className='flex justify-end'>
                                        <button onClick={_HandleApplyVariant.bind(this)} disabled={(optSelectedVariantMain?.length == 0 && optSelectedVariantSub?.length == 0) ? true : false} className='disabled:grayscale outline-none px-4 py-2 rounded-lg bg-[#E2F0FE] text-sm font-medium hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition'>Áp dụng</button>
                                    </div>
                                    {Object.keys(dataTotalVariant).length !== 0 &&
                                        <div className='space-y-1'>
                                            <h4 className='text-[#344054] font-medium'>Danh sách biến thể</h4>
                                            <div className={`${dataTotalVariant?.option?.length > 0 ? "grid-cols-4" : "grid-cols-3" } grid gap-5 p-1`}>
                                                <h4 className='text-[15px] text-center'>Hình đại diện</h4>
                                                <h4 className='text-[15px]'>Biến thể chính</h4>
                                                {dataTotalVariant?.option?.length > 0 && <h4 className='text-[15px]'>Biến thể phụ</h4>}
                                                <h4 className='text-[15px] text-center'>SKU</h4>
                                            </div>
                                            <ScrollArea className="max-h-[250px]" speed={1} smoothScrolling={true}>
                                                <div className='space-y-0.5'>
                                                    {dataTotalVariant?.map(e => 
                                                        <div className={`${e?.option?.length > 0 ? "grid-cols-4" : "grid-cols-3"} grid gap-5 items-center bg-slate-50 hover:bg-slate-100 p-1`} key={e?.id.toString()}>
                                                            <div className='w-full h-full flex flex-col justify-center items-center'>
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
                                                            <div className=''>{e.name}</div>
                                                            {e?.option?.length > 0 ?
                                                                <div className='col-span-2 grid grid-cols-2 gap-1 items-center'>
                                                                    {e?.option?.map(ce => 
                                                                        <React.Fragment>
                                                                            <div key={ce.id?.toString()}>{ce.name}</div>
                                                                            <input value={ce.sku} onChange={_HandleChangeSku.bind(this, e.id, ce.id)} placeholder='Mã SKU' className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full h-fit bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} />
                                                                        </React.Fragment>
                                                                    )}
                                                                </div>
                                                                :
                                                                <input value={e?.sku} onChange={_HandleChangeVariant.bind(this, e.id, "sku")} placeholder='Mã SKU' className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full h-fit bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} />
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

    const [tab, sTab] = useState(0)
    const _HandleSelectTab = (e) => sTab(e)

    const [onFetching, sOnFetching] = useState(false);
    const [list, sList] = useState({});

    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_material/material/${props.id}?csrf_protection=true`, {}, (err, response) => {
            if(!err){
                sList({...response.data})
            }
            sOnFetching(false)
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    useEffect(() => {
        open && sTab(0)
        open && sOnFetching(true)
    }, [open]);

    return(
        <PopupEdit  
            title={`Xem nguyên vật liệu`} 
            button={props.children} 
            onClickOpen={_ToggleModal.bind(this, true)} 
            open={open} 
            onClose={_ToggleModal.bind(this,false)}
        >
            <div className='py-4 w-[800px] space-y-5'>
                <div className='flex items-center space-x-4 border-[#E7EAEE] border-opacity-70 border-b-[1px]'>
                    <button onClick={_HandleSelectTab.bind(this, 0)} className={`${tab === 0 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>Thông tin</button>
                    <button onClick={_HandleSelectTab.bind(this, 1)} className={`${tab === 1 ?  "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "}  px-4 py-2 outline-none font-semibold`}>Biến thể</button>
                </div>
                {onFetching ? 
                    <Loading className="h-96"color="#0f4f9e" />
                    :
                    <React.Fragment>
                        {tab === 0 ?
                            <div className='grid grid-cols-2 gap-5'>
                                <div className='space-y-3 bg-slate-100/40 p-2 rounded-md'>
                                    <div className='flex justify-between'>
                                        <h5 className='text-slate-400 text-sm w-[40%]'>Chi nhánh:</h5>
                                        <div className='w-[55%] flex flex-col items-end'>
                                            {list?.branch?.map(e => 
                                                <h6 key={e.id.toString()} className='w-[55%] text-right'>{e.name}</h6>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex justify-between'>
                                        <h5 className='text-slate-400 text-sm w-[40%]'>Danh mục:</h5>
                                        <h6 className='w-[55%] text-right'>{list?.category_name}</h6>
                                    </div>
                                    <div className='flex justify-between'>
                                        <h5 className='text-slate-400 text-sm w-[40%]'>Mã nguyên vật liệu:</h5>
                                        <h6 className='w-[55%] text-right'>{list?.code}</h6>
                                    </div>
                                    <div className='flex justify-between'>
                                        <h5 className='text-slate-400 text-sm w-[40%]'>Tên nguyên vật liệu:</h5>
                                        <h6 className='w-[55%] text-right'>{list?.name}</h6>
                                    </div>
                                    <div className='flex justify-between'>
                                        <h5 className='text-slate-400 text-sm w-[40%]'>Giá nhập:</h5>
                                        <h6 className='w-[55%] text-right'>{Number(list?.import_price).toLocaleString()}</h6>
                                    </div>
                                    <div className='flex justify-between'>
                                        <h5 className='text-slate-400 text-sm w-[40%]'>Số lượng tối thiểu:</h5>
                                        <h6 className='w-[55%] text-right'>{Number(list?.minimum_quantity).toLocaleString()}</h6>
                                    </div>
                                    <div className='flex justify-between'>
                                        <h5 className='text-slate-400 text-sm w-[40%]'>Thời hạn sử dụng:</h5>
                                        <h6 className='w-[55%] text-right'>{Number(list?.expiry).toLocaleString()} ngày</h6>
                                    </div>
                                    <div className='flex justify-between'>
                                        <h5 className='text-slate-400 text-sm w-[40%]'>Đơn vị mua:</h5>
                                        <h6 className='w-[55%] text-right'>{list?.unit}</h6>
                                    </div>
                                    <h5 className='text-slate-400 text-[15px] font-medium'>Quy đổi đơn vị trong sản xuất</h5>
                                    <div className='flex justify-between'>
                                        <h5 className='text-slate-400 text-sm w-[40%]'>Đơn vị:</h5>
                                        <h6 className='w-[55%] text-right'>{list?.unit_convert}</h6>
                                    </div>
                                    <div className='flex justify-between'>
                                        <h5 className='text-slate-400 text-sm w-[40%]'>Số lượng quy đổi:</h5>
                                        <h6 className='w-[55%] text-right'>{list?.coefficient}</h6>
                                    </div>
                                </div>
                                <div className='space-y-3 flex flex-col justify-between'>
                                    <div className='flex bg-slate-100/40 p-2 rounded-md'>
                                        <h5 className='text-slate-400 text-sm w-[40%]'>Hình ảnh đại diện:</h5>
                                        {list?.images == null ?
                                            <img src="/no_image.png" className='w-48 h-48 rounded object-contain select-none pointer-events-none' />
                                            :
                                            <Image width={200} height={200} quality={100} src={list?.images} alt="thumb type" className="w-48 h-48 rounded object-contain select-none pointer-events-none" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/>
                                        }
                                    </div>
                                    <div className='bg-slate-100/40 p-2 rounded-md space-y-3'>
                                        <h4 className='flex space-x-2'><IconUserEdit size={20} /><span className='text-[15px] font-medium'>Người lập phiếu</span></h4>
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[30%]'>Người tạo:</h5>
                                            <h6 className='w-[65%] text-right'>ABC</h6>
                                        </div>
                                        <div className='flex justify-between'>
                                            <h5 className='text-slate-400 text-sm w-[30%]'>Ngày tạo:</h5>
                                            <h6 className='w-[65%] text-right'>dasd</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <React.Fragment>
                                {list?.variant ?
                                    <div className='space-y-5'>
                                        <h4 className='text-[#344054] font-medium'>Danh sách biến thể</h4>
                                    </div>
                                    :
                                    <div className="w-full h-96 flex flex-col justify-center items-center" >
                                        <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                                        <h1 className="text-[#141522] text-base opacity-90 font-medium">Không tìm thấy biến thể</h1>
                                    </div>
                                }
                            </React.Fragment>
                        }
                    </React.Fragment>
                }
            </div>
        </PopupEdit>
    )
})


export default Index;
