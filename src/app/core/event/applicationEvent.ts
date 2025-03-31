/**
 * Base class for all application events
 */
export abstract class ApplicationEvent<TData> {

  /**
   * Data associated with the event
   */
  public abstract readonly data: TData;
}