import type { TypoFeature } from "@/content/core/feature/feature";
import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { ExtensionSetting } from "@/content/core/settings/setting";
import { ToastService } from "@/content/services/toast/toast.service";
import { inject, injectable } from "inversify";
import { take } from "rxjs";

export interface onboardingTask {
  name: string;
  description: string;
  key: string;
  start: () => void;
}

export interface onboardingTaskRegistration {
  key: string,
  feature?: TypoFeature,
  name: string,
  description: string,
  start: () => void
}

export interface onboardingTaskHandle {
  complete: () => void;
  clear: () => void;
}

@injectable()
export class OnboardingService {

  private readonly _logger;

  private _completedTasks = new ExtensionSetting<string[]>("completed_onboarding_tasks", []);
  private _tasks: onboardingTask[] = [];

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(ToastService) private readonly _toastService: ToastService
  ) {
    this._logger = loggerFactory(this);
  }

  registerTask(registration: onboardingTaskRegistration): onboardingTaskHandle{
    const taskId = `${registration.feature?.name ?? "global"}_${registration.key}`;

    this._tasks.push({
      name: registration.name,
      description: registration.description,
      key: taskId,
      start: registration.start
    });

    return {
      complete: () => this._completedTasks.changes$.pipe(
        take(1),
      ).subscribe(tasks => {
        if (!tasks.includes(taskId)) {
          tasks.push(taskId);
          this._completedTasks.setValue(tasks);
          this._toastService.showToast("Congrats!", `You've completed '${registration.name}'`);
        }
      }),
      clear: () => this._completedTasks.changes$.pipe(
        take(1),
      ).subscribe(tasks => {
        if (tasks.includes(taskId)) {
          tasks.splice(tasks.indexOf(taskId), 1);
          this._completedTasks.setValue(tasks);
        }
      })
    };
  }

  public async getOnboardingTasks() {
    const completedTasks = await this._completedTasks.getValue();
    return Promise.all(this._tasks.map(async task => {
      return {
        ...task,
        completed: completedTasks.includes(task.key)
      };
    }));
  }

}