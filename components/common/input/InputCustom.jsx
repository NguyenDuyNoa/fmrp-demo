import useToast from '@/hooks/useToast'
import { useCallback, useEffect, useState, useRef } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { twMerge } from 'tailwind-merge'
import { debounce } from 'lodash'

const InputCustom = ({
  state = 0,
  setState,
  className,
  classNameButton,
  classNameInput,
  min = 0,
  max = Infinity,
  disabled = false,
  isError = false,
  step = 1,
  allowDecimal = false,
  debounceTime = 500,
  onChangeComplete = null,
}) => {
  const [inputValue, setInputValue] = useState(state || 0)
  const [formattedValue, setFormattedValue] = useState(state?.toString() || '0')
  const showToast = useToast()
  const isUserTyping = useRef(false)
  const lastCommittedValue = useRef(state)
  const [tempValue, setTempValue] = useState(state?.toString() || '0')

  // Tạo hàm debounce để gọi setState
  const debouncedSetState = useRef(
    debounce((value) => {
      if (lastCommittedValue.current !== value) {
        setState(value)
        lastCommittedValue.current = value
        // Gọi callback sau khi setState nếu có
        if (onChangeComplete) {
          onChangeComplete(value)
        }
      }
      isUserTyping.current = false
    }, debounceTime)
  ).current

  useEffect(() => {
    // Cập nhật giá trị khi state thay đổi từ bên ngoài
    // Nhưng chỉ khi người dùng không đang nhập liệu
    if (!isUserTyping.current && state !== inputValue) {
      setInputValue(state || 0)
      setFormattedValue(state?.toString() || '0')
      lastCommittedValue.current = state
    }
  }, [state])

  // Hủy debounce khi component unmount
  useEffect(() => {
    return () => {
      debouncedSetState.cancel()
    }
  }, [debouncedSetState])

  const parseToNumber = useCallback(
    (value) => {
      if (value === '' || value === '-' || value === null) return 0
      const cleaned = value.toString().replace(/[^\d.,]/g, '').replace(',', '.')
      const parsed = parseFloat(cleaned)
      return isNaN(parsed) ? 0 : allowDecimal ? parsed : Math.floor(parsed)
    },
    [allowDecimal]
  )

  const handleChange = useCallback(
    (type) => {
      if (disabled) return
      const current = parseToNumber(inputValue)
      let result = current
      if (type === 'increment' && current < max) result = current + step
      if (type === 'decrement') {
        const newValue = current - step
        if (newValue < min) {
          showToast('error', 'Giá trị không thể nhỏ hơn ' + min)
          result = current
        } else {
          result = newValue
        }
      }
      
      setInputValue(result)
      setFormattedValue(result.toString())
      
      // Gọi setState ngay lập tức cho các thao tác button, không cần debounce
      setState(result)
      lastCommittedValue.current = result
      // Gọi callback sau khi setState nếu có
      if (onChangeComplete) {
        onChangeComplete(result)
      }
    },
    [disabled, inputValue, max, min, setState, step, showToast, parseToNumber, onChangeComplete]
  )

  const handleInputChange = useCallback(
    (e) => {
      if (disabled) return
      const value = e.target?.value;
      isUserTyping.current = true;
      
      // Cho phép nhập số thập phân nếu allowDecimal=true
      const regex = allowDecimal ? /^-?\d*\.?\d*$/ : /^-?\d*$/;
      
      // Kiểm tra nếu giá trị nhập vào là số hợp lệ hoặc rỗng
      if (regex.test(value) || value === '') {
        let numValue = value === '' ? 0 : allowDecimal ? parseFloat(value) : parseInt(value || '0', 10);

        // Lưu trữ giá trị input tạm thời
        setTempValue(value);
        setFormattedValue(value);
        
        // Kiểm tra min/max và cập nhật state sau khoảng thời gian debounce
        if (value === '' || !isNaN(numValue)) {
          debouncedSetState(numValue);
        }
      }
    },
    [disabled, allowDecimal, debouncedSetState]
  )

  const handleBlur = useCallback(() => {
    // Hủy bỏ debounce đang chờ để tránh gọi API thêm lần nữa
    debouncedSetState.cancel()
    
    let finalValue = tempValue === '' ? 0 : allowDecimal ? parseFloat(tempValue) : parseInt(tempValue || '0', 10);
    
    // Đảm bảo giá trị nằm trong khoảng min-max
    if (min !== undefined && finalValue < min) finalValue = min;
    if (max !== undefined && finalValue > max) finalValue = max;
    
    // Cập nhật giá trị hiển thị
    setTempValue(finalValue.toString());
    setFormattedValue(finalValue.toString());
    
    // Chỉ cập nhật state nếu giá trị thay đổi
    if (finalValue !== state) {
      if (setState) setState(finalValue);
      // Gọi callback sau khi setState nếu có
      if (onChangeComplete) {
        onChangeComplete(finalValue)
      }
    }
    
    isUserTyping.current = false
  }, [state, min, max, setState, allowDecimal, onChangeComplete, tempValue]
  )

  const handleButtonClick = useCallback(
    (operation) => {
      if (disabled) return

      let newValue = state
      
      if (operation === 'increment') {
        newValue = parseFloat((Number(state) + Number(step)).toFixed(10))
        if (max !== undefined && newValue > max) newValue = max
      } else {
        newValue = parseFloat((Number(state) - Number(step)).toFixed(10))
        if (min !== undefined && newValue < min) newValue = min
      }

      // Nếu không cho phép số thập phân, làm tròn xuống
      if (!allowDecimal) {
        newValue = Math.floor(newValue)
      }
      
      // Cập nhật state và giá trị hiển thị
      setState(newValue)
      setTempValue(newValue.toString())
      setFormattedValue(newValue.toString())
      lastCommittedValue.current = newValue
      
      // Gọi callback sau khi setState nếu có
      if (onChangeComplete) {
        onChangeComplete(newValue)
      }
    },
    [state, step, min, max, disabled, allowDecimal, setState, onChangeComplete]
  )

  return (
    <div
      className={twMerge(
        'p-2 flex items-center border rounded-full shadow-sm border-[#D0D5DD] w-fit h-fit overflow-hidden',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div
        onClick={(e) => handleButtonClick('decrement')}
        onMouseDown={(e) => e.preventDefault()}
        className={twMerge(
          'size-9 rounded-full flex-shrink-0 cursor-pointer bg-primary-05 hover:bg-typo-blue-4/50 flex justify-center items-center flex-row',
          classNameButton
        )}
      >
        <FaMinus className="text-[#25387A] hover:text-green-1" size={11} />
      </div>
      <input
        disabled={disabled}
        type="text"
        value={formattedValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onMouseDown={(e) => e.stopPropagation()}
        className={twMerge(
          'w-20 text-center outline-none text-lg font-normal text-secondary-09 bg-transparent',
          isError && inputValue > 0 ? 'text-red-500' : '',
          classNameInput
        )}
      />
      <div
        onClick={(e) => handleButtonClick('increment')}
        onMouseDown={(e) => e.preventDefault()}
        className={twMerge(
          'size-9 rounded-full flex-shrink-0 cursor-pointer bg-primary-05 hover:bg-typo-blue-4/50 flex justify-center items-center flex-row',
          classNameButton
        )}
      >
        <FaPlus className="text-[#25387A] hover:text-green-1" size={10} />
      </div>
    </div>
  )
}

export default InputCustom
