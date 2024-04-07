import React, { Suspense } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function RenderChart(data: any) {

  if (!data || !data.data || data.data.length === 0) {
    return null;
  }
  data = data.data;
  const reportType: string = data[0].reporttype;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload) {
      return null;
    }

    const { date, value, vin } = payload[0].payload;

    return (
      <div className="custom-tooltip">
        {date && <p>Date: {new Date(date).toLocaleDateString()}</p>} {/* Display date for total/average miles driven */}
        <p>{vin ? `Vehicle Id: ${vin}` : null} </p> {/* Display type or label based on report */}
        <p>{value ? `Miles Driven: ${value}` : null} </p>
      </div>
    );
  };

  return (
    <Suspense fallback={null}>
    <div>

      {reportType === 'total-miles-driven' || reportType === 'average-miles-driven' ? (
        <LineChart width={window.innerWidth - 350} height={850} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="value" stroke='#800080' />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString() || 'Date'} />
          <YAxis />
          <Legend formatter={() => 'Miles Driven'} />
          <Tooltip content={<CustomTooltip active={true} payload={data} />} />
        </LineChart>

      ) : (
        <BarChart width={window.innerWidth - 350} height={600} data={data}>
          {reportType === 'miles-driven-by-type'
            ? (<XAxis dataKey="type" tickFormatter={(type) => type || 'Vehicle Type'} />)
            : (<XAxis dataKey="vin" tickFormatter={(vin) => vin || 'Value'} />)} {/* Format x-axis for types or value */}
          <YAxis />
          <Legend />
          <Bar dataKey="value" fill="#EB8BEB" />
          <Tooltip content={<CustomTooltip active={true} payload={data} />} />
        </BarChart>
      )}
    </div>
    </Suspense>
  );
};
