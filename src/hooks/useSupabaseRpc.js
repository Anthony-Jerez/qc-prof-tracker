import { supabase } from '../lib/supabaseClient'
import { useQuery } from '@tanstack/react-query'

export function useSupabaseRpc(fn, args, deps) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [fn, ...deps],
    staleTime: 1000 * 60 * 15, // stale time is overwritten to be 15 minutes to balance session caching with update flexibility
    queryFn: async () => {
      const { data, error } = await supabase.rpc(fn, args)
      if (error) throw error
      return data
    }
  })

  return { data, loading: isLoading, error, refetch }
}
