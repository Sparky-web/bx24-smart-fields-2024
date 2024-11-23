import { cn } from "~/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, React.PropsWithChildren {}

export default function Card(props: CardProps) {
    return (
        <div className={cn("rounded-lg bg-white p-3 ", props.className)}>
            {props.children}
        </div>
    )
}