package com.kiki.chaos.fork

import com.intellij.ide.util.projectWizard.ModuleWizardStep
import com.intellij.ide.util.projectWizard.WizardContext
import com.intellij.openapi.module.ModuleType
import com.intellij.openapi.module.ModuleTypeManager
import com.intellij.openapi.roots.ui.configuration.ModulesProvider
import icons.SdkIcons
import javax.swing.Icon

public class DemoModuleType : ModuleType<DemoModuleBuilder>(ID) {
  override fun createModuleBuilder(): DemoModuleBuilder {
    return DemoModuleBuilder()
  }

  override fun getName(): String {
    return "SDK Module Type"
  }

  override fun getDescription(): String {
    return "Example custom module type"
  }

  override fun getNodeIcon(isOpened: Boolean): Icon {
    return SdkIcons.Sdk_default_icon
  }

  override fun createWizardSteps(
    wizardContext: WizardContext,
    moduleBuilder: DemoModuleBuilder,
    modulesProvider: ModulesProvider
  ): Array<ModuleWizardStep> {
    return super.createWizardSteps(wizardContext, moduleBuilder, modulesProvider)
  }

  companion object {
    private const val ID = "DEMO_MODULE_TYPE"
    val instance: DemoModuleType
      get() = ModuleTypeManager.getInstance().findByID(ID) as DemoModuleType
  }
}
