import {
  useFetchMessages,
  useGetUserById,
  useSendMessage,
} from "@/lib/react-query/queriesandmutations";

import { useParams } from "react-router-dom";
import Loader from "./shared/Loader";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { IMessage } from "@/types";
import socket from "@/lib/server/socket";

const Messages = () => {
  const { id: selectedUser } = useParams();
  const { user, isLoading } = useUserContext();
  const { data: reciever, isPending } = useGetUserById(selectedUser || "");
  const [newMessage, setNewMessage] = useState("");
  const currentUser = !isLoading ? user.id : "";
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { data: fetched, isPending: isFetching } = useFetchMessages(
    currentUser,
    selectedUser || ""
  );
  const { mutate: sendMessage } = useSendMessage();
  console.log("current", currentUser);
  console.log("selected", selectedUser);
  const handleSendMessage = () => {
    const message = {
      body: newMessage,
      senderID: currentUser,
      receiverID: selectedUser || "",
    };
    sendMessage(message);
    socket.emit('sendMessage', message);
    setNewMessage("");
  };

  console.log("f  ", fetched);



  useEffect(() => {
    if (fetched) {
      setMessages(fetched.documents);
    }
  }, [fetched]);

  useEffect(() => {
    socket.on('message', (message: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);



  return (
    <div className="message-container">
      {!isPending && !isFetching ? (
        <div className="w-full h-full flex flex-col">
          {/* top bar  */}
          <div className="chats_topbar">
            <img
              src={reciever?.imageURL}
              alt="profile"
              className="rounded-full h-16"
            />
            <h3 className="h3-bold lg:h2-bold md:h2-bold">
              {reciever?.username}
            </h3>
          </div>

          <div className="h-full p-14 flex flex-col justify-between">
            <div className="">
              {messages
                .slice()
                .reverse()
                .map((message: any) => (
                  <div
                    key={message.$id}
                    className={`flex flex-col ${
                      message.senderID === user.id ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={
                        message.senderID === user.id
                          ? "message-sent"
                          : "message-received"
                      }
                    >
                      <p>{message.body}</p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex gap-4 bottom-4">
              <Input
                type="text"
                className="shad-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <Button
                onClick={handleSendMessage}
                className="shad-button_primary"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Messages;
