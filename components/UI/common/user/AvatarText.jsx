import { getColorByParam } from '@/utils/helpers/radomcolor'
import React from 'react'

const AvatarText = ({ fullName, className }) => {
    const randomColors = getColorByParam(fullName)
    return (
        <div className="text-[#0F4F9E] ">
            <div
                style={{ backgroundImage: `linear-gradient(to left, ${randomColors[1]}, ${randomColors[0]})` }}
                className={`${className} text-lg uppercase  rounded-full min-w-8 max-w-8 min-h-8 max-h-8 h-8 w-8 text-[#FFFFFF] flex items-center justify-center`}
            >
                {fullName[0]}
            </div>
        </div>
    )
}

export default AvatarText