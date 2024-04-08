import request from "supertest";
import app from './index';

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

jest.mock("./mappers/querymapper", () => ({
    queryMapper: jest.fn().mockImplementation((searchQuery, currentPage, count) => {
        if(count === '1') {
            return Promise.reject(new Error('Something went wrong'));
        }
        return Promise.resolve(null);
    }),
    filteredQueryMapper: jest.fn().mockImplementation((reportType, frequency, startDate, endDate) => {
        if(reportType === 'test') {
            return Promise.reject(new Error('Requested report not available yet!!!'));
        }
        return Promise.resolve("");
})
}));

jest.mock("./handlers/db", () => ({
    query: jest.fn().mockImplementation((customQuery, []) => {
        if (customQuery === null) {
            return Promise.resolve(vehicleResponse);
        }
        return Promise.resolve(filteredVehicleResponse);
    }),
}));

describe('GET /api/data', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all vehicles', async () => {
        const res = await request(app).get('/api/data');
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body[0]).toHaveProperty('reporttype', 'average-miles-driven');
        expect(res.body[0]).toHaveProperty('frequency', 'monthly');
        expect(res.body[1]).toHaveProperty('date', '2023-05-01T00:00:00.000Z');
        expect(res.body[1]).toHaveProperty('value', '228.6666666666666667');
    });

    test('should handle errors for all vehicle data', async () => {
        const res = await request(app).get('/api/data?count=1');
        expect(res.status).toBe(500);
        expect(res.body?.message).toEqual('Something went wrong');
      });
});

describe('GET /api/data/filtered', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all filtered vehicles', async () => {
        const res = await request(app).get('/api/data/filtered');
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body[0]).toHaveProperty('license_plate', 'XPD4LG0');
        expect(res.body[0]).toHaveProperty('make', 'Tesla');
        expect(res.body[1]).toHaveProperty('vin', 'J32NKJAZTC2DCDU86');
        expect(res.body[1]).toHaveProperty('type', 'Truck');
    });

    test('should handle errors for all vehicle data', async () => {
        const res = await request(app).get('/api/data/filtered?reportType=test');
        expect(res.status).toBe(500);
        expect(res.body?.message).toEqual('Requested report not available yet!!!');
      });
});