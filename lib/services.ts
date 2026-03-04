import { SupabaseClient } from '@supabase/supabase-js';
import { Board, Column } from './supabase/models';

export const boardsService = {
	async getBoards(supabase: SupabaseClient, userId: string): Promise<Board[]> {
		const { data, error } = await supabase
			.from('boards')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false });

		if (error) {
			throw new Error(error.message);
		}

		return data || [];
	},

	async createBoard(
		supabase: SupabaseClient,
		board: Omit<Board, 'id' | 'created_at' | 'updated_at'>
	): Promise<Board> {
		const { data, error } = await supabase
			.from('boards')
			.insert(board)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return data;
	},
};

export const columnsService = {
	async createColumn(
		supabase: SupabaseClient,
		column: Omit<Column, 'id' | 'created_at'>
	): Promise<Column> {
		const { data, error } = await supabase
			.from('columns')
			.insert(column)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return data;
	},
};

export const boardDataService = {
	async createBoardWithDefaultColumns(
		supabase: SupabaseClient,
		boardData: {
			title: string;
			description?: string;
			color?: string;
			userId: string;
		}
	) {
		const board = await boardsService.createBoard(supabase, {
			title: boardData.title,
			description: boardData.description || null,
			color: boardData.color || 'bg-blue-500',
			user_id: boardData.userId,
		});

		const defaultColumns = [
			{
				title: 'To Do',
				sort_order: 0,
			},
			{
				title: 'In Progress',
				sort_order: 1,
			},
			{
				title: 'Review',
				sort_order: 2,
			},
			{
				title: 'Done',
				sort_order: 3,
			},
		];

		await Promise.all(
			defaultColumns.map(column => {
				return columnsService.createColumn(supabase, {
					...column,
					board_id: board.id,
					user_id: boardData.userId,
				});
			})
		);

		return board;
	},
};
