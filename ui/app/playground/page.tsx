import Search from '../playground/search';
import VehiclesTable from "../playground/table";
import { Suspense } from 'react';
import Pagination from "../playground/pagination";
import { fetchVehiclesCount } from "../lib/data";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchVehiclesCount(query);
  
  return (
    <main className="w-full">
      <div className="mt-4 flex justify-center">
        <div className="w-1/2"><Search placeholder="Search..." /></div>
      </div>
      <Suspense key={query + currentPage}>
        <VehiclesTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="flex w-full justify-center bg-gray-200 shadow shadow-gray-300 p-4">
        <Pagination totalPages={Math.ceil(totalPages / 10)} />
      </div>
    </main>
  );
}
