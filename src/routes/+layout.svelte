<script lang="ts">
	import "../app.css";
	import Toast from "$lib/components/Toast.svelte";
	import {
		SquaresFour,
		At,
		Mailbox,
		Ghost,
		Skull,
		Star,
		ChartPieSlice,
		List,
		X
	} from "phosphor-svelte";
	import ScrollToTop from "$lib/components/ScrollToTop.svelte";
	import { page } from "$app/stores";
	import { fade, fly } from 'svelte/transition';
	let { data, children } = $props();

	let mobileMenuOpen = $state(false);

	// Определение разделов навигации
	const baseSections = [
		{
			id: "dashboard",
			name: "Dashboard",
			path: "/",
			icon: SquaresFour,
			colorClass: "text-cyan-500",
		},
	];

	const analyticsSection = {
		id: "analytics",
		name: "Analytics",
		path: "/analytics",
		icon: ChartPieSlice,
		colorClass: "text-indigo-500",
	};

	const otherSections = [
		{
			id: "domains",
			name: "Domains",
			path: "/domains",
			icon: At,
			colorClass: "text-violet-500",
		},
		{
			id: "mailboxes",
			name: "Mailboxes",
			path: "/mailboxes",
			icon: Mailbox,
			colorClass: "text-amber-500",
		},
		{
			id: "aliases",
			name: "Aliases",
			path: "/aliases",
			icon: Ghost,
			colorClass: "text-teal-600",
		},
		{
			id: "blacklists",
			name: "Blacklists",
			path: "/blacklists",
			icon: Skull,
			colorClass: "text-rose-500",
		},
		{
			id: "whitelists",
			name: "Whitelists",
			path: "/whitelists",
			icon: Star,
			colorClass: "text-yellow-500",
		},
	];

	let sections = $derived(
		data.hasAnalytics
			? [...baseSections, analyticsSection, ...otherSections]
			: [...baseSections, ...otherSections],
	);
</script>

<div class="min-h-screen bg-amogus-bg p-6 font-sans text-slate-800">
	<!-- Header / Navigation Bar -->
	<header
		class="mx-auto max-w-6xl mb-8 flex items-center justify-between rounded-[32px] bg-amogus-light p-4 shadow-sm border border-blue-100"
	>
		<!-- Logo and Title -->
		<div class="flex items-center gap-4 pl-2">
			<img
				src="/postman_amogus_logo_small.png"
				alt="Postman Amogus Logo"
				class="h-24 w-24 object-cover rounded-full -ml-2"
			/>
			<h1 class="text-3xl text-amogus-dark tracking-wide uppercase mt-1">
				Postman <br /> <span class="text-amogus-blue">Amogus</span>
			</h1>
		</div>

		<!-- Desktop Navigation -->
		<nav class="hidden md:flex gap-2 pr-6">
			{#each sections as section}
				{@const active =
					section.path === "/"
						? $page.url.pathname === "/"
						: $page.url.pathname.startsWith(section.path)}
				{@const Icon = section.icon}
				<a
					href={section.path}
					class="group flex w-24 py-2 rounded-2xl flex-col items-center justify-center gap-1 transition-all duration-200 active:![transform:translateY(2px)_scale(0.95)] active:!shadow-none {active
						? 'bg-white/50 shadow-sm opacity-100'
						: 'opacity-70 hover:opacity-100 hover:bg-white hover:shadow-md hover:[transform:translateY(-4px)_rotate(var(--hover-angle))]'}"
					title={section.name}
					onmouseenter={(e) => {
						if (!active) {
							const angle = Math.random() > 0.5 ? 1.5 : -1.5;
							e.currentTarget.style.setProperty(
								"--hover-angle",
								`${angle}deg`,
							);
						}
					}}
				>
					<div class="flex items-center justify-center mt-1">
						<Icon
							size={32}
							weight={active ? "fill" : "regular"}
							class={section.colorClass}
						/>
					</div>
					<span
						class="text-[11px] font-bold uppercase tracking-wider {active
							? 'text-amogus-dark'
							: 'text-slate-500 group-hover:text-amogus-dark'} transition-colors"
						>{section.name}</span
					>
				</a>
			{/each}
		</nav>

		<!-- Mobile Menu Button -->
		<button 
			class="md:hidden p-4 text-amogus-dark hover:bg-slate-50 rounded-2xl mr-2"
			onclick={() => mobileMenuOpen = true}
		>
			<List size={32} weight="bold" />
		</button>
	</header>

	<!-- Mobile Full-screen Navigation Overlay -->
	{#if mobileMenuOpen}

		<div 
			class="fixed inset-0 z-[200] bg-white flex flex-col"
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
		>
			<div class="flex justify-between items-center p-6 border-b border-slate-100">
				<h2 class="text-2xl text-amogus-dark tracking-wide uppercase font-black">Menu</h2>
				<button 
					class="p-2 text-slate-400 hover:text-amogus-dark bg-slate-50 rounded-full"
					onclick={() => mobileMenuOpen = false}
				>
					<X size={28} weight="bold" />
				</button>
			</div>
			
			<div class="flex-1 overflow-y-auto p-6">
				<div class="grid grid-cols-2 gap-4">
					{#each sections as section, i}
						{@const active =
							section.path === "/"
								? $page.url.pathname === "/"
								: $page.url.pathname.startsWith(section.path)}
						{@const Icon = section.icon}
						<a
							href={section.path}
							class="flex flex-col items-center justify-center gap-3 p-6 rounded-[32px] border-2 transition-all duration-200 active:scale-95
								{active ? 'border-amogus-blue bg-amogus-blue/5' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'}"
							onclick={() => mobileMenuOpen = false}
							in:fly={{ y: 20, duration: 300, delay: i * 50 }}
						>
							<Icon
								size={48}
								weight={active ? "fill" : "regular"}
								class={section.colorClass}
							/>
							<span
								class="text-sm font-black uppercase tracking-widest {active ? 'text-amogus-dark' : 'text-slate-500'}"
							>
								{section.name}
							</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- Main Content Area -->
	<main class="mx-auto max-w-6xl relative z-10">
		{@render children()}
	</main>

	<!-- Page Mascot Container -->
	{#if $page.url.pathname !== "/" && $page.url.pathname !== "/analytics"}
		<div
			class="w-full h-[250px] bg-no-repeat bg-right-bottom bg-contain mt-0 md:mt-8 relative z-0"
			style={$page.url.pathname.startsWith("/mailboxes")
				? "background-image: url(/scene02.png);"
				: $page.url.pathname.startsWith("/aliases")
					? "background-image: url(/scene03.png);"
					: $page.url.pathname.startsWith("/domains")
						? "background-image: url(/scene04.png);"
						: $page.url.pathname.startsWith("/blacklists")
							? "background-image: url(/scene05.png);"
							: $page.url.pathname.startsWith("/whitelists")
								? "background-image: url(/scene01.png);"
								: ""}
		></div>
	{/if}

	<!-- Toasts Layer -->
	<Toast />

	<ScrollToTop />
</div>

<style>
	:global(body) {
		background-color: #f5f7fa;
	}
</style>
