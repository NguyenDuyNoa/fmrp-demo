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
  className: `react-datepicker__input-container placeholder:text-[#cbd5e1] 
        2xl:placeholder:text-[10px] 
        xl:placeholder:text-[10px] 
        lg:placeholder:text-[8px] 
        placeholder:text-[8px] `,
  inputClassName: `rounded-lg w-full placeholder:text-[#3A3E4C] px-1.5 2xl:py-1.5 py-2.5 rounded 2xl:text-base text-xs bg-white focus:outline-[#0F4F9E] 
         2xl:placeholder:text-[9px]
         xl:placeholder:text-[7.5px]
        lg:placeholder:text-[7px]
        placeholder:text-[7px] border-none 
         2xl:text-base xl:text-xs text-[10px]  !focus:outline-none !focus:ring-0 !focus:border-transparent
        `,
};
export default styleDatePicker;
