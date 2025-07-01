import apiDeliveryReceipt from '@/Api/apiSalesExportProduct/deliveryReceipt/apiDeliveryReceipt'
import InfoFormLabel from '@/components/common/orderManagement/InfoFormLabel'
import OrderFormTabs from '@/components/common/orderManagement/OrderFormTabs'
import TableHeader from '@/components/common/orderManagement/TableHeader'
import Breadcrumb from '@/components/UI/breadcrumb/BreadcrumbCustom'
import { Customscrollbar } from '@/components/UI/common/Customscrollbar'
import { EmptyExprired } from '@/components/UI/common/EmptyExprired'
import { Container } from '@/components/UI/common/layout'
import EmptyData from '@/components/UI/emptyData'
import InPutMoneyFormat from '@/components/UI/inputNumericFormat/inputMoneyFormat'
import InPutNumericFormat from '@/components/UI/inputNumericFormat/inputNumericFormat'
import Loading from '@/components/UI/loading/loading'
import MultiValue from '@/components/UI/mutiValue/multiValue'
import PopupConfim from '@/components/UI/popupConfim/popupConfim'
import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from '@/constants/delete/deleteItems'
import { FORMAT_MOMENT } from '@/constants/formatDate/formatDate'
import { useBranchList } from '@/hooks/common/useBranch'
import { useClientComboboxByFilterBranch } from '@/hooks/common/useClients'
import { useStaffOptions } from '@/hooks/common/useStaffs'
import { useTaxList } from '@/hooks/common/useTaxs'
import useFeature from '@/hooks/useConfigFeature'
import useSetingServer from '@/hooks/useConfigNumber'
import useStatusExprired from '@/hooks/useStatusExprired'
import useToast from '@/hooks/useToast'
import { useToggle } from '@/hooks/useToggle'
import applyFontFamily from '@/utils/helpers/applyFontFamily'
import { isAllowedDiscount, isAllowedNumber } from '@/utils/helpers/common'
import { formatMoment } from '@/utils/helpers/formatMoment'
import formatMoneyConfig from '@/utils/helpers/formatMoney'
import formatNumberConfig from '@/utils/helpers/formatnumber'
import { PopupParent } from '@/utils/lib/Popup'
import { useQuery } from '@tanstack/react-query'
import { Button, ConfigProvider, DatePicker, Dropdown, Empty } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import { Add, ArrowDown2, ArrowUp2, Minus, TableDocument } from 'iconsax-react'
import moment from 'moment/moment'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiFillPlusCircle } from 'react-icons/ai'
import { BsCalendarEvent } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import { FaPencilAlt } from 'react-icons/fa'
import { LuBriefcase } from 'react-icons/lu'
import { MdClear } from 'react-icons/md'
import { PiMapPinLight, PiUser } from 'react-icons/pi'
import { TbNotes } from 'react-icons/tb'
import { useSelector } from 'react-redux'
import Select, { components } from 'react-select'
import { routerDeliveryReceipt } from 'routers/sellingGoods'
import { v4 as uuidv4 } from 'uuid'
import PopupAddress from './components/PopupAddress'
import SelectWithRadio from './components/SelectWithRadio'
import { useDeliveryReceipItemAll } from './hooks/useDeliveryReceipItemAll'

