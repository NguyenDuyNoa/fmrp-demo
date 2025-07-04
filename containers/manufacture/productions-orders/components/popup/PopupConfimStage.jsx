import InputCustom from '@/components/common/input/InputCustom'
import CalendarBlankIcon from '@/components/icons/common/CalendarBlankIcon'
import KanbanIcon from '@/components/icons/common/KanbanIcon'
import SaveIcon from '@/components/icons/common/SaveIcon'
import ButtonSubmit from '@/components/UI/button/buttonSubmit'
import { Customscrollbar } from '@/components/UI/common/Customscrollbar'
import SelectComponent from '@/components/UI/filterComponents/selectComponent'
import Loading from '@/components/UI/loading/loading'
import NoData from '@/components/UI/noData/nodata'
import PopupCustom from '@/components/UI/popup'
import useFeature from '@/hooks/useConfigFeature'
import useSetingServer from '@/hooks/useConfigNumber'
import useToast from '@/hooks/useToast'
import formatNumberConfig from '@/utils/helpers/formatnumber'
import { Trash } from 'iconsax-react'
import { debounce } from 'lodash'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { FaCheckCircle } from 'react-icons/fa'
import { PiWarehouseLight } from 'react-icons/pi'
import { useActiveStages } from '../../hooks/useActiveStages'
import { useHandingFinishedStages } from '../../hooks/useHandingFinishedStages'
import { useListFinishedStages } from '../../hooks/useListFinishedStages'
import { useLoadOutOfStock } from '../../hooks/useLoadOutOfStock'
import { PopupOrderCompleted } from './PopupCompleteCommand'
import TrashIcon from '@/components/icons/common/TrashIcon'

const initialState = {
  open: false,
  objectWareHouse: null,
  dataTableProducts: null,
  dataTableBom: null,
  arrayMoveBom: [],
}

