const { admin } = require("../config/firebase");
const logger = require("./logger");

async function uploadToFirebaseStorage(fileBuffer, destination, mimetype) {
  logger.info(
    "[uploadToFirebaseStorage] Uploading file to Firebase Storage:",
    destination
  );
  const bucket = admin.storage().bucket();
  const file = bucket.file(destination);

  try {
    await file.save(fileBuffer, {
      metadata: { contentType: mimetype },
      public: true,
      resumable: false,
    });

    await file.makePublic();

    const url = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    logger.info(
      "[uploadToFirebaseStorage] File uploaded and made public:",
      url
    );
    return url;
  } catch (error) {
    logger.error("[uploadToFirebaseStorage] Error uploading file:", error);
    throw error;
  }
}

module.exports = { uploadToFirebaseStorage };
