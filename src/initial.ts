import { join } from 'path';
import * as vscode from 'vscode';
import { INSTRUCTS, ProjectJSONName } from './const';
import { existsSync } from 'fs';
import { getCommand, getConfig, getProject, readJSON } from './utils';
import Cache, { Project } from './cache';



export default function initial(memory: Cache, context: vscode.ExtensionContext) {
  console.log('initial');

  // 获取工作区信息
  const workspaces = vscode.workspace.workspaceFolders || [];
  // 处理工作区信息
  const projects = workspaces.reduce((acc,cur) => {
    acc.push(getProject(cur));
    return acc;
  }, [] as (Project | undefined)[]).filter(Boolean) as Project[];

  console.log('projects', projects);
  

  // 监听配置变化
  const didChangeConfig = vscode.workspace.onDidChangeConfiguration(e => {
    
    memory.cache.forEach((project) => {

      if(e.affectsConfiguration('project-run', project.origin)) {
        console.log('affectsConfiguration', project.origin);
        
        memory.setCache({
          ...project,
          config: getConfig(project.origin)
        });
        console.log(memory, '配置变化');
      }
    });
  });
  context.subscriptions.push(didChangeConfig);

  // 监听工作区增减
  const didChangeFolders = vscode.workspace.onDidChangeWorkspaceFolders(e => {
    if(e.added.length > 0) {
      // 添加项目
      memory.setCache(e.added.reduce((acc, workspace) => {
        acc.push(getProject(workspace));
        return acc;
        
      }, [] as (Project | undefined)[]).filter(Boolean) as Project[]);
    } else if(e.removed.length > 0) {
      // 移除项目
      memory.removeCache(e.removed.reduce((acc, project) => {
        const item: Project | undefined = memory.cache.find(item => item.name === project.name);
        if(item) {
          acc.push(item);
        };
        return acc;
      }, [] as Project[]));
    }
  });
  context.subscriptions.push(didChangeFolders);

  // 监听编辑器变化
  const activeEditor = vscode.window.onDidChangeActiveTextEditor((e) => {
    if(e) {
      const workspace = vscode.workspace.getWorkspaceFolder(e.document.uri);
      memory.setCur(workspace);
    }
  });

  context.subscriptions.push(activeEditor);

  // const closeTerminal = vscode.window.onDidCloseTerminal((e) => {
  //   console.log('closeTerminal', e, memory);
  // });

  // context.subscriptions.push(closeTerminal);

  // 监听 package.json 文件变化
  projects.forEach(project => {
    const watcher = vscode.workspace.createFileSystemWatcher(project.path);
    watcher.onDidChange((e) => {
      const work = vscode.workspace.getWorkspaceFolder(e);
      console.log('package.json 文件发生变化', work?.name);
  
      const cur = memory.cache.findIndex(item => item.name === work?.name);
      if(cur !== -1) {
        
        memory.setCache({
          ...memory.cache[cur],
          executes: Object.entries(readJSON(memory.cache[cur].path).scripts || {}).map(([key, value]) => {
            return {
              key,
              value: value as string
            };
          })
        });
      }
    });

    context.subscriptions.push(watcher);
  });
  
  memory.setCache(projects);
}