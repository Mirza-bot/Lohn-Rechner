import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

// define your typings for the store state
export interface State {
  calendar: Array<Calendar>;
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

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    calendar: [],
  },
  getters: {
    getCalendar(state) {
      return state.calendar;
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
            shift: "S3",
            hours: 7.7,
            holiday: false,
          };
          dataArray.push(dayData);
        }
      }
      const notNeededDate = dataArray.pop();
      context.commit("setCalendar", dataArray);
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
        } else continue;
      }
    },
  },
});
