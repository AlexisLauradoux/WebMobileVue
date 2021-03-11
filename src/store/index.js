import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire'
import { db } from '../components/connexion.js'


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: null
    },
    comments: [],
    favoris: [],
    playlist: [
      {
        id: 1,
        artist: 'Currents',
        title: 'Monsters',
        url: 'musics/Monsters.mp3',
        cover: 'Currents.jpg',
        favorite: false,
      },
      {
        id: 2,
        artist: 'Architects',
        title: 'Black Lungs',
        url: 'musics/Black Lungs.mp3',
        cover: 'Architects.jpg',
        favorite: false,
      },
      {
        id: 3,
        artist: 'Bring Me The Horizon',
        title: '1x1 (feat. Nova Twins)',
        url: 'musics/1x1 (feat. Nova Twins).mp3',
        cover: 'BMTH.jpg',
        favorite: false,
      },
    ],
  },
  getters: {
    user(state){
      return state.user
    }
  },
  mutations: {
     ...vuexfireMutations,
    ADD_COMMENTS ( state, comment )
    {
      state.comments = [...state.comments, { ...comment, id: state.comments.length }]
    },
    
    ADD_TO_FAVORITE ( state, song )
    {
      state.favoris = [...state.favoris, { ...song, id: state.favoris.length }]
    },
    REMOVE_TO_FAVORITE(state, key) {
      state.playlist[key].favorite = false;
      
    },
    ADD_PLAYLIST(state, song) {
      state.playlist = [...state.playlist, { ...song, id: state.playlist.length }]
    },
    LOAD_FAVORITES ( state, datas )
    {
      state.favoris = [...datas]
    },
    LOAD_COMMENTS ( state, datas )
    {
      state.comments = [...datas]
    },
    EDIT_COMMENTS ( state, datas )
    {
      state.comments[datas.id] =  datas 
    },
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    }
  },
  actions: {
    loadFavoris ( { commit } )
    {
      db.ref( '/favoris' ).on( 'value', (snap) =>
      {
        const data = snap.val();
         commit('LOAD_FAVORITES', data);
      })
    },
    loadComments ( { commit } )
    {
      db.ref( '/comments' ).on( 'value', (snap) =>
      {
        const data = snap.val();
         commit('LOAD_COMMENTS', data);
      })
    },
    addToFavorite ( { commit, state }, payload )
    {
      commit( 'ADD_TO_FAVORITE', payload );
      db.ref( '/favoris' ).set( state.favoris )
    },
    addComment ( { commit }, payload )
    {
      commit( 'ADD_COMMENTS', payload );
      const key = db.ref().child( 'comments' ).push().key;
      db.ref('comments').child( key ).update( { content: payload } );
    },
    editComment ( { commit }, payload )
    {
      commit( 'EDIT_COMMENTS', payload );
      db.ref('comments').child( payload.id ).update( { content: payload.content } );
    },
    
    removeToFavorite({ commit, state }, payload) {
      commit( 'REMOVE_TO_FAVORITE', payload );
      db.ref( '/favoris' ).set(state.favoris)
    },
    addToPlaylist({ commit }, song) {
      commit('ADD_PLAYLIST', song);
    },
    fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email
        });
      } else {
        commit("SET_USER", null);
      }
    }
  },
});
