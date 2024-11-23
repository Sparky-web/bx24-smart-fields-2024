'use client'

import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { ConfigurationItem } from "~/types";
import FieldForm from "./configuration-item-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "~/lib/zod";
import { FormEvent } from "react";

const formSchema = z.object({
    title: z.string().min(5),
})


export default function CreateFieldDialog() {
    const form = useForm<ConfigurationItem>({
        // validatorAdapter: zodValidator(),
        defaultValues: {
            title: '',
            id: '',
            placement: 'company',
            isMultiselect: false,
            source: {
                id: '',
                label: '',
                filters: [],
                enableFilters: false
            }
        },
        validatorAdapter: zodValidator(),
        validators: {
            onChange: formSchema
        },
        onSubmit: async ({ value }) => {
            // Do something with form data
            console.log(value)
        },
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        form.handleSubmit()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="max-w-fit">
                    <Plus />
                    Добавить поле
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl">
                <DialogTitle>Новое поле</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <FieldForm form={form} />
                    <Button type="submit" className="mt-6">Создать</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}