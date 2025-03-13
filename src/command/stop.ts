import Cache, { Project } from '../cache';
import { getActiveWorkspaceFolder, stopShell } from '../utils';

export function stop(memory: Cache) {
  console.log('stop', memory.cur);
  

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
    
  console.log('stop', curProject);
  if(curProject) {

    const terminal = curProject.terminals.find(item => item.command === curProject.devCommand);
    console.log('stop terminal', terminal);
    memory.setStatus(false);
    terminal?.sendText(stopShell());
    if(curProject.config.exit) {
      terminal?.dispose();
    } else {
      terminal?.show();
    }

  }
  // memory.terminalList[0].sendText(stopShell());
}

/* 
  能够开始和结束了

  run时总会打开一个新的窗口


  为插件添加配置（vscode的配置）
  工作区状态时，命令的运行和单个工作区的区别
  editor/title 的顺序问题
  快捷键

*/