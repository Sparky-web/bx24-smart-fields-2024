import { B24Frame } from "@bitrix24/b24jssdk";
import { ConfigurationItem } from "~/types";
import { translitToEnglish } from "./translit";
import getPlacementFields from "./get-placement-fields";

const defaultEntities = [
    { value: 1, label: 'lead' },
    { value: 2, label: 'deal' },
    { value: 3, label: 'contact' },
    { value: 4, label: 'company' },
]

export default async function createConfigurationItem(bx24: B24Frame, fieldConfiguration: ConfigurationItem) {
    const options = await bx24.callMethod('app.option.get').then(r => r.getData())

    const id = translitToEnglish(fieldConfiguration.title)

    if (options.result.fields && options.result.fields.find((f: any) => f.id === id)) {
        throw new Error('Поле с таким названием уже существует')
    }
    // return


    const currentUserFields = await bx24.callMethod("userfieldtype.list").then(r => r.getData()).then(r => r.result)

    const isNew = !currentUserFields.find(e => e.USER_TYPE_ID === "smart_field_2024")

    if (isNew) {
        await bx24.callMethod(`userfieldtype.add`, {
            USER_TYPE_ID: "smart_field_2024",
            HANDLER: window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/') + '/handler.html',
            TITLE: "Умные поля с фильтром",
            DESCRIPTION: 'Создано при помощи приложения SmartFields',
            OPTIONS: { height: 17 }
        })
    }

    const data = await getPlacementFields(bx24, fieldConfiguration.placement)

    const foundField = data.find(e => e.label === fieldConfiguration.title)

    const fieldId = +fieldConfiguration.placement.split('.')[1]

    const defaultEntity = defaultEntities.find(e => e.value === fieldId)?.label

    if (!foundField && defaultEntity) {
        await bx24.callMethod(`crm.${defaultEntity}.userfield.add`, {
            USER_TYPE_ID: "smart_field_2024",
            FIELD_NAME: id,
            LIST_COLUMN_LABEL: fieldConfiguration.title,
            EDIT_FORM_LABEL: fieldConfiguration.title,
        })
    }
    else if (!foundField) {
        await bx24.callMethod(`userfieldconfig.add`, {
            moduleId: 'crm',
            field: {
                entityId: 'CRM_' + fieldId,
                fieldName: "UF_CRM_" + id,
                userTypeId: 'smart_field_2024',
            }
        })
    }



    // const currentTypeFields = await bx24.callMethod(`crm.${data.whereToPlace}.userfield.list`, {filter: {FIELD_NAME: "UF_CRM_" + data.fieldId}})

    const result = {
        // ...options.result,
        fields: [
            ...(options.result.fields || []),
            {
                ...fieldConfiguration,
                id,
            }
        ]
    }

    await bx24.callMethod('app.option.set', result)
}