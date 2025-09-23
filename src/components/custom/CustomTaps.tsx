import { TabsContent } from "@radix-ui/react-tabs"
import { CardContent } from "../ui/card"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { CustomContendAdActivities } from "@/articulo-140/pages/homePages/activities/components/custom/CustomContendAdActivities"


export const CustomTaps = () => {
  return (
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex justify-center-safe w-full">
              <TabsList className="grid grid-cols-2 max-w-md w-auto">
              <TabsTrigger value="overview">Detalles</TabsTrigger>
              <TabsTrigger value="analytics">Configuracion</TabsTrigger>
            </TabsList>
            </div>
            <TabsContent value="overview" className="mt-4">
              <div className="p-4 bg-muted rounded-lg">
              {/* <CustomContendAdActivities/> */}
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="mt-4">
              <div className="p-4 bg-muted rounded-lg">
                {/* <CustomContendAdActivities/> */}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
  )
}
