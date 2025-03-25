<script lang="ts">
  import type { EmojiDto } from "@/api";
  import { NumericCommandParameter } from "@/app/core/commands/params/numeric-command-parameter";
  import {
    InterpretableCommandPartialMatch
  } from "@/app/core/commands/results/interpretable-command-partial-match";
  import type { ChatCommandsFeature } from "@/app/features/chat-commands/chat-commands.feature";
  import type { ChatEmojisFeature } from "@/app/features/chat-emojis/chat-emojis.feature";
  import { firstValueFrom } from "rxjs";

  export let feature: ChatCommandsFeature;

  const currentCommands = feature.commandResultStore;
  const combo = feature.submitHotkeyStore;
</script>

<style lang="scss">

  .typo-command-preview {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &:not(:has(.typo-command-result)) {
      gap: .2rem;
    }

    .typo-command-result {
      display: flex;
      flex-direction: column;
      gap: .2rem;

      .typo-command-result-synopsis {
        display: flex;
        gap: .4rem;
        flex-wrap: wrap;
        align-items: center;

        .typo-command-result-arg {
          background-color: var(--COLOR_PANEL_BG);
          padding: .2rem;
          border-radius: 3px;
          opacity: .5;

          &.current {
            opacity: 1;
          }
        }

        .typo-command-result-id {
          padding: .2rem;
          border-radius: 3px;
          font-weight: bolder;

          &.current {
            background-color: var(--COLOR_PANEL_BG);
          }
        }
      }

      .typo-command-result-description {
        .typo-command-result-param-type {
          display: block;
          opacity: .7;
        }
      }

      .typo-command-result-state {
        display: flex;
        gap: .5rem;
        align-items: center;
        margin-top: .3rem;
        opacity: .7;

        img {
          height: 1.3rem;
        }
      }

    }
  }

</style>


<div class="typo-command-preview">
  {#each $currentCommands as result}
    {#if result.result !== null}

      <div class="typo-command-result">

        <div class="typo-command-result-synopsis">
          <div class="typo-command-result-id" class:current={feature.isActiveTypingId(result)}>
            /
            {#await firstValueFrom(result.context.command.idSetting.changes$)}
            {:then res}
              {res}
            {/await}
          </div>

          {#each result.context.parameters as param}
            <div class="typo-command-result-arg" class:current={feature.isActiveTypingParam(result, param)}>
              {param.typeName}
            </div>
          {/each}
        </div>

        <div class="typo-command-result-description">
          {#if result.context.currentInterpretedParameter === undefined}
            {result.context.command.description}
          {:else if !feature.otherHasExecutionTarget(result, $currentCommands)}
            <b>{result.context.currentInterpretedParameter.name}:</b> {result.context.currentInterpretedParameter.description}<br>
            <span class="typo-command-result-param-type">
              <b>Content: </b>{result.context.currentInterpretedParameter.typeDescription}
            </span>
          {/if}
        </div>

        {#if !(result.result instanceof InterpretableCommandPartialMatch)}
          <div class="typo-command-result-state">
            {#if feature.otherHasExecutionTarget(result, $currentCommands)}
              <span>Another command is prioritized</span>
            {:else }
              <img src="" alt="icon" style="content: var(--{feature.isValidCommand(result) ? 'file-img-enabled-gif' : 'file-img-disabled-gif'})">
              <span>{feature.getResultStateMessage(result, $combo)}</span>
            {/if}

          </div>
        {/if}

      </div>

    {/if}
  {/each}

  {#if $currentCommands.every(result => result.result === null)}
    <div>Type a command id..</div>
    {#each $currentCommands as result}
      <b>/
        {#await firstValueFrom(result.context.command.idSetting.changes$)}
        {:then res}
          {res}
        {/await}
      </b>
    {/each}
  {/if}
</div>

