export const nestedStatesWithLGA = (array, keyField, secondaryField) => {
  return array.reduce((obj, state) => {
    obj[state[keyField]["name"]] = state[keyField][secondaryField];
    return obj;
  }, {});
};
