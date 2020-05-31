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

const LOCATION = {
  lat: 42,
  lng: -100
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 3.5;

const SecondPage = () => {

  // get API data
  async function mapEffect({ leafletElement : map } = {}) {
    if (!map) return;

    let response;

    try {
      response = await axios.get('https://corona.lmao.ninja/v2/states');
    } catch (e) {
      console.log('Error obtaining states data', e);
      return;
    }
    console.log('United States', response);

    const { data = [] } = response;
    const hasData = Array.isArray(data) && data.length > 0;

    if (!hasData) return;

    // remove data points from API data without GPS coordinates
    const { dataFiltered = data.filter(
      function( currentState ){
        return States.hasOwnProperty(currentState.state);
      }
    )} = data;

    const { unusedData = data.filter(
        function(currentState){
          return !States.hasOwnProperty(currentState.state);
      }
    )} = data;

    console.log("Filtered States Data: ", dataFiltered);
    console.log("Unused States data: ", unusedData);

    buildSideMenu(dataFiltered);

    const geoJson = {
      type: 'FeatureCollection',
      features: dataFiltered.map((stateInfo = {}) => {
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
        }
      })
    }

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let casesString;

        const {
          state,
          active,
          cases,
          todayCases,
          deaths,
          todayDeaths,
          tests,
          testsPerOneMillion
        } = properties

      casesString = `${cases}`;
      if ( cases > 1000 )
        casesString = `${casesString.slice(0, -3)}k+`

        const html =
        `<span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${state}</h2>
              <ul>
                <li><strong>Active Cases:</strong> ${active}</li>
                <li><strong>Total Cases:</strong> ${cases}</li>
                <li><strong>Today's Cases:</strong> ${todayCases}</li>
                <li><strong>Total Deaths:</strong> ${deaths}</li>
                <li><strong>Today's Deaths:</strong> ${todayDeaths}</li>
                <li><strong>Tests:</strong>${tests}</li>
                <li><strong>Tests Per Million:</strong> ${testsPerOneMillion}</li>
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

  function buildSideMenu(array){
      if (array === undefined ) return;

      for (var i = 0; i < array.length; i++){

        var stateName = array[i].state;
        var caseNumber = array[i].cases;

        if ( stateName !== undefined && caseNumber !== undefined ){
          var tr = document.createElement("tr");

          //if ( i % 2 === 0 ) tr.style.backgroundColor = "$blue-grey-100";

          tr.setAttribute('class', "rows");
          tr.insertCell(0).innerHTML = stateName;
          tr.insertCell(1).innerHTML = caseNumber;

          document.getElementById("states-list").appendChild(tr);
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
}

export default SecondPage;
