
import { SidebarProvider, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Code, Settings} from "lucide-react"

const sections = [
  {
    id: "general",
    title: "General",
    icon: Settings,
    group: "Access",
  },
]


export const CustomContendAdActivities = () => {

  const groupedSections = sections.reduce(
    (acc, section) => {
      if (!acc[section.group]) {
        acc[section.group] = []
      }
      acc[section.group].push(section)
      return acc
    },
    {} as Record<string, typeof sections>,
  )



    return (
    <div className="min-h-screen bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full">
          <div className="w-80 p-6">
            <Card className="h-[calc(100vh-3rem)]">
              <div className="flex h-full">
                <div className="w-full border-r-0">
                  <div className="bg-sidebar text-sidebar-foreground flex h-full w-full flex-col rounded-l-xl">

                    <SidebarContent className="flex-1 overflow-auto">
                      {Object.entries(groupedSections).map(([groupName, groupSections]) => (
                        <SidebarGroup key={groupName}>
                          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {groupName}
                          </SidebarGroupLabel>
                          <SidebarGroupContent>
                            <SidebarMenu>
                              {groupSections.map((section) => {
                                const Icon = section.icon
                                return (
                                  <SidebarMenuItem key={section.id}>
                                    <SidebarMenuButton className="w-full justify-start">
                                      <Icon className="h-4 w-4" />
                                      <span>{section.title}</span>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                )
                              })}
                            </SidebarMenu>
                          </SidebarGroupContent>
                        </SidebarGroup>
                      ))}
                    </SidebarContent>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex-1 p-6 pl-0">
            <Card className="h-[calc(100vh-3rem)]">
              <div className="h-full overflow-auto">
                <div className="p-8 space-y-12">
                  {/* General Section */}
                  <section className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">General</h1>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="repo-name">Repository name</Label>
                        <div className="flex gap-2">
                          <Input id="repo-name" defaultValue="frontend-articulo140" className="max-w-md" />
                          <Button variant="outline">Rename</Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="template-repo" />
                          <div>
                            <Label htmlFor="template-repo" className="font-medium">
                              Template repository
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Template repositories let users generate new repositories with the same directory
                              structure and files.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch id="require-signoff" />
                          <div>
                            <Label htmlFor="require-signoff" className="font-medium">
                              Require contributors to sign off on web-based commits
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Enabling this setting will require contributors to sign off on commits made through
                              GitHub's web interface.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Default branch</h3>
                      <p className="text-sm text-muted-foreground">
                        The default branch is considered the "base" branch in your repository, against which all pull
                        requests and code commits are automatically made.
                      </p>
                      <div className="flex gap-2 items-center">
                        <Input defaultValue="main" className="max-w-xs" />
                        <Button variant="outline" size="icon">
                          <Code className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </section>

                </div>
              </div>
            </Card>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
