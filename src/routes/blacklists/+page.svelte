<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import CommentPopover from '$lib/components/CommentPopover.svelte';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$lib/state/toast.svelte';
	import { NotePencil, Trash, XCircle, At, EnvelopeSimple, Numpad, ShieldWarning, ShieldCheck, Skull } from 'phosphor-svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import ValidatedInput from '$lib/components/ValidatedInput.svelte';

	let { data, form } = $props();

	let activeSubTab = $state('domains');

	let activeTableKey = $derived.by(() => {
		if (activeSubTab === 'domains') return 'blackDomains';
		if (activeSubTab === 'emails') return 'blackEmails';
		if (activeSubTab === 'ips') return 'blackIps';
		if (activeSubTab === 'dkim') return 'dkimRequiredDomains';
		return 'dnsgBlacklist';
	});

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

	let sortedData = $derived([...(data[activeTableKey as keyof typeof data] || [])].filter((item: any) => {
		const act = item.active !== undefined ? item.active === 1 : item.dnsgKey === 1;
		if (selectedStatus === 'active' && !act) return false;
		if (selectedStatus === 'disabled' && act) return false;
		return true;
	}).sort((a, b) => {
		const targetA = (a.domain || a.email || a.host || a.dnsDomain || '').toLowerCase();
		const targetB = (b.domain || b.email || b.host || b.dnsDomain || '').toLowerCase();
		const descA = (a.description || a.dnsDescription || '').toLowerCase();
		const descB = (b.description || b.dnsDescription || '').toLowerCase();
		const actA = a.active !== undefined ? a.active : a.dnsgKey;
		const actB = b.active !== undefined ? b.active : b.dnsgKey;

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
		const target = item.domain || item.email || item.host || item.dnsDomain;
		const desc = item.description || item.dnsDescription || '';
		const act = item.active !== undefined ? item.active === 1 : item.dnsgKey === 1;
		currentEntry = { id: item.id || item.dnsDomain, target, description: desc, active: act };
		showModal = true;
	}

	function requestDelete(item: any) {
		const target = item.domain || item.email || item.host || item.dnsDomain;
		currentEntry = { id: item.id || item.dnsDomain, target, description: '', active: false };
		showDeleteModal = true;
	}

	function getTargetLabel() {
		if (activeSubTab === 'domains') return 'Domain Name';
		if (activeSubTab === 'emails') return 'Email Address';
		if (activeSubTab === 'ips') return 'IP Address / Subnet';
		if (activeSubTab === 'dnsbl') return 'DNSBL Pattern';
		if (activeSubTab === 'dkim') return 'DKIM Domain';
		return 'Target';
	}

	async function handleQuickComment(item: any) {
		const fd = new FormData();
		const target = item.domain || item.email || item.host || item.dnsDomain;
		const act = item.active !== undefined ? item.active === 1 : item.dnsgKey === 1;

		fd.append('table', activeTableKey);
		fd.append('id', item.id || item.dnsDomain || '');
		fd.append('target', target);
		fd.append('description', item.description || item.dnsDescription || '');
		if (act) fd.append('active', 'on');

		try {
			await fetch('?/update', { method: 'POST', body: fd });
			toast.success('Description saved!');
			await invalidateAll();
		} catch (e) {
			toast.error('Failed to save description');
		}
	}
</script>

<div class="space-y-6 max-w-6xl mx-auto">
	<div class="flex flex-col md:flex-row md:items-center justify-between px-0 md:px-6 pb-2 gap-4">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<Skull size={36} weight="fill" class="text-rose-600" />
				Blacklists
			</h2>
			<p class="text-slate-500 mt-1">Block incoming mail from specific sources</p>
		</div>
		<div class="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
			<div class="dropdown dropdown-end w-full sm:w-auto">
				<div tabindex="0" role="button" class="btn w-full sm:w-auto flex justify-between sm:justify-center bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-sans shadow-sm rounded-full px-6">
					{selectedStatus === 'all' ? 'All Statuses' : (selectedStatus === 'active' ? 'Active Only' : 'Disabled Only')}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
				</div>
				<ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-xl bg-white rounded-2xl min-w-full w-max mt-2 border border-slate-100 font-sans text-slate-600">
					<li>
						<button onclick={() => selectedStatus = 'all'} class="whitespace-nowrap {selectedStatus === 'all' ? 'bg-amogus-light text-amogus-dark font-bold' : 'hover:bg-slate-50'}">
							<span class="w-4 inline-block">{selectedStatus === 'all' ? '✓' : ''}</span> All Statuses
						</button>
					</li>
					<li>
						<button onclick={() => selectedStatus = 'active'} class="whitespace-nowrap {selectedStatus === 'active' ? 'bg-amogus-light text-amogus-dark font-bold' : 'hover:bg-slate-50'}">
							<span class="w-4 inline-block text-emerald-500">{selectedStatus === 'active' ? '✓' : ''}</span> Active Only
						</button>
					</li>
					<li>
						<button onclick={() => selectedStatus = 'disabled'} class="whitespace-nowrap {selectedStatus === 'disabled' ? 'bg-amogus-light text-amogus-dark font-bold' : 'hover:bg-slate-50'}">
							<span class="w-4 inline-block text-slate-500">{selectedStatus === 'disabled' ? '✓' : ''}</span> Disabled Only
						</button>
					</li>
				</ul>
			</div>

			<button onclick={openAddModal} class="w-full sm:w-auto rounded-full bg-amogus-blue px-6 py-3 font-bold text-white shadow hover:bg-amogus-brown active:scale-95 transition-all mt-2 sm:mt-0">
				+ Add Entry
			</button>
		</div>
	</div>

	<!-- Sub Navigation Tabs -->
	<div class="px-2 md:px-6 flex overflow-x-auto pb-4 custom-scrollbar">
		<div class="inline-flex bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner min-w-max mx-auto">
			<button class="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 {activeSubTab === 'domains' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}" onclick={() => activeSubTab = 'domains'}>
				<At size={20} weight={activeSubTab === 'domains' ? 'fill' : 'regular'} /> Domains
			</button>
			<button class="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 {activeSubTab === 'emails' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}" onclick={() => activeSubTab = 'emails'}>
				<EnvelopeSimple size={20} weight={activeSubTab === 'emails' ? 'fill' : 'regular'} /> Emails
			</button>
			<button class="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 {activeSubTab === 'ips' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}" onclick={() => activeSubTab = 'ips'}>
				<Numpad size={20} weight={activeSubTab === 'ips' ? 'fill' : 'regular'} /> IP Addresses
			</button>
			<button class="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 {activeSubTab === 'dnsbl' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}" onclick={() => activeSubTab = 'dnsbl'}>
				<ShieldWarning size={20} weight={activeSubTab === 'dnsbl' ? 'fill' : 'regular'} /> Global DNSBL
			</button>
			<button class="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 {activeSubTab === 'dkim' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}" onclick={() => activeSubTab = 'dkim'}>
				<ShieldCheck size={20} weight={activeSubTab === 'dkim' ? 'fill' : 'regular'} /> DKIM Required
			</button>
		</div>
	</div>

	<!-- List Data Table -->
	<div class="rounded-[32px] border border-slate-200 shadow-sm bg-white overflow-hidden animate-in fade-in duration-300">
		<table class="w-full text-left text-sm block md:table">
			<thead class="bg-slate-50 border-b border-slate-200 text-xs font-black uppercase tracking-widest text-amogus-blue hidden md:table-header-group">
				<tr>
					<th class="px-6 py-5 cursor-pointer hover:bg-slate-200 transition-colors rounded-tl-[32px]" onclick={() => toggleSort('target')}>
						<div class="flex items-center gap-2">
							{getTargetLabel()}
							{#if sortField === 'target'}
								<span class="text-amogus-blue">{sortDir === 'asc' ? '↑' : '↓'}</span>
							{/if}
						</div>
					</th>
					<th class="px-6 py-5">
						<div class="flex items-center gap-2">
							Status
						</div>
					</th>
					<th class="px-6 py-5">
						<div class="flex items-center gap-2">
							Description
						</div>
					</th>
					<th class="px-6 py-5 text-right rounded-tr-[32px]">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100 bg-white block md:table-row-group">
				{#each sortedData as item}
					{@const target = item.domain || item.email || item.host || item.dnsDomain}
					{@const desc = item.description || item.dnsDescription || '—'}
					{@const act = item.active !== undefined ? item.active : item.dnsgKey}
					<tr class="hover:bg-slate-50 transition-colors block md:table-row p-4 md:p-0 border-b border-slate-100 last:border-0 md:border-none group">
						<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-5 font-bold {act === 1 ? 'text-amogus-dark' : 'text-slate-400'} text-base transition-colors border-b border-slate-50 md:border-none">
							<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{getTargetLabel()}</span>
							<span class="text-right md:text-left truncate max-w-[200px] md:max-w-none">
							{#if activeSubTab === 'domains'}
								*.{target}
							{:else}
								{target}
							{/if}
							</span>
						</td>
						<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-5 border-b border-slate-50 md:border-none">
							<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status</span>
							{#if act === 1}
								<span class="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">Active</span>
							{:else}
								<span class="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">Disabled</span>
							{/if}
						</td>
						<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-5 border-b border-slate-50 md:border-none">
							<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">Description</span>
							<div class="flex items-center justify-end md:justify-start gap-2">
								<CommentPopover
									comment={desc === '—' ? '' : desc}
									onsave={(newDesc) => {
										if (item.dnsDescription !== undefined) {
											item.dnsDescription = newDesc;
										} else {
											item.description = newDesc;
										}
										handleQuickComment(item);
									}}
								/>
								<span class="text-slate-500 truncate max-w-[150px] block">{desc}</span>
							</div>
						</td>
						<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-5 md:text-right">
							<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">Actions</span>
							<div class="flex justify-end gap-3 transition-opacity">
								<Tooltip text="Edit" position="top">
									<button onclick={() => openEditModal(item)} class="text-amogus-blue hover:text-white hover:bg-amogus-blue bg-blue-50 p-2 rounded-full transition-colors">
										<NotePencil size={24} weight="fill" />
									</button>
								</Tooltip>
								<Tooltip text="Delete" position="top">
									<button onclick={() => requestDelete(item)} class="text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 p-2 rounded-full transition-colors">
										<Trash size={24} weight="fill" />
									</button>
								</Tooltip>
							</div>
						</td>
					</tr>
				{/each}
				{#if sortedData.length === 0}
					<tr>
						<td colspan="4" class="px-6 py-12 text-center text-slate-500">No entries found in this blacklist.</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<Modal bind:show={showDeleteModal} title="Delete Entry">
	<p class="text-slate-600 font-medium mb-8 text-lg">Are you sure you want to permanently delete <span class="font-bold text-rose-600">{currentEntry.target}</span>?</p>
	<form method="POST" action="?/delete" use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.success) {
				toast.success(result.data.message);
				showDeleteModal = false;
			} else {
				toast.error(result.data?.error || 'Failed to delete');
			}
			update();
		};
	}}>
		<input type="hidden" name="table" value={activeTableKey} />
		<input type="hidden" name="id" value={currentEntry.id} />
		<div class="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-0 mt-4">
			<button type="button" onclick={() => showDeleteModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6 w-full sm:w-auto">Cancel</button>
			<button type="submit" class="btn bg-rose-600 text-white hover:bg-rose-700 rounded-full px-8 font-bold border-none shadow-md w-full sm:w-auto">Yes, Delete</button>
		</div>
	</form>
</Modal>

<Modal bind:show={showModal} title={isEditMode ? 'Edit Entry' : 'Add New Entry'}>
	<form method="POST" action={isEditMode ? "?/update" : "?/create"} use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.success) {
				toast.success(result.data.message);
				showModal = false;
			} else {
				toast.error(result.data?.error || 'An error occurred');
			}
			update();
		};
	}} class="space-y-5">
		
		<input type="hidden" name="table" value={activeTableKey} />
		{#if isEditMode}
			<input type="hidden" name="id" value={currentEntry.id} />
		{/if}

		<div class="form-control">
			<div class="label"><span class="label-text font-bold text-slate-700">{getTargetLabel()}</span></div>
			<ValidatedInput name="target" bind:value={currentEntry.target} required 
				pattern={activeSubTab === 'dnsbl' ? "^[a-zA-Z0-9.\\-%]+$" : (activeSubTab === 'domains' || activeSubTab === 'dkim' ? "^([a-zA-Z0-9\\-]+\\.)*[a-zA-Z0-9\\-]{2,}$" : (activeSubTab === 'emails' ? "^[^@\\s]+@[^@\\s]+\\.[^@\\s0-9]{2,}$" : "^([0-9]{1,3}\\.){3}[0-9]{1,3}(\\/([0-9]|[1-2][0-9]|3[0-2]))?$"))}
				title={activeSubTab === 'dnsbl' ? "Please enter a valid DNSBL pattern (can include % wildcards)" : (activeSubTab === 'domains' || activeSubTab === 'dkim' ? "Please enter a valid domain name (e.g. example.com or just a TLD like cn)" : (activeSubTab === 'emails' ? "Please enter a valid email address" : "Please enter a valid IP address or CIDR subnet"))}
				className="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" />
		</div>

		<div class="form-control">
			<div class="label"><span class="label-text font-bold text-slate-700">Description</span></div>
			<input type="text" name="description" bind:value={currentEntry.description} class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" />
		</div>

		<label class="cursor-pointer flex items-center gap-3 pt-2">
			<input type="checkbox" name="active" bind:checked={currentEntry.active} class="toggle toggle-amogus" />
			<span class="font-bold text-slate-700">Active</span>
		</label>

		<div class="modal-action mt-8 pt-4 flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-0">
			<button type="button" onclick={() => showModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6 w-full sm:w-auto">Cancel</button>
			<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md w-full sm:w-auto">
				{isEditMode ? 'Save Changes' : 'Create'}
			</button>
		</div>
	</form>
</Modal>
