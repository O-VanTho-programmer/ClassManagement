import { useState, useEffect } from 'react';

function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function usePagination(dependencies: any[] = []) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  
  const debouncedSearch = useDebounce(search, 500);

  const offset = (page - 1) * limit;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, ...dependencies]);

  return {
    page, setPage,
    limit, setLimit,
    offset,
    search, setSearch, debouncedSearch
  };
}