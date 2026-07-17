<script lang="ts">
	let { data } = $props();
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between px-6 pb-2">
		<div>
			<h2 class="text-3xl font-bold text-[#1E3A8A]">Aliases</h2>
			<p class="text-slate-500 mt-1">Manage email forwarding rules</p>
		</div>
		<button class="rounded-full bg-[#1E3A8A] px-6 py-3 font-bold text-white shadow hover:bg-blue-800 active:scale-95 transition-all">
			+ Add Alias
		</button>
	</div>

	<div class="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
		<table class="w-full text-left text-sm">
			<thead class="bg-[#E3F2FD] text-xs uppercase text-[#1E3A8A]">
				<tr>
					<th class="px-6 py-4">Alias</th>
					<th class="px-6 py-4">Forwards To</th>
					<th class="px-6 py-4">Status</th>
					<th class="px-6 py-4 text-right">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-200 bg-white">
				{#each data.aliases as alias}
					<tr class="hover:bg-slate-50 transition-colors">
						<td class="px-6 py-4 font-bold text-slate-800">{alias.alias}</td>
						<td class="px-6 py-4 font-mono text-slate-600">{alias.target}</td>
						<td class="px-6 py-4">
							{#if alias.active}
								<span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Active</span>
							{:else}
								<span class="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">Disabled</span>
							{/if}
						</td>
						<td class="px-6 py-4 text-right">
							<button class="font-bold text-blue-600 hover:text-blue-800 mr-3">Edit</button>
							<button class="font-bold text-rose-600 hover:text-rose-800">Delete</button>
						</td>
					</tr>
				{/each}
				{#if data.aliases.length === 0}
					<tr>
						<td colspan="4" class="px-6 py-8 text-center text-slate-500">No aliases found. Add a forwarding rule!</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
