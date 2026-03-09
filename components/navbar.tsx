'use client';

import { ArrowRight, Codepen } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { Button } from './ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
	const { isSignedIn, user } = useUser();
	const pathname = usePathname();

	const isDashboardPage = pathname === '/dashboard';
	const isBoardPage = pathname.startsWith('/boards/');

	if (isDashboardPage || isBoardPage) {
		return (
			<header className='border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
				<div className='container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between'>
					<Link href='/'>
						<div className='flex items-center space-x-2'>
							<Codepen className='h-6 w-6 sm:h-8 sm:w-8 text-gray-700' />
							<span className='text-xl sm:text-2xl font-semibold text-gray-700'>
								Todo App
							</span>
						</div>
					</Link>
					<div className='flex items-center space-x-2 sm:space-x-4'>
						<UserButton />
					</div>
				</div>
			</header>
		);
	}

	return (
		<header className='border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
			<div className='container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between'>
				<Link href='/'>
					<div className='flex items-center space-x-2'>
						<Codepen className='h-6 w-6 sm:h-8 sm:w-8 text-gray-700' />
						<span className='text-xl sm:text-2xl font-semibold text-gray-700'>
							Todo App
						</span>
					</div>
				</Link>
				<div className='flex items-center space-x-2 sm:space-x-4'>
					{isSignedIn ? (
						<div className='flex items-center space-x-2'>
							<Link href='/dashboard'>
								<Button size='sm' className='text-xs sm:text-sm cursor-pointer'>
									Go to Dashboard <ArrowRight />
								</Button>
							</Link>
							<span className='hidden sm:block text-xs sm:text-sm text-gray-600'>
								Welcome,
								{user?.firstName ?? user?.emailAddresses[0].emailAddress}
							</span>
							<UserButton />
						</div>
					) : (
						<div className='flex items-center space-x-2'>
							<SignInButton>
								<Button
									variant='outline'
									size='sm'
									className='text-xs sm:text-sm cursor-pointer'
								>
									Sign In
								</Button>
							</SignInButton>
							<SignUpButton>
								<Button size='sm' className='text-xs sm:text-sm cursor-pointer'>
									Sign Up
								</Button>
							</SignUpButton>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
