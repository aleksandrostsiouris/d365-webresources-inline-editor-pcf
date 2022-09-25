import * as React from 'react';
import { Modal, Spinner, ThemeProvider, SpinnerSize } from '@fluentui/react';
import DomainContext from '../../../context/DomainContext';

export const ModalSpinner = (props: { isOpen: boolean | undefined }) => {
    const context = React.useContext(DomainContext);
    return (
        <React.Fragment>
            <ThemeProvider theme={context.theme.theme}>
                <Modal
                    styles={{
                        main: {
                            boxShadow: "none",
                            display: "flex",
                            overflow: "hidden",
                            backgroundColor: "transparent",
                            width: "40vh",
                            height: "40vh",
                            alignItems: "center",
                            justifyContent: "center"
                        }
                    }}
                    isAlert
                    isBlocking
                    isOpen={props.isOpen}
                    isModeless={false}>
                    <Spinner
                        size={SpinnerSize.large}
                        styles={{
                            root: {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            },
                            circle: {
                                width: "50px",
                                height: "50px",
                                borderWidth: "3px"
                            }
                        }} />
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2em",
                            color: "white"
                        }}>
                        Saving..
                    </div>
                </Modal>
            </ThemeProvider>
        </React.Fragment>
    )
}