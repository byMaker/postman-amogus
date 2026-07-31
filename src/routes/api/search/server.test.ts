import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './+server';
import { db } from '$lib/server/db';
import { like } from 'drizzle-orm';

// Mock the database
vi.mock('$lib/server/db', () => ({
	db: {
		select: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		limit: vi.fn().mockResolvedValue([])
	}
}));

// Mock drizzle-orm operators
vi.mock('drizzle-orm', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...(actual as any),
		like: vi.fn(),
		or: vi.fn()
	};
});

describe('Search API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should escape SQL wildcard characters in the query to prevent injections', async () => {
		const mockUrl = new URL('http://localhost/api/search?q=test%25_\\user');
		
		await GET({ url: mockUrl } as any);

		// We passed "test%_\user" via URL
		// It should be escaped to "test\%\_\\user" 
		// and then wrapped in %: "%test\%\_\\user%"
		
		expect(like).toHaveBeenCalledWith(
			expect.anything(), 
			'%test\\%\\_\\\\user%'
		);
	});
	
	it('should return empty JSON if query is less than 2 characters', async () => {
		const mockUrl = new URL('http://localhost/api/search?q=a');
		
		const response = await GET({ url: mockUrl } as any);
		const data = await response.json();
		
		expect(data).toEqual([]);
		expect(db.select).not.toHaveBeenCalled(); // DB should not be hit
	});
});
