import axios from "axios";

const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

const backendUrl = "http://localhost:3000/";

export default (baseURL) => {
    return axios.create({
        baseURL: `${backendUrl}${baseURL}`,
        ...commonConfig, // không lặp lại cấu hình headers mỗi lần request
    });
};
