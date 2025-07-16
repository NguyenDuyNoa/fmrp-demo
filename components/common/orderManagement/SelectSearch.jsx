import { Customscrollbar } from '@/components/UI/common/Customscrollbar'
import { Empty } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import CheckboxDefault from '../checkbox/CheckboxDefault'

const SelectSearch = ({ options, onChange, value, MenuList, formatOptionLabel, placeholder, setSearch }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  const handleSeachApiProductItems = (value) => {
    setSearchText(value)
    setSearch && setSearch(value)
  }

  const handleOpenDropdown = () => {
    setIsOpen(true)
    setIsFocused(true)
    setTimeout(() => {
      inputRef.current && inputRef.current.focus()
    }, 0)
  }

  // Xử lý đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (option) => {
    if (!value) {
      onChange([option])
    } else {
      const isSelected = value.some((item) => item.value === option.value)
      if (isSelected) {
        onChange(value.filter((item) => item.value !== option.value))
      } else {
        onChange([...value, option])
      }
    }
  }

  const handleSelectAll = () => {
    if (MenuList && MenuList.props && MenuList.props.handleSelectAll) {
      MenuList.props.handleSelectAll()
    } else {
      onChange(options)
    }
  }

  const handleDeleteAll = () => {
    if (MenuList && MenuList.props && MenuList.props.handleDeleteAll) {
      MenuList.props.handleDeleteAll()
    } else {
      onChange([])
    }
  }

  // Lọc options theo từ khóa tìm kiếm
  const filteredOptions = searchText
    ? options.filter((option) => option.label.toLowerCase().includes(searchText.toLowerCase()))
    : options

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`flex flex-wrap items-center gap-1 min-h-[40px] px-3 py-1 bg-white cursor-pointer rounded-lg transition-all duration-300 ${
          isFocused ? 'border-2 border-[#003DA0]' : 'border border-[#d9d9d9]'
        }`}
        onClick={handleOpenDropdown}
      >
        <input
          ref={inputRef}
          type="text"
          className="flex-grow outline-none min-w-[50px] text-sm placeholder:text-slate-300"
          placeholder={placeholder}
          value={searchText}
          onChange={(e) => handleSeachApiProductItems(e.target.value)}
          onClick={(e) => {
            e.stopPropagation()
            handleOpenDropdown()
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => !isOpen && setIsFocused(false)}
        />

        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1760B9] p-1 rounded-lg cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            handleOpenDropdown()
          }}
        >
          <CiSearch className="text-white responsive-text-lg" />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <Customscrollbar className="absolute left-0 right-0 top-full mt-1 max-h-[400px] bg-white border rounded-lg shadow-[0_20px_40px_-4px_#919EAB3D,0_0_2_0_#919EAB3D] z-50">
          <div className="2xl:p-6 p-5 pl-4 flex items-center justify-between gap-4">
            <CheckboxDefault
              label={'Chọn mặt hàng'}
              checked={value && options.length > 0 && value.length === options.length}
              onChange={() => {
                if (value && value.length === options.length) {
                  handleDeleteAll()
                } else {
                  handleSelectAll()
                }
              }}
            />
            <p className="responsive-text-sm font-normal text-blue-color">{value ? value.length : 0} đã chọn</p>
          </div>

          <div className="p-1 flex flex-col gap-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <React.Fragment key={option.value}>
                  {index > 0 && <hr className="border-[#F3F3F4]" />}
                  <div
                    className="flex items-center px-3 2xl:px-5 py-2 hover:bg-[#0000000A] rounded-lg cursor-pointer"
                    onClick={() => handleSelect(option)}
                  >
                    <div className="mr-2">
                      <CheckboxDefault
                        checked={value && value.some((item) => item.value === option.value)}
                        onChange={() => handleSelect(option)}
                      />
                    </div>
                    <div className="flex-grow">
                      {formatOptionLabel ? formatOptionLabel(option) : <div className="text-sm">{option.label}</div>}
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />
            )}
          </div>
        </Customscrollbar>
      )}
    </div>
  )
}

export default SelectSearch
