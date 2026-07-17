<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import { toast } from '$lib/state/toast.svelte';
	import { NotePencil, Trash, ArrowRight, Ghost } from 'phosphor-svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

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
</script>

<div class="space-y-6">
	<!-- Заголовок и кнопка -->
	<div class="flex items-center justify-between px-6 pb-2">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<Ghost size={36} weight="fill" class="text-indigo-500" />
				Aliases
			</h2>
			<p class="text-slate-500 mt-1">Manage email forwarding rules</p>
		</div>
		<button onclick={openAddModal} class="rounded-full bg-amogus-blue px-6 py-3 font-bold text-white shadow hover:bg-amogus-brown active:scale-95 transition-all">
			+ Add Alias
		</button>
	</div>

	<!-- Таблица алиасов -->
	<div class="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
		<table class="w-full text-left text-sm">
			<thead class="bg-amogus-light text-xs uppercase tracking-wide text-amogus-dark">
				<tr>
					<th class="px-6 py-5">Alias</th>
					<th class="px-6 py-5">Forward To</th>
					<th class="px-6 py-5">Status</th>
					<th class="px-6 py-5">Description</th>
					<th class="px-6 py-5 text-right">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100 bg-white">
				{#each data.aliases as alias}
					<tr class="hover:bg-slate-50 transition-colors group">
						<td class="px-6 py-5 font-bold text-amogus-dark text-base">{alias.alias}</td>
						<td class="px-6 py-5">
							<div class="flex items-center gap-2 font-medium text-slate-700 bg-slate-100 w-fit px-3 py-1 rounded-full">
								<ArrowRight size={16} weight="bold" class="text-slate-400" />
								{alias.target}
							</div>
						</td>
						<td class="px-6 py-5">
							{#if alias.active}
								<span class="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">Active</span>
							{:else}
								<span class="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">Disabled</span>
							{/if}
						</td>
						<td class="px-6 py-5 text-slate-500">{alias.description || '—'}</td>
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
			<button type="button" onclick={() => showDeleteModal = false} class="btn btn-ghost rounded-full text-slate-500 font-bold hover:bg-slate-100 px-6">Cancel</button>
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
			<div class="label"><span class="label-text font-bold text-slate-700">Source Email Address</span></div>
			<input 
				type="email" 
				name="alias" 
				bind:value={currentAlias.alias} 
				class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" 
				placeholder="sales@example.com" 
				required 
			/>
		</div>

		<div class="flex justify-center -my-2 opacity-50 relative z-10">
			<div class="bg-white p-2 rounded-full border border-slate-200">
				<ArrowRight size={24} weight="bold" class="text-slate-400" />
			</div>
		</div>

		<div class="form-control">
			<div class="label">
				<span class="label-text font-bold text-slate-700">Forward To</span>
			</div>
			<input 
				type="text" 
				name="target" 
				bind:value={currentAlias.target}
				class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" 
				placeholder="admin@example.com, john@gmail.com"
				required
			/>
			<div class="label"><span class="label-text-alt text-slate-500">You can specify multiple addresses separated by commas.</span></div>
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
			<label class="cursor-pointer flex items-center gap-3">
				<input type="checkbox" name="active" bind:checked={currentAlias.active} class="toggle toggle-info bg-white" />
				<span class="font-medium text-slate-700">Active</span>
			</label>
		</div>

		<div class="modal-action mt-8 pt-4 flex justify-between">
			<button type="button" onclick={() => showModal = false} class="btn btn-ghost rounded-full text-slate-500 font-bold hover:bg-slate-100 px-6">Cancel</button>
			<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md">
				{isEditMode ? 'Save Changes' : 'Create Alias'}
			</button>
		</div>
	</form>
</Modal>
