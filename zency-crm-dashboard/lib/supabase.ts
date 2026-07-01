import { createClient } from "@supabase/supabase-js";

console.log("========== SUPABASE ==========");
console.log("cwd:", process.cwd());

console.log(
  "URL exists:",
  !!process.env.NEXT_PUBLIC_SUPABASE_URL
);

console.log(
  "ANON exists:",
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log(
  "URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL
);

console.log(
  "KEY:",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)
);

console.log("==============================");

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);