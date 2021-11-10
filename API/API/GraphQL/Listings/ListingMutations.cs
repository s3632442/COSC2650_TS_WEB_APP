using System.Threading.Tasks;
using API.Models;
using API.Services;
using HotChocolate.Types;

namespace API.GraphQL.Listings
{
    [ExtendObjectType("Mutation")]  
    public class ListingMutations  
    {  
        private readonly IListingService _listingService;  
  
        public ListingMutations(IListingService listingService)  
        {  
            _listingService = listingService;  
        }  

        public async Task<Listing> CreateListing(AddListingInput input) => await _listingService.CreateListing(input);
    }  
}  