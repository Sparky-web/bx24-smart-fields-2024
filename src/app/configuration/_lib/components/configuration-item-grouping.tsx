import { FormApi, ReactFormApi, useField } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { XIcon, Plus } from "lucide-react";
import { z } from "zod";
import { useBitrix } from "~/app/_lib/context/bx24";
import Card from "~/components/custom/card";
import { FormSelectField } from "~/components/custom/form-select-field";
import { FormTextField } from "~/components/custom/form-text-field";
import { Label, LabelGroup } from "~/components/custom/label-group";
import { Button } from "~/components/ui/button";
import { H4 } from "~/components/ui/typography";
import getPlacementFields from "~/lib/get-placement-fields";
import getSourceFields from "~/lib/get-source-fields";
import { ConfigurationItem } from "~/types";
import { operators } from "./filters-form";
import { Checkbox } from "~/components/ui/checkbox";

interface ConfigurationItemGroupingProps {
    form: FormApi<ConfigurationItem, undefined> & ReactFormApi<ConfigurationItem>
}

export default function ConfigurationItemGrouping(props: ConfigurationItemGroupingProps) {
    const { form } = props

    const isEnabled = useField<ConfigurationItem, 'source.grouping.enabled'>({
        name: 'source.grouping.enabled',
        form
    })


    const placementField = useField<ConfigurationItem, 'placement'>({
        name: 'placement',
        form
    })

    const sourceField = useField<ConfigurationItem, 'source'>({
        name: 'source',
        form
    })

    const bx24 = useBitrix()

    const placementFields = useQuery({ queryKey: ['placementFields', placementField.state.value], queryFn: () => getPlacementFields(bx24, placementField.state.value) })
    const sourceFields = useQuery({ queryKey: ['sourceFields', sourceField.state.value.id], queryFn: () => getSourceFields(bx24, sourceField.state.value) })


    return (
        <div className="grid gap-6">
            <form.Field name="source.grouping.enabled">
                {field => (
                    <div className="flex items-center content-center gap-2">
                        <Checkbox id="group" checked={field.state.value} onCheckedChange={e => field.handleChange(!field.state.value)} />
                        <label
                            htmlFor="group"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-0.5"
                        >
                            Включить группировку
                        </label>
                    </div>
                )}
            </form.Field>


            {isEnabled.state.value && (
                <form.Field name="source.grouping.groups">
                    {field => (
                        <div className="grid gap-3">
                            <H4>Группы</H4>
                            {field.state.value.map((group, index) => (
                                <Card className="bg-slate-50 flex justify-between items-center gap-2 p-4" key={index}>
                                    <div className="grid grid-cols-3 gap-4 flex-1">
                                        <form.Field name={`source.grouping.groups[${index}].title`}
                                            validators={{
                                                onChange: z.string().min(1, 'Обязательно для заполнения')
                                            }}
                                        >
                                            {field => (
                                                <LabelGroup>
                                                    <Label>Название</Label>
                                                    <FormTextField field={field} />
                                                </LabelGroup>
                                            )}
                                        </form.Field>

                                        <form.Field name={`source.grouping.groups[${index}].sourceField`}
                                            validators={{
                                                onChange: z.string().min(1, 'Обязательно для заполнения')
                                            }}
                                        >
                                            {field => (
                                                <LabelGroup>
                                                    <Label>Поле из источника</Label>
                                                    <FormSelectField field={field}
                                                        options={sourceFields.data || []} />
                                                </LabelGroup>
                                            )}
                                        </form.Field>

                                        <form.Field name={`source.grouping.groups[${index}].type`}>
                                            {field => (
                                                <LabelGroup>
                                                    <Label>Тип группировки</Label>
                                                    <FormSelectField field={field} options={[{ value: 'static', label: 'Статический' }, { value: 'dynamic', label: 'Относительно другого поля' }]} />
                                                </LabelGroup>
                                            )}
                                        </form.Field>

                                        <form.Field name={`source.grouping.groups[${index}].operator`}>
                                            {field => (
                                                <LabelGroup>
                                                    <Label>Оператор</Label>
                                                    <FormSelectField field={field} options={operators} />
                                                </LabelGroup>
                                            )}
                                        </form.Field>

                                        {group.type === 'static' && (
                                            <form.Field name={`source.grouping.groups[${index}].value`}>
                                                {field => (
                                                    <LabelGroup>
                                                        <Label>Значение</Label>
                                                        <FormTextField field={field} />
                                                    </LabelGroup>
                                                )}
                                            </form.Field>
                                        )}

                                        {group.type === 'dynamic' && (
                                            <form.Field name={`source.grouping.groups[${index}].connectOnField`}>
                                                {field => (
                                                    <LabelGroup>
                                                        <Label>Поле из карточки</Label>
                                                        <FormSelectField field={field}
                                                            options={placementFields.data || []} />
                                                    </LabelGroup>
                                                )}
                                            </form.Field>
                                        )}
                                    </div>


                                    <Button variant={'ghost'} className="h-10 w-10" onClick={() => field.removeValue(index)}>
                                        <XIcon />
                                    </Button>
                                </Card>
                            ))}

                            <Button className="max-w-[300px]" variant={'secondary'} onClick={() => field.pushValue({ type: 'static', value: '', sourceField: '', operator: '=', title: '' })}>
                                <Plus />
                                Добавить группу
                            </Button>
                        </div>
                    )}
                </form.Field>
            )}
        </div>
    )
}