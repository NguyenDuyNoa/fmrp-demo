import CaretDropdownThinIcon from '@/components/icons/common/CaretDropdownThinIcon';
import { ProductionsOrdersContext } from '@/containers/manufacture/productions-orders/context/productionsOrders';
import { useState, useRef, useEffect, useContext } from 'react';

const options = [
    { id: 1, label: "Đơn hàng bán" },
    { id: 2, label: "Kế hoạch nội bộ" },
];

const RadioDropdown = () => {
    const [open, setOpen] = useState(false);

    const { isStateProvider, queryState } = useContext(ProductionsOrdersContext);

    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setOpen(false);
        }
    };

    // useEffect(() => {
    //     if (options) {
    //         queryState({
    //             seletedRadioFilter: options[0]
    //         })
    //     }
    // }, [options]);


    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            ref={ref}
            className={`relative w-full`}
        >
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex justify-between items-center px-2 min-h-[38px] border rounded-md ${open ? 'border-[#2563eb]' : 'border-[#D8DAE5]'} outline-none custom-transition`}
            >
                <span className="">
                    {
                        isStateProvider?.seletedRadioFilter ?
                            <span className='text-sm font-medium text-[#141522]'>{isStateProvider?.seletedRadioFilter?.label}</span>
                            :
                            <span className='text-sm font-light text-[#52575E]'>Chọn bộ lọc</span>
                    }
                </span>
                <CaretDropdownThinIcon className={`${open ? 'rotate-180' : ''} w-4 h-4 text-[#9295A4]`} />
            </button>

            {
                open && (
                    <div className="absolute mt-1 p-1 w-full bg-white border border-[#D8DAE5] rounded-lg shadow-lg z-[9999999]">
                        {
                            options.map(option => (
                                <label
                                    key={option.id}
                                    className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50"
                                >
                                    <input
                                        type="radio"
                                        checked={isStateProvider?.seletedRadioFilter?.id === option.id}
                                        onChange={() => {
                                            if (option.id == 1) {
                                                queryState({
                                                    seletedRadioFilter: option,
                                                    valuePlan: null,
                                                })

                                            } else if (option.id == 2) {
                                                queryState({
                                                    seletedRadioFilter: option,
                                                    valueOrders: null,
                                                })
                                            }

                                        }}
                                        className="form-radio text-sm text-[#0F4F9E]"
                                    />
                                    <span className='text-sm text-[#141522] font-normal'>{option.label}</span>
                                </label>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
};

export default RadioDropdown;
