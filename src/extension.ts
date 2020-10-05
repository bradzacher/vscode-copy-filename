import * as path from 'path';
import * as vscode from 'vscode';

async function showError(message: string): Promise<void> {
  await vscode.window.showErrorMessage(`Copy filename: ${message}`);
}
function showWarning(message: string): void {
  vscode.window.setStatusBarMessage(`${message}`, 3000);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context: vscode.ExtensionContext): void {
  // Register context menu commands
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.copyFileName', (uri, files) =>
      doCopy(getUris(uri, files), true),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'extension.copyFileNameNoExtension',
      (uri, files) => doCopy(getUris(uri, files), false),
    ),
  );

  // Register command pallette commands
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.copyFileNameOfActiveFile', () =>
      doCopy(getActiveUri(), true),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'extension.copyFileNameNoExtensionOfActiveFile',
      () => doCopy(getActiveUri(), false),
    ),
  );
}

function getUris(
  uri: vscode.Uri,
  files?: Array<vscode.Uri>,
): Array<vscode.Uri> {
  if (typeof files !== 'undefined' && files.length > 0) {
    return files;
  }
  return [uri];
}

function getActiveUri(): Array<vscode.Uri> | null {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (typeof activeTextEditor === 'undefined') {
    return null;
  }
  return [activeTextEditor.document.uri];
}

function doCopy(
  uris: Array<vscode.Uri> | null,
  includeExtension: boolean,
): void {
  if (uris == null) {
    return;
  }

  const accumulator = uris
    .map(uri => getFilename(uri, includeExtension))
    .join('\n');
  // Copy text to the clipboard
  vscode.env.clipboard.writeText(accumulator).then(
    () =>
      showWarning(
        `The filename${
          uris.length > 1 ? 's have' : ' has'
        } been copied to clipboard`,
      ),
    async err => showError(String(err)),
  );
}

function getFilename(uri: vscode.Uri, includeExtension: boolean): string {
  const relative = vscode.workspace.asRelativePath(uri);
  const parsed = path.parse(relative);

  if (includeExtension) {
    return parsed.base;
  }
  return parsed.name;
}

export { activate };
