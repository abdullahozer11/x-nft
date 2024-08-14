export const mergeDicts = (obj1, obj2) => {
  const merged = {};

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      merged[key] = { ...obj1[key], ...obj2[key] };
    } else {
      merged[key] = obj1[key];
    }
  }

  for (const key in obj2) {
    if (!Object.prototype.hasOwnProperty.call(merged, key)) {
      merged[key] = obj2[key];
    }
  }

  return merged;
};
