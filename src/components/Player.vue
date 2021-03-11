<template>
  <v-card
    class="mx-auto border-radius"
    min-width="225"
    width="650"
    color="pink"
    elevation="8"
  >
    <v-img height="250" :src="require('../assets/images/' + current.cover)" />
    <div class="px-6 py-4">
      <v-row class="d-flex justify-center">
        <v-col
          cols="3"
          class="d-flex justify-center flex-column align-center text-center"
        >
          <KnobControl
            :min="0"
            :max="1"
            :stepSize="0.1"
            :stroke-width="10"
            primary-color="#26A69A"
            secondary-color="#80CBC4"
            text-color="#26A69A"
            v-model="current.volume"
            @input="updateVolume"
          ></KnobControl>
        </v-col>
        <v-col
          class="d-flex justify-center flex-column align-center text-center"
        >
          <router-link
            class="headline teal--text font-weight-bold"
            :to="`/artist/${current.id}`"
            >{{ current.artist }}</router-link
          >
          <span class="title">{{ current.title }}</span>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-row class="d-flex justify-center align-center">
          <v-col cols="2" class="d-flex px-0 ml-3">
            <v-btn
              v-if="!playlist[current.id - 1].favorite"
              fab
              small
              class="ml-n3 mr-2"
              @click="addFavorite(current)"
            >
              <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn
              v-else
              fab
              small
              class="ml-n3 mr-2"
              @click="removeFavorite(current.id - 1)"
            >
              <v-icon color="red lighten-1">mdi-heart</v-icon>
            </v-btn>
            <v-btn fab small @click="openAndCloseOverlay">
              <v-icon>mdi-playlist-music</v-icon>
            </v-btn>
          </v-col>
          <v-col offset="2" class="d-flex justify-space-between">
            <v-btn fab small @click="backSong">
              <v-icon>mdi-skip-backward</v-icon>
            </v-btn>
            <v-btn v-if="!isPlay" fab small @click="playSong">
              <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-btn v-else fab small @click="stopSong">
              <v-icon>mdi-pause</v-icon>
            </v-btn>
            <v-btn fab small @click="nextSong">
              <v-icon>mdi-skip-forward</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </div>

    <!-- Favorites overlay -->

    <v-overlay class="no-border" :value="isFavoriteOverlay" opacity="0.8" light>
      <v-card
        width="350"
        color="teal lighten-5"
        class="mx-auto black--text border-radius pb-4"
        elevation="6"
        light
      >
        <v-card-title>
          <v-btn fab small @click="openAndCloseOverlay"
            ><v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-title class="mt-n4 headline font-weight-bold"
          >Mes favoris</v-card-title
        >
        <v-card-text v-if="favorites.length !== 0">
          <v-list-item v-for="favorite in favorites" :key="favorite.id">
            <v-list-item-icon>
              <v-btn fab small @click="removeFavorite(favorite.id - 1)">
                <v-icon color="red lighten-1">mdi-heart</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-content class="black--text">
              <v-list-item-title class="title font-weight-medium">{{
                favorite.artist
              }}</v-list-item-title>
              <v-list-item-title class="font-weight-light">{{
                favorite.title
              }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar>
              <v-img :src="require('../assets/images/' + favorite.cover)" />
            </v-list-item-avatar>
          </v-list-item>
        </v-card-text>
        <v-card-text v-else>
          <span class="title font-weight-medium"
            >Vous n'avez pas de favoris</span
          >
        </v-card-text>
      </v-card>
    </v-overlay>

    <v-slider
      height="10"
      color="teal lighten-1"
      track-color="teal lighten-4"
      class="px-4"
      v-model="trackProgression"
    />
    <div class="title px-4 mt-n3 mb-4">
      <span v-if="current.trackDuration">
        {{ current.currentTrackDuration }} / {{ current.trackDuration }}
      </span>
      <span v-else>00:00 / 00:00</span>
    </div>

    <Comments></Comments>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import KnobControl from "vue-knob-control";
import Comments from "./Comments";

export default {
  components: {
    KnobControl,
    Comments,
  },
  data() {
    return {
      isPlay: false,
      indexPlaylist: 0,
      isFavoriteOverlay: false,
      player: new Audio(),
      current: {
        id: "",
        sound: "",
        artist: "",
        volume: 0.5,
        cover: "",
        title: "",
        favorite: "",
        trackDuration: "",
        currentTrackDuration: 0,
        playerTimer: 0,
      },
    };
  },
  computed: {
    ...mapState(["playlist"]),
    favorites() {
      return this.playlist.filter((item) => item.favorite === true);
    },
    trackProgression: {
      get() {
        return (this.current.playerTimer / this.player.duration) * 100;
      },
      set(newValue) {
        return newValue;
      },
    },
  },
  watch: {
    indexPlaylist(val) {
      this.current.id = this.playlist[val].id;
      this.current.artist = this.playlist[val].artist;
      this.current.title = this.playlist[val].title;
      this.current.cover = this.playlist[val].cover;
      this.current.favorite = this.playlist[val].favorite;
      this.current.sound = require("@/assets/" + this.playlist[val].url);
      this.current.currentTrackDuration = 0;
      this.playSong();
    },
  },
  created() {
    this.current.id = this.playlist[this.indexPlaylist].id;
    this.current.artist = this.playlist[this.indexPlaylist].artist;
    this.current.title = this.playlist[this.indexPlaylist].title;
    this.current.cover = this.playlist[this.indexPlaylist].cover;
    this.current.favorite = this.playlist[this.indexPlaylist].favorite;
    this.current.sound = require("@/assets/" +
      this.playlist[this.indexPlaylist].url);
  },
  beforeDestroy() {
    this.stopSong();
  },
  methods: {
    playSong() {
      if (this.current.sound !== undefined) {
        this.isPlay = false;
        this.player.src = this.current.sound;
      }
      this.player.play();
      this.isPlay = true;
      this.addEvents();
    },
    addEvents() {
      this.player.addEventListener("timeupdate", () => {
        this.current.playerTimer = this.player.currentTime;
        this.current.trackDuration = this.formatTimer(this.player.duration);
        this.current.currentTrackDuration = this.formatTimer(
          this.current.playerTimer
        );
        this.current.percent =
          (this.current.playerTimer * 100) / this.current.trackDuration;
        this.isPlaying = true;
      });
      this.player.addEventListener(
        "ended",
        function () {
          this.nextSong();
        }.bind(this)
      );
    },
    formatTimer(seconds) {
      let minutes = parseInt(seconds / 60).toString();
      seconds = parseInt(seconds % 60).toString();
      let output = minutes >= 10 ? `${minutes}` : `0${minutes}`;
      output += seconds >= 10 ? `:${seconds}` : `:0${seconds}`;
      return output;
    },
    stopSong() {
      this.player.pause();
      this.isPlay = false;
    },
    nextSong() {
      this.indexPlaylist += 1;
      if (this.indexPlaylist >= this.playlist.length) {
        this.indexPlaylist -= 1;
      }
    },
    backSong() {
      this.indexPlaylist -= 1;
      if (this.indexPlaylist < 0) {
        this.indexPlaylist += 1;
      }
    },
    updateVolume() {
      this.player.volume = this.current.volume;
    },
    openAndCloseOverlay() {
      this.isFavoriteOverlay = !this.isFavoriteOverlay;
    },
    addFavorite(favorite) {
      this.$store.dispatch("addToFavorite", favorite);
    },
    removeFavorite(favorite) {
      this.$store.dispatch("removeToFavorite", favorite);
    },
  },
};
</script>

<style scoped>
.no-border {
  border-radius: 0;
}
</style>
