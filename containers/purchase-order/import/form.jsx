import apiImport from '@/Api/apiPurchaseOrder/apiImport'
import { DocumentDate, DocumentNumber } from '@/components/common/orderManagement/GeneralInfo'
import ItemTotalAndDelete from '@/components/common/orderManagement/ItemTotalAndDelete'
import LayoutOrderManagement from '@/components/common/orderManagement/LayoutOrderManagement'
import MenuList from '@/components/common/orderManagement/MenuList'
import SelectSearchBar from '@/components/common/orderManagement/SelectSearchBar'
import TableHeader from '@/components/common/orderManagement/TableHeader'
import TextareaNote from '@/components/common/orderManagement/TextareaNote'
import { Customscrollbar } from '@/components/UI/common/Customscrollbar'
import { TagColorProduct } from '@/components/UI/common/Tag/TagStatus'
import SelectComponent from '@/components/UI/filterComponents/selectComponent'
import SelectItemComponent from '@/components/UI/filterComponents/selectItemComponent'
import InPutMoneyFormat from '@/components/UI/inputNumericFormat/inputMoneyFormat'
import InPutNumericFormat from '@/components/UI/inputNumericFormat/inputNumericFormat'
import Loading from '@/components/UI/loading/loading'
import PopupConfim from '@/components/UI/popupConfim/popupConfim'
import { CONFIRMATION_OF_CHANGES, TITLE_DELETE_ITEMS } from '@/constants/delete/deleteItems'
import { FORMAT_MOMENT } from '@/constants/formatDate/formatDate'
import { useSupplierList } from '@/containers/suppliers/supplier/hooks/useSupplierList'
import { useBranchList } from '@/hooks/common/useBranch'
import { useTaxList } from '@/hooks/common/useTaxs'
import { useWarehouseComboboxlocation } from '@/hooks/common/useWarehouses'
import useFeature from '@/hooks/useConfigFeature'
import useSetingServer from '@/hooks/useConfigNumber'
import useStatusExprired from '@/hooks/useStatusExprired'
import useToast from '@/hooks/useToast'
import { useToggle } from '@/hooks/useToggle'
import { routerImport } from '@/routers/buyImportGoods'
import { isAllowedDiscount, isAllowedNumber } from '@/utils/helpers/common'
import { formatMoment } from '@/utils/helpers/formatMoment'
import formatMoneyConfig from '@/utils/helpers/formatMoney'
import formatNumberConfig from '@/utils/helpers/formatnumber'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Add, Minus } from 'iconsax-react'
import { debounce } from 'lodash'
import moment from 'moment/moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { BsCalendarEvent } from 'react-icons/bs'
import { MdClear } from 'react-icons/md'
import { v4 as uuidv4 } from 'uuid'
import { useImportBySupplier } from './hooks/useImportBySupplier'
import { useImportItemByOrder } from './hooks/useImportItemByOrder'

