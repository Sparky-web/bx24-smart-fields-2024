import { B24Frame } from "@bitrix24/b24jssdk";
import { ConfigurationItem } from "~/types";

export default async function editConfigurationItem(bx24: B24Frame, fieldConfiguration: ConfigurationItem) {
    const options = await bx24.callMethod('app.option.get').then(r => r.getData())

    const id = fieldConfiguration.id

    if (!id) throw new Error('Не указан id поля')

    const foundIndex = options.result.fields.findIndex((f: any) => f.id === id)

    if (foundIndex === -1) throw new Error('Поле с таким id не найдено')
    // return

    options.result.fields[foundIndex] = fieldConfiguration

    const result = {
        // ...options.result,
        fields: options.result.fields
    }

    await bx24.callMethod('app.option.set', result)
}