import CalendarBlankIcon from '@/components/icons/common/CalendarBlankIcon'
import DropdownFilledIcon from '@/components/icons/common/DropdownFilledIcon'
import styleDatePickerReport from '@/configs/configDatePickerReport'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import Datepicker from 'react-tailwindcss-datepicker'

const DateToDateReport = ({ placeholder, value, onChange, colSpan, className }) => {
  const [dateValue, setDateValue] = useState(
    value || {
      startDate: undefined,
      endDate: undefined,
    }
  )
  
  // Thiết lập giá trị mặc định khi component được tạo
  useEffect(() => {
    // Nếu không có giá trị được truyền vào từ props, sử dụng giá trị mặc định
    if (!value) {
      const defaultValue = {
        startDate: undefined,
        endDate: undefined
      }
      setDateValue(defaultValue)
      if (onChange) {
        onChange(defaultValue)
      }
    }
  }, [])

  useEffect(() => {
    if (value) {
      setDateValue(value)
    }
  }, [value])

  const handleValueChange = (newValue) => {
    console.log('Date changed:', newValue)
    
    // Kiểm tra nếu chọn "Từ trước đến nay" thì reset về null
    if (newValue && newValue.startDate === undefined && newValue.endDate === undefined) {
      const resetValue = {
        startDate: undefined,
        endDate: undefined
      }
      setDateValue(resetValue)
      if (onChange) {
        onChange(resetValue)
      }
      return
    }
    
    setDateValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  // Xác định nếu có ngày được chọn
  const hasSelectedDates = dateValue?.startDate && dateValue?.endDate;

  return (
    <div
      id="parentDatepicker"
      className={`z-20 flex items-center cursor-pointer parentDatepicker rounded-lg bg-white border border-border-gray-1 relative ${hasSelectedDates ? 'w-auto' : 'w-[140px]'} ${className}`}
    >
      <CalendarBlankIcon size={17} color="#9295A4" className="absolute left-3 top-1/2 -translate-y-1/2 z-10" />
      <Datepicker
        {...styleDatePickerReport}
        value={dateValue}
        onChange={handleValueChange}
        placeholder={placeholder || 'Giai đoạn'}
        toggleClassName="hidden"
        containerClassName="px-[2px] w-full"
        displayFormat="DD/MM/YYYY"
      />
      <DropdownFilledIcon className="absolute right-3 top-1/2 -translate-y-1/2 z-10" />
    </div>
  )
}

export default DateToDateReport
