import React, {useState} from 'react';
import Head from "next/head";

import {ArrowUp as IconArrowUp, ArrowDown as IconArrowDown, ArrowRight2 as IconArrowRight2} from "iconsax-react";

const Index = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Tổng quan</title>
      </Head>
      <div className='px-10 py-8 space-y-5'>
        <div className='flex space-x-5'>
          <h3 className="text-[#11315B] text-lg font-medium not-italic	leading-6">Lệnh sản xuất</h3>
        </div>
        <ListTask />
        <div className='grid grid-cols-2 gap-5'>
          <TienDoSX />
        </div>
      </div>
    </React.Fragment>
  );
}

const ListTask = React.memo(() => {
  const data = [
    {
      title: "Đang thực hiện",
      number: 20,
      bgColor: "#EBF5FF",
      bgSmall: "#1760B9",
      percent: -23
    },{
      title: "Chưa thực hiện",
      number: 20,
      bgColor: "#F3F4F6",
      bgSmall: "#9295A4",
      percent: -23
    },{
      title: "Hoàn thành",
      number: 20,
      bgColor: "#EBFEF2",
      bgSmall: "#0BAA2E",
      percent: 23
    },{
      title: "Tạm dừng",
      number: 20,
      bgColor: "#FEF8EC",
      bgSmall: "#FF8F0D",
      percent: -23
    },{
      title: "Đang thực hiện",
      number: 20,
      bgColor: "#FFEEF0",
      bgSmall: "#EE1E1E",
      percent: 23
    },
  ]
  return(
    <div className='grid grid-cols-5 gap-5'>
      {data.map((e, i) => 
        <div className={`w-full p-4 rounded space-y-1.5`} style={{backgroundColor : `${e.bgColor}`}} key={i}>
          <h4 className='text-[#3A3E4C] font-normal text-sm'>{e.title}</h4>
          <div className='flex justify-between items-end'>
            <h6 className='text-lg font-medium text-white w-12 h-12 flex flex-col justify-center items-center rounded' style={{backgroundColor : `${e.bgSmall}`}}>{e.number}</h6>
            {e.percent > 0 ? 
              <h6 className='font-[400] text-lg text-[#0BAA2E] flex space-x-0.5 items-center'>
                <span>{e.percent}%</span>
                <IconArrowUp size={20} />
              </h6>
              : 
              <h6 className='font-[400] text-lg text-[#EE1E1E] flex space-x-0.5 items-center'>
                <span>{e.percent}%</span>
                <IconArrowDown size={20} />
              </h6>
            }
          </div>
        </div>
      )}
    </div>
  )
})

const TienDoSX = React.memo(() => {
  const [tab, sTab] = useState(0);
  const _HandleTab = (e) => sTab(e);
  return(
    <div className='bg-slate-50/60 p-3 space-y-4'>
      <div className='flex justify-between items-center'>
        <h2>Tiến độ SX theo nhóm</h2>
        <button className='text-[#667085] bg-[#F3F4F6] px-4 py-2 rounded flex space-x-2 items-center hover:scale-105 transition'>
          <span>Xem chi tiết</span>
          <IconArrowRight2 size={18} />
        </button>
      </div>
      <div className='flex rounded-lg overflow-hidden border w-fit'>
        <button onClick={_HandleTab.bind(this, 0)} className={`${tab === 0 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black" } px-3 py-2 border`}>Tất cả</button>
        <button onClick={_HandleTab.bind(this, 1)} className={`${tab === 1 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black" } px-3 py-2 border`}>Đang thực hiện</button>
        <button onClick={_HandleTab.bind(this, 2)} className={`${tab === 2 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black" } px-3 py-2 border`}>Chưa thực hiện</button>
        <button onClick={_HandleTab.bind(this, 3)} className={`${tab === 3 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black" } px-3 py-2 border`}>Tạm dừng</button>
      </div>
      <div className='py-3 divide-y divide-slate-100'>
        <div>hii</div>
        <div>hii</div>
        <div>hii</div>
      </div>
    </div>
  )
})

export default Index;
