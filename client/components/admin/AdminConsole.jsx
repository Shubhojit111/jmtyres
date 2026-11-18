'use client';
import { useEffect,useState } from 'react';
import { ArrowUpRight, Bell, Boxes, ClipboardList, LayoutDashboard, LogOut, Mail, PencilRuler, ShieldCheck, Users } from 'lucide-react';
import AdminDashboard from './Dashboard';
import AdminProducts from './Products';
import AdminRequests from './Requests';
import AdminEnquiries from './Enquiries';
import AdminCustomers from './Customers';
import AdminContent from './Content';
import AdminNotifications from './Notifications';

const pages = [
  ['overview','Overview',LayoutDashboard],['products','Products & stock',Boxes],['requests','Purchase requests',ClipboardList],['enquiries','Enquiries',Mail],['customers','Customers',Users],['content','Website content',PencilRuler],['notifications','Notification log',Bell],['audit','Activity',ShieldCheck],
];
export default function AdminConsole({section='overview'}) {
  const [user,setUser]=useState(undefined);const [config,setConfig]=useState(null);
  useEffect(()=>{fetch('/api/auth/me',{cache:'no-store'}).then(r=>r.json()).then(data=>{if(data.user?.role!=='admin')window.location.assign('/admin/login');else setUser(data.user);}).catch(()=>window.location.assign('/admin/login'));fetch('/api/admin/settings').then(r=>r.json()).then(setConfig).catch(()=>{});},[]);
  async function logout(){await fetch('/api/auth/logout',{method:'POST'});window.location.assign('/admin/login');}
  if(user===undefined)return <p className="mx-4 my-12 rounded-xl bg-[#eff5ed] p-8 text-[13px] sm:mx-8">Checking secure admin session…</p>;
  return <div className="admin-app mx-4 mb-12 mt-5 sm:mx-8"><div className="rounded-[22px] bg-[#143b27] p-7 text-white sm:p-9"><div className="flex flex-wrap items-start justify-between gap-5"><div><span className="rounded-full border border-white/30 px-3 py-1 text-[10px] font-extrabold tracking-wide">J.M. TYRES · OWNER WORKSPACE</span><h1 className="mt-4 text-[35px] font-extrabold tracking-[-.07em] sm:text-[47px]">Manage your shop.</h1><p className="mt-2 text-[12px] text-[#d0e1d1]">Signed in as {user.name} · {user.email}</p></div><button className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-[12px] font-bold hover:bg-white/10" onClick={logout} type="button"><LogOut aria-hidden="true" size={16}/>Sign out</button></div></div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]"><nav aria-label="Admin navigation" className="flex h-fit gap-1 overflow-x-auto rounded-[18px] bg-[#eff4ed] p-3 lg:flex-col lg:p-4">{pages.map(([slug,label,Icon])=><a aria-current={section===slug?'page':undefined} className={`inline-flex min-h-[42px] shrink-0 items-center gap-2 rounded-xl px-3 text-[12px] font-extrabold ${section===slug?'bg-[#1c4930] text-white':'text-[#395640] hover:bg-[#dcebdd]'}`} href={slug==='overview'?'/admin':`/admin/${slug}`} key={slug}><Icon aria-hidden="true" size={17}/>{label}</a>)}<a className="mt-1 inline-flex shrink-0 items-center gap-2 px-3 py-2 text-[11px] font-bold text-[#356546] underline" href="/catalogue">View public catalogue <ArrowUpRight aria-hidden="true" size={14}/></a></nav>
      <div className="min-w-0">{config&&<div className="mb-4 flex flex-wrap gap-2 text-[10px] font-bold"><span className="rounded-full bg-[#eaf2e6] px-3 py-1.5">Payment: {config.payment.mode==='demo'?'SIMULATED DEMO':config.payment.liveReady?'LIVE':'NOT CONFIGURED'}</span><span className="rounded-full bg-[#eaf2e6] px-3 py-1.5">Email: {config.notifications.email==='demo_log_only'?'LOG ONLY': 'CONFIGURED'}</span><span className="rounded-full bg-[#eaf2e6] px-3 py-1.5">Images: {config.images.replace(/_/g,' ')}</span></div>}
        {section==='overview'?<AdminDashboard/>:section==='products'?<AdminProducts/>:section==='requests'?<AdminRequests/>:section==='enquiries'?<AdminEnquiries/>:section==='customers'?<AdminCustomers/>:section==='content'?<AdminContent/>:section==='notifications'?<AdminNotifications audit={false}/>:<AdminNotifications audit/>}
      </div></div>
  </div>;
}
