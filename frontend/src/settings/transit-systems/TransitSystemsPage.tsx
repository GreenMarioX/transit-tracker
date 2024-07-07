import { Separator } from "@/components/ui/separator"
import { DisplayForm } from "./TransitSystemsForm"

export default function SettingsDisplayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Transit Systems</h3>
        <p className="text-sm text-muted-foreground">
          Choose the transit systems you want on the sidebar.
        </p>
      </div>
      <Separator />
      <DisplayForm />
    </div>
  )
}