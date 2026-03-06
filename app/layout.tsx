import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SupabaseProvider from '@/lib/supabase/SupabaseProvider';
import Link from 'next/link';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Todo App',
	description: 'Created by @mescyura',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<SupabaseProvider>
						<div className='min-h-screen flex flex-col'>
							<main className='flex-1'>{children}</main>
							<footer className='border-t bg-white/80 backdrop-blur-sm'>
								<div className='container mx-auto px-4 py-4 flex flex-col items-center justify-between gap-2 text-xs sm:text-sm text-gray-500'>
									<p className='text-center sm:text-left'>
										<span className='font-medium text-gray-700'>Todo App</span>{' '}
										· Built with Next.js, Supabase &amp; Clerk
									</p>
									<div className='flex items-center gap-3 text-sm sm:text-base'>
										<span>Drag &amp; drop boards for your everyday work.</span>
									</div>
									<div className='flex items-center gap-1 text-xs sm:text-sm'>
										Made by
										<Link
											href='https://github.com/mescyura'
											target='_blank'
											className='text-gray-700 hover:text-gray-900 hover:underline transition-all duration-300'
										>
											@mescyura
										</Link>
									</div>
								</div>
							</footer>
						</div>
					</SupabaseProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
