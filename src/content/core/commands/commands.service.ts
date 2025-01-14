import { type commandExecutionContext, ExtensionCommand } from "@/content/core/commands/command";
import {
  type Interpretable, InterpretableError,
  type interpretableExecutionResult,
  InterpretableResult
} from "@/content/core/commands/interpretable";
import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { inject, injectable } from "inversify";
import {
  BehaviorSubject, combineLatest,
  map, type Observable,
  switchMap,
} from "rxjs";

export interface CommandExecutionResult {
  result: InterpretableResult | null;
  context: commandExecutionContext;
}

export class InterpretableEmptyRemainder extends InterpretableError {}

@injectable()
export class CommandsService {

  private readonly _logger;
  private _registeredCommands: ExtensionCommand[] = [];
  private _activeCommands$ = new BehaviorSubject<ExtensionCommand[]>([]);

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
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
    this._registeredCommands = this._registeredCommands.filter(c => c !== command);
    this._activeCommands$.next(this._registeredCommands);
  }

  /**
   * Get an observable containing all registered and active commands
   */
  get commands$(): Observable<ExtensionCommand[]> {
    return this._activeCommands$.pipe(
      switchMap(commands => {
        const values = commands.map(command => command.enabledSetting.changes$.pipe(map((enabled) => ({command, enabled}))));
        return combineLatest(...values);
      }),
      map(commands => commands.filter(c => c.enabled).map(command => command.command))
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

    return { result: await this.executeInterpretable(command, args, {}, context), context};
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
    args: string, source: TSource, context: TContext,
  ): Promise<InterpretableResult | null> {

    /* try to interpret the args */
    let interpretation;
    try {
      interpretation = await interpretable.interpret(args, source, context);
    }

    /* if an error is thrown, return it */
    catch(e: unknown){
      if(e instanceof InterpretableError) return e;
      else throw e;
    }

    /* interpretable did not match */
    if(interpretation === null) {
      return null;
    }

    /* execute interpretable action with interpreted args */
    let result: Awaited<interpretableExecutionResult<TSource & TResult, TContext>>;
    try {
      result = await interpretable.execute(interpretation.result, context);
    }

    /* if an error is thrown, return it */
    catch(e: unknown){
      if(e instanceof InterpretableError) return e;
      else throw e;
    }

    /*/!* if remainder is empty, throw *!/
    if(interpretation.remainder.length === 0) {
      return new InterpretableEmptyRemainder();
    }*/

    /* if interpretable provided chain, follow */
    if(result.next !== undefined){
      return await this.executeInterpretable(result.next, interpretation.remainder, interpretation.result, context);
    }

    /* else return a final status message */
    else return result.result;
  }

}