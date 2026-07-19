<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import CommentPopover from '$lib/components/CommentPopover.svelte';
	import MailRoutingGraph from '$lib/components/MailRoutingGraph.svelte';
	import { toast } from '$lib/state/toast.svelte';
	import { NotePencil, Trash, Mailbox, Shuffle, WarningCircle } from 'phosphor-svelte';
	import ValidatedInput from '$lib/components/ValidatedInput.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { invalidateAll } from '$app/navigation';

	let { data, form } = $props();

	let showModal = $state(false);
	let isEditMode = $state(false);
	
	let currentUser = $state({
		id: 0,
		localPart: '',
		domain: '',
		fullName: '',
		password: '',
		quotaMb: 1024,
		quotaMessages: 0,
		description: '',
		active: true,
		useForAliasesDomains: true
	});

	function openAddModal() {
		isEditMode = false;
		currentUser = { 
			id: 0, 
			localPart: '', 
			domain: data.domains[0]?.domain || '', 
			fullName: '', 
			password: '', 
			quotaMb: 1024, 
			quotaMessages: 0,
			description: '',
			active: true,
			useForAliasesDomains: true
		};
		showModal = true;
	}

	function openEditModal(u: any) {
		isEditMode = true;
		currentUser = { 
			id: u.id, 
			localPart: u.localPart, 
			domain: u.domain, 
			fullName: u.fullName || '', 
			password: '', // Пароль не показываем
			quotaMb: u.quotaMb || 0, 
			quotaMessages: u.quotaMessages || 0,
			description: u.description || '',
			active: u.active === 1,
			useForAliasesDomains: u.useForAliasesDomains === 1
		};
		showModal = true;
	}

	let userToDelete: any = $state(null);
	let showDeleteModal = $state(false);

	function requestDelete(u: any) {
		userToDelete = u;
		showDeleteModal = true;
	}

	let showGraphModal = $state(false);
	let graphUser: any = $state(null);

	let graphSources = $derived.by(() => {
		if (!graphUser) return [];
		const email = `${graphUser.localPart}@${graphUser.domain}`.toLowerCase();
		const targetDomain = graphUser.domain.toLowerCase();
		const sources = [];
		
		const isDomainActive = !!data.domains?.find(d => d.domain.toLowerCase() === targetDomain);
		
		// 1. Прямая доставка
		sources.push({ 
			id: `direct-${email}`, 
			type: 'direct', 
			label: email, 
			active: !!graphUser.active && isDomainActive 
		});
		
		// 2. Личные алиасы
		if (data.aliases) {
			const myAliases = data.aliases.filter(a => (a.target || '').toLowerCase() === email);
			for (const a of myAliases) {
				sources.push({ 
					id: `alias-${a.alias}`, 
					type: 'alias', 
					label: a.alias.toLowerCase(), 
					active: !!a.active && isDomainActive 
				});
			}
		}
		
		// 3. Алиасы доменов
		if (data.aliasesDomains) {
			const myDomainAliases = data.aliasesDomains.filter(ad => (ad.targetDomain || '').toLowerCase() === targetDomain);
			for (const ad of myDomainAliases) {
				sources.push({ 
					id: `domain_alias-${ad.aliasDomain}`, 
					type: 'domain_alias', 
					label: `${graphUser.localPart.toLowerCase()}@${ad.aliasDomain.toLowerCase()}`, 
					// Exim explicitly checks users.active = 1 AND users.use_for_aliases_domains = 1
					active: !!ad.active && !!graphUser.useForAliasesDomains && isDomainActive && !!graphUser.active
				});
			}
		}
		
		return sources;
	});

	function openGraphModal(u: any) {
		graphUser = u;
		showGraphModal = true;
	}

	let selectedDomain = $state('all');
	let selectedStatus = $state('all');
	let sortField = $state('localPart');
	let sortDir = $state('asc');

	async function handleQuickComment(user: any) {
		const fd = new FormData();
		fd.append('id', user.id);
		fd.append('fullName', user.fullName || '');
		fd.append('quotaMb', user.quotaMb.toString());
		fd.append('quotaMessages', user.quotaMessages.toString());
		fd.append('description', user.description || '');
		if (user.active) fd.append('active', 'on');
		if (user.useForAliasesDomains) fd.append('useForAliasesDomains', 'on');

		try {
			await fetch('?/update', { method: 'POST', body: fd });
			toast.success('Description saved!');
			await invalidateAll();
		} catch (e) {
			toast.error('Failed to save description');
		}
	}

	function toggleSort(field: string) {
		if (sortField === field) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDir = 'asc';
		}
	}

	let filteredUsers = $derived(data.users.filter(u => {
		if (selectedDomain !== 'all' && u.domain !== selectedDomain) return false;
		if (selectedStatus === 'active' && !u.active) return false;
		if (selectedStatus === 'disabled' && u.active) return false;
		return true;
	}).sort((a, b) => {
		let valA, valB;
		if (sortField === 'localPart') {
			valA = `${a.localPart}@${a.domain}`.toLowerCase();
			valB = `${b.localPart}@${b.domain}`.toLowerCase();
		} else if (sortField === 'fullName') {
			valA = (a.fullName || '').toLowerCase();
			valB = (b.fullName || '').toLowerCase();
		} else if (sortField === 'quotaMb') {
			valA = a.quotaMb === 0 ? Infinity : a.quotaMb;
			valB = b.quotaMb === 0 ? Infinity : b.quotaMb;
		}

		if (valA < valB) return sortDir === 'asc' ? -1 : 1;
		if (valA > valB) return sortDir === 'asc' ? 1 : -1;
		return 0;
	}));
