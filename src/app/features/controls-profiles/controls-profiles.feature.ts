import { FeatureTag } from "@/app/core/feature/feature-tags";
import type { componentData } from "@/app/services/modal/modal.service";
import { ToastService } from "@/app/services/toast/toast.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import { typoRuntime } from "@/runtime/runtime";
import { inject } from "inversify";
import { TypoFeature } from "../../core/feature/feature";
import ControlsProfiles from "./controls-profiles.svelte";

export class ControlsProfilesFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ToastService) private readonly _toastService!: ToastService;

  public readonly name = "Typo Profiles";
  public readonly description = "Switch between different typo profiles.";
  public readonly tags = [
    FeatureTag.DEVELOPMENT
  ];
  public readonly featureId = 48;
  public override readonly toggleEnabled = false;

  public override get featureManagementComponent(): componentData<ControlsProfiles>{
    return {componentType: ControlsProfiles, props: { feature: this }};
  }

  public async getProfiles() {
    const currentProfile = await typoRuntime.currentProfile();
    return (await typoRuntime.getProfiles()).map(profile => ({name: profile, active: profile === currentProfile}));
  }

  public async deleteProfile(profile: string) {
    const currentProfile = await typoRuntime.currentProfile();
    if(profile === currentProfile){
      this._logger.error("Cannot delete the current profile.");
      await this._toastService.showToast("Cannot delete the current profile " + profile);
      return;
    }

    const toast = await this._toastService.showConfirmToast(
      `Delete profile ${profile}?`,
      "Deleting a profile will reload the page.",
      10000,
      {confirm: "Delete profile", cancel: "Cancel deletion"}
    );
    const result = await toast.result;
    if(!result) return;

    await typoRuntime.deleteProfile(profile);
    window.location.reload();
  }

  public async switchToProfile(profile: string) {
    const toast = await this._toastService.showConfirmToast(
      `Switch to profile ${profile}?`,
      "Switching a profile will reload the page.",
      10000,
      {confirm: "Switch now", cancel: "Cancel switch"}
    );
    const result = await toast.result;
    if(!result) return;

    await typoRuntime.switchToProfile(profile);
    window.location.reload();
  }

  public async createProfile() {
    const toast = await this._toastService.showPromptToast("Create and activate profile", "Enter a name for the new profile");
    const result = await toast.result;
    if(result === null || result.length === 0) return;

    const profiles = await typoRuntime.getProfiles();
    if(profiles.includes(result)){
      this._logger.error("Profile already exists");
      await this._toastService.showToast("Profile already exists", "A profile with the name " + result + " already exists.\nPlease choose a different name.");
      return;
    }

    await typoRuntime.createAndSwitchToProfile(result);
    window.location.reload();
  }

  public async resetTypo(){
    const toast = await this._toastService.showConfirmToast(
      "Reset Typo?",
      "This will delete ALL saved data (themes, palettes, login, profiles, filters..) and reload the page.",
      10000,
      {confirm: "Reset typo (think twice)", cancel: "Cancel reset (panic!)"}
    );
    const result = await toast.result;
    if(!result) return;

    await typoRuntime.resetTypo();
    window.location.reload();
  }
}