import axios from 'axios'

export const state = () => ({
  api_key: process.env.OPEN_WEATHER_MAP_API_KEY,
  url_base: process.env.OPEN_WEATHER_MAP_BASE_URL,
  query: '',
  weather: {},
  forecasts: [],
  today: ''
})

export const actions = {
  async setForecasts ({ commit }) {
    const { data } = await axios.get(
      `${this.state.url_base}forecast?q=${this.state.query}&units=metric&appid=${this.state.api_key}`
    )
    commit('SET_FORECASTS', data)
  },
  async setWeather ({ commit }) {
    const { data } = await axios
      .get(
        `${this.state.url_base}weather?q=${this.state.query}&units=metric&APPID=${this.state.api_key}`
      )
      .catch(() => {
        alert(
          'Unable to find forecast for this location, please try a different location'
        )
      })
    commit('SET_WEATHER', data)
  },
  // formatting today's date
  setToday ({ commit }) {
    let today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    today = yyyy + '-' + mm + '-' + dd
    commit('SET_TODAY', today)
  }
}

export const getters = {
  // filtering 3 hours of data
  threeHourlyToday: (state) => {
    const forecasts = state.forecasts
    return forecasts.filter(
      forecast => forecast.dt_txt.slice(0, 10) === state.today
    )
  },
  // Filter midday weather from 3 hours of data for the next 4 days except today
  dailyMidday: (state) => {
    const forecasts = state.forecasts
    return forecasts.filter(
      forecast =>
        forecast.dt_txt.slice(-8) === '12:00:00' &&
        forecast.dt_txt.slice(0, 10) !== state.today
    )
  }
}

export const mutations = {
  SET_WEATHER (state, value) {
    state.weather = value
  },
  SET_FORECASTS (state, value) {
    state.forecasts = value.list
  },
  updateQuery (state, query) {
    state.query = query
  },
  SET_TODAY (state, value) {
    state.today = value
  }
}
