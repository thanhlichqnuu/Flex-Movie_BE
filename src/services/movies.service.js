import { Op } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import {
  Movies,
  Genres,
  MovieGenres,
} from "../models/movie_genres_associations.model";
import Countries from "../models/countries.model";
import { uploadImage, deleteImage } from "../utils/cloudinary.util";
import { removeFileTemp } from "../utils/multer.util";

const getAllMoviesService = async (
  page,
  limit,
  search,
  status,
  genre,
  country,
  releaseYear
) => {
  const offset = (page - 1) * limit;
  const where = {};
  const include = [];

  try {
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { origin_name: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (country) {
      include.push({
        model: Countries,
        where: { slug: country },
      });
    } else {
      include.push({
        model: Countries,
      });
    }

    if (releaseYear) {
      where.release_year = releaseYear;
    }

    if (genre) {
      where.id = {
        [Op.in]: sequelize.literal(`(
          SELECT movie_id FROM movie_genres mg
          JOIN genres g ON mg.genre_id = g.id
          WHERE g.slug = '${genre}'
        )`),
      };
    }

    include.push({
      model: Genres,
      through: { attributes: [] },
    });

    const listMovie = await Movies.findAndCountAll({
      where,
      include,
      attributes: { exclude: ["created_at", "country_id"] },
      distinct: true,
      offset,
      limit,
      order: [["updated_at", "DESC"]],
    });

    const formattedMovies = listMovie.rows.map((movie) => {
      const movieJson = movie.toJSON();
      const genreNames = movieJson.genres.map((genre) => genre.name).join(", ");
      delete movieJson.updated_at;

      return {
        ...movieJson,
        genres: genreNames,
        country: movieJson.country.name,
      };
    });

    return { count: listMovie.count, rows: formattedMovies };
  } catch (err) {
    throw err;
  }
};

const getMovieBySlugService = async (slugMovie) => {
  try {
    const movie = await Movies.findOne({
      where: { slug: slugMovie },
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
        {
          model: Countries,
        },
        {
          model: Genres,
          through: { attributes: [] },
        },
      ],
    });

    if (!movie) {
      throw new Error("Movie not found!");
    }

    const genreNames = movie.genres.map((genre) => genre.name).join(", ");

    const formattedMovie = {
      ...movie.toJSON(),
      country: movie.country.name,
      genres: genreNames,
    };

    delete formattedMovie.country_id;

    return formattedMovie;
  } catch (err) {
    throw err;
  }
};

const createMovieService = async (movieData, genres, imageFiles) => {
  const thumbPath = imageFiles.thumbUrl[0].path;
  const posterPath = imageFiles.posterUrl[0].path;
  const transaction = await sequelize.transaction();

  try {
    const existingMovie = await Movies.findOne({
      where: { slug: movieData.slug },
      transaction,
    });

    if (existingMovie) {
      throw new Error("Slug already exists!");
    }

    const countryData = await Countries.findOne({
      where: { id: movieData.country },
      transaction,
    });

    if (!countryData) {
      throw new Error("Country does not exist!");
    }

    const listGenre = await Genres.findAll({
      where: {
        id: {
          [Op.in]: genres,
        },
      },
      transaction,
    });

    if (listGenre.length !== genres.length) {
      throw new Error("One or more genre do not exist!");
    }

    const [thumbUpload, posterUpload] = await Promise.all([
      uploadImage(thumbPath, "movies/thumbnails"),
      uploadImage(posterPath, "movies/posters"),
    ]);

    const newMovie = await Movies.create(
      {
        ...movieData,
        country_id: countryData.id,
        thumb_url: thumbUpload.secure_url,
        poster_url: posterUpload.secure_url,
      },
      { transaction }
    );

    await Promise.all(
      genres.map((genre) =>
        MovieGenres.create(
          {
            movie_id: newMovie.id,
            genre_id: genre,
          },
          { transaction }
        )
      )
    );

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  } finally {
    removeFileTemp(thumbPath);
    removeFileTemp(posterPath);
  }
};

