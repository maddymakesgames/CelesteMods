import { modTableColumnCssNames, modTableColumnNames } from "./modsSliceConstants";
import { mods_details_type } from "../../../Imported_Types/prismaClient";
import { sliceStatus, requestStatuses } from "../../../utils/commonTypes";
import { Record } from "mantine-datatable";


export interface modState {
    id: number;
    revision: number;
    type: mods_details_type;
    name: string;
    publisherID: number;
    contentWarning: boolean;
    notes?: string;
    shortDescription: string;
    longDescription?: string;
    gamebananaModID?: number;
    approved: boolean;
    maps: (string | number)[];
    difficulties?: (number | number[])[];
    /*timeSubmitted: number;
    submittedBy: number;
    timeApproved: number;
    approvedBy: number;*/
}

export type modTableItemState = {
    expanded: boolean;
    hidden: boolean;
}

export type mod = {
    modState: modState | modState[],
    modTable: modTableItemState,
}

export type modEntities = {
    [key: number]: mod,
}

export interface modsState {
    status: sliceStatus;
    requests: requestStatuses;
    sortColumn: modTableColumnCssNamesType;
    sortDirection: modTableSortDirection;
    entities: modEntities;
}

export interface setModTableSortColumnAction {
    payload: modTableColumnCssNamesType;
    type: string;
}

export interface setModTableSortDirectionAction {
    payload: modTableSortDirection;
    type: string;
}

export interface toggleModTableItemBoolActions {
    payload: number;
    type: string;
}

export interface setModTableItemBoolActions {
    payload: {
        id: number;
        bool: boolean;
    };
    type: string;
}


export interface modForTable {
    id: number,
    [modTableColumnNames[0].jsName]: string,
    [modTableColumnNames[1].jsName]: number,
    [modTableColumnNames[2].jsName]: string,
    [modTableColumnNames[3].jsName]: {
        [modTableColumnNames[3].entries[0].jsName]: string,
        [modTableColumnNames[3].entries[1].jsName]: string,
    },
    [modTableColumnNames[4].jsName]: string,
    [modTableColumnNames[5].jsName]: string,
    [modTableColumnNames[6].jsName]: string,
}

type test = modTableColumnNamesType[number];

export type modTableColumnNameObjectsType = modTableColumnNameObjectsType__singleEntry | modTableColumnNameObjectsType__nestedEntry;

export interface modTableColumnNameObjectsType__singleEntry {
    headerName: modTableColumnNamesType;
}

export interface modTableColumnNameObjectsType__nestedEntry {
    name: string;
    entries: readonly modTableColumnNameObjectsType__singleEntry[];
}