const vscode = require('vscode');



/**
 * @param {vscode.ExtensionContext} context
 */


function getActiveFileName() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const filePath = editor.document.fileName;
        const fileName = require('path').basename(filePath);
        return fileName;
    }
    return null;
}

function activate(context) {
    const runFile = vscode.commands.registerCommand('gorunner.runFile', () => {
        const fileName = getActiveFileName();
        if (!fileName) {
            vscode.window.showErrorMessage('No active file to run.');
            return;
        }
        if (!fileName.endsWith('.go')) {
            vscode.window.showErrorMessage('The active file is not a Go file.');
            return;
        }
        runGoCommand('go run ' + fileName);
    });
    const buildFile = vscode.commands.registerCommand('gorunner.buildFile', () => {
        const fileName = getActiveFileName();
        if (!fileName) {
            vscode.window.showErrorMessage('No active file to build.');
            return;
        }
        if (!fileName.endsWith('.go')) {
            vscode.window.showErrorMessage('The active file is not a Go file.');
            return;
        }
        runGoCommand('go build ' + fileName);
    });
    const build = vscode.commands.registerCommand('gorunner.build', () => {
        runGoCommand('go build');
    });
    const test = vscode.commands.registerCommand('gorunner.test', () => {
        runGoCommand('go test');
    });
    const runMain = vscode.commands.registerCommand('gorunner.run', () => {
        runGoCommand('go run .');
    });

    context.subscriptions.push(runFile, build, test, runMain, buildFile);
}

function runGoCommand(command) {
    let terminal = vscode.window.terminals.find(t => t.name === "GoRun Terminal");
    if (!terminal) {
        terminal = vscode.window.createTerminal({ name: "GoRun Terminal" });
    }
    terminal.show();
    vscode.commands.executeCommand('workbench.action.terminal.sendSequence', { text: command + '\n' });
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}