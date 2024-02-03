import { useDisclosure } from '@chakra-ui/hooks';
import { Badge, Button, FormControl, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../../context/chatProvider';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import { AddIcon } from '@chakra-ui/icons';

const GroupchatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search,setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchResults,setSearchResults] = useState([]);
    const [loading,setLoading] = useState();

    const toast = useToast();

    const {user} = ChatState();

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
    console.log(selectedUsers);
    console.log(searchResults);
    const addUser = (user) => {
         setSelectedUsers([...selectedUsers,user]);
         console.log(selectedUsers);
      // }
      // if(selectedUsers.includes(user)){
      //   toast({
      //     title: "Can't Add user",
      //     description: "User already selected or exists in Group",
      //     status: "success",
      //     duration: 5000,
      //     isClosable: true,
      //     position: "bottom-left",
      //   });
      //   return;
      // }
      // else{
      //   setSelectedUsers([...selectedUsers,user]);
      //   return;
      // }

    } 

    const deleteUser = (user) => {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    }

    const handleSubmit = () => {
      if(!selectedUsers){
        return;
      }
      try{
        const config = {
          header: {
            Authorization: `Bearer ${user.token}`,
            "Content-type": "application/json",
          }
        }


      }catch(err){

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
            <FormControl>
              <Input w="100%" m='3px' placeholder='Chat Name' onChange={(e)=>{setGroupChatName(e.target.value)}}/>
            </FormControl>
             <Input w="100%" m='3px' placeholder='Add Users. eg.sai,malhar' onChange={(e)=>setSearch(e.target.value)}/>
            
            <div display="flex">
              {loading ? (<Spinner/>) : (
                searchResults?.map((user) => (
                <Tag size='lg' key={user._id} variant='subtle' colorScheme='cyan' m='2px'>
                  
                  <TagLabel>{user.name}</TagLabel>
                  <TagRightIcon boxSize='12px' as={AddIcon} onClick={()=>addUser(user)}/>
                </Tag>
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