/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { POST } from "@/app/api/revalidate/route";

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));

const mockRevalidateTag = revalidateTag as jest.Mock;

const SECRET = "revalidate-test-secret";

const makeRequest = (params: Record<string, string>) => {
  const query = new URLSearchParams(params).toString();
  return new NextRequest(`http://localhost:3000/api/revalidate?${query}`, {
    method: "POST",
  });
};

describe("POST /api/revalidate", () => {
  const originalSecret = process.env.REVALIDATE_SECRET;

  beforeEach(() => {
    process.env.REVALIDATE_SECRET = SECRET;
    mockRevalidateTag.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalSecret === undefined) {
      delete process.env.REVALIDATE_SECRET;
    } else {
      process.env.REVALIDATE_SECRET = originalSecret;
    }
  });

  it("returns 401 when the secret is missing", async () => {
    // Arrange
    const request = makeRequest({ tag: "projects" });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(401);
    expect(await response.json()).toStrictEqual({
      message: "Invalid secret token",
    });
    expect(mockRevalidateTag).toHaveBeenCalledTimes(0);
  });

  it("returns 401 when the secret has the wrong length", async () => {
    // Arrange
    const request = makeRequest({ secret: "short", tag: "projects" });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(401);
  });

  it("returns 401 when the secret has the right length but the wrong value", async () => {
    // Arrange
    const wrong = "x".repeat(SECRET.length);
    const request = makeRequest({ secret: wrong, tag: "projects" });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(401);
    expect(mockRevalidateTag).toHaveBeenCalledTimes(0);
  });

  it("returns 401 when REVALIDATE_SECRET is not configured", async () => {
    // Arrange
    delete process.env.REVALIDATE_SECRET;
    const request = makeRequest({ secret: SECRET, tag: "projects" });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(401);
  });

  it("returns 400 when the tag is missing", async () => {
    // Arrange
    const request = makeRequest({ secret: SECRET });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(400);
    expect(await response.json()).toStrictEqual({
      message: "Missing tag parameter",
    });
    expect(mockRevalidateTag).toHaveBeenCalledTimes(0);
  });

  it("uses stale-while-revalidate by default", async () => {
    // Arrange
    const request = makeRequest({ secret: SECRET, tag: "projects" });

    // Act
    const response = await POST(request);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(mockRevalidateTag).toHaveBeenCalledWith("projects", "max");
    expect(body.revalidated).toBe(true);
    expect(body.tag).toBe("projects");
    expect(body.mode).toBe("stale-while-revalidate");
    expect(typeof body.now).toBe("number");
  });

  it("expires immediately when immediate=true", async () => {
    // Arrange
    const request = makeRequest({
      secret: SECRET,
      tag: "projects",
      immediate: "true",
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(200);
    expect(mockRevalidateTag).toHaveBeenCalledWith("projects", { expire: 0 });
    expect((await response.json()).mode).toBe("immediate");
  });

  it("returns 500 when revalidateTag throws", async () => {
    // Arrange
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockRevalidateTag.mockImplementation(() => {
      throw new Error("cache down");
    });
    const request = makeRequest({ secret: SECRET, tag: "projects" });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(500);
    expect(await response.json()).toStrictEqual({
      message: "Error revalidating cache",
      error: "Error: cache down",
    });
  });
});
