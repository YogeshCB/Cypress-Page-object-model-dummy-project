export const getAssetPathForSuffix = ({ path }) => {
  let filterPath = path.split('/').pop();
  return filterPath === 'root' ? `/root` : filterPath;
};