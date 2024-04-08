import { filteredQueryMapper, queryMapper } from "./querymapper";
import { query } from "../handlers/db";

export async function handleVehicleRequest(req: any) {
    try {
        let { searchQuery, currentPage, count } = req.query as {
            searchQuery?: string;
            currentPage?: number;
            count?: boolean;
        }

        if (!searchQuery) {
            searchQuery = "";
        }
        if (!currentPage) {
            currentPage = 1;
        }
        if (!count) {
            count = false;
        }

        const customQuery = await queryMapper(searchQuery, currentPage, count);
        const entries = await query(customQuery, []);
        return entries.rows;
    } catch (error) {
        console.error("Error occured while parsing vehicle request: ", error?.message);
        throw error;
    }
}

export async function handleFilteredVehicleRequest(req: any) {
    try {
        let { reportType, frequency, startDate, endDate } = req.query as {
            reportType?: string;
            frequency?: string;
            startDate?: string;
            endDate?: string;
        };

        if (!reportType) {
            reportType = "total-miles-driven";
        }
        if (!frequency) {
            frequency = "weekly";
        }
        [startDate, endDate] = [...parseDates(startDate, endDate)];

        const customQuery = await filteredQueryMapper(reportType, frequency, startDate, endDate);
        const entries = await query(customQuery, []);
        return entries.rows;
    } catch (err) {
        console.error("Error occured while parsing filtered vehicle request: ", err?.message);
        throw err;
    }
}

function parseDates(startDate: string | undefined, endDate: string | undefined) {
    const today: string = new Date().toISOString();
    if (!endDate) {
        endDate = startDate ? getCustomDate(startDate) : today;
    }
    if (!startDate) {
        startDate = endDate ? getCustomDate(endDate, -7) : getCustomDate(today, -7);
    }
    return [startDate, endDate];
}

function getCustomDate(date: string, days: number = 7): string {
    const parsedDate = new Date(date);
    parsedDate.setDate(parsedDate.getDate() + days);
    return parsedDate.toISOString();
}
