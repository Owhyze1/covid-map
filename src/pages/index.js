import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios';

import Layout from 'components/Layout';
import Map from 'components/Map';

import { addComma } from 'assets/format';

const LOCATION = {
  lat: 0,
  lng: 0
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;
// const MINIMUM_ZOOM = 1.5;

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
      response = await axios.get( 'https://corona.lmao.ninja/v2/countries?sort=country' );
    } catch ( e ) {
      console.log( 'Error receiving country data', e );
      return;
    }


    const { data = [] } = response;
    const hasData = Array.isArray( data ) && data.length > 0;

    if ( !hasData ) return;

    // console.log( 'API Countries Data: ', response );
    // console.log( 'Filtered Countries: ', data );

    // attach state data and GPS coordinates to each pointer
    const geoJson = {
      type: 'FeatureCollection',
      features: data.map(( country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;

        return {
          type: 'Feature',
          properties: {
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [ lng, lat ]
          }
        };
      })
    };

    // create pointers on Map with popup showing COVID data
    const geoJsonLayers = new L.GeoJSON( geoJson, {
      pointToLayer: ( feature = {}, latlng ) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;

        const {
          country,
          updated,
          active,
          cases,
          deaths,
          recovered,
          tests,
          todayCases,
          todayDeaths,
          testsPerOneMillion,
          casesPerOneMillion,
          deathsPerOneMillion,
          recoveredPerOneMillion
        } = properties;


        casesString = `${addComma(cases)}`;
        let len = casesString.length;

        if ( len > 3 && len < 8 )
          casesString = `${casesString.slice( 0, -4 )}k+`;
        else if ( len > 8 && len < 12 )
          casesString = `${casesString.slice(0, -8)}.${casesString.slice(-7, -6)}M`;



        if ( updated ){
          updatedFormatted = new Date( updated ).toLocaleString();
        }

        const html =
        `<span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li style="color:yellow"><strong>Active:</strong> ${addComma(active)}</li>
                <li><strong>Confirmed:</strong> ${addComma(cases)}</li>
                <li><strong>Deaths:</strong> ${addComma(deaths)}</li>
                <li><strong>Recovered:</strong> ${addComma(recovered)}</li>
                <li><strong>Tests:</strong> ${addComma(tests)}</li>
                <li>- - -</li>
                <li style="color:yellow"><strong>Today's Cases:</strong> ${addComma(todayCases)}</li>
                <li><strong>Today's Deaths:</strong> ${addComma(todayDeaths)}</li>
                <li>- - -</li>
                <li><strong>Tests Per Million:</strong> ${addComma(testsPerOneMillion)}</li>
                <li><strong>Cases Per Million:</strong> ${addComma(casesPerOneMillion)}</li>
                <li><strong>Deaths Per Million:</strong> ${addComma(deathsPerOneMillion)}</li>
                <li><strong>Recovered Per Million:</strong> ${addComma(recoveredPerOneMillion)}</li>
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
          riseOnHover: true,
        });
      }
    });

    geoJsonLayers.addTo( map );
  }


  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    // minZoom: MINIMUM_ZOOM,
    touchZoom: true,
    bounceAtZoomLimits: true,
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
