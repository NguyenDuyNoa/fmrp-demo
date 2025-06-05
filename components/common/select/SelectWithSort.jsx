import React from 'react'
import { Select, Radio, Empty } from 'antd'

const { Option } = Select

const SelectWithSort = ({ title, placeholderText, options, value, onChange, onClear, disabled }) => {
  return (
    <Select
      className="select-with-sort min-w-[330px] max-w-full truncate placeholder:text-secondary-color-text-disabled"
      showSearch
      placeholder={placeholderText}
      allowClear
      value={value}
      onChange={onChange}
      onClear={onClear}
      disabled={disabled}
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
      notFoundContent={
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Không có dữ liệu"
        />
      }
      dropdownRender={(menu) => (
        <>
          <div className="px-3 text-lg font-semibold font-deca py-4">{title}</div>
          <div>{menu}</div>
        </>
      )}
      optionLabelProp="label"
    >
      {options.map((opt, index) => (
        <Option key={opt.value} value={opt.value} label={opt.label}>
          <div
            className={`flex items-center py-2 gap-x-2 ${
              index !== options.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <Radio checked={value === opt.value} />
            {opt.label}
          </div>
        </Option>
      ))}
    </Select>
  )
}

export default SelectWithSort
