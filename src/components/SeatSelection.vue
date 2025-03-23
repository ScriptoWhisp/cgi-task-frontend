<template>
  <div>
    <h1>Seat selection for plane {{ airplaneId }}</h1>
    <div>
      <h2>Preference settings</h2>
      <form @submit.prevent="getRecommendations">
        <label>
          Price (max):
          <input type="number" v-model.number="criteria.price" min="0">
        </label>
        <label>
          Extra legroom:
          <input type="checkbox" v-model="criteria.extraLegroom">
        </label>
        <label>
          Near window:
          <input type="checkbox" v-model="criteria.nearWindow">
        </label>
        <label>
          Near exit:
          <input type="checkbox" v-model="criteria.nearExit">
        </label>
        <label>
          Seats count:
          <input type="number" v-model.number="criteria.seatsCount" min="1">
        </label>
        <button type="submit">Get recommendations</button>
      </form>
    </div>
    <div>
      <h2>Plane scheme</h2>
      <div class="seat-grid">
        <div v-for="(row, rowIndex) in seatSchema" :key="rowIndex" class="seat-row">
          <div
              v-for="seat in row"
              :key="seat ? seat.id : rowIndex + '-' + $index"
              class="seat"
              :class="{ recommended: seat && seat.isRecommended, occupied: seat && seat.isBooked }"
          >
            {{ seat && seat.label ? seat.label : (seat ? seat.row + '-' + seat.column : '') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import flightService from '@/services/flightService';

export default {
  name: 'SeatSelection',
  props: ['airplaneId'],
  data() {
    return {
      criteria: {
        price: null,
        extraLegroom: false,
        nearWindow: false,
        nearExit: false,
        seatsCount: 1
      },
      seatSchema: []
    }
  },
  methods: {
    async getRecommendations() {
      try {
        const response = await flightService.getSeatSchemaWithRecommendations(this.airplaneId, this.criteria);
        this.seatSchema = response.data;
      } catch (error) {
        console.error('Ошибка при получении схемы сидений', error);
      }
    }
  },
  mounted() {
    this.getRecommendations();
  }
}
</script>

<style scoped>
.seat-grid {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.seat-row {
  display: flex;
}

.seat {
  width: 40px;
  height: 40px;
  border: 1px solid #000;
  margin: 2px;
  text-align: center;
  line-height: 40px;
  color: #181818;
}

.recommended {
  background-color: #a0ffa0;
}

.occupied {
  background-color: #ffaaaa;
}
</style>
