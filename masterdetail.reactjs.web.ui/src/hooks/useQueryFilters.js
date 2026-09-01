import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

// Reads/writes a set of integer query params (e.g. ?masterId=5&detailId=3) as
// one coordinated group. Missing/invalid/non-positive values read as 0 - the
// value masterApi/detailApi/childApi's `.list()` already treats as "no
// filter, list all" - and setting a value to 0 removes its param instead of
// writing it.
//
// All params share ONE `useSearchParams` call, and `setValues` applies a
// patch of one or more params in a single update. That matters: clearing a
// dependent filter alongside the one that just changed (e.g. resetting
// detailId when masterId changes) needs to land as one navigation - two
// separate hook instances each calling `setSearchParams` from their own
// stale snapshot would have the second call's write silently clobber the
// first's.
const useQueryFilters = (paramNames) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const values = Object.fromEntries(
    paramNames.map((name) => {
      const raw = Number(searchParams.get(name));
      return [name, Number.isFinite(raw) && raw > 0 ? raw : 0];
    })
  );

  const setValues = useCallback(
    (patch) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([name, value]) => {
            if (value > 0) {
              next.set(name, String(value));
            } else {
              next.delete(name);
            }
          });
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return [values, setValues];
};

export default useQueryFilters;
