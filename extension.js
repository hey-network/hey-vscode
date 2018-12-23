// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var editor = vscode.window.activeTextEditor;
var rp = require("request-promise");

function PostQuestion(_question, _code) {
    // vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://ide.hey.network/post?q='+_question+'c='+_code));
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "hey" is now active!');

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
            placeHolder: "Ask your question here",
            prompt: "Ask your question here, try to be as specific as possible. You can skip this step and ask your question on the Hey site afterwards if, for instance, you want to add emojis 😆"
        }).then(function(_userInput){
            // Display a message box to the user
            vscode.window.showInformationMessage('Hey! Your code has '+text.length+' characters and the question was: '+ _userInput);
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