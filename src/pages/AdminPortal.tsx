import { useState } from 'react';
import {
  LayoutDashboard, Building2, Users, ShieldCheck,
  CheckCircle, XCircle, Eye, Search, ChevronRight,
  Clock, TrendingUp
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { mockOrganizations, mockAccounts, currentAdmin, monthlyVerifications } from '../data/mockData';
import type { AppContextType } from '../App';
import type { HROrganization } from '../data/mockData';

type AdminTab = 'dashboard' | 'organizations' | 'accounts';

export function AdminPortal({ ctx }: { ctx: AppContextType }) {
  const { t } = ctx;
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [orgs, setOrgs] = useState<HROrganization[]>(mockOrganizations);
  const [searchQuery, setSearchQuery] = useState('');

  const handleApprove = (id: string) => {
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, status: 'approved' as const } : o));
  };

  const handleReject = (id: string) => {
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, status: 'rejected' as const } : o));
  };

  const sidebarItems = [
    { id: 'dashboard' as AdminTab, label: t('dashboard'), icon: <LayoutDashboard size={18} /> },
    { id: 'organizations' as AdminTab, label: t('organizations'), icon: <Building2 size={18} /> },
    { id: 'accounts' as AdminTab, label: t('accounts'), icon: <Users size={18} /> },
  ];

  const pendingOrgs = orgs.filter(o => o.status === 'pending');
  const totalAccounts = mockAccounts.length;

  const accountTypeData = [
    { name: t('student'), value: mockAccounts.filter(a => a.type === 'student').length },
    { name: t('issuer'), value: mockAccounts.filter(a => a.type === 'issuer').length },
    { name: t('hr'), value: mockAccounts.filter(a => a.type === 'hr').length },
    { name: t('admin'), value: mockAccounts.filter(a => a.type === 'admin').length },
  ];

  const COLORS = ['#000000', '#666666', '#999999', '#cccccc'];

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r hidden md:block" style={{ borderColor: 'var(--ct-border)', background: 'var(--ct-surface)' }}>
        <div className="p-6 border-b" style={{ borderColor: 'var(--ct-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: '#000' }}>
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold">{currentAdmin.name}</p>
              <p className="text-xs opacity-60">System</p>
            </div>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'text-white' : 'opacity-60 hover:opacity-100'}`} style={{ background: activeTab === item.id ? '#000' : 'transparent' }}>
              {item.icon}
              {item.label}
              {item.id === 'organizations' && pendingOrgs.length > 0 && (
                <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{pendingOrgs.length}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === item.id ? 'text-white' : 'opacity-60'}`} style={{ background: activeTab === item.id ? '#000' : 'var(--ct-surface)' }}>
              {item.icon}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && <AdminDashboard t={t} pendingCount={pendingOrgs.length} totalAccounts={totalAccounts} onTabChange={setActiveTab} accountTypeData={accountTypeData} COLORS={COLORS} />}
        {activeTab === 'organizations' && <AdminOrganizations t={t} orgs={orgs} onApprove={handleApprove} onReject={handleReject} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        {activeTab === 'accounts' && <AdminAccounts t={t} />}
      </main>
    </div>
  );
}

