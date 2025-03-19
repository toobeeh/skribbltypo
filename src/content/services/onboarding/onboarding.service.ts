import type { TypoFeature } from "@/content/core/feature/feature";
import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { ExtensionSetting } from "@/content/core/settings/setting";
import { inject, injectable } from "inversify";
import { Subject, take } from "rxjs";

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
  private _taskCompleted$ = new Subject<onboardingTask>();

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);
  }

  registerTask(registration: onboardingTaskRegistration): onboardingTaskHandle{
    const taskId = `${registration.feature?.name ?? "global"}_${registration.key}`;

    const task = {
      name: registration.name,
      description: registration.description,
      key: taskId,
      start: registration.start
    };
    this._tasks.push(task);

    return {
      complete: () => this._completedTasks.changes$.pipe(
        take(1),
      ).subscribe(tasks => {
        if (!tasks.includes(taskId)) {
          tasks.push(taskId);
          this._completedTasks.setValue(tasks);
          this._taskCompleted$.next(task);
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

  public get taskCompleted$() {
    return this._taskCompleted$.asObservable();
  }

}