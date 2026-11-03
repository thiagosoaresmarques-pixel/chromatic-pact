import { AiSkillTier } from '../types/game';

export interface AiSkillTierSpec {
  tier: AiSkillTier;
  roman: 'I' | 'II' | 'III' | 'IV' | 'V';
  shortLabel: string;
  title: string;
  description: string;
  temperature: number;
  useValueMlp: boolean;
  beamWidth: number;
  beamDepth: number;
  antiLethalLookahead: boolean;
  allowBloodPact: boolean;
  allowRowManeuver: boolean;
}

export const AI_SKILL_TIER_SPECS: Record<AiSkillTier, AiSkillTierSpec> = {
  1: {
    tier: 1,
    roman: 'I',
    shortLabel: 'Tier I • Iniciante',
    title: 'Patrulha de Fronteira',
    description:
      'Grimório de fronteira (foco em Comuns e Incomuns) e postura tática direta.',
    temperature: 1.35,
    useValueMlp: false,
    beamWidth: 1,
    beamDepth: 1,
    antiLethalLookahead: false,
    allowBloodPact: false,
    allowRowManeuver: false,
  },
  2: {
    tier: 2,
    roman: 'II',
    shortLabel: 'Tier II • Regular',
    title: 'Guarnição Regular',
    description:
      'Grimório intermediário (1–2 Lendárias) e domínio posicional disciplinado.',
    temperature: 0.7,
    useValueMlp: false,
    beamWidth: 1,
    beamDepth: 1,
    antiLethalLookahead: false,
    allowBloodPact: false,
    allowRowManeuver: true,
  },
  3: {
    tier: 3,
    roman: 'III',
    shortLabel: 'Tier III • Veterano',
    title: 'Bastião Veterano',
    description:
      'Grimório sinérgico (4–5 Lendárias) com domínio completo de terreno e canalizações.',
    temperature: 0.25,
    useValueMlp: true,
    beamWidth: 1,
    beamDepth: 1,
    antiLethalLookahead: false,
    allowBloodPact: true,
    allowRowManeuver: true,
  },
  4: {
    tier: 4,
    roman: 'IV',
    shortLabel: 'Tier IV • Mestre',
    title: 'Elite do Alto Trono',
    description:
      'Grimório de elite (7–8 Lendárias) com planejamento profundo de sequências táticas.',
    temperature: 0.06,
    useValueMlp: true,
    beamWidth: 4,
    beamDepth: 3,
    antiLethalLookahead: false,
    allowBloodPact: true,
    allowRowManeuver: true,
  },
  5: {
    tier: 5,
    roman: 'V',
    shortLabel: 'Tier V • Grão-Mestre',
    title: 'Soberano Ápice',
    description:
      'Grimório Real Completo (10 Lendárias + General da Roda) e maestria soberana absoluta.',
    temperature: 0,
    useValueMlp: true,
    beamWidth: 5,
    beamDepth: 4,
    antiLethalLookahead: true,
    allowBloodPact: true,
    allowRowManeuver: true,
  },
};
