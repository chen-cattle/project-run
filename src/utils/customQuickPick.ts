import * as vscode from 'vscode';

export default function customQuickPick<T extends vscode.QuickPickItem>(items: T[], filter: (val: string, items: T[]) => T[] ): Promise<T> {


    return new Promise((resolve) => {
      
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = items;
  
    quickPick.onDidChangeValue(val => {
      if (!val) {
        quickPick.items = items;
        return;
      }

      // quickPick.items = items.filter((item, index, items) => {
      //   return filter(item, index, items);
      // });

      quickPick.items = filter(val, items);
  
      // quickPick.items = list.filter(item => {
      //   if (item.kind || item.label.toLowerCase().includes(val.toLowerCase()) || (item.description && item.description.toLowerCase().includes(val.toLowerCase()))) {
      //     return true;
      //   }
      //   return false;
      // }).map(item => {
      //   return {
      //     ...item,
      //     detail: item.group
      //   };
      // });
  
    });
  
    quickPick.onDidAccept(() => {
      // const selection = quickPick.selectedItems[0];
      // if (selection && selection.kind !== vscode.QuickPickItemKind.Separator) {
      //   vscode.window.showInformationMessage(`Selected: ${selection.label}`);
      // }
      resolve(quickPick.selectedItems[0] as T);
      quickPick.hide();
    });
    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
  });
}