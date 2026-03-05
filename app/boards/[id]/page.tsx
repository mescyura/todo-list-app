'use client';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBoard } from '@/lib/hooks/useBoards';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function BoardPage() {
	const { id } = useParams<{ id: string }>();
	const { board, columns, isLoading, error, updateBoard } = useBoard(id);
	const [newTitle, setNewTitle] = useState('');
	const [newColor, setNewColor] = useState('');
	const [isEditing, setIsEditing] = useState(false);

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
			/>
			<Dialog open={isEditing === true} onOpenChange={setIsEditing}>
				<DialogContent className='w-[95vw] max-w-[425px] mx-auto'>
					<DialogTitle className='text-2xl font-bold'>Edit Board</DialogTitle>
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
		</div>
	);
}
