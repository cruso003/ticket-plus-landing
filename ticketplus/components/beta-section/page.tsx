"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronRight } from 'lucide-react';

type Role = 'attendee' | 'organizer';
type Step = 'signup' | 'download' | 'feedback' | 'complete';

const downloadLinks: Record<Role, string> = {
  attendee: 'https://expo.dev/artifacts/eas/qsfLh6ou4DRPJ3fiGQ5exj.apk',
  organizer: 'https://expo.dev/accounts/truthserum/projects/ticket-plus-organizers-client/builds/97179bd0-4e55-4bef-86e6-1bcc9f251c4f'
};

export const BetaProgramSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role | ''>('');
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<Step>('signup');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    if (!role) newErrors.role = 'Please select a role';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep('download');
    }
  };

  const handleDownload = () => {
    if (role && role in downloadLinks) {
      window.open(downloadLinks[role], '_blank');
      setCurrentStep('feedback');
    }
  };

  const handleFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (feedback.trim()) {
      // Here you would typically send the feedback to your server
      console.log('Feedback submitted:', feedback);
      setCurrentStep('complete');
    } else {
      setErrors({ feedback: 'Please provide some feedback' });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'signup':
        return (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <div className="flex-1">
                <Label htmlFor="name" className="sr-only">Name</Label>
                <Input 
                  id="name"
                  type="text" 
                  placeholder="Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "bg-white/20 border-none text-white placeholder:text-gray-300",
                    errors.name && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 text-left">{errors.name}</p>}
              </div>
              <div className="flex-1">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "bg-white/20 border-none text-white placeholder:text-gray-300",
                    errors.email && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1 text-left">{errors.email}</p>}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-start">
              <div className="flex-1">
                <Label htmlFor="role-select" className="sr-only">Select Role</Label>
                <Select value={role} onValueChange={(value: Role) => setRole(value)}>
                  <SelectTrigger className={cn(
                    "bg-white/20 border-none text-white",
                    errors.role && "border-red-500 focus-visible:ring-red-500"
                  )}>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attendee">Attendee</SelectItem>
                    <SelectItem value="organizer">Organizer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500 text-sm mt-1 text-left">{errors.role}</p>}
              </div>
              <div className="flex-1">
                <Button type="submit" size="lg" className="w-full bg-white text-purple-800 hover:bg-gray-100">
                  Sign Up for Beta <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        );
      case 'download':
        return (
          <div className="text-center">
            <p className="mb-4">Great! You&lsquo;re signed up for the beta program. Click the button below to download the app:</p>
            <Button onClick={handleDownload} size="lg" className="bg-white text-purple-800 hover:bg-gray-100">
              Download Beta App <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case 'feedback':
        return (
          <form onSubmit={handleFeedback} className="space-y-4">
            <Label htmlFor="feedback" className="text-left block">We&lsquo;d love to hear your thoughts:</Label>
            <Textarea
              id="feedback"
              placeholder="Share your experience with the beta app..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className={cn(
                "bg-white/20 border-none text-white placeholder:text-gray-300",
                errors.feedback && "border-red-500 focus-visible:ring-red-500"
              )}
              rows={5}
            />
            {errors.feedback && <p className="text-red-500 text-sm mt-1 text-left">{errors.feedback}</p>}
            <Button type="submit" size="lg" className="w-full bg-white text-purple-800 hover:bg-gray-100">
              Submit Feedback <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        );
      case 'complete':
        return (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
            <p>Your feedback has been submitted successfully. We appreciate your participation in our beta program.</p>
          </div>
        );
    }
  };

  return (
    <section id='beta-program' className="py-20 px-4 bg-gradient-to-r from-purple-800 to-pink-800 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">Be Part of the Future of Event Ticketing</h2>
        <p className="text-xl mb-8">
          Join our beta program, test our app, and help shape the future of Tick8 Plus. Your feedback is invaluable!
        </p>
        {renderStep()}
      </div>
    </section>
  );
};
