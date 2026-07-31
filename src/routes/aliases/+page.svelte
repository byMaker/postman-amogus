<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import { toast } from '$lib/state/toast.svelte';
	import { ArrowRight, Ghost } from 'phosphor-svelte';
	import { t } from '$lib/i18n';
	import ValidatedInput from '$lib/components/ValidatedInput.svelte';
	import CommentPopover from '$lib/components/CommentPopover.svelte';
	import { invalidateAll } from '$app/navigation';
	import Table from '$lib/components/ui/Table.svelte';
	import Tr from '$lib/components/ui/Tr.svelte';
	import Th from '$lib/components/ui/Th.svelte';
	import Td from '$lib/components/ui/Td.svelte';
	import ActionButtons from '$lib/components/ui/ActionButtons.svelte';

	let { data, form } = $props();

	let showModal = $state(false);
	let isEditMode = $state(false);
	
	let currentAlias = $state({
		alias: '',
		target: '',
		description: '',
		active: true
	});

	function openAddModal() {
		isEditMode = false;
		currentAlias = { alias: '', target: '', description: '', active: true };
		showModal = true;
	}

	function openEditModal(a: any) {
		isEditMode = true;
		currentAlias = { 
			alias: a.alias, 
			target: a.target, 
			description: a.description || '', 
			active: a.active === 1 
		};
		showModal = true;
	}

	let aliasToDelete: any = $state(null);
	let showDeleteModal = $state(false);

	function requestDelete(a: any) {
		aliasToDelete = a;
		showDeleteModal = true;
	}

	let sortField = $state('alias');
	let sortDir = $state('asc');
	let selectedDomain = $state('all');
	let selectedStatus = $state('all');

	function toggleSort(field: string) {
		if (sortField === field) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDir = 'asc';
		}
	}

	let filteredAliases = $derived.by(() => {
		let result = [...data.aliases];
		
		result = result.filter(a => {
			const sourceDomain = a.alias.split('@')[1] || '';
			if (selectedDomain !== 'all' && sourceDomain !== selectedDomain) return false;
			if (selectedStatus === 'active' && !a.active) return false;
			if (selectedStatus === 'disabled' && a.active) return false;
			return true;
		});

		result.sort((a, b) => {
			let valA = a[sortField as keyof typeof a] || '';
			let valB = b[sortField as keyof typeof b] || '';
			if (typeof valA === 'string' && typeof valB === 'string') {
				valA = valA.toLowerCase();
				valB = valB.toLowerCase();
			}
			if (valA < valB) return sortDir === 'asc' ? -1 : 1;
			if (valA > valB) return sortDir === 'asc' ? 1 : -1;
			return 0;
		});
		return result;
	});

	async function handleQuickComment(alias: any) {
		const fd = new FormData();
		fd.append('originalAlias', alias.alias);
		fd.append('alias', alias.alias);
		fd.append('target', alias.target);
		fd.append('description', alias.description || '');
		fd.append('active', alias.active ? '1' : '');

		try {
			await fetch('?/update', { method: 'POST', body: fd });
			toast.success(t('toast.saved'));
			await invalidateAll();
		} catch (e) {
			toast.error(t('toast.failed_save'));
		}
	}
</script>

