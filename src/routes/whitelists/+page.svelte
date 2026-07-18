<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import CommentPopover from '$lib/components/CommentPopover.svelte';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$lib/state/toast.svelte';
	import { NotePencil, Trash, CheckCircle, At, EnvelopeSimple, Numpad, Star } from 'phosphor-svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import ValidatedInput from '$lib/components/ValidatedInput.svelte';

	let { data, form } = $props();

	let activeSubTab = $state('domains');

	let activeTableKey = $derived.by(() => {
		if (activeSubTab === 'domains') return 'whiteDomains';
		if (activeSubTab === 'emails') return 'whiteEmails';
		return 'whiteIps';
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
		const act = item.active === 1;
		if (selectedStatus === 'active' && !act) return false;
		if (selectedStatus === 'disabled' && act) return false;
		return true;
	}).sort((a, b) => {
		const targetA = (a.domain || a.email || a.host || '').toLowerCase();
		const targetB = (b.domain || b.email || b.host || '').toLowerCase();
		const descA = (a.description || '').toLowerCase();
		const descB = (b.description || '').toLowerCase();
		const actA = a.active;
		const actB = b.active;

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
		const target = item.domain || item.email || item.host;
		const desc = item.description || '';
		const act = item.active === 1;
		currentEntry = { id: item.id, target, description: desc, active: act };
		showModal = true;
	}

	function requestDelete(item: any) {
		const target = item.domain || item.email || item.host;
		currentEntry = { id: item.id, target, description: '', active: false };
		showDeleteModal = true;
	}

	function getTargetLabel() {
		if (activeSubTab === 'domains') return 'Domain Name';
		if (activeSubTab === 'emails') return 'Email Address';
		if (activeSubTab === 'ips') return 'IP Address / Subnet';
		return 'Target';
	}

	async function handleQuickComment(item: any) {
		const fd = new FormData();
		const target = item.domain || item.email || item.host;
		const act = item.active === 1;

		fd.append('table', activeTableKey);
		fd.append('id', item.id || '');
		fd.append('target', target);
		fd.append('description', item.description || '');
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
	<div class="flex items-center justify-between px-6 pb-2">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<Star size={36} weight="fill" class="text-yellow-500" />
				Whitelists
			</h2>
			<p class="text-slate-500 mt-1">Allow incoming mail from trusted sources</p>
		</div>
		<div class="flex items-center gap-4">
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-sans shadow-sm rounded-full px-6">
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

			<button onclick={openAddModal} class="rounded-full bg-amogus-blue px-6 py-3 font-bold text-white shadow hover:bg-amogus-brown active:scale-95 transition-all">
				+ Add Entry
			</button>
		</div>
	</div>

	<!-- Sub Navigation Tabs -->
	<div class="px-6 flex justify-center pb-4">
		<div class="inline-flex bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner">
			<button class="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 {activeSubTab === 'domains' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}" onclick={() => activeSubTab = 'domains'}>
				<At size={20} weight={activeSubTab === 'domains' ? 'fill' : 'regular'} /> Domains
			</button>
			<button class="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 {activeSubTab === 'emails' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}" onclick={() => activeSubTab = 'emails'}>
				<EnvelopeSimple size={20} weight={activeSubTab === 'emails' ? 'fill' : 'regular'} /> Emails
			</button>
			<button class="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 {activeSubTab === 'ips' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}" onclick={() => activeSubTab = 'ips'}>
				<Numpad size={20} weight={activeSubTab === 'ips' ? 'fill' : 'regular'} /> IP Addresses
			</button>
		</div>
	</div>

	<!-- List Data Table -->
	<div class="rounded-[32px] border border-slate-200 shadow-sm bg-white overflow-hidden animate-in fade-in duration-300">
		<table class="w-full text-left text-sm">
			<thead class="bg-amogus-light text-xs uppercase tracking-wide text-amogus-dark">
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
			<tbody class="divide-y divide-slate-100">
				{#each sortedData as item}
					{@const target = item.domain || item.email || item.host}
					{@const desc = item.description || '—'}
					{@const act = item.active}
					<tr class="hover:bg-slate-50 transition-colors group">
						<td class="px-6 py-5 font-bold {act === 1 ? 'text-amogus-dark' : 'text-slate-400'} text-base transition-colors">
							{#if activeSubTab === 'domains'}
								*.{target}
							{:else}
								{target}
							{/if}
						</td>
						<td class="px-6 py-5">
							{#if act === 1}
								<span class="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">Active</span>
							{:else}
								<span class="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">Disabled</span>
							{/if}
						</td>
						<td class="px-6 py-5">
							<div class="flex items-center gap-2">
								<CommentPopover
									comment={desc === '—' ? '' : desc}
									onsave={(newDesc) => {
										item.description = newDesc;
										handleQuickComment(item);
									}}
								/>
								<span class="text-slate-500 truncate max-w-[150px] block">{desc}</span>
							</div>
						</td>
						<td class="px-6 py-5 text-right">
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
						<td colspan="4" class="px-6 py-12 text-center text-slate-500">No entries found in this whitelist.</td>
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
		<div class="flex justify-between mt-4">
			<button type="button" onclick={() => showDeleteModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6">Cancel</button>
			<button type="submit" class="btn bg-rose-600 text-white hover:bg-rose-700 rounded-full px-8 font-bold border-none shadow-md">Yes, Delete</button>
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
				pattern={activeSubTab === 'domains' ? "^([a-zA-Z0-9\\-]+\\.)*[a-zA-Z0-9\\-]{2,}$" : (activeSubTab === 'emails' ? "^[^@\\s]+@[^@\\s]+\\.[^@\\s0-9]{2,}$" : "^([0-9]{1,3}\\.){3}[0-9]{1,3}(\\/([0-9]|[1-2][0-9]|3[0-2]))?$")}
				title={activeSubTab === 'domains' ? "Please enter a valid domain name (e.g. example.com or just a TLD like cn)" : (activeSubTab === 'emails' ? "Please enter a valid email address" : "Please enter a valid IP address or CIDR subnet (e.g. 192.168.1.1 or 10.0.0.0/8)")}
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

		<div class="modal-action mt-8 pt-4 flex justify-between">
			<button type="button" onclick={() => showModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6">Cancel</button>
			<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md">
				{isEditMode ? 'Save Changes' : 'Create'}
			</button>
		</div>
	</form>
</Modal>
