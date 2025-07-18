import OnResetData from '@/components/UI/btnResetData/btnReset'
import ContainerPagination from '@/components/UI/common/ContainerPagination/ContainerPagination'
import { Customscrollbar } from '@/components/UI/common/Customscrollbar'
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from '@/components/UI/common/Table'
import DropdowLimit from '@/components/UI/dropdowLimit/dropdowLimit'
import DateToDateComponent from '@/components/UI/filterComponents/dateTodateComponent'
import DateToDateReport from '@/components/UI/filterComponents/dateTodateReport'
import ExcelFileComponent from '@/components/UI/filterComponents/excelFilecomponet'
import SearchComponent from '@/components/UI/filterComponents/searchComponent'
import SelectComponent from '@/components/UI/filterComponents/selectComponent'
import SelectReport from '@/components/common/select/SelectReport'
import CalendarBlankIcon from '@/components/icons/common/CalendarBlankIcon'
import ReportLayout from '@/components/layout/ReportLayout'
import { useLanguageContext } from '@/context/ui/LanguageContext'
import useSetingServer from '@/hooks/useConfigNumber'
import { useLimitAndTotalItems } from '@/hooks/useLimitAndTotalItems'
import usePagination from '@/hooks/usePagination'
import useStatusExprired from '@/hooks/useStatusExprired'
import formatNumberConfig from '@/utils/helpers/formatnumber'
import { Grid6 } from 'iconsax-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { PiPackage, PiWarehouseLight } from 'react-icons/pi'
import Pagination from '@/components/UI/pagination'

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
  {
    id: 13,
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
    id: 14,
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
    id: 15,
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
    id: 16,
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
    id: 17,
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
    id: 18,
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
    id: 19,
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
    id: 20,
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

  const handleDateChange = (newValue) => {
    console.log('Date changed:', newValue)
    setDateRange(newValue)
  }

  return (
    <ReportLayout
      title={'Báo cáo nhập kho mua hàng'}
      statusExprired={statusExprired}
      breadcrumbItems={breadcrumbItems}
      filterSection={
        <div className="w-full items-center flex justify-between gap-10">
          <div className="flex gap-3">
            {/* Sử dụng DateToDateReport với logic chiều rộng tự động trong component */}
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
        <Customscrollbar className="h-full rounded-lg border border-[#E0E0E1]">
          <div className="relative" style={{ minWidth: '100%', width: 'max-content' }}>
            {/* Tiêu đề cố định khi cuộn cả ngang và dọc */}
            <div className="flex sticky top-0 z-30">
              {/* 3 cột cố định bên trái */}
              <div className="flex sticky left-0 z-30 bg-white border-b border-[#E0E0E1]">
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-14 flex-shrink-0"
                >
                  STT
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-32 flex-shrink-0"
                >
                  Ngày chứng từ
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-28 flex-shrink-0"
                >
                  Mã chứng từ
                </ColumnTable>
              </div>

              {/* Các cột có thể cuộn */}
              <div className="flex bg-white border-b border-[#E0E0E1]">
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-20 flex-shrink-0"
                >
                  Mã MCC
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-20 flex-shrink-0"
                >
                  Tên NCC
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-28 flex-shrink-0"
                >
                  Mã mặt hàng
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-60 flex-shrink-0"
                >
                  Mặt hàng
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-24 flex-shrink-0"
                >
                  ĐVT
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-32 flex-shrink-0"
                >
                  Vị trí
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-20 flex-shrink-0"
                >
                  SL
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-28 flex-shrink-0"
                >
                  Đơn giá
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-16 flex-shrink-0"
                >
                  %CK
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-32 flex-shrink-0"
                >
                  Đơn giá SCK
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-20 flex-shrink-0"
                >
                  Thuế
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-32 flex-shrink-0"
                >
                  Thành tiền
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold w-52 flex-shrink-0"
                >
                  Ghi chú
                </ColumnTable>
              </div>
            </div>

            {/* Nội dung bảng có thể cuộn */}
            {data.map((item) => (
              <div className={'flex'} key={item.id}>
                {/* 3 cột cố định bên trái */}
                <div className="flex sticky left-0 z-20 bg-white border-b border-[#E0E0E1]">
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
                </div>

                {/* Các cột có thể cuộn */}
                <div className="flex bg-white border-b border-[#E0E0E1]">
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
                    className="flex justify-start items-center py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-normal w-52 flex-shrink-0"
                  >
                    {item.note}
                  </RowItemTable>
                </div>
              </div>
            ))}
          </div>
            <div className="flex sticky top-0 z-30">
              {/* 3 cột cố định bên trái */}
              <div className="flex sticky left-0 z-30 ">
                <ColumnTable className="w-14 flex-shrink-0"></ColumnTable>
                <ColumnTable className="w-32 flex-shrink-0"></ColumnTable>
                <ColumnTable className="w-28 flex-shrink-0"></ColumnTable>
              </div>

              {/* Các cột có thể cuộn */}
              <div className="flex bg-white">
                <ColumnTable className="w-20 flex-shrink-0"></ColumnTable>
                <ColumnTable className="w-20 flex-shrink-0"></ColumnTable>
                <ColumnTable className="w-28 flex-shrink-0"></ColumnTable>
                <ColumnTable className="w-60 flex-shrink-0"></ColumnTable>
                <ColumnTable className="w-24 flex-shrink-0"></ColumnTable>
                <ColumnTable
                  textAlign={'right'}
                  className="py-2 px-3 text-neutral-07 !responsive-text-sm font-semibold w-32 flex-shrink-0"
                >
                  Tổng cộng
                </ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 text-neutral-07 !responsive-text-sm font-semibold w-20 flex-shrink-0"
                >
                  96
                </ColumnTable>
                <ColumnTable className="w-28 flex-shrink-0"></ColumnTable>
                <ColumnTable className="w-16 flex-shrink-0"></ColumnTable>
                <ColumnTable className="w-32 flex-shrink-0"></ColumnTable>
                <ColumnTable className="w-20 flex-shrink-0"></ColumnTable>
                <ColumnTable
                  textAlign={'center'}
                  className="py-2 px-3 text-neutral-07 !responsive-text-sm font-semibold w-32 flex-shrink-0"
                >
                  4.800.000đ
                </ColumnTable>
                <ColumnTable className="w-52 flex-shrink-0"></ColumnTable>
              </div>
            </div>
        </Customscrollbar>
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
