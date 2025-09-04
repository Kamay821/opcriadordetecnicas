import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useCreatorStore } from "../../store/creatorStore";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import tabs from "./tabs";


interface CreatorCardProps {
  onBack: () => void;
}

const creatorTabs = [
  { id: "grau", label: "Grau", Component: tabs.GrauTab },
  { id: "tipo", label: "Tipo", Component: tabs.TipoTab },
  { id: "alcance", label: "Alcance", Component: tabs.AlcanceTab },
  { id: "dano", label: "Dano", Component: tabs.DanoTab },
  { id: "efeitos", label: "Efeitos", Component: tabs.EfeitosTab },
  { id: "reducoes", label: "Reduções", Component: tabs.ReducoesTab },
  { id: "resumo", label: "Resumo", Component: tabs.ResumoTab },
];

const CreatorCard = ({ onBack }: CreatorCardProps) => {
  const [activeTab, setActiveTab] = useState(creatorTabs[0].id);
  const { pointsSpent, maxPoints, pointsAvailable, resetState } = useCreatorStore();

  return (
    <Card className="w-full max-w-4xl h-auto max-h-[90vh] flex flex-col bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-4 md:p-6 text-white">
      {/* CABEÇALHO RESPONSIVO 
          - flex-shrink-0 garante que o cabeçalho nunca seja comprimido pelo conteúdo abaixo.
      */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-y-4 flex-shrink-0">
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            Oficina de Técnicas
            </h2>
            <p className="text-zinc-400 text-sm">Selecione as opções para montar sua habilidade.</p>
        </div>
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

      {/* CONTAINER DAS ABAS: Layout de coluna única 
          - flex-grow faz este container ocupar todo o espaço vertical restante.
          - min-h-0 é uma correção crucial para o flexbox que permite que o filho com overflow-y funcione corretamente.
      */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-grow min-h-0">
        
        {/* NAVEGAÇÃO DAS ABAS: Horizontal e rolável em todas as telas 
            - flex-shrink-0 garante que a barra de abas nunca seja comprimida.
        */}
        <div className="w-full overflow-x-auto custom-scrollbar pb-2 flex-shrink-0">
          <TabsList className="relative inline-flex w-max bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-800">
            {creatorTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="relative text-zinc-400 data-[state=active]:text-white px-4 py-2 text-base font-medium transition-colors rounded-md"
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-creator-tab-indicator"
                    className="absolute inset-0 bg-gradient-to-b from-zinc-700/50 to-zinc-800/50 border border-zinc-700 rounded-md z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* CONTAINER DE CONTEÚDO: Ocupa o espaço restante e tem rolagem vertical */}
        <div className="custom-scrollbar overflow-y-auto flex-grow min-h-0 mt-6 pr-2 -mr-2">
            {creatorTabs.map(tab => (
                <TabsContent key={tab.id} value={tab.id} className="focus-visible:ring-0 focus-visible:ring-offset-0 h-full">
                    <tab.Component />
                </TabsContent>
            ))}
        </div>
      </Tabs>
    </Card>
  );
};

export default CreatorCard;