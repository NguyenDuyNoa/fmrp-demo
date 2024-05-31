import useSetingServer from "@/hooks/useConfigNumber";

const DropdowLimit = ({ sLimit, limit, dataLang }) => {
    const dataSeting = useSetingServer()

    const data = [15, 20, 40, 60]

    if (dataSeting?.tables_pagination_limit && !data.includes(+dataSeting.tables_pagination_limit)) {
        // Thêm giá trị vào mảng
        data.push(dataSeting.tables_pagination_limit);
        // Sắp xếp mảng từ nhỏ đến lớn
        data.sort((a, b) => a - b);
    }

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
                {data.map((e) => (
                    <option className="text-[10px] xl:text-xs 2xl:text-sm" value={e}>
                        {e}
                    </option>
                ))}

            </select>
        </>
    );
};
export default DropdowLimit;
