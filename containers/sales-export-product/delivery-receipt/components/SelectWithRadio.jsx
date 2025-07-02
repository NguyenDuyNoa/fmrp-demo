import { Empty, Radio, Select } from 'antd'
import { PiPlus } from 'react-icons/pi'

const { Option } = Select

const SelectWithRadio = ({
  title,
  placeholderText,
  options,
  value,
  onChange,
  onClear,
  disabled,
  isError = false,
  isShowAddNew = false,
}) => {
  return (
    <Select
      className="truncate placeholder-secondary-color-text-disabled placeholder:responsive-text-sm cursor-pointer select-with-sort w-full"
      showSearch
      placeholder={placeholderText}
      allowClear
      value={value}
      onChange={onChange}
      onClear={onClear}
      disabled={disabled}
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
      notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />}
      popupRender={(menu) => (
        <>
          <div className="flex items-center justify-between gap-2">
            <div className="px-3 responsive-text-lg font-semibold font-deca py-4">{title}</div>
            {isShowAddNew && (
              <div className="text-[#0375F3] hover:text-[#1760B9] font-normal text-[13px] mr-3 flex gap-1 items-center cursor-pointer">
                <PiPlus className="text-base" />
                Thêm mới
              </div>
            )}
          </div>
          <div>{menu}</div>
        </>
      )}
      optionLabelProp="label"
      status={isError ? 'error' : ''}
    >
      {options?.map((opt, index) => {
        return (
          <Option key={opt.value} value={opt.value} label={opt.label}>
            <div
              className={`flex items-center py-2 gap-x-2 responsive-text-base ${
                index !== options.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <Radio checked={value?.value === opt.value} />
              {opt.label}
            </div>
          </Option>
        )
      })}
    </Select>
  )
}

export default SelectWithRadio
