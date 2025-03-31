import { type commandExecutionContext, ExtensionCommand } from "@/app/core/commands/command";
import {
  type Interpretable,
  type interpretableExecutionResult,
} from "@/app/core/commands/interpretable";
import { InterpretableError } from "@/app/core/commands/results/interpretable-error";
import { InterpretableResult } from "@/app/core/commands/results/interpretable-result";
import { loggerFactory } from "@/app/core/logger/loggerFactory.interface";
import { inject, injectable } from "inversify";
import { BehaviorSubject, combineLatest, map, type Observable, switchMap } from "rxjs";

/**
 * Result of a command interpretable chain (command and params)
 */
export interface CommandExecutionResult {

  /**
   * The final execution result of the chain
   */
  result: InterpretableResult | null;

  /**
   * The context of the interpretation chain
   */
  context: commandExecutionContext;
}

@injectable()
export class CommandsService {
  private readonly _logger;
  private _registeredCommands: ExtensionCommand[] = [];
  private _activeCommands$ = new BehaviorSubject<ExtensionCommand[]>([]);

  constructor(@inject(loggerFactory) loggerFactory: loggerFactory) {
    this._logger = loggerFactory(this);
  }

  /**
   * Register a command to the service
   * @param command
   */
  registerCommand(command: ExtensionCommand) {
    this._registeredCommands.push(command);
    this._activeCommands$.next(this._registeredCommands);
  }

  /**
   * Remove a command from the service
   * @param command
   */
  removeCommand(command: ExtensionCommand) {
    this._registeredCommands = this._registeredCommands.filter((c) => c !== command);
    this._activeCommands$.next(this._registeredCommands);
  }

  /**
   * Get an observable containing all registered and active commands
   */
  get commands$(): Observable<ExtensionCommand[]> {
    return this._activeCommands$.pipe(
      switchMap((commands) => {
        const values = commands.map((command) =>
          command.enabledSetting.changes$.pipe(map((enabled) => ({ command, enabled }))),
        );
        return combineLatest(...values);
      }),
      map((commands) => commands.filter((c) => c.enabled).map((command) => command.command)),
    );
  }

  /**
   * Execute a command with given args as interpretable chain and return with resulting command context
   * @param command
   * @param args
   */
  async executeCommand(command: ExtensionCommand, args: string): Promise<CommandExecutionResult> {
    const context: commandExecutionContext = {
      parameters: command.params,
      command
    };

    return { result: await this.executeInterpretable(command, args, {}, context), context };
  }

  /**
   * Execute an interpretable chain on given args and context
   * @param interpretable
   * @param args
   * @param source
   * @param context
   */
  async executeInterpretable<TSource, TResult, TContext>(
    interpretable: Interpretable<TSource, TResult, TContext>,
    args: string,
    source: TSource,
    context: TContext,
  ): Promise<InterpretableResult | null> {

    /* try to interpret the args */
    let interpretation;
    try {
      interpretation = await interpretable.interpret(args, source, context);
    } catch (e: unknown) {

      /* if an error is thrown, return it */
      if (e instanceof InterpretableError) return e;
      else throw e;
    }

    /* interpretation was refused, command not matched */
    if (interpretation === null) {
      return null;
    }

    /* execute interpretable action with interpreted args */
    let result: Awaited<interpretableExecutionResult<TSource & TResult, TContext>>;
    try {
      result = await interpretable.execute(interpretation.result, context);
    } catch (e: unknown) {
      /* if an error is thrown, return it */
      if (e instanceof InterpretableError) return e;
      else throw e;
    }

    this._logger.debug("Interpretable execution result", interpretable, result);

    /* if interpretable provided chain, follow */
    if (result.next !== undefined) {
      return await this.executeInterpretable(
        result.next,
        interpretation.remainder,
        interpretation.result,
        context,
      );
    }

    /* else return the result of the interpretable as result of the chain */
    else return result.result;
  }
}