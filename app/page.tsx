import Navbar from '@/components/navbar';
import Image from 'next/image';

export default function Home() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200'>
			<Navbar />
		</div>
	);
}
