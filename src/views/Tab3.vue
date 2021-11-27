<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="title">Berechnung</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-button color="success" expand="block" @click="recalculate"
        >Neuberechnug <ion-icon :icon="reloadCircleSharp"></ion-icon>
      </ion-button>
      <ion-list>
        <ion-item>
          <ion-list-header> Lohnberechnung: </ion-list-header>
        </ion-item>
        <ion-item>
          <ion-label>
            Grundlohn zzgl. 2- u. 3-Schicht:
            <span class="user_data">{{ baseSalary }}€</span>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label
            >Gefahren- u. Schmutzzulage:
            <span class="user_data">{{ allowances }}€</span>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label
            >Überstunden-Bezug:
            <span class="user_data"> {{ overtime }}€ </span></ion-label
          >
        </ion-item>
        <ion-item>
          <ion-label>
            Feiertags- und Urlaubsvergütung:
            <span class="user_data"> {{ holidaySalary }}€ </span>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-list>
        <ion-item>
          <ion-list-header> Stundenberechnung: </ion-list-header>
        </ion-item>
        <ion-item>
          <ion-label>
            WE-Stunden (zzgl. 50% u. 100%):
            <span class="user_data">{{ workedWeekends }}</span>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            Wochenstunden: <span class="user_data">{{ workedWeekDays }} </span>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            Feiertagsstunden: <span class="user_data">{{ holidays }} </span>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            Feiertagsstunden(gearbeitet):
            <span class="user_data">{{ workedHolidays }}</span>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            Urlaubsstunden: <span class="user_data">{{ vacationHours }}</span>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            Krankenstandsstunden: <span class="user_data">{{ sickHours }}</span>
          </ion-label>
        </ion-item>
      </ion-list>
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
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { reloadCircleSharp } from "ionicons/icons";
import { useStore } from "vuex";
import { key } from "../store/index";
import { computed } from "@vue/reactivity";

export default {
  name: "Tab3",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonListHeader,
    IonButton,
    IonIcon,
  },
  setup() {
    const store = useStore(key);

    const recalculate = () => {
      store.dispatch("calculateHours");
      store.dispatch("calculateSalary");
      store.dispatch("calcWeekendHours");
      store.dispatch("calcHolidaySalary");
      store.dispatch("calcWorkedHoliday");
    };

    const workedWeekends = computed(() => {
      return store.getters.getWorkedWeekends;
    });

    const workedWeekDays = computed(() => {
      return store.getters.getWorkedWeekDays;
    });

    const workedHolidays = computed(() => {
      return store.getters.getWorkedHolidayHours;
    });

    const holidays = computed(() => {
      return store.getters.getHolidays;
    });

    const vacationHours = computed(() => {
      return store.getters.getVacationHours;
    });

    const sickHours = computed(() => {
      return store.getters.getSickHours;
    });

    const baseSalary = computed(() => {
      return store.getters.getBaseSalary;
    });

    const allowances = computed(() => {
      return store.getters.getAllowances;
    });

    const overtime = computed(() => {
      return store.getters.getOvertimeSalary;
    });

    const holidaySalary = computed(() => {
      return store.getters.getHolidaySalary;
    });
    return {
      workedWeekends,
      workedWeekDays,
      workedHolidays,
      holidays,
      vacationHours,
      sickHours,
      baseSalary,
      allowances,
      overtime,
      holidaySalary,
      reloadCircleSharp,
      recalculate
    };
  },
};
</script>

<style scoped>
ion-list-header {
  background-color: white;
  color: black;
  font-size: 1.5rem;
}

.user_data {
  float: right;
}

ion-button {
  font-size: 1.3rem;
}

ion-title {
  font-size: 1.5rem;
}
</style>
