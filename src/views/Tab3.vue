<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Berechnung</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-card><span>Wochenendstunden: {{ workedWeekends }}</span></ion-card>
      <span>Wochenstunden: {{ workedWeekDays }}</span> <br>
      <span>Feiertagsstunden: {{workedHolidays}}</span> <br>
      <span>Urlaubsstunden: {{vacationHours}}</span> <br>
      <span>Krankenstandsstunden: {{sickHours}}</span>
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
  IonCard
} from "@ionic/vue";
import { useStore } from "vuex";
import { key } from "../store/index";
import { computed } from "@vue/reactivity";

export default {
  name: "Tab3",
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonCard },
  setup() {
    const store = useStore(key);

    const workedWeekends = computed(() => {
      return store.getters.getWorkedWeekends;
    });

    const workedWeekDays = computed(() => {
      return store.getters.getWorkedWeekDays;
    });

    const workedHolidays = computed(() => {
      return store.getters.getWorkedHolidayHours
    })

    const vacationHours = computed(() => {
      return store.getters.getVacationHours
    })

    const sickHours = computed(() => {
      return store.getters.getSickHours
    })

    return {
      workedWeekends,
      workedWeekDays,
      workedHolidays,
      vacationHours,
      sickHours
    };
  },
};
</script>


<style scoped>

ion-card > span {
  font-size: 1.3rem;
  color: white;
}

</style>