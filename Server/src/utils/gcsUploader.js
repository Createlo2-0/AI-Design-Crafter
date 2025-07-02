const path = require("path");
const { Storage } = require("@google-cloud/storage");
const logger = require("./logger");

const GCLOUD_PROJECT = process.env.GCLOUD_PROJECT;
const GCS_BUCKET = process.env.GCS_BUCKET;

// Use the absolute path to service.json in the Server folder
const keyFilename = path.join(__dirname, "../../service.json");

const storage = new Storage({
  projectId: GCLOUD_PROJECT,
  keyFilename,
});

const bucket = storage.bucket(GCS_BUCKET);

async function uploadToGCS(fileBuffer, destination, mimetype) {
  logger.info("[uploadToGCS] Uploading file to GCS:", destination);
  const file = bucket.file(destination);

  try {
    await file.save(fileBuffer, {
      metadata: { contentType: mimetype },
      public: true,
      resumable: false,
    });

    await file.makePublic();

    const url = `https://storage.googleapis.com/${GCS_BUCKET}/${destination}`;
    logger.info("[uploadToGCS] File uploaded and made public:", url);
    return url;
  } catch (error) {
    logger.error("[uploadToGCS] Error uploading file:", error);
    throw error;
  }
}

async function checkBucketConnection() {
  try {
    const [exists] = await bucket.exists();
    if (exists) {
      logger.info(
        `[checkBucketConnection] Bucket "${GCS_BUCKET}" is connected and exists.`
      );
    } else {
      logger.warn(
        `[checkBucketConnection] Bucket "${GCS_BUCKET}" does NOT exist or is not accessible.`
      );
    }
  } catch (error) {
    logger.error(
      "[checkBucketConnection] Error checking bucket connection:",
      error.message
    );
  }
}

module.exports = { uploadToGCS, checkBucketConnection };
