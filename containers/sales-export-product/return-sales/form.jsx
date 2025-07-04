import apiReturnSales from '@/Api/apiSalesExportProduct/returnSales/apiReturnSales'
import InfoFormLabel from '@/components/common/orderManagement/InfoFormLabel'
import TableHeader from '@/components/common/orderManagement/TableHeader'
import { Customscrollbar } from '@/components/UI/common/Customscrollbar'
import InPutMoneyFormat from '@/components/UI/inputNumericFormat/inputMoneyFormat'
import InPutNumericFormat from '@/components/UI/inputNumericFormat/inputNumericFormat'
import Loading from '@/components/UI/loading/loading'
import PopupConfim from '@/components/UI/popupConfim/popupConfim'
import LayoutSalesPurchaseOrder from '@/components/UI/salesPurchase/LayoutSalesPurchaseOrder'
import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from '@/constants/delete/deleteItems'
import { FORMAT_MOMENT } from '@/constants/formatDate/formatDate'
import { useBranchList } from '@/hooks/common/useBranch'
import { useClientByBranch } from '@/hooks/common/useClients'
import { useSolutionList } from '@/hooks/common/useSolutions'
import { useTaxList } from '@/hooks/common/useTaxs'
import { useWarehouseComboboxlocation } from '@/hooks/common/useWarehouses'
import useFeature from '@/hooks/useConfigFeature'
import useSetingServer from '@/hooks/useConfigNumber'
import useToast from '@/hooks/useToast'
import { useToggle } from '@/hooks/useToggle'
import { isAllowedDiscount, isAllowedNumber } from '@/utils/helpers/common'
import { formatMoment } from '@/utils/helpers/formatMoment'
import formatMoneyConfig from '@/utils/helpers/formatMoney'
import formatNumberConfig from '@/utils/helpers/formatnumber'
import { useQuery } from '@tanstack/react-query'
import { ConfigProvider, DatePicker, Dropdown } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import dayjs from 'dayjs'
import { Add, ArrowDown2, Minus, TableDocument } from 'iconsax-react'
import moment from 'moment/moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BsCalendarEvent } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import { MdClear } from 'react-icons/md'
import Select from 'react-select'
import Popup from 'reactjs-popup'
import { routerReturnSales } from 'routers/sellingGoods'
import { v4 as uuidv4 } from 'uuid'
import SelectCustomLabel from '../delivery-receipt/components/SelectCustomLabel'
import { useReturnSalesItems } from './hooks/useReturnSalesItems'

const initsFetching = {
  onFetchingCondition: false,
  onLoadingChild: false,
  onSending: false,
  load: false,
}

const initsErors = {
  errClient: false,
  errTreatment: false,
  errBranch: false,
  errWarehouse: false,
  errQuantity: false,
  errSurvive: false,
  errPrice: false,
  errSurvivePrice: false,
}
const initsValue = {
  code: '',
  date: new Date(),
  idBranch: null,
  idClient: null,
  idTreatment: null,
  note: '',
}