/* ========================= DASHBOARD ========================= */
function AdminDashboard({ t, pendingCount, totalAccounts, onTabChange, accountTypeData, COLORS }: {
  t: (k: string) => string; pendingCount: number; totalAccounts: number; onTabChange: (t: AdminTab) => void;
  accountTypeData: any[]; COLORS: string[];
}) {
  return (
    <div>
      <h1 className="font-display text-2xl mb-2">{t('welcomeAdmin')}</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--ct-text-secondary)' }}>{t('mockDataLabel')} — {t('phase1Label')}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label={t('organizations')} value={pendingCount.toString()} icon={<Building2 size={20} />} badge="pending" onClick={() => onTabChange('organizations')} />
        <StatCard label={t('accounts')} value={totalAccounts.toString()} icon={<Users size={20} />} onClick={() => onTabChange('accounts')} />
        <StatCard label={t('verificationsThisMonth')} value="58" icon={<TrendingUp size={20} />} onClick={() => {}} />
        <StatCard label="System" value="OK" icon={<ShieldCheck size={20} />} onClick={() => {}} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border" style={{ borderColor: 'var(--ct-border)', background: 'var(--ct-surface)' }}>
          <h3 className="font-semibold mb-4">{t('verifyTrends')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyVerifications}>
              <defs>
                <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ct-border)" />
              <XAxis dataKey="month" stroke="var(--ct-text-secondary)" fontSize={12} />
              <YAxis stroke="var(--ct-text-secondary)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--ct-surface)', border: '1px solid var(--ct-border)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="count" stroke="#000" fill="url(#adminGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl border" style={{ borderColor: 'var(--ct-border)', background: 'var(--ct-surface)' }}>
          <h3 className="font-semibold mb-4">{t('accounts')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={accountTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {accountTypeData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--ct-surface)', border: '1px solid var(--ct-border)', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {accountTypeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index] }} />
                <span className="text-xs opacity-60">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================= ORGANIZATIONS ========================= */
function AdminOrganizations({ t, orgs, onApprove, onReject, searchQuery, setSearchQuery }: {
  t: (k: string) => string; orgs: HROrganization[]; onApprove: (id: string) => void; onReject: (id: string) => void;
  searchQuery: string; setSearchQuery: (q: string) => void;
}) {
  const filtered = orgs.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.taxId.includes(searchQuery));

  return (
    <div>
      <h1 className="font-display text-2xl mb-2">{t('orgRequests')}</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--ct-text-secondary)' }}>{t('orgRequestsDesc')}</p>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('search')} className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--ct-bg)', borderColor: 'var(--ct-border)', color: 'var(--ct-text)' }} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--ct-text-secondary)' }}>{t('noOrgRequests')}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(org => (
            <div key={org.id} className="p-5 rounded-xl border" style={{ borderColor: 'var(--ct-border)', background: 'var(--ct-surface)' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{org.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${org.status === 'pending' ? 'bg-amber-100 text-amber-700' : org.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {org.status === 'pending' ? t('pending') : org.status === 'approved' ? t('approved') : t('rejected')}
                    </span>
                  </div>
                  <p className="text-xs font-mono opacity-60">{t('taxId')}: {org.taxId}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs opacity-60">
                    <span>{org.contactName}</span>
                    <span>{org.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity">
                      <Eye size={12} /> {t('viewLicense')}: {org.licenseFile}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {org.status === 'pending' && (
                    <>
                      <button onClick={() => onApprove(org.id)} className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white rounded-lg bg-black hover:opacity-80 transition-opacity">
                        <CheckCircle size={12} /> {t('approve')}
                      </button>
                      <button onClick={() => onReject(org.id)} className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                        <XCircle size={12} /> {t('reject')}
                      </button>
                    </>
                  )}
                  {org.status !== 'pending' && (
                    <span className="text-xs opacity-40 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(org.submittedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========================= ACCOUNTS ========================= */
function AdminAccounts({ t }: { t: (k: string) => string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = mockAccounts.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'all' || a.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">{t('accounts')}</h1>

      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('search')} className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--ct-bg)', borderColor: 'var(--ct-border)', color: 'var(--ct-text)' }} />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--ct-bg)', borderColor: 'var(--ct-border)', color: 'var(--ct-text)' }}>
          <option value="all">{t('all')}</option>
          <option value="student">{t('student')}</option>
          <option value="issuer">{t('issuer')}</option>
          <option value="hr">{t('hr')}</option>
          <option value="admin">{t('admin')}</option>
        </select>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ct-border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--ct-bg)', borderBottom: '1px solid var(--ct-border)' }}>
              <th className="text-left px-4 py-3 font-medium">{t('studentName')}</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">{t('accountType')}</th>
              <th className="text-left px-4 py-3 font-medium">{t('status')}</th>
              <th className="text-left px-4 py-3 font-medium">{t('lastActive')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(acc => (
              <tr key={acc.id} className="border-t transition-colors hover:opacity-80" style={{ borderColor: 'var(--ct-border)' }}>
                <td className="px-4 py-3 font-medium">{acc.name}</td>
                <td className="px-4 py-3 text-xs font-mono opacity-70">{acc.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${acc.type === 'student' ? 'bg-blue-100 text-blue-700' : acc.type === 'issuer' ? 'bg-purple-100 text-purple-700' : acc.type === 'hr' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {acc.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${acc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {acc.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-mono opacity-60">{new Date(acc.lastActive).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, badge, onClick }: { label: string; value: string; icon: React.ReactNode; badge?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="p-5 rounded-2xl border text-left transition-all hover:scale-[1.02] group relative" style={{ borderColor: 'var(--ct-border)', background: 'var(--ct-surface)' }}>
      {badge && (
        <span className="absolute top-3 right-3 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-500 text-white">{badge}</span>
      )}
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: 'var(--ct-text-secondary)' }}>{icon}</span>
        <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: 'var(--ct-text-secondary)' }} />
      </div>
      <p className="font-display text-3xl">{value}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--ct-text-secondary)' }}>{label}</p>
    </button>
  );
}
