<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Nutzerdaten</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Nutzerdaten</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-text>
        <p>
          Geben Sie bitte die Daten aus ihrem Lohnzettel korrekt an, damit ihre
          Berechnung ein möglichst genaues Ergebnis liefert.
        </p>
      </ion-text>
      <ion-item>
        <ion-label position="stacked">Stundenlohn</ion-label>
        <ion-input type="number" v-model="stundenLohn"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Überstunden-Grundbezug</ion-label>
        <ion-input type="number" v-model="ügbz"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">2-Schichtzulage</ion-label>
        <ion-input type="number" v-model="zweiteSchicht"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">3-Schichtzulage</ion-label>
        <ion-input type="number" v-model="dritteSchicht"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Gefahren-/Schmutzzulage</ion-label>
        <ion-input type="number" v-model="gsZulage"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Urlaub-/Feiertagsvergütung</ion-label>
        <ion-input
          type="number"
          v-model="ufVergütung"
          @click="setUser"
        ></ion-input>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { key } from "@/store";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonInput,
  IonItem,
  IonText,
} from "@ionic/vue";
import { useStore } from "vuex";
import { computed, ref } from "@vue/reactivity";

export default {
  name: "Tab1",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonLabel,
    IonInput,
    IonItem,
    IonText,
  },
  setup() {
    const store = useStore(key);

    const stundenLohn = ref(0);
    const ügbz = ref(0);
    const zweiteSchicht = ref(0);
    const dritteSchicht = ref(0);
    const gsZulage = ref(0);
    const ufVergütung = ref(0);

    const setUser = computed(() => {
      store.commit("setUserData", {
        stundenLohn: stundenLohn.value,
        ügbz: ügbz.value,
        zweiteSchicht: zweiteSchicht.value,
        dritteSchicht: dritteSchicht.value,
        gsZulage: gsZulage.value,
        ufVergütung: ufVergütung.value
      });
    });

    return {
      stundenLohn,
      ügbz,
      zweiteSchicht,
      dritteSchicht,
      gsZulage,
      ufVergütung,
      setUser,
    };
  },
};
</script>
