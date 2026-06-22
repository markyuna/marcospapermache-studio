export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { prisma } = await import("@/lib/prisma");
    try {
      await prisma.$queryRawUnsafe("SELECT 1");
      console.log("[db] connection pool warmed up");
    } catch (err) {
      console.warn("[db] warm-up failed:", err);
    }
  }
}
