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
	ArrowLeft,
	CalendarIcon,
	Codepen,
	Filter,
	MoreHorizontal,
	MoreHorizontalIcon,
	PlusIcon,
	TrashIcon,
	UserIcon,
} from 'lucide-react';
import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	rectIntersection,
	useDroppable,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

function DroppableColumn({
	column,
	children,
	onCreateTask,
	onEditColumn,
	onDeleteColumn,
}: {
	column: ColumnWithTasks;
	children?: React.ReactNode;
	onCreateTask?: (
		e: React.FormEvent<HTMLFormElement>,
		columnId: string
	) => Promise<void>;
	onEditColumn: (column: ColumnWithTasks) => void;
	onDeleteColumn: (column: ColumnWithTasks) => void;
}) {
	const { setNodeRef } = useDroppable({ id: column.id });

	return (
		<div ref={setNodeRef} className='w-full lg:shrink-0 lg:w-80'>
			<div className='bg-white rounded-lg shadow-sm border'>
				<div className='p-3 sm:p-4 border-b'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<h3 className='text-lg font-semibold truncate'>{column.title}</h3>
							<Badge variant='secondary' className='text-xs shrink-0'>
								{column.tasks.length}
							</Badge>
						</div>
						<div className='flex items-center'>
							<Button
								variant='ghost'
								size='sm'
								className='cursor-pointer'
								onClick={() => onEditColumn(column)}
							>
								<MoreHorizontalIcon />
							</Button>
							<Button
								variant='ghost'
								size='sm'
								className='cursor-pointer'
								onClick={() => onDeleteColumn(column)}
							>
								<TrashIcon className='w-4 h-4' />
							</Button>
						</div>
					</div>
				</div>
				<div className='p-3 sm:p-4'>
					{children}
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant='ghost'
								className='w-full text-gray-500 hover:text-gray-700 cursor-pointer'
								size='sm'
							>
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
							<form
								className='space-y-2'
								onSubmit={e => onCreateTask?.(e, column.id)}
							>
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

function SortableTaskCard({ task }: { task: Task }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transition,
		transform,
		isDragging,
	} = useSortable({ id: task.id });

	const styles = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

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
		<div ref={setNodeRef} style={styles} {...attributes} {...listeners}>
			<Card className='cursor-pointer hover:shadow-md transition-shadow'>
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

function TaskOverlay({ task }: { task: Task }) {
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
		<Card className='cursor-pointer hover:shadow-md transition-shadow'>
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
	);
}

export default function BoardPage() {
	const { id } = useParams<{ id: string }>();
	const {
		board,
		columns,
		isLoading,
		error,
		setColumns,
		updateBoard,
		createRealTask,
		moveTask,
		createColumn,
		updateColumn,
		deleteColumn,
	} = useBoard(id);
	const [isEditing, setIsEditing] = useState(false);
	const [newTitle, setNewTitle] = useState('');
	const [newColor, setNewColor] = useState('');
	const [isFilterOpen, setFilterOpen] = useState(false);
	const [isCreatingColumn, setIsCreatingColumn] = useState(false);
	const [isEditingColumn, setIsEditingColumn] = useState(false);
	const [newColumnTitle, setNewColumnTitle] = useState('');
	const [editingColumnTitle, setEditingColumnTitle] = useState('');
	const [isDeletingColumn, setIsDeletingColumn] = useState(false);
	const [editingColumn, setEditingColumn] = useState<ColumnWithTasks | null>(
		null
	);
	const [deletingColumn, setDeletingColumn] = useState<ColumnWithTasks | null>(
		null
	);
	const [activeTask, setActiveTask] = useState<Task | null>(null);
	const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
	const [sourceColumnId, setSourceColumnId] = useState<string | null>(null);
	const [filterCount, setFilterCount] = useState<number | null>(null);
	const [dropTarget, setDropTarget] = useState<{
		columnId: string;
		index: number;
	} | null>(null);

	const [filters, setFilters] = useState({
		priority: [] as String[],
		assignee: [] as String[],
		dueDate: null as string | null,
	});

	useEffect(() => {
		setFilterCount(
			Object.values(filters).reduce(
				(count, v) =>
					count + (Array.isArray(v) ? v.length : v !== null ? 1 : 0),
				0
			)
		);
	}, [filters]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	function handleFIlterChange(
		type: 'priority' | 'assignee' | 'dueDate',
		value: string | string[] | null
	) {
		setFilters(prev => ({ ...prev, [type]: value }));
	}

	function clearFilters() {
		setFilters({
			priority: [] as String[],
			assignee: [] as String[],
			dueDate: null as string | null,
		});
		setFilterOpen(false);
	}

	const filteredColumns = columns.map(column => ({
		...column,
		tasks: column.tasks.filter(task => {
			// filter by priority
			if (
				filters.priority.length > 0 &&
				!filters.priority.includes(task.priority)
			) {
				return false;
			}
			// filter by due date
			if (filters.dueDate && task.due_date) {
				const taskDate = new Date(task.due_date).toString();
				const filtersDate = new Date(filters.dueDate).toString();
				if (taskDate !== filtersDate) {
					return false;
				}
			}
			return true;
		}),
	}));

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

	async function createTask(
		taskData: {
			title: string;
			description?: string;
			assignee?: string;
			due_date?: string;
			priority: 'low' | 'medium' | 'high';
		},
		columnId?: string
	) {
		const targetColumn = columnId
			? columns.find(col => col.id === columnId)
			: columns[0];
		if (!targetColumn) {
			throw new Error('No column found');
		}

		await createRealTask(targetColumn.id, taskData);
	}

	async function handleCreateTask(
		e: React.FormEvent<HTMLFormElement>,
		columnId?: string
	) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		console.log(formData.get('dueDate'));
		const taskData = {
			title: formData.get('title') as string,
			description: (formData.get('description') as string) || undefined,
			assignee: (formData.get('assignee') as string) || undefined,
			due_date: (formData.get('dueDate') as string) || undefined,
			priority:
				(formData.get('priority') as 'low' | 'medium' | 'high') || 'medium',
		};

		if (taskData.title.trim()) {
			await createTask(taskData, columnId);

			const trigger = document.querySelector(
				'[data-state="open"]'
			) as HTMLElement;
			if (trigger) {
				trigger.click();
			}
		}
	}

	async function handleCreateColumn(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!newColumnTitle.trim()) return;
		await createColumn(newColumnTitle.trim());
		setNewColumnTitle('');
		setIsCreatingColumn(false);
	}

	function handleEditColumn(column: ColumnWithTasks) {
		setIsEditingColumn(true);
		setEditingColumn(column);
		setEditingColumnTitle(column.title);
	}

	function handleDeleteColumn(column: ColumnWithTasks) {
		setIsDeletingColumn(true);
		setDeletingColumn(column);
	}

	async function handleUpdateColumn(e: React.FormEvent) {
		e.preventDefault();

		if (!editingColumnTitle.trim() || !editingColumn) return;

		await updateColumn(editingColumn.id, editingColumnTitle.trim());

		setEditingColumnTitle('');
		setIsEditingColumn(false);
		setEditingColumn(null);
	}

	async function DeleteColumn() {
		if (!deletingColumn) return;
		await deleteColumn(deletingColumn.id);
		setIsDeletingColumn(false);
		setDeletingColumn(null);
	}

	function handleDragStart(event: DragStartEvent) {
		const taskId = event.active.id as string;
		const task = columns
			.flatMap(column => column.tasks)
			.find(task => task.id === taskId);

		if (task) {
			setActiveTask(task);
			setDropTarget(null);

			const sourceColumn = columns.find(col =>
				col.tasks.some(t => t.id === taskId)
			);
			if (sourceColumn) {
				setSourceColumnId(sourceColumn.id);
				setActiveColumnId(sourceColumn.id);
			}
		}
	}

	function handleDragOver(event: DragOverEvent) {
		const { active, over } = event;
		if (!over) {
			setDropTarget(null);
			return;
		}

		const activeId = active.id as string;
		const overId = over.id as string;

		const sourceColumn = columns.find(col =>
			col.tasks.some(task => task.id === activeId)
		);

		const targetColumn =
			columns.find(col => col.tasks.some(task => task.id === overId)) ||
			columns.find(col => col.id === overId);

		if (!sourceColumn || !targetColumn) return;

		setActiveColumnId(targetColumn.id);

		// Trello-like: show drop placeholder only when dragging to another column, at exact index
		if (sourceColumn.id !== targetColumn.id) {
			const overTask = targetColumn.tasks.find(t => t.id === overId);
			const index =
				overTask !== undefined
					? targetColumn.tasks.findIndex(t => t.id === overId)
					: 0;
			setDropTarget({ columnId: targetColumn.id, index });
		} else {
			setDropTarget(null);
		}
	}

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over) {
			setActiveTask(null);
			setActiveColumnId(null);
			setSourceColumnId(null);
			setDropTarget(null);
			return;
		}

		const taskId = active.id as string;
		const overId = over.id as string;

		const sourceColumn = columns.find(col =>
			col.tasks.some(task => task.id === taskId)
		);

		// If dropped on column body/header
		let targetColumn = columns.find(col => col.id === overId);

		// If dropped on another task
		if (!targetColumn) {
			targetColumn = columns.find(col =>
				col.tasks.some(task => task.id === overId)
			);
		}

		if (sourceColumn && targetColumn) {
			const oldIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
			const newIndex = targetColumn.tasks.findIndex(task => task.id === overId);

			const isSameColumn = sourceColumn.id === targetColumn.id;

			// Trello-like:
			// - в межах однієї колонки одразу оновлюємо UI локально (optimistic),
			//   а потім синхронізуємо порядок з бекендом
			// - при переносі в іншу колонку також робимо optimistic оновлення
			if (isSameColumn) {
				if (newIndex !== -1 && oldIndex !== newIndex) {
					setColumns((prev: ColumnWithTasks[]) => {
						const newColumns = [...prev];
						const column = newColumns.find(col => col.id === sourceColumn.id);
						if (!column) return prev;

						const tasks = [...column.tasks];
						const [removed] = tasks.splice(oldIndex, 1);
						tasks.splice(newIndex, 0, removed);
						column.tasks = tasks;

						return newColumns;
					});

					await moveTask(taskId, targetColumn.id, newIndex);
				}
			} else {
				const targetOrder =
					dropTarget?.columnId === targetColumn.id ? dropTarget.index : 0;

				// Optimistic оновлення UI між колонками
				setColumns((prev: ColumnWithTasks[]) => {
					const newColumns = prev.map(col => ({
						...col,
						tasks: [...col.tasks],
					}));

					const fromCol = newColumns.find(col => col.id === sourceColumn.id);
					const toCol = newColumns.find(col => col.id === targetColumn!.id);

					if (!fromCol || !toCol) return prev;

					const fromIndex = fromCol.tasks.findIndex(t => t.id === taskId);
					if (fromIndex === -1) return prev;

					const [movedTask] = fromCol.tasks.splice(fromIndex, 1);
					const insertIndex = Math.min(
						Math.max(targetOrder, 0),
						toCol.tasks.length
					);
					toCol.tasks.splice(insertIndex, 0, movedTask);

					return newColumns;
				});

				// Синхронізація з бекендом
				await moveTask(taskId, targetColumn.id, targetOrder);
			}
		}

		setActiveTask(null);
		setActiveColumnId(null);
		setSourceColumnId(null);
		setDropTarget(null);
	}

	return (
		<>
			<div className='min-h-screen bg-gray-50'>
				<Navbar />
				<div className='container mx-auto px-4 py-3 sm:py-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-2 min-w-0'>
							<Link
								href='/dashboard'
								className='flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base text-gray-400 hover:text-gray-600 shrink-0 transition-colors duration-200 '
							>
								<ArrowLeft className='h-4 w-4 sm:h-5 sm:w-5' />
								<span className='hidden sm:inline-block mr-0'>
									Back to Dashboard
								</span>
								<span className='sm:hidden'>Back</span>
							</Link>
							<div className='h-4 sm:h-5 w-px bg-gray-200' />
							<div className='flex items-center space-x-2'>
								<div
									className={`h-6 w-6 sm:h-8 sm:w-8 rounded-full ${board?.color}`}
								/>
								<span className='text-md font-semibold text-gray-700 truncate max-w-[200px] md:max-w-[350px] lg:max-w-[600px]'>
									{board?.title}
								</span>

								<Button
									variant='ghost'
									size='sm'
									className='h-7 w-7 p-0 shrink-0'
									onClick={() => {
										setNewTitle(board?.title ?? '');
										setNewColor(board?.color ?? '');
										setIsEditing(true);
									}}
								>
									<MoreHorizontal />
								</Button>
							</div>
						</div>
						<div className='flex items-center space-x-2 sm:space-x-4 shrink-0'>
							<Button
								variant='outline'
								size='sm'
								className={`text-xs sm:text-sm cursor-pointer ${
									filterCount && filterCount > 0
										? 'bg-gray-200 text-gray-700 border-gray-300'
										: ''
								}`}
								onClick={() => {
									setFilterOpen(true);
								}}
							>
								<Filter className='h-3 w-3 sm:h-4 sm:w-4' /> <span>Filter</span>{' '}
								{filterCount && filterCount > 0 && (
									<Badge
										variant={'secondary'}
										className='text-xs text-gray-700 border-gray-300'
									>
										{filterCount}
									</Badge>
								)}
							</Button>
						</div>
					</div>
				</div>
				<Dialog open={isEditing} onOpenChange={setIsEditing}>
					<DialogContent className='w-[95vw] max-w-[425px] mx-auto'>
						<DialogHeader>
							<DialogTitle className='text-2xl font-bold'>
								Edit Board
							</DialogTitle>
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
										<Button
											key={priority}
											variant={
												filters.priority.includes(priority)
													? 'default'
													: 'outline'
											}
											size='sm'
											onClick={() => {
												const newPriorities = filters.priority.includes(
													priority
												)
													? filters.priority.filter(p => p !== priority)
													: [...filters.priority, priority];
												handleFIlterChange(
													'priority',
													newPriorities as string[]
												);
											}}
										>
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
								<Input
									type='date'
									id='dueDate'
									className='text-sm'
									value={filters.dueDate || ''}
									onChange={e =>
										handleFIlterChange('dueDate', e.target.value || null)
									}
								/>
							</div>
							<div className='flex justify-end gap-2 pt-4'>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={clearFilters}
								>
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
								<form className='space-y-2' onSubmit={e => handleCreateTask(e)}>
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
														{priority.charAt(0).toUpperCase() +
															priority.slice(1)}
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
					<DndContext
						sensors={sensors}
						collisionDetection={rectIntersection}
						onDragStart={handleDragStart}
						onDragOver={handleDragOver}
						onDragEnd={handleDragEnd}
					>
						<DragOverlay>
							{activeTask && <TaskOverlay task={activeTask} />}
						</DragOverlay>

						<div
							className='min-h-[calc(100vh-200px)] flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto 
					lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2 
					lg:[&::-webkit-scrollbar-track]:bg-gray-100 
					lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full 
					space-y-4 lg:space-y-0'
						>
							{filteredColumns.map(column => (
								<DroppableColumn
									key={column.id}
									column={column}
									onCreateTask={handleCreateTask}
									onEditColumn={handleEditColumn}
									onDeleteColumn={handleDeleteColumn}
								>
									<SortableContext
										items={column.tasks.map(task => task.id)}
										strategy={verticalListSortingStrategy}
									>
										<div
											className={`space-y-3 ${
												column.tasks.length > 0 ? 'mb-3' : ''
											}`}
										>
											{/* Trello-like: drop indicator only in other column, at exact index */}
											{dropTarget &&
												dropTarget.columnId === column.id &&
												sourceColumnId !== column.id &&
												dropTarget.index === 0 && (
													<div
														className='h-10 w-full rounded-xl bg-gray-50 border opacity-80'
														aria-hidden
													/>
												)}
											{column.tasks.map((task, i) => (
												<Fragment key={task.id}>
													{dropTarget &&
														dropTarget.columnId === column.id &&
														sourceColumnId !== column.id &&
														dropTarget.index === i + 1 && (
															<div
																className='h-10 w-full rounded-xl bg-gray-50 border opacity-80'
																aria-hidden
															/>
														)}
													<SortableTaskCard task={task} />
												</Fragment>
											))}
										</div>
									</SortableContext>
								</DroppableColumn>
							))}

							<div className='w-full lg:shrink-0 lg:w-80 '>
								<Button
									onClick={() => setIsCreatingColumn(true)}
									variant='outline'
									className='w-full h-full min-h-52 border-dashed border-2 border-gray-300 cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-100'
								>
									<PlusIcon />
									Add a new column
								</Button>
							</div>
						</div>
					</DndContext>
				</main>
			</div>
			<Dialog open={isCreatingColumn} onOpenChange={setIsCreatingColumn}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className='text-2xl font-bold'>
							Create a new column
						</DialogTitle>
						<p className='text-sm text-gray-500'>
							Add new column to the board to organize your tasks
						</p>
					</DialogHeader>
					<form className='space-y-4' onSubmit={handleCreateColumn}>
						<div className='space-y-2'>
							<Label className='text-sm font-semibold' htmlFor='columnTitle'>
								Column Title
							</Label>
							<Input
								type='text'
								id='columnTitle'
								value={newColumnTitle}
								onChange={e => setNewColumnTitle(e.target.value)}
								placeholder='Enter column title..'
								required
								className='text-sm'
							/>
						</div>
						<div className='flex justify-end gap-2 pt-4'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								className='cursor-pointer'
								onClick={() => setIsCreatingColumn(false)}
							>
								Cancel
							</Button>
							<Button type='submit' size='sm' className='cursor-pointer'>
								Create column
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={isEditingColumn} onOpenChange={setIsEditingColumn}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className='text-2xl font-bold'>
							Edit column
						</DialogTitle>
						<p className='text-sm text-gray-500'>
							Update the title of the column
						</p>
					</DialogHeader>
					<form className='space-y-4' onSubmit={handleUpdateColumn}>
						<div className='space-y-2'>
							<Label className='text-sm font-semibold' htmlFor='columnTitle'>
								Column Title
							</Label>
							<Input
								type='text'
								id='columnTitle'
								value={editingColumnTitle}
								onChange={e => setEditingColumnTitle(e.target.value)}
								placeholder='Enter column title..'
								required
								className='text-sm'
							/>
						</div>
						<div className='flex justify-end gap-2 pt-4'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								className='cursor-pointer'
								onClick={() => {
									setIsEditingColumn(false);
									setEditingColumnTitle('');
									setEditingColumn(null);
								}}
							>
								Cancel
							</Button>
							<Button type='submit' size='sm' className='cursor-pointer'>
								Update column
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
			<Dialog open={isDeletingColumn} onOpenChange={setIsDeletingColumn}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className='text-2xl font-bold text-center'>
							Delete column
						</DialogTitle>
						<p className='text-sm text-gray-500 text-center'>
							Are you sure you want to delete this column?
						</p>
					</DialogHeader>

					<div className='flex justify-center gap-2 pt-4'>
						<Button
							type='button'
							variant='outline'
							size='lg'
							className='cursor-pointer'
							onClick={() => {
								setIsDeletingColumn(false);
								setDeletingColumn(null);
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={DeleteColumn}
							size='lg'
							className='cursor-pointer'
							variant='destructive'
						>
							Delete
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
