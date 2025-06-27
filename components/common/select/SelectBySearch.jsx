import useToast from '@/hooks/useToast'
import { Empty, Select } from 'antd'
import { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'

const { Option } = Select

const SelectBySearch = ({
  placeholderText,
  allItems,
  formatNumber,
  selectedOptions = [],
  idProductSale,
  onChange,
  handleIncrease,
  options,
}) => {
  // Khởi tạo selectedItems bằng selectedOptions từ props
  const [_, setSelectedItems] = useState(selectedOptions)

  const [open, setOpen] = useState(false)

  const isShow = useToast()

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
        const updatedItem = options.find((o) => o.item.value === newOption.value)
        if (updatedItem) {
          handleIncrease(updatedItem.id) // Gọi hàm tăng số lượng nếu có
        }
        isShow('success', 'Cập nhật số lượng thành công')
        return prevItems
      }

      // Nếu chưa tồn tại thì thêm vào
      const updatedItems = [newOption, ...prevItems]
      onChange?.(updatedItems) // Gọi callback với mảng mới
      return updatedItems
    })
  }

  const itemsMap = allItems.map((e) => {
    return {
      label: `${e.name} <span style={{display: none}}>${e.code}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
      value: e.id,
      e,
    }
  })

  return (
    <div className="relative w-full">
      <Select
        open={open}
        onClick={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="select-by-search w-full 3xl:h-14 h-12 truncate placeholder-secondary-color-text-disabled placeholder:responsive-text-sm px-0 py-2"
        showSearch
        placeholder={placeholderText}
        allowClear
        value={null}
        onChange={handleChange}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />}
        optionLabelProp="label"
        suffixIcon={null}
        listHeight={420}
      >
        {itemsMap.map((opt) => {
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
                  <div className="flex flex-col 3xl:text-[10px] text-[9px] overflow-hidden w-full">
                    <div className="font-semibold responsive-text-sm truncate text-black">{e.name}</div>
                    {(e.product_variation || e.product_variation_1) && (
                      <div className="text-blue-600 truncate">
                        {e.product_variation && `Màu sắc: ${e.product_variation} `}
                        {e.product_variation_1 && `- Size: ${e.product_variation_1}`}
                      </div>
                    )}
                    <div className="text-gray-500">
                      ĐVT: {e.unit_name} - Tồn: {formatNumber(e.qty_warehouse)}
                    </div>
                  </div>
                </div>
                <div className="text-red-500 responsive-text-sm min-w-[80px] text-right whitespace-nowrap">
                  {formatNumber(e.price_sell || e.price)} đ
                </div>
              </div>
            </Option>
          )
        })}
      </Select>

      <div className="absolute 3xl:right-3 right-2 top-1/2 -translate-y-1/2 bg-[#1760B9] p-1.5 rounded-lg pointer-events-none">
        <CiSearch className="text-white responsive-text-lg" />
      </div>
    </div>
  )
}

export default SelectBySearch
