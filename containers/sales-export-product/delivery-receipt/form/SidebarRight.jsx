import InfoFormLabel from '@/components/common/orderManagement/InfoFormLabel'
import OrderFormTabs from '@/components/common/orderManagement/OrderFormTabs'
import SelectWithSort from '@/components/common/select/SelectWithSort'
import useSetingServer from '@/hooks/useConfigNumber'
import formatMoneyConfig from '@/utils/helpers/formatMoney'
import { ConfigProvider, DatePicker } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown2, ArrowUp2 } from 'iconsax-react'
import { useState } from 'react'
import { BsCalendarEvent } from 'react-icons/bs'
import { FiUser } from 'react-icons/fi'
import { LuBriefcase } from 'react-icons/lu'
import { PiMapPinLight } from 'react-icons/pi'

const SidebarRight = ({ dataLang }) => {
  // Call hook
  const dataSeting = useSetingServer()

  // State management
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [isTotalMoney, setIsTotalMoney] = useState({
    totalPrice: 0,
    totalDiscountPrice: 0,
    totalDiscountAfterPrice: 0,
    totalTax: 0,
    totalAmount: 0,
  })

  return (
    <div className="flex flex-col gap-y-6">
      {/* Cột thông tin chung */}
      <div className="w-full mx-auto px-4 bg-white border border-gray-200 rounded-2xl">
        <h2 className="2xl:text-[20px] xl:text-lg font-medium text-brand-color mt-6 mb-4 capitalize">Thông tin</h2>
        {/* Tabs */}
        <OrderFormTabs
          Info={() => {
            return (
              <div className="relative">
                {/* Số đơn hàng */}
                <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                  <InfoFormLabel label={dataLang?.sales_product_code || 'sales_product_code'} />
                  <div className="w-full relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500">#</span>
                    <input
                      //   value={codeProduct}
                      //   onChange={handleOnChangeInput.bind(this, 'codeProduct')}
                      name="fname"
                      type="text"
                      placeholder={dataLang?.system_default || 'system_default'}
                      className={`responsive-text-base placeholder:text-sm z-10 pl-8 focus:border-[#0F4F9E] w-full text-gray-600 font-normal border border-[#d0d5dd] p-2 rounded-lg outline-none cursor-pointer`}
                    />
                  </div>
                </div>

                {/* Ngày tạo đơn */}
                <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3 relative">
                  <InfoFormLabel isRequired label={'Ngày tạo đơn'} />
                  <div className="w-full">
                    <div className="relative w-full flex flex-row custom-date-picker">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <BsCalendarEvent color="#7a7a7a" />
                      </span>
                      <ConfigProvider locale={viVN}>
                        <DatePicker
                          className="sales-product-date pl-8 placeholder:text-secondary-color-text-disabled cursor-pointer"
                          //   status={errDate ? 'error' : ''}
                          placeholder="Chọn ngày"
                          format="DD/MM/YYYY HH:mm"
                          showTime={{
                            defaultValue: dayjs('00:00', 'HH:mm'),
                            format: 'HH:mm',
                          }}
                          suffixIcon={null}
                          //   value={dayjs(startDate)}
                          //   onChange={(date) => {
                          //     if (date) {
                          //       const dateString = date.toDate().toString()
                          //       setStartDate(dateString)
                          //     }
                          //   }}
                        />
                      </ConfigProvider>
                    </div>
                  </div>

                  {/* {errDate && (
                    <label className="text-sm text-red-500">
                      {dataLang?.price_quote_errDate || 'price_quote_errDate'}
                    </label>
                  )} */}
                </div>

                {/* Địa Chỉ Giao Hàng */}
                <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                  <InfoFormLabel isRequired label={'Địa chỉ giao hàng'} />
                  <div className="w-full relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                      <PiMapPinLight color="#7a7a7a" />
                    </span>
                    <SelectWithSort
                      title="Địa chỉ giao hàng"
                      placeholderText="Chọn địa chỉ giao hàng"
                      options={[]}
                      //   value={selectedPersonalContact || contactPerson}
                      //   onChange={(value) => setSelectedPersonalContact(value)}
                    />
                  </div>
                </div>
                {/* Đơn Hàng Bán */}
                <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                  <InfoFormLabel isRequired label={'Đơn Hàng Bán'} />
                  <div className="w-full relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                      <PiMapPinLight color="#7a7a7a" />
                    </span>
                    <SelectWithSort
                      title="Đơn Hàng Bán"
                      placeholderText="Chọn đơn hàng bán"
                      options={[]}
                      //   value={selectedPersonalContact || contactPerson}
                      //   onChange={(value) => setSelectedPersonalContact(value)}
                    />
                  </div>
                </div>
                {/* Khách hàng */}
                <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                  <InfoFormLabel isRequired label={'Khách hàng' || dataLang?.selectedCustomer} />
                  <div className="w-full">
                    <div className="relative flex flex-row">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                        <LuBriefcase color="#7a7a7a" />
                      </span>
                      <SelectWithSort
                        title="Khách hàng"
                        placeholderText="Chọn khách hàng"
                        options={[]}
                        // value={selectedCustomer}
                        // onChange={(value) => setSelectedCustomer(value)}
                        // isError={errCustomer}
                      />
                    </div>
                    {/* {errCustomer && (
                      <label className="text-sm text-red-500">
                        {dataLang?.sales_product_err_customer || 'sales_product_err_customer'}
                      </label>
                    )} */}
                  </div>
                </div>
                {/* Xem thêm thông tin */}
                <AnimatePresence initial={false}>
                  {showMoreInfo && (
                    <motion.div
                      key="more-info"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <>
                        {/* Chi nhánh */}
                        <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                          <InfoFormLabel isRequired label={'Chi nhánh' || dataLang?.branch} />
                          <div className="w-full">
                            <div className="relative flex flex-row">
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                <PiMapPinLight color="#7a7a7a" />
                              </div>
                              <SelectWithSort
                                title="Chi nhánh"
                                placeholderText="Chọn chi nhánh"
                                options={[]}
                                // value={selectedBranch}
                                // onChange={(value) => setSelectedBranch(value)}
                                // isError={errBranch}
                              />
                            </div>
                            {/* {errBranch && (
                              <label className="text-sm text-red-500">
                                {dataLang?.sales_product_err_branch || 'sales_product_err_branch'}
                              </label>
                            )} */}
                          </div>
                        </div>

                        {/* Nhân viên */}
                        <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                          <InfoFormLabel isRequired label={'Nhân viên' || dataLang?.sales_product_staff_in_charge} />
                          <div className="w-full">
                            <div className="relative flex flex-row">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                <FiUser color="#7a7a7a" />
                              </span>
                              <SelectWithSort
                                title="Nhân viên"
                                placeholderText="Chọn nhân viên"
                                options={[]}
                                // value={selectedStaff}
                                // onChange={(value) => setSelectedStaff(value)}
                                // isError={errStaff}
                              />
                            </div>
                            {/* {errStaff && (
                              <label className="text-sm text-red-500">
                                {dataLang?.sales_product_err_staff_in_charge || 'sales_product_err_staff_in_charge'}
                              </label>
                            )} */}
                          </div>
                        </div>

                        {/* Người liên lạc */}
                        <div className="flex flex-col flex-wrap items-center mb-4 gap-y-3">
                          <InfoFormLabel label={'Người liên lạc' || dataLang?.contact_person} />
                          <div className="w-full relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                              <FiUser color="#7a7a7a" />
                            </span>
                            <SelectWithSort
                              title="Người liên lạc"
                              placeholderText="Chọn người liên lạc"
                              options={[]}
                              //   value={selectedPersonalContact || contactPerson}
                              //   onChange={(value) => setSelectedPersonalContact(value)}
                            />
                          </div>
                        </div>
                      </>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Xem thêm Button */}
                <div className="flex items-center justify-center p-1 pb-6 hover:underline">
                  <button
                    onClick={() => setShowMoreInfo(!showMoreInfo)}
                    className="text-gray-700 text-sm font-normal inline-flex items-center gap-x-1"
                  >
                    {showMoreInfo ? (
                      <span className="inline-flex items-center gap-x-1">
                        Ẩn bớt
                        <ArrowUp2 size={16} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-x-1">
                        Xem thêm
                        <ArrowDown2 size={16} />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )
          }}
          Note={() => (
            <div className="w-full mx-auto">
              <h4 className="responsive-text-base font-normal text-secondary-color-text mb-3 capitalize">
                {dataLang?.sales_product_note || 'sales_product_note'}
              </h4>
              <div className="w-full pb-6">
                <textarea
                  placeholder="Nhập ghi chú tại đây"
                  // value={note}
                  // onChange={handleOnChangeInput.bind(this, 'note')}
                  name="fname"
                  type="text"
                  className="focus:border-brand-color border-gray-200 placeholder-secondary-color-text-disabled placeholder:responsive-text-base w-full h-[68px] max-h-[68px] bg-[#ffffff] rounded-lg text-[#52575E] responsive-text-base font-normal px-3 py-2 border outline-none"
                />
              </div>
            </div>
          )}
        />
      </div>
      {/* Cột tổng cộng */}
      <div className="w-full mx-auto px-4 pt-6 pb-4 bg-white border border-gray-200 rounded-2xl">
        <h2 className="2xl:text-[20px] xl:text-lg font-medium text-brand-color mb-6 capitalize">
          {'Tổng cộng' || dataLang?.price_quote_total}
        </h2>
        {/* Tổng tiền */}
        <div className="flex justify-between items-center mb-4 responsive-text-base font-normal text-black-color">
          <h4 className="w-full">{dataLang?.price_quote_total || 'price_quote_total'}</h4>
          <span>{isTotalMoney.totalPrice ? formatMoneyConfig(+isTotalMoney.totalPrice, dataSeting) : '-'}</span>
        </div>
        {/* Tiền chiết khấu */}
        <div className="flex justify-between items-center mb-4 responsive-text-base font-normal text-secondary-color-text">
          <h4 className="w-full">{dataLang?.sales_product_discount || 'sales_product_discount'}</h4>
          <span>
            {isTotalMoney.totalDiscountPrice ? formatMoneyConfig(+isTotalMoney.totalDiscountPrice, dataSeting) : '-'}
          </span>
        </div>
        {/* Tiền sau chiết khấu */}
        <div className="flex justify-between items-center mb-4 responsive-text-base font-normal text-secondary-color-text">
          <h4 className="w-full">
            {dataLang?.sales_product_total_money_after_discount || 'sales_product_total_money_after_discount'}
          </h4>
          <span>
            {isTotalMoney.totalDiscountAfterPrice
              ? formatMoneyConfig(+isTotalMoney.totalDiscountAfterPrice, dataSeting)
              : '-'}
          </span>
        </div>
        {/* Tiền thuế */}
        <div className="flex justify-between items-center mb-4 responsive-text-base font-normal text-secondary-color-text">
          <h4 className="w-full">{dataLang?.sales_product_total_tax || 'sales_product_total_tax'}</h4>
          <span>{isTotalMoney.totalTax ? formatMoneyConfig(+isTotalMoney.totalTax, dataSeting) : '-'}</span>
        </div>
        {/* Thành tiền */}
        <div className="flex justify-between responsive-text-base items-center mb-4">
          <h4 className="w-full text-black font-semibold">
            {dataLang?.sales_product_total_into_money || 'sales_product_total_into_money'}
          </h4>
          <span className="text-blue-color font-semibold">
            {isTotalMoney.totalAmount ? formatMoneyConfig(+isTotalMoney.totalAmount, dataSeting) : '-'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SidebarRight
