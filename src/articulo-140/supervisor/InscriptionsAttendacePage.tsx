import { CustomImput } from "@/components/custom/CustomImput"
import { CustomMainCard } from "@/components/custom/CustomMainCard"
import { Button } from "@/components/ui/button"
import { CardHeader } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import { TableIncriptionsActivty } from "./components/TableIncriptionsActivty"
import { CustomFooterInscription } from "./components/CustomFooterInscription"

export const InscriptionsAttendacePage = () => {
  return (
    <>
    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full">
           <Link to = '/activities'>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-teal-600 hover:bg-teal-50"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Regresar
            </Button>
            </Link>
            <CustomImput />
          </div>
        </CardHeader>
    <CustomMainCard Contentd={<TableIncriptionsActivty />} CustomFooter={<CustomFooterInscription/>}/>
   </>
  )
}
