import CallNotification from "@/components/callNotification";
import ListOnlineUsers from "@/components/listOnlineUsers";
import VideoCall from "@/components/videoCall";

export default function Home() {
  return (
    <div >
      <ListOnlineUsers/>
      <CallNotification />
      <VideoCall />
    </div>
  );
}
