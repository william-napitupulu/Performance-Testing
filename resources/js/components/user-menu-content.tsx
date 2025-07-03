import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import React, { useState } from 'react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        cleanup();
        router.post(route('logout'), {}, {
            onFinish: () => setIsLoggingOut(false)
        });
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
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild disabled={isLoggingOut}>
                <button
                    type="button"
                    className="flex w-full items-center"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    <LogOut className="mr-2" />
                    {isLoggingOut ? 'Logging out…' : 'Log out'}
                </button>
            </DropdownMenuItem>
        </>
    );
}
