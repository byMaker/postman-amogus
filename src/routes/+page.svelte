<script lang="ts">
	import { Envelope, GlobeHemisphereWest, Ghost, Skull, Star, SquaresFour, At, EnvelopeSimple, Numpad, ThumbsUp, Gear } from 'phosphor-svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';

	let { data } = $props();
	let stats = data.stats;
	let showSettings = $state(false);
</script>

<div class="space-y-6">
	<!-- Заголовок -->
	<div class="flex items-center justify-between px-6 pb-2">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<SquaresFour size={36} weight="fill" class="text-cyan-500" />
				Dashboard
			</h2>
			<p class="text-slate-500 mt-1">System overview and statistics</p>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
		<!-- Domains Card -->
		<div class="rounded-[32px] bg-amogus-light p-6 shadow-sm border border-amogus-blue/20 flex flex-col items-center text-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<At size={48} weight="regular" class="text-violet-500 mb-4" />
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">Domains</p>
			<p class="mt-2 text-5xl font-black text-violet-500">{stats.totalDomains}</p>
			{#if stats.inactiveDomains > 0}
				<p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{stats.inactiveDomains} Inactive</p>
			{:else}
				<p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">All Active</p>
			{/if}
		</div>

		<!-- Mailboxes Card -->
		<div class="rounded-[32px] bg-amogus-light p-6 shadow-sm border border-amogus-blue/20 flex flex-col items-center text-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<EnvelopeSimple size={48} weight="regular" class="text-amber-500 mb-4" />
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">Mailboxes</p>
			<p class="mt-2 text-5xl font-black text-amber-500">{stats.totalMailboxes}</p>
			{#if stats.inactiveMailboxes > 0}
				<p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{stats.inactiveMailboxes} Inactive</p>
			{:else}
				<p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">All Active</p>
			{/if}
		</div>

		<!-- Aliases Card -->
		<div class="rounded-[32px] bg-amogus-light p-6 shadow-sm border border-amogus-blue/20 flex flex-col items-center text-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<Ghost size={48} weight="regular" class="text-teal-600 mb-4" />
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">Aliases</p>
			<p class="mt-2 text-5xl font-black text-teal-600">{stats.totalAliases}</p>
			{#if stats.inactiveAliases > 0}
				<p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{stats.inactiveAliases} Inactive</p>
			{:else}
				<p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">All Active</p>
			{/if}
		</div>

		<!-- Blacklists Card -->
		<div class="rounded-[32px] bg-amogus-light p-6 shadow-sm border border-amogus-blue/20 flex flex-col items-center text-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<Skull size={48} weight="regular" class="text-rose-500 mb-4" />
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">Blacklists</p>
			<p class="mt-4 text-2xl font-black text-rose-500 flex gap-2 w-full justify-center">
				<span class="flex-1 text-center">{stats.blacklists.domains}</span>
				<span class="text-slate-300 font-normal">|</span>
				<span class="flex-1 text-center">{stats.blacklists.emails}</span>
				<span class="text-slate-300 font-normal">|</span>
				<span class="flex-1 text-center">{stats.blacklists.ips}</span>
			</p>
			<div class="mt-3 flex gap-2 w-full justify-center text-slate-400">
				<span class="flex-1 flex justify-center" title="Domains"><At size={18} weight="fill" /></span>
				<span class="text-transparent">|</span>
				<span class="flex-1 flex justify-center" title="Emails"><EnvelopeSimple size={18} weight="fill" /></span>
				<span class="text-transparent">|</span>
				<span class="flex-1 flex justify-center" title="IP Addresses"><Numpad size={18} weight="fill" /></span>
			</div>
		</div>

		<!-- Whitelists Card -->
		<div class="rounded-[32px] bg-amogus-light p-6 shadow-sm border border-amogus-blue/20 flex flex-col items-center text-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<Star size={48} weight="regular" class="text-yellow-500 mb-4" />
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">Whitelists</p>
			<p class="mt-4 text-2xl font-black text-yellow-500 flex gap-2 w-full justify-center">
				<span class="flex-1 text-center">{stats.whitelists.domains}</span>
				<span class="text-slate-300 font-normal">|</span>
				<span class="flex-1 text-center">{stats.whitelists.emails}</span>
				<span class="text-slate-300 font-normal">|</span>
				<span class="flex-1 text-center">{stats.whitelists.ips}</span>
			</p>
			<div class="mt-3 flex gap-2 w-full justify-center text-slate-400">
				<span class="flex-1 flex justify-center" title="Domains"><At size={18} weight="fill" /></span>
				<span class="text-transparent">|</span>
				<span class="flex-1 flex justify-center" title="Emails"><EnvelopeSimple size={18} weight="fill" /></span>
				<span class="text-transparent">|</span>
				<span class="flex-1 flex justify-center" title="IP Addresses"><Numpad size={18} weight="fill" /></span>
			</div>
		</div>
	</div>

	<div class="mt-8 rounded-[32px] bg-white p-8 border border-slate-200 shadow-sm flex items-center gap-6">
		<div>
			<h3 class="text-2xl text-amogus-dark mb-3">Postman Amogus Control Center</h3>
			<p class="text-slate-600 text-lg leading-relaxed">
				Welcome to your secure mail infrastructure. From here, you can seamlessly provision <strong class="text-amogus-dark">Domains</strong> and <strong class="text-amogus-dark">Mailboxes</strong>, map complex routing paths via <strong class="text-amogus-dark">Aliases</strong>, and protect your server using granular <strong class="text-amogus-dark">Blacklists</strong> and <strong class="text-amogus-dark">Whitelists</strong>. 
			</p>
		</div>
	</div>

	<!-- Dashboard Footer -->
	<div class="flex justify-center mt-8">
		<button 
			onclick={() => showSettings = true}
			class="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-amber-900 hover:bg-amber-900/5 rounded-full transition-colors font-bold uppercase tracking-wider text-sm"
		>
			<Gear size={20} weight="bold" />
			Settings
		</button>
	</div>
</div>

<SettingsModal bind:show={showSettings} />
