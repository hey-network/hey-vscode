// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var editor = vscode.window.activeTextEditor;
var rp = require("request-promise");

//  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ 
// ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ 
// ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
// ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
// ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
//  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝ 
var CONFIG = {
    app_path: 'https://ide.hey.network/p',
    api_path: 'https://api2.get-hey.com/v1/ide',
    txt: {
        input_box_placeholder: 'Ask your question here',
        input_box_prompt: 'Ask your question here, try to be as specific as possible. You can skip this step and ask your question on the Hey site afterwards if, for instance, you want to add emojis 😆',
        hey_callback_message: 'Your question is here: '
    }
};

// ██████╗  ██████╗ ███████╗████████╗                               
// ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝                               
// ██████╔╝██║   ██║███████╗   ██║                                  
// ██╔═══╝ ██║   ██║╚════██║   ██║                                  
// ██║     ╚██████╔╝███████║   ██║                                  
// ╚═╝      ╚═════╝ ╚══════╝   ╚═╝                                  
                                                                 
//  ██████╗ ██╗   ██╗███████╗███████╗████████╗██╗ ██████╗ ███╗   ██╗
// ██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
// ██║   ██║██║   ██║█████╗  ███████╗   ██║   ██║██║   ██║██╔██╗ ██║
// ██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║   ██║██║   ██║██║╚██╗██║
// ╚██████╔╝╚██████╔╝███████╗███████║   ██║   ██║╚██████╔╝██║ ╚████║
//  ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝                                                  
function PostQuestion(_question, _code, _language) {

    console.log('posting questions');

    var options = {
        method: "POST",
        uri: CONFIG.api_path,
        headers: {},
        body: {
            "content": _question,
            "categories": [_language], 
            "snippet": {
                "content": _code,
                "language": _language
            }
        },
        json: true
    };

    rp(options).then(function(r) {
        // var parsedUrl = vscode.Uri.parse(r.html_url);
        console.log(r.result);
        if(r.success && r.result){
            vscode.window.showInformationMessage(CONFIG.txt.hey_callback_message + CONFIG.app_path+'/'+ r.result);
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(CONFIG.app_path+'/'+r.result));
        }
        else {
            vscode.window.showInformationMessage('😅 Something went wrong.. you can still post your question here (sorry) : https://ide.hey.network');
        }
    });

    
}

//  █████╗  ██████╗████████╗██╗██╗   ██╗ █████╗ ████████╗███████╗
// ██╔══██╗██╔════╝╚══██╔══╝██║██║   ██║██╔══██╗╚══██╔══╝██╔════╝
// ███████║██║        ██║   ██║██║   ██║███████║   ██║   █████╗  
// ██╔══██║██║        ██║   ██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══╝  
// ██║  ██║╚██████╗   ██║   ██║ ╚████╔╝ ██║  ██║   ██║   ███████╗
// ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚══════╝                                                       
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

        // User Input to ask the question
        vscode.window.showInputBox({
            ignoreFocusOut: true,
            placeHolder: CONFIG.txt.input_box_placeholder,
            prompt: CONFIG.txt.input_box_prompt
        }).then(function(_userInput){
            if(_userInput){
                // Display a message box to the user
                PostQuestion(_userInput, editor.document.getText(editor.selection), editor.document.languageId);
            }
        });

    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// ██████╗ ███████╗ █████╗  ██████╗████████╗██╗██╗   ██╗ █████╗ ████████╗███████╗
// ██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝██║██║   ██║██╔══██╗╚══██╔══╝██╔════╝
// ██║  ██║█████╗  ███████║██║        ██║   ██║██║   ██║███████║   ██║   █████╗  
// ██║  ██║██╔══╝  ██╔══██║██║        ██║   ██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══╝  
// ██████╔╝███████╗██║  ██║╚██████╗   ██║   ██║ ╚████╔╝ ██║  ██║   ██║   ███████╗
// ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚══════╝                                                    
// this method is called when your extension is deactivated
function deactivate() {

}
exports.deactivate = deactivate;