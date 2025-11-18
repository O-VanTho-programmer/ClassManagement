import { LucideIcon } from 'lucide-react'
import React from 'react'

type IconButtonProps = {
    icon: LucideIcon;
    onClick: () => void;
    className?: string;
    size: number;
}

export default function IconButton({
    icon,
    onClick,
    className,
    size
}: IconButtonProps) {
    const Icon = icon;

    return (
        <button onClick={onClick} className={`cursor-pointer ${className}`}>
            <Icon size={size} />
        </button>
    )
}