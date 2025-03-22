const configSelectFillter = {
    hideSelectedOptions: false,
    isClearable: true,
    className: " xl:text-sm text-sm 2xl:placeholder:text-base xl:placeholder:text-sm placeholder:text-sm w-full h-full lg:w-[160px] rounded-lg bg-white z-20",
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
            primary: "#3276FA",
        },
    }),
    styles: {
        singleValue: (base, state) => ({ // Thêm vào đây để đổi màu chữ
            ...base,
            color: state.isDisabled ? "#a1a1aa" : "#52575E", // màu bạn muốn đổi
            fontWeight: 500   // thêm font weight tùy ý (400, 500, 600, 700...)
        }),
        placeholder: (base, state) => ({
            ...base,
            color: state.isDisabled ? "#a1a1aa" : "#52575E",
        }),
        control: (base, state) => ({
            ...base,
            backgroundColor: state.isDisabled ? "#f9fafb" : base.backgroundColor,
            cursor: state.isDisabled ? "not-allowed" : "pointer",
            opacity: state.isDisabled ? 0.7 : 1,
        }),
        option: (provided, state) => ({
            // ...[styles?.option ? styles?.option : configSelectFillter.styles?.option],
            ...provided,
            backgroundColor: 'transparent',
            color: state?.isSelected ? '#2563eb' : provided?.color, // Giữ màu chữ
            '&:hover': {
                backgroundColor: 'transparent',
                color: state?.isDisabled ? provided['&:hover']?.color : '#3b82f6'
            },
        }),

    },

};
export default configSelectFillter;
