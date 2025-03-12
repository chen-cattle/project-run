import EventEmitter from 'node:events';
import * as vscode from 'vscode';

export type CustomTerminalOption = {
  name: string;
  path?: string;
  args?: string;
  cwd?: string;
  env?: { [key: string]: string | null | undefined };
  strictEnv?: boolean;
}

type ChangeTerminal = {
  type: 'open',
  event: vscode.Terminal
} | {
  type: 'mount',
  event: vscode.TerminalShellIntegrationChangeEvent
} | {
  type: 'start',
  event: {origin: vscode.TerminalShellExecutionStartEvent, text: string}
} | {
  type: 'end',
  event: {origin: vscode.TerminalShellExecutionStartEvent, text: string}
} | {
  type: 'close',
  event: vscode.Terminal
}

export interface CustomTerminalEvent {
  open: [vscode.Terminal];
  mount: [vscode.TerminalShellIntegrationChangeEvent];
  start: [{origin: vscode.TerminalShellExecutionStartEvent, text: string}];
  end: [{origin: vscode.TerminalShellExecutionStartEvent, text: string}];
  close: [vscode.Terminal];
  change: [ChangeTerminal]
}

export class CustomTerminal extends EventEmitter<CustomTerminalEvent> implements vscode.Terminal {
  name!: string;
  processId!: Thenable<number | undefined>;
  creationOptions!: Readonly<vscode.TerminalOptions | vscode.ExtensionTerminalOptions>;
  exitStatus: vscode.TerminalExitStatus | undefined;
  state!: vscode.TerminalState;
  shellIntegration: vscode.TerminalShellIntegration | undefined;
  private terminal!: vscode.Terminal;
  command?: string;
  running: boolean = false;
  private disposes: vscode.Disposable[] = [];

  constructor(private option: CustomTerminalOption ) {
    super();
    this.initial();
    this.lifecycle();
  }

  private initial() {
    const terminal = vscode.window.createTerminal({
      ...this.option
    });
    this.name = terminal.name;
    this.processId = terminal.processId;
    this.creationOptions = terminal.creationOptions;
    this.exitStatus = terminal.exitStatus;
    this.state = terminal.state;
    this.shellIntegration = terminal.shellIntegration;
    this.terminal = terminal;

  }
  private lifecycle() {
    const openTerminal = vscode.window.onDidOpenTerminal((e) => {
      if (e.name === this.option.name) {
        this.emit('open', e);
        this.emit('change', { type: 'open', event: e });
      }
    });

    this.disposes.push(openTerminal);

    const changeTerminalShellIntegration = vscode.window.onDidChangeTerminalShellIntegration((e) => {
      if (e.terminal.name === this.option.name) {
        this.emit('mount', e);
        this.emit('change', { type: 'mount', event: e });
      }
    });
    
    this.disposes.push(changeTerminalShellIntegration);


    const startTerminalShellExecution = vscode.window.onDidStartTerminalShellExecution((e) => {
      if (e.terminal.name === this.option.name) {
        this.emit('start', { text: this.command!, origin: e});
        this.emit('change', { type: 'start', event: { text: this.command!, origin: e} });
        this.running = true;
      }
    });
    
    this.disposes.push(startTerminalShellExecution);
  
    /* TODO name可能相同 */
    const endTerminalShellExecution = vscode.window.onDidEndTerminalShellExecution((e) => {
      if (e.terminal.name === this.option.name) {
        this.emit('end', { text: this.command!, origin: e});
        this.emit('change', { type: 'end', event: { text: this.command!, origin: e} });
        this.command = '';
        this.running = false;
      } 
    });
    
    this.disposes.push(endTerminalShellExecution);


    const didCloseTerminal = vscode.window.onDidCloseTerminal((e) => {
      if (e.name === this.option.name) {
        this.emit('close', e);
        this.emit('change', { type: 'close', event: e });
      }
    });
    
    this.disposes.push(didCloseTerminal);
  }
  sendText(text: string, shouldExecute?: boolean): void {
    this.command = text;
    this.terminal.sendText(text, shouldExecute);
    
  }
  show(preserveFocus?: boolean): void {
    this.terminal.show(preserveFocus);
  }
  hide(): void {
    this.terminal.hide();
  }
  dispose(): void {
    this.disposes.forEach(dispose => dispose.dispose());
    this.terminal.dispose();
  }
}
