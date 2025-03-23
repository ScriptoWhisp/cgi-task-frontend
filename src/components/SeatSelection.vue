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
              :key="seat ? seat.id : rowIndex + '-' + Math.random()"
              class="seat"
              :class="{
              recommended: seat && seat.isRecommended,
              occupied: seat && seat.isBooked,
            }"
          >
            <div v-if="seat" class="seat-content">
              <div class="seat-label">{{ seat.label ? seat.label : seat.row + '-' + seat.column }}</div>
              <div class="seat-price">{{ seat.price }} €</div>
              <div v-if="seat.extraLegroom" class="seat-legroom">legroom</div>
            </div>
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
        console.error('Error fetching schema', error);
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: #181818;
}

.seat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.seat-label {
  font-size: 12px;
  line-height: 1.2;
}

.seat-price {
  font-size: 10px;
  line-height: 1.1;
}
.seat-legroom {
  font-size: 7px;
  line-height: 1.1;
}

.recommended {
  background-color: #a0ffa0;
}

.occupied {
  background-color: #ffaaaa;
}
</style>
