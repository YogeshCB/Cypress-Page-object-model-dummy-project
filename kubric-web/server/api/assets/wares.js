import services from "../../services";

export const updateProfile = (type, network, data, errorHandler) => async (req, res, next) => {
  try {
    const { profile = {} } = await services.profile.get().send({
      ...req._sessionData,
    });
    const { company_profile = {} } = profile;
    const typeName = `${type}networks`;
    let networks = company_profile[typeName] || [];
    const newNetworks = networks.filter(({ id }) => id !== network);
    if (typeof data !== 'undefined') {
      newNetworks.push({
        id: network,
        ...data,
      });
    }
    const workspace = req._sessionData.workspace_id;

    await services.profile.update().send({
      ...req._sessionData,
      ...profile,
      company_profile: {
        [workspace]:{
          ...profile['company_profile'][workspace],
          [typeName]: newNetworks,
        },
      },
    });
    next();
  } catch (ex) {
    errorHandler && errorHandler(req, res, ex);
  }
};

