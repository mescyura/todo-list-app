'use client';
import Navbar from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBoard } from '@/lib/hooks/useBoards';
import { ColumnWithTasks, Task } from '@/lib/supabase/models';
import {
	CalendarIcon,
	MoreHorizontalIcon,
	PlusIcon,
	UserIcon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

function Column({
	column,
	children,
	onCreateTask,
	onEditColumn,
}: {
	column: ColumnWithTasks;
	children?: React.ReactNode;
	onCreateTask?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	onEditColumn?: (column: ColumnWithTasks) => void;
}) {
	return (
		<div className='w-full lg:shrink-0 lg:w-80'>
			<div className='bg-white rounded-lg shadow-sm border'>
				<div className='p-3 sm:p-4 border-b'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<h3 className='text-lg font-semibold truncate'>{column.title}</h3>
							<Badge variant='secondary' className='text-xs shrink-0'>
								{column.tasks.length}
							</Badge>
						</div>
						<Button variant='ghost' size='sm' className='cursor-pointer'>
							<MoreHorizontalIcon />
						</Button>
					</div>
				</div>
				<div className='p-3 sm:p-4'>
					{children}
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="ghost" className='cursor-pointer w-full mt-3 text-gray-500 hover:text-gray-700' size='sm'>
								{' '}
								<PlusIcon /> Add Task
							</Button>
						</DialogTrigger>

						<DialogContent className='w-[95vw] max-w-[425px] mx-auto'>
							<DialogHeader>
								<DialogTitle className='text-2xl font-bold'>
									Create new task
								</DialogTitle>
								<p className='text-sm text-gray-500'>
									Add a new task to the board
								</p>
							</DialogHeader>
							<form className='space-y-2' onSubmit={onCreateTask}>
								<div className='space-y-2'>
									<Label htmlFor='title'>Title *</Label>
									<Input
										className='text-sm'
										type='text'
										name='title'
										id='title'
										required
										placeholder='Enter task title..'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='description'>Description</Label>
									<Textarea
										className='text-sm'
										name='description'
										id='description'
										placeholder='Enter task description..'
										rows={3}
									/>
								</div>
								{/* <div className='space-y-2'>
									<Label htmlFor='assignee'>Assignee</Label>
									<Input
										className='text-sm'
										type='text'
										name='assignee'
										id='assignee'
										// required
										placeholder='Enter assignee name..'
									/>
								</div> */}
								<div className='space-y-2'>
									<Label htmlFor='assignee'>Priority</Label>
									<Select name='priority' defaultValue='medium'>
										<SelectTrigger className='w-full'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{['low', 'medium', 'high'].map(priority => (
												<SelectItem key={priority} value={priority}>
													{priority.charAt(0).toUpperCase() + priority.slice(1)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='dueDate'>Due Date</Label>
									<Input
										type='date'
										name='dueDate'
										id='dueDate'
										className='text-sm'
									/>
								</div>
								<div className='flex justify-end gap-2 pt-4'>
									<Button type='submit' size='sm'>
										Create Task
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	);
}

function TaskCard({ task }: { task: Task }) {
	function getPriorityColor(priority: 'low' | 'medium' | 'high') {
		switch (priority) {
			case 'low':
				return 'bg-green-500';
			case 'medium':
				return 'bg-yellow-500';
			case 'high':
				return 'bg-red-500';
			default:
				return 'bg-yellow-500';
		}
	}

	return (
		<div>
			<Card className='cursor-pointer hover:shadow-md transition-shadow duration-200'>
				<CardContent className='p-3 sm:p-4'>
					<div className='space-y-2 sm:space-y-3'>
						<div className='flex items-start justify-between'>
							<h4 className='font-medium text-gray-900 text-md leading-tight flex-1 min-w-0 pr-2'>
								{task.title}
							</h4>
						</div>
						<p className='text-sm text-gray-500 line-clamp-2'>
							{task.description || 'No description'}
						</p>

						<div className='flex items-center justify-between gap-2'>
							<div className='flex items-center justify-between flex-wrap space-x-3 sm:space-x-4 sm:space-y-1 min-w-0'>
								{task.assignee && (
									<div className='flex items-center gap-1 text-xs text-gray-500'>
										<UserIcon className='w-4 h-4' />
										<span className='text-xs truncate'>{task.assignee}</span>
									</div>
								)}
								{task.due_date && (
									<div className='flex items-center gap-1 text-xs text-gray-500'>
										<CalendarIcon className='w-4 h-4' />
										<span className='text-xs truncate'>{task.due_date}</span>
									</div>
								)}
							</div>
							<div
								className={`w-3 h-3 rounded-full shrink-0 
										${getPriorityColor(task.priority)}`}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function BoardPage() {
	const { id } = useParams<{ id: string }>();
	const { board, columns, isLoading, error, updateBoard, createRealTask } =
		useBoard(id);
	const [isEditing, setIsEditing] = useState(false);
	const [newTitle, setNewTitle] = useState('');
	const [newColor, setNewColor] = useState('');

	const [isFilterOpen, setFilterOpen] = useState(false);

	async function handleUpdateBoard(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!newTitle.trim() || !board) return;
		try {
			await updateBoard(board.id, {
				title: newTitle,
				color: newColor || board.color,
			});
			setIsEditing(false);
		} catch (error) {
			console.error(error);
		}
	}

	async function createTask(taskData: {
		title: string;
		description?: string;
		assignee?: string;
		due_date?: string;
		priority: 'low' | 'medium' | 'high';
	}) {
		const targetColumn = columns[0];
		if (!targetColumn) {
			throw new Error('No column found');
		}

		await createRealTask(targetColumn.id, taskData);
	}

	async function handleCreateTask(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		console.log(formData.get('dueDate'));
		const taskData = {
			title: formData.get('title') as string,
			description: (formData.get('description') as string) || undefined,
			// assignee: (formData.get('assignee') as string) || undefined,
			due_date: (formData.get('dueDate') as string) || undefined,
			priority:
				(formData.get('priority') as 'low' | 'medium' | 'high') || 'medium',
		};

		if (taskData.title.trim()) {
			await createTask(taskData);

			const trigger = document.querySelector(
				'[data-state="open"]'
			) as HTMLElement;
			if (trigger) {
				trigger.click();
			}
		}
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar
				boardTitle={board?.title}
				onEditBoard={() => {
					setNewTitle(board?.title ?? '');
					setNewColor(board?.color ?? '');
					setIsEditing(true);
				}}
				boardColor={board?.color}
				//TODO: Implement filter click
				onFilterClick={() => {
					setFilterOpen(true);
				}}
				//TODO: Implement filter count
				filterCount={2}
			/>
			<Dialog open={isEditing} onOpenChange={setIsEditing}>
				<DialogContent className='w-[95vw] max-w-[425px] mx-auto'>
					<DialogHeader>
						<DialogTitle className='text-2xl font-bold'>Edit Board</DialogTitle>
					</DialogHeader>
					<form className='space-y-4' onSubmit={handleUpdateBoard}>
						<div className='space-y-2'>
							<Label htmlFor='boardTitle' className='text-sm font-semibold'>
								Board Title
							</Label>
							<Input
								className='text-sm'
								id='boardTitle'
								placeholder='Enter board title'
								required
								value={newTitle}
								onChange={e => setNewTitle(e.target.value)}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='boardColor' className='text-sm font-semibold'>
								Board Color
							</Label>
							<div className='grid grid-cols-6 sm:grid-cols-4 gap-2 mt-4'>
								{[
									'bg-blue-500',
									'bg-green-500',
									'bg-yellow-500',
									'bg-red-500',
									'bg-purple-500',
									'bg-pink-500',
									'bg-indigo-500',
									'bg-gray-500',
									'bg-orange-500',
									'bg-teal-500',
									'bg-cyan-500',
									'bg-emerald-500',
								].map((color, key) => (
									<button
										type='button'
										key={color}
										className={`w-full h-6 rounded-full ${color} ${
											newColor === color
												? 'ring-2 ring-offset-2 ring-gray-700'
												: ''
										}`}
										onClick={() => setNewColor(color)}
									/>
								))}
							</div>
						</div>
						<div className='flex justify-end gap-2'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => setIsEditing(false)}
							>
								Cancel
							</Button>
							<Button type='submit' size='sm'>
								Save Changes
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={isFilterOpen} onOpenChange={setFilterOpen}>
				<DialogContent className='w-[95vw] max-w-[425px] mx-auto'>
					<DialogHeader>
						<DialogTitle className='text-2xl font-bold'>
							Filter tasks
						</DialogTitle>
						<p className='text-sm text-gray-500'>
							Filter tasks by priority, assignee or due date
						</p>
					</DialogHeader>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='priority' className='text-sm font-semibold'>
								Priority
							</Label>
							<div className='flex gap-2'>
								{['low', 'medium', 'high'].map(priority => (
									<Button key={priority} variant={`outline`} size='sm'>
										{priority.charAt(0).toUpperCase() + priority.slice(1)}
									</Button>
								))}
							</div>
						</div>
						{/* // TODO: Implement assignee filter */}
						{/* <div className='space-y-2'>
							<Label htmlFor='priority' className='text-sm font-semibold'>
								Assignee
							</Label>
							<div className='flex gap-2'>
								{['low', 'medium', 'high'].map(priority => (
									<Button key={priority} variant={`outline`} size='sm'>
										{priority.charAt(0).toUpperCase() + priority.slice(1)}
									</Button>
								))}
							</div>
						</div> */}
						<div className='space-y-2'>
							<Label htmlFor='priority' className='text-sm font-semibold'>
								Due Date
							</Label>
							<Input type='date' id='dueDate' className='text-sm' />
						</div>
						<div className='flex justify-end gap-2 pt-4'>
							<Button type='button' variant='outline' size='sm'>
								Clear Filters
							</Button>
							<Button
								type='submit'
								onClick={() => setFilterOpen(false)}
								size='sm'
							>
								Apply Filters
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Board Content */}
			<main className='container mx-auto px-2 sm:px-4 py-4 sm:py-6'>
				<div className='flex items-center justify-between mb-6 space-y-4'>
					<div className='flex flex-wrap items-center gap-4 sm:gap-6'>
						<div className='text-sm text-gray-500'>
							<span className='font-medium'>Total tasks: </span>
							{columns.reduce((acc, column) => acc + column.tasks.length, 0)}
						</div>
					</div>

					<Dialog>
						<DialogTrigger asChild>
							<Button size='sm'>
								{' '}
								<PlusIcon /> Add Task
							</Button>
						</DialogTrigger>

						<DialogContent className='w-[95vw] max-w-[425px] mx-auto'>
							<DialogHeader>
								<DialogTitle className='text-2xl font-bold'>
									Create new task
								</DialogTitle>
								<p className='text-sm text-gray-500'>
									Add a new task to the board
								</p>
							</DialogHeader>
							<form className='space-y-2' onSubmit={handleCreateTask}>
								<div className='space-y-2'>
									<Label htmlFor='title'>Title *</Label>
									<Input
										className='text-sm'
										type='text'
										name='title'
										id='title'
										required
										placeholder='Enter task title..'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='description'>Description</Label>
									<Textarea
										className='text-sm'
										name='description'
										id='description'
										placeholder='Enter task description..'
										rows={3}
									/>
								</div>
								{/* <div className='space-y-2'>
									<Label htmlFor='assignee'>Assignee</Label>
									<Input
										className='text-sm'
										type='text'
										name='assignee'
										id='assignee'
										// required
										placeholder='Enter assignee name..'
									/>
								</div> */}
								<div className='space-y-2'>
									<Label htmlFor='assignee'>Priority</Label>
									<Select name='priority' defaultValue='medium'>
										<SelectTrigger className='w-full'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{['low', 'medium', 'high'].map(priority => (
												<SelectItem key={priority} value={priority}>
													{priority.charAt(0).toUpperCase() + priority.slice(1)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='dueDate'>Due Date</Label>
									<Input
										type='date'
										name='dueDate'
										id='dueDate'
										className='text-sm'
									/>
								</div>
								<div className='flex justify-end gap-2 pt-4'>
									<Button type='submit' size='sm'>
										Create Task
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>

				{/* Board Columns */}
				<div
					className='flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto 
					lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2 
					lg:[&::-webkit-scrollbar-track]:bg-gray-100 
					lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full 
					space-y-4 lg:space-y-0'
				>
					{columns.map(column => (
						<Column
							key={column.id}
							column={column}
							onCreateTask={handleCreateTask}
							onEditColumn={() => {}}
						>
							<div className='space-y-3'>
								{column.tasks.map(task => (
									<TaskCard key={task.id} task={task} />
								))}
							</div>
						</Column>
					))}
				</div>
			</main>
		</div>
	);
}
