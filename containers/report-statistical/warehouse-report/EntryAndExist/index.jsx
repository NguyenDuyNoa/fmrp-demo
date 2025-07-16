import ContainerPagination from '@/components/UI/common/ContainerPagination/ContainerPagination'
import TitlePagination from '@/components/UI/common/ContainerPagination/TitlePagination'
import { ColumnTable, RowItemTable, RowTable } from '@/components/UI/common/Table'
import { ContainerTotal } from '@/components/UI/common/layout'
import Pagination from '@/components/UI/pagination'
import ReportLayout from '@/components/layout/ReportLayout'
import ReportFilter from '@/components/layout/ReportLayout/ReportFilter'
import ReportTable from '@/components/layout/ReportLayout/ReportTable'
import useSetingServer from '@/hooks/useConfigNumber'
import { useLimitAndTotalItems } from '@/hooks/useLimitAndTotalItems'
import usePagination from '@/hooks/usePagination'
import useStatusExprired from '@/hooks/useStatusExprired'
import formatNumberConfig from '@/utils/helpers/formatnumber'
import { useRouter } from 'next/router'
import { useState } from 'react'

const EntryAndExist = (props) => {
  const { dataLang } = props

  const dataSeting = useSetingServer()

  const router = useRouter()

  const { paginate } = usePagination()

  const statusExprired = useStatusExprired()

  const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()
  const formatNumber = (number) => {
    return formatNumberConfig(+number, dataSeting)
  }

  const initialState = {
    total: {},
    data: [],
    onFetching: false,
  }

  const [isState, setState] = useState(initialState)

  const queryState = (key) => setState((prev) => ({ ...prev, ...key }))

  const filterOptions = [
    {
      options: [{ value: '', label: 'Công đoạn', isDisabled: true }],
      placeholder: 'Công đoạn',
      onChange: () => {},
    },
    // ... các options khác
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

  const headerContent = (
    <>
      <ColumnTable colSpan={2} textAlign={'center'}>
        Mã mặt hàng
      </ColumnTable>
      <ColumnTable colSpan={2} textAlign={'center'}>
        Tên mặt hàng
      </ColumnTable>
      <ColumnTable colSpan={1} textAlign={'center'}>
        ĐVT
      </ColumnTable>
      <ColumnTable colSpan={2} className="grid grid-cols-4  items-center justify-center !px-0">
        <ColumnTable colSpan={4} textAlign={'center'} className="border-b py-0.5">
          Tồn đầu kỳ
        </ColumnTable>
        <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 border-r">
          Số lượng
        </ColumnTable>
        <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 py-0.5">
          Giá trị
        </ColumnTable>
      </ColumnTable>
      <ColumnTable colSpan={2} className="grid grid-cols-4  items-center justify-center !px-0">
        <ColumnTable colSpan={4} textAlign={'center'} className="border-b py-0.5">
          Nhập kho
        </ColumnTable>
        <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 border-r">
          Số lượng
        </ColumnTable>
        <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 py-0.5">
          Giá trị
        </ColumnTable>
      </ColumnTable>
      <ColumnTable colSpan={2} className="grid grid-cols-4  items-center justify-center !px-0">
        <ColumnTable colSpan={4} textAlign={'center'} className="border-b py-0.5">
          Xuất kho
        </ColumnTable>
        <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 border-r">
          Số lượng
        </ColumnTable>
        <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 py-0.5">
          Giá trị
        </ColumnTable>
      </ColumnTable>
      <ColumnTable colSpan={2} className="grid grid-cols-4  items-center justify-center !px-0">
        <ColumnTable colSpan={4} textAlign={'center'} className="border-b py-0.5">
          Tồn cuối kỳ
        </ColumnTable>
        <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 border-r">
          Số lượng
        </ColumnTable>
        <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 py-0.5">
          Giá trị
        </ColumnTable>
      </ColumnTable>
    </>
  )

  const renderRow = (item) => (
    <RowTable gridCols={13} key={item.id.toString()}>
      <RowItemTable colSpan={2} textAlign={'center'}></RowItemTable>
      <RowItemTable colSpan={2} textAlign={'center'}></RowItemTable>
      <RowItemTable colSpan={1} textAlign={'right'}></RowItemTable>
      <RowItemTable colSpan={1} textAlign={'right'}></RowItemTable>
      <RowItemTable colSpan={1} textAlign={'right'}></RowItemTable>
      <RowItemTable colSpan={1} textAlign={'left'} className={'truncate'}></RowItemTable>
      <RowItemTable colSpan={1} className="flex items-center space-x-1"></RowItemTable>
      <RowItemTable colSpan={1}></RowItemTable>
      <RowItemTable colSpan={1} className="mx-auto"></RowItemTable>
      <RowItemTable colSpan={1} className="mx-auto"></RowItemTable>
      <RowItemTable colSpan={1} className="mx-auto"></RowItemTable>
    </RowTable>
  )

  return (
    <ReportLayout
      title="Báo cáo nhập xuất tồn"
      statusExprired={statusExprired}
      breadcrumbItems={breadcrumbItems}
      filterSection={
        <ReportFilter
          onSearch={() => {}}
          onReset={() => {}}
          onExport={() => {}}
          filterOptions={filterOptions}
          limit={limit}
          sLimit={sLimit}
          dataLang={dataLang}
        />
      }
      tableSection={
        <ReportTable
          isLoading={isState.isLoading}
          data={isState.data}
          headerContent={headerContent}
          renderRow={renderRow}
        />
      }
      totalSection={
        isState?.data?.length > 0 && (
          <ContainerTotal>
            <ColumnTable colSpan={5} textAlign={'center'} className="p-2">
              {dataLang?.productsWarehouse_total || 'productsWarehouse_total'}
            </ColumnTable>
            <ColumnTable colSpan={1} textAlign={'right'} className="p-2 mr-1">
              {formatNumber(isState.total?.total_quantity)}
            </ColumnTable>
            <ColumnTable colSpan={1} textAlign={'right'} className="p-2 mr-1">
              {formatNumber(isState.total?.total_quantity)}
            </ColumnTable>
            <ColumnTable colSpan={1} textAlign={'right'} className="p-2 mr-1">
              {formatNumber(isState.total?.total_quantity)}
            </ColumnTable>
            <ColumnTable colSpan={1} textAlign={'right'} className="p-2 mr-1">
              {formatNumber(isState.total?.total_quantity)}
            </ColumnTable>
            <ColumnTable colSpan={1} textAlign={'right'} className="p-2 mr-1">
              {formatNumber(isState.total?.total_quantity)}
            </ColumnTable>
            <ColumnTable colSpan={1} textAlign={'right'} className="p-2 mr-1">
              {formatNumber(isState.total?.total_quantity)}
            </ColumnTable>
            <ColumnTable colSpan={1} textAlign={'right'} className="p-2 mr-1">
              {formatNumber(isState.total?.total_quantity)}
            </ColumnTable>
          </ContainerTotal>
        )
      }
      paginationSection={
        isState?.data?.length > 0 && (
          <ContainerPagination>
            <TitlePagination dataLang={dataLang} totalItems={isState?.total?.iTotalDisplayRecords} />
            <Pagination
              postsPerPage={isState.limitItemWarehouseDetail}
              totalPosts={Number(isState?.total?.iTotalDisplayRecords)}
              paginate={paginate}
              currentPage={router.query?.page || 1}
              className="3xl:text-base text-sm"
            />
          </ContainerPagination>
        )
      }
    />
  )
}

export default EntryAndExist
