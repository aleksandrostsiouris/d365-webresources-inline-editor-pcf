import * as React from 'react';
import Editor, { Monaco, OnMount, OnValidate, useMonaco, OnChange } from '@monaco-editor/react';
import { IEditorProps, IEditorTheme } from '../models/EditorProps';
import * as _ from 'lodash';
import {
    CommandBar, ICommandBarItemProps, Stack,
    IContextualMenuItem, ITheme, ThemeProvider
} from '@fluentui/react';
import { ConsoleBar } from '../../console-bar/ui/ConsoleBar';
import { IMarker } from '../../console-bar/models/IConsoleBarProps';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { WebResource } from '../../../services/query-repository/IWebResoure';
import { IQueryRepository, QueryRepository } from '../../../services/query-repository/QueryRepository';
import { SearchModal } from '../../console-bar/ui/SearchModal';
import { QueryClient, QueryClientProvider } from 'react-query';
import EditorContext, { DomainContext } from '../../../context/DomainContext';
import { darkTheme, lightTheme } from '../../../themes/editor-theme';
import { ModalSpinner } from '../../spinner/ui/ModalSpinner';

export const WebResourceEditor = (props: IEditorProps): JSX.Element => {
    const _queryClient = new QueryClient();
    const _queryRepo: IQueryRepository<WebResource> = new QueryRepository<WebResource>(props.context.webAPI);
    const monaco = useMonaco();
    const [markers, setMarkers] = React.useState<IMarker[]>([]);
    const editorRef = React.useRef<any>();
    const [selection, setSelection] = React.useState<{ fileName: string, language: string, content: string, webresourceid: string }>();

    const [codeValue, setCodeValue] = React.useState<string | undefined>("");
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [monacoTheme, setMonacoTheme] = React.useState<IEditorTheme>(props.theme ?? IEditorTheme.Light);
    const [theme, setTheme] = React.useState<ITheme>(monacoTheme == IEditorTheme.Light ? lightTheme : darkTheme);
    const [spin, setSpin] = React.useState<boolean | undefined>();
    const [query, setExecuteQuery] = React.useState<boolean | undefined>();
    const [codeOnEditor, setCodeOnEditor] = React.useState<string | undefined>();

    React.useEffect(() => {
        if (!query) return;
        const exec = async () => {
            setSpin(true);
            _queryRepo.BuildRepository("webresource", selection?.webresourceid!, { content: window.btoa(codeValue!) });
            await _queryRepo.Patch().then(() => setSpin(false));
        }
        exec();
    }, [query])

    React.useMemo(() => {
        if (!selection?.content) return;
        const decoded = window.atob(selection?.content).replace("ï»¿", "");
        setCodeValue(decoded);
        setCodeOnEditor(decoded);
    }, [selection?.content]);

    React.useEffect(() => {
        if (monaco) console.log("Monaco editor instantiated");
    }, [monaco]);

    const _onClickOpenFile = React.useCallback(
        (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined, item?: IContextualMenuItem | undefined) => {
            setIsModalOpen((prev) => { return !prev });
        }, []);

    const onValidate: OnValidate = React.useCallback((markers) => {
        setMarkers(markers as IMarker[]);
    }, [])

    const onMount: OnMount = React.useCallback((editor: any, monaco: Monaco) => {
        editorRef.current = editor;
        window.document.addEventListener('keydown', (e: any) => {
            if (e.key === 's' && e.ctrlKey === true) {
                editorRef.current.getAction("editor.action.formatDocument").run();
            }
        });
        window.addEventListener('resize', () => editorRef.current.layout());
    }, []);

    const _items: ICommandBarItemProps[] = [
        {
            key: 'theme',
            iconProps: { iconName: "Light" },
            onClick: () => {
                setMonacoTheme((prev) => prev == IEditorTheme.Light ? IEditorTheme.Dark : IEditorTheme.Light);
                setTheme((prev) => prev == lightTheme ? darkTheme : lightTheme);
            }
        },
        {
            key: "openFile",
            text: "Open",
            iconProps: { iconName: "OpenFolderHorizontal" },
            onClick: _onClickOpenFile,

        },
        {
            key: 'clear',
            text: 'Clear',
            iconProps: { iconName: 'Trash' },
            onClick: () => editorRef.current.setValue("")
        },
        {
            key: 'comment',
            text: 'Comment',
            iconProps: { iconName: "Comment" },
            onClick: () => editorRef.current.getAction("editor.action.commentLine").run()
        },
        {
            key: 'prettify',
            text: 'Prettify',
            iconProps: { iconName: "Code" },
            onClick: () => editorRef.current.getAction("editor.action.formatDocument").run()
        },
        {
            key: 'search',
            text: 'Search',
            iconProps: { iconName: "Search" },
            onClick: () => editorRef.current.getAction("actions.find").run()
        },
        {
            key: 'save',
            text: 'Save',
            disabled: !selection?.webresourceid || codeValue === "" || codeOnEditor!.replace(/(\r\n|\n|\r)/g, "").trim() === codeValue!.replace(/(\r\n|\n|\r)/g, "").trim(),
            iconProps: { iconName: "Save" },
            onClick: () => setExecuteQuery(true)
        },
    ];
    debugger;
    const contextInitial: DomainContext = {
        theme: {
            monacoTheme: monacoTheme,
            setMonacoTheme: setMonacoTheme,
            theme: theme,
            setTheme: setTheme,
        },
    }

    return (
        <React.Fragment>
            <EditorContext.Provider value={contextInitial}>
                <Stack>
                    <Stack.Item
                        grow
                        align="stretch"
                        style={{
                            height: `calc(100 % - 60vh)`,
                        }}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: "80%" }}>
                                <ThemeProvider theme={theme}>
                                    <CommandBar
                                        items={_items}
                                        farItems={[]} />
                                    <ModalSpinner isOpen={spin} />
                                </ThemeProvider>
                            </div>
                            <div style={{ flex: "20%", backgroundColor: theme == lightTheme ? "inherit" : "black" }}>
                                <div style={{ fontWeight: "bold", float: "right", alignContent: "center", alignItems: "center", paddingTop: "5px" }}>
                                    {selection?.fileName}
                                </div>
                            </div>
                            <React.Fragment>
                                <QueryClientProvider client={_queryClient}>
                                    <SearchModal
                                        selectionState={{ selection, setSelection }}
                                        modalState={{ isModalOpen, setIsModalOpen }}
                                        webApi={props.context.webAPI} />
                                </QueryClientProvider>
                            </React.Fragment>
                        </div>
                        <Editor
                            onChange={(value: string | undefined, ev: monaco.editor.IModelContentChangedEvent) => {
                                setCodeOnEditor(value);
                            }}
                            language={selection?.language ?? "typescript"}
                            value={codeValue}
                            height="50vh"
                            onValidate={onValidate}
                            onMount={onMount}
                            theme={monacoTheme}
                            options={{
                                padding: { "top": 10 },
                                scrollbar: {
                                    verticalScrollbarSize: 6
                                },
                                automaticLayout: true,
                                formatOnPaste: true,
                                // autoIndent: "full"
                            }}
                        />
                    </Stack.Item>
                    <Stack.Item
                        style={{ height: `15vh` }}>
                        <ConsoleBar markers={markers} />
                    </Stack.Item>
                </Stack>
            </EditorContext.Provider>
        </React.Fragment>
    )
}