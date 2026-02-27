import { uuidv4, createBookmark, pushBookmark, getBookmark } from './bookmarks.js';
import { getData, setData } from './storage.js';

jest.mock('./storage.js');

beforeEach(() => {
	jest.clearAllMocks();
});

describe('uuidv4', () => {
	test('should return a string in UUID v4 format', () => {
		const uuid = uuidv4();
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
		expect(uuid).toMatch(uuidRegex);
	});

	test('should generate unique values across multiple calls', () => {
		const uuids = new Set(Array.from({ length: 100 }, () => uuidv4()));
		expect(uuids.size).toBe(100);
	});
});

describe('createBookmark', () => {
	test('should return an object with the correct structure', () => {
		const bookmark = createBookmark('Google', 'Search engine', 'https://google.com');
		expect(bookmark).toHaveProperty('id');
		expect(bookmark).toHaveProperty('url', 'https://google.com');
		expect(bookmark).toHaveProperty('title', 'Google');
		expect(bookmark).toHaveProperty('description', 'Search engine');
		expect(bookmark).toHaveProperty('createdAt');
		expect(bookmark).toHaveProperty('likes', 0);
	});

	test('should have likes starting at 0', () => {
		const bookmark = createBookmark('Test', 'Desc', 'https://test.com');
		expect(bookmark.likes).toBe(0);
	});

	test('should have a valid ISO date as createdAt', () => {
		const bookmark = createBookmark('Test', 'Desc', 'https://test.com');
		expect(new Date(bookmark.createdAt).toISOString()).toBe(bookmark.createdAt);
	});

	test('should have a valid UUID as id', () => {
		const bookmark = createBookmark('Test', 'Desc', 'https://test.com');
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
		expect(bookmark.id).toMatch(uuidRegex);
	});
});

describe('pushBookmark', () => {
	test('should add a bookmark to the user array', () => {
		getData.mockReturnValue([]);
		const bookmark = { id: '123', title: 'Test' };
		pushBookmark('1', bookmark);
		expect(setData).toHaveBeenCalledWith('1', [bookmark]);
	});

	test('should preserve existing bookmarks', () => {
		const existing = { id: '111', title: 'Existing' };
		getData.mockReturnValue([existing]);
		const newBookmark = { id: '222', title: 'New' };
		pushBookmark('1', newBookmark);
		expect(setData).toHaveBeenCalledWith('1', [existing, newBookmark]);
	});
});

describe('getBookmark', () => {
	test('should find a bookmark by its id', () => {
		const bookmark = { id: 'abc', title: 'Found' };
		getData.mockReturnValue([bookmark, { id: 'def', title: 'Other' }]);
		expect(getBookmark('1', 'abc')).toEqual(bookmark);
	});

	test('should return undefined if bookmark does not exist', () => {
		getData.mockReturnValue([{ id: 'abc', title: 'Only' }]);
		expect(getBookmark('1', 'nonexistent')).toBeUndefined();
	});
});
