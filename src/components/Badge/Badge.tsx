interface BadgeProps {
    bg_clr: string,
    title: string,
    text_clr?: string,
}

export default function Badge({ bg_clr, title, text_clr = "text-white" }: BadgeProps) {
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${text_clr} ${bg_clr} inline-flex items-center justify-center`}>
            {title}
        </span>
    );
}