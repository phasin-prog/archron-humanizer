import { Tabs, TabsList, TabsTrigger, TabsContent } from "@archron/ui";
import { CollectionsTab } from "@/components/studio/workspace/collections-tab";
import { DraftsTab } from "@/components/studio/workspace/drafts-tab";
function AssetsTab() {
    return (<div className="rounded-xl border p-8 text-center text-muted-foreground">
      <p>Assets management coming soon.</p>
    </div>);
}
function ReferencesTab() {
    return (<div className="rounded-xl border p-8 text-center text-muted-foreground">
      <p>References management coming soon.</p>
    </div>);
}
export default function WorkspacePage() {
    return (<div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Workspace</h1>
      <Tabs defaultValue="drafts">
        <TabsList>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="references">References</TabsTrigger>
        </TabsList>
        <TabsContent value="collections">
          <CollectionsTab />
        </TabsContent>
        <TabsContent value="drafts">
          <DraftsTab />
        </TabsContent>
        <TabsContent value="assets">
          <AssetsTab />
        </TabsContent>
        <TabsContent value="references">
          <ReferencesTab />
        </TabsContent>
      </Tabs>
    </div>);
}
