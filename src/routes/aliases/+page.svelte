<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import { toast } from '$lib/state/toast.svelte';
	import { NotePencil, Trash, ArrowRight, XCircle, Ghost } from 'phosphor-svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import ValidatedInput from '$lib/components/ValidatedInput.svelte';
	import CommentPopover from '$lib/components/CommentPopover.svelte';
	import { invalidateAll } from '$app/navigation';

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
			toast.success('Description saved!');
			await invalidateAll();
		} catch (e) {
			toast.error('Failed to save description');
		}
	}
</script>

<div class="space-y-6">
	<!-- Заголовок и фильтры -->
	<div class="flex flex-col md:flex-row md:items-center justify-between px-6 pb-2 gap-6">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<Ghost size={36} weight="fill" class="text-teal-600" />
				Aliases
			</h2>
			<p class="text-slate-500 mt-1">Manage email forwarding rules</p>
		</div>
		
		<div class="flex items-center gap-4 flex-wrap">
			<!-- Status Filter -->
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-sans shadow-sm rounded-full px-6">
					{selectedStatus === 'all' ? 'All Statuses' : selectedStatus === 'active' ? 'Active Only' : 'Disabled Only'}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
				</div>
				<ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-xl bg-white rounded-2xl w-52 mt-2 border border-slate-100 font-sans text-slate-600">
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

			<!-- Domain Filter -->
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-sans shadow-sm rounded-full px-6">
					{selectedDomain === 'all' ? 'All Domains' : selectedDomain}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
				</div>
				<ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-xl bg-white rounded-2xl min-w-full w-max max-h-[60vh] overflow-y-auto mt-2 border border-slate-100 font-sans text-slate-600 flex-nowrap">
					<li>
						<button 
							onclick={() => selectedDomain = 'all'} 
							class="whitespace-nowrap {selectedDomain === 'all' ? 'bg-amogus-light text-amogus-dark font-bold' : 'hover:bg-slate-50'}"
						>
							<span class="w-4 inline-block">{selectedDomain === 'all' ? '✓' : ''}</span> All Domains
						</button>
					</li>
					<div class="divider my-0"></div>
					{#each data.domains as domain}
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

			<button onclick={openAddModal} class="rounded-full bg-amogus-blue px-6 py-3 font-bold text-white shadow hover:bg-amogus-brown active:scale-95 transition-all">
				+ Add Alias
			</button>
		</div>
	</div>

	<!-- Таблица алиасов -->
	<div class="rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
		<table class="w-full text-left text-sm">
			<thead class="bg-amogus-light text-xs uppercase tracking-wide text-amogus-dark">
				<tr>
					<th class="px-6 py-5 cursor-pointer hover:text-amogus-blue select-none transition-colors rounded-tl-3xl" onclick={() => toggleSort('alias')}>
						Alias <span class="text-amogus-blue ml-1 font-bold">{sortField === 'alias' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span>
					</th>
					<th class="px-6 py-5 cursor-pointer hover:text-amogus-blue select-none transition-colors" onclick={() => toggleSort('target')}>
						Forward To <span class="text-amogus-blue ml-1 font-bold">{sortField === 'target' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span>
					</th>
					<th class="px-6 py-5">Status</th>
					<th class="px-6 py-5">Description</th>
					<th class="px-6 py-5 text-right rounded-tr-3xl">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100 bg-white">
				{#each filteredAliases as alias}
					{@const sourceParts = alias.alias.split('@')}
					{@const sourceLocal = sourceParts[0]}
					{@const sourceDomain = sourceParts[1] || ''}
					{@const isSourceDomainActive = !!data.domains?.find(d => d.domain === sourceDomain)}
					
					{@const targetParts = alias.target.split('@')}
					{@const targetLocal = targetParts[0]}
					{@const targetDomain = targetParts[1] || ''}
					{@const isTargetDomainActive = !!data.domains?.find(d => d.domain === targetDomain)}
					<tr class="hover:bg-slate-50 transition-colors group">
						<td class="px-6 py-5">
							<div class="font-bold {alias.active ? 'text-teal-600' : 'text-slate-400'} text-base transition-colors">
								{sourceLocal}<span class="{isSourceDomainActive ? 'text-violet-500' : 'text-slate-400'} transition-colors">@{sourceDomain}</span>
							</div>
						</td>
						<td class="px-6 py-5">
							<div class="flex items-center gap-2 font-medium bg-slate-50 border border-slate-100 w-fit px-3 py-1.5 rounded-full transition-colors">
								<ArrowRight size={16} weight="bold" class="text-slate-400 shrink-0" />
								<div class="font-bold {alias.active ? 'text-amber-600' : 'text-slate-400'} transition-colors truncate">
									{targetLocal}<span class="{isTargetDomainActive ? 'text-violet-500' : 'text-slate-400'} transition-colors">@{targetDomain}</span>
								</div>
							</div>
						</td>
						<td class="px-6 py-5">
							{#if alias.active}
								<span class="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">Active</span>
							{:else}
								<span class="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">Disabled</span>
							{/if}
						</td>
						<td class="px-6 py-5">
							<div class="flex items-center gap-2">
								<CommentPopover 
									comment={alias.description || ''} 
									onsave={(newComment) => {
										alias.description = newComment;
										handleQuickComment(alias);
									}} 
								/>
								<span class="text-slate-500 truncate max-w-[150px] block">{alias.description || ''}</span>
							</div>
						</td>
						<td class="px-6 py-5 text-right">
							<div class="flex justify-end gap-3 transition-opacity">
								<Tooltip text="Edit" position="top">
									<button onclick={() => openEditModal(alias)} class="text-amogus-blue hover:text-white hover:bg-amogus-blue bg-blue-50 p-2 rounded-full transition-colors" title="Edit">
										<NotePencil size={24} weight="fill" />
									</button>
								</Tooltip>
								<Tooltip text="Delete" position="top">
									<button onclick={() => requestDelete(alias)} class="text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 p-2 rounded-full transition-colors" title="Delete">
										<Trash size={24} weight="fill" />
									</button>
								</Tooltip>
							</div>
						</td>
					</tr>
				{/each}
				{#if data.aliases.length === 0}
					<tr>
						<td colspan="5" class="px-6 py-12 text-center text-slate-500">No forwarding rules found.</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<Modal bind:show={showDeleteModal} title="Delete Alias">
	<p class="text-slate-600 font-medium mb-8 text-lg">Are you sure you want to permanently delete forwarding rule for <span class="font-bold text-rose-600">{aliasToDelete?.alias}</span>? This action cannot be undone.</p>
	<form method="POST" action="?/delete" use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.success) {
				toast.success('Alias deleted!');
				showDeleteModal = false;
			} else {
				toast.error(result.data?.error || 'Failed to delete alias');
			}
			update();
		};
	}}>
		<input type="hidden" name="alias" value={aliasToDelete?.alias} />
		<div class="flex justify-between mt-4">
			<button type="button" onclick={() => showDeleteModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6">Cancel</button>
			<button type="submit" class="btn bg-rose-600 text-white hover:bg-rose-700 rounded-full px-8 font-bold border-none shadow-md">
				Yes, Delete
			</button>
		</div>
	</form>
</Modal>

<Modal bind:show={showModal} title={isEditMode ? 'Edit Alias' : 'Add New Alias'}>
	<form method="POST" action={isEditMode ? "?/update" : "?/create"} use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.success) {
				toast.success(isEditMode ? 'Alias updated!' : 'Alias created!');
				showModal = false;
			} else {
				toast.error(result.data?.error || 'An error occurred');
			}
			update();
		};
	}} class="space-y-5 animate-in fade-in duration-300">
		
		{#if isEditMode}
			<input type="hidden" name="originalAlias" value={currentAlias.alias} />
		{/if}

		<div class="form-control">
			<div class="label"><span class="label-text font-bold text-slate-700">Alias Address</span></div>
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
				<span class="label-text font-bold text-slate-700">Forward To Mailbox</span>
			</div>
			<select 
				name="target" 
				bind:value={currentAlias.target}
				class="select select-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700" 
				required
			>
				<option value="" disabled>Select destination...</option>
				{#if currentAlias.target && !data.users.find(u => `${u.localPart}@${u.domain}` === currentAlias.target)}
					<option value={currentAlias.target}>{currentAlias.target} (Current, Invalid/Inactive)</option>
				{/if}
				{#each data.users as user}
					{@const email = `${user.localPart}@${user.domain}`}
					<option value={email}>{email}</option>
				{/each}
			</select>
		</div>

		<div class="form-control">
			<div class="label"><span class="label-text font-bold text-slate-700">Description (optional)</span></div>
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
				<span class="font-bold text-slate-700">Active</span>
			</label>
		</div>

		<div class="modal-action mt-8 pt-4 flex justify-between">
			<button type="button" onclick={() => showModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6">Cancel</button>
			<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md">
				{isEditMode ? 'Save Changes' : 'Create Alias'}
			</button>
		</div>
	</form>
</Modal>
