import React from 'react'
import { Select, Empty } from 'antd'
//import { debounce } from 'lodash'
import { CiSearch } from 'react-icons/ci'

const { Option } = Select

const SelectWithSort = ({ placeholderText, options, formatNumber, onChange }) => {

  return (
    <div className="relative w-full">
      <Select
        className="select-by-search w-full h-14 truncate placeholder:text-secondary-color-text-disabled px-3 py-2"
        showSearch
        placeholder={placeholderText}
        allowClear
        value={null} // giữ ô Select luôn trống
        onChange={(value, option) => {
          onChange && onChange(value, option)
        }}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />}
        optionLabelProp="label"
        suffixIcon={null}
      >
        {options.map((opt) => {
          const e = opt.e
          return (
            <Option key={opt.value} value={opt.value} label={e.name}>
              <div className="flex p-2 hover:bg-gray-100 rounded-md cursor-pointer items-center justify-between font-deca">
                <div className="flex gap-3 items-start w-[calc(100%-80px)]">
                  <img
                    src={e.images ?? '/icon/noimagelogo.png'}
                    alt={e.name}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                  <div className="flex flex-col text-xs overflow-hidden w-full">
                    <div className="font-semibold text-sm truncate text-black">{e.name}</div>
                    {(e.product_variation || e.product_variation_1) && (
                      <div className="text-blue-600 truncate">
                        {e.product_variation && `Màu sắc: ${e.product_variation} `}
                        {e.product_variation_1 && `- Size: ${e.product_variation_1}`}
                      </div>
                    )}
                    <div className="text-gray-500">
                      DVT: {e.unit_name} - Tồn: {formatNumber(e.qty_warehouse)}
                    </div>
                  </div>
                </div>
                <div className="text-red-500 text-sm min-w-[80px] text-right whitespace-nowrap">
                  {formatNumber(e.price_sell)}
                </div>
              </div>
            </Option>
          )
        })}
      </Select>

      {/* Icon search */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#1760B9] p-1.5 rounded-lg pointer-events-none">
        <CiSearch className="text-white text-lg" size={16} />
      </div>
    </div>
  )
}

export default SelectWithSort
