import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreatorStore } from "../../../store/creatorStore";
import type { MultiOption } from "../../../lib/types";
import { Download, Loader2 } from 'lucide-react';
// A biblioteca é importada globalmente pelo script, então apenas declaramos seu tipo
declare const htmlToImage: any;

const ResumoTab = () => {
  const state = useCreatorStore();
  const { grau, tipo, alcance, dano, efeitos, reducoes, pointsSpent, maxPoints } = state;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [techniqueName, setTechniqueName] = useState("Nome da Técnica");

  const handleExport = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toJpeg(cardRef.current, { 
        quality: 1, 
        pixelRatio: 2,
        backgroundColor: '#020617'
      });
      const link = document.createElement('a');
      link.download = `${techniqueName.replace(/ /g, '_') || 'tecnica'}.jpeg`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Oops, algo deu errado!', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getDanoDescription = () => {
    if (!dano) return "Nenhum";
    if (dano.type === "auxiliar") return `Técnica Auxiliar`;
    
    // CORREÇÃO: Lógica completa para determinar o tipo de dado correto.
    const diceType = (() => {
        if (dano.type === 'multiple') {
          return 'd6';
        }
        if (grau !== null && grau > 5) {
          return 'd12';
        }
        return 'd10';
    })();

    return `${dano.diceCount || 0}${diceType}`;
  };

  const getAlcanceDetails = () => {
    if (!alcance || grau === null) return null;
    switch (alcance) {
      case "esfera":
        return `Até ${1.5 + (grau - 1) * 1.5}m de raio`;
      case "cone":
        return `Até ${12 + (grau - 1) * 3}m`;
      case "linha":
        return `Toque ou até ${grau * 6 + 3}m`;
      default:
        return null;
    }
  };

  const getEffectLabel = (option: MultiOption) => {
      if (option.id.startsWith("adicionar-condicao-")) {
          const condicaoName = option.id.replace("adicionar-condicao-", "");
          return `Condição: ${condicaoName.charAt(0).toUpperCase() + condicaoName.slice(1)}`;
      }
      return option.label;
  };

  return (
    <Card className="w-full bg-transparent border-none shadow-none text-white">
      <CardHeader className="px-1 flex-row justify-between items-center">
        <div>
            <CardTitle className="text-2xl font-bold">Ficha da Técnica</CardTitle>
            <CardDescription className="text-zinc-400">
            Revise e exporte sua criação final.
            </CardDescription>
        </div>
        <Button onClick={handleExport} disabled={isExporting || grau === null}>
            {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Download className="mr-2 h-4 w-4" />
            )}
            Exportar JPEG
        </Button>
      </CardHeader>
      <CardContent className="px-1 mt-4">
        {/* Este é o elemento que será exportado como imagem */}
        <div 
            ref={cardRef} 
            className="bg-slate-900/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-white"
            style={{ fontFamily: 'Inter, sans-serif' }} // Garante que a fonte seja incluída
        >
            <Input 
                value={techniqueName}
                onChange={(e) => setTechniqueName(e.target.value)}
                placeholder="Nome da Técnica"
                className="text-center text-4xl font-black bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 mb-6 h-auto text-cyan-300 placeholder:text-cyan-300/50"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-zinc-700 pb-4">
                {/* Grau */}
                <div className="text-center">
                    <Label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Grau</Label>
                    <p className="text-3xl font-black text-cyan-300">{grau || '—'}</p>
                </div>
                {/* Tipo */}
                <div className="text-center">
                    <Label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Tipo</Label>
                    <p className="text-3xl font-black capitalize">{tipo || '—'}</p>
                </div>
                {/* Dano */}
                <div className="text-center">
                    <Label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Dano</Label>
                    <p className="text-3xl font-black">{getDanoDescription()}</p>
                </div>
                {/* Alcance */}
                <div className="text-center">
                    <Label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Alcance</Label>
                    <p className="text-3xl font-black capitalize">{alcance || '—'}</p>
                    <p className="text-xs text-zinc-500 -mt-1">{getAlcanceDetails()}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
                {/* Efeitos */}
                <div>
                    <h3 className="font-bold text-lg text-cyan-300 mb-2">Efeitos</h3>
                    {efeitos.length > 0 ? (
                        <ul className="space-y-1">
                            {efeitos.map((e) => (
                            <li key={e.id} className="flex justify-between text-sm">
                                <span>{getEffectLabel(e)} {e.value && e.value > 1 ? `(x${e.value})` : ''}</span>
                                <span className="font-mono text-zinc-400">+{e.cost} pts</span>
                            </li>
                            ))}
                        </ul>
                    ) : (<p className="text-zinc-500 text-sm">Nenhum efeito adicionado.</p>)}
                </div>
                {/* Reduções */}
                <div>
                    <h3 className="font-bold text-lg text-red-400 mb-2">Reduções</h3>
                    {reducoes.length > 0 ? (
                        <ul className="space-y-1">
                            {reducoes.map((r) => (
                            <li key={r.id} className="flex justify-between text-sm">
                                <span>{r.label} {r.value && r.value > 1 ? `(x${r.value})` : ''}</span>
                                <span className="font-mono text-zinc-400">{r.cost} pts</span>
                            </li>
                            ))}
                        </ul>
                    ) : (<p className="text-zinc-500 text-sm">Nenhuma redução aplicada.</p>)}
                </div>
            </div>

            <Separator className="bg-zinc-700/50 my-4" />

            {/* Pontos */}
            <div className="p-4 rounded-lg bg-black/30 grid grid-cols-3 gap-4 text-center">
                <div>
                    <Label className="font-semibold text-zinc-400 text-sm">Máximo</Label>
                    <p className="text-3xl font-bold text-sky-400">{maxPoints}</p>
                </div>
                <div>
                    <Label className="font-semibold text-zinc-400 text-sm">Custo Final</Label>
                    <p className="text-3xl font-bold text-white">{pointsSpent}</p>
                </div>
                <div>
                    <Label className="font-semibold text-zinc-400 text-sm">Restantes</Label>
                    <p className={`text-3xl font-bold ${state.pointsAvailable >= 0 ? "text-green-400" : "text-red-400"}`}>{state.pointsAvailable}</p>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumoTab;
