/* tslint:disable */
/* eslint-disable */
/**
 * Skribbl Typo API
 * Skribbl Typo API for resources, admin tools and authentification.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface DropDto
 */
export interface DropDto {
    /**
     * Drop ID
     * @type {number}
     * @memberof DropDto
     */
    dropID: number;
    /**
     * Lobby where the drop has been caught
     * @type {string}
     * @memberof DropDto
     */
    caughtLobbyKey: string;
    /**
     * Discord User ID of the catcher
     * @type {string}
     * @memberof DropDto
     */
    caughtLobbyPlayerID: string;
    /**
     * Timestamp of the drop
     * @type {string}
     * @memberof DropDto
     */
    validFrom: string;
    /**
     * Event Drop ID
     * @type {number}
     * @memberof DropDto
     */
    eventDropID: number;
    /**
     * Response time of the catch
     * @type {number}
     * @memberof DropDto
     */
    leagueWeight: number;
}

/**
 * Check if a given object implements the DropDto interface.
 */
export function instanceOfDropDto(value: object): value is DropDto {
    if (!('dropID' in value) || value['dropID'] === undefined) return false;
    if (!('caughtLobbyKey' in value) || value['caughtLobbyKey'] === undefined) return false;
    if (!('caughtLobbyPlayerID' in value) || value['caughtLobbyPlayerID'] === undefined) return false;
    if (!('validFrom' in value) || value['validFrom'] === undefined) return false;
    if (!('eventDropID' in value) || value['eventDropID'] === undefined) return false;
    if (!('leagueWeight' in value) || value['leagueWeight'] === undefined) return false;
    return true;
}

export function DropDtoFromJSON(json: any): DropDto {
    return DropDtoFromJSONTyped(json, false);
}

export function DropDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): DropDto {
    if (json == null) {
        return json;
    }
    return {
        
        'dropID': json['DropID'],
        'caughtLobbyKey': json['CaughtLobbyKey'],
        'caughtLobbyPlayerID': json['CaughtLobbyPlayerID'],
        'validFrom': json['ValidFrom'],
        'eventDropID': json['EventDropID'],
        'leagueWeight': json['LeagueWeight'],
    };
}

export function DropDtoToJSON(value?: DropDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'DropID': value['dropID'],
        'CaughtLobbyKey': value['caughtLobbyKey'],
        'CaughtLobbyPlayerID': value['caughtLobbyPlayerID'],
        'ValidFrom': value['validFrom'],
        'EventDropID': value['eventDropID'],
        'LeagueWeight': value['leagueWeight'],
    };
}
