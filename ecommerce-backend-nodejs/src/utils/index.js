const _ = require("lodash");
const { Types } = require("mongoose");

const getInfoData = ({ field = [], object = {} }) => {
  return _.pick(object, field);
};
const getSelectData = (field = []) => {
  return Object.fromEntries(field.map((item) => [item, 1]));
};

const unGetSelectData = (field = []) => {
  return Object.fromEntries(field.map((item) => [item, 0]));
};

const removeUndefinedData = (object) => {
  if (object && typeof object === "object") {
    Object.keys(object).forEach((key) => {
      if (
        object[key] &&
        typeof object[key] === "object" &&
        !Array.isArray(object[key])
      ) {
        removeUndefinedData(object[key]);
      } else if (object[key] === undefined || object[key] === null) {
        delete object[key];
      }
    });
  }
  return object;
};

const updateNestedObject = (object) => {
  const final = {};
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === "object" && !Array.isArray(object[key])) {
      const nestedObject = updateNestedObject(object[key]);
      Object.keys(nestedObject).forEach((keyNested) => {
        final[`${key}.${keyNested}`] = nestedObject[keyNested];
      });
    } else {
      final[key] = object[key];
    }
  });
  return final;
};

const convertToObjectIdMongodb = (id) => {
  return Types.ObjectId.createFromHexString(id);
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedData,
  updateNestedObject,
  convertToObjectIdMongodb,
};
