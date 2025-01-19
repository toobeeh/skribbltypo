/* THIS (.ts) FILE IS GENERATED BY TypedSignalR.Client.TypeScript */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import type { IStreamResult, Subject } from '@microsoft/signalr';
import type { GuildLobbiesUpdatedDto, LobbyDiscoveredDto, TypoLobbyStateDto, SkribblLobbyStateDto, SkribblLobbyTypoSettingsUpdateDto, DropClaimDto, DropClaimResultDto, AwardGiftDto, TypoLobbySettingsDto, DropAnnouncementDto, AwardGiftedDto, OnlineItemsUpdatedDto } from '../tobeh.Avallone.Server.Classes.Dto';

export type IGuildLobbiesHub = {
    /**
    * @param guildId Transpiled from string
    * @returns Transpiled from System.Threading.Tasks.Task<tobeh.Avallone.Server.Classes.Dto.GuildLobbiesUpdatedDto>
    */
    subscribeGuildLobbies(guildId: string): Promise<GuildLobbiesUpdatedDto>;
}

export type ILobbyHub = {
    /**
    * @param lobbyDiscovery Transpiled from tobeh.Avallone.Server.Classes.Dto.LobbyDiscoveredDto
    * @returns Transpiled from System.Threading.Tasks.Task<tobeh.Avallone.Server.Classes.Dto.TypoLobbyStateDto>
    */
    lobbyDiscovered(lobbyDiscovery: LobbyDiscoveredDto): Promise<TypoLobbyStateDto>;
    /**
    * @returns Transpiled from System.Threading.Tasks.Task
    */
    claimLobbyOwnership(): Promise<void>;
    /**
    * @param state Transpiled from tobeh.Avallone.Server.Classes.Dto.SkribblLobbyStateDto
    * @returns Transpiled from System.Threading.Tasks.Task
    */
    updateSkribblLobbyState(state: SkribblLobbyStateDto): Promise<void>;
    /**
    * @param typoSettings Transpiled from tobeh.Avallone.Server.Classes.Dto.SkribblLobbyTypoSettingsUpdateDto
    * @returns Transpiled from System.Threading.Tasks.Task
    */
    updateTypoLobbySettings(typoSettings: SkribblLobbyTypoSettingsUpdateDto): Promise<void>;
    /**
    * @param dropClaim Transpiled from tobeh.Avallone.Server.Classes.Dto.DropClaimDto
    * @returns Transpiled from System.Threading.Tasks.Task<tobeh.Avallone.Server.Classes.Dto.DropClaimResultDto>
    */
    claimDrop(dropClaim: DropClaimDto): Promise<DropClaimResultDto>;
    /**
    * @param awardGift Transpiled from tobeh.Avallone.Server.Classes.Dto.AwardGiftDto
    * @returns Transpiled from System.Threading.Tasks.Task
    */
    giftAward(awardGift: AwardGiftDto): Promise<void>;
}

export type IOnlineItemsHub = {
}

export type IGuildLobbiesReceiver = {
    /**
    * @param lobbyUpdates Transpiled from tobeh.Avallone.Server.Classes.Dto.GuildLobbiesUpdatedDto
    * @returns Transpiled from System.Threading.Tasks.Task
    */
    guildLobbiesUpdated(lobbyUpdates: GuildLobbiesUpdatedDto): Promise<void>;
}

export type ILobbyReceiver = {
    /**
    * @param settings Transpiled from tobeh.Avallone.Server.Classes.Dto.TypoLobbySettingsDto
    * @returns Transpiled from System.Threading.Tasks.Task
    */
    typoLobbySettingsUpdated(settings: TypoLobbySettingsDto): Promise<void>;
    /**
    * @returns Transpiled from System.Threading.Tasks.Task
    */
    lobbyOwnershipResigned(): Promise<void>;
    /**
    * @param drop Transpiled from tobeh.Avallone.Server.Classes.Dto.DropAnnouncementDto
    * @returns Transpiled from System.Threading.Tasks.Task
    */
    dropAnnounced(drop: DropAnnouncementDto): Promise<void>;
    /**
    * @param award Transpiled from tobeh.Avallone.Server.Classes.Dto.AwardGiftedDto
    * @returns Transpiled from System.Threading.Tasks.Task
    */
    awardGifted(award: AwardGiftedDto): Promise<void>;
    /**
    * @param claimResult Transpiled from tobeh.Avallone.Server.Classes.Dto.DropClaimResultDto
    * @returns Transpiled from System.Threading.Tasks.Task
    */
    dropClaimed(claimResult: DropClaimResultDto): Promise<void>;
}

export type IOnlineItemsReceiver = {
    /**
    * @param itemUpdates Transpiled from tobeh.Avallone.Server.Classes.Dto.OnlineItemsUpdatedDto
    * @returns Transpiled from System.Threading.Tasks.Task
    */
    onlineItemsUpdated(itemUpdates: OnlineItemsUpdatedDto): Promise<void>;
}

