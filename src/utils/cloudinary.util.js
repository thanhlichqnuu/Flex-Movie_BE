import cloudinary from "../config/cloudinary.config";

const uploadImage = async (imagePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: folder,
      resource_type: "image",
      format: "avif",
    });
    return result;
  } catch (err) {
    throw err;
  }
};

const deleteImage = async (imageUrl) => {
  try {
    const uploadIndex = imageUrl.indexOf("/upload/");
    let path = imageUrl.slice(uploadIndex + 8);

    if (path.match(/^v\d+\//)) {
      path = path.replace(/^v\d+\//, "");
    }

    const public_id = path.replace(/\.[^/.]+$/, "");
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    throw err;
  }
};

export { uploadImage, deleteImage };
