import * as vscode from 'vscode';
import Cache, { Project } from '../cache';
import { INSTRUCTS, PACK_COMMAND } from '../const';
import { getActiveWorkspaceFolder, getCommand } from '../utils';

export function runFunc(memory: Cache) {

  let curProject: Project;
  if(memory.cache.length === 1) {
    curProject = memory.cache[0];
  } else {
    const activeWorkspaceFolder = getActiveWorkspaceFolder();
    if(!activeWorkspaceFolder) {
      curProject = memory.cache[0];
    } else {
      curProject = memory.cache.find(item => item.name === activeWorkspaceFolder.name)!;
    }
  }
  
  if(!curProject) {
    vscode.window.showErrorMessage('工作区暂无打开的项目');
    return;
  }
  const cur = INSTRUCTS.findIndex(item => {
    return !!curProject.executes.find(exec => exec.key === item);
  });
  
  if(cur === -1) {
    vscode.window.showErrorMessage('没有找到对应的指令');
    return;
  }

  vscode.commands.executeCommand('project-run.execText', getCommand(curProject.config, INSTRUCTS[cur]), curProject.name);
}