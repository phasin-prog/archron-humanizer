"use client";
import { useState } from "react";
import { Input, Textarea, Switch, Checkbox, Button, Label, Card, CardContent, CardHeader, CardTitle, Divider, Avatar, AvatarFallback } from "@archron/ui";
const DOMAINS = [
    "Psychology",
    "Philosophy",
    "Anthropology",
    "History",
    "Linguistics",
    "Mythology",
    "Religion",
    "Science",
    "Symbolism",
    "Art",
    "AI",
    "Civilization",
];
const EMAIL_PREFS = [
    { id: "review-requests", label: "Review requests" },
    { id: "content-published", label: "Content published notifications" },
    { id: "mentions", label: "Mentions and comments" },
    { id: "achievements", label: "Achievement notifications" },
    { id: "newsletter", label: "Monthly newsletter" },
];
export default function SettingsPage() {
    const [displayName, setDisplayName] = useState("Somchai Rattanapong");
    const [bio, setBio] = useState("Exploring the intersections of analytical psychology and Eastern philosophy.");
    const [expertise, setExpertise] = useState(["Psychology", "Philosophy", "Religion"]);
    const [isPublic, setIsPublic] = useState(true);
    const [emailPrefs, setEmailPrefs] = useState(["review-requests", "mentions"]);
    const [saved, setSaved] = useState(false);
    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };
    const toggleExpertise = (domain) => {
        setExpertise((prev) => prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]);
    };
    const toggleEmailPref = (id) => {
        setEmailPrefs((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
    };
    return (<div className="mx-auto max-w-container-page px-6 pb-24 pt-10">
      <div className="mb-8">
        <h1 className="font-serif text-display font-bold text-text">Settings</h1>
        <p className="mt-1 text-body text-text-muted">Manage your profile, privacy, and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-section font-semibold">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar size="lg" className="h-20 w-20">
                  <AvatarFallback className="bg-primary/15 text-primary text-xl font-semibold">
                    SR
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-label font-medium text-text">Avatar</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload Photo
                  </Button>
                  <p className="mt-1 text-caption text-text-disabled">
                    JPG or PNG. 2MB max.
                  </p>
                </div>
              </div>

              <Divider />

              {/* Display Name */}
              <div>
                <Label htmlFor="display-name">Display Name</Label>
                <Input id="display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1.5"/>
              </div>

              {/* Bio */}
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="bio">Bio</Label>
                  <span className={`text-caption ${bio.length > 280 ? "text-destructive" : "text-text-muted"}`}>
                    {bio.length}/280
                  </span>
                </div>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={280} className="mt-1.5" rows={3}/>
              </div>

              {/* Expertise Tags */}
              <div>
                <Label>Expertise</Label>
                <p className="mt-0.5 text-caption text-text-muted">
                  Select domains you contribute to
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {DOMAINS.map((domain) => (<Checkbox key={domain} id={`expertise-${domain}`} label={domain} checked={expertise.includes(domain)} onChange={() => toggleExpertise(domain)}/>))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-section font-semibold">Email Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {EMAIL_PREFS.map((pref) => (<Checkbox key={pref.id} id={`email-${pref.id}`} label={pref.label} checked={emailPrefs.includes(pref.id)} onChange={() => toggleEmailPref(pref.id)}/>))}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-card-title font-semibold">Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label font-medium text-text">Public Profile</p>
                  <p className="text-caption text-text-muted">
                    {isPublic ? "Visible to everyone" : "Hidden from public view"}
                  </p>
                </div>
                <Switch label="" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}/>
              </div>
            </CardContent>
          </Card>

          {/* Save */}
          <Button onClick={handleSave} className="w-full">
            {saved ? "Saved" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>);
}
