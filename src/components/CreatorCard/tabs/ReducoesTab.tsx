import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreatorStore } from "../../../store/creatorStore";
import type { ReducaoId } from "../../../lib/types";
import { Zap, TrendingDown, SlidersHorizontal, AlertTriangle } from "lucide-react";
import React from "react";

// --- SUBCOMPONENTES REUTILIZÁVEIS ---

const CheckboxReducao = ({ id, label, description, onToggle, isSelected, disabled, cost }: { id: string, label: string, description: string, onToggle: () => void, isSelected: boolean, disabled: boolean, cost: number }) => (
    <div className={`flex items-start space-x-3 p-3 rounded-lg bg-zinc-900/50 border border-transparent has-[[data-state=checked]]:border-red-400/50 has-[[data-state=checked]]:bg-zinc-800/50 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} onClick={!disabled ? onToggle : undefined}>
        <Checkbox id={id} checked={isSelected} disabled={disabled} className="mt-1 border-zinc-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 pointer-events-none"/>
        <div>
            <Label htmlFor={id} className={`text-base ${isSelected ? 'text-white' : 'text-zinc-200'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>{label} ({cost} pts)</Label>
            <p className="text-sm text-zinc-400">{description}</p>
        </div>
    </div>
);

const CounterReducao = ({ id, label, value, onUpdate, max, disabled, cost }: { id: string, label: string, value: number, onUpdate: (value: number) => void, max?: number, disabled: boolean, cost: number }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 ${disabled && value === 0 ? 'opacity-50' : ''}`}>
        <div>
            <Label htmlFor={id} className="text-base text-zinc-200">{label}</Label>
            <p className="text-sm text-zinc-400">Redução atual: {cost} pts</p>
        </div>
        <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onUpdate(value - 1)} disabled={disabled || value === 0} className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 w-8 h-8">-</Button>
            <span className="min-w-[24px] text-center font-mono text-lg">{value}</span>
            <Button variant="outline" size="sm" onClick={() => onUpdate(value + 1)} disabled={disabled || (max !== undefined && value >= max)} className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 w-8 h-8">+</Button>
        </div>
    </div>
);

const InputReducao = ({ id, label, value, onUpdate, min, max, disabled, cost }: { id: string, label: string, value: number, onUpdate: (value: number) => void, min: number, max: number, disabled: boolean, cost: number }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let numValue = parseInt(e.target.value) || 0;
        if (numValue > max) numValue = max;
        onUpdate(numValue);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        let numValue = parseInt(e.target.value) || 0;
        if (numValue < min) numValue = min;
        onUpdate(numValue);
    };

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 ${disabled && value === 0 ? 'opacity-50' : ''}`}>
            <div>
                <Label htmlFor={id} className="text-base text-zinc-200">{label}</Label>
                <p className="text-sm text-zinc-400">Redução: {cost} pts (min: {min}, max: {max})</p>
            </div>
            <Input type="number" id={id} placeholder="Valor" value={value || ''} onChange={handleInputChange} onBlur={handleBlur} className="w-24 bg-zinc-800 border-zinc-700 text-right" disabled={disabled} min={min} max={max} />
        </div>
    );
};

const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-center gap-3 mt-6 mb-4 border-b border-zinc-700 pb-2">
        {icon}
        <h3 className="text-xl font-semibold text-red-400">{title}</h3>
    </div>
);

// --- COMPONENTE PRINCIPAL ---

