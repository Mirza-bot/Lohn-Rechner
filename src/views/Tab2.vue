<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title
          >{{ calendar[0].calendarMonth }}.{{ calendar[0].calendarYear }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="1.7" class="weekdays">Mo</ion-col>
          <ion-col size="1.7" class="weekdays">Di</ion-col>
          <ion-col size="1.7" class="weekdays">Mi</ion-col>
          <ion-col size="1.7" class="weekdays">Do</ion-col>
          <ion-col size="1.7" class="weekdays">Fr</ion-col>
          <ion-col size="1.7" class="weekdays">Sa</ion-col>
          <ion-col size="1.7" class="weekdays">So</ion-col>
        </ion-row>
        <ion-row>
          <ion-col
            :class="dayStatus(day.status)"
            size="1.7"
            v-for="day in calendar"
            :key="calendar.indexOf(day)"
            @click="
              marker($event.currentTarget.firstChild.firstChild.innerText)
            "
          >
            <ul>
              <li>
                {{ day.calendarDay }}
              </li>
              <li>
                <ion-badge class="shift_badge" color="dark">{{
                  day.shift
                }}</ion-badge>
              </li>
              <li v-show="day.holiday"><p>F</p></li>
            </ul>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
          <ion-icon :icon="arrowBackCircle"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="start">
          <ion-fab-button>
            <ion-icon
              class="sick_status"
              :icon="medkit"
              size="large"
              @click="markerSwitch('sick')"
            ></ion-icon
          ></ion-fab-button>
          <ion-fab-button
            ><ion-icon
              :icon="airplane"
              size="large"
              class="vacation_status"
              @click="markerSwitch('vacation')"
            ></ion-icon>
          </ion-fab-button>
          <ion-fab-button @click="markerSwitch('S1')">S1 </ion-fab-button>
          <ion-fab-button @click="markerSwitch('S2')">S2 </ion-fab-button>
          <ion-fab-button @click="markerSwitch('S3')">S3 </ion-fab-button>
          <ion-fab-button
            ><ion-icon
              :icon="trash"
              size="large"
              @click="markerSwitch('trash')"
            ></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCol,
  IonGrid,
  IonRow,
  IonBadge,
  IonFab,
  IonFabList,
  IonFabButton,
  IonIcon,
} from "@ionic/vue";
import {
  arrowBackCircle,
  arrowForwardCircle,
  arrowUpCircle,
  medkit,
  airplane,
  trash,
  person,
  settings,
  share,
} from "ionicons/icons";
import { useStore } from "vuex";
import { key } from "../store/index";
import { computed } from "@vue/reactivity";

export default {
  setup() {
    const store = useStore(key);

    // Marker-Switch for calendar
    let mode = "none";

    function setCalendar() {
      store.dispatch("createCalendar");
    }

    function sortCalendar() {
      store.commit("sortCalendar");
    }

    const calendar = computed(() => {
      setCalendar();
      sortCalendar();
      return store.getters.getCalendar;
    });

    const dayStatus = (payload: string) => {
      if (payload === "worked") {
        return "worked_status";
      } else if (payload === "sick") {
        return "sick_status";
      } else if (payload === "weekend") {
        return "weekend_status";
      } else if (payload === "vacation") {
        return "vacation_status";
      } else return "no_status";
    };

    const marker = (target: string) => {
      calendar.value.forEach((day: any) => {
        if (
          day["calendarDay"] === target &&
          (day["dayName"] === "Samstag" || day["dayName"] === "Sonntag") &&
          mode === "trash"
        ) {
          day["status"] = "weekend";
          day["shift"] = "";
        } else if (day["calendarDay"] === target && mode === "trash") {
          day["status"] = "";
          day["shift"] = "";
        } else if (
          day["calendarDay"] === target &&
          day["status"] !== mode &&
          (mode === "vacation" || mode === "sick")
        ) {
          day["status"] = mode;
          day["shift"] = "";
        } else if (day["calendarDay"] === target && day["status"] === mode) {
          day["status"] = "";
        } else if (
          day["calendarDay"] === target &&
          day["shift"] !== mode &&
          (mode === "S1" || mode === "S2" || mode === "S3")
        ) {
          day["shift"] = mode;
          day["status"] = "worked";
        } else if (day["calendarDay"] === target && day["shift"] === mode) {
          day["shift"] = "";
          day["status"] = "";
        }
      });
      store.dispatch("calculateHours")
      store.dispatch("calculateSalary")
      store.dispatch("calcWeekendHours")
      store.dispatch("calcHolidaySalary")
      store.dispatch("calcWorkedHoliday")
    };

    const markerSwitch = (payload: string) => {
      mode = payload;
    };

    return {
      calendar,
      dayStatus,
      marker,
      markerSwitch,
      arrowBackCircle,
      arrowForwardCircle,
      arrowUpCircle,
      person,
      settings,
      share,
      medkit,
      airplane,
      trash,
    };
  },

  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonCol,
    IonGrid,
    IonRow,
    IonBadge,
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList,
  },
};
</script>

<style scoped>
ion-col.weekdays {
  background: white;
  color: black;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}

ion-col.no_status {
  background: white;
  color: black;
  display: flex;
  border: 1px solid black;
  min-height: 12vh;
}

ion-col.worked_status {
  background: #2dd36f;
  color: white;
  display: flex;
  border: 1px solid black;
  min-height: 12vh;
}

ion-col.sick_status {
  background: rgb(218, 96, 96);
  color: black;
  display: flex;
  border: 1px solid black;
  min-height: 12vh;
}

ion-icon.sick_status {
  color: rgb(218, 96, 96);
}

ion-col.vacation_status {
  background: #3dc2ff;
  color: white;
  display: flex;
  border: 1px solid black;
  min-height: 12vh;
}

ion-icon.vacation_status {
  color: #39bffd;
}

ion-col.weekend_status {
  background: #ffffff3b;
  color: white;
  display: flex;
  border: 1px solid black;
  min-height: 12vh;
}

ion-col > ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

ion-col > ul > li {
  display: flex;
  justify-content: center;
  align-items: center;
}

ion-badge.shift_badge {
  width: 100%;
}
</style>
