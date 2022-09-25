import { IWebResource } from "../../../services/query-repository/IWebResoure";
import { WebResourceTypes } from "./IWebResourceType";

export class WebResourceItem implements IWebResourceItem {
    public fileType: string;
    public fileName: string;
    public modifiedOn: string;
    public createdOn: string;
    public content: string;
    public webresourceid: string;
    public key: string;
    private static key = 0;
    constructor(webResource: IWebResource) {
        this.key = `webResourceItem-${++WebResourceItem.key}`;
        this.fileName = webResource.displayname;
        this.fileType = WebResourceTypes[webResource.webresourcetype];
        this.modifiedOn = webResource["modifiedon@OData.Community.Display.V1.FormattedValue"]
        this.createdOn = webResource["createdon@OData.Community.Display.V1.FormattedValue"];
        this.content = webResource.content;
        this.webresourceid = webResource.webresourceid;
    }
}

export interface IWebResourceItem {
    key: string;
    fileType: string;
    fileName: string;
    modifiedOn: string;
    createdOn: string;
    content: string;
    webresourceid: string;
}

