export const getVideoCardProperties = ({ thumbnailURL, videoURL, watermarkURL } = {}) => ({
  thumbnail: thumbnailURL,
  media: watermarkURL || videoURL
});

export const isVideo = ({ videoURL, watermarkURL } = {}) => /\.mp4$/.test(watermarkURL || videoURL || '');