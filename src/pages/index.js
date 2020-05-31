import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios';

import Layout from 'components/Layout';
import Map from 'components/Map';

const LOCATION = {
  lat: 0,
  lng: 0
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

const IndexPage = () => {


  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement : map } = {}) {
    if ( !map ) return;

    let response;

    try {
      response = await axios.get('https://corona.lmao.ninja/v2/countries?sort=country');
    } catch (e) {
      console.log('Error receiving country data', e);
      return;
    }
    console.log('Countries', response);

    const { data = [] } = response;
    const hasData = Array.isArray(data) && data.length > 0;

    if ( !hasData ) return;

    const geoJson = {
      type: 'FeatureCollection',
      features: data.map((country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;

        // console.log("Type of lat(countries): ", typeof lat);

        return {
          type: 'Feature',
          properties: {
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [ lng, lat ]
          }
        }
      })
    }

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;

        const {
          country,
          updated,
          cases,
          deaths,
          recovered
        } = properties

        casesString = `${cases}`;

        if (cases > 1000 && cases < 1000000){
          casesString = `${casesString.slice(0, -3)}k+`;
          // cases = addCommas(cases);
        }
        else if ( cases > 1000000){
          let firstDigit = casesString.charAt(0);
          let secondDigit = casesString.charAt(1);
          casesString = `${firstDigit}.${secondDigit}M`;
          // cases = addCommas(cases);
        }

        if ( updated ){
          updatedFormatted = new Date(updated).toLocaleString();
        }

        const html =
        `<span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${cases}</li>
                <li><strong>Deaths:</strong> ${deaths}</li>
                <li><strong>Recovered:</strong> ${recovered}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
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

  // function addCommas(number){
  //   let len = number.length;
  //   let start = len - 3;
  //   let end = len;
  //   let section = "";
  //   let output = "";
  //   let comma = ",";
  //
  //   while ( start >= 0 && len > 3 ){
  //     section = number.subString(start, end);
  //     output = comma + section + output;
  //     end = start;
  //     start -= 3;
  //   }
  //   return output;
  // }
  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };




  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {...mapSettings} />
    </Layout>
  );
};

export default IndexPage;
