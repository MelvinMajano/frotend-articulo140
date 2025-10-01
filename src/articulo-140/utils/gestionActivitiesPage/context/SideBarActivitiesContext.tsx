import type { PropsWithChildren } from "react"
import { createContext} from "react"
import { useSearchParams } from "react-router";

export type item = 'General' | 'Students' | 'controlZona';

interface SideBarActivitiesContext{
   //props
   itemsSelected:item | string | null;

   //methods
   onSelection: (value:item)=>void;
};




export const SideBarActivitiesContext = createContext({} as SideBarActivitiesContext)

export const SideBarActivitiesProvider = ({children}:PropsWithChildren) => {
    const [searchParams, setSerchParams] = useSearchParams();
    
    const handleSelectionItem =(value:item)=>{ 
        setSerchParams((prev)=>{
            prev.set('seccionDetails',value);
            return prev
        })
    }

    const selectSeccion = searchParams.get("seccionDetails");
    
    return (
    <SideBarActivitiesContext
    value={{
        itemsSelected:selectSeccion,
        onSelection: handleSelectionItem,
    }}
    >
        {children}
    </SideBarActivitiesContext>
  )
}
