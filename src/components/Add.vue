<template>
  <v-card
    width="1200"
    class="mx-auto border-radius"
    elevation="6"
    color="teal lighten-5"
  >
    <v-card-title>Ajouter une musique</v-card-title>

    <v-form v-model="valid" ref="form">
      <v-container>
        <v-row>
          <v-col md="3" sm="12">
            <v-text-field
              v-model="artist"
              :rules="artistRules"
              :counter="10"
              label="Artist name"
              required
            ></v-text-field>
          </v-col>

          <v-col md="3" sm="12">
            <v-text-field
              v-model="title"
              :rules="titleRules"
              :counter="10"
              label="Title"
              required
            ></v-text-field>
          </v-col>

          <v-col md="3" sm="12">
            <v-text-field
              v-model="cover"
              :rules="coverRules"
              :counter="10"
              label="cover"
              required
            ></v-text-field>
          </v-col>

          <v-col md="3" sm="12">
            <v-text-field
              v-model="url"
              :rules="urlRules"
              :counter="10"
              label="url"
              required
            ></v-text-field>
          </v-col>

          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
          >
            Validate
          </v-btn>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      valid: true,
      artist: "",
      artistRules: [
        (v) => !!v || "Artiste is required",
        (v) => v.length <= 10 || "Artiste must be less than 10 characters",
      ],

      title: "",
      titleRules: [
        (v) => !!v || "Title is required",
        (v) => v.length <= 10 || "Title must be less than 20 characters",
      ],
      url: "",
      urlRules: [
        (v) => !!v || "Url is required",
        // (v) => /^https/.test(v) || "Url must be https",
      ],

      cover: "",
      coverRules: [
        (v) => !!v || "Cover is required",
        // (v) => /^https/.test(v) || "Cover must be https",
      ],
    };
  },
  methods: {
    ...mapActions([
      "addToPlaylist", // map `this.increment()` to `this.$store.dispatch('increment')`
    ]),
    validate() {
      this.$refs.form.validate();
      this.addToPlaylist({
        id: 10,
        artist: this.artist,
        title: this.artist,
        url: this.url,
        cover: this.cover,
        favorite: false,
      });
      this.$router.push({ name: "home" });
    },
  },
  computed: {
    ...mapState(["playlist"]),
  },
};
</script>
