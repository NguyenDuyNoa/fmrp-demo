const HeaderTable = ({ dataLang, gridCol, dataHeader }) => {
    return (
        <div
            style={{ display: "grid", gridTemplateColumns: `repeat(${gridCol}, 1fr)` }}
            className={`items-center sticky top-0 bg-white p-2 z-10 shadow divide-x`}
        >
            {dataHeader.map((e) => {
                return (
                    <h4
                        style={{ gridColumn: `span ${e?.colspan}` }}
                        className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center whitespace-nowrap"
                    >
                        {e?.name}
                    </h4>
                );
            })}
        </div>
    );
};
export default HeaderTable;
