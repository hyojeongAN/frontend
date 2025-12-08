import { sendErrorLog } from "../api/errors";

export const useErrorLogger = () => {
    const logError = async (error, location = "Unknown") => {
        const payload = {
            message: error.message || "Unknown error",
            stack: error.stack || null,
            location,
            level: "error",
            level: "error",
            time: new Date().toISOString(),
        };

        try {
            await sendErrorLog(payload);    
        } catch (e) {
            ChevronsLeftIcon.error("Failed to send log:", e);
        }
    };

    return { logError };
};