import { useDisclosure } from '@chakra-ui/hooks';
import { Badge, Button, FormControl, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../../context/chatProvider';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import { AddIcon } from '@chakra-ui/icons';
import UserListItem from '../../UserAvatar/UserListItem'
import UserBadgetItem from '../../UserAvatar/UserBadgetItem';

const GroupchatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search,setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchResults,setSearchResults] = useState([]);
    const [loading,setLoading] = useState();

    const toast = useToast();

    const {user,chats,setChats} = ChatState();

    const searchHandler = async() => {
      if(!search){
        return;
      }
      try{
        setLoading(true);
        setSearchResults([]);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }

        const { data } = await axios.get(`api/user/?search=${search}`,config);
        setSearchResults(data);
        setLoading(false);
      }catch(err){
        toast({
          title: "Error Occured!",
          description: "failed to Load Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        setLoading(false);
      }
    }

    useEffect(() => {
      searchHandler();
    },[search]);

    const addUser = (user) => {
      if(selectedUsers.includes(user)){
        toast({
          title: "Can't Add user",
          description: "User already selected or exists in Group",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        return;
      }
      setSelectedUsers([...selectedUsers,user]);
    }

    const removeUser = (user) => {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    }

    const handleSubmit = async() => {
      if(!groupChatName || selectedUsers.length<2){
        toast({
          title: "Please fill all the feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      try{
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        }

        const { data } = await axios.post("/api/chat/group",{
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },config);

        setChats([data,...chats]);
        onClose();
        toast({
          title: "New group Chat Created",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        setSelectedUsers([]);
        setSearchResults([]);
      }catch(err){
        toast({
          title: "Failed to create Chat",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        setSelectedUsers([]);
        setSearchResults([]);
      }
    }



  return (
    <div>
        <span onClick={onOpen}>{children}</span>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display='flex' justifyContent='space-around' fontSize='x-large'>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div display="flex">
              {selectedUsers.map((user) => (
                <UserBadgetItem key={user._id} user={user} handleFunction={()=>removeUser(user)} admin/>
              ))}
            </div>
            <FormControl>
              <Input w="100%" m='3px' placeholder='Chat Name' onChange={(e)=>{setGroupChatName(e.target.value)}}/>
            </FormControl>
             <Input w="100%" m='3px' placeholder='Add Users. eg.sai,malhar' onChange={(e)=>setSearch(e.target.value)}/>
            
            <div display="flex">
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => addUser(user)}
                  />
                ))
            )}
            </div>
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button> */}
            <Button colorScheme='teal' variant='outline' onClick={handleSubmit}>Create Group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default GroupchatModal;