'use client'
import { FieldApi, FormApi, ReactFormApi } from "@tanstack/react-form";
import { ConfigurationItem, Placement } from "~/types";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";

import { Label, LabelGroup } from "~/components/custom/label-group";
import { FormTextField } from "~/components/custom/form-text-field";
import { FormSelectField } from "~/components/custom/form-select-field";
import { useEffect } from "react";
import { useBitrix } from "~/app/_lib/context/bx24";
import getSources from "~/lib/get-sources";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "~/components/ui/checkbox";
import FiltersForm from "./filters-form";

interface FieldFormProps {
    form: FormApi<ConfigurationItem, undefined> & ReactFormApi<ConfigurationItem>
}

const placemetns = [
    { value: 'lead', label: 'Лиды' },
    { value: 'deal', label: 'Сделка' },
    { value: 'contact', label: 'Контакты' },
    { value: 'company', label: 'Компания' }
]

export default function ConfigurationItemForm(props: FieldFormProps) {
    const { form } = props

    const bx24 = useBitrix()

    const { data, isPending } = useQuery({ queryKey: ['sources'], queryFn: () => getSources(bx24) })

    useEffect(() => {
        getSources(bx24)
    }, [])

    if (!data) return <div>Загрузка...</div>


    return (
        <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4 content-start items-start">
                <form.Field name="placement">
                    {field => (
                        <FormSelectField field={field} options={placemetns}>
                            <Label>Куда вставить поле</Label>
                        </FormSelectField>
                    )}
                </form.Field>

                <form.Field name="title">
                    {field => (
                        <FormTextField field={field}>
                            <Label>Название</Label>
                        </FormTextField>
                    )}
                </form.Field>

                <form.Field name="source.id">
                    {field => (
                        <div className="span-2">
                            <FormSelectField field={field} options={data}>
                                <Label>Источник данных</Label>
                            </FormSelectField>
                        </div>
                    )}
                </form.Field>
            </div>
            <FiltersForm form={form} />
        </div>
    )
}


