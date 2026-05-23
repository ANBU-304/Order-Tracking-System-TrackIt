import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Eye, Sun, Moon, Monitor, Zap, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Label } from './ui/Label';
import { toast } from 'sonner';
import { Layout } from './Layout';

export default function Settings() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize state from localStorage or default
  const [settings, setSettings] = useState(() => ({
    language: 'en',
    region: 'us',
    theme: localStorage.getItem('theme') || 'light'
  }));

  // Apply theme class to body/document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
    localStorage.setItem('theme', settings.theme);
  }, [settings.theme]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast.success('System configuration synchronized');
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
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              System <span className="text-yellow-500">Config</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Localization Card */}
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="h-1.5 w-full bg-slate-900" />
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black uppercase tracking-tight">Localization</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Regional Data Nodes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500">Display Language</Label>
                  <Select value={settings.language} onValueChange={(v) => setSettings(p => ({ ...p, language: v }))}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* UI Interface Card */}
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="h-1.5 w-full bg-yellow-500" />
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-slate-900" />
                  </div>
                  <CardTitle className="text-lg font-black uppercase tracking-tight">UI Interface</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid grid-cols-3 gap-4">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSettings(prev => ({ ...prev, theme: theme.id }))}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                        settings.theme === theme.id ? 'border-slate-900 bg-slate-900 text-yellow-400' : 'border-slate-100'
                      }`}
                    >
                      <theme.icon className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            className="w-full bg-slate-900 text-yellow-400 h-14 rounded-xl"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <RefreshCw className="animate-spin w-4 h-4 mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
            Apply Configuration
          </Button>
        </div>
      </main>
    </div>
  );
}