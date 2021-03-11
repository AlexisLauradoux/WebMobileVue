<template>
  <v-card class="mx-auto border-radius" elevation="6" min-width="325" width="450" color="teal lighten-5">
    <v-img height="250" :src="require('../assets/images/' + artist.cover)" />
    <v-card-title>{{ artist.artist }}</v-card-title>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["playlist"]),
    artist() {
      return this.playlist[this.$route.params.id - 1];
    },
  },
};
</script>
