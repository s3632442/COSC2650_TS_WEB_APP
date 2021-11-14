import { gql } from '@apollo/client';

//fetches user authentication information
const query = (props) => {
  console.log(props.emailIDSelection);
  console.log(props.listingIDSelection);

  if (props.email != null) {
    return {
      query: gql`
              {
                userByEmail(email: "${props.email}", password: "${props.password}") {
                  userID
                  userEmail
                  userFirstName
                  userLastName
                  userStreet
                  userCity
                  userState
                  userEmailVerified
                  userPostCode
                  roleID
                }
              }
            `,
    };
  }
  //adminUserSearch(id: string, role: number, keyword: string):[User]
  if (props.emailIDSelection !== '') {
    console.log(props.emailIDSelection);
    return {
      query: gql`
              {
                adminUserSearch(id:"",role:0,keyword:"${props.emailIDSelection}") {
                  userID
                  userEmail
                  userFirstName
                  userLastName
                  userStreet
                  userCity
                  userState
                  userEmailVerified
                  userPostCode
                  roleID
                }
              }
              `,
    };
  }
  if (props.listingIDSelection !== '') {
    console.log(props.listingIDSelection);
    console.log('making this point');
    return {
      query: gql`
              {
                adminListingSearch(user:"",listingID:${props.listingIDSelection},keyword:"") {
                  listingID
                  listingTitle
                  listingDescription
                  listingImageURL
                  listingType
                  listingPostCode
                  listingPrice
                }
              }
              `,
    };
  } else {
    //fetches listings according to passed params
    return {
      query: gql`
              {
                listingsByFilter(listingPostCode:${
                  props.listingPostCode === undefined
                    ? 0
                    : props.listingPostCode
                },listingType:"${props.listingType}",listingCategory:"${
        props.listingCategory
      }") {
                  listingID
                  listingTitle
                  listingDescription
                  listingImageURL
                  listingType
                  listingPostCode
                  listingPrice
                }
              }
              `,
    };
  }
};
export default query;
