export default {
  cloudinary(data) {
    const { api_key, api_secret, cloud_name } = data;
    return {
      api_key,
      api_secret,
      cloud_name,
    };
  },
};
