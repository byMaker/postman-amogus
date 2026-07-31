export interface SearchResult {
	type: 'domain' | 'mailbox' | 'alias' | 'blacklist' | 'whitelist';
	title: string;
	details: string;
	subType?: string;
}

export interface ApiError {
	status: number;
	message: string;
	cause?: unknown;
}
