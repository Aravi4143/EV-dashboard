'use server'

export async function fetchVehiclesData(query: string, currentPage: number,) {
    try {
        const response = await fetch(`${process.env.API_URL}/api/data?searchQuery=${query}&currentPage=${currentPage}`, {
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
            },
        });
        const data = await response.json();
        return Object.values(data);
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function fetchVehiclesCount(query: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/api/data?searchQuery=${query}&count=true`, {
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
            },
        });
        const data = await response.json();
        return data[0].count;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export async function fetchFilteredVehicles(reportType: string, frequency: string, startDate: string | undefined, endDate: string | undefined) {
    try {
        const response = await fetch(`${process.env.API_URL}/api/data/filtered?reportType=${reportType}&frequency=${frequency}&startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
            },
        });
        const data = await response.json();
        return Object.values(data);
    } catch (error) {
        console.log(error);
        return [];
    }
}