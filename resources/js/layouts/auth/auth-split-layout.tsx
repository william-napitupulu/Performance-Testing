import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col lg:flex-row">
            <div className="flex min-h-60 items-center justify-center bg-gray-900 p-6 lg:min-h-svh lg:w-1/2">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Link href={route('home')} className="flex items-center gap-2 font-semibold text-white">
                        <AppLogoIcon className="mr-2 size-10" />
                        <span className="text-xl">React Starter Kit</span>
                    </Link>
                    <p className="text-lg text-gray-300">
                        Welcome to our application. Please log in to continue.
                    </p>
                </div>
            </div>
            <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                                <AppLogoIcon className="h-14 sm:h-16" />
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium">{title}</h1>
                                <p className="text-center text-sm text-muted-foreground">{description}</p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
