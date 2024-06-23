import {Command} from "./Command";

export class History {
  public undoStack: Array<Command> = []
  public redoStack: Array<Command> = []

  constructor() {

  }

  executeCommand(command: Command) {
    command.redo();
    this.undoStack.push(command);
    this.redoStack = [];  // 清空重做栈
  }

  undo() {
    if (this.undoStack.length > 0) {
      const command = this.undoStack.pop();
      if (command) {
        command.undo();
        this.redoStack.push(command);
      }
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const command = this.redoStack.pop();
      if (command) {
        command.redo();
        this.undoStack.push(command);
      }
    }
  }
}
