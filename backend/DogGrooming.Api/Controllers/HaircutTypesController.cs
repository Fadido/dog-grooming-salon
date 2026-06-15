using DogGrooming.Application.DTOs.HaircutTypes;
using DogGrooming.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DogGrooming.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/haircut-types")]
public class HaircutTypesController : ControllerBase
{
    private readonly IHaircutTypeService _haircutTypes;

    public HaircutTypesController(IHaircutTypeService haircutTypes)
    {
        _haircutTypes = haircutTypes;
    }

    /// <summary>List the available haircut types with their duration and base price.</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<HaircutTypeDto>>> GetAll()
    {
        var types = await _haircutTypes.GetAllAsync();
        return Ok(types);
    }
}
