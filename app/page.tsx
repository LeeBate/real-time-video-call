import CallNotification from "@/components/callNotification";
import ListOnlineUsers from "@/components/listOnlineUsers";

export default function Home() {
  return (
    <div >
      <ListOnlineUsers/>
      <CallNotification />
    </div>
  );
}
