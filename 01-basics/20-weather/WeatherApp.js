import { defineComponent, ref } from 'vue'
import { getWeatherData, WeatherConditionIcons } from './weather.service.ts'

export default defineComponent({
  name: 'WeatherApp',

  setup() {
    const curNight = (sunrise, dt) => {
      const parseTime = time => {
        const [hours, minutes] = time.split(':').map(item => +item)
        const date = new Date()
        date.setHours(hours, minutes, 0, 0)
        return date
      }

      const sunriseDate = parseTime(sunrise)
      const dtDate = parseTime(dt)

      return dtDate < sunriseDate
    }

    const weatherData = ref(getWeatherData())
    const hPaToMmHg = hPa => {
      return Math.round(hPa * 0.750062)
    }

    // onMounted(() => {
    //   weatherData.value = getWeatherData()
    // }) тут я хотела сделать через onMounted(), но тесты не прошли, и пришлось переписать

    return {
      weatherData,
      WeatherConditionIcons,
      hPaToMmHg,
      curNight,
    }
  },

  template: `
    <div>
      <h1 class="title">Погода в Средиземье</h1>

      <ul class="weather-list unstyled-list">
        <li class="weather-card" 
        v-for="card in weatherData"
        :class="{'weather-card--night': curNight(card.current.sunrise, card.current.dt)}"
        >
          <div v-if="card.current.weather.main === 'Thunderstorm'" 
          class="weather-alert">
            <span class="weather-alert__icon">⚠️</span>
            <span  class="weather-alert__description">Королевская метеослужба короля Арагорна II: Предвещается наступление сильного шторма.</span>
          </div>
          <div>
            <h2 class="weather-card__name">
              {{ card.geographic_name }}
            </h2>
            <div class="weather-card__time">
            {{ card.current.dt }}
            </div>
          </div>
          <div class="weather-conditions">
            <div class="weather-conditions__icon" :title="card.current.weather.description"> {{ WeatherConditionIcons[card.current.weather.id] }}</div>
            <div class="weather-conditions__temp">{{ (card.current.temp - 273.15).toFixed(1) }} °C</div>
          </div>
          <div class="weather-details">
            <div class="weather-details__item">
              <div class="weather-details__item-label">Давление, мм рт. ст.</div>
              <div class="weather-details__item-value">{{ hPaToMmHg(card.current.pressure) }} </div>
            </div>
            <div class="weather-details__item">
              <div class="weather-details__item-label">Влажность, %</div>
              <div class="weather-details__item-value">{{ card.current.humidity }}</div>
            </div>
            <div class="weather-details__item">
              <div class="weather-details__item-label">Облачность, %</div>
              <div class="weather-details__item-value">{{ card.current.clouds }}</div>
            </div>
            <div class="weather-details__item">
              <div class="weather-details__item-label">Ветер, м/с</div>
              <div class="weather-details__item-value">{{ card.current.wind_speed }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  `,
})
