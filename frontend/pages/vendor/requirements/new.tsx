import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import Head from 'next/head';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import {
  FileText,
  Tag,
  DollarSign,
  Calendar,
  MapPin,
  Building,
  Plus,
  X,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";

export default function NewRequirement() {
  const router = useRouter();
  const [colleges, setColleges] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    budgetMin: '',
    budgetMax: '',
    startDate: '',
    endDate: '',
    location: '',
    collegeId: '',
  });

  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [rawText, setRawText] = useState('');

  const handleSmartParse = async () => {
    setParsing(true);
    const toastId = toast.loading('Analyzing text with AI...');
    try {
      const response = await api.post('/ai/interpret-requirements', { text: rawText });
      const data = response.data;

      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: rawText || prev.description, // Use raw text as description if not parsed (or maybe AI returns summary?)
        budgetMin: data.budgetMin?.toString() || prev.budgetMin,
        budgetMax: data.budgetMax?.toString() || prev.budgetMax,
        location: data.location || prev.location,
        tags: data.skills || prev.tags
      }));

      // Close sheet (optional, or just show success toast)
      // document.getElementById('close-sheet')?.click(); // Hacky, better separate sheet state
      toast.success("Form auto-filled by AI!", { id: toastId });
    } catch (error) {
      console.error("Smart Parse failed", error);
      toast.error("Failed to parse requirements. Please try again.", { id: toastId });
    } finally {
      setParsing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/colleges');
        setColleges(response.data);
        // Auto-select if there's only one college (UX improvement)
        if (response.data && response.data.length === 1) {
          setFormData(prev => ({ ...prev, collegeId: response.data[0].id }));
        }
      } catch (error) {
        console.error("Failed to fetch colleges", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Creating requirement...');
    try {
      const payload = {
        ...formData,
        budgetMin: parseFloat(formData.budgetMin) || 0,
        budgetMax: parseFloat(formData.budgetMax) || 0,
        // Ensure dates are ISO strings if needed, or Date objects
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      };
      await api.post('/requirements', payload);
      toast.success('Requirement created successfully!', { id: toastId });
      router.push('/vendor/requirements'); // Redirect to list
    } catch (error) {
      console.error('Failed to create requirement:', error);
      toast.error('Failed to create requirement. Please check your inputs and try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };



  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Head>
          <title>TrainerMatch - New Requirement</title>
          <meta name="description" content="Create a new training requirement" />
        </Head>

        <Sidebar />

        <main className="md:pl-64 pt-0 transition-all duration-300 min-h-screen bg-slate-50/50">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white pb-24 pt-10 px-6 shadow-xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
            <div className="container mx-auto relative z-10">
              <Link href="/vendor/requirements" className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Requirements
              </Link>
              <h1 className="text-3xl font-bold mb-2">Post New Requirement</h1>
              <p className="text-blue-100 max-w-2xl">
                Create a detailed job posting to attract the best trainers. Our AI will automatically match you with top talent.
              </p>
            </div>
          </div>

          <div className="container mx-auto px-6 -mt-20 relative z-20 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {loading ? (
                  <div className="flex min-h-[400px] items-center justify-center bg-white rounded-xl shadow-xl shadow-slate-200/50">
                    <div className="flex flex-col items-center gap-4">
                      <Spinner size="lg" className="text-blue-600" />
                      <p className="text-slate-500 animate-pulse">Loading form...</p>
                    </div>
                  </div>
                ) : (
                  <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-50">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-800">Requirement Details</CardTitle>
                      </div>
                      <CardDescription className="ml-12">
                        Fill in the specifics about the training program
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 bg-white">

                      {/* AI Smart Fill Section */}
                      <div className="mb-8 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-xl flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-violet-800 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Smart Fill with AI
                          </h3>
                          <p className="text-sm text-violet-600 mt-1">Paste a job description or email to auto-fill this form.</p>
                        </div>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button className="bg-violet-600 hover:bg-violet-700 text-white border-none shadow-md shadow-violet-500/20">
                              <Sparkles className="w-4 h-4 mr-2" />
                              Smart Fill
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[400px] sm:w-[540px]">
                            <SheetHeader>
                              <SheetTitle>Smart Fill</SheetTitle>
                              <SheetDescription>
                                Paste your raw text below and let AI extract the details.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-4">
                              <Textarea
                                placeholder="Paste job description here..."
                                className="min-h-[300px] resize-none"
                                value={rawText}
                                onChange={(e) => setRawText(e.target.value)}
                              />
                              <Button
                                className="w-full bg-violet-600 hover:bg-violet-700"
                                onClick={handleSmartParse}
                                disabled={parsing || !rawText.trim()}
                              >
                                {parsing ? (
                                  <>
                                    <Spinner className="mr-2" />
                                    Analyzing...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Auto-Fill Form
                                  </>
                                )}
                              </Button>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>

                      <form id="create-req-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-slate-700 font-medium">Training Title</Label>
                          <div className="relative group">
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4" />
                            <Input
                              type="text"
                              name="title"
                              id="title"
                              value={formData.title}
                              onChange={handleChange}
                              className="pl-10 h-11 border-slate-200 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                              placeholder="e.g., Advanced Machine Learning Workshop"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-slate-700 font-medium">Description</Label>
                          <Textarea
                            name="description"
                            id="description"
                            rows={6}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide a detailed description of the training requirement, including objectives, audience, and expected outcomes."
                            required
                            className="border-slate-200 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Skills & Tags</Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1 group">
                              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4" />
                              <Input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                className="pl-10 h-11 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Add a tag (e.g. Python, Leadership) and press Enter"
                                aria-label="Add tag"
                              />
                            </div>
                            <Button type="button" onClick={handleAddTag} variant="secondary" aria-label="Add tag" className="h-11 px-4 hover:bg-slate-200">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3 min-h-[30px]">
                            {formData.tags.length === 0 && (
                              <span className="text-sm text-slate-400 italic">No tags added yet.</span>
                            )}
                            {formData.tags.map((tag) => (
                              <div key={tag} className="flex items-center bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1 animate-in fade-in zoom-in duration-200">
                                <span className="text-sm font-medium">{tag}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-2 text-blue-400 hover:text-blue-600 rounded-full p-0.5 hover:bg-blue-100 transition-colors"
                                  aria-label={`Remove tag ${tag}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="budgetMin" className="text-slate-700 font-medium">Minimum Budget ($)</Label>
                            <div className="relative group">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-green-500 transition-colors h-4 w-4" />
                              <Input
                                type="number"
                                name="budgetMin"
                                id="budgetMin"
                                value={formData.budgetMin}
                                onChange={handleChange}
                                className="pl-10 h-11 border-slate-200 focus:ring-green-500 focus:border-green-500"
                                placeholder="0"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="budgetMax" className="text-slate-700 font-medium">Maximum Budget ($)</Label>
                            <div className="relative group">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-green-500 transition-colors h-4 w-4" />
                              <Input
                                type="number"
                                name="budgetMax"
                                id="budgetMax"
                                value={formData.budgetMax}
                                onChange={handleChange}
                                className="pl-10 h-11 border-slate-200 focus:ring-green-500 focus:border-green-500"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="startDate" className="text-slate-700 font-medium">Start Date</Label>
                            <div className="relative group">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4" />
                              <Input
                                type="date"
                                name="startDate"
                                id="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="pl-10 h-11 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="endDate" className="text-slate-700 font-medium">End Date</Label>
                            <div className="relative group">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4" />
                              <Input
                                type="date"
                                name="endDate"
                                id="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="pl-10 h-11 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="location" className="text-slate-700 font-medium">Location</Label>
                            <div className="relative group">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors h-4 w-4" />
                              <Input
                                type="text"
                                name="location"
                                id="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="pl-10 h-11 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="City, State or Remote"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="collegeId" className="text-slate-700 font-medium">Affiliated College</Label>
                            <div className="relative group">
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4" />
                              <select
                                id="collegeId"
                                name="collegeId"
                                value={formData.collegeId}
                                onChange={(e) => setFormData(prev => ({ ...prev, collegeId: e.target.value }))}
                                className="flex h-11 w-full rounded-md border border-slate-200 bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Select college"
                                required
                              >
                                <option value="">Select a college</option>
                                {colleges.map((college) => (
                                  <option key={college.id} value={college.id}>
                                    {college.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 bg-slate-50 p-6 border-t border-slate-100">
                      <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto h-11 border-slate-300 hover:bg-white text-slate-600">Cancel</Button>
                      <Button type="submit" form="create-req-form" className="w-full sm:w-auto h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/20">
                        Create Requirement
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-lg shadow-blue-900/5 bg-gradient-to-b from-blue-50 to-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      Pro Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                      <div className="bg-blue-100 p-2 rounded-full shrink-0">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-800">Review Objectives</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Clear learning goals help AI find trainers with the exact expertise needed.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                      <div className="bg-green-100 p-2 rounded-full shrink-0">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-800">Budget Range</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          A competitive range attracts top-tier trainers who might otherwise skip.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg shadow-slate-200/50">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                    <CardTitle className="text-base font-bold text-slate-700">What happens next?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0 pt-4">
                    <div className="relative border-l-2 border-slate-200 ml-3 pb-8 pl-6 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white" />
                      <p className="text-sm font-medium text-slate-800">Requirement Posted</p>
                      <p className="text-xs text-slate-500 mt-1">It becomes visible to qualified trainers.</p>
                    </div>
                    <div className="relative border-l-2 border-slate-200 ml-3 pb-8 pl-6 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cyan-500 ring-4 ring-white" />
                      <p className="text-sm font-medium text-slate-800">AI Matching</p>
                      <p className="text-xs text-slate-500 mt-1">Our system identifies the best fit candidates.</p>
                    </div>
                    <div className="relative border-l-2 border-transparent ml-3 pl-6">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white" />
                      <p className="text-sm font-medium text-slate-800">Review Proposals</p>
                      <p className="text-xs text-slate-500 mt-1">Select your favorite trainer and start.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}