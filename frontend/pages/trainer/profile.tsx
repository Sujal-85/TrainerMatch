import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Upload, Star } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/api';

// Cropping imports
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function TrainerProfile() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        hourlyRate: '',
        location: '',
        skills: '',
        linkedin: '',
        profilePicture: ''
    });

    // Cropping state
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/trainers/profile');
            setProfile(res.data);
            setFormData({
                name: res.data.name || '',
                email: res.data.email || '',
                bio: res.data.bio || '',
                hourlyRate: res.data.hourlyRate ? res.data.hourlyRate.toString() : '',
                location: res.data.location || '',
                skills: res.data.skills ? res.data.skills.join(', ') : '',
                linkedin: res.data.linkedin || '',
                profilePicture: res.data.profilePicture || ''
            });
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const dataToUpdate = {
                name: formData.name,
                bio: formData.bio,
                location: formData.location,
                hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : 0,
                skills: formData.skills
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0)
            };

            const res = await api.put('/trainers/profile', dataToUpdate);
            setProfile(res.data);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl as string);
            setIsCropOpen(true);
        }
    };

    const readFile = (file: File): Promise<string | ArrayBuffer | null> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result), false);
            reader.readAsDataURL(file);
        });
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const showCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            setUploading(true);

            // getCroppedImg typically returns Blob | null
            const croppedImageBlob: Blob | null = await getCroppedImg(imageSrc, croppedAreaPixels);

            if (!croppedImageBlob) {
                alert('Failed to crop image. Please try again.');
                return;
            }

            // Upload to backend
            const uploadFormData = new FormData();
            uploadFormData.append('file', croppedImageBlob, 'profile.jpg');

            const res = await api.post('/uploads/image', uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newUrl = res.data.secure_url;

            // Update local state
            setProfile((prev: any) => ({ ...prev, profilePicture: newUrl }));
            setFormData((prev: any) => ({ ...prev, profilePicture: newUrl }));

            // Persist to trainer profile
            await api.put('/trainers/profile', { profilePicture: newUrl });

            // Close cropper
            setIsCropOpen(false);
            setImageSrc(null);
            setCrop({ x: 0, y: 0 });
            setZoom(1);

            alert('Profile picture updated successfully!');
        } catch (e) {
            console.error('Upload failed:', e);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
                {/* Header Section */}
                <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white pb-24 pt-10 px-6 shadow-xl">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                    <div className="container mx-auto relative z-10">
                        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                        <p className="text-indigo-100">Showcase your expertise to potential clients</p>
                    </div>
                </div>

                <main className="container mx-auto px-6 -mt-20 relative z-20 pb-10">
                    {loading && !profile ? (
                        <div className="flex min-h-[400px] items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Left Column: Avatar & Stats */}
                            <Card className="md:col-span-1 border border-border shadow-lg bg-white">
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <div
                                        className="relative mb-4 group cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Avatar className="w-32 h-32 border-4 border-card shadow-xl">
                                            <AvatarImage
                                                src={
                                                    profile?.profilePicture ||
                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'T')}&background=random`
                                                }
                                            />
                                            <AvatarFallback>{profile?.name?.charAt(0) || 'T'}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload className="text-white w-8 h-8" />
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            className="hidden"
                                            onChange={onFileChange}
                                        />
                                    </div>

                                    <h2 className="text-xl font-bold text-foreground">{profile?.name || 'Trainer'}</h2>
                                    <p className="text-muted-foreground mb-4">{profile?.email}</p>

                                    <div className="flex items-center gap-1 mb-6 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-600" />
                                        <span className="font-bold text-yellow-600">4.9/5.0</span>
                                    </div>

                                    <div className="w-full grid grid-cols-2 gap-4 text-left p-4 bg-muted/50 rounded-xl">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase">Hourly Rate</p>
                                            <p className="font-semibold text-foreground">${profile?.hourlyRate || 0}/hr</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase">Experience</p>
                                            <p className="font-semibold text-foreground">N/A</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Right Column: Edit Form */}
                            <Card className="md:col-span-2 border border-border shadow-lg bg-white text-foreground">
                                <CardHeader>
                                    <CardTitle>Profile Details</CardTitle>
                                    <CardDescription>Update your personal information and skills</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                placeholder="City, State"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Professional Bio</Label>
                                        <Textarea
                                            id="bio"
                                            placeholder="Tell us about yourself..."
                                            className="min-h-32 resize-none"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                                        <Input
                                            id="hourlyRate"
                                            type="number"
                                            min="0"
                                            step="5"
                                            value={formData.hourlyRate}
                                            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Skills</Label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {profile?.skills?.map((skill: string) => (
                                                <Badge key={skill} variant="secondary" className="px-3 py-1">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                        <Input
                                            placeholder="e.g. React, Node.js, TypeScript (comma separated)"
                                            value={formData.skills}
                                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700"
                                            onClick={handleUpdate}
                                            disabled={loading}
                                        >
                                            {loading && <Spinner size="sm" className="mr-2" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </main>
            </div>

            {/* Crop Dialog */}
            <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Crop Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                            />
                        )}
                    </div>
                    <div className="py-4">
                        <Label htmlFor="zoom">Zoom</Label>
                        <input
                            id="zoom"
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCropOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={showCroppedImage} disabled={uploading}>
                            {uploading && <Spinner size="sm" className="mr-2" />}
                            {uploading ? 'Uploading...' : 'Save Photo'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}