import api from "./index";

export const sendErrorLog = async (log) => {
    return await api.post("/errors", log);
};

export const fetchErrorLogs = async (params) => {
    return await api.get("/errors", { params });
};