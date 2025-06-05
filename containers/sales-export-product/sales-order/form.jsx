import apiSalesOrder from '@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder'
//import ButtonBack from '@/components/UI/button/buttonBack'
//import ButtonSubmit from '@/components/UI/button/buttonSubmit'
import { EmptyExprired } from '@/components/UI/common/EmptyExprired'
import { Container } from '@/components/UI/common/layout'
import SelectComponent from '@/components/UI/filterComponents/selectComponent'
import InPutMoneyFormat from '@/components/UI/inputNumericFormat/inputMoneyFormat'
import InPutNumericFormat from '@/components/UI/inputNumericFormat/inputNumericFormat'
//import Loading from '@/components/UI/loading/loading'
import MultiValue from '@/components/UI/mutiValue/multiValue'
import PopupConfim from '@/components/UI/popupConfim/popupConfim'
import { optionsQuery } from '@/configs/optionsQuery'
import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from '@/constants/delete/deleteItems'
import { FORMAT_MOMENT } from '@/constants/formatDate/formatDate'
import { useBranchList } from '@/hooks/common/useBranch'
import { useContactCombobox } from '@/hooks/common/useContacts'
import useSetingServer from '@/hooks/useConfigNumber'
import useStatusExprired from '@/hooks/useStatusExprired'
import useToast from '@/hooks/useToast'
import { useToggle } from '@/hooks/useToggle'
import { routerSalesOrder } from '@/routers/sellingGoods'
import { isAllowedDiscount, isAllowedNumber } from '@/utils/helpers/common'
import { formatMoment } from '@/utils/helpers/formatMoment'
import formatMoneyConfig from '@/utils/helpers/formatMoney'
import formatNumberConfig from '@/utils/helpers/formatnumber'
import { useQuery } from '@tanstack/react-query'
import { Add, Trash as IconDelete, Minus, SearchNormal1, ArrowDown2, ArrowUp2 } from 'iconsax-react'
import { debounce } from 'lodash'
import moment from 'moment'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
//import DatePicker from 'react-datepicker'
import { BsCalendarEvent } from 'react-icons/bs'
import { LuBriefcase } from 'react-icons/lu'
import { PiMapPinLight } from 'react-icons/pi'
import { FiUser } from 'react-icons/fi'
import { MdClear } from 'react-icons/md'
import { components } from 'react-select'
import { v4 as uuidv4 } from 'uuid'
import { useSalesOrderQuotaByBranch } from './hooks/useSalesOrderQuotaByBranch'
import { useClientComboboxByBranch } from '@/hooks/common/useClients'
import { useStaffComboboxByBranch } from '@/hooks/common/useStaffs'
import { useTaxList } from '@/hooks/common/useTaxs'
import { Customscrollbar } from '@/components/UI/common/Customscrollbar'
import Breadcrumb from '@/components/UI/breadcrumb/BreadcrumbCustom'

// Optimize UI
import { motion, AnimatePresence } from 'framer-motion'
import NotFoundData from './notfound'
import { Button, DatePicker, ConfigProvider } from 'antd'
import SelectWithSort from '@/components/common/select/SelectWithSort'
import SelectBySearch from '@/components/common/select/SelectBySearch'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import viVN from 'antd/lib/locale/vi_VN'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
dayjs.locale('vi')

// const disabledDate = (current) => {
//   return current && current < dayjs().endOf('day')
// }

