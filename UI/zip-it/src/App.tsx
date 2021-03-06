import { useState } from 'react';
import Header from './components/elements/header';
import { useColorMode, useToast } from '@chakra-ui/react';
import Login, { LoginDetails } from './components/forms/login';
import Logout from './components/forms/logout';
import Register, { RegistrationDetails } from './components/forms/register';
import query from './data/queries';
import mutation from './data/mutations';
import clientConnection from './data/client';
import UserListings from './components/display/useritemlist';
import { AdminListings } from './components/display/adminitemlist';
import NewListing, { newListingDetails } from './components/forms/newlisting';
import UserProfile, {
  userProfileDetails,
} from './components/forms/userprofile';

import Confirmation, {
  ConfirmationDetails,
} from './components/forms/confirmation';
import DeleteUser, { DeleteUserDetails } from './components/forms/deleteuser';
import RespondListing, { RespondListingDetails } from './components/forms/respondlisting';

interface LogInDetails {
  userID: number;
  userEmail: string;
  userEmailVerified: boolean;
  userPostCode: number;
}

function App() {
  const [userTitle, setUserTitle] = useState(' Welcome!');
  const [listPane, setListPane] = useState(0);
  const [listingID] = useState(1065);
  const [userID, setUserID] = useState(0);
  const [RoleID, setRoleID] = useState(0);
  const [userPostCode, setUserPostCode] = useState(0);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userStreet, setUserStreet] = useState('');
  const [userCity, setUserCity] = useState('');
  const [userState, setUserState] = useState('');
  const [authenticated, setAuthenticated] = useState<LogInDetails>();
  const [logInDisabled, setLogInDisabled] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [registerDisabled, setRegisterDisabled] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationDisabled, setConfirmationDisabled] = useState(false);
  const [newListingVisible, setNewListingVisible] = useState(false);
  const [UserProfileVisible, setUserProfileVisible] = useState(false);
  const [UserProfileDisabled, setUserProfileDisabled] = useState(false);
  const [newListingDisabled, setNewListingDisabled] = useState(false);
  const [DeleteUserDisabled, setDeleteUserDisabled] = useState(false);
  const [DeleteUserVisible, setDeleteUserVisible] = useState(false);
  const [RespondListingDisabled, setRespondListingDisabled] = useState(false);
  const [RespondListingVisible, setRespondListingVisible] = useState(false);
  const { toggleColorMode } = useColorMode();
  const onShowLogin = () => setLoginVisible(true);
  const onShowRegister = () => {setRegisterVisible(true)
  setLoginVisible(false)};
  const onShowLogout = () => setLogoutVisible(true);
  const onShowUserProfile = () => setUserProfileVisible(true);
  const onShowNewListing = () => setNewListingVisible(true);
  const onLogInClose = () => setLoginVisible(false);
  const onLogoutClose = () => setLogoutVisible(false);
  const onRegisterClose = () => setRegisterVisible(false);
  const onNewListingClose = () => setNewListingVisible(false);
  const onUserProfileClose = () => setUserProfileVisible(false);
  const onShowDeleteUser = () => setDeleteUserVisible(true);
  const onShowDeleteUserClose = () => setDeleteUserVisible(false);
  const onShowRespondListing = () => setRespondListingVisible(true);
  const onShowRespondListingClose = () => setRespondListingVisible(false);

  const onConfirmationClose = () => {
    setUserTitle('Welcome');
    setAuthenticated(undefined);
    setConfirmationVisible(false);
  };

  const toast = useToast();
  const registrationErrorToast = () =>
    toast({
      title: 'Email already registered',
      description:
        'The email address you entered is already contained in the system, please either log in or register another email address.',
      status: 'error',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });

  const validationToast = () =>
    toast({
      title: 'Sorry invalid - Try again?',
      description: 'Invalid credentials.',
      status: 'error',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });

  const errorToast = () =>
    toast({
      title: 'Sorry the system is down - Try later',
      description: 'Invalid credentials.',
      status: 'error',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });



  //Logic for Login function
  const onLogin = (props: LoginDetails) => {
    setLogInDisabled(true);

    //invoke client
    const client = clientConnection();

    //query database + pass result to
    client
      .query(query(props))
      .then((result) => {
        const queryResult = result.data.userByEmail;
        if (queryResult.userEmail === props.email) {
          //set user data
          setUserTitle('Hi, ' + queryResult.userFirstName + '!');
          setUserID(queryResult.userID);
          setRoleID(queryResult.roleID);
          setUserFirstName(queryResult.userFirstName);
          setUserLastName(queryResult.userLastName);
          setUserStreet(queryResult.userStreet);
          setUserCity(queryResult.userCity);
          setUserState(queryResult.userState);
          if (queryResult.roleID === 1) {
            setUserPostCode(0);
          } else {
            setUserPostCode(queryResult.userPostCode);
          }

          //hide login
          setLoginVisible(false);

          // Set the authenticated data
          const logInDetails: LogInDetails = {
            ...result.data.userByEmail,
          };

          //sets authenticated state
          setAuthenticated(logInDetails);

          if (logInDetails.userEmailVerified) {
            //login confirmation
            toast({
              title: 'Logged In',
              description: 'You have been successfully logged in.',
              status: 'success',
              duration: 2000,
              isClosable: true,
              position: 'top',
            });
          } else {
            // Show the confirmation page
            setConfirmationVisible(true);
            setConfirmationDisabled(false);
          }
        } else {
          validationToast();
          setLogInDisabled(false);
        }
      })
      //catch apollo/graphQL failure
      .catch((result) => {
        console.log(result);
        errorToast();
        setLoginVisible(false);
        setLogInDisabled(false);
      });
  };

  //logic for logout function
  const onLogout = () => {
    
    //clear user details
    setAuthenticated(undefined);
    setRoleID(2);
    setUserTitle(' Welcome!');
    setUserPostCode(0);
    setLogInDisabled(false);
    setUserID(0);
    setUserFirstName("");
    setUserLastName("");
    setUserStreet('');
    setUserCity("");
    setUserState("");

    //log out confirmation
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });

    //hide login
    setLogoutVisible(false);
  };

  const onRegister = (props: RegistrationDetails) => {
    //invoke client
    const client = clientConnection();
    const regProps = {
      type: 'register',
      data: props,
    };

    //query database + pass result to
    client
      .mutate({ mutation: mutation(regProps) })
      .then((result) => {
        if (result.data.createUser.userID > 0) {
          //hide login
          setLoginVisible(false);

          // Set the authenticated data
          const logInDetails: LogInDetails = {
            ...result.data.createUser,
          };

          setAuthenticated(logInDetails);

          // Hide the registration page
          setRegisterVisible(false);

          // Show the confirmation page
          setConfirmationVisible(true);
          setConfirmationDisabled(false);
        } else {
          // Reenable the confirmation dialog
          setRegisterDisabled(false);

          // Show the error toast
          registrationErrorToast();
        }
      })
      //catch apollo/graphQL failure
      .catch((result) => {
        // Show the error toast
        errorToast();

        // Reenable the confirmation dialog
        setRegisterDisabled(false);
      });
  };

  //user confirmation logic
  const onConfirmation = (props: ConfirmationDetails) => {
    //invoke client
    const client = clientConnection();
    const confProps = {
      type: 'confirm',
      data: {
        userEmail: authenticated?.userEmail,
        confirmationCode: props.confirmationCode,
      },
    };

    // Disable the confirmation
    setConfirmationDisabled(true);

    //query database + pass result to
    client
      .mutate({ mutation: mutation(confProps) })
      .then((result) => {
        if (result.data.confirmUser) {
          // Set the authenticated data
          const logInDetails: LogInDetails = {
            ...result.data.userByEmail,
          };

          setAuthenticated(logInDetails);

          // Show the account created toast
          toast({
            title: 'Account Created',
            description: 'Your account has been successfully verified.',
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: 'top',
          });

          // Hide the confirmation dialog
          setConfirmationVisible(false);
        } else {
          // Reenable the confirmation dialog
          setConfirmationDisabled(false);

          // Show the error toast
          errorToast();
        }
      })
      //catch apollo/graphQL failure
      .catch((result) => {
        // Show the error toast
        errorToast();

        // Reenable the confirmation dialog
        setConfirmationDisabled(false);
      });
  };

  const onNewListing = (props: newListingDetails) => {
    const client = clientConnection();
    const listingProps = {
      type: 'newListing',
      data: props,
    };

    client
      .mutate({ mutation: mutation(listingProps) })
      .then((result) => {
        toast({
          title: 'Listing Created',
          description: 'Your listing has been successfully created.',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
        setNewListingVisible(false);
      })

      .catch((result) => {
        toast({
          title: 'Catch Error',
          description: 'Listing has encountered an error.',
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });

        console.log('Apollo/GraphQL failure - Zip-It');
        console.log('check relevant query in queries.tsx');
        console.log(props);
        console.log(result);

        setNewListingDisabled(false);
      });
  };

  //create listing logic
  const onUserProfile = (props: userProfileDetails) => {
    const client = clientConnection();
    const userProfileProps = {
      type: 'editUserProfile',
      data: props,
    };

    client
      .mutate({ mutation: mutation(userProfileProps) })
      .then((result) => {
        if (props.userFirstName != null) {
          setUserTitle('Hi, ' + props.userFirstName + '!');
        }
        if (props.userPostCode != null) {
          setUserPostCode(props.userPostCode);
        }
        if (props.userFirstName != null) {
          setUserFirstName(props.userFirstName);
        }
        if (props.userLastName != null) {
          setUserLastName(props.userLastName);
        }
        if (props.userStreet != null) {
          setUserStreet(props.userStreet);
        }
        if (props.userCity != null) {
          setUserCity(props.userCity);
        }
        if (props.userState != null) {
          setUserState(props.userState);
        }

        toast({
          title: 'User Profile',
          description:
            'Your profile information has been successfully changed.',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
        setUserProfileVisible(false);
      })

      .catch((result) => {
        toast({
          title: 'Catch Error',
          description: 'User profile has encountered an error.',
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });

        console.log('Apollo/GraphQL failure - Zip-It');
        console.log('check relevant query in queries.tsx');
        console.log(props);
        console.log(result);

        setUserProfileDisabled(false);
      });
  };

  const onMessage = () => {
    setListPane(1);
  };

  const onList = () => {
    setListPane(0);
  };

  const onDeleteUser = (props: DeleteUserDetails) => {
    const client = clientConnection();
    const deleteUserProps = {
      type: 'deleteUserProfile',
      data: props,
    };

    client
      .mutate({ mutation: mutation(deleteUserProps) })
      .then((result) => {
        toast({
          title: 'Delete User Profile',
          description:
            'Your profile information has been successfully removed.',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
        setUserTitle(' Welcome!');
        setUserPostCode(0);
        setAuthenticated(undefined);
        setLogInDisabled(false);
        setUserProfileVisible(false);
        setDeleteUserVisible(false);
      })

      .catch((result) => {
        toast({
          title: 'Catch Error',
          description: 'User profile has encountered an error.',
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });

        console.log('Apollo/GraphQL failure - Zip-It');
        console.log('check relevant query in queries.tsx');
        console.log(props);
        console.log(result);

        setDeleteUserDisabled(false);
      });
  };

  const onRespondListing = (props: RespondListingDetails) => {
    const client = clientConnection();
    const respondListingProps = {
      type: 'respondListing',
      data: props,
    };

    client
      .mutate({ mutation: mutation(respondListingProps) })
      .then((result) => {
        console.log(result);
        toast({
          title: 'Message Created',
          description: 'Your message has been successfully sent to sender.',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
        setRespondListingVisible(false);
      })

      .catch((result) => {
        toast({
          title: 'Catch Error',
          description: 'Your message has encountered an error.',
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });

        console.log('Apollo/GraphQL failure - Zip-It');
        console.log('check relevant query in queries.tsx');
        console.log(props);
        console.log(result);

        setRespondListingDisabled(false);
      });
  }


  //portal type selection logic
  function UserAdminPortalDisplay() {
    if (RoleID === 1) {
      return (
        <>
          <AdminListings userPostCode={userPostCode} />
        </>
      );
    } else {
      return (
        <>
          <UserListings
            userPostCode={userPostCode}
            viewerID={userID}
            listingUserID={0}
            onRespondListing={onShowRespondListing}
            panelOption={listPane}
          />
          <RespondListing
            disabled={RespondListingDisabled}
            visible={RespondListingVisible}
            onOpen={onShowRespondListing}
            onClose={onShowRespondListingClose}
            onRespondListing={onRespondListing}
            userID={userID}
            listingID={listingID}
          />
        </>
      );
    }
  }

  return (
    <>
      <Header
        toggleColorMode={toggleColorMode}
        UserProfile={onShowUserProfile}
        MessageItem={onMessage}
        ListItem={onList}
        toggleLogIn={onShowLogin}
        toggleLogout={onShowLogout}
        NewListing={onShowNewListing}
        userTitle={userTitle}
        authenticated={authenticated !== undefined}
      />
      <Login
        disabled={logInDisabled}
        visible={loginVisible}
        onOpenRegister={onShowRegister}
        onLogin={onLogin}
        onClose={onLogInClose}
      />
      <Confirmation
        disabled={confirmationDisabled}
        visible={confirmationVisible}
        onConfirm={onConfirmation}
        onClose={onConfirmationClose}
      />
      <Logout
        visible={logoutVisible}
        onLogout={onLogout}
        onClose={onLogoutClose}
      />
      <Register
        disabled={registerDisabled}
        visible={registerVisible}
        onRegister={onRegister}
        onClose={onRegisterClose}
      ></Register>
      <NewListing
        disabled={newListingDisabled}
        visible={newListingVisible}
        onNewListing={onNewListing}
        onClose={onNewListingClose}
        listingUserID={userID}
        listingPostCode={userPostCode}
      ></NewListing>
      <UserAdminPortalDisplay />
      <UserProfile
        disabled={UserProfileDisabled}
        visible={UserProfileVisible}
        onOpen={onShowLogin}
        onUserProfile={onUserProfile}
        onClose={onUserProfileClose}
        userID={userID}
        userFirstName={userFirstName}
        userLastName={userLastName}
        userPostCode={userPostCode}
        userStreet={userStreet}
        userCity={userCity}
        userState={userState}
        onDeleteUser={onShowDeleteUser}
      />
      <DeleteUser
        disabled={DeleteUserDisabled}
        visible={DeleteUserVisible}
        onOpen={onShowDeleteUser}
        onClose={onShowDeleteUserClose}
        onDeleteUser={onDeleteUser}
        userID={userID}
      />
    </>
  );
}

export default App;
