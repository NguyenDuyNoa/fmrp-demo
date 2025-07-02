import formatNumber from '@/utils/helpers/formatnumber'
import React, { useCallback, useEffect, useState } from 'react'
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
}) => {
  const [inputValue, setInputValue] = useState(state || 0)
  const [formattedValue, setFormattedValue] = useState(formatNumber(state || 0))

  useEffect(() => {
    setInputValue(state || 0)
    setFormattedValue(formatNumber(state || 0))
  }, [state])

  const parseToNumber = useCallback(
    (value) => {
      const cleaned = value.toString().replace(/\D/g, '')
      const parsed = parseInt(cleaned)
      return isNaN(parsed) ? min : parsed
    },
    [min]
  )

  const handleChange = useCallback(
    (type) => {
      if (disabled) return
      const current = parseToNumber(state)
      let result = current
      if (type === 'increment' && current < max) result = current + 1
      if (type === 'decrement' && current > min) result = current - 1
      setState(result)
    },
    [disabled, state, parseToNumber, max, min, setState]
  )

  const handleInputChange = useCallback(
    (e) => {
      if (disabled) return
      const value = e.target.value

      if (value === '') {
        setInputValue('')
        setFormattedValue('')
        return
      }

      const numericValue = value.replace(/\D/g, '')

      if (numericValue === '') {
        setInputValue('')
        setFormattedValue('')
        return
      }

      const numValue = parseInt(numericValue)
      setInputValue(numValue)
      setFormattedValue(formatNumber(numValue))
    },
    [disabled]
  )

  const handleBlur = useCallback(() => {
    if (inputValue === '') {
      setState(min)
      setInputValue(min)
      setFormattedValue(formatNumber(min))
      return
    }

    const number = parseToNumber(inputValue)

    if (number < min) {
      setState(min)
      setInputValue(min)
      setFormattedValue(formatNumber(min))
    } else if (number > max) {
      setState(max)
      setInputValue(max)
      setFormattedValue(formatNumber(max))
    } else {
      setState(number)
      setInputValue(number)
      setFormattedValue(formatNumber(number))
    }
  }, [inputValue, min, max, parseToNumber, setState])

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
          'size-9 rounded-full cursor-pointer bg-primary-05 flex justify-center items-center flex-row',
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
          'size-9 rounded-full cursor-pointer bg-primary-05 flex justify-center items-center flex-row',
          classNameButton
        )}
      >
        <FaPlus className="text-[#25387A] hover:text-green-1" size={10} />
      </div>
    </div>
  )
}

export default InputCustom

// export const InputCustom = memo(
//   ({
//     state = 0,
//     setState,
//     className,
//     classNameButton,
//     classNameInput,
//     min = 0,
//     max = Infinity,
//     disabled = false,
//     isError = false,
//   }) => {
//     const [inputValue, setInputValue] = useState(state || 0)
//     const [formattedValue, setFormattedValue] = useState(formatNumber(state || 0))

//     useEffect(() => {
//       setInputValue(state || 0)
//       setFormattedValue(formatNumber(state || 0))
//     }, [state])

//     const parseToNumber = useCallback(
//       (value) => {
//         const cleaned = value.toString().replace(/\D/g, '')
//         const parsed = parseInt(cleaned)
//         return isNaN(parsed) ? min : parsed
//       },
//       [min]
//     )

//     const handleChange = useCallback(
//       (type) => {
//         if (disabled) return
//         const current = parseToNumber(state)
//         let result = current
//         if (type === 'increment' && current < max) result = current + 1
//         if (type === 'decrement' && current > min) result = current - 1
//         setState(result)
//       },
//       [disabled, state, parseToNumber, max, min, setState]
//     )

//     const handleInputChange = useCallback(
//       (e) => {
//         if (disabled) return
//         const value = e.target.value

//         if (value === '') {
//           setInputValue('')
//           setFormattedValue('')
//           return
//         }

//         const numericValue = value.replace(/\D/g, '')

//         if (numericValue === '') {
//           setInputValue('')
//           setFormattedValue('')
//           return
//         }

//         const numValue = parseInt(numericValue)
//         setInputValue(numValue)
//         setFormattedValue(formatNumber(numValue))
//       },
//       [disabled]
//     )

//     const handleBlur = useCallback(() => {
//       if (inputValue === '') {
//         setState(min)
//         setInputValue(min)
//         setFormattedValue(formatNumber(min))
//         return
//       }

//       const number = parseToNumber(inputValue)

//       if (number < min) {
//         setState(min)
//         setInputValue(min)
//         setFormattedValue(formatNumber(min))
//       } else if (number > max) {
//         setState(max)
//         setInputValue(max)
//         setFormattedValue(formatNumber(max))
//       } else {
//         setState(number)
//         setInputValue(number)
//         setFormattedValue(formatNumber(number))
//       }
//     }, [inputValue, min, max, parseToNumber, setState])

//     const handleButtonClick = useCallback(
//       (e, type) => {
//         e.preventDefault()
//         e.stopPropagation()

//         if (window.getSelection) {
//           window.getSelection().removeAllRanges()
//         } else if (document.selection) {
//           document.selection.empty()
//         }

//         handleChange(type)
//       },
//       [handleChange]
//     )

//     return (
//       <div
//         className={twMerge(
//           'p-2 flex items-center border rounded-full shadow-sm border-[#D0D5DD] w-fit h-fit overflow-hidden',
//           disabled ? 'opacity-50 cursor-not-allowed' : '',
//           className
//         )}
//         onMouseDown={(e) => e.preventDefault()}
//       >
//         <div
//           onClick={(e) => handleButtonClick(e, 'decrement')}
//           onMouseDown={(e) => e.preventDefault()}
//           className={twMerge(
//             'size-9 rounded-full cursor-pointer bg-primary-05 flex justify-center items-center flex-row',
//             classNameButton
//           )}
//         >
//           <FaMinus className="text-[#25387A] hover:text-green-1" size={11} />
//         </div>
//         <input
//           disabled={disabled}
//           type="text"
//           value={formattedValue}
//           onChange={handleInputChange}
//           onBlur={handleBlur}
//           onMouseDown={(e) => e.stopPropagation()}
//           className={twMerge(
//             'w-20 text-center outline-none text-lg font-normal text-secondary-09 bg-transparent',
//             isError && inputValue > 0 ? 'text-red-500' : '',
//             classNameInput
//           )}
//         />
//         <div
//           onClick={(e) => handleButtonClick(e, 'increment')}
//           onMouseDown={(e) => e.preventDefault()}
//           className={twMerge(
//             'size-9 rounded-full cursor-pointer bg-primary-05 flex justify-center items-center flex-row',
//             classNameButton
//           )}
//         >
//           <FaPlus className="text-[#25387A] hover:text-green-1" size={10} />
//         </div>
//       </div>
//     )
//   }
// )
