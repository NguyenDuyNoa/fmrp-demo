const TitleHeader = ({ dataLang, tabPage }) => {
    const data = {
        1: [
            {
                name: "Thông tin chung",
            },
            {
                name: "Thông tin liên hệ",
            },
            {
                name: "Địa chỉ giao hàng",
            },
        ],
        2: [
            { name: "Thông tin chung" },
            {
                name: "Thông tin liên hệ",
            },
        ],
        3: [{ name: "Thông tin chung" }],
        4: [{ name: "Thông tin chung" }],
        5: [{ name: "Thông tin chung" }],
        6: [{ name: "Thông tin chung" }],
    };

    return (
        <div className="col-span-12 divide-x divide-gray-300 grid grid-cols-12 bg-gray-100   rounded transition-all duration-200">
            {data[tabPage]?.map((e) => (
                <div className="col-span-4">
                    <h1 className="text-center font-semibold text-base text-zinc-600 capitalize py-2">{e.name}</h1>
                </div>
            ))}
        </div>
    );
};
export default TitleHeader;
