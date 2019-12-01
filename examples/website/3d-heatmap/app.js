import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
// import * as d3 from "d3";
import Papa from 'papaparse'
import * as d3 from 'd3'

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// Source data CSV
const DATA_URL =
  'https://raw.githubusercontent.com/pillows/wifi-nyc/master/NYC_Wi-Fi_Hotspot_Locations_Lat_Lon.csv'; // eslint-disable-line

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51]
};

// const INITIAL_VIEW_STATE = {
//   longitude: 40.7590,
//   latitude: -73.9844,
//   zoom: 6.6,
//   minZoom: 5,
//   maxZoom: 15,
//   pitch: 40.5,
//   bearing: -27.396674584323023
// };
const INITIAL_VIEW_STATE = {
  longitude: -73.9844,
  latitude: 40.7590,
  zoom: 12,
  minZoom: 5,
  maxZoom: 15,
  pitch: 40.5,
  bearing: 0
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

let coordinates = []
const elevationScale = {min: 1, max: 50};

Papa.parse("https://raw.githubusercontent.com/pillows/wifi-nyc/master/NYC_Wi-Fi_Hotspot_Locations_Lat_Lon.csv", {
  download: true,
  dynamicTyping: true,
  header: false,
  columns: ["lat","lon"],
  complete: function(results) {
    // console.log(results);
    // delete results.data[0]
    results.data.map(element => {
      // console.log(element)
      const temp_lat = element[0]
      element[0] = element[1]
      element[1] = temp_lat
    })
    // console.log(results.data)
    coordinates = results.data
  }
});
// let coord_arr = () => {
//   return new Promise((resolve, reject) => {
//     Papa.parse("https://raw.githubusercontent.com/pillows/wifi-nyc/master/NYC_Wi-Fi_Hotspot_Locations_Lat_Lon.csv", {
//       download: true,
//       complete: function(results) {
//         // console.log(results);
//         resolve(results)
//       }
//     });
//   })
  
// }

// var coordinates = [1]

// let get_coordinates = async () =>{
//   const test = await coord_arr()
//   // console.log("test",test)
//   coordinates = test
//   return await coord_arr()
// }





/* eslint-disable react/no-deprecated */
export default class App extends Component {
  static get defaultColorRange() {
    return colorRange;
  }

  constructor(props) {
    super(props);
    this.state = {
      elevationScale: elevationScale.min
    };
  }

  _renderLayers() {
    const {data, radius = 1, upperPercentile = 100, coverage = 1} = this.props;
// 	// console.log("heatmap",await coord_arr());
//     (async () => {
//   // console.log(await get_coordinates())
//   coordinates = await get_coordinates()
// })()
//     console.log(coordinates)
  // console.log(await d3.csv(DATA_URL))
  

  const data2 = [[-73.871349,40.87301]]
  coordinates.splice(0,1)
  // console.log("cor",coordinates)
    return [
      new HexagonLayer({
        id: 'heatmap',
        colorRange,
        coverage,
        data:coordinates,
        elevationRange: [0, 200],
        elevationScale: data && data.length ? 25 : 0,
        extruded: true,
        getPosition: d => d,
        onHover: this.props.onHover,
        pickable: Boolean(this.props.onHover),
        radius:100,
        upperPercentile,
        material,
        opacity:1,

        transitions: {
          elevationScale: 30
        }
      })
    ];
  }

  render() {
    const {mapStyle = 'mapbox://styles/mapbox/dark-v9'} = this.props;

    return (
      <DeckGL
        layers={this._renderLayers()}
        effects={[lightingEffect]}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </DeckGL>
    );
  }
}

export function renderToDOM(container) {
  render(<App />, container);

  require('d3-request').csv(DATA_URL, (error, response) => {

      // console.log("sdasdasd")
    if (!error) {
      const data = response.map(d => [Number(d.lon), Number(d.lat)]);
      render(<App data={data} />, container);
    }
  });
}
