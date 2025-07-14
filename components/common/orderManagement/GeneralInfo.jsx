import { ConfigProvider, DatePicker } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import dayjs from 'dayjs'
import { BsCalendarEvent } from 'react-icons/bs'
import InfoFormLabel from './InfoFormLabel'

//  Mã chứng từ
export const DocumentNumber = ({ dataLang, value, onChange }) => (
  <div className="flex flex-col flex-wrap items-center gap-y-3">
    <InfoFormLabel label={dataLang?.import_code_vouchers || 'import_code_vouchers'} />
    <div className="w-full relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500">#</span>
      <input
        value={value}
        onChange={onChange}
        name="fname"
        type="text"
        placeholder={dataLang?.purchase_order_system_default || 'purchase_order_system_default'}
        className={`xl1439:text-[15px] xl1439:leading-6 text-[13px] leading-[20px] text-gray-600 font-normal placeholder:text-sm z-10 pl-8 hover:border-[#0F4F9E] focus:border-[#0F4F9E] w-full border border-[#d0d5dd] p-2 rounded-lg outline-none cursor-text`}
      />
    </div>
  </div>
)

// Ngày chứng từ
export const DocumentDate = ({ dataLang, value, onChange, errDate }) => (
  <div className="flex flex-col flex-wrap items-center gap-y-3">
    <InfoFormLabel isRequired={true} label={dataLang?.import_day_vouchers || 'import_day_vouchers'} />

    <div className="relative w-full flex flex-row custom-date-picker date-form">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
        <BsCalendarEvent color="#7a7a7a" />
      </span>
      <ConfigProvider locale={viVN}>
        <DatePicker
          className="sales-product-date pl-9 placeholder:text-secondary-color-text-disabled cursor-pointer"
          status={errDate ? 'error' : ''}
          allowClear={false}
          placeholder="Chọn ngày"
          format="DD/MM/YYYY HH:mm"
          showTime={{
            defaultValue: dayjs('00:00', 'HH:mm'),
            format: 'HH:mm',
          }}
          suffixIcon={null}
          value={dayjs(value)}
          onChange={(date) => {
            if (date) {
              const dateString = date.toDate().toString()
              onChange(dateString)
            }
          }}
        />
      </ConfigProvider>
    </div>
  </div>
)
