import Image from "next/image";
import dynamic from "next/dynamic";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});
const Main = ({ handleIsShowModel, sIsshow, data }) => {
    return (
        <>
            <div className="relative flex item-center gap-4  w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                {data.dataMain.map((e, index) => (
                    <div key={index} className="">
                        <div className="flex w-[330px] justify-center items-center gap-2">
                            <div className="w-[20px] h-[20px] my-2 mx-1">
                                <Image src={e.icon} width={20} height={20} className="object-cover w-full h-full" />
                            </div>
                            <h1
                                style={{
                                    color: e?.color,
                                }}
                                className={`font-semibold text-sm uppercase`}
                            >
                                {e.title}
                            </h1>
                        </div>
                        <div
                            style={{
                                backgroundColor: e.color,
                            }}
                            className="w-full h-2  rounded-2xl"
                        ></div>

                        <ScrollArea
                            className="3xl:h-[740px] xxl:h-[473px] 2xl:h-[555px] xl:h-[488px] lg:h-[498px] h-[565px] overflow-auto"
                            speed={3}
                            smoothScrolling={true}
                        >
                            {e.child.map((ce, ceIndex) => (
                                <button
                                    type="button"
                                    key={ceIndex}
                                    style={{
                                        backgroundColor: ce?.bg,
                                    }}
                                    onClick={() => handleIsShowModel(e.id, ce.id)}
                                    className={`w-full my-2 rounded group hover:scale-[1.03] transition-all duration-200 ease-linear`}
                                >
                                    <div className="p-4">
                                        <div
                                            style={{
                                                backgroundColor: ce?.color,
                                            }}
                                            className={`h-full group-hover:scale-[1.03] transition-all duration-200 ease-in-out 
                                                p-2 text-[#11315B] text-[12px] font-medium w-fit rounded-lg`}
                                        >
                                            {ce.order}
                                        </div>
                                        <div className="flex items-center justify-between my-2">
                                            <div>
                                                <h1 className="text-[10px] font-normal text-[#667085]">
                                                    {ce.titeLeft.top}
                                                </h1>
                                                <h1 className="text-xs text-start font-medium text-[#000000]">
                                                    {ce.titeLeft.bottom}
                                                </h1>
                                            </div>
                                            <div>
                                                <h1 className="text-[10px] font-normal text-[#667085]">
                                                    {ce.titleRight.top}
                                                </h1>
                                                <h1 className="text-xs text-start font-medium text-[#000000]">
                                                    {ce.titleRight.bottom}
                                                </h1>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-12">
                                            <div className="col-span-4 w-[80px] h-[84px] rounded-xl  overflow-hidden">
                                                <Image
                                                    src={ce.image}
                                                    width={80}
                                                    height={84}
                                                    className="w-full h-full object-cover rounded-xl group-hover:scale-[1.03] group-hover:rotate-6 hover:scale-105 hover:rotate-6  transition-all duration-200 ease-in-out"
                                                />
                                            </div>
                                            <div className="col-span-7">
                                                <h1 className="text-[#000000] text-start font-semibold text-sm">
                                                    {ce.name}
                                                </h1>
                                                <h1 className="text-[10px]  text-start font-normal text-[#667085]">
                                                    {ce.desription}
                                                </h1>
                                                {ce.manufacture && (
                                                    <h1
                                                        style={{ backgroundColor: ce.colorNo }}
                                                        className="p-1 rounded-lg text-white text-xs text-center"
                                                    >
                                                        {ce.no}
                                                    </h1>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <div className="">
                                                        <h1 className="text-[10px] font-normal text-[#667085]">
                                                            {ce.numberTitleLeft}
                                                        </h1>
                                                        <h1 className="text-lg font-medium text-[#0BAA2E]">
                                                            {ce.numberLeft}
                                                        </h1>
                                                    </div>
                                                    <div>
                                                        <h1 className="text-[10px] font-normal text-[#667085]">
                                                            {ce.numberTitleRight}
                                                        </h1>
                                                        <h1 className="text-lg font-medium text-[#EE1E1E]">
                                                            {ce.numberRight}
                                                        </h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </ScrollArea>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Main;
