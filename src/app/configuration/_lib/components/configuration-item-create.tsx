'use client'

import { useForm } from "@tanstack/react-form";
import { Loader, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { ConfigurationItem } from "~/types";
import FieldForm from "./configuration-item-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "~/lib/zod";
import { FormEvent, useState } from "react";
import createConfigurationItem from "~/lib/create-configuration-item";
import { useBitrix } from "~/app/_lib/context/bx24";
import { P } from "~/components/ui/typography";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const formSchema = z.object({
    title: z.string().min(5),
    placement: z.string().min(1, 'Обязательно для заполнения'),
    source: z.object({
        id: z.string().min(1, 'Обязательно для заполнения'),
        // label: z.string().min(1, 'Обязательно для заполнения'),
        filters: z.array(z.record(z.any())).optional(),
        enableFilters: z.boolean(),
    })
})


export default function CreateFieldDialog() {
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false)

    const bx24 = useBitrix()
    const form = useForm<ConfigurationItem>({
        // validatorAdapter: zodValidator(),
        defaultValues: {
            title: '',
            id: '',
            placement: 'item.1',
            isMultiselect: false,
            source: {
                id: '',
                label: '',
                filters: [],
                enableFilters: false,
                grouping: {
                    enabled: false,
                    groups: []
                },
                sorting: {
                    enabled: false,
                    sortBy: {
                        sourceField: '',
                        type: 'asc'
                    }
                },
                loadFull: false
            }
        },
        validatorAdapter: zodValidator(),
        validators: {
            onChange: formSchema
        },
        onSubmit: async ({ value }) => {
            // Do something with form data
            try {
                console.log(value)
                await createConfigurationItem(bx24, value)
                queryClient.invalidateQueries(['fields'])
                setOpen(false)
                toast.success('Поле успешно создано')
                form.reset()
            } catch (e) {
                toast.error('Ошибка создания поля: ' + e.message)
                console.error(e)
            }

        },
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        form.handleSubmit()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="max-w-fit">
                    <Plus />
                    Добавить поле
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl">
                <DialogTitle>Новое поле</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <FieldForm form={form} />

                    <form.Subscribe selector={value => [value.canSubmit, value.isSubmitting]}>
                        {([canSubmit, isSubmitting]) => (
                            <Button type="submit" className="mt-6" disabled={!canSubmit} >
                                {isSubmitting && <Loader className="animate-spin h-5 w-5" />}
                                Сохранить
                            </Button>
                        )}
                    </form.Subscribe>
                </form>
            </DialogContent>
        </Dialog>
    )
}