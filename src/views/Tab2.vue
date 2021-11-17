<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Lohn mit dem {{counter}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">counter</ion-title>
        </ion-toolbar>
      </ion-header>
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { useStore } from 'vuex'
import { key } from '../store/index'
import { computed } from '@vue/reactivity';


export default  {
  setup() {
    const store = useStore(key)


  const counter = computed((): number =>  {
    return store.getters.getCount
  })

  const increment = (value: number) => {
    store.commit("incrementCount", value)
  }


    return {
      counter,
      increment
    }
  },
  
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage }
}
</script>