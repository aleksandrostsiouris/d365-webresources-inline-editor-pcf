export interface IConsoleBarProps {
    markers: Array<IMarker>;
}

export interface IMarker {
    code: string | undefined;
    endColumn: number | undefined;
    endLineNumber: number | undefined;
    message: string | undefined;
    owner: string | undefined;
    relatedInformation: string | undefined;
    severity: number | undefined;
    startColumn: number | undefined;
    startLineNumber: number | undefined;
}