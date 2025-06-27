import apiDeliveryReceipt from '@/Api/apiSalesExportProduct/deliveryReceipt/apiDeliveryReceipt'
import Breadcrumb from '@/components/UI/breadcrumb/BreadcrumbCustom'
import { EmptyExprired } from '@/components/UI/common/EmptyExprired'
import { Container } from '@/components/UI/common/layout'
import PopupConfim from '@/components/UI/popupConfim/popupConfim'
import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from '@/constants/delete/deleteItems'
import { FORMAT_MOMENT } from '@/constants/formatDate/formatDate'
import { useBranchList } from '@/hooks/common/useBranch'
import { useClientComboboxByFilterBranch } from '@/hooks/common/useClients'
import { useStaffComboboxByBranch, useStaffOptions } from '@/hooks/common/useStaffs'
import { useTaxList } from '@/hooks/common/useTaxs'
import useFeature from '@/hooks/useConfigFeature'
import useSetingServer from '@/hooks/useConfigNumber'
import useStatusExprired from '@/hooks/useStatusExprired'
import useToast from '@/hooks/useToast'
import { useToggle } from '@/hooks/useToggle'
import { formatMoment } from '@/utils/helpers/formatMoment'
import formatMoneyConfig from '@/utils/helpers/formatMoney'
import formatNumberConfig from '@/utils/helpers/formatnumber'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd'
import moment from 'moment/moment'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { components } from 'react-select'
import { routerDeliveryReceipt } from 'routers/sellingGoods'
import { v4 as uuidv4 } from 'uuid'
import SidebarLeft from './form/SidebarLeft'
import SidebarRight from './form/SidebarRight'
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

  const authState = useSelector((state) => state.auth)

  // State
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

  const [allSearchItems, sAllSearchItems] = useState([])

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

  const [generalSelectInfo, sGeneralSelectInfo] = useState({
    selectedBranch: null,
    selectedStaff: null,
  })

  // Data Fetching
  const { data: dataTasxes = [] } = useTaxList()

  const { data: dataBranch = [] } = useBranchList()

  const { data: dataStaff = [] } = useStaffOptions({ 'filter[branch_id]': idBranch !== null ? +idBranch?.value : null })
  const { data: dataStaffs = [] } = useStaffComboboxByBranch({
    branch_id: generalSelectInfo.selectedBranch != null ? [+generalSelectInfo.selectedBranch]?.map((e) => e) : null,
  })

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

  // Gán chi nhánh đầu tiên vào state selectedBranch khi render
  useEffect(() => {
    if (dataBranch.length > 0 && dataBranch[0]?.value)
      sGeneralSelectInfo((prev) => ({
        ...prev,
        selectedBranch: dataBranch[0].value,
      }))
  }, [dataBranch])

  // Gán nhân viên theo staff_id từ authState lọc từ mảng dataStaffs
  useEffect(() => {
    if (dataStaffs.length > 0 && authState?.staff_id) {
      const staff = dataStaffs.find((e) => e.value === authState?.staff_id)

      sGeneralSelectInfo((prev) => ({
        ...prev,
        selectedStaff: staff,
      }))
    }
  }, [dataStaffs, authState?.staff_id])

  // fetch items
  const handleFetchingAllSearchItems = async () => {
    let form = new FormData()
    if (selectedBranch != null) {
      ;[+selectedBranch].forEach((e, index) => form.append(`branch_id[${index}]`, e))
    }

    // try {
    //   const {
    //     data: { result },
    //   } = await apiDeliveryReceipt.(form)

    //   sAllSearchItems(result)
    // } catch (_error) {}
  }

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

  const sortedArr = []

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
          <React.Fragment>
            <Breadcrumb items={breadcrumbItems} className="3xl:text-sm 2xl:text-xs xl:text-[10px] lg:text-[10px]" />
          </React.Fragment>
        )}
        <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-typo-gray-5 capitalize font-medium mt-1 2xl:!mb-5 lg:!mb-3">
          {id ? 'Sửa Phiếu Giao Hàng' : 'Thêm Phiếu Giao Hàng'}
        </h2>

        <div className="flex w-full 3xl:gap-x-6 gap-x-4 items-stretch pb-40 relative">
          {/* Cột trái */}
          <div className="w-3/4">
            <SidebarLeft dataLang={dataLang} formatNumber={formatNumber} sortedArr={sortedArr} />
          </div>

          {/* Cột phải */}
          <div className="w-1/4">
            <SidebarRight dataLang={dataLang} />
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
              //   onClick={handleSubmitValidate.bind(this)}
              dataLang={dataLang}
              //   loading={onSending}
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
