import Head from 'next/head';
import Swal from 'sweetalert2';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import React, { useState, useEffect } from 'react'
import Select, { components } from 'react-select';
import { useRouter } from 'next/router'
import { MdClear } from 'react-icons/md';
import { BsCalendarEvent } from 'react-icons/bs';
import { Trash as IconDelete, Add, Minus } from "iconsax-react";
import { _ServerInstance as Axios } from '/services/axios';
import { NumericFormat } from "react-number-format";
import { v4 as uuidv4 } from 'uuid';

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
  const [onFetching, sOnFetching] = useState(false);
  const [onFetchingItems, sOnFetchingItemsAll] = useState(false);
  const [onFetchingItem, sOnFetchingItem] = useState(false);
  const [onFetchingDetail, sOnFetchingDetail] = useState(false)
  const [onFetchingCustomer, sOnFetchingCustomer] = useState(false)
  const [onFetchingStaff, sOnFetchingStaff] = useState(false)
  const [onFetchingQuote, sOnFetchingQuote] = useState(false)
  const [onFetchingContactPerson, sOnFetchingContactPerson] = useState(false)
  const [onSending, sOnSending] = useState(false);
  const [option, setOption] = useState([{
    id: Date.now(),
    item: null,
    unit: 1,
    quantity: 1,
    price: 1,
    discount: 0,
    price_after_discount: 1,
    tax: 0,
    price_after_tax: 1,
    total_amount: 1,
    note: "",
    delivery_date: null
  }]);
  const slicedArr = option.slice(1);
  const sortedArr = id ? slicedArr.sort((a, b) => a.id - b.id) : slicedArr.sort((a, b) => b.id - a.id);
  sortedArr.unshift(option[0]);

  const [dataCustomer, setDataCustomer] = useState([])
  const [dataPersonContact, setDataContactPerson] = useState([])
  const [dataStaffs, setDataStaffs] = useState([])
  const [dataQuotes, setDataQuotes] = useState([])
  const [dataEditItems, setDataEditItems] = useState([])
  const [dataTasxes, setDataTasxes] = useState([])
  const [dataBranch, setDataBranch] = useState([])

  const [note, setNote] = useState('')
  const [codeProduct, setCodeProduct] = useState('')
  const [totalTax, setTotalTax] = useState()
  const [totalDiscount, setTotalDiscount] = useState(0)

  const [startDate, setStartDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(null);

  const [customer, setCustomer] = useState(null)
  const [contactPerson, setContactPerson] = useState(null)
  const [staff, setStaff] = useState(null)
  const [quote, setQuote] = useState(null)
  const [branch, setBranch] = useState(null);

  const [errDate, setErrDate] = useState(false)
  const [errCustomer, sErrCustomer] = useState(false)
  const [errStaff, setErrStaff] = useState(false)
  const [errQuote, setErrQuote] = useState(false)
  const [errDeliveryDate, setErrDeliveryDate] = useState(false)
  const [errBranch, setErrBranch] = useState(false)

  const [hidden, setHidden] = useState(false)
  const [typeOrder, setTypeOrder] = useState("0");
  const [dataItems, sDataItems] = useState([])
  const [itemsAll, setItemsAll] = useState([])

  const [listData, sListData] = useState([]);

  const [tongTienState, setTongTienState] = useState({
    totalPrice: 0,
    totalDiscountPrice: 0,
    totalDiscountAfterPrice: 0,
    totalTax: 0,
    totalAmount: 0
  });


  const readOnlyFirst = true;


  useEffect(() => {
    router.query && setErrDate(false)
    router.query && sErrCustomer(false)
    router.query && setErrStaff(false)
    router.query && setErrDeliveryDate(false)
    router.query && setErrBranch(false)
    router.query && setStartDate(new Date())
    router.query && setDeliveryDate(null)
    router.query && setNote("")
  }, [id, router.query]);

  // Fetch edit
  const _ServerFetchingDetail = () => {
    Axios("GET", `/api_web/Api_quotation/quotation/${id}?csrf_protection=true`, {
    }, (err, response) => {
      if (!err) {
        var rResult = response.data;

        const itemlast = [{ item: null }];
        const items = itemlast?.concat(rResult?.items?.map(e => ({
          price_quote_order_item_id: e?.id,
          id: e.id,
          item: {
            e: e?.item,
            label: `${e.item?.item_name} <span style={{display: none}}>${e.item?.codeProduct + e.item?.product_variation + e.item?.text_type + e.item?.unit_name}</span>`,
            value: e.item?.id
          },
          quantity: Number(e?.quantity),
          price: Number(e?.price),
          discount: Number(e?.discount_percent),
          tax: { tax_rate: e?.tax_rate, value: e?.tax_id },
          unit: e.item?.unit_name,
          price_after_discount: Number(e?.price_after_discount),
          note: e?.note,
          total_amount: Number(e?.price_after_discount) * (1 + Number(e?.tax_rate) / 100) * Number(e?.quantity)
        })));

        setOption(items)
        setCodeProduct(rResult?.reference_no)
        setContactPerson(({ label: rResult?.contact_name, value: rResult?.contact_id }))
        setBranch({ label: rResult?.branch_name, value: rResult?.branch_id })
        setCustomer(({ label: rResult?.client_name, value: rResult?.client_id }))
        setStartDate(moment(rResult?.date).toDate())
        setDeliveryDate(moment(rResult?.validity).toDate())
        setNote(rResult?.note)
      }
      sOnFetchingDetail(false)
    })
  }


  console.log('option : ', option);

  // fetch chi nhanh
  const handleFetchingBranch = () => {
    Axios("GET", "/api_web/Api_Branch/branch/?csrf_protection=true", {}, (err, response) => {
      if (!err) {
        var { rResult } = response.data
        setDataBranch(rResult?.map(e => ({ label: e.name, value: e.id })))
      }
    })

    Axios("GET", "/api_web/Api_tax/tax?csrf_protection=true", {}, (err, response) => {
      if (!err) {
        var { rResult } = response.data
        setDataTasxes(rResult?.map(e => ({ label: e.name, value: e.id, tax_rate: e.tax_rate })))
      }
    })

    sOnFetching(false)
  }

  // fetch Customer
  const handleFetchingCustomer = () => {
    Axios("GET", `/api_web/api_client/client_option/?csrf_protection=true`, {
      params: {
        "filter[branch_id]": branch !== null ? branch?.value : null,
      }
    }, (err, response) => {
      if (!err) {
        var db = response.data.rResult
        setDataCustomer(db?.map(e => ({ label: e.name, value: e.id })))
      }
    })
    sOnFetchingCustomer(false)
  }
  // Contact person
  const handleFetchingContactPerson = () => {
    Axios("GET", `/api_web/api_client/contactCombobox/?csrf_protection=true`, {
      params: {
        "filter[client_id]": customer != null ? customer.value : null,
      }
    }, (err, response) => {
      if (!err) {
        var { rResult } = response.data
        setDataContactPerson(rResult?.map(e => ({ label: e.full_name, value: e.id })))
      }
    })
    sOnFetchingContactPerson(false)
  }

  // Staff
  const handleFetchingStaff = () => {
    Axios("GET", `/api_web/Api_staff/staffOption?csrf_protection=true`, {
      params: {
        "filter[branch_id]": branch !== null ? +branch?.value : null,
      }
    }, (err, response) => {
      if (!err) {
        var { rResult } = response?.data
        setDataStaffs(rResult?.map(e => ({ label: e.name, value: e.staffid })))
      }
    })
    sOnFetchingStaff(false)
  }

  // Quote
  const handleFetchingQuote = () => {
    Axios("GET", `/api_web/Api_quotation/quotationNotOrderedCombobox/?csrf_protection=true`, {
      params: {
        "filter[branch_id]": branch !== null ? +branch?.value : null,
        "filter[client_id]": customer !== null ? +customer?.value : null
      }
    }, (err, response) => {
      if (!err) {
        var rResult = response?.data.result
        setDataQuotes(rResult?.map(e => ({ label: e.reference_no, value: e.id })))
      }
    })
    sOnFetchingQuote(false)
  }

  // fetch items
  const handleFetchingItemsAll = () => {
    if (typeOrder === "1") {
      Axios("POST", "/api_web/Api_product/searchItemsVariant/?csrf_protection=true", {}, (err, response) => {
        if (!err) {
          var { result } = response.data.data
          setDataEditItems(result)
        }
      })
      sOnFetchingItemsAll(false)
    }
    if (typeOrder === "0") {
      Axios("POST", "/api_web/Api_product/searchItemsVariant/?csrf_protection=true", {}, (err, response) => {
        if (!err) {
          var { result } = response.data.data
          setDataEditItems(result)
        }
      })
      sOnFetchingItemsAll(false)

    }
  }

  const handleFetchingItem = async () => {
    if (typeOrder === "1") {
      if (quote && quote.value !== null) {
        await Axios("POST", "/api_web/Api_quotation/searchItemsVariant/?csrf_protection=true", {
          params: {
            "filter[quote_id]": quote !== null ? +quote?.value : null,
          }
        }, (err, response) => {
          if (!err) {
            var { result } = response.data.data
            setDataEditItems(result)
          }
        })
        sOnFetchingItem(false)
      }
      else {
        Axios("POST", "/api_web/Api_product/searchItemsVariant/?csrf_protection=true", {}, (err, response) => {
          if (!err) {
            var { result } = response.data.data
            setDataEditItems(result)
          }
        })
        sOnFetchingItem(false)

      }
    }
    else if (typeOrder === '0') {
      Axios("POST", "/api_web/Api_product/searchItemsVariant/?csrf_protection=true", {}, (err, response) => {
        if (!err) {
          var { result } = response.data.data
          setDataEditItems(result)
        }
      })
      sOnFetchingItem(false)

    }
  }


  useEffect(() => {
    onFetchingDetail && _ServerFetchingDetail()
  }, [onFetchingDetail]);

  useEffect(() => {
    id && sOnFetchingDetail(true)
  }, []);

  useEffect(() => {
    if (totalTax == null) return;
    setOption(prevOption => {
      const newOption = [...prevOption];
      const thueValue = totalTax?.tax_rate || 0;
      const chietKhauValue = totalDiscount || 0;
      newOption.forEach((item, index) => {
        if (index === 0 || !item.id) return;
        const dongiasauchietkhau = item?.price * (1 - chietKhauValue / 100);
        const thanhTien = dongiasauchietkhau * (1 + thueValue / 100) * item.quantity
        item.tax = totalTax;
        item.total_amount = isNaN(thanhTien) ? 0 : thanhTien;
      });
      return newOption;
    });
  }, [totalTax]);

  useEffect(() => {
    if (deliveryDate == null) return;
    setOption(prevOption => {
      const newOption = [...prevOption];

      newOption.forEach((item, index) => {
        if (index === 0 || !item.id) return;
        item.delivery_date = deliveryDate || null
      });
      return newOption;
    });
  }, [deliveryDate]);

  useEffect(() => {
    if (totalDiscount == null) return;
    setOption(prevOption => {
      const newOption = [...prevOption];
      const thueValue = totalTax?.tax_rate != undefined ? totalTax?.tax_rate : 0
      const chietKhauValue = totalDiscount ? totalDiscount : 0;

      newOption.forEach((item, index) => {
        if (index === 0 || !item?.id) return;
        const dongiasauchietkhau = item?.price * (1 - chietKhauValue / 100);
        const thanhTien = dongiasauchietkhau * (1 + thueValue / 100) * item.quantity
        item.tax = totalTax;
        item.discount = Number(totalDiscount);
        item.price_after_discount = isNaN(dongiasauchietkhau) ? 0 : dongiasauchietkhau;
        item.total_amount = isNaN(thanhTien) ? 0 : thanhTien;
      });
      return newOption;
    });
  }, [totalDiscount]);


  useEffect(() => {
    branch === null && setDataCustomer([]) || setCustomer(null) || setDataContactPerson([]) || setContactPerson(null) || setDataStaffs([]) || setStaff(null)
  }, [])

  useEffect(() => {
    onFetchingCustomer && handleFetchingCustomer()
  }, [onFetchingCustomer])
  useEffect(() => {
    onFetchingStaff && handleFetchingStaff()
  }, [onFetchingStaff])

  useEffect(() => {
    onFetchingQuote && handleFetchingQuote()
  }, [onFetchingQuote])

  useEffect(() => {
    onFetchingContactPerson && handleFetchingContactPerson()
  }, [onFetchingContactPerson])

  useEffect(() => {
    branch !== null && (sOnFetchingCustomer(true) || sOnFetchingStaff(true))
  }, [branch]);

  useEffect(() => {
    customer !== null && (sOnFetchingContactPerson(true) || sOnFetchingQuote(true))
  }, [customer]);
  useEffect(() => {
    quote !== null && (sOnFetchingItem(true))
  }, [quote]);

  useEffect(() => {
    onFetchingItems && handleFetchingItemsAll()
  }, [onFetchingItems])

  useEffect(() => {
    onFetchingItem && handleFetchingItem()
  }, [onFetchingItem]);

  const options = dataEditItems?.map(e => {
    return ({
      label: `${e.name} <span style={{display: none}}>${e.codeProduct}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
      value: e.id,
      e
    })
  })
  useEffect(() => {
    onFetchingDetail && _ServerFetchingDetail()
  }, [onFetchingDetail]);

  useEffect(() => {
    id && sOnFetchingDetail(true)
  }, []);

  // tổng thay đổi
  useEffect(() => {
    if (totalTax == null) return;
    setOption(prevOption => {
      const newOption = [...prevOption];
      const thueValue = totalTax?.tax_rate || 0;
      const chietKhauValue = totalDiscount || 0;
      newOption.forEach((item, index) => {
        if (index === 0 || !item.id) return;
        const dongiasauchietkhau = item?.price * (1 - chietKhauValue / 100);
        const thanhTien = dongiasauchietkhau * (1 + thueValue / 100) * item.quantity
        item.tax = totalTax;
        item.total_amount = isNaN(thanhTien) ? 0 : thanhTien;
      });
      return newOption;
    });
  }, [totalTax]);

  useEffect(() => {
    if (deliveryDate == null) return;
    setOption(prevOption => {
      const newOption = [...prevOption];

      newOption.forEach((item, index) => {
        if (index === 0 || !item.id) return;
        item.delivery_date = deliveryDate || null
      });
      return newOption;
    });
  }, [deliveryDate]);

  useEffect(() => {
    if (totalDiscount == null) return;
    setOption(prevOption => {
      const newOption = [...prevOption];
      const thueValue = totalTax?.tax_rate != undefined ? totalTax?.tax_rate : 0
      const chietKhauValue = totalDiscount ? totalDiscount : 0;

      newOption.forEach((item, index) => {
        if (index === 0 || !item?.id) return;
        const dongiasauchietkhau = item?.price * (1 - chietKhauValue / 100);
        const thanhTien = dongiasauchietkhau * (1 + thueValue / 100) * item.quantity
        item.tax = totalTax;
        item.discount = Number(totalDiscount);
        item.price_after_discount = isNaN(dongiasauchietkhau) ? 0 : dongiasauchietkhau;
        item.total_amount = isNaN(thanhTien) ? 0 : thanhTien;
      });
      return newOption;
    });
  }, [totalDiscount]);


  useEffect(() => {
    branch === null && setDataCustomer([]) || setCustomer(null) || setDataContactPerson([]) || setContactPerson(null) || setDataStaffs([]) || setStaff(null)
  }, [])

  useEffect(() => {
    onFetchingCustomer && handleFetchingCustomer()
  }, [onFetchingCustomer])
  useEffect(() => {
    onFetchingStaff && handleFetchingStaff()
  }, [onFetchingStaff])

  useEffect(() => {
    onFetchingQuote && handleFetchingQuote()
  }, [onFetchingQuote])

  useEffect(() => {
    onFetchingContactPerson && handleFetchingContactPerson()
  }, [onFetchingContactPerson])

  useEffect(() => {
    branch !== null && (sOnFetchingCustomer(true) || sOnFetchingStaff(true))
  }, [branch]);

  useEffect(() => {
    customer !== null && (sOnFetchingContactPerson(true) || sOnFetchingQuote(true))
  }, [customer]);
  useEffect(() => {
    quote !== null && (sOnFetchingItem(true))
  }, [quote]);

  useEffect(() => {
    onFetchingItems && handleFetchingItemsAll()
  }, [onFetchingItems])

  useEffect(() => {
    onFetchingItem && handleFetchingItem()
  }, [onFetchingItem]);

  useEffect(() => {
    onFetching && handleFetchingBranch()
  }, [onFetching]);

  useEffect(() => {
    router.query && sOnFetching(true)
    router.query && sOnFetchingItemsAll(true)
  }, [router.query]);

  useEffect(() => {
    setErrDate(false)
  }, [startDate != null]);
  useEffect(() => {
    sErrCustomer(false)
  }, [customer != null]);

  useEffect(() => {
    setErrDeliveryDate(false)
  }, [deliveryDate != null]);
  useEffect(() => {
    setErrBranch(false)
  }, [branch != null]);
  useEffect(() => {
    setErrStaff(false)
  }, [staff != null])


  // search api
  const _HandleSeachApi = (inputValue) => {
    if (typeOrder === "1" && quote && +quote.value) {
      Axios("POST", `/api_web/Api_quotation/searchItemsVariant/?csrf_protection=true`, {
        data: {
          term: inputValue,
        },
        params: {
          "filter[quote_id]": quote ? +quote?.value : null
        }
      }, (err, response) => {
        if (!err) {
          var { result } = response?.data.data
          setDataEditItems(result)
        }
      })

    }
    if (typeOrder === "0") {
      Axios("POST", `/api_web/Api_product/searchItemsVariant/?csrf_protection=true`, {}, (err, response) => {
        if (!err) {
          var { result } = response?.data.data
          setDataEditItems(result)
        }
      })
    }
  }

  // format number
  const formatNumber = (number) => {
    if (!number && number !== 0) return 0;
    const integerPart = Math.floor(number)
    return integerPart.toLocaleString("en")
  }

  // onChange
  const handleOnChangeInput = (type, value) => {

    if (type === "codeProduct") {
      setCodeProduct(value.target.value)
    }
    else if (type === "customer") {
      setCustomer(value)
      setDataContactPerson([])
      setContactPerson(null)
      setDataQuotes([])
      setQuote(null)

      sOnFetchingItem(true)
    }
    else if (type === "branch") {
      if (sortedArr?.slice(1)?.length > 0) {
        Swal.fire({
          title: `${"Mặt hàng đã chọn sẽ bị xóa, bạn có muốn tiếp tục?"}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#296dc1',
          cancelButtonColor: '#d33',
          confirmButtonText: `${dataLang?.aler_yes}`,
          cancelButtonText: `${dataLang?.aler_cancel}`
        }).then((result) => {
          if (result.isConfirmed) {
            setBranch(value)
            setOption([{
              id: Date.now(),
              item: null,
              unit: 1,
              quantity: 1,
              unit_price: 1,
              discount: 0,
              price_after_discount: 1,
              tax: 0,
              price_after_tax: 1,
              total_amount: 1,
              note: "",
              delivery_date: null
            }])
          }
        })
      }
      else if (value !== branch) {
        setBranch(value)
        setCustomer(null)
        setDataCustomer([])
        setDataContactPerson([])
        setContactPerson(null)
        setDataStaffs([])
        setStaff(null)
        setDataQuotes([])
        setQuote(null)
        setOption([{
          id: Date.now(),
          item: null,
          unit: 1,
          quantity: 1,
          price: 1,
          discount: 0,
          price_after_discount: 1,
          tax: 0,
          price_after_tax: 1,
          total_amount: 1,
          note: "",
          delivery_date: null
        }])
      }
    }
    else if (type === "contactPerson") {
      setContactPerson(value)
    }
    else if (type === "staff") {
      setStaff(value)
    }
    else if (type === "typeOrder") {
      Swal.fire({
        title: `${"Mặt hàng đã chọn trước đó sẽ bị xóa, bạn có muốn tiếp tục?"}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#296dc1',
        cancelButtonColor: '#d33',
        confirmButtonText: `${dataLang?.aler_yes}`,
        cancelButtonText: `${dataLang?.aler_cancel}`
      }).then((result) => {
        if (result.isConfirmed) {
          setTypeOrder(value.target.value);
          setHidden(value.target.value === "1");
          setQuote(value.target.value === "0" ? null : quote);

          sOnFetchingItem(value.target.value === "0" && true)
          sOnFetchingItemsAll(value.target.value === "1" && true)

          setTotalTax('')
          setTotalDiscount('')
          setOption([{
            id: Date.now(),
            item: null,
            unit: 1,
            quantity: 1,
            price: 1,
            discount: 0,
            price_after_discount: 1,
            tax: 0,
            price_after_tax: 1,
            total_amount: 1,
            note: "",
            delivery_date: null
          }])
        }
      })
    }
    else if (type === "quote") {
      if (option?.length > 1) {
        Swal.fire({
          title: `${"Thay đổi sẽ xóa lựa chọn mặt hàng trước đó, bạn có muốn tiếp tục?"}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#296dc1',
          cancelButtonColor: '#d33',
          confirmButtonText: `${dataLang?.aler_yes}`,
          cancelButtonText: `${dataLang?.aler_cancel}`
        }).then((result) => {
          if (result.isConfirmed) {
            setQuote(value)
            setOption([{
              id: Date.now(),
              item: null,
              unit: 1,
              quantity: 1,
              price: 1,
              discount: 0,
              price_after_discount: 1,
              tax: 0,
              price_after_tax: 1,
              total_amount: 1,
              note: "",
              delivery_date: null
            }])
          }
        })
      } else {
        setQuote(value)
        sOnFetchingItem(true)
      }

    }
    else if (type === "note") {
      setNote(value.target.value)
    }
    else if (type === "total_tax") {
      setTotalTax(value)
    }
    else if (type === "total_delivery_date") {
      setDeliveryDate(value)
    }
    else if (type === "totaldiscount") {
      setTotalDiscount(value?.value)
    }

    else if (type == "itemAll") {
      setItemsAll(value)
      console.log('value', value)
      if (value?.length === 0) {
        // setOption([{id: Date.now(), item: null}])
        //new
        sListData([])
      } else if (value?.length > 0) {

        const newData = [{
          id: Date.now(),
          item: null,
          unit: null,
          quantity: 1,
          price: 1,
          discount: totalDiscount ? totalDiscount : 0,
          price_after_discount: 1,
          tax: totalTax ? totalTax : 0,
          price_after_tax: 1,
          total_amount: 1,
          note: "",
          delivery_date: null
        }]

        console.log(newData.concat(value?.map(e => ({
          id: uuidv4(),
          item: {
            e: e?.e,
            label: e?.label,
            value: e?.value,
          },
          unit: e?.e?.unit_name,
          quantity: 1,
          price: 1,
          discount: 0,
          price_after_discount: 1,
          tax: 0,
          price_after_tax: 1,
          total_amount: 1,
          note: "",
          delivery_date: null
        }
        ))))

        let newArray = newData.concat(value?.map((e, index) => ({
          id: uuidv4(),
          item: {
            e: e?.e,
            label: e?.label,
            value: e?.value,
          },
          unit: e?.e?.unit_name,
          quantity: 1,
          price: 1,
          index: index,
          discount: 0,
          price_after_discount: 1,
          tax: 0,
          price_after_tax: 1,
          total_amount: 1,
          note: "",
          delivery_date: null
        }
        ))).sort((a, b) => b.index - a.index)

        setOption(newArray)

      }
    }
  }

  // change items 
  const handleOnChangeInputOption = (id, type, value) => {
    var index = option.findIndex(x => x.id === id);


    if (type === "item") {
      if (option[index]?.item) {
        option[index].item = value
        option[index].unit = value?.e?.unit_name
        option[index].quantity = 1
        option[index].total_amount = Number(option[index].price_after_discount) * (1 + Number(0) / 100) * Number(option[index].quantity);
      } else {
        const newData = {
          id: Date.now(),
          item: value,
          unit: value?.e?.unit_name,
          quantity: 1,
          price: 1,
          discount: totalDiscount ? totalDiscount : 0,
          price_after_discount: 1,
          tax: totalTax ? totalTax : 0,
          price_after_tax: 1,
          total_amount: 1,
          note: "",
          delivery_date: null
        }
        if (newData.discount) {
          newData.price_after_discount *= (1 - Number(newData.discount) / 100);
        }
        if (newData.tax?.e?.tax_rate == undefined) {
          const tien = Number(newData.price_after_discount) * (1 + Number(0) / 100) * Number(newData.quantity);
          newData.total_amount = Number(tien.toFixed(2));
        } else {
          const tien = Number(newData.price_after_discount) * (1 + Number(newData.tax?.e?.tax_rate) / 100) * Number(newData.quantity);
          newData.total_amount = Number(tien.toFixed(2));
        }
        option.push(newData);
      }
    }
    else if (type == "unit") {
      option[index].unit = value.target?.value;
    }
    else if (type === "quantity") {
      option[index].quantity = Number(value?.value);
      if (option[index].tax?.tax_rate == undefined) {
        const tien = Number(option[index].price_after_discount) * (1 + Number(0) / 100) * Number(option[index].quantity);
        option[index].total_amount = Number(tien.toFixed(2));
      } else {
        const tien = Number(option[index].price_after_discount) * (1 + Number(option[index].tax?.tax_rate) / 100) * Number(option[index].quantity);
        option[index].total_amount = Number(tien.toFixed(2));
      }
      setOption([...option]);
    }
    else if (type == "price") {
      option[index].price = Number(value.value)
      option[index].price_after_discount = +option[index].price * (1 - option[index].discount / 100);
      option[index].price_after_discount = +(Math.round(option[index].price_after_discount + 'e+2') + 'e-2');
      if (option[index].tax?.tax_rate == undefined) {
        const tien = Number(option[index].price_after_discount) * (1 + Number(0) / 100) * Number(option[index].quantity);
        option[index].total_amount = Number(tien.toFixed(2));
      } else {
        const tien = Number(option[index].price_after_discount) * (1 + Number(option[index].tax?.tax_rate) / 100) * Number(option[index].quantity);
        option[index].total_amount = Number(tien.toFixed(2));
      }

    }
    else if (type == "discount") {
      option[index].discount = Number(value.value)
      option[index].price_after_discount = +option[index].price * (1 - option[index].discount / 100);
      option[index].price_after_discount = +(Math.round(option[index].price_after_discount + 'e+2') + 'e-2');
      if (option[index].tax?.tax_rate == undefined) {
        const tien = Number(option[index].price_after_discount) * (1 + Number(0) / 100) * Number(option[index].quantity);
        option[index].total_amount = Number(tien.toFixed(2));
      } else {
        const tien = Number(option[index].price_after_discount) * (1 + Number(option[index].tax?.tax_rate) / 100) * Number(option[index].quantity);
        option[index].total_amount = Number(tien.toFixed(2));
      }
    }
    else if (type == "tax") {
      option[index].tax = value
      if (option[index].tax?.tax_rate == undefined) {
        const tien = Number(option[index].price_after_discount) * (1 + Number(0) / 100) * Number(option[index].quantity);
        option[index].total_amount = Number(tien.toFixed(2));
      } else {
        const tien = Number(option[index].price_after_discount) * (1 + Number(option[index].tax?.tax_rate) / 100) * Number(option[index].quantity);
        option[index].total_amount = Number(tien.toFixed(2));
      }
    }
    else if (type == "note") {
      option[index].note = value?.target?.value;
    }
    else if (type == "delivery_date") {

      option[index].delivery_date = value
    }
    else if (type == "clearDeliveryDate") {
      option[index].delivery_date = null

    }

    setOption([...option])
  }
  const handleIncrease = (id) => {
    const index = option.findIndex((x) => x.id === id);
    const newQuantity = option[index].quantity + 1;
    option[index].quantity = newQuantity;
    if (option[index].tax?.tax_rate == undefined) {
      const tien = Number(option[index].price_after_discount) * (1 + Number(0) / 100) * Number(option[index].quantity);
      option[index].total_amount = Number(tien.toFixed(2));
    } else {
      const tien = Number(option[index].price_after_discount) * (1 + Number(option[index].tax?.tax_rate) / 100) * Number(option[index].quantity);
      option[index].total_amount = Number(tien.toFixed(2));
    }
    setOption([...option]);
  };

  const handleDecrease = (id) => {
    const index = option.findIndex((x) => x.id === id);
    const newQuantity = Number(option[index].quantity) - 1;
    // chỉ giảm số lượng khi nó lớn hơn hoặc bằng 1
    if (newQuantity >= 1) {
      option[index].quantity = Number(newQuantity);
      if (option[index].tax?.tax_rate == undefined) {
        const tien = Number(option[index].price_after_discount) * (1 + Number(0) / 100) * Number(option[index].quantity);
        option[index].total_amount = Number(tien.toFixed(2));
      } else {
        const tien = Number(option[index].price_after_discount) * (1 + Number(option[index].tax?.tax_rate) / 100) * Number(option[index].quantity);
        option[index].total_amount = Number(tien.toFixed(2));
      }
      setOption([...option]);
    } else {
      return Toast.fire({
        title: `${"Số lượng tối thiểu là 1 không thể giảm!"}`,
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
        title: `${"Mặc định hệ thống, không thể xóa!"}`,
        icon: 'error',
        confirmButtonColor: '#296dc1',
        cancelButtonColor: '#d33',
        confirmButtonText: `${dataLang?.aler_yes}`,
      })
    }
    const newOption = option.filter(x => x.id !== id); // loại bỏ phần tử cần xóa
    setOption(newOption); // cập nhật lại mảng
  }

  const taxOptions = [{ label: "Miễn thuế", value: "0", tax_rate: "0" }, ...dataTasxes]

  const tinhTongTien = (option) => {
    const totalPrice = option.slice(1).reduce((acc, item) => {
      const totalPrice = acc + item?.price * item?.quantity
      return acc + totalPrice
    }, 0);

    const totalDiscountPrice = option.slice(1).reduce((acc, item) => {
      const totalDiscountPrice = item?.price * (item?.discount / 100) * item?.quantity;
      return acc + totalDiscountPrice;
    }, 0);

    const totalDiscountAfterPrice = option.slice(1).reduce((acc, item) => {
      const tienSauCK = item?.quantity * item?.price_after_discount;
      return acc + tienSauCK;
    }, 0);

    const totalTax = option.slice(1).reduce((acc, item) => {
      const totalTaxIem = item?.price_after_discount * (isNaN(item?.tax?.tax_rate) ? 0 : (item?.tax?.tax_rate / 100)) * item?.quantity;
      return acc + totalTaxIem;
    }, 0);

    const totalAmount = option.slice(1).reduce((acc, item) => {
      const totalAmount = item?.total_amount
      return acc + totalAmount

    }, 0);
    return { totalPrice: totalPrice || 0, totalDiscountPrice: totalDiscountPrice || 0, totalDiscountAfterPrice: totalDiscountAfterPrice || 0, totalTax: totalTax || 0, totalAmount: totalAmount || 0 };
  };

  useEffect(() => {
    const totalPrice = tinhTongTien(option);
    setTongTienState(totalPrice);
  }, [option]);
  const dataOption = sortedArr?.map(e => {
    return {
      item: e?.item?.value,
      quantity: Number(e?.quantity),
      price: e?.price,
      discount_percent: e?.discount,
      tax_id: e?.tax?.value,
      price_quote_item_id: e?.item?.e?.price_quote_item_id,
      note: e?.note,
      id: e?.id,
      delivery_date: e?.delivery_date,
      price_quote_order_item_id: e?.price_quote_order_item_id
    }
  })

  let newDataOption = dataOption?.filter(e => e?.item !== undefined);

  // validate submit
  const handleSubmitValidate = (e) => {
    e.preventDefault();
    let deliveryDateInOption = option.slice(1).some(e => e?.delivery_date === null)

    if (typeOrder === '0') {
      if (startDate == null || customer == null || branch == null || staff == null || deliveryDateInOption) {
        startDate == null && setErrDate(true)
        customer?.value == null && sErrCustomer(true)
        branch?.value == null && setErrBranch(true)
        staff?.value == null && setErrStaff(true)
        // deliveryDateInOption && setErrDeliveryDate(true)
        // deliveryDate == null && setErrDeliveryDate(true)
        Toast.fire({
          icon: 'error',
          title: `${dataLang?.required_field_null}`
        })
      }
      else {
        sOnSending(true)
      }
    } else if (typeOrder === '1') {
      if (startDate == null || customer == null || branch == null || staff == null || deliveryDateInOption || quote == null) {
        startDate == null && setErrDate(true)
        customer?.value == null && sErrCustomer(true)
        branch?.value == null && setErrBranch(true)
        staff?.value == null && setErrStaff(true)
        deliveryDateInOption == null && setErrDeliveryDate(true)
        quote?.value == null && setErrQuote(true)
        // deliveryDate == null && setErrDeliveryDate(true)

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
  // handle submit
  const handleSubmit = () => {
    var formData = new FormData();
    formData.append("reference_no", codeProduct)
    formData.append("date", (moment(startDate).format("YYYY-MM-DD HH:mm:ss")))
    // formData.append("validity", (moment(deliveryDate).format("YYYY-MM-DD")))
    formData.append("branch_id", branch?.value)
    formData.append("client_id", customer?.value)
    formData.append("person_contact_id", contactPerson?.value)
    formData.append("staff_id", staff?.value)
    formData.append("note", note)

    if (typeOrder === "1") {
      formData.append("quote_item_id", quote?.value);
    }

    newDataOption.forEach((item, index) => {
      if (typeOrder === "1") {
        formData.append(`items[${index}][quote_item_id]`, quote?.value)
      }
      formData.append(`items[${index}][item]`, item?.item != undefined ? item?.item : "");
      formData.append(`items[${index}][quantity]`, item?.quantity.toString());
      formData.append(`items[${index}][price]`, item?.price);
      formData.append(`items[${index}][discount_percent]`, item?.discount_percent);
      formData.append(`items[${index}][tax_id]`, item?.tax_id != undefined ? item?.tax_id : "");
      formData.append(`items[${index}][note]`, item?.note != undefined ? item?.note : "");
      formData.append(`items[${index}][delivery_date]`, item?.delivery_date != undefined ? (moment(item?.delivery_date).format("YYYY-MM-DD HH:mm:ss")) : "");
    });

    if (tongTienState?.totalPrice > 0 && tongTienState?.totalDiscountPrice >= 0 && tongTienState?.totalDiscountAfterPrice > 0 && tongTienState?.totalTax >= 0 && tongTienState?.totalAmount > 0) {
      Axios("POST", `${id ? `/api_web/Api_quotation/quotation/${id}?csrf_protection=true` : "/api_web/Api_sale_order/saleOrder/?csrf_protection=true"}`, {
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      }, (err, response) => {
        var { isSuccess, message } = response?.data

        if (response && response.data && isSuccess === true && router.isReady) {
          Toast.fire({
            icon: 'success',
            title: `${dataLang[message]}`
          })
          setCodeProduct("")
          setStartDate(new Date())
          setDeliveryDate(new Date())
          setContactPerson(null)
          setStaff(null)
          setCustomer(null)
          setBranch(null)
          setNote("")
          setErrBranch(false)
          setErrDate(false)
          setErrDeliveryDate(false)
          sErrCustomer(false)
          setErrStaff(false)
          setErrQuote(false)
          setOption([{ id: Date.now(), item: null, unit: "", quantity: 0, note: "" }])
          router.push('/sales_export_product/salesOrder?tab=all')
        }
        if (response && response.data && isSuccess === false) {
          Toast.fire({
            icon: 'error',
            title: `${dataLang[message]}`
          })
        }
        sOnSending(false)
      })
    } else {
      Toast.fire({
        icon: 'error',
        title: newDataOption?.length === 0 ? `Chưa chọn thông tin mặt hàng!` : 'Tiền không được âm, vui lòng kiểm tra lại thông tin mặt hàng!'
      })
      sOnSending(false)
    }

  }

  useEffect(() => {
    onSending && handleSubmit()
  }, [onSending]);

  const handleClearDate = (type, id,) => {

    var index = option.findIndex(x => x.id === id);

    if (type === 'deliveryDate') {
      setDeliveryDate(null)
    }
    if (type === 'startDate') {
      setStartDate(new Date())
    }
  }

  // codeProduct new
  const hiddenOptions = quote?.length > 3 ? quote?.slice(0, 3) : [];
  const fakeDataQuotes = branch != null ? dataQuotes.filter((x) => !hiddenOptions.includes(x.value)) : []

  const optionsItem = dataItems?.map(e => ({ label: `${e.name} <span style={{display: none}}>${e.codeProduct}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`, value: e.id, e }))
  const allItems = [...options]

  const _HandleSelectAll = () => {
    const fakeData = [{ id: Date.now(), item: null }]
    const data = fakeData?.concat(allItems?.map(e => ({
      id: uuidv4(),
      item: e,
      khohang: khotong ? khotong : e?.qty_warehouse,
      unit: e?.e?.unit_name,
      quantity: idTheOrder != null ? Number(e?.e?.quantity_left) : 1,
      price: e?.e?.price,
      discount: totalDiscount ? totalDiscount : e?.e?.discount_percent,
      price_after_discount: Number(e?.e?.price_after_discount),
      tax: totalTax ? totalTax : {
        label: e?.e?.tax_name,
        value: e?.e?.tax_id, tax_rate: e?.e?.tax_rate
      },
      total_amount: Number(e?.e?.amount), ghichu: e?.e?.note
    })))
    setOption(data);
    // sitemAll(data)
    //new
    setItemsAll(allItems?.map(e => ({
      id: uuidv4(),
      item: e?.e,
      label: e?.label,
      value: e?.value
    })))
    sListData(allItems?.map(e => ({
      id: uuidv4(),
      item: e?.e,
      label: e?.label,
      value: e?.value
    })))
  };

  const _HandleDeleteAll = () => {
    sitemAll([])
    setOption([{ id: Date.now(), item: null }])
    //new
    sListData([])
  };

  const MenuList = (props) => {
    return (
      <components.MenuList {...props}>
        {allItems?.length > 0 &&
          <div className='grid grid-cols-2 items-center  cursor-pointer'>
            <div className='hover:bg-slate-200 p-2 col-span-1 text-center ' onClick={_HandleSelectAll.bind(this)}>Chọn tất cả</div>
            <div className='hover:bg-slate-200 p-2 col-span-1 text-center' onClick={_HandleDeleteAll.bind(this)}>Bỏ chọn tất cả</div>
          </div>
        }
        {props.children}
      </components.MenuList>
    );
  };

  // render option item in formatGroupLabel Item
  const selectItemsLabel = (option) => {
    return (
      <div className='flex items-center justify-between py-1'>
        <div className='flex items-center gap-2 '>
          <div>
            {
              option.e?.images !== null
                ?
                (
                  <img src={option.e?.images} alt="Product Image" className='max-w-[30px] h-[40px] text-[8px] object-cover rounded' />
                )
                :
                (
                  <div className='w-[30px] h-[40px] object-cover  flex items-center justify-center rounded'>
                    <img src="/no_img.png" alt="Product Image" className='w-[30px] h-[30px] object-cover rounded' />
                  </div>
                )
            }
          </div>

          <div>
            <h3 className='font-bold 3xl:text-[14px] 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>
              {option.e?.name}
            </h3>

            <div className='flex gap-2'>
              <h5 className='text-gray-400 font-normal 3xl:text-[14px] 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>
                {option.e?.codeProduct}:
              </h5>
              <h5 className='font-normal 3xl:text-[14px] 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>
                {option.e?.product_variation}
              </h5>
            </div>

            <div className='flex flex-row gap-16'>
              <h5 className='text-gray-400 font-normal 3xl:text-[14px] 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>
                {dataLang[option.e?.text_type]}
              </h5>

              <div className='flex items-center gap-1'>
                <h5 className='text-gray-400 font-normal 3xl:text-[14px] 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>
                  {dataLang?.purchase_survive || "purchase_survive"}:
                </h5>

                <h5 className=' font-normal 3xl:text-[14px] 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>
                  {option.e?.qty_warehouse ? option.e?.qty_warehouse : "0"}
                </h5>
              </div>

            </div>

          </div>
        </div>

      </div>
    )
  }

  // render option formatGroupLabel tax 
  const taxRateLabel = (option) => {
    return (
      <div className='flex justify-start items-center gap-1 '>
        <h2 className='2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{option?.label}</h2>
        <h2 className='2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{`(${option?.tax_rate})`}</h2>
      </div>
    )
  }

  return (
    <React.Fragment>
      <Head>
        <title>{id ? dataLang?.sales_product_edit_order || "sales_product_edit_order" : dataLang?.sales_product_add_order || "sales_product_add_order"}</title>
      </Head>
      <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 flex flex-col justify-between'>
        <div className='h-[97%] space-y-3 overflow-hidden'>

          <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
            <h6 className='text-[#141522]/40'>
              {dataLang?.sales_product_list || "sales_product_list"}
            </h6>
            <span className='text-[#141522]/40'>/</span>
            <h6>
              {id ? dataLang?.sales_product_edit_order || "sales_product_edit_order" : dataLang?.sales_product_add_order || "sales_product_add_order"}
            </h6>
          </div>

          <div className='flex justify-between items-center'>
            <h2 className='xl:text-2xl text-xl '>
              {id ? dataLang?.sales_product_edit_order || "sales_product_edit_order" : dataLang?.sales_product_add_order || "sales_product_add_order"}
            </h2>
            <div className="flex justify-end items-center">
              <button
                onClick={() => router.back()}
                className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105"
              >
                {dataLang?.btn_back || "btn_back"}
              </button>
            </div>
          </div>

          {/* Thông tin chung */}
          <div className=' w-full rounded'>
            <div >
              <h2 className='font-normal bg-[#ECF0F4] p-2'>
                {dataLang?.detail_general_information || "detail_general_information"}
              </h2>
              <div className="grid grid-cols-12 gap-3 items-center mt-2">
                <div className='col-span-3'>
                  <label className="text-[#344054] font-normal text-sm mb-1 ">
                    {dataLang?.sales_product_code || "sales_product_code"}
                  </label>
                  <input
                    value={codeProduct}
                    onChange={handleOnChangeInput.bind(this, "codeProduct")}
                    name="fname"
                    type="text"
                    placeholder={dataLang?.system_default || "system_default"}
                    className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                  />
                </div>

                <div className='col-span-3'>
                  <label className="text-[#344054] font-normal text-sm mb-1 ">
                    {dataLang?.branch || "branch"} <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={dataBranch}
                    onChange={handleOnChangeInput.bind(this, "branch")}
                    value={branch}
                    isClearable={true}
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    placeholder={dataLang?.select_branch || "select_branch"}
                    className={`${errBranch ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                  {errBranch && <label className="text-sm text-red-500">{dataLang?.price_quote_errSelect_table_branch || "price_quote_errSelect_table_branch"}</label>}
                </div>

                <div className='col-span-3'>
                  <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.customer || 'customer'} <span className="text-red-500">*</span></label>
                  <Select
                    options={dataCustomer}
                    onChange={handleOnChangeInput.bind(this, "customer")}
                    value={customer}
                    placeholder={dataLang?.select_customer || "select_customer"}
                    hideSelectedOptions={false}
                    isClearable={true}
                    className={`${errCustomer ? "border-red-500" : "border-transparent"} placeholder:text-slate-300 w-fullbg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                  {errCustomer && <label className="text-sm text-red-500">{dataLang?.price_quote_errSelect_customer || "price_quote_errSelect_customer"}</label>}
                </div>

                <div className='col-span-3'>
                  <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.contact_person || "contact_person"}</label>
                  <Select
                    options={dataPersonContact}
                    onChange={handleOnChangeInput.bind(this, "contactPerson")}
                    value={contactPerson}
                    placeholder={dataLang?.select_contact_person || "select_contact_person"}
                    hideSelectedOptions={false}
                    isClearable={true}
                    className={` placeholder:text-slate-300 w-full  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border`}
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

                <div className='col-span-3'>
                  <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.sales_product_date || "sales_product_date"} <span className="text-red-500">*</span></label>
                  <div className="custom-date-picker flex flex-row">
                    <DatePicker
                      blur
                      fixedHeight
                      showTimeSelect
                      selected={startDate}
                      onSelect={(date) => setStartDate(date)}
                      onChange={(e) => setStartDate(e)}
                      placeholderText="DD/MM/YYYY HH:mm:ss"
                      dateFormat="dd/MM/yyyy h:mm:ss aa"
                      timeInputLabel={'Time: '}
                      className={`border ${errDate ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer relative`}
                    />
                    {startDate && (
                      <>
                        <MdClear className="absolute translate-x-[2400%] translate-y-[4%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer" onClick={() => handleClearDate('startDate')} />
                      </>
                    )}
                    <BsCalendarEvent className="absolute left-0 translate-x-[2850%] translate-y-[80%] text-[#CCCCCC] scale-110 cursor-pointer" />
                  </div>
                  {errDate && <label className="text-sm text-red-500">{dataLang?.price_quote_errDate || "price_quote_errDate"}</label>}
                </div>

                <div className='col-span-3'>
                  <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.sales_product_staff_in_charge || "sales_product_staff_in_charge"}  <span className="text-red-500">*</span></label>
                  <Select
                    options={dataStaffs}
                    onChange={(value) => handleOnChangeInput("staff", value)}
                    value={staff}
                    placeholder={dataLang?.sales_product_select_staff_in_charge || "sales_product_select_staff_in_charge"}
                    hideSelectedOptions={false}
                    isClearable={true}
                    className={`${errStaff ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border`}
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
                  {errStaff && <label className="text-sm text-red-500">{dataLang?.sales_product_err_staff_in_charge || "sales_product_err_staff_in_charge"}</label>}
                </div>

                <div className='col-span-3'>
                  <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.sales_product_order_type || "sales_product_order_type"} </label>
                  <div className='flex items-center gap-5'>
                    <div className="flex items-center ">
                      <input
                        onChange={(value) => handleOnChangeInput("typeOrder", value)}
                        id="default-radio-1"
                        type="radio"
                        value="0"
                        checked={typeOrder === "0" ? true : false}
                        name="default-radio"
                        className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        for="default-radio-1"
                        className="ml-2 cursor-pointer text-sm font-normal text-gray-900 dark:text-gray-300"
                      >
                        {dataLang?.sales_product_new_order || "sales_product_new_order"}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        onChange={(value) => handleOnChangeInput("typeOrder", value)}
                        checked={typeOrder === "1" ? true : false}
                        id="default-radio-2"
                        type="radio"
                        value="1"
                        name="default-radio"
                        className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        for="default-radio-2"
                        className="ml-2 cursor-pointer text-sm font-normal text-gray-900 dark:text-gray-300"
                      >
                        {dataLang?.sales_product_according_to_quotation || "sales_product_according_to_quotation"}
                      </label>
                    </div>
                  </div>
                </div>
                {hidden && (
                  <div className='col-span-3'>
                    <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.sales_product_quotation || "sales_product_quotation"} <span className="text-red-500">*</span> </label>
                    <Select
                      options={fakeDataQuotes}
                      onChange={(value) => handleOnChangeInput("quote", value)}
                      value={quote}
                      placeholder={dataLang?.sales_product_select_quotation || "sales_product_select_quotation"}
                      hideSelectedOptions={false}
                      isClearable={true}
                      className={`${errQuote ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                    {errQuote && <label className="text-sm text-red-500">{dataLang?.sales_product_err_staff_in_charge || "sales_product_err_staff_in_charge"}</label>}
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Thông tin mặt hàng */}
          <h2 className='font-normal bg-[#ECF0F4] p-2  '>{dataLang?.item_information || "item_information"}</h2>

          <div className='grid grid-cols-10'>
            <div div className='col-span-2 my-auto'>
              <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.import_click_items || "import_click_items"} </label>
              <Select
                onInputChange={_HandleSeachApi.bind(this)}
                options={allItems}
                closeMenuOnSelect={false}
                onChange={handleOnChangeInput.bind(this, "itemAll")}
                // value={itemsAll}
                value={itemsAll?.value ? itemsAll?.value : sortedArr?.map(e => e?.item)}
                isMulti
                components={{ MenuList, MultiValue }}
                formatOptionLabel={(option) => {
                  if (option.value === "0") {
                    return (
                      <div className='text-gray-400 font-medium'>{option.label}</div>
                    )
                  }
                  else if (option.value === null) {
                    return (
                      <div className='text-gray-400 font-medium'>{option.label}</div>
                    )
                  }
                  else {
                    return (
                      <div className='flex items-center justify-between py-2'>
                        <div className='flex items-center gap-2'>
                          <div>
                            {
                              option.e?.images != null ?
                                (
                                  <img src={option.e?.images} alt="Product Image" style={{ width: "40px", height: "50px" }} className='object-cover rounded' />
                                ) :
                                (
                                  <div className='w-[50px] h-[60px] object-cover flex items-center justify-center rounded'>
                                    <img src="/no_img.png" alt="Product Image" style={{ width: "40px", height: "40px" }} className='object-cover rounded' />
                                  </div>
                                )
                            }
                          </div>
                          <div>
                            <h3 className='font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{option.e?.name}</h3>
                            <div className='flex gap-2'>
                              <h5 className='text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{option.e?.codeProduct}</h5>
                              <h5 className='font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{option.e?.product_variation}</h5>
                            </div>
                            <h5 className='text-gray-400 font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{dataLang[option.e?.text_type]}</h5>
                          </div>
                        </div>

                        <div className=''>
                          <div className='text-right opacity-0'>{"0"}</div>
                          <div className='flex gap-2'>
                            <div className='flex items-center gap-2'>
                              <h5 className='text-gray-400 font-normal'>{dataLang?.purchase_survive || "purchase_survive"}:</h5>
                              <h5 className='text-[#0F4F9E] font-medium'>{option.e?.qty_warehouse || 0}</h5>
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
                className="rounded-md bg-white  2xl:text-[12px] xl:text-[13px] text-[12.5px] "
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
          </div>


          {/* Thông tin mặt hàng Header */}
          <div className='pr-2'>
            <div className='grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 '>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-2 text-left truncate font-[400]'>{dataLang?.sales_product_item || "sales_product_item"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]'>{dataLang?.sales_product_from_unit || "sales_product_from_unit"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]'>{dataLang?.sales_product_quantity || "sales_product_quantity"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]'>{dataLang?.sales_product_unit_price || "sales_product_unit_price"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]'>{`${dataLang?.sales_product_rate_discount}` || "sales_product_rate_discount"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-left    font-[400]'>{dataLang?.sales_product_after_discount || "sales_product_after_discount"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]'>{dataLang?.sales_product_tax || "sales_product_tax"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-left    truncate font-[400]'>{dataLang?.sales_product_money_after_discount || "sales_product_money_after_discount"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-left truncate font-[400]'>{dataLang?.sales_product_item_date || "sales_product_item_date"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-left    truncate font-[400]'>{dataLang?.sales_product_note || "sales_product_note"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]'>{dataLang?.sales_product_operations || "sales_product_operations"}</h4>
            </div>
          </div>
          {/* Thông tin mặt hàng Mặt hàng */}
          <div className='h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
            <div className='pr-2'>
              <React.Fragment>
                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                  {sortedArr.map((e, index) =>
                    <div className='grid grid-cols-12 gap-1 py-1 items-center' key={e?.id}>
                      <div className='col-span-2 '>
                        <Select
                          onInputChange={_HandleSeachApi.bind(this)}
                          dangerouslySetInnerHTML={{ __html: option.label }}
                          options={options}
                          onChange={(value) => handleOnChangeInputOption(e?.id, "item", value)}
                          value={e?.item}
                          formatOptionLabel={selectItemsLabel}
                          placeholder={dataLang?.sales_product_select_item || "sales_product_select_item"}
                          hideSelectedOptions={false}
                          className={`cursor-pointer rounded-md bg-white  3xl:text-[12px] 2xl:text-[14px] xl:text-base text-[14.5px]`}
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
                        <h3 className={`${index === 0 ? 'cursor-default' : 'cursor-text'} 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}>
                          {e?.unit}
                        </h3>
                      </div>
                      <div className='col-span-1 flex items-center justify-center'>
                        <div className="flex items-center justify-center">
                          <button
                            disabled={index === 0}
                            onClick={() => handleDecrease(e?.id)}
                            className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                          >
                            <Minus size="16" />
                          </button>
                          <NumericFormat
                            className={`${index === 0 ? 'cursor-default' : 'cursor-text'} appearance-none text-center 2xl:text-[12px] xl:text-[13px] text-[12.5px] py-2 px-0.5 font-normal 2xl:w-24 xl:w-[90px] w-[63px]  focus:outline-none border-b-2 border-gray-200`}
                            onValueChange={(value) => handleOnChangeInputOption(e?.id, "quantity", value)}
                            value={e?.quantity || 1}
                            thousandSeparator=","
                            allowNegative={false}
                            readOnly={index === 0 ? readOnlyFirst : false}
                            decimalScale={0}
                            isNumericString={true}
                            isAllowed={(values) => { const { floatValue } = values; return floatValue > 0 }}
                          />
                          <button
                            disabled={index === 0}
                            onClick={() => handleIncrease(e.id)}
                            className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                          >
                            <Add size="16" />
                          </button>
                        </div>
                      </div>
                      <div className='col-span-1 text-center flex items-center justify-center'>
                        <NumericFormat
                          value={e?.price}
                          onValueChange={(value) => handleOnChangeInputOption(e?.id, "price", value)}
                          allowNegative={false}
                          readOnly={index === 0 ? readOnlyFirst : false}
                          decimalScale={0}
                          isNumericString={true}
                          className={`${index === 0 ? 'cursor-default' : 'cursor-text'} appearance-none 2xl:text-[12px] xl:text-[13px] text-[12.5px] text-center py-1 px-2 font-normal w-[80%] focus:outline-none border-b-2 border-gray-200`}
                          thousandSeparator=","
                        />
                      </div>
                      <div className='col-span-1 text-center flex items-center justify-center'>
                        <NumericFormat
                          value={e?.discount}
                          onValueChange={(value) => handleOnChangeInputOption(e?.id, "discount", value)}
                          className={`${index === 0 ? 'cursor-default' : 'cursor-text'} appearance-none text-center py-1 px-2 font-normal w-[80%]  focus:outline-none border-b-2 2xl:text-[12px] xl:text-[13px] text-[12.5px] border-gray-200`}
                          thousandSeparator=","
                          allowNegative={false}
                          isAllowed={(values) => {
                            if (!values.value) return true;
                            const { floatValue } = values;
                            if (floatValue > 999) {
                              Toast.fire({
                                icon: 'error',
                                title: `Vui lòng nhập số % chiết khấu nhỏ hơn 999`
                              })
                            }
                            return floatValue < 999;
                          }}
                          readOnly={index === 0 ? readOnlyFirst : false}
                          // decimalScale={0}
                          isNumericString={true}
                        />
                      </div>

                      <div className='col-span-1 text-right flex items-center justify-end'>
                        <h3 className={`${index === 0 ? 'cursor-default' : 'cursor-text'} px-2 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}>{formatNumber(e?.price_after_discount)}</h3>
                      </div>
                      <div className='col-span-1 flex justify-center items-center'>
                        <Select
                          options={taxOptions}
                          onChange={(value) => handleOnChangeInputOption(e?.id, "tax", value)}
                          value={
                            e?.tax ?
                              {
                                label: taxOptions.find(item => item.value === e?.tax?.value)?.label,
                                value: e?.tax?.value, tax_rate: e?.tax?.tax_rate
                              }
                              :
                              null
                          }
                          placeholder={"% Thuế"}
                          isDisabled={index === 0 ? true : false}
                          hideSelectedOptions={false}
                          formatOptionLabel={taxRateLabel}
                          className={`border-transparent placeholder:text-slate-300 h-10 w-full 2xl:text-[12px] xl:text-[13px] text-[12.5px] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
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
                      <div className='col-span-1 text-right flex items-center justify-end'>
                        <h3 className={`${index === 0 ? 'cursor-default' : 'cursor-text'} px-2 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}>{formatNumber(e?.total_amount)}</h3>
                      </div>
                      <div className='col-span-1 '>
                        <div className="custom-date-picker flex flex-row relative">
                          <DatePicker
                            selected={(index !== 0 && e?.delivery_date ? e?.delivery_date : null) || (index !== 0 && deliveryDate ? deliveryDate : null)}
                            blur
                            disabled={index === 0 ? true : false}
                            placeholderText="DD/MM/YYYY"
                            dateFormat="dd/MM/yyyy"
                            onSelect={(date) => handleOnChangeInputOption(e?.id, "delivery_date", date)}
                            onChange={(date) => handleOnChangeInputOption(e?.id, "delivery_date", date)}
                            // className={`${errDeliveryDate && index !== 0 ? "border-red-500 " : "focus:border-[#92BFF7] border-[#d0d5dd]"} 3xl:h-10 h-10 w-full 3xl:text-[12px] 2xl:text-[14px] xl:text-[14px] lg:text-[14px] border placeholder:text-slate-300 bg-[#ffffff] rounded text-[#52575E] font-normal px-2 outline-none cursor-pointer `}
                            className={`${index === 0 ? 'bg-gray-100' : (!e?.delivery_date ? 'border-red-500' : 'focus:border-[#92BFF7] border-[#d0d5dd]')} 3xl:h-10 h-10 w-full 3xl:text-[12px] 2xl:text-[10px] xl:text-[14px] lg:text-[14px] border placeholder:text-slate-300 bg-[#ffffff] rounded text-[#52575E] font-normal px-2 outline-none cursor-pointer `}
                          />
                          {e?.delivery_date && (
                            <>
                              <MdClear
                                className="absolute right-0 3xl:-translate-x-[320%] 3xl:translate-y-[1%] lg:-translate-x-[200%] lg:translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] 3xl:scale-110 lg:scale-90 cursor-pointer"
                                onClick={() => handleOnChangeInputOption(e?.id, 'clearDeliveryDate')}
                              />
                            </>
                          )}
                          <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%]  text-[#CCCCCC] scale-110 cursor-pointer" />
                        </div>
                        {!e?.delivery_date && index !== 0 && <label className="text-[12px] max-w-10px text-red-500">Vui lòng chọn ngày cần hàng!</label>}
                      </div>
                      <div className='col-span-1 flex items-center justify-center'>
                        <input
                          value={e?.note}
                          onChange={(value) => handleOnChangeInputOption(e?.id, "note", value)}
                          name="optionEmail"
                          placeholder='Ghi chú'
                          disabled={index === 0 ? true : false}
                          type="text"
                          className="focus:border-[#92BFF7] border-[#d0d5dd] h-10 2xl:text-[12px] xl:text-[13px] text-[12.5px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none"
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
              <h2>{dataLang?.sales_product_discount || "sales_product_discount"}</h2>
              <div className='col-span-1 text-center flex items-center justify-center'>
                <NumericFormat
                  value={totalDiscount}
                  onValueChange={handleOnChangeInput.bind(this, "totaldiscount")}
                  className=" text-center py-1 px-2 bg-transparent font-normal w-20 focus:outline-none border-b-2 border-gray-300"
                  thousandSeparator=","
                  allowNegative={false}
                  decimalScale={0}
                  isNumericString={true}
                />
              </div>
            </div>
            <div className='col-span-2 flex items-center gap-2'>
              <h2>{dataLang?.sales_product_tax || "sales_product_tax"}</h2>
              <Select
                options={taxOptions}
                onChange={(value) => handleOnChangeInput("total_tax", value)}
                value={totalTax}
                formatOptionLabel={(option) => (
                  <div className='flex justify-start items-center gap-1 '>
                    <h2>{option?.label}</h2>
                    <h2>{`(${option?.tax_rate})`}</h2>
                  </div>
                )}
                placeholder={dataLang?.sales_product_tax || "sales_product_tax"}
                hideSelectedOptions={false}
                className={` "border-transparent placeholder:text-slate-300 w-[70%] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
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
            <div className='col-span-3 flex items-center gap-2'>
              <h2>{dataLang?.sales_product_item_date || "sales_product_item_date"}</h2>
              <div className="custom-date-picker flex flex-row relative">
                <DatePicker
                  selected={deliveryDate}
                  onChange={(date) => handleOnChangeInput("total_delivery_date", date)}
                  blur
                  placeholderText="DD/MM/YYYY"
                  dateFormat="dd/MM/yyyy"
                  onSelect={(date) => setDeliveryDate(date)}
                  className={`3xl:h-11 h-10 3xl:w-[210px] w-full 3xl:text-[16px] 2xl:text-[14px] xl:text-[14px] lg:text-[14px] border placeholder:text-slate-300 bg-[#ffffff] rounded text-[#52575E] font-normal px-2 outline-none cursor-pointer `}
                />
                {deliveryDate && (
                  <>
                    <MdClear className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer" onClick={() => handleClearDate('deliveryDate')} />
                  </>
                )}
                <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%]  text-[#CCCCCC] scale-110 cursor-pointer" />
              </div>
            </div>

          </div>

          <h2 className='font-normal bg-[white]  p-2 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]'>{dataLang?.price_quote_total_outside || "price_quote_total_outside"} </h2>
        </div>

        <div className='grid grid-cols-12'>
          <div className='col-span-9'>
            <div className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.sales_product_note || "sales_product_note"}</div>
            <textarea
              value={note}
              placeholder={dataLang?.sales_product_note || "sales_product_note"}
              onChange={handleOnChangeInput.bind(this, "note")}
              name="fname"
              type="text"
              className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-[40%] min-h-[220px] max-h-[220px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
            />
          </div>
          <div className="text-right mt-5 space-y-4 col-span-3 flex-col justify-between ">
            <div className='flex justify-between '>
            </div>
            <div className='flex justify-between '>
              <div className='font-normal'><h3>{dataLang?.price_quote_total || "price_quote_total"}</h3></div>
              <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.totalPrice)}</h3></div>
            </div>
            <div className='flex justify-between '>
              <div className='font-normal'><h3>{dataLang?.sales_product_discount || "sales_product_discount"}</h3></div>
              <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.totalDiscountPrice)}</h3></div>
            </div>
            <div className='flex justify-between '>
              <div className='font-normal'><h3>{dataLang?.sales_product_total_money_after_discount || "sales_product_total_money_after_discount"}</h3></div>
              <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.totalDiscountAfterPrice)}</h3></div>
            </div>
            <div className='flex justify-between '>
              <div className='font-normal'><h3>{dataLang?.price_quote_tax_money || "price_quote_tax_money"}</h3></div>
              <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.totalTax)}</h3></div>
            </div>
            <div className='flex justify-between '>
              <div className='font-normal'><h3>{dataLang?.price_quote_into_money || "price_quote_into_money"}</h3></div>
              <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.totalAmount)}</h3></div>
            </div>
            <div className='space-x-2'>
              <button
                onClick={() => router.back()}
                className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]">{dataLang?.btn_back || "btn_back"}</button>
              <button
                onClick={handleSubmitValidate.bind(this)}
                type="submit" className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]">{dataLang?.btn_save || "btn_save"}</button>
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

  return index < maxToShow
    ?
    (
      <components.MultiValue {...props} />
    )
    :
    (
      index === maxToShow ?
        (
          <MoreSelectedBadge items={overflow} />
        )
        :
        (null)
    )
};

export default Index