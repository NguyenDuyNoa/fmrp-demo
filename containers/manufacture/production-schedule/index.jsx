import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import useStatusExprired from "@/hooks/useStatusExprired";
import { formatMoment } from "@/utils/helpers/formatMoment";
import vi from "date-fns/locale/vi"; // Import ngôn ngữ tiếng Việt
import "moment/locale/vi";
import Head from "next/head";
import { memo, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DatePicker from "react-datepicker";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdAddBox } from "react-icons/md";
import { v4 as uuidV4 } from "uuid";
import PopupAddTask from "./components/popupAddTask";

const ProductionSchedule = (props) => {
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

    const { onDragEnd } = useDragAndDrop(isStateCalender.dataCaleander, (updatedData) => { queryStateCalender({ dataCaleander: updatedData }) }, "tasks");

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
                tasks: []
            });
        }
        const currentMonthDays = [];

        for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
            if (d.getMonth() === isStateCalender.month - 1) {
                currentMonthDays.push({
                    id: uuidV4(),
                    date: new Date(d),
                    day: d.getDate(),
                    tasks: [
                        {
                            id: uuidV4(),
                            name: 'Phun côn trùng 1',
                            time: '8:00',
                            status: 'Hoàn thành',
                            bg: '#F2F9EC',
                            color: '#32AA00',
                            note: 'Phun côn trùng vào sáng sớm'
                        },
                        {
                            id: uuidV4(),
                            name: 'Phun côn trùng 2',
                            time: '8:00',
                            status: 'Hoàn thành',
                            bg: '#F2F9EC',
                            color: '#32AA00',
                            note: 'Phun côn trùng vào sáng sớm'
                        }
                    ]
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
                tasks: []
            });
        }
        queryStateCalender({ dataCaleander: [...previousMonthDays, ...currentMonthDays, ...nextMonthDays] })
    }, [isStateCalender.month]);

    const SortableItem = memo(({ value, index }) => (
        <Draggable draggableId={value.id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        background: snapshot.isDragging ? '#f0f0f0' : value.bg, // Thay đổi màu nền khi kéo
                        color: value.color
                    }}
                    className="flex flex-col w-full gap-1 px-2 py-3 rounded-md cursor-grab text-start"
                >
                    <div className="text-base font-medium">
                        <span className="font-semibold">{value.time}</span> {value.name}
                    </div>
                    <div className="text-green-500 bg-green-100 rounded-lg w-fit">
                        <h1 className="text-[11px] font-medium py-0.5 px-2 flex items-center gap-1">
                            <span className="block w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>{value?.status}</span>
                        </h1>
                    </div>
                    <div className="text-xs font-medium">
                        Mô tả: {value?.note}
                    </div>
                </div>
            )}
        </Draggable>
    ));


    const dayComponents = isStateCalender.dataCaleander.map((dayData, i) => (
        <div
            key={`day-${i}`}
            className={`col-span-1 group transition-all duration-200 ease-linear border-[#F1F4F9] border-r-2 border-b-2 w-full h-full min-h-[140px] group text-center p-2 ${dayData.isNextMonthDay || dayData.isPreviousMonthDay ? "text-gray-400 font-normal" : " hover:bg-[#E0E0E0]/20 text-gray-600"}`}
        >
            <div className="h-full">
                <div className={`flex items-center ${!(dayData.isNextMonthDay || dayData.isPreviousMonthDay) ? `group-hover:justify-between justify-end` : "justify-end"} `}>
                    {!(dayData.isNextMonthDay || dayData.isPreviousMonthDay) &&
                        <PopupAddTask
                            id={dayData.id}
                            dataLang={dataLang}
                            queryStateCalender={queryStateCalender}
                            isStateCalender={isStateCalender}
                            disableClick={(dayData.isNextMonthDay || dayData.isPreviousMonthDay)}
                            className={'group-hover:block hidden'}
                        >
                            <MdAddBox className="text-xl transition-all duration-200 ease-linear hover:scale-110" />
                        </PopupAddTask>
                    }
                    <div className={`text-base font-normal ${dayData.day === new Date().getDate() && +isStateCalender.month === new Date().getMonth() + 1 ? "bg-red-500 text-white rounded-full px-2 py-1 my-0.5" : ""}`}>
                        {dayData.day}
                    </div>
                </div>
                {!(dayData.isNextMonthDay || dayData.isPreviousMonthDay) &&
                    <Droppable droppableId={`day-${i}`}>
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`${snapshot.isDraggingOver ? 'bg-gray-100 rounded-md h-fit' : 'h-full bg-transparent'} transition-all duration-100 ease-in-out`}
                            >
                                <div className="flex flex-col gap-2">
                                    {dayData.tasks.length > 0 ? (
                                        dayData.tasks.map((value, index) => (
                                            <SortableItem key={`item-${value.id}`} index={index} value={value} />
                                        ))
                                    ) : ''}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                }
            </div>
        </div>
    ));


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
                <title>{dataLang?.production_schedule_title || 'production_schedule_title'}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{'Sản xuất'}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.production_schedule_title || 'production_schedule_title'}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-0.5 h-[100%] overflow-hidden">
                        <div className="flex justify-between mt-1 mr-2">
                            <h2 className=" 2xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.production_schedule_title || 'production_schedule_title'}
                            </h2>
                        </div>
                        <ContainerTable>
                            <div className='flex items-center justify-between w-full gap-2 p-2 border'>
                                <div className="flex items-center">
                                    <div className="flex items-center gap-2">
                                        <GrFormPrevious
                                            size={18}
                                            onClick={() => handleMonthChange(-1)}
                                            className="transition-all duration-150 ease-linear cursor-pointer hover:scale-125"
                                        />
                                        <GrFormNext
                                            size={18}
                                            onClick={() => handleMonthChange(1)}
                                            className="transition-all duration-150 ease-linear cursor-pointer hover:scale-125"
                                        />
                                    </div>
                                    <div className="text-base font-normal text-black">
                                        {dataLang?.month || 'month'} {parseInt(isStateCalender.month, 10)?.toString()}, {isStateCalender.year}
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
                                        monthPlaceholder={dataLang?.month || 'month'}
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
                                    {/* <div className='grid grid-cols-7 items-center border-[#F1F4F9] border-l-2 '>
                                        {dayComponents}
                                    </div> */}
                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <div className="grid grid-cols-7 border-[#F1F4F9] border-l-2">
                                            {dayComponents}
                                        </div>
                                    </DragDropContext>
                                </div>
                            </Customscrollbar>
                        </ContainerTable>
                    </div>
                </ContainerBody>
            </Container>
        </>
    );
};

export default ProductionSchedule;
