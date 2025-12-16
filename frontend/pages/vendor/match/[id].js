import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
  Search,
  Filter,
  SortAsc,
  MapPin,
  DollarSign,
  Star,
  Calendar,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MatchPage({ matchId }) {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [filterBy, setFilterBy] = useState('all');
  const router = useRouter();

  useEffect(() => {
    // In a real app, this would fetch from the API
    const mockMatches = [
      {
        id: '1',
        trainer: {
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@example.com',
          skills: ['Machine Learning', 'Python', 'Data Science', 'AI Research'],
          tags: ['ai', 'machine-learning', 'python', 'research'],
          hourlyRate: 150,
          location: 'San Francisco, CA',
          rating: 4.9,
          experience: '12 years',
        },
        score: 0.92,
        explanation: 'High skill match with strong ratings and relevant experience in AI research.',
        availability: 'Immediate',
        lastActive: '2 hours ago'
      },
      {
        id: '2',
        trainer: {
          name: 'Michael Chen',
          email: 'michael.chen@example.com',
          skills: ['Deep Learning', 'TensorFlow', 'Neural Networks', 'Computer Vision'],
          tags: ['ai', 'deep-learning', 'tensorflow', 'computer-vision'],
          hourlyRate: 120,
          location: 'New York, NY',
          rating: 4.7,
          experience: '8 years',
        },
        score: 0.87,
        explanation: 'Excellent technical expertise in deep learning with strong portfolio.',
        availability: 'Next week',
        lastActive: '1 day ago'
      },
      {
        id: '3',
        trainer: {
          name: 'Emma Rodriguez',
          email: 'emma.rodriguez@example.com',
          skills: ['AI Ethics', 'Responsible AI', 'Policy', 'Governance'],
          tags: ['ai', 'ethics', 'policy', 'governance'],
          hourlyRate: 100,
          location: 'Austin, TX',
          rating: 4.8,
          experience: '10 years',
        },
        score: 0.78,
        explanation: 'Specialized knowledge in AI ethics with excellent communication skills.',
        availability: 'In 2 weeks',
        lastActive: '3 days ago'
      },
      {
        id: '4',
        trainer: {
          name: 'David Kim',
          email: 'david.kim@example.com',
          skills: ['Natural Language Processing', 'BERT', 'Transformers', 'Chatbots'],
          tags: ['nlp', 'bert', 'transformers', 'chatbots'],
          hourlyRate: 140,
          location: 'Seattle, WA',
          rating: 4.6,
          experience: '9 years',
        },
        score: 0.85,
        explanation: 'Strong NLP specialist with proven track record in enterprise solutions.',
        availability: 'Next month',
        lastActive: '5 days ago'
      },
      {
        id: '5',
        trainer: {
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          skills: ['Reinforcement Learning', 'Robotics', 'Simulation', 'Control Systems'],
          tags: ['reinforcement-learning', 'robotics', 'simulation', 'control-systems'],
          hourlyRate: 160,
          location: 'Boston, MA',
          rating: 4.9,
          experience: '11 years',
        },
        score: 0.83,
        explanation: 'Top-tier reinforcement learning expert with academic and industry experience.',
        availability: 'Immediate',
        lastActive: '1 hour ago'
      }
    ];

    setMatches(mockMatches);
    setFilteredMatches(mockMatches);
    setLoading(false);
  }, [matchId]);

  useEffect(() => {
    let result = [...matches];

    if (searchTerm) {
      result = result.filter(match =>
        match.trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.trainer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        match.trainer.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterBy !== 'all') {
      result = result.filter(match =>
        match.trainer.tags.includes(filterBy)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'score') {
        return b.score - a.score;
      } else if (sortBy === 'rating') {
        return b.trainer.rating - a.trainer.rating;
      } else if (sortBy === 'rate') {
        return a.trainer.hourlyRate - b.trainer.hourlyRate;
      }
      return 0;
    });

    setFilteredMatches(result);
  }, [searchTerm, sortBy, filterBy, matches]);

  const getUniqueTags = () => {
    const allTags = matches.flatMap(match => match.trainer.tags);
    return [...new Set(allTags)];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <Spinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Head>
        <title>TrainerMatch - Match Results</title>
        <meta name="description" content="Trainer matches for your requirement" />
      </Head>

      <Sidebar />

      <main className="md:pl-64 pt-0 transition-all duration-300 min-h-screen">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white pb-24 pt-10 px-6 shadow-xl">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
          <div className="container mx-auto relative z-10">
            <Button
              variant="ghost"
              className="text-blue-100 hover:text-white hover:bg-white/10 mb-4 pl-0"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Matches
            </Button>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Trainer Matches</h1>
                <p className="text-blue-100 flex items-center gap-2">
                  <span className="opacity-75">Requirement ID:</span>
                  <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-sm">{matchId}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 -mt-16 relative z-20 pb-10">
          {/* Filters Card */}
          <Card className="border-none shadow-lg shadow-blue-900/5 mb-8">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search trainers, skills, or tags..."
                    className="pl-10 bg-slate-50 border-slate-200 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-48">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <select
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none text-slate-700"
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      {getUniqueTags().map(tag => (
                        <option key={tag} value={tag}>{tag.replace('-', ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative w-full sm:w-48">
                    <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <select
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none text-slate-700"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="score">Sort by Match Score</option>
                      <option value="rating">Sort by Rating</option>
                      <option value="rate">Sort by Hourly Rate</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <>
            <div className="mb-4 flex justify-between items-center px-1">
              <p className="text-slate-500 font-medium">
                Showing <span className="text-slate-800 font-bold">{filteredMatches.length}</span> of {matches.length} trainers
              </p>
            </div>

            {filteredMatches.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No matches found</h3>
                <p className="text-slate-500 mb-6">Your filters didn't return any trainers.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterBy('all');
                  }}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredMatches.map((match) => (
                  <Card key={match.id} className="border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col h-full">
                    <CardHeader className="bg-white border-b border-slate-50 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
                            <span className="font-bold text-xl">{match.trainer.name.charAt(0)}</span>
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{match.trainer.name}</CardTitle>
                            <CardDescription className="text-sm text-slate-500 truncate max-w-[150px]">{match.trainer.email}</CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="secondary" className="flex items-center gap-1 bg-amber-50 text-amber-600 border-amber-100">
                            <Star className="h-3 w-3 fill-current" />
                            {match.trainer.rating}
                          </Badge>
                          <div className="text-xs text-slate-400 text-right">{match.lastActive}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 flex-1">
                      <div className="space-y-5">
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                              Match Score
                            </div>
                            <span className="text-sm font-bold text-blue-600">
                              {(match.score * 100).toFixed(0)}%
                            </span>
                          </div>

                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${match.score * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                            {match.explanation}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {match.trainer.skills.slice(0, 4).map((skill, index) => (
                              <Badge key={index} variant="outline" className="bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-default">
                                {skill}
                              </Badge>
                            ))}
                            {match.trainer.skills.length > 4 && (
                              <Badge variant="outline" className="bg-slate-50 text-slate-400 border-dashed border-slate-300">
                                +{match.trainer.skills.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><DollarSign className="h-4 w-4" /></div>
                            <div>
                              <p className="text-xs text-slate-400">Rate</p>
                              <p className="font-bold text-slate-700 text-sm">${match.trainer.hourlyRate}/hr</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><MapPin className="h-4 w-4" /></div>
                            <div>
                              <p className="text-xs text-slate-400">Location</p>
                              <p className="font-bold text-slate-700 text-sm truncate max-w-[80px]">{match.trainer.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-50 text-orange-600"><Award className="h-4 w-4" /></div>
                            <div>
                              <p className="text-xs text-slate-400">Experience</p>
                              <p className="font-bold text-slate-700 text-sm">{match.trainer.experience}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-50 text-purple-600"><Calendar className="h-4 w-4" /></div>
                            <div>
                              <p className="text-xs text-slate-400">Availability</p>
                              <p className="font-bold text-slate-700 text-sm">{match.availability}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-3 pt-2 pb-6 px-6 bg-white mt-auto">
                      <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                        Contact
                      </Button>
                      <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50">
                        Profile
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        </div>
      </main>
    </div>
  );
}

// This function gets called at build time
export async function getServerSideProps({ params }) {
  // Pass the matchId to the page component
  return {
    props: {
      matchId: params.id,
    },
  };
}