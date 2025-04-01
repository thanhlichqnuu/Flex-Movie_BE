import Movies from "./movies.model";
import Genres from "./genres.model";
import MovieGenres from "./movie_genres.model";

MovieGenres.belongsTo(Movies, {
  foreignKey: "movie_id",
  onDelete: "CASCADE",
});

MovieGenres.belongsTo(Genres, {
  foreignKey: "genre_id",
  onDelete: "CASCADE",
});

Movies.belongsToMany(Genres, {
  through: MovieGenres,
  foreignKey: "movie_id",
});

Genres.belongsToMany(Movies, {
  through: MovieGenres,
  foreignKey: "genre_id",
});

export { Movies, Genres, MovieGenres };