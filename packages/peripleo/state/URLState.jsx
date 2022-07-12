// Initial URL hash on startup
const { hash } = window.location;

// Initial map view (first three args)
export const initialView = (hash.match(/\//g) || []).length < 3 ?
  {} : {
    zoom: parseFloat(hash.split('/')[1]),
    longitude: parseFloat(hash.split('/')[2]), 
    latitude: parseFloat(hash.split('/')[3]) 
  }

// Other initial state args
export const initialStateArgs = (hash.match(/\//g) || []).length !== 4 ?
  {} :
  Object.fromEntries(hash.substring(hash.lastIndexOf('/') + 1)
    .split('+')
    .map(t => t.split('=')));