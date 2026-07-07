"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Select, Switch, Button } from "@archron/ui";
const roleOptions = [
    { value: "0", label: "0 — No minimum" },
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
    { value: "250", label: "250" },
    { value: "500", label: "500" },
];
export default function ConfigurationPage() {
    const [form, setForm] = useState({
        siteName: "ARCHRON",
        siteDescription: "A human knowledge platform",
        maintenanceMode: false,
        maxDrafts: 10,
        autoArchiveDays: 90,
        reviewDeadline: 7,
        minWriterReputation: "10",
        minReviewerReputation: "50",
        minEditorReputation: "100",
        emailTemplate: "notification",
        webhookUrl: "",
    });
    const [savedMessages, setSavedMessages] = useState({});
    const update = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };
    const handleSave = (section) => {
        setSavedMessages((prev) => ({ ...prev, [section]: "Saved successfully" }));
        setTimeout(() => {
            setSavedMessages((prev) => {
                const next = { ...prev };
                delete next[section];
                return next;
            });
        }, 2000);
    };
    return (<div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-page-title font-serif font-bold">Configuration</h1>
        <p className="text-muted-foreground text-body">Manage system-wide settings and policies</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Basic site information and operational mode</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Site Name</label>
            <Input value={form.siteName} onChange={(e) => update("siteName", e.target.value)} placeholder="ARCHRON"/>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Site Description</label>
            <Input value={form.siteDescription} onChange={(e) => update("siteDescription", e.target.value)} placeholder="A human knowledge platform"/>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <span className="text-sm font-medium">Maintenance Mode</span>
              <p className="text-xs text-muted-foreground">Disables public access and shows a maintenance page</p>
            </div>
            <Switch checked={form.maintenanceMode} onChange={(e) => update("maintenanceMode", e.target.checked)} label=""/>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => handleSave("general")}>Save</Button>
            {savedMessages.general && (<span className="text-sm text-green-600">{savedMessages.general}</span>)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Limits and automatic lifecycle policies for content objects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Max Drafts per Writer</label>
            <Input type="number" min={1} max={100} value={String(form.maxDrafts)} onChange={(e) => update("maxDrafts", Number(e.target.value))}/>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Auto-Archive After (days)</label>
            <Input type="number" min={0} max={365} value={String(form.autoArchiveDays)} onChange={(e) => update("autoArchiveDays", Number(e.target.value))}/>
            <p className="mt-1 text-xs text-muted-foreground">Set to 0 to disable auto-archiving</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Review Deadline (days)</label>
            <Input type="number" min={1} max={60} value={String(form.reviewDeadline)} onChange={(e) => update("reviewDeadline", Number(e.target.value))}/>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => handleSave("content")}>Save</Button>
            {savedMessages.content && (<span className="text-sm text-green-600">{savedMessages.content}</span>)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Requirements</CardTitle>
          <CardDescription>Minimum reputation thresholds for role progression</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Minimum Reputation — Writer</label>
            <Select options={roleOptions} value={form.minWriterReputation} onChange={(e) => update("minWriterReputation", e.target.value)}/>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Minimum Reputation — Reviewer</label>
            <Select options={roleOptions} value={form.minReviewerReputation} onChange={(e) => update("minReviewerReputation", e.target.value)}/>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Minimum Reputation — Editor</label>
            <Select options={roleOptions} value={form.minEditorReputation} onChange={(e) => update("minEditorReputation", e.target.value)}/>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => handleSave("roles")}>Save</Button>
            {savedMessages.roles && (<span className="text-sm text-green-600">{savedMessages.roles}</span>)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Email templates and external integration webhooks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email Template</label>
            <Select options={[
            { value: "notification", label: "Default Notification" },
            { value: "review-request", label: "Review Request" },
            { value: "role-change", label: "Role Change" },
            { value: "welcome", label: "Welcome" },
        ]} value={form.emailTemplate} onChange={(e) => update("emailTemplate", e.target.value)}/>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Webhook URL</label>
            <Input type="url" value={form.webhookUrl} onChange={(e) => update("webhookUrl", e.target.value)} placeholder="https://hooks.example.com/archron"/>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => handleSave("notifications")}>Save</Button>
            {savedMessages.notifications && (<span className="text-sm text-green-600">{savedMessages.notifications}</span>)}
          </div>
        </CardContent>
      </Card>
    </div>);
}