const SalesOrderForm = (props) => {
  // State
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [selectedPersonalContact, setSelectedPersonalContact] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [flagStateChange, setFlagStateChange] = useState(false)
  const authState = useSelector((state) => state.auth)

  // Data Fetching
  const { data: dataBranch = [] } = useBranchList()
  const { data: dataStaffs = [] } = useStaffComboboxByBranch({
    branch_id: selectedBranch != null ? [+selectedBranch]?.map((e) => e) : null,
  })
  const { data: dataPersonContact = [] } = useContactCombobox({
    client_id: selectedCustomer != null ? selectedCustomer : null,
  })
  const { data: dataCustomer = [] } = useClientComboboxByBranch({
    search: '',
    branch_id: selectedBranch !== null ? [selectedBranch]?.map((e) => e) : null,
  })

  // Gán chi nhánh đầu tiên vào state selectedBranch khi render
  useEffect(() => {
    if (dataBranch.length > 0 && dataBranch[0]?.value) setSelectedBranch(dataBranch[0].value)
  }, [dataBranch])

  // Gán nhân viên theo staff_id từ authState lọc từ mảng dataStaffs
  useEffect(() => {
    if (dataStaffs.length > 0 && authState?.staff_id) {
      const staff = dataStaffs.find((e) => e.value === authState?.staff_id)
      setSelectedStaff(staff?.value)
    }
  }, [dataStaffs, authState?.staff_id])

  // Reset state của ô "khách hàng, nhân viên, người liên lạc" khi ô "chi nhánh" thay đổi, để đổ dữ liệu mới (khi có)
  useEffect(() => {
    if (selectedBranch === undefined) {
      setFlagStateChange(true)
    } else {
      setFlagStateChange(false)
    }
    setSelectedCustomer(null)
    setSelectedStaff(null)
    setSelectedPersonalContact(null)
  }, [selectedBranch])

  // Reset state của ô "người liên lạc" khi ô "khách hàng" thay đổi, để đổ dữ liệu mới (khi có)
  useEffect(() => {
    setSelectedPersonalContact(null)
  }, [selectedCustomer])

  // Tab items
  const tabItems = [
    {
      key: 'info',
      label: 'Thông tin chung',
      //children: <div>Thông tin chung content</div>,
    },
    {
      key: 'note',
      label: 'Ghi chú',
      //children: <div>Ghi chú content</div>,
    },
  ]

  // handle chọn tab
  const handleTabClick = (key) => {
    setActiveTab(key)
  }

  // End Optimize UI

  const router = useRouter()

  const isShow = useToast()

  const dataSeting = useSetingServer()

  const id = router.query?.id

  const dataLang = props?.dataLang

  const { isOpen, isId, isIdChild: status, handleQueryId } = useToggle()

  const [onFetchingItemsAll, setOnFetchingItemsAll] = useState(false)

  const [onFetchingItem, setOnFetchingItem] = useState(false)

  const [onSending, setOnSending] = useState(false)

  const [option, setOption] = useState([])

  const [dataItems, setDataItems] = useState([])

  const statusExprired = useStatusExprired()

  const [note, setNote] = useState('')

  const [codeProduct, setCodeProduct] = useState('')

  const [totalTax, setTotalTax] = useState()

  const [totalDiscount, setTotalDiscount] = useState(0)

  const [startDate, setStartDate] = useState(dayjs())

  const [deliveryDate, setDeliveryDate] = useState(null)

  const [customer, setCustomer] = useState(null)

  const [contactPerson, setContactPerson] = useState(null)

  const [staff, setStaff] = useState(null)

  const [quote, setQuote] = useState(null)

  const [branch, setBranch] = useState(null)

  const [errDate, setErrDate] = useState(false)

  const [errCustomer, sErrCustomer] = useState(false)

  const [errStaff, setErrStaff] = useState(false)

  const [errQuote, setErrQuote] = useState(false)

  const [errDeliveryDate, setErrDeliveryDate] = useState(false)

  const [errBranch, setErrBranch] = useState(false)

  const [hidden, setHidden] = useState(false)

  const [typeOrder, setTypeOrder] = useState('0')

  const [itemsAll, setItemsAll] = useState([])

  const [isTotalMoney, setIsTotalMoney] = useState({
    totalPrice: 0,
    totalDiscountPrice: 0,
    totalDiscountAfterPrice: 0,
    totalTax: 0,
    totalAmount: 0,
  })

  const params = {
    'filter[branch_id]': selectedBranch !== null ? +selectedBranch : null,
    'filter[client_id]': selectedCustomer !== null ? +selectedCustomer : null,
  }

  const { data: dataTasxes = [] } = useTaxList()

  const { data: dataQuotes, refetch: refetchQuote } = useSalesOrderQuotaByBranch(params)

  // const { data: dataCustomer = [] } = useClientComboboxByBranch({ search: "", branch_id: branch !== null ? [branch?.value]?.map((e) => e) : null, });

  useEffect(() => {
    router.query && setErrDate(false)
    router.query && sErrCustomer(false)
    router.query && setErrStaff(false)
    router.query && setErrDeliveryDate(false)
    router.query && setErrBranch(false)
    router.query && setStartDate(dayjs())
    router.query && setDeliveryDate(null)
    router.query && setNote('')
  }, [id, router.query])

  // Fetch edit
  useQuery({
    queryKey: ['api_detail_sale_order', id],
    queryFn: async () => {
      const rResult = await apiSalesOrder.apiDetail(id)
      const items = rResult?.items?.map((e) => ({
        price_quote_order_item_id: e?.id,
        id: e.id,
        item: {
          e: e?.item,
          label: `${e.item?.item_name} <span style={{display: none}}>${
            e.item?.code + e.item?.product_variation + e.item?.text_type + e.item?.unit_name
          }</span>`,
          value: e.item?.id,
        },
        quantity: +e?.quantity,
        price: +e?.price,
        discount: +e?.discount_percent,
        tax: { tax_rate: e?.tax_rate, value: e?.tax_id },
        unit: e.item?.unit_name,
        price_after_discount: +e?.price_after_discount,
        note: e?.note,
        total_amount: +e?.price_after_discount * (1 + +e?.tax_rate / 100) * +e?.quantity,
        delivery_date: moment(e?.delivery_date).toDate(),
      }))

      setOption(items)
      setCodeProduct(rResult?.code)
      setContactPerson(
        rResult?.contact_name !== null && rResult?.contact_name !== '0'
          ? { label: rResult?.contact_name, value: rResult?.contact_id }
          : null
      )
      setBranch({ label: rResult?.branch_name, value: rResult?.branch_id })
      setStaff({ label: rResult?.staff_name, value: rResult?.staff_id })
      setCustomer({ label: rResult?.client_name, value: rResult?.client_id })
      setStartDate(moment(rResult?.date).toDate())
      setNote(rResult?.note)

      if (rResult?.quote_id !== '0' && rResult?.quote_code !== null) {
        setTypeOrder('1')
        // setHidden(true);
        // setQuote({ label: rResult?.quote_code, value: rResult?.quote_id, });
      }
      return rResult
    },
    ...optionsQuery,
    enabled: !!id,
  })

  // fetch items
  const handleFetchingItemsAll = async () => {
    let form = new FormData()

    if (selectedBranch != null) {
      ;[+selectedBranch].forEach((e, index) => form.append(`branch_id[${index}]`, e))
    }
    try {
      const {
        data: { result },
      } = await apiSalesOrder.apiItems(form)

      setDataItems(result)

      setOnFetchingItemsAll(false)
    } catch (error) {}
  }

  const handleFetchingItem = async () => {
    let form = new FormData()
    if (selectedBranch != null) {
      ;[+selectedBranch].forEach((e, index) => form.append(`branch_id[${index}]`, e))
    }
    if (typeOrder === '1') {
      if (quote && quote.value !== null) {
        try {
          const {
            data: { result },
          } = await apiSalesOrder.apiQuotaItems({
            params: {
              'filter[quote_id]': quote !== null ? +quote?.value : null,
            },
          })
          setDataItems(result)

          setOnFetchingItem(false)
        } catch (error) {}
      } else {
        try {
          const {
            data: { result },
          } = await apiSalesOrder.apiItems(form)

          setDataItems(result)

          setOnFetchingItem(false)
        } catch (error) {}
      }
    } else if (typeOrder === '0') {
      try {
        const {
          data: { result },
        } = await apiSalesOrder.apiItems(form)

        setDataItems(result)

        setOnFetchingItem(false)
      } catch (error) {}
    }
  }

  const options = dataItems?.map((e) => {
    return {
      label: `${e.name} <span style={{display: none}}>${e.code}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
      value: e.id,
      e,
    }
  })

  // tổng thay đổi
  useEffect(() => {
    if (totalTax == null) return
    setOption((prevOption) => {
      const newOption = [...prevOption]
      const thueValue = totalTax?.tax_rate || 0
      const chietKhauValue = totalDiscount || 0
      newOption.forEach((item) => {
        const dongiasauchietkhau = item?.price * (1 - chietKhauValue / 100)
        const thanhTien = dongiasauchietkhau * (1 + thueValue / 100) * item.quantity
        item.tax = totalTax
        item.total_amount = isNaN(thanhTien) ? 0 : thanhTien
      })
      return newOption
    })
  }, [totalTax])

  useEffect(() => {
    if (deliveryDate == null) return
    setOption((prevOption) => {
      const newOption = [...prevOption]

      newOption.forEach((item) => {
        item.delivery_date = deliveryDate || null
      })
      return newOption
    })
  }, [deliveryDate])

  useEffect(() => {
    if (totalDiscount == null) return
    setOption((prevOption) => {
      const newOption = [...prevOption]
      const thueValue = totalTax?.tax_rate != undefined ? totalTax?.tax_rate : 0
      const chietKhauValue = totalDiscount ? totalDiscount : 0

      newOption.forEach((item) => {
        const dongiasauchietkhau = item?.price * (1 - chietKhauValue / 100)
        const thanhTien = dongiasauchietkhau * (1 + thueValue / 100) * item.quantity
        item.tax = totalTax
        item.discount = Number(totalDiscount)
        item.price_after_discount = isNaN(dongiasauchietkhau) ? 0 : dongiasauchietkhau
        item.total_amount = isNaN(thanhTien) ? 0 : thanhTien
      })
      return newOption
    })
  }, [totalDiscount])

  useEffect(() => {
    setCustomer(null) || setContactPerson(null) || setStaff(null)
  }, [])

  useEffect(() => {
    selectedBranch !== null && setOnFetchingItemsAll(true)
    selectedBranch == null && setItemsAll([])
  }, [selectedBranch])

  useEffect(() => {
    quote !== null && setOnFetchingItem(true)
  }, [quote])

  useEffect(() => {
    onFetchingItemsAll && handleFetchingItemsAll()
  }, [onFetchingItemsAll])

  useEffect(() => {
    onFetchingItem && handleFetchingItem()
  }, [onFetchingItem])

  useEffect(() => {
    setErrDate(false)
  }, [startDate != null])

  useEffect(() => {
    sErrCustomer(false)
  }, [customer != null])

  useEffect(() => {
    setErrDeliveryDate(false)
  }, [deliveryDate != null])

  useEffect(() => {
    setErrBranch(false)
  }, [branch != null])

  useEffect(() => {
    setErrStaff(false)
  }, [staff != null])

  // search api
  const _HandleSeachApi = debounce(async (inputValue) => {
    if (selectedBranch == null) return

    let form = new FormData()

    if (selectedBranch != null) {
      ;[+selectedBranch].forEach((e, index) => form.append(`branch_id[${index}]`, e))
    }

    form.append('term', inputValue)

    if (typeOrder === '1' && quote && +quote.value) {
      const {
        data: { result },
      } = await apiSalesOrder.apiQuotaItems({
        data: {
          term: inputValue,
        },
        params: {
          'filter[quote_id]': quote ? +quote?.value : null,
        },
      })
      setDataItems(result)
    }
    if (typeOrder === '0') {
      const {
        data: { result },
      } = await apiSalesOrder.apiItems(form)
      setDataItems(result)
    }
  }, 500)

  // format number
  const formatNumber = (number) => {
    return formatNumberConfig(+number, dataSeting)
  }

  const formatMoney = (number) => {
    return formatMoneyConfig(+number, dataSeting)
  }

  const resetValue = () => {
    if (status == 'customer') {
      setCustomer(isId)
      setContactPerson(null)
      // setQuote(null);
      setOption([])

      setOnFetchingItem(true)
    }
    if (status == 'branch') {
      setBranch(isId)
      setOption([])
      setCustomer(null)
      setContactPerson(null)
      setStaff(null)
      // setQuote(null);
    }
    if (status == 'typeOrder') {
      setTypeOrder(isId)
      // setHidden(isId === "1");
      // setQuote(isId === "0" ? null : quote);
      isId == 1 && refetchQuote()
      setOnFetchingItem(isId === '0' && true)
      setOnFetchingItemsAll(isId === '1' && true)

      // setDataItems([])
      setTotalTax('')
      setTotalDiscount('')
      setOption([])
    }
    if (status == 'quote') {
      // setQuote(isId);
      setOption([])
      setOnFetchingItemsAll(true)
      setOnFetchingItem(true)
    }
    handleQueryId({ status: false })
  }

  // onChange
  const handleOnChangeInput = (type, value) => {
    if (type === 'codeProduct') {
      setCodeProduct(value.target.value)
    } else if (type === 'customer') {
      if (option?.length >= 1) {
        handleQueryId({ status: true, id: value, idChild: type })
      } else {
        setCustomer(value)
        setContactPerson(null)
        // setQuote(null);
      }
    } else if (type === 'branch') {
      if (option?.length >= 1) {
        handleQueryId({ status: true, id: value, idChild: type })
      } else if (value !== branch) {
        setBranch(value)
        setCustomer(null)
        setContactPerson(null)
        setStaff(null)
        // setQuote(null);
        setOption([])
      }
    } else if (type === 'contactPerson') {
      setContactPerson(value)
    } else if (type === 'staff') {
      setStaff(value)
    } else if (type === 'typeOrder') {
      handleQueryId({ status: true, idChild: type, id: value.target.value })
    } else if (type === 'quote') {
      if (option?.length >= 1) {
        handleQueryId({ status: true, idChild: type, id: value })
      } else {
        // setQuote(value);
        setOnFetchingItem(true)
      }
    } else if (type === 'note') {
      setNote(value.target.value)
    } else if (type === 'total_tax') {
      setTotalTax(value)
    } else if (type === 'total_delivery_date') {
      setDeliveryDate(value)
    } else if (type === 'totaldiscount') {
      setTotalDiscount(value?.value)
    } else if (type == 'itemAll') {
      setItemsAll(value)
      if (value?.length === 0) {
        // setOption([{id: Date.now(), item: null}])
        //new
        setOption([])
      } else if (value?.length > 0) {
        if (typeOrder === '0') {
          const newData = value?.map((e, index) => {
            const check = option?.find((x) => x?.item?.e?.id == e?.e?.id)
            if (check) {
              return check
            }

            let money = 0
            if (e.e?.tax?.tax_rate == undefined) {
              money = Number(1) * (1 + Number(0) / 100) * Number(e?.e?.quantity)
            } else {
              money = Number(e?.e?.affterDiscount) * (1 + Number(e?.e?.tax?.tax_rate) / 100) * Number(e?.e?.quantity)
            }

            return {
              id: uuidv4(),
              item: {
                e: e?.e,
                label: e?.label,
                value: e?.value,
              },
              unit: e?.e?.unit_name,
              quantity: 1,
              sortIndex: index,
              price: e?.e?.price_sell,
              discount: 0,
              price_after_discount: 1,
              tax: 0,
              price_after_tax: 1,
              total_amount: Number(money.toFixed(2)),
              note: '',
              delivery_date: null,
            }
          })
          setOption([...newData])
        }
        if (typeOrder === '1' && quote !== null) {
          const newData = value
            ?.map((e, index) => {
              return {
                id: uuidv4(),
                item: {
                  e: e?.e,
                  label: e?.label,
                  value: e?.value,
                },
                unit: e?.e?.unit_name,
                quantity: e?.e?.quantity,
                sortIndex: index,
                price: e?.e?.price_sell,
                discount: e?.e?.discount_percent,
                price_after_discount: +e?.e?.price_sell * (1 - +e?.e?.discount_percent / 100),
                tax: {
                  label: e?.e?.tax_name,
                  value: e?.e?.tax_id,
                  tax_rate: e?.e?.tax_rate,
                },
                price_after_tax:
                  +e?.e?.price_sell * e?.e?.quantity * (1 - +e?.e?.discount_percent / 100) * (1 + e?.e?.tax_rate / 100),
                total_amount:
                  +e?.e?.price_sell *
                  (1 - +e?.e?.discount_percent / 100) *
                  (1 + +e?.e?.tax_rate / 100) *
                  +e?.e?.quantity,
                note: e?.e?.note_item,
                delivery_date: null,
              }
            })
            .sort((a, b) => b.sortIndex - a.sortIndex)

          setOption([...newData])
        } else if (typeOrder === '1' && quote === null) {
          isShow('error', `Vui lòng chọn phiếu báo giá rồi mới chọn mặt hàng !`)
        }
      }
    }
  }

  const handleAddParent = (value) => {
    const checkData = option?.some((e) => e?.item?.value === value?.value)
    if (!checkData) {
      let money = 0
      if (value.e?.tax?.tax_rate == undefined) {
        money = Number(1) * (1 + Number(0) / 100) * Number(value?.e?.quantity)
      } else {
        money =
          Number(value?.e?.affterDiscount) * (1 + Number(value?.e?.tax?.tax_rate) / 100) * Number(value?.e?.quantity)
      }
      if (typeOrder === '0') {
        const newData = {
          id: uuidv4(),
          item: value,
          unit: value?.e?.unit_name,
          quantity: 1,
          price: value?.e?.price_sell,
          discount: totalDiscount ? totalDiscount : 0,
          price_after_discount: 1,
          tax: null,
          price_after_tax: 1,
          total_amount: Number(money.toFixed(2)),
          note: '',
          delivery_date: null,
        }
        setOption([newData, ...option])
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
          price: value?.e?.price_sell,
          discount: value?.e?.discount_percent,
          price_after_discount: +value?.e?.price_sell * (1 - +value?.e?.discount_percent / 100),
          tax: {
            label: value?.e?.tax_name,
            value: value?.e?.tax_id,
            tax_rate: value?.e?.tax_rate,
          },
          price_after_tax:
            +value?.e?.price_sell *
            value?.e?.quantity *
            (1 - +value?.e?.discount_percent / 100) *
            (1 + value?.e?.tax_rate / 100),
          total_amount:
            +value?.e?.price_sell *
            (1 - +value?.e?.discount_percent / 100) *
            (1 + +value?.e?.tax_rate / 100) *
            +value?.e?.quantity,
          note: value?.e?.note_item,
          delivery_date: null,
        }
        setOption([newData, ...option])
      } else if (typeOrder === '1' && quote === null) {
        isShow('error', `Vui lòng chọn phiếu báo giá rồi mới chọn mặt hàng !`)
      }
    } else {
      isShow('error', `Mặt hàng đã được chọn`)
    }
  }

  // change items
  const handleOnChangeInputOption = (id, type, value) => {
    var index = option.findIndex((x) => x.id === id)

    if (type == 'unit') {
      option[index].unit = value.target?.value
    } else if (type === 'quantity') {
      option[index].quantity = Number(value?.value)
      if (option[index].tax?.tax_rate == undefined) {
        const tien = Number(option[index].price_after_discount) * (1 + Number(0) / 100) * Number(option[index].quantity)
        option[index].total_amount = Number(tien.toFixed(2))
      } else {
        const tien =
          Number(option[index].price_after_discount) *
          (1 + Number(option[index].tax?.tax_rate) / 100) *
          Number(option[index].quantity)
        option[index].total_amount = Number(tien.toFixed(2))
      }
      setOption([...option])
    } else if (type == 'price') {
      option[index].price = Number(value.value)
      option[index].price_after_discount = +option[index].price * (1 - option[index].discount / 100)
      option[index].price_after_discount = +(Math.round(option[index].price_after_discount + 'e+2') + 'e-2')
      if (option[index].tax?.tax_rate == undefined) {
        const tien = Number(option[index].price_after_discount) * (1 + Number(0) / 100) * Number(option[index].quantity)
        option[index].total_amount = Number(tien.toFixed(2))
      } else {
        const tien =
          Number(option[index].price_after_discount) *
          (1 + Number(option[index].tax?.tax_rate) / 100) *
          Number(option[index].quantity)
        option[index].total_amount = Number(tien.toFixed(2))
      }
    } else if (type == 'discount') {
      option[index].discount = Number(value.value)
      option[index].price_after_discount = +option[index].price * (1 - option[index].discount / 100)
      option[index].price_after_discount = +(Math.round(option[index].price_after_discount + 'e+2') + 'e-2')
      if (option[index].tax?.tax_rate == undefined) {
        const tien = Number(option[index].price_after_discount) * (1 + Number(0) / 100) * Number(option[index].quantity)
        option[index].total_amount = Number(tien.toFixed(2))
      } else {
        const tien =
          Number(option[index].price_after_discount) *
          (1 + Number(option[index].tax?.tax_rate) / 100) *
          Number(option[index].quantity)
        option[index].total_amount = Number(tien.toFixed(2))
      }
    } else if (type == 'tax') {
      option[index].tax = value
      if (option[index].tax?.tax_rate == undefined) {
        const tien = Number(option[index].price_after_discount) * (1 + Number(0) / 100) * Number(option[index].quantity)
        option[index].total_amount = Number(tien.toFixed(2))
      } else {
        const tien =
          Number(option[index].price_after_discount) *
          (1 + Number(option[index].tax?.tax_rate) / 100) *
          Number(option[index].quantity)
        option[index].total_amount = Number(tien.toFixed(2))
      }
    } else if (type == 'note') {
      option[index].note = value?.target?.value
    } else if (type == 'delivery_date') {
      option[index].delivery_date = value
    } else if (type == 'clear_delivery_date') {
      option[index].delivery_date = null
      setDeliveryDate(null)
    } else if (type == 'clearDeliveryDate') {
      setDeliveryDate(null)
      // option[index].delivery_date = null
    }

    setOption([...option])
  }

  const handleIncrease = (id) => {
    const index = option.findIndex((x) => x.id === id)
    const newQuantity = +option[index].quantity + 1

    option[index].quantity = newQuantity
    if (option[index].tax?.tax_rate == undefined) {
      const tien = Number(option[index].price_after_discount) * (1 + Number(0) / 100) * Number(option[index].quantity)
      option[index].total_amount = Number(tien.toFixed(2))
    } else {
      const tien =
        Number(option[index].price_after_discount) *
        (1 + Number(option[index].tax?.tax_rate) / 100) *
        Number(option[index].quantity)
      option[index].total_amount = Number(tien.toFixed(2))
    }
    setOption([...option])
  }

  const handleDecrease = (id) => {
    const index = option.findIndex((x) => x.id === id)
    const newQuantity = Number(option[index].quantity) - 1
    // chỉ giảm số lượng khi nó lớn hơn hoặc bằng 1
    if (newQuantity >= 1) {
      option[index].quantity = Number(newQuantity)
      if (option[index].tax?.tax_rate == undefined) {
        const tien = Number(option[index].price_after_discount) * (1 + Number(0) / 100) * Number(option[index].quantity)
        option[index].total_amount = Number(tien.toFixed(2))
      } else {
        const tien =
          Number(option[index].price_after_discount) *
          (1 + Number(option[index].tax?.tax_rate) / 100) *
          Number(option[index].quantity)
        option[index].total_amount = Number(tien.toFixed(2))
      }
      setOption([...option])
    } else {
      return isShow('error', `${'Số lượng tối thiểu là 1 không thể giảm !'}`)
    }
  }

  const _HandleDelete = (id, type) => {
    if (type === 'default') {
      return isShow('error', `${'Mặc định của hệ thống, không thể xóa'}`)
    }
    const newOption = option.filter((x) => x.id !== id) // loại bỏ phần tử cần xóa
    setOption(newOption) // cập nhật lại mảng
  }

  const _HandleChangeValue = (parentId, value) => {
    const checkData = option?.some((e) => e?.item?.value === value?.value)

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
            note: '',
            delivery_date: null,
          }
        } else {
          return e
        }
      })
      setOption([...newData])
    } else {
      isShow('error', `${'Mặt hàng đã được chọn'}`)
    }
  }

  const taxOptions = [{ label: 'Miễn thuế', value: '0', tax_rate: '0' }, ...dataTasxes]

  const totalMoney = (option) => {
    const totalPrice = option.reduce((acc, item) => {
      const totalPrice = item?.price * item?.quantity
      return acc + totalPrice
    }, 0)

    const totalDiscountPrice = option.reduce((acc, item) => {
      const totalDiscountPrice = item?.price * (item?.discount / 100) * item?.quantity
      return acc + totalDiscountPrice
    }, 0)

    const totalDiscountAfterPrice = option.reduce((acc, item) => {
      const tienSauCK = item?.quantity * item?.price_after_discount
      return acc + tienSauCK
    }, 0)

    const totalTax = option.reduce((acc, item) => {
      const totalTaxIem =
        item?.price_after_discount * (isNaN(item?.tax?.tax_rate) ? 0 : item?.tax?.tax_rate / 100) * item?.quantity
      return acc + totalTaxIem
    }, 0)

    const totalAmount = option.reduce((acc, item) => {
      const totalAmount = item?.total_amount
      return acc + totalAmount
    }, 0)
    return {
      totalPrice: totalPrice || 0,
      totalDiscountPrice: totalDiscountPrice || 0,
      totalDiscountAfterPrice: totalDiscountAfterPrice || 0,
      totalTax: totalTax || 0,
      totalAmount: totalAmount || 0,
    }
  }

  useEffect(() => {
    const totalPrice = totalMoney(option)
    setIsTotalMoney(totalPrice)
  }, [option])

  const dataOption = option?.map((e) => {
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
      price_quote_order_item_id: e?.price_quote_order_item_id,
    }
  })

  let newDataOption = dataOption?.filter((e) => e?.item !== undefined)

  // validate submit
  const handleSubmitValidate = (e) => {
    e.preventDefault()
    let deliveryDateInOption = option.some((e) => e?.delivery_date === null)

    if (typeOrder === '0') {
      if (startDate == null || customer == null || branch == null || staff == null || deliveryDateInOption === true) {
        startDate == null && setErrDate(true)
        customer?.value == null && sErrCustomer(true)
        branch?.value == null && setErrBranch(true)
        staff?.value == null && setErrStaff(true)
        deliveryDateInOption === true && setErrDeliveryDate(true)
        // deliveryDate == null && setErrDeliveryDate(true)
        isShow('error', `${dataLang?.required_field_null}`)
      } else {
        setOnSending(true)
      }
    } else if (typeOrder === '1') {
      if (
        startDate == null ||
        customer == null ||
        branch == null ||
        staff == null ||
        deliveryDateInOption === true ||
        quote == null
      ) {
        startDate == null && setErrDate(true)
        customer?.value == null && sErrCustomer(true)
        branch?.value == null && setErrBranch(true)
        staff?.value == null && setErrStaff(true)
        deliveryDateInOption === true && setErrDeliveryDate(true)
        quote?.value == null && setErrQuote(true)
        // deliveryDate == null && setErrDeliveryDate(true)

        isShow('error', `${dataLang?.required_field_null}`)
      } else {
        setOnSending(true)
      }
    }
  }

  // handle submit
  const handleSubmit = async () => {
    let formData = new FormData()
    formData.append('code', codeProduct)
    formData.append('date', formatMoment(startDate, FORMAT_MOMENT.DATE_TIME_LONG))
    formData.append('branch_id', branch?.value ? branch?.value : '')
    formData.append('client_id', customer?.value ? customer?.value : '')
    formData.append('person_contact_id', contactPerson?.value ? contactPerson?.value : '')
    formData.append('staff_id', staff?.value ? staff?.value : '')
    formData.append('note', note ? note : '')
    formData.append('quote_id', typeOrder === '1' ? quote?.value : '')
    newDataOption.forEach((item, index) => {
      formData.append(`items[${index}][item]`, item?.item != undefined ? item?.item : '')
      formData.append(
        `items[${index}][id]`,
        item?.price_quote_order_item_id != undefined ? item?.price_quote_order_item_id : ''
      )
      formData.append(`items[${index}][quantity]`, item?.quantity.toString())
      formData.append(`items[${index}][price]`, item?.price)
      formData.append(`items[${index}][discount_percent]`, item?.discount_percent)
      formData.append(`items[${index}][tax_id]`, item?.tax_id != undefined ? item?.tax_id : '')
      formData.append(`items[${index}][note]`, item?.note != undefined ? item?.note : '')
      formData.append(
        `items[${index}][delivery_date]`,
        item?.delivery_date != undefined ? formatMoment(item?.delivery_date, FORMAT_MOMENT.DATE_TIME_LONG) : ''
      )
    })

    if (
      isTotalMoney?.totalPrice > 0 &&
      isTotalMoney?.totalDiscountPrice >= 0 &&
      isTotalMoney?.totalDiscountAfterPrice > 0 &&
      isTotalMoney?.totalTax >= 0 &&
      isTotalMoney?.totalAmount > 0
    ) {
      try {
        const { isSuccess, message } = await apiSalesOrder.apiHandingSalesOrder(id, formData)
        if (isSuccess) {
          isShow('success', `${dataLang[message]}` || message)
          setCodeProduct('')
          setStartDate(dayjs())
          setDeliveryDate(dayjs())
          setContactPerson(null)
          setStaff(null)
          setCustomer(null)
          setBranch(null)
          setErrQuote(null)
          setNote('')
          setErrBranch(false)
          setErrDate(false)
          setErrDeliveryDate(false)
          sErrCustomer(false)
          setErrStaff(false)
          setErrQuote(false)
          setOption([])
          router.push(routerSalesOrder.home)
        } else {
          isShow('error', `${dataLang[message]}` || message)
        }
        setOnSending(false)
      } catch (error) {}
    } else {
      isShow(
        'error',
        newDataOption?.length === 0
          ? `Chưa chọn thông tin mặt hàng!`
          : 'Tiền không được âm, vui lòng kiểm tra lại thông tin mặt hàng!'
      )
      setOnSending(false)
    }
  }

  useEffect(() => {
    onSending && handleSubmit()
  }, [onSending])

  const handleClearDate = (type, id) => {
    if (type === 'deliveryDate') {
      setDeliveryDate(null)
    }
    if (type === 'startDate') {
      setStartDate(dayjs())
    }
  }

  // codeProduct new
  const hiddenOptions = quote?.length > 3 ? quote?.slice(0, 3) : []
  //const fakeDataQuotes = branch != null ? dataQuotes?.filter((x) => !hiddenOptions.includes(x.value)) : []

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
        note: '',
        delivery_date: null,
      }))

      setOption(data)
      //new
      setItemsAll(
        allItems?.map((e, index) => ({
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
          note: '',
          delivery_date: null,
        }))
      )
      setOption(
        allItems?.map((e, index) => ({
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
          note: '',
          delivery_date: null,
        }))
      )
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
        note: '',
        delivery_date: null,
      }))
      setOption(data)
      //new
      setItemsAll(
        allItems?.map((e, index) => ({
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
            tax_rate: e?.e?.tax_rate,
          },
          price_after_tax:
            +e?.e?.price * e?.e?.quantity * (1 - +e?.e?.discount_percent / 100) * (1 + e?.e?.tax_rate / 100),
          total_amount:
            +e?.e?.price * (1 - +e?.e?.discount_percent / 100) * (1 + +e?.e?.tax_rate / 100) * +e?.e?.quantity,
          note: e?.e?.note_item,
          delivery_date: null,
        }))
      )
      setOption(
        allItems?.map((e, index) => ({
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
            tax_rate: e?.e?.tax_rate,
          },
          price_after_tax:
            +e?.e?.price * e?.e?.quantity * (1 - +e?.e?.discount_percent / 100) * (1 + e?.e?.tax_rate / 100),
          total_amount:
            +e?.e?.price * (1 - +e?.e?.discount_percent / 100) * (1 + +e?.e?.tax_rate / 100) * +e?.e?.quantity,
          note: e?.e?.note_item,
          delivery_date: null,
        }))
      )
    } else if (typeOrder === '1' && quote === null) {
      isShow('error', `Vui lòng chọn phiếu báo giá rồi mới chọn mặt hàng !`)
    }
  }

  const _HandleDeleteAll = () => {
    setItemsAll([])
    setOption([])
    //new
  }

  const MenuList = (props) => {
    return (
      <components.MenuList {...props}>
        {allItems?.length > 0 && (
          <div className="grid items-center grid-cols-2 cursor-pointer">
            <div
              className="hover:bg-slate-200 p-2 col-span-1 text-center 3xl:text-[16px] 2xl:text-[16px] xl:text-[14px] text-[13px] "
              onClick={_HandleSelectAll.bind(this)}
            >
              Chọn tất cả
            </div>
            <div
              className="hover:bg-slate-200 p-2 col-span-1 text-center 3xl:text-[16px] 2xl:text-[16px] xl:text-[14px] text-[13px]"
              onClick={_HandleDeleteAll.bind(this)}
            >
              Bỏ chọn tất cả
            </div>
          </div>
        )}
        {props.children}
      </components.MenuList>
    )
  }

  // render option item in formatGroupLabel Item
  const selectItemsLabel = (option) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center ">
          <div>
            {option.e?.images !== null ? (
              <img
                src={option.e?.images}
                alt="Product Image"
                className="3xl:max-w-[30px] 3xl:h-[30px] 2xl:max-w-[30px] 2xl:h-[20px] xl:max-w-[30px] xl:h-[20px] max-w-[20px] h-[20px] text-[8px] object-cover rounded mr-1"
              />
            ) : (
              <div className="3xl:max-w-[30px] 3xl:h-[30px] 2xl:max-w-[30px] 2xl:h-[20px] xl:max-w-[30px] xl:h-[20px] max-w-[20px] h-[20px] object-cover flex items-center justify-center rounded xl:mr-1 mx-0.5">
                <img
                  src="/icon/noimagelogo.png"
                  alt="Product Image"
                  className="3xl:max-w-[30px] 3xl:h-[30px] 2xl:max-w-[30px] 2xl:h-[20px] xl:max-w-[30px] xl:h-[20px] max-w-[20px] h-[20px] object-cover rounded mr-1"
                />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold 3xl:text-[14px] 2xl:text-[11px] xl:text-[10px] text-[10px] whitespace-pre-wrap">
              {option.e?.name}
            </h3>

            <div className="flex gap-1 3xl:gap-2 2xl:gap-1 xl:gap-1">
              <h5 className="3xl:text-[14px] 2xl:text-[11px] xl:text-[8px] text-[7px]">
                {option.e?.product_variation}
              </h5>
            </div>

            <div className="flex gap-1 3xl:gap-4 2xl:gap-3 xl:gap-3">
              <h5 className="text-gray-400 3xl:min-w-[90px] 2xl:min-w-[85px] xl:min-w-[55px] min-w-[45px] 3xl:text-[14px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                {dataLang[option.e?.text_type]}
              </h5>

              <div className="flex items-center">
                <h5 className="text-gray-400 font-normal 3xl:text-[12px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                  {dataLang?.purchase_survive || 'purchase_survive'} :
                </h5>

                <h5 className=" font-normal 3xl:text-[12px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                  {option.e?.qty_warehouse ? formatNumber(option.e?.qty_warehouse) : '0'}
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
      <div className="flex items-center justify-start">
        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[8px] text-[8px] ">{option?.label}</h2>
        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[8px] text-[8px] ">{`(${option?.tax_rate})`}</h2>
      </div>
    )
  }

  const sortedArr = id ? option.sort((a, b) => a.id - b.id) : option.sort((a, b) => b.id - a.id)

  // breadcrumb
  const breadcrumbItems = [
    {
      label: `${dataLang?.returnSales_title || 'returnSales_title'}`,
      // href: "/",
    },
    {
      label: `${dataLang?.sales_product_list || 'sales_product_list'}`,
    },
    {
      label: `${
        id
          ? dataLang?.sales_product_edit_order || 'sales_product_edit_order'
          : dataLang?.sales_product_add_order || 'sales_product_add_order'
      }`,
    },
  ]

  return (
    <React.Fragment className="overflow-hidden">
      <Head>
        <title>
          {id
            ? dataLang?.sales_product_edit_order || 'sales_product_edit_order'
            : dataLang?.sales_product_add_order || 'sales_product_add_order'}
        </title>
      </Head>
      <Container className="!h-max py-6">
        {statusExprired ? (
          <EmptyExprired />
        ) : (
          <React.Fragment>
            <Breadcrumb items={breadcrumbItems} className="3xl:text-sm 2xl:text-xs xl:text-[10px] lg:text-[10px]" />
          </React.Fragment>
        )}

        <h2 className="text-title-section text-[#52575E] capitalize font-medium mt-1 !mb-5">
          {id
            ? dataLang?.sales_product_edit_order || 'sales_product_edit_order'
            : dataLang?.sales_product_add_order || 'sales_product_add_order'}
        </h2>
        <div className="flex w-full gap-x-6 items-stretch pb-40">
          {/* Cột trái */}
          <div className="w-3/4">
            <div className="flex items-center justify-between">
              {/* <div className="flex items-center justify-end mr-2">
                <ButtonBack onClick={() => router.push(routerSalesOrder.home)} dataLang={dataLang} />
              </div> */}
            </div>
            {/* fix */}
            {/* Thông tin mặt hàng */}
            <div className="h-full bg-white border border-[#919EAB3D] rounded-2xl p-4">
              {/* Heading & Searchbar */}
              <div className="flex justify-between items-center">
                <h2 className="w-full 3xl:text-[20px] font-medium 2xl:text-[16px] xl:text-[15px] text-[14px] text-brand-color capitalize">
                  {dataLang?.item_information || 'item_information'}
                </h2>
                {/* Search Bar */}
                {/* <div className="relative w-full">
                  <input
                    type="search"
                    placeholder="Tìm kiếm mặt hàng"
                    className="input-searchbar w-full h-[40px] border border-gray-300 rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-color rounded-lg p-1"
                  >
                    <SearchNormal1 size={16} className="text-white" />
                  </button>
                </div> */}
                <SelectBySearch placeholderText='Tìm kiếm mặt hàng' options={typeOrder === '1' && quote === null ? [] : allItems} formatNumber={formatNumber} />
              </div>
              {/* Search mặt hàng */}
              <div className="grid grid-cols-12">
                <div div className="col-span-3">
                  {/* <label className="text-[#344054] font-normal 2xl:text-base text-[14px]">
                    {dataLang?.import_click_items || 'import_click_items'}
                  </label> */}
                  {/* <SelectComponent
                    onInputChange={(event) => {
                      _HandleSeachApi(event)
                    }}
                    options={typeOrder === '1' && quote === null ? [] : allItems}
                    // closeMenuOnSelect={false}
                    onChange={(value) => {
                      console.log(value)
                      handleOnChangeInput('itemAll', value)
                    }}
                    value={itemsAll?.value ? itemsAll?.value : option?.map((e) => e?.item)}
                    isMulti
                    maxShowMuti={0}
                    components={{ MenuList, MultiValue }}
                    formatOptionLabel={(option) => {
                      if (option.value === '0') {
                        return <div className="font-medium text-gray-400">{option.label}</div>
                      } else if (option.value === null) {
                        return <div className="font-medium text-gray-400">{option.label}</div>
                      } else {
                        return (
                          <>
                            {dataItems.length == 0 ? (
                              <Loading className="h-80" color="#0f4f9e" />
                            ) : (
                              <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2">
                                  <div>
                                    {option.e?.images != null ? (
                                      <img
                                        src={option.e?.images}
                                        alt="Product Image"
                                        style={{
                                          width: '40px',
                                          height: '50px',
                                        }}
                                        className="object-cover rounded"
                                      />
                                    ) : (
                                      <div className="w-[50px] h-[60px] object-cover flex items-center justify-center rounded">
                                        <img
                                          src="/icon/noimagelogo.png"
                                          alt="Product Image"
                                          style={{
                                            width: '40px',
                                            height: '40px',
                                          }}
                                          className="object-cover rounded"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                      {option.e?.name}
                                    </h3>
                                    <div className="flex gap-2">
                                      <h5 className="font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                        {option.e?.product_variation}
                                      </h5>
                                    </div>
                                    <h5 className="text-gray-400 font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                      {dataLang[option.e?.text_type]}
                                    </h5>
                                  </div>
                                </div>

                                <div className="">
                                  <div className="text-right opacity-0">{'0'}</div>
                                  <div className="flex gap-2">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-normal text-gray-400">
                                        {dataLang?.purchase_survive || 'purchase_survive'}:
                                      </h5>
                                      <h5 className="font-medium ">{formatNumber(option.e?.qty_warehouse || 0)}</h5>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )
                      }
                    }}
                    placeholder='Tìm kiếm mặt hàng'
                    hideSelectedOptions={false}
                    className="rounded-md bg-white 3xl:text-[16px] 2xl:text-[10px] xl:text-[13px] text-[12.5px]"
                    isSearchable={true}
                    noOptionsMessage={() => 'Không có dữ liệu'}
                    menuPortalTarget={document.body}
                    styles={{
                      placeholder: (base) => ({
                        ...base,
                        color: '#cbd5e1',
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 100,
                      }),
                      control: (base) => ({
                        ...base,
                        boxShadow: 'none',
                        padding: '0.7px',
                      }),
                    }}
                  /> */}
                </div>
              </div>

              {/* Thông tin mặt hàng Header */}
              {/* <div className="pr-2">
                <div className="grid grid-cols-12 items-center  sticky top-0 bg-[#F7F8F9] py-2 ">
                  <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-2  text-[#667085] uppercase  col-span-2 text-left truncate font-[400]">
                    {dataLang?.sales_product_item || 'sales_product_item'}
                  </h4>
                  <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]">
                    {dataLang?.sales_product_from_unit || 'sales_product_from_unit'}
                  </h4>
                  <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]">
                    {dataLang?.sales_product_quantity || 'sales_product_quantity'}
                  </h4>
                  <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]">
                    {dataLang?.sales_product_unit_price || 'sales_product_unit_price'}
                  </h4>
                  <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]">
                    {`${dataLang?.sales_product_rate_discount}` || 'sales_product_rate_discount'}
                  </h4>
                  <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-2  text-[#667085] uppercase  col-span-1 text-center    font-[400] whitespace-nowrap">
                    {dataLang?.sales_product_after_discount || 'sales_product_after_discount'}
                  </h4>
                  <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]">
                    {dataLang?.sales_product_tax || 'sales_product_tax'}
                  </h4>
                  <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-2  text-[#667085] uppercase  col-span-1 text-center    truncate font-[400]">
                    {dataLang?.sales_product_total_into_money || 'sales_product_total_into_money'}
                  </h4>
                  <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-2  text-[#667085] uppercase  col-span-1 text-center font-[400] whitespace-nowrap">
                    {dataLang?.sales_product_item_date || 'sales_product_item_date'}
                  </h4>
                  <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-2  text-[#667085] uppercase  col-span-1 text-center    truncate font-[400]">
                    {dataLang?.sales_product_note || 'sales_product_note'}
                  </h4>
                  <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-2  text-[#667085] uppercase  col-span-1 text-center  truncate font-[400]">
                    {dataLang?.sales_product_operations || 'sales_product_operations'}
                  </h4>
                </div>
              </div> */}
              {sortedArr.length <= 0 && <NotFoundData />}
              {/* Thông tin mặt hàng Body */}
              {sortedArr.length > 0 && (
                <Customscrollbar className="max-h-[400px] h-[400px] overflow-auto pb-2">
                  <div className="h-full divide-y divide-slate-200">
                    {/* phân chia,m */}
                    <div className="grid grid-cols-12">
                      <div className="col-span-2 ">
                        <SelectComponent
                          onInputChange={(event) => {
                            _HandleSeachApi(event)
                          }}
                          dangerouslySetInnerHTML={{
                            __html: option.label,
                          }}
                          options={typeOrder === '1' && quote === null ? [] : options}
                          onChange={(value) => handleAddParent(value)}
                          value={null}
                          formatOptionLabel={selectItemsLabel}
                          placeholder={dataLang?.sales_product_select_item || 'sales_product_select_item'}
                          hideSelectedOptions={false}
                          className={`cursor-pointer rounded-md bg-white  3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] z-[99]`}
                          isSearchable={true}
                          noOptionsMessage={() => 'Không có dữ liệu'}
                          menuPortalTarget={document.body}
                          styles={{
                            placeholder: (base) => ({
                              ...base,
                              color: '#cbd5e1',
                            }),
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                            control: (base, state) => ({
                              ...base,
                              ...(state.isFocused && {
                                border: '0 0 0 1px #92BFF7',
                                boxShadow: 'none',
                              }),
                            }),
                          }}
                        />
                      </div>

                      <div className="grid items-center grid-cols-10 col-span-10 gap-1 mb-1">
                        <div className="flex items-center justify-center col-span-1 text-center">
                          <h3 className={`cursor-default 3xl:text-[16px] 2xl:text-[14px] xl:text-[13px] text-[12px]`} />
                        </div>
                        <div className="flex items-center justify-center col-span-1">
                          <button
                            disabled={true}
                            className="2xl:scale-100 xl:scale-90 scale-75 text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                          >
                            <Minus size="16" className="scale-75 2xl:scale-100 xl:scale-90 " />
                          </button>
                          <InPutNumericFormat
                            className={`cursor-default appearance-none text-center 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px] py-1 px-0.5 font-normal 2xl:w-24 xl:w-[90px] w-[63px]  focus:outline-none border-b-2 border-gray-200`}
                            value={1}
                            allowNegative={false}
                            thousandSeparator=","
                          />
                          <button
                            disabled={true}
                            className=" 2xl:scale-100 xl:scale-90 scale-75 text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                          >
                            <Add size="16" className="scale-75 2xl:scale-100 xl:scale-90" />
                          </button>
                        </div>
                        <div className="flex items-center justify-center col-span-1 text-center">
                          <InPutNumericFormat
                            value={1}
                            allowNegative={false}
                            readOnly={true}
                            decimalScale={0}
                            isNumericString={true}
                            className={`cursor-default appearance-none 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px] text-center py-1 px-2 font-normal w-[80%] focus:outline-none border-b-2 border-gray-200`}
                            thousandSeparator=","
                          />
                        </div>
                        <div className="flex items-center justify-center col-span-1 text-center">
                          <InPutNumericFormat
                            value={0}
                            className={`cursor-default appearance-none text-center py-1 px-2 font-normal w-[80%] focus:outline-none border-b-2 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px] border-gray-200`}
                            thousandSeparator=","
                            allowNegative={false}
                            readOnly={true}
                            isNumericString={true}
                          />
                        </div>
                        <div className="flex items-center justify-end col-span-1 text-right">
                          <h3
                            className={`cursor-default px-2 py-2.5 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px]`}
                          >
                            1
                          </h3>
                        </div>
                        <div className="flex items-center justify-center col-span-1">
                          <SelectComponent
                            options={taxOptions}
                            value={null}
                            placeholder={'% Thuế'}
                            isDisabled={true}
                            hideSelectedOptions={false}
                            formatOptionLabel={taxRateLabel}
                            className={`border-transparent placeholder:text-slate-300 3xl:mb-4 2xl:mb-3 mb-3.5 3x:h-4 h-6 w-full 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px]  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                            isSearchable={true}
                            noOptionsMessage={() => 'Không có dữ liệu'}
                            menuPortalTarget={document.body}
                            closeMenuOnSelect={true}
                            styles={{
                              placeholder: (base) => ({
                                ...base,
                                color: '#cbd5e1',
                              }),
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 20,
                              }),
                              control: (base, state) => ({
                                ...base,
                                boxShadow: 'none',
                                padding: '0.7px',
                              }),
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-end col-span-1 text-right">
                          <h3
                            className={`cursor-default px-2 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px]`}
                          >
                            1
                          </h3>
                        </div>
                        <div className="col-span-1 ">
                          <div className="relative flex flex-row custom-date-picker">
                            <DatePicker
                              selected={null}
                              blur
                              disabled={true}
                              placeholderText="DD/MM/YYYY"
                              dateFormat="dd/MM/yyyy"
                              className={`bg-gray-100 3xl:h-10 h-10 w-full 3xl:text-[13px] 2xl:text-[12px] xl:text-[10px] text-[7px] border placeholder:text-slate-300 rounded text-[#52575E] font-normal xl:px-1 px-0.5 outline-none cursor-default `}
                            />
                            <BsCalendarEvent className="absolute right-0 3xl:-translate-x-[75%] 3xl:translate-y-[70%] 2xl:-translate-x-[40%] 2xl:translate-y-[70%] xl:-translate-x-[30%] xl:translate-y-[70%] -translate-x-[10%] translate-y-[70%]  text-[#CCCCCC] 3xl:scale-110 2xl:scale-95 xl:scale-90 scale-75 cursor-default" />
                          </div>
                        </div>
                        <div className="flex items-center justify-center col-span-1">
                          <input
                            value={null}
                            name="optionEmail"
                            placeholder="Ghi chú"
                            disabled={true}
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] h-10 3xl:text-[13px] 2xl:text-[12px] xl:text-[10px] text-[10px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none"
                          />
                        </div>
                        <div className="flex items-center justify-center col-span-1">
                          <button
                            onClick={() => _HandleDelete('default', 'default')}
                            type="button"
                            title="Xóa"
                            className="transition w-[40px] h-10 rounded-[5.5px] hover:text-red-600 text-red-500 flex flex-col justify-center items-center"
                          >
                            <IconDelete />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* phân chia  */}
                    {sortedArr.map((e) => (
                      <div className="grid items-center grid-cols-12 gap-1 py-1" key={e?.id}>
                        <div className="col-span-2 ">
                          <SelectComponent
                            onInputChange={(event) => {
                              _HandleSeachApi(event)
                            }}
                            dangerouslySetInnerHTML={{
                              __html: option.label,
                            }}
                            options={options}
                            onChange={(value) => _HandleChangeValue(e?.id, value)}
                            value={e?.item}
                            formatOptionLabel={selectItemsLabel}
                            placeholder={dataLang?.sales_product_select_item || 'sales_product_select_item'}
                            hideSelectedOptions={false}
                            className={`cursor-pointer rounded-md bg-white 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px]`}
                            isSearchable={true}
                            noOptionsMessage={() => 'Không có dữ liệu'}
                            menuPortalTarget={document.body}
                            styles={{
                              placeholder: (base) => ({
                                ...base,
                                color: '#cbd5e1',
                              }),
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                              }),
                              control: (base, state) => ({
                                ...base,
                                ...(state.isFocused && {
                                  boxShadow: 'none',
                                  padding: '0',
                                }),
                              }),
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-center col-span-1 text-center">
                          <h3 className={`'cursor-text 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px]`}>
                            {e?.unit}
                          </h3>
                        </div>
                        <div className="flex items-center justify-center col-span-1">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleDecrease(e?.id)}
                              className="2xl:scale-100 xl:scale-90 scale-75 text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                            >
                              <Minus size="16" className="scale-75 2xl:scale-100 xl:scale-90" />
                            </button>
                            <InPutNumericFormat
                              value={e?.quantity}
                              onValueChange={(value) => handleOnChangeInputOption(e?.id, 'quantity', value)}
                              isAllowed={({ floatValue }) => {
                                if (floatValue == 0) {
                                  return true
                                } else {
                                  return true
                                }
                              }}
                              allowNegative={false}
                              className={`${
                                (e?.quantity == 0 && 'border-red-500') || (e?.quantity == '' && 'border-red-500')
                              } cursor-default appearance-none text-center 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px] py-1 px-0.5 font-normal 2xl:w-24 xl:w-[90px] w-[63px]  focus:outline-none border-b-2 border-gray-200`}
                            />
                            <button
                              onClick={() => handleIncrease(e.id)}
                              className="2xl:scale-100 xl:scale-90 scale-75 text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                            >
                              <Add size="16" className="scale-75 2xl:scale-100 xl:scale-90" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-center col-span-1 text-center">
                          <InPutMoneyFormat
                            value={e?.price}
                            onValueChange={(value) => handleOnChangeInputOption(e?.id, 'price', value)}
                            isAllowed={isAllowedNumber}
                            allowNegative={false}
                            className={`${
                              (e?.price == 0 && 'border-red-500') || (e?.price == '' && 'border-red-500')
                            } cursor-default appearance-none text-center 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px] py-1 px-0.5 font-normal 2xl:w-24 xl:w-[90px] w-[63px]  focus:outline-none border-b-2 border-gray-200`}
                          />
                        </div>
                        <div className="flex items-center justify-center col-span-1 text-center">
                          <InPutNumericFormat
                            value={e?.discount}
                            onValueChange={(value) => handleOnChangeInputOption(e?.id, 'discount', value)}
                            className={`cursor-text appearance-none text-center py-1 px-2 font-normal w-[80%]  focus:outline-none border-b-2 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px] border-gray-200`}
                            isAllowed={isAllowedDiscount}
                            isNumericString={true}
                          />
                        </div>
                        <div className="flex items-center justify-end col-span-1 text-right">
                          <h3 className={`cursor-text px-2 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px]`}>
                            {formatNumber(e?.price_after_discount)}
                          </h3>
                        </div>
                        <div className="flex items-center justify-center col-span-1 p-0">
                          <SelectComponent
                            options={taxOptions}
                            onChange={(value) => handleOnChangeInputOption(e?.id, 'tax', value)}
                            value={
                              e?.tax
                                ? {
                                    label: taxOptions.find((item) => item.value === e?.tax?.value)?.label,
                                    value: e?.tax?.value,
                                    tax_rate: e?.tax?.tax_rate,
                                  }
                                : null
                            }
                            placeholder={'% Thuế'}
                            hideSelectedOptions={false}
                            formatOptionLabel={taxRateLabel}
                            className={` border-transparent placeholder:text-slate-300 h-10 w-full 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                            isSearchable={true}
                            noOptionsMessage={() => 'Không có dữ liệu'}
                            menuPortalTarget={document.body}
                            closeMenuOnSelect={true}
                            styles={{
                              placeholder: (base) => ({
                                ...base,
                                color: '#cbd5e1',
                              }),
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 20,
                              }),
                              control: (base, state) => ({
                                ...base,
                                boxShadow: 'none',
                                padding: '0px',
                                margin: '0px',
                              }),
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-end col-span-1 text-right">
                          <h3
                            className={`cursor-text px-2 3xl:text-[13px] 2xl:text-[13px] xl:text-[12px] text-[11px] z-[99]`}
                          >
                            {formatMoney(e?.total_amount)}
                          </h3>
                        </div>
                        <div className="col-span-1">
                          <div className="relative flex flex-row custom-date-picker">
                            <DatePicker
                              selected={e?.delivery_date ? e?.delivery_date : null}
                              blur
                              placeholderText="DD/MM/YYYY"
                              dateFormat="dd/MM/yyyy"
                              onSelect={(date) => handleOnChangeInputOption(e?.id, 'delivery_date', date)}
                              onChange={(date) => handleOnChangeInputOption(e?.id, 'delivery_date', date)}
                              className={`${
                                errDeliveryDate && e?.delivery_date === null
                                  ? 'border-red-500'
                                  : 'focus:border-[#92BFF7] border-[#d0d5dd]'
                              } 3xl:h-10 h-10 w-full 3xl:text-[13px] 2xl:text-[12px] xl:text-[10px] text-[8px] border placeholder:text-slate-300 bg-[#ffffff] rounded text-[#52575E] font-normal px-0.5 outline-none cursor-pointer `}
                            />

                            {e?.delivery_date && (
                              <>
                                <MdClear
                                  className="absolute right-0 3xl:-translate-x-[320%] 3xl:translate-y-[1%] 2xl:-translate-x-[150%] 2xl:translate-y-[1%] xl:-translate-x-[140%] xl:translate-y-[1%] -translate-x-[90%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] 3xl:scale-110 xl:scale-90 scale-75 cursor-pointer"
                                  onClick={() => handleOnChangeInputOption(e?.id, 'clear_delivery_date')}
                                />
                              </>
                            )}
                            <BsCalendarEvent className="absolute right-0 3xl:-translate-x-[75%] 3xl:translate-y-[70%] 2xl:-translate-x-[40%] 2xl:translate-y-[70%] xl:-translate-x-[30%] xl:translate-y-[70%] -translate-x-[10%] translate-y-[70%] text-[#CCCCCC] 3xl:scale-110 2xl:scale-95 xl:scale-90 scale-75 cursor-pointer" />
                          </div>
                          {errDeliveryDate && e?.delivery_date === null && (
                            <label className="text-[12px] max-w-10px text-red-500">Vui lòng chọn ngày cần hàng!</label>
                          )}
                        </div>
                        <div className="flex items-center justify-center col-span-1">
                          <input
                            value={e?.note}
                            onChange={(value) => handleOnChangeInputOption(e?.id, 'note', value)}
                            name="optionEmail"
                            placeholder="Ghi chú"
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] h-10 3xl:text-[13px] 2xl:text-[12px] xl:text-[10px] text-[10px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none"
                          />
                        </div>
                        <div className="flex items-center justify-center col-span-1">
                          <button
                            onClick={_HandleDelete.bind(this, e?.id)}
                            type="button"
                            title="Xóa"
                            className="transition w-[40px] h-10 rounded-[5.5px] hover:text-red-600 text-red-500 flex flex-col justify-center items-center"
                          >
                            <IconDelete />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Customscrollbar>
              )}
            </div>
          </div>
          {/* Cột phải */}
          <div className="w-1/4">
            <div className="flex flex-col gap-y-6">
              {/* Cột thông tin chung */}
              <div className="w-full mx-auto px-4 bg-white border border-gray-200 rounded-2xl">
                <h2 className="text-[20px] font-medium text-brand-color mt-6 mb-4 capitalize">Thông tin</h2>
                <div className="w-full">
                  {/* Tab header */}
                  <div className="w-full flex items-center space-x-2 bg-blue-100 p-1 mb-6 rounded-xl relative">
                    {tabItems.map((tab) => (
                      <div className="w-full relative" key={tab.key}>
                        {activeTab === tab.key && (
                          <motion.div
                            layoutId="active-tab-bg"
                            className="absolute inset-0 bg-blue-color rounded-lg"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <button
                          onClick={() => handleTabClick(tab.key)}
                          className={`relative w-full py-2 text-base font-normal rounded-lg z-10 transition-all duration-300
                            ${activeTab === tab.key ? 'text-white' : 'text-gray-800'}
                          `}
                        >
                          {tab.label}
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* Tab Content */}
                  <div className="mt-4">
                    {activeTab === 'info' && (
                      <div className="relative">
                        {/* Số đơn hàng */}
                        <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                          <h4 className="w-full text-secondary-color-text">
                            {dataLang?.sales_product_code || 'sales_product_code'}
                          </h4>
                          <div className="w-full relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500">
                              #
                            </span>
                            <input
                              value={codeProduct}
                              onChange={handleOnChangeInput.bind(this, 'codeProduct')}
                              name="fname"
                              type="text"
                              placeholder={dataLang?.system_default || 'system_default'}
                              className={`3xl:text-sm 2xl:text-[13px] xl:text-[12px] text-[11px] z-10 pl-8 focus:border-[#0F4F9E] w-full text-gray-600 font-normal border border-[#d0d5dd] p-2 rounded-lg outline-none`}
                            />
                          </div>
                        </div>
                        {/* Ngày tạo đơn */}
                        <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3 relative">
                          <h4 className="w-full text-secondary-color-text">
                            {'Ngày tạo đơn' || dataLang?.sales_product_date}
                          </h4>
                          <div className="w-full">
                            <div className="relative w-full flex flex-row custom-date-picker">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                <BsCalendarEvent color="#7a7a7a" />
                              </span>
                              {/* <DatePicker
                                blur
                                fixedHeight
                                showTimeSelect
                                selected={startDate}
                                onSelect={(date) => {
                                  setStartDate(date)
                                }}
                                onChange={(e) => {
                                  setStartDate(e)
                                }}
                                placeholderText="Chọn ngày"
                                dateFormat="dd/MM/yyyy h:mm:ss aa"
                                timeInputLabel={'Time: '}
                                className={`border ${
                                  errDate ? 'border-red-500' : 'focus:border-[#92BFF7] border-[#d0d5dd]'
                                } pl-8 3xl:text-sm 2xl:text-[13px] xl:text-[12px] text-[11px] w-full bg-[#ffffff] rounded-lg placeholder:text-secondary-color-text-disabled font-normal px-4 py-2 outline-none cursor-pointer relative`}
                              /> */}
                              <ConfigProvider locale={viVN}>
                                <DatePicker
                                  className="sales-product-date pl-8 placeholder:text-secondary-color-text-disabled"
                                  placeholder="Chọn ngày"
                                  format="DD/MM/YYYY HH:mm"
                                  showTime={{
                                    defaultValue: dayjs('00:00', 'HH:mm'),
                                    format: 'HH:mm',
                                  }}
                                  suffixIcon={null}
                                  value={dayjs(startDate)}
                                  onChange={(date) => {
                                      if (date) {
                                        const dateString = date.toDate().toString();
                                        setStartDate(dateString);
                                      }
                                  }}
                                />
                              </ConfigProvider>
                              {/* {startDate && (
                                <>
                                  <MdClear
                                    className="absolute 3xl:translate-x-[2700%] 3xl:-translate-y-[2%] translate-x-[2400%] translate-y-[4%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                    onClick={() => handleClearDate('startDate')}
                                  />
                                </>
                              )} */}
                              <BsCalendarEvent className="absolute left-0 3xl:translate-x-[3280%] 3xl:translate-y-[70%] translate-x-[2880%] translate-y-[80%] text-[#CCCCCC] scale-110 cursor-pointer" />
                            </div>
                          </div>

                          {errDate && (
                            <label className="text-sm text-red-500">
                              {dataLang?.price_quote_errDate || 'price_quote_errDate'}
                            </label>
                          )}
                        </div>
                        {/* Ngày cần hàng */}
                        <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3 relative">
                          <h4 className="w-full text-secondary-color-text">
                            {dataLang?.sales_product_item_date || 'sales_product_item_date'}
                          </h4>
                          <div className="w-full">
                            <div className="relative flex flex-row custom-date-picker">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                <BsCalendarEvent color="#7a7a7a" />
                              </span>
                              <ConfigProvider locale={viVN}>
                                <DatePicker
                                  className="sales-product-date pl-8 placeholder:text-secondary-color-text-disabled"
                                  placeholder="Chọn ngày"
                                  format="DD/MM/YYYY"
                                  suffixIcon={null}
                                  value={deliveryDate ? dayjs(deliveryDate) : null}
                                  onChange={(date) => {
                                    if (date) {
                                      const dateString = date.toDate().toString();
                                      setDeliveryDate(dateString);
                                    } else {
                                      setDeliveryDate(null); // Xử lý khi user xóa date
                                    }
                                  }}
                                />
                              </ConfigProvider>
                              {/* <DatePicker
                                selected={deliveryDate}
                                onChange={(date) => handleOnChangeInput('total_delivery_date', date)}
                                blur
                                placeholderText="Chọn ngày"
                                dateFormat="dd/MM/yyyy"
                                onSelect={(date) => setDeliveryDate(date)}
                                className={`pl-8 3xl:h-11 h-10 3xl:w-full w-full 2xl:text-[14px] xl:text-[14px] text-[11px] placeholder:text-secondary-color-text-disabled bg-[#ffffff] font-normal border border-[#d0d5dd] p-2 rounded-lg outline-none cursor-pointer`}
                              /> */}
                            </div>
                          </div>
                        </div>
                        {/* Khách hàng */}
                        <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                          <h4 className="w-full text-secondary-color-text">{'Khách hàng' || dataLang?.customer}</h4>
                          <div className="w-full relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                              <LuBriefcase color="#7a7a7a" />
                            </span>
                            {/* <SelectComponent
                              options={dataCustomer}
                              onChange={handleOnChangeInput.bind(this, 'customer')}
                              value={customer}
                              placeholder={dataLang?.select_customer || 'select_customer'}
                              hideSelectedOptions={false}
                              isClearable={true}
                              className={`${
                                errCustomer ? 'border border-red-500' : ''
                              } 3xl:text-sm 2xl:text-[13px] xl:text-[12px] text-[11px] !z-0`}
                              isSearchable={true}
                              noOptionsMessage={() => 'Không có dữ liệu'}
                              menuPortalTarget={document.body}
                              menuPortal={true}
                              closeMenuOnSelect={true}
                              styles={{
                                singleValue: (base) => ({
                                  ...base,
                                  paddingLeft: '20px',
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  paddingLeft: '20px',
                                }),
                                control: (base) => ({
                                  ...base,
                                  boxShadow: 'none',
                                  padding: '0.7px',
                                  borderRadius: '8px',
                                }),
                              }}
                            /> */}
                            <SelectWithSort
                              title="Khách hàng"
                              placeholderText="Chọn khách hàng"
                              options={!!flagStateChange ? [] : dataCustomer}
                              value={selectedCustomer}
                              onChange={(value) => setSelectedCustomer(value)}
                            />
                            {errCustomer && (
                              <label className="text-sm text-red-500">
                                {dataLang?.sales_product_err_customer || 'sales_product_err_customer'}
                              </label>
                            )}
                          </div>
                        </div>
                        {/* Xem thêm thông tin */}
                        <AnimatePresence initial={false}>
                          {showMoreInfo && (
                            <motion.div
                              key="more-info"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.5, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <React.Fragment>
                                {/* Chi nhánh */}
                                <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                                  <h4 className="w-full text-secondary-color-text">
                                    {'Chi nhánh' || dataLang?.branch}
                                  </h4>
                                  <div className="w-full relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                      <PiMapPinLight color="#7a7a7a" />
                                    </div>
                                    <SelectWithSort
                                      title="Chi nhánh"
                                      placeholderText="Chọn chi nhánh"
                                      options={dataBranch}
                                      value={selectedBranch}
                                      onChange={(value) => setSelectedBranch(value)}
                                    />
                                    {errBranch && (
                                      <label className="text-sm text-red-500">
                                        {dataLang?.sales_product_err_branch || 'sales_product_err_branch'}
                                      </label>
                                    )}
                                  </div>
                                </div>
                                {/* Người liên lạc */}
                                <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                                  <h4 className="w-full text-secondary-color-text">
                                    {'Người liên lạc' || dataLang?.contact_person}
                                  </h4>
                                  <div className="w-full relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                      <FiUser color="#7a7a7a" />
                                    </span>
                                    <SelectWithSort
                                      title="Người liên lạc"
                                      placeholderText="Chọn người liên lạc"
                                      options={!!flagStateChange ? [] : dataPersonContact}
                                      value={selectedPersonalContact}
                                      onChange={(value) => setSelectedPersonalContact(value)}
                                    />
                                  </div>
                                </div>
                                {/* Nhân viên */}
                                <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                                  <h4 className="w-full text-secondary-color-text">
                                    {'Nhân viên' || dataLang?.sales_product_staff_in_charge}
                                  </h4>
                                  <div className="w-full relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                      <FiUser color="#7a7a7a" />
                                    </span>
                                    <SelectWithSort
                                      title="Nhân viên"
                                      placeholderText="Chọn nhân viên"
                                      options={!!flagStateChange ? [] : dataStaffs}
                                      value={selectedStaff}
                                      onChange={(value) => setSelectedStaff(value)}
                                    />
                                    {errStaff && (
                                      <label className="text-sm text-red-500">
                                        {dataLang?.sales_product_err_staff_in_charge ||
                                          'sales_product_err_staff_in_charge'}
                                      </label>
                                    )}
                                  </div>
                                </div>
                              </React.Fragment>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {/* Xem thêm Button */}
                        <div className="flex items-center justify-center p-1 pb-6 hover:underline">
                          <button
                            onClick={() => setShowMoreInfo(!showMoreInfo)}
                            className="text-gray-700 text-sm font-normal inline-flex items-center gap-x-1"
                          >
                            {showMoreInfo ? (
                              <span className="inline-flex items-center gap-x-1">
                                Ẩn bớt
                                <ArrowUp2 size={16} />
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-x-1">
                                Xem thêm
                                <ArrowDown2 size={16} />
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    {activeTab === 'note' && (
                      <div className="w-full mx-auto">
                        <h4 className="text-base font-normal text-secondary-color-text mb-3 capitalize">
                          {dataLang?.sales_product_note || 'sales_product_note'}
                        </h4>
                        <div className="w-full pb-6">
                          <textarea
                            value={note}
                            placeholder="Nhập ghi chú tại đây"
                            onChange={handleOnChangeInput.bind(this, 'note')}
                            name="fname"
                            type="text"
                            className="focus:border-brand-color border-gray-200 placeholder:text-secondary-color-text-disabled w-full h-[68px] max-h-[68px] bg-[#ffffff] rounded-lg text-[#52575E] text-sm font-normal px-3 py-2 border outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Cột tổng cộng */}
              <div className="w-full mx-auto px-4 pt-6 pb-4 bg-white border border-gray-200 rounded-2xl">
                <h2 className="text-[20px] font-medium text-brand-color mb-6 capitalize">
                  {'Tổng cộng' || dataLang?.price_quote_total}
                </h2>
                {/* Tổng tiền */}
                <div className="flex justify-between items-center mb-4 text-base font-normal text-black-color">
                  <h4 className="w-full">{dataLang?.price_quote_total || 'price_quote_total'}</h4>
                  <span>{isTotalMoney.totalPrice ? formatMoney(isTotalMoney.totalPrice) : '-'}</span>
                </div>
                {/* Tiền chiết khấu */}
                <div className="flex justify-between items-center mb-4 text-base font-normal text-secondary-color-text">
                  <h4 className="w-full">{dataLang?.sales_product_discount || 'sales_product_discount'}</h4>
                  <span>{isTotalMoney.totalDiscountPrice ? formatMoney(isTotalMoney.totalDiscountPrice) : '-'}</span>
                </div>
                {/* Tiền sau chiết khấu */}
                <div className="flex justify-between items-center mb-4 text-base font-normal text-secondary-color-text">
                  <h4 className="w-full">
                    {dataLang?.sales_product_total_money_after_discount || 'sales_product_total_money_after_discount'}
                  </h4>
                  <span>
                    {isTotalMoney.totalDiscountAfterPrice ? formatMoney(isTotalMoney.totalDiscountAfterPrice) : '-'}
                  </span>
                </div>
                {/* Tiền thuế */}
                <div className="flex justify-between items-center mb-4 text-base font-normal text-secondary-color-text">
                  <h4 className="w-full">{dataLang?.sales_product_total_tax || 'sales_product_total_tax'}</h4>
                  <span>{isTotalMoney.totalTax ? formatMoney(isTotalMoney.totalTax) : '-'}</span>
                </div>
                {/* Thành tiền */}
                <div className="flex justify-between items-center mb-4">
                  <h4 className="w-full text-black text-base font-semibold">
                    {dataLang?.sales_product_total_into_money || 'sales_product_total_into_money'}
                  </h4>
                  <span className="text-blue-color text-base font-semibold">
                    {isTotalMoney.totalAmount ? formatMoney(isTotalMoney.totalAmount) : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Nút lưu và thoát */}
        <div className="fixed bottom-0 left-0 z-10 w-full bg-white border-t border-gray-color p-4 flex justify-end space-x-2 shadow-lg">
          <button
            onClick={() => router.push(routerSalesOrder.home)}
            dataLang={dataLang}
            className="px-6 py-3 bg-[#F2F3F5] text-base font-normal rounded-lg"
          >
            Thoát
          </button>
          <Button
            onClick={handleSubmitValidate.bind(this)}
            dataLang={dataLang}
            loading={onSending}
            className="sale-order-btn-submit h-auto px-6 py-3 bg-light-blue-color text-white text-base font-medium rounded-lg"
          >
            Lưu
          </Button>
        </div>

      </Container>
      <PopupConfim
        dataLang={dataLang}
        nameModel={'change_item'}
        type="warning"
        title={TITLE_DELETE_ITEMS}
        subtitle={CONFIRMATION_OF_CHANGES}
        isOpen={isOpen}
        save={resetValue}
        cancel={() => handleQueryId({ status: false })}
      />
    </React.Fragment>
  )
}

export default SalesOrderForm
