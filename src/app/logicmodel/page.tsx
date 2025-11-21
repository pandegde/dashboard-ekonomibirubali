"use client";

import LogicModelHeader from "@/componentslogicmodel/logicmodelhead";
import LogicModelFlow from "@/componentslogicmodel/logicmodelflow";

export default function LogicModelPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2C416D] mb-8 text-center">
          Logic Model
        </h1>

        {/* Bagian Header */}
        <LogicModelHeader />

        {/* Bagian Flow Logic Model */}
        <LogicModelFlow />
      </div>
    </main>
  );
}
