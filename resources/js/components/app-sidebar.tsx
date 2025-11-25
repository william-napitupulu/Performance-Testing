import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Activity, Moon, Sun, ChartPie, ChartBar, ChartLine } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Performance Test List',
        href: '/performance',
        icon: Activity,
    },
    {
        title: 'Performance Test Output',
        href: '/output/performance',
        icon: ChartPie,
    },
    {
        title: 'Performance Baseline',
        href: '/baseline',
        icon: ChartBar
    },
    {
        title: 'Trending Chart',
        href: '/trending',
        icon: ChartLine,
    },

    // {

    //     title: 'Testing',
    //     href: '/test-page',
    //     icon: TestTube,
    // },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/william-napitupulu/Performance-Testing',
    //     icon: Folder,
    // },
    // {
    //     title: 'Framework Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
    // {
    //     title: 'Documentation',
    //     href: '/documentation',
    //     icon: PackageIcon,
    // },
    
];

export function AppSidebar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Sidebar collapsible="icon" variant="inset" className="group">
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
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center w-full gap-3 px-3 py-2 text-gray-700 transition-colors duration-200 border border-transparent rounded-lg hover:border-gray-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                                >
                                    {theme === 'dark' ? (
                                        <>
                                            <Sun className="w-5 h-5 text-yellow-500" />
                                            <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                                                Light Mode
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Moon className="w-5 h-5 text-blue-500" />
                                            <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">Dark Mode</span>
                                        </>
                                    )}
                                </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
