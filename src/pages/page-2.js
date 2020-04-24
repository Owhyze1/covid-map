// Novel Covid API
// https://corona.lmao.ninja/docs/#/Countries/get_countries

import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios';

import Layout from 'components/Layout';
import Map from 'components/Map';
import States from 'assets/state-coords';

const LOCATION = {
  lat: 0,
  lng: 0
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

const SecondPage = () => {

  async function mapEffect({ leafletElement : map } = {}) {
    if (!map) return;

    let response;

    try {
      response = await axios.get('https://corona.lmao.ninja/states');
    } catch (e) {
      console.log('Error obtaining states data', e);
      return;
    }
    console.log('United States', response);

    const { data = [] } = response;
    const hasData = Array.isArray(data) && data.length > 0;

    if (!hasData) return;

    const geoJson = {
      type: 'FeatureCollection',
      features: data.map((stateInfo = {}) => {
        const { state } = stateInfo;
        const { latitude, longitude } = States[state];



        return {
          type: 'Feature',
          properties: {
            ...stateInfo,
          },
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        }
      })
    }

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        // let updatedFormatted;
        let casesString;

        const {
          state,
          cases,
          todayCases,
          deaths,
          todayDeaths,
          // tests,
          testsPerMillion
        } = properties


      casesString = `${cases}`;
      if ( cases > 1000 )
        casesString = `${casesString.slice(0, -3)}k+`

        const html =
        `<span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${state}</h2>
              <ul>
                <li><strong>Total Cases:</strong> ${cases}</li>
                <li><strong>Today's Cases:</strong> ${todayCases}</li>
                <li><strong>Total Deaths:</strong> ${deaths}</li>
                <li><strong>Today's Deaths:</strong> ${todayDeaths}</li>
                <li><strong>Tests Per Million:</strong> ${testsPerMillion}</li>
              </ul>
            </span>
            ${ casesString }
          </span>`;

          return L.marker( latlng, {
            icon: L.divIcon({
              className: 'icon',
              html
            }),
            riseOnHover: true
          });
        }
    });

    geoJsonLayers.addTo(map);
  }







  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="two">
      <Helmet>
        <title>United States</title>
      </Helmet>
      <Map {...mapSettings} />
    </Layout>
  );
}

export default SecondPage;
