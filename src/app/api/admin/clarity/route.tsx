// src/app/api/admin/clarity/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CLARITY_API_URL =
  "https://www.clarity.ms/export-data/api/v1/project-live-insights";

type ClarityMetric = {
  metricName?: string;
  information?: Record<string, unknown>[];
};

function getMetric(data: ClarityMetric[], metricName: string) {
  return data.find((item) => item.metricName === metricName)?.information ?? [];
}

function sumNumber(rows: Record<string, unknown>[], key: string) {
  return rows.reduce((total, row) => {
    const value = Number(row[key] ?? 0);
    return Number.isFinite(value) ? total + value : total;
  }, 0);
}

async function fetchClarity(token: string, params: URLSearchParams) {
  const response = await fetch(`${CLARITY_API_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Clarity API error ${response.status}: ${text || "empty response"}`);
  }

  return JSON.parse(text) as ClarityMetric[];
}

export async function GET() {
  const token = process.env.CLARITY_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Missing CLARITY_API_TOKEN environment variable." },
      { status: 500 }
    );
  }

  try {
    const [trafficData, deviceData, pagesData] = await Promise.all([
      fetchClarity(token, new URLSearchParams({ numOfDays: "3" })),
      fetchClarity(
        token,
        new URLSearchParams({ numOfDays: "3", dimension1: "Device" })
      ),
      fetchClarity(
        token,
        new URLSearchParams({ numOfDays: "3", dimension1: "PopularPages" })
      ),
    ]);

    const trafficRows = getMetric(trafficData, "Traffic");
    const deviceRows = getMetric(deviceData, "Traffic");
    const pageRows = getMetric(pagesData, "PopularPages");

    const sessions = sumNumber(trafficRows, "totalSessionCount");
    const botSessions = sumNumber(trafficRows, "totalBotSessionCount");
    const users = sumNumber(trafficRows, "distantUserCount");

    const mobileRows = deviceRows.filter((row) =>
      String(row.Device ?? row.device ?? "").toLowerCase().includes("mobile")
    );

    const mobileSessions = sumNumber(mobileRows, "totalSessionCount");

    const topPages = pageRows
      .map((row) => ({
        url: String(row.url ?? row.URL ?? "Unknown"),
        sessions: Number(row.totalSessionCount ?? 0),
        users: Number(row.distantUserCount ?? 0),
      }))
      .filter((page) => page.sessions > 0)
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 6);

    return NextResponse.json({
      period: "last_3_days",
      stats: {
        sessions,
        botSessions,
        users,
        mobileSessions,
        mobilePercentage:
          sessions > 0 ? Math.round((mobileSessions / sessions) * 100) : 0,
      },
      topPages,
      raw: {
        traffic: trafficData,
        device: deviceData,
        pages: pagesData,
      },
    });
  } catch (error) {
    console.error("[CLARITY_ANALYTICS_ERROR]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected Clarity analytics error.",
      },
      { status: 500 }
    );
  }
}