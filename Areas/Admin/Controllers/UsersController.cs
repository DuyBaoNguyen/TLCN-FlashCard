using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Dto;
using FlashCard.Models;
using FlashCard.Services;
using FlashCard.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FlashCard.Areas.Admin.Controllers
{
	[Authorize]
	[Route("api/admin/[controller]")]
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	public class UsersController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly UserManager<ApplicationUser> userManager;
		private readonly IImageService imageService;
		private readonly ILogger<UsersController> logger;

		public UsersController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager,
			IImageService imageService, ILogger<UsersController> logger)
		{
			this.repository = repository;
			this.userManager = userManager;
			this.imageService = imageService;
			this.logger = logger;
		}

		[HttpGet]
		[ProducesResponseType(200)]
		[ProducesResponseType(403)]
		public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsersNotAdmin()
		{
			var user = await userManager.GetUser(User);
			var userIsAdmin = await userManager.CheckAdminRole(user);

			if (!userIsAdmin)
			{
				return Forbid();
			}

			var usersNotAdmin = await repository.User
				.QueryByBeingNotAdmin(user.Id)
				.AsNoTracking()
				.MapToUserDto(imageService.UserPictureBaseUrl)
				.ToListAsync();

			return usersNotAdmin;
		}

		[HttpGet("{userId}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(403)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<UserDto>> GetById(string userId)
		{
			var user = await userManager.GetUser(User);
			var userIsAdmin = await userManager.CheckAdminRole(user);

			if (!userIsAdmin)
			{
				return Forbid();
			}

			var userNotAdmin = await repository.User
				.QueryByIdAndNotAdmin(user.Id, userId)
				.AsNoTracking()
				.MapToUserDto(imageService.UserPictureBaseUrl)
				.FirstOrDefaultAsync();

			if (userNotAdmin == null)
			{
				return NotFound();
			}

			return userNotAdmin;
		}

		[HttpDelete("{userId}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(403)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> DeleteUser(string userId)
		{
			var user = await userManager.GetUser(User);
			var userIsAdmin = await userManager.CheckAdminRole(user);

			if (!userIsAdmin)
			{
				return Forbid();
			}

			var deletedUser = await userManager.FindByIdAsync(userId);
			if (deletedUser == null)
			{
				return NotFound();
			}
			if (deletedUser.Id == user.Id)
			{
				ModelState.AddModelError("", "Cannot delete the admin account");
				return BadRequest(ModelState);
			}

			var cards = await repository.Card
				.QueryIncludesBacks(userId)
				.ToListAsync();

			repository.Card.DeleteRange(cards);
			repository.Deck.DeleteRange(repository.Deck.Query(userId));
			await repository.SaveChangesAsync();

			var result = await userManager.DeleteAsync(deletedUser);
			if (!result.Succeeded)
			{
				logger.LogError("An error when deleting the user with id {0}", deletedUser.Id);
			}

			foreach (var card in cards)
			{
				foreach (var back in card.Backs)
				{
					if (!imageService.TryDeleteImage(back.Image, ImageType.Image))
					{
						logger.LogError("An error occurs when deleting the image with name {0}", back.Image);
					}
				}
			}
			if (deletedUser.Picture != null)
			{
				if (!imageService.TryDeleteImage(deletedUser.Picture, ImageType.Picture))
				{
					logger.LogError("An error occurs when deleting the picture with name {0}", deletedUser.Picture);
				}
			}

			return NoContent();
		}

		[HttpGet("{userId}/decks")]
		[ProducesResponseType(200)]
		[ProducesResponseType(403)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<IEnumerable<DeckDto>>> GetDecksOfUser(string userId)
		{
			var user = await userManager.GetUser(User);
			var userIsAdmin = await userManager.CheckAdminRole(user);

			if (!userIsAdmin)
			{
				return Forbid();
			}

			var relativeUser = await repository.User
				.QueryByIdAndNotAdmin(user.Id, userId)
				.AsNoTracking()
				.FirstOrDefaultAsync();
			if (relativeUser == null)
			{
				return NotFound();
			}

			var decks = await repository.Deck
				.Query(userId)
				.AsNoTracking()
				.MapToDeckDto()
				.ToListAsync();

			return decks;
		}

		[HttpGet("{userId}/decks/{deckId}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(403)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<DeckDto>> GetDeckOfUser(string userId, int deckId)
		{
			var user = await userManager.GetUser(User);
			var userIsAdmin = await userManager.CheckAdminRole(user);

			if (!userIsAdmin)
			{
				return Forbid();
			}

			var relativeUser = await repository.User
				.QueryByIdAndNotAdmin(user.Id, userId)
				.AsNoTracking()
				.FirstOrDefaultAsync();
			if (relativeUser == null)
			{
				return NotFound();
			}

			var deck = await repository.Deck
				.QueryById(userId, deckId)
				.AsNoTracking()
				.MapToDeckDto()
				.FirstOrDefaultAsync();

			if (deck == null)
			{
				return NotFound();
			}
			return deck;
		}

		[HttpDelete("{userId}/decks/{deckId}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(403)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> DeleteDeck(string userId, int deckId)
		{
			var user = await userManager.GetUser(User);
			var userIsAdmin = await userManager.CheckAdminRole(user);

			if (!userIsAdmin)
			{
				return Forbid();
			}

			var relativeUser = await repository.User
				.QueryByIdAndNotAdmin(user.Id, userId)
				.AsNoTracking()
				.FirstOrDefaultAsync();
			if (relativeUser == null)
			{
				return NotFound();
			}

			var deck = await repository.Deck
				.QueryById(userId, deckId)
				.FirstOrDefaultAsync();
			if (deck == null)
			{
				return NotFound();
			}

			repository.Deck.Delete(deck);
			await repository.SaveChangesAsync();

			return NoContent();
		}

		[HttpGet("{userId}/decks/{deckId}/cards")]
		[ProducesResponseType(200)]
		[ProducesResponseType(403)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<IEnumerable<CardDto>>> GetCardsOfDeck(string userId, int deckId)
		{
			var user = await userManager.GetUser(User);
			var userIsAdmin = await userManager.CheckAdminRole(user);

			if (!userIsAdmin)
			{
				return Forbid();
			}

			var relativeUser = await repository.User
				.QueryByIdAndNotAdmin(user.Id, userId)
				.AsNoTracking()
				.FirstOrDefaultAsync();
			if (relativeUser == null)
			{
				return NotFound();
			}

			var deck = await repository.Deck
				.QueryById(userId, deckId)
				.AsNoTracking()
				.FirstOrDefaultAsync();
			if (deck == null)
			{
				return NotFound();
			}

			var cards = await repository.Card
				.QueryByDeckId(deckId)
				.AsNoTracking()
				.MapToCardDto(imageService.BackImageBaseUrl)
				.ToListAsync();

			return cards;
		}

		[HttpGet("{userId}/cards")]
		[ProducesResponseType(200)]
		[ProducesResponseType(403)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<IEnumerable<CardDto>>> GetCardsOfUser(string userId)
		{
			var user = await userManager.GetUser(User);
			var userIsAdmin = await userManager.CheckAdminRole(user);

			if (!userIsAdmin)
			{
				return Forbid();
			}

			var relativeUser = await repository.User
				.QueryByIdAndNotAdmin(user.Id, userId)
				.AsNoTracking()
				.FirstOrDefaultAsync();
			if (relativeUser == null)
			{
				return NotFound();
			}

			var cards = await repository.Card
				.Query(userId)
				.AsNoTracking()
				.MapToCardDto(imageService.BackImageBaseUrl)
				.ToListAsync();

			return cards;
		}

		[HttpDelete("{userId}/cards/{cardId}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(403)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> DeleteCard(string userId, int cardId)
		{
			var user = await userManager.GetUser(User);
			var userIsAdmin = await userManager.CheckAdminRole(user);

			if (!userIsAdmin)
			{
				return Forbid();
			}

			var relativeUser = await repository.User
				.QueryByIdAndNotAdmin(user.Id, userId)
				.AsNoTracking()
				.FirstOrDefaultAsync();
			if (relativeUser == null)
			{
				return NotFound();
			}

			var card = await repository.Card
				.QueryByIdIncludesBacks(userId, cardId)
				.FirstOrDefaultAsync();
			if (card == null)
			{
				return NotFound();
			}

			repository.Card.Delete(card);
			await repository.SaveChangesAsync();

			foreach (var back in card.Backs)
			{
				if (!imageService.TryDeleteImage(back.Image, ImageType.Image))
				{
					logger.LogError("An error occurs when deleting the image with name {0}", back.Image);
				}
			}

			return NoContent();
		}
	}
}