const DeliveryReceiptForm = (props) => {
  // Router and API hooks
  const router = useRouter()

  const dataSeting = useSetingServer()

  const id = router.query?.id

  const dataLang = props?.dataLang

  const isShow = useToast()

  const { isOpen, isKeyState, handleQueryId } = useToggle()

  const statusExprired = useStatusExprired()

  const authState = useSelector((state) => state.auth)

  // State Variables
  const [openSelectSearch, setOpenSelectSearch] = useState(false)

  const [showMoreInfo, setShowMoreInfo] = useState(false)

  const [onFetchingProductOrder, sOnFetchingProductOrder] = useState(false)

  const [onFetchingAddress, sOnFetchingAddress] = useState(false)

  const [openPopupAddress, sOpenPopupAddress] = useState(false)

  const [onSending, sOnSending] = useState(false)

  const [generalTax, sThuetong] = useState()

  const [generalDiscount, sChietkhautong] = useState(0)

  const [code, sCode] = useState('')

  const [startDate, sStartDate] = useState(new Date())

  const [note, sNote] = useState('')

  const [date, sDate] = useState(moment().format(FORMAT_MOMENT.DATE_TIME_LONG))

  const [dataProductOrder, sDataProductOrder] = useState([])

  const [dataAddress, sDataAddress] = useState([])

  const { dataMaterialExpiry, dataProductSerial, dataProductExpiry } = useFeature()

  const [listData, sListData] = useState([])

  const [idBranch, sIdBranch] = useState(null)

  const [idClient, sIdClient] = useState(null)

  const [idContactPerson, sIdContactPerson] = useState(null)

  const [idStaff, sIdStaff] = useState(null)

  const [idProductOrder, sIdProductOrder] = useState(null)

  const [idAddress, sIdAddress] = useState(null)

  const [itemAll, sItemAll] = useState([])

  const [load, sLoad] = useState(false)

  const [errClient, sErrClient] = useState(false)

  const [errStaff, sErrStaff] = useState(false)

  const [errProductOrder, sErrProductOrder] = useState(false)

  const [errDate, sErrDate] = useState(false)

  const [errAddress, sErrAddress] = useState(false)

  const [errBranch, sErrBranch] = useState(false)

  const [errWarehouse, sErrWarehouse] = useState(false)

  const [errQuantity, sErrQuantity] = useState(false)

  const [errSurvive, sErrSurvive] = useState(false)

  const [errPrice, sErrPrice] = useState(false)

  const [errSurvivePrice, sErrSurvivePrice] = useState(false)

  // API Hooks
  const { data: dataTasxes = [] } = useTaxList()

  const { data: dataBranch = [] } = useBranchList()

  const { data: dataStaff = [] } = useStaffOptions({
    'filter[branch_id]': idBranch !== null ? +idBranch?.value : null,
  })

  const { data: dataClient = [] } = useClientComboboxByFilterBranch(idBranch, {
    'filter[branch_id]': idBranch != null ? idBranch.value : null,
  })

  const { data: dataItems } = useDeliveryReceipItemAll({
    'filter[order_id]': idProductOrder !== null ? +idProductOrder.value || +idProductOrder : null,
    'filter[delivery_id]': id ? id : '',
  })

  // Gắn chi nhánh đầu tiên vào state idBranch
  useEffect(() => {
    if (dataBranch.length > 0) {
      sIdBranch(dataBranch[0])
    }
  }, [dataBranch])

  // Gắn người dùng đầu tiên vào state idStaff
  useEffect(() => {
    if (dataStaff.length > 0 && authState?.staff_id) {
      const staff = dataStaff.find((e) => e.value === authState?.staff_id)
      sIdStaff(staff)
    }
  }, [dataStaff])

  const formatNumber = (number) => {
    return formatNumberConfig(+number, dataSeting)
  }

  const formatMoney = (number) => {
    return formatMoneyConfig(+number, dataSeting)
  }

  const _HandleClosePopupAddress = (e) => {
    sOpenPopupAddress(e)
    !e && _ServerFetching_Address()
  }

  const resetAllStates = () => {
    sCode('')
    sStartDate(new Date())
    sIdBranch(null)
    sIdClient(null)
    sIdContactPerson(null)
    sIdProductOrder(null)
    sIdStaff(null)
    sIdAddress(null)
    sNote('')
    sErrBranch(false)
    sErrDate(false)
    sErrClient(false)
    sErrProductOrder(false)
    sErrQuantity(false)
    sErrStaff(false)
    sErrSurvive(false)
    sErrSurvivePrice(false)
    sErrWarehouse(false)
  }

  // useEffect(() => {
  //   router.query && resetAllStates()
  // }, [router.query])

  const options = dataItems?.map((e) => ({
    label: `${e.name}
            <span style={{display: none}}>${e.code}</span>
            <span style={{display: none}}>${e.product_variation} </span>
            <span style={{display: none}}>${e.serial} </span>
            <span style={{display: none}}>${e.lot} </span>
            <span style={{display: none}}>${e.expiration_date} </span>
            <span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
    value: e.id,
    e,
  }))

  const { isFetching } = useQuery({
    queryKey: ['api_detail_page', id],
    queryFn: async () => {
      const rResult = await apiDeliveryReceipt.apiDetailPage(id)

      sListData(
        rResult?.items.map((e) => {
          const child = e?.child.map((ce) => ({
            id: Number(ce?.id),
            idChildBackEnd: Number(ce?.id),
            disabledDate:
              (e.item?.text_type == 'material' && dataMaterialExpiry?.is_enable == '1' && false) ||
              (e.item?.text_type == 'material' && dataMaterialExpiry?.is_enable == '0' && true) ||
              (e.item?.text_type == 'products' && dataProductExpiry?.is_enable == '1' && false) ||
              (e.item?.text_type == 'products' && dataProductExpiry?.is_enable == '0' && true),
            warehouse: {
              label: e?.item?.warehouse_location?.location_name,
              value: e?.item?.warehouse_location?.id,
              warehouse_name: e?.item?.warehouse_location?.warehouse_name,
              qty: e?.item?.warehouse_location?.quantity,
              lot: e?.item?.warehouse_location?.lot,
              date: e?.item?.warehouse_location?.expiration_date,
              serial: e?.item?.warehouse_location?.serial,
            },
            dataWarehouse: e?.item?.warehouseList?.map((s) => ({
              label: s?.location_name,
              value: s?.id,
              warehouse_name: s?.warehouse_name,
              qty: s?.quantity,
              lot: s?.lot,
              date: s?.expiration_date,
              serial: s?.serial,
            })),
            quantityStock: e?.item?.quantity,
            quantityDelive: e?.item?.quantity_delivery,
            unit: e?.item?.unit_name,
            quantity: Number(ce?.quantity),
            price: Number(ce?.price),
            discount: Number(ce?.discount_percent_item),
            tax: {
              tax_rate: ce?.tax_rate_item,
              value: ce?.tax_id_item,
              label: ce?.tax_name_item || 'Miễn thuế',
            },
            note: ce?.note_item,
          }))
          return {
            id: e?.item?.id,
            idParenBackend: e?.item?.id,
            matHang: {
              e: e?.item,
              label: `${e.item?.name} <span style={{display: none}}>${
                e.item?.code + e.item?.product_variation + e.item?.text_type + e.item?.unit_name
              }</span>`,
              value: e.item?.id,
            },
            child: child,
          }
        })
      )
      sCode(rResult?.reference_no)
      sIdBranch({
        label: rResult?.branch_name,
        value: rResult?.branch_id,
      })
      sStartDate(moment(rResult?.date).toDate())
      sNote(rResult?.note)
      sIdAddress({ label: rResult?.name_address_delivery, value: rResult?.address_delivery_id })
      sIdClient({ label: rResult?.customer_name, value: rResult?.customer_id })
      sIdStaff({ label: rResult?.staff_full_name, value: rResult?.staff_id })
      sIdProductOrder({ label: rResult?.order_code, value: rResult?.order_id })
      sIdContactPerson(
        rResult?.person_contact_id != 0 && {
          label: rResult?.person_contact_name,
          value: rResult?.person_contact_id,
        }
      )

      return rResult
    },
    enabled: !!id,
  })

  const _ServerFetching_ProductOrder = async () => {
    let data = new FormData()

    data.append('branch_id', idBranch !== null ? +idBranch?.value || +idBranch : null)

    data.append('client_id', idClient !== null ? +idClient.value || +idClient : null)

    id && data.append('filter[delivery_id]', id ? id : '')

    try {
      const { results } = await apiDeliveryReceipt.apiSearchOrdersToCustomer(data)

      sDataProductOrder(results?.map((e) => ({ label: e.text, value: e.id })))

      sOnFetchingProductOrder(false)
    } catch (error) {}
  }

  const _ServerFetching_Address = async () => {
    let data = new FormData()
    data.append('client_id', idClient !== null ? +idClient.value || +idClient : null)
    try {
      const rResult = await apiDeliveryReceipt.apiGetShippingClient(data)

      sDataAddress(rResult?.map((e) => ({ label: e.name, value: e.id })))

      sOnFetchingAddress(false)
    } catch (error) {}
  }

  const handleSaveStatus = () => {
    isKeyState?.sListData([])
    isKeyState?.sId(isKeyState?.value)
    isKeyState?.sIdStaff && isKeyState?.sIdStaff(null)
    isKeyState?.idEmty && isKeyState?.idEmty(null)
    handleQueryId({ status: false })
  }

  const handleCancleStatus = () => {
    isKeyState?.sId({ ...isKeyState?.id })
    handleQueryId({ status: false })
  }

  const checkListData = (value, sListData, sId, id, idEmty, sIdStaff) => {
    return handleQueryId({
      status: true,
      initialKey: { value, sListData, sId, id, idEmty, sIdStaff },
    })
  }

  const _HandleChangeInput = (type, value) => {
    console.log('type, value', type, value)

    if (type == 'code') {
      sCode(value.target.value)
    } else if (type === 'date') {
      sDate(formatMoment(value.target.value, FORMAT_MOMENT.DATE_TIME_LONG))
    } else if (type === 'idClient' && idClient != value) {
      if (listData?.length > 0) {
        checkListData(value, sListData, sIdClient, idClient, sIdProductOrder)
      } else {
        sIdClient(value)
        sIdProductOrder(null)
        sIdContactPerson(null)
        if (value == null) {
          sDataProductOrder([])
        }
      }
    } else if (type === 'idContactPerson') {
      sIdContactPerson(value)
    } else if (type === 'idStaff' && idStaff != value) {
      sIdStaff(value)
    } else if (type === 'idProductOrder' && idProductOrder != value) {
      if (listData?.length > 0) {
        checkListData(value, sListData, sIdProductOrder, idProductOrder)
      } else {
        sIdProductOrder(value)
      }
    } else if (type === 'idAddress') {
      sIdAddress(value)
    } else if (type === 'itemAll' && itemAll != value) {
      sItemAll(value)
      if (value?.length === 0) {
        sListData([])
      } else if (value?.length > 0) {
        const newData = value?.map((e, index) => {
          const parent = _DataValueItem(e).parent
          return parent
        })
        sListData([...newData])
      }
    } else if (type === 'note') {
      sNote(value.target.value)
    } else if (type == 'branch' && idBranch != value) {
      if (listData?.length > 0) {
        checkListData(value, sListData, sIdBranch, idBranch, sIdClient, sIdStaff)
      } else {
        sIdBranch(value)
        sIdClient(null)
        sIdProductOrder(null)
        sIdContactPerson(null)
        sIdStaff(null)
      }
    } else if (type == 'generalTax') {
      sThuetong(value)
      if (listData?.length > 0) {
        const newData = listData.map((e) => {
          const newChild = e?.child.map((ce) => {
            return { ...ce, tax: value }
          })
          return { ...e, child: newChild }
        })
        sListData(newData)
      }
    } else if (type == 'generalDiscount') {
      sChietkhautong(value?.value)
      if (listData?.length > 0) {
        const newData = listData.map((e) => {
          const newChild = e?.child.map((ce) => {
            return { ...ce, discount: value?.value }
          })
          return { ...e, child: newChild }
        })
        sListData(newData)
      }
    }
  }

  const handleClearDate = (type) => {
    if (type === 'effectiveDate') {
    }
    if (type === 'startDate') {
      sStartDate(new Date())
    }
  }
  const handleTimeChange = (date) => {
    sStartDate(date)
  }

  useEffect(() => {
    sErrDate(false)
  }, [date != null])

  useEffect(() => {
    sErrClient(false)
  }, [idClient != null])

  useEffect(() => {
    sErrStaff(false)
  }, [idStaff != null])

  useEffect(() => {
    sErrBranch(false)
  }, [idBranch != null])

  useEffect(() => {
    sErrProductOrder(false)
  }, [idProductOrder != null])

  useEffect(() => {
    sErrAddress(false)
  }, [idAddress != null])

  useEffect(() => {
    if (idBranch == null) {
      sIdClient(null)
      sIdProductOrder(null)
      sDataProductOrder([])
      sIdStaff(null)
    }
  }, [idBranch])

  useEffect(() => {
    idBranch != null && idClient != null && sOnFetchingProductOrder(true)
  }, [idBranch, idClient])

  useEffect(() => {
    if (idClient == null) {
      sIdProductOrder(null)
      sDataProductOrder([])
    } else {
      sOnFetchingAddress(true)
    }
  }, [idClient])

  const useFetchingEffect = (condition, serverFetchFunction) => {
    useEffect(() => {
      if (condition) {
        serverFetchFunction()
      }
    }, [condition, serverFetchFunction])
  }

  useFetchingEffect(onFetchingProductOrder, _ServerFetching_ProductOrder)
  useFetchingEffect(onFetchingAddress, _ServerFetching_Address)

  const taxOptions = [{ label: 'Miễn thuế', value: '0', tax_rate: '0' }, ...dataTasxes]

  const _DataValueItem = (value) => {
    const newChild = {
      id: uuidv4(),
      idChildBackEnd: '',
      disabledDate:
        (value?.e?.text_type === 'material' && dataMaterialExpiry?.is_enable === '1' && false) ||
        (value?.e?.text_type === 'material' && dataMaterialExpiry?.is_enable === '0' && true) ||
        (value?.e?.text_type === 'products' && dataProductExpiry?.is_enable === '1' && false) ||
        (value?.e?.text_type === 'products' && dataProductExpiry?.is_enable === '0' && true),
      quantityStock: value?.e?.quantity,
      quantityDelive: value?.e?.quantity_delivery,
      warehouse: null,
      dataWarehouse: value?.e?.warehouseList?.map((e) => ({
        label: e?.location_name,
        value: e?.id,
        warehouse_name: e?.warehouse_name,
        qty: e?.quantity,
        lot: e?.lot,
        date: e?.expiration_date,
        serial: e?.serial,
      })),
      unit: value?.e?.unit_name,
      price: Number(value?.e?.price),
      quantity: value?.e?.quantity,
      discount: generalDiscount ? generalDiscount : Number(value?.e?.discount_percent_item),
      tax: generalTax
        ? generalTax
        : {
            label: value?.e?.tax_name == null ? 'Miễn thuế' : value?.e?.tax_name,
            value: value?.e?.tax_id_item,
            tax_rate: value?.e?.tax_rate_item,
          },
      note: value?.e?.note_item,
    }
    return {
      newChild: newChild,
      parent: {
        id: uuidv4(),
        matHang: value,
        idParenBackend: '',
        child: [newChild],
      },
    }
  }

  const _HandleAddChild = (parentId, value) => {
    const newData = listData?.map((e) => {
      if (e?.id === parentId) {
        const { newChild } = _DataValueItem(value)
        return { ...e, child: [...e.child, newChild] }
      } else {
        return e
      }
    })
    sListData(newData)
  }

  const _HandleAddParent = (value) => {
    const checkData = listData?.some((e) => e?.matHang?.value === value?.value)
    if (!checkData) {
      const { parent } = _DataValueItem(value)
      sListData([parent, ...listData])
    } else {
      isShow('error', `${dataLang?.returns_err_ItemSelect || 'returns_err_ItemSelect'}`)
    }
  }

  const _HandleDeleteChild = (parentId, childId) => {
    const newData = listData
      .map((e) => {
        if (e.id === parentId) {
          const newChild = e.child?.filter((ce) => ce?.id !== childId)
          return { ...e, child: newChild }
        }
        return e
      })
      .filter((e) => e.child?.length > 0)
    sItemAll([...newData])
    sListData([...newData])
  }

  const _HandleDeleteAllChild = (parentId) => {
    const newData = listData
      .map((e) => {
        if (e.id === parentId) {
          const newChild = e.child?.filter((ce) => ce?.warehouse !== null)
          return { ...e, child: newChild }
        }
        return e
      })
      .filter((e) => e.child?.length > 0)
    sListData([...newData])
  }

  const _HandleChangeChild = (parentId, childId, type, value) => {
    const newData = listData.map((e) => {
      if (e?.id !== parentId) return e
      const newChild = e.child?.map((ce) => {
        if (ce?.id !== childId) return ce
        const quantityAmount = +ce?.quantityStock - +ce?.quantityDelive
        const totalSoLuong = e.child.reduce((sum, opt) => sum + parseFloat(opt?.quantity || 0), 0)
        const checkWarehouse = e?.child?.some((i) => i?.warehouse?.value === value?.value)
        switch (type) {
          case 'quantity':
            sErrSurvive(false)
            ce.quantity = Number(value?.value)
            FunCheckQuantity(parentId, childId)
            break

          case 'increase':
            sErrSurvive(false)
            if (+ce.quantity === +ce?.warehouse?.qty) {
              isShow(
                'error',
                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(+ce?.warehouse?.qty)} số lượng tồn kho`,
                3000
              )
            } else if (+ce.quantity === quantityAmount) {
              isShow(
                'error',
                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(quantityAmount)} số lượng chưa giao`,
                3000
              )
            } else if (+ce.quantity > +ce?.warehouse?.qty) {
              isShow(
                'error',
                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(+ce?.warehouse?.qty)} số lượng tồn kho`,
                3000
              )
            } else if (+ce.quantity > quantityAmount) {
              isShow(
                'error',
                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(quantityAmount)} số lượng chưa giao`,
                3000
              )
            } else {
              ce.quantity = Number(ce?.quantity) + 1
            }
            FunCheckQuantity(parentId, childId)
            break

          case 'decrease':
            sErrSurvive(false)
            ce.quantity = Number(ce?.quantity) - 1
            break

          case 'price':
            sErrSurvivePrice(false)
            ce.price = Number(value?.value)
            break

          case 'discount':
            ce.discount = Number(value?.value)
            break

          case 'note':
            ce.note = value?.target.value
            break

          case 'warehouse':
            if (!checkWarehouse && +ce?.quantity > +value?.qty) {
              isShow('error', `Số lượng chưa giao vượt quá ${formatNumber(+value?.qty)} số lượng tồn kho`)
              ce.warehouse = value
              ce.quantity = value?.qty
              FunCheckQuantity(parentId, childId)
            } else if (!checkWarehouse && totalSoLuong > quantityAmount) {
              FunCheckQuantity(parentId, childId)
              ce.warehouse = value
            } else if (checkWarehouse) {
              isShow('error', `Kho - vị trí kho đã được chọn`)
            } else {
              ce.warehouse = value
            }
            break

          case 'tax':
            ce.tax = value
            break

          default:
        }

        return { ...ce }
      })

      return { ...e, child: newChild }
    })

    sListData([...newData])
  }

  const FunCheckQuantity = (parentId, childId) => {
    const e = listData.find((item) => item?.id == parentId)
    if (!e) return

    const ce = e.child.find((child) => child?.id == childId)
    if (!ce) return

    const checkChild = e.child.reduce((sum, opt) => sum + parseFloat(opt?.quantity || 0), 0)
    const quantityAmount = +ce?.quantityStock - +ce?.quantityDelive

    if (checkChild > quantityAmount) {
      isShow('error', `Tổng số lượng vượt quá ${formatNumber(quantityAmount)} số lượng chưa giao`)
      ce.quantity = ''
      HandTimeout()
      sErrQuantity(true)
    }
    if (checkChild > +ce?.warehouse?.qty) {
      isShow('error', `Tổng số lượng vượt quá ${formatNumber(+ce?.warehouse?.qty)} số lượng tồn`)
      ce.quantity = ''
      sErrQuantity(true)
      HandTimeout()
    }
  }

  const HandTimeout = () => {
    setTimeout(() => {
      sLoad(true)
    }, 500)
    setTimeout(() => {
      sLoad(false)
    }, 1000)
  }

  const _HandleChangeValue = (parentId, value) => {
    const checkData = listData?.some((e) => e?.matHang?.value === value?.value)
    if (!checkData) {
      const newData = listData?.map((e) => {
        if (e?.id === parentId) {
          const { parent } = _DataValueItem(value)
          return parent
        } else {
          return e
        }
      })
      sListData([...newData])
    } else {
      isShow('error', `${dataLang?.returns_err_ItemSelect || 'returns_err_ItemSelect'}`)
    }
  }

  const handleSelectAll = (type) => {
    if (type == 'addAll') {
      const newData = [...dataItems]?.map((e) => {
        const { parent } = _DataValueItem({ e: e })
        return parent
      })
      sListData([...newData])
      return
    } else {
      sListData([])
      return
    }
  }

  const MenuList = (props) => {
    return (
      <components.MenuList {...props}>
        {dataItems?.length > 0 && (
          <div className="grid items-center grid-cols-2 cursor-pointer">
            <div
              className="hover:bg-slate-200 p-2 col-span-1 text-center 3xl:text-[16px] 2xl:text-[16px] xl:text-[14px] text-[13px] "
              onClick={() => handleSelectAll('addAll')}
            >
              Chọn tất cả
            </div>
            <div
              className="hover:bg-slate-200 p-2 col-span-1 text-center 3xl:text-[16px] 2xl:text-[16px] xl:text-[14px] text-[13px]"
              onClick={() => handleSelectAll('deleteAll')}
            >
              Bỏ chọn tất cả
            </div>
          </div>
        )}
        {props.children}
      </components.MenuList>
    )
  }

  const selectItemsLabel = (option) => {
    let quantityUndelived = +option?.e?.quantity - +option?.e?.quantity_delivery
    return (
      <div className="flex items-start p-2 hover:bg-gray-100 rounded-md cursor-pointer font-deca">
        <div className="flex items-center gap-3">
          <img
            src={option.e?.images ?? '/icon/noimagelogo.png'}
            alt={option?.e.name}
            className="w-10 h-10 object-cover rounded-md"
          />
          <div className="flex flex-col gap-1 3xl:text-[10px] text-[9px] overflow-hidden w-full">
            <div className="font-semibold responsive-text-sm truncate text-black">{option.e.name}</div>
            <div className="text-blue-600 font-normal truncate">
              {option.e?.code}: {option.e?.product_variation}
            </div>
            <div className="flex items-center gap-1 text-neutral-03 font-normal">
              <div className="flex items-center gap-1">
                <h5>{dataLang[option.e?.text_type]}</h5>
                <h5>{dataLang?.delivery_receipt_quantity || 'delivery_receipt_quantity'}:</h5>
                <h5>{option.e?.quantity ? formatNumber(+option.e?.quantity) : '0'} - </h5>
              </div>
              <div className="flex items-center gap-1">
                <h5>{dataLang?.delivery_receipt_quantity_undelivered_order || 'Số lượng'}:</h5>
                <h5>{quantityUndelived ? formatNumber(+quantityUndelived) : '0'} - </h5>
              </div>
              <div className="flex items-center gap-1">
                <h5>
                  {dataLang?.delivery_receipt_quantity_delivered_order || 'delivery_receipt_quantity_delivered_order'}:
                </h5>
                <h5>{option.e?.quantity_delivery ? formatNumber(+option.e?.quantity_delivery) : '0'}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const _HandleSubmit = (e) => {
    e.preventDefault()

    const hasNullWarehouse = listData.some((item) =>
      item.child?.some(
        (childItem) =>
          childItem.warehouse === null ||
          (id && (childItem.warehouse?.label === null || childItem.warehouse?.warehouse_name === null))
      )
    )

    const hasNullQuantity = listData.some((item) =>
      item.child?.some(
        (childItem) => childItem.quantity === null || childItem.quantity === '' || childItem.quantity == 0
      )
    )
    const hasNullPrice = listData.some((item) =>
      item.child?.some((childItem) => childItem.price === null || childItem.price === '' || childItem.price == 0)
    )

    const isTotalExceeded = listData?.some(
      (e) =>
        !hasNullWarehouse &&
        e.child?.some((opt) => {
          const quantity = parseFloat(opt?.quantity) || 0
          const qty = parseFloat(opt?.warehouse?.qty) || 0
          return quantity > qty
        })
    )

    const isEmpty = listData?.length === 0 ? true : false
    if (
      idClient == null ||
      idStaff == null ||
      idBranch == null ||
      idProductOrder == null ||
      idAddress == null ||
      hasNullWarehouse ||
      hasNullQuantity ||
      hasNullPrice ||
      isTotalExceeded ||
      isEmpty
    ) {
      idClient == null && sErrClient(true)
      idAddress == null && sErrAddress(true)
      idStaff == null && sErrStaff(true)
      idBranch == null && sErrBranch(true)
      idProductOrder == null && sErrProductOrder(true)
      hasNullWarehouse && sErrWarehouse(true)
      hasNullQuantity && sErrQuantity(true)
      hasNullPrice && sErrPrice(true)
      if (isEmpty) {
        isShow('error', `Chưa nhập thông tin mặt hàng`)
      } else if (isTotalExceeded) {
        sErrSurvive(true)
        isShow('error', `${dataLang?.returns_err_QtyNotQexceed || 'returns_err_QtyNotQexceed'}`)
      } else if (hasNullPrice) {
        sErrSurvivePrice(true)
        isShow('error', `${'Vui lòng nhập đơn giá'}`)
      } else {
        isShow('error', `${dataLang?.required_field_null}`)
      }
    } else {
      sOnSending(true)
    }
  }
  const _ServerSending = async () => {
    let formData = new FormData()
    formData.append('code', code ? code : '')
    formData.append(
      'date',
      formatMoment(startDate, FORMAT_MOMENT.DATE_TIME_LONG) ? formatMoment(startDate, FORMAT_MOMENT.DATE_TIME_LONG) : ''
    )
    formData.append('branch_id', idBranch?.value ? idBranch?.value : '')
    formData.append('client_id', idClient?.value ? idClient?.value : '')
    formData.append('person_contact_id', idContactPerson?.value ? idContactPerson?.value : '')
    formData.append('address_id', idAddress?.value ? idAddress?.value : '')
    formData.append('staff_id', idStaff?.value ? idStaff?.value : '')
    formData.append('product_order_id', idProductOrder?.value ? idProductOrder?.value : '')
    formData.append('note', note ? note : '')
    listData.forEach((item, index) => {
      formData.append(`items[${index}][id]`, id ? item?.idParenBackend : '')
      formData.append(`items[${index}][item]`, item?.matHang?.value)
      item?.child?.forEach((childItem, childIndex) => {
        formData.append(`items[${index}][child][${childIndex}][row_id]`, id ? childItem?.idChildBackEnd : '')
        formData.append(`items[${index}][child][${childIndex}][warehouse_id]`, childItem?.warehouse?.value || 0)
        formData.append(`items[${index}][child][${childIndex}][quantity]`, childItem?.quantity)
        formData.append(`items[${index}][child][${childIndex}][price]`, childItem?.price)
        formData.append(`items[${index}][child][${childIndex}][discount]`, childItem?.discount)
        formData.append(`items[${index}][child][${childIndex}][tax]`, childItem?.tax?.value)
        formData.append(`items[${index}][child][${childIndex}][note]`, childItem?.note ? childItem?.note : '')
      })
    })
    try {
      const { isSuccess, message } = await apiDeliveryReceipt.apiHangdingDeliveryReceipt(id, formData)
      if (isSuccess) {
        isShow('success', `${dataLang[message] || message}`)
        resetAllStates()
        sListData([])
        router.push(routerDeliveryReceipt.home)
        sOnSending(false)
      } else {
        isShow('error', `${dataLang[message] || message}`)
      }
    } catch (error) {}
  }

  useEffect(() => {
    onSending && _ServerSending()
  }, [onSending])

  const breadcrumbItems = [
    {
      label: `${dataLang?.returnSales_title || 'returnSales_title'}`,
    },
    {
      label: `${dataLang?.delivery_receipt_list || 'delivery_receipt_list'}`,
      href: routerDeliveryReceipt.home,
    },
    {
      label: `${
        id
          ? dataLang?.delivery_receipt_edit || 'delivery_receipt_edit'
          : dataLang?.delivery_receipt_add || 'delivery_receipt_add'
      }`,
    },
  ]
  console.log('listData', listData)

  return (
    <div className="overflow-hidden">
      <Head>
        <title>
          {id
            ? dataLang?.delivery_receipt_edit || 'delivery_receipt_edit'
            : dataLang?.delivery_receipt_add || 'delivery_receipt_add'}
        </title>
      </Head>
      <Container className="!h-max py-6 bg-gray-color">
        {statusExprired ? (
          <EmptyExprired />
        ) : (
          <Breadcrumb items={breadcrumbItems} className="3xl:text-sm 2xl:text-xs xl:text-[10px] lg:text-[10px]" />
        )}
        <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-typo-gray-5 capitalize font-medium mt-1 2xl:!mb-5 lg:!mb-3">
          {id ? 'Sửa Phiếu Giao Hàng' : 'Thêm Phiếu Giao Hàng'}
        </h2>
        <div className="flex w-full 3xl:gap-x-6 gap-x-4 items-stretch pb-40 relative">
          {/* Cột trái */}
          <div className="w-4/5">
            <div className="min-h-full max-h-[1132px] flex flex-col bg-white border border-[#919EAB3D] rounded-2xl p-4">
              {/* Thông tin mặt hàng */}
              <div className="flex justify-between items-center">
                {/* Heading */}
                <h2 className="w-full 2xl:text-[20px] xl:text-lg font-medium text-brand-color capitalize">
                  {dataLang?.item_information || 'item_information'}
                </h2>
                {/* Search Bar */}
                <div className="relative w-full">
                  <Select
                    options={idProductOrder ? options : []}
                    closeMenuOnSelect={false}
                    onChange={_HandleChangeInput.bind(this, 'itemAll')}
                    value={itemAll?.value ? itemAll?.value : listData?.map((e) => e?.matHang)}
                    isMulti
                    maxShowMuti={0}
                    components={{ MenuList, MultiValue }}
                    formatOptionLabel={(option) => selectItemsLabel(option)}
                    placeholder={'Chọn nhanh mặt hàng'}
                    hideSelectedOptions={false}
                    className="rounded-md bg-white 3xl:text-[16px] 2xl:text-[10px] xl:text-[13px] text-[12.5px]"
                    isSearchable={true}
                    noOptionsMessage={() => (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />
                    )}
                    menuPortalTarget={document.body}
                    style={{
                      border: 'none',
                      boxShadow: 'none',
                      outline: 'none',
                    }}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: '#0000000',
                        primary50: 'transparent',
                        primary: 'transparent',
                      },
                    })}
                    styles={applyFontFamily({
                      placeholder: (base) => ({
                        ...base,
                        color: '#cbd5e1',
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 100,
                      }),
                      control: (base, state) => ({
                        ...base,
                        boxShadow: 'none',
                        padding: '0.7px',
                        borderRadius: '8px',
                        border: state.isFocused ? '2px solid #003DA0' : '1px solid #D0D5DD',
                      }),
                    })}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1760B9] p-1.5 rounded-lg pointer-events-none">
                    <CiSearch className="text-white responsive-text-lg" />
                  </div>
                </div>
              </div>

              {listData.length <= 0 ? (
                <EmptyData />
              ) : (
                <>
                  {/* Thông tin mặt hàng Header */}
                  <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] gap-4 items-center sticky top-0 py-2 mb-2 border-b border-gray-100">
                    <TableHeader className="text-left">
                      {dataLang?.import_from_items || 'import_from_items'}
                    </TableHeader>
                    <TableHeader className="text-left">Kho - Vị trí kho</TableHeader>
                    <TableHeader className="text-center">Số lượng</TableHeader>
                    <TableHeader className="text-center">Đơn giá</TableHeader>
                    <Dropdown
                      overlay={
                        <div className="border px-4 py-5 shadow-lg bg-white rounded-lg">
                          <p className="3xl:text-base font-normal font-deca text-secondary-color-text mb-2">
                            Chọn hoàng loạt % chiết khấu
                          </p>
                          <div className="flex items-center justify-center col-span-1 text-center">
                            <InPutNumericFormat
                              value={generalDiscount}
                              onValueChange={_HandleChangeInput.bind(this, 'generalDiscount')}
                              className="cursor-text appearance-none text-end 3xl:m-2 3xl:p-2 m-1 p-2 h-10 font-deca font-normal w-full focus:outline-none border rounded-lg 3xl:text-sm 3xl:font-semibold text-black-color 2xl:text-[12px] xl:text-[11px] text-[10px] border-gray-200"
                              isAllowed={isAllowedDiscount}
                            />
                          </div>
                        </div>
                      }
                      trigger={['click']}
                      placement="bottomCenter"
                      arrow
                    >
                      <div className="inline-flex items-center justify-between cursor-pointer w-full">
                        <TableHeader className="text-left">% Chiết khấu</TableHeader>
                        <ArrowDown2 size={16} className="text-neutral-02 font-medium" />
                      </div>
                    </Dropdown>
                    <TableHeader className="text-start">Đơn giá sau CK</TableHeader>
                    <Dropdown
                      overlay={
                        <div className="border px-4 py-5 shadow-lg bg-white rounded-lg">
                          <p className="3xl:text-base font-normal font-deca text-secondary-color-text mb-2">
                            Chọn hoàng loạt % thuế
                          </p>
                          <div className="">
                            <Select
                              options={taxOptions}
                              onChange={_HandleChangeInput.bind(this, 'generalTax')}
                              value={generalTax}
                              formatOptionLabel={(option) => (
                                <div className="flex items-center justify-start gap-1 ">
                                  <h2>{option?.label}</h2>
                                  <h2>{`(${option?.tax_rate})`}</h2>
                                </div>
                              )}
                              placeholder={dataLang?.purchase_order_detail_tax || 'purchase_order_detail_tax'}
                              hideSelectedOptions={false}
                              className={` "border-transparent placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                              isSearchable={true}
                              noOptionsMessage={() => dataLang?.returns_nodata || 'returns_nodata'}
                              menuPortalTarget={document.body}
                              closeMenuOnSelect={true}
                              style={{
                                border: 'none',
                                boxShadow: 'none',
                                outline: 'none',
                              }}
                              theme={(theme) => ({
                                ...theme,
                                colors: {
                                  ...theme.colors,
                                  primary25: '#EBF5FF',
                                  primary50: '#92BFF7',
                                  primary: '#0F4F9E',
                                },
                              })}
                              styles={applyFontFamily({
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
                                  padding: '2.7px',
                                  ...(state.isFocused && {
                                    border: '0 0 0 1px #92BFF7',
                                  }),
                                }),
                              })}
                            />
                          </div>
                        </div>
                      }
                      trigger={['click']}
                      placement="bottomCenter"
                      arrow
                    >
                      <div className="inline-flex items-center justify-between cursor-pointer w-full">
                        <TableHeader className="text-left">% Thuế</TableHeader>
                        <ArrowDown2 size={16} className="text-neutral-02 font-medium" />
                      </div>
                    </Dropdown>
                    <TableHeader className="text-start">Thành tiền</TableHeader>
                  </div>

                  {/* Thông tin mặt hàng Body */}
                  <Customscrollbar className="max-h-[400px] h-[400px]  overflow-auto pb-2">
                    <div className="w-full h-full">
                      {isFetching ? (
                        <Loading className="w-full h-10" color="#0f4f9e" />
                      ) : (
                        <>
                          {listData?.map((e) => {
                            const option = e?.matHang
                            let quantityUndelived = +option?.e?.quantity - +option?.e?.quantity_delivery
                            return (
                              <div
                                key={e?.id?.toString()}
                                className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] gap-4 items-center"
                              >
                                <div className="h-full p-2 pb-1">
                                  {/* Mặt hàng */}
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-start">
                                      <div className="flex items-start gap-3">
                                        <img
                                          src={option.e?.images ?? '/icon/noimagelogo.png'}
                                          alt={option?.e.name}
                                          className="w-10 h-10 object-cover rounded-md"
                                        />
                                        <div className="flex flex-col gap-1 3xl:text-[10px] text-[9px] overflow-hidden w-full text-neutral-03 font-normal">
                                          <div className="font-semibold responsive-text-sm truncate text-black">
                                            {option.e.name}
                                          </div>
                                          <div>
                                            {option.e?.code}: {option.e?.product_variation}
                                          </div>
                                          <div className="flex flex-col items-start gap-1">
                                            <div className="flex items-center gap-1">
                                              <h5>{dataLang[option.e?.text_type]}</h5>
                                              <h5>
                                                {dataLang?.delivery_receipt_quantity || 'delivery_receipt_quantity'}:
                                              </h5>
                                              <h5>{option.e?.quantity ? formatNumber(+option.e?.quantity) : '0'}</h5>
                                            </div>
                                            <div>
                                              ĐVT: <span>{option.e?.unit_name}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <div className="flex items-center gap-1">
                                                <h5>
                                                  {dataLang?.delivery_receipt_quantity_undelivered_order || 'Số lượng'}:
                                                </h5>
                                                <h5>{quantityUndelived ? formatNumber(+quantityUndelived) : '0'} - </h5>
                                              </div>
                                              <div className="flex items-center gap-1">
                                                <h5>
                                                  {dataLang?.delivery_receipt_quantity_delivered_order ||
                                                    'delivery_receipt_quantity_delivered_order'}
                                                  :
                                                </h5>
                                                <h5>
                                                  {option.e?.quantity_delivery
                                                    ? formatNumber(+option.e?.quantity_delivery)
                                                    : '0'}
                                                </h5>
                                              </div>
                                            </div>
                                            {/* Ghi chú */}
                                            <div className="flex items-center justify-center col-span-1">
                                              <FaPencilAlt size={10} />
                                              <input
                                                // value={ce?.note}
                                                // onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'note')}
                                                placeholder={dataLang?.delivery_receipt_note || 'delivery_receipt_note'}
                                                name="optionEmail"
                                                type="text"
                                                className="focus:border-[#92BFF7] placeholder:responsive-text-xs 2xl:h-7 xl:h-5 mt-1 py-0 px-1 responsive-text-xs placeholder-slate-300 w-full bg-white rounded-[5.5px] text-[#52575E] font-normal outline-none"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={_HandleAddChild.bind(this, e?.id, e?.matHang)}
                                      className="flex items-center justify-center w-8 h-8 transition ease-in-out rounded bg-slate-100 -top-4 right-5 hover:rotate-45 hover:bg-slate-200 hover:scale-105 hover:text-red-500"
                                    >
                                      <Add />
                                    </button>
                                  </div>
                                  {e?.child?.filter((e) => e?.warehouse == null).length >= 2 && (
                                    <button
                                      onClick={_HandleDeleteAllChild.bind(this, e?.id, e?.matHang)}
                                      className="w-full rounded mt-1.5 px-5 py-1 overflow-hidden group bg-rose-500 relative hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-rose-400 transition-all ease-out duration-300"
                                    >
                                      <span className="absolute right-0 w-full h-full -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                                      <span className="relative text-xs">
                                        Xóa {e?.child?.filter((e) => e?.warehouse == null).length} hàng chưa chọn kho
                                      </span>
                                    </button>
                                  )}
                                </div>

                                {e?.child?.map((ce) => (
                                  <React.Fragment key={ce?.id?.toString()}>
                                    {/* Kho - Vị trí kho */}
                                    <div className="flex flex-col justify-center h-full p-1">
                                      <Select
                                        options={ce?.dataWarehouse}
                                        value={ce?.warehouse}
                                        onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'warehouse')}
                                        className={`${
                                          (errWarehouse && ce?.warehouse == null) ||
                                          (errWarehouse &&
                                            (ce?.warehouse?.label == null || ce?.warehouse?.warehouse_name == null))
                                            ? 'border-red-500 border'
                                            : ''
                                        }  my-1 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal `}
                                        placeholder={dataLang?.PDF_house || 'PDF_house'}
                                        menuPortalTarget={document.body}
                                        formatOptionLabel={(option) => {
                                          return (
                                            (option?.warehouse_name || option?.label || option?.qty) && (
                                              <div className="">
                                                <div className="flex gap-1">
                                                  <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                                    {'Kho'}:
                                                  </h2>
                                                  <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-semibold">
                                                    {option?.warehouse_name}
                                                  </h2>
                                                </div>
                                                <div className="flex gap-1">
                                                  <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                                    {'Vị trí kho'}:
                                                  </h2>
                                                  <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-semibold">
                                                    {option?.label}
                                                  </h2>
                                                </div>
                                                <div className="flex gap-1">
                                                  <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                                    {dataLang?.returns_survive || 'returns_survive'}:
                                                  </h2>
                                                  <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] uppercase font-semibold">
                                                    {formatNumber(option?.qty)}
                                                  </h2>
                                                </div>
                                                <div className="flex items-center gap-2 italic">
                                                  {dataProductSerial.is_enable === '1' && (
                                                    <div className="text-[11px] text-[#667085] font-[500]">
                                                      Serial: {option?.serial ? option?.serial : '-'}
                                                    </div>
                                                  )}
                                                  {dataMaterialExpiry.is_enable === '1' ||
                                                  dataProductExpiry.is_enable === '1' ? (
                                                    <>
                                                      <div className="text-[11px] text-[#667085] font-[500]">
                                                        Lot: {option?.lot ? option?.lot : '-'}
                                                      </div>
                                                      <div className="text-[11px] text-[#667085] font-[500]">
                                                        Date:{' '}
                                                        {option?.date
                                                          ? formatMoment(option?.date, FORMAT_MOMENT.DATE_SLASH_LONG)
                                                          : '-'}
                                                      </div>
                                                    </>
                                                  ) : (
                                                    ''
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          )
                                        }}
                                        style={{
                                          border: 'none',
                                          boxShadow: 'none',
                                          outline: 'none',
                                        }}
                                        theme={(theme) => ({
                                          ...theme,
                                          colors: {
                                            ...theme.colors,
                                            primary25: '#EBF5FF',
                                            primary50: '#92BFF7',
                                            primary: '#0F4F9E',
                                          },
                                        })}
                                        classNamePrefix="customDropdow"
                                      />
                                    </div>
                                    {/* Số lượng */}
                                    <div className="flex items-center justify-center relative">
                                      <div className="flex items-center justify-center 3xl:p-2 xl:p-[2px] p-[1px] border border-border-gray-2 rounded-3xl">
                                        <button
                                          disabled={
                                            ce?.quantity === 1 ||
                                            ce?.quantity === '' ||
                                            ce?.quantity === null ||
                                            ce?.quantity === 0
                                          }
                                          className="2xl:scale-100 xl:scale-90 scale-75 text-black hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5 bg-primary-05 rounded-full"
                                          onClick={_HandleChangeChild.bind(this, e?.id, ce?.id, 'decrease')}
                                        >
                                          <Minus size="16" className="scale-75 2xl:scale-100 xl:scale-90" />
                                        </button>
                                        <InPutNumericFormat
                                          onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'quantity')}
                                          value={ce?.quantity || null}
                                          className={`${
                                            errQuantity &&
                                            (ce?.quantity == null || ce?.quantity == '' || ce?.quantity == 0)
                                              ? 'border-b border-red-500'
                                              : errSurvive
                                              ? 'border-b border-red-500'
                                              : 'border-b border-gray-200'
                                          }
                                                                                ${
                                                                                  (ce?.quantity == 0 &&
                                                                                    'border-red-500') ||
                                                                                  (ce?.quantity == '' &&
                                                                                    'border-red-500')
                                                                                } 
                                                                                appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px]  focus:outline-none `}
                                          isAllowed={(values) => {
                                            const { value } = values
                                            const newValue = +value
                                            const quantityAmount = +ce?.quantityStock - +ce?.quantityDelive

                                            if (newValue > +ce?.warehouse?.qty) {
                                              isShow(
                                                'error',
                                                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                                                  +ce?.warehouse?.qty
                                                )} số lượng tồn kho`
                                              )
                                              return
                                            } else if (newValue > quantityAmount) {
                                              isShow(
                                                'error',
                                                `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                                                  quantityAmount
                                                )} số lượng chưa giao`
                                              )
                                              return
                                            }
                                            return true
                                          }}
                                        />
                                        <button
                                          className="2xl:scale-100 xl:scale-90 scale-75 text-black hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-primary-05 rounded-full"
                                          onClick={_HandleChangeChild.bind(this, e?.id, ce?.id, 'increase')}
                                        >
                                          <Add size="16" className="scale-75 2xl:scale-100 xl:scale-90" />
                                        </button>
                                      </div>

                                      <div className="absolute top-1 -right-7 p-1 cursor-pointer">
                                        <PopupParent
                                          className=""
                                          trigger={
                                            <div className="relative ">
                                              <TableDocument size="18" color="#4f46e5" className="font-medium" />
                                              <span className="h-2 w-2  absolute top-0 left-1/2  translate-x-[50%] -translate-y-[50%]">
                                                <span className="relative inline-flex w-2 h-2 bg-indigo-500 rounded-full">
                                                  <span className="absolute inline-flex w-full h-full bg-indigo-400 rounded-full opacity-75 animate-ping"></span>
                                                </span>
                                              </span>
                                            </div>
                                          }
                                          position="left center"
                                          on={['hover', 'focus']}
                                        >
                                          <div className="flex flex-col bg-gray-300 px-2.5 py-0.5 rounded-sm">
                                            <span className="text-xs font-medium">
                                              Sl tồn: {ce?.warehouse == null ? 0 : formatNumber(+ce?.warehouse?.qty)}
                                            </span>

                                            <span className="text-xs font-medium">
                                              Sl đã giao: {formatNumber(ce?.quantityDelive)}
                                            </span>
                                            <span className="text-xs font-medium">
                                              Sl chưa giao: {formatNumber(ce?.quantityStock - ce?.quantityDelive)}
                                            </span>
                                          </div>
                                        </PopupParent>
                                      </div>
                                    </div>
                                    {/* Đơn giá */}
                                    <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                      <InPutMoneyFormat
                                        className={`${
                                          errPrice && (ce?.price == null || ce?.price == '' || ce?.price == 0)
                                            ? 'border-b border-red-500'
                                            : errSurvivePrice &&
                                              (ce?.price == null || ce?.price == '' || ce?.price == 0)
                                            ? 'border-b border-red-500'
                                            : 'border-b border-gray-200'
                                        }
                                                                            ${
                                                                              (ce?.price == 0 && 'border-red-500') ||
                                                                              (ce?.price == '' && 'border-red-500')
                                                                            } 
                                                                            appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px]  focus:outline-none `}
                                        onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'price')}
                                        isAllowed={isAllowedNumber}
                                        value={ce?.price}
                                      />
                                    </div>

                                    <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                      <InPutNumericFormat
                                        className="appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px]  focus:outline-none"
                                        onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'discount')}
                                        value={ce?.discount}
                                        isAllowed={isAllowedDiscount}
                                      />
                                    </div>

                                    <div className=" text-right flex items-center justify-end  h-full p-0.5">
                                      <h3 className="px-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                        {formatMoney(Number(ce?.price) * (1 - Number(ce?.discount) / 100))}
                                      </h3>
                                    </div>
                                    <div className="flex flex-col items-center justify-center h-full p-1 ">
                                      <Select
                                        options={taxOptions}
                                        value={ce?.tax}
                                        onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'tax')}
                                        placeholder={dataLang?.import_from_tax || 'import_from_tax'}
                                        className={`3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] border-transparent placeholder:text-slate-300 w-full z-19 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                                        menuPortalTarget={document.body}
                                        style={{
                                          border: 'none',
                                          boxShadow: 'none',
                                          outline: 'none',
                                        }}
                                        formatOptionLabel={(option) => (
                                          <div className="flex items-center justify-start gap-1 ">
                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                              {option?.label}
                                            </h2>
                                            <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">{`(${option?.tax_rate})`}</h2>
                                          </div>
                                        )}
                                        theme={(theme) => ({
                                          ...theme,
                                          colors: {
                                            ...theme.colors,
                                            primary25: '#EBF5FF',
                                            primary50: '#92BFF7',
                                            primary: '#0F4F9E',
                                          },
                                        })}
                                        classNamePrefix="customDropdowTax"
                                      />
                                    </div>

                                    {/* Thành tiền và nút xóa */}
                                    <div className="flex items-center justify-between text-right">
                                      <div className="justify-center pr-1  p-0.5 h-full flex flex-col items-end 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                        {formatNumber(
                                          ce?.price *
                                            (1 - Number(ce?.discount) / 100) *
                                            (1 + Number(ce?.tax?.tax_rate) / 100) *
                                            Number(ce?.quantity)
                                        )}
                                      </div>

                                      {/* Nút xoá */}
                                      <div className="flex items-center justify-center">
                                        <button
                                          type="button"
                                          title="Xóa"
                                          onClick={_HandleDeleteChild.bind(this, e?.id, ce?.id)}
                                          className="transition 3xl:size-6 size-5 responsive-text-sm bg-gray-300 text-black hover:text-typo-black-3/60 flex flex-col justify-center items-center border rounded-full"
                                        >
                                          <MdClear />
                                        </button>
                                      </div>
                                    </div>
                                  </React.Fragment>
                                ))}
                              </div>
                            )
                          })}
                        </>
                      )}
                    </div>
                  </Customscrollbar>
                </>
              )}
            </div>
          </div>

          {/* Cột phải */}
          <div className="w-1/5">
            <div className="flex flex-col gap-y-6">
              {/* Cột thông tin chung */}
              <div className="w-full mx-auto px-4 bg-white border border-gray-200 rounded-2xl">
                <h2 className="2xl:text-[20px] xl:text-lg font-medium text-brand-color mt-6 mb-4 capitalize">
                  Thông tin
                </h2>
                <OrderFormTabs
                  Info={() => {
                    return (
                      <div className="flex flex-col gap-4 relative">
                        {/* Mã chứng từ */}
                        <div className="flex flex-col flex-wrap items-center gap-y-3">
                          <InfoFormLabel label={dataLang?.import_code_vouchers || 'import_code_vouchers'} />
                          <div className="w-full relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500">
                              #
                            </span>
                            <input
                              value={code}
                              onChange={_HandleChangeInput.bind(this, 'code')}
                              name="fname"
                              type="text"
                              placeholder={dataLang?.purchase_order_system_default || 'purchase_order_system_default'}
                              className={`responsive-text-base placeholder:text-sm z-10 pl-8 focus:border-[#0F4F9E] w-full text-gray-600 font-normal border border-[#d0d5dd] p-2 rounded-lg outline-none cursor-pointer`}
                            />
                          </div>
                        </div>
                        {/* Ngày chứng từ */}
                        <div className="flex flex-col flex-wrap items-center gap-y-3 relative">
                          <InfoFormLabel
                            isRequired={true}
                            label={dataLang?.import_day_vouchers || 'import_day_vouchers'}
                          />

                          <div className="relative w-full flex flex-row custom-date-picker">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                              <BsCalendarEvent color="#7a7a7a" />
                            </span>
                            <ConfigProvider locale={viVN}>
                              <DatePicker
                                className="sales-product-date pl-9 placeholder:text-secondary-color-text-disabled cursor-pointer"
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
                                    sStartDate(dateString)
                                  }
                                }}
                              />
                            </ConfigProvider>
                          </div>
                        </div>

                        {/* Khách hàng */}
                        <div className="flex flex-col flex-wrap items-center gap-y-3">
                          <InfoFormLabel isRequired={true} label="Khách hàng" />
                          <div className="w-full">
                            <div className="relative flex flex-row">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                <LuBriefcase color="#7a7a7a" />
                              </span>
                              <SelectWithRadio
                                title="Khách hàng"
                                placeholderText="Chọn khách hàng"
                                options={dataClient}
                                value={idClient}
                                onChange={(value) => {
                                  const newValue = dataClient.find((item) => item.value === value)
                                  _HandleChangeInput('idClient', newValue)
                                }}
                                isError={errClient}
                                isShowAddNew={true}
                              />
                              {errClient && (
                                <label className="text-sm text-red-500">{'Vui lòng chọn khách hàng'}</label>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Đơn hàng bán */}
                        <div className="flex flex-col flex-wrap items-center gap-y-3">
                          <InfoFormLabel
                            isRequired={true}
                            label={dataLang?.delivery_receipt_product_order || 'delivery_receipt_product_order'}
                          />
                          <div className="w-full">
                            <div className="relative flex flex-row">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                <TbNotes color="#7a7a7a" />
                              </span>
                              <SelectWithRadio
                                title={dataLang?.delivery_receipt_product_order || 'delivery_receipt_product_order'}
                                placeholderText="Chọn đơn hàng bán"
                                options={dataProductOrder}
                                value={idProductOrder}
                                onChange={(value) => {
                                  const newValue = dataProductOrder.find((item) => item.value === value)
                                  _HandleChangeInput('idProductOrder', newValue)
                                }}
                                isError={errProductOrder}
                              />

                              {errProductOrder && (
                                <label className="text-sm text-red-500">
                                  {dataLang?.delivery_receipt_err_select_product_order ||
                                    'delivery_receipt_err_select_product_order'}
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Địa chỉ giao hàng */}
                        <div className="flex flex-col flex-wrap items-center gap-y-3">
                          <InfoFormLabel isRequired={true} label={dataLang?.address || 'address'} />
                          <div className="w-full">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                <PiMapPinLight color="#7a7a7a" />
                              </span>
                              <SelectWithRadio
                                title={dataLang?.select_address || 'select_address'}
                                placeholderText="Chọn địa chỉ giao hàng"
                                options={dataAddress}
                                value={idAddress}
                                onChange={(value) => {
                                  const newValue = dataAddress.find((item) => item.value === value)
                                  _HandleChangeInput('idAddress', newValue)
                                }}
                                isError={errAddress}
                              />
                              <AiFillPlusCircle
                                onClick={() => _HandleClosePopupAddress(true)}
                                className="right-10 top-1/3 2xl:scale-150 scale-125 cursor-pointer text-sky-400 hover:text-sky-500 3xl:hover:scale-[1.7] 2xl:hover:scale-[1.6] hover:scale-150 hover:rotate-180  transition-all ease-in-out absolute "
                              />
                              <PopupAddress
                                dataLang={dataLang}
                                clientId={idClient?.value || idClient}
                                handleFetchingAddress={_ServerFetching_Address}
                                openPopupAddress={openPopupAddress}
                                handleClosePopupAddress={() => _HandleClosePopupAddress(false)}
                                className="hidden"
                              />
                              {errAddress && (
                                <label className="text-sm text-red-500">
                                  {dataLang?.delivery_receipt_err_select_address ||
                                    'delivery_receipt_err_select_address'}
                                </label>
                              )}
                            </div>
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
                              <>
                                {/* Chi nhánh */}
                                <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                                  <InfoFormLabel isRequired={true} label={dataLang?.import_branch || 'import_branch'} />
                                  <div className="w-full">
                                    <div className="relative flex flex-row">
                                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                        <PiMapPinLight color="#7a7a7a" />
                                      </div>
                                      <SelectWithRadio
                                        title={dataLang?.import_branch || 'import_branch'}
                                        placeholderText="Chọn chi nhánh"
                                        options={dataBranch}
                                        value={idBranch}
                                        onChange={(value) => {
                                          const newValue = dataBranch.find((item) => item.value === value)
                                          _HandleChangeInput('branch', newValue)
                                        }}
                                        isError={errBranch}
                                      />
                                      {errBranch && (
                                        <label className="text-sm text-red-500">
                                          {dataLang?.purchase_order_errBranch || 'purchase_order_errBranch'}
                                        </label>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {/* Người dùng */}
                                <div className="flex flex-col flex-wrap items-center gap-y-3">
                                  <InfoFormLabel
                                    isRequired
                                    label={dataLang?.delivery_receipt_edit_User || 'delivery_receipt_edit_User'}
                                  />
                                  <div className="w-full">
                                    <div className="relative flex flex-row">
                                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                        <PiUser color="#7a7a7a" />
                                      </div>
                                      <SelectWithRadio
                                        title={dataLang?.import_branch || 'import_branch'}
                                        placeholderText="Chọn người dùng"
                                        options={dataStaff}
                                        value={idStaff}
                                        onChange={(value) => {
                                          const newValue = dataStaff.find((item) => item.value === value)
                                          _HandleChangeInput('idStaff', newValue)
                                        }}
                                        isError={errStaff}
                                      />
                                      {errStaff && (
                                        <label className="text-sm text-red-500">
                                          {dataLang?.delivery_receipt_err_userStaff || 'delivery_receipt_err_userStaff'}
                                        </label>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </>
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
                            placeholder={'Nhập ghi chú tại đây'}
                            onChange={_HandleChangeInput.bind(this, 'note')}
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
                  <h4>{dataLang?.purchase_order_table_total || 'purchase_order_table_total'}</h4>
                  <span>
                    {formatMoney(
                      listData?.reduce((accumulator, item) => {
                        const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                          const product = Number(childItem?.price) * Number(childItem?.quantity)
                          return childAccumulator + product
                        }, 0)
                        return accumulator + childTotal
                      }, 0)
                    )}
                  </span>
                </div>
                {/* Tiền chiết khấu */}
                <div className="flex justify-between items-center mb-4 responsive-text-base font-normal text-secondary-color-text">
                  <h4>{dataLang?.purchase_order_detail_discounty || 'purchase_order_detail_discounty'}</h4>
                  <span>
                    {formatMoney(
                      listData?.reduce((accumulator, item) => {
                        const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                          const product =
                            Number(childItem?.price) * (Number(childItem?.discount) / 100) * Number(childItem?.quantity)
                          return childAccumulator + product
                        }, 0)
                        return accumulator + childTotal
                      }, 0)
                    )}
                  </span>
                </div>
                {/* Tiền sau chiết khấu */}
                <div className="flex justify-between items-center mb-4 responsive-text-base font-normal text-secondary-color-text">
                  <h4>
                    {dataLang?.purchase_order_detail_money_after_discount ||
                      'purchase_order_detail_money_after_discount'}
                  </h4>
                  <span>
                    {formatMoney(
                      listData?.reduce((accumulator, item) => {
                        const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                          const product =
                            Number(childItem?.price * (1 - childItem?.discount / 100)) * Number(childItem?.quantity)
                          return childAccumulator + product
                        }, 0)
                        return accumulator + childTotal
                      }, 0)
                    )}
                  </span>
                </div>
                {/* Tiền thuế */}
                <div className="flex justify-between items-center mb-4 responsive-text-base font-normal text-secondary-color-text">
                  <h4>{dataLang?.purchase_order_detail_tax_money || 'purchase_order_detail_tax_money'}</h4>
                  <span>
                    {formatMoney(
                      listData?.reduce((accumulator, item) => {
                        const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                          const product =
                            Number(childItem?.price * (1 - childItem?.discount / 100)) *
                            (isNaN(childItem?.tax?.tax_rate) ? 0 : Number(childItem?.tax?.tax_rate) / 100) *
                            Number(childItem?.quantity)
                          return childAccumulator + product
                        }, 0)
                        return accumulator + childTotal
                      }, 0)
                    )}
                  </span>
                </div>
                {/* Thành tiền */}
                <div className="flex justify-between responsive-text-base items-center mb-4">
                  <h4 className="w-full text-black font-semibold">
                    {dataLang?.purchase_order_detail_into_money || 'purchase_order_detail_into_money'}
                  </h4>
                  <span className="text-blue-color font-semibold">
                    {formatMoney(
                      listData?.reduce((accumulator, item) => {
                        const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                          const product =
                            Number(childItem?.price * (1 - childItem?.discount / 100)) *
                            (1 + Number(childItem?.tax?.tax_rate) / 100) *
                            Number(childItem?.quantity)
                          return childAccumulator + product
                        }, 0)
                        return accumulator + childTotal
                      }, 0)
                    )}
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
              onClick={() => router.push(routerDeliveryReceipt.home)}
              dataLang={dataLang}
              className="2xl:px-5 2xl:pt-[10px] 2xl:pb-[30px] xl:px-4 xl:py-2 px-2 h-full bg-[#F2F3F5] 2xl:text-base text-sm font-normal rounded-lg"
            >
              Thoát
            </button>
            <Button
              onClick={_HandleSubmit.bind(this)}
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
        type="warning"
        title={TITLE_DELETE_ITEMS}
        subtitle={CONFIRMATION_OF_CHANGES}
        isOpen={isOpen}
        nameModel={'change_item'}
        save={handleSaveStatus}
        cancel={handleCancleStatus}
      />
    </div>
  )
}

export default DeliveryReceiptForm
