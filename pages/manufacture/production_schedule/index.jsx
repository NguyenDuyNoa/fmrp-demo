import Head from "next/head";
import React, { useMemo } from "react";
import useStatusExprired from "@/hooks/useStatusExprired";
import { Calendar, momentLocalizer } from "react-big-calendar";

import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/vi";

const Index = (props) => {
    moment.locale("vi");
    const localizer = momentLocalizer(moment);

    // BigCalendar.momentLocalizer(moment);
    const statusExprired = useStatusExprired();
    const events = [
        {
            title: "All Day Event very long title",
            allDay: true,
            start: new Date(2015, 3, 0),
            end: new Date(2015, 3, 1),
        },
        {
            title: "Long Event",
            start: new Date(2015, 3, 7),
            end: new Date(2015, 3, 10),
        },

        {
            title: "DTS STARTS",
            start: new Date(2016, 2, 13, 0, 0, 0),
            end: new Date(2016, 2, 20, 0, 0, 0),
        },

        {
            title: "DTS ENDS",
            start: new Date(2016, 10, 6, 0, 0, 0),
            end: new Date(2016, 10, 13, 0, 0, 0),
        },

        {
            title: "Some Event",
            start: new Date(2015, 3, 9, 0, 0, 0),
            end: new Date(2015, 3, 9, 0, 0, 0),
        },
        {
            title: "Conference",
            start: new Date(2015, 3, 11),
            end: new Date(2015, 3, 13),
            desc: "Big conference for important people",
        },
        {
            title: "Meeting",
            start: new Date(2015, 3, 12, 10, 30, 0, 0),
            end: new Date(2015, 3, 12, 12, 30, 0, 0),
            desc: "Pre-meeting meeting, to prepare for the meeting",
        },
        {
            title: "Lunch",
            start: new Date(2015, 3, 12, 12, 0, 0, 0),
            end: new Date(2015, 3, 12, 13, 0, 0, 0),
            desc: "Power lunch",
        },
        {
            title: "Meeting",
            start: new Date(2015, 3, 12, 14, 0, 0, 0),
            end: new Date(2015, 3, 12, 15, 0, 0, 0),
        },
        {
            title: "Happy Hour",
            start: new Date(2015, 3, 12, 17, 0, 0, 0),
            end: new Date(2015, 3, 12, 17, 30, 0, 0),
            desc: "Most important meal of the day",
        },
        {
            title: "Dinner",
            start: new Date(2015, 3, 12, 20, 0, 0, 0),
            end: new Date(2015, 3, 12, 21, 0, 0, 0),
        },
        {
            title: "Birthday Party",
            start: new Date(2015, 3, 13, 7, 0, 0),
            end: new Date(2015, 3, 13, 10, 30, 0),
        },
        {
            title: "Birthday Party 2",
            start: new Date(2015, 3, 13, 7, 0, 0),
            end: new Date(2015, 3, 13, 10, 30, 0),
        },
        {
            title: "Birthday Party 3",
            start: new Date(2015, 3, 13, 7, 0, 0),
            end: new Date(2015, 3, 13, 10, 30, 0),
        },
        {
            title: "Late Night Event",
            start: new Date(2015, 3, 17, 19, 30, 0),
            end: new Date(2015, 3, 18, 2, 0, 0),
        },
        {
            title: "Multi-day Event",
            start: new Date(2015, 3, 20, 19, 30, 0),
            end: new Date(2015, 3, 22, 2, 0, 0),
        },
    ];

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            // backgroundColor: "#a5f3fc",
            // color: "#0e7490",
            // fontSize: "13px",
            // padding: "15px",
        };

        return {
            style,
        };
    };

    const { defaultDate, messages } = useMemo(
        () => ({
            defaultDate: new Date(2015, 3, 13),
            messages: {
                week: "Tuần",
                work_week: "Semana de trabajo",
                day: "Ngày",
                month: "Tháng",
                previous: "Hôm qua",
                next: "Ngày mai",
                today: "Hôm nay",
                agenda: "El Diario",
                showMore: (total) => `+${total} más`,
            },
        }),
        []
    );
    return (
        <>
            <Head>
                <title>{"Lịch sản xuất"}</title>
            </Head>
            <div className="relative  3xl:pt-[88px] xxl:pt-[80px] 2xl:pt-[78px] xl:pt-[75px] lg:pt-[70px] pt-70 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {statusExprired ? <div className="p-4"></div> : <></>}
                <div>
                    <Calendar
                        eventPropGetter={eventStyleGetter}
                        localizer={localizer}
                        events={events}
                        step={60}
                        defaultDate={defaultDate}
                        startAccessor="start"
                        endAccessor="end"
                        popup={false}
                        style={{ height: 750 }}
                    // messages={messages}
                    />
                </div>
            </div>
        </>
    );
};

export default Index;
