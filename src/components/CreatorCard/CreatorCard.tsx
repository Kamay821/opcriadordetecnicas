import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useCreatorStore } from "../../store/creatorStore";
import { motion } from "framer-motion";
import tabs from "./tabs";
import { ArrowLeft } from "lucide-react";

interface CreatorCardProps {
  onBack: () => void;
}

const creatorTabs = [
  { id: "grau", label: "Grau" },
  { id: "tipo", label: "Tipo" },
  { id: "alcance", label: "Alcance" },
  { id: "dano", label: "Dano" },
  { id: "efeitos", label: "Efeitos" },
  { id: "reducoes", label: "Reduções" },
  { id: "resumo", label: "Resumo" },
];

const CreatorCard = ({ onBack }: CreatorCardProps) => {
  const [activeTab, setActiveTab] = useState(creatorTabs[0].id);
  const { pointsSpent, maxPoints, pointsAvailable, resetState } = useCreatorStore();

  return (
    <Card className="w-full max-w-4xl h-auto max-h-[90vh] flex flex-col bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-4 md:p-6 text-white">
      <header className="flex justify-between items-center mb-6 flex-wrap gap-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
          Oficina de Técnicas
        </h2>
        <div className="flex gap-4 items-center flex-wrap-reverse justify-end w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => { resetState(); onBack(); }}
            className="bg-transparent border-zinc-700 hover:bg-zinc-800/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
          <div className="text-right px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <span className="text-lg md:text-xl font-semibold tracking-tighter">
              {pointsSpent} / <span className="text-zinc-400">{maxPoints} Pts</span>
            </span>
            <p className={`text-sm font-mono ${pointsAvailable >= 0 ? "text-green-400" : "text-red-400"}`}>
              {pointsAvailable} restantes
            </p>
          </div>
        </div>
      </header>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-grow min-h-0">
        <div className="w-full overflow-x-auto">
          <TabsList className="relative inline-flex w-max bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-800">
            {creatorTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="relative text-zinc-400 data-[state=active]:text-white px-4 py-2 text-base font-medium transition-colors rounded-md"
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-creator-tab"
                    className="absolute inset-0 bg-gradient-to-b from-zinc-700/50 to-zinc-800/50 border border-zinc-700 rounded-md z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Aplicando a classe da barra de rolagem customizada */}
        <div className="custom-scrollbar overflow-y-auto flex-grow min-h-0 mt-6 pr-2">
            <TabsContent value="grau"><tabs.GrauTab /></TabsContent>
            <TabsContent value="tipo"><tabs.TipoTab /></TabsContent>
            <TabsContent value="alcance"><tabs.AlcanceTab /></TabsContent>
            <TabsContent value="dano"><tabs.DanoTab /></TabsContent>
            <TabsContent value="efeitos"><tabs.EfeitosTab /></TabsContent>
            <TabsContent value="reducoes"><tabs.ReducoesTab /></TabsContent>
            <TabsContent value="resumo"><tabs.ResumoTab /></TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default CreatorCard;