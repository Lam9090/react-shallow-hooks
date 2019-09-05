/* eslint-disable no-self-compare */

const hasOwn = Object.prototype.hasOwnProperty;

function is(x: unknown, y: unknown) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / (x as number) === 1 / (y as number);
  }
  return x !== x && y !== y;
}

function shallowEqual(objA: unknown, objB: unknown) {
  if (is(objA, objB)) return true;

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

export default function shallowEquals(A?: readonly any[], B?: readonly any[]) {
  if (!Array.isArray(A) || !Array.isArray(B)) return false;
  if (A.some((item, i) => !shallowEqual(item, B[i]))) {
    return false;
  }
  return true;
}
