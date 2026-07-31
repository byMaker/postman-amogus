<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import EntryModal from '$lib/components/lists/EntryModal.svelte';
	import CommentPopover from '$lib/components/CommentPopover.svelte';
	import { invalidateAll, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { toast } from '$lib/state/toast.svelte';
	import { browser } from '$app/environment';
	import { NotePencil, Trash } from 'phosphor-svelte';
	import { t } from '$lib/i18n';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import ValidatedInput from '$lib/components/ValidatedInput.svelte';
	import { crossfade, fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 300),
		fallback(node, params) {
			return {
				duration: 300,
				easing: quintOut,
				css: t => `opacity: ${t}`
			};
		}
	});

	let { 
		title, 
		description, 
		icon: IconComponent,
		iconColor = 'text-slate-500',
		tabs = [],
		data = {},
		config
	} = $props();

	let activeSubTab = $state<string | undefined>(undefined);
	
	$effect(() => {
		if (activeSubTab === undefined) {
			const storageKey = `list_tab_${$page.url.pathname}`;
			activeSubTab = browser && localStorage.getItem(storageKey) ? localStorage.getItem(storageKey)! : tabs[0]?.id;
		}
	});

	$effect(() => {
		if (browser && activeSubTab) {
			const storageKey = `list_tab_${$page.url.pathname}`;
			localStorage.setItem(storageKey, activeSubTab);
		}
	});

	$effect(() => {
		const tab = $page.url.searchParams.get('tab');
		if (tab && activeSubTab !== tab) {
			activeSubTab = tab;
		}

		const highlight = $page.url.searchParams.get('highlight');
		if (highlight) {
			setTimeout(() => {
				const el = document.getElementById(`row-${highlight}`);
				if (el) {
					el.scrollIntoView({ behavior: 'smooth', block: 'center' });
					el.style.transition = 'background-color 0.15s ease-in-out';
					let count = 0;
					const interval = setInterval(() => {
						el.style.backgroundColor = count % 2 === 0 ? '#bae6fd' : '';
						count++;
						if (count >= 6) {
							clearInterval(interval);
							el.style.backgroundColor = '';
							
							const newUrl = new URL($page.url);
							newUrl.searchParams.delete('highlight');
							newUrl.searchParams.delete('tab');
							replaceState(newUrl, {});
						}
					}, 150);
				}
			}, 300);
		}
	});

	let activeTableKey = $derived.by(() => config.getTableKey(activeSubTab));

	let sortField = $state('target');
	let sortDir = $state('asc');
	let selectedStatus = $state('all');

	function toggleSort(field: string) {
		if (sortField === field) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDir = 'asc';
		}
	}

	let sortedData = $derived([...(data[activeTableKey] || [])].filter((item: any) => {
		const act = config.getIsActive(item);
		if (selectedStatus === 'active' && !act) return false;
		if (selectedStatus === 'disabled' && act) return false;
		return true;
	}).sort((a, b) => {
		const targetA = (config.getTarget(a) || '').toLowerCase();
		const targetB = (config.getTarget(b) || '').toLowerCase();
		const descA = (config.getDesc(a) || '').toLowerCase();
		const descB = (config.getDesc(b) || '').toLowerCase();
		const actA = config.getIsActive(a);
		const actB = config.getIsActive(b);

		let valA, valB;
		if (sortField === 'target') { valA = targetA; valB = targetB; }
		else if (sortField === 'description') { valA = descA; valB = descB; }
		else if (sortField === 'active') { valA = actA; valB = actB; }

		if (valA < valB) return sortDir === 'asc' ? -1 : 1;
		if (valA > valB) return sortDir === 'asc' ? 1 : -1;
		return 0;
	}));

	let showModal = $state(false);
	let isEditMode = $state(false);
	let showDeleteModal = $state(false);
	let currentEntry = $state({ id: '', target: '', description: '', active: true });

	function openAddModal() {
		isEditMode = false;
		currentEntry = { id: '', target: '', description: '', active: true };
		showModal = true;
	}

	function openEditModal(item: any) {
		isEditMode = true;
		const target = config.getTarget(item);
		const desc = config.getDesc(item) || '';
		const act = config.getIsActive(item);
		currentEntry = { id: item.id || item.dnsDomain, target, description: desc, active: act };
		showModal = true;
	}

	function requestDelete(item: any) {
		const target = config.getTarget(item);
		currentEntry = { id: item.id || item.dnsDomain, target, description: '', active: false };
		showDeleteModal = true;
	}

	async function handleQuickComment(item: any, newDesc: string) {
		const fd = new FormData();
		const target = config.getTarget(item);
		const act = config.getIsActive(item);

		fd.append('table', activeTableKey);
		fd.append('id', item.id || item.dnsDomain || '');
		fd.append('target', target);
		fd.append('description', newDesc);
		if (act) fd.append('active', 'on');

		try {
			await fetch('?/update', { method: 'POST', body: fd });
			toast.success(t('toast.saved'));
			await invalidateAll();
		} catch (e) {
			toast.error(t('toast.failed_save'));
		}
	}
