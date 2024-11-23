import { B24Frame } from "@bitrix24/b24jssdk";
import { ConfigurationItem } from "~/types";

export default async function createField(bx24: B24Frame, fieldConfiguration: ConfigurationItem) {
    const options = await bx24.callMethod('app.option.get').then(r => r.getData())
    console.log(options.result)

    // await bx24.callMethod('app.option.set')
}