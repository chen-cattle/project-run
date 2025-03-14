# Project Run


![Downloads](https://img.shields.io/visual-studio-marketplace/d/chen-cattle.project-run)  ![Rating](https://img.shields.io/visual-studio-marketplace/r/chen-cattle.project-run) 



[English](https://github.com/chen-cattle/project-run/blob/dev/README.md) | [中文](https://github.com/chen-cattle/project-run/blob/dev/docs/README_CN.md)



简化 vscode 启动 javascript 项目流程，快速启动 javascript 项目

## 特性

自动扫描工作区中的 package.json 文件，通过按钮或快捷键快速启动各工作区中的的 Javascript 项目

* 快速运行  
![Run](../images/useOneRun.gif)

* 快速停止  
![Stop](../images/useOneStop.gif)

* 打开指令列表  
![Menus](../images/useOpenMenu.gif)

## 快捷键

| 快捷键 | 功能 |
| --- | --- |
| `Ctrl+Alt+P` | 启动当前工作区内的项目 |
| `Ctrl+Alt+S` | 停止当前工作区内的项目 |
| `Ctrl+Alt+M` | 打开可运行的指令列表 |


## 提示

快速运行提供了 ['dev', 'start', 'watch'] 三种运行指令，优先级按次序降低，如果默认的运行指令无法满足需求，可在 configuration 中配置 project-run.script，配置后将优先使用 project-run.script 中的配置

```json
"project-run.script": ["develop"]
```


## Change Log

See Change Log [here](https://github.com/chen-cattle/project-run/blob/main/CHANGELOG.md).

## Issues

Submit the [issues](https://github.com/chen-cattle/project-run/issues) if you find any bug or have any suggestion.

## Contribution

Fork the [repo](https://github.com/chen-cattle/project-run) and submit pull requests.