import {
  GET_ALL_ADMIN_SERVICES,
  SET_ADMIN_SERVICE_DATA_FETCH_AMOUNT,
} from "./action-types/action.types.js";

export const getAllServices = (data = []) => {
  return { type: GET_ALL_ADMIN_SERVICES, payload: { servicesData: data } };
};

export const setFetchNumber = (num = 10) => ({
  type: SET_ADMIN_SERVICE_DATA_FETCH_AMOUNT,
  payload: { fetchLimit: num },
});
