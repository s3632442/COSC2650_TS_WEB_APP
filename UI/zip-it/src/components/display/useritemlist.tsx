import { VStack, StackDivider, Stack } from '@chakra-ui/layout';
import ListItem, { ListItemProp } from '../elements/listitem';
import Search, { SearchDetails } from '../forms/usersearch';
import query from '../../data/queries';
import clientConnection from '../../data/client';
import React, { useState } from 'react';
import MessageItem from '../elements/listmessage';

//interfaces
interface userDetails {
  userPostCode: number;
  viewerID: number;
  listingUserID: number;
  panelOption: number;
  onRespondListing(): void;
}
export function UserListings(props: userDetails) {
  let [listings, setListings] = useState([]);



  //search query
  const queryAPI = (props: SearchDetails) => {
    
    //invoke client
    const client = clientConnection();
    client
      .query(query(props))
      .then((result) => {
        //create constant from result
        listings = result.data.listingsByFilter;
        setListings(listings);
      })
      //catch apollo/graphQL failure
      .catch((result) => {
        console.log('Apollo/GraphQL failure - Zip-It');
        console.log('check relevant query in queries.tsx');
        console.log(props);
        console.log(result);
      });
  };

  //passes data returned to listItem to be rendered
  function ListingsFragment() {
    if (props.panelOption !== 1) {
      return (
        <>
          {listings && (
            <>
              {listings.map((listing: ListItemProp) => (
                <ListItem key={listing.listingID} {...listing}
                  viewerID={props.viewerID}
                  listingUserID={props.listingUserID}
                  onRespondListing={props.onRespondListing}
                ></ListItem>
              ))}
            </>
          )}
        </>
      );
    } else {
      return (
        <MessageItem
          senderName={'Dougie Douglas'}
          messageDesc={'Hey just wondering if this is still for sale?'}
          senderEmail={'test@test.com'}
        ></MessageItem>
      )
    }
  }

  //item list component
  return (
    <>
      <Stack
        direction={['column', 'row']}
        margin="60px 5px 5px 5px"
        divider={<StackDivider />}
        spacing={2}
      >
        <Search
          onSearchInterface={queryAPI}
          userPostCode={props.userPostCode}
        ></Search>
        <VStack divider={<StackDivider />} spacing={2} width="100%">
          <ListingsFragment />
        </VStack>
      </Stack>
    </>
  );
}
export default UserListings;
