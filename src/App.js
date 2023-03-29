import React, { useState } from "react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import axios from 'axios';

const placesLibrary = ["places"];
const API_ENDPOINT = 'https://localhost:3003/getWeatherDataNoAuth';


function App() {

  const [searchResult, setSearchResult] = useState("Result: none");
  let [myResultState, setMyResultState] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDb_IlfoL-TtU2auhkfP-Qe4sdxKawDnR8",
    libraries: placesLibrary
  });

  function onLoad(autocomplete) {
    setSearchResult(autocomplete);
  }

  async function onPlaceChanged() {
    if (searchResult != null) {
      const place = searchResult.getPlace();
      const name = place.name;
      const status = place.business_status;
      const formattedAddress = place.formatted_address;
      const lat = place.geometry.location.lat();
      const long = place.geometry.location.lng();
      // console.log(place);
      console.log(`Name: ${name}`);
      console.log(`Business Status: ${status}`);
      console.log(`Formatted Address: ${formattedAddress}`);
      console.log(`latitude longitude: ${lat} ${long}`);
      console.log(place);

      if(lat && long) {
        const weatherData = await axios.get(`${API_ENDPOINT}?latitude=${lat}&longitude=${long}`);
        console.log(weatherData);

        myResultState = setMyResultState([...weatherData.data.list]);

      }
    } else {
      alert("Please enter text");
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div id="searchColumn">
        <h2>Digita la città di cui vuoi conoscere il meteo</h2>
        <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
          <input
            type="text"
            placeholder="..."
            style={{
              boxSizing: 'border-box',
              border: '1px solid transparent',
              width: '240px',
              height: '32px',
              padding: '0 12px',
              borderRadius: '3px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              fontSize: '14px',
              outline: 'none',
              textOverflow: 'ellipses'
            }}
          />
        </Autocomplete>
        <p>
          {myResultState.map((user, index) => (
          <div key={index}>
              <span><strong>Orario di riferimento</strong>: {user.dt_txt}</span><br></br>
            <span><strong> Temp. prevista</strong>: {(user.main.temp - 273.15).toFixed(2)} °C</span><br></br>
            <span><strong> Percepita come</strong>: {(user.main.feels_like - 273.15).toFixed(2)} °C</span><br></br>
            <span><strong> Umidità</strong>: {(user.main.humidity)} %</span><br></br>
              <br></br><br></br>
          </div>
          ))}
        </p>
      </div>
    </div>
  );
}

export default App;