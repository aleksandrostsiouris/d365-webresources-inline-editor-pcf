export interface IWebResource {
    displayname: string;
    webresourcetype: number;
    content: string;
    webresourceid: string;
    name: string;
    webresourceidunique: string;
    modifiedon: string;
    'modifiedon@OData.Community.Display.V1.FormattedValue': string;
    createdon: string;
    'createdon@OData.Community.Display.V1.FormattedValue': string;
}

export type WebResource = IWebResource | null | undefined;