import { IInputs } from "../../../generated/ManifestTypes";

export interface IEditorProps {
    theme: IEditorTheme;
    context: ComponentFramework.Context<IInputs>;
}

export enum IEditorTheme {
    Light = "light",
    Dark = "vs-dark"
}