import { WebResourceTypes } from "../models/IWebResourceType";

export const convertToLanguage = (type: string) => {
    switch (type) {
        case WebResourceTypes[WebResourceTypes.HTML]:
            return "html";
        case WebResourceTypes[WebResourceTypes.CSS]:
            return "css";
        case WebResourceTypes[WebResourceTypes.JS]:
            return "javascript";
        case WebResourceTypes[WebResourceTypes.XML]:
            return "xml";
        case WebResourceTypes[WebResourceTypes.PNG]:
            return "png";
        case WebResourceTypes[WebResourceTypes.JPG]:
            return "jpg";
        case WebResourceTypes[WebResourceTypes.GIF]:
            return "gif";
        case WebResourceTypes[WebResourceTypes.XAP]:
            return "xap";
        case WebResourceTypes[WebResourceTypes.XSL]:
            return "xsl";
        case WebResourceTypes[WebResourceTypes.ICO]:
            return "ico";
        case WebResourceTypes[WebResourceTypes.SVG]:
            return "svg";
        case WebResourceTypes[WebResourceTypes.RESX]:
            return "resx";
    }
    return type;
}