using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using FlashCard.Contracts;
using FlashCard.Dto;
using FlashCard.Models;
using FlashCard.RequestModels;
using FlashCard.Services;
using FlashCard.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FlashCard.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	public class CardsController : ControllerBase
	{
		private readonly IRepositoryWrapper repository;
		private readonly UserManager<ApplicationUser> userManager;
		private readonly IImageService imageService;
		private readonly ILogger<CardsController> logger;

		public CardsController(IRepositoryWrapper repository, UserManager<ApplicationUser> userManager,
			IImageService imageService, ILogger<CardsController> logger)
		{
			this.repository = repository;
			this.userManager = userManager;
			this.imageService = imageService;
			this.logger = logger;
		}

		[HttpGet]
		[ProducesResponseType(200)]
		public async Task<IEnumerable<CardDto>> GetAllCards()
		{
			var userId = UserUtil.GetUserId(User);
			var cards = await repository.Card
				.Query(userId)
				.AsNoTracking()
				.MapToCardDto(imageService.GetBackImageBaseUrl())
				.ToListAsync();

			return cards;
		}

		[HttpGet("{id}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(404)]
		public async Task<ActionResult<CardDto>> GetCardById(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var card = await repository.Card
				.QueryById(userId, id)
				.AsNoTracking()
				.MapToCardDto(imageService.GetBackImageBaseUrl())
				.FirstOrDefaultAsync();

			if (card == null)
			{
				return NotFound();
			}

			return card;
		}

		[HttpPost]
		[ProducesResponseType(201)]
		[ProducesResponseType(400)]
		public async Task<IActionResult> Create(CardRequestModel cardRqModel)
		{
			var userId = UserUtil.GetUserId(User);
			var cardSameFront = await repository.Card
				.QueryByFront(userId, cardRqModel.Front)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (cardSameFront != null)
			{
				ModelState.AddModelError("Front", "The front is taken.");
				return BadRequest(ModelState);
			}

			var now = DateTime.Now;
			var newCard = new Card()
			{
				Front = cardRqModel.Front.Trim(),
				CreatedDate = now,
				LastModifiedDate = now,
				OwnerId = userId,
				AuthorId = userId
			};

			repository.Card.Create(newCard);
			await repository.SaveChangesAsync();

			return CreatedAtAction(nameof(GetCardById), new { Id = newCard.Id },
				new { Message = "Created Successfully.", Id = newCard.Id });
		}

		[HttpPut("{id}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(400)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> Update(int id, CardRequestModel cardRqModel)
		{
			var userId = UserUtil.GetUserId(User);
			var existingCard = await repository.Card
				.QueryById(userId, id)
				.FirstOrDefaultAsync();

			if (existingCard == null)
			{
				return NotFound();
			}

			var cardSameFront = await repository.Card
				.QueryByFront(userId, cardRqModel.Front)
				.AsNoTracking()
				.FirstOrDefaultAsync();

			if (cardSameFront != null)
			{
				if (cardSameFront.Id == existingCard.Id)
				{
					return NoContent();
				}

				ModelState.AddModelError("Front", "The front is taken.");
				return BadRequest(ModelState);
			}

			existingCard.Front = cardRqModel.Front.Trim();
			existingCard.LastModifiedDate = DateTime.Now;
			await repository.SaveChangesAsync();

			return NoContent();
		}

		[HttpDelete("{id}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> Delete(int id)
		{
			var userId = UserUtil.GetUserId(User);
			var existingCard = await repository.Card
				.QueryByIdIncludesBacks(userId, id)
				.FirstOrDefaultAsync();

			if (existingCard == null)
			{
				return NotFound();
			}

			repository.Card.Delete(existingCard);
			await repository.SaveChangesAsync();

			foreach (var back in existingCard.Backs)
			{
				if (back.Image != null)
				{
					if (!imageService.TryDeleteImage(back.Image))
					{
						logger.LogError("An error occurs when deleting the image with name {0}", back.Image);
					}
				}
			}

			return NoContent();
		}

		[HttpPost("{id}/backs")]
		[ProducesResponseType(201)]
		[ProducesResponseType(400)]
		[ProducesResponseType(404)]
		public async Task<IActionResult> CreateBack(int id, [FromForm] BackRequestModel backRqModel)
		{
			if (backRqModel.Image != null)
			{
				if (backRqModel.Image.Length > 5242880)
				{
					ModelState.AddModelError("Image", "File is not exceeded 5MB.");
				}
				if (!ImageUtil.CheckExtensions(backRqModel.Image))
				{
					ModelState.AddModelError("Image",
						"Accepted images that images are with an extension of .png, .jpg, .jpeg or .bmp.");
				}
			}
			if ((backRqModel.Meaning == null || backRqModel.Meaning.Length == 0)
				&& (backRqModel.Image == null || backRqModel.Image.Length == 0))
			{
				ModelState.AddModelError("", "Card must at least have either meaning or image.");
			}
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var user = await UserUtil.GetUser(userManager, User);
			var card = await repository.Card
				.QueryById(user.Id, id)
				.FirstOrDefaultAsync();

			if (card == null)
			{
				return NotFound();
			}

			var imageName = await imageService.UploadImage(backRqModel.Image);
			var userIsAdmin = await userManager.IsInRoleAsync(user, Roles.Administrator);
			var now = DateTime.Now;
			var newBack = new Back()
			{
				Type = backRqModel.Type == null || backRqModel.Type.Trim().Length == 0
					? null : backRqModel.Type.Trim().ToLower(),
				Meaning = backRqModel.Meaning == null || backRqModel.Meaning.Trim().Length == 0
					? null : backRqModel.Meaning.Trim(),
				Example = backRqModel.Example == null || backRqModel.Example.Trim().Length == 0
					? null : backRqModel.Example.Trim(),
				Image = imageName,
				Public = userIsAdmin,
				Approved = userIsAdmin,
				CreatedDate = now,
				LastModifiedDate = now,
				Card = card,
				Author = user
			};

			repository.Back.Create(newBack);
			await repository.SaveChangesAsync();

			return CreatedAtAction("GetBack", "Backs", new { Id = newBack.Id },
				new { Message = "Created Successfully.", Id = newBack.Id });
		}
	}
}