import type { PropsWithChildren } from "react"
import { createContext, useState } from "react"

export type item = 'General' | 'Students' | 'controlZona';

interface SideBarActivitiesContext{
   //props
   itemsSelected:item | undefined;

   //methods
   onSelection: (value:item)=>void;
};




export const SideBarActivitiesContext = createContext({} as SideBarActivitiesContext)

export const SideBarActivitiesProvider = ({children}:PropsWithChildren) => {
    const [itemSelected, setitemSelected] = useState<item>('General')

    const handleSelectionItem =(value:item)=>{ 
        setitemSelected(value)
    }
    

    return (
    <SideBarActivitiesContext
    value={{
        itemsSelected:itemSelected,
        onSelection: handleSelectionItem,
    }}
    >
        {children}
    </SideBarActivitiesContext>
  )
}
