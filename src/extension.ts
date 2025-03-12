// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import register from './command';
import initial from './initial';
// import watch from './file/watch';
import Cache from './cache';
import dynamic from './dynamic';

const memoryInfo = new Cache();

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// 初始化信息
	initial(memoryInfo, context);

	// 动态修改
	dynamic(memoryInfo);

	// 注册命令
	register(context, memoryInfo);

	console.log(memoryInfo);

	// memoryInfo.

	/* 
		1. 初始化（收集信息）
			1. 项目信息（有几个工作区）
			2. package.json 的路径信息
			3. package.json 中的scripts信息
			4. 
	*/



	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// // This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "project-run" is now active!');

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// const disposable = vscode.commands.registerCommand('project-run.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from project-run!');
	// });

	// context.subscriptions.push(disposable);
}

/* 
	projectRun
	desc 根据 package.json 中的 scripts 生成可以运行的命令，可以选择指定的命令运行，也可以一键运行，可以配置使用各种npm源（yarn，pnpm 等）运行项目
	1. vscode启动时，读取 package.json 中的 scripts
	2. 缓存 scripts
	3. 监听 package.json 文件变化，并更新缓存
	4. 动态方式生成可运行的命令列表
	5. 允许用户决定使用什么终端运行命令
	6. 运行命令
	7. 允许用户决定是否将焦点移动到终端
	8. 探索是否可以动态更新指令所在的icon
	9. 快捷键定义

*/

// This method is called when your extension is deactivated
export function deactivate() {
	memoryInfo.cache.forEach(project => {
		project.terminals.forEach(terminal => {
			terminal.dispose();
		});
	});
}
