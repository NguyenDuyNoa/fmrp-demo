import OnResetData from '@/components/UI/btnResetData/btnReset'
import { RowItemTable } from '@/components/UI/common/Table'
import DropdowLimit from '@/components/UI/dropdowLimit/dropdowLimit'
import DateToDateReport from '@/components/UI/filterComponents/dateTodateReport'
import ExcelFileComponent from '@/components/UI/filterComponents/excelFilecomponet'
import SearchComponent from '@/components/UI/filterComponents/searchComponent'
import Pagination from '@/components/UI/pagination'
import SelectReport from '@/components/common/select/SelectReport'
import SelectSearchReport from '@/components/common/select/SelectSearchReport'
import ReportLayout from '@/components/layout/ReportLayout'
import TableSection from '@/components/layout/ReportLayout/TableSection'
import { useInventoryItems } from '@/containers/manufacture/inventory/hooks/useInventoryItems'
import { useLanguageContext } from '@/context/ui/LanguageContext'
import usePagination from '@/hooks/usePagination'
import useStatusExprired from '@/hooks/useStatusExprired'
import formatMoneyOrDash from '@/utils/helpers/formatMoneyOrDash'
import formatNumber from '@/utils/helpers/formatnumber'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PiPackage, PiWarehouseLight } from 'react-icons/pi'
import { useDebounce } from 'use-debounce'
import { useGetListReportImport } from './hook/useGetListReportImport'
import { useGetWarehouse } from './hook/useGetWarehouse'

const breadcrumbItems = [
  {
    label: `Báo cáo`,
    href: '/report-statistical',
  },
  {
    label: `Tồn kho`,
  },
]

