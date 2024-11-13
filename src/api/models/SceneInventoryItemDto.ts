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
 * @interface SceneInventoryItemDto
 */
export interface SceneInventoryItemDto {
    /**
     * A scene Id
     * @type {number}
     * @memberof SceneInventoryItemDto
     */
    sceneId: number;
    /**
     * A scene theme shift identification
     * @type {number}
     * @memberof SceneInventoryItemDto
     */
    sceneShift?: number;
}

/**
 * Check if a given object implements the SceneInventoryItemDto interface.
 */
export function instanceOfSceneInventoryItemDto(value: object): value is SceneInventoryItemDto {
    if (!('sceneId' in value) || value['sceneId'] === undefined) return false;
    return true;
}

export function SceneInventoryItemDtoFromJSON(json: any): SceneInventoryItemDto {
    return SceneInventoryItemDtoFromJSONTyped(json, false);
}

export function SceneInventoryItemDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SceneInventoryItemDto {
    if (json == null) {
        return json;
    }
    return {
        
        'sceneId': json['sceneId'],
        'sceneShift': json['sceneShift'] == null ? undefined : json['sceneShift'],
    };
}

export function SceneInventoryItemDtoToJSON(value?: SceneInventoryItemDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'sceneId': value['sceneId'],
        'sceneShift': value['sceneShift'],
    };
}
