import { LucideIcon } from "lucide-react";

export interface CardClass {
    icon: LucideIcon;
    number: number;
    content: string;
    color: 'blue' | 'green' | 'red' | 'yellow';
}