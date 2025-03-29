namespace GestionFacturas.Application.Interfaces;

public interface IFacturaImporter
{
    Task ImportFromJsonAsync(string jsonContent);
}
