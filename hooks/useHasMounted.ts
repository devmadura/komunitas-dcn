import { useSyncExternalStore } from "react";

export function useHasMounted() {
  return useSyncExternalStore(
    () => () => {}, // subscribe (no-op)
    () => true, // getSnapshot (client)
    () => false // getServerSnapshot (server)
  );
}
