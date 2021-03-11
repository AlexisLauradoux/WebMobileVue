<template>
  <v-card>
    <v-textarea v-model="write"></v-textarea>
    <v-btn @click="addComment(write)">Ajout de commentaire</v-btn>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: function() {
    return {write: ""}
  },
  methods: {
    ...mapActions(["addComment"]),
  },
};
</script>

<style>
</style>