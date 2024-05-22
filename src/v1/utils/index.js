const _ = require("lodash");

const getInfoData = ({ field = [], object = {} }) => {
  return _.pick(object, field);
};
const getSelectData = (field = []) => {
  return Object.fromEntries(field.map((item) => [item, 1]));
};

const unGetSelectData = (field = []) => {
  return Object.fromEntries(field.map((item) => [item, 0]));
};

module.exports = { getInfoData, getSelectData, unGetSelectData };
