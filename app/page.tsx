import Navbar from '@/components/navbar';
import {
	CheckCircle2,
	Clock,
	LayoutDashboard,
	ShieldCheck,
} from 'lucide-react';

export default function Home() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-200 text-slate-900'>
			<Navbar />

			<main className='container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20'>
				<section className='grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-center'>
					<div className='space-y-6'>
						<div className='inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 backdrop-blur'>
							<span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600'>
								<CheckCircle2 className='h-3 w-3' />
							</span>
							<span>Beautiful Kanban boards for your day</span>
						</div>

						<h1 className='text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900'>
							Organize your tasks
							<br className='hidden sm:block' />
							<span className='text-emerald-600'> the calm way.</span>
						</h1>

						<p className='max-w-xl text-sm sm:text-base text-slate-600 leading-relaxed'>
							Plan your day, manage projects and track progress in a fast,
							focus‑first task board. Drag &amp; drop, priorities, due dates and
							a clean interface that stays out of your way.
						</p>

						<div className='flex flex-wrap items-center gap-4'>
							<div className='flex items-center gap-2 text-xs sm:text-sm text-slate-500'>
								<div className='flex -space-x-2'>
									<span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-medium ring-2 ring-slate-50'>
										<img
											src='https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png'
											alt='avatar'
											className='h-7 w-7 rounded-full'
										/>
									</span>
									<span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-medium ring-2 ring-slate-50'>
										<img
											src='https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png'
											alt='avatar'
											className='h-7 w-7 rounded-full'
										/>
									</span>
									<span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-medium ring-2 ring-slate-50'>
										<img
											src='https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_7.png'
											alt='avatar'
											className='h-7 w-7 rounded-full'
										/>
									</span>
								</div>
								<span>Join people keeping their work under control.</span>
							</div>
						</div>

						<div className='grid sm:grid-cols-3 gap-4 pt-4'>
							<div className='rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200'>
								<div className='mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600'>
									<LayoutDashboard className='h-4 w-4' />
								</div>
								<div className='text-xs uppercase tracking-wide text-slate-500'>
									Boards
								</div>
								<div className='mt-1 text-sm font-medium text-slate-900'>
									Clear overview of your work
								</div>
							</div>

							<div className='rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200'>
								<div className='mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600'>
									<Clock className='h-4 w-4' />
								</div>
								<div className='text-xs uppercase tracking-wide text-slate-500'>
									Priorities
								</div>
								<div className='mt-1 text-sm font-medium text-slate-900'>
									Focus on what matters today
								</div>
							</div>

							<div className='rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200'>
								<div className='mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600'>
									<ShieldCheck className='h-4 w-4' />
								</div>
								<div className='text-xs uppercase tracking-wide text-slate-500'>
									Sync
								</div>
								<div className='mt-1 text-sm font-medium text-slate-900'>
									Your tasks stay safe in the cloud
								</div>
							</div>
						</div>
					</div>

					<div className='relative'>
						<div className='pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/15 via-sky-500/10 to-transparent blur-3xl' />

						<div className='relative rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 overflow-hidden'>
							<div className='border-b border-slate-100 px-4 py-3 flex items-center justify-between bg-slate-50/80'>
								<div className='flex items-center gap-2 text-xs font-medium text-slate-500'>
									<span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600'>
										✓
									</span>
									<span>Today&apos;s board</span>
								</div>
								<span className='text-[10px] uppercase tracking-wide text-slate-400'>
									Preview
								</span>
							</div>

							<div className='px-4 py-4 bg-slate-50/60'>
								<div className='grid grid-cols-3 gap-3 text-xs'>
									<div className='rounded-2xl bg-white/90 p-3 shadow-sm border border-slate-100'>
										<div className='mb-2 flex items-center justify-between gap-2'>
											<span className='text-[11px] font-semibold text-slate-700'>
												To Do
											</span>
											<span className='rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500'>
												3
											</span>
										</div>
										<ul className='space-y-2'>
											<li className='rounded-lg bg-slate-50 px-2 py-1.5 text-[11px] text-slate-700'>
												Wireframe dashboard layout
											</li>
											<li className='rounded-lg bg-slate-50 px-2 py-1.5 text-[11px] text-slate-700'>
												Plan marketing emails
											</li>
										</ul>
									</div>

									<div className='rounded-2xl bg-white/90 p-3 shadow-sm border border-slate-100'>
										<div className='mb-2 flex items-center justify-between gap-2'>
											<span className='text-[11px] font-semibold text-slate-700'>
												In Progress
											</span>
											<span className='rounded-full bg-sky-50 px-2 py-0.5 text-[10px] text-sky-600'>
												2
											</span>
										</div>
										<ul className='space-y-2'>
											<li className='rounded-lg bg-sky-50/70 px-2 py-1.5 text-[11px] text-slate-700'>
												Implement drag &amp; drop
											</li>
											<li className='rounded-lg bg-sky-50/70 px-2 py-1.5 text-[11px] text-slate-700'>
												Connect Supabase
											</li>
										</ul>
									</div>

									<div className='rounded-2xl bg-white/90 p-3 shadow-sm border border-slate-100'>
										<div className='mb-2 flex items-center justify-between gap-2'>
											<span className='text-[11px] font-semibold text-slate-700'>
												Done
											</span>
											<span className='rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-600'>
												4
											</span>
										</div>
										<ul className='space-y-2'>
											<li className='rounded-lg bg-emerald-50 px-2 py-1.5 text-[11px] text-slate-700'>
												Authentication with Clerk
											</li>
											<li className='rounded-lg bg-emerald-50 px-2 py-1.5 text-[11px] text-slate-700'>
												Responsive layout
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>

						<p className='mt-4 text-[11px] text-slate-500 text-center'>
							What you see here is a preview. Your real boards live in the
							dashboard.
						</p>
					</div>
				</section>

				<section className='mt-16 border-t border-slate-200 pt-10'>
					<div className='grid md:grid-cols-3 gap-8 text-sm text-slate-600'>
						<div>
							<h2 className='text-sm font-semibold text-slate-900 mb-2'>
								Why another todo app?
							</h2>
							<p>
								Because you don&apos;t need a project management monster. You
								need a focused board that opens fast and lets you drag tasks in
								seconds.
							</p>
						</div>
						<div>
							<h2 className='text-sm font-semibold text-slate-900 mb-2'>
								Built for real work
							</h2>
							<p>
								Priorities, due dates, assignees and clear columns. Enough
								structure to stay on track, without forcing a heavy process on
								you or your team.
							</p>
						</div>
						<div>
							<h2 className='text-sm font-semibold text-slate-900 mb-2'>
								Ready when you are
							</h2>
							<p>
								Sign in, create your first board and start moving tasks in less
								than a minute. Your dashboard is just one click away.
							</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
