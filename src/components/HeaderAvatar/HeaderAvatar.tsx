
interface HeaderAvatarProps{
    name?: string,
    size?: 'smaller',

}

export default function HeaderAvatar({name="K", size}: HeaderAvatarProps) {

    let styleSize = '';

    switch (size) {
        case 'smaller':
            styleSize = 'w-[35px] h-[35px] text-sm';
            break;
    
        default:
            styleSize = 'w-[50px] h-[50px] text-lg';
            break;
    }

    return (
        <div className="rounded-full overflow-hidden">
            <div className={` ${styleSize} bg-red-100 font-medium flex justify-center items-center`}>
                {name}
            </div>
        </div>

    )
}