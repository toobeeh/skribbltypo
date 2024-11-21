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
 * @interface AnnouncementDto
 */
export interface AnnouncementDto {
    /**
     * Announcement title
     * @type {string}
     * @memberof AnnouncementDto
     */
    title: string;
    /**
     * Announcement content
     * @type {string}
     * @memberof AnnouncementDto
     */
    content: string;
    /**
     * Announcement type
     * @type {string}
     * @memberof AnnouncementDto
     */
    affectedTypoVersion?: string;
    /**
     * Announcement creation ms
     * @type {string}
     * @memberof AnnouncementDto
     */
    date: string;
    /**
     * Announcement type
     * @type {string}
     * @memberof AnnouncementDto
     */
    type: AnnouncementDtoTypeEnum;
}


/**
 * @export
 */
export const AnnouncementDtoTypeEnum = {
    Announcement: 'Announcement',
    Changelog: 'Changelog'
} as const;
export type AnnouncementDtoTypeEnum = typeof AnnouncementDtoTypeEnum[keyof typeof AnnouncementDtoTypeEnum];


/**
 * Check if a given object implements the AnnouncementDto interface.
 */
export function instanceOfAnnouncementDto(value: object): value is AnnouncementDto {
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('content' in value) || value['content'] === undefined) return false;
    if (!('date' in value) || value['date'] === undefined) return false;
    if (!('type' in value) || value['type'] === undefined) return false;
    return true;
}

export function AnnouncementDtoFromJSON(json: any): AnnouncementDto {
    return AnnouncementDtoFromJSONTyped(json, false);
}

export function AnnouncementDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): AnnouncementDto {
    if (json == null) {
        return json;
    }
    return {
        
        'title': json['title'],
        'content': json['content'],
        'affectedTypoVersion': json['affectedTypoVersion'] == null ? undefined : json['affectedTypoVersion'],
        'date': json['date'],
        'type': json['type'],
    };
}

export function AnnouncementDtoToJSON(value?: AnnouncementDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'title': value['title'],
        'content': value['content'],
        'affectedTypoVersion': value['affectedTypoVersion'],
        'date': value['date'],
        'type': value['type'],
    };
}

