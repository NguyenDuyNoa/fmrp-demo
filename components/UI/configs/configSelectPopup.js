const configSelectPopup = {
    isSearchable: true,
    noOptionsMessage: () => "Không có dữ liệu",
    maxMenuHeight: "200px",
    isClearable: true,

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
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
            position: "absolute",
        }),
    },
};
export default configSelectPopup;
