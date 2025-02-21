import { FeatureTag } from "@/content/core/feature/feature-tags";
import { ToastService } from "@/content/services/toast/toast.service";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import { BehaviorSubject, distinctUntilChanged, type Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class ChatCopyFormattedFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ToastService) private readonly _toastService!: ToastService;

  private _iconElement?: IconButton;

  public readonly name = "Copy Chat Formatted";
  public readonly description = "Enables to copy selected chat messages formatted for discord messages";
  public readonly tags = [
    FeatureTag.INTERFACE
  ];
  public readonly featureId = 36;

  private selectedText$ = new BehaviorSubject<string | null>(null); /* current chat message selection */
  private readonly _selectionChangeListener = this.onSelectionChange.bind(this); /* bind listener for context, needed to make unsubscription possible */
  private _selectedTextSubscription?: Subscription;
  private _iconClickSubscription?: Subscription;

  protected override async onActivate() {

    /* listen for dom event */
    document.addEventListener("selectionchange", this._selectionChangeListener);

    /* process changed selected text */
    this._selectedTextSubscription = this.selectedText$.pipe(
      distinctUntilChanged()
    ).subscribe(text => {
      this.processChangedChatSelection(text);
    });
  }

  protected override onDestroy() {
    document.removeEventListener("selectionchange", this._selectionChangeListener);
    this._selectedTextSubscription?.unsubscribe();
    this._iconClickSubscription?.unsubscribe();
    this._iconClickSubscription = undefined;
    this._iconElement?.$destroy();
    this._iconElement = undefined;
  }

  /**
   * Callback for DOM selection change event
   * @private
   */
  private async onSelectionChange() {
    this._logger.debug("Selection changed");
    const elements = await this._elementsSetup.complete();

    const selection = document.getSelection();
    if(!selection || selection.rangeCount === 0) {
      this.selectedText$.next(null);
      return;
    }

    const range = selection.getRangeAt(0);
    if(range.commonAncestorContainer instanceof HTMLElement && range.commonAncestorContainer === elements.chatContent) {

      /* get start/end nodes - take parent elem if node is text*/
      let start = (range.startContainer.nodeName === "#text" ? range.startContainer.parentElement : range.startContainer);
      let end = (range.endContainer.nodeName === "#text" ? range.endContainer.parentElement : range.endContainer);

      /*if(start?.nodeType === 3) start = start.parentNode;
      if(end?.nodeType === 3) end = end.parentNode;*/

      if(!(end instanceof HTMLElement && start instanceof HTMLElement)) {
        this._logger.warn("Could not find start or end element", start, end);
        this.selectedText$.next(null);
        return;
      }

      /* find closest p, indicating the message wrapper */
      start = start.closest("p") as HTMLElement | null;
      end = end.closest("p") as HTMLElement | null;
      if(!(start instanceof HTMLElement && end instanceof HTMLElement)) {
        this._logger.warn("Could not find start or end paragraph", start, end);
        this.selectedText$.next(null);
        return;
      }

      /* take all messages between start and end, and crate chat string from it */
      const ps = [...document.querySelectorAll(".chat-content p")];
      const elems = ps.slice(ps.indexOf(start), ps.indexOf(end)+1);
      console.log(elems.length);
      const text = elems.map(e => e.textContent).join("\n");
      this.selectedText$.next(text);
    }
    else this.selectedText$.next(null);
  }

  private async processChangedChatSelection(text: string | null) {
    this._logger.info("Selected text changed", text);

    const elements = await this._elementsSetup.complete();

    /* if copy button exists, but no selection made, remove it */
    if(this._iconElement && text === null){
      this._iconElement?.$destroy();
      this._iconElement = undefined;
      this._iconClickSubscription?.unsubscribe();
      this._iconClickSubscription = undefined;
    }

    /* if selection exists, but no button present, create it */
    if(text !== null && !this._iconElement){
      this._iconElement = new IconButton({
        target: elements.chatControls,
        props: {
          icon: "file-img-discord-gif",
          name: "Copy Chat for Discord",
          order: 3,
          size: "2rem",
          hoverMove: false,
          greyscaleInactive: true,
          tooltipAction: this.createTooltip
        }
      });

      this._iconClickSubscription = this._iconElement.click$.subscribe(async () => {
        const currentText = this.selectedText$.value;
        if(currentText === null) {
          this._logger.warn("No text selected, but copy button clicked - illegal state");
          return;
        }

        const formatted = this.formatChatForDiscord(currentText);
        this._logger.info("Copy button clicked for selection", formatted);
        await navigator.clipboard.writeText(formatted);
        await this._toastService.showToast("Chat copied to clipboard");
        document.getSelection()?.removeAllRanges();
      });
    }
  }

  /**
   * Create discord code block from text
   * @param text
   * @private
   */
  private formatChatForDiscord(text: string): string {
    const chat = text.replace(/(\n)(?=.*? guessed the word!)/g, "\n+ ")
      .replace(/(\n)(?=.*? joined.)/g, "\n+ ")
      .replace(/(\n)(?=The word was)/g, "\n+ ")
      .replace(/(\n)(?=.*? is drawing now!)/g, "\n+ ")
      .replace(/(\n)(?=.*? is now the room owner!)/g, "\n+ ")
      .replace(/(\n)(?=.*? left.)/g, "\n- ")
      .replace(/(\n)(?=.*? is voting to kick.)/g, "\n- ")
      .replace(/(\n)(?=.*? was kicked.)/g, "\n- ")
      .replace(/(\n)(?=Whoops.*? caught the drop before you.)/g, "\n--- ")
      .replace(/(\n)(?=Yeee.*? and caught the drop!)/g, "\n--- ");

    return "```diff\n" + chat + "\n```";
  }
}