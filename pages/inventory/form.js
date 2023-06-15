import React, {useState, useEffect, useRef} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import {_ServerInstance as Axios} from '/services/axios';
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";

import {
    Calendar as IconCalendar, Add as IconAdd,SearchNormal1 as IconSearch, Image as IconImage, ArrowDown2 as IconDown, Trash as IconDelete,
    ArrowRotateLeft as IconLoad
} from "iconsax-react";
import DatePicker from "react-datepicker";
import moment from 'moment';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Swal from "sweetalert2";
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
    const router = useRouter();

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };
    
    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingPstWH, sOnFetchingPstWH] = useState(false);
    const [onFetchingWH, sOnFetchingWH] = useState(false);
    const [onSending, sOnSending] = useState(false);

    const [dataChoose, sDataChoose] = useState([]);
    const [dataBranch, sDataBranch] = useState([]);
    const [dataWareHouse, sDataWareHouse] = useState([]);
    const [dataPstWH, sDataPstWH] = useState([]);

    const voucherdate = new Date();
    const [code, sCode] = useState("");
    const [warehouse, sWarehouse] = useState(null);
    const [branch, sBranch] = useState(null);
    const [note, sNote] = useState("");

    const [errWareHouse, sErrWareHouse] = useState(false);
    const [errBranch, sErrBranch] = useState(false);
    const [errProduct, sErrProduct] = useState(false);
    const [errNullLocate, sErrNullLocate] = useState(false);
    const [errNullLot, sErrNullLot] = useState(false);
    const [errNullDate, sErrNullDate] = useState(false);
    const [errNullSerial, sErrNullSerial] = useState(false);
    const [errNullQty, sErrNullQty] = useState(false);
    const [errData, sErrData] = useState([]);

    const [isSubmitted, sIsSubmitted] = useState(false);
    const [dataErr , sDataErr] = useState(false)

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
    const [dataProductExpiry, sDataProductExpiry] = useState({});
    const [dataProductSerial, sDataProductSerial] = useState({});
  

    // useEffect(() =>{
    //     const hasStatus2 = errData?.some(item => item.status === 2);
    //      if(hasStatus2){
    //         sDataErr(true)
    //     }else{
    //         sDataErr(false)
    //     }
    // },[])

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
        Axios("GET", "/api_web/api_setting/feature/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var data = response.data;
                sDataMaterialExpiry(data.find(x => x.code == "material_expiry"));
                sDataProductExpiry(data.find(x => x.code == "product_expiry"));
                sDataProductSerial(data.find(x => x.code == "product_serial"));
            }
          })
        // Axios("GET", "/api_web/api_warehouse/warehouse?filter[is_system]=2&csrf_protection=true", {}, (err, response) => {
        //     if(!err){
        //         var {rResult} =  response.data
        //         sDataWareHouse(rResult.map(e =>({label: e.name, value: e.id})))
        //     }
        // })
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
        }else if(type === "note"){
            sNote(value?.target.value)
        }
    }

    const _ServerFetchingWH = () => {
        Axios("GET", `api_web/api_warehouse/warehouse?csrf_protection=true&filter[is_system]=2&filter[branch_id]=${branch?.value}`, {}, (err, response) => {
            if(!err){
                var {rResult} =  response.data
                sDataWareHouse(rResult.map(e =>({label: e.name, value: e.id})))
            }
            sOnFetchingWH(false)
        })
    }

    useEffect(() => {
        onFetchingWH && _ServerFetchingWH()
    }, [onFetchingWH]);

    useEffect(() => {
        branch !== null && sOnFetchingWH(true) //chọn chi nhánh để Get data Kho hàng
    }, [branch]);

    const _ServerFetchingPstWH = () => {
        Axios("GET", `/api_web/api_warehouse/LocationInWarehouse/${warehouse?.value}?csrf_protection=true`, {}, (err, response) =>{
            if(!err){
                const data = response.data;
                dispatch({type: "vitrikho_kiemke/update", payload: data.map(e => ({label: e.name, value: e.id}))})
                sDataPstWH(data.map(e => ({label: e.name, value: e.id})))
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

    const _HandleActionItem = (id, type) => {
        if(type === "add"){
            const newData = dataChoose.map(e => {
                if(e.id === id){
                    e.child.push({id: Date.now(), locate: null, amount: null, lot: null, date: null, serial: null, quantity: null, price: null})
                    return {...e, show: true};
                }
                return e
            })
            sDataChoose([...newData])
        }
    }

    const _HandleDeleteChild = (parentId, id) => {
        const newData = dataChoose.map(e => {
            if(e.id === parentId){
                const newChild = e.child?.filter(ce => ce.id !== id)
                return {...e, child: newChild}
            }
            return e;
        }).filter(e => e.child.length > 0)
        sDataChoose([...newData])
    }

    const _HandleChangeChild = (parentId, id, type, value) => {
        const newData = dataChoose.map(e => {
            if(e.id === parentId){
                const newChild = e.child?.map(ce => {
                    if(ce.id === id){
                        if(type === "amount"){
                            return {...ce, amount: Number(value?.value)}
                        }else if(type === "locate"){
                            ce.locate = value;
                            e?.checkExpiry == "1" && (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckSameLot(parentId, id, ce?.locate, ce?.lot, ce?.date);
                            e?.checkSerial == "1" && (ce?.locate !== null && ce?.serial !== null) && _HandleCheckSameSerial(parentId, id, ce?.locate, ce?.serial);
                            // e?.checkSerial == "1" && (ce?.locate !== null && ce?.serial !== null) && _HandleCheckSameSerial(parentId, id, ce?.locate, ce?.serial);
                            // (e?.checkSerial == "1") && (ce?.locate !== null && ce?.serial !== null) && console.log("here 1")
                            // (e?.type == "material" || e?.type == "products") && e?.checkExpiry == "0"  && _HandleCheckSameSerial(parentId, id, ce?.locate, ce?.serial);
                            // (e?.type == "material" || e?.type == "products") && e?.checkExpiry == "0"  && console.log("here 2")
                            // e?.checkSerial == "1" && (ce?.locate !== null && ce?.serial !== null) && console.log("here 3")
                            (e?.checkExpiry == "0" && e?.checkSerial == "0") && _HandleCheckSameLoca(parentId, id, ce?.locate)
                            return {...ce}
                        }else if(type === "lot"){
                            ce.lot = value;
                            // ce.checkExpiry == "1" && (ce?.lot !== null && ce.date !== null) && _HandleCheckSameLot(parentId, id, ce?.locate, ce?.lot, ce?.date);
                            (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckSameLot(parentId, id, ce?.locate, ce?.lot, ce?.date);
                            return {...ce}
                        }else if(type === "date"){
                            ce.date = value;
                            (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckSameLot(parentId, id, ce?.locate, ce?.lot, ce?.date);
                            // ce.checkExpiry == "1" && (ce?.lot !== null && ce.date !== null) && _HandleCheckSameLot(parentId, id, ce?.locate, ce?.lot, ce?.date);
                            return {...ce}
                        }else if(type === "serial"){
                            ce.serial = value?.target.value;
                            setTimeout(() => {
                                e?.checkSerial == "1" && (ce?.locate !== null && ce?.serial !== null) && _HandleCheckSameSerial(parentId, id, ce?.locate, ce?.serial);
                            }, 1000);
                            setTimeout(() => {
                                return {...ce}
                            }, 3000);
                        }else if(type === "price"){
                            return {...ce, price: Number(value?.value)}
                        }
                    }
                    return ce;
                })
                return {...e, child: newChild}
            }
            return e
        })
        sDataChoose([...newData])
    }
    const _HandleCheckSameLot = (parentId, id, locate, lot, date) => {
        setTimeout(() => {
            const newData = dataChoose.map(e => {
                if(e.id === parentId){
                    const checkData = e.child?.filter(ce => ce?.id !== id)?.some(item => item?.locate?.value === locate?.value && item.lot?.value === lot?.value && moment(item.date).format("DD/MM/yyyy") == moment(date).format("DD/MM/yyyy"));
                    const newChild = e.child?.map(ce => {
                        // if(ce.id !== id && ce.locate?.value === locate?.value && ce.lot?.value === lot?.value && moment(ce.date).format("DD/MM/yyyy") == moment(date).format("DD/MM/yyyy")){
                        if(ce.id == id && checkData){
                            Toast.fire({
                                icon: 'error',
                                title: `Trùng mặt hàng`
                            }) 
                            return {...ce, locate: null, amount: null, lot: null, date: null, serial: null, quantity: null, price: null}
                        }
                        return ce;
                    }).filter(item => item.locate !== null)
                    return {...e, child: newChild}
                }
                return e;
            })
            const parent = newData.find(item => item.id === parentId);
            if(!parent) return null;
            const child = parent.child.find(e => e.id === id) || null
            // if(!child) return null;
            const check = parent.checkChild.find(e => e.locate === child?.locate?.value && e.lot === child.lot?.value && e.date === moment(child.date).format("DD/MM/yyyy"))
            const newData1 = newData.map(e => {
                if(e.id === parentId){
                    const newChild = e.child?.map(ce => {
                        if(ce.id === id){
                            return {...ce, quantity: check?.quantity || 0}
                        }
                        return ce;
                    })
                    return {...e, child: newChild}
                }
                return e;
            })
            sDataChoose([...newData1])
        }, 500);
    }

    const _HandleCheckSameSerial = (parentId, id, locate, serial) => {
        setTimeout(() => {
            // const newData = dataChoose.map(e => {
            //     if(e.id === parentId){
            //         const checkData = e.child?.filter(ce => ce?.id !== id)?.some(item => item?.locate?.value === locate?.value && item.serial === serial);
            //         const newChild = e.child?.map(ce => {
            //             if(ce.id == id && checkData){
            //                 Toast.fire({
            //                     icon: 'error',
            //                     title: `Trùng mặt hàng`
            //                 }) 
            //                 return {...ce, locate: null, amount: null, lot: null, date: null, serial: null, quantity: null, price: null}
            //             }
            //             return ce;
            //         }).filter(item => item.locate !== null)
            //         return {...e, child: newChild}
            //     }
            //     return e;
            // })
            const dataChild = dataChoose?.map(e => e?.child)?.flatMap(innerList => innerList)
            const checkData = dataChild?.some(item => item?.serial === serial && item?.id !== id)

            const newData = dataChoose?.map(e => {
                if(e.id === parentId && checkData){
                    Toast.fire({
                        icon: 'error',
                        title: `Trùng serial`
                    }) 
                    return {...e, child: e?.child?.filter(ce => ce?.id !== id)}
                }
                return e
            // })?.filter(e => e.child.length > 0)
            })
            const parent = newData?.find(item => item.id === parentId) || null
            const child = parent?.child.find(e => e.id === id) || null
            const check = parent?.checkChild.find(e => e.locate === child?.locate?.value && e.serial === child?.serial)
            const newData1 = newData.map(e => {
                if(e.id === parentId){
                    const newChild = e.child?.map(ce => {
                        if(ce.id === id){
                            return {...ce, quantity: check?.quantity || 0}
                        }
                        return ce;
                    })
                    return {...e, child: newChild}
                }
                return e;
            })
            
            sDataChoose([...newData1])
        }, 1000);
    }

    const _HandleCheckSameLoca = (parentId, id, locate) => {
        setTimeout(() => {
            const newData = dataChoose.map(e => {
                if(e.id === parentId){
                    const checkData = e.child?.filter(ce => ce?.id !== id)?.some(item => item?.locate?.value === locate?.value);
                    const newChild = e.child?.map(ce => {
                        if(ce.id == id && checkData){
                            Toast.fire({
                                icon: 'error',
                                title: `Trùng mặt hàng`
                            }) 
                            return {...ce, locate: null, amount: null, lot: null, date: null, serial: null, quantity: null, price: null}
                        }
                        return ce;
                    }).filter(item => item.locate !== null)
                    return {...e, child: newChild}
                }
                return e;
            })
            // sLoadingData(true)

            const parent = newData.find(item => item.id === parentId);
            if(!parent) return null;
            const child = parent.child.find(e => e.id === id) || null
            const check = parent.checkChild.find(e => e.locate === child?.locate?.value)
            const newData1 = newData.map(e => {
                if(e.id === parentId){
                    const newChild = e.child?.map(ce => {
                        if(ce.id === id){
                            return {...ce, quantity: check?.quantity || 0}
                        }
                        return ce;
                    })
                    return {...e, child: newChild}
                }
                return e;
            })
            
            sDataChoose([...newData1])
        }, 1000);
    }

    // useEffect(() => {
    //    setTimeout(() => {
    //         sLoadingData(false)
    //         // console.log(dataChoose)
    //    }, 1000); 
    // }, [loadingData]);

    const _HandleCheckSame = (parentId, id, locate, serial) => {
        setTimeout(() => {
            const newData = dataChoose.map(e => {
                if(e.id === parentId){
                    const newChild = e.child?.map(ce => {
                        if(ce.id !== id && ce.locate?.value === locate?.value && ce.serial === serial){
                            Toast.fire({
                                icon: 'error',
                                title: `Trùng mặt hàng`
                            }) 
                            return {...ce, locate: null, amount: null, lot: null, date: null, serial: null, quantity: null, price: null}
                        }
                        return ce;
                    }).filter(item => item.locate !== null)
                    return {...e, child: newChild}
                }
                return e;
            })
            const parent = newData.find(item => item.id === parentId);
            if(!parent) return null;
            const child = parent.child.find(e => e.id === id)
            if(!child) return null;
            const check = parent.checkChild.find(e => e.locate === child.locate?.value && e.serial === child.serial)
            const newData1 = newData.map(e => {
                if(e.id === parentId){
                    const newChild = e.child?.map(ce => {
                        if(ce.id === id){
                            return {...ce, quantity: check?.quantity || 0}
                        }
                        return ce;
                    })
                    return {...e, child: newChild}
                }
                return e;
            })
            sDataChoose([...newData1])
        }, 500);
    }
  

    const _ServerSending = () => {
        var formData = new FormData();

        formData.append("code", code)
        formData.append("date", voucherdate)
        formData.append("warehouse", warehouse?.value)
        formData.append("branch", branch?.value)
        formData.append("note", note)

        dataChoose?.forEach((item, index) => {
            formData.append(`data[${index}][id]`, item?.id);
            formData.append(`data[${index}][code]`, item?.code);
            formData.append(`data[${index}][image]`, item?.img);
            formData.append(`data[${index}][variant]`, item?.variant);
            formData.append(`data[${index}][type]`, item?.type);
            formData.append(`data[${index}][name]`, item?.name);
            item?.child.forEach((itemChild, indexChild) => {
                formData.append(`data[${index}][child][${indexChild}][id]`, itemChild?.id);
                formData.append(`data[${index}][child][${indexChild}][date]`, itemChild?.date);
                formData.append(`data[${index}][child][${indexChild}][locate]`, itemChild?.locate?.value || null);
                formData.append(`data[${index}][child][${indexChild}][price]`, itemChild?.price || 0);
                formData.append(`data[${index}][child][${indexChild}][quantity_net]`, itemChild?.amount || 0);
                formData.append(`data[${index}][child][${indexChild}][quantity]`, itemChild?.quantity || 0);
                formData.append(`data[${index}][child][${indexChild}][lot]`, itemChild?.lot?.value || null );
                formData.append(`data[${index}][child][${indexChild}][serial]`, itemChild?.serial || null);
            })
        })

        Axios("POST", "/api_web/api_inventory/addDetail?csrf_protection=true", {
            data: formData,
            headers: {"Content-Type": "multipart/form-data"} 
        }, (err, response) => {
            if(!err){
                var {isSuccess, message, items_error,result} = response.data;
                if(isSuccess){
                    sIsSubmitted(false)
                    sErrData([])
                    Toast.fire({
                        icon: 'success',
                        title: `${dataLang[message]}`
                    })  
                    setTimeout(() =>{
                        router.back();
                    },1000)
                }else{
                    Toast.fire({
                        icon: 'error',
                        title: `${dataLang[message]}`
                    }) 
                    sErrData(items_error)
                    sIsSubmitted(true)
                    const hasStatus2 = items_error?.some(item => item.status === 2);
                    if(hasStatus2){
                        sDataErr(true)
                    }else {
                        sDataErr(false)
                    }
                }
            }
            sOnSending(false)
        })
    }

    useEffect(() => {
        onSending && _ServerSending()
    }, [onSending]);

    // useEffect(() => {
    //     const updatedData = dataChoose.map((parent) => {
    //         const updatedChild = parent.child.map((child) => {
    //             const matchedItem = errData.find((item) => item.id_parent === parent.id && Number(item.id) === child.id);
    //             if (matchedItem) {
    //                 return { ...child, quantity: isNaN(Number(matchedItem.check_quantity_stock)) ? 0 : Number(matchedItem.check_quantity_stock) };
    //             }else{
    //                 return child;
    //             }
    //             // if(child?.status == 2){ //so luong thay doi
    //             // }else if(child?.status == 3){ //trung serial
    //             //     const matchedItem = errData.find((item) => item.id_parent === parent.id && Number(item.id) === child.id && item.serial === child.serial );
    //             //     console.log(matchedItem);
    //             // }
    //         });
    //         return { ...parent, child: updatedChild };
    //     })
    //     sDataChoose([...updatedData])
    // }, [errData]);
    // useEffect(() => {
    //     if(errData.length > 0){
    //         Swal.fire({
    //             title: `${"Số lượng trong kho có sự thay đổi, bạn có muốn thay đổi không"}`,
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonColor: '#296dc1',
    //             cancelButtonColor: '#d33',
    //             confirmButtonText: `${dataLang?.aler_yes}`,
    //             cancelButtonText: `${dataLang?.aler_cancel}`
    //           }).then((result) => {
    //             if (result.isConfirmed) {
    //               const updatedData = dataChoose.map((parent) => {
    //                   const updatedChild = parent.child.map((child) => {
    //                       const matchedItem = errData.find((item) => item.id_parent === parent.id && Number(item.id) === child.id);
    //                       if (matchedItem) {
    //                           return { ...child, quantity: isNaN(Number(matchedItem.check_quantity_stock)) ? 0 : Number(matchedItem.check_quantity_stock) };
    //                       }else{
    //                           return child;
    //                       }
    //                   });
    //                   return { ...parent, child: updatedChild };
    //               })
    //               sDataChoose([...updatedData])
    //             } 
    //             }
    //           )
    //         }
    // }, [errData]);
    // console.log(errData);
    // console.log(dataChoose);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        const checkLotDate = dataChoose.some(item => item?.checkExpiry == "1");
        const checkSerial = dataChoose.some(item => item?.checkSerial == "1");

        const checkErrNullLocate = dataChoose.some(item =>
            item.child.some(itemChild => itemChild.locate === null)
        );
          
        const checkErrNullLot = dataChoose.some(item => (
            dataProductExpiry?.is_enable === "1" || dataMaterialExpiry?.is_enable === "1") &&
            item.checkExpiry === "1" &&
            item.child.some(itemChild => itemChild.lot === null)
        );
        
        const checkErrNullDate = dataChoose.some(item => (
            dataProductExpiry?.is_enable === "1" || dataMaterialExpiry?.is_enable === "1") &&
            item.checkExpiry === "1" &&
            item.child.some(itemChild => itemChild.date === null)
        );
        
        const checkErrNullSerial = dataChoose.some(item =>(
            dataProductSerial?.is_enable === "1" && item.checkSerial === "1") &&
            item.child.some(itemChild => itemChild.serial === null)
        );

        // const checkErrNullQty = dataChoose.some(item =>(
        //     item.child.some(itemChild => itemChild.quantity === 0 || itemChild.quantity === null)
        // ))
        const ChildData = dataChoose?.map(e => e?.child)?.flatMap(e => e)
        const checkErrNullQty = ChildData?.some(e => e?.quantity === null)
          
        const hasEmptyChild = dataChoose.some(item => item.child.length === 0);
      
        // const checkErrNullLocate = dataChoose.map(item => item.child.some(itemChild => itemChild.locate === null));
        // const checkErrNullLot = dataChoose.map(item => (item.child.some(itemChild => itemChild.lot === null));
        // const checkErrNullDate = dataChoose.map(item => item.child.some(itemChild => itemChild.date === null));
        // const checkErrNullSerial = dataChoose.map(item => item.child.some(itemChild => itemChild.serial === null));
        
        // const checkErrNullSerial = dataChoose.map(item => (dataProductSerial?.is_enable == "1"  && item.checkSerial == "1") && item.child.some(itemChild => itemChild.serial === null));
        // const checkErrNullAmount = dataChoose.map(item => item.child.some(itemChild => itemChild.quantity === itemChild.amount && itemChild.amount === 0) );
        // const checkErrNullQty = dataChoose.some(item => item.child.some(itemChild => itemChild.quantity === itemChild.amount && itemChild.amount === 0) );
        // const hasDuplicates = () => {
        //     const serialData = [];
        //     return dataChoose
        //         .flatMap(obj => obj.child)
        //         .map(child => child.serial)
        //         .filter(serial => serial !== null)
        //         .some(serial => {
        //             if (serialData.includes(serial)) {
        //                 return true;
        //             }
        //             serialData.push(serial);
        //             return false;
        //         });
        // };
        if(branch == null || warehouse == null || dataChoose.length == 0 || checkErrNullLocate || 
            (dataProductSerial?.is_enable == "1"  && checkErrNullSerial) ||
            ((dataProductExpiry?.is_enable == "1" || dataMaterialExpiry?.is_enable == "1") &&  checkErrNullLot) || 
            ((dataProductExpiry?.is_enable == "1" || dataMaterialExpiry?.is_enable == "1")  && checkErrNullDate) || hasEmptyChild  || checkErrNullQty
            // (checkSerial && hasDuplicates())
            )
            {
        // if(branch == null || warehouse == null || dataChoose.length == 0 || checkErrNullLocate || (checkLotDate && checkErrNullLot) || (checkLotDate && checkErrNullDate) || (checkSerial && checkErrNullSerial) || (checkSerial && hasDuplicates()) ){
            branch == null && sErrBranch(true)
            warehouse == null && sErrWareHouse(true)
            dataChoose.length == 0 && sErrProduct(true)
            checkErrNullLocate && sErrNullLocate(true)
            checkErrNullLot && sErrNullLot(true)
            checkErrNullDate && sErrNullDate(true)
            checkErrNullSerial && sErrNullSerial(true)
            checkErrNullQty && sErrNullQty(true)
            // if(hasDuplicates()){
            //     Toast.fire({
            //         icon: 'error',
            //         title: `Trùng Serial`
            //     })
            // }else{
            //     Toast.fire({
            //         icon: 'error',
            //         title: `${dataLang?.required_field_null}`
            //     })
            // }
            if(hasEmptyChild){
                Toast.fire({
                    icon: 'error',
                    title: `Thêm thông tin mặt hàng`
                })
            }else{
                Toast.fire({
                    icon: 'error',
                    title: `${dataLang?.required_field_null}`
                })
            }
        }else{
            sErrBranch(false)
            sErrWareHouse(false)
            sErrProduct(false)
            sErrNullLocate(false)
            sOnSending(true)
            
        }
    }
    const checkDuplicateSerial = () => {
        if (!isSubmitted) return []
        const duplicateIds = [];
        if(isSubmitted){
            dataChoose?.forEach(parentItem => {
                parentItem.child.forEach(childItem => {
                  const hasDuplicate = errData?.some(responseItem => {
                    return responseItem.serial === childItem.serial && Number(responseItem.id) === childItem.id;
                    // return responseItem.serial === childItem.serial;
                  });
            
                  if (hasDuplicate) {
                    duplicateIds.push(childItem.id);
                  }
                });
              });
        }
      
        return duplicateIds;
      };
      // Trong render của component
      const duplicateIds = checkDuplicateSerial();
    
    return (
        <>
            <Head>
                <title>Thêm phiếu kiểm kê kho</title>
            </Head>
            <Popup_status dataErr={dataErr} sDataErr={sDataErr} isSubmitted={isSubmitted} sIsSubmitted={sIsSubmitted}  db={sDataChoose} dataChoose={dataChoose} dataLang={dataLang} errData={errData} setOpen={true} />
            <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-5 space-y-2.5 flex flex-col justify-between'>
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
                                    <DatePicker selected={voucherdate} dateFormat="dd/MM/yyyy" disabled className={`disabled:bg-[#f2f2f2] disabled:text-[#9999b0] focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                                    <IconCalendar size={22} className="absolute right-3 text-[#cccccc]" />
                                </div>
                            </div>
                            <div className='space-y-1'>
                                <label className="text-[#344054] text-sm mb-1 ">{"Chi nhánh"} <span className="text-red-500">*</span></label>
                                <Select 
                                    options={dataBranch}
                                    value={branch}
                                    onChange={_HandleChangeValue.bind(this, "branch")}
                                    placeholder={dataLang?.client_list_filterbrand}
                                    isClearable={true}
                                    isDisabled={dataChoose.length > 0}
                                    className={`${errBranch && branch == null ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] outline-none border `} 
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
                                <label className="text-[#344054] text-sm mb-1 ">{"Kho hàng"} <span className="text-red-500">*</span></label>
                                <Select 
                                    options={dataWareHouse}
                                    value={warehouse}
                                    onChange={_HandleChangeValue.bind(this, "warehouse")}
                                    placeholder={"Chọn kho hàng"}
                                    isDisabled={dataChoose.length > 0}
                                    isClearable={true}
                                    className={`${errWareHouse ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full disabled:bg-slate-50 rounded text-[#52575E] outline-none border `} 
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
                        <div>
                            {errProduct && dataChoose?.length == 0 && <span className='text-red-500 mr-5'>Vui lòng thêm mặt hàng để kiểm kê</span>}
                            <Popup_Product dataLang={props.dataLang} sDataErr={sDataErr} warehouse={warehouse} sErrWareHouse={sErrWareHouse} sDataChoose={sDataChoose} dataChoose={dataChoose} className='xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105 outline-none whitespace-pre' />
                        </div>
                    </div>
                    <div className=''>
                        <h2 className='bg-slate-100 py-2 px-4 rounded'>Thông tin mặt hàng</h2>
                        {dataChoose.length > 0 &&
                            <>
                                <div className='grid grid-cols-6 pt-3 pb-2'>
                                    <h5 className='font-[300] text-slate-600 col-span-1 px-1.5'>Tên mặt hàng</h5>
                                    {/* <div className={`${(dataMaterialExpiry.is_enable == "0" && dataProductSerial.is_enable == "0") ? "grid-cols-7" : (dataProductExpiry.checkExpiry == "1" ? "grid-cols-9" : "grid-cols-8") } col-span-5 grid`}> */}
                                    <div className={`${dataProductSerial.is_enable == "1" ? 
                                                    (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-10" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-[repeat(10_minmax(0_1fr))]" :"grid-cols-8" ) :
                                                    (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-9" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-9" :"grid-cols-7") ) } grid col-span-5 `}>
                                        <h5 className='font-[300] text-slate-600  px-1.5'>Vị trí kho</h5>
                                        {/* {dataMaterialExpiry?.is_enable == "1" && <h5 className='font-[300] text-slate-600 text-center px-1.5'>LOT</h5>}
                                        {dataProductExpiry?.is_enable == "1" && <h5 className='font-[300] text-slate-600 text-center px-1.5'>Date</h5>}
                                        {dataProductSerial?.is_enable == "1" && <h5 className='font-[300] text-slate-600 text-center px-1.5'>Serial</h5>} */}
                                        {dataProductSerial.is_enable === "1" && (<h4 className="font-[300] text-slate-600 text-center px-1.5">{"Serial"}</h4>)}
                                        {dataMaterialExpiry.is_enable === "1" ||  dataProductExpiry.is_enable === "1" ? (
                                            <>
                                                <h4 className="font-[300] text-slate-600 text-center px-1.5">{"Lot"}</h4>
                                                <h4 className="font-[300] text-slate-600 text-center px-1.5">{props.dataLang?.warehouses_detail_date || "warehouses_detail_date"}</h4>
                                            </> )
                                        :""}
                                        <h5 className='font-[300] text-slate-600 text-center px-1.5'>Đơn giá</h5>
                                        <h5 className='font-[300] text-slate-600 text-center px-1.5'>SL phần mềm</h5>
                                        <h5 className='font-[300] text-slate-600 text-center px-1.5'>SL thực</h5>
                                        <h5 className='font-[300] text-slate-600 text-center px-1.5'>Chênh lệch</h5>
                                        <h5 className='font-[300] text-slate-600 text-center px-1.5'>Thành tiền</h5>
                                        <h5 className='font-[300] text-slate-600 text-center px-1.5'>Tác vụ</h5>
                                    </div>
                                </div>
                                <div className='2xl:max-h-[300px] max-h-[320px] overflow-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-50'>
                                    {dataChoose.map(e => 
                                        <div key={e.id} className='grid grid-cols-6 items-start'>
                                            <div className='col-span-1 p-1.5 space-y-1 border h-full'>
                                                <div className='flex justify-between space-x-2'>
                                                    <div className='w-20 h-20 bg-gray-200 flex flex-col items-center justify-center rounded'><IconImage/></div>
                                                    <button onClick={_HandleActionItem.bind(this, e.id, "add")} className='w-10 h-10 rounded bg-slate-50 hover:bg-slate-100 transition flex flex-col justify-center items-center '><IconAdd /></button>
                                                </div>
                                                <div>
                                                    <h3 className='font-medium'>{e.name}</h3>
                                                    <h5 className='text-gray-400 font-[400] text-sm'>{e.code}</h5>
                                                    <h5 className='text-[#0F4F9E] font-medium '>{e.variant}</h5>
                                                    <h5 className='text-gray-400 font-medium text-xs'>{props.dataLang[e.type]}</h5>
                                                </div>
                                            </div>
                                            {/* <div className={`${(e?.checkExpiry == "0" && e?.checkSerial == "0") ? "grid-cols-7" : (e?.checkExpiry == "1" ? "grid-cols-9" : "grid-cols-8") } col-span-5 grid`}> */}
                                            <div className={`${dataProductSerial.is_enable == "1" ? 
                                                            (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-10" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-[repeat(10_minmax(0_1fr))]" :"grid-cols-8" ) :
                                                            (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-9" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-9" :"grid-cols-7") ) } grid col-span-5 items-center `}
                                            >
                                                {/* {loadingData ? <h1 className='text-4xl font-bold'>Loading</h1> */}
                                                    {/* : */}
                                                    <>
                                                        {e.child?.map(ce => 
                                                            <React.Fragment key={ce?.id}>
                                                                <div className='p-1.5 border'>
                                                                    <Select 
                                                                        options={dataPstWH}
                                                                        value={ce?.locate}
                                                                        onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "locate")}
                                                                        placeholder={"Vị trí kho"}
                                                                        isClearable={true}
                                                                        classNamePrefix="Select"
                                                                        className={`${errNullLocate && ce.locate == null ? "border-red-500" : "border-transparent"} Select__custom placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`} 
                                                                        isSearchable={true}
                                                                        noOptionsMessage={() => `${dataLang?.no_data_found}`}
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
                                                                {dataProductSerial.is_enable === "1" ? (
                                                                    <div className='p-1.5 border flex flex-col justify-center h-full'>
                                                                        <input 
                                                                            disabled={e?.checkSerial == "0"}
                                                                            value={ce?.serial}
                                                                            onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "serial")}
                                                                            className={`${e?.checkSerial == "0" ? "border-transparent": errNullSerial && (ce.serial === null || ce.serial === "") ? "border-red-500" : "border-gray-200" } text-center py-1 px-1 font-medium w-full focus:outline-none border-b-2 `}
                                                                        />
                                                                        {(isSubmitted && duplicateIds.includes(ce.id)) && <span className='text-red-500 text-[12px]'>Serial đã tồn tại trong phần mềm</span>}
                                                                    </div>
                                                                ):""}
                                                                {dataMaterialExpiry.is_enable === "1" ||  dataProductExpiry.is_enable === "1" ? (
                                                                    <>
                                                                        <div className='p-1.5 border'>
                                                                            <CreatableSelect  
                                                                                // disabled={e?.checkExpiry == "0"}
                                                                                isDisabled={e?.checkExpiry == "0"}
                                                                                placeholder={"Lot"}
                                                                                options={e?.dataLot}
                                                                                value={ce?.lot}
                                                                                onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "lot")}
                                                                                isClearable={true}
                                                                                classNamePrefix="Select"
                                                                                className={`${e?.checkExpiry == "0" ? "border-transparent": errNullLot && ce.lot == null ? "border-red-500" : "border-transparent"} Select__custom removeDivide placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`} 
                                                                                isSearchable={true}
                                                                                menuPortalTarget={document.body}
                                                                                onMenuOpen={handleMenuOpen}
                                                                                noOptionsMessage={() => `Chưa có gợi ý`}
                                                                                formatCreateLabel={(value) => `Tạo "${value}"`}
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
                                                                        </div>
                                                                        <div className='relative flex items-center p-1.5 border'>
                                                                            <DatePicker 
                                                                                disabled={e?.checkExpiry == "0"}
                                                                                dateFormat="dd/MM/yyyy" 
                                                                                placeholderText='date' 
                                                                                selected={ce?.date}
                                                                                onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "date")}
                                                                                className={`${e?.checkExpiry == "0" ? "border-transparent": errNullDate && ce?.date == null ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} bg-transparent placeholder:text-slate-300 w-full rounded text-[#52575E] p-2 border outline-none text-[13px] relative`} 
                                                                            />
                                                                            <IconCalendar size={22} className="absolute right-3 text-[#cccccc]" />
                                                                        </div>
                                                                    </>
                                                                ):""}
                                                            
                                                                
                                                                {/* {e?.checkExpiry == "1" && 
                                                                    <div className='p-1.5 border'>
                                                                        <CreatableSelect  
                                                                            placeholder={"Lot"}
                                                                            options={e?.dataLot}
                                                                            value={ce?.lot}
                                                                            onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "lot")}
                                                                            isClearable={true}
                                                                            classNamePrefix="Select"
                                                                            className={`${errNullLot && ce.lot == null ? "border-red-500" : "border-transparent"} Select__custom removeDivide placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`} 
                                                                            isSearchable={true}
                                                                            menuPortalTarget={document.body}
                                                                            onMenuOpen={handleMenuOpen}
                                                                            noOptionsMessage={() => `Chưa có gợi ý`}
                                                                            formatCreateLabel={(value) => `Tạo "${value}"`}
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
                                                                    </div>
                                                                }
                                                                {e?.checkExpiry == "1" &&
                                                                    <div className='relative flex items-center p-1.5 border'>
                                                                        <DatePicker 
                                                                            dateFormat="dd/MM/yyyy" 
                                                                            placeholderText='date' 
                                                                            selected={ce?.date}
                                                                            onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "date")}
                                                                            className={`${errNullDate && ce?.date == null ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} bg-transparent placeholder:text-slate-300 w-full rounded text-[#52575E] p-2 border outline-none text-[13px] relative`} 
                                                                        />
                                                                        <IconCalendar size={22} className="absolute right-3 text-[#cccccc]" />
                                                                    </div>
                                                                }
                                                                {e?.checkSerial == "1" && 
                                                                    <div className='p-1.5 border flex flex-col justify-center h-full'>
                                                                        <input 
                                                                            value={ce?.serial}
                                                                            onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "serial")}
                                                                            className={`${errNullSerial && (ce.serial === null || ce.serial === "") ? "border-red-500" : "border-gray-200" } text-center py-1 px-2 font-medium w-full focus:outline-none border-b-2 `}
                                                                        />
                                                                        {(isSubmitted && duplicateIds.includes(ce.id)) &&
                                                                            <span className='text-red-500'>Serial đã tồn tại trong kho</span>}
                                                                    </div>
                                                                } */}
                                                                <div className='p-1.5 border flex flex-col justify-center h-full'>
                                                                    <NumericFormat
                                                                        value={ce?.price}
                                                                        onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "price")}
                                                                        className="appearance-none text-right py-1 px-2 font-medium w-full focus:outline-none border-b-2 border-gray-200"
                                                                        thousandSeparator=","
                                                                        isAllowed={(values) => { const {floatValue} = values; return floatValue >= 0 }}    
                                                                    />
                                                                </div>
                                                                <h6 className='text-center p-1.5 border flex flex-col justify-center h-full'>{ce?.quantity}</h6>
                                                                <div className='p-1.5 border flex flex-col justify-center h-full'>
                                                                    <NumericFormat
                                                                        value={ce?.amount}
                                                                        onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "amount")}
                                                                        className={`${(errNullQty && ce?.amount == null)  ? "border-red-500 border-b-2" :" border-gray-200 border-b-2"}  appearance-none text-center py-1 px-2 font-medium w-full focus:outline-none  `}
                                                                        thousandSeparator=","
                                                                        isAllowed={(values) => { 
                                                                            const {floatValue} = values; 
                                                                            if(e?.checkSerial == "1"){
                                                                                return floatValue >= 0 && floatValue < 2
                                                                            }else{
                                                                                return floatValue >= 0
                                                                            }
                                                                        }}      
                                                                    />
                                                                </div>
                                                                <h6 className='flex flex-col justify-center items-center p-1.5 border h-full'>{ce?.amount != null && Number(ce?.amount - ce?.quantity)?.toLocaleString()}</h6>
                                                                <h6 className='p-1.5 border flex flex-col justify-center items-center h-full'>{ce?.amount != null && Number(ce?.amount * ce?.price)?.toLocaleString()}</h6>
                                                                <div className='flex flex-col justify-center items-center p-1.5 border h-full'>
                                                                    <button onClick={_HandleDeleteChild.bind(this, e.id, ce?.id)} title='Xóa' className='text-red-500 hover:text-red-600'><IconDelete /></button>
                                                                </div>
                                                            </React.Fragment>
                                                        )}
                                                    </>
                                                {/* } */}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        }
                    </div>
                    <hr className=''/>
                    <div className='grid grid-cols-2'>
                        <div className='space-y-1 flex flex-col'>
                            <label>Ghi chú</label>
                            <textarea value={note} onChange={_HandleChangeValue.bind(this, "note")} placeholder='Ghi chú' className='w-2/3 resize-none p-3 rounded border outline-none focus:border-[#92BFF7]' rows={4} />
                        </div>
                        <div className='space-y-2 flex flex-col items-end'>
                            <div className='flex'>
                                <h5 className='min-w-[230px]'>Tổng số lượng : </h5>
                                <span className='min-w-[150px] text-right'>{(dataChoose.reduce((acc, obj) => {return acc + obj.child?.reduce((acc2, obj2) => {return acc2 + obj2.quantity;}, 0);}, 0)).toLocaleString()}</span>
                            </div>
                            <div className='flex'>
                                <h5 className='min-w-[230px]'>Tổng số lượng thực : </h5>
                                <span className='min-w-[150px] text-right'>{(dataChoose.reduce((acc, obj) => {return acc + obj.child?.reduce((acc2, obj2) => {return acc2 + obj2.amount;}, 0);}, 0)).toLocaleString()}</span>
                            </div>
                            <div className='flex'>
                                <h5 className='min-w-[230px]'>Tổng số lượng chênh lệch : </h5>
                                <span className='min-w-[150px] text-right'>{(dataChoose.reduce((acc, obj) => {return acc + obj.child?.reduce((acc2, obj2) => {return acc2 + (obj2.amount - obj2.quantity);}, 0);}, 0)).toLocaleString()}</span>
                            </div>
                            <div className='flex'>
                                <h5 className='min-w-[230px]'>Thành tiền : </h5>
                                <span className='min-w-[150px] text-right'>{(dataChoose.reduce((acc, obj) => {return acc + obj.child?.reduce((acc2, obj2) => {return acc2 + (obj2.amount * obj2.price);}, 0);}, 0)).toLocaleString()}</span>
                            </div>
                            <div className='space-x-3'>
                                <button onClick={() => router.back()} className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]">{"Quay lại"}</button>
                                <button onClick={_HandleSubmit.bind(this)} type="submit"className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]">{"Lưu"}</button>
                            </div>
                        </div>
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

    const [onFetching, sOnFetching] = useState(false);
    const [onSendingProduct, sOnSendingProduct] = useState(false);

    const [dataProduct, sDataProduct] = useState([]);
    const [product, sProduct] = useState(null);
    const [listAllProduct, sListAllProduct] = useState([]);

    useEffect(() => {
        open && sDataProduct([])
        open && sListAllProduct([])
        open && sProduct(null)
        open && sOnFetching(true)
    }, [open]);

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
                sDataProduct(data.result?.map(e => ({label: `${e.name + e.code + e.id}`, name: e.name, value: e.id, code: e.code, img: e.images, type: e.text_type})))
            }
        })
    };

    const _ServerFetching = () => {
        Axios("POST", "/api_web/api_product/searchItemsNoneVariant?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {data} = response.data;
                sDataProduct(data.result?.map(e => ({label: `${e.name + e.code + e.id}`, name: e.name, value: e.id, code: e.code, img: e.images, type: e.text_type})))
            }
            sOnFetching(false)
        })
    }

    useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

    const _ServerSendingProduct = () => {
        Axios("POST", "/api_web/api_inventory/GetVariantInventory?csrf_protection=true", {
            data: {
                id: product?.value,
                warehouse_id: props.warehouse?.value
            }
        }, (err, response) => {
            if(!err){
                var {isSuccess} = response.data;
                sListAllProduct(isSuccess?.result?.map(e => ({id: e.id, code: e.code, name: e.name, img: e.images, variant: e.product_variation, type: e.text_type, checkExpiry: e.expiry, checkSerial: e.serial, show: false, dataLot: e.lot_array?.map(e => ({label: e, value: e})), dataSerial: e.serial_array !== [null] ? e.serial_array?.map(e => ({label: e, value: e})) : [], child: [], checkChild: e.warehouse?.map(ce => ({amount: null, quantity: Number(ce.quantity), serial: ce.serial, lot: ce.lot, date: moment(ce.expiration_date).format("DD/MM/yyyy"), locate: ce.location_id}))})).filter(e => !props.dataChoose.some(ce => e.id === ce.id)))
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
                    e.child.push({id: Date.now(), locate: null, amount: null, lot: null, date: null, serial: null, quantity: null, price: null})
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

    // const _HandleChangeChild = (parentId, id, type, value) => {
    //     const newData = listAllProduct.map(e => {
    //         if(e.id === parentId){
    //             const newChild = e.child?.map(ce => {
    //                 if(ce.id === id){
    //                     if(type === "amount"){
    //                         return {...ce, amount: Number(value?.value)}
    //                     }else if(type === "locate"){
    //                         ce.locate = value;
    //                         e?.checkExpiry === "1" && (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckChild(parentId, id, "lot")
    //                         e?.checkSerial === "1" && (ce?.locate !== null && ce?.serial !== null) && _HandleCheckChild(parentId, id, "serial")
    //                         return {...ce}
    //                     }else if(type === "lot"){
    //                         ce.lot = value;
    //                         (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckChild(parentId, id, "lot")
    //                         return {...ce}
    //                     }else if(type === "date"){
    //                         ce.date = value;
    //                         (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckChild(parentId, id, "lot")
    //                         return {...ce}
    //                     }else if(type === "serial"){
    //                         ce.serial = value?.target.value;
    //                         setTimeout(() => {
    //                             (ce?.locate !== null && ce?.serial !== null) && _HandleCheckChild(parentId, id, "serial")
    //                         }, 1000);
    //                         setTimeout(() => {
    //                             return {...ce}
    //                         }, 3000);
    //                     }
    //                 }
    //                 return ce;
    //             })
    //             return {...e, child: newChild}
    //         }
    //         return e
    //     })
    //     sListAllProduct([...newData])
    // }
    
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

    // const _HandleCheckChild = (parentId, id, type) => {
    //     console.log(listAllProduct);
    //     setTimeout(() => {
    //         const parent = listAllProduct.find(item => item.id === parentId);
    //         if(!parent) return null;
    //         const child = parent.child.find(e => e.id === id)
    //         if(!child) return null;
    //         const check = parent.checkChild.find(e => {
    //             if(type === "lot"){
    //                 e.locate === child.locate?.value && e.lot === child.lot?.value && e.date === moment(child.date).format("DD/MM/yyyy")
    //             }else{
    //                 e.locate === child.locate?.value && e.serial === child.serial
    //             }
    //         })
    //         const newData = listAllProduct.map(e => {
    //             if(e.id === parentId){
    //                 const newChild = e.child?.map(ce => {
    //                     if(ce.id === id){
    //                         return {...ce, quantity: check?.quantity || 0}
    //                     }
    //                     return ce;
    //                 })
    //                 return {...e, child: newChild}
    //             }
    //             return e;
    //         })
    //         sListAllProduct([...newData])
    //     }, 500);
    // }

    const _HandleChangeChild = (parentId, id, type, value) => {
        const newData = listAllProduct.map(e => {
            if(e.id === parentId){
                const newChild = e.child?.map(ce => {
                    if(ce.id === id){
                        if(type === "amount"){
                            return {...ce, amount: Number(value?.value)}
                        }else if(type === "locate"){
                            ce.locate = value;
                            e?.checkExpiry == "1" && (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckSameLot(parentId, id, ce?.locate, ce?.lot, ce?.date);
                            e?.checkSerial == "1" && (ce?.locate !== null && ce?.serial !== null) && _HandleCheckSameSerial(parentId, id, ce?.locate, ce?.serial);
                            e?.checkExpiry == "0" && e?.checkSerial == "0" && _HandleCheckSameLoca(parentId, id, ce?.locate);
                            return {...ce}
                        }else if(type === "lot"){
                            ce.lot = value;
                            (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckSameLot(parentId, id, ce?.locate, ce?.lot, ce?.date);
                            return {...ce}
                        }else if(type === "date"){
                            ce.date = value;
                            (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckSameLot(parentId, id, ce?.locate, ce?.lot, ce?.date);
                            return {...ce}
                        }else if(type === "serial"){
                            ce.serial = value?.target.value;
                            (ce?.locate !== null && ce?.serial !== null) && _HandleCheckSameSerial(parentId, id, ce?.locate, ce?.serial);
                            setTimeout(() => {
                                return {...ce}
                            }, 3000);
                        }else if(type === "price"){
                            return {...ce, price: Number(value?.value)}
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

    // const _HandleCheckSameLot = (parentId, id, locate, lot, date) => {
    //     setTimeout(() => {
    //         const newData = listAllProduct.map(e => {
    //             if(e.id === parentId){
    //                 const newChild = e.child?.map(ce => {
    //                     if(ce.id !== id && ce.locate?.value === locate?.value && ce.lot?.value === lot?.value && moment(ce.date).format("DD/MM/yyyy") == moment(date).format("DD/MM/yyyy")){
    //                         Toast.fire({
    //                             icon: 'error',
    //                             title: `Trùng mặt hàng`
    //                         }) 
    //                         return {...ce, locate: null, amount: null, lot: null, date: null, serial: null, quantity: null, price: null}
    //                     }
    //                     return ce;
    //                 }).filter(item => item.locate !== null)
    //                 return {...e, child: newChild}
    //             }
    //             return e;
    //         })
    //         const parent = newData.find(item => item.id === parentId);
    //         if(!parent) return null;
    //         const child = parent.child.find(e => e.id === id)
    //         if(!child) return null;
    //         const check = parent.checkChild.find(e => e.locate === child?.locate?.value && e.lot === child?.lot?.value && e.date === moment(child.date).format("DD/MM/yyyy"))
    //         const newData1 = newData.map(e => {
    //             if(e.id === parentId){
    //                 const newChild = e.child?.map(ce => {
    //                     if(ce.id === id){
    //                         return {...ce, quantity: check?.quantity || 0}
    //                     }
    //                     return ce;
    //                 })
    //                 return {...e, child: newChild}
    //             }
    //             return e;
    //         })
    //         sListAllProduct([...newData1])
    //     }, 500);
    // }
    const _HandleCheckSameLot = (parentId, id, locate, lot, date) => {
        setTimeout(() => {
            const newData = listAllProduct.map(e => {
                if(e.id === parentId){
                    const checkData = e.child?.filter(ce => ce?.id !== id)?.some(item => item?.locate?.value === locate?.value && item.lot?.value === lot?.value && moment(item.date).format("DD/MM/yyyy") == moment(date).format("DD/MM/yyyy"));
                    const newChild = e.child?.map(ce => {
                        // if(ce.id !== id && ce.locate?.value === locate?.value && ce.lot?.value === lot?.value && moment(ce.date).format("DD/MM/yyyy") == moment(date).format("DD/MM/yyyy")){
                        if(ce.id == id && checkData){
                            Toast.fire({
                                icon: 'error',
                                title: `Trùng mặt hàng`
                            }) 
                            return {...ce, locate: null, amount: null, lot: null, date: null, serial: null, quantity: null, price: null}
                        }
                        return ce;
                    }).filter(item => item.locate !== null)
                    return {...e, child: newChild}
                }
                return e;
            })
            const parent = newData.find(item => item.id === parentId);
            if(!parent) return null;
            const child = parent.child.find(e => e.id === id) || null
            // if(!child) return null;
            const check = parent.checkChild.find(e => e.locate === child?.locate?.value && e.lot === child.lot?.value && e.date === moment(child.date).format("DD/MM/yyyy"))
            const newData1 = newData.map(e => {
                if(e.id === parentId){
                    const newChild = e.child?.map(ce => {
                        if(ce.id === id){
                            return {...ce, quantity: check?.quantity || 0}
                        }
                        return ce;
                    })
                    return {...e, child: newChild}
                }
                return e;
            })
            sListAllProduct([...newData1])
        }, 500);
    }

    // const _HandleCheckSameSerial = (parentId, id, locate, serial) => {
    //     setTimeout(() => {
    //         const newData = listAllProduct.map(e => {
    //             if(e.id === parentId){
    //                 const newChild = e.child?.map(ce => {
    //                     if(ce.id !== id && ce.locate?.value === locate?.value && ce.serial === serial){
    //                         Toast.fire({
    //                             icon: 'error',
    //                             title: `Trùng mặt hàng`
    //                         }) 
    //                         return {...ce, locate: null, amount: null, lot: null, date: null, serial: null, quantity: null, price: null}
    //                     }
    //                     return ce;
    //                 }).filter(item => item.locate !== null)
    //                 return {...e, child: newChild}
    //             }
    //             return e;
    //         })
    //         const parent = newData.find(item => item.id === parentId);
    //         if(!parent) return null;
    //         const child = parent.child.find(e => e.id === id)
    //         if(!child) return null;
    //         const check = parent.checkChild.find(e => e.locate === child?.locate?.value && e.serial === child.serial)
    //         const newData1 = newData.map(e => {
    //             if(e.id === parentId){
    //                 const newChild = e.child?.map(ce => {
    //                     if(ce.id === id){
    //                         return {...ce, quantity: check?.quantity || 0}
    //                     }
    //                     return ce;
    //                 })
    //                 return {...e, child: newChild}
    //             }
    //             return e;
    //         })
    //         sListAllProduct([...newData1])
    //     }, 500);
    // }
    const _HandleCheckSameSerial = (parentId, id, locate, serial) => {
        setTimeout(() => {
            // const newData = listAllProduct.map(e => {
            //     if(e.id === parentId){
            //         const checkData = e.child?.filter(ce => ce?.id !== id)?.some(item => item?.locate?.value === locate?.value && item.serial === serial);
            //         const newChild = e.child?.map(ce => {
            //             if(ce.id == id && checkData){
            //                 Toast.fire({
            //                     icon: 'error',
            //                     title: `Trùng mặt hàng`
            //                 }) 
            //                 return {...ce, locate: null, amount: null, lot: null, date: null, serial: null, quantity: null, price: null}
            //             }
            //             return ce;
            //         }).filter(item => item.locate !== null)
            //         return {...e, child: newChild}
            //     }
            //     return e;
            // })
            const dataChild = listAllProduct?.map(e => e?.child)?.flatMap(innerList => innerList)
            const checkData = dataChild?.some(item => item?.serial === serial && item?.id !== id)

            const newData = listAllProduct?.map(e => {
                if(e.id === parentId && checkData){
                    Toast.fire({
                        icon: 'error',
                        title: `Trùng serial`
                    }) 
                    return {...e, child: e?.child?.filter(ce => ce?.id !== id)}
                }
                return e
            // })?.filter(e => e.child.length > 0)
            })
            // sLoadingData(true)
            const parent = newData.find(item => item.id === parentId);
            if(!parent) return null;
            const child = parent.child.find(e => e.id === id) || null
            const check = parent.checkChild.find(e => e.locate === child?.locate?.value && e.serial === child?.serial)
            const newData1 = newData.map(e => {
                if(e.id === parentId){
                    const newChild = e.child?.map(ce => {
                        if(ce.id === id){
                            return {...ce, quantity: check?.quantity || 0}
                        }
                        return ce;
                    })
                    return {...e, child: newChild}
                }
                return e;
            })
            
            sListAllProduct([...newData1])
        }, 1000);
    }

    // const _HandleCheckSame = (parentId, id, locate, serial) => {
    //     setTimeout(() => {
    //         const newData = listAllProduct.map(e => {
    //             if(e.id === parentId){
    //                 const newChild = e.child?.map(ce => {
    //                     if(ce.id !== id && ce.locate?.value === locate?.value && ce.serial === serial){
    //                         Toast.fire({
    //                             icon: 'error',
    //                             title: `Trùng mặt hàng`
    //                         }) 
    //                         return {...ce, locate: null, amount: null, lot: null, date: null, serial: null, quantity: null, price: null}
    //                     }
    //                     return ce;
    //                 }).filter(item => item.locate !== null)
    //                 return {...e, child: newChild}
    //             }
    //             return e;
    //         })
    //         const parent = newData.find(item => item.id === parentId);
    //         if(!parent) return null;
    //         const child = parent.child.find(e => e.id === id)
    //         if(!child) return null;
    //         const check = parent.checkChild.find(e => e.locate === child?.locate?.value && e.serial === child.serial)
    //         const newData1 = newData.map(e => {
    //             if(e.id === parentId){
    //                 const newChild = e.child?.map(ce => {
    //                     if(ce.id === id){
    //                         return {...ce, quantity: check?.quantity || 0}
    //                     }
    //                     return ce;
    //                 })
    //                 return {...e, child: newChild}
    //             }
    //             return e;
    //         })
    //         sListAllProduct([...newData1])
    //     }, 500);
    // }
    const _HandleCheckSameLoca = (parentId, id, locate) => {
        setTimeout(() => {
            const newData = listAllProduct.map(e => {
                if(e.id === parentId){
                    const checkData = e.child?.filter(ce => ce?.id !== id)?.some(item => item?.locate?.value === locate?.value);
                    const newChild = e.child?.map(ce => {
                        if(ce.id == id && checkData){
                            Toast.fire({
                                icon: 'error',
                                title: `Trùng mặt hàng`
                            }) 
                            return {...ce, locate: null, amount: null, lot: null, date: null, serial: null, quantity: null, price: null}
                        }
                        return ce;
                    }).filter(item => item.locate !== null)
                    return {...e, child: newChild}
                }
                return e;
            })
            // sLoadingData(true)

            const parent = newData.find(item => item.id === parentId);
            if(!parent) return null;
            const child = parent.child.find(e => e.id === id) || null
            const check = parent.checkChild.find(e => e.locate === child?.locate?.value)
            const newData1 = newData.map(e => {
                if(e.id === parentId){
                    const newChild = e.child?.map(ce => {
                        if(ce.id === id){
                            return {...ce, quantity: check?.quantity || 0}
                        }
                        return ce;
                    })
                    return {...e, child: newChild}
                }
                return e;
            })
            
            sListAllProduct([...newData1])
        }, 1000);
    }


    const _HandleChooseItem = (e) => {
        e.preventDefault();
        const newData = listAllProduct.filter(e => e.child.length > 0)
        props.sDataChoose([...props.dataChoose, ...newData])
        sOpen(false)
        props.sDataErr(false)
    }

    return(
        <PopupEdit  
            title={"Thêm mặt hàng để kiểm kê"} 
            button={`+   Thêm mặt hàng`} 
            onClickOpen={_CheckWareHouse.bind(this)} 
            open={open} 
            onClose={_TogglePopup.bind(this,false)}
            classNameBtn={props.className}
        >
            <div className='py-4 w-[1000px] 2xl:space-y-5 space-y-4'>
                {onFetching ? 
                    <Loading className="h-60"color="#0f4f9e" />
                    :
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
                                        <h3 className='font-medium'>{option?.name}</h3>
                                        <h5 className='text-gray-400 font-[400]'>{option.code}</h5>
                                        <h5 className='text-gray-400 font-medium text-xs'>{props.dataLang[option.type]}</h5>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                }
                {onSendingProduct ?
                    <Loading className="h-60"color="#0f4f9e" />
                    :
                    <>
                        {listAllProduct?.length > 0 &&
                            <div className="max-h-[500px] min-h-[400px] overflow-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-50" speed={1} smoothScrolling={true} ref={scrollAreaRef}>
                                <div className='space-y-1.5'>
                                    {listAllProduct?.map(e => 
                                        <div className='space-y-2' key={e.id}>
                                            <div className='flex justify-between items-center pr-3'>
                                                <div className='flex items-center space-x-3 w-full'>
                                                    {e.img != null ? 
                                                        <Image src={e.img} alt="Product Image" height={52} width={52} quality={100} className="object-cover rounded w-[56px] h-[56px]" loading="lazy" crossOrigin="anonymous" placeholder='blur' blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
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
                                                    <div className={`${(e?.checkExpiry == "0" && e?.checkSerial == "0") ? "grid-cols-5" : (e?.checkExpiry == "1" ? "grid-cols-7" : "grid-cols-6") } grid gap-2 items-center`}>
                                                        <h5 className='font-[300] text-sm px-1 text-center'>Vị trí kho</h5>
                                                        {e?.checkExpiry == "1" && <h5 className='font-[300] text-sm px-1 text-center'>LOT</h5>}
                                                        {e?.checkExpiry == "1" && <h5 className='font-[300] text-sm px-1 text-center'>Date</h5>}
                                                        {e?.checkSerial == "1" && <h5 className='font-[300] text-sm px-1 text-center'>Serial</h5>}
                                                        <h5 className='font-[300] text-sm px-1 text-center'>SL phần mềm</h5>
                                                        <h5 className='font-[300] text-sm px-1 text-center'>SL thực</h5>
                                                        <h5 className='font-[300] text-sm px-1 text-center'>Chênh lệch</h5>
                                                        <h5 className='font-[300] text-sm px-1 text-center'>Tác vụ</h5>
                                                    </div>
                                                    <div className={`${(e?.checkExpiry == "0" && e?.checkSerial == "0") ? "grid-cols-5" : (e?.checkExpiry == "1" ? "grid-cols-7" : "grid-cols-6") } grid gap-2 items-center`}>
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
                                                                    // lot
                                                                    <div className='px-1'>
                                                                        <CreatableSelect  
                                                                            options={e?.dataLot}
                                                                            placeholder={"Lot"}
                                                                            onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "lot")}
                                                                            isClearable={true}
                                                                            classNamePrefix="Select"
                                                                            className={`Select__custom removeDivide border-transparent placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border text-[13px]`} 
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
                                                                    </div>
                                                                }
                                                                {e?.checkExpiry == "1" && 
                                                                    // date
                                                                    <div className='relative flex items-center px-1'>
                                                                        <DatePicker 
                                                                            dateFormat="dd/MM/yyyy" 
                                                                            placeholderText='date' 
                                                                            selected={ce?.date}
                                                                            onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "date")}
                                                                            className={`focus:border-[#92BFF7] border-[#d0d5dd] bg-transparent placeholder:text-slate-300 w-full rounded text-[#52575E] p-2 border outline-none text-[13px] relative`} 
                                                                        />
                                                                        <IconCalendar size={22} className="absolute right-3 text-[#cccccc]" />
                                                                    </div>
                                                                }
                                                                {e?.checkSerial == "1" && 
                                                                    // serial
                                                                    <div className='px-1'>
                                                                        <input  value={ce?.serial} onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "serial")} className="text-center py-1 px-2 font-medium w-full focus:outline-none border-b-2 border-gray-200" />
                                                                    </div>
                                                                }
                                                                <h6 className='px-1 self-center text-center'>{ce?.quantity}</h6>
                                                                <div className='px-1 self-center text-center'>
                                                                    <NumericFormat
                                                                        value={ce?.amount}
                                                                        onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "amount")}
                                                                        className="text-center py-1 px-2 font-medium w-20 focus:outline-none border-b-2 border-gray-200"
                                                                        thousandSeparator=","
                                                                        isAllowed={(values) => { 
                                                                            const {floatValue} = values; 
                                                                            if(e?.checkSerial == "1"){
                                                                                return floatValue >= 0 && floatValue < 2
                                                                            }else{
                                                                                return floatValue >= 0
                                                                            }
                                                                        }}       
                                                                    />
                                                                </div>
                                                                <h6 className='px-1 self-center text-center'>{ce?.amount != null && Number(ce?.amount - ce?.quantity)?.toLocaleString()}</h6>
                                                                <div className='px-1 self-center flex justify-center space-x-3'>
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
                            </div>
                        }
                    </>
                }
                <div className='flex justify-end space-x-2'>
                    <button onClick={_TogglePopup.bind(this,false)} className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition">{props.dataLang?.branch_popup_exit}</button>
                    <button onClick={_HandleChooseItem.bind(this)} className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#0F4F9E] hover:opacity-90 hover:scale-105 transition">Chọn</button>
                </div>
            </div>
        </PopupEdit>
    )
})


const Popup_status = (props) => {

    const dataLang = props?.dataLang
    const [onFetching, sOnFetching] = useState(false);
    
    const [open, sOpen] = useState(false);
    const _HandleClose = () => {
        sOpen(false);
        props.sDataErr(false)
    }
    useEffect(()=>{
        if(props.dataErr){
            sOpen(true)
        }else{
            sOpen(false)
        }
    },[props])

    const newDataChoose = props?.errData?.filter((errItem) => errItem.status === 2).map((errItem) => {
        const matchingChild = props?.dataChoose?.find((dataItem) => dataItem.child.some((childItem) => childItem.id.toString() === errItem.id));
        return {
          ...errItem,
          name: matchingChild && matchingChild.name,
        };
      });

    const _HandleSave = (e) =>{
        const updatedData = props?.dataChoose.map((parent) => {
                    const updatedChild = parent.child.map((child) => {
                        const matchedItem = props?.errData?.find((item) => item.id_parent === parent.id && Number(item.id) === child.id);
                        if (matchedItem) {
                            return { ...child, quantity: isNaN(Number(matchedItem.check_quantity_stock)) ? 0 : Number(matchedItem.check_quantity_stock) };
                        }else{
                            return child;
                        }
                    });
            return { ...parent, child: updatedChild };
         })
        props.db(updatedData)
        sOpen(false)
        props.sDataErr(false)
    }
      
  return(
    <PopupEdit  
      title={"Phiếu kiểm kê bị thay đổi về số lượng thực" +" "+ `${moment(new Date()).format("DD/MM/YYYY")}`} 
      open={open} 
      onClose={_HandleClose.bind(this)}
      classNameBtn={props.className}
    >
      <div className="mt-4 space-x-5 w-[990px] h-auto">        
      <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <div className="pr-2 w-[100%] lx:w-[120%] ">
                  <div className={`grid-cols-10 grid sticky top-0 bg-white shadow  z-10`}>
                              <h4 className='text-[13px] px-2 text-[#667085] uppercase col-span-2 font-[300] text-center'>{"Tên hàng"}</h4>
                              <h4 className='text-[13px] px-2 text-[#667085] uppercase col-span-2 font-[300] text-center'>{"Số lượng thay đổi"}</h4>
                              <h4 className='text-[13px] px-2 text-[#667085] uppercase col-span-2 font-[300] text-center'>{"Số lượng thực"}</h4>
                              <h4 className='text-[13px] px-2 text-[#667085] uppercase col-span-2 font-[300] text-center'>{"Chênh lệch"}</h4>
                              <h4 className='text-[13px] px-2 text-[#667085] uppercase col-span-2 font-[300] text-center'>{"Xử lý"}</h4>
                  </div>
                  {onFetching ?
                    <Loading className="h-50"color="#0f4f9e" /> 
                    : 
                    newDataChoose?.length > 0 ? 
                    (<>
                        <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] mt-2 ">                       
                        {(newDataChoose?.map((e) => 
                              <div className={`grid-cols-10  grid hover:bg-slate-50 items-center`}>
                                <h6 className='text-[13px]  px-2 col-span-2 text-center capitalize'>{e?.name}</h6>
                                <h6 className='text-[13px]  px-2 col-span-2 text-center capitalize'>{e?.check_quantity_stock}</h6>
                                <h6 className='text-[13px]  px-2 col-span-2 text-center capitalize'>{e?.quantity_net}</h6>
                                <h6 className='text-[13px]  px-2 col-span-2 text-center capitalize'>{e?.quantity_net - e?.check_quantity_stock}</h6>
                                <h6 className='text-[13px]  px-2 col-span-2 text-center capitalize'>{(e?.quantity_net - e?.check_quantity_stock) > 0 ? `Mặt hàng cần điều chỉnh tăng ${Number(e?.quantity_net) - Number(e?.check_quantity_stock)}` : `Mặt hàng cần điều chỉnh giảm ${Math.abs(Number(e?.quantity_net) - Number(e?.check_quantity_stock))}`}</h6>
                              </div>
                        ))}              
                      </div>                     
                      </>
                    )  : 
                    (
                      <div className=" max-w-[352px] mt-24 mx-auto" >
                        <div className="text-center">
                          <div className="bg-[#EBF4FF] rounded-[100%] inline-block "><IconSearch /></div>
                          <h1 className="textx-[#141522] text-base opacity-90 font-medium">{props?.dataLang?.purchase_order_table_item_not_found || "purchase_order_table_item_not_found"}</h1>
                          <div className="flex items-center justify-around mt-6 ">
                              {/* <Popup_dsncc onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                          </div>
                        </div>
                      </div>
                    )}    
                </div>
                <div className='space-x-2 text-right mt-4'>
                <button
                 onClick={_HandleClose.bind(this)} 
                 className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]">{dataLang?.purchase_order_purchase_back || "purchase_order_purchase_back"}</button>
                  <button 
                  onClick={_HandleSave.bind(this)} 
                   type="submit"className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]">{"Cập nhật"}</button>
                </div>
            </div>
      </div>
    </PopupEdit>
  )
}


export default Form;
