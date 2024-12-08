import { B24Frame } from "@bitrix24/b24jssdk";
import { ConfigurationItem } from "~/types";

export default async function getConfigurationItems(bx24: B24Frame) {
    const options = await bx24.callMethod('app.option.get').then(r => r.getData());

    return (options.result.fields  || []) as ConfigurationItem[]
}