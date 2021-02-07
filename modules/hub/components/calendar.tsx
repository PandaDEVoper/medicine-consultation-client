import React, { useState, useEffect } from "react";
import HubController from "../controllers/hub-controller";
import { useInjection, TYPES } from "container";

type Props = {
    isOpen?: boolean;
    minWidth?: string;
    maxWidth?: string;
    startedFromSun?: boolean;
    months?: string[];
    weekdays?: string[];
    minYear?: number;
    maxYear?: number;
    confirmMessage?: string;
    clearMessage?: string;
    onDayClick?: (date: Date) => void;
};

type DateObj = {
    disable: boolean;
    weekday: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun" | string;
    date: Date;
}


const Calendar: React.FC<Props> = (props: Props) => {
    const controller = useInjection<HubController>(TYPES.hubController);

    // Props
    const weekdays = props.weekdays ?? ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const startedFromSun = props.startedFromSun ?? false;
    const months = props.months ?? ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const isOpen = props.isOpen ?? true;
    useEffect(() => {
        controller.setDate(selectedDate)
    }, []);
    const formatedSelectedDate = () => {
        let date = selectedDate;

        if (selectedDate.getFullYear() === 1000) {
            date = new Date();
        }

        let day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString();

        if (day.length === 1) {
            day = "0" + day;
        }

        if (month.length === 1) {
            month = "0" + month;
        }


        return `${day} / ${month} / ${date.getFullYear()}`
    }

    const getDates = (year: number, month: number): Array<DateObj> => {

        let dates: DateObj[] = [];

        const firstDay = new Date(year, month, 1);

        // Before
        const need = firstDay.getDay();
        const dayInLastMonth = new Date(year, month, 0).getDate();
        for (let i = dayInLastMonth - need + 1; i <= dayInLastMonth; i++) {
            const date = new Date(year, month - 1, i);
            const obj: DateObj = {
                date: date,
                disable: true,
                weekday: weekdays[date.getDay()],
            }
            dates.push(obj)
        }

        // This month
        const dayAmount = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= dayAmount; i++) {
            const date = new Date(year, month, i);
            const obj: DateObj = {
                date: date,
                disable: false,
                weekday: weekdays[date.getDay()],
            }
            dates.push(obj);
        }

        // After
        const lastDay = dates[dates.length - 1].date;
        if (lastDay.getDay() !== 6) {
            const need2 = 6 - lastDay.getDay();
            for (let i = 1; i <= need2; i++) {
                const date = new Date(year, month + 1, i);
                const obj: DateObj = {
                    date: date,
                    disable: true,
                    weekday: weekdays[date.getDay()],
                }
                dates.push(obj);
            }
        }



        return dates;
    }

    const compareDates = (date1: Date, date2: Date | null) => {
        if (!date2) return false;

        if (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) {
            return true
        } else {
            return false
        }
    }

    const getDatesFromMon = (year: number, month: number): Array<DateObj> => {

        let newDates = getDates(year, month);
        const firstEnable = newDates.find(e => !e.disable);

        if (firstEnable?.date.getDay() !== 0) {
            newDates.shift();
        } else {
            let beforeDates = [];
            const need = 6;
            const dayInLastMonth = new Date(year, month, 0).getDate();
            for (let i = dayInLastMonth - need + 1; i <= dayInLastMonth; i++) {
                const date = new Date(year, month - 1, i);
                const obj: DateObj = {
                    date: date,
                    disable: true,
                    weekday: weekdays[date.getDay()],
                }
                beforeDates.push(obj);
            }
            newDates = beforeDates.concat(newDates);
        }




        const last = new Date(newDates[newDates.length - 1].date);
        let newLast;
        if (newDates[newDates.length - 1].disable) {
            newLast = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
        } else {
            newLast = new Date(last.getFullYear(), last.getMonth() + 1, last.getDate() + 1);
        }

        newDates.push({
            date: newLast,
            disable: true,
            weekday: weekdays[newLast.getDay()],
        });



        const firstNextDisabled = newDates.slice(7).findIndex(e => e.disable);
        if (firstNextDisabled + 14 === newDates.length) {
            newDates = newDates.slice(0, firstNextDisabled + 7);
        }



        return newDates;

    }

    const groupByWeek = (thisDates: Array<DateObj>): Array<Array<DateObj>> => {
        const countWeeks = Math.ceil(thisDates.length / 7);

        let weeks = [];

        for (let i = 0; i < countWeeks; i++) {
            weeks.push(thisDates.slice(i * 7, (i + 1) * 7))
        }


        return weeks;
    }

    const goMonthForward = () => {

        if (monthIndex + 1 === 12) {
            setYear(year + 1);
        }

        setMonthIndex((monthIndex + 1) % 12)
        const newDates = startedFromSun ? getDates(year, (monthIndex + 1) % 12) : getDatesFromMon(year, (monthIndex + 1) % 12);
        setWeeks(groupByWeek(newDates));
    }

    const goMonthBackward = () => {
        if (monthIndex === 0) {
            setYear(year - 1);
        }


        if (monthIndex === 0) {
            setMonthIndex(11)
        } else {
            setMonthIndex(monthIndex - 1)
        }
        const newDates = startedFromSun ? getDates(year, Math.abs(monthIndex - 1) % 12) : getDatesFromMon(year, (monthIndex - 1) % 12);
        setWeeks(groupByWeek(newDates));
    }
    const findDate = (date1: Date, date2: Date) => {
        if (date1.getDate() + date1.getFullYear() + (date1.getMonth() + 1) == date2.getDate() + date2.getFullYear() + (date2.getMonth()+1)) {
            return true
        } else {
            return false
        }
    }

    const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(new Date(1000, 11, 21));
    const [dates] = useState(startedFromSun ? getDates(year, monthIndex) : getDatesFromMon(year, monthIndex));
    const [weeks, setWeeks] = useState(groupByWeek(dates));

    const styles = {
        calendarContainer: {
            minWidth: props.minWidth,
            maxWidth: props.maxWidth,
        }
    }
    const onDayClick = function (date: Date) {
        controller.setDate(date);
    };
    let highlightDates: Date[];
    if(controller.arrDates !== undefined){
        highlightDates = controller.arrDates.map((e: any) => {
            return new Date(e)
        })
    }
    return <React.Fragment>
        <div className={`calendar-container ${!isOpen ? "calendar-container-disable" : ""}`} style={styles.calendarContainer}>
            <div className="right-sidebar-calendar">
                <div className="calendar-up-row">
                    <div className="left">
                        <i className="fa fa-angle-left" aria-hidden="true" onClick={goMonthBackward}></i>
                    </div>
                    <span className="month">{months[monthIndex]}&nbsp;{year}</span>
                    <div className="right">
                        <i className="fa fa-angle-right" aria-hidden="true" onClick={goMonthForward}></i>
                    </div>
                </div>
                <div className="weekdays">
                    <span id="mon" className="weekday">Пн</span>
                    <span id="tue" className="weekday">Вт</span>
                    <span id="wed" className="weekday">Ср</span>
                    <span id="thr" className="weekday">Чт</span>
                    <span id="fri" className="weekday">Пт</span>
                    <span id="sat" className="weekday">Сб</span>
                    <span id="sun" className="weekday">Вс</span>
                </div>
                <div className="days">
                    {
                        weeks.map((week, i) => {
                            return <div className="week" key={i}>
                                {
                                    week.map((day, i) => {
                                        let classes = `
                                            day
                                            ${day.disable ? "disable-day" : ""},
                                            ${compareDates(day.date, new Date()) ? "today" : ''},
                                            ${compareDates(day.date, selectedDate) ? "selected" : ''},
                                            ${highlightDates.map(date => {
                                                return findDate(day.date, date) ? "highlight-date" : ''
                                            })}
                                        `;
                                        return <span
                                            key={day.date.toString()}
                                            onClick={() => {setSelectedDate(day.date); onDayClick(day.date)}}
                                            className={classes}
                                            id={day.date.getDate().toString()}>
                                            {day.date.getDate()}
                                        </span>
                                    })
                                }
                            </div>
                        })
                    }
                </div>
            </div>
        </div>

    </React.Fragment>

}

export default Calendar;