import * as vscode from 'vscode';
import Cache, { Project } from '../cache';
import { getActiveWorkspaceFolder, getCommand, getInstructs, localize } from '../utils';
import { PROJECT_NAME } from '../const';

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
    vscode.window.showErrorMessage(localize('workProject'));
    return;
  }

  const instructs = getInstructs(curProject.config);
  const cur = instructs.findIndex(item => {
    return !!curProject.executes.find(exec => exec.key === item);
  });
  
  if(cur === -1) {
    vscode.window.showErrorMessage(localize('script.not'));
    return;
  }

  vscode.commands.executeCommand('project-run.execText', getCommand(curProject.config, instructs[cur]), curProject.name);
}