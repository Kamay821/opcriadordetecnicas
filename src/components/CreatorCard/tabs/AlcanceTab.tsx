import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreatorStore } from "../../../store/creatorStore";

const AlcanceTab = () => {
  const { grau, alcance, setAlcance } = useCreatorStore();

  const getAlcanceDescription = (alcanceId: string) => {
    if (grau === null) return "Selecione um Grau primeiro.";
    switch (alcanceId) {
      case "esfera":
        return `Até ${1.5 + (grau - 1) * 1.5}m de raio.`;
      case "cone":
        return `Até ${12 + (grau - 1) * 3}m.`;
      case "linha":
        return `Toque ou até ${grau * 6 + 3}m.`;
      default:
        return "";
    }
  };
  
  const ALCANCE_OPTIONS = [
    { id: 'esfera', label: 'Esfera/Cilindro/Emanação' },
    { id: 'cone', label: 'Cone' },
    { id: 'linha', label: 'Linha' }
  ];

  return (
    <Card className="w-full bg-transparent border-none shadow-none text-white">
      <CardHeader className="px-1">
        <CardTitle className="text-2xl font-bold">Alcance da Técnica</CardTitle>
        <CardDescription className="text-zinc-400">
          Defina a distância e a área de efeito, que escalam com o Grau.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-1">
        <RadioGroup
          onValueChange={(value) => setAlcance(value)}
          value={alcance || ""}
          className="space-y-3"
        >
          {ALCANCE_OPTIONS.map(option => (
            <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg bg-zinc-900/50 border border-transparent has-[[data-state=checked]]:border-cyan-400/50 has-[[data-state=checked]]:bg-zinc-800/50 transition-all">
              <RadioGroupItem value={option.id} id={option.id} disabled={grau === null} className="border-zinc-600 data-[state=checked]:border-cyan-400 text-cyan-400" />
              <Label htmlFor={option.id} className="flex-grow text-base text-zinc-200 cursor-pointer">{option.label}</Label>
              <span className="text-sm text-zinc-400 ml-auto pl-4 text-right">{getAlcanceDescription(option.id)}</span>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default AlcanceTab;