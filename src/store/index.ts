import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

// define your typings for the store state
export interface State {
  count: number;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    count: 12,
  },
  getters: {
      getCount(state) {
          return state.count
      }
  },
  mutations: {
      incrementCount(state, payload: number) {
          state.count = state.count + payload
      }
  }
});
