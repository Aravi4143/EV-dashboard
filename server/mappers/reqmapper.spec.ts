import { handleVehicleRequest, handleFilteredVehicleRequest } from "./reqmapper";

const filteredVehicleResponse = {
    "rows": [{
		"license_plate": "XPD4LG0",
		"make": "Tesla",
		"vin": "X1P1K92BUGRV0ZS4R",
		"model": "Semi Delivery Event, 2022",
		"type": "Truck",
		"date_added": "2024-03-21T00:00:00.000Z",
		"miles_driven": 261
	},
	{
		"license_plate": "EEPZF54",
		"make": "BYD Auto",
		"vin": "J32NKJAZTC2DCDU86",
		"model": "Class 6F cab & chassis 2022",
		"type": "Truck",
		"date_added": "2024-03-15T00:00:00.000Z",
		"miles_driven": 268
	}]
};

const vehicleResponse = {
    "rows": [
        {
            "reporttype": "average-miles-driven",
            "frequency": "monthly",
            "date": "2023-04-01T00:00:00.000Z",
            "value": "245.0000000000000000"
        },
        {
            "reporttype": "average-miles-driven",
            "frequency": "monthly",
            "date": "2023-05-01T00:00:00.000Z",
            "value": "228.6666666666666667"
        }
    ]
};

jest.mock("../handlers/db", () => ({
    query: jest.fn().mockImplementation((text, params) => {
        if (text.includes("::text")) {
            return Promise.resolve(vehicleResponse);
        }
        return Promise.resolve(filteredVehicleResponse);
    }),
}));

describe("Vehicle Request Mapper", () => {
    it("should handle vehicle request with default values", async () => {
        const req = { query: {} };
        const result = await handleVehicleRequest(req);
        expect(result).toBeDefined();
        expect(result[0]).toHaveProperty('reporttype', 'average-miles-driven');
        expect(result[0]).toHaveProperty('frequency', 'monthly');
        expect(result[1]).toHaveProperty('date', '2023-05-01T00:00:00.000Z');
        expect(result[1]).toHaveProperty('value', '228.6666666666666667');

    });

    it("should handle vehicle request with custom values", async () => {
        const req = { query: { searchQuery: "Tesla", currentPage: 2, count: true } };
        const result = await handleVehicleRequest(req);
        expect(result).toBeDefined();
        expect(result[0]).toHaveProperty('reporttype', 'average-miles-driven');
        expect(result[0]).toHaveProperty('frequency', 'monthly');
        expect(result[1]).toHaveProperty('date', '2023-05-01T00:00:00.000Z');
        expect(result[1]).toHaveProperty('value', '228.6666666666666667');
    });
});

describe("Filtered Vehicle Request Mapper", () => {
    it("should handle filtered vehicle request with default values", async () => {
        const req = { query: {} };
        const result = await handleFilteredVehicleRequest(req);
        expect(result).toBeDefined();
        expect(result[0]).toHaveProperty('license_plate', 'XPD4LG0');
        expect(result[0]).toHaveProperty('make', 'Tesla');
        expect(result[1]).toHaveProperty('vin', 'J32NKJAZTC2DCDU86');
        expect(result[1]).toHaveProperty('type', 'Truck');

    });

    it("should handle filtered vehicle request with custom values", async () => {
        const req = { query: { reportType: "most-driven-vehicles", frequency: "mothly", startDate: "2023-01-01", endDate: "2023-01-31" } };
        const result = await handleFilteredVehicleRequest(req);
        expect(result).toBeDefined();
        expect(result[0]).toHaveProperty('license_plate', 'XPD4LG0');
        expect(result[0]).toHaveProperty('make', 'Tesla');
        expect(result[1]).toHaveProperty('vin', 'J32NKJAZTC2DCDU86');
        expect(result[1]).toHaveProperty('type', 'Truck');

    });
});
