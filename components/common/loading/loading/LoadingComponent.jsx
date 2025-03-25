import Image from 'next/image'
import React, { forwardRef } from 'react'

const LoadingComponent = forwardRef(({ className, type = "default", ...props }, ref) => {
    return (
        <div ref={ref} className={`${className} flex justify-center items-center py-2`}>
            {
                type === "default" &&
                <span className={`border-[#003DA0] text-white inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`} />
            }

            {
                type === "logo" &&
                <>
                    <div className='flex items-center justify-start w-fit h-[36px] py-4 animate-pulse'>
                        <Image
                            width={800}
                            height={800}
                            alt="logo"
                            src={`/logo/logo.svg`}
                            className="w-fit h-[36px] object-contain"
                            priority
                        />
                    </div>
                </>
            }
        </div>
    )
})

export default LoadingComponent