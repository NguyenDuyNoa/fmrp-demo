import React, { useState } from 'react'
import { ArrowRight2 } from "iconsax-react";

const ProductionProgressTracker = React.memo(() => {
    const [tab, sTab] = useState(0);
    const _HandleTab = (e) => sTab(e);

    const data = [
        {
            name: "Nhóm sản xuất thân áo asd asd asd ",
            date: "22/02/2021",
            percent: 78,
        },
        {
            name: "Nhóm sản xuất thân áo",
            date: "22/02/2021",
            percent: 56,
        },
        {
            name: "Nhóm sản xuất thân áo",
            date: "22/02/2021",
            percent: 24,
        },
    ];
    return (
        <div className="bg-slate-50/60 p-3 space-y-4 border border-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
                <h2>Tiến độ SX theo nhóm</h2>
                <button className="text-[#667085] bg-[#F3F4F6] px-4 py-2 rounded flex space-x-2 items-center hover:scale-105 transition">
                    <span>Xem chi tiết</span>
                    <ArrowRight2 size={18} />
                </button>
            </div>
            <div className="flex rounded-lg overflow-hidden border w-fit">
                <button
                    onClick={_HandleTab.bind(this, 0)}
                    className={`${tab === 0 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black"
                        } px-3 py-2 border`}
                >
                    Tất cả
                </button>
                <button
                    onClick={_HandleTab.bind(this, 1)}
                    className={`${tab === 1 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black"
                        } px-3 py-2 border`}
                >
                    Đang thực hiện
                </button>
                <button
                    onClick={_HandleTab.bind(this, 2)}
                    className={`${tab === 2 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black"
                        } px-3 py-2 border`}
                >
                    Chưa thực hiện
                </button>
                <button
                    onClick={_HandleTab.bind(this, 3)}
                    className={`${tab === 3 ? "text-black bg-white" : "text-[#667085] bg-[#F9FAFB] hover:text-black"
                        } px-3 py-2 border`}
                >
                    Tạm dừng
                </button>
            </div>
            <div className="py-3 divide-y divide-slate-200">
                {data.map((e) => (
                    <div className="flex items-center justify-between py-2 hover:bg-slate-100/30" key={e.name}>
                        <div className="flex space-x-2 items-center w-[45%]">
                            <div className="min-w-[48px] h-12 rounded-full bg-slate-300" />
                            <div className="w-fit">
                                <h6 className="line-clamp-1">{e.name}</h6>
                                <p className="text-[#9295A4] font-[300] text-[13px]">{e.date}</p>
                            </div>
                        </div>
                        <div
                            className={`${e.percent >= 50 ? "bg-[#EBF5FF]" : "bg-[#f6e8cd6d]"
                                } w-[28%] relative h-2 rounded-full bg-[#EBF5FF]`}
                        >
                            <div
                                className={`${e.percent >= 50 ? "bg-[#5599EC]" : "bg-[#FF8F0D]"
                                    } h-2 rounded-full absolute left-0`}
                                style={{ width: `${e.percent}%` }}
                            />
                        </div>
                        <h6
                            className={`${e.percent >= 50
                                ? "text-[#5599EC] bg-[#EBF5FF] border-[#d4e8fd]"
                                : "text-[#FF8F0D] bg-[#FEF8EC] border-[#f6e8cd]"
                                } py-2 w-[10%] text-center rounded-md border`}
                        >
                            {e.percent}%
                        </h6>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default ProductionProgressTracker