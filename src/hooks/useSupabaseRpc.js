import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useSupabaseRpc(fn, args, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function run() {
      setState({ data: null, loading: true, error: null })
      const { data, error } = await supabase.rpc(fn, args)
      if (cancelled) return
      setState(error ? { data: null, loading: false, error } : { data, loading: false, error: null })
    }

    run()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, retryToken])

  return { ...state, refetch: () => setRetryToken((t) => t + 1) }
}
