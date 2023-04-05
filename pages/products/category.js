import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import {_ServerInstance as Axios} from '/services/axios';
import PopupEdit from "/components/UI/popup";
import Pagination from '/components/UI/pagination';
import Loading from "components/UI/loading";

import { 
    Minus as IconMinus, SearchNormal1 as IconSearch, ArrowDown2 as IconDown, Trash as IconDelete, Edit as IconEdit,
    Grid6 as IconExcel
} from "iconsax-react";
import Select, { components } from 'react-select';
import Swal from "sweetalert2";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

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
    const overflow = getValue().slice(maxToShow).map((x) => x.label);
  
    return index < maxToShow ? (
        <components.MultiValue {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
})

const CustomSelectOption = ({value, label, level}) => (
    <div className='flex space-x-2 truncate'>
        {level == 1 && <span>--</span>}
        {level == 2 && <span>----</span>}
        {level == 3 && <span>------</span>}
        {level == 4 && <span>--------</span>}
        <span className="2xl:max-w-[300px] max-w-[150px] w-fit truncate">{label}</span>
    </div>
)

const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    const dispatch = useDispatch()
    
    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingAnother, sOnFetchingAnother] = useState(false);
    const [onFetchingSub, sOnFetchingSub] = useState(false);

    const [data, sData] = useState([]);
    //Bộ lọc Chi nhánh
    const [dataBranchOption, sDataBranchOption] = useState([]);
    const [idBranch, sIdBranch] = useState(null);
    //Bộ lọc Chức vụ
    const [dataPositionOption, sDataPositionOption] = useState([]);
    const [idPosition, sIdPosition] = useState(null);

    const [totalItems, sTotalItems] = useState({});
    const [keySearch, sKeySearch] = useState("")
    const [limit, sLimit] = useState(15);

    const _ServerFetching = () => {
        Axios("GET", "/api_web/api_staff/position/?csrf_protection=true", {
            params: {
                search: keySearch,
                limit: limit,
                page: router.query?.page || 1,
                "filter[id]": idPosition?.value ? idPosition?.value : null,
                "filter[branch_id][]": idBranch?.length > 0 ? idBranch.map(e => e.value) : null
            }
        }, (err, response) => {
            if(!err){
                var {output, rResult} = response.data;
                sData(rResult);
                sTotalItems(output);
            }
            sOnFetching(false)
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true)
    }, [limit,router.query?.page, idPosition, idBranch]);

    const paginate = pageNumber => {
        router.push({
            pathname: router.route,
            query: { page: pageNumber }
        })
    }

    const _HandleFilterOpt = (type, value) => {
        if(type == "position"){
            sIdPosition(value)
        }else if(type == "branch"){
            sIdBranch(value)
        }
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

    const _ServerFetchingSub = () => {
        Axios("GET", "/api_web/api_staff/positionOption?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                sDataPositionOption(rResult.map(e => ({label: e.name, value: e.id, level: e.level})))
                dispatch({type: "position_staff/update", payload: rResult.map(e => ({label: e.name, value: e.id, level: e.level}))})
            }
            sOnFetchingSub(false)
        })
    }

    useEffect(() => {
        onFetchingSub && _ServerFetchingSub()
    }, [onFetchingSub]);

    const _ServerFetchingAnother = () => {
        Axios("GET", "/api_web/Api_Branch/branch/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                sDataBranchOption(rResult.map(e => ({label: e.name, value: e.id})))
                dispatch({type: "branch/update", payload: rResult.map(e => ({label: e.name, value: e.id}))})
            }
        })
        Axios("GET", "/api_web/api_staff/department/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                dispatch({type: "department_staff/update", payload: rResult.map(e => ({label: e.name, value: e.id}))})
            }
        })
    }

    useEffect(() => {
        onFetchingAnother && _ServerFetchingAnother()
    }, [onFetchingAnother]);

    useEffect(() => {
        sOnFetchingAnother(true)
        sOnFetchingSub(true)
    }, []);

    //Set data cho bộ lọc chi nhánh
    const hiddenOptions = idBranch?.length > 2 ? idBranch?.slice(0, 2) : [];
    const options = dataBranchOption.filter((x) => !hiddenOptions.includes(x.value));

    const multiDataSet = [
        {
            columns: [
                {title: "ID", width: {wch: 4}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.category_material_group_code || "category_material_group_code"}`, width: {wpx: 150}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.category_material_group_name || "category_material_group_name"}`, width: {wch: 30}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.note || "note"}`, width: {wch: 30}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
                {title: `${dataLang?.client_list_brand || "client_list_brand"}`, width: {wch: 40}, style: {fill: {fgColor: {rgb: "C7DFFB"}}, font: {bold: true}}},
            ],
            data: data.map((e) => 
                [
                    {value: `${e.id}`, style: {numFmt: "0"}},
                    {value: `${e.name}`},
                    {value: `${e.name}`},
                    {value: `${e.department_name}`},
                    {value: `${JSON.stringify(e.branch.map(e => e.name))}`},
                ]
            ),
        }
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.header_category_finishedProduct_group || "header_category_finishedProduct_group"}</title>
            </Head>
            <div className='px-10 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between'>
                <div className='h-[97%] space-y-3 overflow-hidden'>
                    <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                        <h6 className='text-[#141522]/40'>{dataLang?.list_btn_seting_category}</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 className='text-[#141522]/40'>{dataLang?.header_category_material}</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6>{dataLang?.header_category_finishedProduct_group || "header_category_finishedProduct_group"}</h6>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h2 className='xl:text-3xl text-xl font-medium '>{dataLang?.catagory_finishedProduct_group_title || "catagory_finishedProduct_group_title"}</h2>
                        <div className='flex space-x-3 items-center'>
                            <Popup_ThanhPham dataLang={dataLang} className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105' />
                        </div>
                    </div>
                    <div className='grid grid-cols-4 gap-8 px-0.5'>
                        <div className=''>
                            <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.category_material_group_name || "category_material_group_name"}</h6>
                            <Select 
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
                            />
                        </div>
                        <div>
                            <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.client_list_brand || "client_list_brand"}</h6>
                            <Select 
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
                                <ExcelFile filename={dataLang?.header_category_finishedProduct_group || "header_category_finishedProduct_group"} element={
                                    <button className='xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition'>
                                        <IconExcel size={18} />
                                        <span>{dataLang?.client_list_exportexcel}</span>
                                    </button>
                                }>
                                    <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name={dataLang?.header_category_finishedProduct_group || "header_category_finishedProduct_group"} />
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
                                <h4 className='w-[10%]'/>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300]'>{dataLang?.category_material_group_code || "category_material_group_code"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[300]'>{dataLang?.category_material_group_name || "category_material_group_name"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[300]'>{dataLang?.note || "note"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[25%] font-[300]'>{dataLang?.client_list_brand || "client_list_brand"}</h4>
                                <h4 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[10%] font-[300] text-center'>{dataLang?.branch_popup_properties || "branch_popup_properties"}</h4>
                            </div>
                            <div className='divide-y divide-slate-200'>
                                {/* {data.map((e) => <Item onRefresh={_ServerFetching.bind(this)} onRefreshSub={_ServerFetchingSub.bind(this)} dataLang={dataLang} key={e.id} data={e}/>)}
                                {(!onFetching && data?.length == 0) && 
                                    <div className=" max-w-[352px] mt-24 mx-auto" >
                                        <div className="text-center">
                                            <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                                            <h1 className="textx-[#141522] text-base opacity-90 font-medium">Không tìm thấy các mục</h1>
                                        </div>
                                    </div>
                                }
                                {onFetching && <Loading/>} */}
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

const Item = React.memo((props) => {
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
            Axios("DELETE", `/api_web/api_staff/position/${id}?csrf_protection=true`, {
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
              props.onRefreshSub && props.onRefreshSub()
            })     
        }
        })
    }

    useEffect(() => {
        sHasChild(false)
    }, [props.data?.children?.length == null]);

    return(
        <div>
            <div className='flex py-2 px-2 bg-white hover:bg-slate-50'>
                <div className='w-[10%] flex justify-center'>
                    <button disabled={props.data?.children?.length > 0 ? false : true} onClick={_ToggleHasChild.bind(this)} className={`${hasChild ? "bg-red-600" : "bg-green-600 disabled:bg-slate-300"} hover:opacity-80 hover:disabled:opacity-100 transition relative flex flex-col justify-center items-center h-5 w-5 rounded-full text-white outline-none`}>
                        <IconMinus size={16} />
                        <IconMinus size={16} className={`${hasChild ? "" : "rotate-90"} transition absolute`} />
                    </button>
                </div>
                <h6 className='xl:text-base text-xs px-2 w-[20%]'>{props.data?.name}</h6>
                <h6 className='xl:text-base text-xs px-2 w-[15%] text-center'>Thành viên</h6>
                <h6 className='xl:text-base text-xs px-2 w-[20%]'>{props.data?.department_name}</h6>
                <div className='flex flex-wrap px-2 w-[25%]'>
                    {props.data?.branch.map(e => 
                        <h6 key={e?.id.toString()} className='text-[15px] mr-1 mb-1 py-[1px] px-1.5 text-[#0F4F9E] font-[300] rounded border border-[#0F4F9E] h-fit'>{e?.name}</h6>
                    )}
                </div>
                <div className='flex justify-center space-x-2 w-[10%] px-2'>
                    <Popup_ChucVu onRefresh={props.onRefresh} onRefreshSub={props.onRefreshSub} dataLang={props.dataLang} id={props.data?.id} />
                    <button onClick={_HandleDelete.bind(this, props.data?.id)} className="xl:text-base text-xs outline-none"><IconDelete color="red"/></button>
                </div>
            </div>
            {hasChild &&
                <div className='bg-slate-50/50'>
                    {props.data?.children?.map((e) => 
                        <ItemsChild onClick={_HandleDelete.bind(this, e.id)} onRefresh={props.onRefresh} dataLang={props.dataLang} key={e.id} data={e}  grandchild="0"
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
                {props.data?.level == "3" && 
                    <div className='w-[10%] h-full flex justify-center items-center pl-24'>
                        <IconDown className='rotate-45' />
                    </div>
                }
                {props.data?.level == "2" && 
                    <div className='w-[10%] h-full flex justify-center items-center pl-12'>
                        <IconDown className='rotate-45' />
                        <IconMinus className='mt-1.5' />
                        <IconMinus className='mt-1.5' />
                    </div>
                }
                {props.data?.level == "1" && 
                    <div className='w-[10%] h-full flex justify-center items-center '>
                        <IconDown className='rotate-45' />
                        <IconMinus className='mt-1.5' />
                        <IconMinus className='mt-1.5' />
                        <IconMinus className='mt-1.5' />
                        <IconMinus className='mt-1.5' />
                    </div>
                }
                <h6 className='xl:text-base text-xs px-2 w-[20%]'>{props.data?.name}</h6>
                <h6 className='xl:text-base text-xs px-2 w-[15%] text-center'>0</h6>
                <h6 className='xl:text-base text-xs px-2 w-[20%]'>{props.data?.department_name}</h6>
                <div className='w-[25%] flex flex-wrap px-2'>
                    {props.data?.branch.map(e => 
                        <h6 key={e?.id.toString()} className='text-[15px] mr-1 mb-1 py-[1px] px-1.5 text-[#0F4F9E] font-[300] rounded border border-[#0F4F9E] h-fit'>{e?.name}</h6>
                    )}
                </div>
                <div className='w-[10%] flex justify-center space-x-2'>
                    {/* <Popup_NVL onRefresh={props.onRefresh} dataLang={props.dataLang} data={props.data} /> */}
                    <button onClick={props.onClick} className="xl:text-base text-xs"><IconDelete color="red"/></button>
                </div>
            </div>
            {props.children}
        </React.Fragment>
    )
})

const Popup_ThanhPham = React.memo((props) => {
    const dataOptBranch = useSelector(state => state.branch);
    const dataOptDepartment = useSelector(state => state.department_staff);
    const dataOptPosition = useSelector(state => state.position_staff);

    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const [dataOption, sDataOption] = useState([]);

    const [onSending, sOnSending] = useState(false);
    const [onFetching, sOnFetching] = useState(false);

    const [name, sName] = useState("");
    const [code, sCode] = useState("");
    const [note, sNote] = useState("");
    const [branch, sBranch] = useState([]);
    const branch_id = branch?.map(e => e.value)

    const [errBranch, sErrBranch] = useState(false);
    const [errName, sErrName] = useState(false);
    const [errCode, sErrCode] = useState(false);

    useEffect(() => {
        open && sErrBranch(false);
        open && sErrName(false);
        open && sErrCode(false);
        open && sName("");
        open && sCode("");
        open && sNote("");
        open && sBranch([]);
        open && sDataOption([]);
        open && props?.id && sOnFetching(true)
    }, [open]);

    const _HandleChangeInput = (type, value) => {
        if(type == "name"){
            sName(value?.target.value)
        }else if(type == "code"){
            sPosition(value?.value)
        }else if(type == "note"){
            sDepartment(value?.value)
        }else if(type == "branch"){
            sBranch(value)
        }
    }

    const _ServerSending = () => {
        var formData = new FormData()

        formData.append("name", name)
        formData.append("position_parent_id", position)
        formData.append("department_id", department)
        branch_id.forEach(id => formData.append('branch_id[]', id));

        Axios("POST", `${props?.id ? `/api_web/api_staff/position/${props?.id}?csrf_protection=true` : "/api_web/api_staff/position?csrf_protection=true"}`, {
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
                    sOpen(false)
                    sName("")
                    sPosition(null)
                    sDepartment(null)
                    sBranch([])
                    props.onRefresh && props.onRefresh()
                    props.onRefreshSub && props.onRefreshSub()
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
        if(name?.length == 0 || code?.length == 0 || branch?.length == 0){
            name?.length == 0 && sErrName(true);
            code?.length == 0 && sErrCode(true);
            branch?.length == 0 && sErrBranch(true);
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
        sErrBranch(false)
    }, [branch?.length > 0]);

    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_staff/position/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if(!err){
                var list = response.data;
                sName(list?.name)
                sDepartment(list?.department_id)
                sPosition(list?.position_parent_id)
                sBranch(list?.branch.map(e => ({label: e.name, value: e.id})))
            }
        })
        Axios("GET", `/api_web/api_staff/positionOption/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if(!err){
                var {rResult} = response.data;
                sDataOption(rResult.map(x => ({label: x.name, value: x.id, level: x.level})))
            }
        })
        sOnFetching(false)
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    return(
        <PopupEdit  
            title={props?.id ? `${props.dataLang?.catagory_finishedProduct_group_edit || "catagory_finishedProduct_group_edit"}` : `${props.dataLang?.catagory_finishedProduct_group_addnew || "catagory_finishedProduct_group_addnew"}`} 
            button={props?.id ? <IconEdit/> : `${props.dataLang?.branch_popup_create_new}`} 
            onClickOpen={_ToggleModal.bind(this, true)} 
            open={open} 
            onClose={_ToggleModal.bind(this,false)}
            classNameBtn={props.className}
        >
            <div className='py-4 w-[600px] space-y-5'>
                <div className='space-y-1'>
                    <label className="text-[#344054] font-normal text-base">{props.dataLang?.client_list_brand || "client_list_brand"} <span className='text-red-500'>*</span></label>
                    <Select 
                        options={dataOptBranch}
                        // formatOptionLabel={CustomSelectOption}
                        value={branch}
                        onChange={_HandleChangeInput.bind(this, "branch")}
                        isClearable={true}
                        placeholder={props.dataLang?.client_list_brand || "client_list_brand"}
                        isMulti
                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                        closeMenuOnSelect={false}
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
                            })
                        }}
                    />
                    {errBranch && <label className="text-sm text-red-500">{props.dataLang?.client_list_bran || "client_list_bran"}</label>}
                </div>
                <div className='space-y-1'>
                    <label className="text-[#344054] font-normal text-base">{props.dataLang?.category_material_group_code} <span className='text-red-500'>*</span></label>
                    <input value={code} onChange={_HandleChangeInput.bind(this, "code")} type="text" placeholder={props.dataLang?.category_material_group_code} className={`${errCode ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                    {errCode && <label className="text-sm text-red-500">{props.dataLang?.category_material_group_err_code}</label>}
                </div>
                <div className='space-y-1'>
                    <label className="text-[#344054] font-normal text-base">{props.dataLang?.category_material_group_name} <span className='text-red-500'>*</span></label>
                    <input value={name} onChange={_HandleChangeInput.bind(this, "name")} type="text" placeholder={props.dataLang?.category_material_group_name} className={`${errName ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                    {errName && <label className="text-sm text-red-500">{props.dataLang?.category_material_group_err_name}</label>}
                </div>
                <div className='space-y-1'>
                    <label className="text-[#344054] font-normal text-base">{props.dataLang?.category_material_group_level}</label>
                    {/* <Select 
                        options={dataOption}
                        formatOptionLabel={CustomSelectOption}
                        defaultValue={(idCategory == "0" || !idCategory) ? {label: `${props.dataLang?.category_material_group_level}`} : {label: dataOption.find(x => x?.parent_id == idCategory)?.label, code:dataOption.find(x => x?.parent_id == idCategory)?.code, value: idCategory}}
                        value={(idCategory == "0" || !idCategory) ? {label: "Nhóm cha", code: "nhóm cha"} : {label: dataOption.find(x => x?.value == idCategory)?.label, code:dataOption.find(x => x?.value == idCategory)?.code, value: idCategory}}
                        onChange={valueIdCategory.bind(this)}
                        isClearable={true}
                        placeholder={props.dataLang?.category_material_group_level}
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
                    /> */}
                </div>
                <div className='space-y-1'>
                    <label className="text-[#344054] font-normal text-base">{props.dataLang?.client_popup_note}</label>
                    <textarea 
                        type="text"
                        placeholder={props.dataLang?.client_popup_note}
                        rows={5}
                        value={note}
                        onChange={_HandleChangeInput.bind(this, "note")}
                        className='focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none resize-none'
                    />
                </div>
                <div className='flex justify-end space-x-2'>
                    <button onClick={_ToggleModal.bind(this,false)} className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition">{props.dataLang?.branch_popup_exit}</button>
                    <button onClick={_HandleSubmit.bind(this)} className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#0F4F9E] hover:opacity-90 hover:scale-105 transition">{props.dataLang?.branch_popup_save}</button>
                </div>
            </div>
        </PopupEdit>
    )
})

export default Index;
