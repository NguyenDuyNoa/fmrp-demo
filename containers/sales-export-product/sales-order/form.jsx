import apiSalesOrder from '@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder'
import Breadcrumb from '@/components/UI/breadcrumb/BreadcrumbCustom'
import { EmptyExprired } from '@/components/UI/common/EmptyExprired'
import { Container } from '@/components/UI/common/layout'
import SelectComponent from '@/components/UI/filterComponents/selectComponent'
import InPutMoneyFormat from '@/components/UI/inputNumericFormat/inputMoneyFormat'
import InPutNumericFormat from '@/components/UI/inputNumericFormat/inputNumericFormat'
import PopupConfim from '@/components/UI/popupConfim/popupConfim'
import { optionsQuery } from '@/configs/optionsQuery'
import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from '@/constants/delete/deleteItems'
import { FORMAT_MOMENT } from '@/constants/formatDate/formatDate'
import { useBranchList } from '@/hooks/common/useBranch'
import { useClientComboboxByBranch } from '@/hooks/common/useClients'
import { useContactCombobox } from '@/hooks/common/useContacts'
import { useStaffComboboxByBranch } from '@/hooks/common/useStaffs'
import { useTaxList } from '@/hooks/common/useTaxs'
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
import { Add, ArrowDown2, ArrowUp2, Minus } from 'iconsax-react'
import moment from 'moment'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BsCalendarEvent } from 'react-icons/bs'
import { FaPencilAlt } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { LuBriefcase } from 'react-icons/lu'
import { MdClear } from 'react-icons/md'
import { PiMapPinLight } from 'react-icons/pi'
import { v4 as uuidv4 } from 'uuid'

// Optimize UI
import InfoFormLabel from '@/components/common/orderManagement/InfoFormLabel'
import OrderFormTabs from '@/components/common/orderManagement/OrderFormTabs'
import SelectBySearch from '@/components/common/select/SelectBySearch'
import SelectWithSort from '@/components/common/select/SelectWithSort'
import EmptyData from '@/components/UI/emptyData'
import { Button, ConfigProvider, DatePicker, Dropdown } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { AnimatePresence, motion } from 'framer-motion'
import { useSelector } from 'react-redux'

dayjs.extend(customParseFormat)
dayjs.locale('vi')

