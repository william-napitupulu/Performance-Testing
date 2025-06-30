import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

// SVG Components
const ChevronDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const NavButtons = () => (
    <div className="flex flex-row justify-center items-center w-full gap-4">
        <button className="bg-white text-black px-4 py-2 rounded-2xl">Try Widget</button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded-2xl">Get Started</button>
    </div>
);

const NavigationMenu = () => (
    <div className="flex flex-col items-center w-full gap-4">
        <div className="flex flex-row justify-center items-center w-full">
            <div className="flex flex-row justify-between bg-white text-black rounded-2xl px-4 py-2 gap-4">
                <a href="#" className="hover:text-gray-600">Enterprise</a>
                
                <div className="relative group">
                    <a href="#" className="hover:text-gray-600 flex items-center">
                        Coverage
                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </a>
                    <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg p-2 mt-2">
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Coverage Page 1</a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Coverage Page 2</a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Coverage Page 3</a>
                    </div>
                </div>

                <div className="relative group">
                    <a href="#" className="hover:text-gray-600 flex items-center">
                        Products
                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </a>
                    <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg p-2 mt-2">
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Product 1</a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Product 2</a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Product 3</a>
                    </div>
                </div>

                <div className="relative group">
                    <a href="#" className="hover:text-gray-600 flex items-center">
                        Resources
                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </a>
                    <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg p-2 mt-2">
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Resource 1</a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Resource 2</a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Resource 3</a>
                    </div>
                </div>

                <a href="#" className="hover:text-gray-600">Pricing</a>
            </div>
            <div className="ml-40">
                <NavButtons />
            </div>
        </div>
        
        
    </div>
);

const FooterMenu = () => (
    <div className="w-full py-8 bg-gray-50 overflow-hidden">
        <div className="flex flex-row items-center text-black gap-8 animate-scroll whitespace-nowrap">
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Bitcoin.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Coinbase.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">soulflare.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">wallet.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">exodus.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">binance wallet.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">jupiter.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">MetaMask</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Trust Wallet</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Phantom</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Solflare</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Keplr</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Ledger</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Trezor</a>
            
            {/* Duplicate items for seamless loop */}
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Bitcoin.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Coinbase.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">soulflare.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">wallet.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">exodus.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">binance wallet.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">jupiter.com</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">MetaMask</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Trust Wallet</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Phantom</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Solflare</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Keplr</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Ledger</a>
            <a href="#" className="hover:text-gray-600 flex-shrink-0">Trezor</a>
        </div>
    </div>
);

export default function TestPage() {
    return (
        <AppLayout>
            <Head title="Performance Test - Test Page" />

            <div className="min-h-screen flex flex-col">
                <div className="flex flex-row m-10 gap-10 w-full">
                    <button className="bg-white text-black px-4 py-2 rounded-2xl">nramper</button>
                    <NavigationMenu />
                </div>
                
                {/* This div will grow to fill remaining space */}
                <div className="flex-grow"></div>
                
                <FooterMenu />
            </div>
        </AppLayout>
    );
}
