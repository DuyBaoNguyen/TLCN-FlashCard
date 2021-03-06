using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Data;

namespace FlashCard.Repositories
{
	public class RepositoryWrapper : IRepositoryWrapper
	{
		private readonly ApplicationDbContext dbContext;
		private readonly IDeckRepository deck = null;
		private readonly ICardRepository card = null;
		private readonly IBackRepository back = null;
		private readonly ITestRepository test = null;
		private readonly IMatchRepository match = null;
		private readonly IUserRepository user = null;
		private readonly ISharedDeckRepository sharedDeck = null;
		private readonly ISharedCardRepository sharedCard = null;

		public IDeckRepository Deck
		{
			get
			{
				if (deck == null)
				{
					return new DeckRepository(dbContext);
				}
				return deck;
			}
		}

		public ICardRepository Card
		{
			get
			{
				if (card == null)
				{
					return new CardRepository(dbContext);
				}
				return card;
			}
		}

		public IBackRepository Back
		{
			get
			{
				if (back == null)
				{
					return new BackRepository(dbContext);
				}
				return back;
			}
		}

		public ITestRepository Test
		{
			get
			{
				if (test == null)
				{
					return new TestRepository(dbContext);
				}
				return test;
			}
		}

		public IMatchRepository Match
		{
			get
			{
				if (match == null)
				{
					return new MatchRepository(dbContext);
				}
				return match;
			}
		}

		public IUserRepository User
		{
			get
			{
				if (user == null)
				{
					return new UserRepository(dbContext);
				}
				return user;
			}
		}

		public ISharedDeckRepository SharedDeck
		{
			get
			{
				if (sharedDeck == null)
				{
					return new SharedDeckRepository(dbContext);
				}
				return sharedDeck;
			}
		}

		public ISharedCardRepository SharedCard
		{
			get
			{
				if (sharedCard == null)
				{
					return new SharedCardRepository(dbContext);
				}
				return sharedCard;
			}
		}

		public RepositoryWrapper(ApplicationDbContext dbContext)
		{
			this.dbContext = dbContext;
		}

		public Task<int> SaveChangesAsync()
		{
			return dbContext.SaveChangesAsync();
		}
	}
}