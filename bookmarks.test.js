/**
 * Jest methods and functions used in this test file:
 *
 * 1. jest.mock('./storage.js') - Replaces all functions exported from storage.js
 *    with fake (mock) functions that do nothing. The real localStorage is never touched.
 *
 * 2. beforeEach(() => { ... }) - Runs the given callback before each individual test.
 *    Used here to reset all mocks so each test starts fresh.
 *
 * 3. jest.clearAllMocks() - Clears the call history of all mock functions
 *    (how many times they were called, with what arguments, etc.).
 *
 * 4. describe(name, fn) - Groups related tests under a label.
 *    It does not affect test behavior, only organizes output.
 *
 * 5. test(name, fn) - Defines a single test case. The name describes
 *    what the test verifies, and the function contains the assertions.
 *
 * 6. expect(value) - Wraps a value to make assertions about it.
 *    It returns an object with matcher methods like .toBe(), .toMatch(), etc.
 *
 * 7. .toBe(expected) - Asserts that the value is strictly equal (===) to expected.
 *
 * 8. .toMatch(regex) - Asserts that a string matches the given regular expression.
 *
 * 9. .toHaveProperty(key, value?) - Asserts that an object has the given property,
 *    and optionally checks that the property equals the given value.
 *
 * 10. .toEqual(expected) - Asserts deep equality (compares all properties recursively),
 *     unlike .toBe() which checks reference equality.
 *
 * 11. .toBeUndefined() - Asserts that the value is undefined.
 *
 * 12. mockReturnValue(value) - Tells a mock function: "when someone calls you,
 *     return this value". The real function is never executed.
 *
 * 13. toHaveBeenCalledWith(arg1, arg2, ...) - Asserts that a mock function
 *     was called with exactly these arguments. Used to verify that internal
 *     logic passed the correct data to its dependencies.
 */

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

	test('should set createdAt as a valid ISO date', () => {
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