const SalesOrderForm = (props) => {
  // State
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [idProductSale, setIdProductSale] = useState(null)
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
  const { data: dataTasxes = [] } = useTaxList()

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

      setItemsAll(
        rResult?.items?.map((e) => ({
          label: `${e.item?.item_name} <span style={{display: none}}>${e.item?.code}</span><span style={{display: none}}>${e.item?.product_variation} </span><span style={{display: none}}>${e.item?.text_type} ${e.item?.unit_name} </span>`,
          value: e.item?.id,
          e: e.item,
        }))
      )
      setOption(items)
      setCodeProduct(rResult?.code)

      setContactPerson(
        rResult?.contact_name !== null && rResult?.contact_name !== '0'
          ? { label: rResult?.contact_name, value: rResult?.contact_id }
          : null
      )
      setSelectedPersonalContact(
        rResult?.contact_id !== null && rResult?.contact_id !== '0' ? rResult?.contact_id : null
      )

      setBranch({ label: rResult?.branch_name, value: rResult?.branch_id })
      setSelectedBranch(rResult?.branch_id)

      setStaff({ label: rResult?.staff_name, value: rResult?.staff_id })
      setSelectedStaff(rResult?.staff_id)

      setCustomer({ label: rResult?.client_name, value: rResult?.client_id })
      setSelectedCustomer(rResult?.client_id)

      setStartDate(moment(rResult?.date).toDate())
      setDeliveryDate(moment(rResult?.items[0]?.delivery_date).toDate())

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

  // Validate state
  useEffect(() => {
    setErrDate(false)
  }, [startDate != null])

  useEffect(() => {
    sErrCustomer(false)
  }, [selectedCustomer != null])

  useEffect(() => {
    setErrDeliveryDate(false)
  }, [deliveryDate != null])

  useEffect(() => {
    setErrBranch(false)
  }, [selectedBranch != null])

  useEffect(() => {
    setErrStaff(false)
  }, [selectedStaff != null])

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
      } else if (value !== selectedBranch) {
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
              delivery_date: deliveryDate || null,
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
                delivery_date: deliveryDate || null,
              }
            })
            .sort((a, b) => b.sortIndex - a.sortIndex)

          setOption([...newData])
        } else if (typeOrder === '1' && quote === null) {
          isShow('error', `${dataLang?.N_quote_selection_required}`)
        }
      }
    }
  }

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

  // Validate submit
  const handleSubmitValidate = (e) => {
    e.preventDefault()
    let deliveryDateInOption = option.some((e) => e?.delivery_date === null)

    if (selectedBranch === null || selectedStaff === null) {
      setShowMoreInfo(true)
    }

    if (typeOrder === '0') {
      if (
        startDate == null ||
        selectedCustomer == null ||
        selectedBranch == null ||
        selectedStaff == null ||
        deliveryDateInOption === true
      ) {
        startDate == null && setErrDate(true)
        selectedCustomer == null && sErrCustomer(true)
        selectedBranch == null && setErrBranch(true)
        selectedStaff == null && setErrStaff(true)
        deliveryDateInOption === true && setErrDeliveryDate(true)
        // deliveryDate == null && setErrDeliveryDate(true)
        isShow('error', `${dataLang?.required_field_null}`)
      } else {
        setOnSending(true)
      }
    } else if (typeOrder === '1') {
      if (
        startDate == null ||
        selectedCustomer == null ||
        selectedBranch == null ||
        selectedStaff == null ||
        deliveryDateInOption === true ||
        quote == null
      ) {
        startDate == null && setErrDate(true)
        selectedCustomer == null && sErrCustomer(true)
        selectedBranch == null && setErrBranch(true)
        selectedStaff == null && setErrStaff(true)
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
    formData.append('branch_id', selectedBranch ? selectedBranch : '')
    formData.append('client_id', selectedCustomer ? selectedCustomer : '')
    formData.append('person_contact_id', selectedPersonalContact ? selectedPersonalContact : '')
    formData.append('staff_id', selectedStaff ? selectedStaff : '')
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
    },
    {
      label: `${dataLang?.sales_product_list || 'sales_product_list'}`,
      href: routerSalesOrder.home,
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
    <div className="overflow-hidden">
      <Head>
        <title>
          {id
            ? dataLang?.sales_product_edit_order || 'sales_product_edit_order'
            : dataLang?.sales_product_add_order || 'sales_product_add_order'}
        </title>
      </Head>
      <Container className="!h-max py-6 bg-gray-color">
        {statusExprired ? (
          <EmptyExprired />
        ) : (
          <React.Fragment>
            <Breadcrumb items={breadcrumbItems} className="3xl:text-sm 2xl:text-xs xl:text-[10px] lg:text-[10px]" />
          </React.Fragment>
        )}
        <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-typo-gray-5 capitalize font-medium mt-1 2xl:!mb-5 lg:!mb-3">
          {id
            ? dataLang?.sales_product_edit_order || 'sales_product_edit_order'
            : dataLang?.sales_product_add_order || 'sales_product_add_order'}
        </h2>
        <div className="flex w-full 3xl:gap-x-6 gap-x-4 items-stretch pb-40 relative">
          {/* Cột trái */}
          <div className="w-3/4">
            {/* Thông tin mặt hàng */}
            <div className="min-h-full max-h-[1132px] flex flex-col bg-white border border-[#919EAB3D] rounded-2xl p-4">
              <div className="flex justify-between items-center">
                {/* Heading */}
                <h2 className="w-full 2xl:text-[20px] xl:text-lg font-medium text-brand-color capitalize">
                  {dataLang?.item_information || 'item_information'}
                </h2>
                {/* Search Bar */}
                <SelectBySearch
                  placeholderText="Tìm kiếm mặt hàng"
                  allItems={typeOrder === '1' && quote === null ? [] : dataItems}
                  formatNumber={formatNumber}
                  selectedOptions={itemsAll}
                  idProductSale={idProductSale}
                  onChange={(value) => {
                    handleOnChangeInput('itemAll', value)
                  }}
                  options={option}
                  handleIncrease={handleIncrease}
                />
              </div>

              {sortedArr.length <= 0 && <EmptyData />}
              {sortedArr.length > 0 && (
                <React.Fragment>
                  {/* Thông tin mặt hàng Header */}
                  <div className="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] 2xl:gap-6 gap-4 items-center sticky top-0 py-2 mb-2 border-b border-gray-100">
                    <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize text-left truncate font-[400]">
                      {dataLang?.sales_product_item || 'sales_product_item'}
                    </h4>
                    <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize text-center truncate font-[400]">
                      {dataLang?.sales_product_quantity || 'sales_product_quantity'}
                    </h4>
                    <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize text-center truncate font-[400]">
                      {dataLang?.sales_product_unit_price || 'sales_product_unit_price'}
                    </h4>
                    {/* Chọn hoàng loạt % chiết khấu */}
                    <Dropdown
                      overlay={
                        <div className="border px-4 py-5 shadow-lg bg-white rounded-lg">
                          <p className="3xl:text-base font-normal font-deca text-secondary-color-text mb-2">
                            Chọn hoàng loạt % chiết khấu
                          </p>
                          <div className="flex items-center justify-center col-span-1 text-center">
                            <InPutNumericFormat
                              value={totalDiscount}
                              onValueChange={handleOnChangeInput.bind(this, 'totaldiscount')}
                              className="cursor-text appearance-none text-end 3xl:m-2 3xl:p-2 m-1 p-2 h-10 font-deca font-normal w-full focus:outline-none border rounded-lg 3xl:text-sm 3xl:font-semibold text-black-color 2xl:text-[12px] xl:text-[11px] text-[10px] border-gray-200"
                              isAllowed={isAllowedDiscount}
                            />
                          </div>
                        </div>
                      }
                      trigger={['click']}
                      placement="bottomLeft"
                      arrow
                    >
                      <div className="inline-flex items-center justify-between cursor-pointer w-[90%]">
                        <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize text-start truncate font-[400]">
                          {`${dataLang?.sales_product_rate_discount}` || 'sales_product_rate_discount'}
                        </h4>
                        <ArrowDown2 size={16} className="text-neutral-02 font-medium" />
                      </div>
                    </Dropdown>
                    <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize text-start font-[400] whitespace-nowrap">
                      {dataLang?.sales_product_after_discount || 'sales_product_after_discount'}
                    </h4>
                    {/* Chọn hoàng loạt % thuế */}
                    <Dropdown
                      overlay={
                        <div className="border px-4 py-5 shadow-lg bg-white rounded-lg relative z-0 group min-h-auto focus-within:min-h-[270px]">
                          <p className="3xl:text-base font-normal font-deca text-secondary-color-text mb-2">
                            Chọn hoàng loạt % thuế
                          </p>
                          <SelectComponent
                            options={taxOptions}
                            onChange={(value) => handleOnChangeInput('total_tax', value)}
                            value={totalTax ? '' : ''}
                            formatOptionLabel={(option) => (
                              <div className="flex items-center justify-start gap-1">
                                <h2>{option?.label}</h2>
                                <h2>{`(${option?.tax_rate})`}</h2>
                              </div>
                            )}
                            placeholder={dataLang?.sales_product_tax || 'sales_product_tax'}
                            hideSelectedOptions={false}
                            className={`3xl:text-[18px] 2xl:text-[16px] xl:text-[14px] text-[12px] border-transparent placeholder:text-slate-300 w-full bg-white rounded text-typo-gray-5 font-normal outline-none`}
                            isSearchable={true}
                            noOptionsMessage={() => 'Không có dữ liệu'}
                            closeMenuOnSelect={true}
                            menuPlacement="auto"
                            menuPosition="fixed"
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
                                boxShadow: 'none',
                                padding: '2.7px',
                                ...(state.isFocused && {
                                  border: '0 0 0 1px #92BFF7',
                                }),
                              }),
                            }}
                          />
                        </div>
                      }
                      trigger={['click']}
                      placement="bottomLeft"
                      arrow
                    >
                      <div className="inline-flex items-center justify-between cursor-pointer">
                        <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize col-span-1 text-start truncate font-[400]">
                          {dataLang?.sales_product_tax || 'sales_product_tax'}
                        </h4>
                        <ArrowDown2 size={16} className="text-neutral-02 font-medium" />
                      </div>
                    </Dropdown>
                    <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize text-start truncate font-[400]">
                      {dataLang?.sales_product_total_into_money || 'sales_product_total_into_money'}
                    </h4>
                  </div>
                  {/* Thông tin mặt hàng Body */}
                  <div className="scroll-bar-products-sale overflow-y-auto pr-4 divide-slate-200">
                    {sortedArr.map((e) => (
                      <div
                        className="grid items-center grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] 2xl:gap-6 gap-4 py-1"
                        key={e?.id}
                      >
                        {/* Mặt hàng */}
                        <div className="">
                          <div className="flex">
                            <div className="w-16 h-16 flex items-center justify-center">
                              <img
                                src={e?.item?.e?.images ?? '/icon/noimagelogo.png'}
                                alt={e?.item?.e?.name}
                                className="w-10 h-10 rounded-lg"
                              />
                            </div>
                            <div className="flex-1">
                              <h2 className="responsive-text-sm font-semibold text-brand-color mb-1 line-clamp-1">
                                {e?.item?.e?.name}
                              </h2>
                              <p className="text-typo-gray-2 3xl:text-[10px] text-[9px] font-normal mb-1">
                                Màu sắc: <span>{e?.item?.e?.product_variation}</span> - Size:{' '}
                                <span>
                                  {e?.item?.e?.product_variation_1 ? e?.item?.e?.product_variation_1 : 'None'}
                                </span>
                              </p>
                              <p className="text-typo-gray-2 3xl:text-[10px] text-[9px] font-normal">
                                ĐVT: <span>{e?.unit}</span> - Tồn:{' '}
                                <span>{formatNumber(e?.item?.e?.qty_warehouse)}</span>
                              </p>
                              <div className="flex items-center justify-center col-span-1">
                                <FaPencilAlt size={10} />
                                <input
                                  value={e?.note}
                                  onChange={(value) => handleOnChangeInputOption(e?.id, 'note', value)}
                                  name="optionEmail"
                                  placeholder="Ghi chú"
                                  type="text"
                                  className="focus:border-[#92BFF7] placeholder:responsive-text-xs 2xl:h-7 xl:h-5 mt-1 py-0 px-1 responsive-text-xs placeholder-slate-300 w-full bg-white rounded-[5.5px] text-[#52575E] font-normal outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Số lượng */}
                        <div className="flex items-center justify-center">
                          <div className="flex items-center justify-center 3xl:p-2 xl:p-[2px] p-[1px] border border-border-gray-2 rounded-3xl">
                            <button
                              onClick={() => handleDecrease(e?.id)}
                              className="2xl:scale-100 xl:scale-90 scale-75 text-black hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5 bg-primary-05 rounded-full"
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
                              } cursor-default appearance-none text-center responsive-text-sm font-normal w-full focus:outline-none`}
                            />
                            <button
                              onClick={() => handleIncrease(e.id)}
                              className="2xl:scale-100 xl:scale-90 scale-75 text-black hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-primary-05 rounded-full"
                            >
                              <Add size="16" className="scale-75 2xl:scale-100 xl:scale-90" />
                            </button>
                          </div>
                        </div>
                        {/* Đơn giá */}
                        <div className="flex items-center justify-center text-center">
                          <InPutMoneyFormat
                            value={e?.price}
                            onValueChange={(value) => handleOnChangeInputOption(e?.id, 'price', value)}
                            isAllowed={isAllowedNumber}
                            allowNegative={false}
                            className={`price-input-number ${
                              (e?.price == 0 && 'border-red-500') || (e?.price == '' && 'border-red-500')
                            } cursor-default appearance-none text-end 3xl:font-semibold responsive-text-sm font-normal w-full 3xl:my-2 my-1 mx-0 3xl:p-2 p-1 focus:outline-none border rounded-lg border-gray-200`}
                          />
                        </div>
                        {/* % Chiết khấu */}
                        <div className="flex items-center justify-center text-center">
                          <InPutNumericFormat
                            value={e?.discount}
                            onValueChange={(value) => {
                              console.log(value)
                              handleOnChangeInputOption(e?.id, 'discount', value)
                            }}
                            className={`cursor-text appearance-none text-end 3xl:my-2 my-1 3xl:p-2 p-1 font-normal w-full focus:outline-none border rounded-lg 3xl:font-semibold text-black-color responsive-text-sm border-gray-200`}
                            isAllowed={isAllowedDiscount}
                            isNumericString={true}
                          />
                        </div>
                        {/* Đơn giá sau chiết khấu */}
                        <div className="flex items-center justify-start text-right">
                          <h3 className={`cursor-text px-2 3xl:font-semibold responsive-text-sm text-black-color`}>
                            {formatNumber(e?.price_after_discount)}
                          </h3>
                        </div>
                        {/* % Thuế */}
                        <div className="w-full 3xl:px-2 px-0">
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
                            placeholder={'Chọn % thuế'}
                            hideSelectedOptions={false}
                            formatOptionLabel={taxRateLabel}
                            className={`border-transparent w-full bg-white text-typo-gray-5 font-normal outline-none whitespace-nowrap`}
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
                              control: (base) => ({
                                ...base,
                                boxShadow: 'none',
                                padding: '0px',
                                margin: '0px',
                                borderRadius: '8px',
                              }),
                            }}
                          />
                        </div>
                        {/* Thành tiền và nút xoá */}
                        <div className="flex items-center justify-between text-right">
                          <h3
                            className={`cursor-text px-2 3xl:font-semibold responsive-text-sm z-[99] text-black-color`}
                          >
                            {formatMoney(e?.total_amount)}
                          </h3>
                          {/* Nút xoá */}
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => {
                                setIdProductSale(e?.item?.value)
                                _HandleDelete.bind(this, e?.id)()
                              }}
                              type="button"
                              title="Xóa"
                              className="transition 3xl:size-6 size-5 responsive-text-sm bg-gray-300 text-black hover:text-typo-black-3/60 flex flex-col justify-center items-center border rounded-full"
                            >
                              <MdClear />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
          {/* Cột phải */}
          <div className="w-1/4">
            <div className="flex flex-col gap-y-6">
              {/* Cột thông tin chung */}
              <div className="w-full mx-auto px-4 bg-white border border-gray-200 rounded-2xl">
                <h2 className="2xl:text-[20px] xl:text-lg font-medium text-brand-color mt-6 mb-4 capitalize">
                  Thông tin
                </h2>
                {/* Tabs */}
                <OrderFormTabs
                  Info={() => {
                    return (
                      <div className="relative">
                        {/* Số đơn hàng */}
                        <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                          <InfoFormLabel label={dataLang?.sales_product_code || 'sales_product_code'} />
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
                              className={`responsive-text-base placeholder:text-sm z-10 pl-8 focus:border-[#0F4F9E] w-full text-gray-600 font-normal border border-[#d0d5dd] p-2 rounded-lg outline-none cursor-pointer`}
                            />
                          </div>
                        </div>
                        {/* Ngày tạo đơn */}
                        <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3 relative">
                          <InfoFormLabel isRequired label={'Ngày tạo đơn' || dataLang?.sales_product_date} />
                          <div className="w-full">
                            <div className="relative w-full flex flex-row custom-date-picker">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                <BsCalendarEvent color="#7a7a7a" />
                              </span>
                              <ConfigProvider locale={viVN}>
                                <DatePicker
                                  className="sales-product-date pl-8 placeholder:text-secondary-color-text-disabled cursor-pointer"
                                  status={errDate ? 'error' : ''}
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
                                      const dateString = date.toDate().toString()
                                      setStartDate(dateString)
                                    }
                                  }}
                                />
                              </ConfigProvider>
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
                          <InfoFormLabel
                            isRequired
                            label={dataLang?.sales_product_item_date || 'sales_product_item_date'}
                          />
                          <div className="w-full">
                            <div className="relative flex flex-row custom-date-picker">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                <BsCalendarEvent color="#7a7a7a" />
                              </span>
                              <ConfigProvider locale={viVN}>
                                <DatePicker
                                  className="sales-product-date pl-8 placeholder:text-secondary-color-text-disabled cursor-pointer"
                                  placeholder="Chọn ngày"
                                  format="DD/MM/YYYY"
                                  suffixIcon={null}
                                  value={deliveryDate ? dayjs(deliveryDate) : null}
                                  onChange={(date) => {
                                    if (date) {
                                      const dateString = date.toDate().toString()
                                      setDeliveryDate(dateString)
                                    } else {
                                      setDeliveryDate(null) // Xử lý khi user xóa date
                                    }
                                  }}
                                  status={errDeliveryDate ? 'error' : ''}
                                />
                              </ConfigProvider>
                            </div>
                            {errDeliveryDate && (
                              <label className="text-sm text-red-500">
                                {dataLang?.sales_product_err_delivery_date || 'Vui lòng chọn ngày giao hàng'}
                              </label>
                            )}
                          </div>
                        </div>
                        {/* Khách hàng */}
                        <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                          <InfoFormLabel isRequired label={'Khách hàng' || dataLang?.selectedCustomer} />
                          <div className="w-full">
                            <div className="relative flex flex-row">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                <LuBriefcase color="#7a7a7a" />
                              </span>
                              <SelectWithSort
                                title="Khách hàng"
                                placeholderText="Chọn khách hàng"
                                options={!!flagStateChange ? [] : dataCustomer}
                                value={selectedCustomer}
                                onChange={(value) => setSelectedCustomer(value)}
                                isError={errCustomer}
                              />
                            </div>
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
                                  <InfoFormLabel isRequired label={dataLang?.branch || 'Chi nhánh'} />
                                  <div className="w-full">
                                    <div className="relative flex flex-row">
                                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                        <PiMapPinLight color="#7a7a7a" />
                                      </div>
                                      <SelectWithSort
                                        title="Chi nhánh"
                                        placeholderText="Chọn chi nhánh"
                                        options={dataBranch}
                                        value={selectedBranch}
                                        onChange={(value) => setSelectedBranch(value)}
                                        isError={errBranch}
                                      />
                                    </div>
                                    {errBranch && (
                                      <label className="text-sm text-red-500">
                                        {dataLang?.sales_product_err_branch || 'sales_product_err_branch'}
                                      </label>
                                    )}
                                  </div>
                                </div>
                                {/* Nhân viên */}
                                <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                                  <InfoFormLabel
                                    isRequired
                                    label={dataLang?.sales_product_staff_in_charge || 'Nhân viên'}
                                  />
                                  <div className="w-full">
                                    <div className="relative flex flex-row">
                                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                        <FiUser color="#7a7a7a" />
                                      </span>
                                      <SelectWithSort
                                        title="Nhân viên"
                                        placeholderText="Chọn nhân viên"
                                        options={!!flagStateChange ? [] : dataStaffs}
                                        value={selectedStaff}
                                        onChange={(value) => setSelectedStaff(value)}
                                        isError={errStaff}
                                      />
                                    </div>
                                    {errStaff && (
                                      <label className="text-sm text-red-500">
                                        {dataLang?.sales_product_err_staff_in_charge ||
                                          'sales_product_err_staff_in_charge'}
                                      </label>
                                    )}
                                  </div>
                                </div>
                                {/* Người liên lạc */}
                                <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                                  <InfoFormLabel label={dataLang?.contact_person || 'Người liên lạc'} />
                                  <div className="w-full relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                      <FiUser color="#7a7a7a" />
                                    </span>
                                    <SelectWithSort
                                      title="Người liên lạc"
                                      placeholderText="Chọn người liên lạc"
                                      options={!!flagStateChange ? [] : dataPersonContact}
                                      value={selectedPersonalContact || contactPerson}
                                      onChange={(value) => setSelectedPersonalContact(value)}
                                    />
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
                    )
                  }}
                  Note={() => {
                    return (
                      <div className="w-full mx-auto">
                        <h4 className="responsive-text-base font-normal text-secondary-color-text mb-3 capitalize">
                          {dataLang?.sales_product_note || 'sales_product_note'}
                        </h4>
                        <div className="w-full pb-6">
                          <textarea
                            value={note}
                            placeholder="Nhập ghi chú tại đây"
                            onChange={handleOnChangeInput.bind(this, 'note')}
                            name="fname"
                            type="text"
                            className="focus:border-brand-color border-gray-200 placeholder-secondary-color-text-disabled placeholder:responsive-text-base w-full h-[68px] max-h-[68px] bg-[#ffffff] rounded-lg text-[#52575E] responsive-text-base font-normal px-3 py-2 border outline-none"
                          />
                        </div>
                      </div>
                    )
                  }}
                />
              </div>
              {/* Cột tổng cộng */}
              <div className="w-full mx-auto px-4 pt-6 pb-4 bg-white border border-gray-200 rounded-2xl">
                <h2 className="2xl:text-[20px] xl:text-lg font-medium text-brand-color mb-6 capitalize">
                  {'Tổng cộng' || dataLang?.price_quote_total}
                </h2>
                {/* Tổng tiền */}
                <div className="flex justify-between items-center mb-4 responsive-text-base font-normal text-black-color">
                  <h4 className="w-full">{dataLang?.price_quote_total || 'price_quote_total'}</h4>
                  <span>{isTotalMoney.totalPrice ? formatMoney(isTotalMoney.totalPrice) : '-'}</span>
                </div>
                {/* Tiền chiết khấu */}
                <div className="flex justify-between items-center mb-4 responsive-text-base font-normal text-secondary-color-text">
                  <h4 className="w-full">{dataLang?.sales_product_discount || 'sales_product_discount'}</h4>
                  <span>{isTotalMoney.totalDiscountPrice ? formatMoney(isTotalMoney.totalDiscountPrice) : '-'}</span>
                </div>
                {/* Tiền sau chiết khấu */}
                <div className="flex justify-between items-center mb-4 responsive-text-base font-normal text-secondary-color-text">
                  <h4 className="w-full">
                    {dataLang?.sales_product_total_money_after_discount || 'sales_product_total_money_after_discount'}
                  </h4>
                  <span>
                    {isTotalMoney.totalDiscountAfterPrice ? formatMoney(isTotalMoney.totalDiscountAfterPrice) : '-'}
                  </span>
                </div>
                {/* Tiền thuế */}
                <div className="flex justify-between items-center mb-4 responsive-text-base font-normal text-secondary-color-text">
                  <h4 className="w-full">{dataLang?.sales_product_total_tax || 'sales_product_total_tax'}</h4>
                  <span>{isTotalMoney.totalTax ? formatMoney(isTotalMoney.totalTax) : '-'}</span>
                </div>
                {/* Thành tiền */}
                <div className="flex justify-between responsive-text-base items-center mb-4">
                  <h4 className="w-full text-black font-semibold">
                    {dataLang?.sales_product_total_into_money || 'sales_product_total_into_money'}
                  </h4>
                  <span className="text-blue-color font-semibold">
                    {isTotalMoney.totalAmount ? formatMoney(isTotalMoney.totalAmount) : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Nút lưu và thoát */}
        <div className="fixed bottom-0 left-0 z-[999] w-full h-[68px] bg-white border-t border-gray-color flex gap-x-6 shadow-[0_-3px_12px_0_rgba(0,0,0,0.1)]">
          <div className="w-3/4"></div>
          <div className="w-1/4 flex justify-end items-center gap-2 py-4 3xl:px-5 px-3">
            <button
              onClick={() => router.push(routerSalesOrder.home)}
              dataLang={dataLang}
              className="2xl:px-5 2xl:pt-[10px] 2xl:pb-[30px] xl:px-4 xl:py-2 px-2 h-full bg-[#F2F3F5] 2xl:text-base text-sm font-normal rounded-lg"
            >
              Thoát
            </button>
            <Button
              onClick={handleSubmitValidate.bind(this)}
              dataLang={dataLang}
              loading={onSending}
              className="sale-order-btn-submit 3xl:p-5 2xl:p-4 xl:pt-[10px] xl:pb-[10px] h-full bg-light-blue-color text-white 2xl:text-base xl:text-sm font-medium rounded-lg"
            >
              Lưu
            </Button>
          </div>
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
    </div>
  )
}

export default SalesOrderForm
