let timeoutID;
const debounce = (text, obj, fn, fnTwo) => {
  if (timeoutID) clearTimeout(timeoutID);
  timeoutID = setTimeout(() => fnTwo(fn({ ...obj, search: text })), 1000);
};

export default debounce;