const PopupConfimStage = ({ dataLang, dataRight, refetch: refetchMainTable, typePageMoblie }) => {
  const tableRef = useRef(null)

  const isToast = useToast()

  const tableRefTotal = useRef(null)

  const dataSeting = useSetingServer()

  const formatNumber = (number) => {
    return formatNumberConfig(+number, dataSeting)
  }

  const stateRef = useRef(initialState)

  const [isState, setState] = useState(initialState)

  const [isOrderCompleted, setIsOrderCompleted] = useState(false)

  const queryState = (data) => setState((prev) => ({ ...prev, ...data }))

  const [activeStep, setActiveStep] = useState({ type: null, item: null })

  const { onGetData, isLoading: isLoadingActiveStages } = useActiveStages()

  const { isLoading: isLoadingSubmit, onSubmit } = useHandingFinishedStages()

  const { dataProductExpiry, dataMaterialExpiry, dataProductSerial } = useFeature()

  const { data, isLoading, refetch } = useListFinishedStages({
    id: dataRight?.idDetailProductionOrder,
    open: isState.open,
  })

  const {
    data: dataLoadOutOfStock,
    isLoading: isLoadingLoadOutOfStock,
    onGetData: onGetDataLoadOutOfStock,
  } = useLoadOutOfStock()

  const handleSelectStep = async (type, e, action) => {
    if (action == 'click' && e?.stage_id == activeStep?.item?.stage_id && type == activeStep?.type) return

    setActiveStep({ type, item: e })

    const payload = {
      id: dataRight?.idDetailProductionOrder,
      is_product: type == 'TP' ? 1 : 0,
      stage_id: e?.stage_id,
    }

    const r = await onGetData(payload)

    queryState({ dataTableProducts: r, arrayMoveBom: [] })

    onGetBom(
      {
        isProduct: type === 'TP' ? 1 : 0,
        activeStep: {
          type,
          item: e,
        },
        poId: dataRight?.idDetailProductionOrder,
        arrayMoveBom: [],
      },
      r?.data?.items
    )
  }

  const handleSubmit = async () => {
    if (!isState.objectWareHouse) {
      isToast('error', 'Vui lòng kiểm tra dữ liệu')
      return
    }

    const r = await onSubmit({
      poId: dataRight?.idDetailProductionOrder,
      objectData: isState,
    })

    if (r?.isSuccess == 1) {
      refetch()
      refetchMainTable()

      // Kiểm tra xem lệnh sản xuất đã hoàn thành chưa
      if (r?.data?.status_manufacture == '2') {
        setIsOrderCompleted(true)
      } else {
        queryState({
          open: true,
          dataTableProducts: null,
          dataTableBom: null,
          arrayMoveBom: [],
        })
        handleSelectStep(activeStep?.type, activeStep?.item, 'auto')
      }
    }
  }

  useEffect(() => {
    if (!tableRef?.current || !tableRefTotal?.current) return
    const handleScroll = () => {
      if (tableRef.current && tableRefTotal.current) {
        tableRefTotal.current.scrollLeft = tableRef.current.scrollLeft
      }
    }

    const table = tableRef.current

    table.addEventListener('scroll', handleScroll)

    return () => {
      table.removeEventListener('scroll', handleScroll)
    }
  }, [tableRef.current, tableRefTotal.current])

  const { totalQuantity, totalQuantityError, totalQuantityEntered, totalQuantityEnter } = useMemo(() => {
    const result = isState.dataTableProducts?.data?.items?.reduce(
      (totals, item) => {
        totals.totalQuantity += +item?.quantityEnterClient || 0
        totals.totalQuantityError += item?.quantityError || 0
        totals.totalQuantityEnter += +item?.quantity_enter || 0
        totals.totalQuantityEntered += +item?.quantity_entered || 0
        return totals
      },
      { totalQuantity: 0, totalQuantityError: 0, totalQuantityEntered: 0, totalQuantityEnter: 0 }
    )

    return result || { totalQuantity: 0, totalQuantityError: 0, totalQuantityEntered: 0, totalQuantityEnter: 0 }
  }, [isState.dataTableProducts])

  const updateQuantityAndSerial = (item, type, value, serialType) => {
    const newQuantity = value?.floatValue || 0
    const currentSerials = Array.isArray(item[serialType]) ? [...item[serialType]] : []

    // Điều chỉnh số lượng serial theo `newQuantity` và reset `isDuplicate`
    const updatedSerials =
      currentSerials.length < newQuantity
        ? [
            ...currentSerials.map((s) => ({ ...s, isDuplicate: false })), // Reset isDuplicate
            ...Array(newQuantity - currentSerials.length).fill({ value: '', isDuplicate: false }),
          ]
        : currentSerials.slice(0, newQuantity).map((s) => ({ ...s, isDuplicate: false })) // Reset isDuplicate

    return { ...item, [type]: newQuantity, [serialType]: updatedSerials }
  }

  const updateSerialsGeneric = (item, value, type) => {
    let existingSerials = [...(item[type] || [])] // Giữ serial cũ
    const quantity = value?.floatValue ? value?.floatValue : value?.value

    // Lấy số lớn nhất từ cả hai danh sách serial và serialError
    const getMaxSerial = (list) =>
      list.length > 0
        ? Math.max(...list.map((s) => parseInt(s.value.split('-').pop(), 10)).filter((n) => !isNaN(n)))
        : 0

    const maxSerialFromSerial = getMaxSerial(item.serial || [])
    const maxSerialFromError = getMaxSerial(item.serialError || [])
    const globalMaxSerial = Math.max(maxSerialFromSerial, maxSerialFromError, item?.max_serial_number ?? 0)

    if (quantity > existingSerials.length) {
      const startSerial = globalMaxSerial + 1 // Bắt đầu từ số lớn nhất tìm được

      const additionalSerials = [...Array(quantity - existingSerials.length)].map((_, i) => ({
        value: `${item?.ref}-${(startSerial + i).toString().padStart(2, '0')}`,
        isDuplicate: false,
      }))

      existingSerials = [...existingSerials, ...additionalSerials] // Giữ nguyên serial cũ + thêm mới
    }
    // Nếu số lượng giảm, chỉ cắt bớt serial mới, giữ nguyên serial cũ
    else if (quantity < existingSerials.length) {
      existingSerials = existingSerials.slice(0, quantity).map((s) => ({ ...s, isDuplicate: false }))
    }

    // Kiểm tra và cập nhật trạng thái trùng lặp
    const valuesList = existingSerials.map((s) => s?.value).filter(Boolean)
    existingSerials = existingSerials.map((s) => ({
      ...s,
      isDuplicate: valuesList.indexOf(s?.value) !== valuesList.lastIndexOf(s?.value),
    }))

    return {
      ...item,
      [type === 'serialError' ? 'quantityError' : 'quantityEnterClient']: quantity,
      [type]: existingSerials,
    }
  }

  const handleChange = ({ table, type, value, row, index }) => {
    if (table == 'product') {
      const quantityEnterClient = 'quantityEnterClient'
      const quantityError = 'quantityError'
      const checkType = [quantityEnterClient, quantityError].includes(type)

      const newData = isState.dataTableProducts?.data?.items?.map((item) => {
        if (item?.poi_id === row?.poi_id) {
          if (checkType) {
            return updateSerialsGeneric(item, value, type == quantityEnterClient ? 'serial' : 'serialError')
          }

          if (type === 'serial' || type === 'serialError') {
            let updatedArray = Array.isArray(item[type]) ? [...item[type]] : []

            updatedArray[index] = { value, isDuplicate: false }

            // Kiểm tra trùng lặp trong cùng một hàng
            const valuesList = updatedArray.map((s) => s?.value).filter(Boolean)
            updatedArray = updatedArray.map((s, i) => ({
              ...s,
              isDuplicate: valuesList.indexOf(s?.value) !== valuesList.lastIndexOf(s?.value),
            }))

            // Hiển thị cảnh báo nếu trùng
            if (updatedArray[index].isDuplicate) {
              isToast('error', `${type === 'serial' ? 'Serial' : 'Serial lỗi'} đã tồn tại!`)
            }

            return { ...item, [type]: updatedArray }
          }

          return { ...item, [type]: checkType ? value?.floatValue : value }
        }
        return item
      })

      queryState({
        dataTableProducts: {
          ...isState.dataTableProducts,
          data: {
            ...isState.dataTableProducts?.data,
            items: newData,
          },
        },
      })

      if (checkType)
        onGetBom(
          {
            isProduct: type === 'TP' ? 1 : 0,
            activeStep: {
              type,
              item: activeStep.item,
            },
            poId: dataRight?.idDetailProductionOrder,
            arrayMoveBom: isState.arrayMoveBom,
          },
          newData
        )
    }

    if (table == 'bom') {
      const newData = isState.dataTableBom.data?.boms?.map((item) => {
        if (item?._id === row?._id) {
          return { ...item, [type]: value }
        }
        return item
      })

      queryState({
        dataTableBom: {
          ...isState.dataTableBom,
          data: {
            ...isState.dataTableBom?.data,
            boms: newData,
            bomsClientHistory: newData,
          },
        },
      })
    }
  }

  const handleRemove = (type, row) => {
    if (type == 'bom' && row?.type_bom == 'product_before') {
      isToast('error', 'Đây là thành phẩm công đoạn bước trước, không thể xóa')
      return
    }

    const stateKey = type === 'product' ? 'dataTableProducts' : 'dataTableBom'

    const stateData = type === 'product' ? 'items' : 'boms'

    const newData = isState[stateKey]?.data[stateData]?.filter(
      (item) => (item?.poi_id || item?._id) !== (row?.poi_id || row?._id)
    )

    queryState({
      [stateKey]: {
        ...isState[stateKey],
        data: {
          ...isState[stateKey]?.data,
          [stateData]: newData,
        },
      },
    })

    queryState({ arrayMoveBom: [...isState.arrayMoveBom, row] })

    onGetBom(
      {
        isProduct: type === 'product' ? 1 : 0,
        activeStep: {
          type,
          item: activeStep.item,
        },
        arrayMoveBom: [...isState.arrayMoveBom, row],
        poId: dataRight?.idDetailProductionOrder,
      },
      type === 'product' ? newData : isState.dataTableProducts?.data?.items
    )
  }

  const onGetBom = useCallback(
    debounce(async (object, items) => {
      try {
        const r = await onGetDataLoadOutOfStock({ object, items })

        const check = r?.data?.boms?.map((e, index) => {
          const object = isState.dataTableBom?.data?.bomsClientHistory?.find((item) => item?.item_id == e?.item_id)

          if (e?.item_id == object?.item_id) {
            return {
              ...e,
              warehouseId: object?.warehouseId,
            }
          }

          return {
            ...e,
            warehouseId: e?.list_warehouse_bom,
          }
        })

        queryState({
          dataTableBom: {
            ...r,
            data: {
              ...r?.data,
              boms: check,
              bomsClientHistory: check,
            },
          },
        })
      } catch (error) {
        console.error('Error in onGetBom:', error)
      }
    }, 500),
    [isState.dataTableProducts, isState.dataTableBom]
  )

  const getPriorityItem = (semi, products) => {
    const semiItem = semi.find((item) => item.active == '0')
    if (semiItem) return { object: semiItem, type: 'BTP' }

    const productItem = products.find((item) => item.active == '0')
    if (productItem) return { object: productItem, type: 'TP' }

    return null
  }

  useEffect(() => {
    if (isState.open) {
      // Kiểm tra xem lệnh SX đã hoàn thành chưa
      if (data?.po?.status_manufacture === '2') {
        setIsOrderCompleted(true)
      } else {
        setIsOrderCompleted(false)
        const s = getPriorityItem(data?.stage_semi_products || [], data?.stage_products || [])
        if (s) {
          handleSelectStep(s?.type, s?.object, 'auto')
        }
      }
    }
  }, [isState.open, data])

  useEffect(() => {
    if (isState.open) {
      queryState({ ...initialState, open: true })
      return
    }
    queryState({ ...initialState })
    setIsOrderCompleted(false)
  }, [isState.open])

  const checkItemFinalStage = isState.dataTableProducts?.data?.items?.some((e) => e?.final_stage == 1)

  // Thêm các biến kiểm tra điều kiện hiển thị
  const showSerialColumns = checkItemFinalStage && dataProductSerial.is_enable === '1'
  const showExpiryColumns =
    checkItemFinalStage && (dataMaterialExpiry.is_enable === '1' || dataProductExpiry.is_enable === '1')

  // Tính toán col-span dựa trên điều kiện hiển thị
  const getColSpan = (baseSpan) => {
    let finalSpan = baseSpan
    if (showSerialColumns) finalSpan += 2
    if (showExpiryColumns) finalSpan += 2
    return finalSpan
  }

  return (
    <>
      {isOrderCompleted ? (
        <PopupCustom
          onClickOpen={() => {
            if (dataRight?.listDataRight?.statusManufacture == '2') {
              isToast('error', 'Lệnh SX đã được hoàn thành')
              return
            }
            queryState({ open: true })
          }}
          lockScroll={true}
          open={isState.open}
        >
          <PopupOrderCompleted
            className={'!p-6'}
            onClose={() => {
              setIsOrderCompleted(false)
              queryState({ open: false })
            }}
          />
        </PopupCustom>
      ) : (
        <PopupCustom
          title={
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-1">
                <h2 className="responsive-text-2xl font-bold text-neutral-07">Hoàn thành chi tiết công đoạn</h2>
                <span className="text-typo-blue-4 responsive-text-base">
                  (Số lệnh sản xuất: {data?.po?.reference_no})
                </span>
              </div>
              <ButtonSubmit
                loading={isLoadingSubmit}
                dataLang={dataLang}
                onClick={handleSubmit.bind(this)}
                icon={<SaveIcon className="size-4" />}
                className="mr-8 py-2 2xl:py-3 px-3 2xl:px-4 bg-typo-blue-4 text-white rounded-lg !responsive-text-base flex items-center gap-2"
              />
            </div>
          }
          classNameModeltime="px-6 2xl:px-10 3xl:px-12 py-4 2xl:py-5 3xl:py-6 flex flex-col gap-6"
          button={
            <div className="flex items-center gap-2 w-full">
              <span className="3xl:size-5 size-4 text-[#0375F3] shrink-0">
                <KanbanIcon className="size-full" />
              </span>
              <span className="3xl:text-base text-sm font-normal text-[#101828]">Hoàn thành chi tiết CĐ</span>
            </div>
          }
          classNameBtn={'!w-full'}
          onClickOpen={() => {
            if (dataRight?.listDataRight?.statusManufacture == '2') {
              isToast('error', 'Lệnh SX đã được hoàn thành')
              return
            }
            queryState({ open: true })
          }}
          lockScroll={true}
          open={isState.open}
          classNameIconClose="size-8 bg-white hover:bg-slate-200 text-[#9295A4] hover:text-slate-800"
          onClose={() => {
            queryState({ open: false })
          }}
        >
          {/* <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]" /> */}
          <div className="w-[85vw] xl:h-[80vh] h-[575px] overflow-">
            <div className="grid grid-cols-16 h-full gap-4">
              {/* Left Panels */}
              <div className="flex col-span-3 max-h-full min-h-0 overflow-auto">
                <div className="flex flex-col h-full max-h-full border border-primary-05 rounded-lg flex-1">
                  {/* Công đoạn BTP */}
                  {data?.stage_semi_products?.length > 0 && (
                    <div className="flex-1 border-b border-primary-05">
                      <div className="p-3 font-medium responsive-text-base border-b border-primary-05">
                        Công đoạn BTP
                      </div>
                      <Customscrollbar className="hover:overflow-y-auto overflow-y-hidden">
                        {data?.stage_semi_products?.length > 0 ? (
                          data?.stage_semi_products?.map((e) => (
                            <li
                              key={e?.stage_id}
                              onClick={() => handleSelectStep('BTP', e, 'click')}
                              className={`p-3 cursor-pointer ${
                                activeStep.type == 'BTP' && activeStep?.item?.stage_id == e?.stage_id
                                  ? 'bg-gradient-to-r from-[#0375F336] to-[#C4C4C400] border-l-4 border-[#0375F3]'
                                  : 'hover:bg-gray-100'
                              } ${
                                e?.active == '1' ? 'text-typo-blue-4' : 'text-gray-500'
                              } responsive-text-base list-none flex items-center gap-2 transition-all duration-200 ease-linear select-none`}
                            >
                              <div className="min-w-[16px] flex items-center justify-center">
                                {e?.active == '1' ? (
                                  <FaCheckCircle size="16" className="text-typo-blue-4" />
                                ) : (
                                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                )}
                              </div>
                              <p>{e?.name_stage}</p>
                            </li>
                          ))
                        ) : (
                          <NoData classNameTitle="!text-[13px]" />
                        )}
                      </Customscrollbar>
                    </div>
                  )}

                  {/* Công đoạn TP */}
                  {data?.stage_products?.length > 0 && (
                    <div className="flex-1">
                      <div className="p-3 font-medium responsive-text-base border-b border-primary-05">
                        Công đoạn TP
                      </div>
                      <Customscrollbar className="hover:overflow-y-auto overflow-y-hidden">
                        {data?.stage_products?.length > 0 ? (
                          data?.stage_products?.map((e) => (
                            <li
                              key={e?.stage_id}
                              onClick={() => handleSelectStep('TP', e, 'click')}
                              className={`p-3 cursor-pointer ${
                                activeStep.type == 'TP' && activeStep?.item?.stage_id == e?.stage_id
                                  ? 'bg-gradient-to-r from-[#0375F336] to-[#C4C4C400] border-l-4 border-[#0375F3]'
                                  : 'hover:bg-gray-100 '
                              } ${
                                e?.active == '1' ? 'text-typo-blue-4' : 'text-gray-500'
                              } responsive-text-base list-none flex items-center gap-2 transition-all duration-150 ease-linear select-none`}
                            >
                              <div className="min-w-[16px] flex items-center justify-center">
                                {e?.active == '1' ? (
                                  <FaCheckCircle size="16" className="text-typo-blue-4" />
                                ) : (
                                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                )}
                              </div>
                              <p>{e?.name_stage}</p>
                            </li>
                          ))
                        ) : (
                          <NoData classNameTitle="!text-[13px]" />
                        )}
                      </Customscrollbar>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel */}
              <div className="flex col-span-13 h-full w-full max-h-full overflow-auto">
                <div className="flex flex-col gap-6 max-h-full w-full">
                  {/* Nhập thành phẩm */}
                  <div className="flex items-center justify-between">
                    <div className="responsive-text-xl font-normal">Nhập thành phẩm</div>
                    <div className="w-1/3 m-0.5">
                      <SelectComponent
                        options={data?.warehouses || []}
                        onChange={(e) => queryState({ objectWareHouse: e })}
                        value={isState.objectWareHouse}
                        isClearable={true}
                        icon={<PiWarehouseLight color="#9295A4" className="size-4" />}
                        closeMenuOnSelect={true}
                        hideSelectedOptions={false}
                        placeholder={'Kho thành phẩm'}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderColor: state.isFocused
                              ? '#0F4F9E'
                              : isState.objectWareHouse == null
                              ? '#ef4444'
                              : base.borderColor,
                            borderRadius: '8px',
                            '&:hover': {
                              borderColor: state.isFocused
                                ? '#0F4F9E'
                                : isState.objectWareHouse == null
                                ? '#ef4444'
                                : base.borderColor,
                            },
                          }),
                        }}
                        isSearchable={true}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col overflow-hidden flex-1">
                    <div className="grid grid-cols-25 items-center border-b border-[#F3F3F4]">
                      <h3 className="col-span-1 responsive-text-sm text-neutral-02 py-2 px-1 font-semibold text-center">
                        STT
                      </h3>
                      <h3
                        className={`responsive-text-sm text-neutral-02 p-2 font-semibold ${
                          showExpiryColumns ? 'col-span-4' : 'col-span-6'
                        }`}
                      >
                        Mặt hàng
                      </h3>
                      <h3 className="col-span-2 responsive-text-sm text-neutral-02 font-semibold ">Đơn vị tính</h3>
                      <h3
                        className={`responsive-text-sm text-neutral-02 p-2 font-semibold text-center
                            ${showExpiryColumns ? 'col-span-3' : 'col-span-4'}
                            `}
                      >
                        SL hoàn thành
                      </h3>
                      {showSerialColumns && (
                        <div className="col-span-2 responsive-text-sm text-neutral-02 p-2 font-semibold">
                          Serial hoàn thành
                        </div>
                      )}
                      <div
                        className={`responsive-text-sm text-neutral-02 p-2 font-semibold text-center
                            ${showExpiryColumns ? 'col-span-3' : 'col-span-4'}
                            `}
                      >
                        SL lỗi
                      </div>
                      {showSerialColumns && (
                        <div className="col-span-2 responsive-text-sm text-neutral-02 p-2 font-semibold">
                          Serial lỗi
                        </div>
                      )}
                      {showExpiryColumns && (
                        <>
                          <div className="col-span-3 responsive-text-sm text-neutral-02 p-2 font-semibold">Lot</div>
                          <div className="col-span-3 responsive-text-sm text-neutral-02 p-2 font-semibold">
                            {dataLang?.warehouses_detail_date ?? 'warehouses_detail_date'}
                          </div>
                        </>
                      )}
                      <div
                        className={`whitespace-nowrap text-center responsive-text-sm text-neutral-02 font-semibold
                            ${showExpiryColumns ? 'col-span-2' : 'col-span-3 p-2'}
                            `}
                      >
                        SL cần nhập
                      </div>
                      <div
                        className={`whitespace-nowrap text-center responsive-text-sm text-neutral-02 p-1 font-semibold
                            ${showExpiryColumns ? 'col-span-2' : 'col-span-3'}
                            `}
                      >
                        SL đã nhập
                      </div>
                      <div className="col-span-2 responsive-text-sm text-neutral-02 text-center font-semibold ">
                        Thao tác
                      </div>
                    </div>
                    <Customscrollbar className="flex-1 max-h-full">
                      {isLoadingActiveStages && activeStep.type == 'TP' ? (
                        <div className="flex justify-center items-center h-40">
                          <Loading className="!h-[100px] w-full mx-auto" />
                        </div>
                      ) : isState.dataTableProducts?.data?.items?.length > 0 ? (
                        isState.dataTableProducts?.data?.items?.map((row, index) => (
                          <div className="grid grid-cols-25 items-center" key={index}>
                            <div className="col-span-1 py-2 px-1 flex justify-center items-center">
                              <p className="responsive-text-sm text-neutral-07 font-semibold">{index + 1}</p>
                            </div>
                            <div
                              className={`flex gap-2 p-2
                                    ${showExpiryColumns ? 'col-span-4' : 'col-span-6'}
                                `}
                            >
                              <Image
                                src={row?.images ? row?.images : '/icon/noimagelogo.png'}
                                width={100}
                                height={100}
                                alt={row?.images ? row?.images : '/icon/noimagelogo.png'}
                                className="object-cover rounded-md min-w-10 min-h-10 w-10 h-10 max-w-10 max-h-10"
                              />
                              <div className="flex flex-col gap-1">
                                <p className="responsive-text-sm text-neutral-07 font-semibold">{row?.item_name}</p>
                                <p className="responsive-text-xs text-neutral-03 font-normal">
                                  {row?.product_variation}
                                </p>
                                <p className="responsive-text-xs text-typo-blue-2 font-normal">
                                  {row?.reference_no_detail}
                                </p>
                              </div>
                            </div>

                            <h3 className="col-span-2 p-2 responsive-text-sm text-neutral-07 font-semibold">
                              {row?.unit_name}
                            </h3>
                            <div className={`p-2 ${showExpiryColumns ? 'col-span-3' : 'col-span-4'}`}>
                              <InputCustom
                                state={row?.quantityEnterClient || 0}
                                setState={(value) =>
                                  handleChange({
                                    table: 'product',
                                    type: 'quantityEnterClient',
                                    row,
                                    value: { floatValue: value },
                                  })
                                }
                                className={`${
                                  !row?.quantityEnterClient && !row?.quantityError
                                    ? '!border-red-500'
                                    : '!border-gray-200'
                                } !w-full p-1`}
                                classNameInput="w-full !responsive-text-sm"
                                classNameButton="size-6 2xl:size-8"
                                min={0}
                                max={Infinity}
                                disabled={false}
                                isError={false}
                                step={1}
                              />
                            </div>
                            {showSerialColumns && (
                              <div className="col-span-3 p-2 text-sm">
                                <div className="flex flex-col gap-1">
                                  {[...Array(row?.quantityEnterClient || 0)].map((_, sIndex) => {
                                    return (
                                      <input
                                        key={sIndex}
                                        value={row.serial?.[sIndex]?.value || ''}
                                        onChange={(e) => {
                                          handleChange({
                                            table: 'product',
                                            type: 'serial',
                                            value: e.target.value.trim(),
                                            row,
                                            index: sIndex,
                                          })
                                        }}
                                        className={`
                                                    border text-center py-1 px-1 font-medium w-full focus:outline-none  text-xs
                                                    ${
                                                      row.serial?.[sIndex]?.isDuplicate
                                                        ? 'border-red-500'
                                                        : 'border-gray-200 border-b-2'
                                                    }
                                                `}
                                      />
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            <div className={`p-2 ${showExpiryColumns ? 'col-span-3' : 'col-span-4'}`}>
                              <InputCustom
                                state={row?.quantityError || 0}
                                setState={(value) =>
                                  handleChange({
                                    table: 'product',
                                    type: 'quantityError',
                                    row,
                                    value: { floatValue: value },
                                  })
                                }
                                className={`${
                                  !row?.quantityEnterClient && !row?.quantityError
                                    ? '!border-red-500'
                                    : '!border-gray-200'
                                } !w-full p-1`}
                                classNameInput="w-full !responsive-text-sm"
                                classNameButton="size-6 2xl:size-8"
                                min={0}
                                max={Infinity}
                                disabled={false}
                                isError={false}
                                step={1}
                              />
                            </div>
                            {showSerialColumns && (
                              <td className="col-span-3 p-2 text-sm">
                                <div className="flex flex-col gap-1">
                                  {[...Array(row?.quantityError || 0)].map((_, sIndex) => {
                                    return (
                                      <input
                                        key={sIndex}
                                        value={row.serialError?.[sIndex]?.value || ''}
                                        onChange={(e) => {
                                          handleChange({
                                            table: 'product',
                                            type: 'serialError',
                                            value: e.target.value.trim(),
                                            row,
                                            index: sIndex,
                                          })
                                        }}
                                        className={`
                                                    border text-center py-1 px-1 font-medium w-full focus:outline-none  text-xs
                                                    ${
                                                      row.serialError?.[sIndex]?.isDuplicate
                                                        ? 'border-red-500'
                                                        : 'border-gray-200 border-b-2'
                                                    }
                                                `}
                                      />
                                    )
                                  })}
                                </div>
                              </td>
                            )}
                            {showExpiryColumns && (
                              <>
                                <div className="col-span-3">
                                  <input
                                    value={row?.lot || ''}
                                    disabled={
                                      (dataProductExpiry?.is_enable == '1' && false) ||
                                      (dataProductExpiry?.is_enable == '0' && true)
                                    }
                                    onChange={(e) => {
                                      handleChange({
                                        table: 'product',
                                        type: 'lot',
                                        value: e.target.value,
                                        row,
                                      })
                                    }}
                                    className="border text-center rounded-lg responsive-text-sm text-neutral-07 font-semibold py-2 px-1 w-full focus:outline-none border-gray-200"
                                  />
                                </div>
                                <div className="col-span-3 p-2 text-sm">
                                  <div className="relative">
                                    <DatePicker
                                      dateFormat="dd/MM/yyyy"
                                      placeholderText={dataLang?.warehouses_detail_date ?? 'warehouses_detail_date'}
                                      selected={row?.date}
                                      disabled={
                                        (dataProductExpiry?.is_enable == '1' && false) ||
                                        (dataProductExpiry?.is_enable == '0' && true)
                                      }
                                      portalId="menu-time"
                                      onChange={(e) => {
                                        handleChange({
                                          table: 'product',
                                          type: 'date',
                                          value: e,
                                          row,
                                        })
                                      }}
                                      className="border-gray-200 bg-transparent disabled:bg-gray-100 relative z-1 placeholder:text-slate-300 w-full rounded-lg text-[#52575E] p-2 pl-6 border outline-none responsive-text-sm"
                                    />
                                    <CalendarBlankIcon className="size-4 absolute left-1.5 -translate-y-1/2 top-1/2 opacity-60" />
                                  </div>
                                </div>
                              </>
                            )}
                            <h3
                              className={`p-2 responsive-text-sm text-neutral-07 font-semibold text-center
                                ${showExpiryColumns ? 'col-span-2' : 'col-span-3'}
                                `}
                            >
                              {formatNumber(row?.quantity_enter)}
                            </h3>
                            <h3
                              className={`p-2 responsive-text-sm text-neutral-07 font-semibold text-center
                                ${showExpiryColumns ? 'col-span-2' : 'col-span-3'}
                                `}
                            >
                              {formatNumber(row?.quantity_entered)}
                            </h3>
                            <div className="col-span-2 p-2 flex justify-center items-center">
                              <button
                                onClick={() => handleRemove('product', row)}
                                className="group hover:border-red-01 hover:bg-red-02 rounded-lg w-fit p-1 border border-transparent transition-all ease-in-out flex items-center gap-2 responsive-text-sm text-left cursor-pointer"
                              >
                                <TrashIcon className="size-5 2xl:size-6 text-[#EE1E1E]" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          colSpan="25"
                          className="p-2 text-center text-red-500 h-40 my-auto flex justify-center items-center"
                        >
                          Không có mặt hàng để hoàn thành
                        </div>
                      )}
                    </Customscrollbar>
                    <div className="grid grid-cols-25 items-center bg-[#CCCCCC40] rounded">
                      <h3
                        className={`p-2 text-center text-neutral-07 responsive-text-base font-medium
                        ${showExpiryColumns ? 'col-span-7' : 'col-span-9'}
                        `}
                      >
                        TỔNG CỘNG
                      </h3>
                      <h3
                        className={`p-2 text-center text-neutral-07 responsive-text-base font-medium
                        ${showExpiryColumns ? 'col-span-3' : 'col-span-4'}
                        `}
                      >
                        {formatNumber(totalQuantity)}
                      </h3>
                      {checkItemFinalStage && dataProductSerial.is_enable === '1' && (
                        <h3 className="col-span-3 p-2 text-neutral-07 responsive-text-base font-medium"></h3>
                      )}
                      <h3
                        className={`p-2 text-center text-neutral-07 responsive-text-base font-medium
                        ${showExpiryColumns ? 'col-span-3' : 'col-span-4'}
                        `}
                      >
                        {formatNumber(totalQuantityError)}
                      </h3>
                      {showExpiryColumns && (
                        <>
                          <h3 className="col-span-3 p-2 font-normal"></h3>
                          <h3 className="col-span-3 p-2 font-normal"></h3>
                        </>
                      )}
                      <h3
                        className={`p-2 text-center text-neutral-07 responsive-text-base font-medium
                        ${showExpiryColumns ? 'col-span-2' : 'col-span-3'}
                        `}
                      >
                        {formatNumber(totalQuantityEnter)}
                      </h3>
                      <h3
                        className={`p-2 text-center text-neutral-07 responsive-text-base font-medium
                        ${showExpiryColumns ? 'col-span-2' : 'col-span-3'}
                        `}
                      >
                        {formatNumber(totalQuantityEntered)}
                      </h3>
                    </div>
                  </div>

                  {/* Xuất kho sản xuất */}
                  {/* <div>
                            <div className="mb-4 text-lg font-normal">Xuất kho sản xuất</div>
                            <Customscrollbar className="h-[calc(80vh_/_2_-_115px)] overflow-auto bg-white ">
                                <table className="w-full text-sm [&>thead>tr>th]:font-normal border border-separate border-spacing-0 border-gray-200 table-auto">
                                    <thead className="sticky top-0 z-10 bg-gray-100">
                                        <tr>
                                            <th className="border p-2 font-normal min-w-[100px]">Hình ảnh</th>
                                            <th className="border p-2 font-normal min-w-[250px]">Mặt hàng</th>
                                            <th className="border p-2 font-normal min-w-[120px]">SL sản xuất</th>
                                            <th className="border p-2 font-normal min-w-[120px]">SL xuất kho</th>
                                            <th className="border p-2 font-normal min-w-[120px]">Tồn kho</th>
                                            <th className="border p-2 font-normal min-w-[290px]">Kho hàng</th>
                                            <th className="border p-2 font-normal min-w-[100px]">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="h-[calc(80vh_/_2_-_155px)]">
                                        {
                                            (isLoadingLoadOutOfStock)
                                                ?
                                                <tr>
                                                    <td colSpan="7" >
                                                        <Loading className='!h-[100px] w-full mx-auto' />
                                                    </td>
                                                </tr>
                                                :
                                                isState.dataTableBom?.data?.boms?.length > 0 ? (
                                                    isState.dataTableBom?.data?.boms?.map((row, index) => (
                                                        <tr key={index}>
                                                            <td className="p-2 border">
                                                                <div className="flex items-center justify-center ">
                                                                    <Image
                                                                        src={row?.images ? row?.images : "/icon/noimagelogo.png"}
                                                                        width={36}
                                                                        height={36}
                                                                        alt={row?.images ? row?.images : "/icon/noimagelogo.png"}
                                                                        className="object-cover rounded-md min-w-[48px] min-h-[48px] w-[48px] h-[48px] max-w-[48px] max-h-[48px]"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="p-2 text-sm border">
                                                                <div className="flex flex-col gap-0.5 h-full">
                                                                    <p>
                                                                        {row?.item_name}
                                                                    </p>
                                                                    <p className="text-xs italic">
                                                                        {row?.product_variation}
                                                                    </p>
                                                                    {
                                                                        row?.reference_no_detail && (
                                                                            <p className="text-xs text-blue-500">{row?.reference_no_detail}</p>
                                                                        )
                                                                    }
                                                                    <div className="flex items-center gap-1">
                                                                        <TagColorProduct
                                                                            dataKey={
                                                                                row?.type_products === "products" ? 0 :
                                                                                    row?.type_products === "semi_products" ? 1 :
                                                                                        row?.type_products === "out_side" ? 2 :
                                                                                            row?.type_products === "materials" || row?.type_products === "material" ? 3 :
                                                                                                row?.type_products === "semi_products_outside" ? 4 :
                                                                                                    null
                                                                            }
                                                                            dataLang={dataLang}
                                                                            name={row?.type_products}
                                                                        />

                                                                        {
                                                                            row?.stage_name && (
                                                                                <TagColorProduct name={row?.stage_name} lang={false} dataKey={5} />
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-2 text-sm text-center border">
                                                                {formatNumber(row?.quantity_total_quota)}/ <span className="relative text-xs top-1">{row?.unit_name}</span>
                                                            </td>
                                                            <td className="p-2 text-sm text-center border">
                                                                {formatNumber(row?.quantity_quota_primary)}/ <span className="relative text-xs top-1">{row?.unit_name_primary}</span>
                                                            </td>
                                                            <td className="p-2 text-sm text-center border">
                                                                {formatNumber(row?.quantity_warehouse)}
                                                            </td>
                                                            <td className="p-2 text-sm border w-[290px]">
                                                                <SelectComponent
                                                                    options={row?.list_warehouse_bom || []}
                                                                    value={row?.warehouseId}
                                                                    maxShowMuti={1}
                                                                    isClearable={false}
                                                                    isMulti={true}
                                                                    components={{ MultiValue }}
                                                                    onChange={(e) =>
                                                                        handleChange({
                                                                            table: "bom",
                                                                            type: 'warehouseId',
                                                                            row,
                                                                            value: e
                                                                        })}
                                                                    className={`${row?.warehouseId?.length == 0 ? "border-red-500 border" : ""}  my-1  text-xs placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal`}
                                                                    noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                                                    menuPortalTarget={document.body}
                                                                    placeholder={"Kho xuất - Vị trí xuất"}
                                                                    formatOptionLabel={(option) => {
                                                                        return (
                                                                            <>
                                                                                <h2 className="text-xs">
                                                                                    {dataLang?.import_Warehouse || "import_Warehouse"}  : {option?.label}
                                                                                </h2>
                                                                                <h2 className="text-xs">
                                                                                    {option?.name_location}
                                                                                </h2>

                                                                                <div className="">
                                                                                    <div className="flex items-center">
                                                                                        <h4 className="text-[10px]">
                                                                                            {dataLang?.returns_survive}:
                                                                                        </h4>
                                                                                        <h4 className="pl-1 text-[10px]">
                                                                                            {formatNumber(option?.quantity_warehouse)}
                                                                                        </h4>
                                                                                    </div>
                                                                                    {dataProductSerial?.is_enable === "1" && (
                                                                                        <div className="flex items-center">
                                                                                            <h4 className="text-[10px] italic">
                                                                                                {"Serial"}:
                                                                                            </h4>
                                                                                            <h4 className="pl-1 text-[10px] italic">
                                                                                                {option?.serial}
                                                                                            </h4>
                                                                                        </div>
                                                                                    )}
                                                                                    {
                                                                                        (dataMaterialExpiry.is_enable === "1" || dataProductExpiry?.is_enable === "1") && (
                                                                                            <>
                                                                                                <div className="flex items-center justify-start">
                                                                                                    <h4 className="text-[10px] italic">
                                                                                                        {"Lot"}:
                                                                                                    </h4>
                                                                                                    <h4 className="pl-1 text-[10px] italic">
                                                                                                        {option?.lot}
                                                                                                    </h4>
                                                                                                </div>
                                                                                                <div className="flex items-center">
                                                                                                    <h4 className="text-[10px] italic">
                                                                                                        {dataLang?.warehouses_detail_date || "warehouses_detail_date"}:
                                                                                                    </h4>
                                                                                                    <h4 className="pl-1 text-[10px] italic">
                                                                                                        {option?.expiration_date}
                                                                                                    </h4>
                                                                                                </div>
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        );
                                                                    }}
                                                                    style={{
                                                                        border: "none",
                                                                        boxShadow: "none",
                                                                        outline: "none",
                                                                    }}
                                                                    styles={{
                                                                        placeholder: (base) => ({
                                                                            ...base,
                                                                            color: "#cbd5e1",
                                                                        }),
                                                                        menuPortal: (base) => ({
                                                                            ...base,
                                                                            zIndex: 9999,
                                                                            position: "absolute",
                                                                        }),
                                                                        menu: (provided, state) => ({
                                                                            ...provided,
                                                                            width: "100%",
                                                                        }),


                                                                    }}
                                                                    theme={(theme) => ({
                                                                        ...theme,
                                                                        colors: {
                                                                            ...theme.colors,
                                                                            primary25: "#EBF5FF",
                                                                            primary50: "#92BFF7",
                                                                            primary: "#0F4F9E",
                                                                        },
                                                                    })}
                                                                    classNamePrefix="customDropdow classNamePrefixLotDateSerial"
                                                                />
                                                            </td>
                                                            <td className="p-2 text-sm text-center border">
                                                                <button
                                                                    title="Xóa"
                                                                    onClick={() => handleRemove("bom", row)}
                                                                    className="p-1 text-red-500 transition-all ease-linear rounded-md hover:scale-110 bg-red-50 hover:bg-red-200 animate-bounce-custom"
                                                                >
                                                                    <Trash size={24} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="p-2 text-center text-red-500 border">
                                                            Không có mặt hàng
                                                        </td>
                                                    </tr>
                                                )}
                                    </tbody>
                                </table>
                            </Customscrollbar>
                        </div> */}
                  {/* <div className="flex items-center justify-end gap-2">
                            <ButtonCancel
                                onClick={() => { queryState({ open: false }) }}
                                dataLang={dataLang}
                            />
                           
                        </div> */}
                </div>
              </div>
            </div>
          </div>
        </PopupCustom>
      )}
    </>
  )
}

export default PopupConfimStage
