'use client';
import Navbar from '@/components/navbar';
import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
	const { user } = useUser();

	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar />
			<main className='container mx-auto px-4 py-6 sm:py-8'>
				<div>
					<h1 className='text-xl sm:text-3xl font-bold'>
						Welcome back,{' '}
						{user?.firstName ?? user?.emailAddresses[0].emailAddress}! 👋
					</h1>
				</div>
			</main>
		</div>
	);
}
