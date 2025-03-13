import * as vscode from 'vscode';
import Cache from '../cache';
import { CustomTerminal } from '../utils/customTerminal';
import { CommandType, joinCommand, localize } from '../utils';
import { PROJECT_NAME } from '../const';

export function execText(command: CommandType, memory: Cache, name: string, path?: string) {
  vscode.window.showInformationMessage(joinCommand(command));
  /* 
    1. 终端所属的 workspace
    2. 终端所运行的命令
    3. 终端相关的配置
  */

 
 const curProject = memory.cache.find(project => project.name === name);
 console.log('execText', joinCommand(command), name, memory, curProject);
  if(!curProject) {
    return;
  }
/* 如何 terminal没有被关闭，则优先使用打开的terminal */
  const single = curProject.config.single;
  const curTerminal = curProject.terminals.find(terminal => terminal.command === joinCommand(command));
  if(single && curTerminal) {
    vscode.window.showWarningMessage(localize('sameMessage'));
    curTerminal.show();
    return;
  }

  /* TODO 直接点击删除terminal时，会退出所有的terminal */

  const idleTerminal = curProject.terminals.find(terminal => !terminal.running);

  console.log(idleTerminal, 'idleTerminal');
  
/* 
  空闲的terminal如果之前运行过dev，则会导致运行按钮变化
*/
  if(idleTerminal){
    console.log('idleTerminal', joinCommand(command));
    
    idleTerminal.sendText(joinCommand(command));
    idleTerminal.show();
    return;
  }

  console.log('newTerminal', joinCommand(command));
  
 const terminal = new CustomTerminal({
    name: command.suffix,
    shellPath: path,
  });

  terminal.sendText(joinCommand(command));
  terminal.show();
  terminal.addListener('start', (e) => {
    console.log('start', e, joinCommand(command), curProject);
    if (e.text === curProject.devCommand && curProject.config.single) {
      memory.setStatus(true);
    }
  });
  terminal.addListener('end', (e) => {
    if (e.text === curProject.devCommand && curProject.config.single) {
      memory.setStatus(false);
    }
    // console.log('end', e);
  });

  terminal.addListener('close', (e) => {
    if (joinCommand(command) === curProject.devCommand && curProject.config.single) {
      memory.setStatus(false);
    }
    // console.log('close terminal', e, terminal.terminalId);
    
    memory.removeTerminal(name, terminal);
  });
  memory.setTerminals(name, terminal);

  // if(single) {
  //   /* 
  //     single 是指那个要保持单例 dev 要保持单例，同一个workspace，同一个命令，只会打开一个窗口
  //   */

  
  // } else {
  // }

  // terminal
  // const terminal = new CustomTerminal({
  //   name: 'run',
  // });
  // terminal.addListener('start', (e) => {
  //   memory.setRunning(name, true);
  //   console.log('终端输出 start', e); 
  // });

  // terminal.addListener('end', (e) => {
  //   memory.setRunning(name, false);
  //   console.log('终端输出 end', e); 
  // });

  // terminal.addListener('close', (e) => {
  //   console.log('终端输出 close', e); 
  //   memory.setRunning(name, false);
  // });

  // terminal.show();
  // terminal.sendText(text);
  // memory.setTerminals(name, terminal);

  /* 
    使用terminal 无法获取text执行情况
    使用task，运行环境特殊，退出后，无法将窗口当作可用状态
  */

  /* 
    如何判断是否打开了终端
    如何判断终端中的命令运行状态
    如何重新运行一个命令
    如何运行命令完成后销毁终端
    如何运行命令完成后显示结果
  */
}