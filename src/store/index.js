import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import i18n, { selectedLocale } from '@/plugins/i18n'
import { preselectedCountry, selectedSlug } from '@/assets/countries'
import { preselectedProvinceRu, selectedSlugRu} from '@/assets/provincesRu';
import { preselectedProvinceUs, selectedSlugUs} from '@/assets/provincesUs';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locale: selectedLocale,
    country: preselectedCountry,
    provinceRu: preselectedProvinceRu,
    provinceUs: preselectedProvinceUs
  },
  mutations: {
    updateLocale(state, newLocale) {
      state.locale = newLocale
    },
    updateCountry(state, newCountry) {
      state.country = newCountry
    },
    updateProvinceRu(state, newProvinceRu) {
      state.provinceRu = newProvinceRu
    },
    updateProvinceUs(state, newProvinceUs) {
      state.provinceUs = newProvinceUs
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
    },
    changeProvinceRu({ commit }, newProvinceRu) {
      selectedSlugRu.Slug = newProvinceRu;
      commit('updateProvinceRu', newProvinceRu);
    },
    changeProvinceUs({ commit }, newProvinceUs) {
      selectedSlugUs.Slug = newProvinceUs;
      commit('updateProvinceUs', newProvinceUs);
    }
  },
  plugins: [createPersistedState()]
})
