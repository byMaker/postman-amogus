<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import CommentPopover from '$lib/components/CommentPopover.svelte';
	import { updateDomain } from '$lib/api/actions';
	import { PLACEHOLDERS } from "$lib/constants/placeholders";
	import Tooltip from '$lib/components/Tooltip.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Tr from '$lib/components/ui/Tr.svelte';
	import Th from '$lib/components/ui/Th.svelte';
	import Td from '$lib/components/ui/Td.svelte';
	import ActionButtons from '$lib/components/ui/ActionButtons.svelte';
	import ValidatedInput from '$lib/components/ValidatedInput.svelte';
	import { toast } from '$lib/state/toast.svelte';
	import { NotePencil, Trash, WarningCircle, At, Mailbox, Ghost } from 'phosphor-svelte';
	import SegmentedControl from '$lib/components/SegmentedControl.svelte';
	import { t } from '$lib/i18n';

	let { data, form } = $props();

	let showModal = $state(false);
	let isEditMode = $state(false);
	
	let currentDomain = $state({
		domain: '',
		description: '',
		active: true,
		backupmx: false,
		dkimActive: false
	});

	let activeTab = $state('general');
	let domainToDelete: any = $state(null);
	let showDeleteModal = $state(false);
	let showDeleteConfirm = $state(false);
	let deleteCascade = $state(false);
	let deleteConfirmText = $state('');
	let deleteForm = $state<HTMLFormElement>();
	
	let originalDomainName = $state('');
	let currentDomainData = $derived(data.domains.find(d => d.domain === originalDomainName) || { domainAliases: [], dkimActive: false, active: 1, backupmx: 0, description: '' });
	let editForm = $state<HTMLFormElement>();
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

	import { invalidateAll, replaceState } from '$app/navigation';
	import { page } from '$app/stores';



	function requestDelete(d: any) {
		domainToDelete = d;
		deleteCascade = false;
		deleteConfirmText = '';
		showDeleteModal = true;
		showDeleteConfirm = false;
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
			await updateDomain(fd);
			toast.success(t('toast.saved'));
			await invalidateAll();
		} catch (e) {
			toast.error(t('toast.failed_save'));
		}
	}
</script>

