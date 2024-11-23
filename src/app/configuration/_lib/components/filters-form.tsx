import { FormApi, ReactFormApi, useField } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { Plus, XIcon } from "lucide-react";
import { useBitrix } from "~/app/_lib/context/bx24";
import Card from "~/components/custom/card";
import { FormSelectField } from "~/components/custom/form-select-field";
import { FormTextField } from "~/components/custom/form-text-field";
import { Label, LabelGroup } from "~/components/custom/label-group";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { H4 } from "~/components/ui/typography";
import getFields from "~/lib/get-placement-fields";
import getSourceFields from "~/lib/get-source-fields";
import { ConfigurationItem } from "~/types";

export default function FiltersForm(props: {
    form: FormApi<ConfigurationItem, undefined> & ReactFormApi<ConfigurationItem>
}) {
    const { form } = props

    const placementField = useField<ConfigurationItem, 'placement'>({
        name: 'placement',
        form
    })

    const sourceField = useField<ConfigurationItem, 'source'>({
        name: 'source',
        form
    })

    const bx24 = useBitrix()

    const placementFields = useQuery({ queryKey: ['placementFields', placementField.state.value], queryFn: () => getFields(bx24, placementField.state.value) })
    const sourceFields = useQuery({ queryKey: ['sourceFields', sourceField.state.value.id], queryFn: () => getSourceFields(bx24, sourceField.state.value) })

    return (
        <div className="grid gap-6 mt-2">
            <form.Field name="source.enableFilters">
                {field => (
                    <div className="flex items-center content-center gap-2">
                        <Checkbox id="filters" checked={field.state.value} onCheckedChange={e => field.handleChange(!field.state.value)} />
                        <label
                            htmlFor="filters"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-0.5"
                        >
                            Включить фильтры
                        </label>
                    </div>
                )}
            </form.Field>

            <form.Subscribe selector={value => value.values.source.enableFilters}>
                {(value) => value && (
                    <form.Field name="source.filters">
                        {field => (
                            <div className="grid gap-3">
                                <H4>Фильтры</H4>
                                {field.state.value.map((filter, index) => (
                                    <Card className="bg-slate-50 flex justify-between items-center gap-2 p-4" key={index}>
                                        <div className="grid grid-cols-3 gap-4 flex-1">
                                            <form.Field name={`source.filters[${index}].sourceField`}>
                                                {field => (
                                                    <LabelGroup>
                                                        <Label>Поле из источника</Label>
                                                        <FormSelectField field={field}
                                                            options={sourceFields.data || []} />
                                                    </LabelGroup>
                                                )}
                                            </form.Field>

                                            <form.Field name={`source.filters[${index}].type`}>
                                                {field => (
                                                    <LabelGroup>
                                                        <Label>Тип фильтра</Label>
                                                        <FormSelectField field={field} options={[{ value: 'static', label: 'Статический' }, { value: 'dynamic', label: 'Относительно другого поля' }]} />
                                                    </LabelGroup>
                                                )}
                                            </form.Field>


                                            {filter.type === 'static' && (
                                                <form.Field name={`source.filters[${index}].value`}>
                                                    {field => (
                                                        <LabelGroup>
                                                            <Label>Значение</Label>
                                                            <FormTextField field={field} />
                                                        </LabelGroup>
                                                    )}
                                                </form.Field>
                                            )}
                                            {filter.type === 'dynamic' && (
                                                <form.Field name={`source.filters[${index}].source.connectOnField`}>
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

                                <Button className="max-w-[300px]" variant={'secondary'} onClick={() => field.pushValue({ type: 'static', value: '', sourceField: '' })}> 
                                    <Plus />
                                    Добавить фильтр
                                </Button>
                            </div>
                        )}
                    </form.Field>
                )}
            </form.Subscribe>
        </div >

    )
}