const ImportPurchase = (props) => {
  const { paginate } = usePagination()
  const dataLang = useLanguageContext()
  const statusExprired = useStatusExprired()
  const router = useRouter()

  const [dateRange, setDateRange] = useState({
    startDate: undefined,
    endDate: undefined,
  })
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)
  const [productOptions, setProductOptions] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [limit, setLimit] = useState(15)

  // Convert page to number and default to 1 if invalid
  const currentPage = Number(router.query.page) || 1

  const { data: warehouseData } = useGetWarehouse()
  const { data: dataProduct, refetch } = useInventoryItems(debouncedSearchTerm)
  const {
    data: dataReportImport,
    isFetching,
    refetch: refetchReportImport,
  } = useGetListReportImport({
    page: currentPage,
    limit: limit,
    filter: {
      warehouses_id: selectedWarehouse?.value,
      ...(dateRange?.startDate !== undefined && { start_date: dateRange.startDate }),
      ...(dateRange?.endDate !== undefined && { end_date: dateRange.endDate }),
    },
  })

  // Add useEffect to refetch when parameters change
  useEffect(() => {
    if (refetchReportImport) {
      refetchReportImport()
    }
  }, [limit, dateRange, selectedWarehouse, refetchReportImport])

  // Add useEffect to refetch when page changes
  useEffect(() => {
    if (currentPage && refetchReportImport) {
      refetchReportImport()
    }
  }, [currentPage, refetchReportImport])

  useEffect(() => {
    // Cập nhật options khi dataProduct thay đổi
    if (dataProduct) {
      const options = Array.isArray(dataProduct)
        ? dataProduct.map((product) => ({
            value: product.value,
            label: product.name,
          }))
        : []
      setProductOptions(options)
    }
  }, [dataProduct])

  const handleDateChange = (newValue) => {
    setDateRange(newValue)
  }

  useEffect(() => {
    // Tự động chọn kho đầu tiên khi dữ liệu kho được tải về
    if (warehouseData?.rResult && warehouseData.rResult.length > 0) {
      const firstWarehouse = warehouseData.rResult[0]
      setSelectedWarehouse({
        value: firstWarehouse.id,
        label: firstWarehouse.name,
      })
    }
  }, [warehouseData?.rResult])

  const handleWarehouseChange = (value) => {
    const selected = warehouseData?.rResult?.find((w) => w.id === value)
    if (selected) {
      setSelectedWarehouse({
        value: selected.id,
        label: selected.name,
      })
    }
  }

  const handleClearWarehouse = () => {
    setSelectedWarehouse(null)
  }

  const handleProductChange = (selectedValues) => {
    if (!selectedValues || selectedValues.length === 0) {
      setSelectedProducts([])
      return
    }

    const selectedItems = selectedValues.map((value) => {
      const option = productOptions.find((opt) => opt.value === value)
      return {
        value,
        label: option?.label || value,
      }
    })

    setSelectedProducts(selectedItems)
  }

  const handleClearProducts = () => {
    setSelectedProducts([])
  }

  // Define fixed columns configuration
  const fixedColumns = [
    { title: 'STT', width: 'w-14', textAlign: 'center' },
    { title: 'Ngày chứng từ', width: 'w-32', textAlign: 'left' },
    { title: 'Mã chứng từ', width: 'w-32', textAlign: 'center' },
  ]

  // Define scrollable columns configuration
  const scrollableColumns = [
    { title: 'Nhà cung cấp', width: 'w-40', textAlign: 'left' },
    { title: 'Mã mặt hàng', width: 'w-32', textAlign: 'center' },
    { title: 'Mặt hàng', width: 'w-60', textAlign: 'left' },
    { title: 'ĐVT', width: 'w-24', textAlign: 'center' },
    { title: 'Vị trí', width: 'w-32', textAlign: 'left' },
    { title: 'SL', width: 'w-20', textAlign: 'center' },
    { title: 'Đơn giá', width: 'w-28', textAlign: 'center' },
    { title: '%CK', width: 'w-16', textAlign: 'center' },
    { title: 'Đơn giá SCK', width: 'w-32', textAlign: 'center' },
    { title: 'Thuế', width: 'w-20', textAlign: 'center' },
    { title: 'Thành tiền', width: 'w-32', textAlign: 'end' },
    { title: 'Ghi chú', width: 'w-52', textAlign: 'center' },
  ]

  // Render function for fixed columns in each row
  const renderFixedRow = (item, index) => (
    <>
      <RowItemTable className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-14 flex-shrink-0">
        {index + 1}
      </RowItemTable>
      <RowItemTable className="flex flex-col justify-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-32 flex-shrink-0">
        <span>{moment(item.date).format('DD/MM/YYYY')}</span>
        <span>{moment(item.date).format('HH:mm:ss')}</span>
      </RowItemTable>
      <RowItemTable className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] !text-new-blue !responsive-text-sm font-semibold w-32 flex-shrink-0">
        {item.code_import}
      </RowItemTable>
    </>
  )

  // Render function for scrollable columns in each row
  const renderScrollableRow = (item, index) => (
    <>
      <RowItemTable className="flex items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-40 flex-shrink-0">
        {item.name_supplier}
      </RowItemTable>
      <RowItemTable className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-32 flex-shrink-0">
        {item.item_code}
      </RowItemTable>
      <RowItemTable className="flex items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-60 flex-shrink-0">
        <div className="flex flex-col gap-2 justify-start">
          <p className="text-left responsive-text-sm text-neutral-07 font-normal">{item.item_name}</p>
          <p className="text-left responsive-text-xxs text-neutral-07 font-normal">{item.item_variation || ''}</p>
        </div>
      </RowItemTable>
      <RowItemTable className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-24 flex-shrink-0">
        {item.unit_name}
      </RowItemTable>
      <RowItemTable className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-32 flex-shrink-0">
        {item.warehouse_name}
      </RowItemTable>
      <RowItemTable className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-20 flex-shrink-0">
        {formatNumber(Number(item.quantity))}
      </RowItemTable>
      <RowItemTable className="flex justify-center items-center gap-1 py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-28 flex-shrink-0">
        {formatMoneyOrDash(Number(item.price))}
      </RowItemTable>
      <RowItemTable className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-16 flex-shrink-0">
        {item.discount_percent}%
      </RowItemTable>
      <RowItemTable className="flex justify-center items-center gap-1 py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-32 flex-shrink-0">
        {formatMoneyOrDash(Number(item.price_after_discount))}
      </RowItemTable>
      <RowItemTable className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-20 flex-shrink-0">
        {item.tax_rate}%
      </RowItemTable>
      <RowItemTable className="flex justify-end items-center gap-1 py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-32 flex-shrink-0">
        {formatMoneyOrDash(Number(item.amount))}
      </RowItemTable>
      <RowItemTable className="flex justify-start items-center py-2 px-3 text-neutral-07 !responsive-text-sm font-normal w-52 flex-shrink-0">
        {item.note}
      </RowItemTable>
    </>
  )

  // Render function for the footer row
  const renderFooter = () => (
    <>
      <RowItemTable className="w-14 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-32 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-32 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-40 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-32 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-60 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-24 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="h-10 flex items-center justify-end px-3 text-neutral-07 !responsive-text-sm font-semibold w-32 flex-shrink-0 bg-white">
        Tổng cộng
      </RowItemTable>
      <RowItemTable
        textAlign={'center'}
        className="h-10 flex items-center justify-center px-3 text-neutral-07 !responsive-text-sm font-semibold w-20 flex-shrink-0 bg-white"
      >
        96
      </RowItemTable>
      <RowItemTable className="w-28 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-16 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-32 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-20 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="h-10 flex justify-end items-center px-3 text-neutral-07 !responsive-text-sm font-semibold w-32 flex-shrink-0 bg-white">
        4.800.000 đ
      </RowItemTable>
      <RowItemTable className="w-52 flex-shrink-0 bg-white"></RowItemTable>
    </>
  )

  // Add limit handler
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit)
  }

  return (
    <ReportLayout
      title={'Báo cáo nhập kho mua hàng'}
      statusExprired={statusExprired}
      breadcrumbItems={breadcrumbItems}
      filterSection={
        <div className="w-full items-center flex justify-between gap-10">
          <div className="flex gap-3">
            <DateToDateReport placeholder="Giai đoạn" value={dateRange} onChange={handleDateChange} />

            <SelectReport
              placeholder="Kho thành phẩm"
              onChange={handleWarehouseChange}
              onClear={handleClearWarehouse}
              icon={<PiWarehouseLight color="#9295A4" className="size-4" />}
              className="w-[200px] 2xl:w-[250px]"
              options={warehouseData?.rResult?.map((warehouse) => ({
                value: warehouse.id,
                label: warehouse.name,
              }))}
              value={selectedWarehouse}
            />

            <SelectSearchReport
              placeholder="Mặt hàng"
              onSearch={(value) => {
                setSearchTerm(value)
              }}
              onClear={handleClearProducts}
              onChange={handleProductChange}
              icon={<PiPackage color="#9295A4" className="size-4" />}
              className="w-[250px] 2xl:w-[400px]"
              options={productOptions}
              value={selectedProducts}
              mode="multiple"
            />
          </div>
          <div className="flex gap-3 items-center">
            <SearchComponent dataLang={dataLang} onChange={() => {}} classNameBox="!py-2 2xl:!p-2.5" />
            <OnResetData sOnFetching={() => {}} onClick={() => {}} className="!py-3" />
            <ExcelFileComponent
              dataLang={dataLang}
              filename="Danh sách đơn hàng bán"
              title="DSĐHB"
              multiDataSet={[]}
              classBtn="!py-3"
            />
          </div>
        </div>
      }
      tableSection={
        <TableSection
          fixedColumns={fixedColumns}
          scrollableColumns={scrollableColumns}
          data={dataReportImport?.rResult}
          isFetching={isFetching}
          renderFixedRow={renderFixedRow}
          renderScrollableRow={renderScrollableRow}
          renderFooter={renderFooter}
        />
      }
      totalSection={
        <Pagination
          postsPerPage={limit}
          totalPosts={Number(dataReportImport?.output?.iTotalDisplayRecords) || 0}
          paginate={paginate}
          currentPage={currentPage}
        />
      }
      paginationSection={<DropdowLimit sLimit={handleLimitChange} limit={limit} dataLang={dataLang} />}
    />
  )
}

export default ImportPurchase
