import React, { useState } from 'react';

const steps = [
    { id: "189", name: "Đóng gói", qty: 5, lot: "LSXCT12031526", completed: false },
    { id: "188", name: "Là ủi", qty: 5, completed: false },
    { id: "187", name: "Vắt sổ", qty: 5, completed: true, active: true, date: "13/03" },
    { id: "186", name: "May", qty: 5, completed: true, date: "12/03 16:30" },
    { id: "185", name: "Xem thêm (+3 công đoạn)", qty: null, completed: true, date: "11/03 12:59" },
];

const stepFake = [
    {
        "id": "249",
        "po_id": "39",
        "poi_id": "50",
        "stage_id": "10",
        "number": "3",
        "final_stage": "1",
        "type": 3,
        "bom_id": "0",
        "begin_production": "0",
        "date_production": null,
        "staff_production": "0",
        "staff_active": "0",
        "active": "0",
        "date_active": null,
        "stage_code": "HOANTHANH",
        "stage_name": "Hoàn Thành",
        "purchase_items": null
    },
    {
        "id": "248",
        "po_id": "39",
        "poi_id": "50",
        "stage_id": "9",
        "number": "2",
        "final_stage": "0",
        "type": 3,
        "bom_id": "0",
        "begin_production": "0",
        "date_production": null,
        "staff_production": "0",
        "staff_active": "0",
        "active": "0",
        "date_active": null,
        "stage_code": "SON XE",
        "stage_name": "Sơn Xe",
        "purchase_items": null
    },
    {
        "id": "247",
        "po_id": "39",
        "poi_id": "50",
        "stage_id": "19",
        "number": "1",
        "final_stage": "0",
        "type": "2",
        "bom_id": "0",
        "begin_production": "0",
        "date_production": null,
        "staff_production": "0",
        "staff_active": "0",
        "active": "1",
        "date_active": null,
        "stage_code": "Ghép phụ tùng",
        "stage_name": "Ghép phụ tùng",
        "purchase_items": null
    }
]

const ProductionSteps2 = () => {
    return (
        <div className="pl-4 py-4 font-sans">
            {
                steps.map((step, index) => (
                    <div key={step.id} className="grid grid-cols-8 relative">
                        <div className='col-span-1 w-full relative'>
                            <div className={`absolute -top-2 left-0 w-full h-full font-medium ${step.completed ? step.active ? "text-black" : "text-green-500" : "text-gray-400"} text-wrap`}>
                                {step.date && <span className="text-xs font-normal text-gray-500">{step.date}</span>}
                            </div>
                        </div>

                        <div className="col-span-1 flex flex-col items-center mr-2 relative h-full">
                            <div
                                className={`size-4 shrink-0 rounded-full border-2 
                                    ${step.completed ?
                                        (
                                            step.active
                                                ?
                                                "border-green-500 bg-white"
                                                :
                                                "bg-green-500 border-green-500"
                                        )
                                        :
                                        "border-gray-400 bg-white"
                                    }`}
                            ></div>

                            {
                                steps?.length - 1 !== index &&
                                <div className='w-[2px] h-full bg-[#9295A4]' />
                            }
                        </div>

                        <div className='col-span-6'>
                            <div className={`font-medium ${step.completed ? step.active ? "text-black" : "text-green-500" : "text-gray-400"}`}>
                                {step.name}
                            </div>
                            {step.qty && (
                                <div className="text-xs flex gap-2 mt-1">
                                    <span className="border rounded-full px-2 py-0.5 border-gray-300">SL: {step.qty}</span>
                                    {step.lot && <span className="border rounded-full px-2 py-0.5 border-gray-300">LOT: {step.lot}</span>}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            }
        </div>
    );
};


const TimelineStep = ({ step, isActive }) => (
    <div className="flex items-start relative">
        <div className="flex flex-col items-center mr-3">
            <div
                className={`rounded-full w-4 h-4 border-2 ${isActive ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}
            />
            <div className="flex-1 w-px bg-gray-300" style={{ minHeight: '40px' }}></div>
        </div>

        <div className="mb-4">
            <div className={`font-medium ${isActive ? 'text-green-500' : 'text-gray-500'}`}>{step.stage_name}</div>
            {step.stage_code && (
                <div className="text-xs text-gray-400">{step.stage_code}</div>
            )}
        </div>
    </div>
);

const Timeline = ({ steps }) => {
    const [showAll, setShowAll] = useState(false);

    const displayedSteps = showAll ? steps : steps.slice(0, 1);

    return (
        <div className="relative">
            {displayedSteps.map((step, index) => (
                <TimelineStep key={step.id} step={step} isActive={step.active === '1'} />
            ))}

            {
                steps.length > 1 && !showAll && (
                    <div className="cursor-pointer text-green-500 ml-7" onClick={() => setShowAll(true)}>
                        Xem thêm (+{steps.length - 1} công đoạn)
                    </div>
                )
            }

            {
                showAll && steps.length > 1 && (
                    <div className="cursor-pointer text-green-500 ml-7" onClick={() => setShowAll(false)}>
                        Thu gọn
                    </div>
                )
            }
        </div>
    );
};

export default ProductionSteps2;
