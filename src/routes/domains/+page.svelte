<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import CommentPopover from '$lib/components/CommentPopover.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import ValidatedInput from '$lib/components/ValidatedInput.svelte';
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
	
	let originalDomainName = $state('');
	let currentDomainData = $derived(data.domains.find(d => d.domain === originalDomainName) || { domainAliases: [], dkimActive: false, active: 1, backupmx: 0, description: '' });
	let editForm: HTMLFormElement;
	let showUpdateConfirm = $state(false);

	function openAddModal() {
		isEditMode = false;
		activeTab = 'general';
		originalDomainName = '';
		currentDomain = { domain: '', description: '', active: true, backupmx: false, dkimActive: false };
		showModal = true;
	}

	function openEditModal(d: any) {
		isEditMode = true;
		activeTab = 'general';
		originalDomainName = d.domain;
		currentDomain = { 
			domain: d.domain, 
			description: d.description || '', 
			active: d.active === 1, 
			backupmx: d.backupmx === 1,
			dkimActive: d.dkimActive === true
		};
		showModal = true;
	}

	import { invalidateAll } from '$app/navigation';
	function requestDelete(d: any) {
		domainToDelete = d;
		showDeleteModal = true;
	}

	async function handleQuickComment(domain: any) {
		const fd = new FormData();
		fd.append('originalDomain', domain.domain);
		fd.append('domain', domain.domain);
		fd.append('description', domain.description || '');
		fd.append('active', domain.active ? '1' : '');
		fd.append('backupmx', domain.backupmx ? '1' : '');
		if (domain.dkimActive) fd.append('dkimActive', 'on');

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
	<div class="rounded-[32px] border border-slate-200 shadow-sm bg-white overflow-hidden">
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
						<td class="px-6 py-5 font-bold {domain.active ? 'text-violet-500' : 'text-slate-400'} text-lg {index === data.domains.length - 1 ? 'rounded-bl-[32px]' : ''} transition-colors">@{domain.domain}</td>
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
								{#if domain.dkimActive}
									<span class="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">DKIM Enforced</span>
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
								<Tooltip text="Email Aliases" position="top">
									<div class="flex items-center gap-1">
										<Ghost size={18} weight="fill" />
										{domain.aliasesCount}
									</div>
								</Tooltip>
								<Tooltip text="Domain Aliases" position="top">
									<div class="flex items-center gap-1">
										<At size={18} weight="fill" />
										{(domain.domainAliases || []).length}
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
	<div class="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl mb-8 shadow-sm">
		<h3 class="font-bold text-xl mb-3 text-rose-900">Are you absolutely sure?</h3>
		<p class="mb-5 text-sm">You are about to permanently delete <span class="font-bold px-1.5 py-0.5 bg-rose-200 rounded text-rose-900">@{domainToDelete?.domain}</span>.</p>
		
		<div class="bg-white rounded-xl p-4 space-y-3 font-medium text-sm">
			<div class="flex justify-between items-center text-slate-600">
				<div class="flex items-center gap-2"><EnvelopeSimple size={18} weight="fill" /> Mailboxes lost</div>
				<span class="font-bold text-rose-600 text-base">{domainToDelete?.mailboxesCount || 0}</span>
			</div>
			<div class="flex justify-between items-center text-slate-600">
				<div class="flex items-center gap-2"><Ghost size={18} weight="fill" /> Email Aliases removed</div>
				<span class="font-bold text-rose-600 text-base">{domainToDelete?.aliasesCount || 0}</span>
			</div>
			<div class="flex justify-between items-center text-slate-600">
				<div class="flex items-center gap-2"><At size={18} weight="fill" /> Domain Aliases orphaned</div>
				<span class="font-bold text-rose-600 text-base">{(domainToDelete?.domainAliases || []).length}</span>
			</div>
		</div>
	</div>
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
			<button type="button" onclick={() => showDeleteModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6">Cancel</button>
			<button type="submit" class="btn bg-rose-600 text-white hover:bg-rose-700 rounded-full px-8 font-bold border-none shadow-md">
				Yes, Delete
			</button>
		</div>
	</form>
</Modal>

<Modal bind:show={showModal} title={isEditMode ? 'Manage Domain' : 'Add New Domain'}>
	
	{#if isEditMode}
		<div class="flex justify-center mb-8">
			<div class="inline-flex bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner">
				<button type="button" class="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 {activeTab === 'general' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}" onclick={() => activeTab = 'general'}>
					General
				</button>
				<button type="button" class="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 {activeTab === 'aliases' ? 'bg-white text-amogus-dark shadow-sm' : 'text-slate-500 hover:text-amogus-dark'}" onclick={() => activeTab = 'aliases'}>
					<At size={16} weight="fill" />
					Aliases
				</button>
			</div>
		</div>
	{/if}

	{#if activeTab === 'general' || !isEditMode}
		<form bind:this={editForm} method="POST" action={isEditMode ? "?/update" : "?/create"} use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success' && result.data?.success) {
					toast.success(isEditMode ? 'Domain saved!' : 'Domain created!');
					showModal = false;
					showUpdateConfirm = false;
				} else {
					toast.error(result.data?.error || 'An error occurred');
				}
				update();
			};
		}} class="space-y-5 animate-in fade-in duration-300">
			
			{#if isEditMode}
				<input type="hidden" name="originalDomain" value={originalDomainName} />
			{/if}

			<div class="form-control">
				<div class="label"><span class="label-text font-bold text-slate-700">Domain Name</span></div>
				<ValidatedInput
					name="domain" 
					bind:value={currentDomain.domain} 
					className="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" 
					placeholder="example.com" 
					required 
					pattern={"^([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,}$"}
					title="Please enter a valid domain name (e.g. example.com)"
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

			<div class="pt-2 pb-2">
				<label class="cursor-pointer inline-flex items-center gap-3">
					<input type="checkbox" name="active" bind:checked={currentDomain.active} class="toggle toggle-amogus" />
					<span class="font-medium text-slate-700">Active Domain</span>
				</label>
			</div>

			<div class="mt-8 space-y-4 border-t border-slate-100 pt-6">
				<!-- Backup MX Block -->
				<div class="bg-amber-50/70 p-5 rounded-2xl border border-amber-100/70">
					<div class="flex items-center justify-between">
						<div class="pr-4">
							<div class="font-bold text-slate-700">Backup MX (Secondary Mail Exchanger)</div>
							<div class="text-sm text-slate-600 mt-1 leading-snug">Turn ON only if this server acts as a backup for another primary mail server. If this is your main server, leave OFF.</div>
						</div>
						<label class="cursor-pointer shrink-0">
							<input type="checkbox" name="backupmx" bind:checked={currentDomain.backupmx} class="toggle toggle-amogus" />
						</label>
					</div>
				</div>

				<!-- DKIM Block -->
				<div class="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-100/70">
						<div class="flex items-center justify-between">
							<div class="pr-4">
								<div class="font-bold text-slate-700">Enforce DKIM Required</div>
								<div class="text-sm text-slate-500 mt-1 leading-snug">Reject emails without a valid DKIM signature to prevent spoofing.</div>
							</div>
							<label class="cursor-pointer shrink-0">
								<input 
									type="checkbox" 
									name="dkimActive"
									bind:checked={currentDomain.dkimActive} 
									class="toggle toggle-amogus" 
								/>
							</label>
						</div>
					</div>
				</div>

			<div class="modal-action mt-8 pt-4 flex justify-between">
				<button type="button" onclick={() => showModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6">Cancel</button>
				{#if isEditMode}
					<button type="button" onclick={() => {
						const isDangerousChange = 
							currentDomain.domain !== originalDomainName ||
							currentDomain.active !== (currentDomainData.active === 1) ||
							currentDomain.backupmx !== (currentDomainData.backupmx === 1) ||
							currentDomain.dkimActive !== currentDomainData.dkimActive;
						
						if (isDangerousChange) {
							showUpdateConfirm = true;
						} else {
							editForm.requestSubmit();
						}
					}} class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md">
						Save Changes
					</button>
				{:else}
					<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md">
						Create Domain
					</button>
				{/if}
			</div>
		</form>
	{/if}

	{#if activeTab === 'aliases'}
		<div class="space-y-6 animate-in fade-in duration-300">
			<div class="bg-blue-50 text-blue-800 p-5 rounded-2xl font-medium text-sm border border-blue-100 leading-relaxed">
				All emails sent to the domains listed below will be seamlessly forwarded to <span class="font-black">@{currentDomain.domain}</span>.<br>
				<span class="text-blue-700/80 mt-1 block">Note: You do not need to create these aliases as primary domains first. If an alias also exists as a primary domain, this forwarding rule will override its local mailboxes. Additionally, each mailbox can individually enable or disable receiving mail from these domain aliases in its own settings.</span>
			</div>
			
			<div class="space-y-3">
				{#each currentDomainData.domainAliases || [] as alias}
					<div class="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
						<div class="font-bold text-slate-700">@{alias.aliasDomain}</div>
						<form method="POST" action="?/deleteDomainAlias" use:enhance={() => {
							return async ({ result, update }) => {
								if (result.type === 'success') { toast.success('Alias deleted'); }
								update();
							};
						}}>
							<input type="hidden" name="aliasDomain" value={alias.aliasDomain} />
							<button type="submit" class="text-rose-500 hover:bg-rose-100 p-2 rounded-full transition-colors"><Trash size={20} weight="fill" /></button>
						</form>
					</div>
				{:else}
					<div class="text-center py-4 text-slate-400 text-sm">No domain aliases configured.</div>
				{/each}
			</div>
			
			{#if (currentDomainData.domainAliases || []).length < 5}
				<form method="POST" action="?/addDomainAlias" use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success' && result.data?.success) { toast.success('Alias added'); }
						else { toast.error(result.data?.error || 'Failed to add alias'); }
						update();
					};
				}} class="flex gap-3">
					<input type="hidden" name="targetDomain" value={currentDomain.domain} />
					<ValidatedInput name="aliasDomain" placeholder="e.g. example.net" required pattern={"^([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,}$"} title="Please enter a valid domain name (e.g. example.com)" className="input input-bordered flex-1 rounded-2xl bg-white border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
					<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-2xl px-6 font-bold shadow-sm">Add Alias</button>
				</form>
			{:else}
				<div class="p-4 bg-amber-50 text-amber-800 text-sm font-bold rounded-2xl text-center border border-amber-200">
					Maximum limit of 5 aliases reached for this domain.
				</div>
			{/if}
		</div>
	{/if}


</Modal>

<Modal bind:show={showUpdateConfirm} title="Confirm Changes">
	<p class="text-slate-600 font-medium mb-6 text-base">You are changing critical settings for <span class="font-bold text-amogus-dark">@{currentDomain.domain}</span>. Please review:</p>
	<div class="space-y-4 mb-8">
		<div class="flex flex-col">
			<span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
			<span class="font-medium {currentDomain.active !== (currentDomainData.active === 1) ? 'text-rose-600 font-bold' : (currentDomain.active ? 'text-emerald-600' : 'text-slate-500')}">
				{currentDomain.active ? 'Active' : 'Disabled'} {currentDomain.active !== (currentDomainData.active === 1) ? '(changed)' : ''}
			</span>
		</div>
		<div class="flex flex-col">
			<span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Routing</span>
			<span class="font-medium {currentDomain.backupmx !== (currentDomainData.backupmx === 1) ? 'text-rose-600 font-bold' : (currentDomain.backupmx ? 'text-amber-600' : 'text-slate-500')}">
				{currentDomain.backupmx ? 'Backup MX' : 'Primary MX'} {currentDomain.backupmx !== (currentDomainData.backupmx === 1) ? '(changed)' : ''}
			</span>
		</div>
		<div class="flex flex-col">
			<span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">DKIM Enforced</span>
			<span class="font-medium {currentDomain.dkimActive !== currentDomainData.dkimActive ? 'text-rose-600 font-bold' : (currentDomain.dkimActive ? 'text-indigo-600' : 'text-slate-500')}">
				{currentDomain.dkimActive ? 'Yes' : 'No'} {currentDomain.dkimActive !== currentDomainData.dkimActive ? '(changed)' : ''}
			</span>
		</div>
		<div class="flex flex-col">
			<span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Domain Name</span>
			<span class="font-medium {currentDomain.domain !== originalDomainName ? 'text-rose-600 font-bold' : 'text-slate-700'}">
				{currentDomain.domain} {currentDomain.domain !== originalDomainName ? '(changed)' : ''}
			</span>
		</div>
	</div>
	<div class="modal-action flex justify-between mt-6">
		<button type="button" onclick={() => { showUpdateConfirm = false; showModal = true; }} class="btn btn-ghost rounded-full text-slate-500 font-bold hover:bg-slate-100 px-6">Back to Edit</button>
		<button type="button" onclick={() => { showUpdateConfirm = false; editForm.requestSubmit(); }} class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md">Confirm & Save</button>
	</div>
</Modal>
