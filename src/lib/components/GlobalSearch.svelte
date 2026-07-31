<script lang="ts">
	import { MagnifyingGlass, X, At, Mailbox, Ghost, Skull, Star } from 'phosphor-svelte';
	import { t } from '$lib/i18n';
	import { PLACEHOLDERS } from '$lib/constants/placeholders';

	import type { SearchResult } from '$lib/api/types';

	let isOpen = $state(false);
	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let isLoading = $state(false);
	let searchTimeout: any;

	function openModal() {
		isOpen = true;
		setTimeout(() => {
			const input = document.getElementById('global-search-input');
			if (input) input.focus();
		}, 50);
	}

	function closeModal() {
		isOpen = false;
		query = '';
		results = [];
	}

	import { searchGlobal } from '$lib/api/actions';

	function handleInput() {
		if (searchTimeout) clearTimeout(searchTimeout);
		if (query.length < 2) {
			results = [];
			isLoading = false;
			return;
		}

		isLoading = true;
		searchTimeout = setTimeout(async () => {
			try {
				results = await searchGlobal(query);
			} catch (err) {
				console.error(err);
			} finally {
				isLoading = false;
			}
		}, 300);
	}

	function getIcon(type: string) {
		switch (type) {
			case 'domain': return At;
			case 'mailbox': return Mailbox;
			case 'alias': return Ghost;
			case 'blacklist': return Skull;
			case 'whitelist': return Star;
			default: return MagnifyingGlass;
		}
	}

	import { getHighlightUrl } from '$lib/utils/routes';

	function getLink(type: string, title: string, subType: string = '') {
		return getHighlightUrl(type, title, subType);
	}
	
	function getColor(type: string) {
		switch (type) {
			case 'domain': return 'text-violet-500 bg-violet-50';
			case 'mailbox': return 'text-amber-500 bg-amber-50';
			case 'alias': return 'text-teal-600 bg-teal-50';
			case 'blacklist': return 'text-rose-500 bg-rose-50';
			case 'whitelist': return 'text-yellow-500 bg-yellow-50';
			default: return 'text-slate-500 bg-slate-50';
		}
	}
</script>

<button 
	class="btn bg-white border-slate-200 text-slate-500 hover:bg-slate-50 shadow-sm rounded-full px-4 font-normal flex items-center gap-2"
	onclick={openModal}
>
	<MagnifyingGlass size={18} />
	<span>{t('search.placeholder')}</span>
	<kbd class="kbd kbd-sm bg-slate-100 border-none text-slate-400">Ctrl+K</kbd>
</button>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 sm:px-0">
		<div 
			class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" 
			onclick={closeModal}
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Escape' && closeModal()}
		></div>
		
		<div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-slate-100">
			<!-- Header / Input -->
			<div class="flex items-center p-4 border-b border-slate-100 gap-3">
				<MagnifyingGlass size={24} class="text-slate-400 ml-2" />
				<input 
					id="global-search-input"
					type="text" 
					class="w-full bg-transparent border-none outline-none text-xl text-slate-700 placeholder-slate-400"
					placeholder={t('search.placeholder')}
					bind:value={query}
					oninput={handleInput}
				/>
				{#if isLoading}
					<span class="loading loading-spinner loading-sm text-amogus-blue"></span>
				{/if}
				<button class="btn btn-circle btn-sm btn-ghost text-slate-400 hover:bg-slate-100" onclick={closeModal}>
					<X size={20} />
				</button>
			</div>

			<!-- Results Area -->
			<div class="global-search-results overflow-y-auto p-4 flex-1">
				{#if query.length > 0 && query.length < 2}
					<div class="text-center py-8 text-slate-400">
						{t('search.min_chars')}
					</div>
				{:else if query.length >= 2 && results.length === 0 && !isLoading}
					<div class="text-center py-12 text-slate-400 flex flex-col items-center">
						<Ghost size={48} class="mb-3 opacity-50" />
						<p>{t('search.no_results').replace('{query}', query)}</p>
					</div>
				{:else if results.length > 0}
					<div class="space-y-2">
						{#each results as result (result.type + result.title)}
							{@const Icon = getIcon(result.type)}
							{@const colorClass = getColor(result.type)}
							<a 
								href={getLink(result.type, result.title, result.subType)} 
								onclick={closeModal}
								class="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
							>
								<div class="p-3 rounded-xl {colorClass}">
									<Icon size={24} weight="regular" />
								</div>
								<div class="flex-1 min-w-0">
									<h4 class="text-slate-800 font-bold text-lg truncate">{result.title}</h4>
									<p class="text-slate-500 text-sm truncate">{result.details}</p>
								</div>
								<div class="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
									{t('search.type.' + result.type)}
								</div>
							</a>
						{/each}
					</div>
				{:else if !query}
					<div class="text-center py-12 text-slate-400">
						{t('search.empty_state')}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<svelte:window on:keydown={(e) => {
	if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
		e.preventDefault();
		openModal();
	}
	if (e.key === 'Escape' && isOpen) {
		closeModal();
	}
}} />
