import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { GRAU_OPTIONS, DANO_BASE_COST } from "../../../lib/constants";
import { useCreatorStore } from "../../../store/creatorStore";
import { AnimatePresence, motion } from "framer-motion";

const DanoTab = () => {
  const { grau, dano, setDano } = useCreatorStore();

  const handleTypeChange = (value: string) => {
    if (value === "auxiliar") {
      setDano({ type: "auxiliar", cost: 0 });
    } else {
      setDano({ type: value as "single" | "multiple", diceCount: 0, cost: 0, isSafeguard: false });
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (!dano) return;
    const diceCount = value[0];
    setDano({
      ...dano,
      diceCount: diceCount,
      cost: diceCount * DANO_BASE_COST,
    });
  };

  const handleSafeguardToggle = (checked: boolean) => {
    if (dano?.type === 'single') {
        setDano({
            ...dano,
            isSafeguard: checked
        });
    }
  };

  const maxDice = grau !== null ? GRAU_OPTIONS[grau].max_dice : 0;
  const currentDice = dano?.diceCount || 0;

  // LÓGICA ATUALIZADA: Adiciona a verificação para "Dano por Salvaguarda" (d8)
  const diceType = (() => {
    if (dano?.type === 'multiple') {
      return 'd6';
    }
    if (dano?.type === 'single' && dano.isSafeguard) {
      return 'd8';
    }
    if (grau !== null && grau > 5) {
      return 'd12';
    }
    return 'd10';
  })();

  return (
    <Card className="w-full bg-transparent border-none shadow-none text-white">
      <CardHeader className="px-1">
        <CardTitle className="text-2xl font-bold">Potencial de Dano</CardTitle>
        <CardDescription className="text-zinc-400">
          Selecione o tipo de dano e a quantidade de dados. Cada dado custa 1 ponto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-1">
        <RadioGroup onValueChange={handleTypeChange} value={dano?.type || ""} className="space-y-3">
          {/* Opções de Radio Group */}
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-zinc-900/50 border border-transparent has-[[data-state=checked]]:border-cyan-400/50 has-[[data-state=checked]]:bg-zinc-800/50 transition-all">
            <RadioGroupItem value="auxiliar" id="auxiliar" disabled={grau === null} className="border-zinc-600 data-[state=checked]:border-cyan-400 text-cyan-400"/>
            <Label htmlFor="auxiliar" className="text-base text-zinc-200 cursor-pointer">Técnica Auxiliar (Custo: 0)</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-zinc-900/50 border border-transparent has-[[data-state=checked]]:border-cyan-400/50 has-[[data-state=checked]]:bg-zinc-800/50 transition-all">
            <RadioGroupItem value="single" id="single" disabled={grau === null} className="border-zinc-600 data-[state=checked]:border-cyan-400 text-cyan-400"/>
            <Label htmlFor="single" className="text-base text-zinc-200 cursor-pointer">Alvo Único</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-zinc-900/50 border border-transparent has-[[data-state=checked]]:border-cyan-400/50 has-[[data-state=checked]]:bg-zinc-800/50 transition-all">
            <RadioGroupItem value="multiple" id="multiple" disabled={grau === null} className="border-zinc-600 data-[state=checked]:border-cyan-400 text-cyan-400"/>
            <Label htmlFor="multiple" className="text-base text-zinc-200 cursor-pointer">Múltiplos Alvos</Label>
          </div>
        </RadioGroup>

        {/* NOVA SEÇÃO: Checkbox de Dano por Salvaguarda */}
        <AnimatePresence>
        {dano?.type === "single" && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pl-2"
            >
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <Checkbox
                        id="salvaguarda"
                        checked={dano.isSafeguard}
                        onCheckedChange={(checked) => handleSafeguardToggle(checked as boolean)}
                        disabled={grau === null}
                        className="border-zinc-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <div>
                        <Label htmlFor="salvaguarda" className="text-base text-zinc-200 cursor-pointer">Dano por Salvaguarda</Label>
                        <p className="text-sm text-zinc-400">A criatura alvo recebe metade do dano, caso seja bem-sucedida na Salvaguarda.</p>
                    </div>
                </div>
            </motion.div>
        )}
        </AnimatePresence>

        {(dano?.type === "single" || dano?.type === "multiple") && (
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <Label className="text-lg font-semibold flex justify-between items-center">
              <span>Dados de Dano: {currentDice}{diceType}</span>
              <span className="text-sm text-zinc-400">Custo: {dano?.cost || 0} pontos</span>
            </Label>
            <Slider
              id="dano-slider"
              value={[currentDice]}
              max={maxDice}
              step={1}
              onValueChange={handleSliderChange}
              disabled={grau === null}
              className="[&>span:first-child]:h-2 [&>span:first-child>span]:bg-gradient-to-r [&>span:first-child>span]:from-cyan-400 [&>span:first-child>span]:to-violet-500 [&>span:last-child]:bg-white [&>span:last-child]:h-5 [&>span:last-child]:w-5"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DanoTab;