import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Shield,
  Bell,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Save,
  Zap,
  Lock,
  Eye,
  RefreshCw
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Label } from './ui/Label';
import { toast } from 'sonner';
import { Layout } from './Layout';

export default function Settings() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    language: 'en',
    region: 'us',
    timezone: 'America/New_York',
    theme: 'light',
    autoUpdate: true,
    notifications: true,
    twoFactor: false,
    dataSharing: false
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success('System configuration synchronized successfully');
  };

  const themes = [
    { id: 'light', label: 'Day Mode', icon: Sun },
    { id: 'dark', label: 'Night Ops', icon: Moon },
    { id: 'auto', label: 'System Sync', icon: Monitor }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Layout />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              System <span className="text-yellow-500">Config</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              Manage global operational parameters and terminal preferences
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Language & Region */}
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden relative">
              <div className="h-1.5 w-full bg-slate-900" />
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner">
                    <Globe className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black uppercase tracking-tight">Localization</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Regional Data Nodes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Display Language</Label>
                    <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger className="bg-slate-50 border-slate-100 rounded-xl h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English (US)</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Operational Region</Label>
                    <Select value={settings.region} onValueChange={(value) => setSettings(prev => ({ ...prev, region: value }))}>
                      <SelectTrigger className="bg-slate-50 border-slate-100 rounded-xl h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">North America</SelectItem>
                        <SelectItem value="eu">European Union</SelectItem>
                        <SelectItem value="in">India (APAC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="h-1.5 w-full bg-yellow-500" />
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner">
                    <Eye className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black uppercase tracking-tight">UI Interface</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Terminal Visualization</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid grid-cols-3 gap-4">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSettings(prev => ({ ...prev, theme: theme.id }))}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                        settings.theme === theme.id
                          ? 'border-slate-900 bg-slate-900 text-yellow-400'
                          : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <theme.icon className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="h-1.5 w-full bg-slate-900" />
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner">
                    <Lock className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black uppercase tracking-tight">Security Protocol</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Access & Data Encryption</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-3">
                {[
                  { key: 'twoFactor', label: '2FA Auth Nodes', desc: 'Secure secondary verification link' },
                  { key: 'dataSharing', label: 'Telemetry Sharing', desc: 'Allow anonymous system diagnostic data' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100/50">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">{item.label}</p>
                      <p className="text-[10px] font-medium text-slate-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className={`relative w-12 h-6 rounded-full transition-all ${
                        settings[item.key] ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings[item.key] ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="flex-1 border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-widest h-14 rounded-xl"
              onClick={() => navigate('/profile')}
            >
              Discard Changes
            </Button>
            <Button
              className="flex-1 bg-slate-900 text-yellow-400 hover:bg-slate-800 font-black uppercase text-[10px] tracking-widest h-14 rounded-xl shadow-xl shadow-slate-200"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Syncing...' : 'Apply Configuration'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}