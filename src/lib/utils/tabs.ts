import { At, EnvelopeSimple, Numpad, Globe, ShieldCheck } from 'phosphor-svelte';
import { t } from '$lib/i18n';

export const getWhitelistTabs = () => [
	{ id: 'domains', label: t('tab.domains'), icon: At },
	{ id: 'emails', label: t('tab.emails'), icon: EnvelopeSimple },
	{ id: 'ips', label: t('tab.ips'), icon: Numpad }
];

export const getBlacklistTabs = () => [
	{ id: 'domains', label: t('tab.domains'), icon: At },
	{ id: 'emails', label: t('tab.emails'), icon: EnvelopeSimple },
	{ id: 'ips', label: t('tab.ips'), icon: Numpad },
	{ id: 'dnsbl', label: t('tab.dnsbl'), icon: Globe },
	{ id: 'dkim', label: t('tab.dkim'), icon: ShieldCheck }
];
