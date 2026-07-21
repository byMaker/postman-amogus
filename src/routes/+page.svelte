<script lang="ts">
	import { Envelope, GlobeHemisphereWest, Ghost, Skull, Star, SquaresFour, At, EnvelopeSimple, Numpad, ThumbsUp, Gear, Mailbox, Info } from 'phosphor-svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import { t } from '$lib/i18n';

	let { data } = $props();
	let stats = data.stats;
	let showSettings = $state(false);
	let settingsTab = $state('general');

	function openSettings(tab: string) {
		settingsTab = tab;
		showSettings = true;
	}
</script>

<div class="space-y-6">
	<!-- Заголовок -->
	<div class="flex items-center justify-between px-0 md:px-6 pb-2">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<SquaresFour size={36} weight="fill" class="text-cyan-500" />
				{t('nav.dashboard')}
			</h2>
			<p class="text-slate-500 mt-1">{t('nav.dashboard.desc')}</p>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
		<!-- Domains Card -->
		<div class="rounded-[32px] bg-amogus-light p-6 shadow-sm border border-amogus-blue/20 flex flex-col items-center text-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<At size={48} weight="regular" class="text-violet-500 mb-4" />
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">{t('card.domains')}</p>
			<p class="mt-2 text-5xl font-black text-violet-500">{stats.totalDomains}</p>
			{#if stats.inactiveDomains > 0}
				<p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('status.inactive_count').replace('{count}', stats.inactiveDomains.toString())}</p>
			{:else}
				<p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('status.all_active')}</p>
			{/if}
		</div>

		<!-- Mailboxes Card -->
		<div class="rounded-[32px] bg-amogus-light p-6 shadow-sm border border-amogus-blue/20 flex flex-col items-center text-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<Mailbox size={48} weight="regular" class="text-amber-500 mb-4" />
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">{t('card.mailboxes')}</p>
			<p class="mt-2 text-5xl font-black text-amber-500">{stats.totalMailboxes}</p>
			{#if stats.inactiveMailboxes > 0}
				<p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('status.inactive_count').replace('{count}', stats.inactiveMailboxes.toString())}</p>
			{:else}
				<p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('status.all_active')}</p>
			{/if}
		</div>

		<!-- Aliases Card -->
		<div class="rounded-[32px] bg-amogus-light p-6 shadow-sm border border-amogus-blue/20 flex flex-col items-center text-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<Ghost size={48} weight="regular" class="text-teal-600 mb-4" />
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">{t('card.aliases')}</p>
			<p class="mt-2 text-5xl font-black text-teal-600">{stats.totalAliases}</p>
			{#if stats.inactiveAliases > 0}
				<p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('status.inactive_count').replace('{count}', stats.inactiveAliases.toString())}</p>
			{:else}
				<p class="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('status.all_active')}</p>
			{/if}
		</div>

		<!-- Blacklists Card -->
		<div class="rounded-[32px] bg-amogus-light p-6 shadow-sm border border-amogus-blue/20 flex flex-col items-center text-center transition-all hover:shadow-md" onmouseenter={(e) => { const t = e.currentTarget; t.style.transform = `translateY(-4px) rotate(${Math.random() > 0.5 ? '-' : ''}1deg)`; }} onmouseleave={(e) => { const t = e.currentTarget; t.style.transform = ''; }}>
			<Skull size={48} weight="regular" class="text-rose-500 mb-4" />
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">{t('card.blacklists')}</p>
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
			<p class="text-sm font-bold uppercase tracking-wider text-amogus-dark">{t('card.whitelists')}</p>
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
			<h3 class="text-2xl text-amogus-dark mb-3">{t('dashboard.title')}</h3>
			<p class="text-slate-600 text-lg leading-relaxed">
				{@html t('dashboard.desc')}
			</p>
		</div>
	</div>

	<!-- Dashboard Footer -->
	<div class="flex justify-center mt-8 gap-4">
		<button 
			onclick={() => openSettings('general')}
			class="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-amogus-blue hover:bg-slate-50 rounded-full transition-colors font-bold uppercase tracking-wider text-sm"
		>
			<Gear size={20} weight="bold" />
			{t('btn.settings')}
		</button>
		<button 
			onclick={() => openSettings('about')}
			class="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-amogus-blue hover:bg-slate-50 rounded-full transition-colors font-bold uppercase tracking-wider text-sm"
		>
			<Info size={20} weight="bold" />
			{t('btn.about')}
		</button>
	</div>
</div>

<SettingsModal bind:show={showSettings} bind:activeTab={settingsTab} />
