import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

// define your typings for the store state
export interface State {
  calendar: Array<Calendar>;
  userData: Array<UserData>;
  workedWeekends: Array<Calendar>;
  workedWeekdays: Array<Calendar>;
  sickDays: Array<Calendar>;
  vacationDays: Array<Calendar>;
  holidays: Array<Calendar>;
  workedHolidays: Array<Calendar>;
}

interface Calendar {
  dayName: string;
  calendarDay: string;
  calendarMonth: string;
  calendarYear: string;
  status: string;
  shift: string;
  hours: number;
  holiday: boolean;
}

interface UserData {
  stundenLohn: number;
  überstundenGBZ: number;
  zweiteSchicht: number;
  dritteSchicht: number;
  gsZulagen: number;
  ufLohn: number;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    calendar: [],
    userData: [
      {
        stundenLohn: 13.88,
        überstundenGBZ: 16.25,
        zweiteSchicht: 0.47,
        dritteSchicht: 2.16,
        gsZulagen: 0.55,
        ufLohn: 3.8,
      },
    ],
    workedWeekends: [],
    workedWeekdays: [],
    sickDays: [],
    vacationDays: [],
    holidays: [],
    workedHolidays: [],
  },
  getters: {
    getCalendar(state) {
      return state.calendar;
    },
    getWorkedWeekends(state) {
      let hours = 0;
      state.workedWeekends.forEach((day) => {
        if (day.dayName === "Samstag") {
          hours = hours + day.hours * 1.5;
        } else if (day.dayName === "Sonntag") {
          hours = hours + day.hours * 2;
        }
      });
      return hours;
    },
    getWorkedWeekDays(state) {
      let hours = 0;
      state.workedWeekdays.forEach((day) => {
        if (day.holiday === false) {
          hours = hours + day.hours;
        } else return;
      });
      return hours;
    },
    getWorkedHolidayHours(state) {
      let hours = 0;
      state.workedHolidays.forEach((day) => {
        hours = hours + day.hours;
      });
      return hours;
    },
    getVacationHours(state) {
      let hours = 0;
      state.vacationDays.forEach((day) => {
        if (day.dayName !== "Samstag" && day.dayName !== "Sonntag") {
          hours = hours + day.hours;
        } else return;
      });
      return hours;
    },
    getSickHours(state) {
      let hours = 0;
      state.sickDays.forEach((day) => {
        if (day.dayName !== "Samstag" && day.dayName !== "Sonntag") {
          hours = hours + day.hours;
        }
      });
      return hours;
    },
  },
  actions: {
    createCalendar(context) {
      const weekdays = [
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
        "Sonntag",
      ];
      const date = new Date();

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const firstDayofMonth = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const dateString = firstDayofMonth.toLocaleDateString("de-AT", {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);
      let dayIteration = 0;
      const dataArray = [];

      for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        if (i > paddingDays) {
          dayIteration = dayIteration + 1;
          const monthData = new Date(
            year,
            month - 1,
            dayIteration
          ).toLocaleDateString("de-AT", {
            weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
          const monthDataArray = monthData.split(", ");
          const calendarData = monthDataArray[1].split(".");
          const dayData = {
            dayName: monthDataArray[0],
            calendarDay: calendarData[0],
            calendarMonth: calendarData[1],
            calendarYear: calendarData[2],
            status: "",
            shift: "",
            hours: 7.7,
            holiday: false,
          };
          dataArray.push(dayData);
        }
      }
      const notNeededDate = dataArray.pop();
      context.commit("setCalendar", dataArray);
    },
    calculateHours(context) {
      const weekends: Array<Calendar> = [];
      const weekdays: Array<Calendar> = [];
      const sickdays: Array<Calendar> = [];
      const vacationdays: Array<Calendar> = [];
      const holiDays: Array<Calendar> = [];
      const workedHolidays: Array<Calendar> = [];
      context.state.calendar.map((day) => {
        if (day.holiday === true && day.status !== "worked") {
          holiDays.push(day);
        } else if (
          day.holiday === true &&
          day.status === "worked" &&
          day.dayName !== "Samstag" &&
          day.dayName !== "Sonntag"
        ) {
          workedHolidays.push(day);
        } else if (
          (day.dayName === "Samstag" || day.dayName === "Sonntag") &&
          day.status === "weekend"
        ) {
          return;
        } else if (
          (day.dayName === "Samstag" || day.dayName === "Sonntag") &&
          day.status === "worked"
        ) {
          weekends.push(day);
        } else if (day.status === "sick") {
          sickdays.push(day);
        } else if (day.status === "vacation") {
          vacationdays.push(day);
        } else if (day.status === "worked") {
          weekdays.push(day);
        }
      });
      context.state.workedWeekends = weekends;
      context.state.workedWeekdays = weekdays;
      context.state.sickDays = sickdays;
      context.state.vacationDays = vacationdays;
      context.state.holidays = holiDays;
      context.state.workedHolidays = workedHolidays;
    },
  },
  mutations: {
    setCalendar(state, payload) {
      state.calendar = payload;
    },
    sortCalendar(state) {
      for (const day of state.calendar) {
        const dayData = day.calendarDay + "." + day.calendarMonth;
        if (
          dayData === "1.1" ||
          dayData === "6.1" ||
          dayData === "5.4" ||
          dayData === "1.5" ||
          dayData === "13.5" ||
          dayData === "24.5" ||
          dayData === "15.8" ||
          dayData === "26.10" ||
          dayData === "1.11" ||
          dayData === "8.12" ||
          dayData === "25.12" ||
          dayData === "26.12"
        ) {
          day.holiday = true;
          day.status = "vacation";
        } else if (day.dayName === "Samstag" || day.dayName === "Sonntag") {
          day.status = "weekend";
          day.shift = "";
        } else continue;
      }
    },
  },
});
