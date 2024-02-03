import {Drawer,DrawerBody,DrawerCloseButton,DrawerContent,DrawerHeader,DrawerOverlay, Input, Spinner, useToast} from '@chakra-ui/react';
import { Avatar, Box, Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure } from '@chakra-ui/react';

import React, { useState } from 'react';
import {BellIcon, ChevronDownIcon, SearchIcon} from '@chakra-ui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChatState } from '../../context/chatProvider';
import ProfileModal from './Modals/profileModal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';


const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat , setLoadingChat] = useState();
    const {user,setSelectedChat,chats,setChats} = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const history = useHistory();

    const toast = useToast();

    const accessChat = async(userId) => {
      try{
        setLoadingChat(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-type": "application/json",
          }
        }

        const { data } = await axios.post(
          "api/chat",{ userId },config
        )

        if(!chats.find((c)=> c._id === data._id)) setChats([data,...chats]);
        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
      }catch(err){
        toast({
          title: "Error Occured",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: 'bottom-left'
        })
      }
    }

    const searchHandler = async() => {
      setLoading(true);
      if(!search){
        toast({
          title: "please enter something in search",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: 'top-left'
        })
        setLoading(false);
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(
          `/api/user/?search=${search}`,
          config
        );

        setSearchResult(data);
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
      }
    }

    const logoutHandler = async() => {
      await localStorage.removeItem("userInfo");
      history.push('/');
    }
  return (
    <>
    <Box
     display="flex"
     justifyContent="space-between"
     alignItems="center"
     bg="white"
     w="100%"
     p="5px 10px 5px 10px"
     borderWidth="5px"
     borderRadius="10px"
    >
        <Tooltip label="Search Users to chat"
        hasArrow
        placement='bottom-end'
        >
            <Button variant="ghost" onClick={onOpen}>
                <SearchIcon/>
                <Text display={{ base: "none", md:"flex"}} px="4">Search user</Text>
            </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Let's Chat
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize='2xl' m={1}/>
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
              <Avatar size='sm' cursor='pointer' name={user.name} bg='lightblue'/>
              
            </MenuButton>
            <MenuList>
              <ProfileModal user = {user}>
                 <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider/>
              <MenuItem onClick={logoutHandler}>LogOut</MenuItem>
            </MenuList>
          </Menu>
        </div>
    </Box>

    <Drawer isOpen={isOpen} onClose={onClose} placement='left'>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton/>
          <DrawerHeader>Search User</DrawerHeader>
          <DrawerBody>
            <Box display='flex' pb={2} >
              <Input 
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={searchHandler}> Go </Button>
            </Box>
            {loading ? (<ChatLoading/>) : (
              searchResult?.map((user) => (
                <UserListItem
                  key = {user._id}
                  user={user}
                  handleFunction={()=>accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex"/>}
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
    </>
  )
}

export default SideDrawer