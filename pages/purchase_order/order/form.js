import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head';
import {_ServerInstance as Axios} from '/services/axios';


const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});
import dynamic from 'next/dynamic';
import Select,{components } from 'react-select';
import { Edit as IconEdit,  Grid6 as IconExcel, Trash as IconDelete, SearchNormal1 as IconSearch,Add as IconAdd, LocationTick, User,Image as IconImage, Add, Minus  } from "iconsax-react";
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import {NumericFormat} from "react-number-format";
import Link from 'next/link';
import moment from 'moment/moment';



const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
})
const Index = (props) => {
    const router = useRouter();
    const id = router.query?.id
    const dataLang = props?.dataLang
    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };
    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingPurcher, sOnFetchingPurcher] = useState(false);
    const [onFetchingItems, sOnFetchingItems] = useState(false);
    const [onFetchingItemsAll, sOnFetchingItemsAll] = useState(false);
    const [onFetchingDetail,sOnFetchingDetail] = useState(false)
    const [onSending, sOnSending] = useState(false);
    const [option, sOption] = useState([{id: Date.now(), mathang: null, donvitinh:1, soluong:1,dongia:1,chietkhau:0,dongiasauck:1, thue:0, dgsauthue:1, thanhtien:1, ghichu:"",purchases_order_item_id: ""}]);
    const slicedArr = option.slice(1);
    const sortedArr = slicedArr.sort((a, b) => b.id - a.id);
    sortedArr.unshift(option[0]);
    
    const [hidden, sHidden] = useState(false)
    const [loai, sLoai] = useState("0");
    const [dataSupplier, sDataSupplier] = useState([])
    const [dataStaff, sDataStaff] = useState([])
    const [dataPurchases, sDataPurchases] = useState([])
    const [dataItems, sDataItems] = useState([])
    const [dataTasxes, sDataTasxes] = useState([])
    const [dataBranch, sDataBranch]= useState([])

    const [dataId, sDataId] = useState([])

    const [code, sCode] = useState('')
    const [note, sNote] = useState('')
    const [thuetong, sThuetong] = useState()
    const [chietkhautong, sChietkhautong] = useState(0)
    const [selectedDate, sSelectedDate] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
    const [delivery_date, sDelivery_date] = useState(moment().format('YYYY-MM-DD'));
    const [idSupplier, sIdSupplier] = useState(null)
    const [idStaff, sIdStaff] = useState(null)
    const [idPurchases, sIdPurchases] = useState([])
    const [idBranch, sIdBranch] = useState(null);
    
    const [errDate, sErrDate] = useState(false)
    const [errSupplier, sErrSupplier] = useState(false)
    const [errStaff, sErrStaff] = useState(false)
    const [errDateDelivery, sErrDateDelivery] = useState(false)
    const [errPurchase, sErrPurchase] = useState(false)
    const [errBranch, sErrBranch] = useState(false)

    const readOnlyFirst = true;

    useEffect(() => {
        router.query && sErrDate(false)
        router.query && sErrSupplier(false)
        router.query && sErrStaff(false)
        router.query && sErrDateDelivery(false)
        router.query && sErrPurchase(false)
        router.query && sErrBranch(false)
        router.query && sSelectedDate(moment().format('YYYY-MM-DD HH:mm:ss'))
        router.query && sDelivery_date(moment().format('YYYY-MM-DD'))
        router.query && sNote("")
    }, [router.query]);

    const _ServerFetchingDetail =  () => {
      Axios("GET", `/api_web/Api_purchase_order/purchase_order/${id}?csrf_protection=true`, {
    }, (err, response) => {
        if(!err){
          var rResult = response.data;
          const itemlast =  [{mathang: null}];
          const item = itemlast?.concat(rResult?.item?.map(e => ({purchases_order_item_id: e?.purchases_order_item_id, id: e.purchases_order_item_id,mathang: {e: e?.item, label: `${e.item?.name} <span style={{display: none}}>${e.item?.code + e.item?.product_variation + e.item?.text_type + e.item?.unit_name}</span>`, value:e.item?.id}, soluong: Number(e?.quantity), dongia: Number(e?.price), chietkhau: Number(e?.discount_percent), thue: {tax_rate: e?.tax_rate, value: e?.tax_id}, donvitinh: e.item?.unit_name, dongiasauck: Number(e?.price_after_discount), note: e?.note, thanhtien:Number(e?.price_after_discount) * (1 + Number(e?.tax_rate)/100) * Number(e?.quantity)})));
          sOption(item)
          sCode(rResult?.code)
          sIdStaff(({label: rResult?.staff_name, value: rResult.staff_id}))
          sIdBranch({label: rResult?.branch_name, value:rResult?.branch_id})
          sIdSupplier(({label: rResult?.supplier_name, value: rResult?.supplier_id}))
          sSelectedDate(moment(rResult?.date).format('YYYY-MM-DD HH:mm:ss'))
          sDelivery_date(moment(rResult?.delivery_date).format('YYYY-MM-DD'))
          sLoai(rResult?.order_type)
          sIdPurchases(rResult?.purchases?.map(e => ({label: e.code, value:e.id})))
          sHidden(rResult?.order_type === "1" ? true : false)
          sOnFetchingItemsAll(rResult?.order_type === "0" ? true : false)
          sOnFetchingItems(rResult?.order_type === "1" ? true : false)
          sNote(rResult?.note)
          sDataId(item?.map(e => ({id:e?.id})))
         
         
        }
        sOnFetchingDetail(false)
    })
  }
    useEffect(() => {
      onFetchingDetail && _ServerFetchingDetail()
    }, [onFetchingDetail]);
    useEffect(() => {
      id && sOnFetchingDetail(true) 
    }, []);

    const _HandleChangeInput = (type, value) => {
        if (type === "loai") {
            Swal.fire({
              title: `${"Thay đổi sẽ xóa lựa chọn mặt hàng trước đó"}`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#296dc1',
              cancelButtonColor: '#d33',
              confirmButtonText: `${dataLang?.aler_yes}`,
              cancelButtonText:`${dataLang?.aler_cancel}`
          }).then((result) => {
            if (result.isConfirmed) {
              sLoai(value.target.value);
              sHidden(value.target.value === "1");
              sIdPurchases(value.target.value === "0" ? [] : idPurchases);
              sOnFetchingItemsAll(value.target.value === "0" && true)
              sOnFetchingItems(value.target.value === "1" && true)
              sThuetong('')
              sChietkhautong('')
              sOption([{id: Date.now(), mathang: null, donvitinh:1, soluong:1,dongia:1,chietkhau:0,dongiasauck:1, thue:0, dgsauthue:1, thanhtien:1, ghichu:""}])
            }
          })
        }else if(type == "code"){
            sCode(value.target.value)
        }else if(type === "date"){
            sSelectedDate(moment(value.target.value).format('YYYY-MM-DD HH:mm:ss'))
        }else if(type === "supplier"){
            sIdSupplier(value)
        }else if(type === "staff"){
            sIdStaff(value)
        }else if(type === "delivery_date"){
            sDelivery_date(moment(value.target.value).format('YYYY-MM-DD'))
        }else if(type === "purchases"){
            sIdPurchases(value)
            if(value?.length > 0){
              sOption([...sortedArr])
            }else{
             sOption(id ? [...sortedArr] : [{id: Date.now(), mathang: null, donvitinh:1, soluong:1,dongia:1,chietkhau:0,dongiasauck:1, thue:0, dgsauthue:1, thanhtien:1, ghichu:""}])
            }
            // sOption([{id: Date.now(), mathang: null, donvitinh:1, soluong:1,dongia:1,chietkhau:0,dongiasauck:1, thue:0, dgsauthue:1, thanhtien:1, ghichu:""}])
        }else if(type === "note"){
            sNote(value.target.value)
        }else if(type == "branch"){
            if (sortedArr?.slice(1)?.length > 0) {
              Swal.fire({
                title: `${"Thay đổi sẽ xóa lựa chọn mặt hàng trước đó"}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#296dc1',
                cancelButtonColor: '#d33',
                confirmButtonText: `${dataLang?.aler_yes}`,
                cancelButtonText:`${dataLang?.aler_cancel}`
            }).then((result) => {
              if (result.isConfirmed) {
                  sIdBranch(value)
                  sIdPurchases([])
                  sOption([{id: Date.now(), mathang: null, donvitinh:1, soluong:1,dongia:1,chietkhau:0,dongiasauck:1, thue:0, dgsauthue:1, thanhtien:1, ghichu:""}])
              } 
            })
          }else{
            sIdBranch(value)
            sIdPurchases([])
            sOption([{id: Date.now(), mathang: null, donvitinh:1, soluong:1,dongia:1,chietkhau:0,dongiasauck:1, thue:0, dgsauthue:1, thanhtien:1, ghichu:""}])
          }
          
            // if(value != null){
            //   sOption([...sortedArr])
            // }
            // else{
            //  sOption(id ? [...sortedArr] : [{id: Date.now(), mathang: null, donvitinh:1, soluong:1,dongia:1,chietkhau:0,dongiasauck:1, thue:0, dgsauthue:1, thanhtien:1, ghichu:""}])
            // }
        }else if(type == "thuetong"){
           sThuetong(value)
        }else if(type == "chietkhautong"){
           sChietkhautong(value?.value)
        }
    }
    // useEffect(() =>{
    //   idBranch != null &&  idPurchases?.length == 0 && sOption([{id: Date.now(), mathang: null, donvitinh:1, soluong:1,dongia:1,chietkhau:0,dongiasauck:1, thue:0, dgsauthue:1, thanhtien:1, ghichu:""}])
    // },[idBranch])

      // useEffect(() => {
      //   if (thuetong !== null || chietkhautong !== null) {
      //     const newArray = option.map((item,index) => {
      //       if (item.id) {
      //         const thueValue = thuetong?.e?.tax_rate || 0;
      //         const chietKhauValue = chietkhautong || 0;
      //         const dongiasauchietkhau = item.dongia * (1 - chietKhauValue / 100)
      //         const thanhTien = item.dongiasauck * (1 + thueValue / 100) * item.soluong * (1 - chietKhauValue / 100);
      //         return {
      //           ...item,
      //           thue: thuetong,
      //           chietkhau: chietkhautong,
      //           dongiasauck: isNaN(dongiasauchietkhau) ? 0 : dongiasauchietkhau,
      //           thanhtien: isNaN(thanhTien) ? 0 : thanhTien,
      //         };
      //       } else {
      //         return item;
      //       }
      //     });
      //     sOption(newArray);
      //   }
      // }, [thuetong, chietkhautong]);
      
      useEffect(() => {
        // if (thuetong == null && chietkhautong == null) return;
        if (thuetong == null) return;
        sOption(prevOption => {
          const newOption = [...prevOption];
          const thueValue = thuetong?.tax_rate || 0;
          const chietKhauValue = chietkhautong || 0;
          newOption.forEach((item, index) => {
            if (index === 0 || !item.id) return;
            // const dongiasauchietkhau = item?.dongia * (1 - chietKhauValue / 100);
            // const thanhTien = item?.dongiasauck * (1 + thueValue / 100) * item.soluong * (1 - chietKhauValue / 100);
            const thanhTien = item?.dongiasauck * (1 + thueValue / 100) * item.soluong
            item.thue = thuetong;
            // item.chietkhau = chietkhautong;
            // item.dongiasauck = isNaN(dongiasauchietkhau) ? 0 : dongiasauchietkhau;
            item.thanhtien = isNaN(thanhTien) ? 0 : thanhTien;
          });
          return newOption;
        });
      // }, [thuetong,chietkhautong]);
      }, [thuetong]);
      useEffect(() => {
        // if (thuetong == null && chietkhautong == null) return;
        if (chietkhautong == null) return;
        sOption(prevOption => {
          const newOption = [...prevOption];
          // const thueValue = thuetong?.tax_rate || 0;
          const thueValue = thuetong?.tax_rate ? thuetong?.tax_rate : 0
          const chietKhauValue = chietkhautong ? chietkhautong : 0;
          newOption.forEach((item, index) => {
            if (index === 0 || !item.id) return;
            const dongiasauchietkhau = item?.dongia * (1 - chietKhauValue / 100);
            // const thanhTien = item?.dongiasauck * (1 + thueValue / 100) * item.soluong * (1 - chietKhauValue / 100);
            const thanhTien =  chietKhauValue ? item?.dongiasauck  * item.soluong : item?.dongiasauck * (1 + Number(thueValue) / 100) * item.soluong
            item.thue = thuetong;
            item.chietkhau = chietkhautong;
            item.dongiasauck = isNaN(dongiasauchietkhau) ? 0 : dongiasauchietkhau;
            item.thanhtien = isNaN(thanhTien) ? 0 : thanhTien;
            console.log(item.thanhtien);

          });
          return newOption;
        });
      }, [chietkhautong]);


    


      const _ServerFetching =  () => {
        Axios("GET", "/api_web/api_supplier/supplier/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var db =  response.data.rResult
                sDataSupplier(db?.map(e => ({label: e.name, value:e.id })))
            }
        })
        Axios("GET", "/api_web/Api_staff/staffOption?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} =  response.data
                sDataStaff(rResult?.map(e => ({label: e.name, value: e.staffid})))                
            }
        })
        Axios("GET", "/api_web/Api_Branch/branch/?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} =  response.data
                sDataBranch(rResult?.map(e =>({label: e.name, value:e.id})))       
            }
        })
        Axios("GET", "/api_web/Api_tax/tax?csrf_protection=true", {}, (err, response) => {
            if(!err){
                var {rResult} =  response.data
                sDataTasxes(rResult?.map(e =>({label: e.name, value: e.id, tax_rate:e.tax_rate})))       
            }
        })
       
        sOnFetching(false)  
    }
    const _ServerFetching_Purcher =  () => {
        Axios("GET", "/api_web/Api_purchases/purchasesOptionNotComplete?csrf_protection=true", {
          params:{
              "filter[branch_id]": idBranch != null ? idBranch?.value : - 1
           }
        }, (err, response) => {
            if(!err){
                var db =  response.data
                sDataPurchases(db?.map(e => {return {label: e.code, value: e.id}}))           
            }
        })
        sOnFetchingPurcher(false)  
    }

    const _ServerFetching_Items =  () => {
        Axios("GET", "/api_web/Api_purchases/searchItemsVariant?csrf_protection=true", { 
          params:{
            "filter[purchases_id]":  idPurchases?.length > 0 ? idPurchases.map(e => e.value) : -1,
            "purchase_order_id": id
         }
        }, (err, response) => {
            if(!err){
                var {result} =  response.data.data
                sDataItems(result)
            } 
        })
        sOnFetchingItems(false)  
    }
    useEffect(()=>{
      onFetchingItems && _ServerFetching_Items() 
    },[onFetchingItems])

    const _ServerFetching_ItemsAll =  () => {
        Axios("GET", "/api_web/Api_product/searchItemsVariant?csrf_protection=true", {
          params:{
           "purchase_order_id": id
         }
        }, (err, response) => {
            if(!err){
                var {result} =  response.data.data
                sDataItems(result)
            } 
        })
        sOnFetchingItemsAll(false)  
    }

    useEffect(() => {
      onFetchingItemsAll && _ServerFetching_ItemsAll() 
    }, [onFetchingItemsAll]);
    
    const options =  dataItems?.map(e => ({label: `${e.name} <span style={{display: none}}>${e.code}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,value:e.id,e})) 
      console.log(options);
    useEffect(() => {
        onFetching && _ServerFetching() 
      }, [onFetching]);
      useEffect(()=>{
        onFetchingPurcher && _ServerFetching_Purcher() 
      },[onFetchingPurcher])
      

      useEffect(() => {
          router.query && sOnFetching(true) 
          router.query && sOnFetchingItemsAll(true) 
      }, [router.query]);

      useEffect(() => {
        idBranch != null && sOnFetchingPurcher(true)
      }, [idBranch]);
      
      useEffect(() => {
        idBranch == null && sIdPurchases([])
      }, [idBranch]);

      useEffect(() => {
        idPurchases?.length > 0 && sOnFetchingItems(true)
      }, [idPurchases]);
      
      const _HandleSubmit = (e) => {
        e.preventDefault();
         if(loai == "0"){
          if(selectedDate == null || idSupplier == null || idStaff == null || delivery_date == null || idBranch == null){
            selectedDate == null && sErrDate(true)
            idSupplier == null && sErrSupplier(true)
            idStaff == null && sErrStaff(true)
            idBranch == null && sErrBranch(true)
            delivery_date == null && sErrDateDelivery(true)
           
              Toast.fire({
                  icon: 'error',
                  title: `${dataLang?.required_field_null}`
              })
          }
          else {
              sOnSending(true)
          }
         }else{
          if(selectedDate == null || idSupplier == null || idStaff == null || delivery_date == null || idBranch == null || idPurchases?.length == 0){
            selectedDate == null && sErrDate(true)
            idSupplier == null && sErrSupplier(true)
            idStaff == null && sErrStaff(true)
            idBranch == null && sErrBranch(true)
            delivery_date == null && sErrDateDelivery(true)
            idPurchases?.length == 0 && sErrPurchase(true)
              Toast.fire({
                  icon: 'error',
                  title: `${dataLang?.required_field_null}`
              })
          }
          else {
              sOnSending(true)
          }
         }
      }

      useEffect(() => {
        sErrDate(false)
      }, [selectedDate != null]);
      useEffect(() => {
        sErrSupplier(false)
      }, [idSupplier != null]);
      useEffect(() => {
        sErrStaff(false)
      }, [idStaff != null]);
      useEffect(() => {
        sErrDateDelivery(false)
      }, [delivery_date != null]);
      useEffect(() => {
        sErrBranch(false)
      }, [idBranch != null]);
      useEffect(() => {
         sErrPurchase(false)
      }, [idPurchases?.length > 0 ]);

      const _HandleSeachApi = (inputValue) => {
        {loai === "0" ? 
          Axios("POST", `/api_web/Api_product/searchItemsVariant?csrf_protection=true`, {
            data: {
              term: inputValue,
            },
            params:{
              "purchase_order_id": id
            }
          }, (err, response) => {
                if(!err){
                  var {result} = response?.data.data
                  sDataItems(result)
              }
          })
          :
          Axios("POST", `/api_web/Api_purchases/searchItemsVariant?csrf_protection=true`, {
            data: {
              term: inputValue,
            },
            params:{
              "filter[purchases_id]":  idPurchases?.length > 0 ? idPurchases.map(e => e.value) : -1,
              "purchase_order_id": id
            }
          }, (err, response) => {
                if(!err){
                  var {result} = response?.data.data
                  sDataItems(result)
              }
          })
        }
      };
         
         const hiddenOptions = idPurchases?.length > 3 ? idPurchases?.slice(0, 3) : [];
         const fakeDataPurchases = idBranch != null ? dataPurchases.filter((x) => !hiddenOptions.includes(x.value)) : []
         
        //  const formatNumber = (num) => {
        //   if (!num && num !== 0) return 0;
        //   return num.toLocaleString(undefined, {minimumFractionDigits: 2});
        // };

        const formatNumber = (num) => {
          if (!num && num !== 0) return 0;
          const roundedNum = parseFloat(num.toFixed(2));
          return roundedNum.toLocaleString("en", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true
          });
        };

         const _HandleChangeInputOption = (id, type,index3, value) => {
          var index = option.findIndex(x => x.id === id );
          if(type == "mathang"){
            // const hasSelectedOption = option.some((o) => o.mathang?.value === value.value);
            // const hasSelectedOption = option.some((o) => o.mathang?.value === value.value && o.mathang?.purchases_code === value.mathang?.purchases_code);
            // const hasSelectedOption = option.some((o) => o.mathang?.value === value.value && o.mathang?.e?.purchases_code === value.mathang?.e?.purchases_code);
            //   if (hasSelectedOption) {
            //     return Toast.fire({
            //     title: `${"Mặt hàng này đã được chọn "}`,
            //     icon: 'error',
            //     confirmButtonColor: '#296dc1',
            //     cancelButtonColor: '#d33',
            //     confirmButtonText: `${dataLang?.aler_yes}`,
            //     })
            //   }
            //   else {
            //     if(option[index].mathang){
            //       option[index].mathang = value
            //       option[index].donvitinh =  value?.e?.unit_name
            //       // option[index].thanhtien =  value?.e?.unit_name
            //     }else{
            //       const newData= {id: Date.now(), mathang: value, donvitinh:value?.e?.unit_name, soluong:1,dongia:1,chietkhau: chietkhautong ? chietkhautong : 0, dongiasauck:1, thue: thuetong ? thuetong : 0, dgsauthue:1, thanhtien:1, ghichu:""}
            //       if (newData.chietkhau) {
            //         newData.dongiasauck *= (1 - Number(newData.chietkhau) / 100);
            //       }
            //       if(newData.thue?.e?.tax_rate == undefined){
            //         const tien = Number(newData.dongiasauck) * (1 + Number(0)/100) * Number(newData.soluong);
            //         newData.thanhtien = Number(tien.toFixed(2));
            //       } else { 
            //         const tien = Number(newData.dongiasauck) * (1 + Number(newData.thue?.e?.tax_rate)/100) * Number(newData.soluong);
            //         newData.thanhtien = Number(tien.toFixed(2));
            //       }
                  
            //       option.push(newData);
            //     }
            //   }
                if(option[index].mathang){
                  option[index].mathang = value
                  option[index].donvitinh =  value?.e?.unit_name
                  option[index].soluong =  idPurchases?.length ? Number(value?.e?.quantity_left) : 1
                  option[index].thanhtien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
                  
                }else{
                  const newData= {id: Date.now(), mathang: value, donvitinh:value?.e?.unit_name, soluong: idPurchases?.length ? Number(value?.e?.quantity_left) : 1, dongia:1, chietkhau: chietkhautong ? chietkhautong : 0, dongiasauck:1, thue: thuetong ? thuetong : 0, dgsauthue:1, thanhtien:1, ghichu:""}
                  if (newData.chietkhau) {
                    newData.dongiasauck *= (1 - Number(newData.chietkhau) / 100);
                  }
                  if(newData.thue?.e?.tax_rate == undefined){
                    const tien = Number(newData.dongiasauck) * (1 + Number(0)/100) * Number(newData.soluong);
                    newData.thanhtien = Number(tien.toFixed(2));
                  } else { 
                    const tien = Number(newData.dongiasauck) * (1 + Number(newData.thue?.e?.tax_rate)/100) * Number(newData.soluong);
                    newData.thanhtien = Number(tien.toFixed(2));
                  }
                  option.push(newData);
                }
          }else if(type == "donvitinh"){
            option[index].donvitinh = value.target?.value;
          }else if (type === "soluong") {
            option[index].soluong = Number(value?.value);
            if(option[index].thue?.tax_rate == undefined){
              const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
              option[index].thanhtien = Number(tien.toFixed(2));
            }else{
              const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
              option[index].thanhtien = Number(tien.toFixed(2));
            }
            sOption([...option]);
          }else if(type == "dongia"){
              option[index].dongia = Number(value.value)
              option[index].dongiasauck = +option[index].dongia * (1 - option[index].chietkhau/100);
              option[index].dongiasauck = +(Math.round(option[index].dongiasauck + 'e+2') + 'e-2');
              if(option[index].thue?.tax_rate == undefined){
                const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
              }else{
                const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
              }

          }else if(type == "chietkhau"){
              option[index].chietkhau = Number(value.value) 
              option[index].dongiasauck = +option[index].dongia * (1 - option[index].chietkhau/100);
              option[index].dongiasauck = +(Math.round(option[index].dongiasauck + 'e+2') + 'e-2');
              if(option[index].thue?.tax_rate == undefined){
                const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
              }else{
                const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
              }
          }else if(type == "thue"){
              option[index].thue = value
              if(option[index].thue?.tax_rate == undefined){
                const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
              }else{
                const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
                option[index].thanhtien = Number(tien.toFixed(2));
              }
          }
          else if(type == "ghichu"){
              option[index].ghichu = value?.target?.value;
          }
          sOption([...option])
        }
        const handleIncrease = (id) => {
          const index = option.findIndex((x) => x.id === id);
          const newQuantity = option[index].soluong + 1;
          option[index].soluong = newQuantity;
          if(option[index].thue?.tax_rate == undefined){
            const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
            option[index].thanhtien = Number(tien.toFixed(2));
          }else{
            const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
            option[index].thanhtien = Number(tien.toFixed(2));
          }
          sOption([...option]);
        };
    
        const handleDecrease = (id) => {
          const index = option.findIndex((x) => x.id === id);
          const newQuantity = Number(option[index].soluong) - 1;
          if (newQuantity >= 1) { // chỉ giảm số lượng khi nó lớn hơn hoặc bằng 1
            option[index].soluong = Number(newQuantity);
            if(option[index].thue?.tax_rate == undefined){
              const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
              option[index].thanhtien = Number(tien.toFixed(2));
            }else{
              const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
              option[index].thanhtien = Number(tien.toFixed(2));
            }
            sOption([...option]);
          }else{
            return  Toast.fire({
              title: `${"Số lượng tối thiểu"}`,
              icon: 'error',
              confirmButtonColor: '#296dc1',
              cancelButtonColor: '#d33',
              confirmButtonText: `${dataLang?.aler_yes}`,
              })
          }
        };
      const _HandleDelete =  (id) => {
        if (id === option[0].id) {
          return Toast.fire({
            title: `${"Mặc định hệ thống, không xóa"}`,
            icon: 'error',
            confirmButtonColor: '#296dc1',
            cancelButtonColor: '#d33',
            confirmButtonText: `${dataLang?.aler_yes}`,
          })
        }
          const newOption = option.filter(x => x.id !== id); // loại bỏ phần tử cần xóa
          const fakeDataId = newOption.dataId
          sOption(newOption); // cập nhật lại mảng
        }

        const taxOptions = [{ label: "Miễn thuế", value: "0",   tax_rate: "0"}, ...dataTasxes] 

        const tinhTongTien = (option) => {

          const tongTien = option.slice(1).reduce((accumulator, currentValue) => accumulator + currentValue?.dongia * currentValue?.soluong, 0);
        
          const tienChietKhau = option.slice(1).reduce((acc, item) => {
            const chiTiet = item?.dongia * (item?.chietkhau/100) * item?.soluong;
            return acc + chiTiet;
          }, 0);
        
          const tongTienSauCK = option.slice(1).reduce((acc, item) => {
            const tienSauCK = item?.soluong * item?.dongiasauck;
            return acc + tienSauCK;
          }, 0);
        
          const tienThue = option.slice(1).reduce((acc, item) => {
            const tienThueItem = item?.dongiasauck * (isNaN(item?.thue?.tax_rate) ? 0 : (item?.thue?.tax_rate/100)) * item?.soluong;
            return acc + tienThueItem;
          }, 0);
        
          const tongThanhTien = option.slice(1).reduce((acc, item) => acc + item?.thanhtien, 0);
        
          return { tongTien: tongTien || 0, tienChietKhau: tienChietKhau || 0, tongTienSauCK: tongTienSauCK || 0, tienThue: tienThue || 0, tongThanhTien: tongThanhTien || 0 };
        };

        const [tongTienState, setTongTienState] = useState({ tongTien: 0, tienChietKhau: 0, tongTienSauCK: 0, tienThue: 0, tongThanhTien: 0 });
        useEffect(() => {
          const tongTien = tinhTongTien(option);
          setTongTienState(tongTien);
        }, [option]);

      const dataOption = sortedArr?.map(e => { return {item: e?.mathang?.value, quantity: Number(e?.soluong), price: e?.dongia, discount_percent:e?.chietkhau, tax_id:e?.thue?.value,purchases_item_id: e?.mathang?.e?.purchases_item_id, note: e?.ghichu, id:e?.id, purchases_order_item_id: e?.purchases_order_item_id}})
      let newDataOption = dataOption?.filter(e => e?.item !== undefined);
        const _ServerSending = () => {
          var formData = new FormData();
          formData.append("code", code)
          formData.append("date", (moment(selectedDate).format("YYYY-MM-DD HH:mm:ss")))
          formData.append("delivery_date", (moment(delivery_date).format("YYYY-MM-DD")))
          formData.append("suppliers_id", idSupplier.value)
          formData.append("order_type ", loai)
          formData.append("branch_id", idBranch.value)
          formData.append("staff_id", idStaff.value)
          formData.append("note", note)
          if(loai === "1"){
            idPurchases?.map((e,index) =>{
              return formData.append(`purchase[${index}][id]`, e?.value);
            })
          }
          newDataOption.forEach((item, index) => {
            formData.append(`items[${index}][purchases_item_id]`, item?.purchases_item_id != undefined ? item?.purchases_item_id : "");
            formData.append(`items[${index}][purchases_order_item_id]`, item?.purchases_order_item_id != undefined ? item?.purchases_order_item_id : "");
            formData.append(`items[${index}][item]`, item?.item);
            formData.append(`items[${index}][id]`, router.query?.id ? item?.id : "");
            formData.append(`items[${index}][quantity]`, item?.quantity.toString());
            formData.append(`items[${index}][price]`, item?.price);
            formData.append(`items[${index}][discount_percent]`, item?.discount_percent);
            formData.append(`items[${index}][tax_id]`, item?.tax_id != undefined ? item?.tax_id : "");
            formData.append(`items[${index}][note]`, item?.note != undefined ? item?.note : "");
        });  
          Axios("POST", `${id ? `/api_web/Api_purchase_order/purchase_order/${id}?csrf_protection=true` : "/api_web/Api_purchase_order/purchase_order/?csrf_protection=true"}`, {
              data: formData,
              headers: {'Content-Type': 'multipart/form-data'}
          }, (err, response) => {
              if(!err){
                  var {isSuccess, message} = response.data
                  if(isSuccess){
                      Toast.fire({
                          icon: 'success',
                          title: `${dataLang[message]}`
                      })
                      sCode("")
                      sSelectedDate(new Date().toISOString().slice(0, 10))
                      sDelivery_date(new Date().toISOString().slice(0, 10))
                      sIdStaff(null)
                      sIdSupplier(null)
                      sIdBranch(null)
                      sLoai("0")
                      sIdPurchases([])
                      sNote("")
                      sErrBranch(false)
                      sErrDate(false)
                      sErrDateDelivery(false)
                      sErrPurchase(false)
                      sErrSupplier(false)
                      sOption([{id: Date.now(), mathang: null, donvitinh:"", soluong:0, ghichu:""}])
                      router.back()
                  }else {
                    if(tongTienState.tongTien == 0){
                      Toast.fire({
                        icon: 'error',
                        title: `Chưa nhập thông tin mặt hàng`
                    })
                    }
                    else{
                      Toast.fire({
                        icon: 'error',
                        title: `${dataLang[message]}`
                      })
                    }
                     
                  }
              }
              sOnSending(false)
          })
      }
      useEffect(() => {
        onSending && _ServerSending()
    }, [onSending]);

//     const formatDate = (dateString) => {
//   const date = moment(dateString, "YYYY-MM-DDTHH:mm:ss.SSSZ");
//   const formattedDate = date.format("DD/MM/YYYY, HH:mm:ss");
//   return formattedDate;
// }
    return (
    <React.Fragment>
    <Head>
        <title>{id ? dataLang?.purchase_order_edit_order || "purchase_order_edit_order" : dataLang?.purchase_order_add_order || "purchase_order_add_order"}</title>
    </Head>
    <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 flex flex-col justify-between'>
        <div className='h-[97%] space-y-3 overflow-hidden'>
            <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                <h6 className='text-[#141522]/40'>{dataLang?.purchase_order || "purchase_order"}</h6>
                <span className='text-[#141522]/40'>/</span>
                <h6>{dataLang?.purchase_order_information || "purchase_order_information"}</h6>
            </div>
            <div className='flex justify-between items-center'>
                <h2 className='xl:text-2xl text-xl '>{dataLang?.purchase_order_information || "purchase_order_information"}</h2>
                <div className="flex justify-end items-center">
                    <button   
                    onClick={() => router.back()} 
                    className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105">{"Quay lại"}</button>
                </div>
            </div>
                
            <div className=' w-full rounded'>
              <div className=''>  
                  <h2 className='font-normal bg-[#ECF0F4] p-2'>{dataLang?.purchase_order_detail_general_informatione || "purchase_order_detail_general_informatione"}</h2>       
                    <div className="flex flex-wrap justify-start gap-3 items-center mt-2"> 
                        <div className='w-[24.5%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_table_code || "purchase_order_table_code"} </label>
                          <input
                              value={code}                
                              onChange={_HandleChangeInput.bind(this, "code")}
                              name="fname"                      
                              type="text"
                              placeholder={dataLang?.purchase_order_system_default || "purchase_order_system_default"} 
                              className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}/>
                        </div>
                        <div className='w-[24.5%]'>
                            <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_detail_day_vouchers || "purchase_order_detail_day_vouchers"} <span className="text-red-500">*</span></label>
                            <input
                              value={selectedDate}    
                              onChange={_HandleChangeInput.bind(this, "date")}
                              name="fname"                      
                              type="datetime-local"
                              className={`${errDate ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}/>
                              {errDate && <label className="text-sm text-red-500">{dataLang?.purchase_err_Date || "purchase_err_Date"}</label>}
                        </div>
                        <div className='w-[24.5%]'>
                      <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_table_supplier} <span className="text-red-500">*</span></label>
                        <Select 
                            options={dataSupplier}
                            onChange={_HandleChangeInput.bind(this, "supplier")}
                            value={idSupplier}
                            placeholder={dataLang?.purchase_order_supplier || "purchase_order_supplier"} 
                            hideSelectedOptions={false}
                            isClearable={true}
                            className={`${errSupplier ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
                            isSearchable={true}
                            noOptionsMessage={() => "Không có dữ liệu"}
                            // components={{ MultiValue }}
                            menuPortalTarget={document.body}
                            closeMenuOnSelect={true}
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
                                zIndex: 20
                              }), 
                              control: (base,state) => ({
                                ...base,
                                boxShadow: 'none',
                                padding:"2.7px",
                              ...(state.isFocused && {
                                border: '0 0 0 1px #92BFF7',
                              }),
                            })
                          }}
                          />
                          {errSupplier && <label className="text-sm text-red-500">{dataLang?.purchase_order_errSupplier || "purchase_order_errSupplier"}</label>}
                        </div>
                        <div className='w-[24.5%]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_staff || "purchase_order_staff"} <span className="text-red-500">*</span></label>
                          <Select 
                            options={dataStaff}
                            onChange={_HandleChangeInput.bind(this, "staff")}
                            value={idStaff}
                            placeholder={dataLang?.purchase_order_staff || "purchase_order_staff"} 
                            hideSelectedOptions={false}
                            isClearable={true}
                            className={`${errStaff ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
                            isSearchable={true}
                            noOptionsMessage={() => "Không có dữ liệu"}
                            menuPortalTarget={document.body}
                            closeMenuOnSelect={true}
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
                                zIndex: 20
                              }), 
                              control: (base,state) => ({
                                ...base,
                                boxShadow: 'none',
                                padding:"2.7px",
                              ...(state.isFocused && {
                                border: '0 0 0 1px #92BFF7',
                              }),
                            })
                          }}
                          />
                        {errStaff && <label className="text-sm text-red-500">{dataLang?.purchase_order_errStaff || "purchase_order_errStaff"}</label>}
                        </div>
                        <div className='w-[24.5%]'>
                            <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_detail_delivery_date || "purchase_order_detail_delivery_date"} <span className="text-red-500">*</span></label>
                            <input
                              value={delivery_date}              
                              onChange={_HandleChangeInput.bind(this, "delivery_date")}
                              name="fname"                      
                              type="date"
                              placeholder={dataLang?.purchase_order_system_default || "purchase_order_system_default"}
                              className={`${errDateDelivery ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}/>
                              {errDateDelivery && <label className="text-sm text-red-500">{"purchase_err_Date"}</label>}
                          
                        </div>
                        <div className=' w-[23vw]'>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_table_branch || "purchase_order_table_branch"} <span className="text-red-500">*</span></label>
                          <Select 
                              options={dataBranch}
                              onChange={_HandleChangeInput.bind(this, "branch")}
                              value={idBranch}
                              isClearable={true}
                              closeMenuOnSelect={true}
                              hideSelectedOptions={false}
                              placeholder={dataLang?.purchase_order_branch || "purchase_order_branch"} 
                              className={`${errBranch ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
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
                                  boxShadow: 'none',
                                  padding:"2.7px",
                                ...(state.isFocused && {
                                  border: '0 0 0 1px #92BFF7',
                                }),
                              })
                          }}
                          />
                          {errBranch && <label className="text-sm text-red-500">{dataLang?.purchase_order_errBranch || "purchase_order_errBranch"}</label>}
                        </div>
                        <div className='w-[24.5%]'>
                          <label  className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"} </label>
                          <div className='flex items-center gap-5'>
                              <div className="flex items-center ">
                                  <input onChange={_HandleChangeInput.bind(this, "loai")} id="default-radio-1" type="radio" value="0" checked={loai === "0" ? true : false} name="default-radio" className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                  <label for="default-radio-1" className="ml-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300">{dataLang?.purchase_order_new_booking || "purchase_order_new_booking"}</label>
                              </div>
                              <div className="flex items-center">
                                  <input onChange={_HandleChangeInput.bind(this, "loai")} checked={loai === "1" ? true : false}  id="default-radio-2" type="radio" value="1" name="default-radio" className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                  <label for="default-radio-2" className="ml-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300">{dataLang?.purchase_order_according_to_YCMH || "purchase_order_according_to_YCMH"}</label>
                              </div>
                          </div>
                        </div>
                        {hidden && ( 
                          <div className='w-[24.5%]'>
                            <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_purchase_requisition_form || "purchase_order_purchase_requisition_form"} <span className="text-red-500">*</span></label>
                              <Select 
                                  options={fakeDataPurchases}
                                  components={{ MultiValue }}
                                  onChange={_HandleChangeInput.bind(this, "purchases")}
                                  value={idPurchases}
                                  placeholder={dataLang?.purchase_order_purchase_requisition_form || "purchase_order_purchase_requisition_form"} 
                                  hideSelectedOptions={false}
                                  isClearable={true}
                                  className={`${errPurchase ? "border-red-500" : "border-transparent" } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `} 
                                  isSearchable={true}
                                  noOptionsMessage={() => "Không có dữ liệu"}
                                  menuPortalTarget={document.body}
                                  isMulti
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
                                      zIndex: 20
                                    }), 
                                    control: (base,state) => ({
                                        ...base,
                                        boxShadow: 'none',
                                        padding:"2.7px",
                                      ...(state.isFocused && {
                                        border: '0 0 0 1px #92BFF7',
                                      }),
                                  })
                                }}
                                />
                              {errPurchase && <label className="text-sm text-red-500">{dataLang?.purchase_order_errYCMH || "purchase_order_errYCMH"}</label>}
                          </div>
                        )}
                       
                    </div> 
              </div>
            </div>
            <h2 className='font-normal bg-[#ECF0F4] p-2  '>{dataLang?.purchase_order_purchase_item_information || "purchase_order_purchase_item_information"}</h2>  
              <div className='pr-2'>
              <div className='grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10'>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-3    text-left    truncate font-[400]'>{dataLang?.purchase_order_purchase_from_item || "purchase_order_purchase_from_item"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{dataLang?.purchase_order_purchase_from_unit || "purchase_order_purchase_from_unit"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{dataLang?.purchase_quantity || "purchase_quantity"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{dataLang?.purchase_order_detail_unit_price || "purchase_order_detail_unit_price"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{dataLang?.purchase_order_detail_discount || "purchase_order_detail_discount"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-left    font-[400]'>{dataLang?.purchase_order_detail_after_discount || "purchase_order_detail_after_discount"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-left    truncate font-[400]'>{dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-left    truncate font-[400]'>{dataLang?.purchase_order_note || "purchase_order_note"}</h4>
                  <h4 className='2xl:text-[14px] xl:text-[13px] text-[12px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{dataLang?.purchase_order_table_operations || "purchase_order_table_operations"}</h4>
              </div>     
              </div>     
            <div className='h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
                <div className='pr-2'>
                  <React.Fragment>
                      <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]"> 
                          {sortedArr.map((e,index) => 
                            <div className='grid grid-cols-12 gap-1 py-1 ' key={e?.id}>
                            <div className='col-span-3  z-[100] my-auto'>
                           <Select 
                           onInputChange={_HandleSeachApi.bind(this)}
                           dangerouslySetInnerHTML={{__html: option.label}}
                           options={options}
                           onChange={_HandleChangeInputOption.bind(this, e?.id, "mathang",index)}
                           value={e?.mathang}
                           formatOptionLabel={(option) => (
                          <div className='flex items-center  justify-between py-2'>
                            <div className='flex items-center gap-2'>
                              <div>
                              {option.e?.images != null ? (<img src={option.e?.images} alt="Product Image" style={{ width: "40px", height: "50px" }} className='object-cover rounded' />):
                                    <div className='w-[50px] h-[60px] object-cover  flex items-center justify-center rounded'>
                                      <img src="/no_img.png" alt="Product Image" style={{ width: "40px", height: "40px" }} className='object-cover rounded' />
                                  </div>
                                  }
                              </div>
                              <div>
                                <h3 className='font-medium'>{option.e?.name}</h3>
                                <div className='flex gap-2'>
                                  <h5 className='text-gray-400 font-normal'>{option.e?.code}</h5>
                                  <h5 className='font-medium'>{option.e?.product_variation}</h5>
                                </div>
                                <h5 className='text-gray-400 font-medium text-xs'>{dataLang[option.e?.text_type]} {loai == "1" ? "-":""} {loai == "1" ? option.e?.purchases_code : ""} {loai == "1" ? "- Số lượng:":""} {loai == "1" ? option.e?.quantity_left  : ""}</h5>
                              </div>
                            </div>
                            <div className=''>
                               <div className='text-right opacity-0'>{"0"}</div>
                               <div className='flex gap-2'>
                                 <div className='flex items-center gap-2'>
                                   <h5 className='text-gray-400 font-normal'>{dataLang?.purchase_survive || "purchase_survive"}:</h5><h5 className=' font-medium'>{option.e?.qty_warehouse ? option.e?.qty_warehouse : "0" }</h5>
                                 </div>
                                
                                </div>
                            </div>
                          </div>
                        )}
                           placeholder={dataLang?.purchase_items || "purchase_items"} 
                           hideSelectedOptions={false}
                           className="rounded-md bg-white  xl:text-base text-[14.5px] z-20 mb-2" 
                           isSearchable={true}
                           noOptionsMessage={() => "Không có dữ liệu"}
                           menuPortalTarget={document.body}
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
                              zIndex: 9999
                            }), 
                            control: (base, state) => ({
                              ...base,
                              ...(state.isFocused && {
                                border: '0 0 0 1px #92BFF7',
                                boxShadow: 'none'
                              }),
                            }),
                         }}
                         />
                         </div>
                         <div className='col-span-1 text-center flex items-center justify-center'>
                           <h3 className=''>{e?.donvitinh}</h3>
                        </div>
                        <div className='col-span-1 flex items-center justify-center'>
                           <div className="flex items-center justify-center">
                               <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                              onClick={() => handleDecrease(e?.id)}  disabled={index === 0} 
                              ><Minus size="16"/></button>
                              <NumericFormat
                                className="appearance-none text-center py-2 px-4 font-medium w-20 focus:outline-none border-b-2 border-gray-200"
                                onValueChange={_HandleChangeInputOption.bind(this, e?.id, "soluong",e)}
                                value={e?.soluong || 1}
                                thousandSeparator={false}
                                allowNegative={false}
                                readOnly={index === 0 ? readOnlyFirst : false}
                                decimalScale={0}
                                isNumericString={true}  
                                 isAllowed={(values) => { const {floatValue} = values; return floatValue > 0 }}       
                                />
                                <button  className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                                onClick={() => handleIncrease(e.id)} disabled={index === 0}
                                >
                                    <Add size="16"/>
                                </button>
                              </div>
                        </div>
                        <div className='col-span-1 text-center flex items-center justify-center'>
                          <NumericFormat
                                value={e?.dongia}
                                onValueChange={_HandleChangeInputOption.bind(this, e?.id, "dongia",index)}
                                allowNegative={false}
                                readOnly={index === 0 ? readOnlyFirst : false}
                                decimalScale={0}
                                isNumericString={true}   
                                className="appearance-none text-center py-1 px-2 font-medium w-20 focus:outline-none border-b-2 border-gray-200"
                                thousandSeparator=","
                            />
                        </div>
                        <div className='col-span-1 text-center flex items-center justify-center'>
                          <NumericFormat
                              value={e?.chietkhau}
                              onValueChange={_HandleChangeInputOption.bind(this, e?.id, "chietkhau",index)}
                              className="appearance-none text-center py-1 px-2 font-medium w-20 focus:outline-none border-b-2 border-gray-200"
                              thousandSeparator=","
                              allowNegative={false}
                              // readOnly={index === 0 ? readOnlyFirst : false}
                              // decimalScale={0}
                              isNumericString={true}   
                          />
                        </div>
                        
                        <div className='col-span-1 text-right flex items-center justify-end'>
                           <h3 className='px-2'>{formatNumber(e?.dongiasauck)}</h3>
                        </div>
                        <div className='col-span-1 flex justify-center items-center'>
                        <Select 
                            options={taxOptions}
                            onChange={_HandleChangeInputOption.bind(this, e?.id, "thue", index)}
                            value={e?.thue ? {label: taxOptions.find(item => item.value === e?.thue?.value)?.label, value: e?.thue?.value, tax_rate: e?.thue?.tax_rate} : null}
                            placeholder={"% Thuế"} 
                            hideSelectedOptions={false}
                            formatOptionLabel={(option) => (
                              <div className='flex justify-start items-center gap-1 '>
                                  <h2>{option?.label}</h2>
                                  <h2>{`(${option?.tax_rate})`}</h2>
                              </div>
                            )}
                            className={` "border-transparent placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `} 
                            isSearchable={true}
                            noOptionsMessage={() => "Không có dữ liệu"}
                            // dangerouslySetInnerHTML={{__html: option.label}}
                            menuPortalTarget={document.body}
                            closeMenuOnSelect={true}
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
                                zIndex: 20
                              }), 
                              control: (base,state) => ({
                                ...base,
                                boxShadow: 'none',
                                padding:"2.7px",
                              ...(state.isFocused && {
                                border: '0 0 0 1px #92BFF7',
                              }),
                            })
                          }}
                          />
                        </div>
                        <div className='col-span-1 text-right flex items-center justify-end'>
                           <h3 className='px-2'>{formatNumber(e?.thanhtien)}</h3>
                        </div>
                         <div className='col-span-1 flex items-center justify-center'>
                             <input
                                 value={e?.ghichu}                
                                 onChange={_HandleChangeInputOption.bind(this, e?.id, "ghichu",index)}
                                 name="optionEmail"     
                                 placeholder='Ghi chú'                 
                                 type="text"
                                 className= "focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                               /> 
                         </div>
                         <div className='col-span-1 flex items-center justify-center'>
                           <button
                            onClick={_HandleDelete.bind(this, e?.id)}
                             type='button' title='Xóa' className='transition  w-full bg-slate-100 h-10 rounded-[5.5px] text-red-500 flex flex-col justify-center items-center mb-2'><IconDelete /></button>
                         </div>
                           </div>
                          )} 
                          </div>
                  </React.Fragment>
                </div>
            </div>
        <div className='grid grid-cols-12 mb-3 font-normal bg-[#ecf0f475] p-2 items-center'>
                    <div className='col-span-2  flex items-center gap-2'>
                          <h2>{dataLang?.purchase_order_detail_discount || "purchase_order_detail_discount"}</h2>
                          <div className='col-span-1 text-center flex items-center justify-center'>
                          <NumericFormat
                              value={chietkhautong}
                              onValueChange={_HandleChangeInput.bind(this, "chietkhautong")}
                              className=" text-center py-1 px-2 bg-transparent font-medium w-20 focus:outline-none border-b-2 border-gray-300"
                              thousandSeparator=","
                              allowNegative={false}
                              decimalScale={0}
                              isNumericString={true}   
                          />
                        </div> 
                      </div>
                      <div className='col-span-2 flex items-center gap-2'>
                          <h2>{dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}</h2>  
                          <Select 
                            options={taxOptions}
                            onChange={_HandleChangeInput.bind(this, "thuetong")}
                            value={thuetong}
                            formatOptionLabel={(option) => (
                              <div className='flex justify-start items-center gap-1 '>
                                  <h2>{option?.label}</h2>
                                  <h2>{`(${option?.tax_rate})`}</h2>
                              </div>
                              )}
                            // formatOptionLabel={(option) => (
                            //   <div className='flex justify-start items-center gap-4 '>
                            //       <h2>{option?.e?.name}</h2>
                            //       <h2>{`(${option?.e?.tax_rate})`}</h2>
                            //   </div>
                            //   )}
                            placeholder={dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"} 
                            hideSelectedOptions={false}
                            className={` "border-transparent placeholder:text-slate-300 w-[70%] z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `} 
                            isSearchable={true}
                            noOptionsMessage={() => "Không có dữ liệu"}
                           dangerouslySetInnerHTML={{__html: option.label}}
                            menuPortalTarget={document.body}
                            closeMenuOnSelect={true}
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
                                zIndex: 20
                              }), 
                              control: (base,state) => ({
                                ...base,
                                boxShadow: 'none',
                                padding:"2.7px",
                              ...(state.isFocused && {
                                border: '0 0 0 1px #92BFF7',
                              }),
                            })
                          }}
                          />     
                      </div>
                      
                     
                  </div>
        <h2 className='font-normal bg-[white]  p-2 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]'>{dataLang?.purchase_order_table_total_outside || "purchase_order_table_total_outside"} </h2>  
        </div>
        <div className='grid grid-cols-12'>
            <div className='col-span-10'>
                <div className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.purchase_order_note || "purchase_order_note"}</div>
                  <textarea
                    value={note}       
                    placeholder={dataLang?.purchase_order_note || "purchase_order_note"}         
                    onChange={_HandleChangeInput.bind(this, "note")}
                    name="fname"                      
                    type="text"
                    className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-[40%] min-h-[220px] max-h-[220px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                  />
            </div>
            <div className="text-right mt-5 space-y-4 col-span-2 flex-col justify-between ">
                <div className='flex justify-between '>
                </div>
                <div className='flex justify-between '>
                     <div className='font-normal'><h3>{dataLang?.purchase_order_table_total ||"purchase_order_table_total" }</h3></div>
                    <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.tongTien)}</h3></div>
                </div>
                <div className='flex justify-between '>
                     <div className='font-normal'><h3>{dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"}</h3></div>
                    <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.tienChietKhau)}</h3></div>
                </div>
                <div className='flex justify-between '>
                     <div className='font-normal'><h3>{dataLang?.purchase_order_detail_money_after_discount || "purchase_order_detail_money_after_discount"}</h3></div>
                    <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.tongTienSauCK)}</h3></div>
                </div>
                <div className='flex justify-between '>
                     <div className='font-normal'><h3>{dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"}</h3></div>
                    <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.tienThue)}</h3></div>
                </div>
                <div className='flex justify-between '>
                     <div className='font-normal'><h3>{dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}</h3></div>
                    <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.tongThanhTien)}</h3></div>
                </div>
                <div className='space-x-2'>
                <button
                 onClick={() => router.back()} 
                 className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]">{dataLang?.purchase_order_purchase_back || "purchase_order_purchase_back"}</button>
                  <button 
                  onClick={_HandleSubmit.bind(this)} 
                   type="submit"className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]">{dataLang?.purchase_order_purchase_save || "purchase_order_purchase_save"}</button>
                </div>
            </div>
        </div>
      
    </div>
</React.Fragment>
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

export default Index