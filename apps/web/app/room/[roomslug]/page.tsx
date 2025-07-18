import { ChatRoom } from "../../../components/ChatRoom";
export default async function Room({
  params,
}: {
  params: Promise<{ roomslug: string }>;
}) {

    const roomSlug =  (await params).roomslug;
    // console.log(roomSlug);

   return(
    <ChatRoom roomSlug={roomSlug}/>
   )


}
