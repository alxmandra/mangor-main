import { Injectable, ViewContainerRef } from '@angular/core';

import { MangorDialogComponent } from './dialog.component';

@Injectable({ providedIn: 'any' })
export class ModalService {
    vcRef!: ViewContainerRef;
    constructor() {

    }
    private modals: MangorDialogComponent[] = [];

    add(modal: MangorDialogComponent) {
        // ensure component has a unique id attribute
        if (!modal.id) {
            throw new Error('modal must have a unique id attribute');
        }
        if (!this.modals.find(x => x.id === modal.id)) {
            // add modal to array of active modals
            this.modals.push(modal);
        }


    }

    remove(modal: MangorDialogComponent) {
        // remove modal from array of active modals
        this.modals = this.modals.filter(x => x === modal);
    }

    open(id: string, modalConfig:any) {
        // open modal specified by id
        let modal = this.modals.find(x => x.id === id);

        if (!modal) {
            const component = this.vcRef.createComponent(MangorDialogComponent);
            component.instance.id = id;
            component.instance.bodyText = modalConfig.bodyText;
            component.instance.header = modalConfig.header
            modal = component.instance;
        }

        modal.open();
    }

    close() {
        // close the modal that is currently open
        const modal = this.modals.find(x => x.isOpen);
        modal?.close();
    }
}