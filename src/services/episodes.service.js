import path from "path";
import Movies from "../models/movies.model";
import Episodes from "../models/episodes.model";
import convertToHLS from "../utils/hls.util";
import { uploadToS3, deleteFromS3 } from "../utils/s3.util";
import { removeFileTemp } from "../utils/multer.util";
import { sequelize } from "../config/sequelize.config";
import { initDir, removeFolderTemp } from "../utils/multer.util";

const UPLOAD_VIDEO_DIR = Bun.env.UPLOAD_VIDEO_DIR;

const getEpisodesByMovieService = async (movieId) => {
  try {
    const movie = await Movies.findByPk(movieId);

    if (!movie) {
      throw new Error("Movie not found!");
    }

    const listEpisode = await Episodes.findAll({
      where: { movie_id: movieId },
      order: [["id", "ASC"]],
      attributes: { exclude: ["movie_id"] },
    });

    return listEpisode;
  } catch (err) {
    throw err;
  }
};

const createEpisodeService = async (episodeData, movieId, videoFile) => {
  const transaction = await sequelize.transaction();
  const tempFilePath = videoFile.path;
  const outputDir = path.join(
    UPLOAD_VIDEO_DIR,
    `episode_${movieId}_${episodeData.slug}`
  );

  try {
    const movie = await Movies.findByPk(movieId, { transaction });

    if (!movie) {
      throw new Error("Movie not found!");
    }

    const existingEpisode = await Episodes.findOne({
      where: {
        slug: episodeData.slug,
        movie_id: movieId,
      },
      transaction,
    });

    if (existingEpisode) {
      throw new Error("Slug already exists!");
    }

    initDir(outputDir);

    await convertToHLS(tempFilePath, outputDir, episodeData.slug);

    const s3Prefix = `episodes/${movieId}`;
    const m3u8Url = await uploadToS3(outputDir, s3Prefix, episodeData.slug);

    await Episodes.create(
      {
        name: episodeData.name,
        slug: episodeData.slug,
        link_m3u8: m3u8Url,
        movie_id: movieId,
      },
      { transaction }
    );

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  } finally {
    removeFileTemp(tempFilePath);
    removeFolderTemp(outputDir);
  }
};

const updateEpisodeService = async (episodeId, episodeData, videoFile) => {
  const transaction = await sequelize.transaction();
  let tempFilePath = null;
  let outputDir = null;

  try {
    const episode = await Episodes.findByPk(episodeId, { transaction });

    if (!episode) {
      throw new Error("Episode not found!");
    }

    if (episodeData.slug && episodeData.slug !== episode.slug) {
      const existingEpisode = await Episodes.findOne({
        where: {
          slug: episodeData.slug,
          movie_id: episode.movie_id,
        },
        transaction,
      });

      if (existingEpisode) {
        throw new Error("Slug already exists!");
      }
    }

    if (videoFile) {
      tempFilePath = videoFile.path;
      outputDir = path.join(
        Bun.env.UPLOAD_VIDEO_DIR,
        `episode_${episode.movie_id}_${episodeData.slug || episode.slug}`
      );

      initDir(outputDir);
      await convertToHLS(
        tempFilePath,
        outputDir,
        episodeData.slug || episode.slug
      );

      const s3Prefix = `episodes/${episode.movie_id}`;
      const m3u8Url = await uploadToS3(
        outputDir,
        s3Prefix,
        episodeData.slug || episode.slug
      );

      episodeData.link_m3u8 = m3u8Url;
    }

    await episode.update(episodeData, { transaction });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  } finally {
    removeFileTemp(tempFilePath);
    removeFolderTemp(outputDir);
  }
};

const deleteEpisodeService = async (episodeId) => {
  const transaction = await sequelize.transaction();
  
  try {
    const episode = await Episodes.findByPk(episodeId, { transaction });

    if (!episode) {
      throw new Error("Episode not found!");
    }
    
    const movieId = episode.movie_id;
    const episodeSlug = episode.slug;
    
    await episode.destroy({ transaction });
    
    const s3Prefix = `episodes/${movieId}/${episodeSlug}`;
    await deleteFromS3(s3Prefix);
    
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

export {
  getEpisodesByMovieService,
  createEpisodeService,
  updateEpisodeService,
  deleteEpisodeService,
};
