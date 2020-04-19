import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import i18n, { selectedLocale } from '@/plugins/i18n'
import { preselectedCountry, selectedSlug } from '@/assets/countries'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locale: selectedLocale,
    country: preselectedCountry
  },
  mutations: {
    updateLocale(state, newLocale) {
      state.locale = newLocale
    },
    updateCountry(state, newCountry) {
      state.country = newCountry
    }
  },
  actions: {
    changeLocale({ commit }, newLocale) {
      i18n.locale = newLocale;
      commit('updateLocale', newLocale);
    },
    changeCountry({ commit }, newCountry) {
      selectedSlug.Slug = newCountry;
      commit('updateCountry', newCountry);
    }
  },
  plugins: [createPersistedState()]
})
