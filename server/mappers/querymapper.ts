export async function queryMapper(searchQuery: string, currentPage: number, count: boolean) {
    const ITEMS_PER_PAGE = 10;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    if (count) {
        return `SELECT count(*) FROM vehicles 
        WHERE
          make ILIKE '${`%${searchQuery}%`}' OR
          model ILIKE '${`%${searchQuery}%`}' OR
          vin ILIKE '${`%${searchQuery}%`}' OR
          type ILIKE '${`%${searchQuery}%`}' OR
          miles_driven::text ILIKE '${`%${searchQuery}%`}' OR
          date_added::text ILIKE '${`%${searchQuery}%`}' OR
          license_plate ILIKE '${`%${searchQuery}%`}'`
    } else {
        return `SELECT * FROM vehicles 
        WHERE
        make ILIKE '${`%${searchQuery}%`}' OR
        model ILIKE '${`%${searchQuery}%`}' OR
        vin ILIKE '${`%${searchQuery}%`}' OR
        type ILIKE '${`%${searchQuery}%`}' OR
        miles_driven::text ILIKE '${`%${searchQuery}%`}' OR
        date_added::text ILIKE '${`%${searchQuery}%`}' OR
        license_plate ILIKE '${`%${searchQuery}%`}'
        ORDER BY date_added DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    }
}

export async function filteredQueryMapper(reportType: string, frequency: string, startDate: string, endDate: string) {
    const freqMapper = {
        "weekly": "week",
        "monthly": "month",
        "yearly": "year",
    };

    const queries = {
        "total-miles-driven":
            `SELECT
            '${reportType}' AS reportType,
            '${frequency}' AS frequency,
            date_trunc('${freqMapper[frequency]}', date_added) AS date,
            SUM(miles_driven) AS value
            FROM vehicles
            WHERE date_added >= TO_TIMESTAMP('${startDate}', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AND date_added <= TO_TIMESTAMP('${endDate}', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
            GROUP BY date_trunc('${freqMapper[frequency]}', date_added)
            ORDER BY date ASC;`,
        "average-miles-driven":
            `SELECT
            '${reportType}' AS reportType,
            '${frequency}' AS frequency,
            date_trunc('${freqMapper[frequency]}', date_added) AS date,
            AVG(miles_driven) AS value
            FROM vehicles
            WHERE date_added >= TO_TIMESTAMP('${startDate}', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AND date_added <= TO_TIMESTAMP('${endDate}', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
            GROUP BY date_trunc('${freqMapper[frequency]}', date_added)
            ORDER BY date ASC;`,
        "most-driven-vehicles":
            `SELECT
            '${reportType}' AS reportType,
            '${frequency}' AS frequency,
            date_trunc('${freqMapper[frequency]}', date_added) AS date,
            vin,
            SUM(miles_driven) AS value
            FROM vehicles
            WHERE date_added >= TO_TIMESTAMP('${startDate}', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AND date_added <= TO_TIMESTAMP('${endDate}', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
            GROUP BY date_trunc('${freqMapper[frequency]}', date_added), vin
            ORDER BY value DESC;`,
        "least-driven-vehicles":
            `SELECT
            '${reportType}' AS reportType,
            '${frequency}' AS frequency,
            date_trunc('${freqMapper[frequency]}', date_added) AS date,
            vin,
            SUM(miles_driven) AS value
            FROM vehicles
            WHERE date_added >= TO_TIMESTAMP('${startDate}', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AND date_added <= TO_TIMESTAMP('${endDate}', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
            GROUP BY date_trunc('${freqMapper[frequency]}', date_added), vin
            ORDER BY value ASC;`,
        "miles-driven-by-type":
            `SELECT
            '${reportType}' AS reportType,
            '${frequency}' AS frequency,
            date_trunc('${freqMapper[frequency]}', date_added) AS date,
            type,
            SUM(miles_driven) AS value
            FROM vehicles
            WHERE date_added >= TO_TIMESTAMP('${startDate}', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AND date_added <= TO_TIMESTAMP('${endDate}', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
            GROUP BY date_trunc('${freqMapper[frequency]}', date_added), type
            ORDER BY value DESC;`,
    };

    if (queries[reportType]) {
        return queries[reportType];
    } else {
        throw new Error("Requested report not available yet!!!");
    }
    
}