</script>

<div class="space-y-6">
	<!-- Заголовок и кнопка -->
	<div class="flex flex-col md:flex-row md:items-center justify-between px-0 md:px-6 pb-2 gap-4">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<Mailbox size={36} weight="fill" class="text-amber-500" />
				Mailboxes
			</h2>
			<p class="text-slate-500 mt-1">Manage users and email accounts</p>
		</div>
		<div class="flex flex-wrap items-center gap-2 md:gap-4">
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

			<div class="dropdown dropdown-end w-full sm:w-auto">
				<div tabindex="0" role="button" class="btn w-full sm:w-auto flex justify-between sm:justify-center bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-sans shadow-sm rounded-full px-6">
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

			<button onclick={openAddModal} class="w-full sm:w-auto rounded-full bg-amogus-blue px-6 py-3 font-bold text-white shadow hover:bg-amogus-brown active:scale-95 transition-all mt-2 sm:mt-0">
				+ Add Mailbox
			</button>
		</div>
	</div>

	<!-- Таблица ящиков -->
	<div class="rounded-[32px] border border-slate-200 shadow-sm overflow-hidden bg-white">
		<table class="w-full text-left text-sm block md:table">
			<thead class="bg-slate-50 border-b border-slate-200 text-xs font-black uppercase tracking-widest text-amogus-blue hidden md:table-header-group">
				<tr>
					<th class="px-6 py-5 cursor-pointer hover:text-amogus-blue select-none transition-colors rounded-tl-3xl" onclick={() => toggleSort('localPart')}>
						Email Account <span class="text-amogus-blue ml-1 font-bold">{sortField === 'localPart' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span>
					</th>
					<th class="px-6 py-5 cursor-pointer hover:text-amogus-blue select-none transition-colors" onclick={() => toggleSort('fullName')}>
						Full Name <span class="text-amogus-blue ml-1 font-bold">{sortField === 'fullName' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span>
					</th>
					<th class="px-6 py-5">Status</th>
					<th class="px-6 py-5 cursor-pointer hover:text-amogus-blue select-none transition-colors" onclick={() => toggleSort('quotaMb')}>
						Quota <span class="text-amogus-blue ml-1 font-bold">{sortField === 'quotaMb' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span>
					</th>
					<th class="px-6 py-5">Description</th>
					<th class="px-6 py-5 text-right rounded-tr-3xl">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100 bg-white block md:table-row-group">
				{#each filteredUsers as user}
					{@const email = `${user.localPart}@${user.domain}`}
					{@const aliasCount = data.aliases ? data.aliases.filter(a => a.target === email && a.active === 1).length : 0}
					{@const domainAliasCount = (user.useForAliasesDomains === 1 && data.aliasesDomains) ? data.aliasesDomains.filter(ad => ad.targetDomain === user.domain && ad.active === 1).length : 0}
					{@const totalRoutes = aliasCount + domainAliasCount}
					{@const isDomainActive = !!data.domains?.find(d => d.domain === user.domain)}
					<tr class="hover:bg-slate-50 transition-colors block md:table-row p-4 md:p-0 border-b border-slate-100 last:border-0 md:border-none group">
						<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-5 border-b border-slate-50 md:border-none">
							<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">Email</span>
							<div class="font-bold {user.active ? 'text-amber-600' : 'text-slate-400'} text-base transition-colors text-right md:text-left truncate max-w-[200px] md:max-w-none">{user.localPart}<span class="{isDomainActive ? 'text-violet-500' : 'text-slate-400'} transition-colors">@{user.domain}</span></div>
						</td>
						<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-5 font-medium text-slate-600 border-b border-slate-50 md:border-none">
							<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">Name</span>
							<span class="text-right md:text-left">{user.fullName || '—'}</span>
						</td>
						<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-5 border-b border-slate-50 md:border-none">
							<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status</span>
							<div class="flex flex-wrap gap-2 items-center">
								{#if user.active}
									<span class="whitespace-nowrap rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Active</span>
								{:else}
									<span class="whitespace-nowrap rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">Disabled</span>
								{/if}
								{#if !!user.useForAliasesDomains}
									<span class="whitespace-nowrap rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">Domain Alias</span>
								{/if}
							</div>
						</td>
						<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-5 md:w-48 border-b border-slate-50 md:border-none">
							<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quota</span>
							<div class="text-right md:text-left">
							{#if user.quotaMb === 0}
								<div class="text-slate-500 font-bold">Unlimited</div>
								<div class="text-xs text-slate-400 font-bold">{(user.usedBytes / 1024 / 1024).toFixed(1)} MB used</div>
							{:else}
								{@const usedMb = user.usedBytes / 1024 / 1024}
								{@const percent = Math.min(100, usedMb > 0 ? Math.max(1.5, Math.round(usedMb / user.quotaMb * 100)) : 0)}
								<div class="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
									<span>{usedMb.toFixed(1)} MB</span>
									<span>{user.quotaMb} MB</span>
								</div>
								<div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
									<div class="h-full rounded-full transition-all duration-500 {percent > 90 ? 'bg-rose-500' : 'bg-amogus-blue'}" style="width: {percent}%"></div>
								</div>
							{/if}
							</div>
						</td>
						<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-5 border-b border-slate-50 md:border-none">
							<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">Description</span>
							<div class="flex items-center justify-end md:justify-start gap-2">
								<CommentPopover 
									comment={user.description || ''} 
									onsave={(newComment) => {
										user.description = newComment;
										handleQuickComment(user);
									}} 
								/>
								<span class="text-slate-500 truncate max-w-[150px] block">{user.description || ''}</span>
							</div>
						</td>
						<td class="flex justify-between items-center md:table-cell px-2 py-3 md:px-6 md:py-5 md:text-right">
							<span class="md:hidden text-[10px] text-slate-400 font-bold uppercase tracking-widest">Actions</span>
							<div class="flex justify-end gap-3 opacity-100 md:opacity-40 group-hover:opacity-100 transition-opacity">
								<Tooltip text="Routing Graph" position="top">
									<button onclick={() => openGraphModal(user)} class="relative p-2 rounded-full transition-colors {totalRoutes > 0 ? 'text-amber-500 hover:text-white hover:bg-amber-500 bg-amber-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 bg-slate-50'}" title="Routing Graph">
										<Shuffle size={24} weight="bold" />
										{#if totalRoutes > 0}
											<span class="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm border border-white">
												{totalRoutes}
											</span>
										{/if}
									</button>
								</Tooltip>
								<Tooltip text="Edit" position="top">
									<button onclick={() => openEditModal(user)} class="text-amogus-blue hover:text-white hover:bg-amogus-blue bg-blue-50 p-2 rounded-full transition-colors" title="Edit">
										<NotePencil size={24} weight="fill" />
									</button>
								</Tooltip>
								<Tooltip text="Delete" position="top">
									<button onclick={() => requestDelete(user)} class="text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 p-2 rounded-full transition-colors" title="Delete">
										<Trash size={24} weight="fill" />
									</button>
								</Tooltip>
							</div>
						</td>
					</tr>
				{/each}
				{#if filteredUsers.length === 0}
					<tr>
						<td colspan="5" class="px-6 py-12 text-center text-slate-500">No mailboxes found.</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<Modal bind:show={showDeleteModal} title="Delete Mailbox">
	<p class="text-slate-600 font-medium mb-8 text-lg">Are you sure you want to permanently delete the mailbox <span class="font-bold text-rose-600">{userToDelete?.localPart}@{userToDelete?.domain}</span>? This action cannot be undone.</p>
	<form method="POST" action="?/delete" use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.success) {
				toast.success('Mailbox deleted!');
				showDeleteModal = false;
			} else {
				toast.error(result.data?.error || 'Failed to delete mailbox');
			}
			update();
		};
	}}>
		<input type="hidden" name="id" value={userToDelete?.id} />
		<div class="flex justify-between mt-4">
			<button type="button" onclick={() => showDeleteModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6">Cancel</button>
			<button type="submit" class="btn bg-rose-600 text-white hover:bg-rose-700 rounded-full px-8 font-bold border-none shadow-md">
				Yes, Delete
			</button>
		</div>
	</form>
</Modal>

<Modal bind:show={showModal} title={isEditMode ? 'Edit Mailbox' : 'Add New Mailbox'}>
	<form method="POST" action={isEditMode ? "?/update" : "?/create"} use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.success) {
				toast.success(isEditMode ? 'Mailbox updated!' : 'Mailbox created!');
				showModal = false;
			} else {
				toast.error(result.data?.error || 'An error occurred');
			}
			update();
		};
	}} class="space-y-5">
		
		{#if isEditMode}
			<input type="hidden" name="id" value={currentUser.id} />
		{/if}

		<!-- Email Address (Только при создании) -->
		{#if !isEditMode}
			<div class="form-control">
				<div class="label"><span class="label-text font-bold text-slate-700">Email Address</span></div>
				<div class="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-center">
					<div class="w-full sm:flex-1 min-w-0">
						<ValidatedInput 
							name="localPart" 
							bind:value={currentUser.localPart} 
							className="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all text-left sm:text-right font-medium min-w-0" 
							placeholder="username" 
							required 
							pattern={"^[a-zA-Z0-9._%+-]+$"}
							title="Please enter a valid username (no spaces or @ symbol)"
						/>
					</div>
					<div class="hidden sm:flex items-center text-slate-400 font-black text-xl shrink-0">@</div>
					<div class="relative w-full sm:flex-1 min-w-0">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none sm:hidden z-10">
							<span class="text-slate-400 font-black text-xl">@</span>
						</div>
						<select name="domain" bind:value={currentUser.domain} class="select select-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all font-bold pl-10 sm:pl-4">
							{#each data.domains as domain}
								<option value={domain.domain}>{domain.domain}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>
		{:else}
			<!-- В режиме редактирования показываем email как текст -->
			<div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-6">
				<p class="text-sm font-medium text-slate-500 mb-1">Editing Account:</p>
				<p class="text-xl font-black text-amogus-dark">{currentUser.localPart}@{currentUser.domain}</p>
			</div>
		{/if}

		<div class="form-control">
			<div class="label"><span class="label-text font-bold text-slate-700">Full Name</span></div>
			<input 
				type="text" 
				name="fullName" 
				bind:value={currentUser.fullName}
				class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" 
				placeholder="John Doe"
			/>
		</div>

		<div class="form-control">
			<div class="label">
				<span class="label-text font-bold text-slate-700">Password</span>
				{#if isEditMode}<span class="label-text-alt text-slate-400">Leave empty to keep current</span>{/if}
			</div>
			<input 
				type="password" 
				name="password" 
				bind:value={currentUser.password}
				class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" 
				placeholder="••••••••"
				required={!isEditMode}
			/>
		</div>

		<div class="flex flex-col sm:flex-row gap-4">
			<div class="form-control flex-1">
				<div class="label"><span class="label-text font-bold text-slate-700">Quota (MB)</span></div>
				<input 
					type="number" 
					name="quotaMb" 
					bind:value={currentUser.quotaMb}
					class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" 
					min="0"
				/>
				<div class="label"><span class="label-text-alt text-slate-500">0 for unlimited.</span></div>
			</div>
			<div class="form-control flex-1">
				<div class="label"><span class="label-text font-bold text-slate-700">Quota (Messages)</span></div>
				<input 
					type="number" 
					name="quotaMessages" 
					bind:value={currentUser.quotaMessages}
					class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" 
					min="0"
				/>
				<div class="label"><span class="label-text-alt text-slate-500">0 for unlimited.</span></div>
			</div>
		</div>

		<div class="form-control">
			<div class="label"><span class="label-text font-bold text-slate-700">Description</span></div>
			<input 
				type="text" 
				name="description" 
				bind:value={currentUser.description}
				class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all" 
				placeholder="Optional note"
			/>
		</div>

		<div class="flex flex-col gap-3 pt-2">
			<label class="cursor-pointer flex items-center gap-3 w-fit">
				<input type="checkbox" name="active" bind:checked={currentUser.active} class="toggle toggle-amogus" />
				<span class="font-bold text-slate-700">Active</span>
			</label>
			<label class="cursor-pointer flex items-center gap-3 w-fit">
				<input type="checkbox" name="useForAliasesDomains" bind:checked={currentUser.useForAliasesDomains} class="toggle toggle-amogus" />
				<span class="font-bold text-slate-700">Use for Domain Aliases</span>
			</label>
		</div>

		<div class="modal-action mt-8 pt-4 flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sm:gap-0">
			<button type="button" onclick={() => showModal = false} class="btn btn-ghost rounded-full text-amogus-blue font-bold hover:bg-transparent border border-transparent hover:border-amogus-brown hover:text-amogus-brown px-6 w-full sm:w-auto">Cancel</button>
			<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md w-full sm:w-auto">
				{isEditMode ? 'Save Changes' : 'Create Mailbox'}
			</button>
		</div>
	</form>
</Modal>

<Modal bind:show={showGraphModal} title="Routing Graph" maxWidth="max-w-6xl">
	<p class="text-slate-500 mb-2 -mt-4 font-medium">All incoming email routes delivering to this mailbox.</p>
	
	{#if graphUser}
		{@const isDomainActive = !!data.domains?.find(d => d.domain === graphUser.domain)}
		{#if !isDomainActive}
			<div class="mb-6 mt-4 rounded-xl bg-rose-50 p-4 border border-rose-100 flex items-center gap-4 text-rose-700">
				<WarningCircle size={28} weight="fill" class="shrink-0" />
				<div>
					<p class="font-bold text-base mb-0.5">Domain is Disabled</p>
					<p class="text-sm">The domain <strong>{graphUser.domain}</strong> is currently disabled. All incoming mail routing is suspended, regardless of individual alias or mailbox settings.</p>
				</div>
			</div>
		{/if}
		<div class="mt-4 border-t border-slate-100 pt-4">
			<MailRoutingGraph 
				sources={graphSources} 
				target={`${graphUser.localPart}@${graphUser.domain}`} 
				targetActive={graphUser.active === 1 && isDomainActive}
			/>
		</div>
	{/if}
</Modal>
