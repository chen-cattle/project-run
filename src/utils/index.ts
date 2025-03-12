import { CONFIG_EXIT, DEFAULT_OPTION, INSTRUCTS, PACK_COMMAND, ProjectJSONName } from './../const/index';
import * as vscode from 'vscode';
import { existsSync, readFileSync } from 'fs';
import { CONFIG_PACK, CONFIG_SINGLE, PROJECT_NAME } from '../const';
import { ProjectConfig } from '../cache';
import { join } from 'path';

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
      exit: computedVal(config.get<boolean>(CONFIG_EXIT), DEFAULT_OPTION.exit)
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


// 获取要运行的指令
export function getCommand(config: ProjectConfig, text: string) {
  
  return `${PACK_COMMAND[config.pack]} ${text}`;
}

export function getProject(workspace: vscode.WorkspaceFolder) {
  const packagePath = join(workspace.uri.fsPath, ProjectJSONName);
    if(existsSync(packagePath)) {
      const config = getConfig(workspace);
      const scriptList = Object.entries(readJSON(packagePath).scripts || {});
      const curDev = INSTRUCTS.find(item => {
        return !!scriptList.find(script => script[0] === item);
      }) || 'dev';
      return {
        name: workspace.name,
        path: packagePath,
        config: config,
        devCommand: getCommand(config, curDev),
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

export function computedVal<T>(val: T, defaultVal: NonNullable<T>): NonNullable<T>{
  if(typeof val === undefined || val === null) {
    return defaultVal;
  }

  return val as NonNullable<T>;
}