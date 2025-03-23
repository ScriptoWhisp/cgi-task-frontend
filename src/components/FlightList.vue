<template>
  <div>
    <h1>Flight list</h1>
    <form @submit.prevent="searchFlights">
      <label>
        Destination:
        <input type="text" v-model="criteria.destination">
      </label>
      <label>
        Departure:
        <input type="text" v-model="criteria.departure">
      </label>
      <label>
        Departure date:
        <input type="date" v-model="criteria.departureDate">
      </label>
      <label>
        Price from:
        <input type="number" v-model.number="criteria.priceLow">
      </label>
      <label>
        Price to:
        <input type="number" v-model.number="criteria.priceHigh">
      </label>
      <button type="submit">Искать</button>
    </form>

    <button @click="generateFlights">Generate test data</button>

    <div v-if="loading">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="flight in flights" :key="flight.id">
          <span>
            {{ flight.departure }} - {{ flight.destination }} - {{ flight.departureTime }} - {{ flight.price }} €
          </span>
          <button @click="selectFlight(flight)">Choose</button>
        </li>
      </ul>
      <div v-if="totalPages > 1" class="pagination">
        <button @click="previousPage" :disabled="pageNo === 0">Prev</button>
        <span>Страница {{ pageNo + 1 }} из {{ totalPages }}</span>
        <button @click="nextPage" :disabled="pageNo >= totalPages - 1">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import flightService from '@/services/flightService';

export default {
  name: 'FlightList',
  data() {
    return {
      criteria: {
        destination: null,
        departure: null,
        departureDate: null,
        priceLow: null,
        priceHigh: null
      },
      flights: [],
      loading: false,
      pageNo: 0,
      pageSize: 5,
      totalPages: 0
    }
  },
  methods: {
    async searchFlights() {
      this.loading = true;
      try {
        const response = await flightService.getFlights(this.criteria, this.pageNo, this.pageSize);
        this.flights = response.data.content;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error('Error fetching flights', error);
      } finally {
        this.loading = false;
      }
    },
    async generateFlights() {
      try {
        await flightService.generateRandomFlights(3);
        this.pageNo = 0;
        this.searchFlights();
      } catch (error) {
        console.error('Error with flight generation', error);
      }
    },
    selectFlight(flight) {
      this.$router.push({ name: 'SeatSelection', params: { airplaneId: flight.airplaneId } });
    },
    nextPage() {
      if (this.pageNo < this.totalPages - 1) {
        this.pageNo++;
        this.searchFlights();
      }
    },
    previousPage() {
      if (this.pageNo > 0) {
        this.pageNo--;
        this.searchFlights();
      }
    }
  },
  mounted() {
    this.searchFlights();
  }
}
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.pagination button {
  margin: 0 5px;
}
</style>
