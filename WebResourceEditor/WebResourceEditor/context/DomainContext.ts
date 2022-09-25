import { IEditorTheme } from "../components/editor/models/EditorProps"
import * as React from 'react';
import { ITheme } from "@fluentui/react";

type DomainContext = {
    theme: MergedTheme
}

type MergedTheme = {
    monacoTheme: IEditorTheme;
    setMonacoTheme(monacoTheme: IEditorTheme): void;
    theme: ITheme;
    setTheme(theme: ITheme): void;
    // componentStyles: any;
    // setComponentStyles(componentStyles: any): void;
}

const EditorContext = React.createContext({} as DomainContext);
export { EditorContext as default, DomainContext, MergedTheme };
