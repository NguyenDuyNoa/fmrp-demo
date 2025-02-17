import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useStatusExprired from "@/hooks/useStatusExprired";
import { formatMoment } from "@/utils/helpers/formatMoment";
import { isSameDay } from "date-fns";
import vi from "date-fns/locale/vi"; // Import ngôn ngữ tiếng Việt
import "moment/locale/vi";
import Head from "next/head";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdAddBox } from "react-icons/md";
import { v4 as uuidV4 } from "uuid";
import PopupAddTask from "./components/popupAddTask";

const Index = (props) => {
    const dataLang = props?.dataLang
    // BigCalendar.momentLocalizer(moment);
    const statusExprired = useStatusExprired();

    const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

    const inittialState = {
        dataCaleander: [],
        openModal: false,
        month: new Date().getMonth() + 1,
        dateSelected: new Date(),
        currentDate: new Date(),
        year: new Date().getFullYear(),
    }

    const [isStateCalender, setIsStateCalender] = useState(inittialState);

    const queryStateCalender = (key) => setIsStateCalender((prev) => ({ ...prev, ...key }));

    useEffect(() => {
        // Lưu ý: isStateCalender.month phải trừ đi 1 vì months trong JavaScript bắt đầu từ 0 (tháng 1 là tháng 0)
        const firstDayOfMonth = new Date(isStateCalender.year, isStateCalender.month - 1, 1);

        const lastDayOfMonth = new Date(isStateCalender.year, isStateCalender.month, 1);

        // Xác định ngày đầu tiên của tuần và ngày cuối cùng của tuần
        const firstDayOfWeek = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();

        const lastDayOfWeek = lastDayOfMonth.getDay() === 0 ? 7 : lastDayOfMonth.getDay();
        // const firstDayOfWeek = firstDayOfMonth?.getDay();
        // const lastDayOfWeek = lastDayOfMonth?.getDay();

        // Xác định ngày bắt đầu và kết thúc của tuần trước và tuần sau
        const startOfPreviousWeek = new Date(firstDayOfMonth);

        startOfPreviousWeek?.setDate(startOfPreviousWeek?.getDate() - (firstDayOfWeek - 1));

        const endOfNextWeek = new Date(lastDayOfMonth);

        endOfNextWeek?.setDate(endOfNextWeek?.getDate() + (7 - lastDayOfWeek));

        const previousMonthDays = [];

        for (let d = new Date(startOfPreviousWeek); d < firstDayOfMonth; d.setDate(d.getDate() + 1)) {
            previousMonthDays.push({
                id: uuidV4(),
                date: new Date(d),
                day: d.getDate(),
                isPreviousMonthDay: true,
            });
        }
        const currentMonthDays = [];

        for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
            if (d.getMonth() === isStateCalender.month - 1) {
                currentMonthDays.push({
                    id: uuidV4(),
                    date: new Date(d),
                    day: d.getDate(),
                    tasks: []
                });
            }
        }

        const nextMonthDays = [];
        for (let d = new Date(lastDayOfMonth); d <= endOfNextWeek; d.setDate(d.getDate() + 1)) {
            nextMonthDays.push({
                id: uuidV4(),
                date: new Date(d),
                day: d.getDate(),
                isNextMonthDay: true,
            });
        }
        queryStateCalender({ dataCaleander: [...previousMonthDays, ...currentMonthDays, ...nextMonthDays] })
    }, [isStateCalender.month]);




    const dayComponents = isStateCalender.dataCaleander.map((dayData, i, arr) => {
        // So sánh ngày hiện tại với ngày trong danh sách
        const dayDate = dayData.date;
        const isPastDay = dayDate < isStateCalender.currentDate && !isSameDay(dayDate, isStateCalender.currentDate);
        // Xác định xem ngày hiện tại là thứ mấy
        const dayOfWeek = dayData.date.getDay(); // 0 là Chủ Nhật, 1 là Thứ 2, ..., 6 là Thứ 7

        // Kiểm tra xem ngày hiện tại là thứ 7 hay chủ nhật không
        const isSaturday = dayOfWeek === 6;
        const isSunday = dayOfWeek === 0;
        return (
            <div
                key={`day-${i}`}
                className={`col-span-1 group transition-all duration-200 ease-linear border-[#F1F4F9] border-r-2 border-b-2  w-full h-full min-h-[140px] group text-center p-2                          
                ${dayData.isNextMonthDay || dayData.isPreviousMonthDay ? "text-gray-400 font-normal" : " hover:bg-[#E0E0E0]/20 text-gray-600 "}
                `}
            >
                <div className="h-full">
                    <div className={`flex items-center ${!(dayData.isNextMonthDay || dayData.isPreviousMonthDay) ? `group-hover:justify-between justify-end` : "justify-end"} `}>
                        {!(dayData.isNextMonthDay || dayData.isPreviousMonthDay) &&
                            <PopupAddTask
                                id={dayData.id}
                                dataLang={dataLang}
                                queryStateCalender={queryStateCalender}
                                isStateCalender={isStateCalender}
                                disbleClick={(dayData.isNextMonthDay || dayData.isPreviousMonthDay)}
                                className={'group-hover:block hidden'}
                            >
                                <MdAddBox className="text-xl hover:scale-110 transition-all duration-200 ease-linear" />

                            </PopupAddTask>
                        }
                        <div className={`text-base font-normal ${dayData.day == new Date().getDate() && isStateCalender.month == new Date().getMonth() ? "bg-red-500 text-white rounded-full px-2 py-1" : ""}`}>
                            {dayData.day}
                        </div>
                    </div>
                    {!(dayData.isNextMonthDay || dayData.isPreviousMonthDay) &&
                        <Customscrollbar className="flex justify-start flex-col gap-1.5 items-start min-h-32">
                            {dayData.tasks.map((task, index) => (
                                <div
                                    key={index}
                                    className=" w-full flex flex-col gap-1 text-start py-3 px-2 rounded-md"
                                    style={{ background: task.bg, color: task.color }}
                                >
                                    <div className="text-base font-medium">
                                        <span className="font-semibold">{task.time}</span> {task.name}
                                    </div>
                                    <div className="bg-green-500 text-white rounded-xl w-fit">
                                        <h1 className="text-[11px] font-semibold py-0.5 px-2 flex items-center gap-1">
                                            <span className="h-2 w-2 rounded-full bg-green-400 block"></span>
                                            <span>{task?.status}</span>
                                        </h1>
                                    </div>
                                    <div className="text-sm font-semibold">
                                        Mô tả: {task?.note}
                                    </div>
                                </div>
                            ))}
                        </Customscrollbar>
                    }
                </div>

            </div>
        );
    });
    const handleMonthChange = (change) => {
        const currentMonth = isStateCalender.month;
        const newMonth = currentMonth + change;

        if (newMonth < 1 || newMonth > 12) return;

        const currentDate = new Date();
        currentDate.setMonth(newMonth - 1); // Adjust month as setMonth is zero-indexed

        queryStateCalender({
            month: newMonth,
            dateSelected: currentDate
        });
    };
    return (
        <>
            <Head>
                <title>{"Lịch sản xuất"}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{'Sản xuất'}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{"Lịch sản xuất"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-0.5 h-[100%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className=" 2xl:text-lg text-base text-[#52575E] capitalize">
                                {'Lịch sản xuất'}
                            </h2>
                        </div>
                        <ContainerTable>
                            <div className='w-full flex items-center justify-between gap-2 border p-2'>
                                <div className="flex items-center">
                                    <div className="flex items-center gap-2">
                                        <GrFormPrevious
                                            size={18}
                                            onClick={() => handleMonthChange(-1)}
                                            className="cursor-pointer hover:scale-125 transition-all duration-150 ease-linear"
                                        />
                                        <GrFormNext
                                            size={18}
                                            onClick={() => handleMonthChange(1)}
                                            className="cursor-pointer hover:scale-125 transition-all duration-150 ease-linear"
                                        />
                                    </div>
                                    <div className="text-black text-base font-normal">
                                        Tháng {parseInt(isStateCalender.month, 10)?.toString()}, {isStateCalender.year}
                                    </div>
                                </div>
                                <div className="">
                                    <DatePicker
                                        selected={isStateCalender.dateSelected}
                                        renderYearContent={(month, shortMonth, longMonth, day) => {
                                            const fullYear = new Date(day).getFullYear();
                                            const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;
                                            return <span title={tooltipText}>{shortMonth}</span>;
                                        }}
                                        onChange={(date) => {
                                            if (date) {
                                                queryStateCalender({ dateSelected: date, month: formatMoment(date, FORMAT_MOMENT.MONTH), year: formatMoment(date, FORMAT_MOMENT.YYYY) })
                                                return
                                            }
                                            queryStateCalender({ dateSelected: new Date(), month: new Date().getMonth() + 1, year: new Date().getFullYear() })
                                        }}
                                        monthPlaceholder="Tháng"
                                        className={`border ${"focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-1 outline-none cursor-pointer `}
                                        showMonthYearPicker
                                        locale={vi}
                                        isClearable={true}
                                        // showFullMonthYearPicker
                                        // showFourColumnMonthYearPicker
                                        dateFormat="MM/yyyy"
                                    />
                                </div>
                            </div>
                            <Customscrollbar className="3xl:h-[94%] xxl:h-[87%] 2xl:h-[97%] xl:h-[87%] lg:h-[92%] h-[90%]">
                                <div className='flex flex-col gap-0 3xl:mb-6 2xl:mb-12 xl:mb-2 lg:mb-12'>
                                    {/* Render các thứ trong tuần */}
                                    <div className="grid grid-cols-7 sticky top-0 py-4 z-[40] border-2 border-[#F1F4F9] bg-white text-center 3xl:text-sm text-[13px] font-medium uppercase">
                                        {
                                            daysOfWeek.map((item, index) => (
                                                <div key={`index-week-${index}`}>
                                                    {item}
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {/* Render các ngày trong tuần */}
                                    <div className='grid grid-cols-7 items-center border-[#F1F4F9] border-l-2 '>
                                        {dayComponents}
                                    </div>
                                </div>
                            </Customscrollbar>
                        </ContainerTable>
                    </div>
                </ContainerBody>
            </Container>
        </>
    );
};

export default Index;
