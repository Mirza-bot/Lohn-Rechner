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
  salary: number;
  overtimeSalary: number;
  overtimeHolidays: number;
  holidaySalary: number;
  offDaySalary: number;
  wholeSalary: number;
  allowances: number;
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
        stundenLohn: 0,
        überstundenGBZ: 0,
        zweiteSchicht: 0,
        dritteSchicht: 0,
        gsZulagen: 0,
        ufLohn: 0,
      },
    ],
    salary: 0,
    overtimeSalary: 0,
    overtimeHolidays: 0,
    holidaySalary: 0,
    offDaySalary: 0,
    wholeSalary: 0,
    allowances: 0,
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
      state.overtimeSalary = hours * state.userData[0].überstundenGBZ;
      return hours.toFixed(2);
    },
    getWorkedWeekDays(state) {
      let hours = 0;
      state.workedWeekdays.forEach((day) => {
        if (day.holiday === false) {
          hours = hours + day.hours;
        } else return;
      });
      return hours.toFixed(2);
    },
    getHolidays(state) {
      let hours = 0;
      state.holidays.forEach((day) => {
        hours = hours + day.hours;
      });
      return hours.toFixed(2);
    },
    getWorkedHolidayHours(state) {
      let hours = 0;
      state.workedHolidays.forEach((day) => {
        hours = hours + day.hours;
      });
      return hours.toFixed(2);
    },
    getVacationHours(state) {
      let hours = 0;
      state.vacationDays.forEach((day) => {
        if (day.dayName !== "Samstag" && day.dayName !== "Sonntag") {
          hours = hours + day.hours;
        } else return;
      });
      return hours.toFixed(2);
    },
    getSickHours(state) {
      let hours = 0;
      state.sickDays.forEach((day) => {
        if (day.dayName !== "Samstag" && day.dayName !== "Sonntag") {
          hours = hours + day.hours;
        }
      });
      return hours.toFixed(2);
    },
    getBaseSalary(state) {
        console.log(state.salary)
      return state.salary.toFixed(2);
    },
    getAllowances(state) {
      return state.allowances.toFixed(2);
    },
    getOvertimeSalary(state) {
        const hours = state.overtimeSalary + state.overtimeHolidays
      return hours.toFixed(2);
    },
    getHolidaySalary(state) {
      return state.holidaySalary.toFixed(2);
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
    calculateSalary(context) {
      let baseSalary = 0;
      let allowances = 0;
      context.state.workedWeekdays.forEach((day) => {
        allowances =
          allowances + day.hours * context.state.userData[0].gsZulagen;
        if (day.shift === "S1") {
          baseSalary =
            baseSalary + context.state.userData[0].stundenLohn * day.hours;
        } else if (day.shift === "S2") {
          baseSalary =
            baseSalary +
            (context.state.userData[0].stundenLohn +
              context.state.userData[0].zweiteSchicht) *
              day.hours;
        } else if (day.shift === "S3") {
          baseSalary =
            baseSalary +
            (context.state.userData[0].stundenLohn +
              context.state.userData[0].dritteSchicht) *
              day.hours;
        }
      });
      context.state.salary = baseSalary;
      context.state.allowances = allowances;
    },
    calcWeekendHours(context) {
      let overtimeSalary = 0;
      context.state.workedWeekends.forEach((day) => {
        if (day.shift === "S1" && day.dayName === "Samstag") {
          overtimeSalary =
            overtimeSalary +
            context.state.userData[0].überstundenGBZ * 1.5 * day.hours;
        } else if (day.shift === "S2" && day.dayName === "Samstag") {
          overtimeSalary =
            overtimeSalary +
            (context.state.userData[0].überstundenGBZ * 1.5 +
              context.state.userData[0].zweiteSchicht) *
              day.hours;
        } else if (day.shift === "S3" && day.dayName === "Samstag") {
          overtimeSalary =
            overtimeSalary +
            (context.state.userData[0].überstundenGBZ * 1.5 +
              context.state.userData[0].dritteSchicht) *
              day.hours;
        } else if (day.shift === "S1" && day.dayName === "Sonntag") {
          overtimeSalary =
            overtimeSalary +
            context.state.userData[0].überstundenGBZ * 2 * day.hours;
        } else if (day.shift === "S2" && day.dayName === "Sonntag") {
          overtimeSalary =
            overtimeSalary +
            (context.state.userData[0].überstundenGBZ * 2 +
              context.state.userData[0].zweiteSchicht) *
              day.hours;
        } else if (day.shift === "S3" && day.dayName === "Sonntag") {
          overtimeSalary =
            overtimeSalary +
            (context.state.userData[0].überstundenGBZ * 2 +
              context.state.userData[0].dritteSchicht) *
              day.hours;
        }
      });
      context.state.overtimeSalary = overtimeSalary;
    },
    calcHolidaySalary(context) {
      let holidayHours = 0;
      context.state.holidays.forEach((day) => {
        holidayHours =
          holidayHours + day.hours * context.state.userData[0].ufLohn;
      });
      context.state.vacationDays.forEach((day) => {
          holidayHours = holidayHours + day.hours * context.state.userData[0].ufLohn
      })
      context.state.holidaySalary = holidayHours;
    },
    calcWorkedHoliday(context) {
      let holidayHours = 0;
      context.state.workedHolidays.forEach((day) => {
        if (day.shift === "S1") {
          holidayHours =
            holidayHours + day.hours * context.state.userData[0].überstundenGBZ;
        } else if (day.shift === "S2") {
          holidayHours =
            holidayHours +
            day.hours *
              (context.state.userData[0].überstundenGBZ +
                context.state.userData[0].zweiteSchicht);
        } else if ( day.shift === "S3") {
            holidayHours = holidayHours + day.hours *
            (context.state.userData[0].überstundenGBZ +
              context.state.userData[0].dritteSchicht);
        }
      });
      context.state.overtimeHolidays = holidayHours
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
    setUserData(state, payload) {
        state.userData[0].stundenLohn = payload.stundenLohn
        state.userData[0].überstundenGBZ = payload.ügbz
        state.userData[0].zweiteSchicht = payload.zweiteSchicht
        state.userData[0].dritteSchicht = payload.dritteSchicht
        state.userData[0].gsZulagen = payload.gsZulage
        state.userData[0].ufLohn = payload.ufVergütung
    }
  },
});
