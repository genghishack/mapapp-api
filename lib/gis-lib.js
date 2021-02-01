import axios from 'axios';

const mapquestKey = process.env.MAPQUEST_API_KEY

export const geocode = async (address) => {
  // TODO: Handle object with multiple parts of address
  const baseUrl = 'http://www.mapquestapi.com/geocoding/v1/address';
  const geocodeUrl = `${baseUrl}?key=${mapquestKey}&location=${address}`
  try {
    let response = await axios.get(geocodeUrl);
    const { info, options, results } = response.data;
    // TODO: handle more than one result
    const { providedLocation, locations } = results[0];
    // console.log({address, geocodeUrl, info, options, results, providedLocation, locations});
    // TODO: handle more than one location
    return locations[0];
  } catch (e) {
    return Promise.reject(e);
  }
}
