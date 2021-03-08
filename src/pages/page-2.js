// Novel Covid API
// https://corona.lmao.ninja/docs/#/Countries/get_countries

import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios';

import Layout from 'components/Layout';
import Map from 'components/Map';
import Container from 'components/Container';
import States from 'assets/state-coords';

import { addComma } from 'assets/format';

const LOCATION = {
  lat: 42,
  lng: -100
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 3.5;


const SecondPage = () => {

  // get API data
  async function mapEffect({ leafletElement : map } = {}) {
    if ( !map ) return;

    let response;

    try {
      response = await axios.get( 'https://corona.lmao.ninja/v2/states' );
    } catch ( e ) {
      console.log( 'Error obtaining states data', e );
      return;
    }


    const { data = [] } = response;
    const hasData = Array.isArray( data ) && data.length > 0;

    if ( !hasData ) return;

    // remove data points from API data without GPS coordinates
    const dataFiltered = data.filter(
      function( currentState ){
        return States.hasOwnProperty( currentState.state );
      }
    );

    // console.log( 'All US API Data', response );
    // console.log( 'Filtered: ', dataFiltered );

    buildSideMenu( dataFiltered );

    const geoJson = {
      type: 'FeatureCollection',
      // features: formattedData.map(( stateInfo = {}) => {
      features: dataFiltered.map(( stateInfo = {}) => {

        // coronavirus stats for each state
        const { state } = stateInfo;
        // GPS data for each state in API
        const { lat, lng } = States[state];

        // return stateInfo and GPS data for each point on map
        return {
          type: 'Feature',
          properties: {
            ...stateInfo,
          },
          geometry: {
            type: 'Point',
            coordinates: [ lng, lat ]
          }
        };
      })
    };

    const geoJsonLayers = new L.GeoJSON( geoJson, {
      pointToLayer: ( feature = {}, latlng ) => {
        const { properties = {} } = feature;
        let casesString;
        let updatedFormatted;

        let {
          updated,
          state,
          active,
          cases,
          todayCases,
          deaths,
          todayDeaths,
          tests,
          testsPerOneMillion,
          casesPerOneMillion,
          deathsPerOneMillion
        } = properties;

        casesString = `${addComma(cases)}`;
        let len = casesString.length;

        if ( len > 3 & len < 8 )
          casesString = `${casesString.slice( 0, -4 )}k+`;
        else if ( len > 8 && len < 12 )
          casesString = `${casesString.slice(0,-8)}.${casesString.slice(-7,-6)}M`;

        if ( updated )
          updatedFormatted = new Date( updated ).toLocaleString();

        const html =
        `<span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${state}</h2>
              <ul>
                <li style="color:yellow"><strong>Active:</strong> ${addComma(active)}</li>
                <li><strong>Confirmed:</strong> ${addComma(cases)}</li>
                <li><strong>Deaths:</strong> ${addComma(deaths)}</li>
                <li><strong>Tests:</strong>${addComma(tests)}</li>
                <li>- - -</li>
                <li style="color:yellow"><strong>Today's Cases:</strong> ${addComma(todayCases)}</li>
                <li><strong>Today's Deaths:</strong> ${addComma(todayDeaths)}</li>
                <li>- - -</li>
                <li><strong>Tests Per Million:</strong> ${addComma(testsPerOneMillion)}</li>
                <li><strong>Cases Per Million:</strong> ${addComma(casesPerOneMillion)}</li>
                <li><strong>Deaths Per Million:</strong> ${addComma(deathsPerOneMillion)}</li>

                <li><strong>Last Updated:</strong> ${updatedFormatted}</li>
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

    geoJsonLayers.addTo( map );
  }


  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  function buildSideMenu( array ){
    if ( array === undefined ) return;

    for ( var i = 0; i < array.length; i++ ){

      var stateName = array[i].state;
      var caseNumber = array[i].cases;//comma(array[i].cases.toString());

      if ( stateName !== undefined && caseNumber !== undefined ){
        var tr = document.createElement( 'tr' );

        tr.setAttribute( 'class', 'row' );
        tr.insertCell( 0 ).innerHTML = stateName;
        tr.insertCell( 1 ).innerHTML = addComma(caseNumber);

        document.getElementById( 'states-list' ).appendChild( tr );
      }
    }
  }

  // Javascript and HTML for page
  return (
    <Layout pageName="two">
      <Helmet>
        <title>United States</title>
      </Helmet>
      <Container className="map-grid">
        <Map {...mapSettings} />
        <div className="div-table">
          <table className="table">
            <thead>
              <tr>
                <th className="left-header">State</th>
                <th className="right-header">Cases</th>
              </tr>
            </thead>
            <tbody id="states-list"></tbody>
          </table>
        </div>
      </Container>
    </Layout>
  );
};

export default SecondPage;
