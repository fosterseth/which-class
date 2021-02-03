'use babel';

import WhichClass from './which-class-view';

export default {

  deactivate() {
    this.statusBarUpdate.workspacedisposable.dispose();
  },

  consumeStatusBar(statusBar) {
    this.statusBarUpdate = new WhichClass(statusBar)
    this.statusBarUpdate.main()
  },

};
