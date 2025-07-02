import apiDeliveryReceipt from '@/Api/apiSalesExportProduct/deliveryReceipt/apiDeliveryReceipt'
import Breadcrumb from '@/components/UI/breadcrumb/BreadcrumbCustom'
import ButtonBack from '@/components/UI/button/buttonBack'
import ButtonSubmit from '@/components/UI/button/buttonSubmit'
import { Customscrollbar } from '@/components/UI/common/Customscrollbar'
import { EmptyExprired } from '@/components/UI/common/EmptyExprired'
import { Container } from '@/components/UI/common/layout'
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
import { isAllowedDiscount, isAllowedNumber } from '@/utils/helpers/common'
import { formatMoment } from '@/utils/helpers/formatMoment'
import formatMoneyConfig from '@/utils/helpers/formatMoney'
import formatNumberConfig from '@/utils/helpers/formatnumber'
import { PopupParent } from '@/utils/lib/Popup'
import { useQuery } from '@tanstack/react-query'
import { Add, Trash as IconDelete, Minus, TableDocument } from 'iconsax-react'
import moment from 'moment/moment'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { AiFillPlusCircle } from 'react-icons/ai'
import { BsCalendarEvent } from 'react-icons/bs'
import { MdClear } from 'react-icons/md'
import Select, { components } from 'react-select'
import { routerDeliveryReceipt } from 'routers/sellingGoods'
import { v4 as uuidv4 } from 'uuid'
import PopupAddress from './components/PopupAddress'
import { useDeliveryReceipItemAll } from './hooks/useDeliveryReceipItemAll'
import { useDeliveryReceipPerson } from './hooks/useDeliveryReceipPerson'
const DeliveryReceiptForm = (props) => {
  const router = useRouter()

  const dataSeting = useSetingServer()

  const id = router.query?.id

  const dataLang = props?.dataLang

  const isShow = useToast()

  const { isOpen, isKeyState, handleQueryId } = useToggle()

  const statusExprired = useStatusExprired()

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

  const { data: dataTasxes = [] } = useTaxList()

  const { data: dataBranch = [] } = useBranchList()

  const { data: dataStaff = [] } = useStaffOptions({ 'filter[branch_id]': idBranch !== null ? +idBranch?.value : null })

  const { data: dataContactPerson = [] } = useDeliveryReceipPerson({
    'filter[client_id]': idClient != null ? idClient.value : null,
  })

  const { data: dataClient = [] } = useClientComboboxByFilterBranch(idBranch, {
    'filter[branch_id]': idBranch != null ? idBranch.value : null,
  })

  const { data: dataItems } = useDeliveryReceipItemAll({
    'filter[order_id]': idProductOrder !== null ? +idProductOrder.value : null,
    'filter[delivery_id]': id ? id : '',
  })

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

  useEffect(() => {
    router.query && resetAllStates()
  }, [router.query])

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

    data.append('branch_id', idBranch !== null ? +idBranch.value : null)

    data.append('client_id', idClient !== null ? +idClient.value : null)

    id && data.append('filter[delivery_id]', id ? id : '')

    try {
      const { results } = await apiDeliveryReceipt.apiSearchOrdersToCustomer(data)

      sDataProductOrder(results?.map((e) => ({ label: e.text, value: e.id })))

      sOnFetchingProductOrder(false)
    } catch (error) {}
  }

  const _ServerFetching_Address = async () => {
    let data = new FormData()
    data.append('client_id', idClient !== null ? +idClient.value : null)
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
  const showToat = useToast()
  const _HandleAddParent = (value) => {
    const checkData = listData?.some((e) => e?.matHang?.value === value?.value)
    if (!checkData) {
      const { parent } = _DataValueItem(value)
      sListData([parent, ...listData])
    } else {
      showToat('error', `${dataLang?.returns_err_ItemSelect || 'returns_err_ItemSelect'}`)
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
      <div className="flex items-center justify-between">
        <div className="flex items-center ">
          <div>
            {option.e?.images !== null ? (
              <img
                src={option.e?.images}
                alt="Product Image"
                className="3xl:max-w-[40px] 3xl:h-[40px] 2xl:max-w-[40px] 2xl:h-[40px] xl:max-w-[40px] xl:h-[40px] max-w-[40px] h-[40px] text-[8px] object-cover rounded mr-1"
              />
            ) : (
              <div className="3xl:max-w-[40px] 3xl:h-[40px] 2xl:max-w-[40px] 2xl:h-[40px] xl:max-w-[40px] xl:h-[40px] max-w-[40px] h-[40px] object-cover flex items-center justify-center rounded xl:mr-1 mx-0.5">
                <img
                  src="/icon/noimagelogo.png"
                  alt="Product Image"
                  className="3xl:max-w-[40px] 3xl:h-[40px] 2xl:max-w-[40px] 2xl:h-[40px] xl:max-w-[40px] xl:h-[40px] max-w-[40px] h-[40px] object-cover rounded mr-1"
                />
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium 3xl:text-[14px] 2xl:text-[11px] xl:text-[10px] text-[10px] whitespace-pre-wrap">
              {option.e?.name}
            </h3>

            <div className="flex gap-1 3xl:gap-2 2xl:gap-1 xl:gap-1">
              <h5 className="text-gray-400  3xl:text-[14px] 2xl:text-[11px] xl:text-[8px] text-[7px]">
                {option.e?.code} :
              </h5>
              <h5 className="3xl:text-[14px] 2xl:text-[11px] xl:text-[8px] text-[7px]">
                {option.e?.product_variation}
              </h5>
            </div>
            <div className="flex gap-1 3xl:gap-3 2xl:gap-3 xl:gap-3">
              <div className="flex items-center gap-1">
                <h5 className="min-w-1/3 text-gray-400 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                  {dataLang[option.e?.text_type]}
                </h5>
                <h5 className="text-gray-400 font-normal 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                  {dataLang?.delivery_receipt_quantity || 'delivery_receipt_quantity'}:
                </h5>

                <h5 className=" font-normal 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                  {option.e?.quantity ? formatNumber(+option.e?.quantity) : '0'}
                </h5>
              </div>

              <div className="flex items-center gap-1">
                <h5 className="text-gray-400 font-normal 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                  {dataLang?.delivery_receipt_quantity_undelivered_order ||
                    'delivery_receipt_quantity_undelivered_order'}
                  :
                </h5>

                <h5 className=" font-normal 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                  {quantityUndelived ? formatNumber(+quantityUndelived) : '0'}
                </h5>
              </div>

              <div className="flex items-center gap-1">
                <h5 className="text-gray-400 font-normal 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                  {dataLang?.delivery_receipt_quantity_delivered_order || 'delivery_receipt_quantity_delivered_order'}:
                </h5>

                <h5 className=" font-normal 3xl:text-[13.5px] 2xl:text-[10px] xl:text-[8px] text-[6.5px]">
                  {option.e?.quantity_delivery ? formatNumber(+option.e?.quantity_delivery) : '0'}
                </h5>
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
      // href: "/",
    },
    {
      label: `${dataLang?.delivery_receipt_list || 'delivery_receipt_list'}`,
    },
    {
      label: `${
        id
          ? dataLang?.delivery_receipt_edit || 'delivery_receipt_edit'
          : dataLang?.delivery_receipt_add || 'delivery_receipt_add'
      }`,
    },
  ]

  return (
    <React.Fragment>
      <Head>
        <title>
          {id
            ? dataLang?.delivery_receipt_edit || 'delivery_receipt_edit'
            : dataLang?.delivery_receipt_add || 'delivery_receipt_add'}
        </title>
      </Head>
      <Container className="!h-auto">
        {statusExprired ? (
          <EmptyExprired />
        ) : (
          <React.Fragment>
            <Breadcrumb items={breadcrumbItems} className="3xl:text-sm 2xl:text-xs xl:text-[10px] lg:text-[10px]" />
          </React.Fragment>
        )}
        <div className="h-[97%] space-y-3 overflow-hidden">
          <div className="flex items-center justify-between ">
            <h2 className="text-title-section text-[#52575E] capitalize font-medium ">
              {dataLang?.delivery_receipt_edit_notes || 'delivery_receipt_edit_notes'}
            </h2>
            <div className="flex items-center justify-end mr-2">
              <ButtonBack onClick={() => router.push(routerDeliveryReceipt.home)} dataLang={dataLang} />
            </div>
          </div>

          <div className="w-full rounded ">
            <div className="">
              <h2 className="font-normal bg-[#ECF0F4] p-2">
                {dataLang?.purchase_order_detail_general_informatione || 'purchase_order_detail_general_informatione'}
              </h2>
              <div className="grid items-center grid-cols-12 gap-3 mt-2">
                <div className="col-span-3">
                  <label className="text-[#344054] font-normal text-sm mb-1 ">
                    {dataLang?.import_code_vouchers || 'import_code_vouchers'}{' '}
                  </label>
                  <input
                    value={code}
                    onChange={_HandleChangeInput.bind(this, 'code')}
                    name="fname"
                    type="text"
                    placeholder={dataLang?.purchase_order_system_default || 'purchase_order_system_default'}
                    className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal   p-2 border outline-none`}
                  />
                </div>
                <div className="relative col-span-3">
                  <label className="text-[#344054] font-normal text-sm mb-1 ">
                    {dataLang?.import_day_vouchers || 'import_day_vouchers'}
                  </label>
                  <div className="flex flex-row custom-date-picker">
                    <DatePicker
                      blur
                      fixedHeight
                      showTimeSelect
                      selected={startDate}
                      onSelect={(date) => sStartDate(date)}
                      onChange={(e) => handleTimeChange(e)}
                      placeholderText="DD/MM/YYYY HH:mm:ss"
                      dateFormat="dd/MM/yyyy h:mm:ss aa"
                      timeInputLabel={'Time: '}
                      placeholder={dataLang?.price_quote_system_default || 'price_quote_system_default'}
                      className={`border ${
                        errDate ? 'border-red-500' : 'focus:border-[#92BFF7] border-[#d0d5dd]'
                      } placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                    />
                    {startDate && (
                      <>
                        <MdClear
                          className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                          onClick={() => handleClearDate('startDate')}
                        />
                      </>
                    )}
                    <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="text-[#344054] font-normal text-sm mb-1 ">
                    {dataLang?.import_branch || 'import_branch'} <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={dataBranch}
                    onChange={_HandleChangeInput.bind(this, 'branch')}
                    value={idBranch}
                    isClearable={true}
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    placeholder={dataLang?.import_branch || 'import_branch'}
                    className={`${
                      errBranch ? 'border-red-500' : 'border-transparent'
                    } placeholder:text-slate-300 w-full z-30 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                    isSearchable={true}
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
                    styles={{
                      placeholder: (base) => ({
                        ...base,
                        color: '#cbd5e1',
                      }),
                      menu: (provided) => ({
                        ...provided,
                        // zIndex: 9999, // Giá trị z-index tùy chỉnh
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
                  {errBranch && (
                    <label className="text-sm text-red-500">
                      {dataLang?.purchase_order_errBranch || 'purchase_order_errBranch'}
                    </label>
                  )}
                </div>
                <div className="col-span-3">
                  <label className="text-[#344054] font-normal text-sm mb-1 ">
                    {'Khách hàng'} <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={dataClient}
                    onChange={_HandleChangeInput.bind(this, 'idClient')}
                    value={idClient}
                    placeholder={'Khách hàng'}
                    hideSelectedOptions={false}
                    isClearable={true}
                    className={`${
                      errClient ? 'border-red-500' : 'border-transparent'
                    } placeholder:text-slate-300 w-full  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                    styles={{
                      placeholder: (base) => ({
                        ...base,
                        color: '#cbd5e1',
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 999,
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
                  {errClient && <label className="text-sm text-red-500">{'Vui lòng chọn khách hàng'}</label>}
                </div>
                <div className="col-span-3">
                  <label className="text-[#344054] font-normal text-sm mb-1 ">{'Người liên lạc'}</label>
                  <Select
                    options={dataContactPerson}
                    onChange={_HandleChangeInput.bind(this, 'idContactPerson')}
                    value={idContactPerson}
                    isClearable={true}
                    noOptionsMessage={() => dataLang?.returns_nodata || 'returns_nodata'}
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    placeholder={'Người liên lạc'}
                    className={`placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                    isSearchable={true}
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
                    styles={{
                      placeholder: (base) => ({
                        ...base,
                        color: '#cbd5e1',
                      }),
                      menu: (provided) => ({
                        ...provided,
                        // zIndex: 9999, // Giá trị z-index tùy chỉnh
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

                <div className="col-span-3">
                  <label className="text-[#344054] font-normal 3xl:text-sm 2xl:text-[13px] text-[13px] ">
                    {dataLang?.address || 'address'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Select
                      options={dataAddress}
                      onChange={_HandleChangeInput.bind(this, 'idAddress')}
                      value={idAddress}
                      placeholder={dataLang?.select_address || 'select_address'}
                      hideSelectedOptions={false}
                      isClearable={true}
                      className={`${
                        errAddress ? 'border border-red-500 rounded-md' : ''
                      } rounded-md 3xl:text-sm 2xl:text-[13px] xl:text-[12px] text-[11px] `}
                      isSearchable={true}
                      noOptionsMessage={() => 'Không có dữ liệu'}
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
                    <AiFillPlusCircle
                      onClick={() => _HandleClosePopupAddress(true)}
                      className="right-0 top-0 -translate-x-[450%] 3xl:translate-y-[80%] 2xl:translate-y-[70%] xl:translate-y-[70%] translate-y-[60%] 2xl:scale-150 scale-125 cursor-pointer text-sky-400 hover:text-sky-500 3xl:hover:scale-[1.7] 2xl:hover:scale-[1.6] hover:scale-150 hover:rotate-180  transition-all ease-in-out absolute "
                    />
                    <PopupAddress
                      dataLang={dataLang}
                      clientId={idClient?.value}
                      handleFetchingAddress={_ServerFetching_Address}
                      openPopupAddress={openPopupAddress}
                      handleClosePopupAddress={() => _HandleClosePopupAddress(false)}
                      className="hidden"
                    />
                    {errAddress && (
                      <label className="text-sm text-red-500">
                        {dataLang?.delivery_receipt_err_select_address || 'delivery_receipt_err_select_address'}
                      </label>
                    )}
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="text-[#344054] font-normal text-sm mb-1 ">
                    {dataLang?.delivery_receipt_edit_User || 'delivery_receipt_edit_User'}
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={dataStaff}
                    onChange={_HandleChangeInput.bind(this, 'idStaff')}
                    value={idStaff}
                    isClearable={true}
                    noOptionsMessage={() => dataLang?.returns_nodata || 'returns_nodata'}
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    placeholder={dataLang?.delivery_receipt_edit_User || 'delivery_receipt_edit_User'}
                    className={`${
                      errStaff ? 'border-red-500' : 'border-transparent'
                    } placeholder:text-slate-300 w-full z-20  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                    isSearchable={true}
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
                    styles={{
                      placeholder: (base) => ({
                        ...base,
                        color: '#cbd5e1',
                      }),
                      menu: (provided) => ({
                        ...provided,
                        // zIndex: 9999, // Giá trị z-index tùy chỉnh
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
                  {errStaff && (
                    <label className="text-sm text-red-500">
                      {dataLang?.delivery_receipt_err_userStaff || 'delivery_receipt_err_userStaff'}
                    </label>
                  )}
                </div>
                <div className="col-span-3">
                  <label className="text-[#344054] font-normal text-sm mb-1 ">
                    {dataLang?.delivery_receipt_product_order || 'delivery_receipt_product_order'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={dataProductOrder}
                    onChange={_HandleChangeInput.bind(this, 'idProductOrder')}
                    value={idProductOrder}
                    isClearable={true}
                    noOptionsMessage={() => dataLang?.returns_nodata || 'returns_nodata'}
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    placeholder={dataLang?.delivery_receipt_product_order || 'delivery_receipt_product_order'}
                    className={`${
                      errProductOrder ? 'border-red-500' : 'border-transparent'
                    } placeholder:text-slate-300 w-full z-20  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                    isSearchable={true}
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
                    styles={{
                      placeholder: (base) => ({
                        ...base,
                        color: '#cbd5e1',
                      }),
                      menu: (provided) => ({
                        ...provided,
                        // zIndex: 9999, // Giá trị z-index tùy chỉnh
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
                  {errProductOrder && (
                    <label className="text-sm text-red-500">
                      {dataLang?.delivery_receipt_err_select_product_order ||
                        'delivery_receipt_err_select_product_order'}
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className=" bg-[#ECF0F4] p-2 grid  grid-cols-12">
            <div className="col-span-12 font-normal">
              {dataLang?.import_item_information || 'import_item_information'}
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div div className="col-span-3">
              <label className="text-[#344054] font-normal 2xl:text-base text-[14px]">
                {dataLang?.import_click_items || 'import_click_items'}
              </label>
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
                className="rounded-md bg-white 3xl:text-[16px] 2xl:text-[10px] xl:text-[13px] text-[12.5px] "
                isSearchable={true}
                noOptionsMessage={() => 'Không có dữ liệu'}
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
                    primary25: '#EBF5FF',
                    primary50: '#92BFF7',
                    primary: '#0F4F9E',
                  },
                })}
                styles={{
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
                  }),
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10">
            <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-2 text-center truncate font-[400]">
              {dataLang?.import_from_items || 'import_from_items'}
            </h4>
            <div className="col-span-10">
              <div className="grid grid-cols-11">
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-2   text-center  truncate font-[400]">
                  {dataLang?.PDF_house || 'PDF_house'}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                  {'ĐVT'}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                  {dataLang?.import_from_quantity || 'import_from_quantity'}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                  {dataLang?.import_from_unit_price || 'import_from_unit_price'}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                  {dataLang?.import_from_discount || 'import_from_discount'}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                  {dataLang?.returns_sck || 'returns_sck'}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                  {dataLang?.import_from_tax || 'import_from_tax'}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                  {dataLang?.import_into_money || 'import_into_money'}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                  {dataLang?.import_from_note || 'import_from_note'}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                  {dataLang?.import_from_operation || 'import_from_operation'}
                </h4>
              </div>
            </div>
          </div>
          <div className="grid items-center grid-cols-12 gap-1 py-2">
            <div className="col-span-2">
              <Select
                options={options}
                value={null}
                onChange={_HandleAddParent.bind(this)}
                className="col-span-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                placeholder={dataLang?.returns_items || 'returns_items'}
                noOptionsMessage={() => dataLang?.returns_nodata || 'returns_nodata'}
                menuPortalTarget={document.body}
                formatOptionLabel={selectItemsLabel}
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
                styles={{
                  placeholder: (base) => ({
                    ...base,
                    color: '#cbd5e1',
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    // zIndex: 9999,
                  }),
                  control: (base, state) => ({
                    ...base,
                    ...(state.isFocused && {
                      border: '0 0 0 1px #92BFF7',
                      boxShadow: 'none',
                    }),
                  }),
                  menu: (provided, state) => ({
                    ...provided,
                    width: '150%',
                  }),
                }}
              />
            </div>
            <div className="col-span-10">
              <div className="grid grid-cols-11 border-t border-b border-l border-r divide-x">
                <div className="col-span-2">
                  {' '}
                  <Select
                    classNamePrefix="customDropdowDefault"
                    placeholder={dataLang?.delivery_receipt_warehouse || 'delivery_receipt_warehouse'}
                    className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                    isDisabled={true}
                  />
                </div>
                <div className="col-span-1"></div>
                <div className="flex items-center justify-center col-span-1">
                  <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                    <Minus className="scale-50 2xl:scale-100 xl:scale-100" size="16" />
                  </button>
                  <div className=" text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal 3xl:w-24 2xl:w-[60px] xl:w-[50px] w-[40px]  focus:outline-none border-b border-gray-200">
                    1
                  </div>
                  <button className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full">
                    <Add className="scale-50 2xl:scale-100 xl:scale-100" size="16" />
                  </button>
                </div>
                <div className="flex items-center justify-center col-span-1">
                  <div className=" 3xl:text-[12px] w-full 2xl:text-[10px] xl:text-[9.5px] text-[9px] text-center py-1 px-2 font-medium bg-slate-50 text-black">
                    1
                  </div>
                </div>
                <div className="flex items-center justify-center col-span-1">
                  <div className=" w-full 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] text-center py-1 px-2 font-medium bg-slate-50">
                    0
                  </div>
                </div>
                <div className="col-span-1 text-right 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium pr-3 text-black flex items-center justify-end">
                  0
                </div>
                <div className="flex items-center w-full col-span-1">
                  <Select
                    classNamePrefix="customDropdowDefault"
                    placeholder={dataLang?.returns_tax || 'returns_tax'}
                    className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] w-full"
                    isDisabled={true}
                  />
                </div>
                <div className="col-span-1 text-right 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium pr-3 text-black  flex items-center justify-end">
                  1.00
                </div>
                <input
                  placeholder={dataLang?.returns_note || 'returns_note'}
                  disabled
                  className=" disabled:bg-gray-50 col-span-1 placeholder:text-slate-300 w-full bg-[#ffffff] 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  p-1.5 "
                />
                <button
                  title={dataLang?.returns_delete || 'returns_delete'}
                  disabled
                  className="col-span-1 disabled:opacity-50 transition w-full h-full bg-slate-100  rounded-[5.5px] text-red-500 flex flex-col justify-center items-center"
                >
                  <IconDelete />
                </button>
              </div>
            </div>
          </div>
          <Customscrollbar className="max-h-[400px] h-[400px]  overflow-auto pb-2">
            <div className="w-full h-full">
              {isFetching ? (
                <Loading className="w-full h-10" color="#0f4f9e" />
              ) : (
                <>
                  {listData?.map((e) => (
                    <div key={e?.id?.toString()} className="grid items-start grid-cols-12 gap-2 my-1">
                      <div className="h-full col-span-2 p-2 pb-1 border border-r">
                        <div className="relative mt-5">
                          <Select
                            options={options}
                            value={e?.matHang}
                            className=""
                            onChange={_HandleChangeValue.bind(this, e?.id)}
                            menuPortalTarget={document.body}
                            formatOptionLabel={selectItemsLabel}
                            classNamePrefix="customDropdow"
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
                            styles={{
                              placeholder: (base) => ({
                                ...base,
                                color: '#cbd5e1',
                              }),
                              menuPortal: (base) => ({
                                ...base,
                                // zIndex: 9999,
                              }),
                              control: (base, state) => ({
                                ...base,
                                ...(state.isFocused && {
                                  border: '0 0 0 1px #92BFF7',
                                  boxShadow: 'none',
                                }),
                              }),
                              menu: (provided, state) => ({
                                ...provided,
                                width: '150%',
                              }),
                            }}
                          />
                          <button
                            onClick={_HandleAddChild.bind(this, e?.id, e?.matHang)}
                            className="absolute flex flex-col items-center justify-center w-8 h-8 transition ease-in-out rounded bg-slate-100 -top-4 right-5 hover:rotate-45 hover:bg-slate-200 hover:scale-105 hover:text-red-500"
                          >
                            <Add className="" />
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
                      <div className="items-center col-span-10">
                        <div className="grid grid-cols-11  3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] border-b divide-x divide-y border-r">
                          {load ? (
                            <Loading className="h-2 col-span-11" color="#0f4f9e" />
                          ) : (
                            e?.child?.map((ce) => (
                              <React.Fragment key={ce?.id?.toString()}>
                                <div className="flex flex-col justify-center h-full col-span-2 p-1 border-t border-l">
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
                                <div className="text-center  p-0.5 pr-2.5 h-full flex flex-col justify-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                  {ce?.unit}
                                </div>
                                <div className="relative">
                                  <div className="flex items-center justify-center h-full p-0.5">
                                    <button
                                      disabled={
                                        ce?.quantity === 1 ||
                                        ce?.quantity === '' ||
                                        ce?.quantity === null ||
                                        ce?.quantity === 0
                                      }
                                      className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                      onClick={_HandleChangeChild.bind(this, e?.id, ce?.id, 'decrease')}
                                    >
                                      <Minus className="scale-50 2xl:scale-100 xl:scale-100" size="16" />
                                    </button>
                                    <InPutNumericFormat
                                      onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'quantity')}
                                      value={ce?.quantity || null}
                                      className={`${
                                        errQuantity && (ce?.quantity == null || ce?.quantity == '' || ce?.quantity == 0)
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
                                      className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                      onClick={_HandleChangeChild.bind(this, e?.id, ce?.id, 'increase')}
                                    >
                                      <Add className="scale-50 2xl:scale-100 xl:scale-100" size="16" />
                                    </button>
                                  </div>
                                  <div className="absolute top-0 right-0 p-1 cursor-pointer ">
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
                                <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                  <InPutMoneyFormat
                                    className={`${
                                      errPrice && (ce?.price == null || ce?.price == '' || ce?.price == 0)
                                        ? 'border-b border-red-500'
                                        : errSurvivePrice && (ce?.price == null || ce?.price == '' || ce?.price == 0)
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
                                    className="appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px]  focus:outline-none border-b border-gray-200"
                                    onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'discount')}
                                    value={ce?.discount}
                                    isAllowed={isAllowedDiscount}
                                  />
                                </div>

                                <div className="col-span-1 text-right flex items-center justify-end  h-full p-0.5">
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
                                    className={`  3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] border-transparent placeholder:text-slate-300 w-full z-19 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
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
                                <div className="justify-center pr-1  p-0.5 h-full flex flex-col items-end 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                  {formatNumber(
                                    ce?.price *
                                      (1 - Number(ce?.discount) / 100) *
                                      (1 + Number(ce?.tax?.tax_rate) / 100) *
                                      Number(ce?.quantity)
                                  )}
                                </div>
                                <div className="col-span-1 flex items-center justify-center  h-full p-0.5">
                                  <input
                                    value={ce?.note}
                                    onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'note')}
                                    placeholder={dataLang?.delivery_receipt_note || 'delivery_receipt_note'}
                                    type="text"
                                    className="  placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 outline-none mb-2"
                                  />
                                </div>
                                <div className=" h-full p-0.5 flex flex-col items-center justify-center">
                                  <button
                                    title="Xóa"
                                    onClick={_HandleDeleteChild.bind(this, e?.id, ce?.id)}
                                    className="flex flex-col items-center justify-center p-2 text-red-500 transition-all ease-linear rounded-md hover:scale-110 bg-red-50 hover:bg-red-200 animate-bounce-custom"
                                  >
                                    <IconDelete />
                                  </button>
                                </div>
                              </React.Fragment>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </Customscrollbar>
          <div className="grid grid-cols-12 mb-3 font-normal bg-[#ecf0f475] p-2 items-center">
            <div className="flex items-center col-span-2 gap-2">
              <h2>{dataLang?.purchase_order_detail_discount || 'purchase_order_detail_discount'}</h2>
              <div className="flex items-center justify-center col-span-1 text-center">
                <InPutNumericFormat
                  value={generalDiscount}
                  onValueChange={_HandleChangeInput.bind(this, 'generalDiscount')}
                  className="w-20 px-2 py-1 font-medium text-center bg-transparent border-b-2 border-gray-300 focus:outline-none"
                  isAllowed={isAllowedDiscount}
                />
              </div>
            </div>
            <div className="flex items-center col-span-2 gap-2 ">
              <h2>{dataLang?.purchase_order_detail_tax || 'purchase_order_detail_tax'}</h2>
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
                className={` "border-transparent placeholder:text-slate-300 w-[70%] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                isSearchable={true}
                noOptionsMessage={() => dataLang?.returns_nodata || 'returns_nodata'}
                //  dangerouslySetInnerHTML={{__html: option.label}}
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
                    padding: '2.7px',
                    ...(state.isFocused && {
                      border: '0 0 0 1px #92BFF7',
                    }),
                  }),
                }}
              />
            </div>
          </div>
          <h2 className="font-normal bg-[white]  p-2 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]">
            {dataLang?.purchase_order_table_total_outside || 'purchase_order_table_total_outside'}{' '}
          </h2>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-9">
            <div className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.returns_reason || 'returns_reason'}
            </div>
            <textarea
              value={note}
              placeholder={dataLang?.returns_reason || 'returns_reason'}
              onChange={_HandleChangeInput.bind(this, 'note')}
              name="fname"
              type="text"
              className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-[40%] min-h-[220px] max-h-[220px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
            />
          </div>
          <div className="flex-col justify-between col-span-3 mt-5 space-y-4 text-right ">
            <div className="flex justify-between "></div>
            <div className="flex justify-between ">
              <div className="font-normal ">
                <h3>{dataLang?.purchase_order_table_total || 'purchase_order_table_total'}</h3>
              </div>
              <div className="font-normal">
                <h3 className="text-blue-600">
                  {/* {formatNumber(tongTienState.tongTien)} */}
                  {formatMoney(
                    listData?.reduce((accumulator, item) => {
                      const childTotal = item.child?.reduce((childAccumulator, childItem) => {
                        const product = Number(childItem?.price) * Number(childItem?.quantity)
                        return childAccumulator + product
                      }, 0)
                      return accumulator + childTotal
                    }, 0)
                  )}
                </h3>
              </div>
            </div>
            <div className="flex justify-between ">
              <div className="font-normal">
                <h3>{dataLang?.purchase_order_detail_discounty || 'purchase_order_detail_discounty'}</h3>
              </div>
              <div className="font-normal">
                <h3 className="text-blue-600">
                  {/* {formatNumber(tongTienState.tienChietKhau)} */}
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
                </h3>
              </div>
            </div>
            <div className="flex justify-between ">
              <div className="font-normal">
                <h3>
                  {dataLang?.purchase_order_detail_money_after_discount || 'purchase_order_detail_money_after_discount'}
                </h3>
              </div>
              <div className="font-normal">
                <h3 className="text-blue-600">
                  {/* {formatNumber(tongTienState.tongTienSauCK)} */}
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
                </h3>
              </div>
            </div>
            <div className="flex justify-between ">
              <div className="font-normal">
                <h3>{dataLang?.purchase_order_detail_tax_money || 'purchase_order_detail_tax_money'}</h3>
              </div>
              <div className="font-normal">
                <h3 className="text-blue-600">
                  {/* {formatNumber(tongTienState.tienThue)} */}
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
                </h3>
              </div>
            </div>
            <div className="flex justify-between ">
              <div className="font-normal">
                <h3>{dataLang?.purchase_order_detail_into_money || 'purchase_order_detail_into_money'}</h3>
              </div>
              <div className="font-normal">
                <h3 className="text-blue-600">
                  {/* {formatNumber(tongTienState.tongThanhTien)} */}
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
                </h3>
              </div>
            </div>
            <div className="space-x-2">
              <ButtonBack onClick={() => router.push(routerDeliveryReceipt.home)} dataLang={dataLang} />
              <ButtonSubmit onClick={_HandleSubmit.bind(this)} loading={onSending} dataLang={dataLang} />
            </div>
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
    </React.Fragment>
  )
}

export default DeliveryReceiptForm
