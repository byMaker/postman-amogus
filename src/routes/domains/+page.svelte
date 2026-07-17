<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import CommentPopover from '$lib/components/CommentPopover.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { toast } from '$lib/state/toast.svelte';
	import { NotePencil, Trash, WarningCircle, At, EnvelopeSimple, Ghost } from 'phosphor-svelte';

	let { data, form } = $props();

	let showModal = $state(false);
	let isEditMode = $state(false);
	
	let currentDomain = $state({
		domain: '',
		description: '',
		active: true,
		backupmx: false
	});

	let activeTab = $state('general');
	let domainToDelete: any = $state(null);
	let showDeleteModal = $state(false);

	function openAddModal() {
		isEditMode = false;
		activeTab = 'general';
		currentDomain = { domain: '', description: '', active: true, backupmx: false };
		showModal = true;
	}

	function openEditModal(d: any) {
		isEditMode = true;
		activeTab = 'general';
		currentDomain = { 
			domain: d.domain, 
			description: d.description || '', 
			active: d.active === 1, 
			backupmx: d.backupmx === 1 
		};
		showModal = true;
	}

	function requestDelete(d: any) {
		domainToDelete = d;
		showDeleteModal = true;
	}
</script>

<div class="space-y-6">
	<!-- Заголовок и кнопка добавления -->
	<div class="flex items-center justify-between px-6 pb-2">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<At size={36} weight="fill" class="text-violet-500" />
				Domains
			</h2>
			<p class="text-slate-500 mt-1">Manage email domains</p>
		</div>
		<button onclick={openAddModal} class="rounded-full bg-amogus-blue px-6 py-3 font-bold text-white shadow hover:bg-amogus-brown active:scale-95 transition-all">
			+ Add Domain
		</button>
	</div>

	<!-- Таблица доменов -->
	<div class="rounded-[32px] border border-slate-200 shadow-sm bg-white">
		<table class="w-full text-left text-sm">
			<thead class="bg-amogus-light text-xs uppercase tracking-wide text-amogus-dark">
				<tr>
					<th class="px-6 py-5 first:rounded-tl-[32px]">Domain Name</th>
					<th class="px-6 py-5">Status & Roles</th>
					<th class="px-6 py-5">Usage</th>
					<th class="px-6 py-5">Description</th>
					<th class="px-6 py-5 text-right last:rounded-tr-[32px]">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100 bg-white rounded-b-[32px]">
				{#each data.domains as domain, index}
					<tr class="hover:bg-slate-50 transition-colors group">
						<td class="px-6 py-5 font-bold text-amogus-dark text-lg {index === data.domains.length - 1 ? 'rounded-bl-[32px]' : ''}">{domain.domain}</td>
						<td class="px-6 py-5">
							<div class="flex gap-2 items-center">
								{#if domain.active}
									<span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Active</span>
								{:else}
									<span class="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">Disabled</span>
								{/if}
								{#if domain.backupmx}
									<span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Backup MX</span>
								{/if}
							</div>
						</td>
						<td class="px-6 py-5">
							<div class="flex items-center gap-4 text-slate-500 font-bold">
								<Tooltip text="Mailboxes" position="top">
									<div class="flex items-center gap-1">
										<EnvelopeSimple size={18} weight="fill" />
										{domain.mailboxesCount}
									</div>
								</Tooltip>
								<Tooltip text="Aliases" position="top">
									<div class="flex items-center gap-1">
										<Ghost size={18} weight="fill" />
										{domain.aliasesCount}
									</div>
								</Tooltip>
							</div>
						</td>
						<td class="px-6 py-5">
							<div class="flex items-center gap-2">
								<CommentPopover 
									comment={domain.description || ''} 
									onsave={(newComment) => {
										domain.description = newComment;
										handleQuickComment(domain);
									}} 
								/>
								<span class="text-slate-500 truncate max-w-[150px] block">{domain.description || '—'}</span>
							</div>
						</td>
						<td class="px-6 py-5 text-right {index === data.domains.length - 1 ? 'rounded-br-[32px]' : ''}">
							<div class="flex justify-end gap-3 transition-opacity">
								<Tooltip text="Edit" position="top">
									<button onclick={() => openEditModal(domain)} class="text-amogus-blue hover:text-white hover:bg-amogus-blue bg-blue-50 p-2 rounded-full transition-colors">
										<NotePencil size={24} weight="fill" />
									</button>
								</Tooltip>
								<Tooltip text="Delete" position="top">
									<button onclick={() => requestDelete(domain)} class="text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 p-2 rounded-full transition-colors">
										<Trash size={24} weight="fill" />
									</button>
								</Tooltip>
							</div>
						</td>
					</tr>
				{/each}
				{#if data.domains.length === 0}
					<tr>
						<td colspan="5" class="px-6 py-12 text-center text-slate-500 rounded-b-[32px]">No domains found. Add your first domain!</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<Modal bind:show={showDeleteModal} title="Delete Domain">
	<p class="text-slate-600 font-medium mb-8 text-lg">Are you sure you want to permanently delete the domain <span class="font-bold text-rose-600">{domainToDelete?.domain}</span>? This action cannot be undone.</p>
	<form method="POST" action="?/delete" use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.success) {
				toast.success('Domain deleted!');
				showDeleteModal = false;
			} else {
				toast.error(result.data?.error || 'Failed to delete domain');
			}
			update();
		};
	}}>
		<input type="hidden" name="domain" value={domainToDelete?.domain} />
		<div class="flex justify-between mt-4">
			<button type="button" onclick={() => showDeleteModal = false} class="btn btn-ghost rounded-full text-slate-500 font-bold hover:bg-slate-100 px-6">Cancel</button>
			<button type="submit" class="btn bg-rose-600 text-white hover:bg-rose-700 rounded-full px-8 font-bold border-none shadow-md">
				Yes, Delete
			</button>
		</div>
	</form>
</Modal>

<Modal bind:show={showModal} title={isEditMode ? 'Manage Domain' : 'Add New Domain'}>
	
	{#if isEditMode}
		<div role="tablist" class="tabs tabs-bordered mb-8">
			<button type="button" role="tab" class="tab {activeTab === 'general' ? 'tab-active font-black text-amogus-dark border-[#1E3A8A]' : 'font-bold text-slate-400 hover:text-slate-600'}" onclick={() => activeTab = 'general'}>General Settings</button>
			<button type="button" role="tab" class="tab {activeTab === 'aliases' ? 'tab-active font-black text-amogus-dark border-[#1E3A8A]' : 'font-bold text-slate-400 hover:text-slate-600'}" onclick={() => activeTab = 'aliases'}>Domain Aliases</button>
			<button type="button" role="tab" class="tab {activeTab === 'dkim' ? 'tab-active font-black text-amogus-dark border-[#1E3A8A]' : 'font-bold text-slate-400 hover:text-slate-600'}" onclick={() => activeTab = 'dkim'}>DKIM Security</button>
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
				<div class="label"><span class="label-text font-bold text-slate-700">Domain Name</span></div>
				<input 
					type="text" 
					name="domain" 
					bind:value={currentDomain.domain} 
					readonly={isEditMode}
					class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all {isEditMode ? 'opacity-60 cursor-not-allowed' : ''}" 
					placeholder="example.com" 
					required 
				/>
			</div>

			<div class="form-control">
				<div class="label"><span class="label-text font-bold text-slate-700">Description (optional)</span></div>
				<input 
					type="text" 
					name="description" 
					bind:value={currentDomain.description}
					class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" 
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
				<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md">
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
