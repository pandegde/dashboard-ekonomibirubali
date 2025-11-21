import LeftPanel from "@/components/LeftPanel";
import BubbleChart from "@/components/BubbleChart";
import CardIndicator, { CardIndicatorRow } from "@/components/CardIndicator";

export default function DashboardPage() {
  return (
    /* posisi awal jangan di rubah */
    <div className="glass-box bg-white rounded-2xl shadow-lg w-full max-w-full p-4 sm:p-6 md:p-8 lg:p-2">
      {/* Grid utama: responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-6">
        
        {/* Logo Card (pojok kiri atas) */}
        <div className="col-span-6">
          <LeftPanel />
        </div>

        {/* BubbleChart di kanan */}
        <div className="col-span-6 flex items-center justify-center">
          <BubbleChart />
        </div>

        {/*Card indicator kanan Bawah*/}
        <div className="col-span-12 flex items-center justify-center">
          <CardIndicatorRow/>
        </div>

      </div>
    </div>
  );
}
