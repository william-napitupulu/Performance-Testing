import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Activity, AlertTriangle, BookOpen, Folder, Moon, PackageIcon, Sun } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Performance List',
        href: '/performance',
        icon: Activity,
    },
    {
        title: 'Anomaly Detection',
        href: '/anomaly',
        icon: AlertTriangle,
    },

    {
        title: 'Contents and components',
        href: '/contents',
        icon: BookOpen,
    },

    // {

    //     title: 'Testing',
    //     href: '/test-page',
    //     icon: TestTube,
    // },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/william-napitupulu/Performance-Testing',
        icon: Folder,
    },
    {
        title: 'Framework Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
    {
        title: 'Documentation',
        href: '/documentation',
        icon: PackageIcon,
    },
    
];

export function AppSidebar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/performance" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <div className="px-3 py-2">
                    <button
                        onClick={toggleTheme}
                        className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-gray-700 transition-colors duration-200 hover:border-gray-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                    >
                        {theme === 'dark' ? (
                            <>
                                <Sun className="h-5 w-5 text-yellow-500" />
                                <span className="text-sm font-medium">Light Mode</span>
                            </>
                        ) : (
                            <>
                                <Moon className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-medium">Dark Mode</span>
                            </>
                        )}
                    </button>
                </div>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
