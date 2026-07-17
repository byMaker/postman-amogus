<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import { toast } from '$lib/state/toast.svelte';

	let { data, form } = $props();

	let showModal = $state(false);
	let isEditMode = $state(false);
	
	let currentDomain = $state({
		domain: '',
		comment: '',
		active: true,
		backupmx: false
	});

	let activeTab = $state('general');

	function openAddModal() {
		isEditMode = false;
		activeTab = 'general';
		currentDomain = { domain: '', comment: '', active: true, backupmx: false };
		showModal = true;
	}

	function openEditModal(d: any) {
		isEditMode = true;
		activeTab = 'general';
		currentDomain = { 
			domain: d.domain, 
			comment: d.comment || '', 
			active: d.active === 1, 
			backupmx: d.backupmx === 1 
		};
		showModal = true;
	}
</script>

<div class="space-y-6">
	<!-- Заголовок и кнопка добавления -->
	<div class="flex items-center justify-between px-6 pb-2">
		<div>
			<h2 class="text-3xl font-bold text-[#1E3A8A]">Domains</h2>
			<p class="text-slate-500 mt-1">Manage email domains</p>
		</div>
		<button onclick={openAddModal} class="rounded-full bg-[#1E3A8A] px-6 py-3 font-bold text-white shadow hover:bg-blue-800 active:scale-95 transition-all">
			+ Add Domain
		</button>
	</div>

	<!-- Таблица доменов -->
	<div class="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
		<table class="w-full text-left text-sm">
			<thead class="bg-[#E3F2FD] text-xs uppercase tracking-wide text-[#1E3A8A]">
				<tr>
					<th class="px-6 py-5">Domain Name</th>
					<th class="px-6 py-5">Status</th>
					<th class="px-6 py-5">Comment</th>
					<th class="px-6 py-5 text-right">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100 bg-white">
				{#each data.domains as domain}
					<tr class="hover:bg-slate-50 transition-colors group">
						<td class="px-6 py-5 font-bold text-slate-800 text-base">{domain.domain}</td>
						<td class="px-6 py-5">
							{#if domain.active}
								<span class="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">Active</span>
							{:else}
								<span class="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">Disabled</span>
							{/if}
						</td>
						<td class="px-6 py-5 text-slate-500">{domain.comment || '—'}</td>
						<td class="px-6 py-5 text-right">
							<div class="flex justify-end gap-3 transition-opacity">
								<button onclick={() => openEditModal(domain)} class="text-[#0284C7] hover:text-white hover:bg-[#0284C7] bg-blue-50 p-2 rounded-full transition-colors" title="Edit">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
								</button>
								<form 
									method="POST" 
									action="?/delete" 
									use:enhance={() => {
										return async ({ result, update }) => {
											if (result.type === 'success' && result.data?.success) {
												toast.success('Domain deleted!');
											} else {
												toast.error(result.data?.error || 'Failed to delete domain');
											}
											update();
										};
									}}
									onsubmit={(e) => {
										if (!confirm('Are you sure you want to delete this domain?')) {
											e.preventDefault();
										}
									}}
								>
									<input type="hidden" name="domain" value={domain.domain} />
									<button class="text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 p-2 rounded-full transition-colors" title="Delete">
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
									</button>
								</form>
							</div>
						</td>
					</tr>
				{/each}
				{#if data.domains.length === 0}
					<tr>
						<td colspan="4" class="px-6 py-12 text-center text-slate-500">No domains found. Add your first domain!</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<Modal bind:show={showModal} title={isEditMode ? 'Manage Domain' : 'Add New Domain'}>
	
	{#if isEditMode}
		<div role="tablist" class="tabs tabs-bordered mb-8">
			<button type="button" role="tab" class="tab {activeTab === 'general' ? 'tab-active font-black text-[#1E3A8A] border-[#1E3A8A]' : 'font-bold text-slate-400 hover:text-slate-600'}" onclick={() => activeTab = 'general'}>General Settings</button>
			<button type="button" role="tab" class="tab {activeTab === 'aliases' ? 'tab-active font-black text-[#1E3A8A] border-[#1E3A8A]' : 'font-bold text-slate-400 hover:text-slate-600'}" onclick={() => activeTab = 'aliases'}>Domain Aliases</button>
			<button type="button" role="tab" class="tab {activeTab === 'dkim' ? 'tab-active font-black text-[#1E3A8A] border-[#1E3A8A]' : 'font-bold text-slate-400 hover:text-slate-600'}" onclick={() => activeTab = 'dkim'}>DKIM Security</button>
		</div>
	{/if}

	{#if activeTab === 'general' || !isEditMode}
		<form method="POST" action={isEditMode ? "?/update" : "?/create"} use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success' && result.data?.success) {
					toast.success(isEditMode ? 'Domain saved!' : 'Domain created!');
					showModal = false;
				} else {
					toast.error(result.data?.error || 'An error occurred');
				}
				update();
			};
		}} class="space-y-5 animate-in fade-in duration-300">
			
			{#if isEditMode}
				<input type="hidden" name="originalDomain" value={currentDomain.domain} />
			{/if}

			<div class="form-control">
				<label class="label"><span class="label-text font-bold text-slate-700">Domain Name</span></label>
				<input 
					type="text" 
					name="domain" 
					bind:value={currentDomain.domain} 
					readonly={isEditMode}
					class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition-all {isEditMode ? 'opacity-60 cursor-not-allowed' : ''}" 
					placeholder="example.com" 
					required 
				/>
			</div>

			<div class="form-control">
				<label class="label"><span class="label-text font-bold text-slate-700">Comment (optional)</span></label>
				<input 
					type="text" 
					name="comment" 
					bind:value={currentDomain.comment}
					class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition-all" 
				/>
			</div>

			<div class="flex gap-6 pt-2">
				<label class="cursor-pointer flex items-center gap-3">
					<input type="checkbox" name="active" bind:checked={currentDomain.active} class="toggle toggle-info bg-white" />
					<span class="font-medium text-slate-700">Active</span>
				</label>
				<label class="cursor-pointer flex items-center gap-3">
					<input type="checkbox" name="backupmx" bind:checked={currentDomain.backupmx} class="toggle toggle-info bg-white" />
					<span class="font-medium text-slate-700">Backup MX</span>
				</label>
			</div>

			<div class="modal-action mt-8 pt-4 flex justify-between">
				<button type="button" onclick={() => showModal = false} class="btn btn-ghost rounded-full text-slate-500 font-bold hover:bg-slate-100 px-6">Cancel</button>
				<button type="submit" class="btn border-none bg-[#1E3A8A] text-white hover:bg-[#0284C7] rounded-full px-8 font-bold shadow-md">
					{isEditMode ? 'Save Changes' : 'Create Domain'}
				</button>
			</div>
		</form>
	{/if}

	{#if activeTab === 'aliases'}
		<div class="space-y-6 animate-in fade-in duration-300">
			<div class="bg-blue-50 text-blue-800 p-5 rounded-2xl font-medium text-sm border border-blue-100">
				All emails sent to the domains listed below will be seamlessly forwarded to <span class="font-black">@{currentDomain.domain}</span>.
			</div>
			
			<div class="text-center py-8 text-slate-400">
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 opacity-50"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
				<p>Domain Aliases backend logic coming soon.</p>
			</div>
		</div>
	{/if}

	{#if activeTab === 'dkim'}
		<div class="space-y-6 animate-in fade-in duration-300">
			<div class="bg-emerald-50 text-emerald-800 p-5 rounded-2xl font-medium text-sm border border-emerald-100">
				Enforce strict DKIM signature validation for all incoming mail to <span class="font-black">@{currentDomain.domain}</span> to prevent spoofing.
			</div>

			<div class="text-center py-8 text-slate-400">
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 opacity-50"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
				<p>DKIM Security backend logic coming soon.</p>
			</div>
		</div>
	{/if}
</Modal>
