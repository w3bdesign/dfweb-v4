import { getProjects } from '../../src/app/prosjekter/actions';
import { client } from '../../src/lib/sanity/client';
import { projectsQuery } from '../../src/lib/sanity/queries';

// Mock the Sanity client
jest.mock('../../src/lib/sanity/client', () => ({
  client: {
    fetch: jest.fn(),
  },
}));

describe('getProjects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches projects successfully', async () => {
    const mockProjects = [
      {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        subdescription: 'Test Subdescription',
        projectimage: { asset: { _ref: 'test' } },
        urlwww: [],
        urlgithub: [],
      },
    ];

    (client.fetch as jest.Mock).mockResolvedValueOnce(mockProjects);

    const result = await getProjects();

    expect(result).toEqual(mockProjects);
    expect(client.fetch).toHaveBeenCalledWith(projectsQuery, {}, {
      next: { revalidate: 3600 }
    });
  });

  it('handles fetch error correctly', async () => {
    (client.fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    await expect(getProjects()).rejects.toThrow('Failed to fetch projects');
  });
});
