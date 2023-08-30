import { isEditor } from '@/lib/current-user';
import { inviteUser } from '@/lib/invite-user';
import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useToast,
  chakra,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import {
  faArrowRightFromBracket,
  faChevronDown,
  faFileLines,
  faNewspaper,
  faTags,
  faUser,
  faUsers,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const Icon = chakra(FontAwesomeIcon);

const NavMenuLink = ({ text, link, icon }) => {
  return (
    <Box
      color='black'
      p='0.5rem 2rem'
      display='flex'
      alignItems='center'
      fontWeight='400'
      m='2px 5px'
      _hover={{
        bgColor: 'rgb(243, 244, 246)',
        borderRadius: '5px'
      }}
    >
      <a href={link}>
        <Icon icon={icon} fixedWidth mr='0.5rem' />
        {text}
      </a>
    </Box>
  );
};

const NavMenuContent = ({ session, onClose, ...rest }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const toast = useToast();

  const invite = async () => {
    const status = await inviteUser(inviteEmail, session.user.jwt);
    toast({
      title: status ? 'User invited' : 'Error inviting user',
      status: status ? 'success' : 'error',
      duration: 5000,
      isClosable: true
    });
  };

  return (
    <Flex
      flexDirection='column'
      w={{ base: 'full', md: '300px' }}
      h='100%'
      pos='fixed'
      bgColor='white'
      borderRightWidth='1'
      {...rest}
    >
      <Box>
        <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
          <Heading size='lg' py='1rem' textAlign='center'>
            freeCodeCamp
          </Heading>
          <CloseButton
            onClick={onClose}
            display={{ base: 'flex', md: 'none' }}
          />
        </Flex>

        <Box>
          <NavMenuLink text='Posts' icon={faFileLines} link='#' />
          {isEditor(session) ||
            (true && (
              <>
                <NavMenuLink text='Pages' icon={faNewspaper} link='#' />
                <NavMenuLink text='Tags' icon={faTags} link='#' />
                <NavMenuLink text='Staff' icon={faUsers} link='#' />
              </>
            ))}
        </Box>
      </Box>
      <Spacer />
      {/* TODO: Remove this when invite users logic is added to users view */}
      <Box mx='10px' mb='1rem'>
        <FormControl isRequired>
          <FormLabel>Invite User</FormLabel>
          <Input
            type='email'
            placeholder='foo@bar.com'
            onChange={e => setInviteEmail(e.target.value)}
          />
        </FormControl>
        <Button colorScheme='blue' onClick={invite}>
          Invite
        </Button>
      </Box>
      <Box m='0 5px'>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<Icon icon={faChevronDown} fixedWidth />}
            bgColor='white'
            w='100%'
            mt={3}
            mb={6}
            display='flex'
            alignItems='center'
            _hover={{
              bgColor: 'rgb(243, 244, 246)'
            }}
            _active={{
              bgColor: 'rgb(243, 244, 246)'
            }}
          >
            <Flex>
              <Avatar size='sm' mr='8px' my='auto' />
              <Flex flexDirection='column'>
                <Box fontWeight='600' lineHeight='1.1em' pb='3px'>
                  {session.user.name}
                </Box>
                <Box
                  fontSize='0.75rem'
                  fontWeight='400'
                  lineHeight='1.1em'
                  pb='3px'
                  color='#54666d'
                >
                  {session.user.email}
                </Box>
              </Flex>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<Icon icon={faUser} fixedWidth />}>
              Your Profile
            </MenuItem>
            <MenuItem
              icon={<Icon icon={faArrowRightFromBracket} fixedWidth />}
              onClick={() => signOut()}
            >
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default function NavMenu({ session }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <NavMenuContent
        session={session}
        display={{ base: 'none', md: 'flex' }}
      />
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
      >
        <DrawerOverlay />
        <DrawerContent>
          <NavMenuContent session={session} onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <Flex
        display={{ base: 'flex', md: 'none' }}
        height='20'
        alignItems='center'
        borderBottomWidth='1px'
        borderBottomColor='gray.200'
        justifyContent='flex-start'
        px='4'
        bgColor='white'
      >
        <IconButton
          variant='outline'
          onClick={onOpen}
          icon={<FontAwesomeIcon icon={faBars} />}
        />
        <Heading size='lg' ml='8' textAlign='center'>
          freeCodeCamp
        </Heading>
      </Flex>
    </>
  );
}
