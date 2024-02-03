import { Box, FormControl, IconButton, Input, InputGroup, InputRightElement, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { getSender,getSenderFull } from './config/ChatLogics'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProfileModal from './miscellaneous/Modals/profileModal'
import UpdateGroupChatModal from './miscellaneous/Modals/UpdateGroupChatModal'
import axios from 'axios'
import './styles.css'
import ScrollableChat from './miscellaneous/ScrollableChat'

const ENDPOINT = "http://localhost:5000";
var socket,selectedChatCompare;
const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const { user, selectedChat , setSelectedChat } = ChatState();
    const [loading ,setLoading] = useState(false);
    const [messages , setMessages] = useState([]);
    const [newMessage , setNewmessage] = useState("");

    const toast = useToast();
    const fetchMessages = async()=>{
      if(!selectedChat){
        return;
      }

      try{
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }

        setLoading(true);

        const { data } = await axios.get(`/api/message/${selectedChat._id}`,config);

        setMessages(data);
        setLoading(false);
      }catch(error){
        toast({
          title: "Error Occured",
          description: "cant load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: 'bottom-left'
        })
      }
    }

    useEffect(()=>{
      fetchMessages();
    },[selectedChat]);

    const sendMessage = async() => {
      if(!newMessage.trimStart()){
        return;
      }
      try{
        const config = {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${user.token}`
          }
        }
        setNewmessage("");
        const {data} = await axios.post(
          `/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        )

        setMessages([...messages,data]);
      }catch(error){

      }
    }

    const typingHandler = (e) => {
      setNewmessage(e.target.value);
    }
  return (
    <>
      {selectedChat ? (
      <>
         <Text
           display="flex"
           fontSize={{base: "28px", md: "30px"}}
           fontFamily="Work sans    "
           pb={3}
           px={2}   
           w="100%"
           justifyContent={{base: "space-between"}}
           alignItems="center"
         >
            <IconButton
              display={{base: "flex" , md: "none"}}
              icon = {<ArrowBackIcon/>}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
            <>
              {getSender(user,selectedChat.users)}
              <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
            </>) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal 
                     fetchAgain={fetchAgain}
                     setFetchAgain={setFetchAgain}
                     fetchMessages={fetchMessages}
                  />
                </>
            )}
         </Text>
         <Box
           display="flex"
           flexDir="column"
           justifyContent="flex-end"
           p={3}
           bg="#E8E8E8"
           w="100%"
           h="100%"
           borderRadius="lg"
           overflowY="hidden"
         >
          {(loading)?
            (<Spinner 
              w={20}
              h={20}
              margin='auto'
              alignSelf='center'
              />):
              (<div className='messages'>
                <ScrollableChat messages = {messages}/>
              </div>)}

          <FormControl onKeyDown={(e)=>{
            if(e.key === "Enter")  sendMessage();
          }}>
            <InputGroup>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
              <InputRightElement width='4.5rem'>
                 <ChevronRightIcon cursor='pointer' onClick={sendMessage}/>
              </InputRightElement>
              </InputGroup>
          </FormControl>
         </Box>
      </>) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize='3xl' pb={3} fontFamily="Work sans">
                Click on a user to start Chatting
            </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat