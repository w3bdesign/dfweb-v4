import { getProjects } from "@/app/prosjekter/actions";
import { sanityFetch } from "@/lib/sanity/client";

// Mock next/cache unstable_cache to bypass Next.js server APIs in tests
jest.mock("next/cache", () => ({
  unstable_cache: (fn: Function) => fn, // Return the function directly without caching
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
}));

// Mock the Sanity client
jest.mock("@/lib/sanity/client", () => ({
  sanityFetch: jest.fn(),
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
    (sanityFetch as jest.Mock).mockResolvedValueOnce(mockProjects);

    // Act
    const result = await getProjects();

    // Assert
    expect(result).toStrictEqual(mockProjects);
    expect(sanityFetch).toHaveBeenCalledWith({
      query: expect.any(String),
      revalidate: 86400, // 24 hours
    });
  });

  describe("error handling", () => {
    it("handles authentication errors (401)", async () => {
      // Arrange
      const error = {
        statusCode: 401,
        message: "Invalid token",
        details: {
          type: "credentials",
          description: "Invalid token provided",
        },
      };
      (sanityFetch as jest.Mock).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow("Authentication failed");
    });

    it("handles permission errors (403)", async () => {
      // Arrange
      const error = {
        statusCode: 403,
        message: "Insufficient permissions",
        details: {
          type: "authorization",
          description: "Missing read access",
        },
      };
      (sanityFetch as jest.Mock).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow("Insufficient permissions");
    });

    it("handles rate limiting (429)", async () => {
      // Arrange
      const error = {
        statusCode: 429,
        message: "Too Many Requests",
        details: { type: "rate_limit", description: "Rate limit exceeded" },
      };
      (sanityFetch as jest.Mock).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow("Rate limit exceeded");
    });

    it("handles malformed GROQ queries (400)", async () => {
      // Arrange
      const error = {
        statusCode: 400,
        message: "Invalid GROQ query",
        details: {
          type: "query_error",
          description: "Syntax error in GROQ query",
        },
      };
      (sanityFetch as jest.Mock).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow(
        "Sanity API error: Invalid GROQ query",
      );
    });

    it("handles network timeouts", async () => {
      // Arrange
      const error = Object.assign(new Error("Network timeout"), {
        name: "TimeoutError",
      });
      (sanityFetch as jest.Mock).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow("Request timed out");
    });

    it("handles generic fetch errors", async () => {
      // Arrange
      const error = {
        message: "Fetch failed",
      };
      (sanityFetch as jest.Mock).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow("Failed to fetch projects");
    });

    it("recovers after temporary errors", async () => {
      // Arrange
      const rateError = {
        statusCode: 429,
        message: "Too Many Requests",
        details: { type: "rate_limit", description: "Rate limit exceeded" },
      };
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

      // First call fails with rate limit
      (sanityFetch as jest.Mock).mockRejectedValueOnce(rateError);
      // Second call succeeds
      (sanityFetch as jest.Mock).mockResolvedValueOnce(mockProjects);

      // First call should fail
      await expect(getProjects()).rejects.toThrow("Rate limit exceeded");

      // Second call should succeed
      const result = await getProjects();
      expect(result).toStrictEqual(mockProjects);
    });
  });
});
