import React from 'react';
import checkIcon from '../assets/check.svg';
import uncheckIcon from '../assets/uncheck.svg';
import deleteIcon from '../assets/delete.svg';

const TodoItem = ({ id, completed, onCheck, onDelete, text }) => {
	return (
		<div className='flex items-start my-2 gap-2 p-4 rounded-xl shadow-md'>
			<div className='flex items-start flex-1 gap-2'>
				<img
					src={completed ? checkIcon : uncheckIcon}
					alt='check'
					onClick={() => onCheck(id)}
					className='w-7 h-7 cursor-pointer rounded-full transition-all duration-150 hover:scale-110 hover:bg-slate-200'
				/>
				<p
					className={`text-slate-700 mt-0.5 ${completed ? 'line-through' : ''}`}
				>
					{text}
				</p>
			</div>
			<img
				src={deleteIcon}
				onClick={() => onDelete(id)}
				alt='delete'
				className='w-7 h-7 cursor-pointer rounded-full transition-all duration-150 hover:scale-110'
			/>
		</div>
	);
};

export default TodoItem;
