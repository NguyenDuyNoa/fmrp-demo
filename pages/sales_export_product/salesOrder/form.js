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
import Loading from 'components/UI/loading';

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
  const [onFetching, setOnFetching] = useState(false);
  const [onFetchingItemsAll, setOnFetchingItemsAll] = useState(false);
  const [onFetchingItem, setOnFetchingItem] = useState(false);
  const [onFetchingDetail, setOnFetchingDetail] = useState(false)
  const [onFetchingCustomer, setOnFetchingCustomer] = useState(false)
  const [onFetchingStaff, setOnFetchingStaff] = useState(false)
  const [onFetchingQuote, setOnFetchingQuote] = useState(false)
  const [onFetchingContactPerson, setOnFetchingContactPerson] = useState(false)
  const [onSending, setOnSending] = useState(false);
  const [option, setOption] = useState([]);

  const [dataCustomer, setDataCustomer] = useState([])
  const [dataPersonContact, setDataContactPerson] = useState([])
  const [dataStaffs, setDataStaffs] = useState([])
  const [dataQuotes, setDataQuotes] = useState([])
  const [dataItems, setDataItems] = useState([])
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
  const [itemsAll, setItemsAll] = useState([])

  const [tongTienState, setTongTienState] = useState({
    totalPrice: 0,
    totalDiscountPrice: 0,
    totalDiscountAfterPrice: 0,
    totalTax: 0,
    totalAmount: 0
  });

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
    Axios("GET", `/api_web/Api_sale_order/saleOrder/${id}?csrf_protection=true`, {
    }, (err, response) => {
      if (!err) {
        var rResult = response.data;
        console.log('ress edit :', rResult);

        const items = rResult?.items?.map(e => ({
          price_quote_order_item_id: e?.id,
          id: e.id,
          item: {
            e: e?.item,
            label: `${e.item?.item_name} <span style={{display: none}}>${e.item?.codeProduct + e.item?.product_variation + e.item?.text_type + e.item?.unit_name}</span>`,
            value: e.item?.id
          },
          quantity: +e?.quantity,
          price: +e?.price,
          discount: +e?.discount_percent,
          tax: { tax_rate: e?.tax_rate, value: e?.tax_id },
          unit: e.item?.unit_name,
          price_after_discount: +e?.price_after_discount,
          note: e?.note,
          total_amount: (+e?.price_after_discount) * (1 + (+e?.tax_rate) / 100) * (+e?.quantity)
        }));
        console.log("item : ", items);

        setOption(items)
        setCodeProduct(rResult?.code)
        setContactPerson(rResult?.contact_name !== null && rResult?.contact_name !== '0' ? { label: rResult?.contact_name, value: rResult?.contact_id } : null)
        setBranch({ label: rResult?.branch_name, value: rResult?.branch_id })
        setStaff({ label: rResult?.staff_name, value: rResult?.staff_id })
        setCustomer({ label: rResult?.client_name, value: rResult?.client_id })
        setStartDate(moment(rResult?.date).toDate())
        setDeliveryDate(moment(rResult?.validity).toDate())
        setNote(rResult?.note)
        if (rResult?.quote_id !== "0" && rResult?.quote_code !== null) {
          setTypeOrder("1")
          setHidden(true)
          setQuote({ label: rResult?.quote_code, value: rResult?.quote_id })
        }
      }
      setOnFetchingDetail(false)
    })
  }

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

    setOnFetching(false)
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
    setOnFetchingCustomer(false)
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
    setOnFetchingContactPerson(false)
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
    setOnFetchingStaff(false)
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
    setOnFetchingQuote(false)
  }

  // fetch items
  const handleFetchingItemsAll = () => {
    if (typeOrder === "1") {
      Axios("POST", "/api_web/Api_product/searchItemsVariant/?csrf_protection=true", {}, (err, response) => {
        if (!err) {
          var { result } = response.data.data
          setDataItems(result)
        }
      })
      setOnFetchingItemsAll(false)
    }
    if (typeOrder === "0") {
      Axios("POST", "/api_web/Api_product/searchItemsVariant/?csrf_protection=true", {}, (err, response) => {
        if (!err) {
          var { result } = response.data.data
          setDataItems(result)
        }
      })
      setOnFetchingItemsAll(false)

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
            setDataItems(result)
          }
        })
        setOnFetchingItem(false)
      }
      else {
        Axios("POST", "/api_web/Api_product/searchItemsVariant/?csrf_protection=true", {}, (err, response) => {
          if (!err) {
            var { result } = response.data.data
            setDataItems(result)
          }
        })
        setOnFetchingItem(false)

      }
    }
    else if (typeOrder === '0') {
      Axios("POST", "/api_web/Api_product/searchItemsVariant/?csrf_protection=true", {}, (err, response) => {
        if (!err) {
          var { result } = response.data.data
          setDataItems(result)
        }
      })
      setOnFetchingItem(false)

    }
  }


  useEffect(() => {
    onFetchingDetail && _ServerFetchingDetail()
  }, [onFetchingDetail]);

  useEffect(() => {
    id && setOnFetchingDetail(true)
  }, []);

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
    branch !== null && (setOnFetchingCustomer(true) || setOnFetchingStaff(true))
  }, [branch]);

  useEffect(() => {
    customer !== null && (setOnFetchingContactPerson(true) || setOnFetchingQuote(true))
  }, [customer]);
  useEffect(() => {
    quote !== null && (setOnFetchingItem(true))
  }, [quote]);

  useEffect(() => {
    setOnFetchingItemsAll && handleFetchingItemsAll()
  }, [setOnFetchingItemsAll])

  useEffect(() => {
    onFetchingItem && handleFetchingItem()
  }, [onFetchingItem]);

  const options = dataItems?.map(e => {
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
    id && setOnFetchingDetail(true)
  }, []);

  // tổng thay đổi
  useEffect(() => {
    if (totalTax == null) return;
    setOption(prevOption => {
      const newOption = [...prevOption];
      const thueValue = totalTax?.tax_rate || 0;
      const chietKhauValue = totalDiscount || 0;
      newOption.forEach((item, index) => {
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
    branch !== null && (setOnFetchingCustomer(true) || setOnFetchingStaff(true))
  }, [branch]);

  useEffect(() => {
    customer !== null && (setOnFetchingContactPerson(true) || setOnFetchingQuote(true))
  }, [customer]);
  useEffect(() => {
    quote !== null && (setOnFetchingItem(true))
  }, [quote]);

  useEffect(() => {
    onFetchingItemsAll && handleFetchingItemsAll()
  }, [onFetchingItemsAll])

  useEffect(() => {
    onFetchingItem && handleFetchingItem()
  }, [onFetchingItem]);

  useEffect(() => {
    onFetching && handleFetchingBranch()
  }, [onFetching]);

  useEffect(() => {
    router.query && setOnFetching(true)
    router.query && setOnFetchingItemsAll(true)
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
          setDataItems(result)
        }
      })

    }
    if (typeOrder === "0") {
      Axios("POST", `/api_web/Api_product/searchItemsVariant/?csrf_protection=true`, {}, (err, response) => {
        if (!err) {
          var { result } = response?.data.data
          setDataItems(result)
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
      if (option?.length >= 1) {
        Swal.fire({
          title: `${"Thay đổi sẽ xóa lựa chọn mặt hàng trước đó, bạn có muốn tiếp tục ?"}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#296dc1',
          cancelButtonColor: '#d33',
          confirmButtonText: `${dataLang?.aler_yes}`,
          cancelButtonText: `${dataLang?.aler_cancel}`
        }).then((result) => {
          if (result.isConfirmed) {
            setCustomer(value)
            setDataContactPerson([])
            setContactPerson(null)
            setDataQuotes([])
            setQuote(null)
            setOption([])

            setOnFetchingItem(true)
          }
        })
      } else {
        setCustomer(value)
        setDataContactPerson([])
        setContactPerson(null)
        setDataQuotes([])
        setQuote(null)

        setOnFetchingItem(true)
      }


    }
    else if (type === "branch") {
      if (option?.length >= 1) {
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
            setOption([])
            setCustomer(null)
            setDataCustomer([])
            setDataContactPerson([])
            setContactPerson(null)
            setDataStaffs([])
            setStaff(null)
            setDataQuotes([])
            setQuote(null)

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
        setOption([])
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

          setOnFetchingItem(value.target.value === "0" && true)
          setOnFetchingItemsAll(value.target.value === "1" && true)

          // setDataItems([])
          setTotalTax('')
          setTotalDiscount('')
          setOption([])


        }
      })
    }
    else if (type === "quote") {
      if (option?.length >= 1) {
        Swal.fire({
          title: `${"Thay đổi sẽ xóa lựa chọn mặt hàng trước đó, bạn có muốn tiếp tục ?"}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#296dc1',
          cancelButtonColor: '#d33',
          confirmButtonText: `${dataLang?.aler_yes}`,
          cancelButtonText: `${dataLang?.aler_cancel}`
        }).then((result) => {
          if (result.isConfirmed) {
            setQuote(value)
            setOption([])

            setOnFetchingItemsAll(true)
            setOnFetchingItem(true)

          }
        })
      } else {
        setQuote(value)
        setOnFetchingItem(true)
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
      if (value?.length === 0) {
        // setOption([{id: Date.now(), item: null}])
        //new
        setOption([])
      } else if (value?.length > 0) {
        if (typeOrder === "0") {
          const newData = value?.map((e, index) => {
            return ({
              id: uuidv4(),
              item: {
                e: e?.e,
                label: e?.label,
                value: e?.value,
              },
              unit: e?.e?.unit_name,
              quantity: 1,
              sortIndex: index,
              price: 1,
              discount: 0,
              price_after_discount: 1,
              tax: 0,
              price_after_tax: 1,
              total_amount: 1,
              note: "",
              delivery_date: null
            })
          }).sort((a, b) => b.sortIndex - a.sortIndex)
          setOption([...newData])
        }
        if (typeOrder === "1" && quote !== null) {

          const newData = value?.map((e, index) => {

            return ({
              id: uuidv4(),
              item: {
                e: e?.e,
                label: e?.label,
                value: e?.value,
              },
              unit: e?.e?.unit_name,
              quantity: e?.e?.quantity,
              sortIndex: index,
              price: e?.e?.price,
              discount: e?.e?.discount_percent,
              price_after_discount: +e?.e?.price * (1 - +e?.e?.discount_percent / 100),
              tax: {
                label: e?.e?.tax_name,
                value: e?.e?.tax_id,
                tax_rate: e?.e?.tax_rate
              },
              price_after_tax: (+e?.e?.price * e?.e?.quantity * (1 - +e?.e?.discount_percent / 100)) * (1 + e?.e?.tax_rate / 100),
              total_amount: (+e?.e?.price * (1 - +e?.e?.discount_percent / 100)) * (1 + (+e?.e?.tax_rate) / 100) * (+e?.e?.quantity),
              note: e?.e?.note_item,
              delivery_date: null
            })
          }).sort((a, b) => b.sortIndex - a.sortIndex)

          setOption([...newData])
        } else if (typeOrder === '1' && quote === null) {
          Toast.fire({
            icon: 'error',
            title: `Vui lòng chọn phiếu báo giá rồi mới chọn mặt hàng!`
          })
        }

      }
    }
  }

  const handleAddParent = (value) => {
    const checkData = option?.some(e => e?.item?.value === value?.value)
    if (!checkData) {
      if (typeOrder === '0') {
        const newData = {
          id: uuidv4(),
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
          delivery_date: null,
        }
        setOption([newData, ...option]);

      }
      if (typeOrder === '1' && quote !== null) {
        const newData = {
          id: uuidv4(),
          item: {
            e: value?.e,
            label: value?.label,
            value: value?.value,
          },
          unit: value?.e?.unit_name,
          quantity: value?.e?.quantity,
          price: value?.e?.price,
          discount: value?.e?.discount_percent,
          price_after_discount: +value?.e?.price * (1 - +value?.e?.discount_percent / 100),
          tax: {
            label: value?.e?.tax_name,
            value: value?.e?.tax_id,
            tax_rate: value?.e?.tax_rate
          },
          price_after_tax: (+value?.e?.price * value?.e?.quantity * (1 - +value?.e?.discount_percent / 100)) * (1 + value?.e?.tax_rate / 100),
          total_amount: (+value?.e?.price * (1 - +value?.e?.discount_percent / 100)) * (1 + (+value?.e?.tax_rate) / 100) * (+value?.e?.quantity),
          note: value?.e?.note_item,
          delivery_date: null
        }
        setOption([newData, ...option]);
      } else if (typeOrder === '1' && quote === null) {
        Toast.fire({
          icon: 'error',
          title: `Vui lòng chọn phiếu báo giá rồi mới chọn mặt hàng!`
        })
      }

    } else {
      Toast.fire({
        title: `${"Mặt hàng đã được chọn"}`,
        icon: 'error',
      })
    }
  }

  // change items 
  const handleOnChangeInputOption = (id, type, value) => {
    var index = option.findIndex(x => x.id === id);

    if (type == "unit") {
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
    else if (type == "clear_delivery_date") {
      option[index].delivery_date = null
      setDeliveryDate(null)
    }
    else if (type == "clearDeliveryDate") {
      setDeliveryDate(null)
      // option[index].delivery_date = null
    }

    setOption([...option])
  }
  const handleIncrease = (id) => {
    const index = option.findIndex((x) => x.id === id);
    const newQuantity = +option[index].quantity + 1;

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
  const _HandleDelete = (id, type) => {
    if (type === 'default') {
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

  const _HandleChangeValue = (parentId, value) => {
    const checkData = option?.some(e => e?.item?.value === value?.value)

    if (!checkData) {
      const newData = option?.map((e, index) => {
        if (e?.id === parentId) {
          return {
            ...e,
            id: uuidv4(),
            item: {
              e: value?.e,
              label: value?.label,
              value: value?.value,
            },
            unit: value.unit_name,
            quantity: 1,
            sortIndex: index,
            price: 1,
            discount: 0,
            price_after_discount: 1,
            tax: 0,
            price_after_tax: 1,
            total_amount: 1,
            note: "",
            delivery_date: null
          }
        }
        else {
          return e;
        }
      })
      setOption([...newData]);
    } else {
      Toast.fire({
        title: `${"Mặt hàng đã được chọn"}`,
        icon: 'error',
      })
    }
  }

  const taxOptions = [{ label: "Miễn thuế", value: "0", tax_rate: "0" }, ...dataTasxes]

  const tinhTongTien = (option) => {
    const totalPrice = option.reduce((acc, item) => {
      const totalPrice = item?.price * item?.quantity
      return acc + totalPrice
    }, 0);

    const totalDiscountPrice = option.reduce((acc, item) => {
      const totalDiscountPrice = item?.price * (item?.discount / 100) * item?.quantity;
      return acc + totalDiscountPrice;
    }, 0);

    const totalDiscountAfterPrice = option.reduce((acc, item) => {
      const tienSauCK = item?.quantity * item?.price_after_discount;
      return acc + tienSauCK;
    }, 0);

    const totalTax = option.reduce((acc, item) => {
      const totalTaxIem = item?.price_after_discount * (isNaN(item?.tax?.tax_rate) ? 0 : (item?.tax?.tax_rate / 100)) * item?.quantity;
      return acc + totalTaxIem;
    }, 0);

    const totalAmount = option.reduce((acc, item) => {
      const totalAmount = item?.total_amount
      return acc + totalAmount

    }, 0);
    return { totalPrice: totalPrice || 0, totalDiscountPrice: totalDiscountPrice || 0, totalDiscountAfterPrice: totalDiscountAfterPrice || 0, totalTax: totalTax || 0, totalAmount: totalAmount || 0 };
  };

  useEffect(() => {
    const totalPrice = tinhTongTien(option);
    setTongTienState(totalPrice);
  }, [option]);
  const dataOption = option?.map(e => {
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
    let deliveryDateInOption = option.some(e => e?.delivery_date === null)

    if (typeOrder === '0') {
      if (startDate == null || customer == null || branch == null || staff == null || deliveryDateInOption === true) {
        startDate == null && setErrDate(true)
        customer?.value == null && sErrCustomer(true)
        branch?.value == null && setErrBranch(true)
        staff?.value == null && setErrStaff(true)
        deliveryDateInOption === true && setErrDeliveryDate(true)
        // deliveryDate == null && setErrDeliveryDate(true)
        Toast.fire({
          icon: 'error',
          title: `${dataLang?.required_field_null}`
        })
      }
      else {
        setOnSending(true)
      }
    } else if (typeOrder === '1') {
      if (startDate == null || customer == null || branch == null || staff == null || deliveryDateInOption === true || quote == null) {
        startDate == null && setErrDate(true)
        customer?.value == null && sErrCustomer(true)
        branch?.value == null && setErrBranch(true)
        staff?.value == null && setErrStaff(true)
        deliveryDateInOption === true && setErrDeliveryDate(true)
        quote?.value == null && setErrQuote(true)
        // deliveryDate == null && setErrDeliveryDate(true)

        Toast.fire({
          icon: 'error',
          title: `${dataLang?.required_field_null}`
        })
      }
      else {
        setOnSending(true)
      }

    }
  }

  // handle submit
  const handleSubmit = () => {
    var formData = new FormData();
    formData.append("code", codeProduct)
    formData.append("date", (moment(startDate).format("YYYY-MM-DD HH:mm:ss")))
    formData.append("branch_id", branch?.value)
    formData.append("client_id", customer?.value)
    formData.append("person_contact_id", contactPerson?.value)
    formData.append("staff_id", staff?.value)
    formData.append("note", note)
    formData.append("quote_id", typeOrder === "1" ? quote?.value : "");


    newDataOption.forEach((item, index) => {

      formData.append(`items[${index}][item]`, item?.item != undefined ? item?.item : "");
      formData.append(`items[${index}][quantity]`, item?.quantity.toString());
      formData.append(`items[${index}][price]`, item?.price);
      formData.append(`items[${index}][discount_percent]`, item?.discount_percent);
      formData.append(`items[${index}][tax_id]`, item?.tax_id != undefined ? item?.tax_id : "");
      formData.append(`items[${index}][note]`, item?.note != undefined ? item?.note : "");
      formData.append(`items[${index}][delivery_date]`, item?.delivery_date != undefined ? (moment(item?.delivery_date).format("YYYY-MM-DD HH:mm:ss")) : "");
    });

    if (tongTienState?.totalPrice > 0 && tongTienState?.totalDiscountPrice >= 0 && tongTienState?.totalDiscountAfterPrice > 0 && tongTienState?.totalTax >= 0 && tongTienState?.totalAmount > 0) {
      Axios("POST", `${id ? `/api_web/Api_sale_order/saleOrder/${id}?csrf_protection=true` : "/api_web/Api_sale_order/saleOrder/?csrf_protection=true"}`, {
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      }, (err, response) => {
        console.log('response', response);

        if (response && response.data && response?.data?.isSuccess === true && router.isReady) {
          Toast.fire({
            icon: 'success',
            title: `${dataLang[response?.data?.message]}`
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
          setOption([])
          router.push('/sales_export_product/salesOrder?tab=all')
        }
        if (response && response.data && response?.data?.isSuccess === false) {
          Toast.fire({
            icon: 'error',
            title: `${dataLang[response?.data?.message]}`
          })
        }
        setOnSending(false)
      })
    } else {
      Toast.fire({
        icon: 'error',
        title: newDataOption?.length === 0 ? `Chưa chọn thông tin mặt hàng!` : 'Tiền không được âm, vui lòng kiểm tra lại thông tin mặt hàng!'
      })
      setOnSending(false)
    }

  }

  useEffect(() => {
    onSending && handleSubmit()
  }, [onSending]);

  const handleClearDate = (type, id,) => {
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

  // const optionsItem = dataItems?.map(e => ({ label: `${e.name} <span style={{display: none}}>${e.codeProduct}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`, value: e.id, e }))
  const allItems = [...options]

  const _HandleSelectAll = () => {
    if (typeOrder === '0') {
      const data = allItems?.map((e, index) => ({
        id: uuidv4(),
        item: {
          e: e?.e,
          label: e?.label,
          value: e?.value,
        },
        unit: e?.e?.unit_name,
        quantity: 1,
        sortIndex: index,
        price: 1,
        discount: 0,
        price_after_discount: 1,
        tax: 0,
        price_after_tax: 1,
        total_amount: 1,
        note: "",
        delivery_date: null
      }))

      setOption(data);
      //new
      setItemsAll(allItems?.map((e, index) => ({
        id: uuidv4(),
        item: {
          e: e?.e,
          label: e?.label,
          value: e?.value,
        },
        unit: e?.e?.unit_name,
        quantity: 1,
        sortIndex: index,
        price: 1,
        discount: 0,
        price_after_discount: 1,
        tax: 0,
        price_after_tax: 1,
        total_amount: 1,
        note: "",
        delivery_date: null
      })))
      setOption(allItems?.map((e, index) => ({
        id: uuidv4(),
        item: {
          e: e?.e,
          label: e?.label,
          value: e?.value,
        },
        unit: e?.e?.unit_name,
        quantity: 1,
        sortIndex: index,
        price: 1,
        discount: 0,
        price_after_discount: 1,
        tax: 0,
        price_after_tax: 1,
        total_amount: 1,
        note: "",
        delivery_date: null
      })))
    }
    if (typeOrder === '1' && quote !== null) {
      const data = allItems?.map((e, index) => ({
        id: uuidv4(),
        item: {
          e: e?.e,
          label: e?.label,
          value: e?.value,
        },
        unit: e?.e?.unit_name,
        quantity: 1,
        sortIndex: index,
        price: 1,
        discount: 0,
        price_after_discount: 1,
        tax: 0,
        price_after_tax: 1,
        total_amount: 1,
        note: "",
        delivery_date: null
      }))
      setOption(data);
      //new
      setItemsAll(allItems?.map((e, index) => ({
        id: uuidv4(),
        item: {
          e: e?.e,
          label: e?.label,
          value: e?.value,
        },
        unit: e?.e?.unit_name,
        quantity: e?.e?.quantity,
        price: e?.e?.price,
        discount: e?.e?.discount_percent,
        price_after_discount: +e?.e?.price * (1 - +e?.e?.discount_percent / 100),
        tax: {
          label: e?.e?.tax_name,
          value: e?.e?.tax_id,
          tax_rate: e?.e?.tax_rate
        },
        price_after_tax: (+e?.e?.price * e?.e?.quantity * (1 - +e?.e?.discount_percent / 100)) * (1 + e?.e?.tax_rate / 100),
        total_amount: (+e?.e?.price * (1 - +e?.e?.discount_percent / 100)) * (1 + (+e?.e?.tax_rate) / 100) * (+e?.e?.quantity),
        note: e?.e?.note_item,
        delivery_date: null
      })))
      setOption(allItems?.map((e, index) => ({
        id: uuidv4(),
        item: {
          e: e?.e,
          label: e?.label,
          value: e?.value,
        },
        unit: e?.e?.unit_name,
        quantity: e?.e?.quantity,
        price: e?.e?.price,
        discount: e?.e?.discount_percent,
        price_after_discount: +e?.e?.price * (1 - +e?.e?.discount_percent / 100),
        tax: {
          label: e?.e?.tax_name,
          value: e?.e?.tax_id,
          tax_rate: e?.e?.tax_rate
        },
        price_after_tax: (+e?.e?.price * e?.e?.quantity * (1 - +e?.e?.discount_percent / 100)) * (1 + e?.e?.tax_rate / 100),
        total_amount: (+e?.e?.price * (1 - +e?.e?.discount_percent / 100)) * (1 + (+e?.e?.tax_rate) / 100) * (+e?.e?.quantity),
        note: e?.e?.note_item,
        delivery_date: null
      })))

    } else if (typeOrder === '1' && quote === null) {
      Toast.fire({
        icon: 'error',
        title: `Vui lòng chọn phiếu báo giá rồi mới chọn mặt hàng!`
      })
    }
  };

  const _HandleDeleteAll = () => {
    setItemsAll([])
    setOption([])
    //new
  };

  const MenuList = (props) => {
    return (
      <components.MenuList {...props}>
        {
          allItems?.length > 0 &&
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

  const sortedArr = id ? option.sort((a, b) => a.id - b.id) : option.sort((a, b) => b.id - a.id);

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
                  {errBranch && <label className="text-sm text-red-500">{dataLang?.sales_product_err_branch || "sales_product_err_branch"}</label>}
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
                  {errCustomer && <label className="text-sm text-red-500">{dataLang?.sales_product_err_customer || "sales_product_err_customer"}</label>}
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
                      className={`${errQuote && quote === null ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                    {errQuote && quote === null && <label className="text-sm text-red-500">{dataLang?.sales_product_err_quote || "sales_product_err_quote"}</label>}
                  </div>
                )}

              </div>
            </div>
          </div>
          {/* fix */}
          {/* Thông tin mặt hàng */}
          <h2 className='font-normal bg-[#ECF0F4] p-2  '>{dataLang?.item_information || "item_information"}</h2>

          <div className='grid grid-cols-10'>
            <div div className='col-span-2 my-auto'>
              <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.import_click_items || "import_click_items"} </label>
              <Select
                onInputChange={_HandleSeachApi.bind(this)}
                options={typeOrder === "1" && quote === null ? [] : allItems}
                closeMenuOnSelect={false}
                onChange={(value) => handleOnChangeInput("itemAll", value)}
                value={itemsAll?.value ? itemsAll?.value : option?.map(e => e?.item)}
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
                      <>
                        {dataItems === [] ?
                          <Loading className="h-80" color="#0f4f9e" />
                          :
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
                        }
                      </>
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
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-center    font-[400]'>{dataLang?.sales_product_after_discount || "sales_product_after_discount"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]'>{dataLang?.sales_product_tax || "sales_product_tax"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-center    truncate font-[400]'>{dataLang?.sales_product_total_into_money || "sales_product_total_into_money"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-center truncate font-[400]'>{dataLang?.sales_product_item_date || "sales_product_item_date"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-center    truncate font-[400]'>{dataLang?.sales_product_note || "sales_product_note"}</h4>
              <h4 className='2xl:text-[12px] xl:text-[13px] text-[12.5px] px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]'>{dataLang?.sales_product_operations || "sales_product_operations"}</h4>
            </div>
          </div>
          {/* Thông tin mặt hàng Mặt hàng */}
          <div className='h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
            <div className='pr-2'>
              <React.Fragment>
                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                  {/* phân chia,m */}
                  <div className='grid grid-cols-12'>
                    <div className='col-span-2 '>
                      <Select
                        onInputChange={_HandleSeachApi.bind(this)}
                        dangerouslySetInnerHTML={{ __html: option.label }}
                        options={options}
                        onChange={(value) => handleAddParent(value)}
                        value={null}
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

                    <div className='grid col-span-10 grid-cols-10 gap-1 py-1 items-center'>

                      <div className='col-span-1 text-center flex items-center justify-center'>
                        <h3 className={`cursor-default 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}>

                        </h3>
                      </div>
                      <div className='col-span-1 flex items-center justify-center'>
                        <button
                          disabled={true}
                          className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                        >
                          <Minus size="16" />
                        </button>
                        <NumericFormat
                          className={`cursor-default appearance-none text-center 2xl:text-[12px] xl:text-[13px] text-[12.5px] py-2 px-0.5 font-normal 2xl:w-24 xl:w-[90px] w-[63px]  focus:outline-none border-b-2 border-gray-200`}
                          value={1}
                          thousandSeparator=","
                          allowNegative={false}
                          readOnly={true}
                          decimalScale={0}
                          isNumericString={true}
                          isAllowed={(values) => { const { floatValue } = values; return floatValue > 0 }}
                        />
                        <button
                          disabled={true}
                          className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                        >
                          <Add size="16" />
                        </button>
                      </div>
                      <div className='col-span-1 text-center flex items-center justify-center'>
                        <NumericFormat
                          value={1}
                          allowNegative={false}
                          readOnly={true}
                          decimalScale={0}
                          isNumericString={true}
                          className={`cursor-default appearance-none 2xl:text-[12px] xl:text-[13px] text-[12.5px] text-center py-1 px-2 font-normal w-[80%] focus:outline-none border-b-2 border-gray-200`}
                          thousandSeparator=","
                        />
                      </div>
                      <div className='col-span-1 text-center flex items-center justify-center'>
                        <NumericFormat
                          value={0}
                          className={`cursor-default appearance-none text-center py-1 px-2 font-normal w-[80%]  focus:outline-none border-b-2 2xl:text-[12px] xl:text-[13px] text-[12.5px] border-gray-200`}
                          thousandSeparator=","
                          allowNegative={false}
                          readOnly={true}
                          isNumericString={true}
                        />
                      </div>
                      <div className='col-span-1 text-right flex items-center justify-end'>
                        <h3 className={`cursor-default px-2 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}>
                          1
                        </h3>
                      </div>
                      <div className='col-span-1 flex justify-center items-center'>
                        <Select
                          options={taxOptions}
                          value={null}
                          placeholder={"% Thuế"}
                          isDisabled={true}
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
                        <h3 className={`cursor-default px-2 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}>
                          1
                        </h3>
                      </div>
                      <div className='col-span-1 '>
                        <div className="custom-date-picker flex flex-row relative">
                          <DatePicker
                            selected={null}
                            blur
                            disabled={true}
                            placeholderText="DD/MM/YYYY"
                            dateFormat="dd/MM/yyyy"
                            className={`bg-gray-100 3xl:h-10 h-10 w-full 3xl:text-[12px] 2xl:text-[10px] xl:text-[14px] lg:text-[14px] border placeholder:text-slate-300 rounded text-[#52575E] font-normal px-2 outline-none cursor-default `}
                          />
                          <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%]  text-[#CCCCCC] scale-110 cursor-default" />
                        </div>
                      </div>
                      <div className='col-span-1 flex items-center justify-center'>
                        <input
                          value={null}
                          name="optionEmail"
                          placeholder='Ghi chú'
                          disabled={true}
                          type="text"
                          className="focus:border-[#92BFF7] border-[#d0d5dd] h-10 2xl:text-[12px] xl:text-[13px] text-[12.5px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none"
                        />
                      </div>
                      <div className='col-span-1 flex items-center justify-center'>
                        <button
                          onClick={() => _HandleDelete('default', 'default')}
                          type='button' title='Xóa' className='transition  w-full bg-slate-100 h-10 rounded-[5.5px] text-red-500 flex flex-col justify-center items-center mb-2'><IconDelete /></button>
                      </div>
                    </div>

                  </div>

                  {/* phân chia  */}
                  {sortedArr.map((e, index) =>
                    <div className='grid grid-cols-12 gap-1 py-1 items-center' key={e?.id}>
                      <div className='col-span-2 '>
                        <Select
                          onInputChange={_HandleSeachApi.bind(this)}
                          dangerouslySetInnerHTML={{ __html: option.label }}
                          options={options}
                          onChange={(value) => _HandleChangeValue(e?.id, value)}
                          value={e?.item}
                          components={{ MenuList, MultiValue }}
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
                        <h3 className={`'cursor-text 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}>
                          {e?.unit}
                        </h3>
                      </div>
                      <div className='col-span-1 flex items-center justify-center'>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleDecrease(e?.id)}
                            className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                          >
                            <Minus size="16" />
                          </button>
                          <NumericFormat
                            className={`cursor-text appearance-none text-center 2xl:text-[12px] xl:text-[13px] text-[12.5px] py-2 px-0.5 font-normal 2xl:w-24 xl:w-[90px] w-[63px]  focus:outline-none border-b-2 border-gray-200`}
                            onValueChange={(value) => handleOnChangeInputOption(e?.id, "quantity", value)}
                            value={e?.quantity || 1}
                            thousandSeparator=","
                            allowNegative={false}
                            decimalScale={0}
                            isNumericString={true}
                            isAllowed={(values) => { const { floatValue } = values; return floatValue > 0 }}
                          />
                          <button
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
                          decimalScale={0}
                          isNumericString={true}
                          className={`cursor-text appearance-none 2xl:text-[12px] xl:text-[13px] text-[12.5px] text-center py-1 px-2 font-normal w-[80%] focus:outline-none border-b-2 border-gray-200`}
                          thousandSeparator=","
                        />
                      </div>
                      <div className='col-span-1 text-center flex items-center justify-center'>
                        <NumericFormat
                          value={e?.discount}
                          onValueChange={(value) => handleOnChangeInputOption(e?.id, "discount", value)}
                          className={`cursor-text appearance-none text-center py-1 px-2 font-normal w-[80%]  focus:outline-none border-b-2 2xl:text-[12px] xl:text-[13px] text-[12.5px] border-gray-200`}
                          thousandSeparator=","
                          allowNegative={false}
                          isAllowed={(values) => {
                            if (!values.value) return true;
                            const { floatValue } = values;
                            if (floatValue > 101) {
                              Toast.fire({
                                icon: 'error',
                                title: `Vui lòng nhập số % chiết khấu nhỏ hơn 101`
                              })
                            }
                            return floatValue < 101;
                          }}
                          // decimalScale={0}
                          isNumericString={true}
                        />
                      </div>
                      <div className='col-span-1 text-right flex items-center justify-end'>
                        <h3 className={`cursor-text px-2 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}>{formatNumber(e?.price_after_discount)}</h3>
                      </div>
                      <div className='col-span-1 flex justify-center items-center'>
                        <Select
                          options={taxOptions}
                          onChange={(value) => handleOnChangeInputOption(e?.id, "tax", value)}
                          value={
                            e?.tax ?
                              {
                                label: taxOptions.find(item => item.value === e?.tax?.value)?.label,
                                value: e?.tax?.value,
                                tax_rate: e?.tax?.tax_rate
                              }
                              :
                              null
                          }
                          placeholder={"% Thuế"}
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
                        <h3 className={`cursor-text px-2 2xl:text-[12px] xl:text-[13px] text-[12.5px]`}>{formatNumber(e?.total_amount)}</h3>
                      </div>
                      <div className='col-span-1 '>
                        <div className="custom-date-picker flex flex-row relative">
                          <DatePicker
                            selected={(e?.delivery_date ? e?.delivery_date : null)}
                            // selected={(index !== 0 && e?.delivery_date ? e?.delivery_date : null) || (index !== 0 && deliveryDate ? deliveryDate : null)}
                            blur
                            placeholderText="DD/MM/YYYY"
                            dateFormat="dd/MM/yyyy"
                            onSelect={(date) => handleOnChangeInputOption(e?.id, "delivery_date", date)}
                            onChange={(date) => handleOnChangeInputOption(e?.id, "delivery_date", date)}
                            // className={`${errDeliveryDate && index !== 0 ? "border-red-500 " : "focus:border-[#92BFF7] border-[#d0d5dd]"} 3xl:h-10 h-10 w-full 3xl:text-[12px] 2xl:text-[14px] xl:text-[14px] lg:text-[14px] border placeholder:text-slate-300 bg-[#ffffff] rounded text-[#52575E] font-normal px-2 outline-none cursor-pointer `}
                            className={`${(errDeliveryDate && e?.delivery_date === null) ? 'border-red-500' : 'focus:border-[#92BFF7] border-[#d0d5dd]'} 3xl:h-10 h-10 w-full 3xl:text-[12px] 2xl:text-[10px] xl:text-[14px] lg:text-[14px] border placeholder:text-slate-300 bg-[#ffffff] rounded text-[#52575E] font-normal px-2 outline-none cursor-pointer `}
                          />
                          {e?.delivery_date && (
                            <>
                              <MdClear
                                className="absolute right-0 3xl:-translate-x-[320%] 3xl:translate-y-[1%] lg:-translate-x-[200%] lg:translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] 3xl:scale-110 lg:scale-90 cursor-pointer"
                                onClick={() => handleOnChangeInputOption(e?.id, 'clear_delivery_date')}
                              />
                            </>
                          )}
                          <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%]  text-[#CCCCCC] scale-110 cursor-pointer" />
                        </div>
                        {(errDeliveryDate && e?.delivery_date === null) && <label className="text-[12px] max-w-10px text-red-500">Vui lòng chọn ngày cần hàng!</label>}
                      </div>
                      <div className='col-span-1 flex items-center justify-center'>
                        <input
                          value={e?.note}
                          onChange={(value) => handleOnChangeInputOption(e?.id, "note", value)}
                          name="optionEmail"
                          placeholder='Ghi chú'
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
                  isAllowed={(values) => {
                    if (!values.value) return true;
                    const { floatValue } = values;
                    if (floatValue > 101) {
                      Toast.fire({
                        icon: 'error',
                        title: `Vui lòng nhập số % chiết khấu nhỏ hơn 101`
                      })
                    }
                    return floatValue < 101;
                  }}
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
                value={totalTax ? '' : ''}
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
                    <MdClear
                      className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                      onClick={() => handleOnChangeInputOption('_', 'clearDeliveryDate')}
                    />
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
              <div className='font-normal'><h3>{dataLang?.sales_product_total_tax || "sales_product_total_tax"}</h3></div>
              <div className='font-normal'><h3 className='text-blue-600'>{formatNumber(tongTienState.totalTax)}</h3></div>
            </div>
            <div className='flex justify-between '>
              <div className='font-normal'><h3>{dataLang?.sales_product_total_into_money || "sales_product_total_into_money"}</h3></div>
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
    // <div style={style} title={title}>{label}</div>
    <div style={style} title={title}>+ {length}</div>
  );
};

const MultiValue = ({ index, getValue, ...props }) => {
  const maxToShow = 0;

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