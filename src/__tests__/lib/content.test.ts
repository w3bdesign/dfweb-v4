import {
  getProjects,
  getCv,
  getNavigation,
  CONTENT_TAGS,
} from "@/lib/sanity/content";
import { sanityFetch } from "@/lib/sanity/client";

// Mock the Sanity client — the content module's only dependency
jest.mock("@/lib/sanity/client", () => ({
  sanityFetch: jest.fn(),
}));

describe("content module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProjects", () => {
    it("fetches projects successfully with the projects tag", async () => {
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
        tags: [CONTENT_TAGS.projects],
      });
    });
  });

  describe("getCv", () => {
    it("fetches the CV with the cv tag", async () => {
      // Arrange
      const mockCv = { keyQualifications: ["TypeScript"] };
      (sanityFetch as jest.Mock).mockResolvedValueOnce(mockCv);

      // Act
      const result = await getCv();

      // Assert
      expect(result).toStrictEqual(mockCv);
      expect(sanityFetch).toHaveBeenCalledWith({
        query: expect.any(String),
        revalidate: 86400,
        tags: [CONTENT_TAGS.cv],
      });
    });
  });

  describe("error mapping (applies to every content type)", () => {
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

    it("handles generic fetch errors with the entity name", async () => {
      // Arrange
      const error = {
        message: "Fetch failed",
      };
      (sanityFetch as jest.Mock).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow("Failed to fetch projects");
    });

    it("maps errors on non-project content too", async () => {
      // Arrange
      const error = {
        statusCode: 429,
        message: "Too Many Requests",
        details: { type: "rate_limit", description: "Rate limit exceeded" },
      };
      (sanityFetch as jest.Mock).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(getNavigation()).rejects.toThrow("Rate limit exceeded");
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
      (sanityFetch as jest.Mock).mockRejectedValueOnce(rateError);
      (sanityFetch as jest.Mock).mockResolvedValueOnce(mockProjects);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow("Rate limit exceeded");
      const result = await getProjects();
      expect(result).toStrictEqual(mockProjects);
    });
  });
});
