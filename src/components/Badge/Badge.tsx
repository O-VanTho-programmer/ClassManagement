interface BadgeProps {
    bg_clr: string,
    title: string,
}

export default function Badge({ bg_clr, title }: BadgeProps) {
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${bg_clr}`}>{title}</span>
    )
}