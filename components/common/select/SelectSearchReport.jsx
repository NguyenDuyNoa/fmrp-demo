import InfoFormLabel from '@/components/common/orderManagement/InfoFormLabel'
import DropdownFilledIcon from '@/components/icons/common/DropdownFilledIcon'
import { Empty, Select } from 'antd'
import { useRef, useState } from 'react'

const { Option } = Select

const CustomRadio = ({ checked }) => {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`w-4 h-4 rounded-full border ${
          checked ? 'border-blue-color' : 'border-border-gray-1'
        } flex items-center justify-center`}
      >
        {checked && <div className="w-2 h-2 rounded-full bg-blue-color" />}
      </div>
    </div>
  )
}

const SelectSearchReport = ({
  isRequired = false,
  label,
  placeholder,
  options = [],
  value,
  onChange,
  onSearch,
  onClear,
  disabled,
  isError = false,
  errMess,
  icon,
  className,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  
  // Xử lý khi thay đổi giá trị tìm kiếm
  const handleSearch = (value) => {
    setSearchValue(value);
    onSearch && onSearch(value);
  };

  // Xử lý khi chọn giá trị
  const handleChange = (selectedValue) => {
    onChange && onChange(selectedValue);
    setOpen(false);
  };

  // Xử lý khi xóa giá trị
  const handleClear = () => {
    setSearchValue('');
    onClear && onClear();
  };

  return (
    <div className={`group flex flex-col flex-wrap items-start gap-y-2 ${className}`}>
      {label && <InfoFormLabel isRequired={isRequired} label={label} />}

      <div className="w-full flex">
        <div className="relative flex select-with-radio">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-[#7a7a7a]">{icon}</span>
          <Select
            className="placeholder-secondary-color-text-disabled !responsive-text-base placeholder:!responsive-text-base cursor-pointer select-with-radio w-full custom-select-no-bg"
            placeholder={placeholder}
            allowClear
            value={value}
            open={open}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            onChange={handleChange}
            onClear={handleClear}
            disabled={disabled}
            showSearch
            onSearch={handleSearch}
            filterOption={(input, option) => 
              (option?.label?.toLowerCase() ?? '').includes(input.toLowerCase())
            }
            notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />}
            popupRender={(menu) => (
              <>
                <div className="custom-select-dropdown">
                  <div className="p-2 sticky top-0 bg-white z-10 border-b">
                    <input
                      ref={inputRef}
                      type="text"
                      className="w-full p-2 border rounded-md outline-none text-sm"
                      placeholder="Tìm kiếm..."
                      value={searchValue}
                      onChange={(e) => handleSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {menu}
                </div>
              </>
            )}
            optionLabelProp="label"
            status={isError ? 'error' : ''}
            suffixIcon={
              <DropdownFilledIcon className="size-3 group-hover:text-[#003DA0] group-hover:rotate-180 transition-all duration-300" />
            }
          >
            {options?.map((opt, index) => {
              return (
                <Option key={opt.value} value={opt.value} label={opt.label}>
                  <div className={`${index > 0 && 'border-t border-[#F7F8F9]'}`}>
                    <div className="flex items-center rounded-md p-3 my-0.5 gap-x-2 responsive-text-sm font-normal text-neutral-07 hover:bg-[#F7F8F9]">
                      <CustomRadio checked={value?.value === opt.value} />
                      {opt.label}
                    </div>
                  </div>
                </Option>
              )
            })}
          </Select>
        </div>
      </div>
      {isError && errMess && <label className="text-sm text-red-500">{errMess}</label>}
    </div>
  )
}

export default SelectSearchReport 