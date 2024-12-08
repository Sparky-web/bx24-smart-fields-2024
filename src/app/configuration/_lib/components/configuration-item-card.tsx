import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Loader, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useBitrix } from "~/app/_lib/context/bx24";
import Card from "~/components/custom/card";
import { Button } from "~/components/ui/button";
import { H3 } from "~/components/ui/typography";
import deleteConfigurationItem from "~/lib/delete-configuration-item";
import { ConfigurationItem } from "~/types";
import ConfigurationItemEdit from "./configuration-item-edit";
import getPlacements from "~/lib/get-placemetns";
import getSources from "~/lib/get-sources";

interface ConfigurationItemCardProps {
    field: ConfigurationItem
}

enum Placement {
    lead = 'Лиды',
    deal = 'Сделка',
    contact = 'Контакты',
    company = 'Компания'
}

export default function ConfigurationItemCard({ field }: ConfigurationItemCardProps) {
    const bx24 = useBitrix()

    const queryClient = useQueryClient();

    const { mutateAsync: handleDeleteField, isPending: isDeleting } = useMutation({
        mutationFn: async (fieldId: string) => {
            await deleteConfigurationItem(bx24, fieldId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['fields'])
        },
        onError: (e) => {
            console.error(e)
            toast.error('Ошибка удаления поля: ' + e.message)
        }
    })
    
    const placements = useSuspenseQuery({ queryKey: ['placements'], queryFn: () => getPlacements(bx24) })
    const sources = useSuspenseQuery({ queryKey: ['sources'], queryFn: () => getSources(bx24) })

    return (
        <Card className="bg-slate-50 grid items-center gap-4 p-4">
            <div className="flex-1">
                <H3>{field.title}</H3>

                <div className="grid gap-1 content-start max-w-[400px] mt-3">
                    <div className="grid grid-cols-2 gap-1 ">
                        <span className="text-muted-foreground text-sm">
                            id
                        </span>
                        <span className="text-sm">
                            {field.id}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 ">
                        <span className="text-muted-foreground text-sm">
                            Встроено в
                        </span>
                        <span className="text-sm">
                            {placements.data?.flatMap(e => 'values' in e ? e.values : [e]).find(e => e.value === field.placement)?.label}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 ">
                        <span className="text-muted-foreground text-sm">
                            Источник данных
                        </span>
                        <span className="text-sm">
                           
                            {sources.data?.flatMap(e => 'values' in e ? e.values : [e]).find(e => e.value === field.source.id)?.label}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <ConfigurationItemEdit field={field} />

                <Button variant={'ghost'} onClick={() => handleDeleteField(field.id)} disabled={isDeleting}>
                    {!isDeleting && <XIcon />}
                    {isDeleting && <Loader className="animate-spin h-5 w-5" />}
                    Удалить поле
                </Button>
            </div>
        </Card>
    )
}