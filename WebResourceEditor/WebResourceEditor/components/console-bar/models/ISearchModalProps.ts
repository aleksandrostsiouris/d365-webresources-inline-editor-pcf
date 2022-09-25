import * as React from 'react';

export interface ISearchModalProps {
    modalState: { isModalOpen: boolean, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }
    webApi: ComponentFramework.WebApi;
    selectionState: {
        selection: {
            fileName: string;
            language: string;
            content: string;
        } | undefined,
        setSelection: React.Dispatch<React.SetStateAction<{
            fileName: string;
            language: string;
            content: string;
            webresourceid: string
        } | undefined>>
    }
}