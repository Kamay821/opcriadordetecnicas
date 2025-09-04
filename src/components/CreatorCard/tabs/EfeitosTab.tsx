import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreatorStore } from "../../../store/creatorStore";
import type { MultiOption, EffectId } from "../../../lib/types";
import { EFEITOS_CONDICOES } from "../../../lib/constants";
import { getEffectCost } from "../../../lib/pointsEngine";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, Sword, Heart, Zap, Repeat, PlusCircle } from "lucide-react";
import React from "react";

// --- SUBCOMPONENTES PARA ORGANIZAÇÃO ---

const CheckboxEffect = ({ id, label, description, onToggle, isSelected, disabled }: { id: string, label: string, description: string, onToggle: () => void, isSelected: boolean, disabled: boolean }) => (
    <div className={`flex items-start space-x-3 p-3 rounded-lg bg-zinc-900/50 border border-transparent has-[[data-state=checked]]:border-cyan-400/50 has-[[data-state=checked]]:bg-zinc-800/50 transition-all ${disabled ? 'opacity-50' : ''}`}>
        <Checkbox id={id} checked={isSelected} onCheckedChange={onToggle} disabled={disabled} className="mt-1 border-zinc-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"/>
        <div>
            <Label htmlFor={id} className={`text-base cursor-pointer ${isSelected ? 'text-white' : 'text-zinc-200'}`}>{label}</Label>
            <p className="text-sm text-zinc-400">{description}</p>
        </div>
    </div>
);

const CounterEffect = ({ id, label, value, onUpdate, max, disabled }: { id: string, label: string, value: number, onUpdate: (value: number) => void, max?: number, disabled: boolean }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 ${disabled ? 'opacity-50' : ''}`}>
        <Label htmlFor={id} className="text-base text-zinc-200">{label}</Label>
        <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onUpdate(value - 1)} disabled={disabled || value === 0} className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 w-8 h-8">-</Button>
            <span className="min-w-[24px] text-center font-mono text-lg">{value}</span>
            <Button variant="outline" size="sm" onClick={() => onUpdate(value + 1)} disabled={disabled || (max !== undefined && value >= max)} className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 w-8 h-8">+</Button>
        </div>
    </div>
);

// CORREÇÃO: Lógica movida para o onClick de cada item para permitir a deseleção.
const RadioGroupEffect = ({ title, options, selectedValue, onUpdate, disabled }: { title: string, options: {id: string, label: string}[], selectedValue: string, onUpdate: (value: string | null) => void, disabled: boolean }) => (
    <div>
        <Label className="font-bold text-lg text-zinc-200">{title}</Label>
        <RadioGroup value={selectedValue} className="mt-2 space-y-3">
            {options.map(opt => (
                <div 
                    key={opt.id}
                    onClick={() => {
                        if (disabled) return;
                        onUpdate(opt.id === selectedValue ? null : opt.id);
                    }}
                    className={`flex items-center space-x-3 p-3 rounded-lg bg-zinc-900/50 border border-transparent has-[[data-state=checked]]:border-cyan-400/50 has-[[data-state=checked]]:bg-zinc-800/50 transition-all cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <RadioGroupItem value={opt.id} id={opt.id} disabled={disabled} className="border-zinc-600 data-[state=checked]:border-cyan-400 text-cyan-400 pointer-events-none" />
                    <Label htmlFor={opt.id} className="text-base text-zinc-200 cursor-pointer">{opt.label}</Label>
                </div>
            ))}
        </RadioGroup>
    </div>
);

// --- COMPONENTE PRINCIPAL ---

