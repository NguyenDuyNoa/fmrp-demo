const DropdowLimit = ({ sLimit, limit, dataLang }) => {
    return (
        <>
            <div className="font-[300] text-slate-400 2xl:text-xs xl:text-sm text-[8px]">{dataLang?.display}</div>
            <select
                className="outline-none  text-[10px] xl:text-xs 2xl:text-sm"
                onChange={(e) => sLimit(e.target.value)}
                value={limit}
            >
                <option className="text-[10px] xl:text-xs 2xl:text-sm hidden" disabled>
                    {limit == -1 ? "Tất cả" : limit}
                </option>
                <option className="text-[10px] xl:text-xs 2xl:text-sm" value={15}>
                    15
                </option>
                <option className="text-[10px] xl:text-xs 2xl:text-sm" value={20}>
                    20
                </option>
                <option className="text-[10px] xl:text-xs 2xl:text-sm" value={40}>
                    40
                </option>
                <option className="text-[10px] xl:text-xs 2xl:text-sm" value={60}>
                    60
                </option>
            </select>
        </>
    );
};
export default DropdowLimit;
