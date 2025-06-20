const { admin } = require("../config/firebase");

async function uploadToFirebaseStorage(fileBuffer, destination, mimetype) {
  const bucket = admin.storage().bucket();
  const file = bucket.file(destination);

  await file.save(fileBuffer, {
    metadata: { contentType: mimetype },
    public: true,
    resumable: false,
  });

  await file.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${destination}`;
}

module.exports = { uploadToFirebaseStorage };
