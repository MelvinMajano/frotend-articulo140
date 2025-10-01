import { Separator } from "@/components/ui/separator"
import { Label } from "@radix-ui/react-label"


export const StudentsAdActivities = () => {
  return (
    <section className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">Estudiantes</h1>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="repo-name"></Label>
                        <div className="flex gap-2">
                          {/* <Input id="repo-name" defaultValue="frontend-articulo140" className="max-w-md" /> */}
                          {/* <Button variant="outline">Rename</Button> */}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          {/* <Switch id="template-repo" /> */}
                          <div>
                            <Label htmlFor="template-repo" className="font-medium">
                             
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* <Switch id="require-signoff" /> */}
                          <div>
                            <Label htmlFor="require-signoff" className="font-medium">
                             
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold"></h3>
                      <p className="text-sm text-muted-foreground">
                        
                      </p>
                      <div className="flex gap-2 items-center">
                        {/* <Input defaultValue="main" className="max-w-xs" /> */}
                        {/* <Button variant="outline" size="icon">
                          <Code className="h-4 w-4" />
                        </Button> */}
                      </div>
                    </div>
                  </section>
  )
}
