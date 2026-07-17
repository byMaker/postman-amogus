<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import { toast } from '$lib/state/toast.svelte';

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
		active: true
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
			active: true 
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
			active: u.active === 1 
		};
		showModal = true;
	}
</script>

<div class="space-y-6">
	<!-- Заголовок и кнопка -->
	<div class="flex items-center justify-between px-6 pb-2">
		<div>
			<h2 class="text-3xl font-bold text-[#1E3A8A]">Mailboxes</h2>
			<p class="text-slate-500 mt-1">Manage users and email accounts</p>
		</div>
		<button onclick={openAddModal} class="rounded-full bg-[#1E3A8A] px-6 py-3 font-bold text-white shadow hover:bg-blue-800 active:scale-95 transition-all">
			+ Add Mailbox
		</button>
	</div>

	<!-- Таблица ящиков -->
	<div class="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
		<table class="w-full text-left text-sm">
			<thead class="bg-[#E3F2FD] text-xs uppercase tracking-wide text-[#1E3A8A]">
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
						<td class="px-6 py-5 font-mono text-slate-600">{user.quotaMb === 0 ? 'Unlimited' : `${user.quotaMb} MB`}</td>
						<td class="px-6 py-5 text-right">
							<div class="flex justify-end gap-3 transition-opacity">
								<button onclick={() => openEditModal(user)} class="text-[#0284C7] hover:text-white hover:bg-[#0284C7] bg-blue-50 p-2 rounded-full transition-colors" title="Edit">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
								</button>
								<form 
									method="POST" 
									action="?/delete" 
									use:enhance={() => {
										return async ({ result, update }) => {
											if (result.type === 'success' && result.data?.success) {
												toast.success('Mailbox deleted!');
											} else {
												toast.error(result.data?.error || 'Failed to delete mailbox');
											}
											update();
										};
									}}
									onsubmit={(e) => {
										if (!confirm(`Delete mailbox ${user.localPart}@${user.domain}?`)) e.preventDefault();
									}}
								>
									<input type="hidden" name="id" value={user.id} />
									<button class="text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 p-2 rounded-full transition-colors" title="Delete">
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
									</button>
								</form>
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

<!-- Модальное окно -->
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
				<label class="label"><span class="label-text font-bold text-slate-700">Email Address</span></label>
				<div class="flex gap-2">
					<input 
						type="text" 
						name="localPart" 
						bind:value={currentUser.localPart} 
						class="input input-bordered flex-1 rounded-2xl bg-slate-50 border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition-all text-right font-medium" 
						placeholder="username" 
						required 
					/>
					<div class="flex items-center text-slate-400 font-black text-xl">@</div>
					<select name="domain" bind:value={currentUser.domain} class="select select-bordered flex-1 rounded-2xl bg-slate-50 border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition-all font-bold">
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
				<p class="text-xl font-black text-[#1E3A8A]">{currentUser.localPart}@{currentUser.domain}</p>
			</div>
		{/if}

		<div class="form-control">
			<label class="label"><span class="label-text font-bold text-slate-700">Full Name</span></label>
			<input 
				type="text" 
				name="fullName" 
				bind:value={currentUser.fullName}
				class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition-all" 
				placeholder="John Doe"
			/>
		</div>

		<div class="form-control">
			<label class="label">
				<span class="label-text font-bold text-slate-700">Password</span>
				{#if isEditMode}<span class="label-text-alt text-slate-400">Leave empty to keep current</span>{/if}
			</label>
			<input 
				type="password" 
				name="password" 
				bind:value={currentUser.password}
				class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition-all" 
				placeholder="••••••••"
				required={!isEditMode}
			/>
		</div>

		<div class="form-control">
			<label class="label"><span class="label-text font-bold text-slate-700">Quota (MB)</span></label>
			<input 
				type="number" 
				name="quotaMb" 
				bind:value={currentUser.quotaMb}
				class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition-all" 
				min="0"
			/>
			<label class="label"><span class="label-text-alt text-slate-500">Set to 0 for unlimited space.</span></label>
		</div>

		<div class="flex gap-6 pt-2">
			<label class="cursor-pointer flex items-center gap-3">
				<input type="checkbox" name="active" bind:checked={currentUser.active} class="toggle toggle-info bg-white" />
				<span class="font-medium text-slate-700">Active</span>
			</label>
		</div>

		<div class="modal-action mt-8 pt-4 flex justify-between">
			<button type="button" onclick={() => showModal = false} class="btn btn-ghost rounded-full text-slate-500 font-bold hover:bg-slate-100 px-6">Cancel</button>
			<button type="submit" class="btn border-none bg-[#1E3A8A] text-white hover:bg-[#0284C7] rounded-full px-8 font-bold shadow-md">
				{isEditMode ? 'Save Changes' : 'Create Mailbox'}
			</button>
		</div>
	</form>
</Modal>
