import { redirect,notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/backend';
import AdminConsole from '@/components/admin/AdminConsole';
const allowed = ['overview','products','requests','enquiries','customers','content','notifications','audit'];
export const dynamic = 'force-dynamic';
export const metadata = {title:'Owner Workspace | J.M. Tyres',robots:{index:false,follow:false}};
export default async function AdminPage({params}){
  const section=params.section?.[0] || 'overview';if(params.section?.length>1 || !allowed.includes(section))notFound();
  const actor = await getSessionUser();
  if (actor?.role !== 'admin') redirect(`/admin/login?next=${encodeURIComponent(section==='overview'?'/admin':`/admin/${section}`)}`);
  return <AdminConsole section={section}/>;
}
