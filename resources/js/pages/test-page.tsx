import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

// SVG Components
const ChevronDownIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const NavButtons = () => (
    <div className="flex w-full flex-row items-center justify-center gap-4">
        <button className="rounded-2xl bg-white px-4 py-2 text-black">Try Widget</button>
        <button className="rounded-2xl bg-gray-500 px-4 py-2 text-white">Get Started</button>
    </div>
);

const NavigationMenu = () => (
    <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full flex-row items-center justify-center">
            <div className="flex flex-row justify-between gap-4 rounded-2xl bg-white px-4 py-2 text-black">
                <a href="#" className="hover:text-gray-600">
                    Enterprise
                </a>

                <div className="group relative">
                    <a href="#" className="flex items-center hover:text-gray-600">
                        Coverage
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                    </a>
                    <div className="absolute mt-2 hidden rounded-lg bg-white p-2 shadow-lg group-hover:block">
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                            Coverage Page 1
                        </a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                            Coverage Page 2
                        </a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                            Coverage Page 3
                        </a>
                    </div>
                </div>

                <div className="group relative">
                    <a href="#" className="flex items-center hover:text-gray-600">
                        Products
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                    </a>
                    <div className="absolute mt-2 hidden rounded-lg bg-white p-2 shadow-lg group-hover:block">
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                            Product 1
                        </a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                            Product 2
                        </a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                            Product 3
                        </a>
                    </div>
                </div>

                <div className="group relative">
                    <a href="#" className="flex items-center hover:text-gray-600">
                        Resources
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                    </a>
                    <div className="absolute mt-2 hidden rounded-lg bg-white p-2 shadow-lg group-hover:block">
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                            Resource 1
                        </a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                            Resource 2
                        </a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                            Resource 3
                        </a>
                    </div>
                </div>

                <a href="#" className="hover:text-gray-600">
                    Pricing
                </a>
            </div>
            <div className="ml-40">
                <NavButtons />
            </div>
        </div>
    </div>
);

const FooterMenu = () => (
    <div className="w-full overflow-hidden bg-gray-50 py-8">
        <div className="animate-scroll flex flex-row items-center gap-8 whitespace-nowrap text-black">
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Bitcoin.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Coinbase.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                soulflare.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                wallet.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                exodus.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                binance wallet.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                jupiter.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                MetaMask
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Trust Wallet
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Phantom
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Solflare
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Keplr
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Ledger
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Trezor
            </a>

            {/* Duplicate items for seamless loop */}
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Bitcoin.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Coinbase.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                soulflare.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                wallet.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                exodus.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                binance wallet.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                jupiter.com
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                MetaMask
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Trust Wallet
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Phantom
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Solflare
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Keplr
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Ledger
            </a>
            <a href="#" className="flex-shrink-0 hover:text-gray-600">
                Trezor
            </a>
        </div>
    </div>
);

export default function TestPage() {
    return (
        <AppLayout>
            <Head title="Performance Test - Test Page" />

            <div className="flex min-h-screen flex-col">
                <div className="m-10 flex w-full flex-row gap-10">
                    <button className="rounded-2xl bg-white px-4 py-2 text-black">nramper</button>
                    <NavigationMenu />
                </div>

                {/* This div will grow to fill remaining space */}
                <div className="flex-grow"></div>

                <FooterMenu />
            </div>
        </AppLayout>
    );
}
