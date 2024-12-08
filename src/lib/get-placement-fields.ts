import { B24Frame } from "@bitrix24/b24jssdk";
import { Placement } from "~/types";

export default async function getPlacementFields(bx24: B24Frame, type: Placement) {
    const data = await bx24.callMethod('crm.item.fields', {
        entityTypeId: type.split('.')[1],
    }).then(res => res.getData())

    return Object.entries(data.result.fields).map(([field, value]: any) => ({
        label: value.title,
        value: field,
    }))
}
    