import { createBookmark, pushBookmark, getBookmark } from './bookmarks.js';
import { getData, setData } from './storage.js';

jest.mock('./storage.js');

beforeEach(() => {
	jest.clearAllMocks();
});

describe('createBookmark', () => {
	test('should create a bookmark with the correct title, description and url', () => {
		const bookmark = createBookmark('Google', 'Search engine', 'https://google.com');
		expect(bookmark.title).toBe('Google');
		expect(bookmark.description).toBe('Search engine');
		expect(bookmark.url).toBe('https://google.com');
	});

	test('should initialize likes at 0', () => {
		const bookmark = createBookmark('Test', 'Desc', 'https://test.com');
		expect(bookmark.likes).toBe(0);
	});

	test('should generate a unique id for each bookmark', () => {
		const bookmark1 = createBookmark('A', 'Desc A', 'https://a.com');
		const bookmark2 = createBookmark('B', 'Desc B', 'https://b.com');
		expect(bookmark1.id).not.toBe(bookmark2.id);
	});

	test('should set createdAt as a valid ISO date', () => { // ISO -> means 
		const bookmark = createBookmark('Test', 'Desc', 'https://test.com');
		expect(new Date(bookmark.createdAt).toISOString()).toBe(bookmark.createdAt);
	});
});

describe('pushBookmark', () => {
	test('should add a bookmark to an empty user array', () => {
		getData.mockReturnValue([]);
		const bookmark = createBookmark('First', 'My first bookmark', 'https://first.com');
		pushBookmark('1', bookmark);
		expect(setData).toHaveBeenCalledWith('1', [bookmark]);
	});

	test('should preserve existing bookmarks when adding a new one', () => {
		const existing = createBookmark('Old', 'Existing bookmark', 'https://old.com');
		getData.mockReturnValue([existing]);
		const newBookmark = createBookmark('New', 'New bookmark', 'https://new.com');
		pushBookmark('1', newBookmark);
		expect(setData).toHaveBeenCalledWith('1', [existing, newBookmark]);
	});

	test('should save bookmarks to the correct user', () => {
		getData.mockReturnValue([]);
		const bookmark = createBookmark('Test', 'Desc', 'https://test.com');
		pushBookmark('3', bookmark);
		expect(getData).toHaveBeenCalledWith('3');
		expect(setData).toHaveBeenCalledWith('3', [bookmark]);
	});
});

describe('getBookmark', () => {
	test('should find a bookmark by its id', () => {
		const bookmark = createBookmark('Target', 'Find me', 'https://target.com');
		const other = createBookmark('Other', 'Not me', 'https://other.com');
		getData.mockReturnValue([bookmark, other]);
		expect(getBookmark('1', bookmark.id)).toEqual(bookmark);
	});

	test('should return undefined if bookmark does not exist', () => {
		const bookmark = createBookmark('Only', 'Only one', 'https://only.com');
		getData.mockReturnValue([bookmark]);
		expect(getBookmark('1', 'nonexistent-id')).toBeUndefined();
	});

	test('should return the correct bookmark when multiple exist', () => {
		const bookmarks = [
			createBookmark('First', 'Desc 1', 'https://first.com'),
			createBookmark('Second', 'Desc 2', 'https://second.com'),
			createBookmark('Third', 'Desc 3', 'https://third.com'),
		];
		getData.mockReturnValue(bookmarks);
		expect(getBookmark('1', bookmarks[1].id)).toEqual(bookmarks[1]);
	});

	test('should search bookmarks for the correct user', () => {
		getData.mockReturnValue([]);
		getBookmark('5', 'some-id');
		expect(getData).toHaveBeenCalledWith('5');
	});
});
