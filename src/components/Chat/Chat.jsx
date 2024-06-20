import React, { useRef, useState, useEffect } from "react";
import {
  auth,
  db,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  doc,
} from "../../firebase";
import { getDocs } from "@firebase/firestore";
import { where, onSnapshot } from "@firebase/firestore"; 
import {
  Box,
  Avatar,
  TextField,
  IconButton,
  Typography,
  styled,
  InputAdornment,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "./House.svg"; // Pieņemot, ka jūsu logo ir tajā pašā direktorijā

// Stila definīcijas ziņojumu burbuļiem
const StyledMessage = styled(Box)(({ theme, messageClass }) => ({
  maxWidth: "70%",
  padding: "12px 16px",
  borderRadius:
    messageClass === "sent"
      ? "16px 16px 0 16px"
      : "16px 16px 16px 0",
  backgroundColor: messageClass === "sent" ? "#2979FF" : "#E3F2FD",
  display: "flex",
  flexDirection: "column",
  alignItems: messageClass === "sent" ? "flex-end" : "flex-start",
  marginBottom: "12px",
  color: messageClass === "sent" ? "white" : "black",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  zIndex: 2,
  [theme.breakpoints.down("sm")]: {
    maxWidth: "85%",
  },
}));

// Stila definīcijas čata komponentam
const ChatContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "900px",
  maxHeight: "70vh",
  display: "flex",
  flexDirection: "column",
  border: "none",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
  zIndex: 1000,
  backgroundColor: '#F0F0F0', // Mainīts fons uz gaiši pelēku
  backgroundImage: `url(${Logo})`, // Pievienojiet jūsu mājas SVG 
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
  position: "relative",
  zIndex: 1,
  backgroundColor: '#333', // Tumši pelēks fons galvene
  borderRadius: "10px", 
  padding: "15px", // Pievienojiet nedaudz atstarpes galvene
}));

// Stila definīcijas ziņojuma ievadei
const MessageInput = styled(TextField)(({ theme }) => ({
  borderRadius: "24px",
  backgroundColor: "white",
  marginTop: "10px",
  "& fieldset": { border: "none" },
}));

const Chat = ({ ownerId, onClose }) => {
  const dummy = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState("");
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    const fetchChatId = async () => {
      const currentUserId = auth.currentUser.uid;
      const chatsRef = collection(db, "chats");
      const q = query(
        chatsRef,
        where(`participants.${currentUserId}`, "==", true),
        where(`participants.${ownerId}`, "==", true)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setChatId(querySnapshot.docs[0].id);
      } else {
        const newChatRef = await addDoc(chatsRef, {
          participants: {
            [currentUserId]: true,
            [ownerId]: true,
          },
        });
        setChatId(newChatRef.id);
      }
    };

    fetchChatId();
  }, [ownerId]);

  // Apvienojam divus useEffect vienā
  useEffect(() => {
    let unsubscribeFromSnapshot = null;

    const setupChat = async () => {
      if (chatId) {
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("createdAt"));
        unsubscribeFromSnapshot = onSnapshot(q, (snapshot) => {
          const fetchedMessages = [];
          snapshot.forEach((doc) => {
            fetchedMessages.push({ id: doc.id, ...doc.data() });
          });
          setMessages(fetchedMessages);
        });
      }
    };

    setupChat(); // Palaidiet (vai restartējiet) abonementu

    // Kad komponents tiek atmontēts
    return () => {
      if (unsubscribeFromSnapshot) {
        unsubscribeFromSnapshot(); // Atteikties no onSnapshot abonementa
      }
    };
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid } = auth.currentUser;

    if (chatId) {
      const newMessage = {
        text: formValue,
        createdAt: serverTimestamp(),
        senderId: uid,
      };

      try {
        await addDoc(collection(db, "chats", chatId, "messages"), newMessage);
      } catch (e) {
        console.error("Error adding message: ", e);
      }

      setFormValue("");
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "white",
            textShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Čats ar īpašnieku
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </ChatHeader>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "scroll",
          paddingBottom: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.9)", 
          borderRadius: "16px", 
          padding: "16px", 
          zIndex: 1,
        }}
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            currentUserId={auth.currentUser.uid}
          />
        ))}
        <span ref={dummy}></span>
        <div ref={messagesEndRef} />
      </Box>
      <form onSubmit={sendMessage} style={{ display: "flex" }}>
        <MessageInput
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          fullWidth
          placeholder="Ievadiet ziņojumu..."
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: "24px" }}
                >
                  <SendIcon />
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </ChatContainer>
  );
};

const ChatMessage = ({ message, currentUserId }) => {
  const { text, senderId } = message;
  const messageClass = senderId === currentUserId ? "sent" : "received";

  const [senderName, setSenderName] = useState(null);
  const [senderAvatar, setSenderAvatar] = useState(null);

  useEffect(() => {
    // Saņemt lietotāja dokumenta atsauci
    const userRef = doc(db, 'Users', senderId);
    const unsubscribe = onSnapshot(userRef, (userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setSenderName(userData.Name);
        setSenderAvatar(userData.Image && userData.Image.length > 0 ? userData.Image[0] : null);
      }
    });

    return () => unsubscribe(); // Atteikties no abonementa, kad komponents tiek atmontēts
  }, [senderId]);

  return (
    <Box
      key={message.id}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        marginBottom: "10px",
        justifyContent: messageClass === "sent" ? "flex-end" : "flex-start",
      }}
    >
      {messageClass === "received" && senderAvatar && (
        <Avatar src={senderAvatar} alt={senderName} sx={{ mr: 1 }} />
      )}
      <StyledMessage messageClass={messageClass}>
        {senderName && (
          <>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: 'white', borderBottom: '2px solid white', paddingBottom: '4px', marginBottom: '4px' }}>
              {senderName}
            </Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>{text}</Typography>
          </>
        )}
      </StyledMessage>
    </Box>
  );
};

export default Chat;