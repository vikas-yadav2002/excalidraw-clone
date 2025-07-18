"use server"

import { RoomCanvas } from "../../../components/RoomCanvas";


export default async function CanvasPage({
  params ,
}: {
  params: {
    room : string
  };
}){const slug = (await params).room;
   return(
   <RoomCanvas roomSlug={slug}/>
   )
}