const ReducoesTab = () => {
  const { reducoes, addReducao, removeReducao, updateReducao, grau, tipo, dano, reducaoTotal, limiteReducaoExcedido } = useCreatorStore();

  const isSelected = (id: ReducaoId | string) => reducoes.some(r => r.id === id);
  const getReducaoValue = (id: ReducaoId | string) => reducoes.find(r => r.id === id)?.value || 0;
  const getReducaoStoredCost = (id: ReducaoId | string) => reducoes.find(r => r.id === id)?.cost || 0;
  
  const canAddMoreReducao = !limiteReducaoExcedido;

  const handleToggle = (id: ReducaoId) => {
    if (grau === null) return;
    if (isSelected(id)) {
      removeReducao(id);
    } else if (canAddMoreReducao) {
      addReducao({ id, cost: 0, value: 1, label: id, description: '' });
    }
  };

  const handleUpdate = (id: ReducaoId, newValue: number) => {
    if (grau === null) return;
    const currentValue = getReducaoValue(id);

    if (newValue < currentValue) {
        updateReducao(id, newValue);
    } else if (newValue > currentValue && canAddMoreReducao) {
        updateReducao(id, newValue);
    } else if (newValue === 0) {
        removeReducao(id);
    }
  };
  
  return (
    <Card className="w-full bg-transparent border-none shadow-none text-white">
      <CardHeader className="px-1">
        <CardTitle className="text-2xl font-bold">Reduções de Custo</CardTitle>
        <CardDescription className="text-zinc-400">
          Adicione desvantagens para diminuir o custo total de pontos da sua técnica.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-1">
        
        <div className={`p-3 rounded-lg text-center ${limiteReducaoExcedido ? 'bg-red-900/50 border-red-500/50' : 'bg-zinc-900/50'} border transition-colors`}>
          <p className="font-semibold text-white">
            Redução Aplicada: <span className="font-mono">{reducaoTotal}</span> / <span className="font-mono">-{grau || 0}</span> (Limite do Grau)
          </p>
          {limiteReducaoExcedido && (
            <p className="text-xs text-red-400 mt-1 flex items-center justify-center gap-2">
              <AlertTriangle size={14} /> Você atingiu o limite máximo de redução para este Grau.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
            {/* COLUNA 1 */}
            <div>
                <SectionTitle icon={<Zap size={20} />} title="Fixas & Condicionais" />
                <div className="space-y-3">
                    <CheckboxReducao id="tecnica-demorada" label="Técnica Demorada" description="Requer um turno para carregar." onToggle={() => handleToggle('tecnica-demorada')} isSelected={isSelected('tecnica-demorada')} disabled={grau===null || (!isSelected('tecnica-demorada') && limiteReducaoExcedido)} cost={getReducaoStoredCost('tecnica-demorada')} />
                    <CheckboxReducao id="tecnica-devoradora" label="Técnica Devoradora" description="Consome o dobro de estamina." onToggle={() => handleToggle('tecnica-devoradora')} isSelected={isSelected('tecnica-devoradora')} disabled={grau===null || (!isSelected('tecnica-devoradora') && limiteReducaoExcedido)} cost={getReducaoStoredCost('tecnica-devoradora')} />
                    <CheckboxReducao id="tecnica-nao-ofensiva" label="Técnica Não Ofensiva" description="Redução varia se for de Combate (-2) ou Auxiliar (-1)." onToggle={() => handleToggle('tecnica-nao-ofensiva')} isSelected={isSelected('tecnica-nao-ofensiva')} disabled={grau===null || (tipo !== 'combate' && dano?.type !== 'auxiliar') || (!isSelected('tecnica-nao-ofensiva') && limiteReducaoExcedido)} cost={getReducaoStoredCost('tecnica-nao-ofensiva')} />
                </div>

                <SectionTitle icon={<TrendingDown size={20} />} title="Lineares & Escalonadas" />
                <div className="space-y-3">
                    <CounterReducao id="reduzir-area" label="Reduzir Área" value={getReducaoValue('reduzir-area')} onUpdate={(v) => handleUpdate('reduzir-area', v)} max={3} disabled={grau===null || (getReducaoValue('reduzir-area') === 0 && limiteReducaoExcedido)} cost={getReducaoStoredCost('reduzir-area')} />
                    <CounterReducao id="tecnica-debilitante" label="Técnica Debilitante" value={getReducaoValue('tecnica-debilitante')} onUpdate={(v) => handleUpdate('tecnica-debilitante', v)} max={2} disabled={grau===null || (getReducaoValue('tecnica-debilitante') === 0 && limiteReducaoExcedido)} cost={getReducaoStoredCost('tecnica-debilitante')} />
                    <CounterReducao id="tecnica-exaustiva" label="Técnica Exaustiva" value={getReducaoValue('tecnica-exaustiva')} onUpdate={(v) => handleUpdate('tecnica-exaustiva', v)} max={6} disabled={grau===null || (getReducaoValue('tecnica-exaustiva') === 0 && limiteReducaoExcedido)} cost={getReducaoStoredCost('tecnica-exaustiva')} />
                    <CounterReducao id="concentracao-crucial" label="Concentração Crucial" value={getReducaoValue('concentracao-crucial')} onUpdate={(v) => handleUpdate('concentracao-crucial', v)} disabled={grau===null || (getReducaoValue('concentracao-crucial') === 0 && limiteReducaoExcedido)} cost={getReducaoStoredCost('concentracao-crucial')} />
                </div>
            </div>

            {/* COLUNA 2 */}
            <div>
                <SectionTitle icon={<SlidersHorizontal size={20} />} title="Variáveis" />
                <div className="space-y-3">
                    <InputReducao id="requisito-limitador" label="Requisito Limitador" value={getReducaoValue('requisito-limitador')} onUpdate={(v) => handleUpdate('requisito-limitador', v)} min={0} max={5} disabled={grau===null || (getReducaoValue('requisito-limitador') === 0 && limiteReducaoExcedido)} cost={getReducaoStoredCost('requisito-limitador')} />
                    <InputReducao id="efeito-colateral" label="Efeito Colateral" value={getReducaoValue('efeito-colateral')} onUpdate={(v) => handleUpdate('efeito-colateral', v)} min={0} max={8} disabled={grau===null || (getReducaoValue('efeito-colateral') === 0 && limiteReducaoExcedido)} cost={getReducaoStoredCost('efeito-colateral')} />
                    <InputReducao id="tecnica-dependente" label="Técnica Dependente" value={getReducaoValue('tecnica-dependente')} onUpdate={(v) => handleUpdate('tecnica-dependente', v)} min={0} max={3} disabled={grau===null || (getReducaoValue('tecnica-dependente') === 0 && limiteReducaoExcedido)} cost={getReducaoStoredCost('tecnica-dependente')} />
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReducoesTab;

