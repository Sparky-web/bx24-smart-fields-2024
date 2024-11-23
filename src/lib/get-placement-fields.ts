import { B24Frame } from "@bitrix24/b24jssdk";
import { Placement } from "~/types";

enum PlacementId {
    lead = 1,
    deal = 2,
    contact = 3,    
    company = 4
}

export default async function getFields(bx24: B24Frame, type: Placement) {
    const data = await bx24.callMethod('crm.item.fields', {
        entityTypeId: PlacementId[type],
    }).then(res => res.getData())

    return Object.entries(data.result.fields).map(([field, value]: any) => ({
        label: value.title,
        value: field,
    }))
}
    