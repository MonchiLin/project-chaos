package com.kiki.chaos.fork

import com.intellij.ide.util.projectWizard.ModuleBuilder
import com.intellij.ide.util.projectWizard.ModuleWizardStep
import com.intellij.ide.util.projectWizard.WizardContext
import com.intellij.openapi.Disposable
import com.intellij.openapi.roots.ModifiableRootModel

public class DemoModuleBuilder : ModuleBuilder() {
  override fun setupRootModel(model: ModifiableRootModel) {}
  override fun getModuleType(): DemoModuleType {
    return DemoModuleType()
  }

  override fun getCustomOptionsStep(context: WizardContext, parentDisposable: Disposable): ModuleWizardStep? {
    return DemoModuleWizardStep()
  }
}
