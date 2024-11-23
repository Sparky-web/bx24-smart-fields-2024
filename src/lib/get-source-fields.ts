import { B24Frame } from "@bitrix24/b24jssdk";
import { DataSource, DataSourceType } from "~/types";

export default async function getSourceFields(bx24: B24Frame, source: DataSource) {
    if(!source.id) return []

    const splat = source.id.split('.')

    const type = splat[0] as DataSourceType
    console.log(type)

    if(type === 'item') {
        const data = await bx24.callMethod('crm.item.fields', {
            entityTypeId: splat[1],
        }).then(res => res.getData())

        return Object.entries(data.result.fields).map(([field, value]: any) => ({
            label: value.title,
            value: field,
        }))
    }

    if(type === 'list') {
        const data = await bx24.callMethod('lists.field.get', {
            IBLOCK_TYPE_ID: splat[1],
            IBLOCK_ID: splat[2],
        }).then(res => res.getData())
        return Object.entries(data.result).map(([_, field]: any) => ({
            label: field.NAME,
            value: field.FIELD_ID
        }))
    }

    else return []

    // if(type === 'status') {
    //     const data = await bx24.callMethod('crm.status.fields', {

    // }

}