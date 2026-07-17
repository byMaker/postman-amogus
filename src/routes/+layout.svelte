<script lang="ts">
	import '../app.css';
	let { children } = $props();

	// Определение разделов навигации (используем чистые SVG вместо эмодзи)
	const sections = [
		{ 
			id: 'dashboard', 
			name: 'Dashboard', 
			path: '/',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7v10"/><path d="M11 7v10"/><path d="M15 7v10"/></svg>`
		},
		{ 
			id: 'domains', 
			name: 'Domains', 
			path: '/domains',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
		},
		{ 
			id: 'mailboxes', 
			name: 'Mailboxes', 
			path: '/mailboxes',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`
		},
		{ 
			id: 'aliases', 
			name: 'Aliases', 
			path: '/aliases',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>`
		}
	];
</script>

<div class="min-h-screen bg-[#F5F7FA] p-6 font-sans text-slate-800">
	<!-- Header / Navigation Bar -->
	<header class="mx-auto max-w-6xl mb-8 flex items-center justify-between rounded-full bg-[#E3F2FD] p-4 shadow-sm border border-blue-100">
		<!-- Logo and Title -->
		<div class="flex items-center gap-4 pl-2">
			<img src="/postman_amogus_logo_small.png" alt="Postman Amogus Logo" class="h-24 w-24 object-cover rounded-full -ml-2" />
			<h1 class="text-2xl font-black text-[#1E3A8A] tracking-wide uppercase">Postman <br/> <span class="text-[#0284C7]">Amogus</span></h1>
		</div>

		<!-- Navigation Circles -->
		<nav class="flex gap-4 pr-2">
			{#each sections as section}
				<a 
					href={section.path}
					class="flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#1E3A8A] shadow-md transition-all hover:bg-[#1E3A8A] hover:text-white hover:scale-105 active:scale-95"
					title={section.name}
				>
					{@html section.icon}
				</a>
			{/each}
		</nav>
	</header>

	<!-- Main Content Area -->
	<main class="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-lg min-h-[60vh] border border-slate-200">
		{@render children()}
	</main>
</div>

<style>
	:global(body) {
		background-color: #F5F7FA;
	}
</style>
