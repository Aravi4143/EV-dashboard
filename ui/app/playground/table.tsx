import { fetchVehiclesData } from '../lib/data';
import { formatDateToLocal } from '../lib/utils';

export default async function VehiclesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const vehicles = await fetchVehiclesData(query, currentPage);
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <table className="hidden min-w-full text-gray-800 md:table bg-gray-200 shadow shadow-gray-300">
          <thead className="rounded-lg text-left text-sm font-normal">
            <tr>
              <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                Make
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                Model
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                Type
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                Miles Driven
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                VIN
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                License Plate
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                Date Added
              </th>
            </tr>
          </thead>
          <tbody className="">
            {vehicles?.map((vehicle: any) => (
              <tr
                key={vehicle.vin}
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
              >
                <td className="whitespace-nowrap px-3 py-3">
                  {vehicle.make}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {vehicle.model}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {vehicle.type}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {vehicle.miles_driven}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {vehicle.vin}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {vehicle.license_plate}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {formatDateToLocal(vehicle.date_added)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}