// src/app/indikatorkinerja/page.tsx
import { getData as getIKU } from "@/actions/indikatorKinerjaUtamaActions";
import { getData as getIKK } from "@/actions/indikatorKinerjaKunciActions";
import { getData as getIKD } from "@/actions/indikatorKinerjaDaerahActions";
import IndikatorView from "@/components/IndikatorView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default async function IndikatorKinerjaPage() {
  const iku = await getIKU("indikatorKinerjaUtama");
  const ikk = await getIKK("indikatorKinerjaKunci");
  const ikd = await getIKD("indikatorKinerjaDaerah");

  return (
    <div className="glass-box rounded-3xl min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-100/50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg text-center mb-8">
          INDIKATOR KINERJA
        </h1>

        <Tabs defaultValue="iku" className="w-full">
          {/* Tab List */}
          <TabsList className="glass-box flex justify-center gap-4 bg-white/70 backdrop-blur-lg shadow rounded-xl p-4 mb-4 px-4 py-6">
            <TabsTrigger value="iku" className="px-6 py-4 rounded-lg font-semibold data-[state=active]:glass-box data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white hover:bg-slate-700 hover:text-white transition-all duration-100 transform hover:scale-105">
              IKU
            </TabsTrigger>
            <TabsTrigger value="ikk" className="px-6 py-4 rounded-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white hover:bg-slate-700 hover:text-white transition-all duration-100 transform hover:scale-105">
              IKK
            </TabsTrigger>
            <TabsTrigger value="ikd" className="px-6 py-4 rounded-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white hover:bg-slate-700 hover:text-white transition-all duration-100 transform hover:scale-105">
              IKD
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="iku">
            <IndikatorView dataByYear={iku} jenis="IKU" />
          </TabsContent>
          <TabsContent value="ikk">
            <IndikatorView dataByYear={ikk} jenis="IKK" />
          </TabsContent>
          <TabsContent value="ikd">
            <IndikatorView dataByYear={ikd} jenis="IKD" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
