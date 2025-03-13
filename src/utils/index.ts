import { CONFIG_EXIT, CONFIG_SCRIPT, DEFAULT_OPTION, INSTRUCTS, PACK_COMMAND, ProjectJSONName } from './../const/index';
import * as vscode from 'vscode';
import { existsSync, readFileSync } from 'fs';
import { CONFIG_PACK, CONFIG_SINGLE, PROJECT_NAME } from '../const';
import { ProjectConfig } from '../cache';
import { join } from 'path';
import En from '../../package.nls.json';
import Zh from '../../package.nls.zh-cn.json';

// 读取json文件
export function readJSON(path: string) {
  const file = readFileSync(path, 'utf-8');
  return JSON.parse(file);

}

// 监听某个属性，并执行回调
export function observe<T, V>(obj: T, key: string, value: V, cb: (val: V) => void) {
  Object.defineProperty(obj, key, {
    set(v) {
      cb?.(v);
      value = v;
    }
  });
}

// 获取退出指令
export function stopShell() {
  if (process.platform === 'win32') {
    // Windows
    // terminal.sendText('\x03');
    return '\x03';
  } else {
      // Unix-like systems (Linux, macOS)
      // terminal.sendText('\x03', false);
      return '\x03';
  }
}


// 获取配置
export function getConfig(work: vscode.WorkspaceFolder): ProjectConfig {
    const config = vscode.workspace.getConfiguration(PROJECT_NAME, work);

    return {
      pack: computedVal(config.get<ProjectConfig['pack']>(CONFIG_PACK), DEFAULT_OPTION.pack),
      single: computedVal(config.get<boolean>(CONFIG_SINGLE), DEFAULT_OPTION.single),
      exit: computedVal(config.get<boolean>(CONFIG_EXIT), DEFAULT_OPTION.exit),
      script: computedVal(config.get<string[]>(CONFIG_SCRIPT), DEFAULT_OPTION.script),
    };
}

// 获取当前激活的工作区
export function getActiveWorkspaceFolder() {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return undefined;
  }
  return vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);

}


export type CommandType = {prefix: string, suffix: string}

// 获取要运行的指令
export function getCommand(config: ProjectConfig, text: string): CommandType {
  return {
    prefix: PACK_COMMAND[config.pack],
    suffix: text
  };
}


export function joinCommand(command: CommandType): string {
  return `${command.prefix} ${command.suffix}`; 
}

export function getProject(workspace: vscode.WorkspaceFolder) {
  const packagePath = join(workspace.uri.fsPath, ProjectJSONName);
    if(existsSync(packagePath)) {
      const config = getConfig(workspace);
      const scriptList = Object.entries(readJSON(packagePath).scripts || {});
      const curDev = getInstructs(config).find(item => {
        return !!scriptList.find(script => script[0] === item);
      }) || 'dev';
      return {
        name: workspace.name,
        path: packagePath,
        config: config,
        devCommand: joinCommand(getCommand(config, curDev)),
        origin: workspace,
        terminals: [],
        executes: scriptList.map(([key, value]) => {
          return {
            key,
            value: value as string
          };
        })
      };
    }
}


// 值为空时返回默认值
export function computedVal<T>(val: T, defaultVal: NonNullable<T>): NonNullable<T>{
  if(typeof val === undefined || val === null) {
    return defaultVal;
  }

  return val as NonNullable<T>;
}

// 合并指令
export function getInstructs(config: ProjectConfig) {

  return [...config.script, ...INSTRUCTS];

}


// 国际化
export function localize(key: string) {
 if(vscode.env.language.startsWith('zh')) {
    return (Zh as {[key:string]: string})[key] || '';
  } 
  return (En as {[key:string]: string})[key] || '';
}