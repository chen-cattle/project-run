import { ExtensionContext, Terminal, Uri, workspace, WorkspaceFolder } from 'vscode';
import { PACK_COMMAND } from '../const';
import { CustomTerminal } from '../utils/customTerminal';

export type ProjectConfig = {
  pack: keyof typeof PACK_COMMAND;
  single: boolean;
  exit: boolean;
}

export type Project = {
  name: string;
  path: string;
  config: ProjectConfig;
  origin: WorkspaceFolder;
  devCommand: string;
  executes: {[key: string]: string}[];
  terminals: CustomTerminal[];
}

export default class Cache {
  // 项目信息
  private projectList: Project[] = [];
  get cache() {
    return this.projectList;
  }
  setCache(project: Project | Project[]) {
    
    let pros;
    if (Array.isArray(project)) {
      pros = project;
    } else {
      pros = [project];
    }

    pros.forEach(pro => {
      const cur = this.projectList.findIndex(item => item.name === pro.name);
      
        if(cur === -1) {
          this.projectList.push(pro);
          return;
        }

        this.projectList[cur] = {
          ...this.projectList[cur],
          ...pro
        };
    });

  }
  removeCache(project: Project | Project[]) {
    let pros;
    if (Array.isArray(project)) {
      pros = project;
    } else {
      pros = [project];
    }

    pros.forEach(pro => {
      const cur = this.projectList.findIndex(item => item.name === pro.name);
      if(cur !== -1) {
        const pros = this.projectList.splice(cur, 1);
        pros.forEach(pro => {
          pro.terminals.forEach(terminal => terminal.dispose());
        });
      }
    });
  }

  // 终端信息
  setTerminals(name: string, terminal: CustomTerminal) {
    const projectIndex = this.projectList.findIndex(project => project.name === name);
    if(projectIndex !== -1) {
      this.projectList[projectIndex].terminals.push(terminal);
      this.setCur(this.projectList[projectIndex].origin);
    }
  }

  removeTerminal(name: string, terminal: CustomTerminal) {
    const projectIndex = this.projectList.findIndex(project => project.name === name);
    if(projectIndex === -1) {
      return;
    }

    const index = this.projectList[projectIndex].terminals.findIndex(innerTerminal => innerTerminal === terminal);
    if(index === -1) {
      return;
    }

    const terminals = this.projectList[projectIndex].terminals.splice(index, 1);

    terminals.forEach(terminal => terminal.dispose());
    
  }


  cur?: Project;
  private work?: WorkspaceFolder ;

  setCur(work?: WorkspaceFolder) {
    if(!work){
      return;
    }
    if(this.work && this.work === work) {
      return;
    }

    const project = this.projectList.find(project => project.name === work.name);
    console.log('setCur');
    
    if (project) {
      this.cur = project;
      this.work = work;
      return;
    }
  }


  status: 'ready' | 'running' = 'ready';

  setStatus(val: boolean) {
    this.status = val ? 'running' : 'ready';
  }

}