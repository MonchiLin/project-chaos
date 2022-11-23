package com.kiki.chaos.fork;

import com.fasterxml.jackson.databind.Module;
import com.intellij.ide.util.projectWizard.ModuleBuilder;
import com.intellij.ide.util.projectWizard.ModuleWizardStep;
import com.intellij.ide.util.projectWizard.WizardContext;
import com.intellij.openapi.module.ModuleType;
import com.intellij.openapi.roots.ModifiableRootModel;
import com.intellij.openapi.roots.ui.configuration.ModulesProvider;
import org.jetbrains.annotations.Nls;
import org.jetbrains.annotations.NotNull;

import javax.swing.*;

public class ChaosForkWizardStep extends ModuleBuilder {

  public void setupRootModel(@NotNull ModifiableRootModel modifiableRootModel) {
  }

  public ModuleType<?> getModuleType() {
    return ModuleType.EMPTY; //or it could be other module type
  }

  @Override
  public ModuleWizardStep[] createWizardSteps(@NotNull WizardContext wizardContext,
                                              @NotNull ModulesProvider modulesProvider) {
    return new ModuleWizardStep[]{new ModuleWizardStep() {
      @Override
      public JComponent getComponent() {
        return new JLabel("Put your content here");
      }

      @Override
      public void updateDataModel() {

      }
    }};
  }

}
