import axios from 'axios';
import {pgCleanString} from "./postgres-lib";

const mapquestKey = process.env.MAPQUEST_API_KEY

export const geocode = async (address) => {
  const { street, city, state, country, postalCode } = address;

  const baseUrl = 'http://www.mapquestapi.com/geocoding/v1/address';
  const queryStr = [
    `key=${mapquestKey}`,
    `street=${street}`,
    `city=${city}`,
    `state=${state}`,
    `country=${country}`,
    `postalCode=${postalCode}`,
    'maxResults=1'
  ].join('&');
  const geocodeUrl = `${baseUrl}?${queryStr}`;

  try {
    let response = await axios.get(geocodeUrl);
    const { info, options, results } = response.data;
    const { providedLocation, locations } = results[0];
    // console.log({address, geocodeUrl, info, options, results, providedLocation, locations});
    // TODO: handle more than one location
    return locations[0];
  } catch (e) {
    return Promise.reject(e);
  }
}
