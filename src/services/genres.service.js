import Genres from "../models/genres.model";

const getAllGenresService = async () => {
  try {
    const listGenre = await Genres.findAll();
    return listGenre;
  } catch (err) {
    throw err;
  }
}

export { getAllGenresService };