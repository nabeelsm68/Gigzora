import { createClient } from "@supabase/supabase-js";

console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("SERVICE KEY LENGTH:", process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
console.log("SERVICE KEY START:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 15));

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);