</script>

<div class="space-y-6 max-w-6xl mx-auto">
	<div class="flex flex-col md:flex-row md:items-center justify-between px-0 md:px-6 pb-2 gap-4">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				{#if IconComponent}
					<IconComponent size={36} weight="fill" class={iconColor} />
				{/if}
				{title}
			</h2>
			<p class="text-slate-500 mt-1">{description}</p>
		</div>
		<div class="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
			<div class="dropdown dropdown-end w-full sm:w-auto">
				<div tabindex="0" role="button" class="btn w-full sm:w-auto flex justify-between sm:justify-center bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-sans shadow-sm rounded-full px-6">
					{selectedStatus === 'all' ? t('filter.all_statuses') : (selectedStatus === 'active' ? t('filter.active_only') : t('filter.disabled_only'))}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
				</div>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-xl bg-white rounded-2xl min-w-full w-max mt-2 border border-slate-100 font-sans text-slate-600">
					<li>
						<button onclick={() => selectedStatus = 'all'} class="whitespace-nowrap {selectedStatus === 'all' ? 'bg-amogus-light text-amogus-dark font-bold' : 'hover:bg-slate-50'}">
							<span class="w-4 inline-block">{selectedStatus === 'all' ? '✓' : ''}</span> {t('filter.all_statuses')}
						</button>
					</li>
					<li>
						<button onclick={() => selectedStatus = 'active'} class="whitespace-nowrap {selectedStatus === 'active' ? 'bg-amogus-light text-amogus-dark font-bold' : 'hover:bg-slate-50'}">
							<span class="w-4 inline-block text-emerald-500">{selectedStatus === 'active' ? '✓' : ''}</span> {t('filter.active_only')}
						</button>
					</li>
					<li>
						<button onclick={() => selectedStatus = 'disabled'} class="whitespace-nowrap {selectedStatus === 'disabled' ? 'bg-amogus-light text-amogus-dark font-bold' : 'hover:bg-slate-50'}">
							<span class="w-4 inline-block text-slate-500">{selectedStatus === 'disabled' ? '✓' : ''}</span> {t('filter.disabled_only')}
						</button>
					</li>
				</ul>
			</div>

			<button onclick={openAddModal} class="w-full sm:w-auto rounded-full bg-amogus-blue px-6 py-3 font-bold text-white shadow hover:bg-amogus-brown active:scale-95 transition-all mt-2 sm:mt-0">
				{t('btn.add_rule')}
			</button>
		</div>
	</div>

	<!-- Sub Navigation Tabs -->
	<div class="px-2 md:px-6 flex overflow-x-auto pb-4 custom-scrollbar">
		<div class="inline-flex bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner min-w-max mx-auto">
			{#each tabs as tab}
				{@const TabIcon = tab.icon}
				<button class="relative flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-colors duration-300 {activeSubTab === tab.id ? 'text-amogus-dark' : 'text-slate-500 hover:text-amogus-dark'}" onclick={() => activeSubTab = tab.id}>
					{#if activeSubTab === tab.id}
						<div class="absolute inset-0 bg-white rounded-full shadow-sm z-0" in:receive={{key: 'active-tab'}} out:send={{key: 'active-tab'}}></div>
					{/if}
					<span class="relative z-10 flex items-center gap-2">
						<TabIcon size={20} weight={activeSubTab === tab.id ? 'fill' : 'regular'} /> {tab.label}
					</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- List Data Table -->
	<div class="grid relative">
		{#key activeSubTab}
			<div class="rounded-[32px] border border-slate-200 shadow-sm bg-white col-start-1 row-start-1" 
				in:fly={{ y: 20, duration: 150, delay: 150 }} 
				out:fly={{ y: -20, duration: 150 }}>
				<div class="absolute top-0 left-0 right-0 h-[57px] bg-slate-50 rounded-t-[32px] border-b border-slate-200 hidden lg:block"></div>
				<table class="w-full text-left text-sm block lg:table relative z-10">
			<thead class="text-xs font-black uppercase tracking-widest text-amogus-blue hidden lg:table-header-group">
				<tr>
					<th class="px-6 py-5 cursor-pointer hover:text-amogus-blue select-none transition-colors" onclick={() => toggleSort('target')}>
						{config.getTargetLabel(activeSubTab)}
					</th>
					<th class="px-6 py-5 cursor-pointer hover:text-amogus-blue select-none transition-colors" onclick={() => toggleSort('active')}>
						{t('table.status')}
					</th>
					<th class="px-6 py-5 cursor-pointer hover:text-amogus-blue select-none transition-colors hidden lg:table-cell" onclick={() => toggleSort('description')}>
						{t('table.description')}
					</th>
					<th class="px-6 py-5 text-right">{t('table.actions')}</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100 bg-white block lg:table-row-group rounded-[32px] lg:rounded-none lg:rounded-b-[32px]">
				{#each sortedData as item, index (item.id || item.dnsDomain || item.domain || item.email || item.host)}
					{@const target = config.getTarget(item)}
					{@const desc = config.getDesc(item) || '—'}
					{@const act = config.getIsActive(item)}
					<tr id="row-{target}" class="hover:bg-slate-50 transition-colors block lg:table-row p-4 lg:p-0 max-lg:border-b max-lg:border-slate-100 max-lg:last:border-b-0 group first:rounded-t-[32px] lg:first:rounded-none last:rounded-b-[32px]">
						<td class="flex justify-between items-center lg:table-cell px-2 py-3 lg:px-6 lg:py-5 font-bold {act ? 'text-amogus-dark' : 'text-slate-400'} text-sm transition-colors max-lg:border-b max-lg:border-b-slate-50 {index === sortedData.length - 1 ? 'lg:rounded-bl-[32px]' : ''}">
							<span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{config.getTargetLabel(activeSubTab)}</span>
							<span class="text-right lg:text-left truncate max-w-[200px] lg:max-w-none">
							{#if activeSubTab === 'domains'}
								*{target}
							{:else}
								{target}
							{/if}
							</span>
						</td>
						<td class="flex justify-between items-center lg:table-cell px-2 py-3 lg:px-6 lg:py-5 max-lg:border-b max-lg:border-b-slate-50">
							<span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('table.status')}</span>
							{#if act}
								<span class="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-xs tracking-wider">{t('status.active')}</span>
							{:else}
								<span class="px-3 py-1 rounded-full bg-slate-200 text-slate-600 font-bold text-xs tracking-wider">{t('status.inactive')}</span>
							{/if}
						</td>
						<td class="flex justify-between items-center lg:table-cell px-2 py-3 lg:px-6 lg:py-5 max-lg:border-b max-lg:border-b-slate-50">
							<span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('table.description')}</span>
							<div class="flex items-center justify-end lg:justify-start gap-2">
								<CommentPopover
									comment={desc === '—' ? '' : desc}
									onsave={(newDesc) => {
										item.description = newDesc;
										handleQuickComment(item, newDesc);
									}}
								/>
								<span class="text-slate-500 truncate max-w-[150px] sm:max-w-[200px] lg:max-w-[300px] xl:max-w-[400px] block desc-hide-lg">{desc}</span>
							</div>
						</td>
						<td class="flex justify-between items-center lg:table-cell px-2 py-3 lg:px-6 lg:py-5 lg:text-right {index === sortedData.length - 1 ? 'lg:rounded-br-[32px]' : ''}">
							<span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('table.actions')}</span>
							<div class="flex justify-end gap-3 transition-opacity">
								<Tooltip text={t('btn.edit')} position="top">
									<button onclick={() => openEditModal(item)} class="text-amogus-blue hover:text-white hover:bg-amogus-blue bg-blue-50 p-2 rounded-full transition-colors">
										<NotePencil size={24} weight="fill" />
									</button>
								</Tooltip>
								<Tooltip text={t('btn.delete')} position="top">
									<button onclick={() => requestDelete(item)} class="text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 p-2 rounded-full transition-colors">
										<Trash size={24} weight="fill" />
									</button>
								</Tooltip>
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="4" class="px-6 py-12 text-center text-slate-500 rounded-b-[32px]">
							{(data[activeTableKey] || []).length === 0 ? config.emptyMessage : t('table.filtered_empty')}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
			</div>
		{/key}
	</div>
</div>

<Modal bind:show={showDeleteModal} title={t('modal.delete')}>
	<div class="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl mb-8 shadow-sm">
		<h3 class="font-bold text-xl mb-3 text-rose-900">{t('modal.are_you_sure')}</h3>
		<p class="mb-5 text-sm">{t('modal.about_to_delete')} <span class="font-bold px-1.5 py-0.5 bg-rose-200 rounded text-rose-900">{currentEntry?.target}</span>.</p>
	</div>
	<form method="POST" action="?/delete" use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success' && (result as any).data?.success) {
				toast.success(t('toast.deleted'));
				showDeleteModal = false;
			} else {
				toast.error((result as any).data?.error || t('toast.failed_delete'));
			}
			update();
		};
	}}>
		<input type="hidden" name="table" value={activeTableKey} />
		<input type="hidden" name="id" value={currentEntry.id} />
		<div class="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-0 mt-4">
			<button type="button" onclick={() => showDeleteModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6 w-full sm:w-auto">{t('btn.cancel')}</button>
			<button type="submit" class="btn bg-rose-600 text-white hover:bg-rose-700 rounded-full px-8 font-bold border-none shadow-md w-full sm:w-auto">{t('modal.yes_delete')}</button>
		</div>
	</form>
</Modal>

<EntryModal 
	bind:show={showModal}
	{isEditMode}
	{activeTableKey}
	bind:currentEntry
	targetLabel={config.getTargetLabel(activeSubTab)}
	validationPattern={config.getValidationPattern(activeSubTab)}
	validationTitle={config.getValidationTitle(activeSubTab)}
	onSuccess={() => invalidateAll()}
/>
