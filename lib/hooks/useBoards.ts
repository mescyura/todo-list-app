'use client';
import { useUser } from '@clerk/nextjs';
import { boardDataService, boardsService, taskService } from '../services';
import { useEffect, useState } from 'react';
import { Board, Column, ColumnWithTasks } from '../supabase/models';
import { useSupabase } from '../supabase/SupabaseProvider';

export function useBoards() {
	const { user } = useUser();
	const { supabase } = useSupabase();
	const [boards, setBoards] = useState<Board[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (user && supabase) {
			loadBoards();
		}
	}, [user, supabase]);

	async function loadBoards() {
		if (!user) return;
		try {
			setIsLoading(true);
			setError(null);
			const data = await boardsService.getBoards(supabase!, user.id);
			setBoards(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load boards');
		} finally {
			setIsLoading(false);
		}
	}

	async function createBoard(boardData: {
		title: string;
		description?: string;
		color?: string;
	}) {
		if (!user) {
			throw new Error('User not authenticated');
		}

		try {
			const newBoard = await boardDataService.createBoardWithDefaultColumns(
				supabase!,
				{
					...boardData,
					userId: user?.id,
				}
			);
			setBoards(prev => [newBoard, ...prev]);
		} catch (error) {
			setError(
				error instanceof Error ? error.message : 'Failed to create board'
			);
		}
	}

	return { createBoard, boards, isLoading, error };
}

export function useBoard(boardId: string) {
	const { supabase } = useSupabase();
	const [board, setBoard] = useState<Board | null>(null);
	const [columns, setColumns] = useState<ColumnWithTasks[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (boardId) {
			loadBoard(boardId);
		}
	}, [boardId, supabase]);

	async function loadBoard(boardId: string) {
		if (!boardId) return;
		try {
			setIsLoading(true);
			setError(null);
			const data = await boardDataService.getBoardWithColumns(
				supabase!,
				boardId
			);
			setBoard(data.board);
			setColumns(data.columnsWithTasks);
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Failed to load board');
		} finally {
			setIsLoading(false);
		}
	}

	async function updateBoard(boardId: string, boardData: Partial<Board>) {
		try {
			const updatedBoard = await boardsService.updateBoard(
				supabase!,
				boardId,
				boardData
			);
			setBoard(updatedBoard);
			return updatedBoard;
		} catch (error) {
			setError(
				error instanceof Error ? error.message : 'Failed to update board'
			);
		}
	}

	async function createRealTask(
		columnId: string,
		taskData: {
			title: string;
			description?: string;
			assignee?: string;
			due_date?: string;
			priority: 'low' | 'medium' | 'high';
		}
	) {
		try {
			const newTask = await taskService.createTask(supabase!, {
				title: taskData.title,
				description: taskData.description || null,
				assignee: taskData.assignee || null,
				due_date: taskData.due_date || null,
				priority: taskData.priority || 'medium',
				column_id: columnId,
				sort_order:
					columns.find(column => column.id === columnId)?.tasks.length || 0,
			});

			setColumns(prev =>
				prev.map(column =>
					column.id === columnId
						? { ...column, tasks: [...column.tasks, newTask] }
						: column
				)
			);
			return newTask;
		} catch (error) {
			setError(
				error instanceof Error ? error.message : 'Failed to create task'
			);
		}
	}

	return { board, columns, isLoading, error, updateBoard, createRealTask };
}
