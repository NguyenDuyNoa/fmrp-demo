const styleDatePicker = {
    primaryColor: "blue",
    i18n: "vi",
    showShortcuts: true,
    displayFormat: "DD/MM/YYYY",
    configs: {
        shortcuts: {
            today: "Hôm nay",
            yesterday: "Hôm qua",
            past: (period) => `${period}  ngày qua`,
            currentMonth: "Tháng này",
            pastMonth: "Tháng trước",
        },
        footer: {
            cancel: "Từ bỏ",
            apply: "Áp dụng",
        },
    },
    className:
        "react-datepicker__input-container placeholder:text-[#cbd5e1] 2xl:placeholder:text-xs xl:placeholder:text-xs lg:placeholder:text-[8px] placeholder:text-[8px]",
    inputClassName:
        "rounded-md w-full 2xl:p-2 placeholder:text-[#cbd5e1] xl:p-[11px] p-3 bg-white focus:outline-[#0F4F9E]  2xl:placeholder:text-xs xl:placeholder:text-[9px] lg:placeholder:text-[8px] placeholder:text-[8px] border-none  2xl:text-base xl:text-xs text-[10px]  focus:outline-none focus:ring-0 focus:border-transparent",
};
export default styleDatePicker;
