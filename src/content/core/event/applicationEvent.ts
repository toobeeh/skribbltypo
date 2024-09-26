/**
 * Base class for all application events
 */
export abstract class ApplicationEvent<TData> {

  /**
   * Name of the event
   */
  public abstract readonly name: string;

  /**
   * Data associated with the event
   */
  public abstract readonly data: TData;
}