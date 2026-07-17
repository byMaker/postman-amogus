<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import { toast } from '$lib/state/toast.svelte';
	import { NotePencil, Trash, EnvelopeSimple } from 'phosphor-svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

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
</script>

<div class="space-y-6">
	<!-- Заголовок и кнопка -->
	<div class="flex items-center justify-between px-6 pb-2">
		<div>
			<h2 class="text-4xl text-amogus-dark flex items-center gap-3">
				<EnvelopeSimple size={36} weight="fill" class="text-amber-500" />
				Mailboxes
			</h2>
			<p class="text-slate-500 mt-1">Manage users and email accounts</p>
		</div>
		<button onclick={openAddModal} class="rounded-full bg-amogus-blue px-6 py-3 font-bold text-white shadow hover:bg-amogus-brown active:scale-95 transition-all">
			+ Add Mailbox
		</button>
	</div>

	<!-- Таблица ящиков -->
	<div class="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
		<table class="w-full text-left text-sm">
			<thead class="bg-amogus-light text-xs uppercase tracking-wide text-amogus-dark">
				<tr>
					<th class="px-6 py-5">Email Account</th>
					<th class="px-6 py-5">Full Name</th>
					<th class="px-6 py-5">Status</th>
					<th class="px-6 py-5">Quota</th>
					<th class="px-6 py-5 text-right">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100 bg-white">
				{#each data.users as user}
					<tr class="hover:bg-slate-50 transition-colors">
						<td class="px-6 py-5">
							<div class="font-bold text-slate-800 text-base">{user.localPart}<span class="text-slate-400">@{user.domain}</span></div>
						</td>
						<td class="px-6 py-5 font-medium text-slate-600">{user.fullName || '—'}</td>
						<td class="px-6 py-5">
							{#if user.active}
								<span class="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">Active</span>
							{:else}
								<span class="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">Disabled</span>
							{/if}
						</td>
						<td class="px-6 py-5 w-48">
							{#if user.quotaMb === 0}
								<div class="text-slate-500 font-bold">Unlimited</div>
								<div class="text-xs text-slate-400 font-bold">{(user.usedBytes / 1024 / 1024).toFixed(1)} MB used</div>
							{:else}
								{@const percent = Math.min(100, Math.round((user.usedBytes / 1024 / 1024) / user.quotaMb * 100))}
								<div class="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
									<span>{(user.usedBytes / 1024 / 1024).toFixed(1)} MB</span>
									<span>{user.quotaMb} MB</span>
								</div>
								<div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
									<div class="h-full rounded-full transition-all duration-500 {percent > 90 ? 'bg-rose-500' : 'bg-amogus-blue'}" style="width: {percent}%"></div>
								</div>
							{/if}
						</td>
						<td class="px-6 py-5 text-right">
							<div class="flex justify-end gap-3 transition-opacity">
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
				{#if data.users.length === 0}
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
			<button type="button" onclick={() => showDeleteModal = false} class="btn btn-ghost rounded-full text-slate-500 font-bold hover:bg-slate-100 px-6">Cancel</button>
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
				<div class="flex gap-2">
					<input 
						type="text" 
						name="localPart" 
						bind:value={currentUser.localPart} 
						class="input input-bordered flex-1 rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all text-right font-medium" 
						placeholder="username" 
						required 
					/>
					<div class="flex items-center text-slate-400 font-black text-xl">@</div>
					<select name="domain" bind:value={currentUser.domain} class="select select-bordered flex-1 rounded-2xl bg-slate-50 border-slate-200 focus:border-amogus-blue focus:ring-2 focus:ring-blue-100 transition-all font-bold">
						{#each data.domains as domain}
							<option value={domain.domain}>{domain.domain}</option>
						{/each}
					</select>
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

		<div class="flex gap-4">
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
				<input type="checkbox" name="active" bind:checked={currentUser.active} class="toggle toggle-info bg-white" />
				<span class="font-bold text-slate-700">Active</span>
			</label>
			<label class="cursor-pointer flex items-center gap-3 w-fit">
				<input type="checkbox" name="useForAliasesDomains" bind:checked={currentUser.useForAliasesDomains} class="toggle toggle-info bg-white" />
				<span class="font-bold text-slate-700">Use for Domain Aliases</span>
			</label>
		</div>

		<div class="modal-action mt-8 pt-4 flex justify-between">
			<button type="button" onclick={() => showModal = false} class="btn btn-ghost rounded-full text-slate-500 font-bold hover:bg-slate-100 px-6">Cancel</button>
			<button type="submit" class="btn border-none bg-amogus-blue text-white hover:bg-amogus-brown rounded-full px-8 font-bold shadow-md">
				{isEditMode ? 'Save Changes' : 'Create Mailbox'}
			</button>
		</div>
	</form>
</Modal>
