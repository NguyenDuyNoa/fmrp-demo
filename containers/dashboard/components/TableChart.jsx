import { Customscrollbar } from '@/components/UI/common/Customscrollbar';
import React from 'react';
const TableChart = React.memo(() => {
    const data = [
        {
            stt: 1,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 2,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 3,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 4,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 5,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 6,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 7,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 8,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 9,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 10,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
        {
            stt: 11,
            id: "asd",
            name: "Áo thun cotton chất lượng caooooo",
            quantity: 20000,
        },
    ];
    return (
        <div className="p-3 space-y-8 border rounded-lg bg-slate-50/60 border-slate-50 ">
            <h2>Nguyên vật liệu cần mua</h2>
            <div>
                <div className="grid grid-cols-8 gap-3 py-5 pl-3 pr-4 bg-slate-50">
                    <h5 className="text-[#667085] text-[13px]">STT</h5>
                    <h5 className="text-[#667085] text-[13px] col-span-2 text-center">Mã NVL</h5>
                    <h5 className="text-[#667085] text-[13px] col-span-3">Tên NVL</h5>
                    <h5 className="text-[#667085] text-[13px] col-span-2 text-right">Số lượng</h5>
                </div>
                <Customscrollbar className="h-[350px]">
                    <div className="divide-y divide-slate-100">
                        {data.map((e) => (
                            <div
                                className="grid grid-cols-8 gap-3 py-4 pl-3 pr-4 hover:bg-white"
                                key={e.stt.toString()}
                            >
                                <h6>{e.stt}</h6>
                                <h6 className="col-span-2 text-center">{e.id}</h6>
                                <h6 className="col-span-3 line-clamp-1">{e.name}</h6>
                                <h6 className="col-span-2 text-right">{e.quantity?.toLocaleString()}</h6>
                            </div>
                        ))}
                    </div>
                </Customscrollbar>
            </div>
        </div>
    );
});

export default TableChart