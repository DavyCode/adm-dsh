import axios from "axios";

const fetchData = ({ url, method, signal, body }) => {
  return axiosData(url, {
    method,
    signal,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      ...(localStorage.getItem("token") && {
        access_token: `Bearer ${localStorage.getItem("token")}`,
      }),
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

const axiosData = async ({ url, method, body, signal, params }) => {
  try {
    const result = await axios({
      method,
      url,
      ...(params && { params }),
      ...(signal && { cancelToken: signal }),
      ...(body && { data: body }),
      headers: {
        ...(localStorage.getItem("token") && {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        }),
      },
    });
    return result.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Axios cleansing worked");
    }
    return error;
    //console.log(error);
  }
};

export default axiosData;
