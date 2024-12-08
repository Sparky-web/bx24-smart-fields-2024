'use client'

import { Loader, Plus, XIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { H1, H2, H3, P } from "~/components/ui/typography";
import CreateFieldDialog from "./_lib/components/configuration-item-create";
import { useBitrix } from "../_lib/context/bx24";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import getConfigurationItems from "~/lib/get-configuration-items";
import Card from "~/components/custom/card";
import deleteConfigurationItem from "~/lib/delete-configuration-item";
import { toast } from "sonner";
import ConfigurationItemCard from "./_lib/components/configuration-item-card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import { Suspense } from "react";


export default function Page() {
    const bx24 = useBitrix()
    const { data: fields, isPending, error } = useSuspenseQuery({ queryKey: ['fields'], queryFn: () => getConfigurationItems(bx24) })

    if (fields) console.log(fields)

    return (
        <div className="container py-6 grid gap-6">
            <H2>Умные поля</H2>

            {isPending && <div className="flex items-center justify-center gap-2">
                <Loader className="animate-spin" />
                Загрузка полей...
            </div>}

            {error &&
                <Card className="bg-red-50 text-red-500 text-sm">
                    Ошибка загрузки полей: {error.message}
                </Card>
            }


            <Suspense fallback={<div className="flex items-center justify-center gap-2">
                <Loader className="animate-spin" />
                Загрузка полей...
            </div>}>
                {fields && fields.length > 0 && <div className="grid gap-6">
                    {fields.map(field => (
                        <ConfigurationItemCard key={field.id} field={field} />
                    ))}
                </div>}
            </Suspense>

            <CreateFieldDialog />
        </div>
    )
}