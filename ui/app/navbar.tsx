'use client'

import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname() || '/';
    return (
        <nav className="bg-gray-200 shadow shadow-gray-300 w-100 px-8 md:px-auto">
            <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-center flex-wrap md:flex-nowrap">
                {/* <!-- Logo --> */}
                <div className="text-violet-400 w-full md:w-auto ">
                    <ul className="flex font-semibold justify-between">
                        <li className={`md:px-4 md:py-2 hover:text-violet-500 ${pathname === '/' ? 'text-violet-600' : ''}`}><a href="/">Dashboard</a></li>
                        <li className={`md:px-4 md:py-2 hover:text-violet-500 ${pathname === '/playground' ? 'text-violet-600' : ''}`}><a href="/playground">Playground</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}