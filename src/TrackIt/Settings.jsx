import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Globe,
  Shield,
  Bell,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Save,
  User,
  Package,
  HelpCircle,
  LogOut,
  Settings as SettingsIcon // Fixed: Rename to avoid conflict
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Label } from './ui/Label';
import { toast } from 'sonner';

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
    toast.success('Settings saved successfully!');
  };

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'auto', label: 'Auto', icon: Monitor }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 shadow-sm min-h-screen sticky top-0">
          <div className="p-6">
            {/* User Profile */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                <span className="text-lg font-bold">JS</span>
              </div>
              <div>
                <p className="font-medium">John Smith</p>
                <p className="text-sm text-gray-500">john@example.com</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 mb-8">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className="w-full justify-start hover:bg-gray-100 text-gray-700"
              >
                <Package className="w-5 h-5 mr-3" />
                <span>My Orders</span>
              </Button>
              
              <Button
                onClick={() => navigate('/profile')}
                variant="ghost"
                className="w-full justify-start hover:bg-gray-100 text-gray-700"
              >
                <User className="w-5 h-5 mr-3" />
                <span>Profile</span>
              </Button>
              
              <Button
                onClick={() => navigate('/settings')}
                className="w-full justify-start bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              >
                <SettingsIcon className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </Button>
              
              <Button
                onClick={() => navigate('/help')}
                variant="ghost"
                className="w-full justify-start hover:bg-gray-100 text-gray-700"
              >
                <HelpCircle className="w-5 h-5 mr-3" />
                <span>Help & Support</span>
              </Button>
            </nav>

            {/* Logout */}
            <div className="pt-6 border-t border-gray-200">
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full border-red-200 hover:bg-red-50 hover:text-red-600 text-gray-700"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           

            {/* Header */}
            <div className="mb-6 animate-slide-in">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-600">Manage your app preferences and settings</p>
            </div>

            {/* Language & Region */}
            <Card className="border-0 shadow-xl mb-6 overflow-hidden animate-scale-in">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Language & Region</CardTitle>
                    <CardDescription>Set your preferred language and location</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select value={settings.region} onValueChange={(value) => setSettings(prev => ({ ...prev, region: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                      <SelectItem value="cn">China</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border-0 shadow-xl mb-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize how the app looks</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-3">
                  <Label>Theme</Label>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {themes.map((theme) => (
                    <Button
                      key={theme.id}
                      variant="outline"
                      onClick={() => setSettings(prev => ({ ...prev, theme: theme.id }))}
                      className={`p-4 rounded-xl border-2 transition-all h-auto flex-col ${
                        settings.theme === theme.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <theme.icon className={`w-6 h-6 mx-auto mb-2 ${settings.theme === theme.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <p className={`text-sm font-medium ${settings.theme === theme.id ? 'text-indigo-600' : 'text-gray-600'}`}>
                        {theme.label}
                      </p>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="border-0 shadow-xl mb-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription>Control your data and security settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSettings(prev => ({ ...prev, twoFactor: !prev.twoFactor }))}
                    className={`relative w-12 h-6 rounded-full transition-colors p-0 ${
                      settings.twoFactor ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.twoFactor ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Data Sharing</p>
                    <p className="text-sm text-gray-600">Share analytics to help improve the app</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSettings(prev => ({ ...prev, dataSharing: !prev.dataSharing }))}
                    className={`relative w-12 h-6 rounded-full transition-colors p-0 ${
                      settings.dataSharing ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.dataSharing ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info('Redirecting to privacy policy...')}
                >
                  View Privacy Policy
                </Button>
              </CardContent>
            </Card>

            {/* App Preferences */}
            <Card className="border-0 shadow-xl mb-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>App Preferences</CardTitle>
                    <CardDescription>Customize your experience</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Automatic Updates</p>
                    <p className="text-sm text-gray-600">Keep the app up to date automatically</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSettings(prev => ({ ...prev, autoUpdate: !prev.autoUpdate }))}
                    className={`relative w-12 h-6 rounded-full transition-colors p-0 ${
                      settings.autoUpdate ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.autoUpdate ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-600">Receive important updates and alerts</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                    className={`relative w-12 h-6 rounded-full transition-colors p-0 ${
                      settings.notifications ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.notifications ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/profile')}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}