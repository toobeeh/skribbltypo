import {get, writable} from "svelte/store";
import { Type } from "../types/type";
import { BaseAPI, Configuration } from "../../api";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ApiFactory {

    /* value which will be used for api base url in created configs */
    static baseUrl = writable<string | undefined>();

    /* value which will be used for authentication in created configs */
    static authToken = writable<string | undefined>(sessionStorage.getItem("typoAccessToken") ?? undefined);

    /* whenever the auth token changes, save it to the session storage */
    private static unsubscriber = ApiFactory.authToken
        .subscribe(value => value ? sessionStorage.setItem("typoAccessToken", value) : sessionStorage.removeItem("typoAccessToken"));

    /* creates a new api config based on set options*/
    private static createApiConfig() {
        return new Configuration({
            basePath: get(this.baseUrl),
            accessToken: () => get(this.authToken) ?? ""
        });
    }

    /*create a new api client of given type*/
    static createApi<TApi extends BaseAPI>(apiClass: Type<TApi>): TApi {
        return new apiClass(this.createApiConfig());
    }
}

