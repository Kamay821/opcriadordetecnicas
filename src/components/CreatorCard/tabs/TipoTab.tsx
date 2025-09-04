import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TIPO_OPTIONS } from "../../../lib/constants";
import { useCreatorStore } from "../../../store/creatorStore";

const TipoTab = () => {
  const { grau, tipo, setTipo } = useCreatorStore();

  const getTipoCost = (tipoId: string) => {
    if (tipoId === "combate" && grau !== null) {
      return Math.ceil(grau / 2) * -1;
    }
    return 0;
  };

  return (
    <Card className="w-full bg-transparent border-none shadow-none text-white">
      <CardHeader className="px-1">
        <CardTitle className="text-2xl font-bold">Tipo de Técnica</CardTitle>
        <CardDescription className="text-zinc-400">
          Defina a natureza da sua técnica.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-1">
        <RadioGroup
          onValueChange={(value) => setTipo(value)}
          value={tipo || ""}
          className="space-y-3"
        >
          {TIPO_OPTIONS.map((option) => (
             <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg bg-zinc-900/50 border border-transparent has-[[data-state=checked]]:border-cyan-400/50 has-[[data-state=checked]]:bg-zinc-800/50 transition-all">
              <RadioGroupItem value={option.id} id={option.id} disabled={grau === null} className="border-zinc-600 data-[state=checked]:border-cyan-400 text-cyan-400" />
              <Label htmlFor={option.id} className="flex-grow text-base text-zinc-200 cursor-pointer">
                {option.label} ({option.id === "combate" && grau !== null ? `${getTipoCost(option.id)}` : option.cost === 0 ? "0" : `+${option.cost}`} pontos)
              </Label>
              <span className="text-sm text-zinc-400 ml-auto pl-4 text-right">
                {option.description}
              </span>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default TipoTab;