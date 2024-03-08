import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup';
import Image from 'next/image'

const PopupAppTrial = () => {
    const [openModal, setOpenModal] = useState(true)

    console.log('openModal', openModal);

    return (
        <Popup
            // trigger={<button className="button"> Open Modal </button>}
            modal
            open={openModal}
            closeOnEscape
            // onClose={() => setOpenModal(false)}
            // defaultOpen={true}
            closeOnDocumentClick={false}
            lockScroll
            className='bg-red-500 w-full h-full'
        >
            <div className='w-[1000px] max-w-[1100px] h-[600px] grid grid-cols-2 bg-white rounded-xl'>
                <div className="col-span-1 w-full h-[600px] bg-[url('/popup/background.png')] bg-cover rounded-tl-xl rounded-bl-xl" />
                {/* <Image
                        src="/popup/background.png"
                        alt="background"
                        width="1000"
                        height="800"
                        className='w-full h-full object-cover rounded-tl-xl rounded-bl-xl'
                    /> */}
                {/* </div> */}
                <div className='col-span-1 w-full h-full bg-orange-500 rounded-tr-xl rounded-br-xl'>

                </div>
            </div>
        </Popup >
    )
}

export default PopupAppTrial