<div class="space-y-6">
	<!-- Header and Add button -->
	<div class="flex flex-col md:flex-row md:items-center justify-between px-0 md:px-6 pb-2 gap-4">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<At size={36} weight="fill" class="text-violet-500" />
				{t('card.domains')}
			</h2>
			<p class="text-slate-500 mt-1">{t('card.domains.desc')}</p>
		</div>
		<button onclick={openAddModal} class="w-full md:w-auto rounded-full bg-amogus-blue px-6 py-3 font-bold text-white shadow hover:bg-amogus-brown active:scale-95 transition-all">
			+ {t('domain.add')}
		</button>
	</div>

	<!-- Domains table -->
	<Table>
			<thead class="hidden lg:table-header-group">
				<tr class="text-xs font-black uppercase tracking-widest text-amogus-blue">
					<th class="px-6 py-5">{t('domain.table.name')}</th>
					<th class="px-6 py-5">{t('domain.table.status')}</th>
					<th class="px-6 py-5">{t('domain.table.usage')}</th>
					<th class="px-6 py-5 hidden lg:table-cell">{t('table.description')}</th>
					<th class="px-6 py-5 text-right last:rounded-tr-[32px]">{t('table.actions')}</th>
				</tr>
			</thead>
			<tbody class="block lg:table-row-group divide-y divide-slate-100 bg-white rounded-[32px] lg:rounded-none lg:rounded-b-[32px]">
				{#each data.domains as domain, index (domain.domain)}
					<Tr id="row-{domain.domain}" class="block lg:table-row hover:bg-slate-50 transition-colors group p-4 lg:p-0 max-lg:border-b max-lg:border-slate-100 max-lg:last:border-b-0 first:rounded-t-[32px] lg:first:rounded-none last:rounded-b-[32px]">
						<Td class="font-bold {domain.active ? 'text-violet-500' : 'text-slate-400'} text-sm {index === data.domains.length - 1 ? 'lg:rounded-bl-[32px]' : ''} transition-colors max-lg:border-b max-lg:border-b-slate-50">
							<span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('domain.table.name')}</span>
							<span>@{domain.domain}</span>
						</Td>
						<Td>
							<span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('domain.table.status')}</span>
							<div class="flex gap-2 items-center">
								{#if domain.active}
									<span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs tracking-wider">{t('status.active')}</span>
								{:else}
									<span class="px-3 py-1 rounded-full bg-slate-200 text-slate-600 font-bold text-xs tracking-wider">{t('status.inactive')}</span>
								{/if}
								{#if domain.backupmx}
									<span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">{t('status.backup_mx')}</span>
								{/if}
								{#if domain.dkimActive}
									<span class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs tracking-wider">{t('status.dkim')}</span>
								{/if}
							</div>
						</Td>
						<Td>
							<span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('domain.table.usage')}</span>
							<div class="flex items-center gap-4 text-slate-500 font-bold">
								<Tooltip text={t('tooltip.mailboxes')} position="top">
									<div class="flex items-center gap-1">
										<span class="text-amber-500"><Mailbox size={18} weight="fill" /></span>
										{domain.mailboxesCount}
									</div>
								</Tooltip>
								<Tooltip text={t('tooltip.email_aliases')} position="top">
									<div class="flex items-center gap-1">
										<span class="text-teal-600"><Ghost size={18} weight="fill" /></span>
										{domain.aliasesCount}
									</div>
								</Tooltip>
								<Tooltip text={t('tooltip.domain_aliases')} position="top">
									<div class="flex items-center gap-1">
										<span class="text-violet-500"><At size={18} weight="fill" /></span>
										{(domain.domainAliases || []).length}
									</div>
								</Tooltip>
							</div>
						</Td>
						<Td>
							<span class="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('table.description')}</span>
							<div class="flex items-center justify-end lg:justify-start gap-2">
								<CommentPopover 
									comment={domain.description || ''} 
									onsave={(newComment) => {
										domain.description = newComment;
										handleQuickComment(domain);
									}} 
								/>
								<span class="text-slate-500 truncate max-w-[150px] sm:max-w-[200px] lg:max-w-[300px] xl:max-w-[400px] block desc-hide-lg">{domain.description || '—'}</span>
							</div>
						</Td>
						<ActionButtons isLast={index === data.domains.length - 1} onEdit={() => openEditModal(domain)} onDelete={() => requestDelete(domain)} />
					</Tr>
				{:else}
					<tr>
						<td colspan="5" class="px-6 py-12 text-center text-slate-500 rounded-b-[32px]">
							{data.domains.length === 0 ? "No domains found. Add your first domain!" : t('table.filtered_empty')}
						</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	</div>

<Modal bind:show={showDeleteModal} title={t('modal.delete')}>
	<div class="text-slate-800 mb-6">
		<p class="mb-5 text-sm">{t('modal.about_to_delete')} <span class="font-bold px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded">{domainToDelete?.domain}</span>.</p>
		
		<div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-medium text-sm mb-4">
			<div class="flex justify-between items-center text-slate-600">
				<div class="flex items-center gap-2"><Mailbox size={18} weight="fill" /> {t('domain.delete.mailboxes')}</div>
				<span class="font-bold text-rose-600 text-base">{domainToDelete?.mailboxesCount || 0}</span>
			</div>
			<div class="flex justify-between items-center text-slate-600">
				<div class="flex items-center gap-2"><Ghost size={18} weight="fill" /> {t('domain.delete.aliases')}</div>
				<span class="font-bold text-rose-600 text-base">{domainToDelete?.aliasesCount || 0}</span>
			</div>
			<div class="flex justify-between items-center text-slate-600">
				<div class="flex items-center gap-2"><At size={18} weight="fill" /> {t('domain.delete.domain_aliases')}</div>
				<span class="font-bold text-rose-600 text-base">{(domainToDelete?.domainAliases || []).length}</span>
			</div>
		</div>

		<p class="text-xs text-rose-700/80 mb-4">{t('modal.delete_domain_warning')}</p>

		<label class="cursor-pointer flex items-center gap-3 w-full bg-rose-100 p-3 rounded-xl border border-rose-200 hover:bg-rose-200 transition-colors">
			<input type="checkbox" bind:checked={deleteCascade} class="checkbox checkbox-error" />
			<span class="font-bold text-rose-900 text-sm leading-tight">{t('modal.cascade_delete')}</span>
		</label>
	</div>
	<form bind:this={deleteForm} method="POST" action="?/delete" use:enhance={({ cancel }) => {
		if (deleteCascade && !showDeleteConfirm) {
			cancel();
			showDeleteConfirm = true;
			return;
		}
		return async ({ result, update }) => {
			if (result.type === 'success' && (result as any).data?.success) {
				toast.success(t('toast.deleted'));
				showDeleteModal = false;
				showDeleteConfirm = false;
			} else {
				toast.error((result as any).data?.error || t('toast.failed_delete'));
			}
			update();
		};
	}}>
		<input type="hidden" name="domain" value={domainToDelete?.domain} />
		<input type="hidden" name="cascade" value={deleteCascade ? 'true' : 'false'} />
		<div class="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-0 mt-4">
			<button type="button" onclick={() => showDeleteModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6 w-full sm:w-auto">{t('btn.cancel')}</button>
			<button type="submit" class="btn bg-rose-600 text-white hover:bg-rose-700 rounded-full px-8 font-bold border-none shadow-md w-full sm:w-auto transition-all">
				{t('modal.yes_delete')}
			</button>
		</div>
	</form>
</Modal>

<Modal bind:show={showDeleteConfirm} title={t('modal.delete')}>
	<div class="text-slate-800 mb-6">
		<h3 class="font-bold text-xl mb-3 text-rose-600">{t('modal.are_you_sure')}</h3>
		<p class="mb-5 text-sm">{t('modal.cascade_delete')}</p>
		
		<div class="mt-4 animate-in fade-in slide-in-from-top-2">
			<div class="label pt-0 pb-1.5">
				<span class="label-text font-bold text-rose-900 whitespace-normal">{t('modal.type_domain_to_confirm')}</span>
			</div>
			<input type="text" bind:value={deleteConfirmText} placeholder={PLACEHOLDERS.domain} class="input input-bordered w-full rounded-xl bg-white border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all font-medium" />
		</div>
	</div>
	
	<div class="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-0 mt-4">
		<button type="button" onclick={() => { showDeleteConfirm = false; }} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6 w-full sm:w-auto">{t('btn.cancel')}</button>
		<button type="button" onclick={() => { deleteForm?.requestSubmit(); }} disabled={deleteConfirmText.trim() !== `${domainToDelete?.domain}`} class="btn bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-200 disabled:text-rose-400 rounded-full px-8 font-bold border-none shadow-md w-full sm:w-auto transition-all">
			{t('modal.yes_delete')}
		</button>
	</div>
</Modal>

<Modal bind:show={showModal} title={isEditMode ? t('modal.edit') : t('modal.add')}>
	
	{#if isEditMode}
		<div class="flex justify-center mb-8">
			<SegmentedControl 
				name="domain-tabs"
				bind:activeId={activeTab}
				options={[
					{ id: 'general', label: t('tab.general') },
					{ id: 'aliases', label: t('tab.aliases'), icon: At }
				]} 
			/>
		</div>
	{/if}

	{#if activeTab === 'general' || !isEditMode}
		<form bind:this={editForm} method="POST" action={isEditMode ? "?/update" : "?/create"} use:enhance={({ cancel }) => {
			if (isEditMode && !showUpdateConfirm) {
				const isDangerousChange = 
					currentDomain.domain !== originalDomainName ||
					currentDomain.active !== (currentDomainData.active === 1) ||
					currentDomain.backupmx !== (currentDomainData.backupmx === 1) ||
					currentDomain.dkimActive !== currentDomainData.dkimActive;
				
				if (isDangerousChange) {
					cancel();
					showUpdateConfirm = true;
					return;
				}
			}
			return async ({ result, update }) => {
				if (result.type === 'success' && (result as any).data?.success) {
					toast.success(isEditMode ? t('toast.saved') : t('toast.created'));
					showModal = false;
					showUpdateConfirm = false;
				} else {
					toast.error((result as any).data?.error || t('toast.failed_save'));
				}
				update();
			};
		}} class="space-y-5 animate-in fade-in duration-300">
			
			{#if isEditMode}
				<input type="hidden" name="originalDomain" value={originalDomainName} />
			{/if}

			<div class="form-control">
				<div class="label"><span class="label-text font-bold text-slate-700">{t('form.domain')}</span></div>
				<ValidatedInput
					name="domain" 
					bind:value={currentDomain.domain} 
					className="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" 
					placeholder={PLACEHOLDERS.domain} 
					required 
					pattern={"^([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,}$"}
					title="Please enter a valid domain name (e.g. example.com)"
				/>
			</div>

			<div class="form-control">
				<div class="label"><span class="label-text font-bold text-slate-700">{t('form.description')} <span class="text-slate-400 font-normal">{t('form.optional')}</span></span></div>
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
					<span class="font-medium text-slate-700">{t('form.active_domain')}</span>
				</label>
			</div>

			<div class="mt-8 space-y-4 border-t border-slate-100 pt-6">
				<!-- Backup MX Block -->
				<div class="bg-amber-50/70 p-5 rounded-2xl border border-amber-100/70">
					<div class="flex items-center justify-between">
						<div class="pr-4">
							<div class="font-bold text-slate-700">{t('form.backup_mx')}</div>
							<div class="text-sm text-slate-600 mt-1 leading-snug">{t('form.backup_mx.desc')}</div>
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
								<div class="font-bold text-slate-700">{t('form.dkim')}</div>
								<div class="text-sm text-slate-500 mt-1 leading-snug">{t('form.dkim.desc')}</div>
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

			<div class="modal-action mt-8 pt-4 flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-0">
				<button type="button" onclick={() => showModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6 w-full sm:w-auto">{t('btn.cancel')}</button>
				<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md w-full sm:w-auto transition-all">
					{t('btn.save')}
				</button>
			</div>
		</form>
	{/if}

	{#if activeTab === 'aliases'}
		<div class="space-y-6 animate-in fade-in duration-300">
			<div class="bg-blue-50 text-blue-800 p-5 rounded-2xl font-medium text-sm border border-blue-100 leading-relaxed">
				{t('domain.alias.desc1')} <span class="font-black">@{currentDomain.domain}</span>.<br>
				<span class="text-blue-700/80 mt-1 block">{t('domain.alias.desc2')}</span>
			</div>
			
			<div class="space-y-3">
				{#each currentDomainData.domainAliases || [] as alias (alias)}
					<div class="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
						<div class="font-bold text-slate-700">@{alias.aliasDomain}</div>
						<form method="POST" action="?/deleteDomainAlias" use:enhance={() => {
							return async ({ result, update }) => {
								if (result.type === 'success') { toast.success(t('toast.deleted')); }
								update();
							};
						}}>
							<input type="hidden" name="aliasDomain" value={alias.aliasDomain} />
							<button type="submit" class="text-rose-500 hover:bg-rose-100 p-2 rounded-full transition-colors"><Trash size={20} weight="fill" /></button>
						</form>
					</div>
				{:else}
					<div class="text-center py-4 text-slate-400 text-sm">{t('domain.alias.empty')}</div>
				{/each}
			</div>
			
			{#if (currentDomainData.domainAliases || []).length < 5}
				<form method="POST" action="?/addDomainAlias" use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success' && (result as any).data?.success) { toast.success(t('toast.created')); }
						else { toast.error((result as any).data?.error || t('toast.failed_save')); }
						update();
					};
				}} class="flex flex-col sm:flex-row gap-3">
					<input type="hidden" name="targetDomain" value={currentDomain.domain} />
					<ValidatedInput name="aliasDomain" placeholder={PLACEHOLDERS.domainAlias} required pattern={"^([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,}$"} title="Please enter a valid domain name (e.g. example.com)" className="input input-bordered flex-1 rounded-2xl bg-white border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
					<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-2xl px-6 font-bold shadow-sm w-full sm:w-auto">{t('domain.alias.add')}</button>
				</form>
			{:else}
				<div class="p-4 bg-amber-50 text-amber-800 text-sm font-bold rounded-2xl text-center border border-amber-200">
					{t('domain.alias.limit')}
				</div>
			{/if}
		</div>
	{/if}


</Modal>

<Modal bind:show={showUpdateConfirm} title={t('confirm.title')}>
	<p class="text-slate-600 font-medium mb-6 text-base">{t('confirm.warning')} <span class="font-bold text-amogus-dark">@{currentDomain.domain}</span>. {t('confirm.review')}</p>
	<div class="space-y-4 mb-8">
		<div class="flex flex-col">
			<span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('table.status')}</span>
			<span class="font-medium {currentDomain.active !== (currentDomainData.active === 1) ? 'text-rose-600 font-bold' : (currentDomain.active ? 'text-emerald-600' : 'text-slate-500')}">
				{currentDomain.active ? t('status.active') : t('status.inactive')} {currentDomain.active !== (currentDomainData.active === 1) ? t('confirm.changed') : ''}
			</span>
		</div>
		<div class="flex flex-col">
			<span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('confirm.routing')}</span>
			<span class="font-medium {currentDomain.backupmx !== (currentDomainData.backupmx === 1) ? 'text-rose-600 font-bold' : (currentDomain.backupmx ? 'text-amber-600' : 'text-slate-500')}">
				{currentDomain.backupmx ? t('form.backupmx') : t('confirm.primary_mx')} {currentDomain.backupmx !== (currentDomainData.backupmx === 1) ? t('confirm.changed') : ''}
			</span>
		</div>
		<div class="flex flex-col">
			<span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('confirm.dkim')}</span>
			<span class="font-medium {currentDomain.dkimActive !== currentDomainData.dkimActive ? 'text-rose-600 font-bold' : (currentDomain.dkimActive ? 'text-indigo-600' : 'text-slate-500')}">
				{currentDomain.dkimActive ? t('confirm.yes') : t('confirm.no')} {currentDomain.dkimActive !== currentDomainData.dkimActive ? t('confirm.changed') : ''}
			</span>
		</div>
		<div class="flex flex-col">
			<span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('confirm.domain_name')}</span>
			<span class="font-medium {currentDomain.domain !== originalDomainName ? 'text-rose-600 font-bold' : 'text-slate-700'}">
				{currentDomain.domain} {currentDomain.domain !== originalDomainName ? t('confirm.changed') : ''}
			</span>
		</div>
		
		{#if currentDomain.domain !== originalDomainName}
			<div class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 text-sm">
				<div class="mt-0.5 text-lg">⚠️</div>
				<div>
					<strong>{t('confirm.domain_change_warning.title')}</strong> {t('confirm.domain_change_warning.desc')}
				</div>
			</div>
		{/if}
	</div>
	<div class="modal-action flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-0 mt-6">
		<button type="button" onclick={() => { showUpdateConfirm = false; }} class="btn btn-ghost rounded-full text-slate-500 font-bold hover:bg-slate-100 px-6 w-full sm:w-auto">{t('btn.back_edit')}</button>
		<button type="button" onclick={() => { editForm?.requestSubmit(); }} class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md w-full sm:w-auto">{t('btn.confirm_save')}</button>
	</div>
</Modal>
 
