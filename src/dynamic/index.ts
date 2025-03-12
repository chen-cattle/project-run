import * as vscode from 'vscode';
import Cache, { Project } from '../cache';
import { getActiveWorkspaceFolder, getCommand, observe } from '../utils';
import { INSTRUCTS } from '../const';

export default function dynamic(memory: Cache) {
  /* 
    处于不同工作区时根据工作区的状态显示不同的按钮
  */

  // let curProject: Project;
  // if(memory.cache.length === 1) {
  //   curProject = memory.cache[0];
  // } else {
  //   const activeWorkspaceFolder = getActiveWorkspaceFolder();
  //   if(!activeWorkspaceFolder) {
  //     curProject = memory.cache[0];
  //   } else {
  //     curProject = memory.cache.find(item => item.name === activeWorkspaceFolder.name)!;
  //   }
  // }


  // vscode.window.onDidChangeWindowState((e) => {
  //   console.log('onDidChangeWindowState', e);
  // });




  observe(memory, 'status', 'ready', (status: 'ready' | 'running') => {
    
    console.log('status', status);

    if (status === 'ready') {
      vscode.commands.executeCommand('setContext', 'project-run:running', false);
    } else  {
      vscode.commands.executeCommand('setContext', 'project-run:running', true);
    }
    
    // if(project) {
    //      const terminal = project.terminals.find(terminal => {
    //     return terminal.command === project.devCommand;
    //   });
    //   console.log('observe', terminal, terminal?.running);

    //   /* 

    //     项目启动时，图标不会发生变化（原因，cur改变时terminal中命令的运行状态不一定是true）（terminal的running改变时更改脚本按钮）
    //     停止按钮失效
    //     终端退出时，停止按钮没有恢复
    //   */
      
    //   if(terminal?.running) {
    //     vscode.commands.executeCommand('setContext', 'project-run:running', true);
    //   } else {
    //     vscode.commands.executeCommand('setContext', 'project-run:running', false);
    //   }
    // }


  });


  

  // 监听命令是否允许
  observe(memory, 'cur', undefined, (project: Project | undefined) => {
    
    console.log('project', project);
    
    if(project) {
         const terminal = project.terminals.find(terminal => {
        return terminal.command === project.devCommand;
      });
      console.log('observe', terminal, terminal?.running);

      /* 

        项目启动时，图标不会发生变化（原因，cur改变时terminal中命令的运行状态不一定是true）（terminal的running改变时更改脚本按钮）
        停止按钮失效
        终端退出时，停止按钮没有恢复
      */
      
      if(terminal?.running && project.devCommand === terminal.command) {
        vscode.commands.executeCommand('setContext', 'project-run:running', true);
      } else {
        vscode.commands.executeCommand('setContext', 'project-run:running', false);
      }
    }
    if(memory.cur) {

      const terminal = memory.cur.terminals.find(terminal => {
        return terminal.command === memory.cur!.devCommand;
      });

      if(terminal?.running) {
        vscode.commands.executeCommand('setContext', 'project-run:running', true);
      } else {
        vscode.commands.executeCommand('setContext', 'project-run:running', false);
      }
    }
  });
}