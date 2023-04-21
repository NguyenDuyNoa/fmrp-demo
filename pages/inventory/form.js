import React, {useState, useEffect, useRef} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';

import {_ServerInstance as Axios} from '/services/axios';
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";

import {Calendar as IconCalendar, Add as IconAdd, Image as IconImage, ArrowDown2 as IconDown, Trash as IconDelete} from "iconsax-react";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import Swal from "sweetalert2";
import { v4 as uuidv4 } from 'uuid';
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});
import {NumericFormat} from "react-number-format";

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
})

const Form = (props) => {
    const dataLang = props.dataLang;
    const dispatch = useDispatch();

    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingPstWH, sOnFetchingPstWH] = useState(false);
    
    const [dataBranch, sDataBranch] = useState([]);
    const [dataWareHouse, sDataWareHouse] = useState([]);
    const voucherdate = new Date();
    const [code, sCode] = useState("");
    const [warehouse, sWarehouse] = useState(null);
    const [branch, sBranch] = useState(null);

    const [errWareHouse, sErrWareHouse] = useState(false);

    const _ServerFetching = () => {
        Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {
            params:{
                limit: 0,
            }
        }, (err, response) => {
            if(!err){
               var {rResult} =  response.data
               sDataBranch(rResult.map(e =>({label: e.name, value: e.id})))
            }
        })
        Axios("GET", "/api_web/api_warehouse/warehouse?filter[is_system]=2&csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} =  response.data
                sDataWareHouse(rResult.map(e =>({label: e.name, value: e.id})))
            }
        })
        sOnFetching(false)
    }
    
    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);
    
    useEffect(() => {
        sOnFetching(true)
    }, []);

    const _HandleChangeValue = (type, value) => {
        if(type === "code"){
            sCode(value?.target.value)
        }else if(type === "warehouse"){
            sWarehouse(value)
        }else if(type === "branch"){
            sBranch(value)
        }
    }

    const _ServerFetchingPstWH = () => {
        Axios("GET", `/api_web/api_warehouse/LocationInWarehouse/${warehouse?.value}?csrf_protection=true`, {}, (err, response) =>{
            if(!err){
                const data = response.data;
                dispatch({type: "vitrikho_kiemke/update", payload: data.map(e => ({label: e.name, value: e.id}))})
            }
            sOnFetchingPstWH(false)
        })
    }

    useEffect(() => {
        onFetchingPstWH && _ServerFetchingPstWH()
    }, [onFetchingPstWH]);
    
    useEffect(() => {
        warehouse !== null && sErrWareHouse(false)
        warehouse !== null && sOnFetchingPstWH(true)
    }, [warehouse]);
    
    return (
        <>
            <Head>
                <title>Thêm phiếu kiểm kê kho</title>
            </Head>
            <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 flex flex-col justify-between'>
                <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                    <h6 className='text-[#141522]/40'>Kiểm kê kho</h6>
                    <span className='text-[#141522]/40'>/</span>
                    <h6>Thêm phiếu kiểm kê kho</h6>
                </div>
                <div className='flex space-x-3 items-center'>
                    <h2 className='xl:text-3xl text-xl font-medium '>Thêm Phiếu Kiểm Kê Kho</h2>
                </div>
                <div className='space-y-5'>
                    <div className='space-y-2'>
                        <h2 className='bg-slate-100 py-2 px-4 rounded'>Thông tin chung</h2>   
                        <div className='grid grid-cols-4 gap-5'>
                            <div className='space-y-1'>
                                <label className="text-[#344054] font-normal text-sm mb-1 ">{"Mã chứng từ"} <span className="text-red-500">*</span></label>
                                <input value={code} onChange={_HandleChangeValue.bind(this, "code")} type="text" placeholder={"Mặc định theo hệ thống"} className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}/>
                            </div>
                            <div className='space-y-1'>
                                <label className="text-[#344054] font-normal text-sm mb-1 ">{"Ngày chứng từ"} <span className="text-red-500">*</span></label>
                                <div className='relative flex items-center'>
                                    <DatePicker selected={voucherdate} dateFormat="dd/MM/yyyy" disabled className={`disabled:bg-slate-50 focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                                    <IconCalendar size={22} className="absolute right-3 text-[#cccccc]" />
                                </div>
                            </div>
                            <div className='space-y-1'>
                                <label className="text-[#344054] font-normal text-sm mb-1 ">{"Kho hàng"} <span className="text-red-500">*</span></label>
                                <Select 
                                    options={dataWareHouse}
                                    value={warehouse}
                                    onChange={_HandleChangeValue.bind(this, "warehouse")}
                                    placeholder={"Chọn kho hàng"}
                                    isClearable={true}
                                    className={`${errWareHouse ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
                                    isSearchable={true}
                                    noOptionsMessage={() => `${dataLang?.no_data_found}`}
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
                                            boxShadow: 'none',
                                            ...(state.isFocused && {
                                                border: '0 0 0 1px #92BFF7',
                                            }),
                                        })
                                    }}
                                />
                            </div>
                            <div className='space-y-1'>
                                <label className="text-[#344054] font-normal text-sm mb-1 ">{"Chi nhánh"} <span className="text-red-500">*</span></label>
                                <Select 
                                    options={dataBranch}
                                    value={branch}
                                    onChange={_HandleChangeValue.bind(this, "branch")}
                                    placeholder={dataLang?.client_list_filterbrand}
                                    isClearable={true}
                                    className={`border-transparent placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
                                    isSearchable={true}
                                    noOptionsMessage={() => `${dataLang?.no_data_found}`}
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
                                            boxShadow: 'none',
                                            ...(state.isFocused && {
                                                border: '0 0 0 1px #92BFF7',
                                            }),
                                        })
                                    }}
                                />
                            </div>
                        </div>    
                    </div>
                    <div className='flex justify-between bg-slate-100 py-2 px-4 rounded items-center'>
                        <h2 className=''>Mặt hàng cần kiểm kê</h2> 
                        <Popup_Product dataLang={props.dataLang} warehouse={warehouse} sErrWareHouse={sErrWareHouse} className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105 outline-none whitespace-pre' />
                    </div>
                    <div className='space-y-2'>
                        <h2 className='bg-slate-100 py-2 px-4 rounded'>Thông tin mặt hàng</h2>   
                    </div>
                </div>
            </div>
        </>
    );
}

const Popup_Product = React.memo((props) => {
    const dataPstWH = useSelector(state => state.vitrikho_kiemke);

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const [open, sOpen] = useState(false);
    const _TogglePopup = (e) => sOpen(e);
    const _CheckWareHouse = () => {
        if(props.warehouse !== null){
            sOpen(true)
        }else{
            Toast.fire({
                icon: 'error',
                title: 'Vui lòng chọn kho hàng'
            }) 
            props.sErrWareHouse(true)
        }
    }

    useEffect(() => {
        open && sDataProduct([])
        open && sListAllProduct([])
        open && sProduct(null)
    }, [open]);

    const [onFetching, sOnFetching] = useState(false);
    const [onSendingProduct, sOnSendingProduct] = useState(false);

    const [dataProduct, sDataProduct] = useState([]);
    const [product, sProduct] = useState(null);
    const [listAllProduct, sListAllProduct] = useState([]);

    const _HandleChangeValue = (value) => {
        sProduct(value)
    }

    const _HandleInputChange = (inputValue) => {
        Axios("POST", "/api_web/api_product/searchItemsNoneVariant?csrf_protection=true", {
            data: {
                term: inputValue
            }
        }, (err, response) => {
            if(!err){
                var {data} = response.data;
                sDataProduct(data.result?.map(e => ({label: `${e.name} <span style={{display: none}}>${e.code}  ${e.id}</span>`, value: e.id, code: e.code, img: e.images, type: e.text_type})))
            }
        })
    };

    const _ServerFetching = () => {
        Axios("POST", "/api_web/api_product/searchItemsNoneVariant?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {data} = response.data;
                sDataProduct(data.result?.map(e => ({label: e.name, value: e.id, code: e.code, img: e.images, type: e.text_type})))
            }
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    useEffect(() => {
        open && sOnFetching(true)
    }, [open]);

    const _ServerSendingProduct = () => {
        Axios("POST", "/api_web/api_inventory/GetVariantInventory?csrf_protection=true", {
            data: {
                id: product?.value,
                warehouse_id: props.warehouse?.value
            }
        }, (err, response) => {
            if(!err){
                var {isSuccess} = response.data;
                sListAllProduct(isSuccess?.result?.map(e => ({id: e.id, code: e.code, name: e.name, img: e.images, variant: e.product_variation, type: e.text_type, checkExpiry: e.expiry, checkSerial: e.serial, show: false, dataLot: e.lot_array, child: [], checkChild: e.warehouse?.map(ce => ({amount: null, quantity: Number(ce.quantity), serial: ce.serial, lot: ce.lot, date: ce.expiration_date, locate: {label: ce.location_name, value: ce.location_id}}))})))
            }
            sOnSendingProduct(false)
        })
    }

    useEffect(() => {
        onSendingProduct && _ServerSendingProduct()
    }, [onSendingProduct]);

    useEffect(() => {
        open && product !== null && sOnSendingProduct(true)
    }, [product]);

    const _HandleActionItem = (id, type) => {
        if(type === "add"){
            const newData = listAllProduct.map(e => {
                if(e.id === id){
                    e.child.push({id: Date.now(), locate: null, amount: null, lot: null, date: null, serial: null})
                    return {...e, show: true};
                }
                return e
            })
            sListAllProduct([...newData])
        }else if(type === "show"){
            const newData = listAllProduct.map(e => {
                if (e.id === id) {
                    return {...e, show: !e.show};
                } else {
                    return e;
                }
            });
            sListAllProduct([...newData])
        }
    }

    const _HandleChangeChild = (parentId, id, type, value) => {
        const newData = listAllProduct.map(e => {
            if(e.id === parentId){
                const newChild = e.child?.map(ce => {
                    if(ce.id === id){
                        if(type === "amount"){
                            return {...ce, amount: Number(value?.value)}
                        }else if(type === "locate"){
                            return {...ce, locate: value}
                        }
                    }
                    return ce;
                })
                return {...e, child: newChild}
            }
            return e
        })
        sListAllProduct([...newData])
    }
    // console.log(listAllProduct)
    const _HandleDeleteChild = (parentId, id) => {
        const newData = listAllProduct.map(e => {
            if(e.id === parentId){
                const newChild = e.child?.filter(ce => ce.id !== id)
                return {...e, child: newChild}
            }
            return e;
        })
        sListAllProduct([...newData])
    }

    return(
        <PopupEdit  
            title={"Chọn sản phẩm để kiểm kê"} 
            button={`+   Chọn mặt hàng`} 
            onClickOpen={_CheckWareHouse.bind(this)} 
            open={open} 
            onClose={_TogglePopup.bind(this,false)}
            classNameBtn={props.className}
        >
            <div className='py-4 w-[1000px] 2xl:space-y-5 space-y-4'>
                <div className='space-y-1'>
                    <label>Mặt hàng</label>
                    <Select 
                        options={dataProduct}
                        value={product}
                        onChange={_HandleChangeValue.bind(this)}
                        placeholder="Chọn mặt hàng"
                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
                        onInputChange={_HandleInputChange.bind(this)}
                        className={`border-transparent placeholder:text-slate-300 w-full z-[99999] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                boxShadow: 'none',
                                ...(state.isFocused && {
                                    border: '0 0 0 1px #92BFF7',
                                }),
                            })
                        }}
                        formatOptionLabel={(option) => (
                            <div className='flex items-center space-x-5 cursor-pointer'>
                                {option.img != null ? 
                                    <img src={option.img} alt="Product Image" className='object-cover rounded w-14 h-14' />
                                    :
                                    <div className='w-14 h-14 bg-gray-200 flex flex-col items-center justify-center rounded'><IconImage/></div>
                                }
                                <div>
                                    <h3 className='font-medium' dangerouslySetInnerHTML={{__html: option.label}} />
                                    <h5 className='text-gray-400 font-[400]'>{option.code}</h5>
                                    <h5 className='text-gray-400 font-medium text-xs'>{props.dataLang[option.type]}</h5>
                                </div>
                            </div>
                        )}
                    />
                </div>
                {onSendingProduct ?
                    <Loading className="h-60"color="#0f4f9e" />
                    :
                    <>
                        {listAllProduct?.length > 0 &&
                            <ScrollArea className="max-h-[500px]" speed={1} smoothScrolling={true} ref={scrollAreaRef}>
                                <div className='space-y-1.5'>
                                    {listAllProduct?.map(e => 
                                        <div className='space-y-2' key={e.id}>
                                            <div className='flex justify-between items-center pr-3'>
                                                <div className='flex items-center space-x-3 w-full'>
                                                    {e.img != null ? 
                                                        <Image src={e.img} alt="Product Image" height={52} width={52} quality={100} className="object-cover rounded w-auto h-auto" loading="lazy" crossOrigin="anonymous" placeholder='blur' blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                                        :
                                                        <div className='w-14 h-14 bg-gray-200 flex flex-col items-center justify-center rounded'><IconImage/></div>
                                                    }
                                                    <div>
                                                        <h3 className='font-medium'>{e.name}</h3>
                                                        <h5 className='text-gray-400 font-[400] text-sm'>
                                                            {e.code}
                                                            <span className='text-[#0F4F9E] font-medium ml-3'>{e.variant}</span>
                                                        </h5>
                                                        <h5 className='text-gray-400 font-medium text-xs'>{props.dataLang[e.type]}</h5>
                                                    </div>
                                                </div>
                                                <div className='flex items-center space-x-5'>
                                                    {e.child?.length > 0 && <button onClick={_HandleActionItem.bind(this, e.id, "show")} className={`${e.show ? "rotate-180" : "rotate-0" } transition w-6 h-6 rounded-full flex flex-col justify-center items-center bg-blue-200 text-blue-700`}><IconDown size="15" /></button>}
                                                    <button onClick={_HandleActionItem.bind(this, e.id, "add")} className='w-10 h-10 rounded bg-slate-50 hover:bg-slate-100 transition flex flex-col justify-center items-center '><IconAdd /></button>
                                                </div>
                                            </div>
                                            {e.child?.length > 0 && e.show &&
                                                <div className='w-full space-y-1'>
                                                    <div className={`${(e?.checkExpiry == "0" && e?.checkSerial == "0") ? "grid-cols-5" : (e?.checkExpiry == "1" ? "grid-cols-7" : "grid-cols-6") } grid gap-2`}>
                                                        <h5 className='font-[300] text-sm px-1 text-center'>Vị trí kho</h5>
                                                        {e?.checkExpiry == "1" && <h5 className='font-[300] text-sm px-1 text-center'>LOT</h5>}
                                                        {e?.checkExpiry == "1" && <h5 className='font-[300] text-sm px-1 text-center'>Date</h5>}
                                                        {e?.checkSerial == "1" && <h5 className='font-[300] text-sm px-1 text-center'>Serial</h5>}
                                                        <h5 className='font-[300] text-sm px-1 text-center'>SL phần mềm</h5>
                                                        <h5 className='font-[300] text-sm px-1 text-center'>SL thực</h5>
                                                        <h5 className='font-[300] text-sm px-1 text-center'>Chênh lệch</h5>
                                                        <h5 className='font-[300] text-sm px-1 text-center'>Tác vụ</h5>
                                                    </div>
                                                    <div className={`${(e?.checkExpiry == "0" && e?.checkSerial == "0") ? "grid-cols-5" : (e?.checkExpiry == "1" ? "grid-cols-7" : "grid-cols-6") } grid gap-2`}>
                                                        {e.child.map(ce => 
                                                            <React.Fragment key={ce.id}>
                                                                <div className='px-1'>
                                                                    <Select 
                                                                        options={dataPstWH}
                                                                        value={ce.locate}
                                                                        onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "locate")}
                                                                        placeholder={"Vị trí kho"}
                                                                        isClearable={true}
                                                                        classNamePrefix="Select"
                                                                        className={`Select__custom border-transparent placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`} 
                                                                        isSearchable={true}
                                                                        noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
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
                                                                            })
                                                                        }}
                                                                    />
                                                                </div>
                                                                {e?.checkExpiry == "1" && 
                                                                    // <h6 className='font-[300] text-sm px-1 text-center'>{ce.lot}</h6>
                                                                    <div className='px-1'></div>
                                                                }
                                                                {e?.checkExpiry == "1" && <h6 className='font-[300] text-sm px-1 text-center'>{ce.date}</h6>}
                                                                {e?.checkSerial == "1" && 
                                                                    // <h6 className='font-[300] text-sm'>{ce?.serial}</h6>
                                                                    <div className='px-1'>
                                                                        {/* <Select 
                                                                            options={dataPstWH}
                                                                            value={ce.locate}
                                                                            // onChange={_HandleChangeValue.bind(this, "branch")}
                                                                            placeholder={"Vị trí kho"}
                                                                            isClearable={true}
                                                                            className={`border-transparent placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-sm`} 
                                                                            isSearchable={true}
                                                                            noOptionsMessage={() => `${props.dataLang?.no_data_found}`}
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
                                                                                })
                                                                            }}
                                                                        /> */}
                                                                    </div>
                                                                }
                                                                <h6 className='px-1 self-center text-center'>{ce?.quantity}</h6>
                                                                <div className='px-1 self-center text-center'>
                                                                    <NumericFormat
                                                                        value={ce?.amount}
                                                                        onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "amount")}
                                                                        className="appearance-none text-center py-1 px-2 font-medium w-20 focus:outline-none border-b-2 border-gray-200"
                                                                        thousandSeparator=","
                                                                        isAllowed={(values) => { const {floatValue} = values; return floatValue >= 0 }}       
                                                                    />
                                                                </div>
                                                                <h6 className='px-1 self-center text-center'>{ce?.amount != null && Number(ce?.amount - ce?.quantity)?.toLocaleString()}</h6>
                                                                <div className='px-1 self-center flex justify-center'>
                                                                    <button title='Xóa' onClick={_HandleDeleteChild.bind(this, e?.id, ce?.id)} className='text-red-500 hover:text-red-600'><IconDelete /></button>
                                                                </div>
                                                            </React.Fragment>
                                                        )}
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )}
                                </div>    
                            </ScrollArea>
                        }
                    </>
                }
                <div className='flex justify-end space-x-2'>
                    <button onClick={_TogglePopup.bind(this,false)} className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition">{props.dataLang?.branch_popup_exit}</button>
                    <button className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#0F4F9E] hover:opacity-90 hover:scale-105 transition">{props.dataLang?.branch_popup_save}</button>
                </div>
            </div>
        </PopupEdit>
    )
})

{/* <div className="flex items-center justify-center">
    <button className="text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 flex flex-col items-center justify-center w-6 h-6 bg-slate-200 rounded-full" ><IconMinus size="16"/></button>
    <NumericFormat
        value={e?.quantity}
        onChange={_HandleChangeItem.bind(this, e?.id)}
        className="appearance-none text-center py-2 px-4 font-medium w-20 focus:outline-none border-b-2 border-gray-200"
        thousandSeparator={true}
        decimalScale={0}
        isAllowed={(values) => { const {floatValue} = values; return floatValue > 0 }}       
    />
    <button className="text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 flex flex-col items-center justify-center w-6 h-6 bg-slate-200 rounded-full" ><IconAdd size="16"/></button>
</div> */}

export default Form;