const ReturnSalesForm = (props) => {
  const router = useRouter()

  const id = router.query?.id

  const dataLang = props?.dataLang

  const isShow = useToast()

  const { isOpen, isKeyState, handleQueryId } = useToggle()

  const [fetChingData, sFetchingData] = useState(initsFetching)

  const dataSeting = useSetingServer()

  const { dataMaterialExpiry, dataProductSerial, dataProductExpiry } = useFeature()

  const [generalTax, sGeneralTax] = useState()

  const [generalDiscount, sGeneralD] = useState(0)

  const [idChange, sIdChange] = useState(initsValue)

  const [errors, sErrors] = useState(initsErors)

  const [listData, sListData] = useState([])

  const [isTotalMoney, sIsTotalMoney] = useState({
    totalPrice: 0,
    totalDiscountPrice: 0,
    totalDiscountAfterPrice: 0,
    totalTax: 0,
    totalAmount: 0,
  })

  const { data: dataTasxes = [] } = useTaxList()

  const { data: listBranch = [] } = useBranchList()

  const { data: dataSolution } = useSolutionList(dataLang)

  const { data: dataItems = [] } = useReturnSalesItems({
    'filter[client_id]': idChange.idClient !== null ? +idChange.idClient.value : null,
    'filter[branch_id]': idChange.idBranch !== null ? +idChange.idBranch.value : null,
  })

  const { data: dataClient } = useClientByBranch(idChange.idBranch)

  const { data: dataWarehouse } = useWarehouseComboboxlocation({
    'filter[branch_id]': idChange.idBranch ? idChange.idBranch?.value : null,
  })

  const resetAllStates = () => {
    sIdChange(initsValue)
    sErrors(initsErors)
  }

  const formatNumber = (number) => {
    return formatNumberConfig(+number, dataSeting)
  }
  const formatMoney = (number) => {
    return formatMoneyConfig(+number, dataSeting)
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
    queryKey: ['api_page_detail', id],
    queryFn: () => {
      _ServerFetchingDetailPage()
    },
    enabled: !!id,
  })
  const _ServerFetchingDetailPage = async () => {
    const rResult = await apiReturnSales.apiPageDetail(id)
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
            label: ce?.location_name,
            value: ce?.location_warehouses_id,
            warehouse_name: ce?.warehouse_name,
          },
          quantityDelivered: e?.item?.quantity_create,
          quantityPay: e?.item?.quantity_returned,
          quantityLeft: e?.item?.quantity_left,
          unit: e?.item?.unit_name,
          quantity: Number(ce?.quantity),
          price: Number(ce?.price),
          discount: Number(ce?.discount_percent),
          tax: {
            tax_rate: ce?.tax_rate || '0',
            value: ce?.tax_id || '0',
            label: ce?.tax_name || 'Miễn thuế',
          },
          note: ce?.note,
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
    sIdChange({
      code: rResult.code,
      date: moment(rResult?.date).toDate(),
      idBranch: {
        label: rResult?.branch_name,
        value: rResult?.branch_id,
      },
      idClient: {
        label: rResult?.client_name,
        value: rResult?.client_id,
      },
      idTreatment: {
        label: dataLang[rResult?.handling_solution] || rResult?.handling_solution,
        value: rResult?.handling_solution,
      },
      note: rResult?.note,
    })
  }

  const handleSaveStatus = () => {
    isKeyState?.sListData([])
    isKeyState?.sId(isKeyState?.value)
    isKeyState?.idEmty && isKeyState?.idEmty(null)
    handleQueryId({ status: false })
  }

  const handleCancleStatus = () => {
    isKeyState?.sId({ ...isKeyState?.id })
    handleQueryId({ status: false })
  }

  const checkListData = (value, sListData, sId, id, idEmty) => {
    handleQueryId({
      status: true,
      initialKey: { value, sListData, sId, id, idEmty },
    })
  }

  const _HandleChangeInput = (type, value) => {
    const sIdClient = (e) => {
      sIdChange((list) => ({ ...list, idClient: e }))
    }

    const sIdBranch = (e) => {
      sIdChange((list) => ({ ...list, idBranch: e }))
    }

    const onChange = {
      code: () => sIdChange((e) => ({ ...e, code: value.target.value })),

      date: () => sIdChange((e) => ({ ...e, date: formatMoment(value, FORMAT_MOMENT.DATE_TIME_LONG) })),

      startDate: () => sIdChange((e) => ({ ...e, date: new Date() })),

      idClient: () => {
        if (idChange.idClient != value)
          if (listData?.length > 0) {
            checkListData(value, sListData, sIdClient, idChange.idClient)
          } else {
            sIdChange((e) => ({ ...e, idClient: value }))
          }
      },

      treatment: () => sIdChange((e) => ({ ...e, idTreatment: value })),

      note: () => sIdChange((e) => ({ ...e, note: value.target.value })),

      branch: () => {
        if (idChange.idBranch != value)
          if (listData?.length > 0) {
            checkListData(value, sListData, sIdBranch, idChange.idBranch, sIdClient)
          } else {
            sIdChange((e) => ({ ...e, idClient: null, idBranch: value }))
            if (value == null) {
              sIdChange((e) => ({ ...e, idClient: null }))
            }
          }
      },

      generalTax: () => {
        sGeneralTax(value)

        if (listData?.length > 0) {
          const newData = listData.map((e) => {
            const newChild = e?.child.map((ce) => ({ ...ce, tax: value }))
            return { ...e, child: newChild }
          })
          sListData(newData)
        }
      },

      generalDiscount: () => {
        sGeneralD(value?.value)
        if (listData?.length > 0) {
          const newData = listData.map((e) => {
            const newChild = e?.child.map((ce) => ({ ...ce, discount: value?.value }))

            return { ...e, child: newChild }
          })
          sListData(newData)
        }
      },
    }

    onChange[type] && onChange[type]()
  }

  useEffect(() => {
    if (idChange.idBranch !== null) sErrors((prevErrors) => ({ ...prevErrors, errBranch: false }))

    if (idChange.idClient !== null) sErrors((prevErrors) => ({ ...prevErrors, errClient: false }))

    if (idChange.idTreatment !== null) sErrors((prevErrors) => ({ ...prevErrors, errTreatment: false }))
  }, [idChange.idBranch, idChange.idClient, idChange.idTreatment])

  const totalMoney = (listData) => {
    const totalPrice = listData?.reduce((accumulator, item) => {
      const childTotal = item.child?.reduce((childAccumulator, childItem) => {
        const product = Number(childItem?.price) * Number(childItem?.quantity)
        return childAccumulator + product
      }, 0)
      return accumulator + childTotal
    }, 0)

    const totalDiscountPrice = listData?.reduce((accumulator, item) => {
      const childTotal = item.child?.reduce((childAccumulator, childItem) => {
        const product = Number(childItem?.price) * (Number(childItem?.discount) / 100) * Number(childItem?.quantity)
        return childAccumulator + product
      }, 0)
      return accumulator + childTotal
    }, 0)

    const totalDiscountAfterPrice = listData?.reduce((accumulator, item) => {
      const childTotal = item.child?.reduce((childAccumulator, childItem) => {
        const product = Number(childItem?.price * (1 - childItem?.discount / 100)) * Number(childItem?.quantity)
        return childAccumulator + product
      }, 0)
      return accumulator + childTotal
    }, 0)

    const totalTax = listData?.reduce((accumulator, item) => {
      const childTotal = item.child?.reduce((childAccumulator, childItem) => {
        const product =
          Number(childItem?.price * (1 - childItem?.discount / 100)) *
          (isNaN(childItem?.tax?.tax_rate) ? 0 : Number(childItem?.tax?.tax_rate) / 100) *
          Number(childItem?.quantity)
        return childAccumulator + product
      }, 0)
      return accumulator + childTotal
    }, 0)

    const totalAmount = listData?.reduce((accumulator, item) => {
      const childTotal = item.child?.reduce((childAccumulator, childItem) => {
        const product =
          Number(childItem?.price * (1 - childItem?.discount / 100)) *
          (1 + Number(childItem?.tax?.tax_rate) / 100) *
          Number(childItem?.quantity)
        return childAccumulator + product
      }, 0)
      return accumulator + childTotal
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
    const totalPrice = totalMoney(listData)
    sIsTotalMoney(totalPrice)
  }, [listData])

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
      quantityDelivered: value?.e?.quantity_create,
      quantityPay: value?.e?.quantity_returned,
      quantityLeft: value?.e?.quantity_left,
      warehouse: null,
      unit: value?.e?.unit_name,
      price: Number(value?.e?.price),
      quantity: value?.e?.quantity_left,
      discount: generalDiscount ? generalDiscount : Number(value?.e?.discount_percent_item),
      tax: generalTax
        ? generalTax
        : {
            label: value?.e?.tax_name == null ? 'Miễn thuế' : value?.e?.tax_name,
            value: value?.e?.tax_id_item ? value?.e?.tax_id_item : '0',
            tax_rate: value?.e?.tax_rate ? value?.e?.tax_rate : '0',
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
    const { newChild } = _DataValueItem(value)

    const newData = listData?.map((e) => {
      if (e?.id == parentId) {
        return {
          ...e,
          child: [...e.child, { ...newChild, quantity: 0, note: '' }],
        }
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
          const newChild = e.child?.filter((ce) => ce?.id != childId)
          return { ...e, child: newChild }
        }
        return e
      })
      .filter((e) => e.child?.length > 0)

    sListData([...newData])
  }

  const _HandleDeleteAllChild = (parentId) => {
    const newData = listData
      .map((e) => {
        if (e.id === parentId) {
          const newChild = e.child?.filter((ce) => ce?.warehouse != null)
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
        switch (type) {
          case 'quantity':
            sErrors((e) => ({ ...e, errSurvive: false }))

            ce.quantity = Number(value?.value)

            validateQuantity(parentId, childId, type)

            break
          case 'increase':
            sErrors((e) => ({ ...e, errSurvive: false }))

            ce.quantity = Number(ce?.quantity) + 1

            validateQuantity(parentId, childId, type)

            break
          case 'decrease':
            sErrors((e) => ({ ...e, errSurvive: false }))

            ce.quantity = Number(ce?.quantity) - 1
            break
          case 'price':
            sErrors((e) => ({ ...e, errSurvivePrice: false }))

            ce.price = Number(value?.value)
            break
          case 'discount':
            ce.discount = Number(value?.value)
            break
          case 'note':
            ce.note = value?.target.value
            break
          case 'warehouse':
            ce.warehouse = value
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
  /// Hàm kiểm tra số lượng
  const validateQuantity = (parentId, childId, type) => {
    const e = listData.find((item) => item?.id == parentId)
    if (!e) return
    const ce = e.child.find((child) => child?.id == childId)
    if (!ce) return

    const checkMsg = (mssg) => {
      isShow('error', `${mssg}`)
      ce.quantity = ''
      HandTimeout()
    }
    const checkChild = e.child.reduce((sum, opt) => sum + parseFloat(opt?.quantity || 0), 0)
    if (type == 'increase' && ce?.quantity > +ce?.quantityLeft) {
      checkMsg(`Số lượng vượt quá ${formatNumber(+ce?.quantityLeft)} số lượng còn lại`)
    } else if (checkChild > +ce?.quantityLeft) {
      checkMsg(`Tổng số lượng vượt quá ${formatNumber(+ce?.quantityLeft)} số lượng còn lại`)
    }
  }

  const HandTimeout = () => {
    setTimeout(() => {
      sErrors((e) => ({ ...e, errQuantity: true }))
      sFetchingData((e) => ({ ...e, load: true }))
    }, 500)
    setTimeout(() => {
      sFetchingData((e) => ({ ...e, load: false }))
    }, 1300)
  }

  const _HandleChangeValue = (parentId, value) => {
    const checkData = listData?.some((e) => e?.matHang?.value == value?.value)
    if (!checkData) {
      const newData = listData?.map((e) => {
        if (e?.id == parentId) {
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

  const selectItemsLabel = (option) => {
    return (
      <div className="py-2">
        <div className="flex items-center gap-1">
          <div className="w-[40px] h-[50px]">
            {option.e?.images != null ? (
              <img
                src={option.e?.images}
                alt="Product Image"
                className="max-w-[40px] h-[50px] text-[8px] object-cover rounded"
              />
            ) : (
              <div className=" w-[40px] h-[50px] object-cover  flex items-center justify-center rounded">
                <img
                  src="/icon/noimagelogo.png"
                  alt="Product Image"
                  className="w-[30px] h-[30px] object-cover rounded"
                />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">{option.e?.name}</h3>
            <div className="flex gap-2">
              <h5 className="text-gray-400 font-normal 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                {option.e?.code}
              </h5>
              <h5 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                {option.e?.product_variation}
              </h5>
            </div>
            <div className="flex items-center gap-1">
              <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                {option.e?.import_code} -{' '}
              </h5>
              <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                {dataLang[option.e?.text_type]}
              </h5>
            </div>

            <div className="flex items-center gap-2 italic">
              {dataProductSerial.is_enable === '1' && (
                <div className="text-[11px] text-[#667085] font-[500]">
                  Serial: {option.e?.serial ? option.e?.serial : '-'}
                </div>
              )}
              {dataMaterialExpiry.is_enable === '1' || dataProductExpiry.is_enable === '1' ? (
                <>
                  <div className="text-[11px] text-[#667085] font-[500]">
                    Lot: {option.e?.lot ? option.e?.lot : '-'}
                  </div>
                  <div className="text-[11px] text-[#667085] font-[500]">
                    Date:{' '}
                    {option.e?.expiration_date
                      ? formatMoment(option.e?.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG)
                      : '-'}
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  const _HandleSubmit = (e) => {
    e.preventDefault()
    const checkChildItem = (childItem, property) => {
      switch (property) {
        case 'warehouse':
          return (
            childItem.warehouse == null || (id && (!childItem.warehouse?.label || !childItem.warehouse?.warehouse_name))
          )
        case 'quantity':
          return childItem.quantity == null || childItem.quantity == '' || childItem.quantity == 0
        case 'price':
          return childItem.price == null || childItem.price === '' || childItem.price == 0
        default:
          return false
      }
    }

    const checkPropertyRecursive = (list, property) => {
      return list.some((item) => item.child?.some((childItem) => checkChildItem(childItem, property)))
    }

    const hasNullWarehouse = checkPropertyRecursive(listData, 'warehouse')

    const hasNullQuantity = checkPropertyRecursive(listData, 'quantity')

    const hasNullPrice = checkPropertyRecursive(listData, 'price')

    const isEmpty = listData?.length == 0

    if (
      !idChange.idClient ||
      !idChange.idTreatment ||
      !idChange.idBranch ||
      hasNullWarehouse ||
      hasNullQuantity ||
      hasNullPrice ||
      isEmpty
    ) {
      sErrors((e) => ({
        ...e,
        errClient: !idChange.idClient,
        errTreatment: !idChange.idTreatment,
        errBranch: !idChange.idBranch,
        errWarehouse: hasNullWarehouse,
        errQuantity: hasNullQuantity,
        errPrice: hasNullPrice,
      }))
      if (!idChange.idClient || !idChange.idTreatment || !idChange.idBranch) {
        isShow('error', `${dataLang?.required_field_null}`)
      } else if (isEmpty) {
        isShow('error', `Chưa nhập thông tin mặt hàng`)
      } else if (hasNullPrice) {
        isShow('error', `${'Vui lòng nhập đơn giá'}`)
      } else {
        isShow('error', `${dataLang?.required_field_null}`)
      }
    } else {
      sFetchingData((e) => ({ ...e, onSending: true }))
    }
  }
  const _ServerSending = async () => {
    let formData = new FormData()

    formData.append('code', idChange.code ? idChange.code : '')

    formData.append(
      'date',
      formatMoment(idChange.date, FORMAT_MOMENT.DATE_TIME_LONG)
        ? formatMoment(idChange.date, FORMAT_MOMENT.DATE_TIME_LONG)
        : ''
    )
    formData.append('branch_id', idChange.idBranch?.value ? idChange.idBranch?.value : '')
    formData.append('client_id', idChange.idClient?.value ? idChange.idClient?.value : '')
    formData.append('handling_solution', idChange.idTreatment?.value ? idChange.idTreatment?.value : '')
    formData.append('note', idChange.note ? idChange.note : '')
    listData.forEach((item, index) => {
      formData.append(`items[${index}][id]`, id ? item?.idParenBackend : '')
      formData.append(`items[${index}][item]`, item?.matHang?.value)
      item?.child?.forEach((childItem, childIndex) => {
        formData.append(`items[${index}][child][${childIndex}][row_id]`, id ? childItem?.idChildBackEnd : '')
        formData.append(`items[${index}][child][${childIndex}][quantity]`, childItem?.quantity)
        formData.append(`items[${index}][child][${childIndex}][tax_id]`, childItem?.tax?.value)
        formData.append(`items[${index}][child][${childIndex}][price]`, childItem?.price)
        formData.append(`items[${index}][child][${childIndex}][location_warehouses_id]`, childItem?.warehouse?.value)
        formData.append(`items[${index}][child][${childIndex}][discount_percent]`, childItem?.discount)
        formData.append(`items[${index}][child][${childIndex}][note]`, childItem?.note)
      })
    })

    const { isSuccess, message } = await apiReturnSales.apiHandingReturnSales(id, formData)

    if (isSuccess) {
      isShow('success', `${dataLang[message] || message}` || message)

      resetAllStates()

      sListData([])

      router.push(routerReturnSales.home)
    } else {
      isShow('error', `${dataLang[message] || message}` || message)
    }
    sFetchingData((e) => ({ ...e, onSending: false }))
  }

  useEffect(() => {
    fetChingData.onSending && _ServerSending()
  }, [fetChingData.onSending])

  // breadcrumb
  const breadcrumbItems = [
    {
      label: `${dataLang?.returnSales_title || 'returnSales_title'}`,
    },
    {
      label: `${dataLang?.returnSales_titleLits || 'returnSales_titleLits'}`,
      href: routerReturnSales.home,
    },
    {
      label: `${
        id ? dataLang?.returnSales_edit || 'returnSales_edit' : dataLang?.returnSales_add || 'returnSales_add'
      }`,
    },
  ]
  console.log('listData', listData)

  return (
    <LayoutSalesPurchaseOrder
      dataLang={dataLang}
      titleHead={id ? dataLang?.returnSales_edit || 'returnSales_edit' : dataLang?.returnSales_add || 'returnSales_add'}
      breadcrumbItems={breadcrumbItems}
      titleLayout={dataLang?.returnSales_titleLits || 'returnSales_titleLits'}
      searchBar={
        <div className="relative w-full">
          <Select
            options={options}
            value={null}
            onChange={_HandleAddParent.bind(this)}
            className="rounded-md bg-white 3xl:text-[16px] text-[13px]"
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
                primary25: '#0000000A',
                primary50: 'transparent',
                primary: '#C7DFFB',
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
                borderRadius: '8px',
                boxShadow: state.isFocused || state.isHovered ? '0 0 0 2px #003DA0' : '0 0 0 1px #D0D5DD',
              }),
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1760B9] p-1.5 rounded-lg pointer-events-none">
            <CiSearch className="text-white responsive-text-lg" />
          </div>
        </div>
      }
      tableLeft={
        <>
          <div className="grid grid-cols-12 items-center sticky top-0 z-10 py-2 mb-2 border-b border-gray-100">
            <TableHeader className="text-left col-span-2">
              {dataLang?.import_from_items || 'import_from_items'}
            </TableHeader>
            <div className="col-span-10">
              <div className="grid grid-cols-8">
                <TableHeader className="text-center col-span-2">{dataLang?.PDF_house || 'PDF_house'}</TableHeader>
                <TableHeader className="text-center col-span-1">
                  {dataLang?.import_from_quantity || 'import_from_quantity'}
                </TableHeader>
                <TableHeader className="text-center col-span-1">
                  {dataLang?.import_from_unit_price || 'import_from_unit_price'}
                </TableHeader>
                {/* Chọn hàng loạt % Chiếu khấu */}
                <Dropdown
                  overlay={
                    <div className="border px-4 py-5 shadow-lg bg-white rounded-lg">
                      <p className="3xl:text-base font-normal font-deca text-secondary-color-text mb-2">
                        Chọn hoàng loạt % chiết khấu
                      </p>
                      <div className="flex items-center justify-center col-span-1 text-center">
                        <InPutNumericFormat
                          isAllowed={isAllowedDiscount}
                          value={generalDiscount}
                          onValueChange={_HandleChangeInput.bind(this, 'generalDiscount')}
                          className="cursor-text appearance-none text-end 3xl:m-2 3xl:p-2 m-1 p-2 h-10 font-deca font-normal w-full focus:outline-none border rounded-lg 3xl:text-sm 3xl:font-semibold text-black-color 2xl:text-[12px] xl:text-[11px] text-[10px] border-gray-200"
                        />
                      </div>
                    </div>
                  }
                  trigger={['click']}
                  placement="bottomCenter"
                  arrow
                >
                  <div className="inline-flex items-center justify-between cursor-pointer w-full">
                    <TableHeader className="text-left">
                      {dataLang?.import_from_discount || 'import_from_discount'}
                    </TableHeader>
                    <ArrowDown2 size={16} className="text-neutral-02 font-medium" />
                  </div>
                </Dropdown>
                <TableHeader className="text-center col-span-1">{dataLang?.returns_sck || 'returns_sck'}</TableHeader>
                {/* Chọn hàng loại % Thuế */}
                <Dropdown
                  overlay={
                    <div className="px-4 py-5 shadow-lg bg-white rounded-lg">
                      <p className="3xl:text-base font-normal font-deca text-secondary-color-text mb-2">
                        Chọn hoàng loạt % thuế
                      </p>
                      <SelectCustomLabel
                        placeholder={dataLang?.import_from_tax || 'import_from_tax'}
                        options={taxOptions}
                        value={generalTax}
                        onChange={(value) => _HandleChangeInput('generalTax', value)}
                        renderOption={(option, isLabel) => (
                          <div
                            className={`flex items-center justify-start gap-1 text-[#1C252E] ${isLabel ? ' py-2' : ''}`}
                          >
                            <h2 className="responsive-text-sm leading-normal">{option?.label}</h2>
                            {option?.tax_rate !== '0' && option?.tax_rate !== '5' && (
                              <h2 className="responsive-text-sm leading-normal">
                                {option?.tax_rate === '20' ? `(${option?.tax_rate}%)` : `${option?.tax_rate}%`}
                              </h2>
                            )}
                          </div>
                        )}
                        isLabel={true}
                        isPopupMatchSelectWidth={false}
                      />
                    </div>
                  }
                  trigger={['click']}
                  placement="bottomCenter"
                  arrow
                >
                  <div className="inline-flex items-center justify-between cursor-pointer w-full">
                    <TableHeader className="text-left">{dataLang?.import_from_tax || 'import_from_tax'}</TableHeader>
                    <ArrowDown2 size={16} className="text-neutral-02 font-medium" />
                  </div>
                </Dropdown>

                <TableHeader className="text-center col-span-1">
                  {dataLang?.import_into_money || 'import_into_money'}
                </TableHeader>
              </div>
            </div>
          </div>

          <Customscrollbar className="max-h-[680px] overflow-auto pb-2">
            <div className="h-full w-full">
              {isFetching ? (
                <Loading className="w-full h-10" color="#0f4f9e" />
              ) : (
                <>
                  {listData?.map((e) => {
                    const option = e?.matHang

                    return (
                      <div key={e?.id?.toString()} className="grid items-start grid-cols-12 gap-3 2xl:gap-4 my-1">
                        {/* Mặt hàng */}
                        <div className="h-full col-span-2 p-2 pb-1">
                          <div className="flex items-center justify-between gap-1 xl:gap-2">
                            <div className="flex items-start">
                              <div className="flex xl:flex-row flex-col items-start gap-3">
                                <img
                                  src={option?.e?.images ?? '/icon/noimagelogo.png'}
                                  alt={option?.e?.name}
                                  className="size-16 object-cover rounded-md"
                                />
                                <div>
                                  <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                    {option.e?.name}
                                  </h3>
                                  <div className="flex flex-col">
                                    <h5 className="text-gray-400 font-normal 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                      {option.e?.code}
                                    </h5>
                                    <h5 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                      {option.e?.product_variation}
                                    </h5>
                                  </div>
                                  {option.e?.import_code && (
                                    <div className="flex items-center gap-1">
                                      <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                        {option.e?.import_code} - {dataLang[option.e?.text_type]}
                                      </h5>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 italic">
                                    {dataProductSerial.is_enable === '1' && (
                                      <div className="text-[11px] text-[#667085] font-[500]">
                                        Serial: {option.e?.serial ? option.e?.serial : '-'}
                                      </div>
                                    )}
                                    {dataMaterialExpiry.is_enable === '1' || dataProductExpiry.is_enable === '1' ? (
                                      <>
                                        <div className="text-[11px] text-[#667085] font-[500]">
                                          Lot: {option.e?.lot ? option.e?.lot : '-'}
                                        </div>
                                        <div className="text-[11px] text-[#667085] font-[500]">
                                          Date:{' '}
                                          {option.e?.expiration_date
                                            ? formatMoment(option.e?.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG)
                                            : '-'}
                                        </div>
                                      </>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={_HandleAddChild.bind(this, e?.id, e?.matHang)}
                              className="flex items-center justify-center 2xl:size-7 size-5 transition ease-in-out rounded text-typo-blue-1 bg-primary-05 hover:rotate-45 hover:hover:bg-[#e2f0fe] hover:scale-105 hover:text-red-500"
                            >
                              <Add />
                            </button>
                          </div>
                          {/* Ghi chú */}
                          <div className="flex items-center justify-center mt-2">
                            <Image
                              src={'/icon/pen.svg'}
                              alt="icon pen"
                              width={16}
                              height={16}
                              className="size-3 object-cover"
                            />
                            <input
                              //   value={ce?.note}
                              //   onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'note')}
                              placeholder={dataLang?.delivery_receipt_note || 'delivery_receipt_note'}
                              name="optionEmail"
                              type="text"
                              className="focus:border-[#92BFF7] placeholder:responsive-text-xs 2xl:h-7 xl:h-5 py-0 px-1 responsive-text-xs placeholder-slate-300 w-full bg-white rounded-[5.5px] text-[#1C252E] font-normal outline-none placeholder:text-typo-gray-4"
                            />
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
                          <div className="grid grid-cols-8 gap-3 2xl:gap-4 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                            {fetChingData.load ? (
                              <Loading className="h-2 col-span-11" color="#0f4f9e" />
                            ) : (
                              e?.child?.map((ce) => (
                                <React.Fragment key={ce?.id?.toString()}>
                                  {/* Kho - Vị trí kho */}
                                  <div className="flex flex-col justify-center h-full col-span-2 p-1">
                                    <SelectCustomLabel
                                      dataLang={dataLang}
                                      placeholder={
                                        fetChingData.onLoadingChild ? '' : dataLang?.PDF_house || 'PDF_house'
                                      }
                                      options={dataWarehouse}
                                      value={ce?.warehouse}
                                      onChange={(value) => _HandleChangeChild(e?.id, ce?.id, 'warehouse', value)}
                                      formatNumber={formatNumber}
                                      isError={
                                        (errors.errWarehouse && ce?.warehouse == null) ||
                                        (errors.errWarehouse &&
                                          (ce?.warehouse?.label == null || ce?.warehouse?.warehouse_name == null))
                                      }
                                      isVisibleLotDate={false}
                                    />
                                    {/* <Select
                                      options={dataWarehouse}
                                      value={ce?.warehouse}
                                      isLoading={ce?.warehouse == null ? fetChingData.onLoadingChild : false}
                                      onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'warehouse')}
                                      className={`${
                                        (errors.errWarehouse && ce?.warehouse == null) ||
                                        (errors.errWarehouse &&
                                          (ce?.warehouse?.label == null || ce?.warehouse?.warehouse_name == null))
                                          ? 'border-red-500 border'
                                          : ''
                                      }  my-1 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal `}
                                      placeholder={
                                        fetChingData.onLoadingChild ? '' : dataLang?.PDF_house || 'PDF_house'
                                      }
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
                                      // styles={{
                                      //   menu: (provided, state) => ({
                                      //     ...provided,
                                      //     width: "200%",
                                      //   }),
                                      // }}
                                      classNamePrefix="customDropdow"
                                    /> */}
                                  </div>

                                  {/* ĐVT */}
                                  {/* <div className="text-center  p-0.5 pr-2.5 h-full flex flex-col justify-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                    {ce?.unit}
                                  </div> */}

                                  {/* Số lượng */}
                                  <div className="flex items-center justify-center">
                                    <div
                                      className={`relative flex items-center justify-center 3xl:p-2 xl:p-[2px] p-[1px] border rounded-3xl ${
                                        errors.errQuantity &&
                                        (ce?.quantity == null || ce?.quantity == '' || ce?.quantity == 0)
                                          ? 'border-red-500'
                                          : errors.errSurvive
                                          ? 'border-red-500'
                                          : 'border-border-gray-2'
                                      } ${
                                        (ce?.quantity == 0 && 'border-red-500') ||
                                        (ce?.quantity == '' && 'border-red-500')
                                      }  `}
                                    >
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
                                        <Minus size="14" className="scale-75 2xl:scale-100 xl:scale-90" />
                                      </button>
                                      <InPutNumericFormat
                                        onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'quantity')}
                                        value={ce?.quantity || null}
                                        className={`appearance-none text-center responsive-text-sm font-normal w-full focus:outline-none`}
                                        isAllowed={({ floatValue }) => {
                                          if (floatValue == 0) {
                                            return true
                                          }
                                          if (+floatValue > +ce?.quantityLeft) {
                                            isShow(
                                              'error',
                                              `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
                                                +ce?.quantityLeft
                                              )} số lượng còn lại`
                                            )
                                            return false
                                          } else {
                                            return true
                                          }
                                        }}
                                      />
                                      <button
                                        className="2xl:scale-100 xl:scale-90 scale-75 text-black hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-primary-05 rounded-full"
                                        onClick={_HandleChangeChild.bind(this, e?.id, ce?.id, 'increase')}
                                      >
                                        <Add size="16" className="scale-75 2xl:scale-100 xl:scale-90" />
                                      </button>
                                      <div className="absolute -top-4 -right-2 p-1 cursor-pointer">
                                        <Popup
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
                                          position="bottom center"
                                          on={['hover', 'focus']}
                                        >
                                          <div className="flex flex-col bg-primary-06 px-2.5 py-0.5 rounded-lg font-deca">
                                            <span className="text-xs font-medium">
                                              Sl đã giao: {formatNumber(+ce?.quantityDelivered)}
                                            </span>
                                            <span className="text-xs font-medium">
                                              Sl đã trả: {formatNumber(ce?.quantityPay)}
                                            </span>
                                            <span className="text-xs font-medium">
                                              Sl còn lại: {formatNumber(ce?.quantityLeft)}
                                            </span>
                                          </div>
                                        </Popup>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Đơn giá */}
                                  <div
                                    className={`flex items-center justify-center py-2 px-2 2xl:px-3 rounded-lg border ${
                                      errors.errPrice && (ce?.price == null || ce?.price == '' || ce?.price == 0)
                                        ? 'border-red-500'
                                        : errors.errSurvivePrice &&
                                          (ce?.price == null || ce?.price == '' || ce?.price == 0)
                                        ? 'border-red-500'
                                        : 'border-neutral-N400'
                                    } ${
                                      (ce?.price == 0 && 'border-red-500') || (ce?.price == '' && 'border-red-500')
                                    } `}
                                  >
                                    <InPutMoneyFormat
                                      className={`appearance-none text-right responsive-text-sm font-semibold w-full focus:outline-none `}
                                      onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'price')}
                                      value={ce?.price}
                                      isAllowed={isAllowedNumber}
                                    />
                                    <span className="pl-1 text-right responsive-text-sm font-semibold underline">
                                      đ
                                    </span>
                                  </div>

                                  {/* % Chiết khấu */}
                                  <div className="flex items-center justify-end py-2 px-2 2xl:px-3 rounded-lg border border-neutral-N400 responsive-text-sm font-semibold">
                                    <InPutNumericFormat
                                      className="appearance-none w-full focus:outline-none text-right"
                                      onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'discount')}
                                      value={ce?.discount}
                                      isAllowed={isAllowedDiscount}
                                    />
                                    <span className="2xl:pl-1">%</span>
                                  </div>

                                  {/* Đơn giá sau chiết khấu */}
                                  <div className={`flex items-center text-left responsive-text-sm font-semibold`}>
                                    <h3>{formatMoney(Number(ce?.price) * (1 - Number(ce?.discount) / 100))}</h3>
                                    <span className="pl-1 underline">đ</span>
                                  </div>

                                  {/* % Thuế */}
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

                                  {/* Thành tiền và nút xóa*/}
                                  <div className="flex items-center justify-between gap-2 pr-1 p-0.5">
                                    <span className="text-left responsive-text-sm font-semibold">
                                      {formatMoney(
                                        ce?.price *
                                          (1 - Number(ce?.discount) / 100) *
                                          (1 + Number(ce?.tax?.tax_rate) / 100) *
                                          Number(ce?.quantity)
                                      )}
                                    </span>
                                    <span className="pl-1 underline">đ</span>
                                    {/* Nút xoá */}
                                    <div className="flex items-center">
                                      <button
                                        title="Xóa"
                                        onClick={_HandleDeleteChild.bind(this, e?.id, ce?.id)}
                                        className="transition 3xl:size-6 size-5 responsive-text-sm bg-gray-300 text-black hover:text-typo-black-3/60 flex flex-col justify-center items-center border rounded-full"
                                      >
                                        <MdClear />
                                      </button>
                                    </div>
                                  </div>
                                </React.Fragment>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </Customscrollbar>
        </>
      }
      info={
        <div className="flex flex-col gap-4 relative">
          {/* Mã chứng từ */}
          <div className="flex flex-col flex-wrap items-center gap-y-3">
            <InfoFormLabel label={dataLang?.import_code_vouchers || 'import_code_vouchers'} />
            <div className="w-full relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500">#</span>
              <input
                value={idChange.code}
                onChange={_HandleChangeInput.bind(this, 'code')}
                name="fname"
                type="text"
                placeholder={dataLang?.purchase_order_system_default || 'purchase_order_system_default'}
                className={`2xl:text-[14px] text-[13px] placeholder:text-sm z-10 pl-8 hover:border-[#0F4F9E] focus:border-[#0F4F9E] w-full text-gray-600 font-normal border border-[#d0d5dd] p-2 rounded-lg outline-none cursor-text`}
              />
            </div>
          </div>
          {/* Ngày chứng từ */}
          <div className="flex flex-col flex-wrap items-center gap-y-3">
            <InfoFormLabel label={dataLang?.import_day_vouchers || 'import_day_vouchers'} />

            <div className="relative w-full flex flex-row custom-date-picker date-form">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <BsCalendarEvent color="#7a7a7a" />
              </span>
              <ConfigProvider locale={viVN}>
                <DatePicker
                  className="sales-product-date pl-9 placeholder:text-secondary-color-text-disabled cursor-pointer"
                  //   status={errDate ? 'error' : ''}
                  placeholder="Chọn ngày"
                  format="DD/MM/YYYY HH:mm"
                  showTime={{
                    defaultValue: dayjs('00:00', 'HH:mm'),
                    format: 'HH:mm',
                  }}
                  suffixIcon={null}
                  //   value={dayjs(idChange.date)}
                  //   onChange={(date) => {
                  //     if (date) {
                  //       const dateString = date.toDate().toString()
                  //       sStartDate(dateString)
                  //     }
                  //   }}
                />
              </ConfigProvider>
              {/* <DatePicker
                blur
                fixedHeight
                showTimeSelect
                selected={idChange.date}
                onSelect={(date) => sIdChange((e) => ({ ...e, date: date }))}
                onChange={(e) => _HandleChangeInput(e, 'date')}
                placeholderText="DD/MM/YYYY HH:mm:ss"
                dateFormat="dd/MM/yyyy h:mm:ss aa"
                timeInputLabel={'Time: '}
                placeholder={dataLang?.price_quote_system_default || 'price_quote_system_default'}
                className={`border ${'focus:border-[#92BFF7] border-[#d0d5dd]'} placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
              />
              {idChange.date && (
                <>
                  <MdClear
                    className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                    onClick={() => _HandleChangeInput('startDate')}
                  />
                </>
              )} */}
            </div>
          </div>
          {/* Khách hàng */}
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col flex-wrap items-center gap-y-3">
              <InfoFormLabel label={dataLang?.returnSales_client || 'returnSales_client'} isRequired />
              <Select
                options={dataClient}
                onChange={_HandleChangeInput.bind(this, 'idClient')}
                value={idChange.idClient}
                placeholder={dataLang?.returnSales_client || 'returnSales_client'}
                hideSelectedOptions={false}
                isClearable={true}
                className={`${
                  errors.errClient ? 'border-red-500' : 'border-transparent'
                } placeholder:text-slate-300 w-full z-[30]  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
            {errors.errClient && (
              <label className="text-sm text-red-500">
                {dataLang?.returnSales_errClient || 'returnSales_errClient'}
              </label>
            )}
          </div>
          {/* Chi nhánh */}
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col flex-wrap items-center gap-y-3">
              <InfoFormLabel isRequired label={dataLang?.import_branch || 'import_branch'} />
              <Select
                options={listBranch}
                onChange={_HandleChangeInput.bind(this, 'branch')}
                value={idChange.idBranch}
                isClearable={true}
                closeMenuOnSelect={true}
                hideSelectedOptions={false}
                placeholder={dataLang?.import_branch || 'import_branch'}
                className={`${
                  errors.errBranch ? 'border-red-500' : 'border-transparent'
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
            </div>
            {errors.errBranch && (
              <label className="text-sm text-red-500">
                {dataLang?.purchase_order_errBranch || 'purchase_order_errBranch'}
              </label>
            )}
          </div>
          {/* Phương thức xử lí */}
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col flex-wrap items-center gap-y-3">
              <InfoFormLabel isRequired label={dataLang?.returns_treatment_methods || 'returns_treatment_methods'} />
              <Select
                options={dataSolution}
                onChange={_HandleChangeInput.bind(this, 'treatment')}
                value={idChange.idTreatment}
                isClearable={true}
                noOptionsMessage={() => dataLang?.returns_nodata || 'returns_nodata'}
                closeMenuOnSelect={true}
                hideSelectedOptions={false}
                placeholder={dataLang?.returns_treatment_methods || 'returns_treatment_methods'}
                className={`${
                  errors.errTreatment ? 'border-red-500' : 'border-transparent'
                } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
            {errors.errTreatment && (
              <label className="text-sm text-red-500">
                {dataLang?.returns_treatment_methods_err || 'returns_treatment_methods_err'}
              </label>
            )}
          </div>
        </div>
      }
      note={
        <div className="flex flex-col">
          <h4 className="responsive-text-base font-normal text-secondary-color-text mb-3 capitalize">
            {dataLang?.returns_reason || 'returns_reason'}
          </h4>
          <div className="w-full pb-6">
            <textarea
              value={idChange.note}
              placeholder={dataLang?.returns_reason || 'returns_reason'}
              onChange={_HandleChangeInput.bind(this, 'note')}
              name="fname"
              type="text"
              className="focus:border-brand-color border-gray-200 placeholder-secondary-color-text-disabled placeholder:responsive-text-base w-full h-[68px] max-h-[68px] bg-[#ffffff] rounded-lg text-[#52575E] responsive-text-base font-normal px-3 py-2 border outline-none"
            />
          </div>
        </div>
      }
      isTotalMoney={isTotalMoney}
      routerBack={routerReturnSales.home}
      onSave={_HandleSubmit.bind(this)}
      onSending={initsFetching.onSending}
      popupConfim={
        <PopupConfim
          dataLang={dataLang}
          type="warning"
          title={TITLE_DELETE_ITEMS}
          nameModel={'change_item'}
          subtitle={CONFIRMATION_OF_CHANGES}
          isOpen={isOpen}
          save={handleSaveStatus}
          cancel={handleCancleStatus}
        />
      }
    />
  )
}

export default ReturnSalesForm
