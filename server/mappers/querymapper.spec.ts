
import { queryMapper, filteredQueryMapper } from './querymapper';

describe('queryMapper', () => {
    it('should return a count query', async () => {
        const result = await queryMapper('test', 1, true);
        expect(result).toEqual("SELECT count(*) FROM vehicles \n        WHERE\n          make ILIKE '%test%' OR\n          model ILIKE '%test%' OR\n          vin ILIKE '%test%' OR\n          type ILIKE '%test%' OR\n          miles_driven::text ILIKE '%test%' OR\n          date_added::text ILIKE '%test%' OR\n          license_plate ILIKE '%test%'");
    });

    it('should return a select query', async () => {
        const result = await queryMapper('test', 1, false);
        expect(result).toEqual("SELECT * FROM vehicles \n        WHERE\n        make ILIKE '%test%' OR\n        model ILIKE '%test%' OR\n        vin ILIKE '%test%' OR\n        type ILIKE '%test%' OR\n        miles_driven::text ILIKE '%test%' OR\n        date_added::text ILIKE '%test%' OR\n        license_plate ILIKE '%test%'\n        ORDER BY date_added DESC\n        LIMIT 10 OFFSET 0");
    });
});

describe('filteredQueryMapper', () => {
    it('should return a total miles driven query', async () => {
        const result = await filteredQueryMapper('total-miles-driven', 'weekly', '2023-01-01', '2023-01-07');
        expect(result).toEqual(`SELECT\n            'total-miles-driven' AS reportType,\n            'weekly' AS frequency,\n            date_trunc('week', date_added) AS date,\n            SUM(miles_driven) AS value\n            FROM vehicles\n            WHERE date_added >= TO_TIMESTAMP('2023-01-01', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AND date_added <= TO_TIMESTAMP('2023-01-07', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')\n            GROUP BY date_trunc('week', date_added)\n            ORDER BY date ASC;`);
    });

    it('should return an average miles driven query', async () => {
        const result = await filteredQueryMapper('average-miles-driven', 'monthly', '2023-02-01', '2023-02-28');
        expect(result).toEqual(`SELECT\n            'average-miles-driven' AS reportType,\n            'monthly' AS frequency,\n            date_trunc('month', date_added) AS date,\n            AVG(miles_driven) AS value\n            FROM vehicles\n            WHERE date_added >= TO_TIMESTAMP('2023-02-01', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AND date_added <= TO_TIMESTAMP('2023-02-28', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')\n            GROUP BY date_trunc('month', date_added)\n            ORDER BY date ASC;`);
    });

    it('should return a most driven vehicles query', async () => {
        const result = await filteredQueryMapper('most-driven-vehicles', 'yearly', '2023-01-01', '2023-12-31');
        expect(result).toEqual(`SELECT\n            'most-driven-vehicles' AS reportType,\n            'yearly' AS frequency,\n            date_trunc('year', date_added) AS date,\n            vin,\n            SUM(miles_driven) AS value\n            FROM vehicles\n            WHERE date_added >= TO_TIMESTAMP('2023-01-01', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AND date_added <= TO_TIMESTAMP('2023-12-31', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')\n            GROUP BY date_trunc('year', date_added), vin\n            ORDER BY value DESC;`);
    });

    it('should return a least driven vehicles query', async () => {
        const result = await filteredQueryMapper('least-driven-vehicles', 'yearly', '2023-01-01', '2023-12-31');
        expect(result).toEqual(`SELECT\n            'least-driven-vehicles' AS reportType,\n            'yearly' AS frequency,\n            date_trunc('year', date_added) AS date,\n            vin,\n            SUM(miles_driven) AS value\n            FROM vehicles\n            WHERE date_added >= TO_TIMESTAMP('2023-01-01', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AND date_added <= TO_TIMESTAMP('2023-12-31', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')\n            GROUP BY date_trunc('year', date_added), vin\n            ORDER BY value ASC;`);
    });

    it('should return miles driven by vehicles type query', async () => {
        const result = await filteredQueryMapper('miles-driven-by-type', 'yearly', '2023-01-01', '2023-12-31');
        expect(result).toEqual(`SELECT\n            'miles-driven-by-type' AS reportType,\n            'yearly' AS frequency,\n            date_trunc('year', date_added) AS date,\n            type,\n            SUM(miles_driven) AS value\n            FROM vehicles\n            WHERE date_added >= TO_TIMESTAMP('2023-01-01', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AND date_added <= TO_TIMESTAMP('2023-12-31', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')\n            GROUP BY date_trunc('year', date_added), type\n            ORDER BY value DESC;`);
    });

    it('should return error for invalid report type', async () => {
        let thrownError;
        try {
            const result = await filteredQueryMapper('miles-driven-vs-type', 'yearly', '2023-01-01', '2023-12-31');
        } catch (error) {
            thrownError = error;
        }
        
        expect(thrownError).toBeInstanceOf(Error);
        expect(thrownError.message).toEqual('Requested report not available yet!!!');
    });
});
