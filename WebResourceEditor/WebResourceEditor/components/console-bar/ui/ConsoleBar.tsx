import {
    CheckboxVisibility, DetailsList,
    IColumn, IDetailsHeaderProps,
    IRenderFunction, mergeStyleSets,
    ScrollablePane, ScrollbarVisibility,
    Sticky, StickyPositionType, ThemeProvider
} from '@fluentui/react';
import * as React from 'react';
import DomainContext from '../../../context/DomainContext';
import { lightTheme } from '../../../themes/editor-theme';
import { IConsoleBarProps, IMarker } from '../models/IConsoleBarProps';

export const ConsoleBar = (props: IConsoleBarProps): JSX.Element => {
    const errorId = React.useRef<number>(0);
    const context = React.useContext(DomainContext);
    const _items = props.markers?.map((marker: IMarker | undefined) => {
        if (!marker || !marker.message) return;
        return {
            key: `ErrorMessage-${errorId.current++}`,
            error: `Line ${marker.startLineNumber}: ${marker.message}`
        }
    })

    const _columns: IColumn[] = [{
        key: "errors",
        name: `Errors (${props.markers?.length})`,
        minWidth: 300,
        maxWidth: 300,
        isResizable: true,
        fieldName: "error"
    }];

    const classNames = mergeStyleSets({
        wrapper: {
            height: "inherit",
            position: "relative",
            backgroundColor: context.theme.theme === lightTheme ? "white" : "black",
        }
    });

    const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, defaultRender) => {
        if (!props) return null;
        return (
            <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
                {defaultRender!({
                    ...props,
                    styles: {
                        root: {
                            padding: 0,
                        }
                    },
                })}
            </Sticky>
        );
    };

    return (
        <React.Fragment>
            <ScrollablePane
                scrollbarVisibility={ScrollbarVisibility.auto}
                className={classNames.wrapper}>
                <ThemeProvider theme={context.theme.theme}>
                    <DetailsList
                        compact
                        items={_items}
                        columns={_columns}
                        checkboxVisibility={CheckboxVisibility.hidden}
                        onRenderDetailsHeader={onRenderDetailsHeader}
                    />
                </ThemeProvider>
            </ScrollablePane>
        </React.Fragment >
    )
}
