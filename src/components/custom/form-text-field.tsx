import { FieldApi } from "@tanstack/react-form"
import { LabelGroup } from "~/components/custom/label-group"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"
import { ConfigurationItem } from "~/types"
import ChildrenInterface from "~/types/children-interface"

export interface FormFieldInterface extends ChildrenInterface {
    field: FieldApi<ConfigurationItem, any, any>
}

export function FormTextField(props: FormFieldInterface) {
    return (
        <LabelGroup>
            {props.children || ''}
            <Input
                value={props.field.state.value}
                onChange={e => props.field.handleChange(e.target.value)}
                onBlur={props.field.handleBlur}
                className={cn(props.field.state.meta.errors.length && 'border-red-500 !ring-0')}
            />
            {Boolean(props.field.state.meta.errors.length) && <span className="text-red-500 text-xs">
                {props.field.state.meta.errors.join(', ')}
            </span>}
        </LabelGroup>
    )
}