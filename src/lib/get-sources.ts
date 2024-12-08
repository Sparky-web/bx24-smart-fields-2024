import { B24Frame } from "@bitrix24/b24jssdk";
import { DataSourceType } from "~/types";

type DataSourceBase = {
    value: string
    label: string
}

export type DataSourceSelectable = DataSourceBase | {
    label: string
    values: DataSourceBase[]
}

const defaultEntities: DataSourceBase[] = [
    {
        value: 'item.1',
        label: 'Лиды'
    },
    {
        value: 'item.2',
        label: 'Сделки'
    },
    {
        value: 'item.3',
        label: 'Контакты'
    },
    {
        value: 'item.4',
        label: 'Компании'
    },
    {
        value: 'item.7',
        label: 'Предложения'
    },
    {
        value: 'item.31',
        label: 'Счета'
    }
]

export default async function getSources(bx24: B24Frame) {
    const result: DataSourceSelectable[] = [{
        label: 'Стандартные',
        values: [
            ...defaultEntities
        ]
    }]

    const data = await bx24.callMethod('crm.type.list').then(r => r.getData())
    result.push(
        {
            label: 'Смарт-процессы',
            values: data.result.types.map((item: any) => ({
                value: `item.${item.entityTypeId}`,
                label: item.title
            }))
        }
    )

    const data2 = await bx24.callMethod('lists.get', {
        IBLOCK_TYPE_ID: 'lists'
    }).then(r => r.getData())

    result.push(
        {
            label: 'Списки',
            values: data2.result.map((item: any) => ({
                value: `list.lists.${item.ID}`,
                label: item.NAME
            }))
        }
    )

    const data3 = await bx24.callMethod('lists.get', {
        IBLOCK_TYPE_ID: 'bitrix_processes'
    }).then(r => r.getData())

    result.push(
        {
            label: 'Процессы',
            values: data3.result.map((item: any) => ({
                value: `list.bitrix_processes.${item.ID}`,
                label: item.NAME
            }))
        }
    )

    // const data4 = await bx24.callMethod('sonet_group.get', {
    //     IS_ADMIN: 'Y'
    // }).then(r => r.getData())



    const data5 = await bx24.callMethod('crm.status.entity.types').then(r => r.getData())
    result.push(
        {
            label: 'Справочники',
            values: data5.result.map((item: any) => ({
                value: `status.${item.ID}`,
                label: item.NAME
            }))
        }
    )

    result.push({
        label: 'Группы',
        values: [
            {
                label: 'Группы',
                value: 'sonet_group',
            }
        ]
    })

    return result
}