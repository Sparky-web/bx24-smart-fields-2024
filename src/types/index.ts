export interface ConfigurationItem {
    title: string;
    id: string;
    placement: Placement;
    isMultiselect: boolean;
    source: DataSource
}

export type DataSourceType = 'item' | 'list' | 'sonet_group' | 'status'

export type DataSourceBase = {
    id: `list.${'bitrix_processes' | 'lists'}.${string}` | `${DataSourceType}.${string}` | ''
    label: string
}

export type Filter = {
    sourceField: string
    type: 'static'
    value: string
} | {
    sourceField: string
    type: 'dynamic'
    connectOnField: string
}

export type DataSource = {
    enableFilters: Boolean
    filters: Filter[]
} & DataSourceBase

export type Placement = 'deal' | 'lead' | 'contact' | 'company'

