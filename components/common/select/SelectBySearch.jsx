import React, { useState, useEffect } from 'react'
import { Select, Empty } from 'antd'
import { CiSearch } from 'react-icons/ci'

const { Option } = Select

const SelectBySearch = ({ placeholderText, options, formatNumber, selectedOptions = [], idProductSale, onChange }) => {
  // Khởi tạo selectedItems bằng selectedOptions từ props
  const [_, setSelectedItems] = useState(selectedOptions)

  // Theo dõi thay đổi từ component cha và cập nhật state
  useEffect(() => {
    setSelectedItems(selectedOptions)
  }, [selectedOptions])

  // Theo dõi idProductSale khi xoá khỏi mảng ở component cha (cần id này để xoá đồng bộ ra khỏi mảng ở đây)
  useEffect(() => {
    if (!idProductSale) return

    setSelectedItems((prevItems) => {
      const filteredItems = prevItems.filter((item) => item.value !== idProductSale)
      return filteredItems
    })
  }, [idProductSale])

  // Hàm xử lý chọn option vào lưu vào mảng sau đó callback về cho component cha
  const handleChange = (_, option) => {
    if (!option?.option) return

    const newOption = option.option

    // Kiểm tra và xử lý dựa trên state hiện tại
    setSelectedItems((prevItems) => {
      // Nếu đã tồn tại thì giữ nguyên
      if (prevItems.find((o) => o.value === newOption.value)) {
        return prevItems
      }

      // Nếu chưa tồn tại thì thêm vào
      const updatedItems = [...prevItems, newOption]
      onChange?.(updatedItems) // Gọi callback với mảng mới
      return updatedItems
    })
  }

  return (
    <div className="relative w-full">
      <Select
        className="select-by-search w-full h-14 truncate placeholder:text-secondary-color-text-disabled px-0 py-2"
        showSearch
        placeholder={placeholderText}
        allowClear
        value={null}
        onChange={handleChange}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />}
        optionLabelProp="label"
        suffixIcon={null}
      >
        {options.map((opt) => {
          const e = opt.e
          return (
            <Option key={opt.value} value={opt.value} label={e.name} option={opt}>
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

      <div className="absolute 3xl:right-3 right-2 top-1/2 -translate-y-1/2 bg-[#1760B9] p-1.5 rounded-lg pointer-events-none">
        <CiSearch className="text-white text-lg" size={16} />
      </div>
    </div>
  )
}

export default SelectBySearch
