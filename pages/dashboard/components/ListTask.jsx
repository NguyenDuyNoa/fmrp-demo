import React from 'react'
import { ArrowUp, ArrowDown } from "iconsax-react";


const ListTask = React.memo(() => {
    const data = [
        {
            title: "Đang thực hiện",
            number: 20,
            bgColor: "#EBF5FF",
            bgSmall: "#1760B9",
            percent: -23,
        },
        {
            title: "Chưa thực hiện",
            number: 20,
            bgColor: "#F3F4F6",
            bgSmall: "#9295A4",
            percent: -23,
        },
        {
            title: "Hoàn thành",
            number: 20,
            bgColor: "#EBFEF2",
            bgSmall: "#0BAA2E",
            percent: 23,
        },
        {
            title: "Tạm dừng",
            number: 20,
            bgColor: "#FEF8EC",
            bgSmall: "#FF8F0D",
            percent: -23,
        },
        {
            title: "Đang thực hiện",
            number: 20,
            bgColor: "#FFEEF0",
            bgSmall: "#EE1E1E",
            percent: 23,
        },
    ];
    return (
        <div className="grid grid-cols-5 gap-5">
            {data.map((e, i) => (
                <div className={`w-full p-4 rounded space-y-1.5`} style={{ backgroundColor: `${e.bgColor}` }} key={i}>
                    <h4 className="text-[#3A3E4C] font-normal text-sm">{e.title}</h4>
                    <div className="flex justify-between items-end">
                        <h6
                            className="text-lg font-medium text-white w-12 h-12 flex flex-col justify-center items-center rounded"
                            style={{ backgroundColor: `${e.bgSmall}` }}
                        >
                            {e.number}
                        </h6>
                        {e.percent > 0 ? (
                            <h6 className="font-[400] text-lg text-[#0BAA2E] flex space-x-0.5 items-center">
                                <span>{e.percent}%</span>
                                <ArrowUp size={20} />
                            </h6>
                        ) : (
                            <h6 className="font-[400] text-lg text-[#EE1E1E] flex space-x-0.5 items-center">
                                <span>{e.percent}%</span>
                                <ArrowDown size={20} />
                            </h6>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
});

export default ListTask