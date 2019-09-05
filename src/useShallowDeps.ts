import { useEffect, useRef, DependencyList } from 'react';
import shallowEquals from './shallowEqual';

export default function useShallowDeps(lastestDeps: DependencyList) {
  const depsRef = useRef(lastestDeps);
  const deps = shallowEquals(lastestDeps, depsRef.current) ? depsRef.current : lastestDeps;
  useEffect(() => {
    depsRef.current = deps;
  }, [deps]);
  return deps;
}