const PurchaseImportForm = (props) => {
  const router = useRouter()

  const id = router.query?.id

  const dataSeting = useSetingServer()

  const dataLang = props?.dataLang

  const isShow = useToast()

  const { isOpen, isKeyState, handleQueryId } = useToggle()

  const statusExprired = useStatusExprired()

  const [onSending, sOnSending] = useState(false)

  const [tax, sTax] = useState()

  const [discount, sDiscount] = useState(0)

  const [code, sCode] = useState('')

  const [searchOrder, sSearchOrder] = useState('')

  const [startDate, sStartDate] = useState(new Date())

  const [effectiveDate, sEffectiveDate] = useState(null)

  const [note, sNote] = useState('')

  const [date, sDate] = useState(moment().format(FORMAT_MOMENT.DATE_TIME_LONG))

  const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature()
  //new
  const [listData, sListData] = useState([])

  const [idSupplier, sIdSupplier] = useState(null)

  const [idSurplusWarehouse, sIdSurplusWarehouse] = useState(null)

  const [idTheOrder, sIdTheOrder] = useState(null)

  const [idBranch, sIdBranch] = useState(null)

  const [errSupplier, sErrSupplier] = useState(false)

  const [errDate, sErrDate] = useState(false)

  const [errDateList, sErrDateList] = useState(false)

  const [errTheOrder, sErrTheOrder] = useState(false)

  const [errBranch, sErrBranch] = useState(false)

  const [errWarehouse, sErrWarehouse] = useState(false)

  const [errLot, sErrLot] = useState(false)

  const [errSerial, sErrSerial] = useState(false)

  const [itemAll, sItemAll] = useState([])

  const [warehouseAll, sWarehouseAll] = useState(null)

  const [total, setTotal] = useState({
    totalMoney: 0,
    totalDiscount: 0,
    toalAffterDiscount: 0,
    totalTax: 0,
    totalAmountMoney: 0,
  })

  const [inputValue, setInputValue] = useState('')

  const { data: dataBranch = [] } = useBranchList()

  const { data: dataTasxes = [] } = useTaxList()

  const { data: dataItems = [] } = useImportItemByOrder(id, idTheOrder, idBranch, idSupplier, inputValue)

  const { data: dataTheOrder = [] } = useImportBySupplier(idSupplier, id, searchOrder)

  const { data: dataWarehouse } = useWarehouseComboboxlocation({
    'filter[branch_id]': idBranch ? idBranch?.value : null,
  })

  const { data: dataSupplierList } = useSupplierList({ 'filter[branch_id]': idBranch != null ? idBranch.value : null })

  const dataSupplier = idBranch ? dataSupplierList?.rResult?.map((e) => ({ label: e?.name, value: e?.id })) : []

  useEffect(() => {
    router.query && sErrDate(false)
    router.query && sErrSupplier(false)
    // router.query && sErrTheOrder(false);
    router.query && sErrBranch(false)
    router.query && sErrSerial(false)
    router.query && sErrLot(false)
    router.query && sErrDateList(false)
    router.query && sStartDate(new Date())
    router.query && sNote('')
  }, [router.query])

  const { isFetching } = useQuery({
    queryKey: ['api_detail_page_import', id],
    queryFn: async () => {
      const rResult = await apiImport.apiDetailPageImport(id)
      sListData(
        rResult?.items.map((e) => ({
          id: e?.item?.id,
          item: {
            e: e?.item,
            label: `${e.item?.name} <span style={{display: none}}>${
              e.item?.code + e.item?.product_variation + e.item?.text_type + e.item?.unit_name
            }</span>`,
            value: e.item?.id,
          },
          child: e?.child.map((ce) => ({
            id: Number(ce?.id),
            id_plan: ce?.id_plan,
            purchase_order_item_id: ce?.purchase_order_item_id,
            reference_no_plan: ce?.reference_no_plan,
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
            serial: ce?.serial == null ? '' : ce?.serial,
            lot: ce?.lot == null ? '' : ce?.lot,
            date: ce?.expiration_date != null ? moment(ce?.expiration_date).toDate() : null,
            unit: e?.item?.unit_name,
            amount: Number(ce?.quantity),
            price: Number(ce?.price),
            discount: Number(ce?.discount_percent),
            tax: {
              tax_rate: ce?.tax_rate,
              value: ce?.tax_id,
              label: ce?.tax_id && !ce?.tax_name ? 'Miễn thuế' : ce?.tax_name,
            },
            note: ce?.note,
          })),
        }))
      )
      sIdSurplusWarehouse(
        rResult?.warehouse_id > 0
          ? {
              label: rResult?.location_name,
              value: rResult?.warehouse_id,
              warehouse_name: rResult?.warehouse_name,
            }
          : null
      )
      sCode(rResult?.code)
      sIdBranch({ label: rResult?.branch_name, value: rResult?.branch_id })
      sIdSupplier({ label: rResult?.supplier_name, value: rResult?.supplier_id })
      sIdTheOrder(
        rResult?.purchase_order_id ? { label: rResult?.purchase_order_code, value: rResult?.purchase_order_id } : null
      )
      sStartDate(moment(rResult?.date).toDate())
      sNote(rResult?.note)
      return rResult
    },
    enabled: !!id,
  })

  const resetValue = () => {
    if (isKeyState?.type === 'supplier') {
      sListData([])
      sIdSupplier(isKeyState?.value)
      sIdTheOrder(null)
    }
    if (isKeyState?.type === 'theorder') {
      sListData([])
      sIdTheOrder(isKeyState?.value)
    }
    if (isKeyState?.type === 'branch') {
      sListData([])
      sIdBranch(isKeyState.value)
    }
    handleQueryId({ status: false })
  }

  useEffect(() => {
    sWarehouseAll(null)
  }, [idBranch])

  const _HandleChangeInput = (type, value) => {
    if (type == 'code') {
      sCode(value.target.value)
    } else if (type === 'date') {
      sDate(formatMoment(value.target.value, FORMAT_MOMENT.DATE_TIME_LONG))
    } else if (type === 'supplier' && idSupplier != value) {
      if (listData?.length > 0) {
        if (type === 'supplier' && idSupplier != value) {
          handleQueryId({ status: true, initialKey: { type, value } })
        }
      } else {
        sIdTheOrder(null)
        sIdSupplier(null)
        sWarehouseAll(null)
      }
      if (listData.length === 0) {
        sIdSupplier(value)
        sItemAll([])
        sIdTheOrder(null)
      }
    } else if (type === 'theorder') {
      if (listData?.length > 0) {
        if (type === 'theorder' && idTheOrder != value) {
          handleQueryId({ status: true, initialKey: { type, value } })
        }
      }
      if (listData.length == 0) {
        sIdTheOrder(value)
      }
    } else if (type === 'note') {
      sNote(value.target.value)
    } else if (type == 'branch' && idBranch != value) {
      if (listData?.length > 0) {
        if (type === 'branch' && idBranch != value) {
          handleQueryId({ status: true, initialKey: { type, value } })
        }
      } else {
        sIdBranch(value)
        sIdTheOrder(null)
        sIdSupplier(null)
        sWarehouseAll(null)
      }
    } else if (type == 'idSurplusWarehouse') {
      sIdSurplusWarehouse(value)
    } else if (type == 'itemAll') {
      sItemAll(value)
      if (value?.length === 0) {
        //new
        sListData([])
      } else if (value?.length > 0) {
        const newData = value?.map((e, index) => ({
          id: uuidv4(),
          time: index,
          item: e,
          child: [
            {
              id_plan: e?.e?.id_plan,
              reference_no_plan: e?.e?.reference_no_plan,
              warehouse: null,
              disabledDate:
                (e?.e?.text_type === 'material' && dataMaterialExpiry?.is_enable === '1' && false) ||
                (e?.e?.text_type === 'material' && dataMaterialExpiry?.is_enable === '0' && true) ||
                (e?.e?.text_type === 'products' && dataProductExpiry?.is_enable === '1' && false) ||
                (e?.e?.text_type === 'products' && dataProductExpiry?.is_enable === '0' && true),
              serial: '',
              lot: '',
              date: null,
              unit: e?.e?.unit_name,
              amount: Number(e?.e?.quantity_left) || 1,
              price: e?.e?.price,
              discount: discount ? discount : e?.e?.discount_percent,
              priceAfter: Number(e?.e?.price_after_discount),
              tax: tax
                ? tax
                : {
                    label: e?.e?.tax_name,
                    value: e?.e?.tax_id,
                    tax_rate: e?.e?.tax_rate,
                  },
              totalMoney: Number(e?.e?.amount),
              note: e?.e?.note,
            },
          ],
        }))
        sListData(newData?.sort((a, b) => b.time - a.time))
      }
    } else if (type === 'warehouseAll') {
      sWarehouseAll(value)
      if (listData?.length > 0) {
        const newData = listData.map((e) => {
          const newChild = e?.child.map((ce) => {
            return { ...ce, warehouse: value }
          })
          return { ...e, child: newChild }
        })
        sListData(newData)
      }
    } else if (type == 'tax') {
      sTax(value)
      if (listData?.length > 0) {
        const newData = listData.map((e) => {
          const newChild = e?.child.map((ce) => {
            return { ...ce, tax: value }
          })
          return { ...e, child: newChild }
        })
        sListData(newData)
      }
    } else if (type == 'discount') {
      sDiscount(value?.value)
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

  const _HandleSubmit = (e) => {
    e.preventDefault()

    const hasNullWarehouse = listData.some((item) =>
      item.child?.some(
        (childItem) =>
          childItem?.id_plan == 0 &&
          (childItem.warehouse === null ||
            (id && (childItem.warehouse?.label === null || childItem.warehouse?.warehouse_name === null)))
      )
    )

    const hasNullSerial = listData.some(
      (item) =>
        item?.item.e?.text_type === 'products' &&
        item.child?.some((childItem) => childItem.serial === '' || childItem.serial == null)
    )

    const hasNullLot = listData.some((item) =>
      item.child?.some((childItem) => !childItem.disabledDate && (childItem.lot === '' || childItem.lot == null))
    )

    const hasNullDate = listData.some((item) =>
      item.child?.some((childItem) => !childItem.disabledDate && childItem.date === null)
    )

    const checkNumber = listData.some((item) =>
      item.child?.some(
        (childItem) => childItem.price == '' || childItem.price == 0 || childItem.amount == '' || childItem.amount == 0
      )
    )
    if (
      idSupplier == null ||
      idBranch == null ||
      // idTheOrder == null ||
      hasNullWarehouse ||
      (dataProductSerial?.is_enable == '1' && hasNullSerial) ||
      // ((dataProductExpiry?.is_enable == "1" || dataMaterialExpiry?.is_enable == "1") && hasNullLot) ||
      // ((dataProductExpiry?.is_enable == "1" || dataMaterialExpiry?.is_enable == "1") && hasNullDate) ||
      checkNumber
    ) {
      idSupplier == null && sErrSupplier(true)
      idBranch == null && sErrBranch(true)
      // idTheOrder == null && sErrTheOrder(true);
      hasNullWarehouse && sErrWarehouse(true)
      // hasNullLot && sErrLot(true);
      hasNullSerial && sErrSerial(true)
      // hasNullDate && sErrDateList(true);
      isShow('error', `${dataLang?.required_field_null}`)
    } else {
      sErrWarehouse(false)
      sErrLot(false)
      sErrSerial(false)
      sErrDateList(false)
      sOnSending(true)
    }
  }
  useEffect(() => {
    sErrDate(false)
  }, [date != null])

  useEffect(() => {
    sErrSupplier(false)
  }, [idSupplier != null])

  useEffect(() => {
    sErrBranch(false)
  }, [idBranch != null])

  // useEffect(() => {
  //     sErrTheOrder(false);
  // }, [idTheOrder != null]);

  const options = dataItems?.map((e) => ({
    label: `${e.name} <span style={{display: none}}>${e.code}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
    value: e.id,
    e,
  }))

  useEffect(() => {
    idBranch == null && sIdTheOrder(null)
  }, [idBranch])

  const taxOptions = [{ label: 'Miễn thuế', value: '0', tax_rate: '0' }, ...dataTasxes]

  const _HandleSelectAll = () => {
    const newData = [...options]?.map((e) => ({
      id: uuidv4(),
      item: e,
      child: [
        {
          id_plan: e?.e?.id_plan,
          reference_no_plan: e?.e?.reference_no_plan,
          purchase_order_item_id: e?.e?.purchase_order_item_id,
          id: uuidv4(),
          disabledDate:
            (e?.e?.text_type === 'material' && dataMaterialExpiry?.is_enable === '1' && false) ||
            (e?.e?.text_type === 'material' && dataMaterialExpiry?.is_enable === '0' && true) ||
            (e?.e?.text_type === 'products' && dataProductExpiry?.is_enable === '1' && false) ||
            (e?.e?.text_type === 'products' && dataProductExpiry?.is_enable === '0' && true),
          warehouse: warehouseAll ? warehouseAll : null,
          serial: '',
          lot: '',
          date: null,
          unit: e?.e?.unit_name,
          amount: Number(e?.e?.quantity_left) || 1,
          price: e?.e?.price,
          discount: discount ? discount : e?.e?.discount_percent,
          priceAfter: Number(e?.e?.price_after_discount),
          tax: tax
            ? tax
            : {
                label: e?.e?.tax_name,
                value: e?.e?.tax_id,
                tax_rate: e?.e?.tax_rate,
              },
          totalMoney: Number(e?.e?.amount),
          note: e?.e?.note,
        },
      ],
    }))
    sItemAll(newData)
    sListData(newData)
  }

  const formatNumber = (number) => {
    return formatNumberConfig(+number, dataSeting)
  }

  const formatMoney = (number) => {
    return formatMoneyConfig(+number, dataSeting)
  }

  const caculateAmount = (option) => {
    const totalPrice = option?.reduce((accumulator, item) => {
      const childTotal = item.child?.reduce((childAccumulator, childItem) => {
        const product = Number(childItem?.price) * Number(childItem?.amount)
        return childAccumulator + product
      }, 0)
      return accumulator + childTotal
    }, 0)

    const totalDiscountPrice = option?.reduce((accumulator, item) => {
      const childTotal = item.child?.reduce((childAccumulator, childItem) => {
        const product = Number(childItem?.price) * (Number(childItem?.discount) / 100) * Number(childItem?.amount)
        return childAccumulator + product
      }, 0)
      return accumulator + childTotal
    }, 0)

    const totalDiscountAfterPrice = option?.reduce((accumulator, item) => {
      const childTotal = item.child?.reduce((childAccumulator, childItem) => {
        const product = Number(childItem?.price * (1 - childItem?.discount / 100)) * Number(childItem?.amount)
        return childAccumulator + product
      }, 0)
      return accumulator + childTotal
    }, 0)

    const totalTax = option?.reduce((accumulator, item) => {
      const childTotal = item.child?.reduce((childAccumulator, childItem) => {
        const product =
          Number(childItem?.price * (1 - childItem?.discount / 100)) *
          (isNaN(childItem?.tax?.tax_rate) ? 0 : Number(childItem?.tax?.tax_rate) / 100) *
          Number(childItem?.amount)
        return childAccumulator + product
      }, 0)
      return accumulator + childTotal
    }, 0)

    const totalAmount = option?.reduce((accumulator, item) => {
      const childTotal = item.child?.reduce((childAccumulator, childItem) => {
        const product =
          Number(childItem?.price * (1 - childItem?.discount / 100)) *
          (1 + Number(childItem?.tax?.tax_rate) / 100) *
          Number(childItem?.amount)
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
    const totalMoney = caculateAmount(listData)
    setTotal(totalMoney)
  }, [listData])

  const handleClearDate = (type) => {
    if (type === 'effectiveDate') {
      sEffectiveDate(null)
    }
    if (type === 'startDate') {
      sStartDate(new Date())
    }
  }
  const handleTimeChange = (date) => {
    sStartDate(date)
  }

  const handingImport = useMutation({
    mutationFn: (data) => {
      return apiImport.apiHandingImport(id, data)
    },
  })

  const _ServerSending = () => {
    let formData = new FormData()
    formData.append('code', code)
    formData.append('date', formatMoment(startDate, FORMAT_MOMENT.DATE_TIME_LONG))
    formData.append('branch_id', idBranch.value)
    formData.append('suppliers_id', idSupplier.value)
    formData.append('id_order', idTheOrder?.value ? idTheOrder?.value : 0)
    formData.append('warehouse_id', idSurplusWarehouse?.value ?? 0)
    formData.append('note', note)
    listData.forEach((item, index) => {
      console.log('item', item)

      formData.append(`items[${index}][id]`, item?.id)
      formData.append(`items[${index}][item]`, item?.item?.value)
      formData.append(`items[${index}][purchase_order_item_id]`, item?.item?.e?.purchase_order_item_id ?? 0)
      item?.child?.forEach((childItem, childIndex) => {
        // formData.append(`items[${index}][child][${childIndex}][purchase_order_item_id]`, childItem?.purchase_order_item_id ?? 0);
        formData.append(`items[${index}][child][${childIndex}][id]`, childItem?.id)
        formData.append(`items[${index}][child][${childIndex}][id_plan]`, childItem?.id_plan ?? 0)
        {
          id &&
            formData.append(
              `items[${index}][child][${childIndex}][row_id]`,
              typeof childItem?.id == 'number' ? childItem?.id : 0
            )
        }
        formData.append(`items[${index}][child][${childIndex}][quantity]`, childItem?.amount)
        formData.append(
          `items[${index}][child][${childIndex}][serial]`,
          childItem?.serial === null ? '' : childItem?.serial
        )
        formData.append(`items[${index}][child][${childIndex}][lot]`, childItem?.lot === null ? '' : childItem?.lot)
        formData.append(
          `items[${index}][child][${childIndex}][expiration_date]`,
          childItem?.date === null ? '' : formatMoment(childItem?.date, FORMAT_MOMENT.DATE_TIME_LONG)
        )
        formData.append(`items[${index}][child][${childIndex}][unit_name]`, childItem?.unit)
        formData.append(`items[${index}][child][${childIndex}][note]`, childItem?.note ? childItem?.note : '')
        formData.append(`items[${index}][child][${childIndex}][tax_id]`, childItem?.tax?.value ?? 0)
        formData.append(`items[${index}][child][${childIndex}][price]`, childItem?.price)
        if (childItem?.id_plan) {
          formData.append(
            `items[${index}][child][${childIndex}][location_warehouses_id]`,
            childItem?.id_plan == 0 ? childItem?.warehouse?.value : ''
          )
        } else {
          formData.append(
            `items[${index}][child][${childIndex}][location_warehouses_id]`,
            childItem?.warehouse?.value ? childItem?.warehouse?.value : 0
          )
        }
        formData.append(
          `items[${index}][child][${childIndex}][discount_percent]`,
          childItem?.discount ? childItem?.discount : ''
        )
      })
    })
    handingImport.mutate(formData, {
      onSuccess: ({ isSuccess, message }) => {
        if (isSuccess) {
          isShow('success', dataLang[message] || message)
          sCode('')
          sStartDate(new Date())
          sIdSupplier(null)
          sIdBranch(null)
          sIdTheOrder(null)
          sNote('')
          sErrBranch(false)
          sErrDate(false)
          // sErrTheOrder(false);
          sErrSupplier(false)
          sListData([])
          router.push(routerImport.home)
        } else {
          if (total.totalPrice == 0) {
            isShow('error', `Chưa nhập thông tin mặt hàng`)
          } else {
            isShow('error', dataLang[message] || message)
          }
        }
      },
    })
    sOnSending(false)
  }

  useEffect(() => {
    onSending && _ServerSending()
  }, [onSending])

  //new
  const _HandleAddChild = (parentId, value) => {
    const newData = listData?.map((e) => {
      if (e?.id === parentId) {
        const newChild = {
          id: uuidv4(),
          id_plan: value?.e?.id_plan,
          reference_no_plan: value?.e?.reference_no_plan,
          disabledDate:
            (value?.e?.text_type === 'material' && dataMaterialExpiry?.is_enable === '1' && false) ||
            (value?.e?.text_type === 'material' && dataMaterialExpiry?.is_enable === '0' && true) ||
            (value?.e?.text_type === 'products' && dataProductExpiry?.is_enable === '1' && false) ||
            (value?.e?.text_type === 'products' && dataProductExpiry?.is_enable === '0' && true),
          warehouse: warehouseAll ? warehouseAll : null,
          serial: '',
          lot: '',
          date: null,
          unit: value?.e?.unit_name,
          price: value?.e?.price,
          amount: 1,
          discount: discount ? discount : Number(value?.e?.discount_percent),
          priceAfter: Number(value?.e?.price_after_discount),
          tax: tax
            ? tax
            : {
                label: value?.e?.tax_name,
                // label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name,
                value: value?.e?.tax_id,
                tax_rate: value?.e?.tax_rate,
              },
          totalMoney: Number(value?.e?.amount),
          note: value?.e?.note,
        }
        return { ...e, child: [...e.child, newChild] }
      } else {
        return e
      }
    })
    sListData(newData)
  }
  const _HandleAddParent = (value) => {
    const checkData = listData?.some((e) => e?.item?.value === value?.value)
    if (!checkData) {
      const newData = {
        id: Date.now(),
        item: value,
        child: [
          {
            id_plan: value?.e?.id_plan,
            reference_no_plan: value?.e?.reference_no_plan,
            id: uuidv4(),
            disabledDate:
              (value?.e?.text_type === 'material' && dataMaterialExpiry?.is_enable === '1' && false) ||
              (value?.e?.text_type === 'material' && dataMaterialExpiry?.is_enable === '0' && true) ||
              (value?.e?.text_type === 'products' && dataProductExpiry?.is_enable === '1' && false) ||
              (value?.e?.text_type === 'products' && dataProductExpiry?.is_enable === '0' && true),
            warehouse: warehouseAll ? warehouseAll : null,
            serial: '',
            lot: '',
            date: null,
            unit: value?.e?.unit_name,
            price: value?.e?.price,
            amount: Number(value?.e?.quantity_left) || 1,
            discount: discount ? discount : Number(value?.e?.discount_percent),
            priceAfter: Number(value?.e?.price_after_discount),
            tax: tax
              ? tax
              : {
                  label: value?.e?.tax_name == null ? 'Miễn thuế' : value?.e?.tax_name,
                  value: value?.e?.tax_id,
                  tax_rate: value?.e?.tax_rate,
                },
            totalMoney: Number(value?.e?.amount),
            note: value?.e?.note,
          },
        ],
      }
      sListData([newData, ...listData])
    } else {
      isShow('error', 'Mặt hàng đã được chọn')
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
    sListData([...newData])
  }

  const _HandleChangeChild = (parentId, childId, type, value) => {
    const newData = listData.map((e) => {
      if (e?.id === parentId) {
        const newChild = e?.child?.map((ce) => {
          if (ce?.id === childId) {
            if (type === 'amount') {
              return { ...ce, amount: Number(value?.value) }
            } else if (type === 'increase') {
              return {
                ...ce,
                amount: Number(Number(ce?.amount) + 1),
              }
            } else if (type === 'decrease') {
              if (Number(ce?.amount) <= 1) {
                handleQuantityError('Số lượng tối thiểu là 1')
                return ce
              }
              return {
                ...ce,
                amount: Number(Number(ce?.amount) - 1),
              }
            } else if (type === 'price') {
              return { ...ce, price: Number(value?.value) }
            } else if (type === 'discount') {
              return { ...ce, discount: Number(value?.value) }
            } else if (type === 'note') {
              return { ...ce, note: value?.target.value }
            } else if (type === 'warehouse') {
              return { ...ce, warehouse: value }
            } else if (type === 'tax') {
              return { ...ce, tax: value }
            }
            //  else if (type === "serial") {
            //     return { ...ce, serial: value?.target.value };
            else if (type === 'lot') {
              return { ...ce, lot: value?.target.value }
            } else if (type === 'serial') {
              const isValueExists = e.child.some(
                (otherCe) => otherCe[type] === value?.target.value && otherCe.id !== childId
              )

              if (isValueExists) {
                handleQuantityError(`Giá trị ${type} đã tồn tại`)
                return ce // Trả về giá trị ban đầu nếu đã tồn tại
              } else {
                const otherElements = listData.filter(
                  (otherE) =>
                    otherE.id !== parentId && otherE.child.some((otherCe) => otherCe[type] === value?.target.value)
                )

                if (otherElements.length > 0) {
                  handleQuantityError(`Giá trị ${type} đã tồn tại ở các phần tử khác`)
                  return ce // Trả về giá trị ban đầu nếu đã tồn tại ở phần tử khác
                } else {
                  return {
                    ...ce,
                    [type]: value?.target.value,
                  }
                }
              }
            } else if (type === 'date') {
              return { ...ce, date: value }
            }
          } else {
            return ce
          }
        })
        return { ...e, child: newChild }
      } else {
        return e
      }
    })
    sListData([...newData])
  }

  const handleQuantityError = (e) => isShow('error', e)

  const _HandleChangeValue = (parentId, value) => {
    const checkData = listData?.some((e) => e?.item?.value === value?.value)

    if (!checkData) {
      // const newData = { id: Date.now(), item: value, child: [{id: uuidv4(), warehouse: warehouseAll ? warehouseAll : null, unit: value?.e?.unit_name, price: value?.e?.price, amount: Number(value?.e?.quantity_left) || 1, discount: discount ? discount : Number(value?.e?.discount_percent), priceAfter: Number(value?.e?.price_after_discount), tax: tax ? tax : {label: value?.e?.tax_name == null ? "Miễn thuế" : value?.e?.tax_name, value: value?.e?.tax_id, tax_rate: value?.e?.tax_rate}, totalMoney: Number(value?.e?.amount), note: value?.e?.note}] }
      const newData = listData?.map((e) => {
        if (e?.id === parentId) {
          return {
            ...e,
            item: value,
            child: [
              {
                id: uuidv4(),
                warehouse: warehouseAll ? warehouseAll : null,
                disabledDate:
                  (value?.e?.text_type === 'material' && dataMaterialExpiry?.is_enable === '1' && false) ||
                  (value?.e?.text_type === 'material' && dataMaterialExpiry?.is_enable === '0' && true) ||
                  (value?.e?.text_type === 'products' && dataProductExpiry?.is_enable === '1' && false) ||
                  (value?.e?.text_type === 'products' && dataProductExpiry?.is_enable === '0' && true),
                serial: '',
                lot: '',
                date: null,
                unit: value?.e?.unit_name,
                price: value?.e?.price,
                amount: Number(value?.e?.quantity_left) || 1,
                discount: discount ? discount : Number(value?.e?.discount_percent),
                priceAfter: Number(value?.e?.price_after_discount),
                tax: tax
                  ? tax
                  : {
                      label: value?.e?.tax_name == null ? 'Miễn thuế' : value?.e?.tax_name,
                      value: value?.e?.tax_id,
                      tax_rate: value?.e?.tax_rate,
                    },
                totalMoney: Number(value?.e?.amount),
                note: value?.e?.note,
              },
            ],
          }
        } else {
          return e
        }
      })
      sListData([...newData])
    } else {
      isShow('error', `${'Mặt hàng đã được chọn'}`)
    }
  }

  const _HandleSeachApi = debounce(async (inputValue) => {
    sSearchOrder(inputValue)
  }, 500)

  const _HandleSeachApiProductItems = debounce(async (e) => {
    setInputValue(e)
  }, 500)

  const breadcrumbItems = [
    {
      label: `${dataLang?.import_title || 'import_title'}`,
    },
    {
      label: `${dataLang?.import_list || 'import_list'}`,
      href: routerImport.home,
    },
    {
      label: `${id ? dataLang?.import_from_title_edit : dataLang?.import_from_title_add}`,
    },
  ]

  const selectItemsLabel = (option, isOnTable = false) => (
    <div className="flex items-start p-2 cursor-pointer font-deca">
      <div className="flex items-center gap-3">
        <img
          src={option.e?.images ?? '/icon/noimagelogo.png'}
          alt={option?.e.name}
          className="size-16 object-cover rounded-md"
        />
        <div className="flex flex-col gap-1 3xl:text-[10px] text-[9px] font-normal overflow-hidden w-full">
          <h3 className={`font-semibold responsive-text-sm truncate ${isOnTable ? 'text-brand-color' : 'text-black'}`}>
            {option.e?.name}
          </h3>

          <h5 className={`${isOnTable ? 'text-neutral-03' : 'text-blue-color'} truncate`}>
            {option.e?.code}: {option?.e?.product_variation}
          </h5>

          <div className="flex flex-wrap items-center gap-2 text-neutral-03">
            {isOnTable && `ĐVT: ${option.e?.unit_name}`} - {dataLang[option.e?.text_type]} -{' '}
            {dataLang?.purchase_survive || 'purchase_survive'}:{' '}
            {option.e?.qty_warehouse ? formatNumber(option.e?.qty_warehouse) : '0'}
          </div>
          {!isOnTable && option?.e?.id_plan > 0 && (
            <TagColorProduct lang={false} dataKey={1} name={option?.e?.reference_no_plan} />
          )}
        </div>
      </div>
    </div>
  )

  return (
    <LayoutOrderManagement
      dataLang={dataLang}
      titleHead={id ? dataLang?.import_from_title_edit : dataLang?.import_from_title_add}
      breadcrumbItems={breadcrumbItems}
      titleLayout={dataLang?.import_title || 'import_title'}
      searchBar={
        <SelectSearchBar
          options={[...options]}
          onChange={_HandleChangeInput.bind(this, 'itemAll')}
          value={itemAll?.value ? itemAll?.value : listData?.map((e) => e?.item)}
          MenuList={(props) => (
            <MenuList
              dataItems={itemAll}
              handleSelectAll={_HandleSelectAll.bind(this)}
              handleDeleteAll={() => sListData([])}
              {...props}
            />
          )}
          formatOptionLabel={(option) => selectItemsLabel(option)}
          placeholder={dataLang?.import_click_items || 'import_click_items'}
        />
      }
      tableLeft={
        <>
          <div className="grid grid-cols-15 items-center sticky top-0 z-10 py-2 mb-2 border-b border-gray-100">
            <TableHeader className="col-span-2 text-left">
              {dataLang?.import_from_items || 'import_from_items'}
            </TableHeader>

            <div className="col-span-13">
              <div
                className={`${
                  dataProductSerial?.is_enable == '1'
                    ? dataMaterialExpiry?.is_enable != dataProductExpiry?.is_enable
                      ? 'grid-cols-11'
                      : dataMaterialExpiry?.is_enable == '1'
                      ? 'grid-cols-[repeat(11_minmax(0_1fr))]'
                      : 'grid-cols-9'
                    : dataMaterialExpiry?.is_enable != dataProductExpiry?.is_enable
                    ? 'grid-cols-10'
                    : dataMaterialExpiry?.is_enable == '1'
                    ? 'grid-cols-10'
                    : 'grid-cols-8'
                } grid items-center `}
              >
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  text-[#667085] px-px   col-span-2   text-center  truncate font-[400]">
                  {dataLang?.import_from_ware_loca || 'import_from_ware_loca'}
                  <SelectItemComponent
                    onChange={_HandleChangeInput.bind(this, 'warehouseAll')}
                    value={warehouseAll}
                    formatOptionLabel={(option) => (
                      <div className="z-20">
                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] z-[999]">
                          {dataLang?.import_Warehouse || 'import_Warehouse'} : {option?.warehouse_name}
                        </h2>
                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] z-[999]">
                          {dataLang?.import_Warehouse_location || 'import_Warehouse_ocation'}: {option?.label}
                        </h2>
                      </div>
                    )}
                    options={dataWarehouse}
                    isClearable
                    placeholder={'Chọn nhanh kho - Vị trí'}
                    // placeholder={dataLang?.import_from_ware_loca || "import_from_ware_loca"}
                    styles={{
                      menu: {
                        width: '100%',
                      },
                    }}
                    hideSelectedOptions={false}
                    className={` border-transparent placeholder:text-slate-300 2xl:!text-[10px] xl:!text-[10px] !text-[10px]  z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                  />
                </h4>
                {dataProductSerial?.is_enable === '1' && (
                  <TableHeader className="col-span-1 text-center">{'Serial'}</TableHeader>
                )}
                {dataMaterialExpiry?.is_enable === '1' || dataProductExpiry?.is_enable === '1' ? (
                  <>
                    <TableHeader className="col-span-1 text-center">{'Lot'}</TableHeader>
                    <TableHeader className="col-span-1 text-center">
                      {props.dataLang?.warehouses_detail_date || 'Date'}
                    </TableHeader>
                  </>
                ) : (
                  ''
                )}
                <TableHeader className="col-span-1 text-center">
                  {dataLang?.import_from_quantity || 'import_from_quantity'}
                </TableHeader>
                <TableHeader className="col-span-1 text-center">
                  {dataLang?.import_from_unit_price || 'import_from_unit_price'}
                </TableHeader>

                <div className="flex flex-col items-center col-span-1 gap-2">
                  <h2>{dataLang?.purchase_order_detail_discount || 'purchase_order_detail_discount'}</h2>
                  <div className="flex items-center justify-center col-span-1 text-center">
                    <InPutNumericFormat
                      value={discount}
                      isAllowed={isAllowedDiscount}
                      onValueChange={_HandleChangeInput.bind(this, 'discount')}
                      className="w-20 px-2 py-1 font-medium text-center bg-transparent border-b-2 border-gray-300 focus:outline-none"
                    />
                  </div>
                </div>
                <TableHeader className="col-span-1 text-center">
                  {dataLang?.sales_product_after_discount || 'sales_product_after_discount'}
                </TableHeader>

                <div className="flex flex-col items-center col-span-1 gap-2">
                  <h2>{dataLang?.purchase_order_detail_tax || 'purchase_order_detail_tax'}</h2>
                  <SelectItemComponent
                    options={taxOptions}
                    onChange={_HandleChangeInput.bind(this, 'tax')}
                    value={tax}
                    formatOptionLabel={(option) => (
                      <div className="flex items-center justify-start gap-1 ">
                        <h2>{option?.label}</h2>
                        <h2>{`(${option?.tax_rate})`}</h2>
                      </div>
                    )}
                    placeholder={dataLang?.purchase_order_detail_tax || 'purchase_order_detail_tax'}
                    className={` "border-transparent placeholder:text-slate-300 w-[70%] bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                    isSearchable={true}
                    noOptionsMessage={() => 'Không có dữ liệu'}
                  />
                </div>
                <TableHeader className="col-span-1 text-center">
                  {dataLang?.import_into_money || 'import_into_money'}
                </TableHeader>
              </div>
            </div>
          </div>

          <Customscrollbar className="max-h-[780px] overflow-auto pb-2">
            <div className="h-full">
              {isFetching ? (
                <Loading className="h-60" color="#0f4f9e" />
              ) : (
                <>
                  {listData?.map((e) => {
                    const firstChild = e?.child?.[0]
                    return (
                      <div key={e?.id?.toString()} className="grid items-start gap-1 my-1 grid-cols-15">
                        {/* Mặt hàng */}
                        <div className="col-span-2 p-2 h-full">
                          {selectItemsLabel(e?.item, true)}
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
                              value={firstChild?.note}
                              // onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'note')}
                              placeholder={dataLang?.delivery_receipt_note || 'delivery_receipt_note'}
                              name="optionEmail"
                              type="text"
                              className="focus:border-[#92BFF7] placeholder:responsive-text-xs 2xl:h-7 xl:h-5 py-0 px-1 responsive-text-xs placeholder-slate-300 w-full bg-white rounded-[5.5px] text-[#1C252E] font-normal outline-none placeholder:text-typo-gray-4"
                            />
                          </div>
                        </div>
                        <div className="items-center col-span-13">
                          <div
                            className={`${
                              dataProductSerial?.is_enable == '1'
                                ? dataMaterialExpiry?.is_enable != dataProductExpiry?.is_enable
                                  ? 'grid-cols-11'
                                  : dataMaterialExpiry?.is_enable == '1'
                                  ? 'grid-cols-[repeat(11_minmax(0_1fr))]'
                                  : 'grid-cols-9'
                                : dataMaterialExpiry?.is_enable != dataProductExpiry?.is_enable
                                ? 'grid-cols-10'
                                : dataMaterialExpiry?.is_enable == '1'
                                ? 'grid-cols-10'
                                : 'grid-cols-8'
                            } grid  3xl:text-[12px] 2xl:text-[11px] xl:text-[10px] text-[9px]`}
                          >
                            {e?.child?.map((ce) => (
                              <React.Fragment key={ce?.id?.toString()}>
                                <div className={`flex flex-col items-center justify-center h-full col-span-2 p-1`}>
                                  {ce?.id_plan > 0 && ce?.reference_no_plan ? (
                                    <TagColorProduct
                                      lang={false}
                                      dataKey={6}
                                      name={`Vị trí theo ${ce?.reference_no_plan}`}
                                      className="3xl:!text-[13px] 2xl:!text-[9px] xl:!text-[8px] !text-[8px]"
                                    />
                                  ) : (
                                    <SelectItemComponent
                                      options={dataWarehouse}
                                      value={ce?.warehouse}
                                      onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'warehouse')}
                                      className={`${
                                        (errWarehouse && ce?.warehouse == null) ||
                                        (errWarehouse &&
                                          (ce?.warehouse?.label == null || ce?.warehouse?.warehouse_name == null))
                                          ? 'border-red-500 border'
                                          : ''
                                      }  3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal `}
                                      placeholder={'Kho - vị trí'}
                                      formatOptionLabel={(option) => {
                                        return (
                                          (option?.warehouse_name || option?.label) && (
                                            <div className="z-[999]">
                                              <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] z-[999]">
                                                {dataLang?.import_Warehouse || 'import_Warehouse'} :{' '}
                                                {option?.warehouse_name}
                                              </h2>
                                              <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] z-[999]">
                                                {option?.label}
                                              </h2>
                                            </div>
                                          )
                                        )
                                      }}
                                      styles={{
                                        menu: {
                                          width: '100%',
                                        },
                                      }}
                                    />
                                  )}
                                </div>
                                {dataProductSerial.is_enable === '1' ? (
                                  <div className="col-span-1 ">
                                    <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                      <input
                                        value={ce?.serial}
                                        disabled={e?.item?.e?.text_type != 'products'}
                                        className={`border ${
                                          e?.item?.e?.text_type != 'products'
                                            ? 'bg-gray-50'
                                            : errSerial && (ce?.serial == '' || ce?.serial == null)
                                            ? 'border-red-500'
                                            : 'focus:border-[#92BFF7] border-[#d0d5dd]'
                                        } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer`}
                                        onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'serial')}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  ''
                                )}
                                {dataMaterialExpiry.is_enable === '1' || dataProductExpiry.is_enable === '1' ? (
                                  <>
                                    <div className="col-span-1 ">
                                      <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                        <input
                                          value={ce?.lot}
                                          disabled={ce?.disabledDate}
                                          className={`border ${
                                            ce?.disabledDate
                                              ? 'bg-gray-50'
                                              : errLot && (ce?.lot == '' || ce?.lot == null)
                                              ? 'border-red-500'
                                              : 'focus:border-[#92BFF7] border-[#d0d5dd]'
                                          } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer`}
                                          onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'lot')}
                                          placeholder={
                                            dataLang?.purchase_order_system_default || 'purchase_order_system_default'
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-span-1 ">
                                      <div className="custom-date-picker flex justify-center h-full p-0.5 flex-col items-center w-full">
                                        <div className="relative col-span-4">
                                          <div className="flex flex-row custom-date-picker">
                                            <DatePicker
                                              selected={ce?.date}
                                              blur
                                              disabled={ce?.disabledDate}
                                              placeholderText="DD/MM/YYYY"
                                              dateFormat="dd/MM/yyyy"
                                              onSelect={(date) => _HandleChangeChild(e?.id, ce?.id, 'date', date)}
                                              placeholder={
                                                dataLang?.purchase_order_system_default ||
                                                'purchase_order_system_default'
                                              }
                                              className={`border ${
                                                ce?.disabledDate
                                                  ? 'bg-gray-50'
                                                  : errDateList && ce?.date == null
                                                  ? 'border-red-500'
                                                  : 'focus:border-[#92BFF7] border-[#d0d5dd]'
                                              } placeholder:text-slate-300 placeholder:text-[9px] text-[10px] w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer`}
                                            />
                                            {effectiveDate && (
                                              <>
                                                <MdClear
                                                  className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                  onClick={() => handleClearDate('effectiveDate')}
                                                />
                                              </>
                                            )}
                                            <BsCalendarEvent className="absolute right-0 -translate-x-[55%] top-[50%] -translate-y-[50%] text-[#CCCCCC] scale-110 cursor-pointer" />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  ''
                                )}
                                <div className="flex items-center justify-center  h-full p-0.5">
                                  <button
                                    className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                    onClick={_HandleChangeChild.bind(this, e?.id, ce?.id, 'decrease')}
                                  >
                                    <Minus className="scale-50 2xl:scale-100 xl:scale-100" size="16" />
                                  </button>
                                  <InPutNumericFormat
                                    onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'amount')}
                                    value={ce?.amount}
                                    isAllowed={isAllowedNumber}
                                    className={`${
                                      (ce?.amount == 0 && 'border-red-500') || (ce?.amount == '' && 'border-red-500')
                                    } appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal w-full focus:outline-none border-b border-gray-200`}
                                  />
                                  <button
                                    className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center 3xl:p-0 2xl:p-0 xl:p-0 p-0 bg-slate-200 rounded-full"
                                    onClick={_HandleChangeChild.bind(this, e?.id, ce?.id, 'increase')}
                                  >
                                    <Add className="scale-50 2xl:scale-100 xl:scale-100" size="16" />
                                  </button>
                                </div>
                                <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                  <InPutMoneyFormat
                                    className={`${
                                      (ce?.price == 0 && 'border-red-500') || (ce?.price == '' && 'border-red-500')
                                    } 
                                                                    appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px] focus:outline-none border-b border-gray-200 h-fit`}
                                    onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'price')}
                                    value={ce?.price}
                                  />
                                </div>
                                <div className="flex justify-center  h-full p-0.5 flex-col items-center">
                                  <InPutNumericFormat
                                    className="appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-2 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px]  focus:outline-none border-b border-gray-200"
                                    onValueChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'discount')}
                                    value={ce?.discount}
                                    isAllowed={isAllowedDiscount}
                                  />
                                </div>
                                <div className="col-span-1  text-right flex items-center justify-end  h-full p-0.5">
                                  <h3 className="px-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                    {formatMoney(Number(ce?.price) * (1 - Number(ce?.discount) / 100))}
                                  </h3>
                                </div>
                                <div className=" flex flex-col items-center p-0.5 h-full justify-center">
                                  <SelectItemComponent
                                    options={taxOptions}
                                    value={ce?.tax}
                                    onChange={_HandleChangeChild.bind(this, e?.id, ce?.id, 'tax')}
                                    placeholder={dataLang?.import_from_tax || 'import_from_tax'}
                                    className={`  3xl:text-[12px] 2xl:text-[10px] p-1 xl:text-[9.5px] text-[9px] border-transparent placeholder:text-slate-300 w-full z-19 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none `}
                                    formatOptionLabel={(option) => (
                                      <div className="flex items-center justify-start gap-1 flex-nowrap">
                                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] whitespace-nowrap">
                                          {option?.label}
                                        </h2>
                                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">{`(${option?.tax_rate})`}</h2>
                                      </div>
                                    )}
                                  />
                                </div>
                                <ItemTotalAndDelete
                                  total={formatMoney(
                                    ce?.price *
                                      (1 - Number(ce?.discount || 0) / 100) *
                                      (1 + Number(ce?.tax?.tax_rate ? ce?.tax?.tax_rate : 0) / 100) *
                                      Number(ce?.amount)
                                  )}
                                  onDelete={_HandleDeleteChild.bind(this, e?.id, ce?.id)}
                                />
                              </React.Fragment>
                            ))}
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
        <div className="flex flex-col gap-4">
          {/* Mã chứng từ */}
          <DocumentNumber dataLang={dataLang} value={code} onChange={_HandleChangeInput.bind(this, 'code')} />
          {/* Ngày chứng từ */}
          <DocumentDate
            dataLang={dataLang}
            value={startDate}
            onChange={(date) => {
              sStartDate(date)
              handleTimeChange(date)
            }}
          />
          <div className="col-span-2">
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.import_branch || 'import_branch'} <span className="text-red-500">*</span>
            </label>
            <SelectComponent
              options={dataBranch}
              onChange={_HandleChangeInput.bind(this, 'branch')}
              value={idBranch}
              isClearable={true}
              closeMenuOnSelect={true}
              hideSelectedOptions={false}
              type="form"
              placeholder={dataLang?.import_branch || 'import_branch'}
              className={`${
                errBranch ? 'border-red-500' : 'border-transparent'
              } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
              isSearchable={true}
            />
            {errBranch && (
              <label className="text-sm text-red-500">
                {dataLang?.purchase_order_errBranch || 'purchase_order_errBranch'}
              </label>
            )}
          </div>
          <div className="col-span-2">
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.import_supplier || 'import_supplier'} <span className="text-red-500">*</span>
            </label>
            <SelectComponent
              options={dataSupplier}
              onChange={_HandleChangeInput.bind(this, 'supplier')}
              value={idSupplier}
              placeholder={dataLang?.import_supplier || 'import_supplier'}
              hideSelectedOptions={false}
              isClearable={true}
              className={`${
                errSupplier ? 'border-red-500' : 'border-transparent'
              } placeholder:text-slate-300 w-full  bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
              isSearchable={true}
              noOptionsMessage={() => 'Không có dữ liệu'}
              type="form"
            />
            {errSupplier && (
              <label className="text-sm text-red-500">
                {dataLang?.purchase_order_errSupplier || 'purchase_order_errSupplier'}
              </label>
            )}
          </div>
          <div className="col-span-2 ">
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.import_the_orders || 'import_the_orders'}{' '}
            </label>
            <SelectComponent
              onInputChange={(event) => {
                _HandleSeachApi(event)
              }}
              options={dataTheOrder}
              onChange={_HandleChangeInput.bind(this, 'theorder')}
              value={idTheOrder}
              isClearable={true}
              noOptionsMessage={() => 'Không có dữ liệu'}
              closeMenuOnSelect={true}
              hideSelectedOptions={false}
              placeholder={dataLang?.import_the_orders || 'import_the_orders'}
              className={`border-transparent placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
              isSearchable={true}
              type="form"
            />
          </div>

          <AnimatePresence mode="wait">
            {idTheOrder && (
              <motion.div
                key="select-animate"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="col-span-2 origin-left"
              >
                <div className="w-full">
                  <label className="text-[#344054] font-normal text-sm mb-1">{'Chọn kho nhập dư (nếu có)'}</label>

                  <SelectComponent
                    onChange={_HandleChangeInput.bind(this, 'idSurplusWarehouse')}
                    value={idSurplusWarehouse}
                    formatOptionLabel={(option) => (
                      <div className="z-20">
                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                          {dataLang?.import_Warehouse || 'import_Warehouse'}: {option?.warehouse_name}
                        </h2>
                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                          {dataLang?.import_Warehouse_location || 'import_Warehouse_location'}: {option?.label}
                        </h2>
                      </div>
                    )}
                    options={dataWarehouse}
                    hideSelectedOptions={false}
                    isClearable
                    placeholder={'Chọn kho nhập dư'}
                    classNamePrefix="surplusWarehouse"
                    className={`border-transparent placeholder:text-slate-300 textt-[8px] w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border`}
                    isSearchable={true}
                    noOptionsMessage={() => 'Không có dữ liệu'}
                    type="form"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
      note={
        <TextareaNote
          label={dataLang?.purchase_order_note || 'purchase_order_note'}
          value={note}
          onChange={_HandleChangeInput.bind(this, 'note')}
        />
      }
      isTotalMoney={total}
      routerBack={routerImport.home}
      onSave={_HandleSubmit.bind(this)}
      onSending={onSending}
      popupConfim={
        <PopupConfim
          dataLang={dataLang}
          type="warning"
          title={TITLE_DELETE_ITEMS}
          subtitle={CONFIRMATION_OF_CHANGES}
          isOpen={isOpen}
          save={resetValue}
          nameModel={'change_item'}
          cancel={() => handleQueryId({ status: false })}
        />
      }
    />
  )
}

export default PurchaseImportForm
