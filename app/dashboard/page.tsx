'use client';
import Navbar from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useBoards } from '@/lib/hooks/useBoards';
import { useUser } from '@clerk/nextjs';
import {
	CircleX,
	Clock9,
	Codepen,
	Divide,
	Filter,
	Grid3X3,
	History,
	List,
	Loader2,
	Plus,
	Rocket,
	Search,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPage() {
	const { user } = useUser();
	const { createBoard, boards, isLoading, error } = useBoards();
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

	const handleCreateBoard = async () => {
		await createBoard({
			title: 'New Board',
			description: 'Add a description for your board',
			color: 'bg-blue-500',
		});
	};

	if (isLoading) {
		return (
			<div className='flex items-center flex-col justify-center h-screen gap-2'>
				<Loader2 className='h-6 w-6 animate-spin' />
				<span className='text-gray-500 text-sm sm:text-base'>Loading...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center flex-col justify-center h-screen gap-2'>
				<CircleX className='h-6 w-6 text-red-500 animate-bounce' />
				<span className='text-red-500 text-lg font-semibold'>
					Error loading boards
				</span>
				<p className='text-gray-500 text-sm sm:text-base'>{error}</p>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar />
			<main className='container mx-auto px-4 py-6 sm:py-8'>
				<div>
					<h1 className='text-xl sm:text-3xl font-bold text-gray-700 mb-2'>
						Welcome back,{' '}
						{user?.firstName ?? user?.emailAddresses[0].emailAddress}! 👋
					</h1>
					<p className='text-gray-500 text-sm sm:text-base mb-2'>
						Here's a quick overview of your boards.
					</p>
					<Button
						className='w-full sm:w-auto text-xs sm:text-sm cursor-pointer'
						onClick={handleCreateBoard}
					>
						<Plus className='h-4 w-4' />
						Create Board
					</Button>
				</div>

				{/* {Stats} */}

				<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-4 sm:my-8'>
					<Card>
						<CardContent className='p-4 sm:p-6'>
							<div className='flex items-center justify-between gap-2'>
								<div>
									<p className='text-sm sm:text-base text-gray-500'>
										Total Boards
									</p>
									<p className='text-xl sm:text-3xl font-bold text-gray-700'>
										{boards.length}
									</p>
								</div>
								<div className='h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center bg-gray-100 rounded-lg p-2'>
									<Codepen className='h-6 w-6 sm:h-8 sm:w-8 text-gray-700' />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-4 sm:p-6'>
							<div className='flex items-center justify-between gap-2'>
								<div>
									<p className='text-sm sm:text-base text-gray-500'>
										Active Projects
									</p>
									<p className='text-xl sm:text-3xl font-bold text-gray-700'>
										{boards.length}
									</p>
								</div>
								<div className='h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center bg-green-100 rounded-lg p-2'>
									<Rocket className='h-6 w-6 sm:h-8 sm:w-8 text-gray-700' />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-4 sm:p-6'>
							<div className='flex items-center justify-between gap-2'>
								<div>
									<p className='text-sm sm:text-base text-gray-500'>
										Recent Activity
									</p>
									<p className='text-xl sm:text-3xl font-bold text-gray-700'>
										{
											boards.filter(board => {
												const updatetAt = new Date(board.updated_at);
												const oneWeekAgo = new Date();
												oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
												return updatetAt > oneWeekAgo;
											}).length
										}
									</p>
								</div>
								<div className='h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center bg-purple-100 rounded-lg p-2'>
									<History className='h-6 w-6 sm:h-8 sm:w-8 text-gray-700' />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-4 sm:p-6'>
							<div className='flex items-center justify-between gap-2'>
								<div>
									<p className='text-sm sm:text-base text-gray-500'>
										// TODO LATER
									</p>
									<p className='text-xl sm:text-3xl font-bold text-gray-700'>
										{boards.length}
									</p>
								</div>
								<div className='h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center bg-gray-100 rounded-lg p-2'>
									<Codepen className='h-6 w-6 sm:h-8 sm:w-8 text-gray-700' />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* {Boards} */}
				<div className='my-4 sm:my-8'>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0'>
						<div>
							<h2 className='text-xl sm:text-3xl font-bold text-gray-700'>
								Your Boards
							</h2>
							<p className='text-gray-500 text-sm sm:text-base mb-2'>
								Manage your boards and projects
							</p>
						</div>
						<div className='flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 space-x-2'>
							<div className='flex items-center space-x-2 bg-white border p-1 rounded-lg'>
								<Button
									className='cursor-pointer'
									variant={viewMode === 'grid' ? 'default' : 'ghost'}
									size='icon-sm'
									onClick={() => setViewMode('grid')}
								>
									<Grid3X3 />
								</Button>
								<Button
									className='cursor-pointer'
									variant={viewMode === 'list' ? 'default' : 'ghost'}
									size='icon-sm'
									onClick={() => setViewMode('list')}
								>
									<List />
								</Button>
							</div>
							<Button
								className='text-xs sm:text-sm cursor-pointer'
								variant='outline'
								size='sm'
							>
								<Filter /> Filter
							</Button>
							<Button
								className='w-full sm:w-auto text-xs sm:text-sm cursor-pointer'
								onClick={handleCreateBoard}
							>
								<Plus className='h-4 w-4' />
								Create Board
							</Button>
						</div>
					</div>
					{/* Search Bar */}
					<div className='mb-4 sm:mb-6 relative'>
						<Search className='h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2' />
						<Input
							type='text'
							placeholder='Search boards...'
							className='pl-10'
						/>
					</div>
					{/* Boards List */}
					{boards.length === 0 ? (
						<div>No boards yet</div>
					) : viewMode === 'grid' ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
							{boards.map(board => (
								<Link href={`/boards/${board.id}`} key={board.id}>
									<Card className='hover:shadow-lg transition-shadow duration-300 cursor-pointer group'>
										<CardHeader className='pb-3'>
											<div className='flex items-center justify-between'>
												<div
													className={`w-4 h-4 rounded-full ${board.color}`}
												/>
												<Badge variant={'secondary'} className='text-xs'>
													New
												</Badge>
											</div>
										</CardHeader>
										<CardContent>
											<h3 className='text-base sm:text-lg mb-2 font-semibold group-hover:text-blue-600 transition-colors duration-300'>
												{board.title}
											</h3>
											<p className='text-sm sm:text-base mb-4 text-gray-500 '>
												{board.description}
											</p>
											<div className='flex items-center justify-between text-xs'>
												<span className='flex items-center justify-center gap-0.5 text-gray-500'>
													<Clock9 className='h-3 w-3 text-gray-800' />
													Created{' '}
													{new Date(board.created_at).toLocaleDateString()}
												</span>
												<span className='flex items-center justify-center gap-0.5 text-gray-500'>
													<History className='h-3 w-3 text-gray-800' />
													Updated{' '}
													{new Date(board.updated_at).toLocaleDateString()}
												</span>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
							<Card
								onClick={handleCreateBoard}
								className='border-2 border-dashed border-gray-300 hover:border-gray-400 hover:shadow-lg transition-all duration-100 cursor-pointer group'
							>
								<CardContent className='h-full min-h-32 p-4 sm:p-6 flex flex-col items-center justify-center gap-2 text-gray-500 font-medium group-hover:scale-105 transition-all duration-300'>
									<Plus className='h-6 w-6' /> Create Board
								</CardContent>
							</Card>
						</div>
					) : (
						<div className='flex flex-col gap-4'>
							{boards.map(board => (
								<Link href={`/boards/${board.id}`} key={board.id}>
									<Card className='hover:shadow-lg transition-shadow duration-300 cursor-pointer group'>
										<CardHeader className='pb-3'>
											<div className='flex items-center justify-between'>
												<div
													className={`w-4 h-4 rounded-full ${board.color}`}
												/>
												<Badge variant={'secondary'} className='text-xs'>
													New
												</Badge>
											</div>
										</CardHeader>
										<CardContent>
											<h3 className='text-base sm:text-lg mb-2 font-semibold group-hover:text-blue-600 transition-colors duration-300'>
												{board.title}
											</h3>
											<p className='text-sm sm:text-base mb-4 text-gray-500 '>
												{board.description}
											</p>
											<div className='flex items-center justify-between text-xs'>
												<span className='flex items-center justify-center gap-0.5 text-gray-500'>
													<Clock9 className='h-3 w-3 text-gray-800' />
													Created{' '}
													{new Date(board.created_at).toLocaleDateString()}
												</span>
												<span className='flex items-center justify-center gap-0.5 text-gray-500'>
													<History className='h-3 w-3 text-gray-800' />
													Updated{' '}
													{new Date(board.updated_at).toLocaleDateString()}
												</span>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
							<Card
								onClick={handleCreateBoard}
								className='border-2 border-dashed border-gray-300 hover:border-gray-400 hover:shadow-lg transition-all duration-100 cursor-pointer group'
							>
								<CardContent className='h-full min-h-32 p-4 sm:p-6 flex flex-col items-center justify-center gap-2 text-gray-500 font-medium group-hover:scale-105 transition-all duration-300'>
									<Plus className='h-6 w-6' /> Create Board
								</CardContent>
							</Card>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
