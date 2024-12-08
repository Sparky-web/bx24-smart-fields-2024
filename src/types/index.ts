export interface ConfigurationItem {
    title: string;
    id: string;
    placement: Placement;
    isMultiselect: boolean;
    source: DataSource;
}

export type DataSourceType = 'item' | 'list' | 'sonet_group' | 'status'

export type DataSourceBase = {
    id: `list.${'bitrix_processes' | 'lists'}.${string}` | `${DataSourceType}.${string}` | ''
    label: string

}

type FilterBase = {
    sourceField: string;
    operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "%" | "!%"
}

export type Filter = FilterBase & ({
    type: 'static'
    value: string
} | {
    type: 'dynamic'
    connectOnField: string
})

export type DataSource = {
    enableFilters: Boolean
    filters: Filter[]
    grouping: {
        enabled: boolean
        groups: ({
            title: string
        } & Filter)[]
    },
    sorting: {
        enabled: boolean
        sortBy: {
            sourceField: string
            type: 'asc' | 'desc'
        }
    },
    loadFull: boolean
} & DataSourceBase

export type Placement = `item.${number}` 

