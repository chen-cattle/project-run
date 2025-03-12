import *  as vscode from 'vscode';
import Cache, { Project } from '../cache';
import { PACK_COMMAND } from '../const';
import customQuickPick from '../utils/customQuickPick';
import { getCommand } from '../utils';
import path from 'path';
export const openMenus = async (memory: Cache) => {
  console.log(memory.cache[0].executes, 'executes');

  const list = memory.cache.reduce((acc, project) => {
    acc.push({
      label: project.name,
      kind: vscode.QuickPickItemKind.Separator,
      group: project.name
    }, ...project.executes.map(item => {
      return {
        label: item.key,
        description: item.value,
        extraData: project,
        group: project.name,
        kind: vscode.QuickPickItemKind.Default,
      };
    }));
    return acc;
  }, [] as (vscode.QuickPickItem & { extraData?: Project, group?: string })[]);

  const selected = await customQuickPick(list, (val, items) => {
    return items.filter(item => {
          if (
            item.kind ||
            item.label.toLowerCase().includes(val.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(val.toLowerCase()))
          ) {
            return true;
          }
          return false;
        }).map(item => {
          return {
            ...item,
            detail: item.group
          };
        });
  });

  console.log('selected', selected);
  /* 
    通过菜单运行的dev命令无法停止
  */

  if(selected && selected.extraData) {
    console.log(selected.extraData.origin, 'selected');
    memory.setCur(selected.extraData.origin);
    // const curProject = memory.cache.find(item => item.executes.find(exec => exec.key === selected.label));
    vscode.commands.executeCommand('project-run.execText', getCommand(selected.extraData.config, selected.label), selected.group, path.dirname(selected.extraData.path));
  }

  // const quickPick = vscode.window.createQuickPick();
  // quickPick.items = list;

  // quickPick.onDidChangeValue(val => {
  //   if (!val) {
  //     quickPick.items = list;
  //     return;
  //   }

  //   quickPick.items = list.filter(item => {
  //     if (item.kind || item.label.toLowerCase().includes(val.toLowerCase()) || (item.description && item.description.toLowerCase().includes(val.toLowerCase()))) {
  //       return true;
  //     }
  //     return false;
  //   }).map(item => {
  //     return {
  //       ...item,
  //       detail: item.group
  //     };
  //   });

  // });

  // quickPick.onDidAccept(() => {
  //   const selection = quickPick.selectedItems[0];
  //   if (selection && selection.kind !== vscode.QuickPickItemKind.Separator) {
  //     vscode.window.showInformationMessage(`Selected: ${selection.label}`);
  //   }
  //   quickPick.hide();
  // });

  // quickPick.onDidHide(() => quickPick.dispose());
  // quickPick.show();
};


// export const openMenus = async (memory: Cache) => {
//   console.log(memory.cache[0].executes, 'executes');
  
//   /* 
//   {
//         label: item.key,
//         description: item.value,
//     };
//   */
//     const list = memory.cache.reduce((acc, project) => {
//       acc.push({
//         label: project.name,
//         kind: vscode.QuickPickItemKind.Separator,
//         group: project.name
//       }, ...project.executes.map(item => {
//         return {
//           label: item.key,
//           description: item.value,
//           extraData: project,
//           group: project.name,
//         };
//       }));
//       return acc;
//     }, [] as (vscode.QuickPickItem & {extraData?: Project, group?: string})[]);

//     const quickPick = vscode.window.createQuickPick();
//     quickPick.items = list;
//     quickPick.onDidChangeValue(val => {
//       console.log('onDidChangeValue', val,   quickPick.items = list.filter(item => {
//         if(item.kind || item.label.toLowerCase().includes(val.toLowerCase()) || item.description && item.description.toLowerCase().includes(val.toLowerCase())) {
//           return true;
//         }
//         return false;
//       }));
      
//       if(!val) {
//         quickPick.items = list;
//         return;
//       }
      
//       const filteredItems = list.filter(item => {
//         if(item.kind || item.label.toLowerCase().includes(val.toLowerCase()) || item.description && item.description.toLowerCase().includes(val.toLowerCase())) {
//           return true;
//         }
//         return false;
//       }
//       // item.kind !== vscode.QuickPickItemKind.Separator &&
//       // (item.label.toLowerCase().includes(val.toLowerCase()) || 
//       //   (item.description && item.description.toLowerCase().includes(val.toLowerCase())))
//       );


      
//       const groupsToShow = new Set(filteredItems.map(item => item.group));

//       quickPick.items = list.filter(item => 
//           item.kind === vscode.QuickPickItemKind.Separator ? groupsToShow.has(item.group) : filteredItems.includes(item)
//       );

//     });


//     quickPick.onDidAccept((e) => {
      
//       console.log('onDidAccept', e, quickPick.selectedItems);
      
//       const selection = quickPick.selectedItems[0];
//       if (selection && selection.kind !== vscode.QuickPickItemKind.Separator) {
//           vscode.window.showInformationMessage(`Selected: ${selection.label}`);
//       }
//       quickPick.hide();
//     });
    
//     quickPick.onDidHide(() => quickPick.dispose());
//     quickPick.show();

    

    // const selected = await vscode.window.showQuickPick();


    // if(selected && selected.extraData) {
    //   console.log(selected.extraData);
    //   // const curProject = memory.cache.find(item => item.executes.find(exec => exec.key === selected.label));
    //   vscode.commands.executeCommand('project-run.execText', `${PACK_COMMAND[selected.extraData.config.pack]} ${selected.label}`);
    // }
// };