const EfeitosTab = () => {
  const { efeitos, addEfeito, removeEfeito, updateEfeito, grau } = useCreatorStore();
  const [showCondicoes, setShowCondicoes] = useState(false);

  const isSelected = (id: EffectId | string) => efeitos.some(e => e.id === id);
  const getEffectValue = (id: EffectId | string) => efeitos.find(e => e.id === id)?.value || 0;

  const handleToggle = (id: EffectId, optionData?: Partial<MultiOption>) => {
    if (grau === null) return;
    if (isSelected(id)) {
      removeEfeito(id);
    } else {
      addEfeito({
          id, cost: 0, value: 1, // O custo será calculado no store
          label: optionData?.label || id,
          description: optionData?.description || ''
      });
    }
  };

  const handleUpdate = (id: EffectId, newValue: number) => {
    if (grau === null) return;
    if (newValue <= 0) {
      removeEfeito(id);
    } else {
      updateEfeito(id, newValue);
    }
  };
  
  const handleRadioUpdate = (groupId: 'critico' | 'movimento' | 'reducao-movimento', newId: EffectId | null) => {
      if (grau === null) return;
      const groupIds = {
          'critico': ['adicionar-critico-19-20', 'adicionar-critico-18-20'],
          'movimento': ['aumentar-movimento-3m', 'aumentar-movimento-6m'],
          'reducao-movimento': ['reducao-movimento-metade', 'reducao-movimento-zero']
      };
      
      groupIds[groupId].forEach(id => removeEfeito(id as EffectId));

      if (newId) {
          addEfeito({ id: newId, cost: 0, value: 1, label: newId, description: '' });
      }
  };

  const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-center gap-3 mt-8 mb-4 border-b border-zinc-700 pb-2">
      {icon}
      <h3 className="text-xl font-semibold text-cyan-300">{title}</h3>
    </div>
  );

  return (
    <Card className="w-full bg-transparent border-none shadow-none text-white">
      <CardHeader className="px-1">
        <CardTitle className="text-2xl font-bold">Efeitos Especiais</CardTitle>
        <CardDescription className="text-zinc-400">
          Adicione habilidades únicas à sua técnica. Cada efeito possui um custo de pontos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-1">
        
        {/* --- SEÇÃO DE CONDIÇÕES --- */}
        <div>
            <Button onClick={() => setShowCondicoes(!showCondicoes)} variant="outline" className="w-full justify-center bg-zinc-800/80 border-cyan-500/50 text-cyan-300 hover:bg-zinc-700/80 hover:text-cyan-200" disabled={grau === null}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {showCondicoes ? 'Ocultar Lista de Condições' : 'Adicionar Condição'}
            </Button>
            <AnimatePresence>
                {showCondicoes && (
                    <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 overflow-hidden">
                        {EFEITOS_CONDICOES.map(cond => {
                            const id = `adicionar-condicao-${cond.id}`;
                            return (
                                <div key={id} className="flex items-center space-x-2 p-2 rounded bg-zinc-900/70">
                                    <Checkbox id={id} checked={isSelected(id)} onCheckedChange={() => handleToggle(id as EffectId, { ...cond })} disabled={grau === null} className="border-zinc-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"/>
                                    <Label htmlFor={id} className="text-sm text-zinc-300 cursor-pointer">{cond.label} ({cond.cost})</Label>
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
            {/* COLUNA 1 */}
            <div>
                <SectionTitle icon={<Zap size={20} />} title="Geral & Utilitário" />
                <div className="space-y-3">
                    <CheckboxEffect id="adicionar-vantagem" label="Adicionar Vantagem" description={`Custo: ${getEffectCost('adicionar-vantagem', grau)} pts`} onToggle={() => handleToggle('adicionar-vantagem')} isSelected={isSelected('adicionar-vantagem')} disabled={grau===null} />
                    <CheckboxEffect id="tecnica-rapida" label="Técnica Rápida" description={`Custo: ${getEffectCost('tecnica-rapida', grau)} pts`} onToggle={() => handleToggle('tecnica-rapida')} isSelected={isSelected('tecnica-rapida')} disabled={grau===null} />
                    <CheckboxEffect id="controle-cirurgico" label="Controle Cirúrgico" description={`Custo: ${getEffectCost('controle-cirurgico', grau)} pts`} onToggle={() => handleToggle('controle-cirurgico')} isSelected={isSelected('controle-cirurgico')} disabled={grau===null} />
                    <CheckboxEffect id="tecnica-dominada" label="Técnica Dominada" description={`Custo: ${getEffectCost('tecnica-dominada', grau)} pts`} onToggle={() => handleToggle('tecnica-dominada')} isSelected={isSelected('tecnica-dominada')} disabled={grau===null} />
                    <CheckboxEffect id="criar-lacaio" label="Criar Lacaio" description={`Custo: ${getEffectCost('criar-lacaio', grau)} pts`} onToggle={() => handleToggle('criar-lacaio')} isSelected={isSelected('criar-lacaio')} disabled={grau===null} />
                    <CounterEffect id="duracao-prolongada" label="Duração Prolongada (min)" value={getEffectValue('duracao-prolongada')} onUpdate={(v) => handleUpdate('duracao-prolongada', v)} disabled={grau===null} />
                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50">
                        <Label htmlFor="condicao-extra" className="text-base text-zinc-200">Condição/Efeito Extra</Label>
                        <Input type="number" id="condicao-extra" placeholder="Custo" value={getEffectValue('condicao-extra') || ''} onChange={(e) => handleUpdate('condicao-extra', parseInt(e.target.value) || 0)} className="w-24 bg-zinc-800 border-zinc-700 text-right" disabled={grau===null} />
                    </div>
                </div>

                <SectionTitle icon={<Sword size={20} />} title="Ofensivo" />
                <div className="space-y-3">
                    <CheckboxEffect id="acerto-automatico" label="Acerto Automático" description={`Custo: ${getEffectCost('acerto-automatico', grau)} pts`} onToggle={() => handleToggle('acerto-automatico')} isSelected={isSelected('acerto-automatico')} disabled={grau===null} />
                    <CheckboxEffect id="ataque-cerco" label="Ataque de Cerco" description={`Custo: ${getEffectCost('ataque-cerco', grau)} pts`} onToggle={() => handleToggle('ataque-cerco')} isSelected={isSelected('ataque-cerco')} disabled={grau===null} />
                    <CheckboxEffect id="ataques-multiplos" label="Ataques Múltiplos" description={`Custo: ${getEffectCost('ataques-multiplos', grau)} pts`} onToggle={() => handleToggle('ataques-multiplos')} isSelected={isSelected('ataques-multiplos')} disabled={grau===null} />
                    <CounterEffect id="aumentar-acerto" label="Aumentar Acerto" value={getEffectValue('aumentar-acerto')} onUpdate={(v) => handleUpdate('aumentar-acerto', v)} max={3} disabled={grau===null} />
                    <CounterEffect id="aumentar-dano" label="Aumentar Dano Fixo" value={getEffectValue('aumentar-dano')} onUpdate={(v) => handleUpdate('aumentar-dano', v)} max={3} disabled={grau===null} />
                    <CounterEffect id="dano-adicional-dado" label="Dados de Dano Adicionais" value={getEffectValue('dano-adicional-dado')} onUpdate={(v) => handleUpdate('dano-adicional-dado', v)} max={5} disabled={grau===null} />
                    <CounterEffect id="criar-arma" label="Criar Arma (dados d8)" value={getEffectValue('criar-arma')} onUpdate={(v) => handleUpdate('criar-arma', v)} max={4} disabled={grau===null} />
                    <RadioGroupEffect title="Crítico Aprimorado" options={[{id: 'adicionar-critico-19-20', label: '19-20 (Custo: 1 pt)'}, {id: 'adicionar-critico-18-20', label: '18-20 (Custo: 3 pts)'}]} selectedValue={efeitos.find(e => e.id.startsWith('adicionar-critico-'))?.id || ''} onUpdate={(v) => handleRadioUpdate('critico', v as EffectId | null)} disabled={grau===null} />
                </div>
            </div>

            {/* COLUNA 2 */}
            <div>
                <SectionTitle icon={<Repeat size={20} />} title="Dano Contínuo & Efeitos em Área" />
                <div className="space-y-3">
                    <CheckboxEffect id="dano-continuo" label="Dano Contínuo" description={`Custo: ${getEffectCost('dano-continuo', grau)} pts`} onToggle={() => handleToggle('dano-continuo')} isSelected={isSelected('dano-continuo')} disabled={grau===null} />
                    <CheckboxEffect id="dano-insistente" label="Dano Insistente" description={`Custo: ${getEffectCost('dano-insistente', grau)} pts`} onToggle={() => handleToggle('dano-insistente')} isSelected={isSelected('dano-insistente')} disabled={grau===null} />
                    <CheckboxEffect id="condicao-em-area" label="Condição/Efeito em Área" description={`Custo: ${getEffectCost('condicao-em-area', grau)} pts`} onToggle={() => handleToggle('condicao-em-area')} isSelected={isSelected('condicao-em-area')} disabled={grau===null} />
                    <CounterEffect id="aumentar-alcance" label="Aumentar Alcance (+6m)" value={getEffectValue('aumentar-alcance')} onUpdate={(v) => handleUpdate('aumentar-alcance', v)} disabled={grau===null} />
                    <CounterEffect id="aumentar-area" label="Aumentar Área (+3m)" value={getEffectValue('aumentar-area')} onUpdate={(v) => handleUpdate('aumentar-area', v)} disabled={grau===null} />
                    <CounterEffect id="aumentar-cd" label="Aumentar CD" value={getEffectValue('aumentar-cd')} onUpdate={(v) => handleUpdate('aumentar-cd', v)} max={2} disabled={grau===null} />
                </div>

                <SectionTitle icon={<Heart size={20} />} title="Suporte" />
                <div className="space-y-3">
                    <CounterEffect id="adicionar-cura" label="Dados de Cura" value={getEffectValue('adicionar-cura')} onUpdate={(v) => handleUpdate('adicionar-cura', v)} disabled={grau===null} />
                    <CounterEffect id="adicionar-pv-temporario" label="PVs Temporários" value={getEffectValue('adicionar-pv-temporario')} onUpdate={(v) => handleUpdate('adicionar-pv-temporario', v)} disabled={grau===null} />
                </div>

                <SectionTitle icon={<Shield size={20} />} title="Defensivo & Mobilidade" />
                <div className="space-y-3">
                    <CounterEffect id="aumentar-cr" label="Aumentar CR" value={getEffectValue('aumentar-cr')} onUpdate={(v) => handleUpdate('aumentar-cr', v)} max={3} disabled={grau===null} />
                    <CounterEffect id="adicionar-voo" label="Voo (Níveis)" value={getEffectValue('adicionar-voo')} onUpdate={(v) => handleUpdate('adicionar-voo', v)} disabled={grau===null} />
                    <CounterEffect id="contencao-dano-coletivo" label="Contenção Coletiva (d8)" value={getEffectValue('contencao-dano-coletivo')} onUpdate={(v) => handleUpdate('contencao-dano-coletivo', v)} max={15} disabled={grau===null} />
                    <CounterEffect id="contencao-dano-individual" label="Contenção Individual (2d8)" value={getEffectValue('contencao-dano-individual')} onUpdate={(v) => handleUpdate('contencao-dano-individual', v)} max={15} disabled={grau===null} />
                    <CounterEffect id="adicionar-empurrao" label="Adicionar Empurrão (3m)" value={getEffectValue('adicionar-empurrao')} onUpdate={(v) => handleUpdate('adicionar-empurrao', v)} disabled={grau===null} />
                    <RadioGroupEffect title="Aumentar Movimento" options={[{id: 'aumentar-movimento-3m', label: '+3m (Custo: 1 pt)'}, {id: 'aumentar-movimento-6m', label: '+6m (Custo: 2 pts)'}]} selectedValue={efeitos.find(e => e.id.startsWith('aumentar-movimento-'))?.id || ''} onUpdate={(v) => handleRadioUpdate('movimento', v as EffectId | null)} disabled={grau===null} />
                    <RadioGroupEffect title="Redução de Movimento" options={[{id: 'reducao-movimento-metade', label: 'Metade (Custo: 1 pt)'}, {id: 'reducao-movimento-zero', label: 'Zero (Custo: 2 pts)'}]} selectedValue={efeitos.find(e => e.id.startsWith('reducao-movimento-'))?.id || ''} onUpdate={(v) => handleRadioUpdate('reducao-movimento', v as EffectId | null)} disabled={grau===null} />
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EfeitosTab;