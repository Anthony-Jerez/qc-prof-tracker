import { supabase } from '../lib/supabaseClient'
import { useQuery } from '@tanstack/react-query'

export function useSupabaseRpc(fn, args, deps) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [fn, ...deps],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(fn, args)
      if (error) throw error
      return data
    }
  })

  return { data, loading: isLoading, error, refetch }
}
