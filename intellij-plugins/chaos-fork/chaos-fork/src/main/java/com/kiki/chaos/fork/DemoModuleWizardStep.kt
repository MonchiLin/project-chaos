package com.kiki.chaos.fork

import com.intellij.ide.util.projectWizard.ModuleWizardStep
import javax.swing.JComponent
import javax.swing.JLabel


class DemoModuleWizardStep : ModuleWizardStep() {
  override fun getComponent(): JComponent {
    return JLabel("Provide some setting here")
  }

  override fun updateDataModel() {
    //todo update model according to UI
  }
}
