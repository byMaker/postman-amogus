<script lang="ts">
	import '../app.css';
	import Toast from '$lib/components/Toast.svelte';
	import { SquaresFour, At, EnvelopeSimple, Ghost, Skull, Star, ChartPieSlice } from 'phosphor-svelte';
	import { page } from '$app/stores';
	let { data, children } = $props();

	// Определение разделов навигации
	const baseSections = [
		{ 
			id: 'dashboard', 
			name: 'Dashboard', 
			path: '/',
			icon: SquaresFour,
			colorClass: 'text-cyan-500'
		}
	];

	const analyticsSection = {
		id: 'analytics',
		name: 'Analytics',
		path: '/analytics',
		icon: ChartPieSlice,
		colorClass: 'text-indigo-500'
	};

	const otherSections = [
		{ 
			id: 'domains', 
			name: 'Domains', 
			path: '/domains',
			icon: At,
			colorClass: 'text-violet-500'
		},
		{ 
			id: 'mailboxes', 
			name: 'Mailboxes', 
			path: '/mailboxes',
			icon: EnvelopeSimple,
			colorClass: 'text-amber-500'
		},
		{ 
			id: 'aliases', 
			name: 'Aliases', 
			path: '/aliases',
			icon: Ghost,
			colorClass: 'text-indigo-500'
		},
		{ 
			id: 'blacklists', 
			name: 'Blacklists', 
			path: '/blacklists',
			icon: Skull,
			colorClass: 'text-rose-500'
		},
		{ 
			id: 'whitelists', 
			name: 'Whitelists', 
			path: '/whitelists',
			icon: Star,
			colorClass: 'text-emerald-500'
		}
	];

	let sections = $derived(data.hasAnalytics ? [...baseSections, analyticsSection, ...otherSections] : [...baseSections, ...otherSections]);
</script>

<div class="min-h-screen bg-amogus-bg p-6 font-sans text-slate-800">
	<!-- Header / Navigation Bar -->
	<header class="mx-auto max-w-6xl mb-8 flex items-center justify-between rounded-[32px] bg-amogus-light p-4 shadow-sm border border-blue-100">
		<!-- Logo and Title -->
		<div class="flex items-center gap-4 pl-2">
			<img src="/postman_amogus_logo_small.png" alt="Postman Amogus Logo" class="h-24 w-24 object-cover rounded-full -ml-2" />
			<h1 class="text-3xl text-amogus-dark tracking-wide uppercase mt-1">Postman <br/> <span class="text-amogus-blue">Amogus</span></h1>
		</div>

		<nav class="flex gap-6 pr-6">
			{#each sections as section}
				{@const active = section.path === '/' ? $page.url.pathname === '/' : $page.url.pathname.startsWith(section.path)}
				{@const Icon = section.icon}
				<a 
					href={section.path}
					class="group flex w-20 flex-col items-center justify-center gap-2 transition-opacity active:scale-95 {active ? '' : 'opacity-70 hover:opacity-100'}"
					title={section.name}
					onmouseenter={(e) => {
						const angle = Math.random() > 0.5 ? 45 : -45;
						e.currentTarget.style.setProperty('--hover-rotate', `${angle}deg`);
					}}
				>
					<div class="transition-transform duration-300 group-hover:[transform:rotate(var(--hover-rotate))] flex items-center justify-center">
						<Icon size={36} weight={active ? "fill" : "regular"} class={section.colorClass} />
					</div>
					<span class="text-[11px] font-bold uppercase tracking-wider {active ? 'text-amogus-dark' : 'text-slate-500 group-hover:text-amogus-dark'} transition-colors">{section.name}</span>
				</a>
			{/each}
		</nav>
	</header>

	<!-- Main Content Area -->
	<main class="mx-auto max-w-6xl">
		{@render children()}
	</main>

	<!-- Toasts Layer -->
	<Toast />
</div>

<style>
	:global(body) {
		background-color: #F5F7FA;
	}
</style>
