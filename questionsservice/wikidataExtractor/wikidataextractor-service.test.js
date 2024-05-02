import {
  Pais,
  Monumento,
  Elemento,
  Pelicula,
  Cancion
} from './wikidataextractor-service';

describe('Wikidata Extractor Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Templates', () => {
    const mockTransactions = [{ updateOne: jest.fn() }];

    const mockWikiQueries = {
      obtenerPaisYCapital: jest.fn(),
      obtenerPaisYContinente: jest.fn(),
      obtenerMonumentoYPais: jest.fn(),
      obtenerSimboloQuimico: jest.fn(),
      obtenerPeliculaYDirector: jest.fn(),
      obtenerCancionYArtista: jest.fn()
    };

    const mockData = {
      countryLabel: 'Country',
      capitalLabel: 'Capital',
      continentLabel: 'Continent',
      monumentLabel: 'Monument',
      elementLabel: 'Element',
      symbol: 'Symbol',
      peliculaLabel: 'Movie',
      directorLabel: 'Director',
      songLabel: 'Song',
      artistLabel: 'Artist'
    };

    const mockSaveMethod = jest.fn();

    const templates = [
      {
        extractMethod: mockWikiQueries.obtenerPaisYCapital,
        filtro: (element) => ({ pais: String(element.countryLabel) }),
        campo_actualizar: (element) => ({ capital: element.capitalLabel }),
        saveMethod: mockSaveMethod
      },
      {
        extractMethod: mockWikiQueries.obtenerPaisYContinente,
        filtro: (element) => ({ pais: String(element.countryLabel) }),
        campo_actualizar: (element) => ({ continente: element.continentLabel }),
        saveMethod: mockSaveMethod
      },
      {
        extractMethod: mockWikiQueries.obtenerMonumentoYPais,
        filtro: (element) => ({ monumento: String(element.monumentLabel) }),
        campo_actualizar: (element) => ({ pais: element.countryLabel }),
        saveMethod: mockSaveMethod
      },
      {
        extractMethod: mockWikiQueries.obtenerSimboloQuimico,
        filtro: (element) => ({ elemento: String(element.elementLabel) }),
        campo_actualizar: (element) => ({ simbolo: element.symbol }),
        saveMethod: mockSaveMethod
      },
      {
        extractMethod: mockWikiQueries.obtenerPeliculaYDirector,
        filtro: (element) => ({ pelicula: String(element.peliculaLabel) }),
        campo_actualizar: (element) => ({ director: element.directorLabel }),
        saveMethod: mockSaveMethod
      },
      {
        extractMethod: mockWikiQueries.obtenerCancionYArtista,
        filtro: (element) => ({ cancion: String(element.songLabel) }),
        campo_actualizar: (element) => ({ artista: element.artistLabel }),
        saveMethod: mockSaveMethod
      }
    ];

    test('Template 1', async () => {
      mockWikiQueries.obtenerPaisYCapital.mockResolvedValue(mockData);
      await templates[0].extractMethod();
      expect(mockWikiQueries.obtenerPaisYCapital).toHaveBeenCalled();
      expect(mockSaveMethod).toHaveBeenCalledWith(mockTransactions);
    });

    test('Template 2', async () => {
      mockWikiQueries.obtenerPaisYContinente.mockResolvedValue(mockData);
      await templates[1].extractMethod();
      expect(mockWikiQueries.obtenerPaisYContinente).toHaveBeenCalled();
      expect(mockSaveMethod).toHaveBeenCalledWith(mockTransactions);
    });

    test('Template 3', async () => {
      mockWikiQueries.obtenerMonumentoYPais.mockResolvedValue(mockData);
      await templates[2].extractMethod();
      expect(mockWikiQueries.obtenerMonumentoYPais).toHaveBeenCalled();
      expect(mockSaveMethod).toHaveBeenCalledWith(mockTransactions);
    });

    test('Template 4', async () => {
      mockWikiQueries.obtenerSimboloQuimico.mockResolvedValue(mockData);
      await templates[3].extractMethod();
      expect(mockWikiQueries.obtenerSimboloQuimico).toHaveBeenCalled();
      expect(mockSaveMethod).toHaveBeenCalledWith(mockTransactions);
    });

    test('Template 5', async () => {
      mockWikiQueries.obtenerPeliculaYDirector.mockResolvedValue(mockData);
      await templates[4].extractMethod();
      expect(mockWikiQueries.obtenerPeliculaYDirector).toHaveBeenCalled();
      expect(mockSaveMethod).toHaveBeenCalledWith(mockTransactions);
    });

    test('Template 6', async () => {
      mockWikiQueries.obtenerCancionYArtista.mockResolvedValue(mockData);
      await templates[5].extractMethod();
      expect(mockWikiQueries.obtenerCancionYArtista).toHaveBeenCalled();
      expect(mockSaveMethod).toHaveBeenCalledWith(mockTransactions);
    });
  });
});