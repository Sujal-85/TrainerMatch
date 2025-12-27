import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import Head from 'next/head';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import {
  User,
  Building,
  Bell,
  Shield,
  CreditCard,
  Save,
  Upload,
  Check
} from 'lucide-react';
import Sidebar from '@/components/sidebar';
import BillingSettings from '@/components/settings/billing';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    role: 'VENDOR_USER',
    profilePicture: '',
    bio: 'Training coordinator with 8 years of experience in educational program management.',
    organization: 'TechCorp University',
    notificationEmails: true,
    notificationPush: false,
    twoFactorAuth: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/me');
        const user = response.data;
        setFormData(prev => ({
          ...prev,
          name: user.trainer?.name || user.name || user.email?.split('@')[0] || '',
          email: user.email || '',
          role: user.role || 'VENDOR_USER',
          profilePicture: user.trainer?.profilePicture || user.profilePicture || '',
          bio: user.trainer?.bio || user.bio || prev.bio,
          organization: user.vendor?.name || prev.organization,
        }));
      } catch (error) {
        console.error('Failed to fetch user settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Handle checkbox change manually for type safety
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // In a real app, this would call the API
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'organization', name: 'Organization', icon: Building },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <Spinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>TrainerMatch - Settings</title>
        <meta name="description" content="Manage your account settings" />
      </Head>

      <Sidebar />

      <main className="md:pl-64 pt-0 transition-all duration-300 min-h-screen">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white pb-24 pt-10 px-6 shadow-xl">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
          <div className="container mx-auto relative z-10">
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-blue-100">Manage your profile, preferences, and organization details.</p>
          </div>
        </div>

        <div className="container mx-auto px-6 -mt-16 relative z-20 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Navigation */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-white border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-foreground">Menu</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <Button
                          key={tab.id}
                          variant={isActive ? 'default' : 'ghost'}
                          className={`w-full justify-start text-sm font-bold transition-all duration-200 ${isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                            : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-500 dark:hover:bg-blue-900/20'
                            }`}
                          onClick={() => setActiveTab(tab.id)}
                        >
                          <Icon className={`h-4 w-4 mr-3 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                          {tab.name}
                        </Button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>

              {/* Mini Profile Card */}
              <Card className="border-none shadow-lg shadow-blue-900/5 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                <CardContent className="p-6 relative z-10 flex flex-col items-center text-center">
                  <div className="h-20 w-20 rounded-full bg-white/20 p-1 mb-3 backdrop-blur-sm">
                    <div className="h-full w-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                      {formData.profilePicture ? (
                        <img src={formData.profilePicture} alt={formData.name} className="h-full w-full object-cover" />
                      ) : formData.name ? (
                        <span className="text-2xl font-bold text-slate-700">{formData.name.charAt(0)}</span>
                      ) : (
                        <User className="h-10 w-10 text-slate-400" />
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg">{formData.name}</h3>
                  <p className="text-blue-100 text-sm mb-4">{formData.email}</p>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">{formData.role}</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <Card className="border-border shadow-lg bg-white rounded-lg">
                <CardHeader className="bg-white border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { className: "h-6 w-6 text-blue-600 dark:text-blue-400" })}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        {tabs.find(tab => tab.id === activeTab)?.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {activeTab === 'profile' && 'Update your personal information and public profile.'}
                        {activeTab === 'organization' && 'Manage your organization details and settings.'}
                        {activeTab === 'notifications' && 'Choose how you want to be notified.'}
                        {activeTab === 'security' && 'Enhance your account security.'}
                        {activeTab === 'billing' && 'Manage your subscription and billing details.'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 ">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {activeTab === 'profile' && (
                      <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex items-center gap-6">
                          <div className="relative group">
                            <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                              {formData.profilePicture ? (
                                <img src={formData.profilePicture} alt={formData.name} className="h-full w-full object-cover" />
                              ) : formData.name ? (
                                <span className="text-3xl font-bold text-slate-400">{formData.name.charAt(0)}</span>
                              ) : (
                                <User className="h-12 w-12 text-slate-300" />
                              )}
                            </div>
                            <Button
                              size="icon"
                              className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-blue-600 hover:bg-blue-700 border-2 border-white shadow-sm"
                              title="Upload photo"
                            >
                              <Upload className="h-4 w-4 text-white" />
                            </Button>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-800">Profile Photo</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-500 mb-2">Detailed photos help you build trust.</p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="text-xs bg-white dark:bg-white text-slate-600 dark:text-slate-600 border-slate-200">Upload New</Button>
                              <Button variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50">Remove</Button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              type="text"
                              name="name"
                              id="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="bg-slate-50 border-slate-200 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="bg-slate-50 border-slate-200 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio" className="text-slate-700 dark:text-slate-700 font-bold">Bio</Label>
                          <Textarea
                            name="bio"
                            id="bio"
                            rows={4}
                            value={formData.bio}
                            onChange={handleChange}
                            className="bg-slate-50 dark:bg-white border-slate-200 text-slate-800 dark:text-slate-800 focus:ring-blue-500 resize-none"
                            placeholder="Tell us a little about yourself"
                          />
                          <p className="text-xs text-slate-400 text-right">0/300 characters</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'organization' && (
                      <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization Name</Label>
                          <Input
                            type="text"
                            name="organization"
                            id="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            className="bg-slate-50 border-slate-200 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Organization Logo</Label>
                          <div className="flex items-center gap-6 p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center border border-slate-100 shadow-sm">
                              <Building className="h-8 w-8 text-slate-300" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-slate-800">Upload Logo</h4>
                              <p className="text-xs text-slate-500 mb-2">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                              <Button variant="outline" size="sm" className="h-8">Choose File</Button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700 dark:text-slate-700 font-bold">Description</Label>
                          <Textarea
                            rows={4}
                            placeholder="Describe your organization's mission and goals..."
                            className="bg-slate-50 dark:bg-white border-slate-200 text-slate-800 dark:text-slate-800 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'notifications' && (
                      <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Bell className="h-5 w-5" /></div>
                            <div>
                              <h3 className="font-medium text-slate-800">Email Notifications</h3>
                              <p className="text-sm text-slate-500">Receive weekly digests and critical alerts</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="notificationEmails"
                              checked={formData.notificationEmails}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Bell className="h-5 w-5" /></div>
                            <div>
                              <h3 className="font-medium text-slate-800">Push Notifications</h3>
                              <p className="text-sm text-slate-500">Receive real-time updates on your device</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="notificationPush"
                              checked={formData.notificationPush}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    )}

                    {activeTab === 'security' && (
                      <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                          <h4 className="text-amber-800 font-medium mb-1">Security Recommendations</h4>
                          <p className="text-sm text-amber-600">Your password was last changed 3 months ago. We recommend updating it regularly.</p>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                          <div>
                            <h3 className="font-medium text-slate-800">Two-Factor Authentication</h3>
                            <p className="text-sm text-slate-500">Secure your account with 2FA.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="twoFactorAuth"
                              checked={formData.twoFactorAuth}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                          <h3 className="font-medium text-slate-800 mb-4">Login History</h3>
                          <div className="space-y-4">
                            {[
                              { action: 'Login', device: 'Chrome on Windows', ip: '192.168.1.1', time: '2 mins ago', current: true },
                              { action: 'Login', device: 'Safari on iPhone 13', ip: '192.168.1.45', time: '1 day ago' },
                            ].map((log, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${log.current ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                  <div>
                                    <p className="font-medium text-slate-700">{log.device}</p>
                                    <p className="text-xs text-slate-500">{log.ip}</p>
                                  </div>
                                </div>
                                <span className="text-slate-400">{log.time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'billing' && (
                      <div className="animate-in fade-in duration-500">
                        <BillingSettings />
                      </div>
                    )}
                  </form>
                </CardContent>

              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function Download(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}