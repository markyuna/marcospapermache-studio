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

export async function GET() {
  const token = process.env.CLARITY_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Missing CLARITY_API_TOKEN environment variable." },
      { status: 500 }
    );
  }

  try {
    const [trafficResponse, deviceResponse, urlResponse] = await Promise.all([
      fetch(`${CLARITY_API_URL}?numOfDays=1`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 * 60 },
      }),
      fetch(`${CLARITY_API_URL}?numOfDays=1&dimension1=Device`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 * 60 },
      }),
      fetch(`${CLARITY_API_URL}?numOfDays=1&dimension1=URL`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 * 60 },
      }),
    ]);

    if (!trafficResponse.ok || !deviceResponse.ok || !urlResponse.ok) {
      return NextResponse.json(
        {
          error: "Unable to fetch Clarity analytics.",
          status: {
            traffic: trafficResponse.status,
            device: deviceResponse.status,
            url: urlResponse.status,
          },
        },
        { status: 502 }
      );
    }

    const [trafficData, deviceData, urlData] = (await Promise.all([
      trafficResponse.json(),
      deviceResponse.json(),
      urlResponse.json(),
    ])) as [ClarityMetric[], ClarityMetric[], ClarityMetric[]];

    const trafficRows = getMetric(trafficData, "Traffic");
    const deviceRows = getMetric(deviceData, "Traffic");
    const urlRows = getMetric(urlData, "Traffic");

    const sessions = sumNumber(trafficRows, "totalSessionCount");
    const botSessions = sumNumber(trafficRows, "totalBotSessionCount");
    const users = sumNumber(trafficRows, "distantUserCount");

    const mobileRows = deviceRows.filter((row) =>
      String(row.Device ?? "").toLowerCase().includes("mobile")
    );

    const mobileSessions = sumNumber(mobileRows, "totalSessionCount");

    const topPages = urlRows
      .map((row) => ({
        url: String(row.URL ?? "Unknown"),
        sessions: Number(row.totalSessionCount ?? 0),
        users: Number(row.distantUserCount ?? 0),
      }))
      .filter((page) => page.sessions > 0)
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 6);

    return NextResponse.json({
      period: "last_24_hours",
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
        url: urlData,
      },
    });
  } catch (error) {
    console.error("[CLARITY_ANALYTICS_ERROR]", error);

    return NextResponse.json(
      { error: "Unexpected Clarity analytics error." },
      { status: 500 }
    );
  }
}