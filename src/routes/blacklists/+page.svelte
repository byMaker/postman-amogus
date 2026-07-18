<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import { toast } from '$lib/state/toast.svelte';
	import { NotePencil, Trash, XCircle, At, EnvelopeSimple, Numpad, ShieldWarning, ShieldCheck, Skull } from 'phosphor-svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	let { data, form } = $props();

	let activeSubTab = $state('domains');

	let activeTableKey = $derived.by(() => {
		if (activeSubTab === 'domains') return 'blackDomains';
		if (activeSubTab === 'emails') return 'blackEmails';
		if (activeSubTab === 'ips') return 'blackIps';
		if (activeSubTab === 'dkim') return 'dkimRequiredDomains';
		return 'dnsgBlacklist';
	});

	let activeData: any[] = $derived(data[activeTableKey as keyof typeof data] || []);

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
		if (activeSubTab === 'dnsbl') return 'DNS Domain';
		if (activeSubTab === 'dkim') return 'Domain Name';
		if (activeSubTab === 'domains') return 'Domain Name';
		if (activeSubTab === 'emails') return 'Email Address';
		return 'IP Address / Subnet';
	}
</script>

<div class="space-y-6 max-w-6xl mx-auto">
	<div class="flex items-center justify-between px-6 pb-2">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<Skull size={36} weight="fill" class="text-rose-600" />
				Blacklists
			</h2>
			<p class="text-slate-500 mt-1">Block incoming mail from specific sources</p>
		</div>
		<button onclick={openAddModal} class="rounded-full bg-amogus-blue px-6 py-3 font-bold text-white shadow hover:bg-amogus-brown active:scale-95 transition-all">
			+ Add Entry
		</button>
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
			<button class="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 {activeSubTab === 'dnsbl' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}" onclick={() => activeSubTab = 'dnsbl'}>
				<ShieldWarning size={20} weight={activeSubTab === 'dnsbl' ? 'fill' : 'regular'} /> Global DNSBL
			</button>
			<button class="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 {activeSubTab === 'dkim' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}" onclick={() => activeSubTab = 'dkim'}>
				<ShieldCheck size={20} weight={activeSubTab === 'dkim' ? 'fill' : 'regular'} /> DKIM Required
			</button>
		</div>
	</div>

	<!-- List Data Table -->
	<div class="overflow-hidden rounded-[32px] border border-slate-200 shadow-sm bg-white animate-in fade-in duration-300">
		<table class="w-full text-left text-sm">
			<thead class="bg-amogus-light text-xs uppercase tracking-wide text-amogus-dark">
				<tr>
					<th class="px-6 py-5">{getTargetLabel()}</th>
					<th class="px-6 py-5">Status</th>
					<th class="px-6 py-5">Description</th>
					<th class="px-6 py-5 text-right">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each activeData as item}
					{@const target = item.domain || item.email || item.host || item.dnsDomain}
					{@const desc = item.description || item.dnsDescription || '—'}
					{@const act = item.active !== undefined ? item.active : item.dnsgKey}
					<tr class="hover:bg-slate-50 transition-colors group">
						<td class="px-6 py-5 font-bold text-amogus-dark text-base">{target}</td>
						<td class="px-6 py-5">
							{#if act === 1}
								<span class="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">Active</span>
							{:else}
								<span class="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">Disabled</span>
							{/if}
						</td>
						<td class="px-6 py-5 text-slate-500">{desc}</td>
						<td class="px-6 py-5 text-right">
							<div class="flex justify-end gap-3 transition-opacity">
								{#if activeSubTab !== 'dnsbl' && activeSubTab !== 'dkim'}
									<Tooltip text="Edit" position="top">
										<button onclick={() => openEditModal(item)} class="text-amogus-blue hover:text-white hover:bg-amogus-blue bg-blue-50 p-2 rounded-full transition-colors">
											<NotePencil size={24} weight="fill" />
										</button>
									</Tooltip>
								{/if}
								<Tooltip text="Delete" position="top">
									<button onclick={() => requestDelete(item)} class="text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 p-2 rounded-full transition-colors">
										<Trash size={24} weight="fill" />
									</button>
								</Tooltip>
							</div>
						</td>
					</tr>
				{/each}
				{#if activeData.length === 0}
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
		<div class="flex justify-between mt-4">
			<button type="button" onclick={() => showDeleteModal = false} class="btn btn-ghost rounded-full text-slate-500 font-bold hover:bg-slate-100 px-6">Cancel</button>
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
			<input type="text" name="target" bind:value={currentEntry.target} required 
				pattern={activeSubTab === 'domains' ? "^([a-zA-Z0-9\-]+\\.)+[a-zA-Z]{2,}$" : (activeSubTab === 'emails' ? "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$" : undefined)}
				title={activeSubTab === 'domains' ? "Please enter a valid domain name (e.g. example.com)" : (activeSubTab === 'emails' ? "Please enter a valid email address" : "Please enter a valid IP address")}
				readonly={isEditMode && activeTableKey === 'dnsgBlacklist'} class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all {isEditMode && activeTableKey === 'dnsgBlacklist' ? 'opacity-60 cursor-not-allowed' : ''}" />
		</div>

		<div class="form-control">
			<div class="label"><span class="label-text font-bold text-slate-700">Description</span></div>
			<input type="text" name="description" bind:value={currentEntry.description} class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" />
		</div>

		<label class="cursor-pointer flex items-center gap-3 pt-2">
			<input type="checkbox" name="active" bind:checked={currentEntry.active} class="toggle toggle-info bg-white" />
			<span class="font-bold text-slate-700">Active</span>
		</label>

		<div class="modal-action mt-8 pt-4 flex justify-between">
			<button type="button" onclick={() => showModal = false} class="btn btn-ghost rounded-full text-slate-500 font-bold hover:bg-slate-100 px-6">Cancel</button>
			<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md">
				{isEditMode ? 'Save Changes' : 'Create'}
			</button>
		</div>
	</form>
</Modal>
