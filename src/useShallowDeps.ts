import { useRef, DependencyList } from 'react';
import shallowEquals from './shallowEqual';

export default function useShallowDeps(lastestDeps: DependencyList) {
  const depsRef = useRef(lastestDeps);

  if (!shallowEquals(depsRef.current, lastestDeps)) {
    depsRef.current = lastestDeps;
  }

  return depsRef.current;
}
