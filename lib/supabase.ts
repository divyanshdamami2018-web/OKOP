import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const createFallbackClient = () => {
  const notConfiguredError = new Error('Supabase is not configured for this environment.');

  const createQueryBuilder = () => ({
    select: () => createQueryBuilder(),
    eq: () => createQueryBuilder(),
    single: async () => ({ data: null, error: notConfiguredError }),
    maybeSingle: async () => ({ data: null, error: notConfiguredError }),
    insert: async () => ({ data: null, error: notConfiguredError }),
    update: async () => ({ data: null, error: notConfiguredError }),
    delete: async () => ({ data: null, error: notConfiguredError }),
  });

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      updateUser: async () => ({ data: null, error: notConfiguredError }),
      signInWithPassword: async () => ({ data: null, error: notConfiguredError }),
      signInWithOAuth: async () => ({ data: null, error: notConfiguredError }),
      signUp: async () => ({ data: null, error: notConfiguredError }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
    from: () => createQueryBuilder(),
  } as any;
};

export const supabase = hasSupabaseConfig
  ? createClientComponentClient()
  : createFallbackClient();
