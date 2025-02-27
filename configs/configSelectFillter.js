const configSelectFillter = {
    hideSelectedOptions: false,
    isClearable: true,
    className:
        "3xl:text-[16px] parentSelect 2xl:text-[14px] xl:text-[13px] lg:text-[9px] 3xl:w-full 2xl:w-full xl:w-full lg:w-[160px] 3xl:h-full 2xl:h-full  2xl:text-base xl:text-xs text-[10px] rounded-md bg-white z-20",
    isSearchable: true,
    noOptionsMessage: () => "Không có dữ liệu",
    closeMenuOnSelect: true,
    style: {
        border: "none",
        boxShadow: "none",
        outline: "none",
    },
    theme: (theme) => ({
        ...theme,
        colors: {
            ...theme.colors,
            primary25: "#EBF5FF",
            primary50: "#92BFF7",
            primary: "#0F4F9E",
        },
    }),
    styles: {
        placeholder: (base) => ({
            ...base,
            color: "#cbd5e1",
        }),
        control: (base, state) => ({
            ...base,
            border: "none",
            outline: "none",
            boxShadow: "none",
            ...(state.isFocused && {
                boxShadow: "0 0 0 1.5px #0F4F9E",
            }),
        }),
    },
};
export default configSelectFillter;
