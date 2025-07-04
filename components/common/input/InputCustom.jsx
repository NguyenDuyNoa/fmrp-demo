import useToast from '@/hooks/useToast'
import { useCallback, useEffect, useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { twMerge } from 'tailwind-merge'

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
}) => {
  const [inputValue, setInputValue] = useState(state || 0)
  const [formattedValue, setFormattedValue] = useState(state?.toString() || '0')
  const showToast = useToast()

  useEffect(() => {
    setInputValue(state || 0)
    setFormattedValue(state?.toString() || '0')
  }, [state])

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
      setState(result)
    },
    [disabled, inputValue, max, min, setState, step, showToast]
  )

  const handleInputChange = useCallback(
    (e) => {
      if (disabled) return
      const value = e.target.value

      // Kiểm tra định dạng dựa vào allowDecimal
      const pattern = allowDecimal ? /^-?\d*[.,]?\d*$/ : /^-?\d*$/
      if (!pattern.test(value)) return

      const numericValue = value.replace(',', '.')
      setInputValue(numericValue)
      setFormattedValue(numericValue)

      const parsedValue = parseToNumber(numericValue)
      setState(parsedValue)
    },
    [disabled, setState, allowDecimal, parseToNumber]
  )

  const handleBlur = useCallback(() => {
    const number = parseToNumber(inputValue)
    let finalValue = number

    if (number < min) finalValue = min
    if (number > max) finalValue = max

    // Nếu không cho phép số thập phân, làm tròn xuống
    if (!allowDecimal) {
      finalValue = Math.floor(finalValue)
    }

    setInputValue(finalValue)
    setFormattedValue(finalValue.toString())
    setState(finalValue)
  }, [inputValue, min, max, setState, allowDecimal, parseToNumber])

  const handleButtonClick = useCallback(
    (e, type) => {
      e.preventDefault()
      e.stopPropagation()

      if (window.getSelection) {
        window.getSelection().removeAllRanges()
      } else if (document.selection) {
        document.selection.empty()
      }

      handleChange(type)
    },
    [handleChange]
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
        onClick={(e) => handleButtonClick(e, 'decrement')}
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
        onClick={(e) => handleButtonClick(e, 'increment')}
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
