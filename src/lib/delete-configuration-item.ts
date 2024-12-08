import { B24Frame } from "@bitrix24/b24jssdk";
import { toast } from "sonner";

export default async function deleteConfigurationItem(bx24: B24Frame, fieldId: string) {
    const { result } = await bx24.callMethod('app.option.get').then(r => r.getData())

    const fields = result.fields || []

    const index = fields.findIndex((f: any) => f.id === fieldId)

    if (index === -1) {
        throw new Error('Поле не найдено')
    }
    
    const [found] = await bx24.callMethod(`crm.${fields[index].placement}.userfield.list`, {
        filter: {
            FIELD_NAME: "UF_CRM_" + fieldId
        }
    }).then(r => r.getData()).then(r => r.result)

    if(found) await bx24.callMethod(`crm.${fields[index].placement}.userfield.delete`, {
        id: found['ID']
    })

    if(!found) toast.warning('Поле не найдено во месте встраивания, удаление только из списка')

    fields.splice(index, 1)

    await bx24.callMethod('app.option.set', {
        ...result,
        fields
    })
}

