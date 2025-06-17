class PosterModel {
  constructor({
    id,
    userId,
    imageUrl,
    prompt,
    negativePrompt = "",
    style,
    aspectRatio,
    seed = null,
    dimensions = "1024x1024",
    createdAt = new Date(),
    savedAt = new Date(),
    metadata = {},
  }) {
    this.id = id;
    this.userId = userId;
    this.imageUrl = imageUrl;
    this.prompt = prompt;
    this.negativePrompt = negativePrompt;
    this.style = style;
    this.aspectRatio = aspectRatio;
    this.seed = seed;
    this.dimensions = dimensions;
    this.createdAt = createdAt;
    this.savedAt = savedAt;
    this.metadata = metadata;
  }
}

module.exports = PosterModel;