<div class="space-y-6">
	<!-- Заголовок и кнопка -->
	<div class="flex flex-col md:flex-row md:items-center justify-between px-0 md:px-6 pb-2 gap-4">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<Ghost size={36} weight="fill" class="text-teal-600" />
				{t('card.aliases')}
			</h2>
			<p class="text-slate-500 mt-1">{t('card.aliases.desc')}</p>
		</div>
		
		<div class="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
			<!-- Status Filter -->
			<div class="dropdown dropdown-end w-full sm:w-auto">
				<div tabindex="0" role="button" class="btn w-full sm:w-auto flex justify-between sm:justify-center bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-sans shadow-sm rounded-full px-6">
					{selectedStatus === 'all' ? t('filter.all_statuses') : (selectedStatus === 'active' ? t('filter.active_only') : t('filter.disabled_only'))}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
				</div>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-xl bg-white rounded-2xl w-52 mt-2 border border-slate-100 font-sans text-slate-600">
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

			<!-- Domain Filter -->
			<div class="dropdown dropdown-end w-full sm:w-auto">
				<div tabindex="0" role="button" class="btn w-full sm:w-auto flex justify-between sm:justify-center bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-sans shadow-sm rounded-full px-6">
					{selectedDomain === 'all' ? t('filter.all_domains') : selectedDomain}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
				</div>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-xl bg-white rounded-2xl min-w-full w-max max-h-[60vh] overflow-y-auto mt-2 border border-slate-100 font-sans text-slate-600 flex-nowrap">
					<li>
						<button 
							onclick={() => selectedDomain = 'all'} 
							class="whitespace-nowrap {selectedDomain === 'all' ? 'bg-amogus-light text-amogus-dark font-bold' : 'hover:bg-slate-50'}"
						>
							<span class="w-4 inline-block">{selectedDomain === 'all' ? '✓' : ''}</span> {t('filter.all_domains')}
						</button>
					</li>
					<div class="divider my-0"></div>
					{#each data.domains as domain (domain.domain)}
						<li>
							<button 
								onclick={() => selectedDomain = domain.domain} 
								class="whitespace-nowrap {selectedDomain === domain.domain ? 'bg-amogus-light text-amogus-dark font-bold' : 'hover:bg-slate-50'}"
							>
								<span class="w-4 inline-block text-amogus-blue">{selectedDomain === domain.domain ? '✓' : ''}</span> {domain.domain}
							</button>
						</li>
					{/each}
				</ul>
			</div>

			<button onclick={openAddModal} class="w-full sm:w-auto rounded-full bg-amogus-blue px-6 py-3 font-bold text-white shadow hover:bg-amogus-brown active:scale-95 transition-all mt-2 sm:mt-0">
				+ {t('alias.add')}
			</button>
		</div>
	</div>

	<!-- Таблица алиасов -->
	<Table>
		<thead class="text-xs font-black uppercase tracking-widest text-amogus-blue hidden lg:table-header-group">
			<tr>
				<Th sortable onclick={() => toggleSort('alias')}>
					{t('alias.table.source')} <span class="text-amogus-blue ml-1 font-bold">{sortField === 'alias' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span>
				</Th>
				<Th sortable onclick={() => toggleSort('target')}>
					{t('alias.table.target')} <span class="text-amogus-blue ml-1 font-bold">{sortField === 'target' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span>
				</Th>
				<Th>{t('table.status')}</Th>
				<Th>{t('table.description')}</Th>
				<Th align="right">{t('table.actions')}</Th>
			</tr>
		</thead>
		<tbody class="divide-y divide-slate-100 bg-white block lg:table-row-group rounded-[32px] lg:rounded-none lg:rounded-b-[32px]">
			{#each filteredAliases as alias, index (alias.alias)}
				{@const sourceParts = alias.alias.split('@')}
				{@const sourceLocal = sourceParts[0]}
				{@const sourceDomain = sourceParts[1] || ''}
				{@const isSourceDomainActive = !!data.domains?.find(d => d.domain === sourceDomain)}
				
				{@const targetParts = alias.target.split('@')}
				{@const targetLocal = targetParts[0]}
				{@const targetDomain = targetParts[1] || ''}
				{@const isTargetDomainActive = !!data.domains?.find(d => d.domain === targetDomain)}
				{@const isLast = index === filteredAliases.length - 1}
				
				<Tr id="row-{alias.alias}">
					<Td {isLast}>
						<span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('alias.table.source')}</span>
						<div class="font-bold {alias.active ? 'text-teal-600' : 'text-slate-400'} text-sm transition-colors text-right lg:text-left truncate max-w-[200px] lg:max-w-none">
							{sourceLocal}<span class="{isSourceDomainActive ? 'text-violet-500' : 'text-slate-400'} transition-colors">@{sourceDomain}</span>
						</div>
					</Td>
					<Td>
						<span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('alias.table.target')}</span>
						<div class="flex items-center justify-end lg:justify-start gap-2 font-medium w-fit transition-colors ml-auto lg:ml-0">
							<ArrowRight size={16} weight="bold" class="text-slate-400 shrink-0 hidden lg:block" />
							<div class="font-bold {alias.active ? 'text-amber-600' : 'text-slate-400'} transition-colors truncate">
								{targetLocal}<span class="{isTargetDomainActive ? 'text-violet-500' : 'text-slate-400'} transition-colors">@{targetDomain}</span>
							</div>
						</div>
					</Td>
					<Td>
						<span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('table.status')}</span>
						{#if alias.active}
							<span class="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-xs tracking-wider">{t('status.active')}</span>
						{:else}
							<span class="px-3 py-1 rounded-full bg-slate-200 text-slate-600 font-bold text-xs tracking-wider">{t('status.inactive')}</span>
						{/if}
					</Td>
					<Td>
						<span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('table.description')}</span>
						<div class="flex items-center justify-end lg:justify-start gap-2">
							<CommentPopover 
								comment={alias.description || ''} 
								onsave={(newComment) => {
									alias.description = newComment;
									handleQuickComment(alias);
								}} 
							/>
							<span class="text-slate-500 truncate max-w-[150px] sm:max-w-[200px] lg:max-w-[300px] xl:max-w-[400px] block desc-hide-lg">{alias.description || ''}</span>
						</div>
					</Td>
					<ActionButtons 
						{isLast}
						onEdit={() => openEditModal(alias)}
						onDelete={() => requestDelete(alias)}
					/>
				</Tr>
			{:else}
				<tr>
					<td colspan="5" class="px-6 py-12 text-center text-slate-500 rounded-b-[32px]">
						{data.aliases.length === 0 ? "No forwarding rules found." : t('table.filtered_empty')}
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>
</div>

<Modal bind:show={showDeleteModal} title={t('modal.delete')}>
	<div class="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl mb-8 shadow-sm">
		<h3 class="font-bold text-xl mb-3 text-rose-900">{t('modal.are_you_sure')}</h3>
		<p class="mb-5 text-sm">{t('modal.about_to_delete')} <span class="font-bold px-1.5 py-0.5 bg-rose-200 rounded text-rose-900">{aliasToDelete?.alias}</span>.</p>
	</div>
	<form method="POST" action="?/delete" use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.success) {
				toast.success(t('toast.deleted'));
				showDeleteModal = false;
			} else {
				toast.error(result.data?.error || t('toast.failed_delete'));
			}
			update();
		};
	}}>
		<input type="hidden" name="alias" value={aliasToDelete?.alias} />
		<div class="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-0 mt-4">
			<button type="button" onclick={() => showDeleteModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6 w-full sm:w-auto">{t('btn.cancel')}</button>
			<button type="submit" class="btn bg-rose-600 text-white hover:bg-rose-700 rounded-full px-8 font-bold border-none shadow-md w-full sm:w-auto">
				{t('modal.yes_delete')}
			</button>
		</div>
	</form>
</Modal>

<Modal bind:show={showModal} title={isEditMode ? t('modal.edit') : t('modal.add')}>
	<form method="POST" action={isEditMode ? "?/update" : "?/create"} use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.success) {
				toast.success(isEditMode ? t('toast.saved') : t('toast.created'));
				showModal = false;
			} else {
				toast.error(result.data?.error || t('toast.failed_save'));
			}
			update();
		};
	}} class="space-y-5 animate-in fade-in duration-300">
		
		{#if isEditMode}
			<input type="hidden" name="originalAlias" value={currentAlias.alias} />
		{/if}

		<div class="form-control">
			<div class="label"><span class="label-text font-bold text-slate-700">{t('alias.table.source')}</span></div>
			<ValidatedInput 
				name="alias" 
				bind:value={currentAlias.alias} 
				className="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" 
				placeholder="sales@example.com" 
				required 
				pattern={"^[^@\\s]+@[^@\\s]+\\.[^@\\s0-9]{2,}$"}
				title="Please enter a valid email address"
			/>
		</div>

		<div class="form-control">
			<div class="label">
				<span class="label-text font-bold text-slate-700">{t('form.forward_to')}</span>
			</div>
			<select 
				name="target" 
				bind:value={currentAlias.target}
				class="select select-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700" 
				required
			>
				<option value="" disabled>{t('form.select_destination')}</option>
				{#if currentAlias.target && !data.users.find(u => `${u.localPart}@${u.domain}` === currentAlias.target)}
					<option value={currentAlias.target}>{currentAlias.target} {t('form.invalid_inactive')}</option>
				{/if}
				{#each data.users as user (user.id)}
					{@const email = `${user.localPart}@${user.domain}`}
					<option value={email}>{email}</option>
				{/each}
			</select>
		</div>

		<div class="form-control">
			<div class="label"><span class="label-text font-bold text-slate-700">{t('form.description')} <span class="text-slate-400 font-normal">{t('form.optional')}</span></span></div>
			<input 
				type="text" 
				name="description" 
				bind:value={currentAlias.description}
				class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" 
			/>
		</div>

		<div class="flex gap-6 pt-2">
			<label class="cursor-pointer flex items-center gap-3 pt-2">
				<input type="checkbox" name="active" bind:checked={currentAlias.active} class="toggle toggle-amogus" />
				<span class="font-medium text-slate-700">{t('form.active')}</span>
			</label>
		</div>

		<div class="modal-action mt-8 pt-4 flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-0">
			<button type="button" onclick={() => showModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6 w-full sm:w-auto">{t('btn.cancel')}</button>
			<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md w-full sm:w-auto">
				{t('btn.save')}
			</button>
		</div>
	</form>
</Modal>