const updateMovieService = async (movieId, movieData, genres, imageFiles) => {
  const transaction = await sequelize.transaction();

  try {
    const movie = await Movies.findByPk(movieId, { transaction });
    if (!movie) {
      throw new Error("Movie not found!");
    }

    const updateData = {};
    const oldThumbUrl = movie.thumb_url;
    const oldPosterUrl = movie.poster_url;

    if (movieData.slug && movieData.slug !== movie.slug) {
      const existingMovie = await Movies.findOne({
        where: {
          slug: movieData.slug,
          id: { [Op.ne]: movieId },
        },
        transaction,
      });

      if (existingMovie) {
        throw new Error("Slug already exists!");
      }
      updateData.slug = movieData.slug;
    }

    if (movieData.country && movieData.country !== movie.country_id) {
      const countryData = await Countries.findOne({
        where: { id: movieData.country },
        transaction,
      });

      if (!countryData) {
        throw new Error("Country does not exist!");
      }
      updateData.country_id = movieData.country;
    }

    Object.keys(movieData).forEach((key) => {
      if (
        key !== "slug" &&
        key !== "country" &&
        movieData[key] !== movie[key]
      ) {
        updateData[key] = movieData[key];
      }
    });

    if (imageFiles) {
      const uploadPromises = [];

      if (imageFiles?.thumbUrl?.[0]) {
        const thumbPath = imageFiles.thumbUrl[0].path;
        uploadPromises.push(
          uploadImage(thumbPath, "movies/thumbnails").then((result) => {
            updateData.thumb_url = result.secure_url;
          })
        );
      }

      if (imageFiles?.posterUrl?.[0]) {
        const posterPath = imageFiles.posterUrl[0].path;
        uploadPromises.push(
          uploadImage(posterPath, "movies/posters").then((result) => {
            updateData.poster_url = result.secure_url;
          })
        );
      }

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }
    }

    if (Object.keys(updateData).length > 0) {
      await movie.update(updateData, { transaction });
    }

    if (genres?.length > 0) {
      const currentGenres = await MovieGenres.findAll({
        where: { movie_id: movieId },
        attributes: ["genre_id"],
        transaction,
      });

      const currentGenreIds = currentGenres.map((g) => g.genre_id);

      const hasGenreChanges =
        genres.length !== currentGenreIds.length ||
        !genres.every((id) => currentGenreIds.includes(Number(id)));

      if (hasGenreChanges) {
        const listGenre = await Genres.findAll({
          where: {
            id: {
              [Op.in]: genres,
            },
          },
          transaction,
        });

        if (listGenre.length !== genres.length) {
          throw new Error("One or more genre do not exist!");
        }

        await MovieGenres.destroy({
          where: { movie_id: movieId },
          transaction,
        });

        await Promise.all(
          genres.map((genre) =>
            MovieGenres.create(
              {
                movie_id: movieId,
                genre_id: genre,
              },
              { transaction }
            )
          )
        );
      }
    }

    await transaction.commit();

    if (updateData.thumb_url) {
      await deleteImage(oldThumbUrl);
    }
    if (updateData.poster_url) {
      await deleteImage(oldPosterUrl);
    }
  } catch (err) {
    await transaction.rollback();
    throw err;
  } finally {
    if (imageFiles?.thumbUrl?.[0]?.path) {
      removeFileTemp(imageFiles.thumbUrl[0].path);
    }
    if (imageFiles?.posterUrl?.[0]?.path) {
      removeFileTemp(imageFiles.posterUrl[0].path);
    }
  }
};

const deleteMovieService = async (movieId) => {
  const transaction = await sequelize.transaction();

  try {
    const movie = await Movies.findByPk(movieId, { transaction });
    if (!movie) {
      throw new Error("Movie not found!");
    }

    const thumbUrl = movie.thumb_url;
    const posterUrl = movie.poster_url;

    await MovieGenres.destroy({
      where: { movie_id: movieId },
      transaction,
    });

    await movie.destroy({ transaction });
    await Promise.all([deleteImage(thumbUrl), deleteImage(posterUrl)]);

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

export {
  getAllMoviesService,
  getMovieBySlugService,
  createMovieService,
  updateMovieService,
  deleteMovieService,
};
