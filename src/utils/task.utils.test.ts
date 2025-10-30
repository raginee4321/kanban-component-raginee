import { reorder } from './task.utils';

test('reorder moves item correctly', () => {
  const arr = ['a','b','c','d'];
  expect(reorder(arr, 1, 3)).toEqual(['a','c','d','b']);
});
