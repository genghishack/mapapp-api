import axios from 'axios';
import {logDebug} from "./logging-lib";
import {reject} from "./error-lib";

const mapquestKey = process.env.MAPQUEST_API_KEY

export const geocode = async (address) => {
  const { street_1, street_2, city, state, country, postalCode } = address;

  const baseUrl = 'http://www.mapquestapi.com/geocoding/v1/address';
  const queryStr = [
    `key=${mapquestKey}`,
    `street=${street_1} ${street_2}`,
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
    // logDebug({address, geocodeUrl, info, options, results, providedLocation, locations});
    // TODO: handle more than one location
    return locations[0];
  } catch (e) {
    return reject(e);
  }
}
