'use client';
import { useUser } from '@clerk/nextjs';
import { boardDataService, boardsService } from '../services';
import { use, useEffect, useState } from 'react';
import { Board } from '../supabase/models';
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
