
# Dynamics 365 Webresources Inline Editor

## What is it?
Essentially it's a [monaco-editor](https://microsoft.github.io/monaco-editor/) wrapped inside a PCF component </br> 
which queries into `webresource` table inside Dynamics 365 instance using PCF's `WebApi` wrapped by [react-query](https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/) </br>
Most of the components are built using MS's [fluent-ui](https://developer.microsoft.com/en-us/fluentui)

## Themes 
### Light
![image](https://user-images.githubusercontent.com/84045141/192150103-e3468aa1-6b50-4ca3-9a05-10b4ef13dde9.png)

### Dark
![image](https://user-images.githubusercontent.com/84045141/192150113-20742726-864c-4294-b06b-8b284c6cb885.png)

## How to use
- Download the latest release from this repo
- Import the Managed Solution to your target D365 instance 
- Navigate into a form configuration 
- Insert a new grid on the form 
- Navigate into the control section and select the `WebResourceInlineEditor` control 
