import { Buffer } from "buffer";
import React from 'react';

export const setToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(process.env.REACT_APP_CLIENT_ID + ':' + process.env.REACT_APP_CLIENT_SECRET).toString('base64')),
    },
  });

  let token =  await response.json();

  localStorage.setItem('spotifyToken', token.access_token);
}

const fetchWebApi = async (endpoint, method, body) => {
  let token = localStorage.getItem('spotifyToken');

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });

  if (!res.ok){
    setToken();
  }

  return await res.json();
}

export const getAllGenres = async () => {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendation-genres
  let allGenres = await fetchWebApi(
    `v1/recommendations/available-genre-seeds`, 'GET'
  );
  return allGenres.genres;
}

export const searchGenre = async (q) => {
  let lowerCaseQuery = q.toLowerCase();
  let allGenres = await getAllGenres();
  let filteredGenres = allGenres.filter((genre) => genre.includes(lowerCaseQuery));
  return(filteredGenres);
}

export const searchArtist = async (q, offset) => {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/search
  let qencoded = encodeURI(q);
  let fetchedArtists = await fetchWebApi(
    `v1/search?q=${qencoded}&type=artist&offset=${offset}&limit=5`, 'GET'
  );
  return fetchedArtists.artists.items;
}

export const searchTrack = async (q, offset) => {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/search
  let qencoded = encodeURI(q);
  let fetchedTracks = await fetchWebApi(
    `v1/search?q=${qencoded}&type=track&offset=${offset}&limit=5`, 'GET'
  )
  return fetchedTracks.tracks.items;
}

const getSeedsGAT = (seeds) => {
    let genres_seed = "";
    let artists_seed = "";
    let tracks_seed = "";
    for (let seed of seeds){
        if (seed.type === "genre"){
            if (genres_seed !== ""){
                genres_seed += ",";
            } 
            genres_seed += seed.spotify_id;
        }
        else if (seed.type === "artist"){
            if (artists_seed !== ""){
                artists_seed += ",";
            }
            artists_seed += seed.spotify_id;
        }
        else{
            if (tracks_seed !== ""){
                tracks_seed += ",";
            }
            tracks_seed += seed.spotify_id;
        }
    }
    return [genres_seed, artists_seed, tracks_seed];
}

export const createPlaylist = async (seeds, min_bpm, max_bpm, limit) => {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/search
    const seeds_gat = getSeedsGAT(seeds);
    let genres_encoded = "";
    let artists_encoded = "";
    let tracks_encoded = "";
    if (seeds_gat.at(0) !== ""){
        genres_encoded = `&seed_genres=${encodeURI(seeds_gat.at(0))}`;
    }
    if (seeds_gat.at(1) !== ""){
        artists_encoded = `&seed_artists=${encodeURI(seeds_gat.at(1))}`;
    }
    if (seeds_gat.at(2) !== ""){
        tracks_encoded = `&seed_tracks=${encodeURI(seeds_gat.at(2))}`;
    }
    // console.log(`v1/recommendations?limit=20${artists_encoded}${genres_encoded}${tracks_encoded}&min_tempo=${min_bpm}&max_tempo=${max_bpm}'`);
    let generatedPlaylist = await fetchWebApi(
      `v1/recommendations?limit=${limit}${artists_encoded}${genres_encoded}${tracks_encoded}&min_tempo=${min_bpm}&max_tempo=${max_bpm}`, 'GET'
    );

    return generatedPlaylist.tracks;
}