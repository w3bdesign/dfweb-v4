import { getProjects } from "@/app/prosjekter/actions";
import { client } from "@/lib/sanity/client";
import { projectsQuery } from "@/lib/sanity/queries";

interface ErrorTestCase {
  name: string;
  error: {
    statusCode?: number;
    message: string;
    details?: {
      type: string;
      description: string;
    };
    name?: string;
  };
  expectedErrorMessage: string;
}

// Mock the Sanity client
jest.mock("@/lib/sanity/client", () => ({
  client: {
    fetch: jest.fn(),
  },
}));

describe("getProjects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches projects successfully", async () => {
    // Arrange
    const mockProjects = [
      {
        id: "1",
        name: "Test Project",
        description: "Test Description",
        subdescription: "Test Subdescription",
        projectimage: { asset: { _ref: "test" } },
        urlwww: [],
        urlgithub: [],
      },
    ];
    const expectedFetchOptions = {
      next: { revalidate: 3600 },
    };
    (client.fetch as jest.Mock).mockResolvedValueOnce(mockProjects);

    // Act
    const result = await getProjects();

    // Assert
    expect(result).toEqual(mockProjects);
    expect(client.fetch).toHaveBeenCalledWith(
      projectsQuery,
      {},
      expectedFetchOptions,
    );
  });

  describe("error handling", () => {
    const testErrorHandling = async ({ name, error, expectedErrorMessage }: ErrorTestCase) => {
      it(name, async () => {
        // Arrange
        (client.fetch as jest.Mock).mockRejectedValueOnce(error);

        // Act & Assert
        await expect(getProjects()).rejects.toThrow(expectedErrorMessage);
      });
    };

    const errorCases: ErrorTestCase[] = [
      {
        name: "handles authentication errors (401)",
        error: {
          statusCode: 401,
          message: "Invalid token",
          details: { type: "credentials", description: "Invalid token provided" }
        },
        expectedErrorMessage: "Authentication failed"
      },
      {
        name: "handles permission errors (403)",
        error: {
          statusCode: 403,
          message: "Insufficient permissions",
          details: { type: "authorization", description: "Missing read access" }
        },
        expectedErrorMessage: "Insufficient permissions"
      },
      {
        name: "handles rate limiting (429)",
        error: {
          statusCode: 429,
          message: "Too Many Requests",
          details: { type: "rate_limit", description: "Rate limit exceeded" }
        },
        expectedErrorMessage: "Rate limit exceeded"
      },
      {
        name: "handles malformed GROQ queries (400)",
        error: {
          statusCode: 400,
          message: "Invalid GROQ query",
          details: { type: "query_error", description: "Syntax error in GROQ query" }
        },
        expectedErrorMessage: "Sanity API error: Invalid GROQ query"
      },
      {
        name: "handles network timeouts",
        error: Object.assign(new Error("Network timeout"), { name: "TimeoutError" }),
        expectedErrorMessage: "Request timed out"
      },
      {
        name: "handles generic fetch errors",
        error: {
          message: "Fetch failed"
        },
        expectedErrorMessage: "Failed to fetch projects"
      }
    ];

    errorCases.forEach(testErrorHandling);

    it("recovers after temporary errors", async () => {
      // Arrange
      const rateError = {
        statusCode: 429,
        message: "Too Many Requests",
        details: { type: "rate_limit", description: "Rate limit exceeded" }
      };
      const mockProjects = [{
        id: "1",
        name: "Test Project",
        description: "Test Description",
        subdescription: "Test Subdescription",
        projectimage: { asset: { _ref: "test" } },
        urlwww: [],
        urlgithub: []
      }];

      // First call fails with rate limit
      (client.fetch as jest.Mock).mockRejectedValueOnce(rateError);
      // Second call succeeds
      (client.fetch as jest.Mock).mockResolvedValueOnce(mockProjects);

      // First call should fail
      await expect(getProjects()).rejects.toThrow("Rate limit exceeded");

      // Second call should succeed
      const result = await getProjects();
      expect(result).toEqual(mockProjects);
    });
  });
});
