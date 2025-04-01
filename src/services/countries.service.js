import Countries from "../models/countries.model";

const getAllCountriesService = async () => {
  try {
    const listCountry = await Countries.findAll();
    return listCountry;
  } catch (err) {
    throw err;
  }
}

export { getAllCountriesService };