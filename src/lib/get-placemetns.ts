import { B24Frame } from "@bitrix24/b24jssdk";
import { DataSourceSelectable } from "./get-sources";

export const defaultEntities = [
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
]

export default async function getPlacements(bx24: B24Frame) {


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

    return result
}
