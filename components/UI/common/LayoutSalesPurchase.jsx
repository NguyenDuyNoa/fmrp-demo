import Breadcrumb from '@/components/UI/breadcrumb/BreadcrumbCustom'
import { EmptyExprired } from '@/components/UI/common/EmptyExprired'
import { Container } from '@/components/UI/common/layout'
import useStatusExprired from '@/hooks/useStatusExprired'
import { Button } from 'antd'
import Head from 'next/head'
import { useRouter } from 'next/router'

const LayoutSalesPurchaseManager = ({
  dataLang,
  titleHead,
  breadcrumbItems,
  titleLayout,
  sidebarLeft,
  sidebarRight,
  routerBack = '/',
  onSave,
  isLoading = false,
  popupConfim,
}) => {
  const router = useRouter()
  const statusExprired = useStatusExprired()

  console.log('breadcrumbItems', breadcrumbItems)

  return (
    <div className="overflow-hidden">
      <Head>
        <title>{titleHead}</title>
      </Head>
      <Container className="!h-max py-6 bg-gray-color">
        {statusExprired ? (
          <EmptyExprired />
        ) : (
          <Breadcrumb items={breadcrumbItems} className="3xl:text-sm 2xl:text-xs xl:text-[10px] lg:text-[10px]" />
        )}

        <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-typo-gray-5 capitalize font-medium mt-1 2xl:!mb-5 lg:!mb-3">
          {titleLayout}
        </h2>
        <div className="flex w-full 3xl:gap-x-6 gap-x-4 items-stretch pb-40 relative">
          {/* Cột trái */}
          <div className="w-3/4">{sidebarLeft}</div>

          {/* Cột phải */}
          <div className="w-1/4">{sidebarRight}</div>
        </div>

        {/* Nút lưu và thoát */}
        <div className="fixed bottom-0 left-0 z-[999] w-full h-[68px] bg-white border-t border-gray-color flex gap-x-6 shadow-[0_-3px_12px_0_rgba(0,0,0,0.1)]">
          <div className="w-3/4"></div>
          <div className="w-1/4 flex justify-end items-center gap-2 py-4 3xl:px-5 px-3">
            <button
              onClick={() => router.push(routerBack)}
              dataLang={dataLang}
              className="2xl:px-5 2xl:pt-[10px] 2xl:pb-[30px] xl:px-4 xl:py-2 px-2 h-full bg-[#F2F3F5] 2xl:text-base text-sm font-normal rounded-lg"
            >
              Thoát
            </button>
            <Button
              onClick={onSave}
              dataLang={dataLang}
              loading={isLoading}
              className="sale-order-btn-submit 3xl:p-5 2xl:p-4 xl:pt-[10px] xl:pb-[10px] h-full bg-light-blue-color text-white 2xl:text-base xl:text-sm font-medium rounded-lg"
            >
              Lưu
            </Button>
          </div>
        </div>
      </Container>

      {popupConfim}
    </div>
  )
}

export default LayoutSalesPurchaseManager
