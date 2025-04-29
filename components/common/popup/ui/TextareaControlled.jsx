'use client'

import { memo, useState } from 'react'

const TextareaControlled = memo(({ placeholder, onChange }) => {
    const [value, setValue] = useState('')

    const handleChange = (e) => {
        const val = e.target.value
        setValue(val)
        onChange?.(val) // callback nếu cần gửi dữ liệu ra ngoài
    }

    return (
        <textarea
            className="w-full resize-none outline-none text-sm placeholder:text-[#919EAB]"
            rows={3}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
        />
    )
})

TextareaControlled.displayName = 'TextareaControlled'
export default TextareaControlled
