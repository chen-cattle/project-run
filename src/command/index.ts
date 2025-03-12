import { openMenus } from './openMenus';
import * as vscode from 'vscode';
import { execText } from './execText';
import { runFunc } from './run';
import { stop } from './stop';
import Cache from '../cache';
import { CommandType } from '../utils';







// 注册命令
export default function register(context: vscode.ExtensionContext, memory: Cache) {

  // 创建终端并运行命令
  const execTextCommand = vscode.commands.registerCommand('project-run.execText', (text: CommandType, name) => {
    execText(text, memory, name);
  });

  // 快捷运行
  const runCommand = vscode.commands.registerCommand('project-run.run', () => {
    runFunc(memory);
  });

  // 停止
  const stopCommand = vscode.commands.registerCommand('project-run.stop', () => {
    stop(memory);
  });

  // 创建菜单
  const openMenusCommand = vscode.commands.registerCommand('project-run.openMenus', () => {
    openMenus(memory);
  });


  context.subscriptions.push(runCommand);
  context.subscriptions.push(stopCommand);
  context.subscriptions.push(execTextCommand);
  context.subscriptions.push(openMenusCommand);
}
