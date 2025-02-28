import Image from 'next/image'
import React from 'react'
import { useDispatch } from 'react-redux'

const ImagesItem = ({ data, classNameImage, classNameBoxImage }) => {
    const dispatch = useDispatch()
    return (
        <div className={`${classNameBoxImage}`}>
            <Image
                src={data?.images ? data?.images : "/nodata.png"}
                width={1280}
                height={1024}
                alt={data?.name}
                onClick={() => {
                    dispatch({
                        type: "statePopupPreviewImage",
                        payload: {
                            open: true,
                            data: {
                                ...data,
                                nameAlt: data?.name
                            }
                        }
                    })
                }}
                className={`object-cover rounded w-[40px] h-[40px] ${classNameImage}`}
            />
        </div>
    )
}

export default ImagesItem