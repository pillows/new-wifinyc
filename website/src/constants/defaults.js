export const MAPBOX_STYLES = {
  LIGHT: 'mapbox://styles/mapbox/dark-v10?optimize=true',
  DARK: 'mapbox://styles/mapbox/dark-v10?optimize=true',
  BLANK: {
    version: 8,
    sources: {},
    layers: []
  }
};

export const DEFAULT_MAP_STATE = {
  width: 0,
  height: 0,
  viewState: {
    latitude: -73.9844,
    longitude: 40.7590,
    zoom: 11,
    bearing: 0,
    pitch: 0
  }
};

export const DEFAULT_VIS_STATE = {
  owner: null,
  meta: {},
  data: null,
  params: {}
};

export const DEFAULT_APP_STATE = {
  headerOpacity: 1,
  isMenuOpen: false
};

export const DATA_URI = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/website';
