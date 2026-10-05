import {serverClient} from '@/lib/supabase/server';
export async function POST(){const db=await serverClient();await db.auth.signOut();return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}})}
