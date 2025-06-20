const path = require("path");
const { Storage } = require("@google-cloud/storage");

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
  const file = bucket.file(destination);

  await file.save(fileBuffer, {
    metadata: { contentType: mimetype },
    public: true,
    resumable: false,
  });

  await file.makePublic();

  return `https://storage.googleapis.com/${GCS_BUCKET}/${destination}`;
}

async function checkBucketConnection() {
  try {
    const [exists] = await bucket.exists();
    if (exists) {
      console.log(`Bucket "${GCS_BUCKET}" is connected and exists.`);
    } else {
      console.log(
        `Bucket "${GCS_BUCKET}" does NOT exist or is not accessible.`
      );
    }
  } catch (error) {
    console.error("Error checking bucket connection:", error.message);
  }
}

module.exports = { uploadToGCS, checkBucketConnection };
