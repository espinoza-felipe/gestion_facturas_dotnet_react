using GestionFacturas.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace GestionFacturas.WebApi.Controllers;

[Authorize]
[ApiController]
[Route("api/FacturaImport")]
public class FacturaImportController : ControllerBase
{
    private readonly IFacturaImporter _facturaImporter;

    public FacturaImportController(IFacturaImporter facturaImporter)
    {
        _facturaImporter = facturaImporter;
    }

    [HttpPost("import")]
    public async Task<IActionResult> ImportFacturas(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Archivo vacío o no enviado.");

        using var reader = new StreamReader(file.OpenReadStream());
        var jsonContent = await reader.ReadToEndAsync();

        await _facturaImporter.ImportFromJsonAsync(jsonContent);

        return Ok("Importación completada.");
    }
}
