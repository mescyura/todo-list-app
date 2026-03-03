import React, { useEffect, useRef, useState } from 'react';
import logoIcon from '../assets/logo.svg';
import addIcon from '../assets/add.svg';

import TodoItem from './TodoItem';

const Todo = () => {
	const location = window.location.href;

	const [todos, setTodos] = useState(
		JSON.parse(localStorage.getItem(`${location}-todos`)) || []
	);

	const inputRef = useRef();

	useEffect(() => {
		localStorage.setItem(`${location}-todos`, JSON.stringify(todos));
	}, [todos]);

	const addTodo = () => {
		const inputText = inputRef.current.value.trim();
		if (inputText === '') return;

		const newTodo = {
			id: Date.now(),
			text: inputText,
			completed: false,
		};
		setTodos([...todos, newTodo]);
		inputRef.current.value = '';
	};

	const deleteTodo = id => {
		setTodos(todos.filter(todo => todo.id !== id));
	};

	const checkTodo = id => {
		setTodos(
			todos.map(todo =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
			)
		);
	};

	return (
		<div className='bg-white place-self-center w-11/12 max-w-md min-h-[550px] flex flex-col p-7 rounded-xl'>
			<div className='flex items-center gap-2'>
				<img src={logoIcon} className='w-10 h-10' alt='logo' />
				<h1 className='text-3xl font-semibold'>To-do list</h1>
			</div>

			<div className='flex items-center my-7 bg-gray-200 rounded-xl'>
				<input
					ref={inputRef}
					type='text'
					placeholder='Add a new task'
					className='bg-transparent border-0 outline-0 flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600'
				/>
				<button
					onClick={addTodo}
					className='bg-[#1E3A8A] text-white px-4 p-2 h-14 rounded-tr-xl rounded-br-xl cursor-pointer flex items-center justify-center gap-1 shrink-0'
				>
					Add
					<img src={addIcon} alt='add' className='w-5 h-5' />
				</button>
			</div>

			{todos.map(todo => (
				<TodoItem
					key={todo.id}
					id={todo.id}
					completed={todo.completed}
					onCheck={checkTodo}
					onDelete={deleteTodo}
					text={todo.text}
				/>
			))}
		</div>
	);
};

export default Todo;
