import OnResetData from '@/components/UI/btnResetData/btnReset'
import ContainerPagination from '@/components/UI/common/ContainerPagination/ContainerPagination'
import { RowItemTable } from '@/components/UI/common/Table'
import DropdowLimit from '@/components/UI/dropdowLimit/dropdowLimit'
import DateToDateReport from '@/components/UI/filterComponents/dateTodateReport'
import ExcelFileComponent from '@/components/UI/filterComponents/excelFilecomponet'
import SearchComponent from '@/components/UI/filterComponents/searchComponent'
import SelectReport from '@/components/common/select/SelectReport'
import ReportLayout from '@/components/layout/ReportLayout'
import TableSection from '@/components/layout/ReportLayout/TableSection'
import { useLanguageContext } from '@/context/ui/LanguageContext'
import useStatusExprired from '@/hooks/useStatusExprired'
import { PiPackage, PiWarehouseLight } from 'react-icons/pi'
import { useState } from 'react'
import Pagination from '@/components/UI/pagination'
import { useGetWarehouse } from './hook/useGetWarehouse'

const data = [
  {
    id: 1,
    date: '18/07/2025',
    code: 'ST_000169',
    mcc: 'DT88',
    name: 'Duy Tân',
    productCode: 'TABLE69',
    productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
    unit: 'Chiếc',
    location: 'Tầng G - Kho TP',
    quantity: 12,
    price: 50000,
    ck: 0,
    priceCk: 50000,
    tax: 0,
    total: 600000,
    note: 'Có 2 sp lỗi',
  },
  {
    id: 2,
    date: '18/07/2025',
    code: 'ST_000169',
    mcc: 'DT88',
    name: 'Duy Tân',
    productCode: 'TABLE69',
    productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
    unit: 'Chiếc',
    location: 'Tầng G - Kho TP',
    quantity: 12,
    price: 50000,
    ck: 0,
    priceCk: 50000,
    tax: 0,
    total: 600000,
    note: 'Có 2 sp lỗi',
  },
  {
    id: 3,
    date: '18/07/2025',
    code: 'ST_000169',
    mcc: 'DT88',
    name: 'Duy Tân',
    productCode: 'TABLE69',
    productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
    unit: 'Chiếc',
    location: 'Tầng G - Kho TP',
    quantity: 12,
    price: 50000,
    ck: 0,
    priceCk: 50000,
    tax: 0,
    total: 600000,
    note: 'Có 2 sp lỗi',
  },
  {
    id: 4,
    date: '18/07/2025',
    code: 'ST_000169',
    mcc: 'DT88',
    name: 'Duy Tân',
    productCode: 'TABLE69',
    productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
    unit: 'Chiếc',
    location: 'Tầng G - Kho TP',
    quantity: 12,
    price: 50000,
    ck: 0,
    priceCk: 50000,
    tax: 0,
    total: 600000,
    note: 'Có 2 sp lỗi',
  },
  {
    id: 5,
    date: '18/07/2025',
    code: 'ST_000169',
    mcc: 'DT88',
    name: 'Duy Tân',
    productCode: 'TABLE69',
    productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
    unit: 'Chiếc',
    location: 'Tầng G - Kho TP',
    quantity: 12,
    price: 50000,
    ck: 0,
    priceCk: 50000,
    tax: 0,
    total: 600000,
    note: 'Có 2 sp lỗi',
  },
  {
    id: 6,
    date: '18/07/2025',
    code: 'ST_000169',
    mcc: 'DT88',
    name: 'Duy Tân',
    productCode: 'TABLE69',
    productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
    unit: 'Chiếc',
    location: 'Tầng G - Kho TP',
    quantity: 12,
    price: 50000,
    ck: 0,
    priceCk: 50000,
    tax: 0,
    total: 600000,
    note: 'Có 2 sp lỗi',
  },
  {
    id: 7,
    date: '18/07/2025',
    code: 'ST_000169',
    mcc: 'DT88',
    name: 'Duy Tân',
    productCode: 'TABLE69',
    productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
    unit: 'Chiếc',
    location: 'Tầng G - Kho TP',
    quantity: 12,
    price: 50000,
    ck: 0,
    priceCk: 50000,
    tax: 0,
    total: 600000,
    note: 'Có 2 sp lỗi',
  },
  {
    id: 8,
    date: '18/07/2025',
    code: 'ST_000169',
    mcc: 'DT88',
    name: 'Duy Tân',
    productCode: 'TABLE69',
    productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
    unit: 'Chiếc',
    location: 'Tầng G - Kho TP',
    quantity: 12,
    price: 50000,
    ck: 0,
    priceCk: 50000,
    tax: 0,
    total: 600000,
    note: 'Có 2 sp lỗi',
  },
  {
    id: 9,
    date: '18/07/2025',
    code: 'ST_000169',
    mcc: 'DT88',
    name: 'Duy Tân',
    productCode: 'TABLE69',
    productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
    unit: 'Chiếc',
    location: 'Tầng G - Kho TP',
    quantity: 12,
    price: 50000,
    ck: 0,
    priceCk: 50000,
    tax: 0,
    total: 600000,
    note: 'Có 2 sp lỗi',
  },
  {
    id: 10,
    date: '18/07/2025',
    code: 'ST_000169',
    mcc: 'DT88',
    name: 'Duy Tân',
    productCode: 'TABLE69',
    productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
    unit: 'Chiếc',
    location: 'Tầng G - Kho TP',
    quantity: 12,
    price: 50000,
    ck: 0,
    priceCk: 50000,
    tax: 0,
    total: 600000,
    note: 'Có 2 sp lỗi',
  },
  {
    id: 11,
    date: '18/07/2025',
    code: 'ST_000169',
    mcc: 'DT88',
    name: 'Duy Tân',
    productCode: 'TABLE69',
    productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
    unit: 'Chiếc',
    location: 'Tầng G - Kho TP',
    quantity: 12,
    price: 50000,
    ck: 0,
    priceCk: 50000,
    tax: 0,
    total: 600000,
    note: 'Có 2 sp lỗi',
  },
  {
    id: 2,
    date: '18/07/2025',
    code: 'ST_000169',
    mcc: 'DT88',
    name: 'Duy Tân',
    productCode: 'TABLE69',
    productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
    unit: 'Chiếc',
    location: 'Tầng G - Kho TP',
    quantity: 12,
    price: 50000,
    ck: 0,
    priceCk: 50000,
    tax: 0,
    total: 600000,
    note: 'Có 2 sp lỗi',
  },
  {
    id: 12,
    date: '18/07/2025',
    code: 'ST_000169',
    mcc: 'DT88',
    name: 'Duy Tân',
    productCode: 'TABLE69',
    productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
    unit: 'Chiếc',
    location: 'Tầng G - Kho TP',
    quantity: 12,
    price: 50000,
    ck: 0,
    priceCk: 50000,
    tax: 0,
    total: 600000,
    note: 'Có 2 sp lỗi',
  },
  // {
  //   id: 13,
  //   date: '18/07/2025',
  //   code: 'ST_000169',
  //   mcc: 'DT88',
  //   name: 'Duy Tân',
  //   productCode: 'TABLE69',
  //   productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
  //   unit: 'Chiếc',
  //   location: 'Tầng G - Kho TP',
  //   quantity: 12,
  //   price: 50000,
  //   ck: 0,
  //   priceCk: 50000,
  //   tax: 0,
  //   total: 600000,
  //   note: 'Có 2 sp lỗi',
  // },
  // {
  //   id: 14,
  //   date: '18/07/2025',
  //   code: 'ST_000169',
  //   mcc: 'DT88',
  //   name: 'Duy Tân',
  //   productCode: 'TABLE69',
  //   productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
  //   unit: 'Chiếc',
  //   location: 'Tầng G - Kho TP',
  //   quantity: 12,
  //   price: 50000,
  //   ck: 0,
  //   priceCk: 50000,
  //   tax: 0,
  //   total: 600000,
  //   note: 'Có 2 sp lỗi',
  // },
  // {
  //   id: 15,
  //   date: '18/07/2025',
  //   code: 'ST_000169',
  //   mcc: 'DT88',
  //   name: 'Duy Tân',
  //   productCode: 'TABLE69',
  //   productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
  //   unit: 'Chiếc',
  //   location: 'Tầng G - Kho TP',
  //   quantity: 12,
  //   price: 50000,
  //   ck: 0,
  //   priceCk: 50000,
  //   tax: 0,
  //   total: 600000,
  //   note: 'Có 2 sp lỗi',
  // },
  // {
  //   id: 16,
  //   date: '18/07/2025',
  //   code: 'ST_000169',
  //   mcc: 'DT88',
  //   name: 'Duy Tân',
  //   productCode: 'TABLE69',
  //   productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
  //   unit: 'Chiếc',
  //   location: 'Tầng G - Kho TP',
  //   quantity: 12,
  //   price: 50000,
  //   ck: 0,
  //   priceCk: 50000,
  //   tax: 0,
  //   total: 600000,
  //   note: 'Có 2 sp lỗi',
  // },
  // {
  //   id: 17,
  //   date: '18/07/2025',
  //   code: 'ST_000169',
  //   mcc: 'DT88',
  //   name: 'Duy Tân',
  //   productCode: 'TABLE69',
  //   productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
  //   unit: 'Chiếc',
  //   location: 'Tầng G - Kho TP',
  //   quantity: 12,
  //   price: 50000,
  //   ck: 0,
  //   priceCk: 50000,
  //   tax: 0,
  //   total: 600000,
  //   note: 'Có 2 sp lỗi',
  // },
  // {
  //   id: 18,
  //   date: '18/07/2025',
  //   code: 'ST_000169',
  //   mcc: 'DT88',
  //   name: 'Duy Tân',
  //   productCode: 'TABLE69',
  //   productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
  //   unit: 'Chiếc',
  //   location: 'Tầng G - Kho TP',
  //   quantity: 12,
  //   price: 50000,
  //   ck: 0,
  //   priceCk: 50000,
  //   tax: 0,
  //   total: 600000,
  //   note: 'Có 2 sp lỗi',
  // },
  // {
  //   id: 19,
  //   date: '18/07/2025',
  //   code: 'ST_000169',
  //   mcc: 'DT88',
  //   name: 'Duy Tân',
  //   productCode: 'TABLE69',
  //   productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
  //   unit: 'Chiếc',
  //   location: 'Tầng G - Kho TP',
  //   quantity: 12,
  //   price: 50000,
  //   ck: 0,
  //   priceCk: 50000,
  //   tax: 0,
  //   total: 600000,
  //   note: 'Có 2 sp lỗi',
  // },
  // {
  //   id: 20,
  //   date: '18/07/2025',
  //   code: 'ST_000169',
  //   mcc: 'DT88',
  //   name: 'Duy Tân',
  //   productCode: 'TABLE69',
  //   productName: 'BÀN NHẬT CAO H1043 DƯƠNG 615',
  //   unit: 'Chiếc',
  //   location: 'Tầng G - Kho TP',
  //   quantity: 12,
  //   price: 50000,
  //   ck: 0,
  //   priceCk: 50000,
  //   tax: 0,
  //   total: 600000,
  //   note: 'Có 2 sp lỗi',
  // },
]

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
  const dataLang = useLanguageContext()
  const statusExprired = useStatusExprired()
  const [dateRange, setDateRange] = useState({
    startDate: undefined,
    endDate: undefined,
  })

  const { data: warehouseData } = useGetWarehouse()
  console.log(warehouseData)
  const handleDateChange = (newValue) => {
    console.log('Date changed:', newValue)
    setDateRange(newValue)
  }

  // Define fixed columns configuration
  const fixedColumns = [
    { title: 'STT', width: 'w-14', textAlign: 'center' },
    { title: 'Ngày chứng từ', width: 'w-32', textAlign: 'center' },
    { title: 'Mã chứng từ', width: 'w-28', textAlign: 'center' },
  ]

  // Define scrollable columns configuration
  const scrollableColumns = [
    { title: 'Mã MCC', width: 'w-20', textAlign: 'center' },
    { title: 'Tên NCC', width: 'w-20', textAlign: 'center' },
    { title: 'Mã mặt hàng', width: 'w-28', textAlign: 'center' },
    { title: 'Mặt hàng', width: 'w-60', textAlign: 'center' },
    { title: 'ĐVT', width: 'w-24', textAlign: 'center' },
    { title: 'Vị trí', width: 'w-32', textAlign: 'center' },
    { title: 'SL', width: 'w-20', textAlign: 'center' },
    { title: 'Đơn giá', width: 'w-28', textAlign: 'center' },
    { title: '%CK', width: 'w-16', textAlign: 'center' },
    { title: 'Đơn giá SCK', width: 'w-32', textAlign: 'center' },
    { title: 'Thuế', width: 'w-20', textAlign: 'center' },
    { title: 'Thành tiền', width: 'w-32', textAlign: 'center' },
    { title: 'Ghi chú', width: 'w-52', textAlign: 'center' },
  ]

  // Render function for fixed columns in each row
  const renderFixedRow = (item, index) => (
    <>
      <RowItemTable
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-14 flex-shrink-0"
        textAlign={'center'}
      >
        {item.id}
      </RowItemTable>
      <RowItemTable
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-32 flex-shrink-0"
        textAlign={'center'}
      >
        {item.date}
      </RowItemTable>
      <RowItemTable
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] !text-new-blue !responsive-text-sm font-semibold w-28 flex-shrink-0"
        textAlign={'center'}
      >
        {item.code}
      </RowItemTable>
    </>
  )

  // Render function for scrollable columns in each row
  const renderScrollableRow = (item, index) => (
    <>
      <RowItemTable
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-20 flex-shrink-0"
        textAlign={'center'}
      >
        {item.mcc}
      </RowItemTable>
      <RowItemTable
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-20 flex-shrink-0"
        textAlign={'center'}
      >
        {item.name}
      </RowItemTable>
      <RowItemTable
        textAlign={'center'}
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-28 flex-shrink-0"
      >
        {item.productCode}
      </RowItemTable>
      <RowItemTable
        textAlign={'center'}
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-60 flex-shrink-0"
      >
        <div className="flex flex-col gap-2 justify-start">
          <p className="text-left responsive-text-sm text-neutral-07 font-normal">{item.productName}</p>
          <p className="text-left responsive-text-xxs text-neutral-07 font-normal">
            Màu sắc: Trắng - Size: XL
          </p>
        </div>
      </RowItemTable>
      <RowItemTable
        textAlign={'center'}
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-24 flex-shrink-0"
      >
        {item.unit}
      </RowItemTable>
      <RowItemTable
        textAlign={'center'}
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-32 flex-shrink-0"
      >
        {item.location}
      </RowItemTable>
      <RowItemTable
        textAlign={'center'}
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-20 flex-shrink-0"
      >
        {item.quantity}
      </RowItemTable>
      <RowItemTable
        textAlign={'center'}
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-28 flex-shrink-0"
      >
        {item.price}
      </RowItemTable>
      <RowItemTable
        textAlign={'center'}
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-16 flex-shrink-0"
      >
        {item.ck}
      </RowItemTable>
      <RowItemTable
        textAlign={'center'}
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-32 flex-shrink-0"
      >
        {item.priceCk}
      </RowItemTable>
      <RowItemTable
        textAlign={'center'}
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-20 flex-shrink-0"
      >
        {item.tax}
      </RowItemTable>
      <RowItemTable
        textAlign={'center'}
        className="flex justify-center items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-32 flex-shrink-0"
      >
        {item.total}
      </RowItemTable>
      <RowItemTable
        textAlign={'center'}
        className="flex justify-start items-center py-2 px-3 text-neutral-07 !responsive-text-sm font-normal w-52 flex-shrink-0"
      >
        {item.note}
      </RowItemTable>
    </>
  )

  // Render function for the footer row
  const renderFooter = () => (
    <>
      <RowItemTable className="w-14 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-32 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-28 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-20 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-20 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-28 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-60 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable className="w-24 flex-shrink-0 bg-white"></RowItemTable>
      <RowItemTable
        textAlign={'right'}
        className="h-10 flex items-center justify-end px-3 text-neutral-07 !responsive-text-sm font-semibold w-32 flex-shrink-0 bg-white"
      >
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
      <RowItemTable
        textAlign={'center'}
        className="h-10 flex items-center justify-center px-3 text-neutral-07 !responsive-text-sm font-semibold w-32 flex-shrink-0 bg-white"
      >
        4.800.000đ
      </RowItemTable>
      <RowItemTable className="w-52 flex-shrink-0 bg-white"></RowItemTable>
    </>
  )

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
              onChange={() => {}}
              icon={<PiWarehouseLight color="#9295A4" className="size-4" />}
              className="w-[200px]"
              options={[
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
              ]}
            />

            <SelectReport
              placeholder="Mặt hàng"
              onChange={() => {}}
              icon={<PiPackage color="#9295A4" className="size-4" />}
              className="w-[200px]"
              options={[
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
              ]}
            />
          </div>
          <div className="flex gap-3 items-center">
            <SearchComponent dataLang={dataLang} onChange={() => {}} classNameBox="!py-2" />
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
          data={data}
          renderFixedRow={renderFixedRow}
          renderScrollableRow={renderScrollableRow}
          renderFooter={renderFooter}
        />
      }
      totalSection={
        <div className="flex items-center justify-between gap-2">
          <ContainerPagination>
            <Pagination postsPerPage={10} totalPosts={100} paginate={() => {}} currentPage={1} />
          </ContainerPagination>
        </div>
      }
      paginationSection={<DropdowLimit sLimit={10} limit={10} dataLang={dataLang} />}
    />
  )
}

export default ImportPurchase
