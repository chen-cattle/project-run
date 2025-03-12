import { ProjectConfig } from '../cache';

export const ProjectJSONName = 'package.json';


export const PROJECT_NAME = 'project-run';


export const CONFIG_PACK = 'pack';
export const CONFIG_SINGLE = 'single';
export const CONFIG_EXIT = 'exit';

export const PACK_COMMAND = {
  npm: 'npm run',
  yarn: 'yarn',
  pnpm: 'pnpm',
};

export const DEFAULT_OPTION: ProjectConfig = {
  pack: 'npm',
  single: true,
  exit: false,
};



export type CommandKey = 'dev' | 'start' | 'watch' | string;

export const INSTRUCTS: CommandKey[] = ['dev', 'start', 'watch'];