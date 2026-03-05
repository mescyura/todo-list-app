'use client';
import { useUser } from '@clerk/nextjs';
import { boardDataService, boardsService } from '../services';
import { useEffect, useState } from 'react';
import { Board, Column } from '../supabase/models';
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
	const [columns, setColumns] = useState<Column[]>([]);
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
			setColumns(data.columns);
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

	return { board, columns, isLoading, error, updateBoard };
}
