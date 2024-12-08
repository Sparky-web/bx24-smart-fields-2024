'use client'

import { useForm } from "@tanstack/react-form";
import { Loader, Pencil, Plus } from "lucide-react";
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
import { formSchema } from "./configuration-item-create";
import editConfigurationItem from "~/lib/edit-configuration-item";



export default function ConfigurationItemEdit({ field }: { field: ConfigurationItem }) {
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false)

    const bx24 = useBitrix()
    const form = useForm<ConfigurationItem>({
        // validatorAdapter: zodValidator(),
        defaultValues: field,
        validatorAdapter: zodValidator(),
        validators: {
            onChange: formSchema
        },
        onSubmit: async ({ value }) => {
            // Do something with form data
            try {
                await editConfigurationItem(bx24, value)
                queryClient.invalidateQueries(['fields'])
                setOpen(false)
                toast.success('Поле успешно обновлено')
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
                <Button className="max-w-fit" variant={'secondary'}>
                    <Pencil />
                    Редактировать
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl">
                <DialogTitle>{field.title}</DialogTitle>
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