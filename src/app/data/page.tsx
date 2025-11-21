// src/app/data/page.tsx
import { getData } from "@/actions/ekonomiBiruActions";
import DataView from "@/components/DataView"; // ini nanti kita ambil dari versi client kamu

export default async function DataPage() {
  const dataByYear = await getData("ekonomiBiru");
  return <DataView dataByYear={dataByYear} />;
}
