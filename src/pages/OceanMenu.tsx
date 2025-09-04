import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import CreatorCard from "@/components/CreatorCard/CreatorCard";
import { useCreatorStore } from "@/store/creatorStore";
import { Sparkles } from "lucide-react";

const OceanMenu = () => {
  const [showCreator, setShowCreator] = useState(false);
  const { resetState } = useCreatorStore();

  const handleShowCreator = () => {
    resetState();
    setShowCreator(true);
  };

  const handleHideCreator = () => {
    setShowCreator(false);
  };

  return (
    // CORREÇÃO: Removido "bg-black" daqui. O fundo agora é 100% responsabilidade do vídeo e overlays.
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Efeito Aurora: Glows animados no fundo para uma atmosfera mágica */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(0,122,255,.15),rgba(255,255,255,0))]"></div>
      </div>
      
      {/* Vídeo de Fundo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover -z-30 brightness-[.40]"
        // VERIFIQUE AQUI: Certifique-se de que o nome do arquivo "video.mp4" está correto.
        src="/video.mp4"
      />

      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!showCreator ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl"
            >
              <Card className="w-full bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl">
                <CardContent className="p-8 md:p-10">
                  <Tabs defaultValue="home" className="w-full">
                    <div className="flex justify-between items-start mb-10 flex-wrap gap-6">
                      <TabsList className="bg-transparent p-0 gap-8">
                        <TabsTrigger value="home" className="text-zinc-400 data-[state=active]:text-white p-0 bg-transparent text-lg font-medium">Home</TabsTrigger>
                        <TabsTrigger value="about" className="text-zinc-400 data-[state=active]:text-white p-0 bg-transparent text-lg font-medium">Sobre</TabsTrigger>
                        <TabsTrigger value="info" className="text-zinc-400 data-[state=active]:text-white p-0 bg-transparent text-lg font-medium">Contato</TabsTrigger>
                      </TabsList>
                      <Button
                        onClick={handleShowCreator}
                        className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition-all duration-300 hover:scale-105"
                      >
                        <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur transition-all duration-300 group-hover:opacity-100 group-hover:blur-lg" />
                        <Sparkles className="h-5 w-5 mr-2 text-violet-300" />
                        Forjar Técnica
                      </Button>
                    </div>

                    <TabsContent value="home" className="text-center text-white">
                      <h1 className="text-5xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-400 leading-tight">
                        Criador de Técnicas
                      </h1>
                      <p className="text-lg text-zinc-300 mb-4 max-w-xl mx-auto drop-shadow-lg">
                        Mergulhe na criação. Dê vida a técnicas lendárias com um sistema de pontos balanceado e intuitivo. V 1.5.7
                      </p>
                      <p className="text-xs text-zinc-600 mt-8 tracking-widest uppercase">- Sistema OP RPG -</p>
                    </TabsContent>
                    
                    <TabsContent value="about" className="text-zinc-300 text-center">
                      <h2 className="text-3xl font-bold mb-2 text-center">Sobre o Projeto</h2>
                      <p className="text-center">Esta ferramenta foi criada por fãs para a comunidade de OP RPG, com base no sistema de Brendo Neves. Acesse o discord do RPG por esse <a href="hhttps://discord.gg/vnXyMvaS" target="_blank"><b>link</b></a></p>
                      <p className="text-xs text-zinc-600 mt-8 tracking-widest uppercase">- Sistema OP RPG -</p>
                    </TabsContent>

                    <TabsContent value="info" className="text-center text-white">
                      <h1 className="text-3xl font-bold mb-2 text-center">
                        Informações para contato
                      </h1>
                      <p className="text-lg text-zinc-300 mb-4 max-w-xl mx-auto drop-shadow-lg">
                        Meu Discord: kamay821<br />Email de contato: kamayabreu@gmail.com
                      </p>
                      <p className="text-xs text-zinc-600 mt-8 tracking-widest uppercase">- Sistema OP RPG -</p>
                    </TabsContent>

                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="creator"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex items-center justify-center"
            >
              <CreatorCard onBack={handleHideCreator} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default OceanMenu;