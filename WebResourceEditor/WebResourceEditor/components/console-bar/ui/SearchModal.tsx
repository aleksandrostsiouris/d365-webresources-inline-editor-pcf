import {
    CheckboxVisibility, DetailsRow, IColumn, IDetailsRowBaseProps,
    IDetailsRowProps, mergeStyleSets, MessageBar, Modal, SearchBox,
    Shimmer, ShimmeredDetailsList, TooltipHost, ThemeProvider
} from '@fluentui/react';
import * as React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { IWebResource } from '../../../services/query-repository/IWebResoure';
import { IQueryRepository, QueryRepository } from '../../../services/query-repository/QueryRepository';
import { ISearchModalProps } from '../models/ISearchModalProps';
import { IWebResourceItem, WebResourceItem } from '../models/WebResourceItem';
import { convertToLanguage } from '../helpers/console-bar-helpers';
import DomainContext from '../../../context/DomainContext';
import { lightTheme } from '../../../themes/editor-theme';
//import { ReactQueryDevtools } from 'react-query/devtools'

export const SearchModal = (props: ISearchModalProps) => {
    const _queryRepo: IQueryRepository<IWebResource> = new QueryRepository<IWebResource>(props.webApi);
    const [queryItem, setQueryItem] = React.useState<string | undefined>();
    const [showRefetchAlert, setShowRefetchAlert] = React.useState<boolean>(false);
    const context = React.useContext(DomainContext);

    const { data, isLoading, isFetching, isError, isRefetching } = useQuery(["webResource", { queryItem }], async () => {
        if (!queryItem) return;
        const webresources = await _queryRepo
            .BuildQuery("webresource", `?$filter=contains(displayname, '${queryItem}')`)
            .Get();

        return webresources?.map(x => new WebResourceItem(x));;
    }, {
        // Considered stale after 1 min
        staleTime: 60000,
    });

    React.useEffect(() => {
        if (!isRefetching) return;
        setShowRefetchAlert(true);
    }, [isRefetching]);

    React.useEffect(() => {
        if (!showRefetchAlert) return;
        const timer = setTimeout(() => setShowRefetchAlert(false), 3000);
        return () => clearTimeout(timer);
    }, [showRefetchAlert]);

    const modalStyles = mergeStyleSets({
        container: {
            display: 'flex',
            alignItems: 'center',
            width: "70%",
            height: "90%",
            flexDirection: "column"
        },
        header: [
            {
                flex: 'auto',
                width: "100%",
                display: 'flex',
                alignItems: 'center',
                justifyContent: "center",
                paddingTop: '12px',
            }
        ],
        body: {
            width: "130vh",
            flex: 'auto',
            overflow: 'hidden',
        }
    });

    const onClickOpenModal = React.useCallback(() => {
        props.modalState.setIsModalOpen((prev) => { return !prev });
    }, [props.modalState]);

    const _columns: IColumn[] = [
        {
            key: "fileType",
            name: "File Type",
            fieldName: "fileType",
            minWidth: 30,
            maxWidth: 30,
            isIconOnly: true,
            iconName: "Page",
            onRender: (item: IWebResourceItem) => (
                <TooltipHost>
                    <div style={{ fontWeight: 'bold' }}>
                        {item.fileType}
                    </div>
                </TooltipHost>
            )
        },
        {
            key: "fileName",
            name: "File Name",
            fieldName: "fileName",
            minWidth: 300,
            maxWidth: 350,
            isRowHeader: true,
            isResizable: true,
            onRender: (item: IWebResourceItem) => (
                <TooltipHost content={item.fileName}>
                    {item.fileName}
                </TooltipHost>
            )
        },
        {
            key: "createdOn",
            name: "Created On",
            fieldName: "createdOn",
            minWidth: 100,
            maxWidth: 200,
            isRowHeader: true,
            isResizable: true
        },
        {
            key: "modifiedOn",
            name: "Modified On",
            fieldName: "modifiedOn",
            minWidth: 100,
            maxWidth: 200,
            isRowHeader: true,
            isResizable: true
        },
    ];

    const _onDoubleClickRow = React.useCallback((detailsProps: IDetailsRowProps | undefined) => {
        const selected = detailsProps?.item as IWebResourceItem;
        const filePressed = {
            fileName: selected.fileName,
            language: convertToLanguage(selected.fileType),
            content: selected.content,
            webresourceid: selected.webresourceid
        };

        if (!filePressed) return;
        props.selectionState.setSelection(filePressed);
        onClickOpenModal();
    }, []);

    const _onRenderRow = React.useCallback((props?: IDetailsRowProps, defaultRender?: any) => {
        return (
            isRefetching ?
                <Shimmer /> :
                <div onDoubleClick={() => _onDoubleClickRow(props)}>
                    <DetailsRow {...props as IDetailsRowBaseProps} />
                </div>
        );
    }, []);

    return (
        <React.Fragment>
            <ThemeProvider theme={context.theme.theme}>
                <Modal
                    isOpen={props.modalState.isModalOpen}
                    onDismiss={onClickOpenModal}
                    containerClassName={modalStyles.container}
                >
                    <div className={modalStyles.header}>
                        <SearchBox
                            placeholder='Aye aye captain'
                            defaultValue={props.selectionState.selection?.fileName ?? queryItem}
                            styles={{ root: { width: "50%", marginLeft: "auto", order: "2" } }}
                            onSearch={(newValue: any) => { setQueryItem(newValue); }}
                        />
                    </div>
                    <div className={modalStyles.body}>
                        {
                            showRefetchAlert ?
                                <MessageBar
                                    styles={{
                                        root: {
                                            color: context.theme.theme === lightTheme ? "black" : "white",
                                            backgroundColor: context.theme.theme === lightTheme ? "inherit" : "#7b83eb"
                                        }
                                    }}>
                                    Data re-fetched in the background ⚡
                                </MessageBar> :
                                <></>
                        }
                        {isError ?
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px", textAlign: "center" }}>
                                Something went wrong
                            </div> :
                            <ShimmeredDetailsList
                                enableShimmer={isLoading || isFetching}
                                usePageCache
                                compact
                                onRenderRow={_onRenderRow}
                                items={data ? data : []}
                                columns={_columns}
                                onShouldVirtualize={() => true}
                                checkboxVisibility={CheckboxVisibility.hidden}
                            />
                        }
                    </div>
                    {/* <ReactQueryDevtools position='top-left' /> */}
                </Modal>
            </ThemeProvider>
        </React.Fragment>
    );
}