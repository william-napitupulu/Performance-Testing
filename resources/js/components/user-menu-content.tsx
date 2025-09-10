import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User, type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Building2, LogOut } from 'lucide-react';
import { useState } from 'react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    // ✅ FIX: Provide the shared props type to the usePage hook
    const { props } = usePage<SharedData>();
    
    // ✅ FIX: Access props safely without 'as any'
    const session = props.session || {};
    const currentUnitName = session.current_unit_name || 'No Unit Selected';

    const handleLogout = () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        cleanup();
        router.post(
            route('logout'),
            {},
            {
                onFinish: () => setIsLoggingOut(false),
            },
        );
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {/* <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('unit.select')} as="button" prefetch onClick={cleanup}>
                        <Building2 className="mr-2" />
                        <div className="flex flex-col items-start">
                            <span>Change Units</span>
                            <span className="text-xs text-muted-foreground" title={currentUnitName}>
                                {currentUnitName}
                            </span>
                        </div>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild disabled={isLoggingOut}>
                <button type="button" className="flex w-full items-center" onClick={handleLogout} disabled={isLoggingOut}>
                    <LogOut className="mr-2" />
                    {isLoggingOut ? 'Logging out…' : 'Log out'}
                </button>
            </DropdownMenuItem>
        </>
    );
}
