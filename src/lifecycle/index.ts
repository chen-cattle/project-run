import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import { Project } from '../cache';

export default function lifeCycle(context: ExtensionContext, cache: Project[]) {
  // vscode 初始化完成
  // vscode.workspace.onDidChangeConfiguration(() => {});
}