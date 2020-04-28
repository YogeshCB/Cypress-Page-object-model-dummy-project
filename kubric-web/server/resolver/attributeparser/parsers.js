export default {
  age(value = {}) {
    const { max, min } = value;
    const results = [];
    max && results.push(`agemax:${max}`);
    min && results.push(`agemin:${min}`);
    return results;
  }
};
