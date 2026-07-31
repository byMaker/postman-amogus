<script lang="ts">
	import FilterListTemplate from '$lib/components/lists/FilterListTemplate.svelte';
	import { t } from '$lib/i18n';
	import { Skull, At, EnvelopeSimple, Numpad, ShieldWarning, ShieldCheck } from 'phosphor-svelte';
	import { getBlacklistTabs } from '$lib/utils/tabs';

	let { data } = $props();

	let tabs = $derived(getBlacklistTabs());

	const config = {
		getTableKey: (tab: string) => {
			if (tab === 'domains') return 'blackDomains';
			if (tab === 'emails') return 'blackEmails';
			if (tab === 'ips') return 'blackIps';
			if (tab === 'dkim') return 'dkimRequiredDomains';
			return 'dnsgBlacklist';
		},
		getTarget: (item: any) => item.domain || item.email || item.host || item.dnsDomain,
		getDesc: (item: any) => item.description || item.dnsDescription,
		getIsActive: (item: any) => item.active !== undefined ? item.active === 1 : item.dnsgKey === 1,
		getTargetLabel: (tab: string) => {
			if (tab === 'domains') return t('label.domain_name');
			if (tab === 'emails') return t('label.email_address');
			if (tab === 'ips') return t('label.ip_address');
			if (tab === 'dnsbl') return t('label.dnsbl_pattern');
			if (tab === 'dkim') return t('label.dkim_domain');
			return t('label.target');
		},
		getValidationPattern: (tab: string) => {
			if (tab === 'dnsbl') return "^[a-zA-Z0-9.\\-%]+$";
			if (tab === 'domains' || tab === 'dkim') return "^([a-zA-Z0-9\\-]+\\.)*[a-zA-Z0-9\\-]{2,}$";
			if (tab === 'emails') return "^[^@\\s]+@[^@\\s]+\\.[^@\\s0-9]{2,}$";
			return "^([0-9]{1,3}\\.){3}[0-9]{1,3}(\\/([0-9]|[1-2][0-9]|3[0-2]))?$";
		},
		getValidationTitle: (tab: string) => {
			if (tab === 'dnsbl') return "Please enter a valid DNSBL pattern (can include % wildcards)";
			if (tab === 'domains' || tab === 'dkim') return "Please enter a valid domain name (e.g. example.com or just a TLD like cn)";
			if (tab === 'emails') return "Please enter a valid email address";
			return "Please enter a valid IP address or CIDR subnet";
		},
		emptyMessage: t('blacklist.table.empty')
	};
</script>

<FilterListTemplate
	title={t('card.blacklists')}
	description={t('card.blacklists.desc')}
	icon={Skull}
	iconColor="text-rose-500"
	{tabs}
	{data}
	{config}
/>
