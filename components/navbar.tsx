'use client';

import { ArrowLeft, ArrowRight, Codepen, MoreHorizontal } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { Button } from './ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
	boardTitle?: string;
	boardColor?: string;
	onEditBoard?: () => void;
}
export default function Navbar({ boardTitle, boardColor, onEditBoard }: NavbarProps) {
	const { isSignedIn, user } = useUser();
	const pathname = usePathname();

	const isDashboardPage = pathname === '/dashboard';
	const isBoardPage = pathname.startsWith('/boards/');

	if (isDashboardPage) {
		return (
			<header className='border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
				<div className='container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between'>
					<div className='flex items-center space-x-2'>
						<Codepen className='h-6 w-6 sm:h-8 sm:w-8 text-gray-700' />
						<span className='text-xl sm:text-2xl font-semibold text-gray-700'>
							Todo App
						</span>
					</div>
					<div className='flex items-center space-x-2 sm:space-x-4'>
						<UserButton />
					</div>
				</div>
			</header>
		);
	}

	if (isBoardPage) {
		return (
			<header className='border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
				<div className='container mx-auto px-4 py-3 sm:py-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-2 min-w-0'>
							<Link
								href='/dashboard'
								className='flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base text-gray-400 hover:text-gray-600 shrink-0 transition-colors duration-200 '
							>
								<ArrowLeft className='h-4 w-4 sm:h-5 sm:w-5' />
								<span className='hidden sm:inline-block mr-0'>Back to Dashboard</span>
								<span className='sm:hidden'>Back</span>
							</Link>
							<div className='h-4 sm:h-5 w-px bg-gray-200' />
							<div className='flex items-center space-x-2'>
								<Codepen className='h-6 w-6 sm:h-8 sm:w-8 text-gray-700' />
								<span className='text-md font-semibold text-gray-700 truncate'>
									{boardTitle}
								</span>
								{onEditBoard && (
									<Button
										variant='ghost'
										size='sm'
										className='h-7 w-7 p-0 shrink-0'
										onClick={onEditBoard}
									>
										<MoreHorizontal />
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
			</header>
		);
	}

	return (
		<header className='border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
			<div className='container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between'>
				<div className='flex items-center space-x-2'>
					<Codepen className='h-6 w-6 sm:h-8 sm:w-8 text-gray-700' />
					<span className='text-xl sm:text-2xl font-semibold text-gray-700'>
						Todo App
					</span>
				</div>
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
									variant='ghost'
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
