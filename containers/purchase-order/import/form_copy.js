import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import Select, { components } from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import { _ServerInstance as Axios } from '/services/axios';

import { FORMAT_MOMENT } from '@/constants/formatDate/formatDate';
import { formatMoment } from '@/utils/helpers/formatMoment';
import { Add, Add as IconAdd, Trash as IconDelete, Minus } from "iconsax-react";
import moment from 'moment/moment';
import { useEffect } from 'react';
import { NumericFormat } from "react-number-format";
import Swal from 'sweetalert2';

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
  const [onFetchingDetail, sOnFetchingDetail] = useState(false);

  const [onFetchingItemsAll, sOnFetchingItemsAll] = useState(false);
  const [onFetchingTheOrder, sOnFetchingTheOrder] = useState(false);
  const [onFetchingSupplier, sOnFetchingSupplier] = useState(false);
  const [onFetchingWarehouser, sOnFetchingWarehouse] = useState(false);

  const [onSending, sOnSending] = useState(false);
  const [thuetong, sThuetong] = useState()
  const [chietkhautong, sChietkhautong] = useState(0)

  const [code, sCode] = useState('')
  const [note, sNote] = useState('')
  const [date, sDate] = useState(moment().format(FORMAT_MOMENT.DATE_TIME_LONG));
  const [dataSupplier, sDataSupplier] = useState([])
  const [dataThe_order, sDataThe_order] = useState([])
  const [dataBranch, sDataBranch] = useState([])
  const [dataItems, sDataItems] = useState([])
  const [warehouse, sDataWarehouse] = useState([])
  const [dataTasxes, sDataTasxes] = useState([])

  const [option, sOption] = useState([
    {
      id: Date.now(),
      mathang: null,
      child: [
        {
          id: uuidv4(),
          khohang: null,
          donvitinh: "",
          soluong: 1,
          dongia: 1,
          thue: 0,
          thanhtien: 1,
          ghichu: ""
        }
      ]
    }
  ]);
  const slicedArr = option.slice(1);
  const sortedArr = slicedArr.sort((a, b) => b.id - a.id);
  sortedArr.unshift(option[0]);

  const [idSupplier, sIdSupplier] = useState(null)
  const [idTheOrder, sIdTheOrder] = useState(null)
  const [idBranch, sIdBranch] = useState(null);

  const [errSupplier, sErrSupplier] = useState(false)
  const [errDate, sErrDate] = useState(false)
  const [errTheOrder, sErrTheOrder] = useState(false)
  const [errBranch, sErrBranch] = useState(false)
  const [errWarehouse, sErrWarehouse] = useState(false)
  const [mathangAll, sMathangAll] = useState([])
  const [khotong, sKhotong] = useState(null)

  const [cutTomStyle, sCustomStyle] = useState(null)

  useEffect(() => {
    router.query && sErrDate(false)
    router.query && sErrSupplier(false)
    router.query && sErrTheOrder(false)
    router.query && sErrBranch(false)
    // router.query && sErrWarehouse(false)
    router.query && sDate(moment().format(FORMAT_MOMENT.DATE_TIME_LONG))
    router.query && sNote("")
  }, [router.query]);


  const _ServerFetchingDetail = () => {
    Axios("GET", `/api_web/Api_import/import/${id}?csrf_protection=true`, {
    }, (err, response) => {
      if (!err) {
        var rResult = response.data;
        const itemlast = [{ mathang: null }];
        const item = itemlast?.concat(rResult?.items?.map(e => ({
          purchases_order_item_id: e?.item?.purchase_order_item_id,
          id: e.id,
          mathang: { e: e?.item, label: `${e.item?.name} <span style={{display: none}}>${e.item?.code + e.item?.product_variation + e.item?.text_type + e.item?.unit_name}</span>`, value: e.item?.id },
          khohang: { label: e?.location_name, value: e?.location_warehouses_id, warehouse_name: e?.warehouse_name },
          soluong: Number(e?.quantity),
          dongia: Number(e?.price),
          chietkhau: Number(e?.discount_percent),
          thue: { tax_rate: e?.tax_rate, value: e?.tax_id },
          donvitinh: e.item?.unit_name,
          dongiasauck: Number(e?.price_after_discount),
          ghichu: e?.note,
          thanhtien: Number(e?.price_after_discount) * (1 + Number(e?.tax_rate) / 100) * Number(e?.quantity)
        })));
        sOption(item)
        sCode(rResult?.code)
        sIdBranch({ label: rResult?.branch_name, value: rResult?.branch_id })
        sIdSupplier({ label: rResult?.supplier_name, value: rResult?.supplier_id })
        sIdTheOrder({ label: rResult?.purchase_order_code, value: rResult?.purchase_order_id })
        sDate(formatMoment(rResult?.date, FORMAT_MOMENT.DATE_TIME_LONG))
        sNote(rResult?.note)
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

  const _ServerFetching = () => {
    Axios("GET", "/api_web/Api_Branch/branchCombobox/?csrf_protection=true", {}, (err, response) => {
      if (!err) {
        var { isSuccess, result } = response.data
        sDataBranch(result?.map(e => ({ label: e.name, value: e.id })))
      }
    })
    Axios("GET", "/api_web/Api_tax/tax?csrf_protection=true", {}, (err, response) => {
      if (!err) {
        var { rResult } = response.data
        sDataTasxes(rResult?.map(e => ({ label: e.name, value: e.id, tax_rate: e.tax_rate })))
      }
    })
    sOnFetching(false)
  }

  useEffect(() => {
    onFetching && _ServerFetching()
  }, [onFetching]);


  const _ServerFetching_TheOrder = () => {
    Axios("GET", "/api_web/Api_purchase_order/purchase_order_combobox/?csrf_protection=true", {
      params: {
        "filter[supplier_id]": idSupplier ? idSupplier?.value : null,
        "import_id": id ? id : ""
      }
    }, (err, response) => {
      if (!err) {
        var db = response.data
        sDataThe_order(db?.map(e => ({ label: e?.code, value: e?.id })) || { label: db?.code, value: db?.id })
      }
    })
    sOnFetchingTheOrder(false)
  }

  useEffect(() => {
    idSupplier === null && sDataThe_order([]) || sIdTheOrder(null)
  }, [])

  const _ServerFetching_Supplier = () => {
    Axios("GET", "/api_web/api_supplier/supplier/?csrf_protection=true", {
      params: {
        "filter[branch_id]": idBranch != null ? idBranch.value : null,
      }
    }, (err, response) => {
      if (!err) {
        var { rResult } = response.data
        sDataSupplier(rResult?.map(e => ({ label: e.name, value: e.id })))
      }
    })
    sOnFetchingSupplier(false)
  }

  useEffect(() => {
    idBranch === null && sDataSupplier([]) || sIdSupplier(null)
  }, [])

  const _HandleChangeInput = (type, value) => {
    if (option?.length > 1) {
      if (type === "branch" || type === "supplier" || type === "theorder") {
        Swal.fire({
          title: `${"Thay đổi sẽ xóa lựa chọn mặt hàng trước đó"}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#296dc1',
          cancelButtonColor: '#d33',
          confirmButtonText: `${dataLang?.aler_yes}`,
          cancelButtonText: `${dataLang?.aler_cancel}`
        }).then((result) => {
          if (result.isConfirmed) {
            sOption([{ id: Date.now(), mathang: null, child: [{ id: uuidv4() }] }])
            sDataItems([])
            sDataWarehouse([])
            sIdTheOrder(null)
            sIdSupplier(null)
            sKhotong([])
          } else {
            sIdBranch(value)
            sIdPurchases([])
            sOption([
              {
                id: Date.now(),
                mathang: null,
                child: [
                  {
                    id: uuidv4(),
                    khohang: null,
                    donvitinh: "",
                    soluong: 1,
                    dongia: 1,
                    thue: 0,
                    thanhtien: 1,
                    ghichu: ""
                  }
                ]
              }
            ])
          }
        })
      }
    }
    if (type == "code") {
      sCode(value.target.value)
    } else if (type === "date") {
      sDate(formatMoment(value.target.value, FORMAT_MOMENT.DATE_TIME_SLASH_LONG))
    } else if (type === "supplier") {
      sIdSupplier(value)
      sOption([{ id: Date.now(), mathang: null, child: [{ id: uuidv4() }] }])
      sMathangAll([])
      sDataItems([])
      sIdTheOrder(null)
      if (value == null) {
        sDataThe_order([])
      }
    } else if (type === "theorder") {
      sIdTheOrder(value)
      if (value == null) {
        sDataItems([])
      }
    } else if (type === "note") {
      sNote(value.target.value)
    } else if (type == "branch") {
      sIdBranch(value)
      sIdTheOrder(null)
      sIdSupplier(null)
      sKhotong([])
      if (value == null) {
        sDataSupplier([])
        sDataThe_order([])
      }
    } else if (type == "mathangAll") {
      sMathangAll(value)
      if (value?.length === 0) {
        sOption([{ id: Date.now(), mathang: null, child: [{ id: uuidv4() }] }])
      } else if (value?.length > 0) {
        const fakeData = [{ id: Date.now(), mathang: null, child: [{ id: uuidv4() }] }]
        const data = fakeData?.concat(value?.map(e => ({ id: uuidv4(), mathang: e, khohang: null, donvitinh: e?.e?.unit_name, soluong: idTheOrder != null ? Number(e?.e?.quantity_left) : 1, dongia: e?.mathang?.e?.price ? Number(e?.mathang?.e?.price) : 1, chietkhau: e?.e?.discount_percent, dongiasauck: Number(e?.e?.price_after_discount), thue: { label: e?.e?.tax_name, value: e?.e?.tax_rate, tax_rate: e?.e?.tax_rate }, thanhtien: Number(e?.e?.amount), ghichu: e?.e?.note })))
        sOption(data);
      }
    } else if (type === "khotong") {
      sKhotong(value)
    } else if (type == "thuetong") {
      sThuetong(value)
    } else if (type == "chietkhautong") {
      sChietkhautong(value?.value)
    }
  }


  useEffect(() => {
    sOption(prevOption => {
      const newOption = [...prevOption];
      newOption.forEach((item, index) => {
        if (index === 0 || !item?.id) return;
        item.khohang = khotong
      });
      return newOption;
    });
  }, [khotong]);


  useEffect(() => {
    if (thuetong == null) return;
    sOption(prevOption => {
      const newOption = [...prevOption];
      const thueValue = thuetong?.tax_rate || 0;
      const chietKhauValue = chietkhautong || 0;
      newOption.forEach((item, index) => {
        if (index === 0 || !item?.id) return;
        const dongiasauchietkhau = item?.dongia * (1 - chietKhauValue / 100);
        const thanhTien = dongiasauchietkhau * (1 + thueValue / 100) * item.soluong
        item.thue = thuetong;
        item.thanhtien = isNaN(thanhTien) ? 0 : thanhTien;
      });
      return newOption;
    });
  }, [thuetong]);

  useEffect(() => {
    if (chietkhautong == null) return;
    sOption(prevOption => {
      const newOption = [...prevOption];
      const thueValue = thuetong?.tax_rate != undefined ? thuetong?.tax_rate : 0
      const chietKhauValue = chietkhautong ? chietkhautong : 0;
      newOption.forEach((item, index) => {
        if (index === 0 || !item?.id) return;
        const dongiasauchietkhau = item?.dongia * (1 - chietKhauValue / 100);
        const thanhTien = dongiasauchietkhau * (1 + thueValue / 100) * item.soluong
        item.chietkhau = Number(chietkhautong);
        item.dongiasauck = isNaN(dongiasauchietkhau) ? 0 : dongiasauchietkhau;
        item.thanhtien = isNaN(thanhTien) ? 0 : thanhTien;
      });
      return newOption;
    });
  }, [chietkhautong]);


  const _HandleSubmit = (e) => {
    e.preventDefault();

    const checkErr = sortedArr?.map(e => { return { item: e?.mathang?.value, location_warehouses_id: e?.khohang?.value } })
    let checkErrValidate = checkErr?.filter(e => e?.item !== undefined);

    const hasNullLabel = checkErrValidate.some(item => item.location_warehouses_id === undefined);
    if (date == null || idSupplier == null || idBranch == null || idTheOrder == null || hasNullLabel) {
      date == null && sErrDate(true)
      idSupplier == null && sErrSupplier(true)
      idBranch == null && sErrBranch(true)
      idTheOrder == null && sErrTheOrder(true)
      hasNullLabel && sErrWarehouse(true)
      Toast.fire({
        icon: 'error',
        title: `${dataLang?.required_field_null}`
      })
    }
    else {
      sErrWarehouse(false)
      sOnSending(true)
    }
  }

  useEffect(() => {
    sErrDate(false)
  }, [date != null]);

  useEffect(() => {
    sErrSupplier(false)
  }, [idSupplier != null]);






  useEffect(() => {
    sErrBranch(false)
  }, [idBranch != null]);

  useEffect(() => {
    sErrTheOrder(false)
  }, [idTheOrder != null]);

  const options = dataItems?.map(e => ({ label: `${e.name} <span style={{display: none}}>${e.code}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`, value: e.id, e }))

  const _ServerFetching_ItemsAll = () => {
    Axios("GET", "/api_web/Api_purchase_order/searchItemsVariant/?csrf_protection=true", {
      params: {
        "filter[purchase_order_id]": idTheOrder ? idTheOrder?.value : null,
        "import_id": id ? id : ""
      }
    }, (err, response) => {
      if (!err) {
        var { result } = response.data.data
        sDataItems(result)
      }
    })
    sOnFetchingItemsAll(false)
  }

  const _ServerFetching_Warehouse = () => {
    Axios("GET", "/api_web/api_warehouse/location/?csrf_protection=true", {
      params: {
        "filter[branch_id]": idBranch.value
      }
    }, (err, response) => {

      if (!err) {
        var result = response.data.rResult
        sDataWarehouse(result?.map(e => ({ label: e?.name, value: e?.id, warehouse_name: e?.warehouse_name })))
      }
    })
    sOnFetchingWarehouse(false)
  }
  useEffect(() => {
    onFetchingItemsAll && _ServerFetching_ItemsAll()
  }, [onFetchingItemsAll]);

  useEffect(() => {
    onFetchingWarehouser && _ServerFetching_Warehouse()
  }, [onFetchingWarehouser]);

  useEffect(() => {
    router.query && sOnFetching(true)
  }, [router.query]);

  useEffect(() => {
    idTheOrder != null && sOnFetchingItemsAll(true)
  }, [idTheOrder]);

  useEffect(() => {
    idBranch != null && sOnFetchingWarehouse(true)
  }, [idBranch]);

  useEffect(() => {
    onFetchingTheOrder && _ServerFetching_TheOrder()
  }, [onFetchingTheOrder])

  useEffect(() => {
    onFetchingSupplier && _ServerFetching_Supplier()
  }, [onFetchingSupplier])

  useEffect(() => {
    idBranch == null && sIdTheOrder(null) || idBranch == null && sDataThe_order([]) || idBranch == null && sDataWarehouse([])
  }, [idBranch]);

  useEffect(() => {
    idBranch != null && sOnFetchingSupplier(true)
  }, [idBranch]);

  // useEffect(() => {
  //   idTheOrder == null && sIdSupplier(null)
  // }, [idTheOrder]);

  useEffect(() => {
    idSupplier != null && sOnFetchingTheOrder(true)
  }, [idSupplier]);

  const _HandleActionItem = (id, type) => {
    if (type === "add") {
      const newData = option.map(e => {
        if (e.id === id) {
          e.child.push({
            id: uuidv4(),
            khohang: null,
            donvitinh: "",
            soluong: 1,
            dongia: 1,
            thue: 0,
            thanhtien: 1,
            ghichu: ""
          })
          return { ...e };
        }
        return e
      })
      sOption([...newData])
    }
  }

  const _HandleDeleteChild = (parentId, id) => {
    const newData = option.map(e => {
      if (e.id === parentId) {
        // Kiểm tra xem có ít nhất hai phần tử trong mảng child
        if (e.child.length > 1) {
          const newChild = e.child.filter(ce => ce.id !== id);
          return { ...e, child: newChild };
        } else if (option.length > 1) {
          return { ...e, child: [] };
        } else {
          Toast.fire({
            title: "Mặc định hệ thống, không xóa",
            icon: 'error',
            confirmButtonColor: '#296dc1',
            cancelButtonColor: '#d33',
            confirmButtonText: dataLang?.aler_yes,
          });
          return e;
        }
      }
      return e;
    }).filter(e => e.child.length > 0 || e.id === option[0].id);
    sOption(newData);
  };


  const _HandleChangeChild = (parentId, id, type, value) => {
    const newData = dataChoose.map(e => {
      if (e.id === parentId) {
        const newChild = e.child?.map(ce => {
          // if(ce.id === id){
          //     if(type === "amount"){
          //         return {...ce, amount: Number(value?.value)}
          //     }else if(type === "locate"){
          //         ce.locate = value;
          //         (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckSame(parentId, id, ce?.locate, ce?.lot, ce?.date);
          //         // (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckChild(parentId, id);
          //         return {...ce}
          //     }else if(type === "lot"){
          //         ce.lot = value;
          //         (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckSame(parentId, id, ce?.locate, ce?.lot, ce?.date);
          //         // (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckChild(parentId, id);
          //         return {...ce}
          //     }else if(type === "date"){
          //         ce.date = value;
          //         (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckSame(parentId, id, ce?.locate, ce?.lot, ce?.date);
          //         // (ce?.locate !== null && ce?.lot !== null && ce.date !== null) && _HandleCheckChild(parentId, id);
          //         return {...ce}
          //     }else if(type === "price"){
          //         return {...ce, price: Number(value?.value)}
          //     }
          // }
          // return ce;
        })
        return { ...e, child: newChild }
      }
      return e
    })
    sDataChoose([...newData])
  }
  // const _HandleChangeInputOption = (id, type,index3, value) => {
  //   var index = option.findIndex(x => x.id === id);
  //   if(type == "mathang"){
  //     //  const hasSelectedOption = option.some((o) => o.mathang?.value === value.value && o.mathang?.e?.purchases_code === value.mathang?.e?.purchases_code);
  //     //     if (hasSelectedOption) {
  //     //       Toast.fire({
  //     //         title: `${"Mặt hàng đã được chọn"}`,
  //     //         icon: 'error',
  //     //         confirmButtonColor: '#296dc1',
  //     //         cancelButtonColor: '#d33',
  //     //         confirmButtonText: `${dataLang?.aler_yes}`,
  //     //         })
  //     //       return  
  //     //     }

  //     if(option[index]?.mathang){

  //           option[index].mathang = value
  //           option[index].donvitinh =  value?.e?.unit_name
  //           sMathangAll(null)
  //           option[index].dongia = value?.e?.price
  //           option[index].khohang =  khotong ? khotong : null
  //           option[index].soluong =  idTheOrder != null ? Number(value?.e?.quantity_left) : 1
  //           option[index].chietkhau = chietkhautong ? chietkhautong : Number(value?.e?.discount_percent)
  //           option[index].dongiasauck = Number(value?.e?.price_after_discount)
  //           option[index].thue =  thuetong ? thuetong : {label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name, value: value?.e?.tax_id, tax_rate: value?.e?.tax_rate}  
  //           option[index].thanhtien = Number(value?.e?.amount)
  //         }else{

  //           // const newData= {id: Date.now(), mathang: value, dongiasauck: Number(value?.e?.price_after_discount), khohang: khotong ? khotong : null, donvitinh: value?.e?.unit_name, soluong: idTheOrder != null ? Number(value?.e?.quantity_left) : 1, dongia: Number(value?.e?.price), chietkhau: Number(value?.e?.discount_percent), thue: value ? [{label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name, value: value?.e.tax_id, tax_rate: value?.e.tax_rate}] : thuetong, thanhtien: value?.e?.amount, ghichu: value?.e?.note}
  //           // const newData= {id: Date.now(), mathang: value, dongiasauck: Number(value?.e?.price_after_discount), khohang: khotong ? khotong : null, donvitinh: value?.e?.unit_name, soluong: idTheOrder != null ? Number(value?.e?.quantity_left) : 1, dongia: Number(value?.e?.price), chietkhau: Number(value?.e?.discount_percent), thue: thuetong ? thuetong : {label: value?.e.tax_name,value:Number(value?.e.tax_id), tax_rate:Number(value?.e.tax_rate)}, thuetong, thanhtien: value?.e?.amount, ghichu: value?.e?.note}
  //           // const newData= {id: Date.now(), mathang: value, dongiasauck: Number(value?.e?.price_after_discount), khohang: khotong ? khotong : null, donvitinh: value?.e?.unit_name, soluong: idTheOrder != null ? Number(value?.e?.quantity_left) : 1, dongia: Number(value?.e?.price), chietkhau: Number(value?.e?.discount_percent), thue: thuetong ? thuetong : {label: value?.e.tax_name,value:Number(value?.e.tax_id), tax_rate:Number(value?.e.tax_rate)}, thuetong, thanhtien: value?.e?.amount, ghichu: value?.e?.note}
  //           if (newData.chietkhau) {
  //             // newData.dongiasauck *=  (1 - Number(newData.chietkhau) / 100);
  //             newData.dongiasauck = Number(newData.dongia) * (1 - Number(newData.chietkhau) / 100);
  //           }
  //           if(newData?.thue?.tax_rate == undefined){
  //             const tien = Number(newData.dongiasauck) * (1 + Number(0)/100) * Number(newData.soluong);
  //             newData.thanhtien = Number(tien.toFixed(2));
  //           }else { 
  //             const tien = Number(newData.dongiasauck) * (1 + Number(newData.thue?.tax_rate)/100) * Number(newData.soluong);
  //             newData.thanhtien = Number(tien.toFixed(2));
  //           }
  //           sMathangAll(null)
  //           option.push(newData);
  //         }
  //   }else if(type ==="khohang"){
  //     option[index].khohang = value
  //     sCustomStyle(value)
  //   }
  //   else if(type == "donvitinh"){
  //     option[index].donvitinh = value.target?.value;
  //   }else if (type === "soluong") {
  //     option[index].soluong = Number(value?.value);
  //     if(option[index].thue?.tax_rate == undefined){
  //       const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
  //       option[index].thanhtien = Number(tien.toFixed(2));
  //     }else{
  //       const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
  //       option[index].thanhtien = Number(tien.toFixed(2));
  //     }
  //     // if(newData?.thue?.tax_rate == undefined){
  //     //   const tien = Number(newData.dongiasauck) * (1 + Number(0)/100) * Number(newData.soluong);
  //     //   newData.thanhtien = Number(tien.toFixed(2));
  //     // }else { 
  //     //   const tien = Number(newData.dongiasauck) * (1 + Number(newData.thue?.tax_rate)/100) * Number(newData.soluong);
  //     //   newData.thanhtien = Number(tien.toFixed(2));
  //     // }
  //     sOption([...option]);
  //   }else if(type == "dongia"){
  //       option[index].dongia = Number(value.value)
  //       option[index].dongiasauck = +option[index].dongia * (1 - option[index].chietkhau/100);
  //       option[index].dongiasauck = +(Math.round(option[index].dongiasauck + 'e+2') + 'e-2');
  //       if(option[index].thue?.tax_rate == undefined){
  //         const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
  //         option[index].thanhtien = Number(tien.toFixed(2));
  //       }else{
  //         const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
  //         option[index].thanhtien = Number(tien.toFixed(2));
  //       }

  //   }else if(type == "chietkhau"){
  //       option[index].chietkhau = Number(value.value) 
  //       option[index].dongiasauck = +option[index].dongia * (1 - option[index].chietkhau/100);
  //       option[index].dongiasauck = +(Math.round(option[index].dongiasauck + 'e+2') + 'e-2');
  //       if(option[index].thue?.tax_rate == undefined){
  //         const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
  //         option[index].thanhtien = Number(tien.toFixed(2));
  //       }else{
  //         const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
  //         option[index].thanhtien = Number(tien.toFixed(2));
  //       }
  //   }else if(type == "thue"){
  //       option[index].thue = value
  //       if(option[index].thue?.tax_rate == undefined){
  //         const tien = Number(option[index].dongiasauck) * (1 + Number(0)/100) * Number(option[index].soluong);
  //         option[index].thanhtien = Number(tien.toFixed(2));
  //       }else{
  //         const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate)/100) * Number(option[index].soluong);
  //         option[index].thanhtien = Number(tien.toFixed(2));
  //       }
  //   }else if(type == "ghichu"){
  //       option[index].ghichu = value?.target?.value;
  //   }
  //   sOption([...option])
  // }

  const _HandleChangeInputOption = (id, type, index3, value) => {
    var index = option.findIndex(x => x.id === id);
    if (type == "mathang") {
      const hasSelectedOption = option.some((o) => o.mathang?.value === value.value && o.mathang?.e?.purchases_code === value.mathang?.e?.purchases_code);
      if (hasSelectedOption) {
        Toast.fire({
          title: `${"Mặt hàng đã được chọn"}`,
          icon: 'error',
          confirmButtonColor: '#296dc1',
          cancelButtonColor: '#d33',
          confirmButtonText: `${dataLang?.aler_yes}`,
        })
        return
      }
      if (option[index]?.mathang) {
        option[index].mathang = value
        // option[index].donvitinh =  value?.e?.unit_name
        // sMathangAll(null)
        // option[index].dongia = value?.e?.price
        // option[index].khohang =  khotong ? khotong : null
        // option[index].soluong =  idTheOrder != null ? Number(value?.e?.quantity_left) : 1
        // option[index].chietkhau = chietkhautong ? chietkhautong : Number(value?.e?.discount_percent)
        // option[index].dongiasauck = Number(value?.e?.price_after_discount)
        // option[index].thue =  thuetong ? thuetong : {label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name, value: value?.e?.tax_id, tax_rate: value?.e?.tax_rate}  
        // option[index].thanhtien = Number(value?.e?.amount)
      } else {

        // const newData= {id: Date.now(), mathang: value, dongiasauck: Number(value?.e?.price_after_discount), khohang: khotong ? khotong : null, donvitinh: value?.e?.unit_name, soluong: idTheOrder != null ? Number(value?.e?.quantity_left) : 1, dongia: Number(value?.e?.price), chietkhau: Number(value?.e?.discount_percent), thue: value ? [{label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name, value: value?.e.tax_id, tax_rate: value?.e.tax_rate}] : thuetong, thanhtien: value?.e?.amount, ghichu: value?.e?.note}
        // const newData= {id: Date.now(), mathang: value, dongiasauck: Number(value?.e?.price_after_discount), khohang: khotong ? khotong : null, donvitinh: value?.e?.unit_name, soluong: idTheOrder != null ? Number(value?.e?.quantity_left) : 1, dongia: Number(value?.e?.price), chietkhau: Number(value?.e?.discount_percent), thue: thuetong ? thuetong : {label: value?.e.tax_name,value:Number(value?.e.tax_id), tax_rate:Number(value?.e.tax_rate)}, thuetong, thanhtien: value?.e?.amount, ghichu: value?.e?.note}
        const newData =
        {
          id: Date.now(),
          mathang: value,
          child: [
            {
              id: uuidv4(),
              khohang: null,
              donvitinh: "",
              soluong: 1,
              dongia: 1,
              thue: 0,
              thanhtien: 1,
              ghichu: ""
            }
          ]
        }

        if (newData.chietkhau) {
          // newData.dongiasauck *=  (1 - Number(newData.chietkhau) / 100);
          newData.dongiasauck = Number(newData.dongia) * (1 - Number(newData.chietkhau) / 100);
        }
        if (newData?.thue?.tax_rate == undefined) {
          const tien = Number(newData.dongiasauck) * (1 + Number(0) / 100) * Number(newData.soluong);
          newData.thanhtien = Number(tien.toFixed(2));
        } else {
          const tien = Number(newData.dongiasauck) * (1 + Number(newData.thue?.tax_rate) / 100) * Number(newData.soluong);
          newData.thanhtien = Number(tien.toFixed(2));
        }
        sMathangAll(null)
        option.push(newData);
      }
    } else if (type === "khohang") {
      option[index].khohang = value
      sCustomStyle(value)
    }
    else if (type == "donvitinh") {
      option[index].donvitinh = value.target?.value;
    } else if (type === "soluong") {
      option[index].soluong = Number(value?.value);
      if (option[index].thue?.tax_rate == undefined) {
        const tien = Number(option[index].dongiasauck) * (1 + Number(0) / 100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      } else {
        const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate) / 100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      }
      // if(newData?.thue?.tax_rate == undefined){
      //   const tien = Number(newData.dongiasauck) * (1 + Number(0)/100) * Number(newData.soluong);
      //   newData.thanhtien = Number(tien.toFixed(2));
      // }else { 
      //   const tien = Number(newData.dongiasauck) * (1 + Number(newData.thue?.tax_rate)/100) * Number(newData.soluong);
      //   newData.thanhtien = Number(tien.toFixed(2));
      // }
      sOption([...option]);
    } else if (type == "dongia") {
      option[index].dongia = Number(value.value)
      option[index].dongiasauck = +option[index].dongia * (1 - option[index].chietkhau / 100);
      option[index].dongiasauck = +(Math.round(option[index].dongiasauck + 'e+2') + 'e-2');
      if (option[index].thue?.tax_rate == undefined) {
        const tien = Number(option[index].dongiasauck) * (1 + Number(0) / 100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      } else {
        const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate) / 100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      }

    } else if (type == "chietkhau") {
      option[index].chietkhau = Number(value.value)
      option[index].dongiasauck = +option[index].dongia * (1 - option[index].chietkhau / 100);
      option[index].dongiasauck = +(Math.round(option[index].dongiasauck + 'e+2') + 'e-2');
      if (option[index].thue?.tax_rate == undefined) {
        const tien = Number(option[index].dongiasauck) * (1 + Number(0) / 100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      } else {
        const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate) / 100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      }
    } else if (type == "thue") {
      option[index].thue = value
      if (option[index].thue?.tax_rate == undefined) {
        const tien = Number(option[index].dongiasauck) * (1 + Number(0) / 100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      } else {
        const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate) / 100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      }
    } else if (type == "ghichu") {
      option[index].ghichu = value?.target?.value;
    }
    sOption([...option])
  }



  const handleIncrease = (id) => {
    const index = option.findIndex((x) => x.id === id);
    const newQuantity = option[index].soluong + 1;
    option[index].soluong = newQuantity;
    if (option[index].thue?.tax_rate == undefined) {
      const tien = Number(option[index].dongiasauck) * (1 + Number(0) / 100) * Number(option[index].soluong);
      option[index].thanhtien = Number(tien.toFixed(2));
    } else {
      const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate) / 100) * Number(option[index].soluong);
      option[index].thanhtien = Number(tien.toFixed(2));
    }
    sOption([...option]);
  };

  const handleDecrease = (id) => {
    const index = option.findIndex((x) => x.id === id);
    const newQuantity = option[index].soluong - 1;
    if (newQuantity >= 1) { // chỉ giảm số lượng khi nó lớn hơn hoặc bằng 1
      option[index].soluong = newQuantity;
      if (option[index].thue?.tax_rate == undefined) {
        const tien = Number(option[index].dongiasauck) * (1 + Number(0) / 100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      } else {
        const tien = Number(option[index].dongiasauck) * (1 + Number(option[index].thue?.tax_rate) / 100) * Number(option[index].soluong);
        option[index].thanhtien = Number(tien.toFixed(2));
      }
      sOption([...option]);
    } else {
      return Toast.fire({
        title: `${"Số lượng tối thiểu"}`,
        icon: 'error',
        confirmButtonColor: '#296dc1',
        cancelButtonColor: '#d33',
        confirmButtonText: `${dataLang?.aler_yes}`,
      })
    }
  };

  const _HandleDelete = (id) => {
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
    sOption(newOption); // cập nhật lại mảng
  }
  const taxOptions = [{ label: "Miễn thuế", value: "0", tax_rate: "0" }, ...dataTasxes]


  const allItems = [...options]

  const handleSelectAll = () => {
    const fakeData = [{ id: Date.now(), mathang: null }]
    const data = fakeData?.concat(allItems?.map(e => ({ id: uuidv4(), mathang: e, khohang: khotong ? khotong : e?.qty_warehouse, donvitinh: e?.e?.unit_name, soluong: idTheOrder != null ? Number(e?.e?.quantity_left) : 1, dongia: e?.e?.price, chietkhau: chietkhautong ? chietkhautong : e?.e?.discount_percent, dongiasauck: Number(e?.e?.price_after_discount), thue: thuetong ? thuetong : { label: e?.e?.tax_name, value: e?.e?.tax_id, tax_rate: e?.e?.tax_rate }, thanhtien: Number(e?.e?.amount), ghichu: e?.e?.note })))
    sOption(data);
    sMathangAll(data)
  };

  const handleDeselectAll = () => {
    sMathangAll([])
    sOption([{ id: Date.now(), mathang: null }])
  };

  const MenuList = (props) => {
    return (
      <components.MenuList {...props}>
        {allItems?.length > 0 &&
          <div className='grid items-center grid-cols-2 cursor-pointer'>
            <div className='col-span-1 p-2 text-center hover:bg-slate-200 ' onClick={handleSelectAll}>Chọn tất cả</div>
            <div className='col-span-1 p-2 text-center hover:bg-slate-200' onClick={handleDeselectAll}>Bỏ chọn tất cả</div>
          </div>
        }
        {props.children}
      </components.MenuList>
    );
  };


  const formatNumber = (num) => {
    if (!num && num !== 0) return 0;
    const roundedNum = parseFloat(num.toFixed(2));
    return roundedNum.toLocaleString("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    });
  };


  const tinhTongTien = (option) => {

    const tongTien = option.slice(1).reduce((accumulator, currentValue) => accumulator + currentValue?.dongia * currentValue?.soluong, 0);

    const tienChietKhau = option.slice(1).reduce((acc, item) => {
      const chiTiet = item?.dongia * (item?.chietkhau / 100) * item?.soluong;
      return acc + chiTiet;
    }, 0);

    const tongTienSauCK = option.slice(1).reduce((acc, item) => {
      const tienSauCK = item?.soluong * item?.dongiasauck;
      return acc + tienSauCK;
    }, 0);

    const tienThue = option.slice(1).reduce((acc, item) => {
      const tienThueItem = item?.dongiasauck * (isNaN(item?.thue?.tax_rate) ? 0 : (item?.thue?.tax_rate / 100)) * item?.soluong;
      return acc + tienThueItem;
    }, 0);

    const tongThanhTien = option.slice(1).reduce((acc, item) => acc + item?.thanhtien, 0);
    return { tongTien: tongTien || 0, tienChietKhau: tienChietKhau || 0, tongTienSauCK: tongTienSauCK || 0, tienThue: tienThue || 0, tongThanhTien: tongThanhTien || 0 };
  };

  const [tongTienState, setTongTienState] = useState({ tongTien: 0, tienChietKhau: 0, tongTienSauCK: 0, tienThue: 0, tongThanhTien: 0 });

  useEffect(() => {
    const tongTien = tinhTongTien(option);
    setTongTienState(tongTien);
  }, [option])

  const dataOption = sortedArr?.map(e => { return { item: e?.mathang?.value, purchases_order_item_id: e?.mathang?.e?.purchase_order_item_id, location_warehouses_id: e?.khohang?.value, quantity: Number(e?.soluong), price: e?.dongia, discount_percent: e?.chietkhau, tax_id: e?.thue?.value, note: e?.ghichu, id: e?.id } })

  let newDataOption = dataOption?.filter(e => e?.item !== undefined);

  const _ServerSending = () => {
    var formData = new FormData();
    formData.append("code", code)
    formData.append("date", (formatMoment(date, FORMAT_MOMENT.DATE_TIME_LONG)))
    formData.append("branch_id", idBranch.value)
    formData.append("suppliers_id", idSupplier.value)
    formData.append("id_order", idTheOrder.value)
    formData.append("note", note)
    newDataOption.forEach((item, index) => {
      formData.append(`items[${index}][item]`, item?.item);
      formData.append(`items[${index}][price]`, item?.price);
      formData.append(`items[${index}][purchase_order_item_id]`, item?.purchases_order_item_id != undefined ? item?.purchases_order_item_id : "");
      formData.append(`items[${index}][id]`, router.query?.id ? item?.id : "");
      formData.append(`items[${index}][quantity]`, item?.quantity.toString());
      formData.append(`items[${index}][note]`, item?.note != undefined ? item?.note : "");
      formData.append(`items[${index}][discount_percent]`, item?.discount_percent);
      formData.append(`items[${index}][tax_id]`, item?.tax_id != undefined ? item?.tax_id : "");
      formData.append(`items[${index}][location_warehouses_id]`, item?.location_warehouses_id != undefined ? item?.location_warehouses_id : "");
    });
    Axios("POST", `${id ? `/api_web/Api_import/import/${id}?csrf_protection=true` : "/api_web/Api_import/import/?csrf_protection=true"}`, {
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    }, (err, response) => {
      if (!err) {
        var { isSuccess, message } = response.data
        if (isSuccess) {
          Toast.fire({
            icon: 'success',
            title: `${dataLang[message]}`
          })
          sCode("")
          sDate(new Date().toISOString().slice(0, 10))
          sIdSupplier(null)
          sIdBranch(null)
          sIdTheOrder(null)
          sNote("")
          sErrBranch(false)
          sErrDate(false)
          sErrTheOrder(false)
          sErrSupplier(false)
          sOption([{ id: Date.now(), mathang: null }])
          router.back()
        } else {
          if (tongTienState.tongTien == 0) {
            Toast.fire({
              icon: 'error',
              title: `Chưa nhập thông tin mặt hàng`
            })
          }
          else {
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

  const [isExpanded, setIsExpanded] = useState(false);


  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      // width: cutTomStyle || (state.isFocused && isExpanded) ? '200px' : '200px',
      transition: 'width 0.5s',
      border: state.isFocused && isExpanded ? '0 0 0 1px #92BFF7' : '0 0 0 1px #92BFF7',
      // boxShadow: state.isFocused && isExpanded ? 'none' : 'none',
      // '@media (max-width: 1536px)': {
      //   width: '330px', 
      // },
      // '@media (min-width: 1280px)': {
      //   width: '160px', 
      // },
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // Đặt giá trị z-index cao
    }),
  };



  return (
    <React.Fragment>
      <Head>
        <title>{id ? dataLang?.import_from_title_edit : dataLang?.import_from_title_add}</title>
      </Head>
      <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 flex flex-col justify-between'>
        <div className='h-[97%] space-y-3 overflow-hidden'>
          <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
            <h6 className='text-[#141522]/40'>{dataLang?.import_title || "import_title"}</h6>
            <span className='text-[#141522]/40'>/</span>
            <h6>{id ? dataLang?.import_from_title_edit : dataLang?.import_from_title_add}</h6>
          </div>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl xl:text-2xl '>{dataLang?.import_title || "import_title"}</h2>
            <div className="flex items-center justify-end">
              <button
                onClick={() => router.back()}
                className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105">{dataLang?.import_comeback || "import_comeback"}</button>
            </div>
          </div>

          <div className='w-full rounded '>
            <div className=''>
              <h2 className='font-normal bg-[#ECF0F4] p-2'>{dataLang?.purchase_order_detail_general_informatione || "purchase_order_detail_general_informatione"}</h2>
              <div className="grid items-center grid-cols-10 gap-3 mt-2">
                <div className='col-span-2'>
                  <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.import_code_vouchers || "import_code_vouchers"} </label>
                  <input
                    value={code}
                    onChange={_HandleChangeInput.bind(this, "code")}
                    name="fname"
                    type="text"
                    placeholder={dataLang?.purchase_order_system_default || "purchase_order_system_default"}
                    className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                </div>
                <div className='col-span-2'>
                  <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.import_day_vouchers || "import_day_vouchers"} <span className="text-red-500">*</span></label>
                  <input
                    value={date}
                    onChange={_HandleChangeInput.bind(this, "date")}
                    name="fname"
                    type="datetime-local"
                    className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`} />
                </div>
                <div className='col-span-2'>
                  <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.import_branch || "import_branch"} <span className="text-red-500">*</span></label>
                  <Select
                    options={dataBranch}
                    onChange={_HandleChangeInput.bind(this, "branch")}
                    value={idBranch}
                    isClearable={true}
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    placeholder={dataLang?.import_branch || "import_branch"}
                    className={`${errBranch ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                    isSearchable={true}
                    // components={{ MultiValue }}
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
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999, // Giá trị z-index tùy chỉnh
                      }),
                      control: (base, state) => ({
                        ...base,
                        boxShadow: 'none',
                        padding: "2.7px",
                        ...(state.isFocused && {
                          border: '0 0 0 1px #92BFF7',
                        }),
                      })
                    }}
                  />
                  {errBranch && <label className="text-sm text-red-500">{dataLang?.purchase_order_errBranch || "purchase_order_errBranch"}</label>}
                </div>
                <div className='col-span-2'>
                  <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.import_supplier || "import_supplier"} <span className="text-red-500">*</span></label>
                  <Select
                    options={dataSupplier}
                    onChange={_HandleChangeInput.bind(this, "supplier")}
                    value={idSupplier}
                    placeholder={dataLang?.import_supplier || "import_supplier"}
                    hideSelectedOptions={false}
                    isClearable={true}
                    className={`${errSupplier ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full z-[100] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                      control: (base, state) => ({
                        ...base,
                        boxShadow: 'none',
                        padding: "2.7px",
                        ...(state.isFocused && {
                          border: '0 0 0 1px #92BFF7',
                        }),
                      })
                    }}
                  />
                  {errSupplier && <label className="text-sm text-red-500">{dataLang?.purchase_order_errSupplier || "purchase_order_errSupplier"}</label>}
                </div>
                <div className='col-span-2 '>
                  <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.import_the_orders || "import_the_orders"} <span className="text-red-500">*</span></label>
                  <Select
                    options={dataThe_order}
                    onChange={_HandleChangeInput.bind(this, "theorder")}
                    value={idTheOrder}
                    isClearable={true}
                    noOptionsMessage={() => "Không có dữ liệu"}
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    placeholder={dataLang?.import_the_orders || "import_the_orders"}
                    className={`${errTheOrder ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                    isSearchable={true}
                    // components={{ MultiValue }}
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
                      }), menu: (provided) => ({
                        ...provided,
                        zIndex: 9999, // Giá trị z-index tùy chỉnh
                      }),
                      control: (base, state) => ({
                        ...base,
                        boxShadow: 'none',
                        padding: "2.7px",
                        ...(state.isFocused && {
                          border: '0 0 0 1px #92BFF7',
                        }),
                      })
                    }}
                  />
                  {errTheOrder && <label className="text-sm text-red-500">{dataLang?.import_err_theorder || "import_err_theorder"}</label>}
                </div>
              </div>
            </div>
          </div>
          <div className=' bg-[#ECF0F4] p-2 grid  grid-cols-12'>
            <div className='col-span-12 font-normal'>{dataLang?.import_item_information || "import_item_information"}</div>
          </div>
          <div className='grid items-end grid-cols-10 gap-3'>
            <div div className='col-span-2  z-[100] my-auto'>
              <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.import_click_items || "import_click_items"} </label>
              <Select
                options={allItems}
                closeMenuOnSelect={false}
                onChange={_HandleChangeInput.bind(this, "mathangAll",)}
                value={mathangAll?.value ? mathangAll?.value : sortedArr?.map(e => e?.mathang)}
                isMulti
                // components={{ Option: CustomOption,MenuList }}
                components={{ MenuList, MultiValue }}
                formatOptionLabel={(option) => {
                  if (option.value === "0") {
                    return (
                      <div className='font-medium text-gray-400'>{option.label}</div>
                    )
                  }
                  else if (option.value === null) {
                    return (
                      <div className='font-medium text-gray-400'>{option.label}</div>
                    )
                  }
                  else {
                    return (
                      <div className='flex items-center justify-between py-2'>
                        <div className='flex items-center gap-2'>
                          <div>
                            {option.e?.images != null ? (
                              <img src={option.e?.images} alt="Product Image" style={{ width: "40px", height: "50px" }} className='object-cover rounded' />
                            ) : (
                              <div className='w-[50px] h-[60px] object-cover flex items-center justify-center rounded'>
                                <img src="/icon/noimagelogo.png" alt="Product Image" style={{ width: "40px", height: "40px" }} className='object-cover rounded' />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className='font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{option.e?.name}</h3>
                            <div className='flex gap-2'>
                              <h5 className='text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{option.e?.code}</h5>
                              <h5 className='font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{option.e?.product_variation}</h5>
                            </div>
                            <h5 className='text-gray-400 font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{dataLang[option.e?.text_type]}</h5>
                          </div>
                        </div>
                        <div className=''>
                          <div className='text-right opacity-0'>{"0"}</div>
                          <div className='flex gap-2'>
                            <div className='flex items-center gap-2'>
                              <h5 className='font-normal text-gray-400'>{dataLang?.purchase_survive || "purchase_survive"}:</h5>
                              <h5 className='text-[#0F4F9E] font-medium'>{option.e?.qty_warehouse ?? 0}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }}
                // components={{ DropdownIndicator }}
                placeholder={dataLang?.purchase_items || "purchase_items"}
                hideSelectedOptions={false}
                className="rounded-md bg-white  2xl:text-[12px] xl:text-[13px] text-[12.5px] z-20"
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
                    zIndex: 100
                  }),
                  control: (base, state) => ({
                    ...base,
                    boxShadow: 'none',
                    padding: "2.7px",
                    ...(state.isFocused && {
                      border: '0 0 0 1px #92BFF7',
                    }),
                  })
                }}
              />
            </div>
            <div className='col-span-2 z-[10]'>
              <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.import_click_house || "import_click_house"} </label>
              <Select
                // options={taxOptions}
                onChange={_HandleChangeInput.bind(this, "khotong")}
                value={khotong}
                formatOptionLabel={(option) => (
                  <div className='flex items-center justify-start gap-1 '>
                    <h2>{dataLang?.import_Warehouse || "import_Warehouse"}: {option?.warehouse_name}</h2>
                    <h2>{dataLang?.import_Warehouse_location || "import_Warehouse_ocation"}</h2>
                    <h2>{option?.label}</h2>
                  </div>
                )}
                options={warehouse}
                isClearable
                placeholder={dataLang?.import_click_house || "import_click_house"}
                hideSelectedOptions={false}
                className={` "border-transparent placeholder:text-slate-300 2xl:text-[12px] xl:text-[13px] text-[12.5px]   z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                isSearchable={true}
                noOptionsMessage={() => "Không có dữ liệu"}
                dangerouslySetInnerHTML={{ __html: option.label }}
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
                    zIndex: 999
                  }),
                  control: (base, state) => ({
                    ...base,
                    boxShadow: 'none',
                    padding: "2.7px",
                    ...(state.isFocused && {
                      border: '0 0 0 1px #92BFF7',
                    }),
                  })
                }}
              />
            </div>
          </div>
          <div className='pr-2'>
            <div className='grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10'>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-2    text-center    truncate font-[400]'>{dataLang?.import_from_items || "import_from_items"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1   text-center  truncate font-[400]'>{dataLang?.import_from_ware_loca || "import_from_ware_loca"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-right  truncate font-[400]'>{"ĐVT"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{dataLang?.import_from_quantity || "import_from_quantity"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{dataLang?.import_from_unit_price || "import_from_unit_price"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{dataLang?.import_from_discount || "import_from_discount"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{dataLang?.import_from_price_affter || "import_from_price_affter"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]'>{dataLang?.import_from_tax || "import_from_tax"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]'>{dataLang?.import_into_money || "import_into_money"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]'>{dataLang?.import_from_note || "import_from_note"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]'>{dataLang?.import_from_operation || "import_from_operation"}</h4>
            </div>
          </div>
          <div className='h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
            <div className='pr-2'>
              <React.Fragment>
                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                  {sortedArr.map((e, index) =>
                    <div className='grid grid-cols-12 gap-1 py-1 ' key={e?.id}>
                      <div className='col-span-2  z-[100] my-auto'>
                        <div className='grid grid-cols-12 gap-1'>
                          <div className='col-span-11'>
                            <Select
                              dangerouslySetInnerHTML={{ __html: option.label }}
                              options={options}
                              onChange={_HandleChangeInputOption.bind(this, e?.id, "mathang", index)}
                              value={e?.mathang}
                              formatOptionLabel={(option) => (
                                <div className='flex items-center justify-between py-2'>
                                  <div className='flex items-center gap-2'>
                                    <div className='w-[40px] h-h-[60px]'>
                                      {option.e?.images != null ? (<img src={option.e?.images} alt="Product Image" className='object-cover rounded' />) :
                                        <div className=' object-cover  flex items-center justify-center rounded w-[40px] h-h-[60px]'>
                                          <img src="/icon/noimagelogo.png" alt="Product Image" className='object-cover rounded ' />
                                        </div>
                                      }
                                    </div>
                                    <div>
                                      <h3 className='font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{option.e?.name}</h3>
                                      <div className='flex gap-2'>
                                        <h5 className='text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]' >{option.e?.code}</h5>
                                        <h5 className='font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{option.e?.product_variation}</h5>
                                      </div>
                                      <h5 className='text-gray-400 font-medium text-xs 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{dataLang[option.e?.text_type]}</h5>
                                    </div>
                                  </div>
                                  <div className=''>
                                    <div className='text-right opacity-0'>{"0"}</div>
                                    <div className='flex gap-2'>
                                      <div className='flex items-center gap-2'>
                                        <h5 className='text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{dataLang?.purchase_survive || "purchase_survive"}:</h5><h5 className='text-[#0F4F9E] font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{option.e?.qty_warehouse ?? 0}</h5>
                                      </div>

                                    </div>

                                  </div>

                                </div>
                              )}
                              placeholder={dataLang?.purchase_items || "purchase_items"}
                              hideSelectedOptions={false}
                              className="rounded-md bg-white  2xl:text-[12px] xl:text-[13px] text-[12.5px] z-20 mb-2"
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
                          <div className='col-span-1'>
                            <div className='flex items-center space-x-5'>
                              {
                                index > 0 &&
                                <button onClick={_HandleActionItem.bind(this, e?.id, "add")} className='flex flex-col items-center justify-center w-10 h-10 transition rounded bg-slate-50 hover:bg-slate-100 '><IconAdd /></button>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-10'>
                        {e?.child?.map(ce =>
                          <React.Fragment key={ce?.id}>
                            <div className='grid grid-cols-10'>
                              <div className='col-span-1 my-auto'>
                                <Select
                                  onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "khohang")}
                                  value={ce?.khohang}
                                  formatOptionLabel={(option) => (
                                    <div className='z-[100]'>
                                      <h2 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] z-[100]'>{dataLang?.import_Warehouse || "import_Warehouse"}: {option?.warehouse_name}</h2>
                                      <h2 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] z-[100]'>{option?.label}</h2>
                                    </div>
                                  )}
                                  // Các props khác của Select
                                  onFocus={toggleExpand} // Xử lý khi người dùng nhấp vào để mở rộng menu
                                  onBlur={toggleExpand} // Xử lý khi người dùn
                                  options={warehouse}
                                  // isClearable
                                  placeholder={"Kho - vị trí kho"}
                                  hideSelectedOptions={false}
                                  className={`${index != 0 && errWarehouse && e?.khohang?.length == 0 ? "border-red-500 bg-red-500 " : "border-transparent bg-[#ffffff]"} placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal outline-none border `}
                                  //  className="rounded-md bg-white  2xl:text-[12px] xl:text-[13px] text-[12.5px] z-19 mb-2 2xl:w-[12.5vw]  xl:w-[12vw] w-[11vw]" 
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

                                />
                              </div>
                              <div className='flex items-center justify-end col-span-1 text-end'>
                                <h3 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] 2xl:pr-0 xl:pr-0 pr-1'>{ce?.donvitinh}</h3>
                              </div>
                              <div className='flex items-center justify-center col-span-1'>
                                <div className="flex items-center justify-center">
                                  <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 2xl:p-0.5 xl:p-0.5 p-  bg-slate-200 rounded-full"
                                    onClick={() => handleDecrease(ce?.id)} disabled={index === 0}
                                  ><Minus className='2xl:scale-100 xl:scale-100 scale-70' size="16" /></button>
                                  <NumericFormat
                                    className="appearance-none text-center 2xl:text-[12px] xl:text-[13px] text-[12px] py-2 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px]  focus:outline-none border-b-2 border-gray-200"
                                    // onValueChange={_HandleChangeInputOption.bind(this, e?.id, "soluong",e)}
                                    onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "soluong")}
                                    value={ce?.soluong || 1}
                                    allowNegative={false}
                                    disabled={index === 0}
                                    // readOnly={index === 0 ? readOnlyFirst : false}
                                    decimalScale={0}
                                    isNumericString={true}
                                    thousandSeparator=","
                                    isAllowed={(values) => { const { floatValue } = values; return floatValue > 0 }}
                                  />
                                  <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 2xl:p-0.5 xl:p-0.5 p-  bg-slate-200 rounded-full"
                                    onClick={() => handleIncrease(ce.id)} disabled={index === 0}
                                  >
                                    <Add className='2xl:scale-100 xl:scale-100 scale-70' size="16" />
                                  </button>
                                </div>
                              </div>
                              <div className='flex items-center justify-center col-span-1 text-center'>
                                <NumericFormat
                                  value={ce?.dongia}
                                  disabled={index === 0}
                                  // onValueChange={_HandleChangeInputOption.bind(this, e?.id, "dongia",index)}
                                  onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "dongia")}
                                  allowNegative={false}
                                  // readOnly={index === 0 ? readOnlyFirst : false}
                                  decimalScale={0}
                                  isNumericString={true}
                                  className="appearance-none 2xl:text-[13px] xl:text-[13px] text-[12.5px] text-center py-1 px-2 font-medium 2xl:w-24 xl:w-[75px] w-[70px] focus:outline-none border-b-2 border-gray-200"
                                  thousandSeparator=","
                                />
                              </div>
                              <div className='flex items-center justify-center col-span-1 text-center'>
                                <NumericFormat
                                  value={ce?.chietkhau}
                                  disabled={index === 0}
                                  // onValueChange={_HandleChangeInputOption.bind(this, e?.id, "chietkhau",index)}
                                  onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "chietkhau")}
                                  className="appearance-none 2xl:text-[13px] xl:text-[13px] text-[12.5px] text-center py-1 px-2 font-medium 2xl:w-24 xl:w-[75px] w-[70px] focus:outline-none border-b-2 border-gray-200"
                                  thousandSeparator=","
                                  allowNegative={false}
                                  // readOnly={index === 0 ? readOnlyFirst : false}
                                  // decimalScale={0}
                                  isNumericString={true}
                                />
                              </div>
                              <div className='flex items-center justify-end col-span-1 text-right'>
                                <h3 className='px-2 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{formatNumber(ce?.dongiasauck)}</h3>
                              </div>
                              <div className='flex items-center justify-center col-span-1'>
                                <Select
                                  options={index === 0 ? [] : taxOptions}
                                  // onChange={_HandleChangeInputOption.bind(this, e?.id, "thue", index)}
                                  onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "thue")}
                                  value={
                                    ce?.thue
                                      ? (
                                        taxOptions.find(item => item.value === ce?.thue?.value)
                                          ? {
                                            label: taxOptions.find(item => item.value === ce?.thue?.value)?.label,
                                            value: ce?.thue?.value,
                                            tax_rate: ce?.thue?.tax_rate
                                          }
                                          : ce?.thue
                                      )
                                      : null
                                  }
                                  // value={e?.thue ? ( {label: taxOptions.find(item => item.value === e?.thue?.value)?.label, value: e?.thue?.value, tax_rate: e?.thue?.tax_rate}) : null}
                                  placeholder={dataLang?.import_from_tax || "import_from_tax"}
                                  hideSelectedOptions={false}
                                  formatOptionLabel={(option) => (
                                    <div className='flex items-center justify-start gap-1 '>
                                      <h2 className='2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{option?.label}</h2>
                                      <h2 className='2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{`(${option?.tax_rate})`}</h2>
                                    </div>
                                  )}
                                  className={`  2xl:text-[12px] xl:text-[13px] text-[12.5px] border-transparent placeholder:text-slate-300 w-full z-19 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
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
                                    control: (base, state) => ({
                                      ...base,
                                      boxShadow: 'none',
                                      padding: "2.7px",
                                      ...(state.isFocused && {
                                        border: '0 0 0 1px #92BFF7',
                                      }),
                                    })
                                  }}
                                />
                              </div>
                              <div className='flex items-center justify-end col-span-1 text-right'>
                                {/* <h3 className='px-2'>{formatNumber(e.thanhtien)}</h3> */}
                                <h3 className='px-2 2xl:text-[13px] xl:text-[13px] text-[12.5px]'>{formatNumber(ce?.thanhtien)}</h3>
                              </div>
                              <div className='flex items-center justify-center col-span-1'>
                                <input
                                  value={ce?.ghichu}
                                  disabled={index === 0}
                                  // onChange={_HandleChangeInputOption.bind(this, e?.id, "ghichu",index)}
                                  onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, "ghichu")}
                                  name="optionEmail"
                                  placeholder='Ghi chú'
                                  type="text"
                                  className="focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                />
                              </div>
                              <div className='flex items-center justify-center col-span-1'>
                                <button onClick={_HandleDeleteChild.bind(this, e.id, ce.id)} title='Xóa' className='text-red-500 hover:text-red-600'><IconDelete /></button>
                              </div>
                            </div>
                          </React.Fragment>
                        )}

                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            </div>
          </div>
          <div className='grid grid-cols-12 mb-3 font-normal bg-[#ecf0f475] p-2 items-center'>
            <div className='flex items-center col-span-2 gap-2'>
              <h2>{dataLang?.purchase_order_detail_discount || "purchase_order_detail_discount"}</h2>
              <div className='flex items-center justify-center col-span-1 text-center'>
                <NumericFormat
                  value={chietkhautong}
                  onValueChange={_HandleChangeInput.bind(this, "chietkhautong")}
                  className="w-20 px-2 py-1 font-medium text-center bg-transparent border-b-2 border-gray-300  focus:outline-none"
                  thousandSeparator=","
                  allowNegative={false}
                  decimalScale={0}
                  isNumericString={true}
                />
              </div>
            </div>
            <div className='flex items-center col-span-2 gap-2'>
              <h2>{dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}</h2>
              <Select
                options={taxOptions}
                onChange={_HandleChangeInput.bind(this, "thuetong")}
                value={thuetong}
                formatOptionLabel={(option) => (
                  <div className='flex items-center justify-start gap-1 '>
                    <h2>{option?.label}</h2>
                    <h2>{`(${option?.tax_rate})`}</h2>
                  </div>
                )}
                placeholder={dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}
                hideSelectedOptions={false}
                className={` "border-transparent placeholder:text-slate-300 w-[70%] z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                isSearchable={true}
                noOptionsMessage={() => "Không có dữ liệu"}
                dangerouslySetInnerHTML={{ __html: option.label }}
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
                  control: (base, state) => ({
                    ...base,
                    boxShadow: 'none',
                    padding: "2.7px",
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
          <div className="flex-col justify-between col-span-2 mt-5 space-y-4 text-right ">
            <div className='flex justify-between '>
            </div>
            <div className='flex justify-between '>
              <div className='font-normal '><h3>{dataLang?.purchase_order_table_total || "purchase_order_table_total"}</h3></div>
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
                type="submit" className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#003DA0]">{dataLang?.purchase_order_purchase_save || "purchase_order_purchase_save"}</button>
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
  // const label = `+ ${length}`;
  const label = ``;

  return (
    <div title={title}>{label}</div>
  );
};

const MultiValue = ({ index, getValue, ...props }) => {
  const maxToShow = 0;
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