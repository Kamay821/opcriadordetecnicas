import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GRAU_OPTIONS } from "../../../lib/constants";
import { useCreatorStore } from "../../../store/creatorStore";

const GrauTab = () => {
  const { grau, setGrau } = useCreatorStore();

  return (
    // ESTILO: Card transparente para se mesclar com o CreatorCard
    <Card className="w-full bg-transparent border-none shadow-none text-white">
      <CardHeader className="px-1">
        <CardTitle className="text-2xl font-bold">Grau da Técnica</CardTitle>
        <CardDescription className="text-zinc-400">
          Escolha o nível de poder. Isso define o máximo de pontos que você pode gastar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-1">
        <RadioGroup
          onValueChange={(value) => setGrau(parseInt(value))}
          value={grau?.toString() || ""}
          className="space-y-3"
        >
          {Object.entries(GRAU_OPTIONS).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-3 p-3 rounded-lg bg-zinc-900/50 border border-transparent has-[[data-state=checked]]:border-cyan-400/50 has-[[data-state=checked]]:bg-zinc-800/50 transition-all">
              <RadioGroupItem value={key} id={key} className="border-zinc-600 data-[state=checked]:border-cyan-400 text-cyan-400" />
              <Label htmlFor={key} className="flex-grow text-base text-zinc-200 cursor-pointer">
                {key}º GRAU (Máx. {value.max_points})
              </Label>
              <span className="text-sm text-zinc-400 ml-auto pl-4 text-right">
                {value.description}
              </span>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default GrauTab;