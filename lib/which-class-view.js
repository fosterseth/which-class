'use babel';
import { Point } from 'atom';
import { Range } from 'atom';

export default class WhichClass {
  constructor(statusBar) {
    this.statusBar = statusBar;
    this.workspacedisposable = null;
    this.editordisposable = null;
    this.message = null;
  }

  setEditorCallback() {
    var self = this;
    if (this.editordisposable != undefined) {
      this.editordisposable.dispose();
      this.editordisposable = null;
    }
    if (this.editor != undefined) {
      this.editordisposable = this.editor.onDidChangeCursorPosition(function() {
        self.cursor = self.editor.getLastCursor();
        self.setMessage();
      })
      this.cursor = this.editor.getLastCursor();
      this.setMessage();
    }
  }

  setMessage() {
    if (this.cursor != undefined) {
      var self = this;
      const cursorscope = this.cursor.getSyntaxTreeScopeDescriptor();
      if (cursorscope.scopes.includes("class_definition")) {
        const r = new RegExp(/(class)(.*?)\(/);
        this.editor.backwardsScanInBufferRange(r, new Range(new Point(0,0), this.editor.getCursorBufferPosition()), function(iterator) {
          self.message.textContent = iterator.match["1"] + iterator.match["2"];
        })
      } else {
        this.message.textContent = "";
      }
    }
  }

  main() {
    this.message = document.createElement('div');
    this.message.classList.add('inline-block');
    this.message.classList.add('element');
    this.statusBar.addLeftTile({item: this.message, priority: 100});

    this.editor = atom.workspace.getActiveTextEditor();
    this.setEditorCallback();

    var self = this;
    this.workspacedisposable = atom.workspace.onDidChangeActiveTextEditor(function() {
      self.message.textContent = "";
      self.editor = atom.workspace.getActiveTextEditor();
      self.setEditorCallback();
    })
  }
}
