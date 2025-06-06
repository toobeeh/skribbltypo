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
 * @interface EventDto
 */
export interface EventDto {
    /**
     * Event name
     * @type {string}
     * @memberof EventDto
     */
    name: string;
    /**
     * Event unique ID
     * @type {number}
     * @memberof EventDto
     */
    id: number;
    /**
     * Event description
     * @type {string}
     * @memberof EventDto
     */
    description: string;
    /**
     * Event start date
     * @type {string}
     * @memberof EventDto
     */
    eventStart: string;
    /**
     * Event length in days
     * @type {number}
     * @memberof EventDto
     */
    eventLength: number;
}

/**
 * Check if a given object implements the EventDto interface.
 */
export function instanceOfEventDto(value: object): value is EventDto {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('description' in value) || value['description'] === undefined) return false;
    if (!('eventStart' in value) || value['eventStart'] === undefined) return false;
    if (!('eventLength' in value) || value['eventLength'] === undefined) return false;
    return true;
}

export function EventDtoFromJSON(json: any): EventDto {
    return EventDtoFromJSONTyped(json, false);
}

export function EventDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): EventDto {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'id': json['id'],
        'description': json['description'],
        'eventStart': json['eventStart'],
        'eventLength': json['eventLength'],
    };
}

export function EventDtoToJSON(json: any): EventDto {
    return EventDtoToJSONTyped(json, false);
}

export function EventDtoToJSONTyped(value?: EventDto | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'id': value['id'],
        'description': value['description'],
        'eventStart': value['eventStart'],
        'eventLength': value['eventLength'],
    };
}

