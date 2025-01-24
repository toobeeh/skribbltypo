import { MessageSentEventListener } from "@/content/events/message-sent.event";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class ChatRecallFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(MessageSentEventListener) private readonly _messageSent!: MessageSentEventListener;

  public readonly name = "Chat Recall";
  public readonly description = "Remembers your last messages so you can quickly recall them with arrow up/down in the chat box";
  public readonly featureId = 15;

  private _history: string[] = [];
  private _historyIndex?:number = undefined;

  async handleInputEvent(event: KeyboardEvent) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const element = (event.target as HTMLInputElement);

      /* if not in browse mode, start at last element if arrow down, else ignore*/
      if(this._historyIndex === undefined) {
        if(event.key === "ArrowUp"){
          this._historyIndex = this._history.length - 1;
          element.value = this._history[this._historyIndex] ?? "";
        }
      }

      /* browse earlier */
      else if(event.key === "ArrowDown"){
        if(this._historyIndex < this._history.length - 1){
          this._historyIndex++;
          element.value = this._history[this._historyIndex];
        }

        /* reset if after earliest */
        else {
          this._historyIndex = undefined;
          element.value = "";
        }
      }

      /* browse later */
      else if(event.key === "ArrowUp"){
        if(this._historyIndex > 0){
          this._historyIndex--;
          element.value = this._history[this._historyIndex];
        }
      }
    }
  }

  listener = this.handleInputEvent.bind(this);

  protected override async onActivate() {

    /* add handler for arrow up/down */
    const elements = await this._elements.complete();
    elements.chatInput.addEventListener("keydown", this.listener);

    /* push messages to history */
    this._messageSent.events$.subscribe((event) => {
      this._history.push(event.data);
      this._historyIndex = undefined;
    });
  }

  protected override async onDestroy() {
    const elements = await this._elements.complete();
    elements.chatInput.removeEventListener("keydown", this.listener);
    this._history = [];
    this._historyIndex = 0;
  }
}