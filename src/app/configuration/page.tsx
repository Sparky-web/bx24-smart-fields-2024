import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { H1, H2 } from "~/components/ui/typography";
import CreateFieldDialog from "./_lib/components/create-field-dialog";

export default function Page() {
    return (
        <div className="container py-6 grid gap-6">
            <H2>Умные реквизиты</H2>
            <CreateFieldDialog />
        </div>
    )
}