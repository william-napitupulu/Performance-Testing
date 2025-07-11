import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    BookOpen, 
    Folder, 
    AlertTriangle, 
    Sun,
    Moon,
    Activity,
    BarChart3,
    TestTube
} from 'lucide-react';
import AppLogo from './app-logo';
import { useTheme } from '@/contexts/ThemeContext';

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
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
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
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
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
