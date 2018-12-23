// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var CONFIG = require('./config')._;
var editor = vscode.window.activeTextEditor;
var rp = require("request-promise");

function PostQuestion(_question, _code) {
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(CONFIG.api_path+'?q='+_question+'c='+_code));
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.sayHey', function () {
        // The code you place here will be executed every time your command is executed
        if (!editor) {
            return; // No open text editor
        }
        var selection = editor.selection;
        var text = editor.document.getText(selection);

        var text_language = editor.document.languageId;
        vscode.window.showInformationMessage('Language :'+text_language);

        // User Input to ask the question
        vscode.window.showInputBox({
            ignoreFocusOut: true,
            placeHolder: CONFIG.txt.input_box_placeholder,
            prompt: CONFIG.txt.input_box_prompt
        }).then(function(_userInput){
            // Display a message box to the user
            vscode.window.showInformationMessage(CONFIG.txt.hey_callback_message + _userInput);
            PostQuestion(_userInput, text);
        });

    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;